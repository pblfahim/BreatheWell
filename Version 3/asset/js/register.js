/**
 * @file register.js
 * @description 4-Step Household Account Registration (`register.html`):
 *   - Step 1: Primary Member Info (Name, Email, Phone, Age, Gender, Blood Group)
 *   - Step 2: Salted Password w/ 4-Criterion Live Meter + Confirm Password Match
 *   - Step 3: Primary Wellness Focus Goal Tiles (Fixed from V1!)
 *   - Step 4: Family Member Onboarding List (All 15 V1 relations supported!)
 *   - Terms & Conditions Modal
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. 4-Bar Password Strength & Criteria Feedback
 *   3. Interactive Goal Tiles & Initial Family Member Builder
 *   4. Form Validation & Account Creation Submit
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'নতুন পরিবার অ্যাকাউন্ট | ব্রিদওয়েল v3',
      regHeading: '৪-ধাপে আপনার পরিবার অ্যাকাউন্ট তৈরি করুন',
      regSubtitle: 'প্রধান সদস্যের পাশাপাশি শুরুতেই পরিবারের অন্যান্য সদস্য যোগ করতে পারবেন।',
      step1Title: 'ধাপ ১: প্রধান সদস্যের পরিচিতি',
      step2Title: 'ধাপ ২: শক্তিশালী পাসওয়ার্ড সুরক্ষা',
      step3Title: 'ধাপ ৩: আপনার মূল স্বাস্থ্য লক্ষ্য',
      step4Title: 'ধাপ ৪: পরিবারের সদস্য যোগ করুন (ঐচ্ছিক)',
      lblFullName: 'পূর্ণ নাম *',
      phFullName: 'যেমন: আরিফ হোসেন',
      lblEmail: 'ইমেইল ঠিকানা *',
      lblPhone: 'ফোন নম্বর',
      lblAge: 'বয়স',
      lblGender: 'লিঙ্গ',
      optMale: 'পুরুষ',
      optFemale: 'নারী',
      optOther: 'অন্যান্য',
      lblBloodGroup: 'রক্তের গ্রুপ',
      lblPassword: 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *',
      lblConfirmPass: 'পাসওয়ার্ড নিশ্চিত করুন *',
      goalStress: 'চাপ ও উদ্বেগ নিয়ন্ত্রণ',
      goalFocus: 'একাগ্রতা ও ফোকাস বৃদ্ধি',
      goalSleep: 'গভীর ঘুম ও প্রশান্তি',
      goalMindful: 'ফুসফুস ও BOLT ফিটনেস',
      lblMemName: 'সদস্যের নাম',
      lblMemRel: 'সম্পর্ক',
      lblMemAge: 'বয়স',
      btnAddFamily: '+ সদস্য তালিকায় যোগ করুন',
      lblTerms: 'আমি ব্রিদওয়েল v3 গোপনীয়তা ও ব্যবহারের শর্তাবলি পড়েছি ও সম্মত আছি।',
      btnViewTerms: 'শর্তাবলি দেখুন',
      btnCreateAccount: 'পরিবার অ্যাকাউন্ট সম্পন্ন করুন',
      haveAccountText: 'আগে থেকেই অ্যাকাউন্ট আছে?',
      linkLogin: 'লগইন করুন',
      errInvalidInput: 'অনুগ্রহ করে নাম, সঠিক ইমেইল এবং কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।',
      errMismatch: 'পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মেলেনি।',
      errTerms: 'অ্যাকাউন্ট তৈরি করতে শর্তাবলিতে সম্মতি দিন।',
      errEmailExists: 'এই ইমেইলে আগেই একটি অ্যাকাউন্ট আছে। অনুগ্রহ করে লগইন করুন।',
      regSuccess: 'অভিনন্দন! আপনার পরিবার অ্যাকাউন্ট প্রস্তুত!'
    },
    en: {
      pageTitle: 'Create Family Account | BreatheWell v3',
      regHeading: '4-Step Household Registration',
      regSubtitle: 'Configure primary profile, security credentials, wellness goal, and optional family members upfront.',
      step1Title: 'Step 1: Primary Member Info',
      step2Title: 'Step 2: Account Security',
      step3Title: 'Step 3: Wellness Focus Goal',
      step4Title: 'Step 4: Onboard Family Members (Optional)',
      lblFullName: 'Full Name *',
      phFullName: 'e.g. Arif Hossain',
      lblEmail: 'Email Address *',
      lblPhone: 'Phone Number',
      lblAge: 'Age',
      lblGender: 'Gender',
      optMale: 'Male',
      optFemale: 'Female',
      optOther: 'Other',
      lblBloodGroup: 'Blood Group',
      lblPassword: 'Password (min 6 chars) *',
      lblConfirmPass: 'Confirm Password *',
      goalStress: 'Stress & Calm Recovery',
      goalFocus: 'Focus & Breath Control',
      goalSleep: 'Deep Sleep Coherence',
      goalMindful: 'Lung & BOLT Endurance',
      lblMemName: 'Member Name',
      lblMemRel: 'Relationship',
      lblMemAge: 'Age',
      btnAddFamily: '+ Add Member to Queue',
      lblTerms: 'I understand all health logs stay locally in my browser and agree to terms.',
      btnViewTerms: 'Read Terms',
      btnCreateAccount: 'Complete Household Setup',
      haveAccountText: 'Already registered?',
      linkLogin: 'Sign In',
      errInvalidInput: 'Please enter name, valid email, and at least a 6-character password.',
      errMismatch: 'Passwords do not match.',
      errTerms: 'Please accept the local privacy terms to continue.',
      errEmailExists: 'An account already exists with this email. Please sign in.',
      regSuccess: 'Welcome to BreatheWell v3! Redirecting to Family Hub...'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var selectedGoal = 'stress';
  var stagedMembers = [];

  function populateRelationSelect(selectEl) {
    var esc = global.BWI18n.escapeHtml;
    selectEl.innerHTML = global.BWStore.RELATIONS.filter(function (r) { return r !== 'self'; }).map(function (rel) {
      return '<option value="' + esc(rel) + '">' + esc(global.BWNav.relationLabel(rel)) + '</option>';
    }).join('');
  }

  function updateStrengthUI(pass) {
    var bars = [
      document.getElementById('regBar1'),
      document.getElementById('regBar2'),
      document.getElementById('regBar3'),
      document.getElementById('regBar4')
    ];
    var score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Za-z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass) || pass.length >= 11) score++;

    bars.forEach(function (bar, idx) {
      bar.className = 'bw-sbar' + (idx < score ? ' active-' + score : '');
    });
  }

  function renderStagedMembers() {
    var listEl = document.getElementById('regFamilyList');
    var esc = global.BWI18n.escapeHtml;
    if (!stagedMembers.length) {
      listEl.innerHTML = '';
      return;
    }
    listEl.innerHTML = stagedMembers.map(function (m, idx) {
      return (
        '<div class="d-flex align-items-center justify-content-between border rounded-3 px-3 py-2 mb-2 bg-light">' +
        '  <div class="small"><strong>' + esc(m.name) + '</strong> • ' + esc(global.BWNav.relationLabel(m.relation)) + (m.age ? ' (' + esc(m.age) + ')' : '') + '</div>' +
        '  <button type="button" class="btn btn-sm btn-outline-danger" data-rm-staged="' + idx + '" aria-label="Remove"><i class="bi bi-x-lg"></i></button>' +
        '</div>'
      );
    }).join('');
    Array.prototype.forEach.call(listEl.querySelectorAll('[data-rm-staged]'), function (btn) {
      btn.addEventListener('click', function () {
        stagedMembers.splice(Number(btn.getAttribute('data-rm-staged')), 1);
        renderStagedMembers();
      });
    });
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    var relSel = document.getElementById('regMemRelation');
    populateRelationSelect(relSel);

    var passInput = document.getElementById('regPassword');
    var confirmInput = document.getElementById('regConfirmPassword');
    var toggleBtn = document.getElementById('regPassToggle');
    var errBox = document.getElementById('regErrorAlert');

    passInput.addEventListener('input', function () { updateStrengthUI(passInput.value); });
    toggleBtn.addEventListener('click', function () {
      var isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      confirmInput.type = isPass ? 'text' : 'password';
      toggleBtn.innerHTML = isPass ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-reg-goal]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-reg-goal]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        selectedGoal = btn.getAttribute('data-reg-goal');
      });
    });

    document.getElementById('regAddMemberBtn').addEventListener('click', function () {
      var mName = document.getElementById('regMemName').value.trim();
      if (!mName) return;
      stagedMembers.push({
        name: mName,
        relation: relSel.value,
        age: Number(document.getElementById('regMemAge').value) || ''
      });
      document.getElementById('regMemName').value = '';
      document.getElementById('regMemAge').value = '';
      renderStagedMembers();
    });

    document.getElementById('registerForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      errBox.classList.add('d-none');

      var name = document.getElementById('regName').value.trim();
      var email = document.getElementById('regEmail').value.trim();
      var password = passInput.value;
      var confirm = confirmInput.value;
      var agreed = document.getElementById('regTermsChk').checked;

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
      if (!agreed) {
        errBox.textContent = tr('errTerms');
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
        phone: document.getElementById('regPhone').value.trim(),
        goal: selectedGoal,
        initialMembers: stagedMembers
      });

      if (!result.ok) {
        errBox.textContent = result.error === 'email_exists' ? tr('errEmailExists') : tr('errInvalidInput');
        errBox.classList.remove('d-none');
        return;
      }

      global.BWI18n.showToast(tr('regSuccess'), 'success');
      setTimeout(function () { global.location.href = 'profile.html'; }, 400);
    });

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      populateRelationSelect(relSel);
      renderStagedMembers();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
