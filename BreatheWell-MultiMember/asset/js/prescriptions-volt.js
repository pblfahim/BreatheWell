/**
 * @file prescriptions-volt.js
 * @description Clinical Prescription Vault & Lossless OCR Scanner (`prescriptions-volt.html`):
 *   - Drag/drop & file picker upload (PNG, JPG, WebP, PDF) with illumination normalization
 *   - Multi-pass Tesseract + PDF.js rasterizer + manual raw-text re-parse fallback
 *   - Selective Field Focus highlighting populated fields after scanning
 *   - Refill Countdown Alert Banner, Vault Gallery & Fullscreen Lightbox scoped per Member
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. OCR Dropzone, File Scan & Selective Field Focus
 *   3. Vault Save, Render, Refill Alerts & Lightbox Preview
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'প্রেসক্রিপশন ভল্ট ও স্ক্যানার | ব্রিদওয়েল',
      heroTitle: 'প্রেসক্রিপশন ডিজিটাল ভল্ট ও OCR স্ক্যানার',
      heroSub: 'প্রেসক্রিপশন ছবি বা PDF স্ক্যান করে স্বয়ংক্রিয়ভাবে তথ্য পূরণ করুন এবং পরিবারের সদস্যের নামে সুরক্ষিত রাখুন।',
      statTotalRx: 'মোট প্রেসক্রিপশন',
      statDueSoon: 'শীঘ্রই রিফিল (≤৭ দিন)',
      dropTitle: 'প্রেসক্রিপশন ছবি (JPG/PNG) বা PDF এখানে ড্রপ করুন বা ক্লিক করুন',
      dropSub: '১০০% লোকাল ব্রাউজার স্ক্যানিং • স্ক্যান করা ফিল্ডগুলোতে সবুজ ফোকাস দেখাবে',
      btnSampleScan: 'নমুনা স্ক্যান লোড করুন',
      btnParseRaw: 'টেক্সট থেকে পুনরায় বিশ্লেষণ করুন',
      lblRawText: 'স্ক্যানকৃত বা পেস্ট করা টেক্সট (ঐচ্ছিক)',
      fldDoctor: 'ডাক্তারের নাম *',
      fldSpecialty: 'বিশেষজ্ঞতা',
      fldHospital: 'হাসপাতাল / চেম্বার',
      fldDate: 'তারিখ',
      fldRefill: 'রিফিল / ফলো-আপ তারিখ',
      fldDiagnosis: 'রোগ নির্ণয় (Diagnosis)',
      fldMeds: 'ওষুধের তালিকা (প্রতি লাইনে একটি)',
      fldNotes: 'পরামর্শ / নোট',
      btnSaveVault: 'সক্রিয় সদস্যের ভল্টে সংরক্ষণ করুন',
      galleryTitle: 'সংরক্ষিত প্রেসক্রিপশন ভল্ট',
      filterAll: 'সকল',
      filterDue: 'রিফিল বাকি',
      dueBadge: 'রিফিল বাকি:',
      daysText: 'দিন',
      toastVaultSaved: 'প্রেসক্রিপশন ভল্টে সংরক্ষিত হয়েছে!',
      toastVaultDeleted: 'প্রেসক্রিপশন মুছে ফেলা হয়েছে।',
      errDoctorReq: 'অনুগ্রহ করে ডাক্তারের নাম লিখুন।'
    },
    en: {
      pageTitle: 'Prescription Vault & OCR Scanner | BreatheWell',
      heroTitle: 'Prescription Vault & Lossless OCR Scanner',
      heroSub: 'Upload prescription images or PDFs for privacy-first local extraction with selective field focus, saved per family member.',
      statTotalRx: 'Stored Prescriptions',
      statDueSoon: 'Refills Due (≤7 Days)',
      dropTitle: 'Drop Prescription Image (JPG/PNG) or PDF here, or Click to Upload',
      dropSub: '100% Local Processing • Automatically focuses populated fields after scan',
      btnSampleScan: 'Load Sample Scan',
      btnParseRaw: 'Re-Parse Text',
      lblRawText: 'Extracted / Pasted Raw Rx Text',
      fldDoctor: 'Physician Name *',
      fldSpecialty: 'Specialty',
      fldHospital: 'Clinic / Hospital',
      fldDate: 'Rx Date',
      fldRefill: 'Refill / Follow-Up Date',
      fldDiagnosis: 'Diagnosis (Dx)',
      fldMeds: 'Medications (one per line)',
      fldNotes: 'Clinical Notes',
      btnSaveVault: 'Save to Active Member Vault',
      galleryTitle: 'Active Member Vault Gallery',
      filterAll: 'All Records',
      filterDue: 'Due Soon',
      dueBadge: 'Due in',
      daysText: 'days',
      toastVaultSaved: 'Prescription saved to active member vault!',
      toastVaultDeleted: 'Prescription removed from vault.',
      errDoctorReq: 'Please enter the physician name before saving.'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  var pendingImageUrl = '';
  var currentFilter = 'all';

  function applyParsedToForm(parsed) {
    global.BWRxShared.focusPopulatedFields([
      { id: 'rxDoctorInput', value: parsed.doctor },
      { id: 'rxSpecialtyInput', value: parsed.specialty },
      { id: 'rxHospitalInput', value: parsed.hospital },
      { id: 'rxDateInput', value: parsed.date },
      { id: 'rxRefillInput', value: parsed.refillDate },
      { id: 'rxDiagnosisInput', value: parsed.diagnosis },
      { id: 'rxMedsInput', value: (parsed.medications || []).join('\n') },
      { id: 'rxNotesInput', value: parsed.notes }
    ]);
  }

  function handleUploadedFile(file) {
    if (!file) return;
    var progWrap = document.getElementById('rxOcrProgressWrap');
    var progBar = document.getElementById('rxOcrProgressBar');
    var statusMsg = document.getElementById('rxOcrStatus');
    progWrap.classList.remove('d-none');
    progBar.style.width = '15%';
    statusMsg.textContent = 'Processing ' + file.name + '...';

    global.BWRxShared.scanPrescriptionFile(file, function (pct) {
      progBar.style.width = pct + '%';
    }).then(function (res) {
      pendingImageUrl = res.previewUrl || '';
      var thumbWrap = document.getElementById('rxUploadPreviewWrap');
      var thumbImg = document.getElementById('rxUploadPreviewImg');
      if (pendingImageUrl) {
        thumbImg.src = pendingImageUrl;
        thumbWrap.classList.remove('d-none');
      }
      document.getElementById('rxRawTextInput').value = res.rawText || '';
      if (res.ocrStatus === 'ok') {
        statusMsg.textContent = 'OCR extracted cleanly. Populated fields highlighted!';
        applyParsedToForm(res.parsed);
      } else {
        statusMsg.textContent = res.errorDetail || 'Preview attached cleanly. Fill or paste Rx text to parse.';
      }
    }).catch(function () {
      statusMsg.textContent = 'Could not read image/PDF file; please try a clear JPG/PNG.';
    });
  }

  function renderVaultGallery() {
    var list = global.BWStore.getDomainData('rx_vault') || [];
    var dueSoonCount = 0;
    list.forEach(function (item) {
      var days = global.BWI18n.daysRemaining(item.refillDate);
      if (days !== null && days <= 7) dueSoonCount++;
    });

    document.getElementById('rxStatTotal').textContent = String(list.length);
    document.getElementById('rxStatDue').textContent = String(dueSoonCount);

    var filtered = list.filter(function (item) {
      if (currentFilter === 'due') {
        var d = global.BWI18n.daysRemaining(item.refillDate);
        return d !== null && d <= 7;
      }
      return true;
    });

    var grid = document.getElementById('rxVaultGrid');
    var esc = global.BWI18n.escapeHtml;
    if (!filtered.length) {
      grid.innerHTML = '<div class="col-12"><div class="bw-card p-4 text-center text-muted">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</div></div>';
      return;
    }

    grid.innerHTML = filtered.map(function (rx) {
      var days = global.BWI18n.daysRemaining(rx.refillDate);
      var refillBadge = '';
      if (days !== null) {
        var bCls = days <= 3 ? 'bw-status-danger' : days <= 7 ? 'bw-status-elevated' : 'bw-status-normal';
        refillBadge = '<span class="bw-status-pill ' + bCls + '">' + esc(tr('dueBadge')) + ' ' + days + ' ' + esc(tr('daysText')) + '</span>';
      }
      var medsList = (rx.medications || []).map(function (m) {
        return '<li class="small">' + esc(m) + '</li>';
      }).join('');

      return (
        '<div class="col-md-6 col-xl-4">' +
        '  <article class="rx-vault-card">' +
        '    <div>' +
        '      <div class="d-flex justify-content-between align-items-start gap-2 mb-2">' +
        '        <div><h3 class="h6 fw-bold mb-0">' + esc(rx.doctor) + '</h3><small class="text-muted">' + esc(rx.specialty || rx.hospital || '') + '</small></div>' +
        '        <small class="text-muted tabular-nums">' + esc(rx.date || '') + '</small>' +
        '      </div>' +
        (rx.imageDataUrl ? '<img src="' + rx.imageDataUrl + '" alt="Rx Scan" class="rx-thumb-img mb-2" data-lightbox-img="' + esc(rx.doctor) + '">' : '') +
        (rx.diagnosis ? '<p class="small fw-semibold text-primary mb-2">' + esc(rx.diagnosis) + '</p>' : '') +
        (medsList ? '<ul class="ps-3 mb-2">' + medsList + '</ul>' : '') +
        (rx.notes ? '<p class="small text-muted mb-2">' + esc(rx.notes) + '</p>' : '') +
        '    </div>' +
        '    <div class="d-flex align-items-center justify-content-between gap-2 pt-2 border-top">' +
        '      <div>' + refillBadge + '</div>' +
        '      <div class="d-flex gap-1">' +
        '        <button type="button" class="btn btn-sm btn-outline-success" data-wa-rx="' + esc(rx.id) + '" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></button>' +
        '        <button type="button" class="btn btn-sm btn-outline-danger" data-del-rx="' + esc(rx.id) + '" aria-label="Delete"><i class="bi bi-trash"></i></button>' +
        '      </div>' +
        '    </div>' +
        '  </article>' +
        '</div>'
      );
    }).join('');

    Array.prototype.forEach.call(grid.querySelectorAll('[data-lightbox-img]'), function (img) {
      img.addEventListener('click', function () {
        document.getElementById('rxLightboxImg').src = img.src;
        var modalEl = document.getElementById('rxLightboxModal');
        if (global.bootstrap && global.bootstrap.Modal) {
          global.bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
      });
    });

    Array.prototype.forEach.call(grid.querySelectorAll('[data-del-rx]'), function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-del-rx');
        var next = (global.BWStore.getDomainData('rx_vault') || []).filter(function (x) { return x.id !== id; });
        global.BWStore.setDomainData('rx_vault', next);
        global.BWI18n.showToast(tr('toastVaultDeleted'), 'warning');
        renderVaultGallery();
      });
    });

    Array.prototype.forEach.call(grid.querySelectorAll('[data-wa-rx]'), function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-wa-rx');
        var found = list.filter(function (x) { return x.id === id; })[0];
        if (found) {
          var active = global.BWStore.getActiveMember();
          global.BWRxShared.sharePadWhatsApp({
            doctorName: found.doctor,
            patientName: active.name,
            rxDate: found.date,
            diagnosis: found.diagnosis,
            meds: (found.medications || []).map(function (m) { return { name: m, dose: '', duration: '' }; }),
            advice: found.notes
          });
        }
      });
    });
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');
    document.getElementById('rxDateInput').value = new Date().toISOString().slice(0, 10);

    var dropzone = document.getElementById('rxDropzone');
    var fileInput = document.getElementById('rxFileInput');
    dropzone.addEventListener('click', function () { fileInput.click(); });
    dropzone.addEventListener('dragover', function (e) { e.preventDefault(); dropzone.classList.add('drag-over'); });
    dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('drag-over'); });
    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUploadedFile(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) handleUploadedFile(e.target.files[0]);
      e.target.value = '';
    });

    document.getElementById('rxLoadSampleBtn').addEventListener('click', function () {
      var sample =
        'Dr. Tahmina Sultana\nMBBS, FCPS (Medicine)\nIbn Sina Diagnostic Center\n' +
        'Date: ' + new Date().toISOString().slice(0, 10) + '\n' +
        'Dx: Essential Hypertension & Vitamin D3 Deficiency\n' +
        'Tab. Amlodipine 5mg (1+0+0) - 30 days\n' +
        'Cap. Cholecalciferol 2000IU (0+1+0) - 60 days\n' +
        'Follow-up after 25 days\n' +
        'Advice: Restrict extra table salt and walk 30 mins daily.';
      document.getElementById('rxRawTextInput').value = sample;
      applyParsedToForm(global.BWRxShared.parseRxText(sample));
    });

    document.getElementById('rxReparseBtn').addEventListener('click', function () {
      var raw = document.getElementById('rxRawTextInput').value;
      applyParsedToForm(global.BWRxShared.parseRxText(raw));
    });

    document.getElementById('rxVaultForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var doctor = document.getElementById('rxDoctorInput').value.trim();
      if (!doctor) {
        global.BWI18n.showToast(tr('errDoctorReq'), 'danger');
        return;
      }
      var medsRaw = document.getElementById('rxMedsInput').value.trim();
      var medsArr = medsRaw ? medsRaw.split('\n').map(function (x) { return x.trim(); }).filter(Boolean) : [];

      var list = global.BWStore.getDomainData('rx_vault') || [];
      list.unshift({
        id: 'rx_' + Date.now().toString(36),
        doctor: doctor,
        specialty: document.getElementById('rxSpecialtyInput').value.trim(),
        hospital: document.getElementById('rxHospitalInput').value.trim(),
        date: document.getElementById('rxDateInput').value,
        refillDate: document.getElementById('rxRefillInput').value,
        diagnosis: document.getElementById('rxDiagnosisInput').value.trim(),
        medications: medsArr,
        notes: document.getElementById('rxNotesInput').value.trim(),
        imageDataUrl: pendingImageUrl,
        source: pendingImageUrl ? 'ocr' : 'manual',
        createdAt: new Date().toISOString()
      });
      global.BWStore.setDomainData('rx_vault', list);
      pendingImageUrl = '';
      document.getElementById('rxUploadPreviewWrap').classList.add('d-none');
      ev.target.reset();
      document.getElementById('rxDateInput').value = new Date().toISOString().slice(0, 10);
      Array.prototype.forEach.call(document.querySelectorAll('.bw-ocr-filled'), function (el) { el.classList.remove('bw-ocr-filled'); });
      global.BWI18n.showToast(tr('toastVaultSaved'), 'success');
      renderVaultGallery();
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-rx-filter]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-rx-filter]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-rx-filter') || 'all';
        renderVaultGallery();
      });
    });

    renderVaultGallery();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderVaultGallery();
    });
    global.addEventListener('bwMemberChanged', renderVaultGallery);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
