/**
 * Moon Muscle Ranks - Biometric Body Scanner & Tier System
 * Sculpted anatomical vector map, Bronze -> Titan rank progression,
 * multi-angle inspection (Dual / Front / Back) and real-time exercise telemetry.
 */
(function () {
  const TIERS = [
    { id: 'unranked', name: 'Unranked', min: 0, color: '#3a3a46', icon: '\u25CB' },
    { id: 'bronze', name: 'Bronze', min: 50, color: '#cd7f32', icon: '\uD83E\uDD49' },
    { id: 'silver', name: 'Silver', min: 200, color: '#c9d1da', icon: '\uD83E\uDD48' },
    { id: 'gold', name: 'Gold', min: 500, color: '#ffd02e', icon: '\uD83E\uDD47' },
    { id: 'platinum', name: 'Platinum', min: 1200, color: '#4fe3d0', icon: '\uD83D\uDCA0' },
    { id: 'diamond', name: 'Diamond', min: 2500, color: '#62b8ff', icon: '\uD83D\uDC8E' },
    { id: 'gymbro', name: 'Gym Bro', min: 5000, color: '#ff5ea8', icon: '\uD83D\uDCAA' },
    { id: 'olympian', name: 'Olympian', min: 10000, color: '#b57bff', icon: '\uD83C\uDFC5' },
    { id: 'titan', name: 'Titan', min: 20000, color: '#ff4d4d', icon: '\uD83D\uDD25' }
  ];

  const MUSCLES = {
    chest: 'Chest',
    shoulders: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    back: 'Back & Lats',
    abs: 'Abs & Core',
    quads: 'Quads',
    hamstrings: 'Hamstrings & Glutes',
    calves: 'Calves'
  };

  const EX = {
    'barbell bench press': { m: { chest: 1, triceps: 0.4, shoulders: 0.3 } },
    'incline dumbbell press': { m: { chest: 1, shoulders: 0.5, triceps: 0.3 } },
    'cable chest fly': { m: { chest: 1 } },
    'chest dips': { m: { chest: 1, triceps: 0.6 }, bw: 3 },
    'push-ups': { m: { chest: 1, triceps: 0.4, shoulders: 0.3 }, bw: 2 },
    'barbell deadlift': { m: { back: 1, hamstrings: 1, quads: 0.3 } },
    'lat pulldown': { m: { back: 1, biceps: 0.4 } },
    'barbell bent-over row': { m: { back: 1, biceps: 0.4 } },
    'pull-ups': { m: { back: 1, biceps: 0.6 }, bw: 4 },
    'seated cable row': { m: { back: 1, biceps: 0.3 } },
    'barbell back squat': { m: { quads: 1, hamstrings: 0.5 } },
    'romanian deadlift': { m: { hamstrings: 1, back: 0.4 } },
    'leg press': { m: { quads: 1, hamstrings: 0.3 } },
    'walking lunges': { m: { quads: 1, hamstrings: 0.5, calves: 0.2 } },
    'standing calf raise': { m: { calves: 1 } },
    'overhead shoulder press': { m: { shoulders: 1, triceps: 0.4 } },
    'dumbbell lateral raise': { m: { shoulders: 1 } },
    'face pull': { m: { shoulders: 1, back: 0.4 } },
    'rear delt fly': { m: { shoulders: 1, back: 0.3 } },
    'barbell bicep curl': { m: { biceps: 1 } },
    'tricep rope pushdown': { m: { triceps: 1 } },
    'incline dumbbell curl': { m: { biceps: 1 } },
    'skull crushers': { m: { triceps: 1 } },
    'hanging leg raise': { m: { abs: 1 }, bw: 2 },
    'plank': { m: { abs: 1 }, bw: 3, repDiv: 5 }
  };

  const CAT_FALLBACK = { chest: 'chest', back: 'back', legs: 'quads', shoulders: 'shoulders', arms: 'biceps', core: 'abs' };

  function entryPoints(name, sets, reps, weight, unit) {
    const key = (name || '').toLowerCase();
    let cfg = EX[key];
    if (!cfg) {
      const ex = (AppState.exercises || []).find((e) => (e.name || '').toLowerCase() === key);
      const m = ex && CAT_FALLBACK[(ex.category || '').toLowerCase()];
      cfg = { m: { [m || 'chest']: 1 } };
    }
    const r = (Number(reps) || 0) / (cfg.repDiv || 1);
    const kg = (Number(weight) || 0) * (unit === 'lbs' ? 0.4536 : 1);
    const mult = cfg.bw ? cfg.bw + kg / 20 : 1 + kg / 20;
    return { pts: (Number(sets) || 0) * r * mult, cfg };
  }

  function compute() {
    const pts = {}, src = {};
    Object.keys(MUSCLES).forEach((k) => { pts[k] = 0; src[k] = {}; });
    (AppState.history || []).forEach((h) => {
      (h.exercises || []).forEach((e) => {
        const { pts: p, cfg } = entryPoints(e.name, e.sets, e.bestReps, e.bestWeight, h.unit);
        Object.entries(cfg.m).forEach(([m, w]) => {
          if (pts[m] === undefined) return;
          pts[m] += p * w;
          src[m][e.name] = (src[m][e.name] || 0) + p * w;
        });
      });
    });
    const extra = AppState.rankExtra || {};
    Object.keys(extra).forEach((m) => { if (pts[m] !== undefined) pts[m] += extra[m]; });
    return { pts, src };
  }

  function tierFor(points) {
    let i = 0;
    TIERS.forEach((t, idx) => { if (points >= t.min) i = idx; });
    const cur = TIERS[i], next = TIERS[i + 1] || null;
    const pct = next ? Math.min(100, ((points - cur.min) / (next.min - cur.min)) * 100) : 100;
    return { cur, next, pct, idx: i };
  }

  window.getRankSnapshot = function () {
    const { pts } = compute();
    const s = {};
    Object.keys(pts).forEach((m) => { s[m] = tierFor(pts[m]).idx; });
    return s;
  };

  window.announceRankUps = function (before) {
    const after = window.getRankSnapshot();
    const ups = Object.keys(after).filter((m) => after[m] > (before[m] || 0));
    if (ups.length) {
      const m = ups[0];
      showToast('\uD83C\uDFC6 ' + MUSCLES[m] + ' ranked up to ' + TIERS[after[m]].name + '!' + (ups.length > 1 ? ' (+' + (ups.length - 1) + ' more)' : ''));
    }
  };

  window.awardRankXP = function (exerciseName, reps) {
    const { pts, cfg } = entryPoints(exerciseName, 1, reps, 0, 'kg');
    const before = window.getRankSnapshot();
    AppState.rankExtra = AppState.rankExtra || {};
    Object.entries(cfg.m).forEach(([m, w]) => {
      AppState.rankExtra[m] = (AppState.rankExtra[m] || 0) + pts * w;
    });
    saveState();
    window.announceRankUps(before);
  };

  let selected = 'chest';
  let currentView = 'both'; // 'both', 'front', 'back'

  function overall(pts) {
    const vals = Object.values(pts);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  function setScannerView(view) {
    currentView = view;
    const svg = document.getElementById('ranks-body-svg');
    if (!svg) return;

    document.querySelectorAll('.scanner-pill-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });

    if (view === 'front') {
      svg.setAttribute('viewBox', '20 5 220 460');
    } else if (view === 'back') {
      svg.setAttribute('viewBox', '280 5 220 460');
    } else {
      svg.setAttribute('viewBox', '0 0 520 470');
    }
  }

  window.renderRanks = function () {
    const root = document.getElementById('ranks-body');
    if (!root) return;
    const { pts, src } = compute();
    const avgPts = overall(pts);
    const ov = tierFor(avgPts);

    // Compute Peak and Next Closest muscle
    let topMuscle = 'chest';
    let maxPts = -1;
    let closestMuscle = 'chest';
    let minGap = Infinity;

    Object.keys(MUSCLES).forEach((m) => {
      const p = pts[m];
      if (p > maxPts) { maxPts = p; topMuscle = m; }
      const t = tierFor(p);
      if (t.next) {
        const gap = t.next.min - p;
        if (gap < minGap && gap > 0) { minGap = gap; closestMuscle = m; }
      }
    });

    const topTier = tierFor(pts[topMuscle]).cur;
    const nextTier = tierFor(pts[closestMuscle]);

    // Hologram Overall Card
    const overallEl = document.getElementById('ranks-overall');
    if (overallEl) {
      overallEl.innerHTML = `
        <div class="ranks-hero-card" style="--tc:${ov.cur.color}">
          <div class="ranks-hero-top">
            <div class="rank-badge-big" style="--tc:${ov.cur.color}">
              <span class="badge-icon">${ov.cur.icon}</span>
              <span class="badge-ring"></span>
            </div>
            <div class="ranks-hero-meta">
              <span class="greeting-subtitle">PHYSIQUE ARCHETYPE</span>
              <div class="rank-overall-name" style="color:${ov.cur.color}">
                ${ov.cur.name.toUpperCase()}
              </div>
              <div class="rank-level-tag">LEVEL ${ov.idx + 1} BODY SCULPT</div>
            </div>
          </div>

          <div class="rank-bar-wrap">
            <div class="rank-bar-info">
              <span>Overall Progression</span>
              <span class="mono">${Math.round(avgPts)} / ${ov.next ? ov.next.min : 'MAX'} PTS</span>
            </div>
            <div class="rank-bar tall"><span style="width:${ov.pct}%;background:${ov.cur.color}"></span></div>
          </div>

          <div class="ranks-intel-grid">
            <div class="intel-stat-box" onclick="selectMuscle('${topMuscle}')">
              <span class="intel-label">🏆 TOP SPECIALTY</span>
              <span class="intel-val" style="color:${topTier.color}">${MUSCLES[topMuscle]}</span>
              <span class="intel-sub">${topTier.name} (${Math.round(pts[topMuscle])} pts)</span>
            </div>
            <div class="intel-stat-box" onclick="selectMuscle('${closestMuscle}')">
              <span class="intel-label">⚡ NEXT RANK UP</span>
              <span class="intel-val" style="color:${nextTier.next ? nextTier.next.color : '#fff'}">${MUSCLES[closestMuscle]}</span>
              <span class="intel-sub">${nextTier.next ? Math.ceil(minGap) + ' pts to ' + nextTier.next.name : 'Max Tier'}</span>
            </div>
          </div>
        </div>
      `;
    }

    // Color and animate muscle SVG paths
    document.querySelectorAll('.muscle').forEach((el) => {
      const m = el.dataset.muscle;
      if (!m || pts[m] === undefined) return;
      const t = tierFor(pts[m]).cur;
      el.style.setProperty('--tier-color', t.color);
      el.style.fill = t.color;
      el.style.fillOpacity = t.id === 'unranked' ? '0.45' : '0.88';
      el.classList.toggle('selected', m === selected);
    });

    // Detailed Selected Muscle Inspector
    const t = tierFor(pts[selected]);
    const top = Object.entries(src[selected]).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const detailEl = document.getElementById('ranks-detail');
    if (detailEl) {
      detailEl.innerHTML = `
        <div class="rank-detail-card" style="--tc:${t.cur.color}">
          <div class="rank-detail-head">
            <span class="rank-icon big" style="border-color:${t.cur.color};box-shadow:0 0 16px ${t.cur.color}44">${t.cur.icon}</span>
            <div class="rank-detail-title-col">
              <div class="detail-label-sub">ACTIVE SELECTION</div>
              <h3>${escapeHtml(MUSCLES[selected])}</h3>
              <div class="detail-tier-row">
                <span class="tier-pill" style="background:${t.cur.color}22;color:${t.cur.color};border:1px solid ${t.cur.color}">
                  ${t.cur.name}
                </span>
                <span class="detail-pts-badge mono">${Math.round(pts[selected])} XP</span>
              </div>
            </div>
          </div>

          <div class="rank-bar-wrap" style="margin-top:14px;">
            <div class="rank-bar-info">
              <span>Tier Advancement</span>
              <span class="mono">${t.next ? Math.ceil(t.next.min - pts[selected]) + ' pts to ' + t.next.name : 'Max Rank Achieved'}</span>
            </div>
            <div class="rank-bar tall"><span style="width:${t.pct}%;background:${t.cur.color}"></span></div>
          </div>

          <div class="rank-top-exercises">
            <span class="top-ex-label">Top Contributing Exercises:</span>
            <div class="rank-top-chips">
              ${top.length ? top.map((e) => `
                <span class="history-tag rank-tag-pill">
                  <strong>${escapeHtml(e[0])}</strong>
                  <span class="tag-pts-bubble">+${Math.round(e[1])}</span>
                </span>
              `).join('') : '<span class="rank-next">No logged sets for this muscle yet. Complete exercises to earn points!</span>'}
            </div>
          </div>
        </div>
      `;
    }

    // Full Muscle Groups List
    const listEl = document.getElementById('ranks-list');
    if (listEl) {
      listEl.innerHTML = Object.keys(MUSCLES).map((m) => {
        const tier = tierFor(pts[m]);
        const isSel = m === selected;
        return `
          <div class="rank-row ${isSel ? 'selected' : ''}" data-muscle="${m}" style="--tc:${tier.cur.color}">
            <span class="rank-icon" style="border-color:${tier.cur.color};color:${tier.cur.color}">${tier.cur.icon}</span>
            <div class="rank-row-main">
              <div class="rank-row-top">
                <strong>${escapeHtml(MUSCLES[m])}</strong>
                <span class="tier-name-tag" style="color:${tier.cur.color}">${tier.cur.name}</span>
              </div>
              <div class="rank-bar"><span style="width:${tier.pct}%;background:${tier.cur.color}"></span></div>
            </div>
            <span class="rank-row-pts mono">${Math.round(pts[m])}</span>
          </div>
        `;
      }).join('');

      document.querySelectorAll('.rank-row').forEach((r) => {
        r.addEventListener('click', () => selectMuscle(r.dataset.muscle));
      });
    }
  };

  function selectMuscle(m) {
    selected = m;
    window.renderRanks();
  }
  window.selectMuscle = selectMuscle;

  document.addEventListener('DOMContentLoaded', () => {
    // Handle clicking directly on muscle paths
    document.querySelectorAll('.muscle').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectMuscle(el.dataset.muscle);
      });
    });

    // Scanner view controls (Dual, Front, Back)
    document.querySelectorAll('.scanner-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setScannerView(btn.dataset.view);
      });
    });

    // Render Legend
    const legend = document.getElementById('ranks-legend');
    if (legend) {
      legend.innerHTML = TIERS.slice(1).map((t) => `
        <span class="legend-chip" style="border-color:${t.color};color:${t.color};background:${t.color}15">
          ${t.icon} ${t.name} <span class="mono" style="opacity:0.8;font-size:0.65rem;">${t.min >= 1000 ? (t.min / 1000) + 'k' : t.min}</span>
        </span>
      `).join('');
    }
  });
})();
