/**
 * @file login.js
 * @description Controller for `login.html`: Household Sign-In, Password Visibility,
 * 1-Click 4-Member Family Demo Unlock, and Active Session Overview.
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Page Dictionary (`PAGE_DICT`)
 *   2. View State Renderer (Signed-In Summary vs Login Form)
 *   3. Form Submission & Demo Unlock Handlers
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'পারিবারিক লগইন | ব্রিদওয়েল',
      authSubtitle: 'আপনার পরিবারের সকল সদস্যের আলাদা স্বাস্থ্য তথ্য অ্যাক্সেস করতে সাইন ইন করুন',
      authHeading: 'পরিবার অ্যাকাউন্টে প্রবেশ করুন',
      lblEmail: 'ইমেইল ঠিকানা',
      phEmail: 'name@example.com',
      lblPassword: 'পাসওয়ার্ড',
      phPassword: 'কমপক্ষে ৬ অক্ষর',
      btnLoginSubmit: 'লগইন করুন',
      demoBoxTitle: 'তাৎক্ষণিক পরীক্ষা করতে চান?',
      demoBoxDesc: 'এক ক্লিকে ৪ সদস্যের (নিজ, বাবা, মা, সন্তান) প্রস্তুত ডেমো পরিবার চালু করুন।',
      btnDemoLogin: '১-ক্লিক ৪ সদস্যের ডেমো চালু করুন',
      orDivider: 'অথবা',
      noAccountText: 'নতুন পরিবার অ্যাকাউন্ট খুলতে চান?',
      linkRegister: 'নিবন্ধন করুন',
      linkGuest: 'লগইন ছাড়াই গেস্ট প্রিভিউতে ফিরে যান',
      signedInHeading: 'আপনি ইতিমধ্যেই লগইন করেছেন',
      signedInSub: 'নিচে আপনার পরিবারের সদস্যদের তালিকা দেখুন অথবা প্রোফাইল ড্যাশবোর্ডে যান:',
      btnGoProfile: 'পরিবার ড্যাশবোর্ড খুলুন',
      btnGoHome: 'হোম পেজে যান',
      errMissingFields: 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড লিখুন।',
      errNotFound: 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে নিবন্ধন করুন বা ডেমো ব্যবহার করুন।',
      errWrongPassword: 'পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।',
      loginSuccess: 'স্বাগতম! পারিবারিক ড্যাশবোর্ডে প্রবেশ করছেন...'
    },
    en: {
      pageTitle: 'Household Sign In | BreatheWell',
      authSubtitle: 'Access isolated health telemetry, breath scores, and prescriptions per family member',
      authHeading: 'Sign In to Family Account',
      lblEmail: 'Email Address',
      phEmail: 'name@example.com',
      lblPassword: 'Password',
      phPassword: 'At least 6 characters',
      btnLoginSubmit: 'Sign In',
      demoBoxTitle: 'Want an instant multi-member preview?',
      demoBoxDesc: 'Launch a pre-seeded 4-member household (Self, Father, Mother, Child) with 1 click.',
      btnDemoLogin: 'Launch 4-Member Family Demo',
      orDivider: 'OR',
      noAccountText: 'Need a new family account?',
      linkRegister: 'Create Account',
      linkGuest: 'Continue browsing in Guest Preview',
      signedInHeading: 'Household Session Active',
      signedInSub: 'You are currently signed in. Switch active members below or open your family dashboard:',
      btnGoProfile: 'Open Family Hub',
      btnGoHome: 'Go to Home',
      errMissingFields: 'Please enter both your email and password.',
      errNotFound: 'No account found for that email. Please create an account or launch the Demo.',
      errWrongPassword: 'Incorrect password. Please try again.',
      loginSuccess: 'Welcome back! Opening your household hub...'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
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

    var form = document.getElementById('loginForm');
    var emailInput = document.getElementById('loginEmail');
    var passInput = document.getElementById('loginPassword');
    var toggleBtn = document.getElementById('loginPassToggle');
    var alertBox = document.getElementById('loginErrorAlert');
    var demoBtn = document.getElementById('loginDemoBtn');
    var logoutBtn = document.getElementById('loginLogoutBtn');

    toggleBtn.addEventListener('click', function () {
      var isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      toggleBtn.innerHTML = isPass
        ? '<i class="bi bi-eye-slash" aria-hidden="true"></i>'
        : '<i class="bi bi-eye" aria-hidden="true"></i>';
    });

    form.addEventListener('submit', function (ev) {
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
      global.BWI18n.showToast(tr('loginSuccess'), 'success');
      setTimeout(function () {
        global.location.href = 'profile.html';
      }, 450);
    });

    demoBtn.addEventListener('click', function () {
      global.BWStore.loginDemoFamily();
      global.BWI18n.showToast(global.BWI18n.t('toastDemoLoaded', PAGE_DICT), 'success');
      setTimeout(function () {
        global.location.href = 'profile.html';
      }, 450);
    });

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        global.BWStore.logout();
        renderView();
      });
    }

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderView();
    });
    global.addEventListener('bwMemberChanged', renderView);
    renderView();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
