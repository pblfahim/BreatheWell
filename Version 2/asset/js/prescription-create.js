/**
 * @file prescription-create.js
 * @description Dual-Pane Structured Creator Studio & Live WYSIWYG A4 Pad (`prescription-create.html`):
 *   - Patient metadata auto-filled from currently Active Family Member
 *   - Dynamic structured Medications table (`Add Row` / `Remove`)
 *   - Real-time WYSIWYG A4 Preview + Print + WhatsApp Share + Save to Active Member Pad & Vault
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Dynamic Medications Row Editor
 *   3. Real-time A4 WYSIWYG Preview & Active Member Auto-Sync
 *   4. Save, Print & WhatsApp Export
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'প্রেসক্রিপশন রচয়িতা স্টুডিও | ব্রিদওয়েল',
      heroTitle: 'ডিজিটাল প্রেসক্রিপশন রচয়িতা স্টুডিও',
      heroSub: 'বাম দিকে তথ্য পূরণ করুন — ডান দিকে তাৎক্ষণিক A4 প্রিন্ট-রেডি প্রেসক্রিপশন তৈরি হবে (সক্রিয় সদস্যের নামে)।',
      fldDoctorName: 'ডাক্তারের নাম',
      fldDoctorCreds: 'ডিগ্রি / বিশেষজ্ঞতা',
      fldClinic: 'হাসপাতাল / চেম্বার',
      fldPatientName: 'রোগীর নাম (সক্রিয় সদস্য)',
      fldPatientAge: 'বয়স ও লিঙ্গ',
      fldDate: 'তারিখ',
      fldFollowUp: 'পরবর্তী ভিজিট / ফলো-আপ',
      fldDiagnosis: 'রোগ নির্ণয় (Dx)',
      fldMedsHeader: 'ওষুধের তালিকা',
      btnAddMed: '+ ওষুধ যোগ করুন',
      fldAdvice: 'পরামর্শ ও নির্দেশনা',
      btnSavePad: 'ডিজিটাল প্যাডে সংরক্ষণ করুন',
      btnPrintPad: 'A4 প্রিন্ট করুন',
      btnWaPad: 'হোয়াটসঅ্যাপ শেয়ার',
      toastSaved: 'ডিজিটাল প্রেসক্রিপশন সক্রিয় সদস্যের আর্কাইভে সংরক্ষিত হয়েছে!'
    },
    en: {
      pageTitle: 'Prescription Creator Studio | BreatheWell',
      heroTitle: 'Dual-Pane Prescription Creator Studio',
      heroSub: 'Edit structured clinical data on the left to generate a live A4 WYSIWYG clinical sheet scoped to the active member.',
      fldDoctorName: 'Doctor Name',
      fldDoctorCreds: 'Credentials / Specialty',
      fldClinic: 'Clinic / Hospital',
      fldPatientName: 'Patient Name (Active Member)',
      fldPatientAge: 'Age & Sex',
      fldDate: 'Date',
      fldFollowUp: 'Follow-Up Date',
      fldDiagnosis: 'Diagnosis (Dx)',
      fldMedsHeader: 'Medications',
      btnAddMed: '+ Add Medication',
      fldAdvice: 'Clinical Advice & Lifestyle Plan',
      btnSavePad: 'Save to Member Pad Archive',
      btnPrintPad: 'Print A4',
      btnWaPad: 'WhatsApp Share',
      toastSaved: 'Digital prescription saved to active member archive!'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  var meds = [
    { name: 'Tab. Montelukast 10mg', dose: '0 + 0 + 1', duration: '30 Days', note: 'Before sleep' }
  ];

  function collectPadModel() {
    return {
      doctorName: document.getElementById('cpDoctorName').value.trim(),
      doctorCreds: document.getElementById('cpDoctorCreds').value.trim(),
      clinicName: document.getElementById('cpClinicName').value.trim(),
      patientName: document.getElementById('cpPatientName').value.trim(),
      patientAge: document.getElementById('cpPatientAge').value.trim(),
      rxDate: document.getElementById('cpRxDate').value,
      followUp: document.getElementById('cpFollowUp').value,
      diagnosis: document.getElementById('cpDiagnosis').value.trim(),
      advice: document.getElementById('cpAdvice').value.trim(),
      meds: meds.map(function (m) {
        return { name: m.name, dose: m.dose, duration: m.duration, note: m.note };
      })
    };
  }

  function renderPreview() {
    var model = collectPadModel();
    var active = global.BWStore.getActiveMember();
    document.getElementById('cpLivePaperPad').innerHTML = global.BWRxShared.buildPaperPadHtml(model, active);
  }

  function syncMemberFields() {
    var active = global.BWStore.getActiveMember();
    document.getElementById('cpPatientName').value = active.name || '';
    document.getElementById('cpPatientAge').value =
      (active.age ? active.age + ' Yrs / ' : '') + String(active.gender || '').toUpperCase();
    renderPreview();
  }

  function renderMedsEditor() {
    var listEl = document.getElementById('cpMedsList');
    var esc = global.BWI18n.escapeHtml;
    listEl.innerHTML = meds.map(function (m, idx) {
      return (
        '<div class="border rounded-3 p-2 bg-light mb-2" data-med-idx="' + idx + '">' +
        '  <div class="row g-2">' +
        '    <div class="col-md-5"><input type="text" class="form-control form-control-sm" placeholder="Drug name" value="' + esc(m.name) + '" data-med-field="name"></div>' +
        '    <div class="col-md-3"><input type="text" class="form-control form-control-sm" placeholder="1+0+1" value="' + esc(m.dose) + '" data-med-field="dose"></div>' +
        '    <div class="col-md-3"><input type="text" class="form-control form-control-sm" placeholder="15 Days" value="' + esc(m.duration) + '" data-med-field="duration"></div>' +
        '    <div class="col-md-1 d-grid"><button type="button" class="btn btn-sm btn-outline-danger" data-del-med="' + idx + '" aria-label="Remove"><i class="bi bi-x-lg"></i></button></div>' +
        '    <div class="col-12"><input type="text" class="form-control form-control-sm" placeholder="Instruction (After meal...)" value="' + esc(m.note) + '" data-med-field="note"></div>' +
        '  </div>' +
        '</div>'
      );
    }).join('');
  }

  function savePad() {
    var model = collectPadModel();
    var list = global.BWStore.getDomainData('rx_pad') || [];
    model.id = 'pad_' + Date.now().toString(36);
    model.createdAt = new Date().toISOString();
    list.unshift(model);
    global.BWStore.setDomainData('rx_pad', list);
    global.BWI18n.showToast(tr('toastSaved'), 'success');
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');
    document.getElementById('cpRxDate').value = new Date().toISOString().slice(0, 10);

    ['cpDoctorName', 'cpDoctorCreds', 'cpClinicName', 'cpPatientName', 'cpPatientAge', 'cpRxDate', 'cpFollowUp', 'cpDiagnosis', 'cpAdvice']
      .forEach(function (id) {
        document.getElementById(id).addEventListener('input', renderPreview);
      });

    var medsContainer = document.getElementById('cpMedsList');
    medsContainer.addEventListener('input', function (ev) {
      var row = ev.target && ev.target.closest ? ev.target.closest('[data-med-idx]') : null;
      if (!row) return;
      var idx = Number(row.getAttribute('data-med-idx'));
      var field = ev.target.getAttribute('data-med-field');
      if (meds[idx] && field) {
        meds[idx][field] = ev.target.value;
        renderPreview();
      }
    });

    medsContainer.addEventListener('click', function (ev) {
      var delBtn = ev.target && ev.target.closest ? ev.target.closest('[data-del-med]') : null;
      if (!delBtn) return;
      var idx = Number(delBtn.getAttribute('data-del-med'));
      meds.splice(idx, 1);
      renderMedsEditor();
      renderPreview();
    });

    document.getElementById('cpAddMedBtn').addEventListener('click', function () {
      meds.push({ name: '', dose: '1 + 0 + 1', duration: '7 Days', note: '' });
      renderMedsEditor();
      renderPreview();
    });

    document.getElementById('cpSaveBtn').addEventListener('click', savePad);
    document.getElementById('cpPrintBtn').addEventListener('click', function () { global.print(); });
    document.getElementById('cpWaBtn').addEventListener('click', function () {
      global.BWRxShared.sharePadWhatsApp(collectPadModel());
    });

    syncMemberFields();
    renderMedsEditor();
    renderPreview();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
    });
    global.addEventListener('bwMemberChanged', syncMemberFields);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
