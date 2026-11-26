/**
 * @file prescription-pad.js
 * @description Direct ContentEditable WYSIWYG A4 Clinical Pad (`prescription-pad.html`):
 *   - BreatheWell Watermark + All Metadata Directly Editable Inline
 *   - `#padSerialNo` Fixed from V1 + Dynamic `+ Add C/C`, `+ Add H/O`, `+ Add Inv`
 *   - 6 V1 Quick Med Pills + Editable Medicine Rows w/ Form `<select>`
 *   - Scoped Doctor Signature Image Upload (`BWStore` `'signature'` domain)
 *   - Print A4, WhatsApp Share, Copy Plain Text & Dual Save (`rx_pad` + `rx_vault`)
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Member Sheet Hydration, Dynamic Clinical Bullets & Signature Sync
 *   3. Quick Med Pills & Save Confirmation Modal
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'ডিরেক্ট ডিজিটাল প্যাড | ব্রিদওয়েল v3',
      heroTitle: 'সরাসরি এডিটেবল A4 ক্লিনিক্যাল প্যাড',
      heroSub: 'কাগজের যেকোনো অংশে ক্লিক করে লিখুন, ডাক্তারের স্বাক্ষর আপলোড করুন এবং সদস্যের প্রোফাইলে সংরক্ষণ করুন।',
      btnReset: 'রিসেট',
      btnPrint: 'প্রিন্ট A4',
      btnWa: 'হোয়াটসঅ্যাপ',
      btnSave: 'সংরক্ষণ করুন',
      toastSaved: 'ডিজিটাল প্যাড সক্রিয় সদস্যের ইতিহাসে সংরক্ষিত হয়েছে!'
    },
    en: {
      pageTitle: 'Direct Digital Pad | BreatheWell v3',
      heroTitle: 'Direct ContentEditable Clinical A4 Pad',
      heroSub: 'Edit any paper zone directly, attach physician signature per member & print clean A4 or save to archive.',
      btnReset: 'Reset Sheet',
      btnPrint: 'Print A4',
      btnWa: 'WhatsApp',
      btnSave: 'Save Digital Pad',
      toastSaved: 'Digital pad archived under active family member!'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  function hydrateMemberAndSig() {
    var active = global.BWStore.getActiveMember();
    document.getElementById('padPatName').textContent = active.name || 'Patient Name';
    document.getElementById('padAge').textContent = active.age ? active.age + ' Yrs' : '—';
    document.getElementById('padSex').textContent = String(active.gender || '—');
    document.getElementById('padDate').textContent = new Date().toISOString().slice(0, 10);
    if (!document.getElementById('padSerialNo').textContent.trim()) {
      document.getElementById('padSerialNo').textContent = 'BW-' + Math.floor(1000 + Math.random() * 8999);
    }

    var sigUrl = global.BWStore.getDomainData('signature', active.id) || '';
    var sigImg = document.getElementById('ppSigImg');
    var sigWrap = document.getElementById('ppSigPreviewWrap');
    var sigZone = document.getElementById('ppSigUploadZone');
    if (sigUrl) {
      sigImg.src = sigUrl;
      sigWrap.classList.remove('d-none');
      sigZone.classList.add('d-none');
    } else {
      sigWrap.classList.add('d-none');
      sigZone.classList.remove('d-none');
    }
  }

  function appendEditableBullet(listId, placeholderText) {
    var ul = document.getElementById(listId);
    var li = document.createElement('li');
    li.className = 'd-flex justify-content-between align-items-center gap-1 mb-1';
    li.innerHTML = '<span contenteditable="true" class="flex-grow-1">' + global.BWI18n.escapeHtml(placeholderText) + '</span>' +
      '<button type="button" class="btn btn-sm p-0 text-danger border-0 no-print" aria-label="Remove item">&times;</button>';
    li.querySelector('button').addEventListener('click', function () { li.remove(); });
    ul.appendChild(li);
    li.querySelector('span').focus();
  }

  function appendMedRow(form, name, dose, duration) {
    var container = document.getElementById('ppMedsContainer');
    var row = document.createElement('div');
    row.className = 'd-flex flex-wrap align-items-center gap-2 border-bottom pb-2 mb-2 pp-med-row';
    var esc = global.BWI18n.escapeHtml;
    row.innerHTML =
      '<select class="form-select form-select-sm w-auto no-print">' +
      ['Tab.', 'Cap.', 'Syr.', 'Inj.', 'Drop', 'Inhaler', 'Oint.'].map(function (f) {
        return '<option' + (f === form ? ' selected' : '') + '>' + f + '</option>';
      }).join('') +
      '</select>' +
      '<span contenteditable="true" class="fw-semibold flex-grow-1 pp-med-name">' + esc(name) + '</span>' +
      '<span contenteditable="true" class="small text-muted tabular-nums pp-med-dose">' + esc(dose) + '</span>' +
      '<span contenteditable="true" class="small text-muted pp-med-dur">' + esc(duration) + '</span>' +
      '<button type="button" class="btn btn-sm btn-outline-danger no-print" aria-label="Remove">&times;</button>';
    row.querySelector('button').addEventListener('click', function () { row.remove(); });
    container.appendChild(row);
  }

  function extractPadModel() {
    function listTexts(id) {
      return Array.prototype.map.call(document.querySelectorAll('#' + id + ' li span'), function (s) {
        return s.textContent.trim();
      }).filter(Boolean);
    }
    var meds = Array.prototype.map.call(document.querySelectorAll('.pp-med-row'), function (row) {
      return {
        form: row.querySelector('select') ? row.querySelector('select').value : 'Tab.',
        name: row.querySelector('.pp-med-name').textContent.trim(),
        dose: row.querySelector('.pp-med-dose').textContent.trim(),
        duration: row.querySelector('.pp-med-dur').textContent.trim()
      };
    });

    return {
      serialNo: document.getElementById('padSerialNo').textContent.trim(),
      source: 'pad',
      doctorName: document.getElementById('padDocName').textContent.trim(),
      doctorCreds: document.getElementById('padDocDegrees').textContent.trim(),
      bmdc: document.getElementById('padDocReg').textContent.trim(),
      clinicName: document.getElementById('padHospName').textContent.trim(),
      clinicAddr: document.getElementById('padHospAddress').textContent.trim(),
      patientName: document.getElementById('padPatName').textContent.trim(),
      patientAge: document.getElementById('padAge').textContent.trim(),
      patientSex: document.getElementById('padSex').textContent.trim(),
      rxDate: document.getElementById('padDate').textContent.trim(),
      cc: listTexts('padCcList'),
      ho: listTexts('padHoList'),
      inv: listTexts('padInvList'),
      oe: {
        bp: document.getElementById('padBpVal').textContent.trim(),
        pulse: document.getElementById('padPulseVal').textContent.trim(),
        temp: document.getElementById('padTempVal').textContent.trim(),
        weight: document.getElementById('padWeightVal').textContent.trim()
      },
      diagnosis: document.getElementById('padDxVal').textContent.trim(),
      meds: meds,
      advice: document.getElementById('padAdviceText').textContent.trim()
    };
  }

  function confirmSavePad() {
    var entry = extractPadModel();
    entry.id = 'pad_' + Date.now().toString(36);
    entry.patientName = document.getElementById('modalPatientName').value.trim() || entry.patientName;
    entry.serialNo = document.getElementById('modalSerialNumber').value.trim() || entry.serialNo;
    entry.createdAt = new Date().toISOString();

    var pads = global.BWStore.getDomainData('rx_pad') || [];
    pads.unshift(entry);
    global.BWStore.setDomainData('rx_pad', pads);

    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(document.getElementById('createPrescriptionModal')).hide();
    }
    global.BWI18n.showToast(tr('toastSaved'), 'success');
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');
    hydrateMemberAndSig();

    /* Initial default med row */
    appendMedRow('Tab.', 'Montelukast 10mg', '0 + 0 + 1', '30 Days');

    document.getElementById('btnAddCC').addEventListener('click', function () { appendEditableBullet('padCcList', 'New complaint'); });
    document.getElementById('btnAddHO').addEventListener('click', function () { appendEditableBullet('padHoList', 'Medical history note'); });
    document.getElementById('btnAddInv').addEventListener('click', function () { appendEditableBullet('padInvList', 'CBC / Chest X-Ray'); });
    document.getElementById('btnAddMedicine').addEventListener('click', function () { appendMedRow('Tab.', 'Medicine Name', '1 + 0 + 1', '7 Days'); });

    Array.prototype.forEach.call(document.querySelectorAll('[data-pp-quick]'), function (btn) {
      btn.addEventListener('click', function () {
        var p = btn.getAttribute('data-pp-quick').split('|');
        appendMedRow(p[0], p[1], p[2], p[3]);
      });
    });

    /* Scoped Member Doctor Signature Upload */
    var sigZone = document.getElementById('ppSigUploadZone');
    var sigInput = document.getElementById('ppSigFileInput');
    sigZone.addEventListener('click', function () { sigInput.click(); });
    sigInput.addEventListener('change', function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        global.BWStore.setDomainData('signature', String(reader.result || ''));
        hydrateMemberAndSig();
      };
      reader.readAsDataURL(f);
      ev.target.value = '';
    });
    document.getElementById('btnRemoveSig').addEventListener('click', function () {
      global.BWStore.setDomainData('signature', '');
      hydrateMemberAndSig();
    });

    document.getElementById('btnClearPad').addEventListener('click', function () {
      document.getElementById('ppMedsContainer').innerHTML = '';
      appendMedRow('Tab.', 'Paracetamol 500mg', '1 + 0 + 1', '5 Days');
      hydrateMemberAndSig();
    });
    document.getElementById('btnPrintPad').addEventListener('click', function () { global.print(); });
    document.getElementById('btnShareWhatsApp').addEventListener('click', function () { global.BWRxShared.sharePadWhatsApp(extractPadModel()); });
    document.getElementById('btnCopySummary').addEventListener('click', function () {
      global.BWI18n.copyText(global.BWRxShared.buildPadPlainSummary(extractPadModel()));
    });

    document.getElementById('btnOpenCreateModal').addEventListener('click', function () {
      var m = extractPadModel();
      document.getElementById('modalPatientName').value = m.patientName;
      document.getElementById('modalSerialNumber').value = m.serialNo;
      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(document.getElementById('createPrescriptionModal')).show();
      }
    });
    document.getElementById('btnConfirmCreatePad').addEventListener('click', confirmSavePad);

    global.addEventListener('bwLanguageChanged', function () { document.title = tr('pageTitle'); });
    global.addEventListener('bwMemberChanged', hydrateMemberAndSig);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
