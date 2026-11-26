/**
 * @file health-demo.js
 * @description Sample Clinical Data Seeder, 4 Preset Cards & Parametric Generator (`health-demo.html`):
 *   - 4 Realistic Clinical Presets (Healthy 7d, Hypertension 14d, Diabetes 14d, Crisis Alert)
 *   - Custom Parametric Generator (Days 3/7/14/30, Type both/bp/bg, Profile balanced/elevated/random)
 *   - Live Member Scoped JSON Inspector & Clear Active Member Data
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. 4 Clinical Scenario Presets + Custom Parametric Generator
 *   3. Member Scoped JSON Storage Inspector
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'নমুনা ক্লিনিক্যাল ডেটা | ব্রিদওয়েল v3',
      heroTitle: 'নমুনা ডেটাসেট জেনারেটর ও স্টোরেজ ইন্সপেক্টর',
      heroSub: 'চার্ট ও ইতিহাস টেবিল পরীক্ষা করতে সক্রিয় সদস্যের প্রোফাইলে নমুনা ক্লিনিক্যাল ডেটা তৈরি করুন।',
      statCount: 'সক্রিয় সদস্যের মোট রেকর্ড',
      btnSeed: 'লোড করুন',
      btnGenerateCustom: 'কাস্টম ডেটাসেট তৈরি করুন',
      btnClearAll: 'সক্রিয় সদস্যের ভাইটালস মুছুন',
      inspectorTitle: 'সক্রিয় সদস্যের লাইভ JSON স্টোরেজ ইন্সপেক্টর',
      toastSeeded: 'নমুনা ক্লিনিক্যাল ডেটা সক্রিয় সদস্যে লোড হয়েছে!',
      toastCleared: 'সক্রিয় সদস্যের ভাইটালস ডেটা মুছে ফেলা হয়েছে।'
    },
    en: {
      pageTitle: 'Clinical Demo Data Lab | BreatheWell v3',
      heroTitle: 'Sample Clinical Scenarios & Scoped JSON Inspector',
      heroSub: 'Seed 4 clinical presets or custom parametric multi-day histories directly into the active family member.',
      statCount: 'Active Member Records',
      btnSeed: 'Seed Preset',
      btnGenerateCustom: 'Generate Custom Dataset',
      btnClearAll: 'Clear Active Member Vitals',
      inspectorTitle: 'Live Scoped Member JSON Storage Inspector',
      toastSeeded: 'Sample clinical dataset loaded under active member!',
      toastCleared: 'Cleared all vitals for the active member.'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  function isoDaysAgo(days, hr) {
    var d = new Date(Date.now() - days * 86400000);
    d.setHours(hr || 8, 15, 0, 0);
    return d.toISOString();
  }

  function buildScenario(kind) {
    var bp = [], gl = [];
    if (kind === 'healthy') {
      for (var i = 0; i < 7; i++) {
        bp.push({ id: 'hd_bp_' + i, sys: 112 + (i % 5), dia: 72 + (i % 4), pulse: 68 + (i % 4), arm: 'left', note: 'Healthy morning', ts: isoDaysAgo(i, 8) });
        gl.push({ id: 'hd_gl_' + i, valueMgdl: 88 + (i % 8), context: 'fasting', note: 'Healthy fasting', ts: isoDaysAgo(i, 7) });
      }
    } else if (kind === 'htn') {
      for (var j = 0; j < 14; j++) {
        bp.push({ id: 'hd_htn_' + j, sys: Math.round(134 + (j % 12)), dia: Math.round(85 + (j % 6)), pulse: 76, arm: 'left', note: 'Stage 1/2 watch', ts: isoDaysAgo(j, 8) });
      }
    } else if (kind === 'diabetes') {
      for (var k = 0; k < 14; k++) {
        gl.push({ id: 'hd_dm_' + k, valueMgdl: Math.round(128 + (k % 55)), context: k % 2 === 0 ? 'fasting' : 'postmeal', note: 'Glycemic monitoring', ts: isoDaysAgo(k, 10) });
      }
    } else {
      bp.push({ id: 'hd_cr_bp', sys: 194, dia: 124, pulse: 102, arm: 'left', note: 'Crisis demonstration alert', ts: isoDaysAgo(0, 9) });
      gl.push({ id: 'hd_cr_gl', valueMgdl: 365, context: 'random', note: 'Hyperglycemia alert', ts: isoDaysAgo(0, 9) });
    }
    return { bp: bp, glucose: gl };
  }

  function renderInspector() {
    var active = global.BWStore.getActiveMember();
    var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    document.getElementById('ddStorageCount').textContent =
      ((vitals.bp || []).length + (vitals.glucose || []).length) + ' (' + (vitals.bp || []).length + ' BP / ' + (vitals.glucose || []).length + ' BG)';
    document.getElementById('hdInspectorPre').textContent = JSON.stringify({ member: active.name, vitals: vitals }, null, 2);
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    Array.prototype.forEach.call(document.querySelectorAll('[data-demo-preset]'), function (btn) {
      btn.addEventListener('click', function () {
        var data = buildScenario(btn.getAttribute('data-demo-preset'));
        global.BWStore.setDomainData('vitals', data);
        global.BWI18n.showToast(tr('toastSeeded'), 'success');
        renderInspector();
      });
    });

    document.getElementById('ddCustomForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var days = Number(document.getElementById('customDays').value) || 7;
      var kind = document.getElementById('customType').value;
      var prof = document.getElementById('customProfile').value;
      var vitals = { bp: [], glucose: [] };
      for (var i = 0; i < days; i++) {
        if (kind === 'both' || kind === 'bp') {
          var sysBase = prof === 'balanced' ? 114 : prof === 'elevated' ? 136 : (105 + Math.floor(Math.random() * 45));
          vitals.bp.push({ id: 'c_bp_' + i, sys: sysBase + (i % 4), dia: Math.round(sysBase * 0.64), pulse: 72, arm: 'left', note: 'Custom ' + prof, ts: isoDaysAgo(i, 8) });
        }
        if (kind === 'both' || kind === 'bg') {
          var glBase = prof === 'balanced' ? 92 : prof === 'elevated' ? 148 : (72 + Math.floor(Math.random() * 115));
          vitals.glucose.push({ id: 'c_gl_' + i, valueMgdl: glBase + (i % 6), context: i % 2 === 0 ? 'fasting' : 'postmeal', note: 'Custom ' + prof, ts: isoDaysAgo(i, 10) });
        }
      }
      global.BWStore.setDomainData('vitals', vitals);
      global.BWI18n.showToast(tr('toastSeeded'), 'success');
      renderInspector();
    });

    document.getElementById('hdClearBtn').addEventListener('click', function () {
      global.BWStore.setDomainData('vitals', { bp: [], glucose: [] });
      global.BWI18n.showToast(tr('toastCleared'), 'warning');
      renderInspector();
    });

    renderInspector();

    global.addEventListener('bwLanguageChanged', function () { document.title = tr('pageTitle'); });
    global.addEventListener('bwMemberChanged', renderInspector);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
