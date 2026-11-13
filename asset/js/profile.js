/**
 * ============================================================================
 * BreatheWell - Member Profile & Health Dashboard Controller (profile.js)
 * ============================================================================
 * @file        asset/js/profile.js
 * @module      BreatheWell/Profile
 * @description Client-side controller for BreatheWell personalized profile:
 *                1. Bilingual Localization Engine (Bengali / English)
 *                2. Active User Profile Loading & Guest Demo Mode Support
 *                3. Vitality Metrics Aggregation (Practice Minutes, BOLT, Streak)
 *                4. Interactive Tab Navigation (Personal Info, Goals, Milestones, Security)
 *                5. Personal Information Editing & LocalStorage Persistence
 *                6. Interactive Avatar Customization Modal
 *                7. Health & Wellness Preferences Configuration
 *                8. HIPAA/Encrypted Health Records JSON Export Utility
 *                9. Secure Account Logout Flow
 * @author      BreatheWell Development Team
 * @version     1.0.0
 * @license     MIT
 * ============================================================================
 */

(function () {
  "use strict";

  /* ==========================================================================
   * 1. BILINGUAL LOCALIZATION DICTIONARIES (100% KEY PARITY)
   * ========================================================================== */
  const T = {
    bn: {
      docTitle: "BreatheWell | সদস্য প্রোফাইল",
      guestBannerTitle: "আপনি ডেমো প্রোফাইল মোডে দেখছেন",
      guestBannerDesc: "আপনার সমস্ত অগ্রগতি ও স্বাস্থ্য রেকর্ড নিরাপদে সংরক্ষণ করতে লগইন বা রেজিস্ট্রেশন করুন।",
      btnBannerLogin: "লগইন",
      btnBannerRegister: "রেজিস্ট্রেশন",
      badgeTierPro: "BreatheWell প্রো সদস্য",
      badgeJoinedPrefix: "যুক্ত হয়েছেন:",
      profileJoinedDefault: "যুক্ত হয়েছেন: Jan 2024",
      btnEditAvatar: "ছবি পরিবর্তন",
      btnExportDataHeader: "ডেটা এক্সপোর্ট",
      btnLogoutHeader: "লগআউট",
      metricPracticeMinutes: "অনুশীলন মিনিট",
      metricSessions: "সম্পন্ন সেশন",
      metricBoltScore: "সর্বশেষ BOLT স্কোর",
      metricStreak: "দিনের সক্রিয় স্ট্রিক",
      tabInfo: "ব্যক্তিগত তথ্য",
      tabPrefs: "সুস্থতা ও সেটিংস",
      tabAchievements: "অর্জিত মাইলফলক",
      tabSecurity: "নিরাপত্তা ও ডেটা",
      secPersonalDetails: "ব্যক্তিগত প্রোফাইল ও স্বাস্থ্য নোট",
      labelName: "পুরো নাম",
      labelEmail: "ইমেইল এড্রেস",
      labelPhone: "মোবাইল নম্বর",
      labelGender: "লিঙ্গ",
      optMale: "পুরুষ",
      optFemale: "মহিলা",
      optOther: "অন্যান্য",
      optUnspecified: "উল্লেখ করতে অনিচ্ছুক",
      labelBloodGroup: "রক্তের গ্রুপ",
      labelEmergencyContact: "জরুরি যোগাযোগ",
      placeholderEmergencyContact: "যেমন: পিতা/সঙ্গী - +880 1700-000000",
      labelMedicalNotes: "স্বাস্থ্য অবস্থা বা অ্যালার্জি নোট",
      placeholderMedicalNotes: "যেমন: মৃদু অ্যাজমা, সাইনাস প্রবণতা...",
      btnSaveProfile: "তথ্য সংরক্ষণ করুন",
      btnSaveProfileLoading: "সংরক্ষণ হচ্ছে...",
      secDailyGoal: "দৈনিক শ্বাস ব্যায়াম লক্ষ্য",
      subDailyGoal: "প্রতিদিন কত মিনিট মননশীল শ্বাস চর্চা করতে চান তা নির্ধারণ করুন",
      unitMins: "মিনিট",
      secAudioPrefs: "শব্দ ও অডিও নির্দেশনা",
      subAudioPrefs: "অনুশীলন চলাকালীন ঘণ্টা ও ভয়েস প্রম্পট নিয়ন্ত্রণ করুন",
      prefChimeTitle: "শ্বাস রূপান্তর ঘণ্টা (Chime)",
      prefChimeDesc: "শ্বাস নেওয়া ও ছাড়ার ধাপে শান্ত ধাতব ঘণ্টার আওয়াজ",
      prefVoiceTitle: "ভয়েস গাইডেন্স ও নির্দেশনা",
      prefVoiceDesc: "প্রতিটি ধাপ স্পষ্ট বাংলা ও ইংরেজি উচ্চারণে উচ্চারণ",
      prefSoundTestTitle: "ফুসফুস পরীক্ষা অডিও কিউ",
      prefSoundTestDesc: "BOLT এবং BPM কাউন্টারে অডিও টিক সাউন্ড",
      btnSavePrefs: "পছন্দসমূহ আপডেট করুন",
      secAchievements: "স্বাস্থ্য ও মননশীল মাইলফলকসমূহ",
      badgeFirstBreathTitle: "প্রথম শ্বাস",
      badgeFirstBreathDesc: "BreatheWell-এ আপনার প্রথম শ্বাস ব্যায়াম সফলভাবে সম্পন্ন করেছেন।",
      badgeBoltTitle: "ফুসফুস পথিকৃৎ",
      badgeBoltDesc: "প্রথমবারের মতো নিজের BOLT রেসপিরেটরি স্কোর নির্ণয় করেছেন।",
      badgeStreakTitle: "৭ দিনের স্ট্রিক",
      badgeStreakDesc: "টানা ৭ দিন নিয়মিত শ্বাস-প্রশ্বাস ব্যায়াম অব্যাহত রেখেছেন।",
      badgeDeepCalmTitle: "গভীর প্রশান্তির সাধক",
      badgeDeepCalmDesc: "একটানা ১৫ মিনিটের গভীর রিলাক্সেশন অনুশীলন সম্পন্ন করেছেন।",
      badgeRxVaultTitle: "ডিজিটাল স্বাস্থ্য রক্ষক",
      badgeRxVaultDesc: "প্রেসক্রিপশন ভল্টে নিজের ব্যবস্থাপত্র সংরক্ষণ করেছেন।",
      badgeMasterTitle: "BOLT ৩০+ চ্যাম্পিয়ন",
      badgeMasterDesc: "উন্নত ফুসফুস সক্ষমতা ও ৩০ সেকেন্ডের অধিক BOLT অর্জন করেছেন।",
      badgeStatusUnlocked: "অর্জিত হয়েছে",
      badgeStatusLocked: "লক করা",
      secExportData: "স্বাস্থ্য ডেটা ডাউনলোড",
      descExportData: "আপনার সমস্ত শ্বাসের সেশন, BOLT টেস্ট হিস্ট্রি ও প্রোফাইল ডেটা এনক্রিপ্ট করা JSON ফরম্যাটে ডাউনলোড করুন।",
      btnDownloadJson: "JSON ফাইল ডাউনলোড",
      secClearData: "অ্যাকাউন্ট ডেটা রিসেট",
      descClearData: "আপনার সমস্ত সংরক্ষিত সেশন ও টেস্ট হিস্ট্রি মুছে ফেলবে। এটি অপরিবর্তনযোগ্য।",
      btnClearData: "ডেটা রিসেট করুন",
      secSecurityLogout: "অ্যাকাউন্ট থেকে প্রস্থান",
      descSecurityLogout: "নিরাপদভাবে আপনার বর্তমান ব্রাউজার সেশন সমাপ্ত করুন।",
      btnLogoutConfirm: "লগআউট নিশ্চিত করুন",
      saveProfileSuccess: "প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!",
      savePrefsSuccess: "সুস্থতার পছন্দসমূহ সফলভাবে সংরক্ষিত হয়েছে!",
      exportSuccess: "আপনার স্বাস্থ্য ডেটা সফলভাবে ডাউনলোড হয়েছে!",
      avatarModalTitle: "আপনার প্রোফাইল অবতার নির্বাচন করুন",
      btnApplyAvatar: "অবতার পরিবর্তন করুন",
      logoutModalTitle: "আপনি কি নিশ্চিত?",
      logoutModalDesc: "আপনি BreatheWell অ্যাকাউন্ট থেকে লগআউট করতে যাচ্ছেন।",
      btnCancel: "বাতিল",
      resetModalTitle: "ডেটা রিসেট নিশ্চিতকরণ",
      resetModalDesc: "সতর্কতা: আপনার সমস্ত সেশন ও টেস্ট হিস্ট্রি ব্রাউজার থেকে মুছে যাবে। আপনি কি নিশ্চিত?",
      btnConfirmResetAction: "হ্যাঁ, মুছে ফেলুন",
      resetDoneSuccess: "সমস্ত হিস্ট্রি সফলভাবে রিসেট করা হয়েছে।",
      tabFamily: "পরিবার ও সদস্যবৃন্দ",
      familyPanelTitle: "পরিবারের সদস্য ও স্বাস্থ্য প্রোফাইল",
      familyPanelSub: "পিতা, মাতা, জীবনসঙ্গী, ভাই ও বোনের শ্বাসচর্চা এবং প্রেসক্রিপশন একসাথে পরিচালনা করুন",
      btnAddFamilyMember: "নতুন সদস্য যোগ করুন",
      modalAddMemberTitle: "পরিবারের সদস্য যোগ করুন",
      modalEditMemberTitle: "সদস্যের তথ্য সম্পাদনা",
      labelRelation: "সম্পর্ক (Relation)",
      relFather: "পিতা / বাবা (Father)",
      relMother: "মাতা / মা (Mother)",
      relSpouse: "জীবনসঙ্গী (Spouse)",
      relBrother: "ভাই (Brother)",
      relSister: "বোন (Sister)",
      relSon: "ছেলে (Son)",
      relDaughter: "মেয়ে (Daughter)",
      relGrandfather: "দাদা / নানা (Grandfather)",
      relGrandmother: "দাদী / নানী (Grandmother)",
      relFatherInLaw: "শ্বশুর (Father-in-law)",
      relMotherInLaw: "শাশুড়ি (Mother-in-law)",
      relUncle: "চাচা / মামা / খালু (Uncle)",
      relAunt: "চাচী / মামী / খালা (Aunt)",
      relChild: "সন্তান / শিশু (Child)",
      relOther: "অন্যান্য (Other)",
      labelMemberName: "সদস্যের পুরো নাম",
      labelMemberAge: "বয়স",
      labelMemberGender: "লিঙ্গ",
      genderMale: "পুরুষ",
      genderFemale: "মহিলা",
      genderOther: "অন্যান্য",
      labelMemberNote: "স্বাস্থ্য অবস্থা / উপসর্গ নোট (ঐচ্ছিক)",
      btnSaveMember: "সংরক্ষণ করুন",
      btnEditMember: "সম্পাদনা",
      btnDeleteMember: "মুছুন",
      deleteMemberTitle: "সদস্য মুছে ফেলবেন?",
      deleteMemberDesc: "এই সদস্যের প্রোফাইল ও তথ্য আপনার পরিবার তালিকা থেকে মুছে ফেলা হবে।",
      btnConfirmDelete: "হ্যাঁ, মুছুন",
      emptyFamilyTitle: "পরিবারের কোনো সদস্য এখনো যুক্ত করা হয়নি",
      emptyFamilySub: "আপনার পিতা, মাতা, জীবনসঙ্গী, ভাই বা বোনকে যুক্ত করে তাদের শ্বাস ও স্বাস্থ্য ট্র্যাকিং একসাথে পরিচালনা করুন।",
      primaryAccountHolder: "মূল অ্যাকাউন্টধারী (আপনি)",
      activeStatus: "সক্রিয় অ্যাকাউন্ট",
      yearsOld: "বছর",
      memberSavedSuccess: "সদস্যের তথ্য সফলভাবে সংরক্ষিত হয়েছে!",
      memberDeletedSuccess: "সদস্য সফলভাবে মুছে ফেলা হয়েছে।",
      memberCountLabel: "জন সদস্য",
      errMemberNameRequired: "অনুগ্রহ করে সদস্যের নাম লিখুন।",
      footerTag: "প্রতিটি নিঃশ্বাসে একটি প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।"
    },
    en: {
      docTitle: "BreatheWell | Member Profile",
      guestBannerTitle: "You are viewing a Guest Demo Profile",
      guestBannerDesc: "Log in or register an account to sync your breathing progress and health records across devices.",
      btnBannerLogin: "Log In",
      btnBannerRegister: "Register",
      badgeTierPro: "BreatheWell Pro Member",
      badgeJoinedPrefix: "Member since:",
      profileJoinedDefault: "Member since: Jan 2024",
      btnEditAvatar: "Change Avatar",
      btnExportDataHeader: "Export Data",
      btnLogoutHeader: "Log Out",
      metricPracticeMinutes: "Mindful Minutes",
      metricSessions: "Sessions Done",
      metricBoltScore: "Latest BOLT Score",
      metricStreak: "Day Active Streak",
      tabInfo: "Personal Info",
      tabPrefs: "Wellness Settings",
      tabAchievements: "Achievements",
      tabSecurity: "Security & Data",
      secPersonalDetails: "Personal Profile & Health Notes",
      labelName: "Full Name",
      labelEmail: "Email Address",
      labelPhone: "Phone Number",
      labelGender: "Gender",
      optMale: "Male",
      optFemale: "Female",
      optOther: "Other",
      optUnspecified: "Prefer not to say",
      labelBloodGroup: "Blood Group",
      labelEmergencyContact: "Emergency Contact",
      placeholderEmergencyContact: "e.g. Parent/Partner - +880 1700-000000",
      labelMedicalNotes: "Medical Conditions / Allergies",
      placeholderMedicalNotes: "e.g. Mild asthma, pollen allergies...",
      btnSaveProfile: "Save Changes",
      btnSaveProfileLoading: "Saving...",
      secDailyGoal: "Daily Breathing Practice Target",
      subDailyGoal: "Set your daily mindful breathing goal in minutes",
      unitMins: "mins",
      secAudioPrefs: "Audio & Guidance Chimes",
      subAudioPrefs: "Control auditory bells and voice prompts during sessions",
      prefChimeTitle: "Transition Chime",
      prefChimeDesc: "Play gentle resonant metal bell on inhale/exhale cycles",
      prefVoiceTitle: "Voice Guidance Prompts",
      prefVoiceDesc: "Spoken respiratory phase announcements in your language",
      prefSoundTestTitle: "Respiratory Test Audio Cues",
      prefSoundTestDesc: "Tick beeps and alerts during BOLT and BPM measurements",
      btnSavePrefs: "Update Preferences",
      secAchievements: "Mindful Health Milestones",
      badgeFirstBreathTitle: "First Breath",
      badgeFirstBreathDesc: "Completed your first mindful breathing practice on BreatheWell.",
      badgeBoltTitle: "Lung Pioneer",
      badgeBoltDesc: "Assessed your baseline BOLT respiratory fitness score.",
      badgeStreakTitle: "7-Day Streak",
      badgeStreakDesc: "Practiced mindful respiratory regulation for 7 consecutive days.",
      badgeDeepCalmTitle: "Deep Calm Master",
      badgeDeepCalmDesc: "Finished a dedicated 15+ minute deep relaxation exercise.",
      badgeRxVaultTitle: "Digital Health Keeper",
      badgeRxVaultDesc: "Digitized and preserved an active medical prescription.",
      badgeMasterTitle: "BOLT 30+ Champion",
      badgeMasterDesc: "Reached advanced respiratory efficiency with 30s+ BOLT.",
      badgeStatusUnlocked: "Unlocked",
      badgeStatusLocked: "Locked",
      secExportData: "Export Personal Health Data",
      descExportData: "Download all your breathing logs, BOLT scores, and profile records in an encrypted JSON file.",
      btnDownloadJson: "Download JSON Export",
      secClearData: "Reset Account History",
      descClearData: "Permanently erase stored session logs and test records on this device. Irreversible.",
      btnClearData: "Reset Data",
      secSecurityLogout: "Sign Out",
      descSecurityLogout: "Securely terminate your active session on this device.",
      btnLogoutConfirm: "Confirm Logout",
      saveProfileSuccess: "Profile updated successfully!",
      savePrefsSuccess: "Wellness settings saved successfully!",
      exportSuccess: "Health data export downloaded successfully!",
      avatarModalTitle: "Choose Your Profile Avatar",
      btnApplyAvatar: "Set Avatar",
      logoutModalTitle: "Are you sure?",
      logoutModalDesc: "You are about to sign out of your BreatheWell account.",
      btnCancel: "Cancel",
      resetModalTitle: "Confirm Data Reset",
      resetModalDesc: "Warning: All stored sessions and test records will be erased. Proceed?",
      btnConfirmResetAction: "Yes, Reset All",
      resetDoneSuccess: "All local test and exercise history has been cleared.",
      tabFamily: "Family & Members",
      familyPanelTitle: "Family Members & Health Profiles",
      familyPanelSub: "Manage breathing exercises, health logs, and prescriptions for your father, mother, spouse, siblings, and children",
      btnAddFamilyMember: "Add New Member",
      modalAddMemberTitle: "Add Family Member",
      modalEditMemberTitle: "Edit Member Information",
      labelRelation: "Relationship",
      relFather: "Father",
      relMother: "Mother",
      relSpouse: "Spouse",
      relBrother: "Brother",
      relSister: "Sister",
      relSon: "Son",
      relDaughter: "Daughter",
      relGrandfather: "Grandfather",
      relGrandmother: "Grandmother",
      relFatherInLaw: "Father-in-law",
      relMotherInLaw: "Mother-in-law",
      relUncle: "Uncle",
      relAunt: "Aunt",
      relChild: "Child",
      relOther: "Other Relative",
      labelMemberName: "Full Name",
      labelMemberAge: "Age",
      labelMemberGender: "Gender",
      genderMale: "Male",
      genderFemale: "Female",
      genderOther: "Other",
      labelMemberNote: "Health Conditions / Notes (Optional)",
      btnSaveMember: "Save Member",
      btnEditMember: "Edit",
      btnDeleteMember: "Delete",
      deleteMemberTitle: "Remove Member?",
      deleteMemberDesc: "This member's profile and records will be removed from your household list.",
      btnConfirmDelete: "Yes, Remove",
      emptyFamilyTitle: "No family members added yet",
      emptyFamilySub: "Add your father, mother, spouse, or siblings to monitor their respiratory wellness together.",
      primaryAccountHolder: "Primary Account Holder (You)",
      activeStatus: "Active Account",
      yearsOld: "yrs",
      memberSavedSuccess: "Family member saved successfully!",
      memberDeletedSuccess: "Family member removed successfully.",
      memberCountLabel: "Members",
      errMemberNameRequired: "Please enter member name.",
      footerTag: "Peace in every breath",
      footerDisclaimer: "For general wellness. Not a substitute for medical advice."
    }
  };

  /* ==========================================================================
   * 2. STATE & DEFAULT STORAGE KEYS
   * ========================================================================== */
  let currentLang = localStorage.getItem("bw-lang") || localStorage.getItem("bw_lang") || "bn";
  const USERS_STORAGE_KEY = "bw_users";
  const ACTIVE_USER_KEY = "bw_active_user";
  const PREFS_STORAGE_KEY = "bw_user_preferences";

  const DEFAULT_GUEST_USER = {
    id: "usr_demo",
    name: "ডা. আয়েশা রহমান",
    email: "demo@breathewell.com",
    phone: "+880 1712-345678",
    gender: "female",
    bloodGroup: "A+",
    emergencyContact: "ড. শফিকুর রহমান (পিতা) - +880 1711-223344",
    medicalNotes: "হালকা অ্যালার্জিক রাইনাইটিস; নিয়মিত মননশীল শ্বাসচর্চাকারী।",
    role: "Medical Practitioner & Wellness Member",
    joined: "2024-01-15T09:00:00.000Z",
    avatar: "avatar_doctor",
    goal: "stress",
    boltScore: 32,
    sessionsCompleted: 48,
    streakDays: 14,
    members: [
      {
        id: "mem_demo_1",
        name: "ড. শফিকুর রহমান",
        relation: "father",
        age: 68,
        gender: "male",
        healthNote: "উচ্চ রক্তচাপ ও ব্রঙ্কাইটিসের হালকা উপসর্গ",
        addedAt: "2024-02-10T10:00:00.000Z"
      },
      {
        id: "mem_demo_2",
        name: "রাবেয়া খাতুন",
        relation: "mother",
        age: 62,
        gender: "female",
        healthNote: "ডায়াবেটিস ও মাইন্ডফুলনেস ব্রিদিং করেন",
        addedAt: "2024-02-10T10:00:00.000Z"
      },
      {
        id: "mem_demo_3",
        name: "তানভীর আহমেদ",
        relation: "spouse",
        age: 34,
        gender: "male",
        healthNote: "অ্যাজমা প্রতিরোধে দৈনিক ৪-৭-৮ শ্বাসচর্চা",
        addedAt: "2024-03-01T10:00:00.000Z"
      }
    ],
    isGuest: true
  };

  const RELATION_MAP = {
    father: { bn: "পিতা / বাবা", en: "Father", icon: "bi-person-fill", class: "relation-father" },
    mother: { bn: "মাতা / মা", en: "Mother", icon: "bi-person-heart", class: "relation-mother" },
    spouse: { bn: "জীবনসঙ্গী", en: "Spouse", icon: "bi-heart-fill", class: "relation-spouse" },
    brother: { bn: "ভাই", en: "Brother", icon: "bi-person", class: "relation-brother" },
    sister: { bn: "বোন", en: "Sister", icon: "bi-person", class: "relation-sister" },
    son: { bn: "ছেলে", en: "Son", icon: "bi-emoji-smile", class: "relation-son" },
    daughter: { bn: "মেয়ে", en: "Daughter", icon: "bi-emoji-smile", class: "relation-daughter" },
    grandfather: { bn: "দাদা / নানা", en: "Grandfather", icon: "bi-person-badge", class: "relation-grandfather" },
    grandmother: { bn: "দাদী / নানী", en: "Grandmother", icon: "bi-person-heart", class: "relation-grandmother" },
    father_in_law: { bn: "শ্বশুর", en: "Father-in-law", icon: "bi-person-fill", class: "relation-father-in-law" },
    mother_in_law: { bn: "শাশুড়ি", en: "Mother-in-law", icon: "bi-person-heart", class: "relation-mother-in-law" },
    uncle: { bn: "চাচা / মামা", en: "Uncle", icon: "bi-person", class: "relation-uncle" },
    aunt: { bn: "চাচী / মামী", en: "Aunt", icon: "bi-person", class: "relation-aunt" },
    child: { bn: "সন্তান / শিশু", en: "Child", icon: "bi-emoji-smile", class: "relation-child" },
    other: { bn: "অন্যান্য", en: "Other", icon: "bi-person-plus", class: "relation-other" }
  };

  let pendingDeleteMemberId = null;

  const AVATARS_CATALOG = [
    { id: "avatar_doctor", icon: "bi-person-heart", name: "ডা. সেবক (Doctor)" },
    { id: "avatar_lung", icon: "bi-lungs-fill", name: "ফুসফুস চ্যাম্পিয়ন" },
    { id: "avatar_zen", icon: "bi-flower1", name: "পদ্ম যোগী (Lotus Zen)" },
    { id: "avatar_sun", icon: "bi-sun-fill", name: "প্রাণবন্ত সূর্য (Vitality)" },
    { id: "avatar_wind", icon: "bi-wind", name: "শ্বাসের পথিক (Air Wave)" },
    { id: "avatar_shield", icon: "bi-shield-check", name: "সুরক্ষা রক্ষক (Guardian)" }
  ];

  let activeUser = null;
  let selectedAvatarId = "avatar_doctor";

  const $ = (id) => document.getElementById(id);

  function tr(key) {
    return T[currentLang]?.[key] ?? T.bn[key] ?? key;
  }

  /* ==========================================================================
   * 3. DATA AGGREGATION & INITIALIZATION
   * ========================================================================== */
  function loadActiveUser() {
    try {
      const raw = localStorage.getItem(ACTIVE_USER_KEY);
      if (raw) {
        activeUser = JSON.parse(raw);
        activeUser.isGuest = false;
        if (!Array.isArray(activeUser.members)) {
          activeUser.members = [];
        }
      } else {
        activeUser = JSON.parse(JSON.stringify(DEFAULT_GUEST_USER));
      }
    } catch (_) {
      activeUser = JSON.parse(JSON.stringify(DEFAULT_GUEST_USER));
    }
  }

  /**
   * Calculates live stats aggregated across BreatheWell local storage
   */
  function aggregateMetrics() {
    let boltLatest = activeUser.boltScore || 28;
    let sessionsCount = activeUser.sessionsCompleted || 24;
    let practiceMinutes = Math.round(sessionsCount * 4.5);
    let streakDays = activeUser.streakDays || 7;

    // Check BOLT test history
    try {
      const boltRaw = localStorage.getItem("bw_bolt_history") || localStorage.getItem("bw_test_history");
      if (boltRaw) {
        const tests = JSON.parse(boltRaw);
        if (Array.isArray(tests) && tests.length > 0) {
          const boltTests = tests.filter((t) => t.type === "BOLT" || t.mode === "bolt");
          if (boltTests.length > 0) {
            boltLatest = boltTests[0].seconds || boltTests[0].score || boltLatest;
          }
        }
      }
    } catch (_) { }

    // Check session logs
    try {
      const sessRaw = localStorage.getItem("bw_session_history") || localStorage.getItem("bw_exercises_completed");
      if (sessRaw) {
        const sess = JSON.parse(sessRaw);
        if (Array.isArray(sess) && sess.length > 0) {
          sessionsCount += sess.length;
          practiceMinutes += Math.round(sess.length * 5);
        }
      }
    } catch (_) { }

    return {
      minutes: practiceMinutes,
      sessions: sessionsCount,
      bolt: boltLatest,
      streak: streakDays
    };
  }

  /* ==========================================================================
   * 4. UI POPULATION & RENDERING
   * ========================================================================== */
  function populateProfileUI() {
    if (!activeUser) return;

    // Guest Banner visibility
    const guestBanner = $("guestPreviewBanner");
    if (guestBanner) {
      guestBanner.classList.toggle("d-none", !activeUser.isGuest);
    }

    // Hero Identity
    const heroName = $("profileUserName");
    const heroEmail = $("profileUserEmail");
    const heroTier = $("profileTierBadge");
    const heroJoined = $("profileJoinedDate");
    const avatarIcon = $("profileAvatarIcon");
    const avatarInitial = $("profileAvatarInitial");

    if (heroName) heroName.textContent = activeUser.name || "Member";
    if (heroEmail) heroEmail.textContent = activeUser.email || "";
    if (heroTier) heroTier.textContent = activeUser.role || tr("badgeTierPro");

    if (heroJoined && activeUser.joined) {
      try {
        const d = new Date(activeUser.joined);
        const dateStr = d.toLocaleDateString(currentLang === "bn" ? "bn-BD" : "en-US", {
          year: "numeric",
          month: "short"
        });
        heroJoined.innerHTML = `<i class="bi bi-calendar3"></i> <span>${tr("badgeJoinedPrefix")} ${dateStr}</span>`;
      } catch (_) {
        heroJoined.innerHTML = `<i class="bi bi-calendar3"></i> <span>${tr("badgeJoinedPrefix")} 2024</span>`;
      }
    }

    // Avatar Icon or Initial
    selectedAvatarId = activeUser.avatar || "avatar_doctor";
    const matchedAvatar = AVATARS_CATALOG.find((a) => a.id === selectedAvatarId);
    if (avatarIcon && avatarInitial) {
      if (matchedAvatar) {
        avatarIcon.className = `bi ${matchedAvatar.icon}`;
        avatarIcon.classList.remove("d-none");
        avatarInitial.classList.add("d-none");
      } else {
        avatarIcon.classList.add("d-none");
        avatarInitial.classList.remove("d-none");
        avatarInitial.textContent = (activeUser.name ? activeUser.name.charAt(0) : "U").toUpperCase();
      }
    }

    // Metrics
    const metrics = aggregateMetrics();
    const metricMinutes = $("metricMinutesVal");
    const metricSessions = $("metricSessionsVal");
    const metricBolt = $("metricBoltVal");
    const metricStreak = $("metricStreakVal");

    if (metricMinutes) metricMinutes.textContent = metrics.minutes;
    if (metricSessions) metricSessions.textContent = metrics.sessions;
    if (metricBolt) metricBolt.textContent = `${metrics.bolt}s`;
    if (metricStreak) metricStreak.textContent = metrics.streak;

    // Populate Tab 1: Personal Info Form
    const inputName = $("profileInputName");
    const inputEmail = $("profileInputEmail");
    const inputPhone = $("profileInputPhone");
    const inputGender = $("profileSelectGender");
    const inputBlood = $("profileSelectBlood");
    const inputEmerg = $("profileInputEmergency");
    const inputNotes = $("profileInputNotes");

    if (inputName) inputName.value = activeUser.name || "";
    if (inputEmail) inputEmail.value = activeUser.email || "";
    if (inputPhone) inputPhone.value = activeUser.phone || "";
    if (inputGender && activeUser.gender) inputGender.value = activeUser.gender;
    if (inputBlood && activeUser.bloodGroup) inputBlood.value = activeUser.bloodGroup;
    if (inputEmerg) inputEmerg.value = activeUser.emergencyContact || "";
    if (inputNotes) inputNotes.value = activeUser.medicalNotes || "";

    // Populate Tab 2: Family & Members
    renderFamilyMembers();

    // Populate Tab 3: Preferences
    loadPreferencesUI();

    // Populate Tab 4: Achievements
    renderAchievements(metrics);
  }

  function loadPreferencesUI() {
    let prefs = {
      dailyMinutes: 10,
      chimeEnabled: true,
      voiceEnabled: true,
      testSoundEnabled: true
    };

    try {
      const raw = localStorage.getItem(PREFS_STORAGE_KEY);
      if (raw) prefs = { ...prefs, ...JSON.parse(raw) };
    } catch (_) { }

    // Minutes pills
    document.querySelectorAll(".pref-minute-pill").forEach((pill) => {
      const minVal = parseInt(pill.getAttribute("data-minutes"), 10);
      pill.classList.toggle("active", minVal === prefs.dailyMinutes);
    });

    // Switches
    const switchChime = $("switchPrefChime");
    const switchVoice = $("switchPrefVoice");
    const switchTestSound = $("switchPrefTestSound");

    if (switchChime) switchChime.checked = !!prefs.chimeEnabled;
    if (switchVoice) switchVoice.checked = !!prefs.voiceEnabled;
    if (switchTestSound) switchTestSound.checked = !!prefs.testSoundEnabled;
  }

  function renderAchievements(metrics) {
    const isFirstBreath = metrics.sessions >= 1;
    const isBoltUnlocked = metrics.bolt >= 15;
    const isStreakUnlocked = metrics.streak >= 7;
    const isDeepCalmUnlocked = metrics.minutes >= 30;
    const isMasterUnlocked = metrics.bolt >= 30;

    const cards = [
      { id: "achieveFirstBreath", unlocked: isFirstBreath },
      { id: "achieveBolt", unlocked: isBoltUnlocked },
      { id: "achieveStreak", unlocked: isStreakUnlocked },
      { id: "achieveDeepCalm", unlocked: isDeepCalmUnlocked },
      { id: "achieveRxVault", unlocked: true },
      { id: "achieveMaster", unlocked: isMasterUnlocked }
    ];

    cards.forEach((item) => {
      const cardEl = $(item.id);
      if (!cardEl) return;
      cardEl.classList.toggle("unlocked", item.unlocked);
      const badgeStatus = cardEl.querySelector(".achievement-status-badge span");
      if (badgeStatus) {
        badgeStatus.textContent = item.unlocked ? tr("badgeStatusUnlocked") : tr("badgeStatusLocked");
      }
    });
  }

  /* ==========================================================================
   * 5. TAB CONTROLLER
   * ========================================================================== */
  function setupTabs() {
    const tabButtons = document.querySelectorAll(".profile-nav-btn");
    const tabPanels = document.querySelectorAll(".profile-tab-panel");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-tab");

        tabButtons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        tabPanels.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const targetPanel = $(targetId);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });
  }

  /* ==========================================================================
   * 6. SAVE ACTIONS & EDIT HANDLERS
   * ========================================================================== */
  function handleSavePersonalInfo(e) {
    if (e && e.preventDefault) e.preventDefault();

    const inputName = $("profileInputName");
    const inputEmail = $("profileInputEmail");
    const inputPhone = $("profileInputPhone");
    const inputGender = $("profileSelectGender");
    const inputBlood = $("profileSelectBlood");
    const inputEmerg = $("profileInputEmergency");
    const inputNotes = $("profileInputNotes");

    const btn = $("btnSaveProfile");
    const originalText = btn ? btn.textContent : "";
    if (btn) btn.textContent = tr("btnSaveProfileLoading");

    setTimeout(() => {
      activeUser.name = inputName ? inputName.value.trim() : activeUser.name;
      activeUser.email = inputEmail ? inputEmail.value.trim() : activeUser.email;
      activeUser.phone = inputPhone ? inputPhone.value.trim() : activeUser.phone;
      activeUser.gender = inputGender ? inputGender.value : activeUser.gender;
      activeUser.bloodGroup = inputBlood ? inputBlood.value : activeUser.bloodGroup;
      activeUser.emergencyContact = inputEmerg ? inputEmerg.value.trim() : activeUser.emergencyContact;
      activeUser.medicalNotes = inputNotes ? inputNotes.value.trim() : activeUser.medicalNotes;
      activeUser.avatar = selectedAvatarId;

      try {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));

        // Update record in bw_users
        const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (rawUsers) {
          const users = JSON.parse(rawUsers);
          const idx = users.findIndex((u) => u.id === activeUser.id || u.email === activeUser.email);
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...activeUser };
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
          }
        }
      } catch (_) { }

      if (btn) btn.textContent = originalText;
      showToast(tr("saveProfileSuccess"), true);
      populateProfileUI();
    }, 350);
  }

  function handleSavePreferences() {
    let activeMinutes = 10;
    const activePill = document.querySelector(".pref-minute-pill.active");
    if (activePill) {
      activeMinutes = parseInt(activePill.getAttribute("data-minutes"), 10) || 10;
    }

    const switchChime = $("switchPrefChime");
    const switchVoice = $("switchPrefVoice");
    const switchTestSound = $("switchPrefTestSound");

    const prefs = {
      dailyMinutes: activeMinutes,
      chimeEnabled: switchChime ? switchChime.checked : true,
      voiceEnabled: switchVoice ? switchVoice.checked : true,
      testSoundEnabled: switchTestSound ? switchTestSound.checked : true
    };

    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch (_) { }

    showToast(tr("savePrefsSuccess"), true);
  }

  /* ==========================================================================
   * 6.1 FAMILY MEMBERS CONTROLLER
   * ========================================================================== */
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;");
  }

  function persistActiveUser() {
    try {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        const idx = users.findIndex((u) => u.id === activeUser.id || u.email === activeUser.email);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...activeUser };
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      }
    } catch (_) { }
  }

  function renderFamilyMembers() {
    const grid = $("familyMembersGrid");
    const countBadge = $("profileFamilyCountText");
    if (!grid) return;

    if (!activeUser.members || !Array.isArray(activeUser.members)) {
      activeUser.members = [];
    }

    const members = activeUser.members;
    const isBn = currentLang === "bn";

    // Update hero badge
    if (countBadge) {
      countBadge.textContent = isBn ? `${members.length} ${tr("memberCountLabel")}` : `${members.length} ${tr("memberCountLabel")}`;
    }

    // Build Cards HTML
    let html = "";

    // 1. Primary Account Holder Card
    const primaryName = activeUser.name || (isBn ? "ডা. আয়েশা রহমান" : "Dr. Ayesha Rahman");
    const primaryRole = activeUser.role || (isBn ? "মূল সদস্য" : "Primary Member");
    const primaryAvatar = AVATARS_CATALOG.find((a) => a.id === (activeUser.avatar || "avatar_doctor")) || AVATARS_CATALOG[0];

    html += `
      <div class="family-member-card is-primary">
        <div class="family-card-header">
          <span class="family-relation-pill relation-primary">
            <i class="bi bi-star-fill"></i>
            ${tr("primaryAccountHolder")}
          </span>
          <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill small">
            ${tr("activeStatus")}
          </span>
        </div>
        <div class="family-card-body">
          <div class="family-member-avatar text-primary">
            <i class="bi ${primaryAvatar.icon}"></i>
          </div>
          <div class="family-member-details">
            <div class="family-member-name">${escapeHtml(primaryName)}</div>
            <div class="family-member-meta">${escapeHtml(primaryRole)}</div>
          </div>
        </div>
        ${activeUser.medicalNotes ? `
          <div class="family-card-notes">
            <i class="bi bi-heart-pulse"></i>
            <span>${escapeHtml(activeUser.medicalNotes)}</span>
          </div>
        ` : ""}
      </div>
    `;

    // 2. Family Members Cards
    if (members.length === 0) {
      html += `
        <div class="family-empty-state">
          <div class="family-empty-icon"><i class="bi bi-people"></i></div>
          <div class="family-empty-title">${tr("emptyFamilyTitle")}</div>
          <div class="family-empty-sub">${tr("emptyFamilySub")}</div>
          <button type="button" class="btn btn-primary btn-sm fw-bold" data-bs-toggle="modal" data-bs-target="#familyMemberModal">
            <i class="bi bi-person-plus-fill me-1"></i>
            ${tr("btnAddFamilyMember")}
          </button>
        </div>
      `;
    } else {
      members.forEach((m) => {
        const relInfo = RELATION_MAP[m.relation] || RELATION_MAP.other;
        const relLabel = isBn ? relInfo.bn : relInfo.en;
        const ageMeta = m.age ? `${m.age} ${tr("yearsOld")}` : "";
        const genderMeta = m.gender ? (m.gender === "male" ? tr("genderMale") : m.gender === "female" ? tr("genderFemale") : tr("genderOther")) : "";
        const metaStr = [ageMeta, genderMeta].filter(Boolean).join(" • ");

        html += `
          <div class="family-member-card" data-member-id="${m.id}">
            <div class="family-card-header">
              <span class="family-relation-pill ${relInfo.class}">
                <i class="bi ${relInfo.icon}"></i>
                ${relLabel}
              </span>
              <div class="family-card-actions">
                <button type="button" class="btn-card-action btn-edit-member" data-edit-id="${m.id}" title="${tr("btnEditMember")}" aria-label="Edit">
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn-card-action btn-delete-member" data-delete-id="${m.id}" title="${tr("btnDeleteMember")}" aria-label="Delete">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
            <div class="family-card-body">
              <div class="family-member-avatar text-secondary">
                <i class="bi ${relInfo.icon}"></i>
              </div>
              <div class="family-member-details">
                <div class="family-member-name">${escapeHtml(m.name)}</div>
                ${metaStr ? `<div class="family-member-meta">${escapeHtml(metaStr)}</div>` : ""}
              </div>
            </div>
            ${m.healthNote ? `
              <div class="family-card-notes">
                <i class="bi bi-lungs"></i>
                <span>${escapeHtml(m.healthNote)}</span>
              </div>
            ` : ""}
          </div>
        `;
      });
    }

    grid.innerHTML = html;

    // Attach Event Handlers for Edit & Delete buttons
    grid.querySelectorAll("[data-edit-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-edit-id");
        openEditMemberModal(id);
      });
    });

    grid.querySelectorAll("[data-delete-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-delete-id");
        openDeleteMemberModal(id);
      });
    });
  }

  function openAddMemberModal() {
    const modalTitle = $("familyMemberModalTitle");
    const idInput = $("modalMemberId");
    const nameInput = $("modalMemberName");
    const relInput = $("modalMemberRelation");
    const ageInput = $("modalMemberAge");
    const genderInput = $("modalMemberGender");
    const noteInput = $("modalMemberHealthNotes");

    if (modalTitle) modalTitle.textContent = tr("modalAddMemberTitle");
    if (idInput) idInput.value = "";
    if (nameInput) nameInput.value = "";
    if (relInput) relInput.value = "father";
    if (ageInput) ageInput.value = "";
    if (genderInput) genderInput.value = "male";
    if (noteInput) noteInput.value = "";
  }

  function openEditMemberModal(id) {
    if (!activeUser.members) return;
    const member = activeUser.members.find((m) => m.id === id);
    if (!member) return;

    const modalTitle = $("familyMemberModalTitle");
    const idInput = $("modalMemberId");
    const nameInput = $("modalMemberName");
    const relInput = $("modalMemberRelation");
    const ageInput = $("modalMemberAge");
    const genderInput = $("modalMemberGender");
    const noteInput = $("modalMemberHealthNotes");

    if (modalTitle) modalTitle.textContent = tr("modalEditMemberTitle");
    if (idInput) idInput.value = member.id;
    if (nameInput) nameInput.value = member.name || "";
    if (relInput) relInput.value = member.relation || "other";
    if (ageInput) ageInput.value = member.age || "";
    if (genderInput) genderInput.value = member.gender || "other";
    if (noteInput) noteInput.value = member.healthNote || "";

    const modalEl = $("familyMemberModal");
    if (modalEl && window.bootstrap?.Modal) {
      const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  }

  function handleSaveMember(e) {
    if (e && e.preventDefault) e.preventDefault();

    const idInput = $("modalMemberId");
    const nameInput = $("modalMemberName");
    const relInput = $("modalMemberRelation");
    const ageInput = $("modalMemberAge");
    const genderInput = $("modalMemberGender");
    const noteInput = $("modalMemberHealthNotes");

    const name = nameInput ? nameInput.value.trim() : "";
    if (!name) {
      showToast(tr("errMemberNameRequired"), false);
      if (nameInput) nameInput.focus();
      return;
    }

    const editId = idInput ? idInput.value : "";
    const relation = relInput ? relInput.value : "other";
    const age = ageInput && ageInput.value ? parseInt(ageInput.value, 10) : null;
    const gender = genderInput ? genderInput.value : "other";
    const healthNote = noteInput ? noteInput.value.trim() : "";

    if (!activeUser.members) activeUser.members = [];

    if (editId) {
      // Update existing
      const idx = activeUser.members.findIndex((m) => m.id === editId);
      if (idx !== -1) {
        activeUser.members[idx] = {
          ...activeUser.members[idx],
          name,
          relation,
          age: isNaN(age) ? null : age,
          gender,
          healthNote,
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      // Add new
      const newMember = {
        id: "mem_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        name,
        relation,
        age: isNaN(age) ? null : age,
        gender,
        healthNote,
        addedAt: new Date().toISOString()
      };
      activeUser.members.push(newMember);
    }

    persistActiveUser();
    renderFamilyMembers();

    // Close modal
    const modalEl = $("familyMemberModal");
    if (modalEl && window.bootstrap?.Modal) {
      const bsModal = window.bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    }

    showToast(tr("memberSavedSuccess"), true);
  }

  function openDeleteMemberModal(id) {
    pendingDeleteMemberId = id;
    const modalEl = $("deleteMemberModal");
    if (modalEl && window.bootstrap?.Modal) {
      const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  }

  function executeDeleteMember() {
    if (!pendingDeleteMemberId || !activeUser.members) return;

    activeUser.members = activeUser.members.filter((m) => m.id !== pendingDeleteMemberId);
    pendingDeleteMemberId = null;

    persistActiveUser();
    renderFamilyMembers();

    const modalEl = $("deleteMemberModal");
    if (modalEl && window.bootstrap?.Modal) {
      const bsModal = window.bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    }

    showToast(tr("memberDeletedSuccess"), true);
  }

  /* ==========================================================================
   * 7. AVATAR PICKER MODAL
   * ========================================================================== */
  function renderAvatarModalOptions() {
    const grid = $("avatarPickerGrid");
    if (!grid) return;

    grid.innerHTML = AVATARS_CATALOG.map((a) => {
      const isSel = a.id === selectedAvatarId;
      return `
        <button type="button" class="avatar-option-btn ${isSel ? "active" : ""}" data-avatar="${a.id}">
          <div class="avatar-option-icon">
            <i class="bi ${a.icon}"></i>
          </div>
          <span class="avatar-option-name">${a.name}</span>
        </button>
      `;
    }).join("");

    grid.querySelectorAll(".avatar-option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        grid.querySelectorAll(".avatar-option-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedAvatarId = btn.getAttribute("data-avatar");
      });
    });
  }

  function applyChosenAvatar() {
    if (!activeUser) return;
    activeUser.avatar = selectedAvatarId;
    try {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));
    } catch (_) { }

    const modalEl = $("avatarModal");
    if (window.bootstrap?.Modal && modalEl) {
      const m = window.bootstrap.Modal.getInstance(modalEl);
      if (m) m.hide();
    }

    populateProfileUI();
    showToast(tr("saveProfileSuccess"), true);
  }

  /* ==========================================================================
   * 8. HEALTH DATA JSON EXPORT UTILITY
   * ========================================================================== */
  function exportHealthDataJson() {
    const exportPackage = {
      app: "BreatheWell",
      version: "2.4.0",
      exportTimestamp: new Date().toISOString(),
      userProfile: activeUser,
      preferences: localStorage.getItem(PREFS_STORAGE_KEY)
        ? JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY))
        : null,
      respiratoryTests: localStorage.getItem("bw_bolt_history")
        ? JSON.parse(localStorage.getItem("bw_bolt_history"))
        : [],
      prescriptionsCount: localStorage.getItem("bw_prescriptions")
        ? JSON.parse(localStorage.getItem("bw_prescriptions")).length
        : 0
    };

    const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPackage, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    const dateFormatted = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute("download", `breathewell-health-export-${dateFormatted}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(tr("exportSuccess"), true);
  }

  /* ==========================================================================
   * 9. LOGOUT & DATA CLEAR
   * ========================================================================== */
  function handleLogout() {
    try {
      localStorage.removeItem(ACTIVE_USER_KEY);
    } catch (_) { }

    window.location.href = "login.html";
  }

  function handleResetHistory() {
    try {
      localStorage.removeItem("bw_bolt_history");
      localStorage.removeItem("bw_test_history");
      localStorage.removeItem("bw_session_history");
      localStorage.removeItem("bw_exercises_completed");
    } catch (_) { }

    const modalEl = $("resetModal");
    if (window.bootstrap?.Modal && modalEl) {
      const m = window.bootstrap.Modal.getInstance(modalEl);
      if (m) m.hide();
    }

    showToast(tr("resetDoneSuccess"), true);
    populateProfileUI();
  }

  /* ==========================================================================
   * 10. TOAST UTILITY & LOCALIZATION APPLICATION
   * ========================================================================== */
  function showToast(message, isSuccess = true) {
    const toastEl = $("appToast");
    const toastText = $("toastText");
    if (!toastEl || !toastText) return;

    toastText.textContent = message;
    toastEl.classList.remove("text-bg-success", "text-bg-danger");
    toastEl.classList.add(isSuccess ? "text-bg-success" : "text-bg-danger");

    if (window.bootstrap?.Toast) {
      const bsToast = window.bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
      bsToast.show();
    }
  }

  function applyLanguage(lang) {
    currentLang = lang === "en" ? "en" : "bn";
    document.documentElement.lang = currentLang;
    document.body.classList.toggle("bn", currentLang === "bn");
    document.title = tr("docTitle");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (T[currentLang][k] !== undefined) {
        el.textContent = T[currentLang][k];
      }
    });

    const inputEmerg = $("profileInputEmergency");
    if (inputEmerg) inputEmerg.placeholder = tr("placeholderEmergencyContact");
    const inputNotes = $("profileInputNotes");
    if (inputNotes) inputNotes.placeholder = tr("placeholderMedicalNotes");

    const langBtn = $("langToggle");
    if (langBtn) {
      langBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
    }

    populateProfileUI();
  }

  /* ==========================================================================
   * 11. LIFECYCLE INITIALIZATION
   * ========================================================================== */
  function initProfilePage() {
    loadActiveUser();
    applyLanguage(currentLang);
    setupTabs();
    populateProfileUI();

    // Preferences pills selection
    document.querySelectorAll(".pref-minute-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".pref-minute-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
      });
    });

    // Form Submissions
    const infoForm = $("profileInfoForm");
    if (infoForm) infoForm.addEventListener("submit", handleSavePersonalInfo);

    const btnSavePrefs = $("btnSavePreferences");
    if (btnSavePrefs) btnSavePrefs.addEventListener("click", handleSavePreferences);

    // Export Buttons
    const btnExportHead = $("btnExportHeader");
    if (btnExportHead) btnExportHead.addEventListener("click", exportHealthDataJson);

    const btnExportTab = $("btnDownloadExport");
    if (btnExportTab) btnExportTab.addEventListener("click", exportHealthDataJson);

    // Avatar Modal setup
    const avatarBtn = $("btnTriggerAvatarModal");
    if (avatarBtn) {
      avatarBtn.addEventListener("click", renderAvatarModalOptions);
    }
    const btnApplyAvatar = $("btnApplyAvatarSelection");
    if (btnApplyAvatar) {
      btnApplyAvatar.addEventListener("click", applyChosenAvatar);
    }

    // Family Member Actions
    const btnOpenAddMember = $("btnOpenAddMemberModal");
    if (btnOpenAddMember) btnOpenAddMember.addEventListener("click", openAddMemberModal);

    const familyMemberForm = $("familyMemberForm");
    if (familyMemberForm) familyMemberForm.addEventListener("submit", handleSaveMember);

    const btnConfirmDelete = $("btnConfirmDeleteMember");
    if (btnConfirmDelete) btnConfirmDelete.addEventListener("click", executeDeleteMember);

    // Logout Actions
    const btnConfirmLogout = $("btnConfirmLogoutAction");
    if (btnConfirmLogout) btnConfirmLogout.addEventListener("click", handleLogout);

    // Reset History Actions
    const btnConfirmReset = $("btnConfirmResetAction");
    if (btnConfirmReset) btnConfirmReset.addEventListener("click", handleResetHistory);

    // Language synchronization (handled globally by global-nav.js)
    window.addEventListener("bwLanguageChanged", (e) => {
      if (e.detail?.lang && e.detail.lang !== currentLang) {
        applyLanguage(e.detail.lang);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProfilePage);
  } else {
    initProfilePage();
  }
})();

