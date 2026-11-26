/**
 * ============================================================================
 * BreatheWell - Member Registration & Onboarding Controller (register.js)
 * ============================================================================
 * @file        asset/js/register.js
 * @module      BreatheWell/Register
 * @description Client-side controller for BreatheWell member onboarding:
 *                1. Bilingual Localization Engine (Bengali / English)
 *                2. Live Interactive Password Strength Evaluation
 *                3. Real-time Password Match & Requirement Checks
 *                4. Mindful Health & Respiratory Goal Selection
 *                5. Unique Email Validation & LocalStorage User Persistence
 *                6. Instant Onboarding Success Toast & Profile Redirection
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
      docTitle: "BreatheWell | রেজিস্ট্রেশন",
      regTitle: "নতুন অ্যাকাউন্ট তৈরি করুন",
      regSubtitle: "সুস্থ শ্বাস-প্রশ্বাস ও মানসিক প্রশান্তির ডিজিটাল যাত্রায় যুক্ত হোন",
      secPersonalInfo: "ব্যক্তিগত তথ্য",
      labelFullName: "আপনার পুরো নাম",
      placeholderFullName: "যেমন: তাহমিদ হাসান",
      labelEmail: "ইমেইল এড্রেস",
      placeholderEmail: "name@example.com",
      labelPhone: "মোবাইল নম্বর (ঐচ্ছিক)",
      placeholderPhone: "+880 1700-000000",
      secPasswordSecurity: "নিরাপত্তা ও পাসওয়ার্ড",
      labelPassword: "পাসওয়ার্ড",
      placeholderPassword: "কমপক্ষে ৬টি অক্ষর লিখুন",
      labelConfirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      placeholderConfirmPassword: "পুনরায় পাসওয়ার্ড লিখুন",
      strengthWeak: "দুর্বল",
      strengthFair: "মোটামুটি",
      strengthGood: "ভালো",
      strengthStrong: "শক্তিশালী",
      ruleLength: "৮+ অক্ষর",
      ruleNumber: "১টি সংখ্যা",
      ruleLetter: "বড় ও ছোট অক্ষর",
      ruleSpecial: "বিশেষ প্রতীক (@#$)",
      secHealthGoals: "আপনার মূল স্বাস্থ্য লক্ষ্য নির্বাচন করুন",
      goalStressTitle: "চাপ ও উদ্বেগ মুক্তি",
      goalStressSub: "স্নায়ুতন্ত্র শিথিল ও প্রশান্ত করা",
      goalSleepTitle: "গভীর ও আরামদায়ক ঘুম",
      goalSleepSub: "রাতে দ্রুত ও নিরবচ্ছিন্ন ঘুম",
      goalFocusTitle: "মনোযোগ ও মানসিক শক্তি",
      goalFocusSub: "কাজে ও পড়াশোনায় একাগ্রতা বৃদ্ধি",
      goalLungTitle: "ফুসফুস ও শ্বাসযন্ত্রের সক্ষমতা",
      goalLungSub: "BOLT স্কোর বৃদ্ধি ও ফুসফুস ফিটনেস",
      termsAgreePre: "আমি BreatheWell-এর",
      termsLink: "শর্তাবলী",
      termsAnd: "ও",
      privacyLink: "গোপনীয়তা নীতি",
      termsAgreePost: "মেনে নিচ্ছি",
      btnRegister: "অ্যাকাউন্ট তৈরি করুন",
      btnRegisterLoading: "অ্যাকাউন্ট তৈরি হচ্ছে...",
      alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      loginNow: "লগইন করুন",
      securityBadge: "২৫৬-বিট এনক্রিপশন ও সম্পূর্ণ সুরক্ষিত ডেটা",
      errEmptyName: "অনুগ্রহ করে আপনার পুরো নাম লিখুন।",
      errEmptyEmail: "ইমেইল এড্রেস দেওয়া আবশ্যক।",
      errInvalidEmail: "সঠিক ইমেইল ফরম্যাট প্রদান করুন।",
      errEmailTaken: "এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে। অনুগ্রহ করে লগইন করুন।",
      errPasswordShort: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
      errPasswordMismatch: "পাসওয়ার্ড দুটি মিলছে না। অনুগ্রহ করে যাচাই করুন।",
      errTermsRequired: "শর্তাবলী ও গোপনীয়তা নীতি মেনে নেওয়া আবশ্যক।",
      regSuccess: "অভিনন্দন! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। প্রোফাইলে নিয়ে যাওয়া হচ্ছে...",
      termsModalTitle: "শর্তাবলী ও গোপনীয়তা নীতি",
      termsModalContent: "BreatheWell একটি ডিজিটাল সুস্থতা ও মাইন্ডফুলনেস প্ল্যাটফর্ম। এখানে সংরক্ষিত সমস্ত ডেটা আপনার ব্রাউজারের লোকাল স্টোরেজে সম্পূর্ণ এনক্রিপ্ট করা থাকে। কোনো চিকিৎসা সংক্রান্ত জরুরি অবস্থায় সর্বদা নিবন্ধিত চিকিৎসকের পরামর্শ নিন।",
      secFamilyMembers: "পরিবারের সদস্য যুক্ত করুন (ঐচ্ছিক)",
      familySectionDesc: "আপনার পরিবারের সদস্যদের (বাবা, মা, ভাই, বোন, জীবনসঙ্গী) স্বাস্থ্য ও প্রেসক্রিপশন ট্র্যাক করতে এখনই যুক্ত করতে পারেন।",
      labelRelation: "সম্পর্ক",
      relFather: "পিতা / বাবা (Father)",
      relMother: "মাতা / মা (Mother)",
      relSpouse: "জীবনসঙ্গী (Spouse)",
      relBrother: "ভাই (Brother)",
      relSister: "বোন (Sister)",
      relSon: "ছেলে (Son)",
      relDaughter: "মেয়ে (Daughter)",
      relOther: "অন্যান্য (Other)",
      labelMemberName: "সদস্যের নাম",
      labelMemberAge: "বয়স",
      labelMemberNote: "স্বাস্থ্য অবস্থা / নোট (ঐচ্ছিক)",
      btnAddMemberToList: "সদস্য তালিকায় যোগ করুন",
      addedMembersCount: "যুক্ত করা সদস্য",
      emptyMembersList: "এখনো কোনো পরিবারের সদস্য যোগ করা হয়নি। চাইলে পরে প্রোফাইল থেকেও যোগ করতে পারবেন।",
      errMemberNameRequired: "অনুগ্রহ করে সদস্যের নাম লিখুন।",
      memberAddedSuccess: "সদস্য তালিকায় যোগ করা হয়েছে!",
      memberRemovedSuccess: "সদস্য তালিকা থেকে সরানো হয়েছে।",
      visualPillTag: "সুস্থ শ্বাস ও মননশীল জীবনের ঠিকানা",
      visualHeroTitle1: "প্রতিটি নিঃশ্বাসে সুস্থতা,",
      visualHeroTitle2: "প্রতিটি পদক্ষেপে দীর্ঘায়ু",
      visualHeroSub: "বৈজ্ঞানিক শ্বাসচর্চা, ফুসফুসের ক্ষমতা পরীক্ষা ও প্রেসক্রিপশন ভল্টের এক সমন্বিত ডিজিটাল প্ল্যাটফর্ম।",
      statBoltBadge: "সর্বোচ্চ BOLT স্কোর",
      statCalmPulse: "৪-৭-৮ শান্ত শ্বাস",
      statCalmDesc: "স্নায়ু শিথিলকারী ছন্দ",
      statRxSafe: "১০০% এনক্রিপ্টেড",
      statRxDesc: "ডিজিটাল প্রেসক্রিপশন ভল্ট",
      featureItem1: "BOLT রেসপিরেটরি টেস্ট",
      featureItem2: "পরিবারের সদস্য ট্র্যাকিং",
      featureItem3: "প্রেসক্রিপশন OCR স্ক্যান",
      trustBadgeText: "৫০,০০০+ সুস্থ শ্বাসচর্চাকারীর আস্থা",
      socialGoogle: "গুগল",
      socialFacebook: "ফেসবুক",
      orSignUpWith: "অথবা ইমেইল দিয়ে নিবন্ধন করুন",
      trustSecureReg: "নিরাপদ রেজিস্ট্রেশন",
      trustEncryptedData: "১০০% এনক্রিপ্টেড ডেটা",
      socialDemoMsg: "ডেমো মোড: সোশ্যাল সাইন-আপ সিমুলেটেড। অনুগ্রহ করে ফর্মটি পূরণ করুন।",
      quickSelect: "দ্রুত নির্বাচন:",
      relFatherShort: "বাবা",
      relMotherShort: "মা",
      relSpouseShort: "জীবনসঙ্গী",
      relBrotherShort: "ভাই",
      relSisterShort: "বোন",
      relSonShort: "ছেলে",
      relDaughterShort: "মেয়ে",
      quickConditionsLabel: "সচরাচর অবস্থা:",
      condAsthma: "অ্যাজমা",
      condHighBP: "উচ্চ রক্তচাপ",
      condDiabetes: "ডায়াবেটিস",
      condInhaler: "ইনহেলার গ্রহণ করেন",
      condAllergy: "অ্যালার্জি",
      memberCountZero: "০ জন সদস্য যুক্ত",
      memberCountSuffix: "জন সদস্য যুক্ত",
      relGrandfather: "দাদা / নানা (Grandfather)",
      relGrandmother: "দাদী / নানী (Grandmother)",
      relFatherInLaw: "শ্বশুর (Father-in-law)",
      relMotherInLaw: "শাশুড়ি (Mother-in-law)",
      relUncle: "চাচা / মামা / খালু (Uncle)",
      relAunt: "চাচী / মামী / খালা (Aunt)",
      relChild: "সন্তান / শিশু (Child)",
      relGrandfatherShort: "দাদা/নানা",
      relGrandmotherShort: "দাদী/নানী",
      relChildShort: "সন্তান",
      relOtherShort: "অন্যান্য",
      condHeart: "হৃদরোগ",
      familyAddHint: "একাধিক সদস্য (বাবা, মা, সন্তান, দাদা-দাদী) ক্রমান্বয়ে যোগ করতে পারবেন।",
      btnAddMoreMembers: "+ আরো সদস্য যোগ করুন",
      pwStrengthLabel: "পাসওয়ার্ড মান:",
      btnAgreeModal: "সম্মত আছি",
      footerTag: "প্রতিটি নিঃশ্বাসে একটি প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।"
    },
    en: {
      docTitle: "BreatheWell | Register",
      regTitle: "Create Your Account",
      regSubtitle: "Join our mindful breathing and respiratory wellness platform",
      secPersonalInfo: "Personal Information",
      labelFullName: "Full Name",
      placeholderFullName: "e.g. Tahmid Hasan",
      labelEmail: "Email Address",
      placeholderEmail: "name@example.com",
      labelPhone: "Phone Number (Optional)",
      placeholderPhone: "+880 1700-000000",
      secPasswordSecurity: "Security & Password",
      labelPassword: "Password",
      placeholderPassword: "At least 6 characters",
      labelConfirmPassword: "Confirm Password",
      placeholderConfirmPassword: "Re-enter password",
      strengthWeak: "Weak",
      strengthFair: "Fair",
      strengthGood: "Good",
      strengthStrong: "Strong",
      ruleLength: "8+ chars",
      ruleNumber: "1 number",
      ruleLetter: "Upper & lowercase",
      ruleSpecial: "Special symbol (@#$)",
      secHealthGoals: "Select Your Primary Wellness Goal",
      goalStressTitle: "Stress & Anxiety Relief",
      goalStressSub: "Calm and regulate nervous system",
      goalSleepTitle: "Deep & Restful Sleep",
      goalSleepSub: "Fall asleep faster & rest deeply",
      goalFocusTitle: "Focus & Mental Balance",
      goalFocusSub: "Sharpen cognitive performance",
      goalLungTitle: "Lung Health & BOLT Fitness",
      goalLungSub: "Boost respiratory stamina & BOLT",
      termsAgreePre: "I agree to BreatheWell's",
      termsLink: "Terms of Service",
      termsAnd: "and",
      privacyLink: "Privacy Policy",
      termsAgreePost: "",
      btnRegister: "Create Account",
      btnRegisterLoading: "Creating Account...",
      alreadyHaveAccount: "Already have an account?",
      loginNow: "Log In",
      securityBadge: "256-bit Encryption & Strictly Private Health Data",
      errEmptyName: "Please enter your full name.",
      errEmptyEmail: "Email address is required.",
      errInvalidEmail: "Please provide a valid email format.",
      errEmailTaken: "This email is already registered. Please log in instead.",
      errPasswordShort: "Password must be at least 6 characters.",
      errPasswordMismatch: "Passwords do not match. Please verify.",
      errTermsRequired: "You must agree to the Terms & Privacy Policy.",
      regSuccess: "Congratulations! Your account was created successfully. Redirecting...",
      termsModalTitle: "Terms of Service & Privacy Policy",
      termsModalContent: "BreatheWell is a digital health & wellness application designed to support mindful respiratory training. All your data is encrypted and saved securely within your device browser storage. For medical emergencies, always consult a registered physician.",
      secFamilyMembers: "Add Family Members (Optional)",
      familySectionDesc: "Add your family members (father, mother, brother, sister, spouse) to manage respiratory health and prescriptions together.",
      labelRelation: "Relationship",
      relFather: "Father",
      relMother: "Mother",
      relSpouse: "Spouse",
      relBrother: "Brother",
      relSister: "Sister",
      relSon: "Son",
      relDaughter: "Daughter",
      relOther: "Other Relative",
      labelMemberName: "Member Name",
      labelMemberAge: "Age",
      labelMemberNote: "Health Condition / Notes (Optional)",
      btnAddMemberToList: "Add Member to List",
      addedMembersCount: "Added Members",
      emptyMembersList: "No family members added yet. You can also add them later from your profile.",
      errMemberNameRequired: "Please enter member name.",
      memberAddedSuccess: "Member added to list!",
      memberRemovedSuccess: "Member removed from list.",
      visualPillTag: "Mindful Breathing & Vitality Portal",
      visualHeroTitle1: "Wellness in Every Breath,",
      visualHeroTitle2: "Vitality in Every Step",
      visualHeroSub: "Scientifically grounded breathing exercises, respiratory fitness testing, and digital prescription vault.",
      statBoltBadge: "Peak BOLT Score",
      statCalmPulse: "4-7-8 Calm Cadence",
      statCalmDesc: "Nervous System Reset",
      statRxSafe: "100% Encrypted",
      statRxDesc: "Digital Prescription Vault",
      featureItem1: "BOLT Respiratory Assessment",
      featureItem2: "Family Multi-Profile Tracking",
      featureItem3: "Prescription OCR Scanner",
      trustBadgeText: "Trusted by 50,000+ mindful breathers",
      socialGoogle: "Google",
      socialFacebook: "Facebook",
      orSignUpWith: "Or sign up with email",
      trustSecureReg: "Secure registration",
      trustEncryptedData: "100% Encrypted & Private",
      socialDemoMsg: "Demo Notice: Social sign-up is simulated. Please fill in the registration form.",
      quickSelect: "Quick select:",
      relFatherShort: "Father",
      relMotherShort: "Mother",
      relSpouseShort: "Spouse",
      relBrotherShort: "Brother",
      relSisterShort: "Sister",
      relSonShort: "Son",
      relDaughterShort: "Daughter",
      quickConditionsLabel: "Common conditions:",
      condAsthma: "Asthma",
      condHighBP: "High BP",
      condDiabetes: "Diabetes",
      condInhaler: "Uses Inhaler",
      condAllergy: "Allergy",
      memberCountZero: "0 members added",
      memberCountSuffix: "members added",
      relGrandfather: "Grandfather",
      relGrandmother: "Grandmother",
      relFatherInLaw: "Father-in-law",
      relMotherInLaw: "Mother-in-law",
      relUncle: "Uncle",
      relAunt: "Aunt",
      relChild: "Child",
      relGrandfatherShort: "Grandfather",
      relGrandmotherShort: "Grandmother",
      relChildShort: "Child",
      relOtherShort: "Other",
      condHeart: "Heart Condition",
      familyAddHint: "You can add multiple family members one after another.",
      btnAddMoreMembers: "+ Add Another Member",
      pwStrengthLabel: "Password strength:",
      btnAgreeModal: "I Agree",
      footerTag: "Peace in every breath",
      footerDisclaimer: "For general wellness. Not a substitute for medical advice."
    }
  };

  /* ==========================================================================
   * 2. STATE & STORAGE IDENTIFIERS
   * ========================================================================== */
  let currentLang = localStorage.getItem("bw-lang") || localStorage.getItem("bw_lang") || "bn";
  const USERS_STORAGE_KEY = "bw_users";
  const ACTIVE_USER_KEY = "bw_active_user";
  let selectedGoal = "stress";
  let familyMembers = [];

  const RELATION_MAP = {
    father: { bn: "পিতা / বাবা", en: "Father", icon: "bi-person-fill", class: "reg-rel-father" },
    mother: { bn: "মাতা / মা", en: "Mother", icon: "bi-person-heart", class: "reg-rel-mother" },
    spouse: { bn: "জীবনসঙ্গী", en: "Spouse", icon: "bi-heart-fill", class: "reg-rel-spouse" },
    brother: { bn: "ভাই", en: "Brother", icon: "bi-person", class: "reg-rel-brother" },
    sister: { bn: "বোন", en: "Sister", icon: "bi-person", class: "reg-rel-sister" },
    son: { bn: "ছেলে", en: "Son", icon: "bi-emoji-smile", class: "reg-rel-son" },
    daughter: { bn: "মেয়ে", en: "Daughter", icon: "bi-emoji-smile", class: "reg-rel-daughter" },
    grandfather: { bn: "দাদা / নানা", en: "Grandfather", icon: "bi-person-badge", class: "reg-rel-grandfather" },
    grandmother: { bn: "দাদী / নানী", en: "Grandmother", icon: "bi-person-heart", class: "reg-rel-grandmother" },
    father_in_law: { bn: "শ্বশুর", en: "Father-in-law", icon: "bi-person-fill", class: "reg-rel-father-in-law" },
    mother_in_law: { bn: "শাশুড়ি", en: "Mother-in-law", icon: "bi-person-heart", class: "reg-rel-mother-in-law" },
    uncle: { bn: "চাচা / মামা / খালু", en: "Uncle", icon: "bi-person", class: "reg-rel-uncle" },
    aunt: { bn: "চাচী / মামী / খালা", en: "Aunt", icon: "bi-person", class: "reg-rel-aunt" },
    child: { bn: "সন্তান / শিশু", en: "Child", icon: "bi-emoji-smile", class: "reg-rel-child" },
    other: { bn: "অন্যান্য", en: "Other", icon: "bi-person-plus", class: "reg-rel-other" }
  };

  const $ = (id) => document.getElementById(id);

  function tr(key) {
    return T[currentLang]?.[key] ?? T.bn[key] ?? key;
  }

  function getRegisteredUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (_) {
      return [];
    }
  }

  /* ==========================================================================
   * 3. LOCALIZATION CONTROLLER
   * ========================================================================== */
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

    // Inputs placeholders
    const nameInput = $("regFullName");
    if (nameInput) nameInput.placeholder = tr("placeholderFullName");
    const emailInput = $("regEmail");
    if (emailInput) emailInput.placeholder = tr("placeholderEmail");
    const phoneInput = $("regPhone");
    if (phoneInput) phoneInput.placeholder = tr("placeholderPhone");
    const passInput = $("regPassword");
    if (passInput) passInput.placeholder = tr("placeholderPassword");
    const confirmInput = $("regConfirmPassword");
    if (confirmInput) confirmInput.placeholder = tr("placeholderConfirmPassword");

    const langBtn = $("langToggle");
    if (langBtn) {
      langBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
    }

    // Refresh live strength text & family members
    evaluatePasswordStrength();
    renderFamilyMembers();
  }

  /* ==========================================================================
   * 4. TOAST NOTIFICATION UTILITY
   * ========================================================================== */
  function showToast(message, isSuccess = true) {
    const toastEl = $("appToast");
    const toastText = $("toastText");
    if (!toastEl || !toastText) return;

    toastText.textContent = message;
    toastEl.classList.remove("text-bg-success", "text-bg-danger");
    toastEl.classList.add(isSuccess ? "text-bg-success" : "text-bg-danger");

    if (window.bootstrap?.Toast) {
      const bsToast = window.bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3200 });
      bsToast.show();
    }
  }

  /* ==========================================================================
   * 5. LIVE PASSWORD STRENGTH EVALUATOR
   * ========================================================================== */
  function evaluatePasswordStrength() {
    const passInput = $("regPassword");
    const fillBar = $("passwordMeterFill");
    const labelStatus = $("passwordMeterLabel");

    const ruleLength = $("ruleLength");
    const ruleNumber = $("ruleNumber");
    const ruleLetter = $("ruleLetter");
    const ruleSpecial = $("ruleSpecial");

    if (!passInput || !fillBar || !labelStatus) return;

    const val = passInput.value || "";

    if (!val) {
      fillBar.className = "password-meter-fill";
      labelStatus.className = "password-meter-label";
      labelStatus.textContent = "";
      [ruleLength, ruleNumber, ruleLetter, ruleSpecial].forEach((r) => r?.classList.remove("valid"));
      return;
    }

    // Criteria checks
    const hasLength = val.length >= 8;
    const hasNumber = /[0-9]/.test(val);
    const hasBothCase = /[a-z]/.test(val) && /[A-Z]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);

    if (ruleLength) ruleLength.classList.toggle("valid", hasLength);
    if (ruleNumber) ruleNumber.classList.toggle("valid", hasNumber);
    if (ruleLetter) ruleLetter.classList.toggle("valid", hasBothCase);
    if (ruleSpecial) ruleSpecial.classList.toggle("valid", hasSpecial);

    let score = 0;
    if (val.length >= 6) score++;
    if (hasLength) score++;
    if (hasNumber) score++;
    if (hasBothCase || hasSpecial) score++;

    let level = "weak";
    if (score >= 4) level = "strong";
    else if (score === 3) level = "good";
    else if (score === 2) level = "fair";
    else level = "weak";

    fillBar.className = `password-meter-fill ${level}`;
    labelStatus.className = `password-meter-label ${level}`;

    const textMap = {
      weak: tr("strengthWeak"),
      fair: tr("strengthFair"),
      good: tr("strengthGood"),
      strong: tr("strengthStrong")
    };
    labelStatus.textContent = textMap[level];
  }

  /**
   * Real-time password match check
   */
  function verifyPasswordMatch() {
    const passInput = $("regPassword");
    const confirmInput = $("regConfirmPassword");
    const feedback = $("confirmPasswordError");

    if (!passInput || !confirmInput) return;

    const pass = passInput.value;
    const confirm = confirmInput.value;

    if (!confirm) {
      confirmInput.classList.remove("has-error", "has-success");
      if (feedback) feedback.classList.remove("show");
      return;
    }

    if (pass === confirm) {
      confirmInput.classList.remove("has-error");
      confirmInput.classList.add("has-success");
      if (feedback) feedback.classList.remove("show");
    } else {
      confirmInput.classList.add("has-error");
      confirmInput.classList.remove("has-success");
      if (feedback) {
        feedback.textContent = tr("errPasswordMismatch");
        feedback.classList.add("show");
      }
    }
  }

  /**
   * Toggles show/hide password visibility
   */
  function togglePassword(inputId, iconId, btnId) {
    const input = $(inputId);
    const icon = $(iconId);
    const btn = $(btnId);
    if (!input || !icon) return;

    const isPass = input.type === "password";
    input.type = isPass ? "text" : "password";
    icon.classList.toggle("bi-eye", !isPass);
    icon.classList.toggle("bi-eye-slash", isPass);
    if (btn) btn.setAttribute("aria-pressed", isPass ? "true" : "false");
  }

  /* ==========================================================================
   * 6. HEALTH GOAL SELECTION
   * ========================================================================== */
  function setupGoalTiles() {
    const tiles = document.querySelectorAll(".goal-tile");
    tiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        tiles.forEach((t) => t.classList.remove("active"));
        tile.classList.add("active");
        selectedGoal = tile.getAttribute("data-goal") || "stress";
      });
    });
  }

  /* ==========================================================================
   * 6.1 FAMILY MEMBERS ONBOARDING CONTROLLER
   * ========================================================================== */
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;");
  }

  function renderFamilyMembers() {
    const listEl = $("regFamilyList") || $("regMembersList");
    const countEl = $("regFamilyCount") || $("regMembersCount");
    const emptyEl = $("regMembersEmpty");
    if (!listEl) return;

    const count = familyMembers.length;
    const focusBtn = $("btnFocusAddMember");
    if (countEl) {
      if (count === 0) {
        countEl.textContent = tr("memberCountZero");
      } else {
        const isBn = currentLang === "bn";
        countEl.textContent = isBn ? `${count} ${tr("memberCountSuffix")}` : `${count} ${tr("memberCountSuffix")}`;
      }
    }

    if (count === 0) {
      if (focusBtn) focusBtn.classList.add("d-none");
      listEl.classList.add("d-none");
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.classList.remove("d-none");
      return;
    }

    if (focusBtn) focusBtn.classList.remove("d-none");
    if (emptyEl) emptyEl.classList.add("d-none");
    listEl.classList.remove("d-none");

    listEl.innerHTML = familyMembers.map((m) => {
      const relInfo = RELATION_MAP[m.relation] || RELATION_MAP.other;
      const relLabel = currentLang === "bn" ? relInfo.bn : relInfo.en;
      const ageStr = m.age ? (currentLang === "bn" ? `${m.age} বছর` : `${m.age} yrs`) : "";

      return `
        <div class="reg-member-card" data-id="${m.id}">
          <div class="reg-member-card-main">
            <div class="reg-member-avatar ${relInfo.class}">
              <i class="bi ${relInfo.icon}"></i>
            </div>
            <div class="reg-member-details">
              <div class="reg-member-name-row">
                <span class="reg-member-name">${escapeHtml(m.name)}</span>
                <span class="reg-relation-badge ${relInfo.class}">
                  <i class="bi ${relInfo.icon}"></i> ${relLabel}
                </span>
                ${ageStr ? `<span class="reg-age-badge"><i class="bi bi-calendar3"></i> ${ageStr}</span>` : ""}
              </div>
              ${m.healthNote ? `
                <div class="reg-member-health-note">
                  <i class="bi bi-heart-pulse-fill text-danger"></i>
                  <span>${escapeHtml(m.healthNote)}</span>
                </div>
              ` : ""}
            </div>
          </div>
          <button type="button" class="btn-remove-member" data-remove-id="${m.id}" title="${currentLang === 'bn' ? 'সদস্য মুছুন' : 'Remove member'}" aria-label="Remove member">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      `;
    }).join("");

    // Bind remove buttons
    listEl.querySelectorAll("[data-remove-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idToRemove = btn.getAttribute("data-remove-id");
        familyMembers = familyMembers.filter((m) => m.id !== idToRemove);
        renderFamilyMembers();
        showToast(tr("memberRemovedSuccess"), true);
      });
    });
  }

  function handleAddMemberToList() {
    const relInput = $("regMemberRelation");
    const nameInput = $("regMemberName");
    const ageInput = $("regMemberAge");
    const noteInput = $("regMemberNote");

    if (!nameInput) return;
    const name = nameInput.value.trim();
    if (!name || name.length < 2) {
      showToast(tr("errMemberNameRequired"), false);
      nameInput.focus();
      return;
    }

    const relation = relInput ? relInput.value : "other";
    const age = ageInput && ageInput.value ? parseInt(ageInput.value, 10) : null;
    const healthNote = noteInput ? noteInput.value.trim() : "";

    const newMember = {
      id: "mem_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name,
      relation,
      age: isNaN(age) ? null : age,
      healthNote,
      addedAt: new Date().toISOString()
    };

    familyMembers.push(newMember);
    renderFamilyMembers();

    // Reset inputs
    nameInput.value = "";
    if (ageInput) ageInput.value = "";
    if (noteInput) noteInput.value = "";
    nameInput.focus();
    showToast(tr("memberAddedSuccess"), true);
  }

  /* ==========================================================================
   * 7. REGISTRATION SUBMISSION & VALIDATION
   * ========================================================================== */
  function handleRegistration(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = $("regFullName");
    const emailInput = $("regEmail");
    const phoneInput = $("regPhone");
    const passInput = $("regPassword");
    const confirmInput = $("regConfirmPassword");
    const termsCheck = $("regTermsCheck");
    const btnSubmit = $("btnRegSubmit");
    const btnText = $("btnRegText");
    const btnSpinner = $("btnRegSpinner");
    const formAlert = $("regFormAlert");

    const nameError = $("nameError");
    const emailError = $("emailError");
    const passError = $("passwordError");
    const confirmError = $("confirmPasswordError");
    const termsError = $("termsError");

    // Reset error classes
    [nameInput, emailInput, passInput, confirmInput].forEach((inp) => inp?.classList.remove("has-error"));
    [nameError, emailError, passError, confirmError, termsError].forEach((err) => {
      if (err) {
        err.classList.remove("show");
        err.textContent = "";
      }
    });
    if (formAlert) {
      formAlert.classList.add("d-none");
      formAlert.textContent = "";
    }

    const nameVal = nameInput ? nameInput.value.trim() : "";
    const emailVal = emailInput ? emailInput.value.trim() : "";
    const phoneVal = phoneInput ? phoneInput.value.trim() : "";
    const passVal = passInput ? passInput.value : "";
    const confirmVal = confirmInput ? confirmInput.value : "";
    const isTermsAgreed = termsCheck ? termsCheck.checked : false;

    let hasError = false;

    if (!nameVal || nameVal.length < 2) {
      if (nameInput) nameInput.classList.add("has-error");
      if (nameError) {
        nameError.textContent = tr("errEmptyName");
        nameError.classList.add("show");
      }
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      if (emailInput) emailInput.classList.add("has-error");
      if (emailError) {
        emailError.textContent = tr("errEmptyEmail");
        emailError.classList.add("show");
      }
      hasError = true;
    } else if (!emailRegex.test(emailVal)) {
      if (emailInput) emailInput.classList.add("has-error");
      if (emailError) {
        emailError.textContent = tr("errInvalidEmail");
        emailError.classList.add("show");
      }
      hasError = true;
    }

    if (!passVal || passVal.length < 6) {
      if (passInput) passInput.classList.add("has-error");
      if (passError) {
        passError.textContent = tr("errPasswordShort");
        passError.classList.add("show");
      }
      hasError = true;
    }

    if (passVal !== confirmVal) {
      if (confirmInput) confirmInput.classList.add("has-error");
      if (confirmError) {
        confirmError.textContent = tr("errPasswordMismatch");
        confirmError.classList.add("show");
      }
      hasError = true;
    }

    if (!isTermsAgreed) {
      if (termsError) {
        termsError.textContent = tr("errTermsRequired");
        termsError.classList.add("show");
      }
      hasError = true;
    }

    if (hasError) return;

    // Check if email already registered
    const users = getRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === emailVal.toLowerCase());
    if (existing) {
      if (emailInput) emailInput.classList.add("has-error");
      if (emailError) {
        emailError.textContent = tr("errEmailTaken");
        emailError.classList.add("show");
      }
      return;
    }

    // Show loading
    if (btnSubmit) btnSubmit.disabled = true;
    if (btnText) btnText.textContent = tr("btnRegisterLoading");
    if (btnSpinner) btnSpinner.classList.remove("d-none");

    setTimeout(() => {
      const newUser = {
        id: "usr_" + Date.now(),
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        password: passVal,
        role: "Member",
        gender: "unspecified",
        bloodGroup: "unspecified",
        goal: selectedGoal,
        members: familyMembers,
        joined: new Date().toISOString(),
        avatar: "avatar1",
        boltScore: 25,
        sessionsCompleted: 1,
        streakDays: 1
      };

      users.push(newUser);

      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newUser));
      } catch (_) { }

      showToast(tr("regSuccess"), true);

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 700);
    }, 500);
  }

  /* ==========================================================================
   * 8. EVENT BINDINGS & LIFECYCLE INITIALIZATION
   * ========================================================================== */
  function initRegisterForm() {
    applyLanguage(currentLang);
    setupGoalTiles();

    // Live password evaluations
    const passInput = $("regPassword");
    if (passInput) {
      passInput.addEventListener("input", () => {
        evaluatePasswordStrength();
        verifyPasswordMatch();
      });
    }

    const confirmInput = $("regConfirmPassword");
    if (confirmInput) {
      confirmInput.addEventListener("input", verifyPasswordMatch);
    }

    // Password visibility toggles
    const togglePass1 = $("btnTogglePassword1");
    if (togglePass1) {
      togglePass1.addEventListener("click", () => {
        togglePassword("regPassword", "passwordToggleIcon1", "btnTogglePassword1");
      });
    }

    const togglePass2 = $("btnTogglePassword2");
    if (togglePass2) {
      togglePass2.addEventListener("click", () => {
        togglePassword("regConfirmPassword", "passwordToggleIcon2", "btnTogglePassword2");
      });
    }

    // Family Members Onboarding
    const btnAddMember = $("btnAddRegMember");
    if (btnAddMember) {
      btnAddMember.addEventListener("click", handleAddMemberToList);
    }

    // Quick Relation Selector Pills
    document.querySelectorAll(".btn-relation-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const rel = pill.getAttribute("data-rel");
        const relInput = $("regMemberRelation");
        if (relInput && rel) {
          relInput.value = rel;
        }
        document.querySelectorAll(".btn-relation-pill").forEach((p) => p.classList.remove("active-pill"));
        pill.classList.add("active-pill");
        const nameInput = $("regMemberName");
        if (nameInput) nameInput.focus();
      });
    });

    // Quick Condition Suggestion Badges
    document.querySelectorAll(".btn-condition-tag").forEach((tagBtn) => {
      tagBtn.addEventListener("click", () => {
        const tag = tagBtn.getAttribute("data-tag");
        const noteInput = $("regMemberNote");
        if (noteInput && tag) {
          const cur = noteInput.value.trim();
          if (!cur) {
            noteInput.value = tag;
          } else if (!cur.includes(tag)) {
            noteInput.value = cur + ", " + tag;
          }
          noteInput.focus();
        }
      });
    });

    // Enter Key on Member Form Inputs
    ["regMemberName", "regMemberAge"].forEach((id) => {
      const el = $(id);
      if (el) {
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddMemberToList();
          }
        });
      }
    });

    // Keep active relation pill synchronized when dropdown changes
    const relSelect = $("regMemberRelation");
    if (relSelect) {
      relSelect.addEventListener("change", () => {
        const val = relSelect.value;
        document.querySelectorAll(".btn-relation-pill").forEach((p) => {
          if (p.getAttribute("data-rel") === val) {
            p.classList.add("active-pill");
          } else {
            p.classList.remove("active-pill");
          }
        });
      });
    }

    // Focus on Add Member when clicking "+ Add More Members"
    const btnFocusAdd = $("btnFocusAddMember");
    if (btnFocusAdd) {
      btnFocusAdd.addEventListener("click", () => {
        const nameInput = $("regMemberName");
        if (nameInput) {
          nameInput.focus();
          nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }

    renderFamilyMembers();

    // Social SSO demo buttons
    document.querySelectorAll(".btn-social-auth").forEach((btn) => {
      btn.addEventListener("click", () => {
        showToast(tr("socialDemoMsg"), false);
      });
    });

    // Registration Form submit
    const form = $("registerForm");
    if (form) form.addEventListener("submit", handleRegistration);

    // Language synchronization (handled globally by global-nav.js)
    window.addEventListener("bwLanguageChanged", (e) => {
      if (e.detail?.lang && e.detail.lang !== currentLang) {
        applyLanguage(e.detail.lang);
      }
    });
  }

  // DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRegisterForm);
  } else {
    initRegisterForm();
  }
})();

