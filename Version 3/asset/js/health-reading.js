/**
 * @file health-reading.js
 * @description Clinical Blood Pressure & Glucose Analyzer (`health-reading.html`):
 *   - Form Mode Switcher (`Both`, `BP Only`, `Glucose Only`) — fixed from V1!
 *   - 5-Stop BP Track & 5 Clickable Clinical Presets + Age-Adjusted Reference Benchmarks
 *   - 4-Stop Glucose Track & 4 Presets + Timing Cards (`Fasting`, `Postmeal`, `Random`) +
 *     Live `mmol/L <-> mg/dL` Conversion
 *   - Urgent Hypertensive Crisis / Severe Hypo Alert Banner (`#crisisAlertBanner`)
 *   - Live WhatsApp Preview Card (`#waPreviewText`) + Member-Scoped Persistence
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Live AHA BP Evaluator, Age Benchmarks & 5 Presets
 *   3. Live ADA Glucose Evaluator, Timing Cards & Unit Toggle (`18.0182`)
 *   4. Live WhatsApp Clinical Summary Preview & Member Save Handlers
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'নতুন স্বাস্থ্য রিডিং | ব্রিদওয়েল v3',
      heroTitle: 'ক্লিনিক্যাল রক্তচাপ ও গ্লুকোজ বিশ্লেষক',
      heroSub: 'বয়স-উপযোগী AHA 2017 ও ADA 2024 মূল্যায়ন এবং সক্রিয় সদস্যের প্রোফাইলে সংরক্ষণ।',
      modeAll: 'দুটোই দেখুন',
      modeBp: 'শুধু রক্তচাপ',
      modeBg: 'শুধু গ্লুকোজ',
      crisisBanner: 'জরুরি সতর্কতা: অতি উচ্চ রক্তচাপ (>180/120 mmHg) অথবা তীব্র নিম্ন গ্লুকোজ (<54 mg/dL) শনাক্ত হয়েছে — অবিলম্বে মেডিকেল পরামর্শ নিন!',
      bpTitle: 'রক্তচাপ ও পালস (AHA 2017)',
      lblAge: 'বয়স',
      lblSys: 'সিস্টোলিক mmHg',
      lblDia: 'ডায়াস্টোলিক mmHg',
      lblPulse: 'পালস (BPM)',
      lblArm: 'হাত',
      lblNote: 'ক্লিনিক্যাল নোট',
      btnSaveBp: 'সক্রিয় সদস্যে রক্তচাপ সেভ করুন',
      glTitle: 'রক্তের গ্লুকোজ (ADA 2024)',
      lblGlVal: 'গ্লুকোজ মাত্রা',
      btnSaveGl: 'সক্রিয় সদস্যে গ্লুকোজ সেভ করুন',
      waCardTitle: 'ডাক্তার বা পরিবারের জন্য হোয়াটসঅ্যাপ রিপোর্ট প্রিভিউ',
      btnWaSend: 'হোয়াটসঅ্যাপে পাঠান',
      toastBpSaved: 'রক্তচাপ সক্রিয় সদস্যের প্রোফাইলে সংরক্ষিত হয়েছে!',
      toastGlSaved: 'গ্লুকোজ সক্রিয় সদস্যের প্রোফাইলে সংরক্ষিত হয়েছে!',
      errInvalidBp: 'সঠিক সিস্টোলিক ও ডায়াস্টোলিক মান লিখুন।',
      errInvalidGl: 'সঠিক গ্লুকোজ মান লিখুন।'
    },
    en: {
      pageTitle: 'New Vitals Reading | BreatheWell v3',
      heroTitle: 'Clinical Blood Pressure & Glucose Analyzer',
      heroSub: 'Age-contextual AHA 2017 & ADA 2024 staging with live WhatsApp summary saved under the active member.',
      modeAll: 'Show Both',
      modeBp: 'BP Only',
      modeBg: 'Glucose Only',
      crisisBanner: 'URGENT CLINICAL ALERT: Reading crosses Hypertensive Crisis (>180/120) or severe Dysglycemia — seek prompt medical evaluation!',
      bpTitle: 'Blood Pressure & Pulse (AHA 2017)',
      lblAge: 'Age',
      lblSys: 'Systolic mmHg',
      lblDia: 'Diastolic mmHg',
      lblPulse: 'Pulse (BPM)',
      lblArm: 'Measured Arm',
      lblNote: 'Clinical Note',
      btnSaveBp: 'Save BP to Active Member',
      glTitle: 'Blood Glucose (ADA 2024)',
      lblGlVal: 'Glucose Reading',
      btnSaveGl: 'Save Glucose to Active Member',
      waCardTitle: 'Live WhatsApp Clinical Summary Preview',
      btnWaSend: 'Send on WhatsApp',
      toastBpSaved: 'Blood pressure saved to active member!',
      toastGlSaved: 'Blood glucose saved to active member!',
      errInvalidBp: 'Please enter valid Systolic and Diastolic values.',
      errInvalidGl: 'Please enter a valid positive glucose value.'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var glUnit = 'mmol';
  var glContext = 'fasting';

  function refreshBP() {
    var sys = Number(document.getElementById('bpSysInput').value);
    var dia = Number(document.getElementById('bpDiaInput').value);
    var age = Number(document.getElementById('bpAgeInput').value) || 32;
    var lang = global.BWI18n.getLang();

    var res = global.BWClinical.classifyBP(sys, dia);
    var badge = document.getElementById('bpLiveBadge');
    badge.className = 'bw-status-pill ' + res.badgeClass;
    badge.textContent = tr(res.labelKey) + ' (' + sys + '/' + dia + ')';
    document.getElementById('bpLiveNeedle').style.left = res.percent + '%';

    var bench = global.BWClinical.getAgeBenchmark(age, lang);
    document.getElementById('bpBenchmarkNote').textContent =
      bench.group + ' Reference: ' + bench.normalSys + ' / ' + bench.normalDia + ' mmHg (Action threshold ' + bench.highThreshold + ')';

    refreshCrisisAndWA();
  }

  function getMgdlValue() {
    var val = Number(document.getElementById('glValInput').value);
    if (!isFinite(val) || val <= 0) return 0;
    return glUnit === 'mmol' ? global.BWClinical.mmolToMgdl(val) : Math.round(val);
  }

  function refreshGlucose() {
    var mgdl = getMgdlValue();
    var mmol = global.BWClinical.mgdlToMmol(mgdl);
    document.getElementById('glConvHint').textContent =
      glUnit === 'mmol' ? ('= ' + mgdl + ' mg/dL') : ('= ' + mmol + ' mmol/L');

    var res = global.BWClinical.classifyGlucose(mgdl, glContext);
    var badge = document.getElementById('glLiveBadge');
    badge.className = 'bw-status-pill ' + res.badgeClass;
    badge.textContent = mgdl > 0 ? (tr(res.labelKey) + ' (' + mmol + ' mmol/L)') : '—';
    document.getElementById('glLiveNeedle').style.left = res.percent + '%';

    refreshCrisisAndWA();
  }

  function refreshCrisisAndWA() {
    var sys = Number(document.getElementById('bpSysInput').value);
    var dia = Number(document.getElementById('bpDiaInput').value);
    var mgdl = getMgdlValue();
    var isCrisis = (sys > 180 || dia > 120 || (mgdl > 0 && (mgdl < 54 || mgdl >= 350)));
    document.getElementById('crisisAlertBanner').classList.toggle('d-none', !isCrisis);

    var active = global.BWStore.getActiveMember();
    var mmol = global.BWClinical.mgdlToMmol(mgdl);
    var msg = [
      '*BreatheWell v3 Clinical Vitals*',
      'Member: ' + active.name + ' (' + global.BWNav.relationLabel(active.relation) + ', Age ' + (document.getElementById('bpAgeInput').value || active.age || '—') + ')',
      'BP: ' + sys + '/' + dia + ' mmHg (HR ' + (document.getElementById('bpPulseInput').value || '72') + ')',
      'Glucose: ' + mmol + ' mmol/L (' + mgdl + ' mg/dL) [' + glContext + ']',
      'Time: ' + new Date().toLocaleString()
    ].join('\n');
    document.getElementById('waPreviewText').value = msg;
  }

  function syncMemberAge() {
    var active = global.BWStore.getActiveMember();
    if (active && active.age) document.getElementById('bpAgeInput').value = active.age;
    refreshBP();
    refreshGlucose();
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');
    syncMemberAge();

    /* Form Mode Switcher */
    Array.prototype.forEach.call(document.querySelectorAll('[data-hr-mode]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-hr-mode]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var m = btn.getAttribute('data-hr-mode');
        document.getElementById('colBPForm').classList.toggle('d-none', m === 'bg');
        document.getElementById('colBGForm').classList.toggle('d-none', m === 'bp');
      });
    });

    ['bpSysInput', 'bpDiaInput', 'bpAgeInput', 'bpPulseInput'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', refreshBP);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-bp-preset]'), function (btn) {
      btn.addEventListener('click', function () {
        var pair = btn.getAttribute('data-bp-preset').split('/');
        document.getElementById('bpSysInput').value = pair[0];
        document.getElementById('bpDiaInput').value = pair[1];
        refreshBP();
      });
    });

    document.getElementById('glValInput').addEventListener('input', refreshGlucose);
    Array.prototype.forEach.call(document.querySelectorAll('[data-gl-unit]'), function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-gl-unit');
        if (next === glUnit) return;
        var cur = Number(document.getElementById('glValInput').value);
        glUnit = next;
        Array.prototype.forEach.call(document.querySelectorAll('[data-gl-unit]'), function (b) { b.classList.toggle('active', b === btn); });
        if (isFinite(cur) && cur > 0) {
          document.getElementById('glValInput').value =
            glUnit === 'mgdl' ? global.BWClinical.mmolToMgdl(cur) : global.BWClinical.mgdlToMmol(cur);
        }
        refreshGlucose();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-gl-timing]'), function (card) {
      card.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-gl-timing]'), function (c) { c.classList.remove('active'); });
        card.classList.add('active');
        glContext = card.getAttribute('data-gl-timing');
        refreshGlucose();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-bg-preset]'), function (btn) {
      btn.addEventListener('click', function () {
        var mmolVal = Number(btn.getAttribute('data-bg-preset'));
        document.getElementById('glValInput').value =
          glUnit === 'mmol' ? mmolVal : global.BWClinical.mmolToMgdl(mmolVal);
        refreshGlucose();
      });
    });

    document.getElementById('bpForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var sys = Number(document.getElementById('bpSysInput').value);
      var dia = Number(document.getElementById('bpDiaInput').value);
      if (sys < 40 || sys > 300 || dia < 20 || dia > 200) { global.BWI18n.showToast(tr('errInvalidBp'), 'danger'); return; }
      var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
      vitals.bp = vitals.bp || [];
      vitals.bp.unshift({
        id: 'bp_' + Date.now().toString(36),
        sys: sys,
        dia: dia,
        pulse: Number(document.getElementById('bpPulseInput').value) || 72,
        age: Number(document.getElementById('bpAgeInput').value) || '',
        arm: document.getElementById('bpArmSelect').value,
        note: document.getElementById('bpNoteInput').value.trim(),
        ts: new Date().toISOString()
      });
      global.BWStore.setDomainData('vitals', vitals);
      global.BWI18n.showToast(tr('toastBpSaved'), 'success');
      document.getElementById('bpNoteInput').value = '';
    });

    document.getElementById('glForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var mgdl = getMgdlValue();
      if (!mgdl || mgdl < 20 || mgdl > 900) { global.BWI18n.showToast(tr('errInvalidGl'), 'danger'); return; }
      var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
      vitals.glucose = vitals.glucose || [];
      vitals.glucose.unshift({
        id: 'gl_' + Date.now().toString(36),
        valueMgdl: mgdl,
        context: glContext,
        note: document.getElementById('glNoteInput').value.trim(),
        ts: new Date().toISOString()
      });
      global.BWStore.setDomainData('vitals', vitals);
      global.BWI18n.showToast(tr('toastGlSaved'), 'success');
      document.getElementById('glNoteInput').value = '';
    });

    document.getElementById('btnSendWA').addEventListener('click', function () {
      var txt = document.getElementById('waPreviewText').value;
      global.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank', 'noopener,noreferrer');
    });
    document.getElementById('btnCopyWA').addEventListener('click', function () {
      global.BWI18n.copyText(document.getElementById('waPreviewText').value);
    });

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      refreshBP();
      refreshGlucose();
    });
    global.addEventListener('bwMemberChanged', syncMemberAge);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
