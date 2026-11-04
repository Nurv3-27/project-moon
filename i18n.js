/**
 * Moon Fitness OS - Futuristic Internationalization (i18n) Engine
 * Pitch-Black & Neon-Maroon Aesthetic
 * Strict RTL (Right-to-Left) & Arabic (العربية) Support
 */

(function () {
  'use strict';

  const STORAGE_LANG = 'moon_app_lang';

  const TRANSLATIONS = {
    en: {
      // General / Brand
      app_title: 'MOON OS',
      app_tagline: 'GYM & FOCUS OS • ATHLETE CITADEL',
      brand_kicker: 'PITCH-BLACK & DARK MAROON ARCHITECTURE',
      lang_name_en: 'English',
      lang_name_ar: 'العربية',

      // Navigation Tabs
      tab_workout: 'Workout Hub',
      tab_focus: 'Focus',
      tab_history: 'History',
      tab_ranks: 'Ranks & PRs',
      tab_settings: 'Settings',

      // Header
      header_antiscroll_kicker: '1-TAP SHIELD',
      header_antiscroll_active: 'SHIELD ON',
      header_antiscroll_idle: 'SHIELD OFF',
      admin_citadel_pill: 'ADMIN CITADEL',

      // Splash Screen
      splash_quote: '“Are you ready to take it to the moon?”',
      splash_start_heading: 'START YOUR ODYSSEY',
      splash_btn_signup: 'Sign Up',
      splash_btn_signup_sub: 'New Athlete • Select Coach',
      splash_btn_login: 'Login',
      splash_btn_login_sub: 'Existing Athlete • Sign In',
      splash_guest_workout: '🏋️ Workout Hub →',
      splash_guest_focus: '🛡️ Anti-Scroll Focus →',

      // Workout Tab
      workout_hero_subtitle: 'READY TO ASCEND?',
      workout_hero_title: 'Workout Hub',
      workout_btn_new_routine: '+ New Routine',
      workout_btn_empty_workout: '⚡ Quick Start Empty Workout',
      workout_search_placeholder: 'Search saved & featured routines...',
      workout_tab_saved: 'Saved Routines',
      workout_tab_featured: 'Featured Splits',
      workout_tab_recommended: 'Recommended',
      cosmic_roadmap_title: 'COSMIC PROGRESSION ROADMAP',
      cosmic_roadmap_sub: 'Earth to Maroon Moon • Streak Odyssey',
      streak_label: 'ACTIVE STREAK',
      streak_days: 'DAYS',
      start_routine_btn: 'Start Workout',

      // Focus Tab
      focus_hero_subtitle: 'ANTI-SCROLL & APP BLOCKER',
      focus_hero_title: 'Focus',
      antiscroll_hero_kicker: '1-TAP ANTI-SCROLL SHIELD',
      antiscroll_hero_title_active: 'ANTI-SCROLL SHIELD ACTIVE 🛡️',
      antiscroll_hero_title_idle: 'TAP TO ACTIVATE ANTI-SCROLL SHIELD',
      antiscroll_hero_sub: 'Blocks endless Reels, Shorts & distracting feeds while keeping IG Chat Inbox & friend-sent Reels unlocked.',
      antiscroll_pill_active: 'PROTECTED',
      antiscroll_pill_idle: 'ACTIVATE',

      // Focus Tab: Opal Controls
      instant_block_title: 'Instant Block',
      instant_lockdown_title: 'Instant Lockdown',
      instant_block_badge_start: 'START',
      instant_block_badge_end: 'END',
      instant_block_sub_start: '15M LOCKDOWN • TAP TO BEGIN',
      instant_block_sub_active: 'APPS RESTRICTED • ACTIVE',
      scheduled_block_title: 'Scheduled Block',
      scheduled_badge_active: 'ACTIVE',
      scheduled_badge_paused: 'PAUSED',
      scheduled_sub_default: 'MON-FRI • 09:00 - 17:00',
      start_time_label: 'START TIME',
      end_time_label: 'END TIME',
      repeat_days_label: 'ACTIVE REPEAT DAYS',
      distraction_targets_heading: 'DESIGNATED DISTRACTION TARGETS',
      target_yt_shorts: 'YouTube Shorts (/shorts/*)',
      target_yt_shorts_desc: 'Locks addictive short-form video loop',
      target_games: 'Mobile & PC Distraction Games',
      target_games_desc: 'Designated gaming apps & web portals',
      target_ig_reels: 'Instagram Reels & Home Feeds',
      target_ig_reels_desc: 'Permits DM Inbox & friend-sent reels only',
      target_tiktok: 'TikTok & Fast Feeds',
      target_tiktok_desc: 'Enforces zero-doomscroll protocol',
      custom_apps_heading: 'CUSTOM DESIGNATED APPS & SITES',
      custom_app_placeholder: 'Add custom app / website (e.g. reddit.com)...',
      add_btn: 'Add',
      scroll_bank_heading: 'EARNED SCROLL TIME BANK',
      scroll_bank_sub: 'Earn scroll time by lifting weights (1 kg volume = 0.05s). Bank remains intact during lockdown.',
      bank_balance_label: 'BANKED SCROLL TIME',

      // Focus Tab: Hold to Cancel
      hold_to_cancel: 'Hold to Pause/Cancel',
      hold_active_title: 'HOLD TO CANCEL',
      hold_hint: 'Press and hold for 3 seconds to cancel active lockdown',
      hold_timer_prefix: 'Hold 3s',
      hold_releasing_prefix: 'Releasing in ',
      hold_cancelled_toast: '🛑 Lockdown successfully cancelled after 3s hold!',
      hold_early_toast: '⚠️ Keep holding for full 3 seconds to break lockdown!',
      hold_protected_alert: '⚠️ Active lockdown protected! Press and hold the Cancel button for 3 seconds.',

      // History Tab
      history_hero_subtitle: 'WORKOUT ARCHIVE',
      history_hero_title: 'History',
      stat_total_sessions: 'TOTAL SESSIONS',
      stat_total_volume: 'TOTAL VOLUME',
      stat_calories: 'CALORIES BURNED',
      history_empty: 'No recorded workouts yet. Complete a workout session to build your archive!',

      // Ranks & PRs Tab
      ranks_hero_subtitle: 'ANATOMICAL PR CITADEL',
      ranks_hero_title: 'Ranks & PRs',
      ranks_overall_score: 'OVERALL STRENGTH SCORE',
      ranks_male_bracket: 'Male Division (Division Nurv)',
      ranks_female_bracket: 'Female Division (Division Maryam)',
      ranks_auto_filtered: '🔒 AUTO-FILTERED BRACKET',
      ranks_bench_press: 'Barbell Bench Press',
      ranks_squat: 'Barbell Squat',
      ranks_deadlift: 'Deadlift',
      ranks_hip_thrust: 'Barbell Hip Thrust',
      ranks_rdl: 'Romanian Deadlift',

      // Settings Tab
      settings_hero_subtitle: 'PREFERENCES & SETUP',
      settings_hero_title: 'Settings',
      athlete_role_standard: 'STANDARD ATHLETE',
      athlete_role_admin: 'MOON ARCHITECT (ADMIN)',
      settings_btn_talk_coach: '💬 Talk to Coach',
      settings_btn_switch_coach: '🔄 Switch AI Coach',
      settings_btn_switch_account: 'Switch / Sign In',
      settings_btn_logout: 'Log Out',
      admin_card_title: 'Obsidian Citadel Control Center',
      admin_card_desc: 'Monitor male & female leaderboards side-by-side without gender filters, manage all athlete accounts, and oversee app updates.',
      admin_card_btn: 'Enter Admin Dashboard →',
      ios_card_title: 'Open on iPhone & Add to Home Screen',
      ios_card_desc: 'Scan the Wi-Fi QR code with your iPhone camera to instantly launch MOON FITNESS OS on Safari, then add to Home Screen for fullscreen gym tracking.',
      ios_btn_qr: 'Show iPhone Wi-Fi QR Code',
      settings_group_appearance: 'Appearance & UI Accent Colors',
      settings_group_preferences: 'General Preferences',
      lang_setting_name: 'Language / اللغة',
      lang_setting_desc: 'Choose English (LTR) or العربية (Strict RTL)',
      weight_unit_name: 'Weight Unit',
      weight_unit_desc: 'Choose between Kilograms (KG) and Pounds (LBS)',
      rest_timer_name: 'Default Rest Timer',
      rest_timer_desc: 'Auto-triggered timer after completing a set',
      sound_name: 'Audio Sound Effects',
      sound_desc: 'Chimes for timers, pings, and completion cues',
      haptics_name: 'Tactile Haptic Feedback',
      haptics_desc: 'Vibration pulses during touches and set logs',
      faq_group_title: 'FAQ & Blocker Guide',
      faq_group_desc: 'Everything you need to know about AI Coaches and Instagram/Shorts blocking',

      // Dual AI Coach Modal
      coach_nurv_name: 'Coach Nurv',
      coach_nurv_title: 'Titan Bio-Strategist • Mechanical Overload Engine',
      coach_nurv_tagline: 'Absolute tension. Biomechanical perfection. Relentless progression.',
      coach_nurv_greeting: "Greetings, athlete. Coach Nurv locked in. Mechanical tension and progressive overload are the law. What's our target today?",
      coach_maryam_name: 'Coach Maryam',
      coach_maryam_title: 'Valkyrie Precision Architect • High-Density Master',
      coach_maryam_tagline: 'Kinetic elegance. Glute-posterior torque. Unstoppable cadence.',
      coach_maryam_greeting: "Welcome, warrior. Coach Maryam active. We sculpt symmetry through explosive torque and uncompromising discipline. Let's move.",
      coach_voice_on: 'Voice: ON',
      coach_voice_off: 'Voice: OFF',
      coach_prompt_form_cues: '📐 Form Cues',
      coach_prompt_fix_form: '🛠️ Fix Form',
      coach_prompt_pain_triage: '⚠️ Pain Triage',
      coach_prompt_diet_macros: '🥗 Diet & Macros',
      coach_prompt_workout_splits: '📅 Workout Splits',
      coach_prompt_gym_guidance: '⚡ Gym Guidance',
      coach_input_placeholder: 'Ask your dedicated AI Coach anything...',
      send_btn: 'Send →',

      // Auth Modal
      auth_tab_signin: 'Sign In',
      auth_tab_signup: 'Create Account',
      auth_signin_heading: 'Sign In to Your Account',
      auth_signup_heading: 'Create Athlete Account',
      auth_field_username: 'Username',
      auth_field_password: 'Password',
      auth_field_fullname: 'Full Name / Display Name',
      auth_gender_heading: 'Select Athlete Gender (Mandatory for PR Leaderboard)',
      auth_coach_heading: 'Select Dedicated AI Coach (Free Choice)',
      auth_btn_submit_signin: 'Sign In to Citadel →',
      auth_btn_submit_signup: 'Create Account & Assign Coach →'
    },

    ar: {
      // General / Brand
      app_title: 'نظام موون',
      app_tagline: 'نظام اللياقة والتركيز • قلعة الرياضيين',
      brand_kicker: 'تصميم فائق باللونين الأسود الحالك والمارون النيون',
      lang_name_en: 'English',
      lang_name_ar: 'العربية',

      // Navigation Tabs
      tab_workout: 'مركز التمارين',
      tab_focus: 'التركيز',
      tab_history: 'السجل',
      tab_ranks: 'التصنيف والأرقام',
      tab_settings: 'الإعدادات',

      // Header
      header_antiscroll_kicker: 'درع التمرير',
      header_antiscroll_active: 'الدرع مفعّل',
      header_antiscroll_idle: 'الدرع معطّل',
      admin_citadel_pill: 'قلعة الإدارة',

      // Splash Screen
      splash_quote: '«هل أنت مستعد للانطلاق نحو القمر؟»',
      splash_start_heading: 'ابدأ رحلتك الرياضية',
      splash_btn_signup: 'إنشاء حساب جديد',
      splash_btn_signup_sub: 'رياضي جديد • اختر مدربك الذكي',
      splash_btn_login: 'تسجيل الدخول',
      splash_btn_login_sub: 'رياضي حالي • دخول مباشر',
      splash_guest_workout: '🏋️ مركز التمارين ←',
      splash_guest_focus: '🛡️ تركيز ضد التشتت ←',

      // Workout Tab
      workout_hero_subtitle: 'مستعد للارتقاء؟',
      workout_hero_title: 'مركز التمارين',
      workout_btn_new_routine: '+ جدول جديد',
      workout_btn_empty_workout: '⚡ بدء تمرين فارغ سريع',
      workout_search_placeholder: 'ابحث في التمارين المحفوظة والمميزة...',
      workout_tab_saved: 'تماريني المحفوظة',
      workout_tab_featured: 'جداول مميزة',
      workout_tab_recommended: 'الموصى بها',
      cosmic_roadmap_title: 'خريطة التقدم الكونية',
      cosmic_roadmap_sub: 'من الأرض إلى القمر الماروني • ملحمة الاستمرارية',
      streak_label: 'سلسلة الأيام النشطة',
      streak_days: 'أيام متتالية',
      start_routine_btn: 'بدء التمرين',

      // Focus Tab
      focus_hero_subtitle: 'مانع التمرير وحظر التطبيقات',
      focus_hero_title: 'التركيز',
      antiscroll_hero_kicker: 'درع منع التمرير بلمسة واحدة',
      antiscroll_hero_title_active: 'درع منع التمرير مفعّل بنجاح 🛡️',
      antiscroll_hero_title_idle: 'المس لتفعيل درع منع التمرير',
      antiscroll_hero_sub: 'يحظر ريلز وشورتس والخلاصات اللانهائية ويحافظ على صندوق الرسائل الخاصة مع الأصدقاء مفتوحاً.',
      antiscroll_pill_active: 'محمي',
      antiscroll_pill_idle: 'تفعيل',

      // Focus Tab: Opal Controls
      instant_block_title: 'حظر فوري',
      instant_lockdown_title: 'إغلاق فوري مشدد',
      instant_block_badge_start: 'بدء',
      instant_block_badge_end: 'إنهاء',
      instant_block_sub_start: 'إغلاق لمدة 15 دقيقة • انقر للبدء',
      instant_block_sub_active: 'التطبيقات مقيدة • الحظر نشط',
      scheduled_block_title: 'حظر مجدول',
      scheduled_badge_active: 'مفعّل',
      scheduled_badge_paused: 'متوقف',
      scheduled_sub_default: 'الإثنين - الجمعة • 09:00 - 17:00',
      start_time_label: 'وقت البدء',
      end_time_label: 'وقت الانتهاء',
      repeat_days_label: 'أيام التكرار النشطة',
      distraction_targets_heading: 'التطبيقات والمنصات المحظورة',
      target_yt_shorts: 'يوتيوب شورتس (/shorts/*)',
      target_yt_shorts_desc: 'يحظر حلقة الفيديوهات القصيرة الإدمانية',
      target_games: 'ألعاب الهاتف والكمبيوتر المشتتة',
      target_games_desc: 'التطبيقات والألعاب المحددة والمواقع',
      target_ig_reels: 'ريلز وخلاصة إنستغرام',
      target_ig_reels_desc: 'يسمح فقط بصندوق المحادثات والريلز المرسلة من الأصدقاء',
      target_tiktok: 'تيك توك وخلاصات الفيديو السريع',
      target_tiktok_desc: 'يطبق بروتوكول منع التمرير اللانهائي',
      custom_apps_heading: 'تطبيقات ومواقع مخصصة للحظر',
      custom_app_placeholder: 'أضف تطبيق أو موقع مخصص (مثل reddit.com)...',
      add_btn: 'إضافة',
      scroll_bank_heading: 'بنك وقت التمرير المكتسب',
      scroll_bank_sub: 'اكسب وقت تصفح بممارسة رفع الأثقال (1 كغ وزن مرفوع = 0.05 ثانية). يظل رصيدك محفوظاً أثناء الحظر.',
      bank_balance_label: 'رصيد التصفح المكتسب',

      // Focus Tab: Hold to Cancel
      hold_to_cancel: 'اضغط مطولاً للإيقاف / الإلغاء',
      hold_active_title: 'اضغط للإلغاء',
      hold_hint: 'اضغط باستمرار لمدة 3 ثوانٍ لإلغاء الحظر النشط',
      hold_timer_prefix: 'اضغط 3 ثوانٍ',
      hold_releasing_prefix: 'الإلغاء خلال ',
      hold_cancelled_toast: '🛑 تم إلغاء الحظر بنجاح بعد الضغط لمدة 3 ثوانٍ!',
      hold_early_toast: '⚠️ استمر بالضغط لمدة 3 ثوانٍ كاملة لكسر الحظر!',
      hold_protected_alert: '⚠️ الحظر النشط محمي! اضغط باستمرار على زر الإلغاء لمدة 3 ثوانٍ.',

      // History Tab
      history_hero_subtitle: 'أرشيف التمارين',
      history_hero_title: 'السجل',
      stat_total_sessions: 'إجمالي الحصص',
      stat_total_volume: 'إجمالي الحجم المرفوع',
      stat_calories: 'السعرات المحروقة',
      history_empty: 'لا توجد تمارين مسجلة حتى الآن. أكمل أول حصة تدريبية لبناء أرشيفك الرياضي!',

      // Ranks & PRs Tab
      ranks_hero_subtitle: 'قلعة الأرقام القياسية والتصنيف',
      ranks_hero_title: 'التصنيف والأرقام',
      ranks_overall_score: 'نقاط القوة الإجمالية',
      ranks_male_bracket: 'فئة الرجال (كتيبة نيرف)',
      ranks_female_bracket: 'فئة السيدات (كتيبة مريم)',
      ranks_auto_filtered: '🔒 فئة مفلترة تلقائياً',
      ranks_bench_press: 'بنش برس بالبار',
      ranks_squat: 'سكوات بالبار',
      ranks_deadlift: 'ديدليفت',
      ranks_hip_thrust: 'هيب ثرست بالبار',
      ranks_rdl: 'ديدليفت روماني (RDL)',

      // Settings Tab
      settings_hero_subtitle: 'التفضيلات والإعدادات',
      settings_hero_title: 'الإعدادات',
      athlete_role_standard: 'رياضي معتمد',
      athlete_role_admin: 'مهندس نظام موون (إدارة)',
      settings_btn_talk_coach: '💬 تحدث مع المدرب',
      settings_btn_switch_coach: '🔄 تبديل المدرب الذكي',
      settings_btn_switch_account: 'تبديل الحساب / دخول',
      settings_btn_logout: 'تسجيل الخروج',
      admin_card_title: 'مركز تحكم قلعة أوبسيديان',
      admin_card_desc: 'مراقبة لوحات صدارة الرجال والسيدات جنباً إلى جنب بدون فلاتر، وإدارة بيانات الرياضيين وتحديثات المنصة.',
      admin_card_btn: 'دخول لوحة تحكم الإدارة ←',
      ios_card_title: 'فتح التطبيق على الآيفون والآيباد',
      ios_card_desc: 'امسح رمز الاستجابة السريعة (QR) بكاميرا الآيفون لفتح التطبيق على سفاري فوراً ثم إضافته للشاشة الرئيسية.',
      ios_btn_qr: 'عرض رمز QR لشبكة الآيفون',
      settings_group_appearance: 'المظهر وألوان السمة',
      settings_group_preferences: 'التفضيلات العامة',
      lang_setting_name: 'اللغة / Language',
      lang_setting_desc: 'اختر بين العربية (تنسيق RTL مشدد) أو الإنجليزية (LTR)',
      weight_unit_name: 'وحدة قياس الوزن',
      weight_unit_desc: 'اختر بين الكيلوغرام (KG) والباوند (LBS)',
      rest_timer_name: 'مؤقت الراحة الافتراضي',
      rest_timer_desc: 'مؤقت تلقائي ينطلق مباشرة بعد إكمال أي جولة',
      sound_name: 'المؤثرات الصوتية',
      sound_desc: 'تنبيهات صوتية لانتهاء المؤقت واكتمال الجولات',
      haptics_name: 'الاهتزازات اللمسية التفاعلية',
      haptics_desc: 'اهتزازات فيزيائية دقيقة عند النقر وتسجيل الجولات',
      faq_group_title: 'الأسئلة الشائعة ودليل الاستخدام',
      faq_group_desc: 'كل ما تحتاج لمعرفته حول المدربين الأذكياء وحظر منصات التواصل ومقاطع الريلز',

      // Dual AI Coach Modal
      coach_nurv_name: 'المدرب نيرف',
      coach_nurv_title: 'خبير الحمل الميكانيكي الحيوي ومحرك الزيادة التدريجية',
      coach_nurv_tagline: 'توتر عضلي مطلق. كمال ميكانيكي حيوي. تقدم بلا هوادة.',
      coach_nurv_greeting: 'أهلاً بك أيها البطل. المدرب نيرف معك بكامل التركيز. التوتر العضلي والزيادة التدريجية هما القانون هنا. ما هو هدفنا اليوم؟',
      coach_maryam_name: 'المدربة مريم',
      coach_maryam_title: 'مهندسة الدقة والتوافق العضلي وخبير الكثافة العالية',
      coach_maryam_tagline: 'أناقة حركية. عزم السلسلة الخلفية. وتيرة تدريبية لا تتوقف.',
      coach_maryam_greeting: 'مرحباً بكِ أيتها المحاربة. المدربة مريم جاهزة. ننحت التناسق العضلي بالقوة الحركية والانضباط الصارم. لنبدأ فوراً.',
      coach_voice_on: 'الصوت: مفعّل',
      coach_voice_off: 'الصوت: معطّل',
      coach_prompt_form_cues: '📐 توجيهات الأداء',
      coach_prompt_fix_form: '🛠️ تصحيح التكنيك',
      coach_prompt_pain_triage: '⚠️ تقييم الألم',
      coach_prompt_diet_macros: '🥗 التغذية والماكروز',
      coach_prompt_workout_splits: '📅 جداول التمارين',
      coach_prompt_gym_guidance: '⚡ إرشادات الجيم',
      coach_input_placeholder: 'اسأل مدربك الذكي المخصص أي شيء...',
      send_btn: 'إرسال ←',

      // Auth Modal
      auth_tab_signin: 'تسجيل الدخول',
      auth_tab_signup: 'إنشاء حساب جديد',
      auth_signin_heading: 'تسجيل الدخول إلى حسابك',
      auth_signup_heading: 'إنشاء حساب رياضي جديد',
      auth_field_username: 'اسم المستخدم الفريد',
      auth_field_password: 'كلمة المرور',
      auth_field_fullname: 'الاسم الكامل / المعروض',
      auth_gender_heading: 'حدد جنسك الرياضي (إلزامي لفلترة لوحة الصدارة)',
      auth_coach_heading: 'اختر مدربك الذكي (حرية كاملة للاختيار)',
      auth_btn_submit_signin: 'دخول القلعة ←',
      auth_btn_submit_signup: 'إنشاء الحساب وتعيين المدرب ←'
    }
  };

  const I18N = {
    currentLang: 'en',

    init: function () {
      let saved = null;
      try {
        saved = localStorage.getItem(STORAGE_LANG);
      } catch (e) {}

      if (!saved && window.AppState && window.AppState.settings && window.AppState.settings.language) {
        saved = window.AppState.settings.language;
      }

      this.currentLang = (saved === 'ar') ? 'ar' : 'en';
      this.applyLanguage(this.currentLang, false);
    },

    getLanguage: function () {
      return this.currentLang;
    },

    isRTL: function () {
      return this.currentLang === 'ar';
    },

    t: function (key, fallback) {
      const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
      if (dict && dict[key] !== undefined) {
        return dict[key];
      }
      const enDict = TRANSLATIONS.en;
      if (enDict && enDict[key] !== undefined) {
        return enDict[key];
      }
      return fallback !== undefined ? fallback : key;
    },

    setLanguage: function (lang) {
      const clean = (lang === 'ar') ? 'ar' : 'en';
      this.currentLang = clean;
      try {
        localStorage.setItem(STORAGE_LANG, clean);
      } catch (e) {}

      if (window.AppState && window.AppState.settings) {
        window.AppState.settings.language = clean;
        if (typeof window.saveState === 'function') {
          window.saveState();
        }
      }

      this.applyLanguage(clean, true);

      // Trigger custom event for other modules
      window.dispatchEvent(new CustomEvent('moon-language-changed', {
        detail: { lang: clean, isRTL: clean === 'ar' }
      }));

      // Haptic and Toast feedback
      if (typeof window.triggerHaptic === 'function') {
        window.triggerHaptic([40, 30, 60]);
      }
      if (typeof window.showToast === 'function') {
        window.showToast(clean === 'ar'
          ? '🇸🇦 تم تفعيل اللغة العربية وتنسيق RTL'
          : '🇺🇸 English language & LTR layout active');
      }
    },

    applyLanguage: function (lang, reRenderViews) {
      const isRTL = (lang === 'ar');
      const html = document.documentElement;
      const body = document.body;

      if (html) {
        html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        html.setAttribute('lang', isRTL ? 'ar' : 'en');
      }
      if (body) {
        body.classList.toggle('rtl-mode', isRTL);
      }

      // Update Language Switcher buttons
      const btnEn = document.getElementById('btn-lang-en');
      const btnAr = document.getElementById('btn-lang-ar');
      if (btnEn) btnEn.classList.toggle('active', !isRTL);
      if (btnAr) btnAr.classList.toggle('active', isRTL);

      // Translate all DOM elements tagged with data-i18n
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const translated = this.t(key, null);
        if (translated !== null) {
          el.innerHTML = translated;
        }
      });

      // Translate placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translated = this.t(key, null);
        if (translated !== null) {
          el.setAttribute('placeholder', translated);
        }
      });

      // Translate titles / tooltips
      document.querySelectorAll('[data-i18n-title]').forEach((el) => {
        const key = el.getAttribute('data-i18n-title');
        const translated = this.t(key, null);
        if (translated !== null) {
          el.setAttribute('title', translated);
        }
      });

      // Update dynamic app components
      this.updateDynamicText(isRTL);

      if (reRenderViews) {
        if (typeof window.updateFocusBlockUI === 'function') {
          window.updateFocusBlockUI();
        }
        if (typeof window.renderRoutines === 'function') {
          window.renderRoutines();
        }
        if (typeof window.renderHistory === 'function') {
          window.renderHistory();
        }
        if (typeof window.renderPRs === 'function') {
          window.renderPRs();
        }
        if (window.AuthSystem && typeof window.AuthSystem.updateCoachModalUI === 'function') {
          window.AuthSystem.updateCoachModalUI();
        }
        if (window.AuthSystem && typeof window.AuthSystem.updateHeaderUI === 'function') {
          window.AuthSystem.updateHeaderUI();
        }
      }
    },

    updateDynamicText: function (isRTL) {
      // Bottom navigation tab labels
      const tabMap = {
        workout: this.t('tab_workout'),
        focus: this.t('tab_focus'),
        history: this.t('tab_history'),
        ranks: this.t('tab_ranks'),
        settings: this.t('tab_settings')
      };
      document.querySelectorAll('.bottom-tab-bar .nav-tab').forEach((tab) => {
        const dt = tab.getAttribute('data-tab');
        const label = tab.querySelector('.tab-label');
        if (label && tabMap[dt]) {
          label.textContent = tabMap[dt];
        }
      });

      // Floating coach bubble
      const bubbleName = document.getElementById('coach-bubble-name');
      if (bubbleName && window.AuthSystem && typeof window.AuthSystem.getCoach === 'function') {
        const c = window.AuthSystem.getCoach();
        bubbleName.textContent = isRTL ? (c.id === 'Maryam' ? 'مريم' : 'نيرف') : (c.shortName || c.sigilText);
      }

      // 1-Tap Anti-Scroll Hero Button
      const heroTitle = document.getElementById('antiscroll-hero-title');
      const heroKicker = document.getElementById('antiscroll-hero-kicker');
      const heroPill = document.getElementById('antiscroll-hero-pill');
      const heroSub = document.getElementById('antiscroll-hero-sub');
      const isActive = window.AppState && window.AppState.scroll && window.AppState.scroll.antiScrollActive;
      if (heroKicker) heroKicker.textContent = this.t('antiscroll_hero_kicker');
      if (heroSub) heroSub.textContent = this.t('antiscroll_hero_sub');
      if (heroTitle) {
        heroTitle.textContent = isActive ? this.t('antiscroll_hero_title_active') : this.t('antiscroll_hero_title_idle');
      }
      if (heroPill) {
        heroPill.textContent = isActive ? this.t('antiscroll_pill_active') : this.t('antiscroll_pill_idle');
      }

      // Opal Hold to Cancel labels
      const holdLabel = document.getElementById('opal-hold-label');
      const holdHint = document.getElementById('opal-hold-hint');
      if (holdLabel) holdLabel.textContent = this.t('hold_to_cancel');
      if (holdHint) holdHint.textContent = this.t('hold_hint');

      // Coach Quick Prompts
      const quickBtns = document.querySelectorAll('.coach-quick-btn');
      const quickKeys = [
        'coach_prompt_form_cues',
        'coach_prompt_fix_form',
        'coach_prompt_pain_triage',
        'coach_prompt_diet_macros',
        'coach_prompt_workout_splits',
        'coach_prompt_gym_guidance'
      ];
      quickBtns.forEach((btn, idx) => {
        if (quickKeys[idx]) {
          btn.textContent = this.t(quickKeys[idx]);
        }
      });
    }
  };

  // Expose Globally
  window.I18N = I18N;
  window.t = I18N.t.bind(I18N);
  window.setAppLanguage = I18N.setLanguage.bind(I18N);

  // Initialize as soon as DOM is ready or immediately if loaded asynchronously
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18N.init());
  } else {
    I18N.init();
  }
})();
