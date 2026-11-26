/**
 * @file prescriptions-volt.js
 * @description Clinical Prescription Vault & Multi-Pass OCR Studio (`prescriptions-volt.html`):
 *   - Upload Dropzone (Images + PDFs) w/ Rotate, High-Contrast Enhance, Language Select & Re-Scan
 *   - Raw OCR Edit & Re-Parse Modal (`#rxOcrModal`) + 1-Click Sample Scan
 *   - 4 Structured `.cp-card` Entry Sections w/ Selective `.ocr-highlight` Focus
 *   - Storage Gauge Pull-Up Strip & Confirmation Save Modal (`#rxSaveModal`) scoped to Active Member
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Multi-Pass OCR Dropzone, Rotation/Enhance Controls & Selective Focus
 *   3. 4-Card Med Builder & Storage Quota Gauge
 *   4. Save Modal & Active Member Hydration
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'প্রেসক্রিপশন ভল্ট ও OCR স্ক্যানার | ব্রিদওয়েল v3',
      heroTitle: 'প্রেসক্রিপশন ডিজিটাল ভল্ট ও মাল্টি-পাস OCR',
      heroSub: 'প্রেসক্রিপশন ছবি বা PDF স্ক্যান করে স্বয়ংক্রিয়ভাবে তথ্য পূরণ করুন এবং পরিবারের সদস্যের প্রোফাইলে সংরক্ষণ করুন।',
      statTotalRx: 'সংরক্ষিত প্রেসক্রিপশন',
      statStoragePct: 'লোকাল ভল্ট ব্যবহার',
      dropTitle: 'ছবি (JPG/PNG) বা PDF এখানে ড্রপ করুন বা ক্লিক করুন',
      dropSub: '১০০% ব্রাউজার স্ক্যানিং • রোটেট ও কন্ট্রাস্ট সহ',
      btnRerun: 'পুনরায় স্ক্যান',
      btnRawModal: 'র-টেক্সট দেখুন / এডিট',
      btnSample: 'নমুনা স্ক্যান',
      c1Title: '১. ডাক্তার ও হাসপাতাল তথ্য',
      c2Title: '২. রোগী ও ফলো-আপ তারিখ',
      c3Title: '৩. রোগীর ইতিহাস ও ভাইটালস (O/E)',
      c4Title: '৪. রোগ নির্ণয় (Dx), ওষুধ ও পরামর্শ',
      btnAddMed: '+ ওষুধ যোগ করুন',
      btnOpenSave: 'সক্রিয় সদস্যের ভল্টে সংরক্ষণ করুন',
      saveModalTitle: 'প্রেসক্রিপশন সংরক্ষণ নিশ্চিত করুন',
      btnConfirmSave: 'ভল্টে সেভ করুন',
      toastSaved: 'প্রেসক্রিপশন সক্রিয় সদস্যের ভল্টে সংরক্ষিত হয়েছে!',
      errDoctorReq: 'অনুগ্রহ করে ডাক্তারের নাম লিখুন।'
    },
    en: {
      pageTitle: 'Prescription Vault & OCR Scanner | BreatheWell v3',
      heroTitle: 'Clinical Prescription Vault & Multi-Pass OCR',
      heroSub: 'Upload images or PDFs for privacy-first local extraction with selective field focus saved per member.',
      statTotalRx: 'Stored Records',
      statStoragePct: 'Browser Vault Usage',
      dropTitle: 'Drop Prescription Image (JPG/PNG) or PDF here, or Click to Upload',
      dropSub: '100% Local Processing • Rotation, Contrast Enhancement & Raw Text Editor',
      btnRerun: 'Re-Run OCR',
      btnRawModal: 'Inspect / Edit Raw OCR',
      btnSample: 'Sample Scan',
      c1Title: '1. Physician & Hospital Metadata',
      c2Title: '2. Patient & Refill Schedule',
      c3Title: '3. History & Vitals (O/E)',
      c4Title: '4. Diagnosis (Dx), Medications & Advice',
      btnAddMed: '+ Add Medicine',
      btnOpenSave: 'Save to Active Member Vault',
      saveModalTitle: 'Confirm Vault Archive Save',
      btnConfirmSave: 'Save Prescription',
      toastSaved: 'Prescription saved to active member vault!',
      errDoctorReq: 'Please enter the physician name.'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var lastFile = null;
  var attachments = [];
  var medsList = [];
  var ocrRotate = 0;

  function renderStorageGauge() {
    var list = global.BWStore.getDomainData('rx_vault') || [];
    document.getElementById('rxStorageCount').textContent = String(list.length);
    var pct = Math.min(100, Math.round((JSON.stringify(list).length / (500 * 1024)) * 100));
    document.getElementById('rxStoragePct').textContent = pct + '%';
    document.getElementById('rxStorageBar').style.width = Math.max(4, pct) + '%';
  }

  function syncMemberDefaults() {
    var active = global.BWStore.getActiveMember();
    document.getElementById('rxPatientInput').value = active.name || '';
    document.getElementById('rxPatientAgeInput').value = active.age || '';
    document.getElementById('rxPatientSexSelect').value = active.gender || 'other';
    renderStorageGauge();
  }

  function renderPreviewStrip() {
    var strip = document.getElementById('rxPreviewStrip');
    var esc = global.BWI18n.escapeHtml;
    strip.innerHTML = attachments.map(function (src, idx) {
      return (
        '<div class="rx-preview-thumb-box">' +
        '  <img src="' + src + '" alt="Scan attachment ' + (idx + 1) + '">' +
        '  <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 p-1" data-rm-att="' + idx + '" aria-label="Remove"><i class="bi bi-x"></i></button>' +
        '</div>'
      );
    }).join('');
    Array.prototype.forEach.call(strip.querySelectorAll('[data-rm-att]'), function (btn) {
      btn.addEventListener('click', function () {
        attachments.splice(Number(btn.getAttribute('data-rm-att')), 1);
        renderPreviewStrip();
      });
    });
  }

  function renderMedsTable() {
    var tbody = document.getElementById('rxMedsTbody');
    var esc = global.BWI18n.escapeHtml;
    if (!medsList.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted small py-2">No medications added yet.</td></tr>';
      return;
    }
    tbody.innerHTML = medsList.map(function (m, idx) {
      return (
        '<tr>' +
        '  <td><input type="text" class="form-control form-control-sm" value="' + esc(m.form || 'Tab.') + '" data-med-i="' + idx + '" data-med-k="form"></td>' +
        '  <td><input type="text" class="form-control form-control-sm fw-semibold" value="' + esc(m.name) + '" data-med-i="' + idx + '" data-med-k="name"></td>' +
        '  <td><input type="text" class="form-control form-control-sm tabular-nums" value="' + esc(m.dose || '1+0+1') + '" data-med-i="' + idx + '" data-med-k="dose"></td>' +
        '  <td><input type="text" class="form-control form-control-sm" value="' + esc(m.duration || '7 Days') + '" data-med-i="' + idx + '" data-med-k="duration"></td>' +
        '  <td><button type="button" class="btn btn-sm btn-outline-danger" data-del-med="' + idx + '" aria-label="Remove"><i class="bi bi-trash"></i></button></td>' +
        '</tr>'
      );
    }).join('');
  }

  function applyParsedFields(parsed) {
    global.BWRxShared.focusPopulatedFields([
      { id: 'rxDoctorInput', value: parsed.doctor },
      { id: 'rxDegreesInput', value: parsed.degrees },
      { id: 'rxBmdcInput', value: parsed.bmdc },
      { id: 'rxClinicInput', value: parsed.clinic },
      { id: 'rxPhoneInput', value: parsed.phone },
      { id: 'rxDateInput', value: parsed.date },
      { id: 'rxRefillInput', value: parsed.refillDate },
      { id: 'rxOeBpInput', value: parsed.oe && parsed.oe.bp },
      { id: 'rxOePulseInput', value: parsed.oe && parsed.oe.pulse },
      { id: 'rxOeTempInput', value: parsed.oe && parsed.oe.temp },
      { id: 'rxOeWeightInput', value: parsed.oe && parsed.oe.weight },
      { id: 'rxCcInput', value: (parsed.cc || []).join(', ') },
      { id: 'rxHoInput', value: (parsed.ho || []).join(', ') },
      { id: 'rxInvInput', value: (parsed.inv || []).join(', ') },
      { id: 'rxDiagnosisInput', value: parsed.diagnosis },
      { id: 'rxNotesInput', value: parsed.notes }
    ]);

    if (parsed.medications && parsed.medications.length) {
      medsList = parsed.medications.map(function (line) {
        return { form: 'Tab.', name: line, dose: '', duration: '' };
      });
      renderMedsTable();
    }
  }

  function runOcrOnFile(file) {
    if (!file) return;
    lastFile = file;
    var progWrap = document.getElementById('rxProgressWrap');
    var progBar = document.getElementById('rxProgress');
    var statusEl = document.getElementById('rxOcrStatus');
    progWrap.classList.remove('d-none');
    progBar.style.width = '18%';
    statusEl.textContent = 'Scanning ' + file.name + '...';

    global.BWRxShared.scanPrescriptionFile(file, {
      rotate: ocrRotate,
      enhance: document.getElementById('rxEnhanceChk').checked,
      ocrLang: document.getElementById('rxOcrLangSelect').value,
      onProgress: function (p) { progBar.style.width = p + '%'; }
    }).then(function (res) {
      if (res.previewUrl && attachments.indexOf(res.previewUrl) === -1) {
        attachments.push(res.previewUrl);
        renderPreviewStrip();
      }
      document.getElementById('rxRawOcrText').value = res.rawText || '';
      if (res.ocrStatus === 'ok') {
        statusEl.textContent = 'Extracted (' + (res.confidence || 90) + '% confidence). Highlighted fields focused!';
        applyParsedFields(res.parsed);
      } else {
        statusEl.textContent = res.errorDetail || 'Attachment added cleanly. Inspect/edit raw text or fields directly.';
      }
    }).catch(function () {
      statusEl.textContent = 'File read failed; please try a clear JPG/PNG/PDF.';
    });
  }

  function saveVaultEntry() {
    var doctor = document.getElementById('rxDoctorInput').value.trim();
    if (!doctor) { global.BWI18n.showToast(tr('errDoctorReq'), 'danger'); return; }

    var entry = {
      id: 'rx_' + Date.now().toString(36),
      title: document.getElementById('rxSaveFileName').value.trim() || doctor,
      doctor: doctor,
      degrees: document.getElementById('rxDegreesInput').value.trim(),
      bmdc: document.getElementById('rxBmdcInput').value.trim(),
      clinic: document.getElementById('rxClinicInput').value.trim(),
      phone: document.getElementById('rxPhoneInput').value.trim(),
      patientName: document.getElementById('rxPatientInput').value.trim(),
      patientAge: document.getElementById('rxPatientAgeInput').value.trim(),
      patientSex: document.getElementById('rxPatientSexSelect').value,
      urgency: document.getElementById('rxUrgencySelect').value,
      date: document.getElementById('rxDateInput').value,
      refillDate: document.getElementById('rxRefillInput').value,
      cc: document.getElementById('rxCcInput').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      ho: document.getElementById('rxHoInput').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      oe: {
        bp: document.getElementById('rxOeBpInput').value.trim(),
        pulse: document.getElementById('rxOePulseInput').value.trim(),
        temp: document.getElementById('rxOeTempInput').value.trim(),
        weight: document.getElementById('rxOeWeightInput').value.trim()
      },
      inv: document.getElementById('rxInvInput').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      diagnosis: document.getElementById('rxDiagnosisInput').value.trim(),
      medications: medsList.slice(),
      notes: document.getElementById('rxNotesInput').value.trim(),
      files: attachments.slice(),
      source: 'vault',
      createdAt: new Date().toISOString()
    };

    var list = global.BWStore.getDomainData('rx_vault') || [];
    list.unshift(entry);
    global.BWStore.setDomainData('rx_vault', list);

    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(document.getElementById('rxSaveModal')).hide();
    }
    global.BWI18n.showToast(tr('toastSaved'), 'success');
    renderStorageGauge();
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');
    document.getElementById('rxDateInput').value = new Date().toISOString().slice(0, 10);
    syncMemberDefaults();
    renderMedsTable();

    var dz = document.getElementById('rxUploadZone');
    var fi = document.getElementById('rxFileInput');
    dz.addEventListener('click', function () { fi.click(); });
    dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('drag-over'); });
    dz.addEventListener('dragleave', function () { dz.classList.remove('drag-over'); });
    dz.addEventListener('drop', function (e) {
      e.preventDefault();
      dz.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files[0]) runOcrOnFile(e.dataTransfer.files[0]);
    });
    fi.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) runOcrOnFile(e.target.files[0]);
      e.target.value = '';
    });

    document.getElementById('btnRotateLeft').addEventListener('click', function () { ocrRotate = (ocrRotate + 270) % 360; if (lastFile) runOcrOnFile(lastFile); });
    document.getElementById('btnRotateRight').addEventListener('click', function () { ocrRotate = (ocrRotate + 90) % 360; if (lastFile) runOcrOnFile(lastFile); });
    document.getElementById('btnRerunOcr').addEventListener('click', function () { if (lastFile) runOcrOnFile(lastFile); });

    document.getElementById('btnSampleScan').addEventListener('click', function () {
      var sample =
        'Dr. Tahmina Sultana\nMBBS, FCPS (Medicine)\nBMDC Reg: A-39210\nIbn Sina Diagnostic Center\n' +
        'Date: ' + new Date().toISOString().slice(0, 10) + '\nBP: 132/84, Pulse: 78\n' +
        'C/C: Morning Headache, Fatigue\nDx: Stage 1 HTN & Vitamin D Deficiency\n' +
        'Tab. Amlodipine 5mg 1+0+0\nCap. Vitamin D3 2000IU 0+1+0\nFollow-up after 20 days\nAdvice: Limit table salt & walk 30 min daily.';
      document.getElementById('rxRawOcrText').value = sample;
      applyParsedFields(global.BWRxShared.parseRxText(sample));
    });

    document.getElementById('btnReparseOcr').addEventListener('click', function () {
      applyParsedFields(global.BWRxShared.parseRxText(document.getElementById('rxRawOcrText').value));
      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(document.getElementById('rxOcrModal')).hide();
      }
    });
    document.getElementById('btnCopyOcrText').addEventListener('click', function () {
      global.BWI18n.copyText(document.getElementById('rxRawOcrText').value);
    });

    document.getElementById('rxAddMedBtn').addEventListener('click', function () {
      medsList.push({ form: 'Tab.', name: '', dose: '1+0+1', duration: '7 Days' });
      renderMedsTable();
    });

    var tbody = document.getElementById('rxMedsTbody');
    tbody.addEventListener('input', function (ev) {
      var i = ev.target.getAttribute('data-med-i');
      var k = ev.target.getAttribute('data-med-k');
      if (i !== null && medsList[i] && k) medsList[i][k] = ev.target.value;
    });
    tbody.addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('[data-del-med]') : null;
      if (btn) { medsList.splice(Number(btn.getAttribute('data-del-med')), 1); renderMedsTable(); }
    });

    document.getElementById('btnOpenSaveModal').addEventListener('click', function () {
      var doc = document.getElementById('rxDoctorInput').value.trim();
      if (!doc) { global.BWI18n.showToast(tr('errDoctorReq'), 'danger'); return; }
      document.getElementById('modalSummaryDoc').textContent = doc;
      document.getElementById('modalSummaryPatient').textContent = document.getElementById('rxPatientInput').value.trim();
      document.getElementById('rxSaveFileName').value = doc + ' - ' + document.getElementById('rxDateInput').value;
      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(document.getElementById('rxSaveModal')).show();
      }
    });

    document.getElementById('btnConfirmSave').addEventListener('click', saveVaultEntry);

    global.addEventListener('bwLanguageChanged', function () { document.title = tr('pageTitle'); });
    global.addEventListener('bwMemberChanged', syncMemberDefaults);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
