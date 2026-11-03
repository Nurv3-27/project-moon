/**
 * Moon Fitness OS - Authentication, RBAC, Dual AI Assistants & Admin Citadel
 * Pitch-Black & Dark Maroon Architecture (v52)
 */

(function () {
  'use strict';

  const STORAGE_USERS = 'moon_users_db_v2';
  const STORAGE_SESSION = 'moon_auth_session_v2';
  const STORAGE_ANNOUNCEMENT = 'moon_admin_announcement_v1';

  // Seed Athletes with realistic Big 3 & Bodyweight stats for Leaderboards
  const DEFAULT_USERS = [
    {
      id: 'usr_admin',
      username: 'admin',
      displayName: 'Moon Architect',
      email: 'admin@moonfitness.os',
      password: 'admin',
      gender: 'male',
      role: 'Admin',
      aiCoach: 'Nurv',
      avatar: '👑',
      joinedDate: '2026-01-01',
      totalWorkouts: 42,
      totalVolumeKg: 128400,
      rankTier: 'Titan',
      prs: {
        'Barbell Bench Press': { weight: 145, reps: 5, date: '2026-10-28' },
        'Barbell Squat': { weight: 190, reps: 5, date: '2026-10-30' },
        'Deadlift': { weight: 235, reps: 3, date: '2026-11-01' }
      }
    },
    {
      id: 'usr_alex',
      username: 'alex_titan',
      displayName: 'Alex Rivera',
      email: 'alex@moonfitness.os',
      password: 'password',
      gender: 'male',
      role: 'Standard',
      aiCoach: 'Nurv',
      avatar: '♂',
      joinedDate: '2026-02-14',
      totalWorkouts: 36,
      totalVolumeKg: 94800,
      rankTier: 'Titan',
      prs: {
        'Barbell Bench Press': { weight: 140, reps: 6, date: '2026-10-25' },
        'Barbell Squat': { weight: 180, reps: 5, date: '2026-10-29' },
        'Deadlift': { weight: 220, reps: 4, date: '2026-11-02' }
      }
    },
    {
      id: 'usr_marcus',
      username: 'marcus_iron',
      displayName: 'Marcus Vance',
      email: 'marcus@moonfitness.os',
      password: 'password',
      gender: 'male',
      role: 'Standard',
      aiCoach: 'Nurv',
      avatar: '♂',
      joinedDate: '2026-03-01',
      totalWorkouts: 29,
      totalVolumeKg: 78500,
      rankTier: 'Diamond',
      prs: {
        'Barbell Bench Press': { weight: 130, reps: 8, date: '2026-10-20' },
        'Barbell Squat': { weight: 165, reps: 6, date: '2026-10-27' },
        'Deadlift': { weight: 205, reps: 5, date: '2026-10-31' }
      }
    },
    {
      id: 'usr_david',
      username: 'david_bulk',
      displayName: 'David Sterling',
      email: 'david@moonfitness.os',
      password: 'password',
      gender: 'male',
      role: 'Standard',
      aiCoach: 'Nurv',
      avatar: '♂',
      joinedDate: '2026-04-12',
      totalWorkouts: 22,
      totalVolumeKg: 64200,
      rankTier: 'Platinum',
      prs: {
        'Barbell Bench Press': { weight: 120, reps: 6, date: '2026-10-18' },
        'Barbell Squat': { weight: 155, reps: 5, date: '2026-10-26' },
        'Deadlift': { weight: 190, reps: 4, date: '2026-11-01' }
      }
    },
    {
      id: 'usr_leo',
      username: 'leo_forge',
      displayName: 'Leo Knight',
      email: 'leo@moonfitness.os',
      password: 'password',
      gender: 'male',
      role: 'Standard',
      aiCoach: 'Nurv',
      avatar: '♂',
      joinedDate: '2026-05-20',
      totalWorkouts: 17,
      totalVolumeKg: 49800,
      rankTier: 'Gold',
      prs: {
        'Barbell Bench Press': { weight: 105, reps: 8, date: '2026-10-15' },
        'Barbell Squat': { weight: 135, reps: 8, date: '2026-10-24' },
        'Deadlift': { weight: 170, reps: 5, date: '2026-10-30' }
      }
    },
    // Female Bracket (Division Maryam)
    {
      id: 'usr_maya',
      username: 'maya_valkyrie',
      displayName: 'Maya Chen',
      email: 'maya@moonfitness.os',
      password: 'password',
      gender: 'female',
      role: 'Standard',
      aiCoach: 'Maryam',
      avatar: '♀',
      joinedDate: '2026-01-20',
      totalWorkouts: 38,
      totalVolumeKg: 86400,
      rankTier: 'Titan',
      prs: {
        'Barbell Hip Thrust': { weight: 185, reps: 8, date: '2026-10-29' },
        'Barbell Squat': { weight: 135, reps: 5, date: '2026-10-31' },
        'Romanian Deadlift': { weight: 125, reps: 6, date: '2026-11-02' }
      }
    },
    {
      id: 'usr_elena',
      username: 'elena_apex',
      displayName: 'Elena Rostov',
      email: 'elena@moonfitness.os',
      password: 'password',
      gender: 'female',
      role: 'Standard',
      aiCoach: 'Maryam',
      avatar: '♀',
      joinedDate: '2026-02-18',
      totalWorkouts: 31,
      totalVolumeKg: 72100,
      rankTier: 'Diamond',
      prs: {
        'Barbell Hip Thrust': { weight: 170, reps: 8, date: '2026-10-26' },
        'Barbell Squat': { weight: 120, reps: 6, date: '2026-10-28' },
        'Romanian Deadlift': { weight: 115, reps: 6, date: '2026-11-01' }
      }
    },
    {
      id: 'usr_chloe',
      username: 'chloe_power',
      displayName: 'Chloe Hayes',
      email: 'chloe@moonfitness.os',
      password: 'password',
      gender: 'female',
      role: 'Standard',
      aiCoach: 'Maryam',
      avatar: '♀',
      joinedDate: '2026-03-10',
      totalWorkouts: 25,
      totalVolumeKg: 61500,
      rankTier: 'Platinum',
      prs: {
        'Barbell Hip Thrust': { weight: 155, reps: 10, date: '2026-10-22' },
        'Barbell Squat': { weight: 110, reps: 6, date: '2026-10-27' },
        'Romanian Deadlift': { weight: 100, reps: 8, date: '2026-10-30' }
      }
    },
    {
      id: 'usr_sienna',
      username: 'sienna_fit',
      displayName: 'Sienna Cross',
      email: 'sienna@moonfitness.os',
      password: 'password',
      gender: 'female',
      role: 'Standard',
      aiCoach: 'Maryam',
      avatar: '♀',
      joinedDate: '2026-04-05',
      totalWorkouts: 19,
      totalVolumeKg: 47200,
      rankTier: 'Gold',
      prs: {
        'Barbell Hip Thrust': { weight: 140, reps: 8, date: '2026-10-16' },
        'Barbell Squat': { weight: 95, reps: 8, date: '2026-10-25' },
        'Romanian Deadlift': { weight: 90, reps: 8, date: '2026-10-29' }
      }
    },
    {
      id: 'usr_zara',
      username: 'zara_blade',
      displayName: 'Zara Moreno',
      email: 'zara@moonfitness.os',
      password: 'password',
      gender: 'female',
      role: 'Standard',
      aiCoach: 'Maryam',
      avatar: '♀',
      joinedDate: '2026-05-15',
      totalWorkouts: 14,
      totalVolumeKg: 38600,
      rankTier: 'Silver',
      prs: {
        'Barbell Hip Thrust': { weight: 120, reps: 10, date: '2026-10-12' },
        'Barbell Squat': { weight: 85, reps: 8, date: '2026-10-21' },
        'Romanian Deadlift': { weight: 80, reps: 8, date: '2026-10-28' }
      }
    }
  ];

  // AI Assistant Profiles
  const AI_COACHES = {
    N: {
      id: 'Nurv',
      legacyId: 'N',
      gender: 'male',
      name: 'Coach Nurv',
      shortName: 'Nurv',
      title: 'Titan Bio-Strategist & Mechanical Overload Engine',
      tagline: 'Absolute tension. Biomechanical perfection. Relentless progression.',
      accentColor: '#E0506A',
      badgeBg: 'linear-gradient(135deg, #2E0B14, #4A0E1C)',
      avatarIcon: '⚡',
      sigilText: 'Nurv',
      voicePitch: 0.82,
      voiceRate: 1.0,
      greeting: "Greetings, athlete. Coach Nurv locked in. Mechanical tension and progressive overload are the law. What's our target today?",
      style: 'intense, stoic, mechanical, hyper-focused on form and overload'
    },
    M: {
      id: 'Maryam',
      legacyId: 'M',
      gender: 'female',
      name: 'Coach Maryam',
      shortName: 'Maryam',
      title: 'Valkyrie Precision Architect & High-Density Master',
      tagline: 'Kinetic elegance. Glute-posterior torque. Unstoppable cadence.',
      accentColor: '#F56E8A',
      badgeBg: 'linear-gradient(135deg, #3A0D22, #5C1336)',
      avatarIcon: '👑',
      sigilText: 'Maryam',
      voicePitch: 1.16,
      voiceRate: 1.04,
      greeting: "Welcome, warrior. Coach Maryam active. We sculpt symmetry through explosive torque and uncompromising discipline. Let's move.",
      style: 'sharp, disciplined, high-cadence, anatomical mastery'
    }
  };

  // Provide direct key aliases
  AI_COACHES.Nurv = AI_COACHES.N;
  AI_COACHES.nurv = AI_COACHES.N;
  AI_COACHES.Maryam = AI_COACHES.M;
  AI_COACHES.maryam = AI_COACHES.M;

  // State Management
  function loadUsersDB() {
    try {
      const raw = localStorage.getItem(STORAGE_USERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_USERS, JSON.stringify(DEFAULT_USERS));
    return [...DEFAULT_USERS];
  }

  function saveUsersDB(users) {
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
      // Optional async sync to local serve.py server
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
      }).catch(() => {});
    } catch (e) {}
  }

  function getActiveSession() {
    try {
      const raw = localStorage.getItem(STORAGE_SESSION);
      if (raw) {
        const user = JSON.parse(raw);
        if (user && user.id) return user;
      }
    } catch (e) {}
    // Default to Admin session on clean start for immediate evaluation
    const users = loadUsersDB();
    const admin = users.find(u => u.role === 'Admin') || users[0];
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(admin));
    return admin;
  }

  function setActiveSession(user) {
    try {
      localStorage.setItem(STORAGE_SESSION, JSON.stringify(user));
    } catch (e) {}
  }

  // --- Core Auth Controller ---
  window.AuthSystem = {
    currentUser: null,
    users: [],

    init: function () {
      this.users = loadUsersDB();
      this.currentUser = getActiveSession();
      this.applyUserContext();
      this.updateHeaderUI();
      this.initVoiceSynthesis();
    },

    getCoach: function () {
      if (!this.currentUser) return AI_COACHES.N;
      const c = String(this.currentUser.aiCoach || '').toLowerCase();
      if (c === 'm' || c.includes('maryam') || this.currentUser.gender === 'female') {
        return AI_COACHES.M;
      }
      return AI_COACHES.N;
    },

    applyUserContext: function () {
      if (!this.currentUser) return;
      const gender = this.currentUser.gender === 'female' ? 'female' : 'male';
      const coach = this.getCoach();

      // Ensure AppState and ranks body model lock to the user's gender
      if (window.AppState && window.AppState.settings) {
        window.AppState.settings.bodyGender = gender;
      }
      try {
        localStorage.setItem('moon_body_gender', gender);
      } catch (e) {}

      if (typeof window.setBodyGender === 'function') {
        window.setBodyGender(gender);
      }

      // Hide manual gender switchers for Standard users (locks automatically to their gender bracket)
      const isStandard = this.currentUser.role !== 'Admin';
      document.querySelectorAll('.anatomy-gender-toggle').forEach(el => {
        el.style.display = isStandard ? 'none' : 'inline-flex';
      });

      // Update AI Coach Pill and greeting
      this.updateHeaderUI();
      this.updateLeaderboardViews();
    },

    updateHeaderUI: function () {
      const u = this.currentUser;
      if (!u) return;

      const coach = this.getCoach();

      // Update floating chat bubble right above Settings tab
      const bubble = document.getElementById('tab-coach-chat-bubble');
      const bubbleName = document.getElementById('coach-bubble-name');
      const bubbleIcon = document.getElementById('coach-bubble-icon');
      const bubbleTail = bubble ? bubble.querySelector('.coach-bubble-tail') : null;
      if (bubble) {
        bubble.style.borderColor = coach.accentColor;
        bubble.style.background = coach.badgeBg;
        bubble.style.boxShadow = `0 4px 18px ${coach.accentColor}66, 0 2px 8px rgba(0, 0, 0, 0.8)`;
        bubble.setAttribute('data-coach', coach.shortName || coach.sigilText);
      }
      if (bubbleTail) {
        bubbleTail.style.borderTopColor = coach.accentColor;
      }
      if (bubbleName) bubbleName.textContent = coach.shortName || coach.sigilText;
      if (bubbleIcon) bubbleIcon.textContent = coach.avatarIcon;

      // Safe fallback for legacy header pill if present
      const coachPill = document.getElementById('header-ai-coach-pill');
      const coachLabel = document.getElementById('header-coach-label');
      const coachIcon = document.getElementById('header-coach-icon');
      if (coachLabel) coachLabel.textContent = coach.name;
      if (coachIcon) coachIcon.textContent = coach.sigilText;
      if (coachPill) {
        coachPill.style.borderColor = coach.accentColor;
        coachPill.setAttribute('data-coach', coach.id);
      }

      const userNameEl = document.getElementById('header-user-name');
      const userRoleEl = document.getElementById('header-user-role');
      const userAvatarEl = document.getElementById('header-user-avatar');
      if (userNameEl) userNameEl.textContent = u.displayName || u.username;
      if (userRoleEl) {
        userRoleEl.textContent = u.role.toUpperCase();
        userRoleEl.className = `user-role-badge ${u.role === 'Admin' ? 'admin' : 'standard'}`;
      }
      if (userAvatarEl) {
        userAvatarEl.textContent = u.gender === 'female' ? '♀' : '♂';
      }

      // Update athlete profile card in Settings
      const setAvatar = document.getElementById('settings-user-avatar');
      const setName = document.getElementById('settings-user-name');
      const setRole = document.getElementById('settings-user-role');
      const setHandle = document.getElementById('settings-user-handle');
      const setGender = document.getElementById('settings-user-gender');
      const setCoach = document.getElementById('settings-user-coach');

      if (setAvatar) setAvatar.textContent = u.avatar || (u.gender === 'female' ? '♀' : '♂');
      if (setName) setName.textContent = u.displayName || u.username;
      if (setRole) {
        setRole.textContent = u.role.toUpperCase();
        setRole.className = `user-role-badge ${u.role === 'Admin' ? 'admin' : 'standard'}`;
      }
      if (setHandle) setHandle.textContent = `@${u.username}`;
      if (setGender) setGender.textContent = u.gender === 'female' ? '♀ Female Athlete' : '♂ Male Athlete';
      if (setCoach) setCoach.textContent = `⚡ Assigned AI: ${coach.name}`;

      // Show/Hide Admin Action in Header and Settings
      const adminBtns = document.querySelectorAll('.admin-only-feature');
      adminBtns.forEach(btn => {
        btn.style.display = u.role === 'Admin' ? 'inline-flex' : 'none';
      });
    },

    updateCoachModalUI: function () {
      const coach = this.getCoach();
      const avatarCircle = document.getElementById('coach-avatar-circle');
      const title = document.getElementById('coach-modal-title');
      const subtitle = document.getElementById('coach-modal-subtitle');
      const tagline = document.getElementById('coach-tagline');
      const welcome = document.getElementById('coach-welcome-bubble');
      const msgAvatar = document.getElementById('coach-msg-avatar');
      const voiceLabel = document.getElementById('coach-voice-label');
      const voiceIcon = document.getElementById('coach-voice-icon');
      const modalHeader = document.getElementById('coach-modal-header');

      if (avatarCircle) {
        avatarCircle.textContent = coach.avatarIcon;
        avatarCircle.style.background = coach.badgeBg;
        avatarCircle.style.borderColor = coach.accentColor;
      }
      if (title) title.textContent = coach.name;
      if (subtitle) subtitle.innerHTML = `${coach.title} &bull; Active`;
      if (tagline) tagline.innerHTML = `&ldquo;${coach.tagline}&rdquo;`;
      if (welcome) welcome.textContent = coach.greeting;
      if (msgAvatar) {
        msgAvatar.textContent = coach.sigilText;
        msgAvatar.style.background = coach.accentColor;
      }
      if (voiceLabel) voiceLabel.textContent = this.voiceEnabled ? 'Voice: ON' : 'Voice: OFF';
      if (voiceIcon) voiceIcon.textContent = this.voiceEnabled ? '🔊' : '🔇';
      if (modalHeader) modalHeader.style.borderBottomColor = coach.accentColor;
    },

    // Sign Up with Mandatory Gender Selection & Role Validation
    signUp: function (data) {
      const { username, displayName, password, gender, role } = data;

      if (!username || !username.trim()) {
        throw new Error('Username is required.');
      }
      if (!password || password.length < 4) {
        throw new Error('Password must be at least 4 characters.');
      }
      if (!gender || (gender !== 'male' && gender !== 'female')) {
        throw new Error('Please select your gender (Male ♂ or Female ♀) to assign your AI Coach and Leaderboard bracket.');
      }

      const cleanUsername = username.trim().toLowerCase();
      const existing = this.users.find(u => u.username.toLowerCase() === cleanUsername);
      if (existing) {
        throw new Error(`Username "@${cleanUsername}" is already taken.`);
      }

      const assignedRole = (role === 'Admin' || data.adminSecret === 'MOON2026') ? 'Admin' : 'Standard';
      const assignedCoach = gender === 'female' ? 'Maryam' : 'Nurv';

      const newUser = {
        id: 'usr_' + Date.now(),
        username: cleanUsername,
        displayName: displayName && displayName.trim() ? displayName.trim() : username.trim(),
        email: data.email || `${cleanUsername}@moonfitness.os`,
        password: password,
        gender: gender,
        role: assignedRole,
        aiCoach: assignedCoach,
        avatar: gender === 'female' ? '♀' : '♂',
        joinedDate: new Date().toISOString().split('T')[0],
        totalWorkouts: 0,
        totalVolumeKg: 0,
        rankTier: 'Bronze',
        prs: {}
      };

      this.users.unshift(newUser);
      saveUsersDB(this.users);
      this.loginUserObject(newUser);

      const welcomeMsg = gender === 'female' 
        ? "Welcome, Athlete! Coach Maryam assigned. Female Division Leaderboard active." 
        : "Welcome, Athlete! Coach Nurv assigned. Male Division Leaderboard active.";
      
      this.speak(welcomeMsg);
      return newUser;
    },

    // Login by username/email and password
    login: function (identifier, password) {
      if (!identifier || !password) {
        throw new Error('Please provide both username and password.');
      }
      const clean = identifier.trim().toLowerCase();
      const user = this.users.find(u => u.username.toLowerCase() === clean || (u.email && u.email.toLowerCase() === clean));
      if (!user) {
        throw new Error('No athlete found with that username or email.');
      }
      if (user.password !== password) {
        throw new Error('Incorrect password.');
      }

      this.loginUserObject(user);
      return user;
    },

    loginUserObject: function (user) {
      this.currentUser = user;
      setActiveSession(user);
      this.applyUserContext();
      if (typeof window.showToast === 'function') {
        window.showToast(`Logged in as ${user.displayName} (${user.role})`);
      }
      if (typeof window.triggerHaptic === 'function') {
        window.triggerHaptic([30, 45]);
      }
      window.closeModal('modal-auth');
    },

    logout: function () {
      if (confirm('Log out of current account?')) {
        localStorage.removeItem(STORAGE_SESSION);
        this.currentUser = null;
        this.updateHeaderUI();
        window.openModal('modal-auth');
        if (typeof window.showToast === 'function') {
          window.showToast('Logged out. Please sign in or create an account.');
        }
      }
    },

    switchDemoAccount: function (type) {
      let target;
      if (type === 'admin') {
        target = this.users.find(u => u.role === 'Admin');
      } else if (type === 'male') {
        target = this.users.find(u => u.gender === 'male' && u.role !== 'Admin');
      } else if (type === 'female') {
        target = this.users.find(u => u.gender === 'female');
      }

      if (target) {
        this.loginUserObject(target);
      }
    },

    // Voice Synthesis Engine for Coach Nurv (Male) and Coach Maryam (Female)
    voiceEnabled: true,
    initVoiceSynthesis: function () {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {};
      }
    },

    speak: function (text) {
      if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const coach = this.getCoach();
        utterance.pitch = coach.voicePitch;
        utterance.rate = coach.voiceRate;

        const voices = window.speechSynthesis.getVoices() || [];
        if (coach.gender === 'female') {
          const femVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Karen') || v.name.includes('Google UK English Female')));
          if (femVoice) utterance.voice = femVoice;
        } else {
          const maleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('David') || v.name.includes('Alex') || v.name.includes('Google UK English Male')));
          if (maleVoice) utterance.voice = maleVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    },

    // AI Coach Chat Engine
    askCoach: function (query) {
      const coach = this.getCoach();
      const user = this.currentUser || {};
      const q = (query || '').toLowerCase().trim();

      let reply = '';
      if (q.includes('form') || q.includes('bench') || q.includes('squat') || q.includes('thrust') || q.includes('deadlift')) {
        if (coach.gender === 'male') {
          reply = `Lock in your scapulae retract-and-depress before unrack. Create mechanical tension by breaking the bar in half. 15-degree torso angle prevents joint impingement. Squeeze hard at the peak.`;
        } else {
          reply = `Anchor your ribcage to pelvis. In the hip thrust and squat, drive purely through heel-midfoot, tuck the chin and lock out with strong posterior pelvic tilt. Hold the contraction for 2 seconds.`;
        }
      } else if (q.includes('hype') || q.includes('motivation') || q.includes('ready') || q.includes('push')) {
        if (coach.gender === 'male') {
          reply = `The iron does not negotiate, ${user.displayName || 'warrior'}. You didn't come here to stay average. Load the plates, take your breath into the belly, and dominate every rep!`;
        } else {
          reply = `Every single rep builds your future physique, ${user.displayName || 'athlete'}. Channel the intensity. Focus your nervous system right now and let form translate into pure power!`;
        }
      } else if (q.includes('weight') || q.includes('progression') || q.includes('how much') || q.includes('overload')) {
        reply = `Based on your current streak and recovery, add +2.5kg to compound lifts today if you reached 8+ clean reps on your previous top set. If RPE is above 9, maintain and refine bar speed.`;
      } else if (q.includes('diet') || q.includes('food') || q.includes('protein') || q.includes('recovery')) {
        reply = `Aim for 2.0g to 2.2g of protein per kg of bodyweight, hydrate with 700ml electrolyte water intra-workout, and hit 8 hours of deep sleep to let CNS receptors regenerate.`;
      } else {
        if (coach.gender === 'male') {
          reply = `Coach Nurv analysis: Focus on controlled eccentrics (3 seconds down) and explosive concentrics. Mechanical tension builds Titans. Keep the intensity pinned!`;
        } else {
          reply = `Coach Maryam assessment: Keep rest intervals strictly under 90 seconds today to maintain metabolic density. Cadence and neuromuscular control create champions. Let's execute!`;
        }
      }

      this.speak(reply);
      return reply;
    },

    // Leaderboard Aggregator & Gender Filter
    getLeaderboard: function (genderFilter) {
      const allUsers = [...this.users];

      // If user has local active history/PRs, sync their stats dynamically
      if (this.currentUser && window.AppState) {
        const localUser = allUsers.find(u => u.id === this.currentUser.id);
        if (localUser) {
          const hist = window.AppState.history || [];
          let totalVol = 0;
          hist.forEach(h => totalVol += (h.volume || 0));
          if (totalVol > localUser.totalVolumeKg) localUser.totalVolumeKg = totalVol;
          if (hist.length > localUser.totalWorkouts) localUser.totalWorkouts = hist.length;
        }
      }

      const filtered = allUsers.filter(u => {
        if (genderFilter === 'both' || !genderFilter) return true;
        return u.gender === genderFilter;
      });

      // Sort by volume and calculated strength points
      return filtered.sort((a, b) => (b.totalVolumeKg || 0) - (a.totalVolumeKg || 0));
    },

    updateLeaderboardViews: function () {
      const container = document.getElementById('division-leaderboard-container');
      if (!container) return;

      const userGender = (this.currentUser && this.currentUser.gender) || 'male';
      const isFemale = userGender === 'female';
      const bracketLabel = isFemale ? 'Female Division (Division Maryam)' : 'Male Division (Division Nurv)';
      const coach = this.getCoach();
      const athletes = this.getLeaderboard(userGender);

      container.innerHTML = `
        <div class="leaderboard-header-banner" style="border-left: 4px solid ${coach.accentColor};">
          <div class="lb-header-copy">
            <span class="lb-badge-pill" style="background:${coach.badgeBg}; color:${coach.accentColor};">
              🔒 AUTO-FILTERED BRACKET
            </span>
            <h2 class="lb-title">${bracketLabel}</h2>
            <p class="lb-subtitle">Official standings for ${isFemale ? 'Female athletes mentored by Coach Maryam' : 'Male athletes mentored by Coach Nurv'}. Locked to your division standard.</p>
          </div>
          <div class="lb-coach-sigil" style="background:${coach.badgeBg}; border: 1.5px solid ${coach.accentColor};">
            <span>${coach.sigilText}</span>
          </div>
        </div>

        <div class="leaderboard-table-card">
          <div class="lb-table-head">
            <span class="col-rank">RANK</span>
            <span class="col-athlete">ATHLETE</span>
            <span class="col-tier">TIER</span>
            <span class="col-vol">TOTAL VOLUME</span>
            <span class="col-streak">WORKOUTS</span>
          </div>
          <div class="lb-table-body">
            ${athletes.map((ath, idx) => {
              const isMe = this.currentUser && this.currentUser.id === ath.id;
              const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
              return `
                <div class="lb-row ${isMe ? 'is-me' : ''}">
                  <span class="col-rank"><strong class="rank-pos">${medal}</strong></span>
                  <div class="col-athlete ath-info">
                    <span class="ath-avatar">${ath.avatar || (ath.gender === 'female' ? '♀' : '♂')}</span>
                    <div>
                      <strong class="ath-name">${escapeHtml(ath.displayName || ath.username)} ${isMe ? '<span class="you-pill">YOU</span>' : ''}</strong>
                      <span class="ath-handle">@${escapeHtml(ath.username)}</span>
                    </div>
                  </div>
                  <span class="col-tier"><span class="tier-pill ${ath.rankTier ? ath.rankTier.toLowerCase() : 'gold'}">${ath.rankTier || 'Gold'}</span></span>
                  <span class="col-vol mono">${Number(ath.totalVolumeKg || 0).toLocaleString()} kg</span>
                  <span class="col-streak mono">${ath.totalWorkouts || 0} sessions</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    },

    // Protected Admin Dashboard Controls
    openAdminDashboard: function () {
      if (!this.currentUser || this.currentUser.role !== 'Admin') {
        alert('ACCESS DENIED: Administrator privileges required to enter the Citadel Control Center.');
        return;
      }

      this.renderAdminView();
      window.openModal('modal-admin-dashboard');
      if (typeof window.triggerHaptic === 'function') {
        window.triggerHaptic([40, 60]);
      }
    },

    renderAdminView: function (filterMode = 'both') {
      const container = document.getElementById('admin-dashboard-content');
      if (!container) return;

      const maleAthletes = this.getLeaderboard('male');
      const femaleAthletes = this.getLeaderboard('female');
      const totalTonnage = this.users.reduce((acc, u) => acc + (u.totalVolumeKg || 0), 0);
      const totalWorkouts = this.users.reduce((acc, u) => acc + (u.totalWorkouts || 0), 0);

      container.innerHTML = `
        <div class="admin-top-stats-row">
          <div class="admin-stat-card">
            <span class="astat-label">REGISTERED ATHLETES</span>
            <span class="astat-val mono">${this.users.length}</span>
            <span class="astat-sub">♂ ${maleAthletes.length} Male &bull; ♀ ${femaleAthletes.length} Female</span>
          </div>
          <div class="admin-stat-card">
            <span class="astat-label">PLATFORM TONNAGE</span>
            <span class="astat-val mono">${Math.round(totalTonnage / 1000)} T</span>
            <span class="astat-sub">${totalTonnage.toLocaleString()} kg lifted</span>
          </div>
          <div class="admin-stat-card">
            <span class="astat-label">WORKOUT SESSIONS</span>
            <span class="astat-val mono">${totalWorkouts}</span>
            <span class="astat-sub">Completed gym logs</span>
          </div>
          <div class="admin-stat-card highlight">
            <span class="astat-label">CORE APP CACHE</span>
            <span class="astat-val mono">v52</span>
            <span class="astat-sub">Pitch-Black Maroon PWA</span>
          </div>
        </div>

        <!-- Section 1: Side-by-Side Dual Gender Leaderboard -->
        <div class="admin-section-header">
          <div class="ash-left">
            <h3>⚔️ Dual Gender Leaderboard (Side-by-Side Oversight)</h3>
            <p>Admin privilege active: gender filters bypassed for live side-by-side analysis.</p>
          </div>
          <div class="admin-view-toggle-chips" role="group">
            <button type="button" class="achip ${filterMode === 'both' ? 'active' : ''}" onclick="window.AuthSystem.renderAdminView('both')">Side-by-Side</button>
            <button type="button" class="achip ${filterMode === 'male' ? 'active' : ''}" onclick="window.AuthSystem.renderAdminView('male')">Male Division Only</button>
            <button type="button" class="achip ${filterMode === 'female' ? 'active' : ''}" onclick="window.AuthSystem.renderAdminView('female')">Female Division Only</button>
          </div>
        </div>

        <div class="admin-dual-boards-grid ${filterMode === 'both' ? 'side-by-side' : 'single'}">
          ${filterMode === 'both' || filterMode === 'male' ? `
            <div class="admin-board-col male-col">
              <div class="admin-board-col-header">
                <div class="col-head-title">
                  <span class="gender-symbol male">♂</span>
                  <strong>MALE DIVISION LEADERBOARD</strong>
                </div>
                <span class="col-head-badge">COACH NURV &bull; ${maleAthletes.length} ATHLETES</span>
              </div>
              <div class="admin-mini-table">
                ${maleAthletes.map((a, i) => `
                  <div class="admin-row-item">
                    <span class="ari-rank">#${i + 1}</span>
                    <div class="ari-user">
                      <strong>${escapeHtml(a.displayName || a.username)}</strong>
                      <small>@${escapeHtml(a.username)} &bull; ${a.rankTier || 'Gold'}</small>
                    </div>
                    <span class="ari-vol mono">${(a.totalVolumeKg || 0).toLocaleString()} kg</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${filterMode === 'both' || filterMode === 'female' ? `
            <div class="admin-board-col female-col">
              <div class="admin-board-col-header">
                <div class="col-head-title">
                  <span class="gender-symbol female">♀</span>
                  <strong>FEMALE DIVISION LEADERBOARD</strong>
                </div>
                <span class="col-head-badge">COACH MARYAM &bull; ${femaleAthletes.length} ATHLETES</span>
              </div>
              <div class="admin-mini-table">
                ${femaleAthletes.map((a, i) => `
                  <div class="admin-row-item">
                    <span class="ari-rank">#${i + 1}</span>
                    <div class="ari-user">
                      <strong>${escapeHtml(a.displayName || a.username)}</strong>
                      <small>@${escapeHtml(a.username)} &bull; ${a.rankTier || 'Gold'}</small>
                    </div>
                    <span class="ari-vol mono">${(a.totalVolumeKg || 0).toLocaleString()} kg</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Section 2: User Data Management -->
        <div class="admin-section-header" style="margin-top:28px;">
          <div class="ash-left">
            <h3>👥 Athlete User Accounts &amp; RBAC Directory</h3>
            <p>Manage accounts, toggle roles (Standard / Admin), inspect profiles, or register athletes.</p>
          </div>
          <button type="button" class="primary-glow-btn small-btn" onclick="window.AuthSystem.promptCreateAthlete()">+ Register Athlete</button>
        </div>

        <div class="admin-users-table-card">
          <div class="aut-table-head">
            <span class="col-u-user">ATHLETE</span>
            <span class="col-u-gender">GENDER</span>
            <span class="col-u-coach">AI COACH</span>
            <span class="col-u-role">ROLE (RBAC)</span>
            <span class="col-u-joined">JOINED</span>
            <span class="col-u-actions">ACTIONS</span>
          </div>
          <div class="aut-table-body">
            ${this.users.map(u => `
              <div class="aut-row">
                <div class="col-u-user aut-name-col">
                  <span class="aut-avatar">${u.avatar || (u.gender === 'female' ? '♀' : '♂')}</span>
                  <div>
                    <strong>${escapeHtml(u.displayName || u.username)}</strong>
                    <small>@${escapeHtml(u.username)}</small>
                  </div>
                </div>
                <span class="col-u-gender"><span class="gender-pill ${u.gender}">${u.gender === 'female' ? '♀ Female' : '♂ Male'}</span></span>
                <span class="col-u-coach"><strong style="color:${u.gender === 'female' ? '#F56E8A' : '#E0506A'}">Coach ${u.gender === 'female' ? 'Maryam' : 'Nurv'}</strong></span>
                <span class="col-u-role">
                  <button type="button" class="role-toggle-btn ${u.role === 'Admin' ? 'admin' : 'standard'}" onclick="window.AuthSystem.toggleUserRole('${u.id}')" title="Click to toggle role">
                    ${u.role === 'Admin' ? '👑 Admin' : 'Standard'}
                  </button>
                </span>
                <span class="col-u-joined mono">${u.joinedDate || '2026-01-01'}</span>
                <div class="col-u-actions">
                  <button type="button" class="action-mini-btn edit" onclick="window.AuthSystem.editUserPrompt('${u.id}')" title="Edit Athlete">&#9998;</button>
                  ${u.username !== 'admin' ? `
                    <button type="button" class="action-mini-btn del" onclick="window.AuthSystem.deleteUser('${u.id}')" title="Delete Athlete">&times;</button>
                  ` : '<span style="color:var(--text-dim); font-size:0.75rem;">Root</span>'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 3: App Updates & Platform Oversight -->
        <div class="admin-section-header" style="margin-top:28px;">
          <div class="ash-left">
            <h3>📡 App Updates, System Telemetry &amp; Broadcasts</h3>
            <p>Push instant notifications, inspect Service Worker status, or export database snapshots.</p>
          </div>
        </div>

        <div class="admin-controls-grid">
          <div class="admin-control-box">
            <h4>📢 Broadcast Announcement Banner</h4>
            <p>Pushes an instant top alert banner visible to all athletes across their sessions.</p>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <input type="text" id="admin-broadcast-input" class="ios-input" placeholder="e.g. Titan Division Tournament begins Friday!">
              <button type="button" class="primary-glow-btn small-btn" onclick="window.AuthSystem.broadcastAnnouncement()">Post</button>
            </div>
          </div>

          <div class="admin-control-box">
            <h4>🔄 Cache Invalidation &amp; Update Dispatch</h4>
            <p>Triggers immediate Service Worker cache eviction and prompts clients to upgrade to v52.</p>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button type="button" class="secondary-btn small-btn" onclick="window.AuthSystem.forceCacheUpdate()">Force Client Update (v52)</button>
              <button type="button" class="secondary-btn small-btn" onclick="window.AuthSystem.exportDatabaseJSON()">Export DB JSON</button>
            </div>
          </div>
        </div>
      `;
    },

    toggleUserRole: function (userId) {
      const u = this.users.find(x => x.id === userId);
      if (!u) return;
      if (u.username === 'admin') {
        alert('The root Admin account cannot be demoted.');
        return;
      }
      u.role = u.role === 'Admin' ? 'Standard' : 'Admin';
      saveUsersDB(this.users);
      this.renderAdminView();
      if (this.currentUser && this.currentUser.id === u.id) {
        this.currentUser.role = u.role;
        setActiveSession(this.currentUser);
        this.updateHeaderUI();
      }
      if (typeof window.showToast === 'function') {
        window.showToast(`Updated @${u.username} role to ${u.role}`);
      }
    },

    deleteUser: function (userId) {
      const u = this.users.find(x => x.id === userId);
      if (!u) return;
      if (u.username === 'admin') {
        alert('Cannot delete root admin.');
        return;
      }
      if (!confirm(`Delete athlete account @${u.username}? This cannot be undone.`)) return;

      this.users = this.users.filter(x => x.id !== userId);
      saveUsersDB(this.users);
      this.renderAdminView();
      if (typeof window.showToast === 'function') {
        window.showToast(`Deleted athlete @${u.username}`);
      }
    },

    editUserPrompt: function (userId) {
      const u = this.users.find(x => x.id === userId);
      if (!u) return;
      const newName = prompt('Enter new display name:', u.displayName || u.username);
      if (newName && newName.trim()) {
        u.displayName = newName.trim();
        saveUsersDB(this.users);
        this.renderAdminView();
        if (typeof window.showToast === 'function') {
          window.showToast('Updated athlete details');
        }
      }
    },

    promptCreateAthlete: function () {
      const name = prompt('Athlete Full Name:');
      if (!name) return;
      const username = prompt('Unique Username:');
      if (!username) return;
      const gender = confirm('Select OK for ♂ MALE or Cancel for ♀ FEMALE athlete:') ? 'male' : 'female';
      const role = confirm('Select OK for Standard Athlete or Cancel for Admin:') ? 'Standard' : 'Admin';

      try {
        const created = this.signUp({
          displayName: name,
          username: username,
          password: 'password',
          gender: gender,
          role: role
        });
        this.renderAdminView();
        alert(`Athlete @${created.username} created successfully in ${gender === 'female' ? 'Female Division Maryam' : 'Male Division Nurv'}!`);
      } catch (err) {
        alert(err.message);
      }
    },

    broadcastAnnouncement: function () {
      const input = document.getElementById('admin-broadcast-input');
      if (!input || !input.value.trim()) return;
      const msg = input.value.trim();
      localStorage.setItem(STORAGE_ANNOUNCEMENT, msg);
      this.applyAnnouncementBanner(msg);
      if (typeof window.showToast === 'function') {
        window.showToast('Announcement posted to all athletes!');
      }
      input.value = '';
    },

    applyAnnouncementBanner: function (msg) {
      let banner = document.getElementById('platform-announcement-banner');
      if (!msg) {
        if (banner) banner.remove();
        return;
      }
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'platform-announcement-banner';
        banner.className = 'platform-announcement-banner';
        const header = document.querySelector('.app-header');
        if (header) header.insertAdjacentElement('afterend', banner);
      }
      banner.innerHTML = `
        <span class="pab-badge">CITADEL ANNOUNCEMENT</span>
        <span class="pab-text">${escapeHtml(msg)}</span>
        <button type="button" class="pab-close" onclick="this.parentElement.remove()">&times;</button>
      `;
    },

    forceCacheUpdate: function () {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          for (let reg of regs) reg.update();
        });
      }
      if (typeof window.showToast === 'function') {
        window.showToast('Cache update signaled! Reloading client...');
      }
      setTimeout(() => location.reload(), 800);
    },

    exportDatabaseJSON: function () {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.users, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `moon_athletes_database_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  // Helper escape
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    window.AuthSystem.init();

    // Check announcement
    const savedAnn = localStorage.getItem(STORAGE_ANNOUNCEMENT);
    if (savedAnn) {
      window.AuthSystem.applyAnnouncementBanner(savedAnn);
    }
  });

})();
