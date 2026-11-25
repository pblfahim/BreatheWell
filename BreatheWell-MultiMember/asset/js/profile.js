/**
 * @file profile.js
 * @description Multi-Member Household Manager, Active Member Telemetry Hub,
 * Add/Edit/Delete Member Modal, 4-Digit Security PIN Lock & Full JSON Backup/Restore.
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Page Dictionary (`PAGE_DICT`)
 *   2. Guest Gate vs Authenticated Household Renderer
 *   3. Active Member Clinical Telemetry Aggregation
 *   4. Multi-Member Family Card Grid & Switch/Edit/Delete Handlers
 *   5. Security PIN & Full Household JSON Backup / Restore Controls
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'পরিবার ও সদস্য প্রোফাইল | ব্রিদওয়েল',
      guestHeroTitle: 'আপনার সম্পূর্ণ পরিবারের স্বাস্থ্য ড্যাশবোর্ড',
      guestHeroDesc: 'বাবা, মা, স্বামী/স্ত্রী ও সন্তানদের জন্য আলাদা রক্তচাপ, ডায়াবেটিস, ব্রিদ টেস্ট এবং প্রেসক্রিপশন প্রোফাইল সংরক্ষণ করতে সাইন ইন করুন অথবা ১-ক্লিক ডেমো চালু করুন।',
      btnEditActive: 'সদস্য তথ্য সম্পাদনা',
      btnAddMember: 'নতুন সদস্য যোগ করুন',
      kpiSessions: 'শ্বাস সেশন',
      kpiBolt: 'সর্বশেষ BOLT',
      kpiBp: 'সর্বশেষ রক্তচাপ',
      kpiGlucose: 'সর্বশেষ গ্লুকোজ',
      kpiRx: 'সংরক্ষিত প্রেসক্রিপশন',
      secRosterTitle: 'পরিবারের সকল সদস্য',
      secRosterSub: 'যেকোনো সদস্যকে সক্রিয় করলে অ্যাপের সমস্ত চার্ট, ইতিহাস ও প্রেসক্রিপশন সেই সদস্যের নামে প্রদর্শিত হবে।',
      btnMakeActive: 'এই সদস্যে যান',
      badgeActiveNow: 'এখন সক্রিয়',
      lblPinTitle: 'পারিবারিক প্রাইভেসি পিন (SHA-256)',
      lblPinDesc: 'সদস্য পরিবর্তনের সময় ৪-অঙ্কের পিন সুরক্ষা চালু বা পরিবর্তন করুন।',
      pinStatusEnabled: 'পিন সুরক্ষা চালু আছে',
      pinStatusDisabled: 'পিন সুরক্ষা বন্ধ আছে',
      btnSavePin: 'পিন সেভ করুন',
      btnRemovePin: 'পিন বন্ধ করুন',
      lblBackupTitle: 'সম্পূর্ণ পরিবার ব্যাকআপ ও পুনরুদ্ধার',
      lblBackupDesc: 'সব সদস্যের সকল ডেটা একটি সুরক্ষিত JSON ফাইলে ডাউনলোড বা পুনরুদ্ধার করুন।',
      btnExportAll: 'সব সদস্যের JSON ডাউনলোড',
      btnImportAll: 'JSON ফাইল থেকে পুনরুদ্ধার',
      lblResetMemberTitle: 'সক্রিয় সদস্যের ডেটা রিসেট',
      lblResetMemberDesc: 'শুধুমাত্র বর্তমান সক্রিয় সদস্যের রিডিং, টেস্ট ও প্রেসক্রিপশন মুছে ফেলুন।',
      btnResetMember: 'বর্তমান সদস্যের ডেটা মুছুন',
      modalAddTitle: 'পরিবারের সদস্য যোগ / সম্পাদনা',
      fldName: 'সদস্যের নাম *',
      fldRelation: 'সম্পর্ক',
      fldAge: 'বয়স',
      fldGender: 'লিঙ্গ',
      fldBlood: 'রক্তের গ্রুপ',
      fldPhone: 'ফোন',
      fldAllergies: 'অ্যালার্জি (যদি থাকে)',
      fldConditions: 'চলমান রোগ বা সতর্কতা',
      fldNotes: 'ক্লিনিক্যাল নোট',
      chkSwitchImmediately: 'যোগ করার সাথে সাথেই এই সদস্যকে সক্রিয় করুন',
      btnModalSave: 'সদস্য সংরক্ষণ করুন',
      genderMale: 'পুরুষ',
      genderFemale: 'নারী',
      genderOther: 'অন্যান্য',
      toastMemberAdded: 'পরিবারের নতুন সদস্য যোগ করা হয়েছে।',
      toastMemberUpdated: 'সদস্যের তথ্য আপডেট করা হয়েছে।',
      toastMemberDeleted: 'সদস্য এবং তার ডেটা মুছে ফেলা হয়েছে।',
      toastPinSaved: '৪-অঙ্কের পিন সুরক্ষা সক্রিয় হয়েছে।',
      toastPinCleared: 'পিন সুরক্ষা বন্ধ করা হয়েছে।',
      toastPinInvalid: 'অনুগ্রহ করে ঠিক ৪ সংখ্যার (0-9) একটি পিন দিন।',
      toastBackupImported: 'সম্পূর্ণ পারিবারিক ব্যাকআপ সফলভাবে পুনরুদ্ধার হয়েছে!',
      toastBackupBad: 'সঠিক BreatheWell-MultiMember JSON ফাইল নির্বাচন করুন।',
      toastMemberReset: 'বর্তমান সক্রিয় সদস্যের ডেটা রিসেট করা হয়েছে।',
      confirmDeleteTitle: 'সদস্য মুছে ফেলবেন?',
      confirmResetText: 'আপনি কি নিশ্চিতভাবে বর্তমান সদস্যের সমস্ত ডেটা মুছে ফেলতে চান?'
    },
    en: {
      pageTitle: 'Family & Member Hub | BreatheWell',
      guestHeroTitle: 'Multi-Member Household Health Hub',
      guestHeroDesc: 'Keep separate blood pressure logs, diabetes trends, BOLT scores, and prescriptions for Self, Father, Mother, Spouse, and Children under one encrypted local household.',
      btnEditActive: 'Edit Profile',
      btnAddMember: 'Add Family Member',
      kpiSessions: 'Breathing Sessions',
      kpiBolt: 'Latest BOLT',
      kpiBp: 'Latest Blood Pressure',
      kpiGlucose: 'Latest Glucose',
      kpiRx: 'Saved Prescriptions',
      secRosterTitle: 'Household Member Directory',
      secRosterSub: 'Switching a member instantly updates charts, history tables, calculators, and prescription records across all 15 pages.',
      btnMakeActive: 'Switch Here',
      badgeActiveNow: 'Active Now',
      lblPinTitle: 'Household Privacy PIN (SHA-256)',
      lblPinDesc: 'Require a 4-digit security PIN before switching across family members.',
      pinStatusEnabled: 'PIN Lock Active',
      pinStatusDisabled: 'PIN Lock Disabled',
      btnSavePin: 'Save PIN',
      btnRemovePin: 'Disable PIN',
      lblBackupTitle: 'Full Household Backup & Restore',
      lblBackupDesc: 'Export or restore every member profile and clinical domain as a single portable JSON bundle.',
      btnExportAll: 'Export All Members JSON',
      btnImportAll: 'Restore from JSON',
      lblResetMemberTitle: 'Reset Active Member Domains',
      lblResetMemberDesc: 'Clear vitals, breath tests, exercises, and prescriptions for the currently active member only.',
      btnResetMember: 'Clear Active Member Data',
      modalAddTitle: 'Add / Edit Family Member',
      fldName: 'Member Name *',
      fldRelation: 'Relationship',
      fldAge: 'Age',
      fldGender: 'Gender',
      fldBlood: 'Blood Group',
      fldPhone: 'Phone',
      fldAllergies: 'Allergies',
      fldConditions: 'Chronic Conditions / Watchlist',
      fldNotes: 'Clinical Notes',
      chkSwitchImmediately: 'Switch to this member immediately after saving',
      btnModalSave: 'Save Member',
      genderMale: 'Male',
      genderFemale: 'Female',
      genderOther: 'Other',
      toastMemberAdded: 'New family member added.',
      toastMemberUpdated: 'Member profile updated.',
      toastMemberDeleted: 'Member and their scoped data deleted.',
      toastPinSaved: '4-digit Privacy PIN activated.',
      toastPinCleared: 'Privacy PIN disabled.',
      toastPinInvalid: 'Please enter exactly 4 numeric digits (0-9).',
      toastBackupImported: 'Household JSON backup restored successfully!',
      toastBackupBad: 'Invalid backup file. Please select a BreatheWell-MultiMember JSON export.',
      toastMemberReset: 'Cleared all domains for the currently active member.',
      confirmDeleteTitle: 'Remove this family member?',
      confirmResetText: 'Clear all clinical records saved for the active member?'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  var editingMemberId = null;

  /* --------------------------------------------------------------------------
     2. MAIN PAGE RENDERER
     -------------------------------------------------------------------------- */
  function renderProfileHub() {
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
    var esc = global.BWI18n.escapeHtml;

    /* Active Member Banner */
    var avatar = document.getElementById('activeMemberAvatar');
    avatar.className = 'bw-avatar-circle bw-avatar-lg bw-avatar-color-' + (active.avatarColor || 0);
    avatar.textContent = active.avatarInitials || 'FM';

    document.getElementById('activeMemberName').textContent = active.name;
    document.getElementById('activeMemberRelation').textContent = global.BWNav.relationLabel(active.relation);
    document.getElementById('activeMemberBlood').textContent = active.bloodGroup || 'O+';
    document.getElementById('activeMemberAge').textContent = active.age ? active.age + ' ' + tr('commonYears') : '—';
    document.getElementById('activeMemberConditions').textContent = active.conditions || '—';
    document.getElementById('activeMemberAllergies').textContent = active.allergies || '—';

    /* Active Member Vitality KPIs */
    document.getElementById('kpiSessionsVal').textContent = sum.sessionCount + ' (' + sum.totalMinutes + 'm)';
    document.getElementById('kpiBoltVal').textContent = sum.latestBolt ? sum.latestBolt.score + 's' : '—';

    var bpTxt = '—';
    if (sum.latestBp) {
      var bpCls = global.BWClinical.classifyBP(sum.latestBp.sys, sum.latestBp.dia);
      bpTxt = sum.latestBp.sys + '/' + sum.latestBp.dia + ' (' + tr(bpCls.labelKey) + ')';
    }
    document.getElementById('kpiBpVal').textContent = bpTxt;

    var glTxt = '—';
    if (sum.latestGlucose) {
      var glCls = global.BWClinical.classifyGlucose(sum.latestGlucose.valueMgdl, sum.latestGlucose.context);
      glTxt = sum.latestGlucose.valueMgdl + ' mg/dL (' + tr(glCls.labelKey) + ')';
    }
    document.getElementById('kpiGlucoseVal').textContent = glTxt;
    document.getElementById('kpiRxVal').textContent = String(sum.rxVaultCount + sum.rxPadCount);

    /* Roster Cards Grid */
    var rosterGrid = document.getElementById('familyRosterGrid');
    rosterGrid.innerHTML = members.map(function (m) {
      var isAct = m.id === active.id;
      var ms = global.BWStore.getMemberSummary(m.id);
      var bpDisplay = ms.latestBp ? (ms.latestBp.sys + '/' + ms.latestBp.dia) : '—';
      var glDisplay = ms.latestGlucose ? (ms.latestGlucose.valueMgdl + ' mg/dL') : '—';
      var boltDisplay = ms.latestBolt ? (ms.latestBolt.score + 's') : '—';
      var rxDisplay = ms.rxVaultCount + ms.rxPadCount;

      return (
        '<div class="col-md-6 col-xl-4">' +
        '  <div class="bw-family-card' + (isAct ? ' is-active-member' : '') + '">' +
        '    <div>' +
        '      <div class="d-flex align-items-start justify-content-between gap-2 mb-3">' +
        '        <div class="d-flex align-items-center gap-2">' +
        '          <span class="bw-avatar-circle bw-avatar-color-' + (m.avatarColor || 0) + '">' + esc(m.avatarInitials) + '</span>' +
        '          <div>' +
        '            <h3 class="h6 fw-bold mb-0">' + esc(m.name) + '</h3>' +
        '            <small class="text-muted">' + esc(global.BWNav.relationLabel(m.relation)) + (m.age ? ' • ' + esc(m.age) + ' ' + esc(tr('commonYears')) : '') + ' • ' + esc(m.bloodGroup || 'O+') + '</small>' +
        '          </div>' +
        '        </div>' +
        (isAct ? '<span class="badge bg-success-subtle text-success rounded-pill">' + esc(tr('badgeActiveNow')) + '</span>' : '') +
        '      </div>' +
        '      <div class="bw-family-mini-stats tabular-nums mb-3">' +
        '        <div><span class="text-muted d-block">BP</span><strong>' + esc(bpDisplay) + '</strong></div>' +
        '        <div><span class="text-muted d-block">Glucose</span><strong>' + esc(glDisplay) + '</strong></div>' +
        '        <div><span class="text-muted d-block">BOLT</span><strong>' + esc(boltDisplay) + '</strong></div>' +
        '        <div><span class="text-muted d-block">Rx</span><strong>' + esc(rxDisplay) + '</strong></div>' +
        '      </div>' +
        (m.conditions ? '<p class="small text-muted mb-3"><i class="bi bi-heart-pulse text-danger me-1" aria-hidden="true"></i>' + esc(m.conditions) + '</p>' : '') +
        '    </div>' +
        '    <div class="d-flex flex-wrap gap-2 pt-2 border-top">' +
        (isAct
          ? '<span class="btn btn-sm btn-success disabled flex-grow-1"><i class="bi bi-check2-circle"></i> ' + esc(tr('badgeActiveNow')) + '</span>'
          : '<button type="button" class="btn btn-sm btn-bw-primary flex-grow-1" data-action="switch" data-member-id="' + esc(m.id) + '" data-member-name="' + esc(m.name) + '">' + esc(tr('btnMakeActive')) + '</button>') +
        '      <button type="button" class="btn btn-sm btn-outline-secondary" data-action="edit" data-member-id="' + esc(m.id) + '" aria-label="Edit ' + esc(m.name) + '"><i class="bi bi-pencil-square" aria-hidden="true"></i></button>' +
        (!m.isPrimary ? '<button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" data-member-id="' + esc(m.id) + '" aria-label="Delete ' + esc(m.name) + '"><i class="bi bi-trash" aria-hidden="true"></i></button>' : '') +
        '    </div>' +
        '  </div>' +
        '</div>'
      );
    }).join('');

    /* Bind member card buttons */
    Array.prototype.forEach.call(rosterGrid.querySelectorAll('[data-action="switch"]'), function (btn) {
      btn.addEventListener('click', function () {
        var mid = btn.getAttribute('data-member-id');
        var mname = btn.getAttribute('data-member-name');
        global.BWNav.promptPinThen(function () {
          global.BWStore.switchMember(mid);
          global.BWI18n.showToast(global.BWI18n.t('toastMemberSwitched', PAGE_DICT) + ' ' + mname, 'success');
          renderProfileHub();
        });
      });
    });

    Array.prototype.forEach.call(rosterGrid.querySelectorAll('[data-action="edit"]'), function (btn) {
      btn.addEventListener('click', function () {
        openMemberModal(btn.getAttribute('data-member-id'));
      });
    });

    Array.prototype.forEach.call(rosterGrid.querySelectorAll('[data-action="delete"]'), function (btn) {
      btn.addEventListener('click', function () {
        var mid = btn.getAttribute('data-member-id');
        if (global.confirm(tr('confirmDeleteTitle'))) {
          var res = global.BWStore.deleteMember(mid);
          if (res.ok) {
            global.BWI18n.showToast(tr('toastMemberDeleted'), 'warning');
            renderProfileHub();
          }
        }
      });
    });

    /* PIN status badge */
    var pinBadge = document.getElementById('pinStatusBadge');
    var pinRemoveBtn = document.getElementById('btnRemovePin');
    if (acc && acc.pinEnabled) {
      pinBadge.className = 'bw-status-pill bw-status-normal';
      pinBadge.textContent = tr('pinStatusEnabled');
      pinRemoveBtn.classList.remove('d-none');
    } else {
      pinBadge.className = 'bw-status-pill bw-status-info';
      pinBadge.textContent = tr('pinStatusDisabled');
      pinRemoveBtn.classList.add('d-none');
    }
  }

  /* --------------------------------------------------------------------------
     3. ADD / EDIT MEMBER MODAL HANDLERS
     -------------------------------------------------------------------------- */
  function openMemberModal(memberId) {
    editingMemberId = memberId || null;
    var members = global.BWStore.getMembers();
    var target = null;
    if (editingMemberId) {
      for (var i = 0; i < members.length; i++) {
        if (members[i].id === editingMemberId) target = members[i];
      }
    }

    document.getElementById('memName').value = target ? target.name : '';
    document.getElementById('memRelation').value = target ? target.relation : 'father';
    document.getElementById('memAge').value = target ? (target.age || '') : '';
    document.getElementById('memGender').value = target ? (target.gender || 'other') : 'male';
    document.getElementById('memBloodGroup').value = target ? (target.bloodGroup || 'O+') : 'O+';
    document.getElementById('memPhone').value = target ? (target.phone || '') : '';
    document.getElementById('memAllergies').value = target ? (target.allergies || '') : '';
    document.getElementById('memConditions').value = target ? (target.conditions || '') : '';
    document.getElementById('memNotes').value = target ? (target.notes || '') : '';

    var switchWrap = document.getElementById('memSwitchWrap');
    switchWrap.classList.toggle('d-none', !!target);
    document.getElementById('memSwitchAfterAdd').checked = true;

    var modalEl = document.getElementById('memberFormModal');
    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  /* --------------------------------------------------------------------------
     4. INIT & EVENT BINDINGS
     -------------------------------------------------------------------------- */
  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    document.getElementById('guestDemoBtn').addEventListener('click', function () {
      global.BWStore.loginDemoFamily();
      global.BWI18n.showToast(global.BWI18n.t('toastDemoLoaded', PAGE_DICT), 'success');
      renderProfileHub();
    });

    document.getElementById('btnOpenAddMember').addEventListener('click', function () {
      openMemberModal(null);
    });

    document.getElementById('btnEditActiveMember').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      if (active && !active.isGuest) openMemberModal(active.id);
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
        notes: document.getElementById('memNotes').value.trim(),
        switchAfterAdd: document.getElementById('memSwitchAfterAdd').checked
      };

      if (!payload.name) return;

      if (editingMemberId) {
        global.BWStore.updateMember(editingMemberId, payload);
        global.BWI18n.showToast(tr('toastMemberUpdated'), 'success');
      } else {
        global.BWStore.addMember(payload);
        global.BWI18n.showToast(tr('toastMemberAdded'), 'success');
      }

      var modalEl = document.getElementById('memberFormModal');
      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
      }
      renderProfileHub();
    });

    /* Security PIN Handlers */
    document.getElementById('btnSavePin').addEventListener('click', function () {
      var pinVal = document.getElementById('profilePinInput').value.trim();
      var res = global.BWStore.setPin(pinVal);
      if (!res.ok) {
        global.BWI18n.showToast(tr('toastPinInvalid'), 'danger');
        return;
      }
      document.getElementById('profilePinInput').value = '';
      global.BWI18n.showToast(tr('toastPinSaved'), 'success');
      renderProfileHub();
    });

    document.getElementById('btnRemovePin').addEventListener('click', function () {
      global.BWStore.clearPin();
      global.BWI18n.showToast(tr('toastPinCleared'), 'info');
      renderProfileHub();
    });

    /* Export / Import / Reset Handlers */
    document.getElementById('btnExportAllJson').addEventListener('click', function () {
      var bundle = global.BWStore.exportAccountBackup();
      if (!bundle) return;
      global.BWI18n.downloadJson('breathewell-family-backup-' + new Date().toISOString().slice(0, 10) + '.json', bundle);
    });

    document.getElementById('importBackupInput').addEventListener('change', function (ev) {
      var file = ev.target.files && ev.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var obj = JSON.parse(String(reader.result || '{}'));
          var res = global.BWStore.importAccountBackup(obj);
          if (res.ok) {
            global.BWI18n.showToast(tr('toastBackupImported'), 'success');
            renderProfileHub();
          } else {
            global.BWI18n.showToast(tr('toastBackupBad'), 'danger');
          }
        } catch (err) {
          global.BWI18n.showToast(tr('toastBackupBad'), 'danger');
        }
      };
      reader.readAsText(file);
      ev.target.value = '';
    });

    document.getElementById('btnResetActiveMember').addEventListener('click', function () {
      if (global.confirm(tr('confirmResetText'))) {
        global.BWStore.resetMemberDomains();
        global.BWI18n.showToast(tr('toastMemberReset'), 'warning');
        renderProfileHub();
      }
    });

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderProfileHub();
    });
    global.addEventListener('bwMemberChanged', renderProfileHub);
    renderProfileHub();
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
