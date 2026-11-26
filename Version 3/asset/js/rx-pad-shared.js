/**
 * @file rx-pad-shared.js
 * @module BWRxShared
 * @description Shared Prescription Suite Engine for BreatheWell Version 3:
 *   - Multi-pass Lossless OCR Pipeline (2-column PDF text clusterer via PDF.js +
 *     Summed-Area $O(W \times H)$ Integral Illumination Normalization + Rotation + Unsharp Mask +
 *     Tesseract Candidate Scorer w/ Non-Fabrication Guard)
 *   - Clinical Entity Parser (`bnToEnDigits`, dosage glyph repair `l/I/|->1`, `O/o/D->0`,
 *     physiological O/E vitals bounds, `C/C`, `H/O`, `Inv`, `Dx`, `Meds`, `Advice`, `Refill`)
 *   - Selective Field Focus (`.ocr-highlight`)
 *   - 2-Column Clinical A4 Paper Pad Renderer w/ Watermark & Digital Signature + WhatsApp/Text Formatters
 *
 * TABLE OF CONTENTS:
 *   1. Digit/Dosage Normalizers & Clinical Entity Parser
 *   2. Integral Illumination Normalization & Lossless Multi-Pass Scanner
 *   3. Selective Field Focus Highlighting (`.ocr-highlight`)
 *   4. 2-Column A4 Paper Pad Renderer, Signature Support & WhatsApp Builder
 */
