/**
 * Moon - iOS Workout & Fitness Tracker Engine
 * Full offline PWA support, Web Audio synthesized sounds, Haptic feedback
 */

// --- Default Exercise Database ---
const DEFAULT_EXERCISES = [
  // Chest
  { id: 'ex_1', name: 'Barbell Bench Press', category: 'Chest' },
  { id: 'ex_2', name: 'Incline Dumbbell Press', category: 'Chest' },
  { id: 'ex_3', name: 'Cable Chest Fly', category: 'Chest' },
  { id: 'ex_4', name: 'Chest Dips', category: 'Chest' },
  { id: 'ex_5', name: 'Push-Ups', category: 'Chest' },
  // Back
  { id: 'ex_6', name: 'Barbell Deadlift', category: 'Back' },
  { id: 'ex_7', name: 'Lat Pulldown', category: 'Back' },
  { id: 'ex_8', name: 'Barbell Bent-Over Row', category: 'Back' },
  { id: 'ex_9', name: 'Pull-Ups', category: 'Back' },
  { id: 'ex_10', name: 'Seated Cable Row', category: 'Back' },
  // Legs
  { id: 'ex_11', name: 'Barbell Back Squat', category: 'Legs' },
  { id: 'ex_12', name: 'Romanian Deadlift', category: 'Legs' },
  { id: 'ex_13', name: 'Leg Press', category: 'Legs' },
  { id: 'ex_14', name: 'Walking Lunges', category: 'Legs' },
  { id: 'ex_15', name: 'Standing Calf Raise', category: 'Legs' },
  //Shoulders & Traps / Neck
  { id: 'ex_16', name: 'Overhead Shoulder Press', category: 'Shoulders' },
  { id: 'ex_17', name: 'Dumbbell Lateral Raise', category: 'Shoulders' },
  { id: 'ex_18', name: 'Face Pull', category: 'Shoulders' },
  { id: 'ex_19', name: 'Rear Delt Fly', category: 'Shoulders' },
  { id: 'ex_26', name: 'Barbell Shrugs', category: 'Shoulders' },
  { id: 'ex_27', name: 'Neck Curl & Extension', category: 'Shoulders' },
  // Arms & Forearms
  { id: 'ex_20', name: 'Barbell Bicep Curl', category: 'Arms' },
  { id: 'ex_21', name: 'Tricep Rope Pushdown', category: 'Arms' },
  { id: 'ex_22', name: 'Incline Dumbbell Curl', category: 'Arms' },
  { id: 'ex_23', name: 'Skull Crushers', category: 'Arms' },
  { id: 'ex_28', name: 'Hammer Curls & Wrist Curl', category: 'Arms' },
  // Core & Obliques
  { id: 'ex_24', name: 'Hanging Leg Raise', category: 'Core' },
  { id: 'ex_25', name: 'Plank', category: 'Core' },
  { id: 'ex_33', name: 'Russian Twists & Woodchoppers', category: 'Core' },
  // Posterior Chain, Forearms & Hips
  { id: 'ex_29', name: "Farmer's Walk", category: 'Back' },
  { id: 'ex_30', name: 'Hyperextension (Back Extension)', category: 'Back' },
  { id: 'ex_31', name: 'Barbell Hip Thrust', category: 'Legs' },
  { id: 'ex_32', name: 'Hip Adduction & Abduction', category: 'Legs' }
];

const DEFAULT_ROUTINES = [
  {
    id: 'routine_push',
    name: 'Push Power (Chest & Shoulders)',
    tag: 'Chest, Delts, Triceps',
    exerciseIds: ['ex_1', 'ex_2', 'ex_17', 'ex_21']
  },
  {
    id: 'routine_pull',
    name: 'Pull Strength (Back & Biceps)',
    tag: 'Back, Lats, Biceps',
    exerciseIds: ['ex_6', 'ex_7', 'ex_8', 'ex_20']
  },
  {
    id: 'routine_legs',
    name: 'Leg Day & Core Hypertrophy',
    tag: 'Quads, Hamstrings, Abs',
    exerciseIds: ['ex_11', 'ex_12', 'ex_13', 'ex_24']
  },
  {
    id: 'routine_upper',
    name: 'Upper Body Pump',
    tag: 'Chest, Back, Arms',
    exerciseIds: ['ex_1', 'ex_9', 'ex_16', 'ex_20', 'ex_21']
  }
];

// Initial state helpers
const STORAGE_KEY = 'ironpulse_app_state_v1';

const DEMO_HISTORY = [
  {
    id: 'hist_demo_1',
    title: 'Push Power (Chest & Shoulders)',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    durationSeconds: 3120,
    volume: 6840,
    unit: 'kg',
    setsCount: 16,
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, bestWeight: 85, bestReps: 8 },
      { name: 'Incline Dumbbell Press', sets: 4, bestWeight: 28, bestReps: 10 },
      { name: 'Dumbbell Lateral Raise', sets: 4, bestWeight: 14, bestReps: 12 },
      { name: 'Tricep Rope Pushdown', sets: 4, bestWeight: 32, bestReps: 12 }
    ]
  },
  {
    id: 'hist_demo_2',
    title: 'Leg Day & Core Hypertrophy',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    durationSeconds: 3480,
    volume: 8450,
    unit: 'kg',
    setsCount: 18,
    exercises: [
      { name: 'Barbell Back Squat', sets: 5, bestWeight: 120, bestReps: 6 },
      { name: 'Romanian Deadlift', sets: 4, bestWeight: 100, bestReps: 8 },
      { name: 'Leg Press', sets: 5, bestWeight: 220, bestReps: 10 }
    ]
  }
];

function rebuildPRsFromHistory(historyList) {
  const prs = {};
  (historyList || []).forEach((h) => {
    (h.exercises || []).forEach((ex) => {
      const w = Number(ex.bestWeight) || 0;
      const r = Number(ex.bestReps) || 0;
      if (w > 0) {
        if (!prs[ex.name] || w > prs[ex.name].weight || (w === prs[ex.name].weight && r > prs[ex.name].reps)) {
          prs[ex.name] = { weight: w, reps: r, date: h.date };
        }
      }
    });
  });
  return prs;
}

