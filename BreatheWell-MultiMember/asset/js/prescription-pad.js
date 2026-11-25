/**
 * @file prescription-pad.js
 * @description Direct Interactive Paper Pad (`prescription-pad.html`):
 *   - Direct `contenteditable="true"` WYSIWYG clinical sheet pre-filled for Active Member
 *   - Formatting toolbar + Quick Rx regimen snippet inserters + A4 Print
 *   - Save structured + rich pad record to Active Member's `rx_pad` archive
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Active Member Sheet Auto-Hydration & Template Reset
 *   3. Formatting Controls, Quick Regimen Inserter & Save Handler
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'ডিজিটাল প্রেসক্রিপশন প্যাড | ব্রিদওয়েল',
      heroTitle: 'সরাসরি এডিটেবল ডিজিটাল প্রেসক্রিপশন প্যাড',
      heroSub: 'কাগজের প্যাডের যেকোনো অংশে সরাসরি ক্লিক করে লিখুন, সম্পাদনা করুন এবং A4 প্রিন্ট বা সেভ করুন।',
      btnResetPad: 'টেমপ্লেট রিসেট',
      btnSavePad: 'আর্কাইভে সংরক্ষণ করুন',
      btnPrintPad: 'A4 প্রিন্ট',
      btnWaPad: 'হোয়াটসঅ্যাপ',
      toastSaved: 'ডিজিটাল প্যাড সক্রিয় সদস্যের আর্কাইভে সংরক্ষিত হয়েছে!'
    },
    en: {
      pageTitle: 'Digital WYSIWYG Pad | BreatheWell',
      heroTitle: 'Direct ContentEditable Digital Paper Pad',
      heroSub: 'Click directly inside any field on the paper sheet below to compose, print A4, or archive under the active family member.',
      btnResetPad: 'Reset Sheet',
      btnSavePad: 'Save to Member Archive',
      btnPrintPad: 'Print A4',
      btnWaPad: 'WhatsApp',
      toastSaved: 'Digital pad archived under active family member!'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  function hydrateMemberSheet() {
    var active = global.BWStore.getActiveMember();
    document.getElementById('ppPatientName').textContent = active.name || 'Patient Name';
    document.getElementById('ppPatientAge').textContent =
      (active.age ? active.age + ' Yrs ' : '') + (active.bloodGroup || '');
    document.getElementById('ppDate').textContent = new Date().toISOString().slice(0, 10);
  }

  function insertRxSnippet(snippetText) {
    var body = document.getElementById('ppRxBody');
    var p = document.createElement('div');
    p.className = 'mb-2';
    p.textContent = snippetText;
    body.appendChild(p);
    body.focus();
  }

  function saveDigitalPad() {
    var active = global.BWStore.getActiveMember();
    var bodyLines = (document.getElementById('ppRxBody').innerText || '')
      .split('\n').map(function (s) { return s.trim(); }).filter(Boolean);

    var entry = {
      id: 'pad_' + Date.now().toString(36),
      doctorName: document.getElementById('ppDoctorName').innerText.trim(),
      doctorCreds: document.getElementById('ppDoctorCreds').innerText.trim(),
      clinicName: document.getElementById('ppClinicName').innerText.trim(),
      patientName: document.getElementById('ppPatientName').innerText.trim() || active.name,
      patientAge: document.getElementById('ppPatientAge').innerText.trim(),
      rxDate: document.getElementById('ppDate').innerText.trim(),
      diagnosis: document.getElementById('ppDiagnosis').innerText.trim(),
      advice: document.getElementById('ppAdvice').innerText.trim(),
      meds: bodyLines.map(function (line) {
        return { name: line, dose: '', duration: '', note: '' };
      }),
      createdAt: new Date().toISOString()
    };

    var list = global.BWStore.getDomainData('rx_pad') || [];
    list.unshift(entry);
    global.BWStore.setDomainData('rx_pad', list);
    global.BWI18n.showToast(tr('toastSaved'), 'success');
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');
    hydrateMemberSheet();

    Array.prototype.forEach.call(document.querySelectorAll('[data-snippet]'), function (btn) {
      btn.addEventListener('click', function () {
        insertRxSnippet(btn.getAttribute('data-snippet'));
      });
    });

    document.getElementById('ppResetBtn').addEventListener('click', function () {
      hydrateMemberSheet();
      document.getElementById('ppDiagnosis').textContent = 'General Checkup / Routine Care';
      document.getElementById('ppRxBody').innerHTML =
        '<div class="mb-2">1. Tab. Paracetamol 500mg — 1 + 0 + 1 (After meal, 5 days)</div>';
      document.getElementById('ppAdvice').textContent = 'Hydration & 5 min daily Box breathing.';
    });

    document.getElementById('ppSaveBtn').addEventListener('click', saveDigitalPad);
    document.getElementById('ppPrintBtn').addEventListener('click', function () { global.print(); });
    document.getElementById('ppWaBtn').addEventListener('click', function () {
      global.BWRxShared.sharePadWhatsApp({
        doctorName: document.getElementById('ppDoctorName').innerText.trim(),
        patientName: document.getElementById('ppPatientName').innerText.trim(),
        rxDate: document.getElementById('ppDate').innerText.trim(),
        diagnosis: document.getElementById('ppDiagnosis').innerText.trim(),
        meds: (document.getElementById('ppRxBody').innerText || '').split('\n').filter(Boolean),
        advice: document.getElementById('ppAdvice').innerText.trim()
      });
    });

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
    });
    global.addEventListener('bwMemberChanged', hydrateMemberSheet);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
