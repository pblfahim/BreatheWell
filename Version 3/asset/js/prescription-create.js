/**
 * @file prescription-create.js
 * @description Split-Screen Clinical Creator Studio (`prescription-create.html`):
 *   - Action Toolbar: Clear, Upload Scan OCR Import (Fixed from V1!), Print A4, WhatsApp, Copy
 *   - Left 4-Card Clinical Studio w/ 5 Quick Med Preset Pills & `/` Focus Shortcut
 *   - Right Sticky Live 2-Column Clinical A4 Pad w/ Member Signature & Watermark
 *   - Saves simultaneously to Active Member's `rx_pad` + `rx_vault` archives!
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Structured Model Collector & 2-Column Live Preview
 *   3. 5 Quick Med Pills, OCR Studio Import & `/` Shortcut
 *   4. Confirmation Save Modal (`#createPrescriptionModal`)
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'প্রেসক্রিপশন তৈরি স্টুডিও | ব্রিদওয়েল v3',
      heroTitle: 'ডিজিটাল প্রেসক্রিপশন তৈরি ও লাইভ A4 স্টুডিও',
      heroSub: 'বামে ক্লিনিক্যাল তথ্য বা দ্রুত ওষুধ পিল নির্বাচন করুন — ডানে তাৎক্ষণিক A4 প্রিন্ট শিট তৈরি হবে।',
      btnNew: 'নতুন',
      btnOcr: 'স্ক্যান ইম্পোর্ট (OCR)',
      btnPrint: 'A4 প্রিন্ট',
      btnWa: 'হোয়াটসঅ্যাপ',
      btnSave: 'সদস্যে সংরক্ষণ',
      toastSaved: 'প্রেসক্রিপশন সক্রিয় সদস্যের ডিজিটাল প্যাড ও ভল্টে সংরক্ষিত হয়েছে!'
    },
    en: {
      pageTitle: 'Create Prescription Studio | BreatheWell v3',
      heroTitle: 'Split-Screen Prescription Creator Studio',
      heroSub: 'Compose structured C/C, H/O, O/E vitals, Dx & medications on the left while previewing live A4 output on the right.',
      btnNew: 'New',
      btnOcr: 'OCR Import',
      btnPrint: 'Print A4',
      btnWa: 'WhatsApp',
      btnSave: 'Save to Member',
      toastSaved: 'Saved cleanly to active member Digital Pad & Vault!'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var meds = [
    { form: 'Tab.', name: 'Montelukast 10mg', dose: '0 + 0 + 1', duration: '30 Days', note: 'Before sleep' }
  ];

  function buildPadModel() {
    return {
      serialNo: document.getElementById('cpSerialInput').value.trim(),
      source: 'studio',
      doctorName: document.getElementById('cpDocName').value.trim(),
      doctorCreds: document.getElementById('cpDocCreds').value.trim(),
      bmdc: document.getElementById('cpBmdc').value.trim(),
      clinicName: document.getElementById('cpClinicName').value.trim(),
      clinicAddr: document.getElementById('cpClinicAddr').value.trim(),
      patientName: document.getElementById('cpPatName').value.trim(),
      patientAge: document.getElementById('cpPatAge').value.trim(),
      patientSex: document.getElementById('cpPatSex').value.trim(),
      rxDate: document.getElementById('cpRxDate').value,
      followUp: document.getElementById('cpFollowUp').value,
      cc: document.getElementById('cpCcInput').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      ho: document.getElementById('cpHoInput').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      oe: {
        bp: document.getElementById('cpOeBp').value.trim(),
        pulse: document.getElementById('cpOePulse').value.trim(),
        temp: document.getElementById('cpOeTemp').value.trim(),
        weight: document.getElementById('cpOeWt').value.trim()
      },
      inv: document.getElementById('cpInvInput').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      diagnosis: document.getElementById('cpDiagnosis').value.trim(),
      meds: meds.map(function (m) { return { form: m.form, name: m.name, dose: m.dose, duration: m.duration, note: m.note }; }),
      advice: document.getElementById('cpAdvice').value.trim()
    };
  }

  function renderLivePreview() {
    var active = global.BWStore.getActiveMember();
    var sig = global.BWStore.getDomainData('signature', active.id) || '';
    document.getElementById('printablePrescriptionPad').innerHTML =
      global.BWRxShared.buildClinicalPadHtml(buildPadModel(), active, sig);
  }

  function syncMemberFields() {
    var active = global.BWStore.getActiveMember();
    document.getElementById('cpPatName').value = active.name || '';
    document.getElementById('cpPatAge').value = active.age ? active.age + ' Yrs' : '';
    document.getElementById('cpPatSex').value = active.gender || '';
    renderLivePreview();
  }

  function renderMedsRows() {
    var tbody = document.getElementById('editorMedsTbody');
    var esc = global.BWI18n.escapeHtml;
    tbody.innerHTML = meds.map(function (m, idx) {
      return (
        '<tr>' +
        '  <td><input type="text" class="form-control form-control-sm" value="' + esc(m.name) + '" data-cmed-i="' + idx + '" data-cmed-k="name"></td>' +
        '  <td><input type="text" class="form-control form-control-sm tabular-nums" value="' + esc(m.dose) + '" data-cmed-i="' + idx + '" data-cmed-k="dose"></td>' +
        '  <td><input type="text" class="form-control form-control-sm" value="' + esc(m.duration) + '" data-cmed-i="' + idx + '" data-cmed-k="duration"></td>' +
        '  <td><button type="button" class="btn btn-sm btn-outline-danger" data-del-cmed="' + idx + '"><i class="bi bi-x"></i></button></td>' +
        '</tr>'
      );
    }).join('');
  }

  function saveStudioPrescription() {
    var model = buildPadModel();
    model.id = 'pad_' + Date.now().toString(36);
    model.patientName = document.getElementById('modalPatientName').value.trim() || model.patientName;
    model.serialNo = document.getElementById('modalSerialNumber').value.trim() || model.serialNo;
    model.createdAt = new Date().toISOString();

    var padList = global.BWStore.getDomainData('rx_pad') || [];
    padList.unshift(model);
    global.BWStore.setDomainData('rx_pad', padList);

    /* Dual-write cleanly into Member's Vault archive if toggled */
    if (document.getElementById('cpAlsoVaultChk').checked) {
      var vault = global.BWStore.getDomainData('rx_vault') || [];
      vault.unshift({
        id: 'rx_' + Date.now().toString(36),
        title: model.doctorName + ' (Studio)',
        doctor: model.doctorName,
        degrees: model.doctorCreds,
        clinic: model.clinicName,
        patientName: model.patientName,
        patientAge: model.patientAge,
        patientSex: model.patientSex,
        date: model.rxDate,
        refillDate: model.followUp,
        cc: model.cc,
        ho: model.ho,
        oe: model.oe,
        inv: model.inv,
        diagnosis: model.diagnosis,
        medications: model.meds,
        notes: model.advice,
        urgency: 'normal',
        files: [],
        source: 'studio',
        createdAt: model.createdAt
      });
      global.BWStore.setDomainData('rx_vault', vault);
    }

    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(document.getElementById('createPrescriptionModal')).hide();
    }
    global.BWI18n.showToast(tr('toastSaved'), 'success');
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');
    document.getElementById('cpRxDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('cpSerialInput').value = 'BW-' + Math.floor(1000 + Math.random() * 8999);

    syncMemberFields();
    renderMedsRows();

    ['cpSerialInput', 'cpDocName', 'cpDocCreds', 'cpBmdc', 'cpClinicName', 'cpClinicAddr', 'cpPatName', 'cpPatAge', 'cpPatSex', 'cpRxDate', 'cpFollowUp', 'cpCcInput', 'cpHoInput', 'cpOeBp', 'cpOePulse', 'cpOeTemp', 'cpOeWt', 'cpInvInput', 'cpDiagnosis', 'cpAdvice']
      .forEach(function (id) { document.getElementById(id).addEventListener('input', renderLivePreview); });

    document.getElementById('cpAddCustomMedBtn').addEventListener('click', function () {
      var nm = document.getElementById('medNameInput').value.trim();
      if (!nm) return;
      meds.push({ form: 'Tab.', name: nm, dose: '1 + 0 + 1', duration: '7 Days', note: '' });
      document.getElementById('medNameInput').value = '';
      renderMedsRows();
      renderLivePreview();
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-cp-preset]'), function (btn) {
      btn.addEventListener('click', function () {
        var parts = btn.getAttribute('data-cp-preset').split('|');
        meds.push({ form: parts[0], name: parts[1], dose: parts[2], duration: parts[3], note: '' });
        renderMedsRows();
        renderLivePreview();
      });
    });

    var tbody = document.getElementById('editorMedsTbody');
    tbody.addEventListener('input', function (ev) {
      var i = ev.target.getAttribute('data-cmed-i');
      var k = ev.target.getAttribute('data-cmed-k');
      if (i !== null && meds[i] && k) { meds[i][k] = ev.target.value; renderLivePreview(); }
    });
    tbody.addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('[data-del-cmed]') : null;
      if (btn) { meds.splice(Number(btn.getAttribute('data-del-cmed')), 1); renderMedsRows(); renderLivePreview(); }
    });

    /* '/' keyboard shortcut focuses quick medication input */
    document.addEventListener('keydown', function (ev) {
      if (ev.key === '/' && document.activeElement && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        ev.preventDefault();
        document.getElementById('medNameInput').focus();
      }
    });

    /* OCR Scan Import directly inside Studio */
    document.getElementById('btnUploadOcr').addEventListener('click', function () {
      document.getElementById('cpOcrFileInput').click();
    });
    document.getElementById('cpOcrFileInput').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      global.BWRxShared.scanPrescriptionFile(f, { enhance: true }).then(function (res) {
        if (res.ocrStatus === 'ok') {
          var p = res.parsed;
          if (p.doctor) document.getElementById('cpDocName').value = p.doctor;
          if (p.clinic) document.getElementById('cpClinicName').value = p.clinic;
          if (p.diagnosis) document.getElementById('cpDiagnosis').value = p.diagnosis;
          if (p.medications && p.medications.length) {
            meds = p.medications.map(function (line) { return { form: 'Tab.', name: line, dose: '', duration: '', note: '' }; });
            renderMedsRows();
          }
          renderLivePreview();
          global.BWI18n.showToast('OCR imported cleanly into Studio!', 'success');
        } else {
          global.BWI18n.showToast(res.errorDetail || 'OCR import unavailable offline.', 'warning');
        }
      });
      e.target.value = '';
    });

    document.getElementById('btnClearForm').addEventListener('click', function () {
      meds = [];
      renderMedsRows();
      document.getElementById('cpDiagnosis').value = '';
      document.getElementById('cpCcInput').value = '';
      renderLivePreview();
    });

    document.getElementById('btnPrintPrescription').addEventListener('click', function () { global.print(); });
    document.getElementById('btnShareWhatsApp').addEventListener('click', function () { global.BWRxShared.sharePadWhatsApp(buildPadModel()); });
    document.getElementById('btnCopySummary').addEventListener('click', function () {
      global.BWI18n.copyText(global.BWRxShared.buildPadPlainSummary(buildPadModel()));
    });

    document.getElementById('btnOpenCreateModal').addEventListener('click', function () {
      document.getElementById('modalPatientName').value = document.getElementById('cpPatName').value;
      document.getElementById('modalSerialNumber').value = document.getElementById('cpSerialInput').value;
      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(document.getElementById('createPrescriptionModal')).show();
      }
    });
    document.getElementById('btnConfirmCreatePad').addEventListener('click', saveStudioPrescription);

    global.addEventListener('bwLanguageChanged', function () { document.title = tr('pageTitle'); });
    global.addEventListener('bwMemberChanged', syncMemberFields);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
