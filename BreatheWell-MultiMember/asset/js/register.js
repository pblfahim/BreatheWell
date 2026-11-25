/**
 * @file register.js
 * @description Controller for `register.html`: Household Account Registration,
 * Real-time Password Strength Meter, Primary Member Profile Initialization.
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Page Dictionary (`PAGE_DICT`)
 *   2. Password Strength Evaluator
 *   3. Registration Submit Handler
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'নতুন পরিবার অ্যাকাউন্ট | ব্রিদওয়েল',
      regHeading: 'নতুন পরিবার অ্যাকাউন্ট তৈরি করুন',
      regSubtitle: 'প্রথমে আপনার (প্রধান সদস্য) প্রোফাইল তৈরি করুন; পরে বাবা, মা, স্বামী/স্ত্রী বা সন্তানদের যোগ করতে পারবেন',
      lblFullName: 'পূর্ণ নাম (প্রধান সদস্য)',
      phFullName: 'যেমন: আরিফ হোসেন',
      lblEmail: 'ইমেইল ঠিকানা',
      phEmail: 'name@example.com',
      lblAge: 'বয়স',
      lblGender: 'লিঙ্গ',
      optMale: 'পুরুষ',
      optFemale: 'নারী',
      optOther: 'অন্যান্য',
      lblBloodGroup: 'রক্তের গ্রুপ',
      lblPhone: 'ফোন নম্বর (ঐচ্ছিক)',
      lblPassword: 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)',
      lblConfirmPass: 'পাসওয়ার্ড নিশ্চিত করুন',
      strengthHint: 'শক্তি:',
      strengthWeak: 'দুর্বল',
      strengthFair: 'মধ্যম',
      strengthStrong: 'শক্তিশালী',
      btnCreateAccount: 'পরিবার অ্যাকাউন্ট খুলুন',
      haveAccountText: 'আগে থেকেই অ্যাকাউন্ট আছে?',
      linkLogin: 'লগইন করুন',
      errInvalidInput: 'অনুগ্রহ করে নাম, সঠিক ইমেইল এবং কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।',
      errMismatch: 'পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মেলেনি।',
      errEmailExists: 'এই ইমেইলে আগেই একটি অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।',
      regSuccess: 'অভিনন্দন! আপনার পরিবার অ্যাকাউন্ট তৈরি হয়েছে।'
    },
    en: {
      pageTitle: 'Create Family Account | BreatheWell',
      regHeading: 'Create Your Household Account',
      regSubtitle: 'Start with the primary member profile; add Father, Mother, Spouse, or Children inside Family Hub',
      lblFullName: 'Full Name (Primary Member)',
      phFullName: 'e.g. Arif Hossain',
      lblEmail: 'Email Address',
      phEmail: 'name@example.com',
      lblAge: 'Age',
      lblGender: 'Gender',
      optMale: 'Male',
      optFemale: 'Female',
      optOther: 'Other',
      lblBloodGroup: 'Blood Group',
      lblPhone: 'Phone (Optional)',
      lblPassword: 'Password (min 6 characters)',
      lblConfirmPass: 'Confirm Password',
      strengthHint: 'Strength:',
      strengthWeak: 'Weak',
      strengthFair: 'Fair',
      strengthStrong: 'Strong',
      btnCreateAccount: 'Create Family Account',
      haveAccountText: 'Already have an account?',
      linkLogin: 'Sign In',
      errInvalidInput: 'Please provide your name, a valid email, and a password of at least 6 characters.',
      errMismatch: 'Passwords do not match.',
      errEmailExists: 'An account with this email already exists. Please sign in.',
      regSuccess: 'Account created! Redirecting to your Family Hub...'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  function evaluateStrength(pass) {
    if (!pass) return { cls: '', label: '' };
    var score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 9 && /[A-Z0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass) || pass.length >= 11) score++;
    if (score >= 3) return { cls: 'bw-strength-strong', label: tr('strengthStrong') };
    if (score === 2) return { cls: 'bw-strength-fair', label: tr('strengthFair') };
    return { cls: 'bw-strength-weak', label: tr('strengthWeak') };
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    var form = document.getElementById('registerForm');
    var passInput = document.getElementById('regPassword');
    var confirmInput = document.getElementById('regConfirmPassword');
    var strengthBar = document.getElementById('regStrengthFill');
    var strengthLabel = document.getElementById('regStrengthText');
    var errBox = document.getElementById('regErrorAlert');
    var passToggle = document.getElementById('regPassToggle');

    function updateStrength() {
      var res = evaluateStrength(passInput.value);
      strengthBar.className = 'bw-strength-fill ' + res.cls;
      strengthLabel.textContent = res.label ? tr('strengthHint') + ' ' + res.label : '';
    }

    passInput.addEventListener('input', updateStrength);

    passToggle.addEventListener('click', function () {
      var isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      confirmInput.type = isPass ? 'text' : 'password';
      passToggle.innerHTML = isPass
        ? '<i class="bi bi-eye-slash" aria-hidden="true"></i>'
        : '<i class="bi bi-eye" aria-hidden="true"></i>';
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      errBox.classList.add('d-none');

      var name = document.getElementById('regName').value.trim();
      var email = document.getElementById('regEmail').value.trim();
      var password = passInput.value;
      var confirm = confirmInput.value;

      if (!name || !email || email.indexOf('@') === -1 || password.length < 6) {
        errBox.textContent = tr('errInvalidInput');
        errBox.classList.remove('d-none');
        return;
      }
      if (password !== confirm) {
        errBox.textContent = tr('errMismatch');
        errBox.classList.remove('d-none');
        return;
      }

      var result = global.BWStore.registerAccount({
        name: name,
        email: email,
        password: password,
        age: document.getElementById('regAge').value,
        gender: document.getElementById('regGender').value,
        bloodGroup: document.getElementById('regBloodGroup').value,
        phone: document.getElementById('regPhone').value.trim()
      });

      if (!result.ok) {
        errBox.textContent = result.error === 'email_exists' ? tr('errEmailExists') : tr('errInvalidInput');
        errBox.classList.remove('d-none');
        return;
      }

      global.BWI18n.showToast(tr('regSuccess'), 'success');
      setTimeout(function () {
        global.location.href = 'profile.html';
      }, 450);
    });

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      updateStrength();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
