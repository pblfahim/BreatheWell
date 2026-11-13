/**
 * ============================================================================
 * BreatheWell - Authentication & Login Controller (login.js)
 * ============================================================================
 * @file        asset/js/login.js
 * @module      BreatheWell/Login
 * @description Client-side controller for BreatheWell member sign-in:
 *                1. Bilingual Localization Engine (Bengali / English)
 *                2. Real-Time Credential Validation & Accessibility Alerts
 *                3. Password Visibility Toggle with ARIA Attributes
 *                4. 1-Click Healthcare & Mindful Demo Login Shortcut
 *                5. Interactive Password Recovery Simulation Modal
 *                6. Active Session Detection & Seamless Profile Redirection
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
      docTitle: "BreatheWell | লগইন",
      pageTitle: "স্বাগতম BreatheWell-এ",
      pageSubtitle: "আপনার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন",
      labelEmail: "ইমেইল",
      placeholderEmail: "jane@company.com",
      labelPassword: "পাসওয়ার্ড",
      placeholderPassword: "আপনার পাসওয়ার্ড লিখুন",
      rememberMe: "মনে রাখুন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      btnLogin: "লগইন করুন",
      btnLoginLoading: "যাচাই করা হচ্ছে...",
      orSignInWith: "অথবা ইমেইল দিয়ে প্রবেশ করুন",
      demoCardTitle: "দ্রুত ডেমো লগইন",
      demoCardDesc: "১-ক্লিকে পরীক্ষামূলক অ্যাকাউন্টে প্রবেশ করুন",
      btnDemoFill: "ডেমো টেস্ট করুন",
      dontHaveAccount: "অ্যাকাউন্ট নেই?",
      registerNow: "নতুন অ্যাকাউন্ট তৈরি করুন",
      securityBadge: "২৫৬-বিট এনক্রিপশন ও HIPAA সম্মত গোপনীয়তা",
      errEmptyEmail: "অনুগ্রহ করে আপনার ইমেইল বা ইউজারনেম লিখুন।",
      errInvalidEmail: "সঠিক ইমেইল ফরম্যাট প্রদান করুন।",
      errEmptyPassword: "পাসওয়ার্ড প্রদান করা আবশ্যক।",
      errInvalidCredentials: "ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।",
      loginSuccess: "লগইন সফল হয়েছে! প্রোফাইলে নিয়ে যাওয়া হচ্ছে...",
      activeSessionTitle: "আপনি ইতিমধ্যে লগইন অবস্থায় আছেন",
      btnContinueProfile: "প্রোফাইলে যান",
      btnLogoutCurrent: "অন্য অ্যাকাউন্ট / লগআউট",
      socialGoogle: "গুগল",
      socialApple: "অ্যাপল",
      socialHealth: "হেলথ আইডি",
      socialFacebook: "ফেসবুক",
      trustSecureSignIn: "নিরাপদ সাইন-ইন",
      trustSsoSupported: "SSO সমর্থিত",
      socialDemoMsg: "ডেমো মোড: সোশ্যাল সাইন-ইন সিমুলেটেড। অনুগ্রহ করে ইমেইল বা ডেমো বাটন ব্যবহার করুন।",
      forgotModalTitle: "পাসওয়ার্ড পুনরুদ্ধার",
      forgotModalDesc: "আপনার নিবন্ধিত ইমেইল লিখুন। আমরা তাৎক্ষণিক রিকভারি কোড তৈরি করব।",
      btnSendResetCode: "রিকভারি কোড পাঠান",
      labelRecoveryCode: "নিরাপত্তা কোড",
      labelNewPassword: "নতুন পাসওয়ার্ড লিখুন",
      btnConfirmReset: "পাসওয়ার্ড পরিবর্তন সম্পন্ন করুন",
      resetSuccessMsg: "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।",
      invalidResetCode: "কোড সঠিক নয়। আবার চেষ্টা করুন।",
      emptyNewPass: "নতুন পাসওয়ার্ড নূন্যতম ৬ অক্ষরের হতে হবে।",
      visualPillTag: "সুস্থ শ্বাস ও মননশীল জীবনের ঠিকানা",
      visualHeroTitle1: "প্রতিটি নিঃশ্বাসে সুস্থতা,",
      visualHeroTitle2: "প্রতিটি পদক্ষেপে দীর্ঘায়ু",
      visualHeroTitle2_1: "রক্তচাপ ও গ্লুকোজ ট্র্যাকিং,",
      visualHeroTitle2_2: "স্মার্ট স্বাস্থ্য মনিটরিং",
      visualHeroTitle3_1: "এআই প্রেসক্রিপশন স্ক্যানার,",
      visualHeroTitle3_2: "নিরাপদ ডিজিটাল ভল্ট",
      visualHeroSub: "বৈজ্ঞানিক শ্বাসচর্চা, ফুসফুসের ক্ষমতা পরীক্ষা ও প্রেসক্রিপশন ভল্টের এক সমন্বিত ডিজিটাল প্ল্যাটফর্ম।",
      statBoltBadge: "সর্বোচ্চ BOLT স্কোর",
      statCalmPulse: "৪-৭-৮ শান্ত শ্বাস",
      statCalmDesc: "স্নায়ু শিথিলকারী ছন্দ",
      statRxSafe: "১০০% এনক্রিপ্টেড",
      statRxDesc: "ডিজিটাল প্রেসক্রিপশন ভল্ট",
      featureItem1: "BOLT রেসপিরেটরি টেস্ট",
      featureItem2: "পরিবারের সদস্য ট্র্যাকিং",
      featureItem3: "প্রেসক্রিপশন OCR স্ক্যান",
      featureSlide2_1: "AHA ও ADA স্কেল",
      featureSlide2_2: "৭-৩০ দিনের ট্রেন্ড গ্রাফ",
      featureSlide2_3: "ডক্টর রিপোর্ট সামারি",
      featureSlide3_1: "অটো মেডিসিন ডিটেকশন",
      featureSlide3_2: "১০০% এনক্রিপ্টেড ভল্ট",
      featureSlide3_3: "ডিজিটাল সিগনেচার ভেরিফাইড",
      heroSlide2Live: "লাইভ মনিটর",
      heroSlide2BpLabel: "রক্তচাপ (BP)",
      heroSlide2BpStatus: "স্বাভাবিক",
      heroSlide2BgLabel: "রক্তের গ্লুকোজ",
      heroSlide2BgStatus: "খাবার পূর্বে",
      heroSlide2PulseLabel: "পালস রেট",
      heroSlide2PulseStatus: "সুষম ছন্দ",
      heroSlide2Pill1: "AHA 2017 স্ট্যান্ডার্ড",
      heroSlide2Pill2: "৭-৩০ দিনের ট্রেন্ড",
      heroSlide2Pill3: "পিন লক সুরক্ষিত",
      heroSlide3PadTitle: "সিটি কেয়ার হাসপাতাল · ডিজিটাল প্রেসক্রিপশন",
      heroSlide3Doc: "ডাঃ এম. এ. রহমান (MBBS, FCPS)",
      heroSlide3ScanStatus: "ওসিআর স্ক্যান সক্রিয়...",
      heroSlide3Accuracy: "৯৮% ওসিআর সঠিকতা",
      heroSlide3Med1: "Tab. Napa Extra 500mg",
      heroSlide3Dose1: "১+০+১ (ভরা পেটে)",
      heroSlide3Med2: "Cap. Seclo 20mg",
      heroSlide3Dose2: "১+০+১ (খাবার পূর্বে)",
      heroSlide3Date: "আজকের প্রেসক্রিপশন",
      heroSlide3Stamp: "ডিজিটাল ভেরিফাইড",
      heroSlide3Pill1: "অটো মেডিসিন ডিটেকশন",
      heroSlide3Pill2: "ডিজিটাল সিগনেচার",
      heroSlide3Pill3: "হোয়াটসঅ্যাপে শেয়ার",
      heroLiveBreathing: "মৃদু শ্বাস নিন...",
      heroLiveExhale: "ধীরে শ্বাস ছাড়ুন...",
      heroOrbTap: "আমাকে ট্যাপ করুন!",
      heroOrbSmile: "দারুণ! একটি গভীর শ্বাস নিন 🌸",
      heroPillHeart: "প্রশান্ত হৃদয়",
      heroPillQuick: "১ মিনিটে প্রশান্তি",
      gentlePractice: "নরম ও স্বচ্ছন্দ",
      heroPillStress: "চাপ হ্রাস",
      trustBadgeText: "৫০,০০০+ সুস্থ শ্বাসচর্চাকারীর আস্থা",
      footerTag: "প্রতিটি নিঃশ্বাসে একটি প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।"
    },
    en: {
      docTitle: "BreatheWell | Log In",
      pageTitle: "Welcome back",
      pageSubtitle: "Sign in to continue to your dashboard",
      labelEmail: "Email",
      placeholderEmail: "jane@company.com",
      labelPassword: "Password",
      placeholderPassword: "Enter your password",
      rememberMe: "Keep me signed in",
      forgotPassword: "Forgot password?",
      btnLogin: "Sign in",
      btnLoginLoading: "Verifying...",
      orSignInWith: "Or sign in with email",
      demoCardTitle: "Quick Demo Login",
      demoCardDesc: "Explore immediately with a sample patient account",
      btnDemoFill: "Try Demo Account",
      dontHaveAccount: "Don't have an account?",
      registerNow: "Sign up",
      securityBadge: "256-bit Encryption & HIPAA-compliant Privacy",
      errEmptyEmail: "Please enter your email or username.",
      errInvalidEmail: "Please enter a valid email format.",
      errEmptyPassword: "Password is required.",
      errInvalidCredentials: "Invalid credentials. Please verify and try again.",
      loginSuccess: "Login successful! Redirecting to your profile...",
      activeSessionTitle: "You are currently logged in",
      btnContinueProfile: "Go to Profile",
      btnLogoutCurrent: "Switch Account / Log Out",
      socialGoogle: "Google",
      socialApple: "Apple",
      socialHealth: "Health ID",
      socialFacebook: "Facebook",
      trustSecureSignIn: "Secure sign-in",
      trustSsoSupported: "SSO supported",
      socialDemoMsg: "Demo Notice: Social SSO is simulated. Please use email or 1-Click Demo.",
      forgotModalTitle: "Password Recovery",
      forgotModalDesc: "Enter your registered email address to generate an instant recovery code.",
      btnSendResetCode: "Generate Recovery Code",
      labelRecoveryCode: "Security Code",
      labelNewPassword: "Enter New Password",
      btnConfirmReset: "Update Password",
      resetSuccessMsg: "Password updated successfully! Please log in with your new password.",
      invalidResetCode: "Invalid security code. Please check and try again.",
      emptyNewPass: "New password must be at least 6 characters.",
      visualPillTag: "Mindful Breathing & Vitality Portal",
      visualHeroTitle1: "Wellness in Every Breath,",
      visualHeroTitle2: "Vitality in Every Step",
      visualHeroTitle2_1: "Real-time Vitals & BP,",
      visualHeroTitle2_2: "Smart Health Monitoring",
      visualHeroTitle3_1: "AI Prescription Scanner,",
      visualHeroTitle3_2: "Secure Digital Vault",
      visualHeroSub: "Scientifically grounded breathing exercises, respiratory fitness testing, and digital prescription vault.",
      statBoltBadge: "Peak BOLT Score",
      statCalmPulse: "4-7-8 Calm Cadence",
      statCalmDesc: "Nervous System Reset",
      statRxSafe: "100% Encrypted",
      statRxDesc: "Digital Prescription Vault",
      featureItem1: "BOLT Respiratory Assessment",
      featureItem2: "Family Multi-Profile Tracking",
      featureItem3: "Prescription OCR Scanner",
      featureSlide2_1: "AHA & ADA Standards",
      featureSlide2_2: "7-30 Day Health Trends",
      featureSlide2_3: "Doctor Report Summary",
      featureSlide3_1: "Auto Medicine Detection",
      featureSlide3_2: "100% Encrypted Vault",
      featureSlide3_3: "Digital Signature Verified",
      heroSlide2Live: "Live Monitor",
      heroSlide2BpLabel: "Blood Pressure (BP)",
      heroSlide2BpStatus: "Normal",
      heroSlide2BgLabel: "Blood Glucose",
      heroSlide2BgStatus: "Fasting",
      heroSlide2PulseLabel: "Pulse Rate",
      heroSlide2PulseStatus: "Regular Rhythm",
      heroSlide2Pill1: "AHA 2017 Standard",
      heroSlide2Pill2: "7-30 Day Trends",
      heroSlide2Pill3: "PIN Lock Protected",
      heroSlide3PadTitle: "City Care Hospital · Digital Rx",
      heroSlide3Doc: "Dr. M. A. Rahman (MBBS, FCPS)",
      heroSlide3ScanStatus: "OCR Scanning Active...",
      heroSlide3Accuracy: "98% OCR Accuracy",
      heroSlide3Med1: "Tab. Napa Extra 500mg",
      heroSlide3Dose1: "1+0+1 (After Meals)",
      heroSlide3Med2: "Cap. Seclo 20mg",
      heroSlide3Dose2: "1+0+1 (Before Meals)",
      heroSlide3Date: "Today's Prescription",
      heroSlide3Stamp: "Digitally Verified",
      heroSlide3Pill1: "Auto Medicine Detection",
      heroSlide3Pill2: "Digital Signature",
      heroSlide3Pill3: "Share via WhatsApp",
      heroLiveBreathing: "Breathe In Gently...",
      heroLiveExhale: "Breathe Out Slowly...",
      heroOrbTap: "Tap Me!",
      heroOrbSmile: "Wonderful! Take a mindful breath 🌸",
      heroPillHeart: "Calm Heart",
      heroPillQuick: "1-Min Relief",
      gentlePractice: "Gentle & Easy",
      heroPillStress: "Stress Relief",
      trustBadgeText: "Trusted by 50,000+ mindful breathers",
      footerTag: "Peace in every breath",
      footerDisclaimer: "For general wellness. Not a substitute for medical advice."
    }
  };

  /* ==========================================================================
   * 2. STATE & DEFAULT SEED DATA
   * ========================================================================== */
  let currentLang = localStorage.getItem("bw-lang") || localStorage.getItem("bw_lang") || "bn";
  const USERS_STORAGE_KEY = "bw_users";
  const ACTIVE_USER_KEY = "bw_active_user";
  const REMEMBER_EMAIL_KEY = "bw_remember_email";

  const DEFAULT_DEMO_USERS = [
    {
      id: "usr_ayesha",
      name: "ডা. আয়েশা রহমান",
      email: "demo@breathewell.com",
      password: "demo123",
      role: "Medical Practitioner & Wellness Member",
      gender: "female",
      bloodGroup: "A+",
      phone: "+880 1712-345678",
      goal: "stress",
      joined: "2024-01-15T09:00:00.000Z",
      avatar: "dr_ayesha",
      boltScore: 32,
      sessionsCompleted: 48,
      streakDays: 14
    },
    {
      id: "usr_tanvir",
      name: "তানভীর আহমেদ",
      email: "tanvir@breathewell.com",
      password: "demo123",
      role: "Mindful Explorer",
      gender: "male",
      bloodGroup: "O+",
      phone: "+880 1819-876543",
      goal: "focus",
      joined: "2024-03-10T14:30:00.000Z",
      avatar: "tanvir",
      boltScore: 28,
      sessionsCompleted: 26,
      streakDays: 7
    }
  ];

  /**
   * Safe DOM element selector
   */
  const $ = (id) => document.getElementById(id);

  /**
   * Translation helper
   */
  function tr(key) {
    return T[currentLang]?.[key] ?? T.bn[key] ?? key;
  }

  /**
   * Initializes local user database with default demo accounts if uninitialized
   */
  function seedDefaultUsers() {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
      }
    } catch (_) { }
  }

  /**
   * Retrieve list of registered users
   */
  function getRegisteredUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_DEMO_USERS;
    } catch (_) {
      return DEFAULT_DEMO_USERS;
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

    // Replace all [data-i18n]
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (T[currentLang][k] !== undefined) {
        el.textContent = T[currentLang][k];
      }
    });

    // Replace placeholders
    const emailInput = $("loginEmail");
    if (emailInput) emailInput.placeholder = tr("placeholderEmail");
    const passInput = $("loginPassword");
    if (passInput) passInput.placeholder = tr("placeholderPassword");

    // Update Language Toggle Button
    const langBtn = $("langToggle");
    if (langBtn) {
      langBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
    }

    if (typeof updateHeroTitleAndFeatures === "function") {
      updateHeroTitleAndFeatures();
    }
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
   * 5. AUTHENTICATION & SESSION MANAGEMENT
   * ========================================================================== */

  /**
   * Checks if an active session already exists and presents active session banner
   */
  function checkActiveSession() {
    try {
      const rawUser = localStorage.getItem(ACTIVE_USER_KEY);
      if (!rawUser) return;
      const user = JSON.parse(rawUser);

      const activeBanner = $("activeSessionBanner");
      const activeName = $("activeSessionName");
      const activeEmail = $("activeSessionEmail");
      const activeInitial = $("activeSessionInitial");
      const loginFormCard = $("loginFormContainer");

      if (activeBanner && user) {
        if (activeName) activeName.textContent = user.name || "Member";
        if (activeEmail) activeEmail.textContent = user.email || "";
        if (activeInitial) activeInitial.textContent = (user.name ? user.name.trim().charAt(0) : "U").toUpperCase();

        activeBanner.classList.remove("d-none");
        if (loginFormCard) loginFormCard.classList.add("d-none");
      }
    } catch (_) { }
  }

  /**
   * Resets active session and restores login form
   */
  function switchAccount() {
    try {
      localStorage.removeItem(ACTIVE_USER_KEY);
    } catch (_) { }

    const activeBanner = $("activeSessionBanner");
    const loginFormCard = $("loginFormContainer");
    if (activeBanner) activeBanner.classList.add("d-none");
    if (loginFormCard) loginFormCard.classList.remove("d-none");

    const emailInput = $("loginEmail");
    if (emailInput) {
      emailInput.value = "";
      emailInput.focus();
    }
  }

  /**
   * Validates email or username format
   */
  function isValidEmailOrUsername(val) {
    if (!val || typeof val !== "string") return false;
    const clean = val.trim();
    if (clean.length < 3) return false;
    if (clean.includes("@")) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
    }
    return true; // Simple username allowed
  }

  /**
   * Performs client-side sign-in
   */
  function handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();

    const emailInput = $("loginEmail");
    const passInput = $("loginPassword");
    const rememberCheckbox = $("rememberMe");
    const btnSubmit = $("btnLoginSubmit");
    const btnText = $("btnLoginText");
    const btnSpinner = $("btnLoginSpinner");
    const emailError = $("emailError");
    const passError = $("passwordError");
    const formAlert = $("loginFormAlert");

    // Clear previous errors
    if (emailInput) emailInput.classList.remove("has-error");
    if (passInput) passInput.classList.remove("has-error");
    if (emailError) emailError.classList.remove("show");
    if (passError) passError.classList.remove("show");
    if (formAlert) {
      formAlert.classList.add("d-none");
      formAlert.textContent = "";
    }

    const emailVal = emailInput ? emailInput.value.trim() : "";
    const passVal = passInput ? passInput.value : "";

    let hasError = false;

    if (!emailVal) {
      if (emailInput) emailInput.classList.add("has-error");
      if (emailError) {
        emailError.textContent = tr("errEmptyEmail");
        emailError.classList.add("show");
      }
      hasError = true;
    } else if (!isValidEmailOrUsername(emailVal)) {
      if (emailInput) emailInput.classList.add("has-error");
      if (emailError) {
        emailError.textContent = tr("errInvalidEmail");
        emailError.classList.add("show");
      }
      hasError = true;
    }

    if (!passVal) {
      if (passInput) passInput.classList.add("has-error");
      if (passError) {
        passError.textContent = tr("errEmptyPassword");
        passError.classList.add("show");
      }
      hasError = true;
    }

    if (hasError) return;

    // Show loading state
    if (btnSubmit) btnSubmit.disabled = true;
    if (btnText) btnText.textContent = tr("btnLoginLoading");
    if (btnSpinner) btnSpinner.classList.remove("d-none");

    setTimeout(() => {
      const users = getRegisteredUsers();
      const matched = users.find(
        (u) =>
          (u.email.toLowerCase() === emailVal.toLowerCase() ||
           (u.username && u.username.toLowerCase() === emailVal.toLowerCase())) &&
          u.password === passVal
      );

      if (matched) {
        // Save active user
        try {
          localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(matched));
          if (rememberCheckbox && rememberCheckbox.checked) {
            localStorage.setItem(REMEMBER_EMAIL_KEY, emailVal);
          } else {
            localStorage.removeItem(REMEMBER_EMAIL_KEY);
          }
        } catch (_) { }

        showToast(tr("loginSuccess"), true);

        // Redirect to profile or query parameter target
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get("redirect") || "profile.html";
          window.location.href = redirect;
        }, 600);
      } else {
        // Credential error feedback
        if (btnSubmit) btnSubmit.disabled = false;
        if (btnText) btnText.textContent = tr("btnLogin");
        if (btnSpinner) btnSpinner.classList.add("d-none");

        if (formAlert) {
          formAlert.textContent = tr("errInvalidCredentials");
          formAlert.classList.remove("d-none");
        }
        if (passInput) {
          passInput.classList.add("has-error");
          passInput.focus();
        }
      }
    }, 450);
  }

  /**
   * 1-Click Demo Fill: Autofills demo credentials and submits
   */
  function handleDemoFill() {
    const emailInput = $("loginEmail");
    const passInput = $("loginPassword");
    const rememberCheckbox = $("rememberMe");

    if (emailInput) emailInput.value = "demo@breathewell.com";
    if (passInput) passInput.value = "demo123";
    if (rememberCheckbox) rememberCheckbox.checked = true;

    handleLogin();
  }

  /**
   * Toggles password field visibility
   */
  function togglePasswordVisibility() {
    const passInput = $("loginPassword");
    const icon = $("passwordToggleIcon");
    const btn = $("btnTogglePassword");
    if (!passInput || !icon) return;

    const isPassword = passInput.type === "password";
    passInput.type = isPassword ? "text" : "password";
    icon.classList.toggle("bi-eye", !isPassword);
    icon.classList.toggle("bi-eye-slash", isPassword);
    if (btn) btn.setAttribute("aria-pressed", isPassword ? "true" : "false");
  }

  /* ==========================================================================
   * 6. PASSWORD RECOVERY SIMULATION
   * ========================================================================== */
  let activeRecoveryCode = null;
  let activeRecoveryEmail = null;

  function handleSendResetCode() {
    const emailInput = $("forgotEmailInput");
    const email = emailInput ? emailInput.value.trim() : "";
    const alertBox = $("forgotModalAlert");
    const step1 = $("forgotStep1");
    const step2 = $("forgotStep2");
    const codeDisplay = $("recoveryCodeVal");

    if (!email || !isValidEmailOrUsername(email)) {
      if (alertBox) {
        alertBox.textContent = tr("errInvalidEmail");
        alertBox.classList.remove("d-none");
      }
      return;
    }

    if (alertBox) alertBox.classList.add("d-none");

    // Generate realistic simulated 6-digit verification code
    activeRecoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
    activeRecoveryEmail = email;

    if (codeDisplay) codeDisplay.textContent = activeRecoveryCode;
    if (step1) step1.classList.add("d-none");
    if (step2) step2.classList.remove("d-none");
  }

  function handleConfirmReset() {
    const codeInput = $("forgotCodeInput");
    const newPassInput = $("forgotNewPassword");
    const alertBox = $("forgotModalAlertStep2");

    const code = codeInput ? codeInput.value.trim() : "";
    const newPass = newPassInput ? newPassInput.value : "";

    if (alertBox) alertBox.classList.add("d-none");

    if (code !== activeRecoveryCode) {
      if (alertBox) {
        alertBox.textContent = tr("invalidResetCode");
        alertBox.classList.remove("d-none");
      }
      return;
    }

    if (!newPass || newPass.length < 6) {
      if (alertBox) {
        alertBox.textContent = tr("emptyNewPass");
        alertBox.classList.remove("d-none");
      }
      return;
    }

    // Update password in bw_users
    try {
      const users = getRegisteredUsers();
      const idx = users.findIndex((u) => u.email.toLowerCase() === activeRecoveryEmail.toLowerCase());
      if (idx !== -1) {
        users[idx].password = newPass;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } else {
        // If not found, add user with new password
        users.push({
          id: "usr_" + Date.now(),
          name: activeRecoveryEmail.split("@")[0],
          email: activeRecoveryEmail,
          password: newPass,
          role: "Member",
          joined: new Date().toISOString()
        });
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }
    } catch (_) { }

    // Close modal
    const modalEl = $("forgotPasswordModal");
    if (window.bootstrap?.Modal && modalEl) {
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    showToast(tr("resetSuccessMsg"), true);

    // Pre-fill email
    const emailInput = $("loginEmail");
    const passInput = $("loginPassword");
    if (emailInput) emailInput.value = activeRecoveryEmail;
    if (passInput) {
      passInput.value = newPass;
      passInput.focus();
    }
  }

  /* ==========================================================================
   * 7. MULTI-SCENE 3D SHOWCASE SLIDER CONTROLLER
   * ========================================================================== */
  const SHOWCASE_SLIDES = [
    {
      title1Key: "visualHeroTitle1",
      title2Key: "visualHeroTitle2",
      features: [
        { icon: "bi-check2-circle text-teal", key: "featureItem1" },
        { icon: "bi-check2-circle text-teal", key: "featureItem2" },
        { icon: "bi-check2-circle text-teal", key: "featureItem3" }
      ]
    },
    {
      title1Key: "visualHeroTitle2_1",
      title2Key: "visualHeroTitle2_2",
      features: [
        { icon: "bi-activity text-teal", key: "featureSlide2_1" },
        { icon: "bi-graph-up-arrow text-teal", key: "featureSlide2_2" },
        { icon: "bi-file-earmark-medical text-teal", key: "featureSlide2_3" }
      ]
    },
    {
      title1Key: "visualHeroTitle3_1",
      title2Key: "visualHeroTitle3_2",
      features: [
        { icon: "bi-magic text-teal", key: "featureSlide3_1" },
        { icon: "bi-shield-check text-teal", key: "featureSlide3_2" },
        { icon: "bi-patch-check-fill text-teal", key: "featureSlide3_3" }
      ]
    }
  ];

  let currentShowcaseSlide = 0;
  let showcaseTimer = null;

  function updateHeroTitleAndFeatures() {
    const config = SHOWCASE_SLIDES[currentShowcaseSlide];
    if (!config) return;

    const line1El = $("visualHeroLine1");
    const line2El = $("visualHeroLine2");
    const featRow = $("visualFeaturesRow");

    if (line1El) {
      line1El.setAttribute("data-i18n", config.title1Key);
      line1El.textContent = tr(config.title1Key);
    }
    if (line2El) {
      line2El.setAttribute("data-i18n", config.title2Key);
      line2El.textContent = tr(config.title2Key);
    }

    const titleEl = $("visualHeroTitle");
    if (titleEl) {
      titleEl.classList.remove("title-transitioning");
      void titleEl.offsetWidth;
      titleEl.classList.add("title-transitioning");
    }

    if (featRow) {
      featRow.innerHTML = config.features.map((f) => `
        <div class="visual-feature-item">
          <i class="bi ${f.icon}"></i>
          <span data-i18n="${f.key}">${tr(f.key)}</span>
        </div>
      `).join("");
    }
  }

  function initShowcaseSlider() {
    const slides = document.querySelectorAll(".login-showcase-slide");
    const dots = document.querySelectorAll(".login-slider-dot");
    const prevBtn = $("btnSlidePrev");
    const nextBtn = $("btnSlideNext");
    const sliderWrap = $("loginShowcaseSlider");

    if (!slides.length) return;

    function goToSlide(idx) {
      currentShowcaseSlide = (idx + slides.length) % slides.length;

      slides.forEach((s, i) => {
        if (i === currentShowcaseSlide) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });

      dots.forEach((d, i) => {
        if (i === currentShowcaseSlide) {
          d.classList.add("active");
          d.setAttribute("aria-selected", "true");
        } else {
          d.classList.remove("active");
          d.setAttribute("aria-selected", "false");
        }
      });

      updateHeroTitleAndFeatures();
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const targetIdx = parseInt(dot.getAttribute("data-slide"), 10);
        if (!isNaN(targetIdx)) {
          goToSlide(targetIdx);
          restartTimer();
        }
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goToSlide(currentShowcaseSlide - 1);
        restartTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goToSlide(currentShowcaseSlide + 1);
        restartTimer();
      });
    }

    function startTimer() {
      stopTimer();
      showcaseTimer = setInterval(() => {
        goToSlide(currentShowcaseSlide + 1);
      }, 5500);
    }

    function stopTimer() {
      if (showcaseTimer) {
        clearInterval(showcaseTimer);
        showcaseTimer = null;
      }
    }

    function restartTimer() {
      stopTimer();
      startTimer();
    }

    if (sliderWrap) {
      sliderWrap.addEventListener("mouseenter", stopTimer);
      sliderWrap.addEventListener("mouseleave", startTimer);
    }

    startTimer();
    goToSlide(0);
  }

  let heroBreathingInterval = null;
  let heroIsInhale = true;

  function initBreathingGuide() {
    const guideEl = $("heroOrbGuide");
    const orbEl = $("heroBuddyOrb");
    if (!guideEl && !orbEl) return;

    if (heroBreathingInterval) {
      clearInterval(heroBreathingInterval);
    }

    heroBreathingInterval = setInterval(() => {
      heroIsInhale = !heroIsInhale;
      if (guideEl && !guideEl.dataset.customText) {
        guideEl.textContent = heroIsInhale ? tr("heroLiveBreathing") : tr("heroLiveExhale");
        guideEl.classList.toggle("exhaling", !heroIsInhale);
      }
    }, 4000);

    if (orbEl) {
      orbEl.addEventListener("click", () => {
        orbEl.classList.remove("buddy-giggle");
        void orbEl.offsetWidth;
        orbEl.classList.add("buddy-giggle");

        if (guideEl) {
          guideEl.dataset.customText = "true";
          guideEl.textContent = tr("heroOrbSmile");
          setTimeout(() => {
            delete guideEl.dataset.customText;
            if (guideEl) {
              guideEl.textContent = heroIsInhale ? tr("heroLiveBreathing") : tr("heroLiveExhale");
              guideEl.classList.toggle("exhaling", !heroIsInhale);
            }
          }, 2400);
        }
      });
    }
  }

  /* ==========================================================================
   * 8. EVENT BINDINGS & LIFECYCLE INITIALIZATION
   * ========================================================================== */
  function initLoginForm() {
    seedDefaultUsers();
    applyLanguage(currentLang);
    checkActiveSession();
    initShowcaseSlider();
    initBreathingGuide();

    // Check remembered email
    try {
      const remEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
      const emailInput = $("loginEmail");
      const remCheck = $("rememberMe");
      if (remEmail && emailInput) {
        emailInput.value = remEmail;
        if (remCheck) remCheck.checked = true;
      }
    } catch (_) { }

    // Form Submit
    const form = $("loginForm");
    if (form) form.addEventListener("submit", handleLogin);

    // Password Toggle Button
    const toggleBtn = $("btnTogglePassword");
    if (toggleBtn) toggleBtn.addEventListener("click", togglePasswordVisibility);

    // 1-Click Demo Login
    const demoBtn = $("btnDemoLogin");
    if (demoBtn) demoBtn.addEventListener("click", handleDemoFill);

    // Continue to Profile Button (when session is active)
    const btnContinue = $("btnContinueProfile");
    if (btnContinue) {
      btnContinue.addEventListener("click", () => {
        window.location.href = "profile.html";
      });
    }

    // Switch Account Button
    const btnSwitch = $("btnSwitchAccount");
    if (btnSwitch) btnSwitch.addEventListener("click", switchAccount);

    // Social SSO Buttons demonstration
    document.querySelectorAll(".btn-social-auth").forEach((btn) => {
      btn.addEventListener("click", () => {
        showToast(tr("socialDemoMsg"), false);
      });
    });

    // Forgot Password Trigger & Reset
    const btnSendCode = $("btnSendRecoveryCode");
    if (btnSendCode) btnSendCode.addEventListener("click", handleSendResetCode);

    const btnConfirmPass = $("btnConfirmNewPassword");
    if (btnConfirmPass) btnConfirmPass.addEventListener("click", handleConfirmReset);

    // Language change synchronizer
    window.addEventListener("bwLanguageChanged", (e) => {
      if (e.detail?.lang && e.detail.lang !== currentLang) {
        applyLanguage(e.detail.lang);
      }
    });

    const langToggleBtn = $("langToggle");
    if (langToggleBtn) {
      langToggleBtn.addEventListener("click", () => {
        const next = currentLang === "bn" ? "en" : "bn";
        if (window.bwGlobalNav?.setLanguage) {
          window.bwGlobalNav.setLanguage(next);
        } else {
          applyLanguage(next);
        }
      });
    }
  }

  // DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLoginForm);
  } else {
    initLoginForm();
  }
})();

