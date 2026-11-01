/**
 * Moon Camera Coach - High-Accuracy Multi-Angle Pose Tracking (MediaPipe Pose Landmarker).
 * Counts verified Push-Ups, Pull-Ups, and Plank holds from side, angled, or front views
 * using EMA landmark smoothing, multi-joint fusion, and live HUD telemetry.
 * Video never leaves the device.
 */
(function () {
  const CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
  const MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
  const CREDIT = 120; // seconds of scroll per rep / plank minute
  const PLANK_CHUNK_SEC = 15; // award +30s every 15s of plank (still 120s per minute!)
  const PLANK_CHUNK_CREDIT = 30;

  const EXERCISES = {
    pushup: {
      label: 'Push-Up',
      tip: 'Works from side, 45° angle, or front! Keep shoulders & arms in view.'
    },
    pullup: {
      label: 'Pull-Up',
      tip: 'Face the camera (1.5–2.5m away) with hands and head in view. Pull chin to bar level.'
    },
    plank: {
      label: 'Plank',
      tip: 'Side or angled view. Hold a straight torso line — earns +0:30 every 15s!'
    }
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
  let smoothedLm = null;

  const $ = (id) => document.getElementById(id);

  function resetState() {
    S = {
      reps: 0,
      phase: 'up',
      badForm: false,
      plankSec: 0,
      plankChunksPaid: 0,
      plankGrace: 0,
      lastT: 0,
      earned: 0,
      msg: '',
      progressPct: 0,
      hudMetric: '',
      topShY: null,
      bottomReachedAt: 0
    };
    smoothedLm = null;
    pushupSmoothedElbow = null;
    pushupSmoothedDrop = 0;
    pullupSmoothedElbow = null;
    plankSmoothedAngle = null;
    plankSmoothedDev = 0;
    badFormFrames = 0;
    totalDownFrames = 0;
    pushupReadyFrames = 0;
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

  // Smooth raw MediaPipe landmarks across frames (reduces jitter dramatically)
  function smoothLandmarks(raw) {
    if (!raw) {
      smoothedLm = null;
      return null;
    }
    const alpha = 0.62; // responsive yet jitter-free
    if (!smoothedLm || smoothedLm.length !== raw.length) {
      smoothedLm = raw.map((p) => ({ x: p.x, y: p.y, z: p.z || 0, visibility: p.visibility || 0 }));
      return smoothedLm;
    }
    for (let i = 0; i < raw.length; i++) {
      smoothedLm[i].x = smoothedLm[i].x * (1 - alpha) + raw[i].x * alpha;
      smoothedLm[i].y = smoothedLm[i].y * (1 - alpha) + raw[i].y * alpha;
      smoothedLm[i].z = (smoothedLm[i].z || 0) * (1 - alpha) + (raw[i].z || 0) * alpha;
      smoothedLm[i].visibility = smoothedLm[i].visibility * 0.4 + (raw[i].visibility || 0) * 0.6;
    }
    return smoothedLm;
  }

  // ---------- geometry ----------
  function angle(a, b, c) {
    const v1 = { x: a.x - b.x, y: a.y - b.y };
    const v2 = { x: c.x - b.x, y: c.y - b.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const m = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
    if (!m) return 180;
    return Math.acos(Math.max(-1, Math.min(1, dot / m))) * 180 / Math.PI;
  }

  function award(seconds, why, xpUnits) {
    S.earned += seconds;
    addScrollCredit(seconds, why);
    if (typeof awardRankXP === 'function') {
      awardRankXP(
        mode === 'pushup' ? 'Push-Ups' : mode === 'pullup' ? 'Pull-Ups' : 'Plank',
        xpUnits !== undefined ? xpUnits : (mode === 'plank' ? PLANK_CHUNK_SEC : 1)
      );
    }
    playSetCompletePing();
    triggerHaptic([40, 30, 70]);
    updateHud();
  }

  // ==================== 1. STRICT FULL-BODY PUSH-UP ANALYSER (REQUIRES CHEST, ARMS & LEGS) ====================
  let pushupSmoothedElbow = null;
  let pushupSmoothedDrop = 0;
  let lastPushupTime = 0;
  let badFormFrames = 0;
  let totalDownFrames = 0;
  let pushupReadyFrames = 0;

  function inFrame(rawPt, minVis) {
    if (!rawPt) return false;
    const v = rawPt.visibility || 0;
    return v >= minVis && rawPt.x >= 0.03 && rawPt.x <= 0.97 && rawPt.y >= 0.03 && rawPt.y <= 0.97;
  }

  function analysePushup(lm, W, H) {
    const P = (i) => ({
      x: lm[i].x * W,
      y: lm[i].y * H,
      nx: lm[i].x,
      ny: lm[i].y,
      v: lm[i].visibility || 0,
      inBounds: inFrame(lm[i], 0.45)
    });

    const lsh = P(11), lel = P(13), lwr = P(15);
    const rsh = P(12), rel = P(14), rwr = P(16);
    const lhip = P(23), rhip = P(24);
    const lknee = P(25), rknee = P(26);
    const lank = P(27), rank = P(28);

    // 1. CHECK ARMS (Shoulder + Elbow + Wrist must be inside camera frame & wrists planted below shoulders)
    const leftArmVisible  = lsh.inBounds && lel.inBounds && inFrame(lm[15], 0.42);
    const rightArmVisible = rsh.inBounds && rel.inBounds && inFrame(lm[16], 0.42);
    const useLeftArm = leftArmVisible && (!rightArmVisible || (lsh.v + lel.v + lwr.v) >= (rsh.v + rel.v + rwr.v));
    const sh = useLeftArm ? lsh : (rightArmVisible ? rsh : (lsh.v >= rsh.v ? lsh : rsh));
    const el = useLeftArm ? lel : (rightArmVisible ? rel : (lel.v >= rel.v ? lel : rel));
    const wr = useLeftArm ? lwr : (rightArmVisible ? rwr : (lwr.v >= rwr.v ? lwr : rwr));

    // 2. CHECK CHEST / TORSO (Shoulders + Hips must be inside camera frame)
    const leftTorsoVisible  = lsh.inBounds && inFrame(lm[23], 0.42);
    const rightTorsoVisible = rsh.inBounds && inFrame(lm[24], 0.42);
    const hip = (leftTorsoVisible && (!rightTorsoVisible || lhip.v >= rhip.v)) ? lhip : rhip;
    const torsoLen = Math.hypot(sh.x - hip.x, sh.y - hip.y);
    const chestOk = (leftTorsoVisible || rightTorsoVisible) && torsoLen >= 35;

    // Hands/wrists must be planted on the floor below the chest/shoulders
    const wristsPlantedBelowChest = wr.y > sh.y + Math.max(18, torsoLen * 0.14);
    const armsOk = (leftArmVisible || rightArmVisible) && wristsPlantedBelowChest;

    // 3. CHECK LEGS (Knees and/or Ankles must be inside camera frame)
    const leftKneeOk  = inFrame(lm[25], 0.42);
    const rightKneeOk = inFrame(lm[26], 0.42);
    const leftAnkOk   = inFrame(lm[27], 0.40);
    const rightAnkOk  = inFrame(lm[28], 0.40);
    let legPt = null;
    if (leftAnkOk || rightAnkOk) {
      legPt = (leftAnkOk && (!rightAnkOk || lank.v >= rank.v)) ? lank : rank;
    } else if (leftKneeOk || rightKneeOk) {
      legPt = (leftKneeOk && (!rightKneeOk || lknee.v >= rknee.v)) ? lknee : rknee;
    }
    const legLen = legPt ? Math.hypot(legPt.x - hip.x, legPt.y - hip.y) : 0;
    const legsOk = Boolean(legPt) && legLen >= 30;

    // 4. CHECK HORIZONTAL PUSH-UP PLANK POSTURE (Reject standing upright or sitting in a chair!)
    let bodyAngle = 0;
    let slopeDeg = 90;
    let plankPostureOk = false;
    if (chestOk && legsOk && legPt) {
      bodyAngle = angle(sh, hip, legPt);
      const dx = Math.abs(legPt.x - sh.x);
      const dy = Math.abs(legPt.y - sh.y);
      slopeDeg = Math.atan2(dy, Math.max(1, dx)) * 180 / Math.PI;
      // Straight body line (>= 132°) and horizontal/floor plank orientation (slope <= 48°)
      plankPostureOk = bodyAngle >= 132 && slopeDeg <= 48;
    }

    const checklistStr = `Chest:${chestOk ? '\u2713' : '\u2717'} Arms:${armsOk ? '\u2713' : '\u2717'} Legs:${legsOk ? '\u2713' : '\u2717'}`;

    if (!chestOk || !armsOk || !legsOk || !plankPostureOk) {
      pushupReadyFrames = 0;
      S.phase = 'up';
      S.topShY = null;
      S.progressPct = 0;
      S.hudMetric = checklistStr;

      const missing = [];
      if (!chestOk) missing.push('Chest/Torso');
      if (!armsOk) missing.push('Arms on floor');
      if (!legsOk) missing.push('Legs');
      if (missing.length > 0) {
        return setMsg(`Step back so camera sees: ${missing.join(', ')} (${checklistStr})`, false);
      }
      return setMsg(`Get into horizontal push-up plank position on the floor (${checklistStr})`, false);
    }

    pushupReadyFrames++;
    if (pushupReadyFrames < 8) {
      S.progressPct = Math.round((pushupReadyFrames / 8) * 25);
      S.hudMetric = `${checklistStr} • Locking pose...`;
      return setMsg(`Full body detected (${checklistStr}) — hold plank to start counting!`, null);
    }

    // Compute elbow angle from visible arm(s)
    const elbowL = leftArmVisible ? angle(lsh, lel, lwr) : 180;
    const elbowR = rightArmVisible ? angle(rsh, rel, rwr) : 180;
    let rawElbow = 180;
    if (leftArmVisible && rightArmVisible) {
      rawElbow = Math.min(elbowL, elbowR) * 0.65 + Math.max(elbowL, elbowR) * 0.35;
    } else if (leftArmVisible) {
      rawElbow = elbowL;
    } else {
      rawElbow = elbowR;
    }

    if (pushupSmoothedElbow === null) pushupSmoothedElbow = rawElbow;
    else pushupSmoothedElbow = pushupSmoothedElbow * 0.35 + rawElbow * 0.65;
    const elbow = pushupSmoothedElbow;

    const shY = sh.y;
    const wrY = wr.y;
    const armSpan = Math.max(45, Math.abs(wrY - (S.topShY !== null ? S.topShY : shY)), torsoLen * 0.7);

    // Calibrate top plank shoulder height while arms are extended
    if (S.topShY === null || (S.phase === 'up' && shY < S.topShY)) {
      S.topShY = shY;
    } else if (S.phase === 'up' && elbow >= 150) {
      S.topShY = S.topShY * 0.9 + shY * 0.1;
    }

    const rawDropRatio = Math.max(0, (shY - S.topShY) / armSpan);
    pushupSmoothedDrop = pushupSmoothedDrop * 0.35 + rawDropRatio * 0.65;

    const DOWN_ANGLE = 98;  // Real push-up bottom bend
    const UP_ANGLE   = 148; // Full lockout at top

    const elbowDepthPct = Math.min(100, Math.max(0, Math.round(((160 - elbow) / (160 - DOWN_ANGLE)) * 100)));
    S.progressPct = elbowDepthPct;
    S.hudMetric = `${checklistStr} • Elbow ${Math.round(elbow)}°`;

    // Require BOTH real elbow flexion (<= 98°) AND physical chest drop toward floor (>= 0.18)
    const isAtBottom = (elbow <= DOWN_ANGLE) && (pushupSmoothedDrop >= 0.18 || (wr.y - sh.y) < armSpan * 0.62);
    const isAtTop    = (elbow >= UP_ANGLE) && (pushupSmoothedDrop <= 0.14);

    const now = performance.now();

    if (S.phase === 'up') {
      if (isAtBottom) {
        S.phase = 'down';
        S.bottomReachedAt = now;
        badFormFrames = 0;
        totalDownFrames = 1;
        setMsg('\uD83D\uDD25 Good depth! Now push all the way back up!', true);
        triggerHaptic([30]);
      } else if (elbow < 135) {
        setMsg(`Go lower — bend elbows to 90° (Current: ${Math.round(elbow)}°)`, null);
      } else {
        setMsg(`Ready (${checklistStr}) — lower your chest to the floor`, true);
      }
    } else if (S.phase === 'down') {
      totalDownFrames++;
      if (bodyAngle < 138) badFormFrames++;

      if (isAtTop) {
        if (totalDownFrames >= 3 && (now - lastPushupTime > 950)) {
          lastPushupTime = now;
          S.phase = 'up';
          S.topShY = shY;

          const severeSag = totalDownFrames > 6 && (badFormFrames / totalDownFrames > 0.75);
          if (severeSag) {
            setMsg('\u26A0\uFE0F Keep your hips & legs straight in line with your chest!', false);
          } else {
            S.reps++;
            setMsg(`\u2705 Push-Up #${S.reps} verified (Chest+Arms+Legs)! +2:00 scroll time`, true);
            award(CREDIT, 'Push-Up', 1);
          }
        } else {
          S.phase = 'up';
        }
      } else {
        setMsg('Drive up until your arms lock out!', true);
      }
    }
  }

  // ==================== 2. IMPROVED PULL-UP ANALYSER (FIXED REP CANCELLATION BUG!) ====================
  let pullupSmoothedElbow = null;
  let lastPullupTime = 0;

  function analysePullup(lm, W, H) {
    const P = (i) => ({ x: lm[i].x * W, y: lm[i].y * H, v: lm[i].visibility || 0 });
    const nose = P(0), lsh = P(11), rsh = P(12), lel = P(13), rel = P(14), lwr = P(15), rwr = P(16);

    // Allow tracking as long as at least one arm + shoulders are visible (doorframes often clip one wrist)
    const hasLeft  = lsh.v > 0.25 && lel.v > 0.22 && lwr.v > 0.2;
    const hasRight = rsh.v > 0.25 && rel.v > 0.22 && rwr.v > 0.2;
    if (!hasLeft && !hasRight) {
      S.progressPct = 0;
      S.hudMetric = 'Show upper body & hands';
      return setMsg('Step back so your hands, shoulders, and head are visible', false);
    }

    const barY = (hasLeft && hasRight) ? (lwr.y + rwr.y) * 0.5 : (hasLeft ? lwr.y : rwr.y);
    const shY  = (lsh.v > 0.25 && rsh.v > 0.25) ? (lsh.y + rsh.y) * 0.5 : (hasLeft ? lsh.y : rsh.y);
    const shWidth = (lsh.v > 0.25 && rsh.v > 0.25)
      ? Math.max(40, Math.hypot(lsh.x - rsh.x, lsh.y - rsh.y))
      : 80;

    const elbowL = hasLeft ? angle(lsh, lel, lwr) : null;
    const elbowR = hasRight ? angle(rsh, rel, rwr) : null;
    const rawElbow = (elbowL !== null && elbowR !== null)
      ? (elbowL + elbowR) * 0.5
      : (elbowL !== null ? elbowL : elbowR);

    if (pullupSmoothedElbow === null) pullupSmoothedElbow = rawElbow;
    else pullupSmoothedElbow = pullupSmoothedElbow * 0.35 + rawElbow * 0.65;
    const elbow = pullupSmoothedElbow;

    // Hands must be at or above shoulder level (or during peak pull-up when shoulders rise to hands)
    const handsAboveShoulders = barY <= shY + shWidth * 0.35;
    if (!handsAboveShoulders && S.phase !== 'top') {
      S.phase = 'up';
      S.progressPct = 0;
      S.hudMetric = 'Raise hands to bar';
      return setMsg('Reach up & grip the pull-up bar (hands above shoulders)', null);
    }

    // How close is chin/nose/shoulders to the bar?
    // Note: nose is above chin, so when chin clears bar, nose.y is well above barY (or even slightly below barY if hands are high)
    const headVis = nose.v > 0.2;
    const chinClear = (headVis && nose.y <= barY + shWidth * 0.25) || (shY <= barY + shWidth * 0.42);
    const atTopFlexion = elbow <= 114 && chinClear;
    const atDeadHang   = elbow >= 128 || (shY - barY) >= shWidth * 0.58;

    const pullPct = Math.min(100, Math.max(0, Math.round(((155 - elbow) / (155 - 105)) * 100)));
    S.progressPct = pullPct;
    S.hudMetric = `Elbow ${Math.round(elbow)}° • Pull ${pullPct}%`;

    const now = performance.now();

    // Enter hang state automatically once arms are extended
    if (S.phase === 'up' && atDeadHang) {
      S.phase = 'hang';
    }

    if (S.phase === 'hang') {
      if (atTopFlexion) {
        S.phase = 'top';
        triggerHaptic([35]);
        setMsg('\uD83D\uDD25 Chin at bar! Lower back down with control to lock rep!', true);
      } else {
        setMsg(pullPct > 25 ? `Pulling up... ${pullPct}% (Get chin to bar!)` : 'Dead hang ready — pull your chin up to the bar!', null);
      }
    } else if (S.phase === 'top') {
      // Count the rep as soon as the athlete lowers back down to hang extension!
      if (atDeadHang && (now - lastPullupTime > 450)) {
        lastPullupTime = now;
        S.phase = 'hang';
        S.reps++;
        setMsg(`\u2705 Pull-Up #${S.reps} verified! +2:00 scroll time`, true);
        award(CREDIT, 'Pull-Up', 1);
      } else {
        setMsg('Great height — extend arms down to complete rep!', true);
      }
    } else {
      setMsg('Hang from the bar with arms extended to start', null);
    }
  }

  // ==================== 3. IMPROVED PLANK ANALYSER (ANKLE/KNEE FALLBACK + 15s REWARDS) ====================
  let plankSmoothedAngle = null;
  let plankSmoothedDev = 0;

  function analysePlank(lm, W, H, now) {
    const dt = S.lastT ? Math.min(0.4, (now - S.lastT) / 1000) : 0;
    S.lastT = now;

    const P = (i) => ({ x: lm[i].x * W, y: lm[i].y * H, v: lm[i].visibility || 0 });
    const lScore = (lm[11].visibility || 0) + (lm[23].visibility || 0) + Math.max(lm[27].visibility || 0, lm[25].visibility || 0);
    const rScore = (lm[12].visibility || 0) + (lm[24].visibility || 0) + Math.max(lm[28].visibility || 0, lm[26].visibility || 0);
    const useLeft = lScore >= rScore;

    const sh   = P(useLeft ? 11 : 12);
    const el   = P(useLeft ? 13 : 14);
    const hip  = P(useLeft ? 23 : 24);
    const knee = P(useLeft ? 25 : 26);
    const ank  = P(useLeft ? 27 : 28);

    // Use ankle if visible, else fall back to knee so tight room setups still work!
    const legPt = ank.v >= 0.22 ? ank : (knee.v >= 0.22 ? knee : null);

    if (sh.v < 0.25 || hip.v < 0.22 || !legPt) {
      S.hudMetric = 'Show torso & legs';
      return setMsg('Position camera so your shoulders, hips & legs are visible', false);
    }

    const dx = Math.abs(legPt.x - sh.x);
    const dy = Math.abs(legPt.y - sh.y);
    const isHorizontal = dy < dx * 0.85; // forgiving for angled phone on floor

    const rawBodyAngle = angle(sh, hip, legPt);
    const len = Math.hypot(legPt.x - sh.x, legPt.y - sh.y) || 1;
    const t = (hip.x - sh.x) / ((legPt.x - sh.x) || 1);
    const lineY = sh.y + t * (legPt.y - sh.y);
    const rawDev = (hip.y - lineY) / len; // + = sagging, - = piking

    if (plankSmoothedAngle === null) plankSmoothedAngle = rawBodyAngle;
    else plankSmoothedAngle = plankSmoothedAngle * 0.35 + rawBodyAngle * 0.65;
    plankSmoothedDev = plankSmoothedDev * 0.35 + rawDev * 0.65;

    if (!isHorizontal) {
      S.hudMetric = 'Get horizontal';
      return setMsg('Get down into horizontal plank position (elbows or hands)', null);
    }

    const goodAlignment = plankSmoothedAngle >= 142 && Math.abs(plankSmoothedDev) <= 0.13;
    const nextChunkProgress = Math.round(((S.plankSec % PLANK_CHUNK_SEC) / PLANK_CHUNK_SEC) * 100);
    S.progressPct = nextChunkProgress;
    S.hudMetric = `Line ${Math.round(plankSmoothedAngle)}° • Hold ${Math.floor(S.plankSec)}s`;

    if (!goodAlignment) {
      S.plankGrace = (S.plankGrace || 0) + dt;
      if (S.plankGrace > 1.1) {
        return setMsg(plankSmoothedDev > 0 ? '\u26A0\uFE0F Hips sagging — lift core up!' : '\u26A0\uFE0F Hips too high — flatten your back!', false);
      }
    } else {
      S.plankGrace = 0;
    }

    S.plankSec += dt;
    const secLeftToChunk = Math.ceil(PLANK_CHUNK_SEC - (S.plankSec % PLANK_CHUNK_SEC));
    setMsg(`\uD83D\uDD25 Solid plank (${Math.round(plankSmoothedAngle)}°)! +0:30 in ${secLeftToChunk}s`, true);

    const chunks = Math.floor(S.plankSec / PLANK_CHUNK_SEC);
    while (S.plankChunksPaid < chunks) {
      S.plankChunksPaid++;
      award(PLANK_CHUNK_CREDIT, 'Plank 15s Hold', PLANK_CHUNK_SEC);
    }
    updateHud();
  }

  // ---------- drawing & live telemetry HUD ----------
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

    const isGood = S && (S.phase === 'down' || S.phase === 'top' || (mode === 'plank' && S.plankGrace === 0 && S.plankSec > 0));
    const strokeCol = isGood ? 'rgba(52, 235, 130, 0.95)' : 'rgba(92, 203, 250, 0.9)';

    g.lineWidth = 4.5;
    g.lineCap = 'round';
    g.strokeStyle = strokeCol;
    g.fillStyle = '#ffffff';

    CONNECTIONS.forEach(([a, b]) => {
      if ((lm[a].visibility || 0) < 0.22 || (lm[b].visibility || 0) < 0.22) return;
      g.beginPath();
      g.moveTo(lm[a].x * W, lm[a].y * H);
      g.lineTo(lm[b].x * W, lm[b].y * H);
      g.stroke();
    });

    [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].forEach((i) => {
      if ((lm[i].visibility || 0) < 0.22) return;
      g.beginPath();
      g.arc(lm[i].x * W, lm[i].y * H, 5.5, 0, Math.PI * 2);
      g.fill();
      g.lineWidth = 2;
      g.strokeStyle = '#111';
      g.stroke();
    });

    // Draw bottom progress bar & live metric pill (un-mirrored so text is readable)
    if (S && S.hudMetric) {
      g.save();
      if (c.classList.contains('mirror')) {
        g.translate(W, 0);
        g.scale(-1, 1);
      }
      const barW = Math.min(W - 28, 260);
      const barH = 8;
      const barX = W - barW - 14;
      const barY = H - 22;

      // Pill background
      g.fillStyle = 'rgba(10, 12, 16, 0.78)';
      g.beginPath();
      g.roundRect(barX - 8, barY - 26, barW + 16, 38, 10);
      g.fill();

      // Metric text
      g.fillStyle = '#f4f4f6';
      g.font = '700 12px Outfit, sans-serif';
      g.textAlign = 'right';
      g.fillText(S.hudMetric, barX + barW, barY - 8);

      // Progress track
      g.fillStyle = 'rgba(255, 255, 255, 0.16)';
      g.beginPath();
      g.roundRect(barX, barY, barW, barH, 4);
      g.fill();

      // Progress fill
      const fillW = Math.max(0, Math.min(barW, (barW * (S.progressPct || 0)) / 100));
      if (fillW > 0) {
        g.fillStyle = isGood ? '#34c759' : '#5ccbfa';
        g.beginPath();
        g.roundRect(barX, barY, fillW, barH, 4);
        g.fill();
      }
      g.restore();
    }
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
          console.warn('Detection frame error:', e);
        }
        const rawLm = res && res.landmarks && res.landmarks[0];
        const lm = smoothLandmarks(rawLm);
        if (lm) {
          if (mode === 'pushup') analysePushup(lm, W, H);
          else if (mode === 'pullup') analysePullup(lm, W, H);
          else analysePlank(lm, W, H, performance.now());
          draw(lm, W, H);
          updateHud();
        } else {
          draw(null, W, H);
          S.lastT = 0;
          setMsg('No person detected — step into camera view', false);
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
      const mod = await import(CDN + '/vision_bundle.mjs');
      const fileset = await mod.FilesetResolver.forVisionTasks(CDN + '/wasm');
      const make = (delegate) => mod.PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL, delegate },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.4,
        minPosePresenceConfidence: 0.4,
        minTrackingConfidence: 0.4
      });
      try {
        landmarker = await make('GPU');
      } catch (gpuErr) {
        landmarker = await make('CPU');
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
      setMsg('Camera access requires HTTPS or localhost. On iPhone, open the https:// address shown in server.', false);
      return;
    }

    stopCamera();
    const btn = $('cam-start');
    if (btn) btn.disabled = true;

    try {
      setMsg('Starting camera...', null);

      const videoConstraints = {
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

      try {
        await v.play();
      } catch (playErr) {
        await new Promise((resolve) => {
          v.onloadedmetadata = () => {
            v.play().catch(() => {}).finally(resolve);
          };
          setTimeout(resolve, 800);
        });
      }

      running = true;
      lastVideoTime = -1;
      resetState();
      if (btn) {
        btn.textContent = 'Stop Camera';
        btn.disabled = false;
      }

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);

      if (!landmarker) {
        setMsg('Camera live! Loading AI pose detector...', null);
        loadModel().then(() => {
          if (running) setMsg(EXERCISES[mode].tip, true);
        }).catch(() => {
          if (running) {
            setMsg('Camera live, but AI pose model failed to load. Check internet connection.', false);
          }
        });
      } else {
        setMsg(EXERCISES[mode].tip, true);
      }
    } catch (e) {
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

  window.openCameraCoach = function (initialMode) {
    if (initialMode && EXERCISES[initialMode]) {
      mode = initialMode;
      document.querySelectorAll('#cam-mode-chips .chip').forEach((c) => {
        c.classList.toggle('active', c.dataset.mode === mode);
      });
    }
    resetState();
    setMsg(EXERCISES[mode].tip, null);
    openModal('modal-camera');
    loadModel().catch(() => {});
  };

  window.closeCameraCoach = function () {
    stopCamera();
    closeModal('modal-camera');
    if (S && S.earned > 0) showToast('\uD83D\uDCF1 Total banked this session: +' + fmtClock(S.earned));
  };

  document.addEventListener('DOMContentLoaded', () => {
    const coachBtn = $('btn-camera-coach');
    if (coachBtn) coachBtn.addEventListener('click', () => openCameraCoach());

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