function syncDemoState(state) {
  state.settings = state.settings || {};
  state.exercises = state.exercises || [...DEFAULT_EXERCISES];
  const existingNames = new Set(state.exercises.map(e => (e.name || '').toLowerCase()));
  DEFAULT_EXERCISES.forEach(def => {
    if (!existingNames.has(def.name.toLowerCase())) {
      state.exercises.push({ ...def });
    }
  });
  const demoOn = state.settings.demoMode === true;
  const realHistory = (state.history || []).filter(h => h.id !== 'hist_demo_1' && h.id !== 'hist_demo_2');
  state.history = demoOn ? [...realHistory, ...DEMO_HISTORY] : realHistory;
  state.prs = rebuildPRsFromHistory(state.history);
  return state;
}

function getInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return syncDemoState(parsed);
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
  }

  // Clean initial state with demo mode disabled by default
  return {
    settings: {
      unit: 'kg',
      defaultRest: 90,
      sound: true,
      haptics: true,
      demoMode: false
    },
    exercises: [...DEFAULT_EXERCISES],
    routines: [...DEFAULT_ROUTINES],
    history: [],
    prs: {},
    activeWorkout: null
  };
}

let AppState = getInitialState();
saveState();

// Doomscroll bank: balance (seconds earned), session (ms epoch when the current scroll session ends)
function ensureScrollState() {
  if (!AppState.scroll) AppState.scroll = { balance: 0, sessionEndsAt: null, earnedTotal: 0 };
}
ensureScrollState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
}

// --- Web Audio Synthesizer (Zero asset dependency) ---
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type, duration, delay = 0) {
  if (!AppState.settings.sound) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch (e) {
    console.warn('Audio tone error', e);
  }
}

function playSetCompletePing() {
  playTone(880, 'sine', 0.15, 0); // A5 note
  playTone(1174.66, 'sine', 0.25, 0.08); // D6 high note
}

function playRestTimerChime() {
  // Triple boxing bell alert chime
  playTone(587.33, 'triangle', 0.3, 0);
  playTone(880, 'sine', 0.4, 0.15);
  playTone(1174.66, 'sine', 0.8, 0.3);
}

function triggerHaptic(pattern = [40]) {
  if (AppState.settings.haptics && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
}

// --- Active Workout Runtime & Timer ---
let workoutTimerInterval = null;
let restTimerInterval = null;
let restTimeRemaining = 0;
let restTotalDuration = 90;
let restEndsAt = 0;

function notifyRestOver() {
  const title = 'Rest over!';
  const body = 'Time for your next set \uD83D\uDCAA';
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(reg => reg.showNotification(title, { body, icon: 'app_icon_192.png', vibrate: [200, 100, 200], tag: 'rest-over' }))
          .catch(() => new Notification(title, { body }));
      } else {
        new Notification(title, { body });
      }
    }
  } catch (e) {}
}

function requestNotifyPermission() {
  try {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  } catch (e) {}
}

function showToast(msg) {
  let t = document.getElementById('moon-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'moon-toast';
    t.className = 'moon-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 3500);
}

function startWorkoutTimer() {
  if (workoutTimerInterval) clearInterval(workoutTimerInterval);
  workoutTimerInterval = setInterval(() => {
    if (!AppState.activeWorkout) return;
    const elapsed = Math.floor((Date.now() - AppState.activeWorkout.startTime) / 1000);
    renderTimerDisplays(elapsed);
  }, 1000);
}

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function renderTimerDisplays(elapsed) {
  const formatted = formatDuration(elapsed);
  const activeTimerEl = document.getElementById('active-timer-display');
  const bannerTimerEl = document.getElementById('banner-timer');
  if (activeTimerEl) activeTimerEl.textContent = formatted;
  if (bannerTimerEl) bannerTimerEl.textContent = formatted;
}

// --- Rest Timer Floating Bar ---
function triggerRestTimer(seconds) {
  restTotalDuration = seconds || AppState.settings.defaultRest || 90;
  restTimeRemaining = restTotalDuration;
  restEndsAt = Date.now() + restTotalDuration * 1000;

  const bar = document.getElementById('rest-timer-bar');
  if (bar) bar.classList.remove('hidden');

  updateRestTimerUI();

  if (restTimerInterval) clearInterval(restTimerInterval);
  restTimerInterval = setInterval(tickRestTimer, 1000);
}

function tickRestTimer() {
  restTimeRemaining = Math.max(0, Math.ceil((restEndsAt - Date.now()) / 1000));
  if (restTimeRemaining <= 0) {
    clearInterval(restTimerInterval);
    restTimerInterval = null;
    updateRestTimerUI();
    playRestTimerChime();
    triggerHaptic([100, 50, 100, 50, 200]);
    notifyRestOver();
    showToast('\u23F1\uFE0F Rest over \u2013 next set!');
    setTimeout(() => {
      closeRestTimer();
    }, 3000);
  } else {
    updateRestTimerUI();
  }
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && restTimerInterval) tickRestTimer();
  if (!document.hidden) scrollTick();
});

function updateRestTimerUI() {
  const textEl = document.getElementById('rest-timer-text');
  const ringFill = document.getElementById('timer-ring-fill');
  if (textEl) textEl.textContent = restTimeRemaining;

  if (ringFill) {
    const circumference = 113.09; // 2 * PI * 18
    const progress = restTimeRemaining / restTotalDuration;
    const offset = circumference * (1 - progress);
    ringFill.style.strokeDashoffset = offset;
  }
}

function closeRestTimer() {
  if (restTimerInterval) clearInterval(restTimerInterval);
  restTimerInterval = null;
  const bar = document.getElementById('rest-timer-bar');
  if (bar) bar.classList.add('hidden');
}

