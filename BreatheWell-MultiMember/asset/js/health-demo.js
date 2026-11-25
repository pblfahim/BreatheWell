/**
 * @file health-demo.js
 * @description Clinical Vitals Sample Seeder & Member Storage Inspector (`health-demo.html`):
 *   - 4 Clinical Sample Datasets seeded straight into the Active Member (or Guest Preview)
 *   - Live JSON Storage Inspector showing isolated scoped storage payload
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Preset Generators (Optimal, Stage 1 HTN, Prediabetes, 14-Day Recovery)
 *   3. JSON Inspector & Clear Handlers
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'ক্লিনিক্যাল ডেমো ও ল্যাব | ব্রিদওয়েল',
      heroTitle: 'নমুনা ক্লিনিক্যাল ডেটাসেট ও স্টোরেজ ইন্সপেক্টর',
      heroSub: 'চার্ট এবং ইতিহাস টেবিল পরীক্ষা করতে সক্রিয় সদস্যের প্রোফাইলে তাৎক্ষণিক নমুনা ডেটা লোড করুন।',
      p1Title: 'সুস্থ স্বাভাবিক বেসলাইন',
      p1Desc: 'স্বাভাবিক রক্তচাপ (১১২-১১৮/৭২-৭৬) ও স্বাভাবিক গ্লুকোজ (৮৮-১০৫ mg/dL) — ৭ দিনের রেকর্ড।',
      p2Title: 'উচ্চ রক্তচাপ স্টেজ ১ সতর্কতা',
      p2Desc: 'সিস্টোলিক ১৩২-১৪৪ mmHg ট্রেন্ড যা শ্বাস ব্যায়ামের সাথে ধীরে ধীরে কমছে।',
      p3Title: 'প্রি-ডায়াবেটিস ও খাবার পরবর্তী গ্লুকোজ',
      p3Desc: 'ফাস্টিং ১০৬-১১৮ ও পোস্ট-মিল ১৪৮-১৭৪ mg/dL — ১০ দিনের মিশ্র লগ।',
      p4Title: '১৪ দিনের সম্পূর্ণ পুনরুদ্ধার প্যাক',
      p4Desc: 'রক্তচাপ, গ্লুকোজ ও ক্রমাগত উন্নত হওয়া ১৪ দিনের সমন্বিত ডেটাসেট।',
      btnSeed: 'সক্রিয় সদস্যে লোড করুন',
      btnClearVitals: 'সক্রিয় সদস্যের ভাইটালস মুছুন',
      inspectorTitle: 'সক্রিয় সদস্যের লাইভ JSON স্টোরেজ ইন্সপেক্টর',
      toastSeeded: 'ডেমো ক্লিনিক্যাল ডেটা সক্রিয় সদস্যে লোড হয়েছে!',
      toastCleared: 'সক্রিয় সদস্যের ভাইটালস ডেটা মুছে ফেলা হয়েছে।'
    },
    en: {
      pageTitle: 'Clinical Demo Data & Lab | BreatheWell',
      heroTitle: 'Sample Clinical Datasets & Member Storage Inspector',
      heroSub: 'Inject realistic multi-day clinical scenarios directly into the active family member to test charts & DataTables.',
      p1Title: 'Optimal Healthy Adult',
      p1Desc: '7 days of normal BP (112-118/72-76) and healthy Fasting/Post-meal glucose.',
      p2Title: 'Stage 1 Hypertension Watch',
      p2Desc: '10 days tracking Stage 1 Systolic 132-144 mmHg stabilizing toward normal range.',
      p3Title: 'Prediabetes & Post-Meal Spikes',
      p3Desc: 'Fasting 106-118 mg/dL alongside 2h post-meal excursions (148-174 mg/dL).',
      p4Title: '14-Day Combined Recovery Pack',
      p4Desc: 'Full 14-day longitudinal BP & Glucose dataset for charting stress tests.',
      btnSeed: 'Seed Into Active Member',
      btnClearVitals: 'Clear Active Member Vitals',
      inspectorTitle: 'Live Scoped Member JSON Storage Inspector',
      toastSeeded: 'Clinical sample dataset seeded into active member!',
      toastCleared: 'Cleared all vitals for the active member.'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  function daysAgoIso(days, hr) {
    var d = new Date(Date.now() - days * 86400000);
    d.setHours(hr || 8, 30, 0, 0);
    return d.toISOString();
  }

  function generatePreset(kind) {
    var bp = [], glucose = [];
    if (kind === 'optimal') {
      for (var i = 0; i < 7; i++) {
        bp.push({ id: 'dm_bp_' + i, sys: 112 + (i % 5), dia: 72 + (i % 4), pulse: 66 + (i % 5), arm: 'left', note: 'Morning optimal', ts: daysAgoIso(i, 8) });
        glucose.push({ id: 'dm_gl_' + i, valueMgdl: 88 + (i % 7), context: 'fasting', note: 'Fasting optimal', ts: daysAgoIso(i, 7) });
      }
    } else if (kind === 'htn') {
      for (var j = 0; j < 10; j++) {
        bp.push({ id: 'dm_bp_' + j, sys: 132 + Math.round(j * 1.1), dia: 84 + (j % 5), pulse: 74 + (j % 6), arm: 'left', note: 'Morning medication watch', ts: daysAgoIso(j, 8) });
      }
      glucose.push({ id: 'dm_gl_h1', valueMgdl: 96, context: 'fasting', note: 'Baseline glucose', ts: daysAgoIso(1, 7) });
    } else if (kind === 'predm') {
      for (var k = 0; k < 8; k++) {
        glucose.push({ id: 'dm_gl_f_' + k, valueMgdl: 106 + (k % 9), context: 'fasting', note: 'Fasting prediabetes check', ts: daysAgoIso(k, 7) });
        glucose.push({ id: 'dm_gl_p_' + k, valueMgdl: 150 + ((k * 7) % 24), context: 'postmeal', note: '2h after meal', ts: daysAgoIso(k, 14) });
      }
      bp.push({ id: 'dm_bp_p1', sys: 122, dia: 78, pulse: 72, arm: 'left', note: 'Normal BP', ts: daysAgoIso(0, 9) });
    } else {
      for (var n = 0; n < 14; n++) {
        bp.push({ id: 'dm_bp_r_' + n, sys: Math.round(120 + n * 1.4), dia: Math.round(76 + (n % 8)), pulse: 70 + (n % 7), arm: 'left', note: 'Recovery day ' + (14 - n), ts: daysAgoIso(n, 8) });
        glucose.push({ id: 'dm_gl_r_' + n, valueMgdl: Math.round(92 + n * 2.2), context: n % 2 === 0 ? 'fasting' : 'postmeal', note: 'Combined trend', ts: daysAgoIso(n, 10) });
      }
    }
    return { bp: bp, glucose: glucose };
  }

  function renderInspector() {
    var active = global.BWStore.getActiveMember();
    var data = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    document.getElementById('hdInspectorPre').textContent = JSON.stringify({
      activeMember: { id: active.id, name: active.name, relation: active.relation },
      vitals: data
    }, null, 2);
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    Array.prototype.forEach.call(document.querySelectorAll('[data-preset]'), function (btn) {
      btn.addEventListener('click', function () {
        var preset = generatePreset(btn.getAttribute('data-preset'));
        global.BWStore.setDomainData('vitals', preset);
        global.BWI18n.showToast(tr('toastSeeded'), 'success');
        renderInspector();
      });
    });

    document.getElementById('hdClearBtn').addEventListener('click', function () {
      global.BWStore.setDomainData('vitals', { bp: [], glucose: [] });
      global.BWI18n.showToast(tr('toastCleared'), 'warning');
      renderInspector();
    });

    renderInspector();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
    });
    global.addEventListener('bwMemberChanged', renderInspector);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
