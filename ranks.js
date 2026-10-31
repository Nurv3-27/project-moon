/**
 * Moon Muscle Ranks - body map with Bronze -> Titan tiers per muscle group.
 * Points come from workout history (sets x reps x load) plus camera-verified reps.
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
    chest: 'Chest', shoulders: 'Shoulders', biceps: 'Biceps', triceps: 'Triceps',
    back: 'Back', abs: 'Abs', quads: 'Quads', hamstrings: 'Hamstrings & Glutes', calves: 'Calves'
  };

  // muscle weights per exercise; bw = bodyweight multiplier (no external load); repDiv for timed holds
  const EX = {
    'barbell bench press': { m: { chest: 1, triceps: .4, shoulders: .3 } },
    'incline dumbbell press': { m: { chest: 1, shoulders: .5, triceps: .3 } },
    'cable chest fly': { m: { chest: 1 } },
    'chest dips': { m: { chest: 1, triceps: .6 }, bw: 3 },
    'push-ups': { m: { chest: 1, triceps: .4, shoulders: .3 }, bw: 2 },
    'barbell deadlift': { m: { back: 1, hamstrings: 1, quads: .3 } },
    'lat pulldown': { m: { back: 1, biceps: .4 } },
    'barbell bent-over row': { m: { back: 1, biceps: .4 } },
    'pull-ups': { m: { back: 1, biceps: .6 }, bw: 4 },
    'seated cable row': { m: { back: 1, biceps: .3 } },
    'barbell back squat': { m: { quads: 1, hamstrings: .5 } },
    'romanian deadlift': { m: { hamstrings: 1, back: .4 } },
    'leg press': { m: { quads: 1, hamstrings: .3 } },
    'walking lunges': { m: { quads: 1, hamstrings: .5, calves: .2 } },
    'standing calf raise': { m: { calves: 1 } },
    'overhead shoulder press': { m: { shoulders: 1, triceps: .4 } },
    'dumbbell lateral raise': { m: { shoulders: 1 } },
    'face pull': { m: { shoulders: 1, back: .4 } },
    'rear delt fly': { m: { shoulders: 1, back: .3 } },
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

  // public helpers
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

  // camera-verified reps count towards rank too
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

  // ---------- rendering ----------
  let selected = 'chest';

  function overall(pts) {
    const vals = Object.values(pts);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  window.renderRanks = function () {
    const root = document.getElementById('ranks-body');
    if (!root) return;
    const { pts, src } = compute();
    const ov = tierFor(overall(pts));

    document.getElementById('ranks-overall').innerHTML =
      '<div class="rank-badge-big" style="--tc:' + ov.cur.color + '">' + ov.cur.icon + '</div>' +
      '<div><span class="greeting-subtitle">OVERALL PHYSIQUE</span>' +
      '<div class="rank-overall-name" style="color:' + ov.cur.color + '">' + ov.cur.name + '</div>' +
      '<div class="rank-bar"><span style="width:' + ov.pct + '%;background:' + ov.cur.color + '"></span></div>' +
      '<span class="rank-next">' + (ov.next ? Math.round(overall(pts)) + ' / ' + ov.next.min + ' avg pts to ' + ov.next.name : 'Max rank reached') + '</span></div>';

    // colour the body shapes
    document.querySelectorAll('.muscle').forEach((el) => {
      const m = el.dataset.muscle;
      const t = tierFor(pts[m]).cur;
      el.style.fill = t.color;
      el.style.fillOpacity = t.id === 'unranked' ? 0.55 : 0.9;
      el.classList.toggle('selected', m === selected);
    });

    // list
    document.getElementById('ranks-list').innerHTML = Object.keys(MUSCLES).map((m) => {
      const t = tierFor(pts[m]);
      return '<div class="rank-row ' + (m === selected ? 'selected' : '') + '" data-muscle="' + m + '">' +
        '<span class="rank-icon" style="border-color:' + t.cur.color + '">' + t.cur.icon + '</span>' +
        '<div class="rank-row-main"><div class="rank-row-top"><strong>' + MUSCLES[m] + '</strong>' +
        '<span style="color:' + t.cur.color + '">' + t.cur.name + '</span></div>' +
        '<div class="rank-bar"><span style="width:' + t.pct + '%;background:' + t.cur.color + '"></span></div></div></div>';
    }).join('');
    document.querySelectorAll('.rank-row').forEach((r) => r.addEventListener('click', () => select(r.dataset.muscle)));

    // detail
    const t = tierFor(pts[selected]);
    const top = Object.entries(src[selected]).sort((a, b) => b[1] - a[1]).slice(0, 4);
    document.getElementById('ranks-detail').innerHTML =
      '<div class="rank-detail-head"><span class="rank-icon big" style="border-color:' + t.cur.color + '">' + t.cur.icon + '</span>' +
      '<div><h3>' + MUSCLES[selected] + '</h3><span style="color:' + t.cur.color + ';font-weight:700">' + t.cur.name + '</span>' +
      ' <span class="rank-next">' + Math.round(pts[selected]) + ' pts</span></div></div>' +
      '<div class="rank-bar tall"><span style="width:' + t.pct + '%;background:' + t.cur.color + '"></span></div>' +
      '<span class="rank-next">' + (t.next ? (Math.ceil(t.next.min - pts[selected])) + ' pts to ' + t.next.name : 'Highest rank!') + '</span>' +
      '<div class="rank-top">' + (top.length ? top.map((e) => '<span class="history-tag">' + escapeHtml(e[0]) + ' \u00B7 ' + Math.round(e[1]) + '</span>').join('') :
        '<span class="rank-next">Log exercises that train this muscle to start ranking up.</span>') + '</div>';
  };

  function select(m) {
    selected = m;
    window.renderRanks();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.muscle').forEach((el) => el.addEventListener('click', () => select(el.dataset.muscle)));
    const legend = document.getElementById('ranks-legend');
    if (legend) legend.innerHTML = TIERS.slice(1).map((t) =>
      '<span class="legend-chip" style="border-color:' + t.color + ';color:' + t.color + '">' + t.name + ' ' + t.min + '</span>').join('');
  });
})();
