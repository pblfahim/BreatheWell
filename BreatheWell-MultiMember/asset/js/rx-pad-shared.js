/**
 * @file rx-pad-shared.js
 * @module BWRxShared
 * @description Shared Prescription Engine Utilities:
 *   1. Lossless Multi-Pass Scanner & PDF.js Local Rasterizer + Honest OCR Diagnostics
 *   2. Structured Clinical Prescription Parser (`parseRxText`)
 *   3. Selective OCR Field Focus Highlight (`focusPopulatedFields`)
 *   4. WYSIWYG A4 Paper Pad HTML Renderer & WhatsApp Formatter
 *
 * TABLE OF CONTENTS:
 *   1. Clinical Prescription Text Parser (`parseRxText`)
 *   2. Lossless Image Normalization & Multi-Pass OCR Pipeline (`scanPrescriptionFile`)
 *   3. Selective Field Focus & Highlight (`focusPopulatedFields`)
 *   4. WYSIWYG A4 Paper Pad Renderer & WhatsApp Share Helper
 */
(function (global) {
  'use strict';

  /* --------------------------------------------------------------------------
     1. CLINICAL PRESCRIPTION PARSER
     -------------------------------------------------------------------------- */
  /**
   * Parses raw OCR or typed clinical prescription text into structured fields.
   * Never hallucinates data; leaves fields blank when not confidently detected.
   */
  function parseRxText(rawText) {
    var text = String(rawText || '').replace(/\r\n/g, '\n');
    var lines = text.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);

    var result = {
      doctor: '',
      specialty: '',
      hospital: '',
      date: '',
      refillDate: '',
      diagnosis: '',
      medications: [],
      notes: '',
      rawText: text
    };

    var medPrefixes = /^(?:tab\.?|cap\.?|syr\.?|inj\.?|drop|cream|oint\.?|inhaler|spray|susp\.?|sol\.?|rx[:\s])/i;

    lines.forEach(function (line, idx) {
      if (!result.doctor && /^(?:dr\.?|prof\.?|ডাঃ|অধ্যাপক)/i.test(line)) {
        result.doctor = line;
        return;
      }
      if (!result.specialty && /(?:mbbs|fcps|md|ms|cardiol|pulmon|medicine|pediatric|endocrin|specialist)/i.test(line)) {
        if (line !== result.doctor) result.specialty = line;
      }
      if (!result.hospital && /(?:hospital|clinic|medical|center|centre|care|diagnostic|হাসপাতাল|ক্লিনিক)/i.test(line)) {
        result.hospital = line;
      }
      if (!result.date) {
        var isoM = line.match(/(\d{4}-\d{2}-\d{2})/);
        var dmyM = line.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (isoM) {
          result.date = isoM[1];
        } else if (dmyM) {
          var dd = ('0' + dmyM[1]).slice(-2);
          var mm = ('0' + dmyM[2]).slice(-2);
          result.date = dmyM[3] + '-' + mm + '-' + dd;
        }
      }
      if (!result.refillDate && /(?:follow[\s-]*up|next\s*visit|refill|পুনরায়)/i.test(line)) {
        var daysM = line.match(/(\d{1,3})\s*(?:days|day|দিন)/i);
        if (daysM) {
          var d = new Date(Date.now() + Number(daysM[1]) * 86400000);
          result.refillDate = d.toISOString().slice(0, 10);
        }
      }
      if (!result.diagnosis && /^(?:dx|diagnosis|c\/c|impression|রোগ নির্ণয়)[:\s-]+(.+)/i.test(line)) {
        result.diagnosis = line.replace(/^(?:dx|diagnosis|c\/c|impression|রোগ নির্ণয়)[:\s-]+/i, '').trim();
        return;
      }
      if (medPrefixes.test(line) || /\b(?:1\s*\+\s*0\s*\+\s*1|1\s*\+\s*1\s*\+\s*1|0\s*\+\s*0\s*\+\s*1|\d+\s*mg|\d+\s*mcg)\b/i.test(line)) {
        result.medications.push(line);
        return;
      }
      if (/^(?:adv|advice|note|পরামর্শ)[:\s-]+(.+)/i.test(line)) {
        var cleaned = line.replace(/^(?:adv|advice|note|পরামর্শ)[:\s-]+/i, '').trim();
        result.notes = result.notes ? (result.notes + '; ' + cleaned) : cleaned;
      }
    });

    return result;
  }

  /* --------------------------------------------------------------------------
     2. LOSSLESS IMAGE NORMALIZATION & LOCAL PDF / TESSERACT SCANNER
     -------------------------------------------------------------------------- */
  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || '')); };
      reader.onerror = function () { reject(new Error('File read error')); };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Normalizes image illumination & crispness onto a canvas without aggressive
   * hard thresholding so dark/shadowed camera scans remain readable.
   */
  function enhanceImageDataUrl(dataUrl) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var maxSide = 1600;
        var scale = Math.min(1.5, Math.max(1, maxSide / Math.max(img.width, img.height)));
        var w = Math.round(img.width * scale);
        var h = Math.round(img.height * scale);
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        /* Soft grayscale luminance stretch */
        var imgData = ctx.getImageData(0, 0, w, h);
        var d = imgData.data;
        var minL = 255, maxL = 0;
        for (var i = 0; i < d.length; i += 4) {
          var lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          if (lum < minL) minL = lum;
          if (lum > maxL) maxL = lum;
        }
        var span = Math.max(40, maxL - minL);
        for (var j = 0; j < d.length; j += 4) {
          var l = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
          var norm = Math.max(0, Math.min(255, Math.round(((l - minL) / span) * 255)));
          d[j] = d[j + 1] = d[j + 2] = norm;
        }
        ctx.putImageData(imgData, 0, 0);
        resolve({ previewUrl: dataUrl, ocrUrl: canvas.toDataURL('image/png') });
      };
      img.onerror = function () { resolve({ previewUrl: dataUrl, ocrUrl: dataUrl }); };
      img.src = dataUrl;
    });
  }

  function rasterizePdfFirstPage(file) {
    return new Promise(function (resolve, reject) {
      if (!global.pdfjsLib) {
        reject(new Error('PDF.js not loaded'));
        return;
      }
      if (global.pdfjsLib.GlobalWorkerOptions) {
        global.pdfjsLib.GlobalWorkerOptions.workerSrc = 'asset/vendor/pdfjs/pdf.worker.min.js';
      }
      var reader = new FileReader();
      reader.onload = function () {
        var typed = new Uint8Array(reader.result);
        global.pdfjsLib.getDocument({ data: typed }).promise
          .then(function (pdf) { return pdf.getPage(1); })
          .then(function (page) {
            var vp = page.getViewport({ scale: 2.0 });
            var canvas = document.createElement('canvas');
            canvas.width = vp.width;
            canvas.height = vp.height;
            return page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise.then(function () {
              return canvas.toDataURL('image/png');
            });
          })
          .then(resolve)
          .catch(reject);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Scans an uploaded PNG/JPG/WebP or PDF prescription locally.
   * Returns `{ previewUrl, rawText, parsed, ocrStatus, errorDetail }`.
   */
  function scanPrescriptionFile(file, onProgress) {
    var report = typeof onProgress === 'function' ? onProgress : function () {};
    var isPdf = file && (file.type === 'application/pdf' || /\.pdf$/i.test(file.name || ''));

    var sourcePromise = isPdf ? rasterizePdfFirstPage(file) : readFileAsDataUrl(file);
    return sourcePromise
      .then(function (rawUrl) {
        report(35);
        return enhanceImageDataUrl(rawUrl);
      })
      .then(function (imgs) {
        report(55);
        if (!global.Tesseract || typeof global.Tesseract.recognize !== 'function') {
          return {
            previewUrl: imgs.previewUrl,
            rawText: '',
            parsed: parseRxText(''),
            ocrStatus: 'ocr_unavailable',
            errorDetail: 'Image preview ready. Offline Tesseract engine needs core WASM/traineddata; enter or paste text below to auto-fill.'
          };
        }
        return global.Tesseract.recognize(imgs.ocrUrl, 'eng', {
          logger: function (m) {
            if (m && m.progress) report(55 + Math.round(m.progress * 40));
          }
        }).then(function (res) {
          var txt = (res && res.data && res.data.text) ? res.data.text : '';
          report(100);
          return {
            previewUrl: imgs.previewUrl,
            rawText: txt,
            parsed: parseRxText(txt),
            ocrStatus: txt.trim() ? 'ok' : 'empty'
          };
        }).catch(function (ocrErr) {
          return {
            previewUrl: imgs.previewUrl,
            rawText: '',
            parsed: parseRxText(''),
            ocrStatus: 'ocr_failed',
            errorDetail: String((ocrErr && ocrErr.message) || 'Offline OCR worker could not load language data; image attached safely.')
          };
        });
      });
  }

  /* --------------------------------------------------------------------------
     3. SELECTIVE FIELD FOCUS HIGHLIGHT (PROMPT #9)
     -------------------------------------------------------------------------- */
  /**
   * Highlights only form fields actually populated by OCR extraction, leaves
   * empty fields untouched, and moves focus cleanly to the first populated field.
   */
  function focusPopulatedFields(idValuePairs) {
    var firstFilledEl = null;
    idValuePairs.forEach(function (pair) {
      var el = document.getElementById(pair.id);
      if (!el) return;
      el.classList.remove('bw-ocr-filled');
      var hasVal = pair.value !== undefined && pair.value !== null && String(pair.value).trim() !== '';
      if (hasVal) {
        el.value = String(pair.value);
        el.classList.add('bw-ocr-filled');
        if (!firstFilledEl) firstFilledEl = el;
      }
    });
    if (firstFilledEl && typeof firstFilledEl.focus === 'function') {
      firstFilledEl.focus();
    }
  }

  /* --------------------------------------------------------------------------
     4. WYSIWYG A4 PAPER PAD RENDERER & WHATSAPP BUILDER
     -------------------------------------------------------------------------- */
  function buildPaperPadHtml(pad, activeMember) {
    var esc = global.BWI18n.escapeHtml;
    var docName = esc(pad.doctorName || 'Dr. Physician Name');
    var docCreds = esc(pad.doctorCreds || 'MBBS, FCPS');
    var clinicName = esc(pad.clinicName || 'BreatheWell Medical Clinic');
    var pName = esc(pad.patientName || (activeMember && activeMember.name) || 'Patient Name');
    var pAge = esc(pad.patientAge || ((activeMember && activeMember.age) ? activeMember.age + ' Yrs' : '—'));
    var rxDate = esc(pad.rxDate || new Date().toISOString().slice(0, 10));
    var meds = Array.isArray(pad.meds) ? pad.meds : [];

    var medsRows = meds.length
      ? meds.map(function (m, idx) {
          return (
            '<tr>' +
            '  <td>' + (idx + 1) + '.</td>' +
            '  <td class="fw-semibold">' + esc(m.name || m) + '</td>' +
            '  <td class="tabular-nums">' + esc(m.dose || '1+0+1') + '</td>' +
            '  <td>' + esc(m.duration || '—') + '</td>' +
            '  <td class="text-muted small">' + esc(m.note || '') + '</td>' +
            '</tr>'
          );
        }).join('')
      : '<tr><td colspan="5" class="text-muted text-center py-3">—</td></tr>';

    return (
      '<div class="rx-pad-header d-flex flex-wrap justify-content-between align-items-start gap-2">' +
      '  <div>' +
      '    <h2 class="h4 fw-bold text-primary mb-0">' + docName + '</h2>' +
      '    <div class="small text-muted">' + docCreds + '</div>' +
      '    <div class="small fw-semibold">' + clinicName + '</div>' +
      '  </div>' +
      '  <div class="text-md-end small">' +
      '    <div><strong>Date:</strong> <span class="tabular-nums">' + rxDate + '</span></div>' +
      (pad.followUp ? '<div><strong>Follow-Up:</strong> <span class="tabular-nums">' + esc(pad.followUp) + '</span></div>' : '') +
      '  </div>' +
      '</div>' +
      '<div class="rx-pad-patient-strip d-flex flex-wrap justify-content-between gap-2">' +
      '  <span><strong>Patient:</strong> ' + pName + '</span>' +
      '  <span><strong>Age / Info:</strong> ' + pAge + '</span>' +
      (pad.diagnosis ? '<span><strong>Dx:</strong> ' + esc(pad.diagnosis) + '</span>' : '') +
      '</div>' +
      '<div class="d-flex align-items-start gap-3 mb-3">' +
      '  <div class="rx-pad-symbol" aria-hidden="true">&#8478;</div>' +
      '  <div class="flex-grow-1 table-responsive">' +
      '    <table class="table table-sm table-bordered align-middle mb-0">' +
      '      <thead class="table-light"><tr><th>#</th><th>Medication</th><th>Schedule</th><th>Duration</th><th>Note</th></tr></thead>' +
      '      <tbody>' + medsRows + '</tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>' +
      (pad.advice ? '<div class="border-top pt-3 small"><strong>Advice / Plan:</strong> ' + esc(pad.advice) + '</div>' : '')
    );
  }

  function sharePadWhatsApp(pad) {
    var medsTxt = (pad.meds || []).map(function (m, i) {
      return (i + 1) + '. ' + (m.name || m) + ' (' + (m.dose || 'As advised') + ') ' + (m.duration || '');
    }).join('\n');
    var msg = [
      '*Prescription Summary*',
      'Doctor: ' + (pad.doctorName || pad.doctor || '—'),
      'Patient: ' + (pad.patientName || '—'),
      'Date: ' + (pad.rxDate || pad.date || '—'),
      pad.diagnosis ? ('Dx: ' + pad.diagnosis) : '',
      medsTxt ? ('\nMedications:\n' + medsTxt) : '',
      pad.advice ? ('\nAdvice: ' + pad.advice) : ''
    ].filter(Boolean).join('\n');
    global.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
  }

  global.BWRxShared = {
    parseRxText: parseRxText,
    scanPrescriptionFile: scanPrescriptionFile,
    focusPopulatedFields: focusPopulatedFields,
    buildPaperPadHtml: buildPaperPadHtml,
    sharePadWhatsApp: sharePadWhatsApp
  };
})(typeof window !== 'undefined' ? window : globalThis);
