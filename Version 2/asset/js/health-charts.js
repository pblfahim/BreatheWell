/**
 * @file health-charts.js
 * @description Interactive Clinical Vitals Trend Charts (`health-charts.html`):
 *   - Timeframe Filter (`7D`, `30D`, `90D`, `ALL`)
 *   - Systolic / Diastolic SVG Line Chart with 80–120 mmHg safe zone band
 *   - Blood Glucose SVG Line Chart with 70–140 mg/dL target zone band + Time-In-Range %
 *   - Strictly Scoped to Active Family Member
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Timeframe Slice & Chart Renderers
 *   3. Member Summary Statistics
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'স্বাস্থ্য ট্রেন্ড চার্ট | ব্রিদওয়েল',
      heroTitle: 'সক্রিয় সদস্যের রক্তচাপ ও গ্লুকোজ ট্রেন্ড বিশ্লেষণ',
      heroSub: 'সময়ের সাথে সাথে পরিবারের সদস্যের ক্লিনিক্যাল অগ্রগতি ও স্বাভাবিক জোনের হার দেখুন।',
      tf7: '৭ দিন',
      tf30: '৩০ দিন',
      tf90: '৯০ দিন',
      tfAll: 'সকল ডেটা',
      bpChartTitle: 'রক্তচাপ ট্রেন্ড (সিস্টোলিক ও ডায়াস্টোলিক)',
      glChartTitle: 'রক্তের গ্লুকোজ ট্রেন্ড (mg/dL)',
      statTir: 'টার্গেট জোনে থাকা (%)',
      statBpMean: 'গড় সিস্টোলিক / ডায়াস্টোলিক',
      statGlMean: 'গড় গ্লুকোজ'
    },
    en: {
      pageTitle: 'Vitals Trend Charts | BreatheWell',
      heroTitle: 'Blood Pressure & Glucose Clinical Trends',
      heroSub: 'Visualize multi-day longitudinal clinical telemetry and safe-zone compliance per family member.',
      tf7: '7 Days',
      tf30: '30 Days',
      tf90: '90 Days',
      tfAll: 'All Time',
      bpChartTitle: 'Blood Pressure Trend (Systolic vs Diastolic)',
      glChartTitle: 'Blood Glucose Trend (mg/dL)',
      statTir: 'Time-In-Target (%)',
      statBpMean: 'Mean Systolic / Diastolic',
      statGlMean: 'Mean Glucose'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  var activeDays = 30;

  function filterByDays(items, days) {
    if (!days || days <= 0) return items.slice();
    var cutoff = Date.now() - days * 86400000;
    return items.filter(function (x) {
      var ms = new Date(x.ts).getTime();
      return !isFinite(ms) || ms >= cutoff;
    });
  }

  function renderCharts() {
    var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    var bpList = filterByDays(vitals.bp || [], activeDays).slice().reverse();
    var glList = filterByDays(vitals.glucose || [], activeDays).slice().reverse();

    /* Mean KPIs */
    if (bpList.length) {
      var avgS = Math.round(bpList.reduce(function (a, b) { return a + Number(b.sys); }, 0) / bpList.length);
      var avgD = Math.round(bpList.reduce(function (a, b) { return a + Number(b.dia); }, 0) / bpList.length);
      document.getElementById('hcMeanBp').textContent = avgS + '/' + avgD + ' mmHg';
    } else {
      document.getElementById('hcMeanBp').textContent = '—';
    }

    if (glList.length) {
      var avgG = Math.round(glList.reduce(function (a, b) { return a + Number(b.valueMgdl); }, 0) / glList.length);
      var inRange = glList.filter(function (g) { return g.valueMgdl >= 70 && g.valueMgdl <= 140; }).length;
      document.getElementById('hcMeanGl').textContent = avgG + ' mg/dL';
      document.getElementById('hcTirPct').textContent = Math.round((inRange / glList.length) * 100) + '%';
    } else {
      document.getElementById('hcMeanGl').textContent = '—';
      document.getElementById('hcTirPct').textContent = '—';
    }

    global.BWClinical.renderSvgLineChart(document.getElementById('hcBpChart'), {
      labels: bpList.map(function (b) { return String(b.ts || '').slice(0, 10); }),
      series: [
        { name: 'Systolic', color: '#dc2626', values: bpList.map(function (b) { return Number(b.sys); }) },
        { name: 'Diastolic', color: '#1769aa', values: bpList.map(function (b) { return Number(b.dia); }) }
      ],
      yMin: 50,
      yMax: 190,
      safeBand: { min: 70, max: 120, color: 'rgba(16,185,129,0.10)' },
      emptyText: global.BWI18n.t('commonNoRecords', PAGE_DICT)
    });

    global.BWClinical.renderSvgLineChart(document.getElementById('hcGlucoseChart'), {
      labels: glList.map(function (g) { return String(g.ts || '').slice(0, 10); }),
      series: [
        { name: 'Glucose (mg/dL)', color: '#d97706', values: glList.map(function (g) { return Number(g.valueMgdl); }) }
      ],
      yMin: 50,
      yMax: 240,
      safeBand: { min: 70, max: 140, color: 'rgba(16,185,129,0.12)' },
      emptyText: global.BWI18n.t('commonNoRecords', PAGE_DICT)
    });
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    Array.prototype.forEach.call(document.querySelectorAll('[data-hc-days]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-hc-days]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeDays = Number(btn.getAttribute('data-hc-days')) || 0;
        renderCharts();
      });
    });

    renderCharts();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderCharts();
    });
    global.addEventListener('bwMemberChanged', renderCharts);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
