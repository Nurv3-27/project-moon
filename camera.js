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

  let landmarker = null, stream = null, raf = 0, running = false;
  let mode = 'pushup', facing = 'user', lastVideoTime = -1;
  let S = null;

  const $ = (id) => document.getElementById(id);

  function resetState() {
    S = { reps: 0, phase: 'up', badForm: false, plankSec: 0, plankPaid: 0, lastT: 0, earned: 0, msg: '' };
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
  function analysePushup(lm, W, H) {
    const s = sideInfo(lm, W, H);
    if (s.vis < 0.5) return setMsg('Step back - show your whole body side-on', false);
    const b = bodyLine(s);
    if (!b.horizontal) { S.phase = 'up'; return setMsg('Get into push-up position', null); }
    const elbow = angle(s.sh, s.el, s.wr);
    if (elbow < 130 && b.body < 150) S.badForm = true;

    if (S.phase === 'up' && elbow < 95) {
      S.phase = 'down';
      setMsg('Now push up!', true);
    } else if (S.phase === 'down' && elbow > 150) {
      S.phase = 'up';
      if (S.badForm) {
        setMsg('Not counted - keep hips in line with shoulders', false);
      } else {
        S.reps++;
        setMsg('Rep ' + S.reps + ' verified!', true);
        award(CREDIT, 'Push-Up');
      }
      S.badForm = false;
    } else if (S.phase === 'up') {
      setMsg(b.body < 150 ? 'Straighten your body' : 'Lower until elbows hit 90\u00B0', b.body < 150 ? false : null);
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
  const CONNECTIONS = [[11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28]];
  function draw(lm, W, H) {
    const c = $('cam-canvas');
    if (!c) return;
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.clearRect(0, 0, W, H);
    if (!lm) return;
    g.lineWidth = 4; g.strokeStyle = 'rgba(120,255,180,.9)'; g.fillStyle = '#fff';
    CONNECTIONS.forEach(([a, b]) => {
      if ((lm[a].visibility || 0) < 0.4 || (lm[b].visibility || 0) < 0.4) return;
      g.beginPath(); g.moveTo(lm[a].x * W, lm[a].y * H); g.lineTo(lm[b].x * W, lm[b].y * H); g.stroke();
    });
    [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].forEach((i) => {
      if ((lm[i].visibility || 0) < 0.4) return;
      g.beginPath(); g.arc(lm[i].x * W, lm[i].y * H, 5, 0, 7); g.fill();
    });
  }

  // ---------- loop ----------
  function loop() {
    if (!running) return;
    const v = $('cam-video');
    if (v.readyState >= 2 && v.currentTime !== lastVideoTime && landmarker) {
      lastVideoTime = v.currentTime;
      const W = v.videoWidth, H = v.videoHeight;
      let res = null;
      try { res = landmarker.detectForVideo(v, performance.now()); } catch (e) {}
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
    }
    raf = requestAnimationFrame(loop);
  }

  async function loadModel() {
    if (landmarker) return;
    setMsg('Loading pose model (needs internet the first time)...', null);
    const mod = await import(CDN + '/vision_bundle.mjs');
    const fileset = await mod.FilesetResolver.forVisionTasks(CDN + '/wasm');
    const make = (delegate) => mod.PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL, delegate },
      runningMode: 'VIDEO', numPoses: 1
    });
    try { landmarker = await make('GPU'); } catch (e) { landmarker = await make('CPU'); }
  }

  async function startCamera() {
    if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMsg('Camera needs HTTPS. Open the https:// address shown in the server window (or use localhost on the PC).', false);
      return;
    }
    stopCamera();
    $('cam-start').disabled = true;
    try {
      setMsg('Requesting camera access...', null);
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false
      });
      const v = $('cam-video');
      v.srcObject = stream;
      v.classList.toggle('mirror', facing === 'user');
      $('cam-canvas').classList.toggle('mirror', facing === 'user');
      await v.play();
      await loadModel();
      resetState();
      running = true;
      lastVideoTime = -1;
      $('cam-start').textContent = 'Stop';
      setMsg(EXERCISES[mode].tip, null);
      loop();
    } catch (e) {
      const denied = e && (e.name === 'NotAllowedError' || e.name === 'SecurityError');
      setMsg(denied ? 'Camera permission denied. Allow it in your browser/Settings and try again.'
                    : 'Could not start: ' + (e && e.message ? e.message : e), false);
      stopCamera();
    }
    $('cam-start').disabled = false;
  }

  function stopCamera() {
    running = false;
    cancelAnimationFrame(raf);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    const v = $('cam-video');
    if (v) v.srcObject = null;
    const b = $('cam-start');
    if (b) b.textContent = 'Start Camera';
    draw(null, 1, 1);
  }

  window.openCameraCoach = function () {
    resetState();
    setMsg(EXERCISES[mode].tip, null);
    openModal('modal-camera');
  };
  window.closeCameraCoach = function () {
    stopCamera();
    closeModal('modal-camera');
    if (S && S.earned > 0) showToast('\uD83D\uDCF1 Total banked this session: +' + fmtClock(S.earned));
  };

  document.addEventListener('DOMContentLoaded', () => {
    $('btn-camera-coach').addEventListener('click', openCameraCoach);
    $('cam-start').addEventListener('click', () => (running ? stopCamera() : startCamera()));
    $('cam-flip').addEventListener('click', () => {
      facing = facing === 'user' ? 'environment' : 'user';
      if (running) startCamera();
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
    req.checked = AppState.settings.requireCamera !== false;
    req.addEventListener('change', () => {
      AppState.settings.requireCamera = req.checked;
      saveState();
      if (AppState.activeWorkout) renderActiveWorkout();
    });
  });
})();
