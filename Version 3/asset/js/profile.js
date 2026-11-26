/**
 * @file profile.js
 * @description Multi-Member Household & Profile Manager (`profile.html`):
 *   Combines Version 1's 5-tab rich UI (Avatar Selector, Personal Info, 15-Relation
 *   Family Roster, Wellness Preferences, 6-Badge Achievements, Security) with
 *   Version 2's strict Multi-Member Scoped Data Isolation, Salted Privacy PIN & Backup.
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Active Member Hero, Avatar Catalog & 4-KPI Vitality Cards (V1 Fixed!)
 *   3. 5 Tabs: Personal Info, Family Roster CRUD, Wellness Prefs, 6 Achievements, PIN/Backup
 *   4. Add/Edit Member Modal (`#memberFormModal`) & Avatar Picker Modal (`#avatarModal`)
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'পরিবার ও সদস্য প্রোফাইল | ব্রিদওয়েল v3',
      guestHeroTitle: 'আপনার সম্পূর্ণ পরিবারের স্বাস্থ্য হাব',
      guestHeroDesc: 'নিজ, বাবা, মা, স্বামী/স্ত্রী এবং সন্তানদের আলাদা রক্তচাপ, গ্লুকোজ, BOLT স্কোর ও প্রেসক্রিপশন পরিচালনা করতে সাইন ইন বা ১-ক্লিক ডেমো চালু করুন।',
      btnEditActive: 'তথ্য সম্পাদনা',
      btnAddMember: '+ পরিবারের সদস্য',
      kpiMinutesLbl: 'মোট মননশীল সময়',
      kpiSessionsLbl: 'সেশন ও স্ট্রিক',
      kpiBoltLbl: 'সর্বোচ্চ / সর্বশেষ BOLT',
      kpiClinicalLbl: 'ভাইটালস ও প্রেসক্রিপশন',
      tabPersonal: 'ব্যক্তিগত তথ্য',
      tabFamily: 'পরিবারের সদস্য',
      tabPrefs: 'পছন্দসমূহ',
      tabAchievements: 'অর্জনসমূহ',
      tabSecurity: 'নিরাপত্তা ও ব্যাকআপ',
      fldName: 'সদস্যের নাম *',
      fldRelation: 'সম্পর্ক',
      fldAge: 'বয়স',
      fldGender: 'লিঙ্গ',
      fldBlood: 'রক্তের গ্রুপ',
      fldPhone: 'ফোন',
      fldEmergency: 'জরুরি যোগাযোগ',
      fldAllergies: 'অ্যালার্জি',
      fldConditions: 'চলমান রোগ বা সতর্কতা',
      fldNotes: 'মেডিকেল নোট',
      chkSwitchImmediately: 'সংরক্ষণের সাথে সাথে এই সদস্যে সক্রিয় হোন',
      btnSavePersonal: 'তথ্য আপডেট করুন',
      btnMakeActive: 'এই সদস্যে যান',
      badgeActiveNow: 'এখন সক্রিয়',
      prefDailyGoal: 'দৈনিক শ্বাস ব্যায়ামের লক্ষ্য (মিনিট)',
      prefChimes: 'ব্যায়াম চলাকালীন হারমোনিক শব্দ সংকেত',
      prefVoice: 'ভয়েস কোচ নির্দেশনা (TTS)',
      prefSoundscape: 'ডিফল্ট অ্যাম্বিয়েন্ট সাউন্ডস্কেপ',
      btnSavePrefs: 'পছন্দসমূহ সংরক্ষণ করুন',
      pinTitle: 'পারিবারিক প্রাইভেসি পিন (SHA-256)',
      pinDesc: 'সদস্য পরিবর্তনের আগে ৪-অঙ্কের পিন সুরক্ষা সেট বা বন্ধ করুন।',
      pinStatusEnabled: 'পিন সুরক্ষা চালু',
      pinStatusDisabled: 'পিন সুরক্ষা বন্ধ',
      btnSavePin: 'পিন সেভ করুন',
      btnRemovePin: 'পিন বন্ধ করুন',
      backupTitle: 'সম্পূর্ণ পরিবার ব্যাকআপ ও পুনরুদ্ধার',
      btnExportAll: 'সব সদস্যের JSON ডাউনলোড',
      btnImportAll: 'JSON থেকে পুনরুদ্ধার',
      btnResetMember: 'সক্রিয় সদস্যের ডেটা মুছুন',
      modalMemberTitle: 'পরিবারের সদস্য যোগ / সম্পাদনা',
      modalAvatarTitle: 'প্রোফাইল অ্যাভাটার নির্বাচন করুন',
      genderMale: 'পুরুষ',
      genderFemale: 'নারী',
      genderOther: 'অন্যান্য',
      toastUpdated: 'প্রোফাইল তথ্য আপডেট হয়েছে!',
      toastMemberAdded: 'পরিবারের নতুন সদস্য যোগ করা হয়েছে।',
      toastMemberDeleted: 'সদস্য ও তার ডেটা মুছে ফেলা হয়েছে।',
      toastPrefsSaved: 'ব্যবহারকারীর পছন্দসমূহ সংরক্ষিত হয়েছে!',
      toastPinSaved: '৪-অঙ্কের পিন সুরক্ষা সক্রিয় হয়েছে।',
      toastPinCleared: 'পিন সুরক্ষা বন্ধ হয়েছে।',
      toastPinInvalid: 'অনুগ্রহ করে ঠিক ৪ সংখ্যার পিন দিন।',
      toastBackupImported: 'সম্পূর্ণ পরিবার ব্যাকআপ পুনরুদ্ধার হয়েছে!',
      toastBackupBad: 'ভুল ব্যাকআপ ফাইল।',
      toastMemberReset: 'বর্তমান সদস্যের সকল ডেটা রিসেট হয়েছে।',
      confirmDeleteTitle: 'সদস্য ও তার সকল রেকর্ড মুছে ফেলবেন?',
      confirmResetTitle: 'আপনি কি বর্তমান সক্রিয় সদস্যের সকল ডেটা মুছে ফেলতে চান?'
    },
    en: {
      pageTitle: 'Family & Member Profile | BreatheWell v3',
      guestHeroTitle: 'Multi-Member Household Wellness Hub',
      guestHeroDesc: 'Isolate breathing streaks, BOLT benchmarks, blood pressure, diabetes charts, and prescriptions for every member of your family.',
      btnEditActive: 'Edit Active Member',
      btnAddMember: '+ Add Family Member',
      kpiMinutesLbl: 'Mindful Minutes',
      kpiSessionsLbl: 'Sessions & Streak',
      kpiBoltLbl: 'Best / Latest BOLT',
      kpiClinicalLbl: 'Vitals & Rx Count',
      tabPersonal: 'Personal Info',
      tabFamily: 'Family Roster',
      tabPrefs: 'Preferences',
      tabAchievements: 'Achievements',
      tabSecurity: 'PIN & Backups',
      fldName: 'Member Name *',
      fldRelation: 'Relationship',
      fldAge: 'Age',
      fldGender: 'Gender',
      fldBlood: 'Blood Group',
      fldPhone: 'Phone',
      fldEmergency: 'Emergency Contact',
      fldAllergies: 'Allergies',
      fldConditions: 'Conditions / Watchlist',
      fldNotes: 'Clinical Notes',
      chkSwitchImmediately: 'Switch to this member right after saving',
      btnSavePersonal: 'Update Active Profile',
      btnMakeActive: 'Switch Here',
      badgeActiveNow: 'Active Now',
      prefDailyGoal: 'Daily Mindful Target (Minutes)',
      prefChimes: 'Harmonic Breathing Chimes',
      prefVoice: 'Voice Coach Guidance (TTS)',
      prefSoundscape: 'Default Ambient Soundscape',
      btnSavePrefs: 'Save Member Preferences',
      pinTitle: 'Household Privacy PIN (Salted SHA-256)',
      pinDesc: 'Require a 4-digit PIN challenge when switching across household members.',
      pinStatusEnabled: 'PIN Lock Enabled',
      pinStatusDisabled: 'PIN Lock Disabled',
      btnSavePin: 'Save PIN',
      btnRemovePin: 'Disable PIN',
      backupTitle: 'Complete Household JSON Backup & Restore',
      btnExportAll: 'Export All Members JSON',
      btnImportAll: 'Restore Backup JSON',
      btnResetMember: 'Clear Active Member Data',
      modalMemberTitle: 'Add / Edit Family Member',
      modalAvatarTitle: 'Choose Member Avatar Icon',
      genderMale: 'Male',
      genderFemale: 'Female',
      genderOther: 'Other',
      toastUpdated: 'Member profile updated!',
      toastMemberAdded: 'Family member added to household.',
      toastMemberDeleted: 'Family member and isolated records removed.',
      toastPrefsSaved: 'Member wellness preferences saved!',
      toastPinSaved: '4-digit Privacy PIN activated.',
      toastPinCleared: 'Privacy PIN disabled.',
      toastPinInvalid: 'Please enter exactly 4 numeric digits.',
      toastBackupImported: 'Household JSON backup restored!',
      toastBackupBad: 'Invalid backup JSON bundle.',
      toastMemberReset: 'Cleared all domains for the active member.',
      confirmDeleteTitle: 'Remove this family member and their clinical records?',
      confirmResetTitle: 'Clear all clinical records saved for the active member?'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var ICON_MAP = {
    wind: 'bi-wind',
    lungs: 'bi-lungs-fill',
    heart: 'bi-heart-pulse-fill',
    lotus: 'bi-flower1',
    sparkle: 'bi-stars',
    shield: 'bi-shield-check'
  };

  var editingMemberId = null;

  function populateRelationOptions(selectEl) {
    var esc = global.BWI18n.escapeHtml;
    selectEl.innerHTML = global.BWStore.RELATIONS.map(function (rel) {
      return '<option value="' + esc(rel) + '">' + esc(global.BWNav.relationLabel(rel)) + '</option>';
    }).join('');
  }

  /* --------------------------------------------------------------------------
     MAIN PROFILE RENDERER
     -------------------------------------------------------------------------- */
  function renderProfilePage() {
    var isAuth = global.BWStore.isAuthenticated();
    var guestView = document.getElementById('profileGuestView');
    var authView = document.getElementById('profileAuthView');

    if (!isAuth) {
      guestView.classList.remove('d-none');
      authView.classList.add('d-none');
      return;
    }

    guestView.classList.add('d-none');
    authView.classList.remove('d-none');

    var acc = global.BWStore.getActiveAccount();
    var active = global.BWStore.getActiveMember();
    var members = global.BWStore.getMembers();
    var sum = global.BWStore.getMemberSummary(active.id);
    var prefs = global.BWStore.getDomainData('prefs', active.id) || {};
    var esc = global.BWI18n.escapeHtml;

    /* 1. Hero Header */
    var iconCls = ICON_MAP[active.avatarIcon] || 'bi-wind';
    var avatarBtn = document.getElementById('activeAvatarCircle');
    avatarBtn.className = 'bw-avatar-circle bw-avatar-lg bw-avatar-color-' + (active.avatarColor || 0);
    avatarBtn.innerHTML = '<i class="bi ' + iconCls + '" aria-hidden="true"></i>';

    document.getElementById('activeMemberName').textContent = active.name;
    document.getElementById('activeMemberRelBadge').textContent = global.BWNav.relationLabel(active.relation);
    document.getElementById('activeMemberBloodBadge').textContent = active.bloodGroup || 'O+';
    document.getElementById('activeMemberCountBadge').textContent = members.length + ' Members';
    document.getElementById('activeMemberConditionsLine').textContent =
      [active.conditions ? 'Dx/Watch: ' + active.conditions : '', active.allergies ? 'Allergy: ' + active.allergies : ''].filter(Boolean).join(' • ') || '—';

    /* 2. 4-KPI Vitality Grid (Fixed from V1!) */
    document.getElementById('metricMinutesVal').textContent = sum.totalMinutes + ' min';
    document.getElementById('metricSessionsVal').textContent = sum.sessionCount + ' (' + sum.streak + 'd)';
    document.getElementById('metricBoltVal').textContent = sum.bestBolt ? (sum.bestBolt + 's / ' + (sum.latestBolt ? sum.latestBolt.score + 's' : '—')) : '—';
    document.getElementById('metricClinicalVal').textContent = (sum.bpCount + sum.glucoseCount) + ' Vitals • ' + (sum.rxVaultCount + sum.rxPadCount) + ' Rx';

    /* 3. Tab 1 Personal Form Hydration */
    document.getElementById('pfName').value = active.name || '';
    document.getElementById('pfAge').value = active.age || '';
    document.getElementById('pfGender').value = active.gender || 'other';
    document.getElementById('pfBloodGroup').value = active.bloodGroup || 'O+';
    document.getElementById('pfPhone').value = active.phone || '';
    document.getElementById('pfEmergency').value = active.emergencyContact || '';
    document.getElementById('pfAllergies').value = active.allergies || '';
    document.getElementById('pfConditions').value = active.conditions || '';
    document.getElementById('pfNotes').value = active.medicalNotes || '';

    /* 4. Tab 2 Family Roster Grid */
    var rosterEl = document.getElementById('familyRosterGrid');
    rosterEl.innerHTML = members.map(function (m) {
      var isAct = m.id === active.id;
      var ms = global.BWStore.getMemberSummary(m.id);
      var mIcon = ICON_MAP[m.avatarIcon] || 'bi-person';
      return (
        '<div class="col-md-6 col-xl-4">' +
        '  <div class="bw-family-card' + (isAct ? ' is-active-member' : '') + '">' +
        '    <div>' +
        '      <div class="d-flex justify-content-between align-items-start gap-2 mb-3">' +
        '        <div class="d-flex align-items-center gap-2">' +
        '          <span class="bw-avatar-circle bw-avatar-color-' + (m.avatarColor || 0) + '"><i class="bi ' + mIcon + '"></i></span>' +
        '          <div><h3 class="h6 fw-bold mb-0">' + esc(m.name) + '</h3><small class="text-muted">' + esc(global.BWNav.relationLabel(m.relation)) + (m.age ? ' • ' + esc(m.age) + 'y' : '') + ' • ' + esc(m.bloodGroup || 'O+') + '</small></div>' +
        '        </div>' +
        (isAct ? '<span class="badge bg-success-subtle text-success rounded-pill">' + esc(tr('badgeActiveNow')) + '</span>' : '') +
        '      </div>' +
        '      <div class="bw-family-mini-stats tabular-nums mb-3">' +
        '        <div><small class="text-muted d-block">BP</small><strong>' + (ms.latestBp ? esc(ms.latestBp.sys + '/' + ms.latestBp.dia) : '—') + '</strong></div>' +
        '        <div><small class="text-muted d-block">Glucose</small><strong>' + (ms.latestGlucose ? esc(ms.latestGlucose.valueMgdl + ' mg/dL') : '—') + '</strong></div>' +
        '        <div><small class="text-muted d-block">BOLT</small><strong>' + (ms.latestBolt ? esc(ms.latestBolt.score + 's') : '—') + '</strong></div>' +
        '        <div><small class="text-muted d-block">Rx</small><strong>' + esc(ms.rxVaultCount + ms.rxPadCount) + '</strong></div>' +
        '      </div>' +
        '    </div>' +
        '    <div class="d-flex flex-wrap gap-2 pt-2 border-top">' +
        (isAct
          ? '<span class="btn btn-sm btn-success disabled flex-grow-1"><i class="bi bi-check2-circle"></i> ' + esc(tr('badgeActiveNow')) + '</span>'
          : '<button type="button" class="btn btn-sm btn-bw-primary flex-grow-1" data-act="switch" data-mid="' + esc(m.id) + '" data-mname="' + esc(m.name) + '">' + esc(tr('btnMakeActive')) + '</button>') +
        '      <button type="button" class="btn btn-sm btn-outline-secondary" data-act="edit" data-mid="' + esc(m.id) + '" aria-label="Edit"><i class="bi bi-pencil-square"></i></button>' +
        (!m.isPrimary ? '<button type="button" class="btn btn-sm btn-outline-danger" data-act="delete" data-mid="' + esc(m.id) + '" aria-label="Delete"><i class="bi bi-trash"></i></button>' : '') +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }).join('');

    Array.prototype.forEach.call(rosterEl.querySelectorAll('[data-act="switch"]'), function (b) {
      b.addEventListener('click', function () {
        var mid = b.getAttribute('data-mid'), mname = b.getAttribute('data-mname');
        global.BWNav.promptPinThen(function () {
          global.BWStore.switchMember(mid);
          global.BWI18n.showToast(global.BWI18n.t('toastMemberSwitched', PAGE_DICT) + ' ' + mname, 'success');
          renderProfilePage();
        });
      });
    });
    Array.prototype.forEach.call(rosterEl.querySelectorAll('[data-act="edit"]'), function (b) {
      b.addEventListener('click', function () { openMemberModal(b.getAttribute('data-mid')); });
    });
    Array.prototype.forEach.call(rosterEl.querySelectorAll('[data-act="delete"]'), function (b) {
      b.addEventListener('click', function () {
        if (global.confirm(tr('confirmDeleteTitle'))) {
          global.BWStore.deleteMember(b.getAttribute('data-mid'));
          global.BWI18n.showToast(tr('toastMemberDeleted'), 'warning');
          renderProfilePage();
        }
      });
    });

    /* 5. Tab 3 Preferences */
    Array.prototype.forEach.call(document.querySelectorAll('[data-pref-min]'), function (btn) {
      btn.classList.toggle('active', Number(btn.getAttribute('data-pref-min')) === Number(prefs.dailyMinutes || 10));
    });
    document.getElementById('prefChimeChk').checked = prefs.chimeEnabled !== false;
    document.getElementById('prefVoiceChk').checked = !!prefs.voiceEnabled;
    document.getElementById('prefSoundscapeSel').value = prefs.soundscape || 'chimes';

    /* 6. Tab 4 Achievements (6 Dynamic Badges) */
    var badges = [
      { icon: 'bi-wind', title: 'First Mindful Breath', desc: 'Complete 1+ guided breathing session', ok: sum.sessionCount >= 1 },
      { icon: 'bi-stopwatch', title: 'BOLT Explorer', desc: 'Reach 15s+ BOLT oxygen score', ok: sum.bestBolt >= 15 },
      { icon: 'bi-fire', title: '7-Day Coherence Streak', desc: 'Build a 7-day breathing streak', ok: sum.streak >= 7 },
      { icon: 'bi-clock-history', title: '30 Min Calm Practice', desc: 'Accumulate 30+ total session mins', ok: sum.totalMinutes >= 30 },
      { icon: 'bi-file-medical', title: 'Organized Rx Vault', desc: 'Store 1+ clinical prescription', ok: (sum.rxVaultCount + sum.rxPadCount) >= 1 },
      { icon: 'bi-award-fill', title: 'Oxygen Master', desc: 'Reach optimal 30s+ BOLT score', ok: sum.bestBolt >= 30 }
    ];
    document.getElementById('profileBadgesGrid').innerHTML = badges.map(function (bg) {
      return (
        '<div class="col-md-6 col-xl-4"><div class="bw-badge-card' + (bg.ok ? ' unlocked' : '') + '">' +
        '  <div class="d-flex align-items-center gap-2 mb-1"><i class="bi ' + bg.icon + ' fs-4 ' + (bg.ok ? 'text-success' : 'text-muted') + '"></i><strong class="small">' + esc(bg.title) + '</strong></div>' +
        '  <div class="small text-muted">' + esc(bg.desc) + '</div>' +
        '</div></div>'
      );
    }).join('');

    /* 7. Tab 5 PIN Badge */
    var pinBadge = document.getElementById('pinStatusBadge');
    var pinRemBtn = document.getElementById('btnRemovePin');
    if (acc && acc.pinEnabled) {
      pinBadge.className = 'bw-status-pill bw-status-normal';
      pinBadge.textContent = tr('pinStatusEnabled');
      pinRemBtn.classList.remove('d-none');
    } else {
      pinBadge.className = 'bw-status-pill bw-status-info';
      pinBadge.textContent = tr('pinStatusDisabled');
      pinRemBtn.classList.add('d-none');
    }
  }

  function openMemberModal(memberId) {
    editingMemberId = memberId || null;
    var members = global.BWStore.getMembers();
    var target = null;
    if (editingMemberId) {
      members.forEach(function (m) { if (m.id === editingMemberId) target = m; });
    }
    document.getElementById('memName').value = target ? target.name : '';
    document.getElementById('memRelation').value = target ? target.relation : 'father';
    document.getElementById('memAge').value = target ? (target.age || '') : '';
    document.getElementById('memGender').value = target ? (target.gender || 'other') : 'male';
    document.getElementById('memBloodGroup').value = target ? (target.bloodGroup || 'O+') : 'O+';
    document.getElementById('memPhone').value = target ? (target.phone || '') : '';
    document.getElementById('memAllergies').value = target ? (target.allergies || '') : '';
    document.getElementById('memConditions').value = target ? (target.conditions || '') : '';
    document.getElementById('memNotes').value = target ? (target.medicalNotes || '') : '';
    document.getElementById('memSwitchWrap').classList.toggle('d-none', !!target);
    document.getElementById('memSwitchAfterAdd').checked = true;

    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(document.getElementById('memberFormModal')).show();
    }
  }

  function openAvatarModal() {
    var active = global.BWStore.getActiveMember();
    var grid = document.getElementById('avatarPickerGrid');
    grid.innerHTML = global.BWStore.AVATARS.map(function (key) {
      return (
        '<div class="col-4"><button type="button" class="bw-avatar-opt-btn w-100' + (active.avatarIcon === key ? ' active' : '') + '" data-pick-avatar="' + key + '">' +
        '  <i class="bi ' + ICON_MAP[key] + ' fs-3 text-primary"></i><span class="small text-capitalize">' + key + '</span>' +
        '</button></div>'
      );
    }).join('');
    Array.prototype.forEach.call(grid.querySelectorAll('[data-pick-avatar]'), function (btn) {
      btn.addEventListener('click', function () {
        global.BWStore.updateMember(active.id, { avatarIcon: btn.getAttribute('data-pick-avatar') });
        if (global.bootstrap && global.bootstrap.Modal) {
          global.bootstrap.Modal.getOrCreateInstance(document.getElementById('avatarModal')).hide();
        }
        renderProfilePage();
      });
    });
    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(document.getElementById('avatarModal')).show();
    }
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');
    populateRelationOptions(document.getElementById('memRelation'));

    document.getElementById('guestDemoBtn').addEventListener('click', function () {
      global.BWStore.loginDemoFamily();
      global.BWI18n.showToast(global.BWI18n.t('toastDemoLoaded', PAGE_DICT), 'success');
      renderProfilePage();
    });

    document.getElementById('btnOpenAvatarModal').addEventListener('click', openAvatarModal);
    document.getElementById('btnOpenAddMember').addEventListener('click', function () { openMemberModal(null); });
    document.getElementById('btnEditActiveMember').addEventListener('click', function () {
      var a = global.BWStore.getActiveMember();
      if (a && !a.isGuest) openMemberModal(a.id);
    });

    document.getElementById('personalInfoForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var active = global.BWStore.getActiveMember();
      global.BWStore.updateMember(active.id, {
        name: document.getElementById('pfName').value.trim(),
        age: Number(document.getElementById('pfAge').value) || '',
        gender: document.getElementById('pfGender').value,
        bloodGroup: document.getElementById('pfBloodGroup').value,
        phone: document.getElementById('pfPhone').value.trim(),
        emergencyContact: document.getElementById('pfEmergency').value.trim(),
        allergies: document.getElementById('pfAllergies').value.trim(),
        conditions: document.getElementById('pfConditions').value.trim(),
        medicalNotes: document.getElementById('pfNotes').value.trim()
      });
      global.BWI18n.showToast(tr('toastUpdated'), 'success');
      renderProfilePage();
    });

    document.getElementById('memberForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var payload = {
        name: document.getElementById('memName').value.trim(),
        relation: document.getElementById('memRelation').value,
        age: Number(document.getElementById('memAge').value) || '',
        gender: document.getElementById('memGender').value,
        bloodGroup: document.getElementById('memBloodGroup').value,
        phone: document.getElementById('memPhone').value.trim(),
        allergies: document.getElementById('memAllergies').value.trim(),
        conditions: document.getElementById('memConditions').value.trim(),
        medicalNotes: document.getElementById('memNotes').value.trim(),
        switchAfterAdd: document.getElementById('memSwitchAfterAdd').checked
      };
      if (!payload.name) return;
      if (editingMemberId) {
        global.BWStore.updateMember(editingMemberId, payload);
        global.BWI18n.showToast(tr('toastUpdated'), 'success');
      } else {
        global.BWStore.addMember(payload);
        global.BWI18n.showToast(tr('toastMemberAdded'), 'success');
      }
      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(document.getElementById('memberFormModal')).hide();
      }
      renderProfilePage();
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-pref-min]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-pref-min]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });

    document.getElementById('btnSavePrefs').addEventListener('click', function () {
      var prefs = global.BWStore.getDomainData('prefs') || {};
      var activeGoalBtn = document.querySelector('[data-pref-min].active');
      prefs.dailyMinutes = activeGoalBtn ? Number(activeGoalBtn.getAttribute('data-pref-min')) : 10;
      prefs.chimeEnabled = document.getElementById('prefChimeChk').checked;
      prefs.voiceEnabled = document.getElementById('prefVoiceChk').checked;
      prefs.soundscape = document.getElementById('prefSoundscapeSel').value;
      global.BWStore.setDomainData('prefs', prefs);
      global.BWI18n.showToast(tr('toastPrefsSaved'), 'success');
    });

    document.getElementById('btnSavePin').addEventListener('click', function () {
      var res = global.BWStore.setPin(document.getElementById('profilePinInput').value.trim());
      if (!res.ok) { global.BWI18n.showToast(tr('toastPinInvalid'), 'danger'); return; }
      document.getElementById('profilePinInput').value = '';
      global.BWI18n.showToast(tr('toastPinSaved'), 'success');
      renderProfilePage();
    });

    document.getElementById('btnRemovePin').addEventListener('click', function () {
      global.BWStore.clearPin();
      global.BWI18n.showToast(tr('toastPinCleared'), 'info');
      renderProfilePage();
    });

    document.getElementById('btnExportAllJson').addEventListener('click', function () {
      var bundle = global.BWStore.exportAccountBackup();
      if (bundle) global.BWI18n.downloadJson('breathewell-v3-household-' + new Date().toISOString().slice(0, 10) + '.json', bundle);
    });

    document.getElementById('importBackupInput').addEventListener('change', function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var res = global.BWStore.importAccountBackup(JSON.parse(String(r.result || '{}')));
          global.BWI18n.showToast(res.ok ? tr('toastBackupImported') : tr('toastBackupBad'), res.ok ? 'success' : 'danger');
          if (res.ok) renderProfilePage();
        } catch (err) {
          global.BWI18n.showToast(tr('toastBackupBad'), 'danger');
        }
      };
      r.readAsText(f);
      ev.target.value = '';
    });

    document.getElementById('btnResetActiveMember').addEventListener('click', function () {
      if (global.confirm(tr('confirmResetTitle'))) {
        global.BWStore.resetMemberDomains();
        global.BWI18n.showToast(tr('toastMemberReset'), 'warning');
        renderProfilePage();
      }
    });

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      populateRelationOptions(document.getElementById('memRelation'));
      renderProfilePage();
    });
    global.addEventListener('bwMemberChanged', renderProfilePage);
    renderProfilePage();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