// --- Tab Switching Navigation ---
window.switchTab = function(tabName) {
  const tabs = document.querySelectorAll('.nav-tab');
  const views = document.querySelectorAll('.tab-view');

  tabs.forEach(tab => {
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  views.forEach(view => {
    if (view.id === `view-${tabName}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Floating active workout banner management
  const banner = document.getElementById('floating-active-banner');
  if (AppState.activeWorkout && tabName !== 'workout') {
    banner.classList.remove('hidden');
    const nameEl = document.getElementById('banner-workout-name');
    if (nameEl) nameEl.textContent = AppState.activeWorkout.title || 'Workout Session';
  } else {
    banner.classList.add('hidden');
  }

  // Refresh tab content when selected
  if (tabName === 'routines') renderRoutines();
  if (tabName === 'history') renderHistory();
  if (tabName === 'prs') renderPRs();
  if (tabName === 'ranks') renderRanks();
  if (tabName === 'workout') renderActiveWorkout();

  window.scrollTo(0, 0);
};

// --- Routines Management ---
function renderRoutines() {
  const container = document.getElementById('routines-grid');
  if (!container) return;

  container.innerHTML = AppState.routines.map(routine => {
    // Resolve exercises
    const exNames = routine.exerciseIds
      .map(id => {
        const found = AppState.exercises.find(e => e.id === id);
        return found ? found.name : '';
      })
      .filter(Boolean);

    return `
      <div class="routine-card">
        <div class="routine-card-header">
          <div>
            <h3 class="routine-card-title">${escapeHtml(routine.name)}</h3>
            <span class="routine-tag-pill">${escapeHtml(routine.tag || 'Workout')}</span>
          </div>
          <button class="start-routine-btn" onclick="startWorkoutFromRoutine('${routine.id}')">Start &rarr;</button>
        </div>
        <p class="routine-exercises-preview">${escapeHtml(exNames.join(' • '))}</p>
        <div class="routine-card-footer">
          <span class="routine-meta-info">${routine.exerciseIds.length} Exercises</span>
          <span class="routine-meta-info">Estimated 45m</span>
        </div>
      </div>
    `;
  }).join('');

  // Update hero stats overview
  updateOverviewStats();
}

function updateOverviewStats() {
  const streakEl = document.getElementById('stat-streak');
  const countEl = document.getElementById('stat-weekly-count');
  const volEl = document.getElementById('stat-total-volume');
  const volUnitEl = document.getElementById('stat-volume-unit');

  // Compute streak
  const history = AppState.history || [];
  streakEl.textContent = history.length > 0 ? Math.min(history.length, 5) : 0;

  // This week count
  const oneWeekAgo = Date.now() - 7 * 86400000;
  const thisWeekWorkouts = history.filter(h => new Date(h.date).getTime() > oneWeekAgo);
  countEl.textContent = thisWeekWorkouts.length;

  // Total volume
  let totalVol = 0;
  history.forEach(h => totalVol += (h.volume || 0));
  volEl.textContent = Math.round(totalVol).toLocaleString();
  volUnitEl.textContent = `TOTAL ${AppState.settings.unit.toUpperCase()} ⚡`;
}

// --- Starting a Workout ---
window.startBlankWorkout = function() {
  if (AppState.activeWorkout) {
    if (!confirm('A workout is already running. Would you like to abandon it and start a new one?')) {
      switchTab('workout');
      return;
    }
  }

  AppState.activeWorkout = {
    id: 'wo_' + Date.now(),
    title: 'Workout Session',
    startTime: Date.now(),
    exercises: []
  };

  saveState();
  startWorkoutTimer();
  switchTab('workout');
  triggerHaptic([50]);
};

window.startWorkoutFromRoutine = function(routineId) {
  const routine = AppState.routines.find(r => r.id === routineId);
  if (!routine) return;

  if (AppState.activeWorkout) {
    if (!confirm('A workout is already in progress. Discard it and load this routine?')) {
      switchTab('workout');
      return;
    }
  }

  const loadedExercises = routine.exerciseIds.map(exId => {
    const ex = AppState.exercises.find(e => e.id === exId);
    if (!ex) return null;

    // Get previous record
    const pr = AppState.prs[ex.name];
    const prevWeight = pr ? pr.weight : 40;
    const prevReps = pr ? pr.reps : 10;

    return {
      exerciseId: ex.id,
      name: ex.name,
      category: ex.category,
      sets: [
        { weight: prevWeight, reps: prevReps, completed: false },
        { weight: prevWeight, reps: prevReps, completed: false },
        { weight: prevWeight, reps: prevReps, completed: false }
      ]
    };
  }).filter(Boolean);

  AppState.activeWorkout = {
    id: 'wo_' + Date.now(),
    title: routine.name,
    startTime: Date.now(),
    exercises: loadedExercises
  };

  saveState();
  startWorkoutTimer();
  switchTab('workout');
  triggerHaptic([50]);
};

// --- Render Active Workout ---
function renderActiveWorkout() {
  const idleState = document.getElementById('workout-idle-state');
  const activeState = document.getElementById('workout-active-state');
  const dot = document.getElementById('tab-active-dot');

  if (!AppState.activeWorkout) {
    idleState.classList.remove('hidden');
    activeState.classList.add('hidden');
    dot.classList.add('hidden');
    return;
  }

  idleState.classList.add('hidden');
  activeState.classList.remove('hidden');
  dot.classList.remove('hidden');

  const restSel = document.getElementById('active-rest-select');
  if (restSel) restSel.value = String(AppState.activeWorkout.restSeconds || AppState.settings.defaultRest || 90);

  // Title input
  const titleInput = document.getElementById('active-workout-name');
  if (titleInput && titleInput.value !== AppState.activeWorkout.title) {
    titleInput.value = AppState.activeWorkout.title;
  }

  // Calculate live volume and sets
  let totalVolume = 0;
  let totalSets = 0;

  AppState.activeWorkout.exercises.forEach(ex => {
    ex.sets.forEach(set => {
      if (set.completed) {
        totalVolume += (Number(set.weight) || 0) * (Number(set.reps) || 0);
        totalSets++;
      }
    });
  });

  document.getElementById('active-volume-display').textContent = `${Math.round(totalVolume)} ${AppState.settings.unit}`;
  document.getElementById('active-sets-display').textContent = totalSets;

  // Render Exercise Cards
  const listEl = document.getElementById('active-exercises-list');
  if (!listEl) return;

  listEl.innerHTML = AppState.activeWorkout.exercises.map((ex, exIndex) => {
    const pr = AppState.prs[ex.name];
    const prevText = pr ? `${pr.weight} ${AppState.settings.unit} × ${pr.reps}` : '-';

    return `
      <div class="exercise-session-card" data-ex-index="${exIndex}">
        <div class="exercise-session-header">
          <div class="ex-title-group">
            <span class="ex-session-name">${escapeHtml(ex.name)}</span>
            <span class="ex-session-cat">${escapeHtml(ex.category)}${scrollHint(ex.name)}</span>
          </div>
          <button class="remove-ex-btn" onclick="removeExerciseFromActive(${exIndex})" title="Remove Exercise">&times;</button>
        </div>

        <div class="sets-table">
          <div class="sets-header-row">
            <span>SET</span>
            <span>PREV</span>
            <span>${AppState.settings.unit.toUpperCase()}</span>
            <span>REPS</span>
            <span>DONE</span>
          </div>

          ${ex.sets.map((set, setIndex) => `
            <div class="set-row ${set.completed ? 'completed' : ''}" data-set-index="${setIndex}">
              <span class="set-index-badge">${setIndex + 1}</span>
              <span class="prev-set-text">${prevText}</span>
              <input type="number" class="set-input set-weight-input" 
                     value="${set.weight}" 
                     placeholder="0" 
                     step="0.5" 
                     onchange="updateActiveSet(${exIndex}, ${setIndex}, 'weight', this.value)">
              <input type="number" class="set-input set-reps-input" 
                     value="${set.reps}" 
                     placeholder="0" 
                     onchange="updateActiveSet(${exIndex}, ${setIndex}, 'reps', this.value)">
              <button class="set-checkbox-btn ${set.completed ? 'checked' : ''}" 
                      onclick="toggleSetComplete(${exIndex}, ${setIndex})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          `).join('')}

          <button class="add-set-btn" onclick="addSetToActiveExercise(${exIndex})">+ Add Set</button>
        </div>
      </div>
    `;
  }).join('');
}

// Active Set Operations
window.updateActiveSet = function(exIndex, setIndex, field, value) {
  if (!AppState.activeWorkout) return;
  const set = AppState.activeWorkout.exercises[exIndex].sets[setIndex];
  if (set) {
    set[field] = Number(value) || 0;
    if (field === 'reps' && set.completed) {
      const nc = calcScrollCredit(AppState.activeWorkout.exercises[exIndex].name, set.reps);
      const diff = nc - (set.credit || 0);
      if (diff !== 0) addScrollCredit(diff);
      set.credit = nc;
    }
    saveState();
    renderActiveWorkout();
  }
};

window.toggleSetComplete = function(exIndex, setIndex) {
  if (!AppState.activeWorkout) return;
  const set = AppState.activeWorkout.exercises[exIndex].sets[setIndex];
  if (!set) return;

  set.completed = !set.completed;
  const exName = AppState.activeWorkout.exercises[exIndex].name;
  if (set.completed) {
    const credit = calcScrollCredit(exName, set.reps);
    set.credit = credit;
    if (credit > 0) addScrollCredit(credit, exName);
  } else if (set.credit) {
    addScrollCredit(-set.credit);
    set.credit = 0;
  }
  saveState();

  if (set.completed) {
    playSetCompletePing();
    triggerHaptic([40, 30, 70]);
    // Start rest timer
    requestNotifyPermission();
    triggerRestTimer(AppState.activeWorkout.restSeconds || AppState.settings.defaultRest);
  }

  renderActiveWorkout();
};

window.addSetToActiveExercise = function(exIndex) {
  if (!AppState.activeWorkout) return;
  const ex = AppState.activeWorkout.exercises[exIndex];
  const lastSet = ex.sets[ex.sets.length - 1];
  const newWeight = lastSet ? lastSet.weight : 50;
  const newReps = lastSet ? lastSet.reps : 10;

  ex.sets.push({ weight: newWeight, reps: newReps, completed: false });
  saveState();
  renderActiveWorkout();
  triggerHaptic([30]);
};

window.removeExerciseFromActive = function(exIndex) {
  if (!AppState.activeWorkout) return;
  if (confirm('Remove this exercise from current workout?')) {
    AppState.activeWorkout.exercises.splice(exIndex, 1);
    saveState();
    renderActiveWorkout();
  }
};

// --- Finish Workout & Record Calculation ---
window.finishActiveWorkout = function() {
  if (!AppState.activeWorkout) return;

  const workout = AppState.activeWorkout;
  const durationSecs = Math.max(1, Math.floor((Date.now() - workout.startTime) / 1000));
  
  let totalVolume = 0;
  let setsCount = 0;
  const recordedExercises = [];
  const newPRsEarned = [];

  workout.exercises.forEach(ex => {
    let bestWeight = 0;
    let bestReps = 0;
    let completedSetsCount = 0;

    ex.sets.forEach(set => {
      if (set.completed) {
        completedSetsCount++;
        setsCount++;
        const w = Number(set.weight) || 0;
        const r = Number(set.reps) || 0;
        totalVolume += w * r;

        if (w > bestWeight) {
          bestWeight = w;
          bestReps = r;
        }
      }
    });

    if (completedSetsCount > 0) {
      recordedExercises.push({
        name: ex.name,
        sets: completedSetsCount,
        bestWeight: bestWeight,
        bestReps: bestReps
      });

      // Check for PR
      const currentPR = AppState.prs[ex.name];
      if (!currentPR || bestWeight > currentPR.weight) {
        AppState.prs[ex.name] = {
          weight: bestWeight,
          reps: bestReps,
          date: new Date().toISOString()
        };
        newPRsEarned.push({
          name: ex.name,
          weight: bestWeight,
          oldWeight: currentPR ? currentPR.weight : 0
        });
      }
    }
  });

  if (setsCount === 0) {
    if (!confirm('No completed sets were logged. Finish and discard?')) {
      return;
    }
    AppState.activeWorkout = null;
    saveState();
    closeRestTimer();
    renderActiveWorkout();
    return;
  }

  // Create history entry
  const historyItem = {
    id: 'hist_' + Date.now(),
    title: workout.title || 'Workout Session',
    date: new Date().toISOString(),
    durationSeconds: durationSecs,
    volume: Math.round(totalVolume),
    unit: AppState.settings.unit,
    setsCount: setsCount,
    exercises: recordedExercises
  };

  const ranksBefore = getRankSnapshot();
  AppState.history.unshift(historyItem);
  AppState.activeWorkout = null;
  saveState();
  closeRestTimer();

  // Show celebration modal
  showCelebrationModal(historyItem, newPRsEarned);
  setTimeout(() => announceRankUps(ranksBefore), 600);
};

window.cancelActiveWorkout = function() {
  if (confirm('Are you sure you want to discard this entire workout?')) {
    AppState.activeWorkout = null;
    saveState();
    closeRestTimer();
    renderActiveWorkout();
  }
};

function showCelebrationModal(workout, newPRs) {
  document.getElementById('c-time').textContent = formatDuration(workout.durationSeconds);
  document.getElementById('c-volume').textContent = `${workout.volume} ${workout.unit}`;
  document.getElementById('c-sets').textContent = workout.setsCount;

  const prsBox = document.getElementById('celebration-prs-box');
  const prsList = document.getElementById('c-prs-list');

  if (newPRs.length > 0) {
    prsBox.classList.remove('hidden');
    prsList.innerHTML = newPRs.map(pr => `
      <div><strong>${escapeHtml(pr.name)}:</strong> ${pr.weight} ${AppState.settings.unit} (Previous: ${pr.oldWeight || 'None'} ${AppState.settings.unit})</div>
    `).join('');
  } else {
    prsBox.classList.add('hidden');
  }

  openModal('modal-celebration');
  triggerHaptic([100, 50, 100, 50, 200]);
}

// --- History View ---
function renderHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;

  if (AppState.history.length === 0) {
    container.innerHTML = `
      <div class="idle-placeholder">
        <p>No logged workouts yet. Complete a workout to see your gains timeline!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.history.map(item => {
    const dateFormatted = new Date(item.date).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    return `
      <div class="history-card">
        <div class="history-card-header">
          <div>
            <h3 class="history-title">${escapeHtml(item.title)}</h3>
            <span class="history-date">${dateFormatted}</span>
          </div>
        </div>

        <div class="history-stats-row">
          <div class="history-stat-item">⏱️ <strong>${formatDuration(item.durationSeconds)}</strong></div>
          <div class="history-stat-item">⚡ <strong>${item.volume.toLocaleString()} ${item.unit}</strong></div>
          <div class="history-stat-item">🎯 <strong>${item.setsCount} sets</strong></div>
        </div>

        <div class="history-ex-tags">
          ${item.exercises.map(ex => `
            <span class="history-tag">${escapeHtml(ex.name)} (${ex.bestWeight}${item.unit} × ${ex.bestReps})</span>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// --- PRs View ---
let prCategoryFilter = 'all';

function renderPRs() {
  const container = document.getElementById('prs-grid');
  if (!container) return;

  const entries = Object.entries(AppState.prs);
  if (entries.length === 0) {
    container.innerHTML = `<div class="idle-placeholder" style="grid-column: span 2;"><p>No Personal Records logged yet. Crush some weights to unlock PR trophies!</p></div>`;
    return;
  }

  const filtered = entries.filter(([name, data]) => {
    if (prCategoryFilter === 'all') return true;
    const ex = AppState.exercises.find(e => e.name === name);
    return ex && ex.category.toLowerCase() === prCategoryFilter.toLowerCase();
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="idle-placeholder" style="grid-column: span 2;"><p>No records in this muscle category yet.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(([name, data]) => {
    const ex = AppState.exercises.find(e => e.name === name);
    const cat = ex ? ex.category : 'General';
    const dateStr = new Date(data.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <div class="pr-card">
        <div class="pr-card-header">
          <span class="pr-cat">${escapeHtml(cat)}</span>
          <span style="font-size: 1.1rem;">🏆</span>
        </div>
        <div class="pr-name" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
        <div class="pr-value-box">
          <span class="pr-value">${data.weight}</span>
          <span class="pr-unit">${AppState.settings.unit} × ${data.reps} reps</span>
        </div>
        <span class="pr-date">${dateStr}</span>
      </div>
    `;
  }).join('');
}

// --- Exercise Picker & Search ---
let activePickerTarget = 'workout'; // 'workout' or 'routine_builder'
let pickerCategory = 'all';
let newRoutineSelectedExerciseIds = [];

function openExercisePicker(target = 'workout') {
  activePickerTarget = target;
  renderExercisePickerList();
  openModal('modal-add-exercise');
}

function renderExercisePickerList() {
  const container = document.getElementById('exercise-list-container');
  const searchInput = document.getElementById('exercise-search-input');
  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

  const filtered = AppState.exercises.filter(ex => {
    const matchesCat = pickerCategory === 'all' || ex.category.toLowerCase() === pickerCategory.toLowerCase();
    const matchesQuery = !query || ex.name.toLowerCase().includes(query) || ex.category.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  container.innerHTML = filtered.map(ex => `
    <div class="ex-picker-item" onclick="selectExercise('${ex.id}')">
      <span class="ex-picker-name">${escapeHtml(ex.name)}</span>
      <span class="ex-picker-cat">${escapeHtml(ex.category)}</span>
    </div>
  `).join('');
}

window.selectExercise = function(exId) {
  const ex = AppState.exercises.find(e => e.id === exId);
  if (!ex) return;

  if (activePickerTarget === 'workout') {
    if (!AppState.activeWorkout) {
      startBlankWorkout();
    }
    
    // Add to active workout
    const pr = AppState.prs[ex.name];
    const prevWeight = pr ? pr.weight : 40;
    const prevReps = pr ? pr.reps : 10;

    AppState.activeWorkout.exercises.push({
      exerciseId: ex.id,
      name: ex.name,
      category: ex.category,
      sets: [
        { weight: prevWeight, reps: prevReps, completed: false },
        { weight: prevWeight, reps: prevReps, completed: false },
        { weight: prevWeight, reps: prevReps, completed: false }
      ]
    });

    saveState();
    closeModal('modal-add-exercise');
    renderActiveWorkout();
    triggerHaptic([40]);
  } else if (activePickerTarget === 'routine_builder') {
    if (!newRoutineSelectedExerciseIds.includes(ex.id)) {
      newRoutineSelectedExerciseIds.push(ex.id);
    }
    renderRoutineBuilderExercises();
    closeModal('modal-add-exercise');
  }
};

function renderRoutineBuilderExercises() {
  const container = document.getElementById('routine-exercises-list');
  const countEl = document.getElementById('routine-selected-count');
  countEl.textContent = newRoutineSelectedExerciseIds.length;

  if (newRoutineSelectedExerciseIds.length === 0) {
    container.innerHTML = '<p class="placeholder-text">No exercises added yet.</p>';
    return;
  }

  container.innerHTML = newRoutineSelectedExerciseIds.map((id, idx) => {
    const ex = AppState.exercises.find(e => e.id === id);
    if (!ex) return '';
    return `
      <div class="builder-ex-item">
        <span>${escapeHtml(ex.name)} (${ex.category})</span>
        <button style="background:none;border:none;color:#ff3b30;cursor:pointer;font-weight:700;" onclick="removeBuilderEx(${idx})">&times;</button>
      </div>
    `;
  }).join('');
}

window.removeBuilderEx = function(idx) {
  newRoutineSelectedExerciseIds.splice(idx, 1);
  renderRoutineBuilderExercises();
};

// --- Modal Controls ---
window.openModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
};

// --- QR Code & Local Network Link Modal ---
function openQRModal() {
  const box = document.getElementById('qr-code-canvas-box');
  const input = document.getElementById('lan-url-input');
  const url = window.location.href;

  input.value = url;
  box.innerHTML = '';

  // Generate lightweight SVG QR code in browser
  generateQRCode(box, url, 180);
  openModal('modal-qr');
}

// Compact Pure JS QR Code generator using standard canvas
function generateQRCode(container, text, size) {
  // Use a reliable SVG/Canvas pattern or fallback Google chart / embedded QR algorithm
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Fill with clean background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // We load a high-speed data QR generator or create an interactive QR display
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    ctx.drawImage(img, 0, 0, size, size);
    container.appendChild(canvas);
  };
  img.onerror = function() {
    // If offline, draw stylized QR matrix pattern with center target
    drawOfflineQRFallback(ctx, size, text);
    container.appendChild(canvas);
  };
  // Use high-reliability public QR API with local fallback
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=1`;
}

function drawOfflineQRFallback(ctx, size, text) {
  ctx.fillStyle = '#060709';
  const cellSize = size / 21;
  // Corner markers
  function drawMarker(x, y) {
    ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = '#060709';
    ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
  }
  drawMarker(cellSize * 1, cellSize * 1);
  drawMarker(size - cellSize * 8, cellSize * 1);
  drawMarker(cellSize * 1, size - cellSize * 8);

  // Decorative dots
  for (let r = 8; r < 19; r += 2) {
    for (let c = 8; c < 19; c += 2) {
      if ((r + c + text.length) % 3 === 0) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize * 1.5, cellSize * 1.5);
      }
    }
  }
}

// --- Doomscroll Bank ---
// 2 minutes of scroll per pull-up / push-up rep, and per minute of plank (plank reps = seconds).
const SCROLL_SECONDS_PER_UNIT = 120;

function scrollKind(name) {
  const n = (name || '').toLowerCase();
  if (/pull[\s-]?up|push[\s-]?up/.test(n)) return 'rep';
  if (/plank/.test(n)) return 'plank';
  return null;
}

function calcScrollCredit(name, reps) {
  if (AppState.settings.requireCamera !== false) return 0; // only camera-verified reps earn time
  const kind = scrollKind(name);
  const r = Number(reps) || 0;
  if (kind === 'rep') return r * SCROLL_SECONDS_PER_UNIT;
  if (kind === 'plank') return Math.floor(r / 60) * SCROLL_SECONDS_PER_UNIT;
  return 0;
}

function scrollHint(name) {
  const kind = scrollKind(name);
  if (kind && AppState.settings.requireCamera !== false) return ' \u2022 use Camera Coach to earn scroll time';
  if (kind === 'rep') return ' \u2022 +2 min scroll / rep';
  if (kind === 'plank') return ' \u2022 reps = seconds, +2 min / minute';
  return '';
}

function formatRest(s) {
  return s < 60 ? s + ' sec' : (s % 60 === 0 ? (s / 60) + ' min' : Math.floor(s / 60) + ' min ' + (s % 60) + ' sec');
}

function fmtClock(sec) {
  sec = Math.max(0, Math.round(sec));
  return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
}

function addScrollCredit(seconds, exName) {
  ensureScrollState();
  AppState.scroll.balance = Math.max(0, AppState.scroll.balance + seconds);
  if (seconds > 0) {
    AppState.scroll.earnedTotal = (AppState.scroll.earnedTotal || 0) + seconds;
    showToast('\uD83D\uDCF1 +' + fmtClock(seconds) + ' scroll time earned' + (exName ? ' (' + exName + ')' : ''));
  }
  saveState();
  renderScroll();
  syncScrollToServer();
}

function scrollRemaining() {
  const s = AppState.scroll;
  if (s.sessionEndsAt) return Math.max(0, Math.ceil((s.sessionEndsAt - Date.now()) / 1000));
  return s.balance;
}

function renderScroll() {
  ensureScrollState();
  const s = AppState.scroll;
  const balEl = document.getElementById('scroll-balance');
  const btn = document.getElementById('btn-scroll-toggle');
  const sub = document.getElementById('scroll-sub');
  if (!balEl) return;
  balEl.textContent = fmtClock(scrollRemaining());
  const card = document.getElementById('scroll-card');
  if (s.sessionEndsAt) {
    btn.textContent = 'Stop & Save';
    sub.textContent = 'Scrolling... clock is ticking';
    card.classList.add('scrolling');
  } else {
    btn.textContent = 'Start Scrolling';
    sub.textContent = s.balance > 0 ? 'Banked time \u2013 spend it wisely' : 'Earn 2 min per pull-up, push-up & plank minute';
    card.classList.remove('scrolling');
  }
}

function toggleScrollSession() {
  const s = AppState.scroll;
  if (s.sessionEndsAt) {
    s.balance = scrollRemaining();
    s.sessionEndsAt = null;
  } else {
    if (s.balance <= 0) {
      showToast('\uD83D\uDD12 No scroll time. Do some pull-ups, push-ups or planks first!');
      return;
    }
    s.sessionEndsAt = Date.now() + s.balance * 1000;
    s.balance = 0;
    requestNotifyPermission();
  }
  saveState();
  renderScroll();
  syncScrollToServer();
}

function scrollTick() {
  if (!AppState.scroll) return;
  const s = AppState.scroll;
  if (s.sessionEndsAt && Date.now() >= s.sessionEndsAt) {
    s.sessionEndsAt = null;
    s.balance = 0;
    saveState();
    syncScrollToServer();
    playRestTimerChime();
    triggerHaptic([300, 100, 300]);
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => reg.showNotification('Scroll time is up!', { body: 'Reels & Shorts are locked. Go work out.', icon: 'app_icon_192.png' }));
      }
    } catch (e) {}
    const ov = document.getElementById('scroll-lock-overlay');
    if (ov) ov.classList.remove('hidden');
  }
  renderScroll();
}

window.closeScrollLock = function() {
  const ov = document.getElementById('scroll-lock-overlay');
  if (ov) ov.classList.add('hidden');
};

// Tell the PC server how much scroll time is live so the iOS Shortcut can block Reels/Shorts.
function syncScrollToServer() {
  const s = AppState.scroll;
  const remaining = s && s.sessionEndsAt ? scrollRemaining() : 0;
  try {
    fetch('/api/scroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remainingSeconds: remaining })
    }).catch(() => {});
  } catch (e) {}
}

// Utility: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- DOM Initialization & Event Handlers ---
// --- Colour Theme ---
const THEME_KEY = 'moon_theme';
const THEME_BAR_COLORS = { maroon: '#0B0709', lime: '#08090C', ocean: '#070B10', violet: '#0A0810', gold: '#0B0A07' };

function applyTheme(id) {
  if (!THEME_BAR_COLORS[id]) id = 'maroon';
  document.documentElement.setAttribute('data-theme', id);
  try { localStorage.setItem(THEME_KEY, id); } catch (e) {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_BAR_COLORS[id]);
  document.querySelectorAll('.theme-swatch').forEach(b =>
    b.classList.toggle('active', b.dataset.themeId === id));
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') || 'maroon');
  document.querySelectorAll('.theme-swatch').forEach(b =>
    b.addEventListener('click', () => applyTheme(b.dataset.themeId)));
});

document.addEventListener('DOMContentLoaded', () => {

  // Service Worker Registration for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Moon ServiceWorker registered', reg.scope))
      .catch(err => console.log('Moon ServiceWorker failed', err));
  }

  // Restore ongoing active workout if present
  if (AppState.activeWorkout) {
    startWorkoutTimer();
    renderActiveWorkout();
    switchTab('workout');
  } else {
    renderRoutines();
  }

  // Rest time selector (per workout)
  document.getElementById('active-rest-select').addEventListener('change', (e) => {
    if (AppState.activeWorkout) {
      AppState.activeWorkout.restSeconds = Number(e.target.value);
      saveState();
      requestNotifyPermission();
      showToast('Rest time set to ' + formatRest(Number(e.target.value)));
    }
  });

  // Doomscroll bank
  document.getElementById('btn-scroll-toggle').addEventListener('click', toggleScrollSession);
  const su = document.getElementById('scroll-status-url');
  if (su) su.textContent = 'http://' + location.hostname + ':8080/api/scroll';
  renderScroll();
  setInterval(scrollTick, 1000);
  syncScrollToServer();

  // Header QR buttons
  document.getElementById('qr-btn').addEventListener('click', openQRModal);
  document.getElementById('btn-show-qr-settings').addEventListener('click', openQRModal);
  document.getElementById('btn-copy-url').addEventListener('click', () => {
    const input = document.getElementById('lan-url-input');
    input.select();
    navigator.clipboard.writeText(input.value);
    alert('URL copied to clipboard! Open Safari on your iPhone and paste it.');
  });

  // Routine Buttons
  document.getElementById('btn-quick-workout').addEventListener('click', () => startBlankWorkout());
  document.getElementById('btn-idle-start-blank').addEventListener('click', () => startBlankWorkout());

  // Active Workout Actions
  document.getElementById('btn-finish-workout').addEventListener('click', () => finishActiveWorkout());
  document.getElementById('btn-cancel-workout').addEventListener('click', () => cancelActiveWorkout());
  document.getElementById('btn-add-exercise-active').addEventListener('click', () => openExercisePicker('workout'));

  document.getElementById('active-workout-name').addEventListener('input', (e) => {
    if (AppState.activeWorkout) {
      AppState.activeWorkout.title = e.target.value;
      saveState();
    }
  });

  // Rest Timer Controls
  document.getElementById('timer-btn-minus').addEventListener('click', () => {
    restTimeRemaining = Math.max(5, restTimeRemaining - 15);
    restEndsAt -= 15000;
    updateRestTimerUI();
    triggerHaptic([20]);
  });
  document.getElementById('timer-btn-plus').addEventListener('click', () => {
    restTimeRemaining += 30;
    restEndsAt += 30000;
    restTotalDuration += 30;
    updateRestTimerUI();
    triggerHaptic([20]);
  });
  document.getElementById('timer-btn-skip').addEventListener('click', () => {
    closeRestTimer();
    triggerHaptic([20]);
  });

  // Celebration Done Button
  document.getElementById('btn-celebration-done').addEventListener('click', () => {
    closeModal('modal-celebration');
    switchTab('history');
  });

  // Exercise Picker Search & Category Chips
  const exSearchInput = document.getElementById('exercise-search-input');
  exSearchInput.addEventListener('input', renderExercisePickerList);

  document.querySelectorAll('#exercise-category-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#exercise-category-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      pickerCategory = chip.dataset.cat;
      renderExercisePickerList();
    });
  });

  // Custom Exercise Creation
  document.getElementById('btn-save-custom-ex').addEventListener('click', () => {
    const nameInput = document.getElementById('custom-ex-name');
    const catSelect = document.getElementById('custom-ex-cat');
    const name = nameInput.value.trim();
    if (!name) return;

    const newEx = {
      id: 'ex_custom_' + Date.now(),
      name: name,
      category: catSelect.value
    };

    AppState.exercises.push(newEx);
    saveState();
    nameInput.value = '';
    renderExercisePickerList();
    triggerHaptic([40]);
  });

  // PR Category Filter Chips
  document.querySelectorAll('#pr-filter-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#pr-filter-chips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      prCategoryFilter = chip.dataset.filter;
      renderPRs();
    });
  });

  // Create Routine Modal
  document.getElementById('btn-create-routine').addEventListener('click', () => {
    newRoutineSelectedExerciseIds = [];
    document.getElementById('new-routine-name').value = '';
    document.getElementById('new-routine-tag').value = '';
    renderRoutineBuilderExercises();
    openModal('modal-create-routine');
  });

  document.getElementById('btn-builder-add-exercise').addEventListener('click', () => {
    openExercisePicker('routine_builder');
  });

  document.getElementById('btn-save-new-routine').addEventListener('click', () => {
    const name = document.getElementById('new-routine-name').value.trim();
    const tag = document.getElementById('new-routine-tag').value.trim();

    if (!name) {
      alert('Please enter a routine name.');
      return;
    }
    if (newRoutineSelectedExerciseIds.length === 0) {
      alert('Please pick at least one exercise.');
      return;
    }

    const newRoutine = {
      id: 'routine_' + Date.now(),
      name: name,
      tag: tag || 'Custom Routine',
      exerciseIds: [...newRoutineSelectedExerciseIds]
    };

    AppState.routines.push(newRoutine);
    saveState();
    closeModal('modal-create-routine');
    renderRoutines();
    triggerHaptic([60]);
  });

  // Settings: Unit Toggle
  document.querySelectorAll('#unit-toggle-group .unit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#unit-toggle-group .unit-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.settings.unit = btn.dataset.unit;
      saveState();
      renderRoutines();
      renderPRs();
      if (AppState.activeWorkout) renderActiveWorkout();
    });
  });

  // Set default unit active button
  document.querySelectorAll('#unit-toggle-group .unit-btn').forEach(btn => {
    if (btn.dataset.unit === AppState.settings.unit) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Settings: Default Rest Select
  const restSelect = document.getElementById('default-rest-select');
  restSelect.value = AppState.settings.defaultRest || 90;
  restSelect.addEventListener('change', (e) => {
    AppState.settings.defaultRest = Number(e.target.value);
    saveState();
  });

  // Settings: Toggles
  const soundToggle = document.getElementById('setting-sound');
  soundToggle.checked = AppState.settings.sound;
  soundToggle.addEventListener('change', (e) => {
    AppState.settings.sound = e.target.checked;
    saveState();
    if (e.target.checked) playSetCompletePing();
  });

  const hapticsToggle = document.getElementById('setting-haptics');
  hapticsToggle.checked = AppState.settings.haptics;
  hapticsToggle.addEventListener('change', (e) => {
    AppState.settings.haptics = e.target.checked;
    saveState();
    if (e.target.checked) triggerHaptic([50]);
  });

  const demoToggle = document.getElementById('setting-demo-mode');
  if (demoToggle) {
    demoToggle.checked = AppState.settings.demoMode === true;
    demoToggle.addEventListener('change', (e) => {
      AppState.settings.demoMode = e.target.checked;
      syncDemoState(AppState);
      saveState();
      updateOverviewStats();
      renderHistory();
      renderPRs();
      if (typeof renderRanks === 'function') renderRanks();
      showToast(e.target.checked ? 'Demo mode enabled (sample data loaded)' : 'Demo mode disabled');
    });
  }

  // Settings: Backup & Restore
  document.getElementById('btn-export-data').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `moon_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  document.getElementById('file-import-data').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported && imported.history && imported.exercises) {
          AppState = imported;
          saveState();
          alert('Data restored successfully!');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('btn-reset-demo').addEventListener('click', () => {
    if (confirm('Reset all workout history, PRs, and ranks to a clean state?')) {
      localStorage.removeItem(STORAGE_KEY);
      AppState = getInitialState();
      saveState();
      window.location.reload();
    }
  });

});
