/**
 * @file health-reading.js
 * @description Clinical Vitals Entry & Live AHA 2017 / ADA 2024 Analyzer (`health-reading.html`):
 *   - Real-time Blood Pressure classification + spectrum needle + Hypertensive Crisis alert
 *   - Real-time Blood Glucose classification + `mg/dL` <-> `mmol/L` conversion + Hypo alert
 *   - Scoped per Active Member + WhatsApp Clinical Summary Generator
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Live AHA Blood Pressure Evaluator & Submit
 *   3. Live ADA Glucose Evaluator, Unit Switch (`18.0182`) & Submit
 *   4. Recent Active Member Vitals Preview & WhatsApp Share
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'নতুন স্বাস্থ্য রিডিং | ব্রিদওয়েল',
      heroTitle: 'ক্লিনিক্যাল রক্তচাপ ও গ্লুকোজ পরিমাপ',
      heroSub: 'AHA 2017 এবং ADA 2024 মানদণ্ডে তাৎক্ষণিক বিশ্লেষণ এবং সক্রিয় পরিবারের সদস্যের প্রোফাইলে সংরক্ষণ।',
      bpCardTitle: 'রক্তচাপ ও পালস এন্ট্রি (AHA 2017)',
      lblSys: 'সিস্টোলিক (উপরের) mmHg',
      lblDia: 'ডায়াস্টোলিক (নিচের) mmHg',
      lblPulse: 'পালস (BPM)',
      lblArm: 'হাত নির্বাচন',
      armLeft: 'বাম হাত',
      armRight: 'ডান হাত',
      lblNote: 'সংক্ষিপ্ত নোট',
      btnSaveBp: 'রক্তচাপ সংরক্ষণ করুন',
      crisisWarning: 'সতর্কতা: রিডিং ১৮০/১২০ mmHg এর বেশি (হাইপারটেনসিভ ক্রাইসিস)! লক্ষণ থাকলে জরুরি চিকিৎসা নিন।',
      glCardTitle: 'রক্তে শর্করা / গ্লুকোজ (ADA 2024)',
      lblGlValue: 'গ্লুকোজ মাত্রা',
      lblGlContext: 'পরীক্ষার সময়',
      ctxFasting: 'খালি পেটে (Fasting)',
      ctxPostmeal: 'খাবার ২ ঘণ্টা পর',
      ctxRandom: 'যেকোনো সময় (Random)',
      btnSaveGl: 'গ্লুকোজ সংরক্ষণ করুন',
      hypoWarning: 'সতর্কতা: গ্লুকোজ ৭০ mg/dL এর নিচে (হাইপোগ্লাইসেমিয়া)! দ্রুত ১৫ গ্রাম গ্লুকোজ/চিনি গ্রহণ করুন।',
      recentTitle: 'সক্রিয় সদস্যের সর্বশেষ রেকর্ড ও শেয়ার',
      btnWhatsApp: 'হোয়াটসঅ্যাপে রিপোর্ট পাঠান',
      toastBpSaved: 'রক্তচাপের রিডিং সংরক্ষিত হয়েছে!',
      toastGlSaved: 'গ্লুকোজ রিডিং সংরক্ষিত হয়েছে!',
      errInvalidBp: 'সঠিক সিস্টোলিক (৪০-৩০০) ও ডায়াস্টোলিক (২০-২০০) মান লিখুন।',
      errInvalidGl: 'সঠিক গ্লুকোজ মান লিখুন।'
    },
    en: {
      pageTitle: 'Log Vitals Reading | BreatheWell',
      heroTitle: 'Clinical Blood Pressure & Glucose Analyzer',
      heroSub: 'Real-time AHA 2017 & ADA 2024 staging saved directly under your active family member.',
      bpCardTitle: 'Blood Pressure & Pulse (AHA 2017)',
      lblSys: 'Systolic (Upper) mmHg',
      lblDia: 'Diastolic (Lower) mmHg',
      lblPulse: 'Pulse (BPM)',
      lblArm: 'Measured Arm',
      armLeft: 'Left Arm',
      armRight: 'Right Arm',
      lblNote: 'Clinical Note',
      btnSaveBp: 'Save Blood Pressure',
      crisisWarning: 'Alert: Reading exceeds 180/120 mmHg (Hypertensive Crisis)! Seek prompt medical evaluation if symptomatic.',
      glCardTitle: 'Blood Glucose Entry (ADA 2024)',
      lblGlValue: 'Glucose Level',
      lblGlContext: 'Measurement Context',
      ctxFasting: 'Fasting (8h+)',
      ctxPostmeal: '2h Post-Meal',
      ctxRandom: 'Random / Anytime',
      btnSaveGl: 'Save Blood Glucose',
      hypoWarning: 'Alert: Glucose is below 70 mg/dL (Hypoglycemia)! Follow the 15-15 rapid carb rule and recheck.',
      recentTitle: 'Active Member Latest Logs & Clinical Share',
      btnWhatsApp: 'Share via WhatsApp',
      toastBpSaved: 'Blood pressure saved to active member!',
      toastGlSaved: 'Blood glucose saved to active member!',
      errInvalidBp: 'Please enter valid Systolic (40-300) and Diastolic (20-200) values.',
      errInvalidGl: 'Please enter a valid positive glucose value.'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  var glUnit = 'mgdl';

  function refreshBpPreview() {
    var sys = Number(document.getElementById('bpSysInput').value);
    var dia = Number(document.getElementById('bpDiaInput').value);
    var badge = document.getElementById('bpLiveBadge');
    var needle = document.getElementById('bpLiveNeedle');
    var crisisBox = document.getElementById('bpCrisisBox');

    var res = global.BWClinical.classifyBP(sys, dia);
    badge.className = 'bw-status-pill ' + res.badgeClass;
    badge.textContent = sys > 0 && dia > 0 ? tr(res.labelKey) + ' (' + sys + '/' + dia + ')' : '—';
    needle.style.left = res.percent + '%';
    crisisBox.classList.toggle('d-none', !res.isCrisis);
  }

  function getGlucoseMgdlValue() {
    var raw = Number(document.getElementById('glValInput').value);
    if (!isFinite(raw) || raw <= 0) return 0;
    return glUnit === 'mmol' ? global.BWClinical.mmolToMgdl(raw) : Math.round(raw);
  }

  function refreshGlucosePreview() {
    var mgdl = getGlucoseMgdlValue();
    var ctx = document.getElementById('glContextSelect').value;
    var badge = document.getElementById('glLiveBadge');
    var needle = document.getElementById('glLiveNeedle');
    var hypoBox = document.getElementById('glHypoBox');
    var convHint = document.getElementById('glConvHint');

    if (mgdl > 0) {
      var mmol = global.BWClinical.mgdlToMmol(mgdl);
      convHint.textContent = glUnit === 'mgdl' ? ('= ' + mmol + ' mmol/L') : ('= ' + mgdl + ' mg/dL');
    } else {
      convHint.textContent = '';
    }

    var res = global.BWClinical.classifyGlucose(mgdl, ctx);
    badge.className = 'bw-status-pill ' + res.badgeClass;
    badge.textContent = mgdl > 0 ? tr(res.labelKey) + ' (' + mgdl + ' mg/dL)' : '—';
    needle.style.left = res.percent + '%';
    hypoBox.classList.toggle('d-none', !res.isHypo);
  }

  function switchGlucoseUnit(nextUnit) {
    if (glUnit === nextUnit) return;
    var currentVal = Number(document.getElementById('glValInput').value);
    glUnit = nextUnit;
    Array.prototype.forEach.call(document.querySelectorAll('[data-gl-unit]'), function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-gl-unit') === glUnit);
    });
    if (isFinite(currentVal) && currentVal > 0) {
      document.getElementById('glValInput').value =
        glUnit === 'mmol' ? global.BWClinical.mgdlToMmol(currentVal) : global.BWClinical.mmolToMgdl(currentVal);
    }
    refreshGlucosePreview();
  }

  function renderRecentMemberVitals() {
    var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    var box = document.getElementById('hrRecentList');
    var esc = global.BWI18n.escapeHtml;

    var combined = [];
    (vitals.bp || []).slice(0, 4).forEach(function (b) {
      combined.push({ kind: 'BP', val: b.sys + '/' + b.dia + ' mmHg', ts: b.ts, cls: global.BWClinical.classifyBP(b.sys, b.dia) });
    });
    (vitals.glucose || []).slice(0, 4).forEach(function (g) {
      combined.push({ kind: 'Glucose (' + g.context + ')', val: g.valueMgdl + ' mg/dL', ts: g.ts, cls: global.BWClinical.classifyGlucose(g.valueMgdl, g.context) });
    });
    combined.sort(function (a, b) { return String(b.ts).localeCompare(String(a.ts)); });

    if (!combined.length) {
      box.innerHTML = '<p class="text-muted small mb-0">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</p>';
      return;
    }

    box.innerHTML = combined.slice(0, 6).map(function (item) {
      return (
        '<div class="d-flex align-items-center justify-content-between py-2 border-bottom">' +
        '  <div><strong class="small d-block">' + esc(item.kind) + ': ' + esc(item.val) + '</strong><small class="text-muted">' + esc(global.BWI18n.fmtDate(item.ts, true)) + '</small></div>' +
        '  <span class="bw-status-pill ' + esc(item.cls.badgeClass) + '">' + esc(tr(item.cls.labelKey)) + '</span>' +
        '</div>'
      );
    }).join('');
  }

  function shareViaWhatsApp() {
    var active = global.BWStore.getActiveMember();
    var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    var lines = [
      'BreatheWell Family Health Summary',
      'Member: ' + active.name + ' (' + global.BWNav.relationLabel(active.relation) + ')'
    ];
    if (vitals.bp && vitals.bp[0]) {
      lines.push('Latest BP: ' + vitals.bp[0].sys + '/' + vitals.bp[0].dia + ' mmHg (' + String(vitals.bp[0].ts).slice(0, 10) + ')');
    }
    if (vitals.glucose && vitals.glucose[0]) {
      lines.push('Latest Glucose: ' + vitals.glucose[0].valueMgdl + ' mg/dL [' + vitals.glucose[0].context + '] (' + String(vitals.glucose[0].ts).slice(0, 10) + ')');
    }
    global.open('https://wa.me/?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener,noreferrer');
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    ['bpSysInput', 'bpDiaInput'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', refreshBpPreview);
    });
    document.getElementById('glValInput').addEventListener('input', refreshGlucosePreview);
    document.getElementById('glContextSelect').addEventListener('change', refreshGlucosePreview);

    Array.prototype.forEach.call(document.querySelectorAll('[data-gl-unit]'), function (btn) {
      btn.addEventListener('click', function () {
        switchGlucoseUnit(btn.getAttribute('data-gl-unit'));
      });
    });

    document.getElementById('bpForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var sys = Number(document.getElementById('bpSysInput').value);
      var dia = Number(document.getElementById('bpDiaInput').value);
      var pulse = Number(document.getElementById('bpPulseInput').value) || 72;
      if (sys < 40 || sys > 300 || dia < 20 || dia > 200) {
        global.BWI18n.showToast(tr('errInvalidBp'), 'danger');
        return;
      }
      var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
      vitals.bp = vitals.bp || [];
      vitals.bp.unshift({
        id: 'bp_' + Date.now().toString(36),
        sys: sys,
        dia: dia,
        pulse: pulse,
        arm: document.getElementById('bpArmSelect').value,
        note: document.getElementById('bpNoteInput').value.trim(),
        ts: new Date().toISOString()
      });
      global.BWStore.setDomainData('vitals', vitals);
      global.BWI18n.showToast(tr('toastBpSaved'), 'success');
      document.getElementById('bpNoteInput').value = '';
      renderRecentMemberVitals();
    });

    document.getElementById('glForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var mgdl = getGlucoseMgdlValue();
      if (!mgdl || mgdl < 20 || mgdl > 900) {
        global.BWI18n.showToast(tr('errInvalidGl'), 'danger');
        return;
      }
      var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
      vitals.glucose = vitals.glucose || [];
      vitals.glucose.unshift({
        id: 'gl_' + Date.now().toString(36),
        valueMgdl: mgdl,
        context: document.getElementById('glContextSelect').value,
        note: document.getElementById('glNoteInput').value.trim(),
        ts: new Date().toISOString()
      });
      global.BWStore.setDomainData('vitals', vitals);
      global.BWI18n.showToast(tr('toastGlSaved'), 'success');
      document.getElementById('glNoteInput').value = '';
      renderRecentMemberVitals();
    });

    document.getElementById('hrWhatsAppBtn').addEventListener('click', shareViaWhatsApp);

    refreshBpPreview();
    refreshGlucosePreview();
    renderRecentMemberVitals();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      refreshBpPreview();
      refreshGlucosePreview();
      renderRecentMemberVitals();
    });
    global.addEventListener('bwMemberChanged', renderRecentMemberVitals);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
