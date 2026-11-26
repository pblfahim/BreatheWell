/**
 * @file login.js
 * @description Version 3 Household Sign-In (`login.html`):
 *   - 3-Slide Visual Showcase + Auth Card
 *   - Salted SHA-256 Email/Password Login + Remember Me
 *   - 1-Click 4-Member Family Demo Unlock
 *   - 2-Step Local Forgot Password Recovery Modal
 *   - Active Household Member Quick-Switcher when already signed in
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Left Showcase Slide Rotator
 *   3. Signed-In Household Quick Switcher vs Login Form
 *   4. Form Submit, Demo Login & Forgot Password Recovery
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'পারিবারিক লগইন | ব্রিদওয়েল v3',
      authHeading: 'পরিবার অ্যাকাউন্টে প্রবেশ করুন',
      authSubtitle: 'সব সদস্যের আলাদা স্বাস্থ্য তথ্য, BOLT স্কোর এবং প্রেসক্রিপশন অ্যাক্সেস করুন',
      showcase1Title: 'সচেতন শ্বাস-প্রশ্বাস ও একাগ্রতা',
      showcase1Sub: 'বক্স, ৪-৭-৮ এবং ডায়াফ্র্যাগমেটিক ছন্দে দৈনিক চাপ নিয়ন্ত্রণ করুন।',
      showcase2Title: 'ক্লিনিক্যাল রক্তচাপ ও গ্লুকোজ',
      showcase2Sub: 'AHA ও ADA মানদণ্ডে পরিবারের প্রত্যেকের আলাদা রিডিং ও ট্রেন্ড চার্ট।',
      showcase3Title: 'স্মার্ট প্রেসক্রিপশন ভল্ট ও প্যাড',
      showcase3Sub: 'OCR স্ক্যানিং ও A4 প্রিন্ট-রেডি ডিজিটাল প্যাড সম্পূর্ণ আপনার ব্রাউজারে।',
      lblEmail: 'ইমেইল ঠিকানা',
      phEmail: 'name@example.com',
      lblPassword: 'পাসওয়ার্ড',
      phPassword: 'আপনার পাসওয়ার্ড',
      lblRemember: 'ইমেইল মনে রাখুন',
      linkForgot: 'পাসওয়ার্ড ভুলে গেছেন?',
      btnLoginSubmit: 'লগইন করুন',
      demoBoxTitle: '১-ক্লিক ৪ সদস্যের ডেমো পরিবার',
      demoBoxDesc: 'নিজ, বাবা, মা ও সন্তান সহ প্রস্তুত পারিবারিক প্রোফাইল দেখুন (demo@breathewell.app)।',
      btnDemoLogin: 'ডেমো পরিবার চালু করুন',
      noAccountText: 'নতুন পরিবার অ্যাকাউন্ট খুলতে চান?',
      linkRegister: '৪-ধাপে নিবন্ধন করুন',
      linkGuest: 'লগইন ছাড়াই গেস্ট প্রিভিউতে ফিরে যান',
      signedInHeading: 'আপনার পরিবার সেশন সক্রিয় আছে',
      signedInSub: 'নিচে সক্রিয় সদস্য পরিবর্তন করুন অথবা প্রোফাইল হাব খুলুন:',
      btnGoProfile: 'পরিবার ও প্রোফাইল হাব',
      btnGoHome: 'হোম পেজে যান',
      forgotTitle: 'স্থানীয় পাসওয়ার্ড পুনরুদ্ধার',
      forgotDesc: 'নিবন্ধিত ইমেইল লিখুন; সিকিউরিটি কোড তৈরি করে তাৎক্ষণিক নতুন পাসওয়ার্ড সেট করতে পারবেন।',
      forgotBtnStep1: 'ভেরিফিকেশন কোড তৈরি করুন',
      forgotOtpHint: 'আপনার স্থানীয় কোড:',
      forgotNewPassLbl: 'নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)',
      forgotBtnStep2: 'নতুন পাসওয়ার্ড সংরক্ষণ করুন',
      errMissingFields: 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড লিখুন।',
      errNotFound: 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।',
      errWrongPassword: 'পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।',
      toastPassUpdated: 'নতুন পাসওয়ার্ড আপডেট হয়েছে! এখন লগইন করুন।',
      loginSuccess: 'স্বাগতম! আপনার পারিবারিক ড্যাশবোর্ডে প্রবেশ করছেন...'
    },
    en: {
      pageTitle: 'Household Sign In | BreatheWell v3',
      authHeading: 'Sign In to Family Account',
      authSubtitle: 'Access isolated respiratory sessions, AHA vitals, and prescriptions per family member',
      showcase1Title: 'Guided Breathing Sanctuary',
      showcase1Sub: 'Daily Box, 4-7-8, and Diaphragmatic pacing with live visual mandala guides.',
      showcase2Title: 'Clinical BP & Glucose Telemetry',
      showcase2Sub: 'AHA 2017 & ADA 2024 classifications plus safe-zone charts isolated per member.',
      showcase3Title: 'Smart Rx Vault & Digital Pad',
      showcase3Sub: 'Lossless OCR extraction and printable A4 sheets kept 100% locally.',
      lblEmail: 'Email Address',
      phEmail: 'name@example.com',
      lblPassword: 'Password',
      phPassword: 'Enter password',
      lblRemember: 'Remember my email',
      linkForgot: 'Forgot Password?',
      btnLoginSubmit: 'Sign In',
      demoBoxTitle: '1-Click 4-Member Family Demo',
      demoBoxDesc: 'Explore Self, Father, Mother & Son with pre-seeded data (demo@breathewell.app).',
      btnDemoLogin: 'Launch Family Demo',
      noAccountText: 'Need a new family household account?',
      linkRegister: '4-Step Registration',
      linkGuest: 'Continue in Guest Preview',
      signedInHeading: 'Household Session Active',
      signedInSub: 'Switch active family member below or open the Family Hub:',
      btnGoProfile: 'Open Family & Profile Hub',
      btnGoHome: 'Go to Home',
      forgotTitle: 'Local Password Recovery',
      forgotDesc: 'Enter your registered email to issue a local verification code and reset your household password.',
      forgotBtnStep1: 'Generate Recovery Code',
      forgotOtpHint: 'Verification Code:',
      forgotNewPassLbl: 'New Password (min 6 characters)',
      forgotBtnStep2: 'Reset Password',
      errMissingFields: 'Please enter both email and password.',
      errNotFound: 'No household account exists for that email.',
      errWrongPassword: 'Incorrect password. Please try again.',
      toastPassUpdated: 'Password updated! You can now sign in.',
      loginSuccess: 'Welcome back! Opening your Family Hub...'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var showcaseIdx = 0;
  var generatedOtp = '';

  function startShowcaseCarousel() {
    var slides = document.querySelectorAll('.v3-auth-slide');
    if (!slides.length) return;
    setInterval(function () {
      showcaseIdx = (showcaseIdx + 1) % slides.length;
      Array.prototype.forEach.call(slides, function (s, idx) {
        s.classList.toggle('d-none', idx !== showcaseIdx);
      });
    }, 4500);
  }

  function renderView() {
    var acc = global.BWStore.getActiveAccount();
    var formPanel = document.getElementById('loginFormPanel');
    var activePanel = document.getElementById('loginActivePanel');
    var esc = global.BWI18n.escapeHtml;

    if (acc) {
      formPanel.classList.add('d-none');
      activePanel.classList.remove('d-none');
      var listEl = document.getElementById('loginActiveMembers');
      var activeMember = global.BWStore.getActiveMember();
      listEl.innerHTML = (acc.members || []).map(function (m) {
        var isAct = m.id === activeMember.id;
        return (
          '<button type="button" class="bw-member-option border mb-2' + (isAct ? ' active border-success' : '') + '" data-quick-member="' + esc(m.id) + '">' +
          '  <span class="bw-avatar-circle bw-avatar-color-' + (m.avatarColor || 0) + '">' + esc(m.avatarInitials) + '</span>' +
          '  <span class="bw-member-meta"><strong>' + esc(m.name) + '</strong><small>' + esc(global.BWNav.relationLabel(m.relation)) + '</small></span>' +
          (isAct ? '<i class="bi bi-check-circle-fill text-success"></i>' : '<span class="small text-primary fw-semibold">' + esc(global.BWI18n.t('btnSwitchMember', PAGE_DICT)) + '</span>') +
          '</button>'
        );
      }).join('');
      Array.prototype.forEach.call(listEl.querySelectorAll('[data-quick-member]'), function (btn) {
        btn.addEventListener('click', function () {
          global.BWStore.switchMember(btn.getAttribute('data-quick-member'));
          renderView();
        });
      });
    } else {
      formPanel.classList.remove('d-none');
      activePanel.classList.add('d-none');
    }
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');
    startShowcaseCarousel();

    var remembered = global.BWStore.getRememberedEmail();
    var emailInput = document.getElementById('loginEmail');
    var rememberChk = document.getElementById('loginRememberChk');
    if (remembered) {
      emailInput.value = remembered;
      rememberChk.checked = true;
    }

    var passInput = document.getElementById('loginPassword');
    var toggleBtn = document.getElementById('loginPassToggle');
    var alertBox = document.getElementById('loginErrorAlert');

    toggleBtn.addEventListener('click', function () {
      var isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      toggleBtn.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });

    document.getElementById('loginForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      alertBox.classList.add('d-none');
      var email = emailInput.value.trim();
      var pass = passInput.value;
      if (!email || !pass) {
        alertBox.textContent = tr('errMissingFields');
        alertBox.classList.remove('d-none');
        return;
      }
      var res = global.BWStore.login(email, pass);
      if (!res.ok) {
        alertBox.textContent = res.error === 'wrong_password' ? tr('errWrongPassword') : tr('errNotFound');
        alertBox.classList.remove('d-none');
        return;
      }
      global.BWStore.setRememberedEmail(rememberChk.checked ? email : '');
      global.BWI18n.showToast(tr('loginSuccess'), 'success');
      setTimeout(function () { global.location.href = 'profile.html'; }, 400);
    });

    document.getElementById('loginDemoBtn').addEventListener('click', function () {
      global.BWStore.loginDemoFamily();
      global.BWI18n.showToast(global.BWI18n.t('toastDemoLoaded', PAGE_DICT), 'success');
      setTimeout(function () { global.location.href = 'profile.html'; }, 400);
    });

    /* 2-Step Forgot Password Flow */
    document.getElementById('forgotStep1Btn').addEventListener('click', function () {
      var targetEmail = document.getElementById('forgotEmailInput').value.trim();
      if (!targetEmail) return;
      generatedOtp = String(Math.floor(100000 + Math.random() * 899999));
      document.getElementById('forgotOtpDisplay').textContent = generatedOtp;
      document.getElementById('forgotStep1Pane').classList.add('d-none');
      document.getElementById('forgotStep2Pane').classList.remove('d-none');
    });

    document.getElementById('forgotStep2Btn').addEventListener('click', function () {
      var targetEmail = document.getElementById('forgotEmailInput').value.trim();
      var codeEntered = document.getElementById('forgotCodeInput').value.trim();
      var newPass = document.getElementById('forgotNewPassInput').value;
      var errEl = document.getElementById('forgotErrMsg');
      errEl.classList.add('d-none');

      if (codeEntered !== generatedOtp) {
        errEl.textContent = 'Invalid verification code.';
        errEl.classList.remove('d-none');
        return;
      }
      var res = global.BWStore.resetAccountPassword(targetEmail, newPass);
      if (!res.ok) {
        errEl.textContent = res.error === 'account_not_found' ? tr('errNotFound') : tr('errMissingFields');
        errEl.classList.remove('d-none');
        return;
      }
      var modalEl = document.getElementById('forgotPasswordModal');
      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
      }
      global.BWI18n.showToast(tr('toastPassUpdated'), 'success');
      emailInput.value = targetEmail;
    });

    document.getElementById('loginLogoutBtn').addEventListener('click', function () {
      global.BWStore.logout();
      renderView();
    });

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderView();
    });
    global.addEventListener('bwMemberChanged', renderView);
    renderView();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
