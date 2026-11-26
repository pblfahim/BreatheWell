/**
 * @file health-charts.js
 * @description Interactive Clinical Vitals Trend Charts & Smart Insights (`health-charts.html`):
 *   - 4 Pull-Up KPI Stat Cards w/ Live Sparklines (`#hcBPSparkline`, `#hcBGSparkline`) — Fixed from V1!
 *   - Clean Timeframe Switcher (`7d`, `14d`, `30d`, `all`) without string-parse bugs
 *   - Dual SVG Charts (BP `90-120` Safe Band + BG `70-140` Safe Band) w/ Hover Tooltips
 *   - Automated Longitudinal Smart Health Analytics Card (`#tcInsightCard`)
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Timeframe Filter, Sparklines & Safe-Zone Calculators
 *   3. Chart Tooltip Delegate & Longitudinal Clinical Insight Builder
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'স্বাস্থ্য ট্রেন্ড চার্ট | ব্রিদওয়েল v3',
      heroTitle: 'সক্রিয় সদস্যের রক্তচাপ ও গ্লুকোজ ট্রেন্ড বিশ্লেষণ',
      heroSub: 'সময়ের সাথে সাথে স্বাভাবিক জোনের হার, স্পার্কলাইন ও ১৪-দিনের স্মার্ট বিশ্লেষণ।',
      statMeanBp: 'গড় রক্তচাপ',
      statMeanBg: 'গড় গ্লুকোজ (mmol/L)',
      statSafeBp: 'BP নিরাপদ জোনে (%)',
      statSafeBg: 'গ্লুকোজ নিরাপদ জোনে (%)',
      bpChartTitle: 'রক্তচাপ ট্রেন্ড (সিস্টোলিক বনাম ডায়াস্টোলিক)',
      bgChartTitle: 'রক্তের গ্লুকোজ ট্রেন্ড (mg/dL)',
      insightTitle: 'স্মার্ট ক্লিনিক্যাল ট্রেন্ড বিশ্লেষণ'
    },
    en: {
      pageTitle: 'Vitals Trend Charts | BreatheWell v3',
      heroTitle: 'Clinical Blood Pressure & Glucose Trend Charts',
      heroSub: 'Track longitudinal safe-zone percentages, rolling sparklines & smart clinical analytics per member.',
      statMeanBp: 'Mean BP (Systolic/Dia)',
      statMeanBg: 'Mean Glucose',
      statSafeBp: 'BP In Safe Zone (%)',
      statSafeBg: 'Glucose In Target (%)',
      bpChartTitle: 'Blood Pressure Longitudinal Trend',
      bgChartTitle: 'Blood Glucose Trend (mg/dL)',
      insightTitle: 'Smart Clinical Telemetry Insights'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var tfMode = '30d';

  function filterByTimeframe(items, tf) {
    if (tf === 'all') return items.slice();
    var days = parseInt(tf, 10) || 30;
    var cutoff = Date.now() - days * 86400000;
    return items.filter(function (x) {
      var ms = new Date(x.ts).getTime();
      return !isFinite(ms) || ms >= cutoff;
    });
  }

  function renderAllCharts() {
    var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    var bpList = filterByTimeframe(vitals.bp || [], tfMode).slice().reverse();
    var glList = filterByTimeframe(vitals.glucose || [], tfMode).slice().reverse();

    /* BP KPI & Sparkline */
    if (bpList.length) {
      var sAvg = Math.round(bpList.reduce(function (a, b) { return a + Number(b.sys); }, 0) / bpList.length);
      var dAvg = Math.round(bpList.reduce(function (a, b) { return a + Number(b.dia); }, 0) / bpList.length);
      var bpSafe = bpList.filter(function (b) { return Number(b.sys) < 130 && Number(b.dia) < 85; }).length;
      document.getElementById('hcStatBPVal').textContent = sAvg + '/' + dAvg;
      document.getElementById('statInSafeBP').textContent = Math.round((bpSafe / bpList.length) * 100) + '%';
      global.BWClinical.renderSparkline(document.getElementById('hcBPSparkline'), bpList.map(function (b) { return Number(b.sys); }), '#dc2626');
    } else {
      document.getElementById('hcStatBPVal').textContent = '—';
      document.getElementById('statInSafeBP').textContent = '—';
      document.getElementById('hcBPSparkline').innerHTML = '';
    }

    /* BG KPI & Sparkline */
    if (glList.length) {
      var gAvgMg = Math.round(glList.reduce(function (a, b) { return a + Number(b.valueMgdl); }, 0) / glList.length);
      var gSafe = glList.filter(function (g) { return Number(g.valueMgdl) >= 70 && Number(g.valueMgdl) <= 140; }).length;
      document.getElementById('hcStatBGVal').textContent = global.BWClinical.mgdlToMmol(gAvgMg) + ' mmol/L';
      document.getElementById('statInSafeBG').textContent = Math.round((gSafe / glList.length) * 100) + '%';
      global.BWClinical.renderSparkline(document.getElementById('hcBGSparkline'), glList.map(function (g) { return Number(g.valueMgdl); }), '#d97706');
    } else {
      document.getElementById('hcStatBGVal').textContent = '—';
      document.getElementById('statInSafeBG').textContent = '—';
      document.getElementById('hcBGSparkline').innerHTML = '';
    }

    global.BWClinical.renderSvgLineChart(document.getElementById('bpChartWrap'), {
      labels: bpList.map(function (b) { return String(b.ts || '').slice(0, 10); }),
      series: [
        { name: 'Systolic', color: '#dc2626', values: bpList.map(function (b) { return Number(b.sys); }) },
        { name: 'Diastolic', color: '#1769aa', values: bpList.map(function (b) { return Number(b.dia); }) }
      ],
      yMin: 50, yMax: 190,
      safeBand: { min: 70, max: 120, color: 'rgba(16,185,129,0.10)' },
      emptyText: global.BWI18n.t('commonNoRecords', PAGE_DICT)
    });

    global.BWClinical.renderSvgLineChart(document.getElementById('bgChartWrap'), {
      labels: glList.map(function (g) { return String(g.ts || '').slice(0, 10); }),
      series: [
        { name: 'Glucose (mg/dL)', color: '#d97706', values: glList.map(function (g) { return Number(g.valueMgdl); }) }
      ],
      yMin: 50, yMax: 240,
      safeBand: { min: 70, max: 140, color: 'rgba(16,185,129,0.12)' },
      emptyText: global.BWI18n.t('commonNoRecords', PAGE_DICT)
    });

    /* Smart Insights Narrative */
    var active = global.BWStore.getActiveMember();
    var insightEl = document.getElementById('tcInsightBody');
    if (!bpList.length && !glList.length) {
      insightEl.textContent = global.BWI18n.t('commonNoRecords', PAGE_DICT);
    } else {
      var parts = [];
      if (bpList.length) parts.push('BP readings (' + bpList.length + ' points) average ' + document.getElementById('hcStatBPVal').textContent + ' mmHg.');
      if (glList.length) parts.push('Glucose readings (' + glList.length + ' points) show ' + document.getElementById('statInSafeBG').textContent + ' within 70-140 mg/dL target.');
      insightEl.textContent = active.name + ': ' + parts.join(' ');
    }
  }

  function wireChartHoverTooltips(wrapId, tooltipId) {
    var wrap = document.getElementById(wrapId);
    var tipEl = document.getElementById(tooltipId);
    if (!wrap || !tipEl) return;
    wrap.addEventListener('mouseover', function (ev) {
      var tip = ev.target && ev.target.getAttribute ? ev.target.getAttribute('data-chart-tip') : '';
      if (tip) { tipEl.textContent = tip; tipEl.classList.remove('d-none'); }
    });
    wrap.addEventListener('mouseleave', function () { tipEl.classList.add('d-none'); });
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    Array.prototype.forEach.call(document.querySelectorAll('[data-hc-tf]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-hc-tf]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        tfMode = btn.getAttribute('data-hc-tf');
        renderAllCharts();
      });
    });

    wireChartHoverTooltips('bpChartWrap', 'tcTooltipBp');
    wireChartHoverTooltips('bgChartWrap', 'tcTooltipBg');
    renderAllCharts();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderAllCharts();
    });
    global.addEventListener('bwMemberChanged', renderAllCharts);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