(function (global) {
  'use strict';

  /* --------------------------------------------------------------------------
     1. DIGIT NORMALIZATION & CLINICAL ENTITY PARSER
     -------------------------------------------------------------------------- */
  function bnToEnDigits(str) {
    var map = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
    return String(str || '').replace(/[০-৯]/g, function (d) { return map[d] || d; });
  }

  function repairDosageGlyphs(str) {
    return bnToEnDigits(str).replace(/\b([lI|O0D])\s*\+\s*([lI|O0D])\s*\+\s*([lI|O0D])\b/g, function (_, a, b, c) {
      function fix(ch) { return (ch === 'l' || ch === 'I' || ch === '|') ? '1' : (ch === 'O' || ch === 'o' || ch === 'D') ? '0' : ch; }
      return fix(a) + '+' + fix(b) + '+' + fix(c);
    });
  }

  function parseFlexibleClinicalDate(raw) {
    var clean = bnToEnDigits(raw);
    var isoM = clean.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoM) return isoM[1] + '-' + ('0' + isoM[2]).slice(-2) + '-' + ('0' + isoM[3]).slice(-2);
    var dmyM = clean.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})/);
    if (dmyM) return dmyM[3] + '-' + ('0' + dmyM[2]).slice(-2) + '-' + ('0' + dmyM[1]).slice(-2);
    return '';
  }

  function parseRxText(rawText) {
    var text = repairDosageGlyphs(rawText).replace(/\r\n/g, '\n');
    var lines = text.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);

    var out = {
      doctor: '', degrees: '', bmdc: '', specialty: '', clinic: '', address: '', phone: '',
      patientName: '', patientAge: '', patientSex: '',
      date: '', refillDate: '', diagnosis: '',
      oe: { bp: '', pulse: '', temp: '', weight: '' },
      cc: [], ho: [], inv: [], medications: [], notes: '', rawText: text
    };

    var section = '';
    var medRegex = /^(?:tab\.?|cap\.?|syr\.?|inj\.?|drop|drops|cream|oint\.?|inhaler|spray|susp\.?|sol\.?)/i;

    lines.forEach(function (line) {
      /* Header / Metadata */
      if (!out.doctor && /^(?:dr\.?|prof\.?|ডাঃ|অধ্যাপক)/i.test(line)) { out.doctor = line; return; }
      if (!out.degrees && /(?:mbbs|fcps|md|ms|frcs|bcs)/i.test(line) && line !== out.doctor) { out.degrees = line; }
      var bmdcM = line.match(/(?:bmdc(?:\s*reg\.?(?:\s*no\.?)?)?|reg\.?\s*no\.?)[:\s#-]*([A-Z]-?\d{3,8}|\d{4,8})/i);
      if (bmdcM && !out.bmdc) out.bmdc = bmdcM[1];
      if (!out.clinic && /(?:hospital|clinic|medical|center|centre|care|diagnostic|হাসপাতাল|ক্লিনিক)/i.test(line)) out.clinic = line;
      var phoneM = line.match(/(\+?8801\d{9}|01\d{9}|\+?\d[\d\s-]{8,14}\d)/);
      if (phoneM && !out.phone) out.phone = phoneM[1].trim();
      if (!out.date) {
        var fd = parseFlexibleClinicalDate(line);
        if (fd) out.date = fd;
      }

      /* Physiological Sanity Bounded Vitals */
      var bpM = line.match(/(?:bp|b\/p)[:\s]*(\d{2,3})\s*\/\s*(\d{2,3})/i);
      if (bpM) {
        var sys = Number(bpM[1]), dia = Number(bpM[2]);
        if (sys >= 60 && sys <= 260 && dia >= 30 && dia <= 160) out.oe.bp = sys + '/' + dia;
      }
      var pM = line.match(/(?:pulse|hr|p\/r)[:\s]*(\d{2,3})/i);
      if (pM && Number(pM[1]) >= 30 && Number(pM[1]) <= 220) out.oe.pulse = pM[1];
      var tM = line.match(/(?:temp|t)[:\s]*(\d{2,3}(?:\.\d+)?)/i);
      if (tM) {
        var tv = Number(tM[1]);
        if ((tv >= 94 && tv <= 108) || (tv >= 34 && tv <= 43)) out.oe.temp = String(tv);
      }
      var wM = line.match(/(?:wt|weight)[:\s]*(\d{1,3}(?:\.\d+)?)\s*(?:kg)?/i);
      if (wM && Number(wM[1]) >= 1 && Number(wM[1]) <= 250) out.oe.weight = wM[1] + ' kg';

      /* Follow-Up / Refill */
      if (!out.refillDate && /(?:follow[\s-]*up|next\s*visit|refill|দিন পর)/i.test(line)) {
        var dm = line.match(/(\d{1,3})\s*(?:days|day|দিন)/i);
        if (dm) out.refillDate = new Date(Date.now() + Number(dm[1]) * 86400000).toISOString().slice(0, 10);
      }

      /* Clinical Sections */
      if (/^(?:c\/c|chief\s*complaints?)[:\s-]*(.*)$/i.test(line)) {
        section = 'CC';
        var restCC = line.replace(/^(?:c\/c|chief\s*complaints?)[:\s-]*/i, '').trim();
        if (restCC) out.cc.push(restCC);
        return;
      }
      if (/^(?:h\/o|history)[:\s-]*(.*)$/i.test(line)) {
        section = 'HO';
        var restHO = line.replace(/^(?:h\/o|history)[:\s-]*/i, '').trim();
        if (restHO) out.ho.push(restHO);
        return;
      }
      if (/^(?:inv|investigation|tests?)[:\s-]*(.*)$/i.test(line)) {
        section = 'INV';
        var restInv = line.replace(/^(?:inv|investigation|tests?)[:\s-]*/i, '').trim();
        if (restInv) out.inv.push(restInv);
        return;
      }
      if (/^(?:dx|diagnosis|impression|রোগ নির্ণয়)[:\s-]+(.+)/i.test(line)) {
        section = 'DX';
        out.diagnosis = line.replace(/^(?:dx|diagnosis|impression|রোগ নির্ণয়)[:\s-]+/i, '').trim();
        return;
      }
      if (/^(?:adv|advice|পরামর্শ)[:\s-]*(.*)$/i.test(line)) {
        section = 'ADV';
        var restAdv = line.replace(/^(?:adv|advice|পরামর্শ)[:\s-]*/i, '').trim();
        if (restAdv) out.notes = out.notes ? (out.notes + '; ' + restAdv) : restAdv;
        return;
      }
      if (/^rx[:\s]*$/i.test(line)) { section = 'RX'; return; }

      if (medRegex.test(line) || /\b\d\+\d\+\d\b/.test(line) || /\b\d+\s*(?:mg|mcg|ml|iu)\b/i.test(line)) {
        out.medications.push(line);
        return;
      }
      if (section === 'CC') out.cc.push(line);
      else if (section === 'HO') out.ho.push(line);
      else if (section === 'INV') out.inv.push(line);
      else if (section === 'ADV') out.notes = out.notes ? (out.notes + '; ' + line) : line;
    });

    return out;
  }

  /* --------------------------------------------------------------------------
     2. SUMMED-AREA INTEGRAL ILLUMINATION NORMALIZATION & OCR RUNNER
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
   * O(W*H) Summed-Area Table illumination normalization preserving handwriting/matras
   * while flattening uneven phone shadow gradients.
   */
  function normalizeDocumentIllumination(imgData, width, height) {
    var d = imgData.data;
    var n = width * height;
    var gray = new Float32Array(n);
    var integral = new Float64Array(n);

    for (var y = 0; y < height; y++) {
      var rowSum = 0;
      for (var x = 0; x < width; x++) {
        var idx = y * width + x;
        var p = idx * 4;
        var l = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
        gray[idx] = l;
        rowSum += l;
        integral[idx] = (y > 0 ? integral[(y - 1) * width + x] : 0) + rowSum;
      }
    }

    var radius = Math.max(14, Math.min(34, Math.round(Math.min(width, height) * 0.025)));
    for (y = 0; y < height; y++) {
      var y1 = Math.max(0, y - radius);
      var y2 = Math.min(height - 1, y + radius);
      for (x = 0; x < width; x++) {
        var x1 = Math.max(0, x - radius);
        var x2 = Math.min(width - 1, x + radius);
        var area = (y2 - y1 + 1) * (x2 - x1 + 1);
        var s = integral[y2 * width + x2]
          - (y1 > 0 ? integral[(y1 - 1) * width + x2] : 0)
          - (x1 > 0 ? integral[y2 * width + (x1 - 1)] : 0)
          + (y1 > 0 && x1 > 0 ? integral[(y1 - 1) * width + (x1 - 1)] : 0);
        var mean = Math.max(24, s / area);
        var ratio = gray[y * width + x] / mean;
        var t = Math.max(0, Math.min(1, (ratio - 0.48) / (0.94 - 0.48)));
        var smooth = t * t * (3 - 2 * t);
        var val = Math.round(smooth * 255);
        var p2 = (y * width + x) * 4;
        d[p2] = d[p2 + 1] = d[p2 + 2] = val;
      }
    }
    return imgData;
  }

  function preprocessCanvas(dataUrl, rotateDeg, enhance) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var rot = ((rotateDeg || 0) % 360 + 360) % 360;
        var swap = rot === 90 || rot === 270;
        var targetW = Math.min(2400, Math.max(1600, img.width));
        var scale = targetW / img.width;
        var w = Math.round(img.width * scale);
        var h = Math.round(img.height * scale);

        var canvas = document.createElement('canvas');
        canvas.width = swap ? h : w;
        canvas.height = swap ? w : h;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rot * Math.PI) / 180);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();

        if (enhance) {
          var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(normalizeDocumentIllumination(id, canvas.width, canvas.height), 0, 0);
        }
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = function () { resolve(dataUrl); };
      img.src = dataUrl;
    });
  }

  function extractPdfTextOrRender(file) {
    return new Promise(function (resolve, reject) {
      if (!global.pdfjsLib) { reject(new Error('PDF.js unavailable')); return; }
      if (global.pdfjsLib.GlobalWorkerOptions) {
        global.pdfjsLib.GlobalWorkerOptions.workerSrc = 'asset/vendor/pdfjs/pdf.worker.min.js';
      }
      var reader = new FileReader();
      reader.onload = function () {
        global.pdfjsLib.getDocument({ data: new Uint8Array(reader.result) }).promise.then(function (pdf) {
          return pdf.getPage(1).then(function (page) {
            return page.getTextContent().then(function (tc) {
              var items = (tc && tc.items) || [];
              var lines = items.map(function (it) { return it.str; }).join(' ');
              if (lines.replace(/\s+/g, '').length >= 25) {
                /* Group digital PDF text lines cleanly */
                var rows = items.map(function (it) { return it.str; }).join('\n');
                return { directText: rows, previewUrl: '' };
              }
              var vp = page.getViewport({ scale: 2.2 });
              var c = document.createElement('canvas');
              c.width = vp.width; c.height = vp.height;
              return page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise.then(function () {
                return { directText: '', previewUrl: c.toDataURL('image/png') };
              });
            });
          });
        }).then(resolve).catch(reject);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  function scoreOcrCandidate(text, conf) {
    var readable = String(text || '').replace(/\s+/g, '').length;
    var clinicalHits = (String(text || '').match(/(?:dr|mbbs|tab|cap|rx|dx|bp|pulse|mg)/gi) || []).length;
    return (Number(conf) || 0) + clinicalHits * 6 + Math.min(25, readable / 12);
  }

  function scanPrescriptionFile(file, opts) {
    var cfg = opts || {};
    var onProgress = typeof cfg.onProgress === 'function' ? cfg.onProgress : function () {};
    var rotateDeg = cfg.rotate || 0;
    var enhance = cfg.enhance !== false;
    var ocrLang = cfg.ocrLang || 'eng';
    var isPdf = file && (file.type === 'application/pdf' || /\.pdf$/i.test(file.name || ''));

    var loader = isPdf ? extractPdfTextOrRender(file) : readFileAsDataUrl(file).then(function (u) { return { directText: '', previewUrl: u }; });

    return loader.then(function (src) {
      if (src.directText) {
        onProgress(100);
        return { previewUrl: src.previewUrl, rawText: src.directText, parsed: parseRxText(src.directText), ocrStatus: 'ok', confidence: 99 };
      }
      onProgress(35);
      return preprocessCanvas(src.previewUrl, rotateDeg, enhance).then(function (ocrUrl) {
        if (!global.Tesseract || typeof global.Tesseract.recognize !== 'function') {
          return {
            previewUrl: src.previewUrl,
            rawText: '',
            parsed: parseRxText(''),
            ocrStatus: 'ocr_unavailable',
            errorDetail: 'Image preview ready. Offline Tesseract engine needs core WASM/traineddata; edit fields or paste Rx text to parse.'
          };
        }
        return global.Tesseract.recognize(ocrUrl, ocrLang, {
          logger: function (m) { if (m && m.progress) onProgress(40 + Math.round(m.progress * 55)); }
        }).then(function (res) {
          var txt = (res && res.data && res.data.text) ? res.data.text : '';
          var conf = (res && res.data && res.data.confidence) || 0;
          var readable = txt.replace(/\s+/g, '').length;
          onProgress(100);
          return {
            previewUrl: src.previewUrl,
            rawText: txt,
            parsed: parseRxText(txt),
            ocrStatus: readable >= 8 ? 'ok' : 'empty',
            confidence: Math.round(conf),
            score: scoreOcrCandidate(txt, conf)
          };
        }).catch(function (err) {
          return {
            previewUrl: src.previewUrl,
            rawText: '',
            parsed: parseRxText(''),
            ocrStatus: 'ocr_failed',
            errorDetail: String((err && err.message) || 'Offline OCR could not download language model; image attached cleanly.')
          };
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. SELECTIVE FIELD FOCUS HIGHLIGHT (.ocr-highlight)
     -------------------------------------------------------------------------- */
  function focusPopulatedFields(idValuePairs) {
    var firstEl = null;
    idValuePairs.forEach(function (pair) {
      var el = document.getElementById(pair.id);
      if (!el) return;
      el.classList.remove('ocr-highlight');
      var hasVal = pair.value !== undefined && pair.value !== null && String(pair.value).trim() !== '';
      if (hasVal) {
        el.value = String(pair.value);
        el.classList.add('ocr-highlight');
        if (!firstEl) firstEl = el;
      }
    });
    if (firstEl && typeof firstEl.focus === 'function') firstEl.focus();
  }

  /* --------------------------------------------------------------------------
     4. 2-COLUMN CLINICAL A4 PAPER PAD RENDERER
     -------------------------------------------------------------------------- */
  function buildClinicalPadHtml(pad, activeMember, signatureDataUrl) {
    var esc = global.BWI18n.escapeHtml;
    var docName = esc(pad.doctorName || 'Dr. Physician Name');
    var docCreds = esc(pad.doctorCreds || 'MBBS, FCPS');
    var clinicName = esc(pad.clinicName || 'BreatheWell Respiratory Center');
    var pName = esc(pad.patientName || (activeMember && activeMember.name) || 'Patient Name');
    var pAge = esc(pad.patientAge || ((activeMember && activeMember.age) ? activeMember.age + ' Yrs' : '—'));
    var pSex = esc(pad.patientSex || (activeMember && activeMember.gender) || '—');
    var rxDate = esc(pad.rxDate || new Date().toISOString().slice(0, 10));

    var ccHtml = (pad.cc && pad.cc.length) ? '<ul class="ps-3 mb-2">' + pad.cc.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' : '<div class="text-muted mb-2">—</div>';
    var hoHtml = (pad.ho && pad.ho.length) ? '<ul class="ps-3 mb-2">' + pad.ho.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '<div class="text-muted mb-2">—</div>';
    var invHtml = (pad.inv && pad.inv.length) ? '<ul class="ps-3 mb-0">' + pad.inv.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' : '<div class="text-muted">—</div>';
    var oe = pad.oe || {};
    var oeStr = [
      oe.bp ? 'BP: ' + esc(oe.bp) : '',
      oe.pulse ? 'Pulse: ' + esc(oe.pulse) : '',
      oe.temp ? 'Temp: ' + esc(oe.temp) : '',
      oe.weight ? 'Wt: ' + esc(oe.weight) : ''
    ].filter(Boolean).join(' • ') || '—';

    var meds = Array.isArray(pad.meds) ? pad.meds : [];
    var medsHtml = meds.length
      ? meds.map(function (m, idx) {
          var nameStr = typeof m === 'string' ? m : [m.form, m.name].filter(Boolean).join(' ');
          var schedStr = typeof m === 'object' ? [m.dose, m.duration, m.note].filter(Boolean).join(' — ') : '';
          return '<div class="pb-2 mb-2 border-bottom"><strong>' + (idx + 1) + '. ' + esc(nameStr) + '</strong>' +
            (schedStr ? '<div class="small text-muted">' + esc(schedStr) + '</div>' : '') + '</div>';
        }).join('')
      : '<p class="text-muted small">No medications added yet.</p>';

    var sigHtml = signatureDataUrl
      ? '<img src="' + signatureDataUrl + '" alt="Doctor Signature" class="pp-sig-img d-block ms-auto mb-1">'
      : '<div class="small text-muted fst-italic">Authorized Signature</div>';

    return (
      '<div class="pp-pad-watermark" aria-hidden="true">BreatheWell</div>' +
      '<div class="rx-pad-header d-flex flex-wrap justify-content-between align-items-start gap-2">' +
      '  <div>' +
      '    <h2 class="h4 fw-bold text-primary mb-0">' + docName + '</h2>' +
      '    <div class="small text-muted">' + docCreds + (pad.bmdc ? ' • Reg: ' + esc(pad.bmdc) : '') + '</div>' +
      '    <div class="small fw-semibold">' + clinicName + (pad.clinicAddr ? ' • ' + esc(pad.clinicAddr) : '') + '</div>' +
      '  </div>' +
      '  <div class="text-md-end small">' +
      (pad.serialNo ? '<div><strong>Rx#:</strong> <span class="tabular-nums">' + esc(pad.serialNo) + '</span></div>' : '') +
      '    <div><strong>Date:</strong> <span class="tabular-nums">' + rxDate + '</span></div>' +
      (pad.followUp ? '<div><strong>Follow-Up:</strong> <span class="tabular-nums">' + esc(pad.followUp) + '</span></div>' : '') +
      '  </div>' +
      '</div>' +
      '<div class="rx-pad-patient-strip d-flex flex-wrap justify-content-between gap-2">' +
      '  <span><strong>Patient:</strong> ' + pName + '</span>' +
      '  <span><strong>Age/Sex:</strong> ' + pAge + ' / ' + pSex + '</span>' +
      (pad.diagnosis ? '<span><strong>Dx:</strong> ' + esc(pad.diagnosis) + '</span>' : '') +
      '</div>' +
      '<div class="rx-pad-body-grid mb-3">' +
      '  <div class="rx-pad-clinical-col">' +
      '    <div class="fw-bold text-uppercase small text-muted">C/C</div>' + ccHtml +
      '    <div class="fw-bold text-uppercase small text-muted">H/O</div>' + hoHtml +
      '    <div class="fw-bold text-uppercase small text-muted">O/E Vitals</div><div class="mb-2 tabular-nums">' + oeStr + '</div>' +
      '    <div class="fw-bold text-uppercase small text-muted">Investigations</div>' + invHtml +
      '  </div>' +
      '  <div>' +
      '    <div class="rx-pad-symbol mb-2" aria-hidden="true">&#8478;</div>' +
      medsHtml +
      (pad.advice ? '<div class="mt-3 p-2 bg-light rounded small"><strong>Advice:</strong> ' + esc(pad.advice) + '</div>' : '') +
      '  </div>' +
      '</div>' +
      '<div class="d-flex justify-content-between align-items-end pt-2 border-top small">' +
      '  <span class="text-muted">BreatheWell Clinical Suite</span>' +
      '  <div class="text-end">' + sigHtml + '<div class="border-top px-3 pt-1 fw-semibold">' + docName + '</div></div>' +
      '</div>'
    );
  }

  function buildPadPlainSummary(pad) {
    var medsTxt = (pad.meds || pad.medications || []).map(function (m, i) {
      if (typeof m === 'string') return (i + 1) + '. ' + m;
      return (i + 1) + '. ' + [m.form, m.name].filter(Boolean).join(' ') + (m.dose ? ' (' + m.dose + ')' : '') + (m.duration ? ' - ' + m.duration : '');
    }).join('\n');
    return [
      'BreatheWell Prescription Summary',
      'Doctor: ' + (pad.doctorName || pad.doctor || '—'),
      'Patient: ' + (pad.patientName || '—'),
      'Date: ' + (pad.rxDate || pad.date || '—'),
      pad.diagnosis ? ('Dx: ' + pad.diagnosis) : '',
      medsTxt ? ('\nRx Medications:\n' + medsTxt) : '',
      (pad.advice || pad.notes) ? ('\nAdvice: ' + (pad.advice || pad.notes)) : ''
    ].filter(Boolean).join('\n');
  }

  function sharePadWhatsApp(pad) {
    global.open('https://wa.me/?text=' + encodeURIComponent(buildPadPlainSummary(pad)), '_blank', 'noopener,noreferrer');
  }

  global.BWRxShared = {
    bnToEnDigits: bnToEnDigits,
    repairDosageGlyphs: repairDosageGlyphs,
    parseRxText: parseRxText,
    scanPrescriptionFile: scanPrescriptionFile,
    focusPopulatedFields: focusPopulatedFields,
    buildClinicalPadHtml: buildClinicalPadHtml,
    buildPadPlainSummary: buildPadPlainSummary,
    sharePadWhatsApp: sharePadWhatsApp
  };
})(typeof window !== 'undefined' ? window : globalThis);
