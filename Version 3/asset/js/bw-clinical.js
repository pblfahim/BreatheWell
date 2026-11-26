/**
 * @file bw-clinical.js
 * @module BWClinical
 * @description Shared Clinical Analytics Engine for BreatheWell Version 3:
 *   - AHA 2017 Blood Pressure Staging & 5-Stop Visual Track Coordinates (`classifyBP`)
 *   - Pediatric (<1y..17y) & Adult (18..60+) BP Reference Benchmark Evaluator (`getBPBenchmarkHtml`)
 *   - ADA 2024 Blood Glucose Staging (`classifyGlucose`, `18.0182` `mg/dL <-> mmol/L`)
 *   - BOLT, BPM & Composite Respiratory Readiness Index (`computeReadinessIndex`)
 *   - Responsive Interactive SVG Trend Charts w/ Safe Zone Bands, Tooltips & Sparklines
 *
 * TABLE OF CONTENTS:
 *   1. AHA 2017 BP Classifier & Age/Gender Benchmarks
 *   2. ADA 2024 Glucose Classifier & Unit Converters
 *   3. Pulmonary Fitness (BOLT, BPM, Readiness 0-100)
 *   4. Interactive SVG Line Charts w/ Tooltips & Sparklines
 */
(function (global) {
  'use strict';

  var GLUCOSE_FACTOR = 18.0182;

  function xmlEsc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* --------------------------------------------------------------------------
     1. AHA 2017 BP CLASSIFIER & AGE BENCHMARKS
     -------------------------------------------------------------------------- */
  function classifyBP(sysVal, diaVal) {
    var sys = Number(sysVal);
    var dia = Number(diaVal);
    if (!isFinite(sys) || !isFinite(dia) || sys <= 0 || dia <= 0) {
      return { code: 'unknown', labelKey: 'statusNormal', badgeClass: 'bw-status-info', percent: 30, color: '#64748b' };
    }
    if (sys < 90 || dia < 60) {
      return { code: 'low', labelKey: 'statusLow', badgeClass: 'bw-status-low', percent: 9, color: '#7c3aed' };
    }
    if (sys > 180 || dia > 120) {
      return { code: 'crisis', labelKey: 'statusCrisis', badgeClass: 'bw-status-danger', percent: 96, color: '#dc2626', isCrisis: true };
    }
    if (sys >= 140 || dia >= 90) {
      return { code: 'stage2', labelKey: 'statusStage2', badgeClass: 'bw-status-danger', percent: 84, color: '#dc2626' };
    }
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      return { code: 'stage1', labelKey: 'statusStage1', badgeClass: 'bw-status-stage1', percent: 68, color: '#ea580c' };
    }
    if (sys >= 120 && sys <= 129 && dia < 80) {
      return { code: 'elevated', labelKey: 'statusElevated', badgeClass: 'bw-status-elevated', percent: 45, color: '#0284c7' };
    }
    return { code: 'normal', labelKey: 'statusNormal', badgeClass: 'bw-status-normal', percent: 26, color: '#10b981' };
  }

  function getAgeBenchmark(ageYears, lang) {
    var a = Number(ageYears);
    var isBn = lang === 'bn';
    if (!isFinite(a) || a <= 0) a = 30;
    if (a < 1) return { group: isBn ? 'নবজাতক (<১ বছর)' : 'Infant (<1y)', normalSys: '72-104', normalDia: '37-56', highThreshold: '>105/60' };
    if (a <= 3) return { group: isBn ? 'শিশু (১-৩ বছর)' : 'Toddler (1-3y)', normalSys: '86-106', normalDia: '42-63', highThreshold: '>110/68' };
    if (a <= 5) return { group: isBn ? 'প্রাক-বিদ্যালয় (৪-৫ বছর)' : 'Preschool (4-5y)', normalSys: '89-112', normalDia: '46-72', highThreshold: '>115/75' };
    if (a <= 12) return { group: isBn ? 'স্কুল বয়স (৬-১২ বছর)' : 'School (6-12y)', normalSys: '97-115', normalDia: '57-76', highThreshold: '>120/80' };
    if (a <= 17) return { group: isBn ? 'কিশোর (১৩-১৭ বছর)' : 'Adolescent (13-17y)', normalSys: '108-120', normalDia: '64-80', highThreshold: '>=130/80' };
    if (a <= 39) return { group: isBn ? 'প্রাপ্তবয়স্ক (১৮-৩৯ বছর)' : 'Adult (18-39y)', normalSys: '110-120', normalDia: '70-80', highThreshold: '>=130/80' };
    if (a <= 59) return { group: isBn ? 'মধ্যবয়সী (৪০-৫৯ বছর)' : 'Middle Age (40-59y)', normalSys: '115-124', normalDia: '74-80', highThreshold: '>=130/80' };
    return { group: isBn ? 'প্রবীণ (৬০+ বছর)' : 'Older Adult (60+y)', normalSys: '118-128', normalDia: '72-82', highThreshold: '>=130/80' };
  }

  /* --------------------------------------------------------------------------
     2. ADA 2024 GLUCOSE CLASSIFIER & UNIT CONVERSION
     -------------------------------------------------------------------------- */
  function mgdlToMmol(mgdl) {
    var v = Number(mgdl);
    return isFinite(v) ? Number((v / GLUCOSE_FACTOR).toFixed(1)) : 0;
  }

  function mmolToMgdl(mmol) {
    var v = Number(mmol);
    return isFinite(v) ? Math.round(v * GLUCOSE_FACTOR) : 0;
  }

  function classifyGlucose(valMgdl, context) {
    var mg = Number(valMgdl);
    var ctx = context || 'fasting';
    if (!isFinite(mg) || mg <= 0) {
      return { code: 'unknown', labelKey: 'statusNormal', badgeClass: 'bw-status-info', percent: 35, color: '#64748b' };
    }
    if (mg < 70) {
      return { code: 'hypo', labelKey: 'statusLow', badgeClass: 'bw-status-low', percent: 9, color: '#7c3aed', isHypo: true };
    }
    if (ctx === 'fasting') {
      if (mg >= 126) return { code: 'diabetes', labelKey: 'statusDiabetes', badgeClass: 'bw-status-danger', percent: 88, color: '#dc2626', isHyper: mg >= 300 };
      if (mg >= 100) return { code: 'prediabetes', labelKey: 'statusPrediabetes', badgeClass: 'bw-status-stage1', percent: 60, color: '#f59e0b' };
      return { code: 'normal', labelKey: 'statusNormal', badgeClass: 'bw-status-normal', percent: 32, color: '#10b981' };
    }
    if (mg >= 200) {
      return { code: 'diabetes', labelKey: 'statusDiabetes', badgeClass: 'bw-status-danger', percent: 88, color: '#dc2626', isHyper: mg >= 300 };
    }
    if (mg >= 140) {
      return { code: 'prediabetes', labelKey: 'statusPrediabetes', badgeClass: 'bw-status-stage1', percent: 60, color: '#f59e0b' };
    }
    return { code: 'normal', labelKey: 'statusNormal', badgeClass: 'bw-status-normal', percent: 32, color: '#10b981' };
  }

  /* --------------------------------------------------------------------------
     3. PULMONARY FITNESS (BOLT, BPM, COMPOSITE READINESS INDEX 0-100)
     -------------------------------------------------------------------------- */
  function classifyBOLT(seconds) {
    var s = Number(seconds) || 0;
    if (s < 10) return { tier: 'poor', percent: 16, color: '#dc2626', badgeClass: 'bw-status-danger', co2: 30, o2: 40, vagal: 35, rx: 'diaphragmatic' };
    if (s < 20) return { tier: 'fair', percent: 44, color: '#d97706', badgeClass: 'bw-status-stage1', co2: 58, o2: 64, vagal: 60, rx: 'relax46' };
    if (s <= 30) return { tier: 'good', percent: 74, color: '#10b981', badgeClass: 'bw-status-normal', co2: 82, o2: 86, vagal: 84, rx: 'box' };
    return { tier: 'excellent', percent: 94, color: '#00897b', badgeClass: 'bw-status-info', co2: 96, o2: 95, vagal: 94, rx: 'mindful' };
  }

  function classifyBPM(bpm) {
    var b = Number(bpm) || 0;
    if (b > 20) return { tier: 'high', color: '#dc2626', badgeClass: 'bw-status-danger' };
    if (b >= 15) return { tier: 'moderate', color: '#d97706', badgeClass: 'bw-status-stage1' };
    if (b >= 10) return { tier: 'optimal', color: '#10b981', badgeClass: 'bw-status-normal' };
    return { tier: 'calm', color: '#00897b', badgeClass: 'bw-status-info' };
  }

  function computeReadinessIndex(bestBoltSec, avgBpm) {
    var boltScore = bestBoltSec ? Math.min(100, Math.round((bestBoltSec / 35) * 100)) : 0;
    var bpmScore = 0;
    if (avgBpm > 0) {
      if (avgBpm >= 10 && avgBpm <= 14) bpmScore = 95;
      else if (avgBpm < 10) bpmScore = 90;
      else if (avgBpm <= 18) bpmScore = 72;
      else bpmScore = 45;
    }
    if (!boltScore && !bpmScore) return 0;
    if (!bpmScore) return boltScore;
    if (!boltScore) return bpmScore;
    return Math.round(boltScore * 0.65 + bpmScore * 0.35);
  }

  /* --------------------------------------------------------------------------
     4. INTERACTIVE SVG LINE CHARTS & SPARKLINES
     -------------------------------------------------------------------------- */
  function renderSvgLineChart(containerEl, cfg) {
    if (!containerEl) return;
    var labels = (cfg && cfg.labels) || [];
    var series = (cfg && cfg.series) || [];
    if (!labels.length || !series.length || !series[0].values.length) {
      containerEl.innerHTML =
        '<div class="text-center text-muted py-5 small">' +
        '<i class="bi bi-graph-up fs-2 d-block mb-2 opacity-50" aria-hidden="true"></i>' +
        xmlEsc((cfg && cfg.emptyText) || 'No chart data yet') +
        '</div>';
      return;
    }

    var W = (cfg && cfg.width) || 620;
    var H = (cfg && cfg.height) || 235;
    var pad = { top: 18, right: 18, bottom: 34, left: 44 };
    var plotW = W - pad.left - pad.right;
    var plotH = H - pad.top - pad.bottom;

    var allVals = [];
    series.forEach(function (s) {
      s.values.forEach(function (v) { if (isFinite(v)) allVals.push(v); });
    });
    var minY = cfg.yMin !== undefined ? cfg.yMin : Math.max(0, Math.floor(Math.min.apply(null, allVals) * 0.85));
    var maxY = cfg.yMax !== undefined ? cfg.yMax : Math.ceil(Math.max.apply(null, allVals) * 1.12);
    if (maxY <= minY) maxY = minY + 10;

    function xAt(i) { return labels.length === 1 ? (pad.left + plotW / 2) : (pad.left + (i / (labels.length - 1)) * plotW); }
    function yAt(v) { return pad.top + plotH - ((v - minY) / (maxY - minY)) * plotH; }

    var svgParts = ['<svg viewBox="0 0 ' + W + ' ' + H + '" class="w-100 h-auto" role="img" aria-label="Trend Chart">'];

    if (cfg.safeBand) {
      var topBand = yAt(Math.min(maxY, cfg.safeBand.max));
      var botBand = yAt(Math.max(minY, cfg.safeBand.min));
      svgParts.push('<rect x="' + pad.left + '" y="' + topBand.toFixed(1) + '" width="' + plotW + '" height="' + Math.max(2, botBand - topBand).toFixed(1) + '" fill="' + (cfg.safeBand.color || 'rgba(34,197,94,0.10)') + '" rx="4" />');
    }

    for (var g = 0; g <= 4; g++) {
      var val = minY + ((maxY - minY) * g) / 4;
      var gy = yAt(val);
      svgParts.push('<line x1="' + pad.left + '" y1="' + gy.toFixed(1) + '" x2="' + (W - pad.right) + '" y2="' + gy.toFixed(1) + '" stroke="#e2e8f0" stroke-dasharray="4 4" />');
      svgParts.push('<text x="' + (pad.left - 8) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#64748b">' + Math.round(val) + '</text>');
    }

    var step = Math.max(1, Math.ceil(labels.length / 6));
    for (var xi = 0; xi < labels.length; xi += step) {
      svgParts.push('<text x="' + xAt(xi).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="11" fill="#64748b">' + xmlEsc(String(labels[xi]).slice(0, 10)) + '</text>');
    }

    series.forEach(function (s) {
      var pts = [];
      s.values.forEach(function (v, idx) {
        if (isFinite(v)) pts.push(xAt(idx).toFixed(1) + ',' + yAt(v).toFixed(1));
      });
      if (pts.length > 1) {
        svgParts.push('<polyline fill="none" stroke="' + s.color + '" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" points="' + pts.join(' ') + '" />');
      }
      s.values.forEach(function (v, idx) {
        if (!isFinite(v)) return;
        var tip = xmlEsc((s.name || '') + ': ' + v + ' (' + labels[idx] + ')');
        svgParts.push(
          '<circle cx="' + xAt(idx).toFixed(1) + '" cy="' + yAt(v).toFixed(1) + '" r="4.8" fill="#ffffff" stroke="' + s.color + '" stroke-width="2.5" data-chart-tip="' + tip + '">' +
          '<title>' + tip + '</title></circle>'
        );
      });
    });

    svgParts.push('</svg>');
    containerEl.innerHTML = svgParts.join('');
  }

  function renderSparkline(containerEl, values, color) {
    if (!containerEl || !Array.isArray(values) || values.length < 2) {
      if (containerEl) containerEl.innerHTML = '';
      return;
    }
    var W = 120, H = 34;
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    if (max <= min) max = min + 5;
    var pts = values.map(function (v, i) {
      var x = (i / (values.length - 1)) * (W - 6) + 3;
      var y = H - 4 - ((v - min) / (max - min)) * (H - 8);
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    containerEl.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="w-100 h-auto" aria-hidden="true"><polyline fill="none" stroke="' + (color || '#1769aa') + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" points="' + pts + '" /></svg>';
  }

  global.BWClinical = {
    GLUCOSE_FACTOR: GLUCOSE_FACTOR,
    classifyBP: classifyBP,
    getAgeBenchmark: getAgeBenchmark,
    mgdlToMmol: mgdlToMmol,
    mmolToMgdl: mmolToMgdl,
    classifyGlucose: classifyGlucose,
    classifyBOLT: classifyBOLT,
    classifyBPM: classifyBPM,
    computeReadinessIndex: computeReadinessIndex,
    renderSvgLineChart: renderSvgLineChart,
    renderSparkline: renderSparkline
  };
})(typeof window !== 'undefined' ? window : globalThis);
