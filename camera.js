/**
 * Moon Camera Coach - on-device pose tracking (MediaPipe Pose Landmarker).
 * Counts verified push-ups, pull-ups and plank holds and credits doomscroll time.
 * Video never leaves the device.
 */
(function () {
  const CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
  const MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
  const CREDIT = 120; // seconds of scroll per rep / plank minute

  const EXERCISES = {
    pushup: { label: 'Push-Up', tip: 'Place the phone on the floor, side-on, so your whole body is in view.' },
    pullup: { label: 'Pull-Up', tip: 'Face the camera from about 2 m away, hands and head in view.' },
    plank:  { label: 'Plank', tip: 'Place the phone side-on, full body in view. Hold with a straight line.' }
  };

  let landmarker = null;
  let modelLoadingPromise = null;
  let stream = null;
  let raf = 0;
  let running = false;
  let mode = 'pushup';
  let facing = 'user';
  let lastVideoTime = -1;
  let S = null;

  const $ = (id) => document.getElementById(id);

  function resetState() {
    S = { reps: 0, phase: 'up', badForm: false, plankSec: 0, plankPaid: 0, lastT: 0, earned: 0, msg: '' };
    pushupSmoothedElbow = null;
    badFormFrames = 0;
    totalDownFrames = 0;
    updateHud();
  }

  function setMsg(m, ok) {
    const el = $('cam-feedback');
    if (!el) return;
    el.textContent = m;
    el.className = 'cam-feedback ' + (ok === true ? 'good' : ok === false ? 'bad' : '');
  }

  function updateHud() {
    if (!S) return;
    const big = $('cam-count');
    if (big) big.textContent = mode === 'plank' ? Math.floor(S.plankSec) + 's' : S.reps;
    const earned = $('cam-earned');
    if (earned) earned.textContent = '+' + fmtClock(S.earned) + ' earned';
  }

  // ---------- geometry ----------
  function angle(a, b, c) {
    const v1 = { x: a.x - b.x, y: a.y - b.y }, v2 = { x: c.x - b.x, y: c.y - b.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const m = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
    if (!m) return 0;
    return Math.acos(Math.max(-1, Math.min(1, dot / m))) * 180 / Math.PI;
  }

  function sideInfo(lm, W, H) {
    const L = [11, 13, 15, 23, 27], R = [12, 14, 16, 24, 28];
    const vis = (arr) => arr.reduce((s, i) => s + (lm[i].visibility || 0), 0) / arr.length;
    const idx = vis(L) >= vis(R) ? L : R;
    const P = (i) => ({ x: lm[i].x * W, y: lm[i].y * H });
    return {
      vis: vis(idx === L ? L : R),
      sh: P(idx[0]), el: P(idx[1]), wr: P(idx[2]), hip: P(idx[3]), ank: P(idx[4])
    };
  }

  function bodyLine(s) {
    const body = angle(s.sh, s.hip, s.ank);
    const horizontal = Math.abs(s.sh.y - s.ank.y) < Math.abs(s.sh.x - s.ank.x) * 0.6;
    const len = Math.hypot(s.ank.x - s.sh.x, s.ank.y - s.sh.y) || 1;
    const t = (s.hip.x - s.sh.x) / ((s.ank.x - s.sh.x) || 1);
    const lineY = s.sh.y + t * (s.ank.y - s.sh.y);
    const dev = (s.hip.y - lineY) / len; // + = sagging, - = piking
    return { body, horizontal, dev };
  }

  function award(seconds, why) {
    S.earned += seconds;
    addScrollCredit(seconds, why);
    if (typeof awardRankXP === 'function') awardRankXP(mode === 'pushup' ? 'Push-Ups' : mode === 'pullup' ? 'Pull-Ups' : 'Plank', mode === 'plank' ? 60 : 1);
    playSetCompletePing();
    triggerHaptic([40, 30, 70]);
    updateHud();
  }

  // ---------- exercise analysers ----------
  let pushupSmoothedElbow = null;
  let lastPushupTime = 0;
  let badFormFrames = 0;
  let totalDownFrames = 0;

  function analysePushup(lm, W, H) {
    const P = (i) => ({ x: lm[i].x * W, y: lm[i].y * H, v: lm[i].visibility || 0 });
    
    // Left & Right Arms
    const lsh = P(11), lel = P(13), lwr = P(15);
    const rsh = P(12), rel = P(14), rwr = P(16);
    const lhip = P(23), rhip = P(24);
    const lank = P(27), rank = P(28);

    const lvis = (lsh.v + lel.v + lwr.v) / 3;
    const rvis = (rsh.v + rel.v + rwr.v) / 3;

    if (Math.max(lvis, rvis) < 0.25) {
      return setMsg('Step back - show your arms & torso in view', false);
    }

    const elbowL = lvis > 0.25 ? angle(lsh, lel, lwr) : 180;
    const elbowR = rvis > 0.25 ? angle(rsh, rel, rwr) : 180;
    
    // Use the arm that is bending (closer / flexing more towards camera)
    let rawElbow = 180;
    if (lvis > 0.25 && rvis > 0.25) {
      rawElbow = Math.min(elbowL, elbowR);
    } else if (lvis > 0.25) {
      rawElbow = elbowL;
    } else {
      rawElbow = elbowR;
    }

    // Smooth elbow angle with Exponential Moving Average to prevent frame jitter
    if (pushupSmoothedElbow === null) pushupSmoothedElbow = rawElbow;
    else pushupSmoothedElbow = pushupSmoothedElbow * 0.35 + rawElbow * 0.65;
    const elbow = pushupSmoothedElbow;

    // Body alignment check
    const sh = lvis >= rvis ? lsh : rsh;
    const hip = lvis >= rvis ? lhip : rhip;
    const ank = (lank.v > 0.2 || rank.v > 0.2) ? (lank.v >= rank.v ? lank : rank) : null;
    
    let bodyStraight = true;
    if (ank && hip.v > 0.25 && sh.v > 0.25) {
      const bodyAngle = angle(sh, hip, ank);
      if (bodyAngle < 120) bodyStraight = false;
    }

    const now = performance.now();

    // High-accuracy push-up thresholds:
    // DOWN: 112 deg (captures proper depth even with perspective foreshortening)
    // UP:   138 deg (captures full extension cleanly without requiring locked elbows)
    const DOWN_ANGLE = 112;
    const UP_ANGLE = 138;

    if (S.phase === 'up') {
      if (elbow < DOWN_ANGLE) {
        S.phase = 'down';
        badFormFrames = 0;
        totalDownFrames = 0;
        setMsg('Good depth! Push up!', true);
        triggerHaptic([30]);
      } else {
        const depthPct = Math.min(100, Math.max(0, Math.round(((160 - elbow) / (160 - DOWN_ANGLE)) * 100)));
        if (depthPct > 25) {
          setMsg(`Lowering... ${depthPct}%`, null);
        } else {
          setMsg('Lower chest towards floor to count rep', null);
        }
      }
    } else if (S.phase === 'down') {
      totalDownFrames++;
      if (!bodyStraight) badFormFrames++;

      if (elbow > UP_ANGLE) {
        if (now - lastPushupTime > 350) {
          lastPushupTime = now;
          S.phase = 'up';

          const severeSag = totalDownFrames > 5 && (badFormFrames / totalDownFrames > 0.75);
          if (severeSag) {
            setMsg('Keep hips raised in line with body', false);
          } else {
            S.reps++;
            setMsg(`\u2705 Push-up ${S.reps} verified! +2m scroll time`, true);
            award(CREDIT, 'Push-Up');
          }
        } else {
          S.phase = 'up';
        }
      } else {
        setMsg('Push all the way up!', true);
      }
    }
  }

  function analysePullup(lm, W, H) {
    const P = (i) => ({ x: lm[i].x * W, y: lm[i].y * H, v: lm[i].visibility || 0 });
    const nose = P(0), lsh = P(11), rsh = P(12), lel = P(13), rel = P(14), lwr = P(15), rwr = P(16);
    if (Math.min(lwr.v, rwr.v, lsh.v, rsh.v) < 0.4) return setMsg('Show your hands, shoulders and head to the camera', false);
    const barY = (lwr.y + rwr.y) / 2;
    const shY = (lsh.y + rsh.y) / 2;
    const elbow = (angle(lsh, lel, lwr) + angle(rsh, rel, rwr)) / 2;
    const handsUp = barY < shY;
    if (!handsUp) { S.phase = 'up'; return setMsg('Grab the bar - hands above shoulders', null); }

    if (S.phase === 'up' && elbow > 150) { S.phase = 'hang'; }
    if (S.phase === 'hang') {
      if (nose.y < barY && elbow < 100) {
        S.phase = 'top';
        setMsg('Great - lower down fully', true);
      } else {
        setMsg(elbow > 150 ? 'Pull! Chin above the bar' : 'Higher - chin over the bar', null);
      }
    } else if (S.phase === 'top') {
      if (elbow > 150) {
        S.phase = 'hang';
        S.reps++;
        setMsg('Rep ' + S.reps + ' verified!', true);
        award(CREDIT, 'Pull-Up');
      } else if (nose.y > barY + 0.1 * Math.abs(shY - barY)) {
        S.phase = 'hang';
        setMsg('Not counted - extend arms fully on the way down', false);
      }
    } else {
      setMsg('Hang with arms straight to begin', null);
    }
  }

  function analysePlank(lm, W, H, now) {
    const dt = S.lastT ? Math.min(0.5, (now - S.lastT) / 1000) : 0;
    S.lastT = now;
    const s = sideInfo(lm, W, H);
    if (s.vis < 0.5) return setMsg('Step back - show your whole body side-on', false);
    const b = bodyLine(s);
    if (!b.horizontal) return setMsg('Get into plank position', null);
    if (b.body < 160 || Math.abs(b.dev) > 0.08) {
      return setMsg(b.dev > 0 ? 'Hips sagging - lift them' : 'Hips too high - lower them', false);
    }
    S.plankSec += dt;
    setMsg('Perfect form - hold it!', true);
    const minutes = Math.floor(S.plankSec / 60);
    while (S.plankPaid < minutes) {
      S.plankPaid++;
      award(CREDIT, 'Plank minute');
    }
    updateHud();
  }

  // ---------- drawing ----------
  const CONNECTIONS = [
    [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
    [11, 23], [12, 24], [23, 24], [23, 25], [25, 27],
    [24, 26], [26, 28]
  ];

  function draw(lm, W, H) {
    const c = $('cam-canvas');
    if (!c) return;
    if (c.width !== W || c.height !== H) {
      c.width = W;
      c.height = H;
    }
    const g = c.getContext('2d');
    g.clearRect(0, 0, W, H);
    if (!lm) return;
    g.lineWidth = 4;
    g.strokeStyle = 'rgba(120,255,180,.9)';
    g.fillStyle = '#fff';
    CONNECTIONS.forEach(([a, b]) => {
      if ((lm[a].visibility || 0) < 0.4 || (lm[b].visibility || 0) < 0.4) return;
      g.beginPath();
      g.moveTo(lm[a].x * W, lm[a].y * H);
      g.lineTo(lm[b].x * W, lm[b].y * H);
      g.stroke();
    });
    [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].forEach((i) => {
      if ((lm[i].visibility || 0) < 0.4) return;
      g.beginPath();
      g.arc(lm[i].x * W, lm[i].y * H, 5, 0, 7);
      g.fill();
    });
  }

  // ---------- loop ----------
  function loop() {
    if (!running) return;
    const v = $('cam-video');
    if (v && v.readyState >= 2 && v.currentTime !== lastVideoTime && v.videoWidth > 0) {
      lastVideoTime = v.currentTime;
      const W = v.videoWidth, H = v.videoHeight;
      if (landmarker) {
        let res = null;
        try {
          res = landmarker.detectForVideo(v, performance.now());
        } catch (e) {
          console.warn("Detection frame error:", e);
        }
        const lm = res && res.landmarks && res.landmarks[0];
        draw(lm, W, H);
        if (lm) {
          if (mode === 'pushup') analysePushup(lm, W, H);
          else if (mode === 'pullup') analysePullup(lm, W, H);
          else analysePlank(lm, W, H, performance.now());
          updateHud();
        } else {
          S.lastT = 0;
          setMsg('No person detected - step into view', false);
        }
      } else {
        draw(null, W, H);
      }
    }
    raf = requestAnimationFrame(loop);
  }

  async function loadModel() {
    if (landmarker) return landmarker;
    if (modelLoadingPromise) return modelLoadingPromise;

    modelLoadingPromise = (async () => {
      console.log('Loading MediaPipe vision bundle...');
      const mod = await import(CDN + '/vision_bundle.mjs');
      const fileset = await mod.FilesetResolver.forVisionTasks(CDN + '/wasm');
      const make = (delegate) => mod.PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL, delegate },
        runningMode: 'VIDEO',
        numPoses: 1
      });
      try {
        console.log('Attempting GPU delegate...');
        landmarker = await make('GPU');
        console.log('PoseLandmarker initialized with GPU');
      } catch (gpuErr) {
        console.warn('GPU delegate failed, falling back to CPU:', gpuErr);
        landmarker = await make('CPU');
        console.log('PoseLandmarker initialized with CPU');
      }
      return landmarker;
    })();

    try {
      return await modelLoadingPromise;
    } catch (err) {
      modelLoadingPromise = null;
      throw err;
    }
  }

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMsg('Camera access requires HTTPS or localhost. If on iPhone, open the https:// address shown in server.', false);
      return;
    }

    stopCamera();
    const btn = $('cam-start');
    if (btn) btn.disabled = true;

    try {
      setMsg('Starting camera...', null);

      let videoConstraints = {
        facingMode: facing ? { ideal: facing } : 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      };

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false
        });
      } catch (err1) {
        console.warn('Specific facingMode constraint failed, retrying generic video constraint:', err1);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      const v = $('cam-video');
      if (!v) throw new Error('Video element not found');

      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');
      v.setAttribute('autoplay', '');
      v.srcObject = stream;

      v.classList.toggle('mirror', facing === 'user');
      const c = $('cam-canvas');
      if (c) c.classList.toggle('mirror', facing === 'user');

      // Play video with metadata wait fallback
      try {
        await v.play();
      } catch (playErr) {
        console.warn('Direct v.play() pending loadedmetadata:', playErr);
        await new Promise((resolve) => {
          v.onloadedmetadata = () => {
            v.play().catch(e => console.warn('play() error:', e)).finally(resolve);
          };
          setTimeout(resolve, 800);
        });
      }

      // Live stream is now running!
      running = true;
      lastVideoTime = -1;
      resetState();
      if (btn) {
        btn.textContent = 'Stop Camera';
        btn.disabled = false;
      }

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);

      // Now ensure AI model is loaded without blocking the video feed
      if (!landmarker) {
        setMsg('Camera live! Loading AI pose detector...', null);
        loadModel().then(() => {
          if (running) setMsg(EXERCISES[mode].tip, true);
        }).catch((modelErr) => {
          console.error('AI Model failed to load:', modelErr);
          if (running) {
            setMsg('Camera live, but AI pose model failed to load. Check internet connection.', false);
          }
        });
      } else {
        setMsg(EXERCISES[mode].tip, true);
      }

    } catch (e) {
      console.error('Camera start error:', e);
      const isDenied = e && (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError' || e.name === 'SecurityError');
      const isNotFound = e && (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError');

      let msg = 'Could not start camera: ' + (e && e.message ? e.message : e);
      if (isDenied) {
        msg = 'Camera permission denied. Allow camera in your browser address bar / settings.';
      } else if (isNotFound) {
        msg = 'No camera device found on this system.';
      }
      setMsg(msg, false);
      stopCamera();
    }
  }

  function stopCamera() {
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
    if (stream) {
      stream.getTracks().forEach((t) => {
        try { t.stop(); } catch (e) {}
      });
    }
    stream = null;
    const v = $('cam-video');
    if (v) {
      try { v.pause(); } catch (e) {}
      v.srcObject = null;
    }
    const b = $('cam-start');
    if (b) {
      b.textContent = 'Start Camera';
      b.disabled = false;
    }
    draw(null, 1, 1);
  }

  window.openCameraCoach = function () {
    resetState();
    setMsg(EXERCISES[mode].tip, null);
    openModal('modal-camera');
    // Preload model in background
    loadModel().catch(e => console.log('Preload pose model status:', e.message || e));
  };

  window.closeCameraCoach = function () {
    stopCamera();
    closeModal('modal-camera');
    if (S && S.earned > 0) showToast('\uD83D\uDCF1 Total banked this session: +' + fmtClock(S.earned));
  };

  document.addEventListener('DOMContentLoaded', () => {
    const coachBtn = $('btn-camera-coach');
    if (coachBtn) coachBtn.addEventListener('click', openCameraCoach);

    const startBtn = $('cam-start');
    if (startBtn) startBtn.addEventListener('click', () => (running ? stopCamera() : startCamera()));

    const flipBtn = $('cam-flip');
    if (flipBtn) flipBtn.addEventListener('click', async () => {
      facing = facing === 'user' ? 'environment' : 'user';
      if (running) await startCamera();
    });

    document.querySelectorAll('#cam-mode-chips .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#cam-mode-chips .chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        mode = chip.dataset.mode;
        resetState();
        setMsg(EXERCISES[mode].tip, null);
      });
    });

    const req = $('setting-require-camera');
    if (req) {
      req.checked = AppState.settings.requireCamera !== false;
      req.addEventListener('change', () => {
        AppState.settings.requireCamera = req.checked;
        saveState();
        if (AppState.activeWorkout) renderActiveWorkout();
      });
    }
  });
})();
