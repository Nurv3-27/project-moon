/**
 * Moon Muscle Ranks - Bodybuilder Comic Anatomy Model
 * Matches the iconic dark fitness app aesthetic (Hevy / Alpha Progression)
 * with front / back toggle pill, bold ink contours, and tier color highlights.
 */
(function () {
  const TIERS = [
    { id: 'unranked', name: 'Unranked', min: 0, color: '#cd7f32', icon: '\u25CB' },
    { id: 'bronze', name: 'Bronze', min: 50, color: '#cd7f32', icon: '\uD83E\uDD49' },
    { id: 'silver', name: 'Silver', min: 200, color: '#c9d1da', icon: '\uD83E\uDD48' },
    { id: 'gold', name: 'Gold', min: 500, color: '#ffd02e', icon: '\uD83E\uDD47' },
    { id: 'platinum', name: 'Platinum', min: 1200, color: '#4fe3d0', icon: '\uD83D\uDCA0' },
    { id: 'diamond', name: 'Diamond', min: 2500, color: '#62b8ff', icon: '\uD83D\uDC8E' },
    { id: 'gymbro', name: 'Gym Bro', min: 5000, color: '#ff5ea8', icon: '\uD83D\uDCAA' },
    { id: 'olympian', name: 'Olympian', min: 10000, color: '#b57bff', icon: '\uD83C\uDFC5' },
    { id: 'titan', name: 'Titan', min: 20000, color: '#ff3b30', icon: '\uD83D\uDD25' }
  ];

  const MUSCLES = {
    chest: 'Chest',
    shoulders: 'Shoulders',
    traps: 'Upper Traps',
    mid_traps: 'Mid Traps & Rhomboids',
    neck: 'Neck',
    back: 'Lats',
    lower_back: 'Lower Back',
    biceps: 'Biceps',
    triceps: 'Triceps',
    forearms: 'Forearms',
    abs: 'Abs',
    obliques: 'Obliques & Serratus',
    glutes: 'Glutes',
    quads: 'Quads',
    hamstrings: 'Hamstrings',
    adductors: 'Adductors & Hips',
    calves: 'Calves'
  };

  const EX = {
    'barbell bench press': { m: { chest: 1, triceps: 0.4, shoulders: 0.3, forearms: 0.2 } },
    'incline dumbbell press': { m: { chest: 1, shoulders: 0.5, triceps: 0.3, traps: 0.2, forearms: 0.2 } },
    'cable chest fly': { m: { chest: 1, shoulders: 0.2, obliques: 0.15 } },
    'chest dips': { m: { chest: 1, triceps: 0.6, shoulders: 0.3, obliques: 0.2, forearms: 0.25 }, bw: 3 },
    'push-ups': { m: { chest: 1, triceps: 0.4, shoulders: 0.3, abs: 0.2, obliques: 0.2, forearms: 0.2 }, bw: 2 },
    'pushup': { m: { chest: 1, triceps: 0.4, shoulders: 0.3, abs: 0.2, obliques: 0.2, forearms: 0.2 }, bw: 2 },
    'barbell deadlift': { m: { back: 1, mid_traps: 0.9, lower_back: 1, hamstrings: 0.9, glutes: 0.9, traps: 0.8, forearms: 0.75, quads: 0.3, adductors: 0.3, neck: 0.25 } },
    'lat pulldown': { m: { back: 1, mid_traps: 0.5, biceps: 0.45, forearms: 0.4 } },
    'barbell bent-over row': { m: { back: 1, mid_traps: 0.95, traps: 0.6, lower_back: 0.5, biceps: 0.45, forearms: 0.5, shoulders: 0.35 } },
    'pull-ups': { m: { back: 1, mid_traps: 0.65, biceps: 0.6, forearms: 0.55, abs: 0.2, obliques: 0.2 }, bw: 4 },
    'seated cable row': { m: { mid_traps: 1, back: 0.9, traps: 0.5, biceps: 0.35, forearms: 0.4, lower_back: 0.3 } },
    'barbell back squat': { m: { quads: 1, glutes: 0.85, adductors: 0.6, hamstrings: 0.5, lower_back: 0.4, abs: 0.2, calves: 0.15 } },
    'squats': { m: { quads: 1, glutes: 0.75, adductors: 0.5, hamstrings: 0.4, calves: 0.2 }, bw: 2 },
    'romanian deadlift': { m: { hamstrings: 1, glutes: 0.85, lower_back: 0.7, forearms: 0.5, mid_traps: 0.45, traps: 0.4, back: 0.4, adductors: 0.3 } },
    'leg press': { m: { quads: 1, glutes: 0.6, adductors: 0.5, hamstrings: 0.3, calves: 0.2 } },
    'walking lunges': { m: { quads: 1, glutes: 0.8, adductors: 0.6, hamstrings: 0.5, calves: 0.3 } },
    'standing calf raise': { m: { calves: 1 } },
    'overhead shoulder press': { m: { shoulders: 1, traps: 0.5, mid_traps: 0.3, triceps: 0.4, neck: 0.3, abs: 0.2 } },
    'dumbbell lateral raise': { m: { shoulders: 1, traps: 0.45, neck: 0.25, forearms: 0.2 } },
    'face pull': { m: { shoulders: 1, mid_traps: 0.85, traps: 0.6, back: 0.4, neck: 0.3, forearms: 0.25 } },
    'rear delt fly': { m: { shoulders: 1, mid_traps: 0.8, traps: 0.5, back: 0.3 } },
    'barbell bicep curl': { m: { biceps: 1, forearms: 0.5 } },
    'curl': { m: { biceps: 1, forearms: 0.5 }, bw: 1.5 },
    'tricep rope pushdown': { m: { triceps: 1, forearms: 0.25 } },
    'incline dumbbell curl': { m: { biceps: 1, forearms: 0.45 } },
    'skull crushers': { m: { triceps: 1, forearms: 0.25 } },
    'hanging leg raise': { m: { abs: 1, obliques: 0.6, forearms: 0.4, adductors: 0.2 }, bw: 2 },
    'plank': { m: { abs: 1, obliques: 0.7, lower_back: 0.4, shoulders: 0.2 }, bw: 3, repDiv: 5 },
    'barbell shrugs': { m: { traps: 1, mid_traps: 0.5, neck: 0.5, forearms: 0.5, shoulders: 0.2 } },
    'neck curl & extension': { m: { neck: 1, traps: 0.3 } },
    'hammer curls & wrist curl': { m: { forearms: 1, biceps: 0.65 } },
    "farmer's walk": { m: { forearms: 1, traps: 0.85, mid_traps: 0.6, lower_back: 0.5, calves: 0.3, abs: 0.3 } },
    'hyperextension (back extension)': { m: { lower_back: 1, glutes: 0.6, hamstrings: 0.5 } },
    'barbell hip thrust': { m: { glutes: 1, hamstrings: 0.5, adductors: 0.4, lower_back: 0.3 } },
    'hip adduction & abduction': { m: { adductors: 1, glutes: 0.4 } },
    'russian twists & woodchoppers': { m: { obliques: 1, abs: 0.5 }, bw: 2 }
  };

  const CAT_FALLBACK = { chest: 'chest', back: 'back', legs: 'quads', shoulders: 'shoulders', arms: 'biceps', core: 'abs' };

  function inferCustomMuscles(key, fallbackCat) {
    if (key.includes('mid trap') || key.includes('rhomboid') || key.includes('face pull') || key.includes('rear delt')) return { mid_traps: 1, shoulders: 0.7, traps: 0.5 };
    if (key.includes('shrug') || key.includes('trap')) return { traps: 1, mid_traps: 0.5, neck: 0.4, forearms: 0.4 };
    if (key.includes('row')) return { back: 1, mid_traps: 0.9, biceps: 0.4, forearms: 0.4 };
    if (key.includes('neck')) return { neck: 1, traps: 0.3 };
    if (key.includes('forearm') || key.includes('wrist') || key.includes('grip') || key.includes('reverse curl')) return { forearms: 1, biceps: 0.3 };
    if (key.includes('hammer')) return { forearms: 0.85, biceps: 1 };
    if (key.includes('glute') || key.includes('thrust') || key.includes('bridge') || key.includes('kickback')) return { glutes: 1, hamstrings: 0.4, adductors: 0.3 };
    if (key.includes('adduct') || key.includes('abduct') || key.includes('groin')) return { adductors: 1, glutes: 0.3 };
    if (key.includes('oblique') || key.includes('twist') || key.includes('woodchop') || key.includes('side plank')) return { obliques: 1, abs: 0.4 };
    if (key.includes('lower back') || key.includes('hyperextension') || key.includes('back extension') || key.includes('good morning')) return { lower_back: 1, glutes: 0.5, hamstrings: 0.5 };
    if (key.includes('calf') || key.includes('calves') || key.includes('tibialis')) return { calves: 1 };
    if (key.includes('hamstring') || key.includes('leg curl')) return { hamstrings: 1, glutes: 0.3 };
    if (key.includes('tricep') || key.includes('pushdown') || key.includes('kickback')) return { triceps: 1 };
    if (key.includes('bicep') || key.includes('curl')) return { biceps: 1, forearms: 0.4 };
    return { [fallbackCat || 'chest']: 1 };
  }

  function entryPoints(name, sets, reps, weight, unit) {
    const key = (name || '').toLowerCase();
    let cfg = EX[key];
    if (!cfg) {
      const ex = (AppState.exercises || []).find((e) => (e.name || '').toLowerCase() === key);
      const m = ex && CAT_FALLBACK[(ex.category || '').toLowerCase()];
      cfg = { m: inferCustomMuscles(key, m) };
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
  let currentView = 'front'; // 'front' or 'back'
  let currentGender = 'male'; // 'male' or 'female'
  try {
    currentGender = (window.AppState && AppState.settings && AppState.settings.bodyGender) ||
      localStorage.getItem('moon_body_gender') ||
      'male';
  } catch (e) {}

  function overall(pts) {
    const vals = Object.values(pts);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  function updateVisibleAnatomyGroup() {
    const mFront = document.getElementById('body-front-group');
    const mBack  = document.getElementById('body-back-group');
    const fFront = document.getElementById('body-female-front-group');
    const fBack  = document.getElementById('body-female-back-group');
    if (!mFront || !mBack) return;

    const isFemale = currentGender === 'female' && fFront && fBack;
    mFront.style.display = (!isFemale && currentView === 'front') ? 'inline' : 'none';
    mBack.style.display  = (!isFemale && currentView === 'back')  ? 'inline' : 'none';
    if (fFront && fBack) {
      fFront.style.display = (isFemale && currentView === 'front') ? 'inline' : 'none';
      fBack.style.display  = (isFemale && currentView === 'back')  ? 'inline' : 'none';
    }
  }

  function setAnatomyView(view) {
    currentView = view;
    document.querySelectorAll('.anatomy-pill-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });
    updateVisibleAnatomyGroup();
  }
  window.setAnatomyView = setAnatomyView;

  function setBodyGender(gender) {
    currentGender = gender === 'female' ? 'female' : 'male';
    try {
      localStorage.setItem('moon_body_gender', currentGender);
      if (window.AppState && AppState.settings) {
        AppState.settings.bodyGender = currentGender;
        if (typeof saveState === 'function') saveState();
      }
    } catch (e) {}

    document.querySelectorAll('.anatomy-gender-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.gender === currentGender);
    });
    updateVisibleAnatomyGroup();
    if (typeof window.renderRanks === 'function') {
      window.renderRanks();
    }
  }
  window.setBodyGender = setBodyGender;

  // ==========================================================================
  // 1-REP MAX (1RM) CALCULATION & DYNAMIC MUSCLE RANKING SYSTEM
  // ==========================================================================

  // Tiered Ranking Brackets: Bronze -> Olympian
  const ONE_REP_MAX_TIERS = [
    {
      id: 'bronze',
      name: 'Bronze',
      title: 'Bronze Contender',
      color: '#cd7f32',
      badgeClass: 'badge-tier-bronze',
      glowColor: 'rgba(205, 127, 50, 0.75)',
      icon: '🥉',
      desc: 'Foundational baseline. Power curves developing.'
    },
    {
      id: 'silver',
      name: 'Silver',
      title: 'Silver Athlete',
      color: '#c9d1da',
      badgeClass: 'badge-tier-silver',
      glowColor: 'rgba(201, 209, 218, 0.8)',
      icon: '🥈',
      desc: 'Solid strength standard exceeding intermediate lifters.'
    },
    {
      id: 'gold',
      name: 'Gold',
      title: 'Gold Vanguard',
      color: '#ffd02e',
      badgeClass: 'badge-tier-gold',
      glowColor: 'rgba(255, 208, 46, 0.95)',
      icon: '🥇',
      desc: 'Advanced pound-for-pound dominance in the gym.'
    },
    {
      id: 'platinum',
      name: 'Platinum',
      title: 'Platinum Elite',
      color: '#38bdf8',
      badgeClass: 'badge-tier-platinum',
      glowColor: 'rgba(56, 189, 248, 0.95)',
      icon: '💠',
      desc: 'Elite tier strength & load capacity. Top 5% caliber.'
    },
    {
      id: 'diamond',
      name: 'Diamond',
      title: 'Diamond Master',
      color: '#818cf8',
      badgeClass: 'badge-tier-diamond',
      glowColor: 'rgba(129, 140, 248, 1)',
      icon: '💎',
      desc: 'Master tier. Apex neuromuscular recruitment & power.'
    },
    {
      id: 'titan',
      name: 'Titan',
      title: 'Titan Colossus',
      color: '#ff3b30',
      badgeClass: 'badge-tier-titan',
      glowColor: 'rgba(255, 59, 48, 1)',
      icon: '🔥',
      desc: 'Colossus status. Overwhelming kinetic drive shattering plateaus.'
    },
    {
      id: 'olympian',
      name: 'Olympian',
      title: 'Olympian Pinnacle',
      color: '#c084fc',
      badgeClass: 'badge-tier-olympian',
      glowColor: 'rgba(192, 132, 252, 1)',
      icon: '⚡',
      desc: 'Celestial realm of strength. Legendary divine power.'
    }
  ];

  // Benchmark Exercises linked to Primary Muscle Groups
  const ONE_REP_MAX_BENCHMARKS = {
    chest: {
      key: 'chest',
      name: 'Chest',
      icon: '🛡️',
      defaultExercise: 'Incline Bench Press',
      exercises: [
        { name: 'Incline Bench Press', scale: 1.0 },
        { name: 'Smith Machine Bench Press', scale: 1.05 },
        { name: 'Barbell Bench Press', scale: 0.95 },
        { name: 'Dumbbell Bench Press', scale: 1.05 },
        { name: 'Weighted Chest Dips', scale: 1.1 }
      ],
      thresholds: {
        bronze: 45,
        silver: 65,
        gold: 90,
        platinum: 115,
        diamond: 140,
        titan: 165,
        olympian: 190
      }
    },
    legs: {
      key: 'legs',
      name: 'Legs',
      icon: '🦵',
      defaultExercise: 'Barbell Back Squat',
      exercises: [
        { name: 'Barbell Back Squat', scale: 1.0 },
        { name: 'Smith Machine Squat', scale: 1.05 },
        { name: 'Front Squat', scale: 1.15 },
        { name: 'Leg Press', scale: 0.5 },
        { name: 'Hack Squat', scale: 0.85 },
        { name: 'Romanian Deadlift', scale: 1.05 }
      ],
      thresholds: {
        bronze: 60,
        silver: 95,
        gold: 130,
        platinum: 165,
        diamond: 200,
        titan: 240,
        olympian: 280
      }
    },
    back: {
      key: 'back',
      name: 'Back',
      icon: '🦅',
      defaultExercise: 'Barbell Deadlift',
      exercises: [
        { name: 'Barbell Deadlift', scale: 1.0 },
        { name: 'Barbell Bent-Over Row', scale: 1.55 },
        { name: 'Weighted Pull-ups', scale: 1.5 },
        { name: 'Lat Pulldown', scale: 1.5 },
        { name: 'Seated Cable Row', scale: 1.5 }
      ],
      thresholds: {
        bronze: 70,
        silver: 110,
        gold: 155,
        platinum: 200,
        diamond: 245,
        titan: 290,
        olympian: 340
      }
    },
    shoulders: {
      key: 'shoulders',
      name: 'Shoulders',
      icon: '⚡',
      defaultExercise: 'Overhead Shoulder Press',
      exercises: [
        { name: 'Overhead Shoulder Press', scale: 1.0 },
        { name: 'Smith Machine Shoulder Press', scale: 1.05 },
        { name: 'Dumbbell Shoulder Press', scale: 1.1 },
        { name: 'Seated Barbell Overhead Press', scale: 0.98 },
        { name: 'Arnold Press', scale: 1.15 }
      ],
      thresholds: {
        bronze: 30,
        silver: 47.5,
        gold: 67.5,
        platinum: 85,
        diamond: 105,
        titan: 122.5,
        olympian: 140
      }
    },
    arms: {
      key: 'arms',
      name: 'Arms',
      icon: '🦾',
      defaultExercise: 'Barbell Bicep Curl',
      exercises: [
        { name: 'Barbell Bicep Curl', scale: 1.0 },
        { name: 'Close-Grip Bench Press', scale: 0.62 },
        { name: 'Incline Dumbbell Curl', scale: 1.15 },
        { name: 'Skull Crushers', scale: 0.8 },
        { name: 'Tricep Rope Pushdown', scale: 1.2 }
      ],
      thresholds: {
        bronze: 22.5,
        silver: 35,
        gold: 50,
        platinum: 65,
        diamond: 77.5,
        titan: 90,
        olympian: 105
      }
    },
    core: {
      key: 'core',
      name: 'Core / Abs',
      icon: '🎯',
      defaultExercise: 'Weighted Cable Crunch',
      exercises: [
        { name: 'Weighted Cable Crunch', scale: 1.0 },
        { name: 'Weighted Hanging Leg Raise', scale: 1.8 },
        { name: 'Weighted Decline Sit-Up', scale: 1.35 }
      ],
      thresholds: {
        bronze: 30,
        silver: 50,
        gold: 70,
        platinum: 90,
        diamond: 110,
        titan: 130,
        olympian: 150
      }
    }
  };

  const ANATOMY_TO_1RM_GROUP = {
    chest: 'chest',
    quads: 'legs',
    hamstrings: 'legs',
    glutes: 'legs',
    calves: 'legs',
    adductors: 'legs',
    back: 'back',
    lower_back: 'back',
    traps: 'back',
    mid_traps: 'back',
    shoulders: 'shoulders',
    neck: 'shoulders',
    biceps: 'arms',
    triceps: 'arms',
    forearms: 'arms',
    abs: 'core',
    obliques: 'core'
  };

  // Utility 1RM calculation: Epley Equation
  function calculate1RM(weight, reps) {
    const w = Math.max(0, Number(weight) || 0);
    const r = Math.max(0, Number(reps) || 0);
    if (w <= 0 || r <= 0) {
      return { oneRepMax: 0, epley: 0, brzycki: 0, weight: w, reps: r };
    }
    if (r === 1) {
      return { oneRepMax: w, epley: w, brzycki: w, weight: w, reps: 1 };
    }
    // Epley Formula: Weight * (1 + Reps / 30)
    const epley = w * (1 + (r / 30));
    // Brzycki Formula: Weight * (36 / (37 - Reps))
    const brzycki = r < 37 ? w * (36 / (37 - r)) : epley;

    const rounded = Math.round(epley * 10) / 10;
    return {
      oneRepMax: rounded,
      epley: rounded,
      brzycki: Math.round(brzycki * 10) / 10,
      weight: w,
      reps: r
    };
  }

  function getMuscle1RMTier(muscleKey, weight, reps, exerciseName) {
    const group = ONE_REP_MAX_BENCHMARKS[muscleKey] || ONE_REP_MAX_BENCHMARKS.chest;
    const isLbs = (window.AppState && AppState.settings && AppState.settings.unit === 'lbs');
    
    const exObj = group.exercises.find(e => e.name.toLowerCase() === (exerciseName || '').toLowerCase()) || group.exercises[0];
    const scale = exObj ? exObj.scale : 1.0;

    const { oneRepMax } = calculate1RM(weight, reps);
    const oneRepMaxKg = isLbs ? (oneRepMax * 0.453592) : oneRepMax;
    const normalized1RMKg = oneRepMaxKg * scale;

    const th = group.thresholds;
    const tierList = ONE_REP_MAX_TIERS;

    let currentTier = null;
    let nextTier = null;
    let pct = 0;
    let weightToNextKg = 0;

    if (normalized1RMKg < th.bronze) {
      currentTier = {
        id: 'unranked',
        name: 'Unranked',
        title: 'Road to Bronze',
        color: '#71717a',
        badgeClass: 'badge-tier-unranked',
        glowColor: 'rgba(113, 113, 122, 0.5)',
        icon: '🛡️',
        desc: 'Keep logging lifts to breach the Bronze threshold.'
      };
      nextTier = tierList[0];
      pct = Math.min(100, Math.max(0, (normalized1RMKg / th.bronze) * 100));
      weightToNextKg = Math.max(0, (th.bronze - normalized1RMKg) / scale);
    } else {
      for (let i = tierList.length - 1; i >= 0; i--) {
        const t = tierList[i];
        if (normalized1RMKg >= th[t.id]) {
          currentTier = t;
          nextTier = tierList[i + 1] || null;
          if (nextTier) {
            const curTh = th[t.id];
            const nextTh = th[nextTier.id];
            pct = Math.min(100, Math.max(0, ((normalized1RMKg - curTh) / (nextTh - curTh)) * 100));
            weightToNextKg = Math.max(0, (nextTh - normalized1RMKg) / scale);
          } else {
            pct = 100;
            weightToNextKg = 0;
          }
          break;
        }
      }
    }

    const weightToNext = isLbs ? Math.round(weightToNextKg * 2.20462 * 10) / 10 : Math.round(weightToNextKg * 10) / 10;
    const nextTierWeight = nextTier ? (isLbs ? Math.round((th[nextTier.id] / scale) * 2.20462) : Math.round(th[nextTier.id] / scale)) : null;

    return {
      currentTier,
      nextTier,
      pct: Math.round(pct),
      oneRepMax,
      oneRepMaxKg: Math.round(oneRepMaxKg * 10) / 10,
      weightToNext,
      nextTierWeight,
      exercise: exObj.name,
      scale,
      unit: isLbs ? 'lbs' : 'kg'
    };
  }

  // Active state
  let active1RMMuscle = 'chest';
  let active1RMExercise = 'Incline Bench Press';
  let active1RMWeight = 70;
  let active1RMReps = 6;
  let onermStateInitialized = false;

  function ensure1RMState() {
    if (!window.AppState) return;
    if (!AppState.muscleRanks1RM) {
      AppState.muscleRanks1RM = {
        chest: { exercise: 'Incline Bench Press', weight: 70, reps: 6, oneRepMax: 84, tier: 'silver', date: new Date().toISOString() },
        legs: { exercise: 'Barbell Back Squat', weight: 110, reps: 5, oneRepMax: 128, tier: 'silver', date: new Date().toISOString() },
        back: { exercise: 'Barbell Deadlift', weight: 140, reps: 5, oneRepMax: 163, tier: 'gold', date: new Date().toISOString() },
        shoulders: { exercise: 'Overhead Shoulder Press', weight: 55, reps: 6, oneRepMax: 66, tier: 'silver', date: new Date().toISOString() },
        arms: { exercise: 'Barbell Bicep Curl', weight: 35, reps: 8, oneRepMax: 44, tier: 'silver', date: new Date().toISOString() },
        core: { exercise: 'Weighted Cable Crunch', weight: 55, reps: 10, oneRepMax: 73, tier: 'gold', date: new Date().toISOString() }
      };
    }
    if (!onermStateInitialized) {
      const saved = AppState.muscleRanks1RM[active1RMMuscle];
      if (saved) {
        active1RMExercise = saved.exercise || 'Incline Bench Press';
        active1RMWeight = saved.weight || 70;
        active1RMReps = saved.reps || 6;
      }
      onermStateInitialized = true;
    }
  }

  function render1RMCalculatorStation() {
    const container = document.getElementById('ranks-1rm-calculator-container');
    if (!container) return;

    ensure1RMState();
    const unit = (window.AppState && AppState.settings && AppState.settings.unit) || 'kg';
    const unitUpper = unit.toUpperCase();
    const group = ONE_REP_MAX_BENCHMARKS[active1RMMuscle] || ONE_REP_MAX_BENCHMARKS.chest;
    
    // Calculate tier info for current active inputs
    const tierInfo = getMuscle1RMTier(active1RMMuscle, active1RMWeight, active1RMReps, active1RMExercise);
    const curTier = tierInfo.currentTier;
    const nextTier = tierInfo.nextTier;
    const isMaxTier = !nextTier || curTier.id === 'olympian';

    // Check if user has an existing PR for this exercise
    const currentPR = (window.AppState && AppState.prs) ? AppState.prs[active1RMExercise] : null;

    // Reps Presets: 1, 3, 5, 6, 8, 10, 12
    const repPresets = [1, 3, 5, 6, 8, 10, 12];

    // Muscle tabs list
    const muscleKeys = ['chest', 'legs', 'back', 'shoulders', 'arms', 'core'];

    container.innerHTML = `
      <div class="onerm-station-card">
        <div class="onerm-card-header">
          <div class="onerm-header-left">
            <span class="onerm-eyebrow">1-REP MAX (1RM) STRENGTH BENCHMARK</span>
            <h2 class="onerm-title">Theoretical Max &amp; Muscle Ranks</h2>
          </div>
          <div class="onerm-formula-badge" title="Epley Equation: 1RM = Weight × (1 + Reps/30)">
            <span class="ofb-dot"></span>
            <span>EPLEY 1RM FORMULA</span>
          </div>
        </div>

        <!-- Muscle Group Filter Tabs -->
        <div class="onerm-muscle-tabs-bar" role="tablist" aria-label="Target Muscle Group">
          ${muscleKeys.map(k => {
            const m = ONE_REP_MAX_BENCHMARKS[k];
            const saved = (window.AppState && AppState.muscleRanks1RM && AppState.muscleRanks1RM[k]) || null;
            const tId = saved ? saved.tier : 'unranked';
            const tObj = ONE_REP_MAX_TIERS.find(t => t.id === tId) || { icon: '○', color: '#71717a' };
            const isActive = k === active1RMMuscle;
            return `
              <button type="button" 
                      class="onerm-tab-btn ${isActive ? 'active' : ''}" 
                      onclick="select1RMMuscle('${k}')"
                      data-muscle="${k}">
                <span class="otb-icon">${m.icon}</span>
                <span class="otb-name">${m.name}</span>
                <span class="otb-tier-dot" style="background:${tObj.color};box-shadow:0 0 6px ${tObj.color}"></span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Main Calculator Box -->
        <div class="onerm-calc-body">
          <!-- Benchmark Exercise Selector Row -->
          <div class="onerm-ex-selector-row">
            <div class="onerm-field-group" style="flex:1;">
              <label class="onerm-label">BENCHMARK EXERCISE FOR ${group.name.toUpperCase()}</label>
              <div class="onerm-select-wrapper">
                <select id="onerm-exercise-select" class="ios-select onerm-select-menu" onchange="select1RMExercise(this.value)">
                  ${group.exercises.map(e => `
                    <option value="${e.name}" ${e.name === active1RMExercise ? 'selected' : ''}>
                      ${e.name} ${e.scale === 1.0 ? '★ (Benchmark)' : `(Scale ${e.scale}x)`}
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>
            ${currentPR ? `
              <button type="button" class="onerm-pr-autofill-btn" onclick="loadPRForActive1RM()" title="Auto-fill your logged PR: ${currentPR.weight}${unit} × ${currentPR.reps}">
                <span class="pr-bolt">⚡</span>
                <span>Load PR: <strong>${currentPR.weight}${unit} × ${currentPR.reps}</strong></span>
              </button>
            ` : ''}
          </div>

          <!-- Weight & Reps Inputs Row -->
          <div class="onerm-inputs-dual-grid">
            <!-- Weight Control Box -->
            <div class="onerm-input-card">
              <div class="onerm-input-header">
                <span class="onerm-input-label">WEIGHT LIFTED</span>
                <span class="onerm-unit-tag">${unitUpper}</span>
              </div>
              <div class="onerm-stepper-row">
                <button type="button" class="onerm-step-btn" onclick="adjust1RMWeight(-5)" title="-5 ${unitUpper}">-5</button>
                <button type="button" class="onerm-step-btn" onclick="adjust1RMWeight(-2.5)" title="-2.5 ${unitUpper}">-2.5</button>
                <input type="number" 
                       id="onerm-input-weight" 
                       class="onerm-numeric-input" 
                       value="${active1RMWeight}" 
                       min="1" 
                       max="500" 
                       step="0.5" 
                       oninput="on1RMWeightChange(this.value)"
                       aria-label="Weight Lifted">
                <button type="button" class="onerm-step-btn" onclick="adjust1RMWeight(2.5)" title="+2.5 ${unitUpper}">+2.5</button>
                <button type="button" class="onerm-step-btn" onclick="adjust1RMWeight(5)" title="+5 ${unitUpper}">+5</button>
              </div>
            </div>

            <!-- Reps Control Box -->
            <div class="onerm-input-card">
              <div class="onerm-input-header">
                <span class="onerm-input-label">REPETITIONS</span>
                <span class="onerm-unit-tag">REPS</span>
              </div>
              <div class="onerm-stepper-row">
                <button type="button" class="onerm-step-btn" onclick="adjust1RMReps(-1)" title="-1 Rep">-1</button>
                <input type="number" 
                       id="onerm-input-reps" 
                       class="onerm-numeric-input" 
                       value="${active1RMReps}" 
                       min="1" 
                       max="30" 
                       step="1" 
                       oninput="on1RMRepsChange(this.value)"
                       aria-label="Repetitions">
                <button type="button" class="onerm-step-btn" onclick="adjust1RMReps(1)" title="+1 Rep">+1</button>
              </div>
              <!-- Quick Preset Rep Pills -->
              <div class="onerm-rep-pills-row">
                ${repPresets.map(r => `
                  <button type="button" 
                          class="onerm-rep-pill ${active1RMReps === r ? 'active' : ''}" 
                          onclick="set1RMPresetReps(${r})">
                    ${r === 1 ? '1RM' : r}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Real-Time Calculation & Glowing Achieved Rank Badge Showcase -->
          <div class="onerm-results-showcase">
            <div class="onerm-result-stats-col">
              <div class="onerm-stat-meta-label">THEORETICAL 1-REP MAX (1RM)</div>
              <div class="onerm-stat-value-group">
                <span class="onerm-big-number mono" id="onerm-display-val">${tierInfo.oneRepMax}</span>
                <span class="onerm-big-unit">${unitUpper}</span>
              </div>
              <div class="onerm-equation-callout">
                <span>Epley Formula:</span>
                <code class="mono">${active1RMWeight} × (1 + ${active1RMReps}/30) = ${tierInfo.oneRepMax} ${unitUpper}</code>
              </div>
            </div>

            <div class="onerm-result-badge-col">
              <div class="onerm-stat-meta-label">ACHIEVED MUSCLE RANK</div>
              <!-- High-Fidelity Glowing Badge -->
              <div class="onerm-rank-badge ${curTier.badgeClass}" id="onerm-achieved-badge" style="--tier-color:${curTier.color}">
                <span class="orb-icon">${curTier.icon}</span>
                <div class="orb-content">
                  <span class="orb-tier-name">${curTier.name.toUpperCase()}</span>
                  <span class="orb-tier-title">${curTier.title || 'Athletic Rank'}</span>
                </div>
              </div>
              <p class="orb-tier-desc">${curTier.desc || ''}</p>
            </div>
          </div>

          <!-- Tier Progression Bar -->
          <div class="onerm-tier-progression-wrap">
            <div class="onerm-prog-info">
              <span>
                ${isMaxTier 
                  ? '🌟 Olympian Pinnacle Reached — Godlike Strength' 
                  : `Progress to <strong>${nextTier.name.toUpperCase()}</strong> (${tierInfo.nextTierWeight} ${unitUpper})`}
              </span>
              <span class="mono">${tierInfo.pct}%</span>
            </div>
            <div class="onerm-prog-bar-frame">
              <div class="onerm-prog-bar-fill ${curTier.badgeClass}" style="width:${tierInfo.pct}%;background:${curTier.color}"></div>
            </div>
            ${!isMaxTier ? `
              <div class="onerm-delta-callout">
                <span>⚡ Lift Target:</span>
                <span>Add <strong>+${tierInfo.weightToNext} ${unitUpper}</strong> to theoretical 1RM to unlock <strong>${nextTier.name}</strong>.</span>
              </div>
            ` : ''}
          </div>

          <!-- Save Rank Action Bar -->
          <div class="onerm-actions-bar">
            <button type="button" class="onerm-save-rank-btn primary-glow-btn" onclick="saveCurrent1RMRank()">
              <span>🏆 Save &amp; Lock Rank for ${group.name}</span>
            </button>
            <button type="button" class="onerm-toggle-reps-table-btn" onclick="toggle1RMRepTable()">
              <span>📊 Reps Table</span>
            </button>
          </div>

          <!-- Expandable Rep Max Reference Table -->
          <div id="onerm-rep-table-drawer" class="onerm-rep-table-drawer hidden">
            <div class="onerm-rep-table-grid">
              ${[
                { reps: 1, pct: 1.0, label: '100% (1RM)' },
                { reps: 2, pct: 0.95, label: '95% (2RM)' },
                { reps: 3, pct: 0.93, label: '93% (3RM)' },
                { reps: 5, pct: 0.87, label: '87% (5RM)' },
                { reps: 8, pct: 0.80, label: '80% (8RM)' },
                { reps: 10, pct: 0.75, label: '75% (10RM)' },
                { reps: 12, pct: 0.70, label: '70% (12RM)' }
              ].map(row => {
                const est = Math.round(tierInfo.oneRepMax * row.pct * 10) / 10;
                return `
                  <div class="onerm-table-cell">
                    <span class="otc-reps">${row.reps} Rep${row.reps > 1 ? 's' : ''}</span>
                    <span class="otc-weight mono">${est} ${unitUpper}</span>
                    <span class="otc-pct">${row.label}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Targeted Muscle Groups Ranks Grid -->
        <div class="onerm-matrix-section">
          <div class="onerm-matrix-header">
            <h3 class="onerm-matrix-heading">Targeted Muscle Groups 1RM Ranks</h3>
            <span class="onerm-matrix-sub">Tap any muscle group below to load its benchmark lift</span>
          </div>
          <div class="onerm-matrix-grid">
            ${muscleKeys.map(k => {
              const m = ONE_REP_MAX_BENCHMARKS[k];
              const saved = (window.AppState && AppState.muscleRanks1RM && AppState.muscleRanks1RM[k]) || null;
              let display1RM = 0;
              let displayTier = null;
              let displayExercise = m.defaultExercise;

              if (saved) {
                display1RM = saved.oneRepMax || 0;
                displayExercise = saved.exercise || m.defaultExercise;
                displayTier = ONE_REP_MAX_TIERS.find(t => t.id === saved.tier) || null;
              } else {
                const pr = (window.AppState && AppState.prs) ? AppState.prs[m.defaultExercise] : null;
                const w = pr ? pr.weight : (m.thresholds.bronze + 10);
                const r = pr ? pr.reps : 6;
                const info = getMuscle1RMTier(k, w, r, m.defaultExercise);
                display1RM = info.oneRepMax;
                displayTier = info.currentTier;
              }

              if (!displayTier) {
                displayTier = ONE_REP_MAX_TIERS[0];
              }

              const isSelected = k === active1RMMuscle;

              return `
                <div class="onerm-matrix-card ${isSelected ? 'selected' : ''}" 
                     onclick="select1RMMuscle('${k}')"
                     style="--card-tier-color:${displayTier.color}">
                  <div class="omc-top">
                    <div class="omc-muscle-title">
                      <span class="omc-icon">${m.icon}</span>
                      <span class="omc-name">${m.name}</span>
                    </div>
                    <!-- Achieved glowing badge -->
                    <div class="onerm-mini-badge ${displayTier.badgeClass}">
                      <span>${displayTier.icon}</span>
                      <span>${displayTier.name.toUpperCase()}</span>
                    </div>
                  </div>
                  <div class="omc-exercise-name">${displayExercise}</div>
                  <div class="omc-bottom">
                    <div class="omc-1rm-val">
                      <span class="mono">${display1RM}</span>
                      <span class="omc-unit">${unitUpper} 1RM</span>
                    </div>
                    <span class="omc-chevron">&rarr;</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function on1RMWeightChange(val) {
    active1RMWeight = Math.max(1, Number(val) || 0);
    update1RMLiveCalculation();
  }
  window.on1RMWeightChange = on1RMWeightChange;

  function on1RMRepsChange(val) {
    active1RMReps = Math.max(1, Math.min(30, Number(val) || 0));
    update1RMLiveCalculation();
  }
  window.on1RMRepsChange = on1RMRepsChange;

  function adjust1RMWeight(delta) {
    active1RMWeight = Math.max(1, Math.round((active1RMWeight + delta) * 10) / 10);
    const input = document.getElementById('onerm-input-weight');
    if (input) input.value = active1RMWeight;
    update1RMLiveCalculation();
    if (typeof triggerHaptic === 'function') triggerHaptic([15]);
  }
  window.adjust1RMWeight = adjust1RMWeight;

  function adjust1RMReps(delta) {
    active1RMReps = Math.max(1, Math.min(30, active1RMReps + delta));
    const input = document.getElementById('onerm-input-reps');
    if (input) input.value = active1RMReps;
    update1RMLiveCalculation();
    if (typeof triggerHaptic === 'function') triggerHaptic([15]);
  }
  window.adjust1RMReps = adjust1RMReps;

  function set1RMPresetReps(reps) {
    active1RMReps = Number(reps) || 1;
    const input = document.getElementById('onerm-input-reps');
    if (input) input.value = active1RMReps;
    document.querySelectorAll('.onerm-rep-pill').forEach(btn => {
      btn.classList.toggle('active', Number(btn.textContent.trim().replace('1RM', '1')) === active1RMReps);
    });
    update1RMLiveCalculation();
    if (typeof triggerHaptic === 'function') triggerHaptic([20]);
  }
  window.set1RMPresetReps = set1RMPresetReps;

  function select1RMMuscle(muscleKey, recomputeDefaults = true) {
    active1RMMuscle = muscleKey;
    const group = ONE_REP_MAX_BENCHMARKS[muscleKey] || ONE_REP_MAX_BENCHMARKS.chest;
    
    if (recomputeDefaults) {
      const saved = (window.AppState && AppState.muscleRanks1RM && AppState.muscleRanks1RM[muscleKey]) || null;
      if (saved) {
        active1RMExercise = saved.exercise || group.defaultExercise;
        active1RMWeight = saved.weight || 70;
        active1RMReps = saved.reps || 6;
      } else {
        active1RMExercise = group.defaultExercise;
        const pr = (window.AppState && AppState.prs) ? AppState.prs[group.defaultExercise] : null;
        if (pr) {
          active1RMWeight = pr.weight;
          active1RMReps = pr.reps;
        } else {
          const unit = (window.AppState && AppState.settings && AppState.settings.unit) || 'kg';
          active1RMWeight = unit === 'lbs' ? Math.round(group.thresholds.bronze * 2.20462) : group.thresholds.bronze;
          active1RMReps = 6;
        }
      }
    }

    render1RMCalculatorStation();
    if (typeof triggerHaptic === 'function') triggerHaptic([25]);
  }
  window.select1RMMuscle = select1RMMuscle;

  function select1RMExercise(exerciseName) {
    active1RMExercise = exerciseName;
    const pr = (window.AppState && AppState.prs) ? AppState.prs[exerciseName] : null;
    if (pr) {
      active1RMWeight = pr.weight;
      active1RMReps = pr.reps;
      if (typeof showToast === 'function') {
        showToast(`Loaded PR for ${exerciseName}: ${pr.weight}kg × ${pr.reps} reps`);
      }
    }
    render1RMCalculatorStation();
    if (typeof triggerHaptic === 'function') triggerHaptic([20]);
  }
  window.select1RMExercise = select1RMExercise;

  function loadPRForActive1RM() {
    const pr = (window.AppState && AppState.prs) ? AppState.prs[active1RMExercise] : null;
    if (pr) {
      active1RMWeight = pr.weight;
      active1RMReps = pr.reps;
      const wInput = document.getElementById('onerm-input-weight');
      const rInput = document.getElementById('onerm-input-reps');
      if (wInput) wInput.value = pr.weight;
      if (rInput) rInput.value = pr.reps;
      update1RMLiveCalculation();
      if (typeof triggerHaptic === 'function') triggerHaptic([35]);
      if (typeof showToast === 'function') {
        const u = (window.AppState && AppState.settings && AppState.settings.unit) || 'kg';
        showToast(`⚡ Loaded PR: ${pr.weight}${u} × ${pr.reps} reps`);
      }
    }
  }
  window.loadPRForActive1RM = loadPRForActive1RM;

  function toggle1RMRepTable() {
    const drawer = document.getElementById('onerm-rep-table-drawer');
    if (drawer) {
      drawer.classList.toggle('hidden');
      if (typeof triggerHaptic === 'function') triggerHaptic([20]);
    }
  }
  window.toggle1RMRepTable = toggle1RMRepTable;

  function update1RMLiveCalculation() {
    const unit = (window.AppState && AppState.settings && AppState.settings.unit) || 'kg';
    const unitUpper = unit.toUpperCase();
    const info = getMuscle1RMTier(active1RMMuscle, active1RMWeight, active1RMReps, active1RMExercise);
    const curTier = info.currentTier;
    const nextTier = info.nextTier;
    const isMaxTier = !nextTier || curTier.id === 'olympian';

    const numEl = document.getElementById('onerm-display-val');
    if (numEl) numEl.textContent = info.oneRepMax;

    const eqEl = document.querySelector('.onerm-equation-callout code');
    if (eqEl) {
      eqEl.textContent = `${active1RMWeight} × (1 + ${active1RMReps}/30) = ${info.oneRepMax} ${unitUpper}`;
    }

    const badgeEl = document.getElementById('onerm-achieved-badge');
    if (badgeEl) {
      badgeEl.className = `onerm-rank-badge ${curTier.badgeClass}`;
      badgeEl.style.setProperty('--tier-color', curTier.color);
      badgeEl.innerHTML = `
        <span class="orb-icon">${curTier.icon}</span>
        <div class="orb-content">
          <span class="orb-tier-name">${curTier.name.toUpperCase()}</span>
          <span class="orb-tier-title">${curTier.title || 'Athletic Rank'}</span>
        </div>
      `;
    }

    const descEl = document.querySelector('.orb-tier-desc');
    if (descEl) descEl.textContent = curTier.desc || '';

    const progInfo = document.querySelector('.onerm-prog-info');
    if (progInfo) {
      progInfo.innerHTML = `
        <span>
          ${isMaxTier 
            ? '🌟 Olympian Pinnacle Reached — Godlike Strength' 
            : `Progress to <strong>${nextTier.name.toUpperCase()}</strong> (${info.nextTierWeight} ${unitUpper})`}
        </span>
        <span class="mono">${info.pct}%</span>
      `;
    }
    const progFill = document.querySelector('.onerm-prog-bar-fill');
    if (progFill) {
      progFill.className = `onerm-prog-bar-fill ${curTier.badgeClass}`;
      progFill.style.width = `${info.pct}%`;
      progFill.style.background = curTier.color;
    }

    const deltaEl = document.querySelector('.onerm-delta-callout');
    if (deltaEl) {
      if (!isMaxTier) {
        deltaEl.style.display = 'flex';
        deltaEl.innerHTML = `
          <span>⚡ Lift Target:</span>
          <span>Add <strong>+${info.weightToNext} ${unitUpper}</strong> to theoretical 1RM to unlock <strong>${nextTier.name}</strong>.</span>
        `;
      } else {
        deltaEl.style.display = 'none';
      }
    }

    document.querySelectorAll('.onerm-rep-pill').forEach(btn => {
      const r = Number(btn.textContent.trim().replace('1RM', '1'));
      btn.classList.toggle('active', r === active1RMReps);
    });
  }
  window.update1RMLiveCalculation = update1RMLiveCalculation;

  function saveCurrent1RMRank() {
    if (!window.AppState) return;
    if (!AppState.muscleRanks1RM) AppState.muscleRanks1RM = {};
    
    const info = getMuscle1RMTier(active1RMMuscle, active1RMWeight, active1RMReps, active1RMExercise);
    AppState.muscleRanks1RM[active1RMMuscle] = {
      exercise: active1RMExercise,
      weight: active1RMWeight,
      reps: active1RMReps,
      oneRepMax: info.oneRepMax,
      tier: info.currentTier.id,
      tierName: info.currentTier.name,
      date: new Date().toISOString()
    };
    
    if (typeof saveState === 'function') saveState();
    if (typeof triggerHaptic === 'function') triggerHaptic([40, 60, 40]);
    if (typeof showToast === 'function') {
      showToast(`🏆 ${ONE_REP_MAX_BENCHMARKS[active1RMMuscle].name} 1RM saved: ${info.oneRepMax} ${info.unit.toUpperCase()} (${info.currentTier.name})!`);
    }

    render1RMCalculatorStation();
    if (typeof renderRanks === 'function') renderRanks();
  }
  window.saveCurrent1RMRank = saveCurrent1RMRank;

  window.calculate1RM = calculate1RM;
  window.getMuscle1RMTier = getMuscle1RMTier;
  window.ONE_REP_MAX_TIERS = ONE_REP_MAX_TIERS;
  window.ONE_REP_MAX_BENCHMARKS = ONE_REP_MAX_BENCHMARKS;
  window.render1RMCalculatorStation = render1RMCalculatorStation;

  window.renderRanks = function () {
    const root = document.getElementById('ranks-body');
    if (!root) return;
    render1RMCalculatorStation();
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

    // Overall Physique Banner
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
              <div class="rank-level-tag">LEVEL ${ov.idx + 1} &bull; ${Math.round(avgPts)} TOTAL AVG XP</div>
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
              <span class="intel-label">⚡ NEXT LEVEL UP</span>
              <span class="intel-val" style="color:${nextTier.next ? nextTier.next.color : '#fff'}">${MUSCLES[closestMuscle]}</span>
              <span class="intel-sub">${nextTier.next ? Math.ceil(minGap) + ' pts to ' + nextTier.next.name : 'Max Tier'}</span>
            </div>
          </div>
        </div>
      `;
    }

    // Dynamically color each anatomical muscle group according to its actual Rank Tier
    document.querySelectorAll('.muscle').forEach((el) => {
      const m = el.dataset.muscle;
      if (!m || pts[m] === undefined) return;
      const t = tierFor(pts[m]).cur;
      const hasPoints = pts[m] > 0;
      const isSelected = (m === selected);

      const fillColor = hasPoints
        ? t.color
        : (isSelected ? '#cfd8e3' : '#ECEEF2');
      const glowColor = hasPoints ? t.color : '#ffffff';

      el.style.setProperty('--tier-color', glowColor);

      const targets = el.tagName.toLowerCase() === 'g'
        ? el.querySelectorAll('path, polygon, rect, ellipse, line')
        : [el];
      targets.forEach((tgt) => {
        if (tgt.classList.contains('muscle-line') || tgt.tagName.toLowerCase() === 'line') {
          tgt.style.fill = 'none';
          tgt.style.stroke = '#111113';
          tgt.style.strokeWidth = '2.2';
        } else {
          tgt.style.fill = fillColor;
          tgt.style.stroke = isSelected ? '#FFFFFF' : '#111113';
          tgt.style.strokeWidth = isSelected ? '3.2' : '2.2';
        }
      });

      el.classList.toggle('selected', isSelected);
      el.classList.toggle('ranked', hasPoints);
    });

    // Inspector Detail Card for selected muscle
    const t = tierFor(pts[selected]);
    const top = Object.entries(src[selected]).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const detailEl = document.getElementById('ranks-detail');
    if (detailEl) {
      detailEl.innerHTML = `
        <div class="rank-detail-card" style="--tc:${t.cur.color}">
          <div class="rank-detail-head">
            <span class="rank-icon big" style="border-color:${t.cur.color};box-shadow:0 0 16px ${t.cur.color}44">${t.cur.icon}</span>
            <div class="rank-detail-title-col">
              <div class="detail-label-sub">ACTIVE MUSCLE GROUP</div>
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

  const BACK_ONLY = ['mid_traps', 'back', 'lower_back', 'triceps', 'glutes', 'hamstrings'];
  const FRONT_ONLY = ['chest', 'biceps', 'abs', 'quads'];

  function selectMuscle(m) {
    selected = m;
    // Auto switch front / back view if muscle is only visible on the other side
    if (BACK_ONLY.includes(m) && currentView === 'front') {
      setAnatomyView('back');
    } else if (FRONT_ONLY.includes(m) && currentView === 'back') {
      setAnatomyView('front');
    }
    const target1RM = ANATOMY_TO_1RM_GROUP[m];
    if (target1RM && target1RM !== active1RMMuscle) {
      active1RMMuscle = target1RM;
      const group = ONE_REP_MAX_BENCHMARKS[target1RM];
      active1RMExercise = group.defaultExercise;
      const saved = (window.AppState && AppState.muscleRanks1RM && AppState.muscleRanks1RM[target1RM]) || null;
      if (saved) {
        active1RMWeight = saved.weight;
        active1RMReps = saved.reps;
      }
    }
    window.renderRanks();
  }
  window.selectMuscle = selectMuscle;

  document.addEventListener('DOMContentLoaded', () => {
    // Render 1RM Calculator & Benchmark matrix
    render1RMCalculatorStation();
    // Handle clicking directly on muscle paths
    document.querySelectorAll('.muscle').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectMuscle(el.dataset.muscle);
      });
    });

    // Handle clicking neutral structural plates mapped to a muscle group (e.g. upper/lower back)
    document.querySelectorAll('[data-click-muscle]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectMuscle(el.dataset.clickMuscle);
      });
    });

    // Pill Toggle (front / back) matching screenshot
    document.querySelectorAll('.anatomy-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setAnatomyView(btn.dataset.view);
      });
    });

    // Top-right corner Male / Lady Body Toggle
    document.querySelectorAll('.anatomy-gender-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setBodyGender(btn.dataset.gender);
      });
    });

    // Ensure saved gender & front view are active on start
    setBodyGender(currentGender);
    setAnatomyView('front');

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
