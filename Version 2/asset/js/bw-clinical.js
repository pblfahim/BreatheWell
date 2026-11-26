/**
 * @file bw-clinical.js
 * @module BWClinical
 * @description Shared Evidence-Based Clinical Classifiers & SVG Visualization Primitives:
 *   - AHA 2017 Blood Pressure Categorization (`classifyBP`)
 *   - ADA 2024 Blood Glucose Categorization (`classifyGlucose`, `mgdlToMmol`, `mmolToMgdl`)
 *   - BOLT & Respiratory Rate (BPM) Clinical Benchmarks (`classifyBOLT`, `classifyBPM`)
 *   - Responsive Accessible SVG Line Chart Builder (`renderSvgLineChart`)
 *
 * TABLE OF CONTENTS:
 *   1. Blood Pressure (AHA 2017) Classifier & Spectrum Coordinate
 *   2. Blood Glucose (ADA 2024) Classifier & Unit Converters (`18.0182`)
 *   3. Breath Fitness (BOLT & BPM) Evaluators
 *   4. Responsive Multi-Series SVG Chart Renderer
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
     1. AHA 2017 BLOOD PRESSURE CLASSIFIER
     -------------------------------------------------------------------------- */
  function classifyBP(sysVal, diaVal) {
    var sys = Number(sysVal);
    var dia = Number(diaVal);
    if (!isFinite(sys) || !isFinite(dia) || sys <= 0 || dia <= 0) {
      return { code: 'unknown', labelKey: 'statusNormal', badgeClass: 'bw-status-info', percent: 50, color: '#64748b' };
    }
    if (sys > 180 || dia > 120) {
      return { code: 'crisis', labelKey: 'statusCrisis', badgeClass: 'bw-status-danger', percent: 96, color: '#dc2626', isCrisis: true };
    }
    if (sys >= 140 || dia >= 90) {
      return { code: 'stage2', labelKey: 'statusStage2', badgeClass: 'bw-status-danger', percent: 82, color: '#dc2626' };
    }
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      return { code: 'stage1', labelKey: 'statusStage1', badgeClass: 'bw-status-stage1', percent: 62, color: '#ea580c' };
    }
    if (sys >= 120 && sys <= 129 && dia < 80) {
      return { code: 'elevated', labelKey: 'statusElevated', badgeClass: 'bw-status-elevated', percent: 42, color: '#d97706' };
    }
    return { code: 'normal', labelKey: 'statusNormal', badgeClass: 'bw-status-normal', percent: 18, color: '#10b981' };
  }

  /* --------------------------------------------------------------------------
     2. ADA 2024 BLOOD GLUCOSE CLASSIFIER & UNIT CONVERSION
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
      return { code: 'unknown', labelKey: 'statusNormal', badgeClass: 'bw-status-info', percent: 50, color: '#64748b' };
    }
    if (mg < 70) {
      return { code: 'hypo', labelKey: 'statusLow', badgeClass: 'bw-status-danger', percent: 8, color: '#dc2626', isHypo: true };
    }
    if (ctx === 'fasting') {
      if (mg >= 126) return { code: 'diabetes', labelKey: 'statusDiabetes', badgeClass: 'bw-status-danger', percent: 88, color: '#dc2626' };
      if (mg >= 100) return { code: 'prediabetes', labelKey: 'statusPrediabetes', badgeClass: 'bw-status-elevated', percent: 56, color: '#d97706' };
      return { code: 'normal', labelKey: 'statusNormal', badgeClass: 'bw-status-normal', percent: 28, color: '#10b981' };
    }
    if (mg >= 200) {
      return { code: 'diabetes', labelKey: 'statusDiabetes', badgeClass: 'bw-status-danger', percent: 88, color: '#dc2626' };
    }
    if (mg >= 140) {
      return { code: 'prediabetes', labelKey: 'statusPrediabetes', badgeClass: 'bw-status-elevated', percent: 56, color: '#d97706' };
    }
    return { code: 'normal', labelKey: 'statusNormal', badgeClass: 'bw-status-normal', percent: 28, color: '#10b981' };
  }

  /* --------------------------------------------------------------------------
     3. BOLT & RESPIRATORY RATE (BPM) CLINICAL EVALUATORS
     -------------------------------------------------------------------------- */
  function classifyBOLT(seconds) {
    var s = Number(seconds) || 0;
    if (s < 10) return { tier: 'poor', percent: 18, color: '#dc2626', badgeClass: 'bw-status-danger' };
    if (s < 20) return { tier: 'fair', percent: 44, color: '#d97706', badgeClass: 'bw-status-elevated' };
    if (s <= 30) return { tier: 'good', percent: 72, color: '#10b981', badgeClass: 'bw-status-normal' };
    return { tier: 'excellent', percent: 94, color: '#00897b', badgeClass: 'bw-status-info' };
  }

  function classifyBPM(bpm) {
    var b = Number(bpm) || 0;
    if (b > 20) return { tier: 'high', color: '#dc2626', badgeClass: 'bw-status-danger' };
    if (b >= 15) return { tier: 'moderate', color: '#d97706', badgeClass: 'bw-status-elevated' };
    if (b >= 10) return { tier: 'optimal', color: '#10b981', badgeClass: 'bw-status-normal' };
    return { tier: 'calm', color: '#00897b', badgeClass: 'bw-status-info' };
  }

  /* --------------------------------------------------------------------------
     4. ACCESSIBLE SVG LINE CHART BUILDER
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

    var W = 640, H = 250;
    var pad = { top: 20, right: 20, bottom: 36, left: 46 };
    var plotW = W - pad.left - pad.right;
    var plotH = H - pad.top - pad.bottom;

    var allVals = [];
    series.forEach(function (s) {
      s.values.forEach(function (v) { if (isFinite(v)) allVals.push(v); });
    });
    var minY = cfg.yMin !== undefined ? cfg.yMin : Math.max(0, Math.floor(Math.min.apply(null, allVals) * 0.85));
    var maxY = cfg.yMax !== undefined ? cfg.yMax : Math.ceil(Math.max.apply(null, allVals) * 1.12);
    if (maxY <= minY) maxY = minY + 10;

    function xAt(i) {
      if (labels.length === 1) return pad.left + plotW / 2;
      return pad.left + (i / (labels.length - 1)) * plotW;
    }
    function yAt(v) {
      return pad.top + plotH - ((v - minY) / (maxY - minY)) * plotH;
    }

    var svgParts = [
      '<svg viewBox="0 0 ' + W + ' ' + H + '" class="w-100 h-auto" role="img" aria-label="Trend Chart">'
    ];

    if (cfg.safeBand) {
      var topBand = yAt(Math.min(maxY, cfg.safeBand.max));
      var botBand = yAt(Math.max(minY, cfg.safeBand.min));
      svgParts.push(
        '<rect x="' + pad.left + '" y="' + topBand.toFixed(1) + '" width="' + plotW + '" height="' + Math.max(2, botBand - topBand).toFixed(1) + '" fill="' + (cfg.safeBand.color || 'rgba(16,185,129,0.10)') + '" rx="4" />'
      );
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
        svgParts.push('<polyline fill="none" stroke="' + s.color + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="' + pts.join(' ') + '" />');
      }
      s.values.forEach(function (v, idx) {
        if (!isFinite(v)) return;
        var cx = xAt(idx).toFixed(1);
        var cy = yAt(v).toFixed(1);
        var tip = xmlEsc((s.name || '') + ': ' + v + ' (' + labels[idx] + ')');
        svgParts.push(
          '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#ffffff" stroke="' + s.color + '" stroke-width="2.5">' +
          '<title>' + tip + '</title></circle>'
        );
      });
    });

    svgParts.push('</svg>');
    containerEl.innerHTML = svgParts.join('');
  }

  global.BWClinical = {
    GLUCOSE_FACTOR: GLUCOSE_FACTOR,
    classifyBP: classifyBP,
    mgdlToMmol: mgdlToMmol,
    mmolToMgdl: mmolToMgdl,
    classifyGlucose: classifyGlucose,
    classifyBOLT: classifyBOLT,
    classifyBPM: classifyBPM,
    renderSvgLineChart: renderSvgLineChart
  };
})(typeof window !== 'undefined' ? window : globalThis);
