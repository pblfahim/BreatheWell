/**
 * ============================================================================
 * @file health-charts.js
 * @module BreatheWell/HealthCharts
 * @description Time-series visual analytics and chart engine for BreatheWell.
 *              Generates responsive SVG line charts, shaded clinical target bands
 *              (AHA 2017 & ADA 2024 safe zones), cubic Bézier sparklines, rolling
 *              averages, compliance metrics, and rule-based diagnostic insights.
 * @author BreatheWell Development Team
 * @version 2.4.0
 * @license MIT
 * ============================================================================
 * 
 * TABLE OF CONTENTS:
 * 1. CONSTANTS, STORAGE KEYS & STATE
 * 2. INTERNATIONALIZATION (I18N) TRANSLATION DICTIONARY
 * 3. DATA LAYER (LOCALSTORAGE RETRIEVAL & NORMALIZATION)
 * 4. PULL-UP STATS & SPARKLINES COMPUTATION
 * 5. SVG CHART RENDERING & TIME-SERIES MATHEMATICS
 * 6. INTERACTIVE TOOLTIP BINDINGS & FOCUS MANAGEMENT
 * 7. SMART CLINICAL INSIGHTS GENERATOR
 * 8. DEMO DATA GENERATOR & ACCESSIBLE TOAST NOTIFICATIONS
 * 9. LANGUAGE SWITCHER & DOM SYNCHRONIZATION
 * 10. DOM READY BOOTSTRAP & EVENT LISTENERS
 * ============================================================================
 */

(function () {
  "use strict";

  /* ============================================================================
   * 1. CONSTANTS, STORAGE KEYS & STATE
   * ============================================================================
   */
  /** @const {string} HT_KEY - Primary storage key for normalized records */
  const HT_KEY = "bw_health_records_v1";

  /** @const {string} HT_KEY_LEGACY - Fallback storage key */
  const HT_KEY_LEGACY = "bw_health_tracker_records";

  /** @const {string} HT_LANG_KEY - Storage key for language preference */
  const HT_LANG_KEY = "bw_ht_lang_v1";

  /** @type {string} htLang - Active language code ('bn' | 'en') */
  let htLang = localStorage.getItem(HT_LANG_KEY) || localStorage.getItem("bw-lang") || "bn";

  /** @type {string} currentChartTimeframe - Active filter timeframe: '7' | '14' | '30' | 'all' */
  let currentChartTimeframe = "14";

  /**
   * DOM element getter shorthand.
   * @param {string} id - Target element ID.
   * @returns {HTMLElement|null} Found element or null.
   */
  const $ = id => document.getElementById(id);

  /* ============================================================================
   * 2. INTERNATIONALIZATION (I18N) TRANSLATION DICTIONARY
   * ============================================================================
   */
  const T = {
    bn: {
      navHome: "হোম",
      navExercises: "অনুশীলন",
      navTest: "শ্বাসের পরীক্ষা",
      navHealth: "স্বাস্থ্য ট্র্যাকার",
      navRx: "প্রেসক্রিপশন",
      navSafety: "নিরাপত্তা",
      heroBadge: "ভিজ্যুয়াল অ্যানালিটিক্স ও ধারাবাহিক পর্যবেক্ষণ",
      heroTitle: "📈 রক্তচাপ ও গ্লুকোজ ট্রেন্ড চার্ট",
      heroSub: "আপনার সংরক্ষিত স্বাস্থ্য তথ্যের ওপর ভিত্তি করে ইন্টারঅ্যাক্টিভ এসভিজি লাইন চার্ট, ক্লিনিক্যাল সেইফ জোন ও গভীর পর্যবেক্ষণ।",
      quickAdd: "নতুন রিডিং",
      quickTrends: "ট্রেন্ড চার্ট",
      quickLog: "ইতিহাস লগ",
      quickDemo: "নমুনা ডেটা",
      btnViewLog: "📋 ইতিহাস লগ দেখুন",
      statAvgBP: "গড় রক্তচাপ",
      statAvgBG: "গড় গ্লুকোজ",
      statInSafeBP: "স্বাভাবিক রক্তচাপ অনুপাত",
      statInSafeBG: "টার্গেট গ্লুকোজ অনুপাত",
      bpChartTitle: "রক্তচাপ ট্রেন্ড (mmHg)",
      bpChartSub: "সিস্টোলিক (লাল) ও ডায়াস্টোলিক (নীল) গতিবিধি",
      bgChartTitle: "রক্তের গ্লুকোজ ট্রেন্ড (mmol/L)",
      bgChartSub: "খালি পেট ও খাবার পরবর্তী গ্লুকোজ ওঠানামা",
      tf7d: "৭ দিন",
      tf14d: "১৪ দিন",
      tf30d: "৩০ দিন",
      tfAll: "সব",
      lblSystolic: "সিস্টোলিক",
      lblDiastolic: "ডায়াস্টোলিক",
      lblGlucose: "গ্লুকোজ",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      safeZoneText: "নিরাপদ জোন (১২০/৮০)",
      targetRangeText: "টার্গেট রেঞ্জ (৪.০-৭.৮)",
      chartNoData: "চার্ট তৈরির জন্য অন্তত ২টি রেকর্ড প্রয়োজন",
      chartNoDataSub: "নতুন রিডিং যোগ করুন বা নিচে নমুনা ডেটা লোড করুন।",
      addReadingBtn: "➕ নতুন রিডিং যোগ করুন",
      loadDemoBtn: "🧪 নমুনা ডেটা লোড করুন",
      insightsTitle: "স্মার্ট স্বাস্থ্য অন্তর্দৃষ্টি ও বিশ্লেষণ",
      insightStableBP: "আপনার রক্তচাপ গত ১৪ দিনে সম্পূর্ণ স্থিতিশীল ও নিয়ন্ত্রিত সীমায় রয়েছে।",
      insightElevatedBP: "সতর্কতা: আপনার রক্তচাপে সাম্প্রতিক কিছু বৃদ্ধিমুখী প্রবণতা দেখা যাচ্ছে। লবণ নিয়ন্ত্রণ ও বিশ্রাম বজায় রাখুন।",
      insightStableBG: "আপনার রক্তের গ্লুকোজ বেশিরভাগ সময় নির্ধারিত ক্লিনিক্যাল টার্গেটের মধ্যে রয়েছে।",
      insightHighBG: "মনোযোগ দিন: সাম্প্রতিক কিছু সুগার রিডিং স্বাভাবিক মাত্রার ওপরে ছিল। খাদ্যাভ্যাস ও নিয়মিত ওষুধ যাচাই করুন।",
      insightNeedsMore: "আরও অন্তর্দৃষ্টি পাওয়ার জন্য প্রতিদিন নিয়মিত রক্তচাপ ও সুগার পরিমাপ করুন।",
      toastDemoLoaded: "✅ ৭ দিনের ক্লিনিক্যাল নমুনা ডেটা সফলভাবে লোড হয়েছে!"
    },
    en: {
      navHome: "Home",
      navExercises: "Exercises",
      navTest: "Breath Test",
      navHealth: "Health Tracker",
      navRx: "Prescriptions",
      navSafety: "Safety",
      heroBadge: "Visual Analytics & Continuous Monitoring",
      heroTitle: "📈 Blood Pressure & Glucose Trend Charts",
      heroSub: "Interactive SVG line charts with clinical target bands, rolling averages, and evidence-based insights.",
      quickAdd: "Add Reading",
      quickTrends: "Trends & Charts",
      quickLog: "History Log",
      quickDemo: "Demo Data",
      btnViewLog: "📋 View History Log",
      statAvgBP: "Average BP",
      statAvgBG: "Average Glucose",
      statInSafeBP: "Normal BP Ratio",
      statInSafeBG: "Target Glucose Ratio",
      bpChartTitle: "Blood Pressure Trends (mmHg)",
      bpChartSub: "Systolic (red) and diastolic (blue) progression over time",
      bgChartTitle: "Blood Glucose Trends (mmol/L)",
      bgChartSub: "Fasting & postprandial glycemic fluctuations",
      tf7d: "7 Days",
      tf14d: "14 Days",
      tf30d: "30 Days",
      tfAll: "All",
      lblSystolic: "Systolic",
      lblDiastolic: "Diastolic",
      lblGlucose: "Glucose",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      safeZoneText: "Safe Zone (120/80)",
      targetRangeText: "Target Range (4.0-7.8)",
      chartNoData: "At least 2 readings are required to render charts",
      chartNoDataSub: "Log new vitals or load sample data below.",
      addReadingBtn: "➕ Add New Reading",
      loadDemoBtn: "🧪 Load Demo Data",
      insightsTitle: "Smart Clinical Insights & Overview",
      insightStableBP: "Your blood pressure has remained predominantly stable within optimal limits over the analyzed period.",
      insightElevatedBP: "Attention: Upward blood pressure trend detected. Monitor sodium intake and maintain stress reduction.",
      insightStableBG: "Your blood glucose control is well maintained within clinical ADA 2024 targets.",
      insightHighBG: "Attention: Several recent glycemic readings were above target. Review nutrition and medication adherence.",
      insightNeedsMore: "Log readings consistently across morning and evening to generate deeper analytical insights.",
      toastDemoLoaded: "✅ 7-day clinical demo data successfully loaded!"
    }
  };

  /**
   * Retrieves localized string by key with language fallback.
   * @param {string} key - Dictionary key.
   * @returns {string} Localized string.
   */
  function t(key) {
    return (T[htLang] && T[htLang][key]) || (T.en && T.en[key]) || key;
  }

  /**
   * Formats a timestamp for chart tooltips.
   * @param {string} iso - ISO date string.
   * @returns {string} Localized date-time string.
   */
  function htFormatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(htLang === "bn" ? "bn-BD" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  /**
   * Generates a collision-resistant pseudo-UUID.
   * @returns {string} Unique string identifier.
   */
  function htUUID() {
    return "rec_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 5);
  }

  /* ============================================================================
   * 3. DATA LAYER (LOCALSTORAGE RETRIEVAL & NORMALIZATION)
   * ============================================================================
   */
  /**
   * Loads records from LocalStorage and standardizes property nomenclature across versions.
   * @returns {Array<Object>} Normalized record array.
   */
  function htLoadRecords() {
    try {
      const raw = localStorage.getItem(HT_KEY) || localStorage.getItem(HT_KEY_LEGACY) || "[]";
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];

      data.forEach(r => {
        if (r.type === "bp") {
          if (r.systolic && !r.sys) r.sys = Number(r.systolic);
          if (r.diastolic && !r.dia) r.dia = Number(r.diastolic);
          if (r.sys && !r.systolic) r.systolic = Number(r.sys);
          if (r.dia && !r.diastolic) r.diastolic = Number(r.dia);
        } else if (r.type === "bg") {
          if (r.value != null) r.value = Number(r.value);
        }
      });
      return data;
    } catch {
      return [];
    }
  }

  /**
   * Atomically saves records to both primary and legacy storage keys.
   * @param {Array<Object>} records - Array to persist.
   */
  function htSaveRecords(records) {
    try {
      const str = JSON.stringify(records);
      localStorage.setItem(HT_KEY, str);
      localStorage.setItem(HT_KEY_LEGACY, str);
    } catch (e) {
      console.warn("Storage save failed:", e);
    }
  }

  /* ============================================================================
   * 4. PULL-UP STATS & SPARKLINES COMPUTATION
   * ============================================================================
   */
  /**
   * Computes top-level analytical cards: average BP, average BG, safe-zone percentages,
   * and renders mini SVG sparkline bars representing recent momentum.
   */
  function renderStats() {
    const records = htLoadRecords();
    const bpRecs = records.filter(r => r.type === "bp");
    const bgRecs = records.filter(r => r.type === "bg");

    // 1. Average BP
    const avgBPEl = $("hcStatBPVal") || $("tcStatBPVal") || $("statAvgBP");
    const avgBPBadge = $("hcStatBPBadge") || $("tcStatBPBadge") || $("statAvgBPBadge");
    const bpSubEl = $("hcStatBPSub") || $("tcStatBPSub");
    const bpSpark = $("hcBPSparkline") || $("tcBPSparkline") || $("bpSparkline");

    if (bpRecs.length) {
      const avgSys = Math.round(bpRecs.reduce((s, r) => s + r.sys, 0) / bpRecs.length);
      const avgDia = Math.round(bpRecs.reduce((s, r) => s + r.dia, 0) / bpRecs.length);
      if (avgBPEl) avgBPEl.textContent = `${avgSys}/${avgDia}`;
      if (bpSubEl) bpSubEl.textContent = htLang === "bn" ? `${bpRecs.length}টি রেকর্ড` : `${bpRecs.length} readings`;

      if (avgBPBadge) {
        if (avgSys <= 120 && avgDia <= 80) {
          avgBPBadge.className = "hc-stat-badge tc-stat-badge normal";
          avgBPBadge.textContent = htLang === "bn" ? "✅ স্বাভাবিক" : "Normal";
        } else if (avgSys <= 129 && avgDia < 80) {
          avgBPBadge.className = "hc-stat-badge tc-stat-badge elevated";
          avgBPBadge.textContent = htLang === "bn" ? "⚠️ কিছুটা বেশি" : "Elevated";
        } else {
          avgBPBadge.className = "hc-stat-badge tc-stat-badge high";
          avgBPBadge.textContent = htLang === "bn" ? "🚨 উচ্চ" : "High";
        }
      }
    } else {
      if (avgBPEl) avgBPEl.textContent = "—";
      if (bpSubEl) bpSubEl.textContent = "—";
      if (avgBPBadge) {
        avgBPBadge.className = "hc-stat-badge tc-stat-badge neutral";
        avgBPBadge.textContent = "—";
      }
    }

    // 2. Average BG
    const avgBGEl = $("hcStatBGVal") || $("tcStatBGVal") || $("statAvgBG");
    const avgBGBadge = $("hcStatBGBadge") || $("tcStatBGBadge") || $("statAvgBGBadge");
    const bgSubEl = $("hcStatBGSub") || $("tcStatBGSub");
    const bgSpark = $("hcBGSparkline") || $("tcBGSparkline") || $("bgSparkline");

    if (bgRecs.length) {
      const avgVal = (bgRecs.reduce((s, r) => s + r.value, 0) / bgRecs.length).toFixed(1);
      if (avgBGEl) avgBGEl.textContent = `${avgVal}`;
      if (bgSubEl) bgSubEl.textContent = htLang === "bn" ? `${bgRecs.length}টি রেকর্ড` : `${bgRecs.length} readings`;

      if (avgBGBadge) {
        const num = parseFloat(avgVal);
        if (num <= 5.5) {
          avgBGBadge.className = "hc-stat-badge tc-stat-badge normal";
          avgBGBadge.textContent = htLang === "bn" ? "✅ স্বাভাবিক" : "Normal";
        } else if (num <= 6.9) {
          avgBGBadge.className = "hc-stat-badge tc-stat-badge elevated";
          avgBGBadge.textContent = htLang === "bn" ? "⚠️ প্রি-ডায়াবেটিস" : "Pre-diab";
        } else {
          avgBGBadge.className = "hc-stat-badge tc-stat-badge high";
          avgBGBadge.textContent = htLang === "bn" ? "🚨 ডায়াবেটিস" : "Diabetic";
        }
      }
    } else {
      if (avgBGEl) avgBGEl.textContent = "—";
      if (bgSubEl) bgSubEl.textContent = "—";
      if (avgBGBadge) {
        avgBGBadge.className = "hc-stat-badge tc-stat-badge neutral";
        avgBGBadge.textContent = "—";
      }
    }

    // 3. Today & Streak
    const todayIso = new Date().toDateString();
    let todayCount = 0;
    const uniqueDays = new Set();
    records.forEach(r => {
      const d = new Date(r.date);
      if (d.toDateString() === todayIso) todayCount++;
      uniqueDays.add(d.toDateString());
    });

    const todayVal = $("hcStatTodayVal") || $("tcStatTodayVal") || $("statTodayVal");
    const todaySub = $("hcStatTodaySub") || $("tcStatTodaySub") || $("statTodaySub");
    if (todayVal) todayVal.textContent = String(todayCount);
    if (todaySub) todaySub.textContent = htLang === "bn" ? `${todayCount}টি এন্ট্রি` : `${todayCount} logged`;

    const streakVal = $("hcStatStreakVal") || $("tcStatStreakVal") || $("statStreakVal");
    const streakSub = $("hcStatStreakSub") || $("tcStatStreakSub") || $("statStreakSub");
    if (streakVal) streakVal.textContent = String(uniqueDays.size);
    if (streakSub) streakSub.textContent = htLang === "bn" ? "দিন সক্রিয়" : "active days";

    // 4. Safe Zone Compliance Percentages
    const bpSafeEl = $("statInSafeBP");
    const bgSafeEl = $("statInSafeBG");

    if (bpRecs.length && bpSafeEl) {
      const inSafe = bpRecs.filter(r => r.sys <= 120 && r.dia <= 80).length;
      const pct = Math.round((inSafe / bpRecs.length) * 100);
      bpSafeEl.textContent = `${pct}%`;
    } else if (bpSafeEl) {
      bpSafeEl.textContent = "—";
    }

    if (bgRecs.length && bgSafeEl) {
      const inTarget = bgRecs.filter(r => r.value >= 4.0 && r.value <= 7.8).length;
      const pct = Math.round((inTarget / bgRecs.length) * 100);
      bgSafeEl.textContent = `${pct}%`;
    } else if (bgSafeEl) {
      bgSafeEl.textContent = "—";
    }

    // 5. Sparkline Visualization Bars
    if (bpSpark && bpRecs.length) {
      const vals = bpRecs.map(r => r.sys);
      const mx = Math.max(...vals, 140);
      bpSpark.innerHTML = vals.map((v, i) => `
        <div class="hc-spark-bar tc-spark-bar ${i === vals.length - 1 ? "active" : ""}"
          style="height:${Math.max(4, Math.round((v / mx) * 26))}px;color:#ef4444;"></div>
      `).join("");
    }

    if (bgSpark && bgRecs.length) {
      const vals = bgRecs.map(r => r.value);
      const mx = Math.max(...vals, 15);
      bgSpark.innerHTML = vals.map((v, i) => `
        <div class="hc-spark-bar tc-spark-bar ${i === vals.length - 1 ? "active" : ""}"
          style="height:${Math.max(4, Math.round((v / mx) * 26))}px;color:#8b5cf6;"></div>
      `).join("");
    }
  }

  /* ============================================================================
   * 5. SVG CHART RENDERING & TIME-SERIES MATHEMATICS
   * ============================================================================
   */
  /**
   * Filters records according to the active timeframe ('7', '14', '30', 'all')
   * and sorts chronologically ascending for line chart graphing.
   * @param {"bp"|"bg"} type - Record type.
   * @returns {Array<Object>} Filtered and sorted record array.
   */
  function getFilteredRecords(type) {
    const all = htLoadRecords().filter(r => r.type === type);
    if (currentChartTimeframe === "all") {
      return all.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    const days = parseInt(currentChartTimeframe, 10) || 14;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return all
      .filter(r => new Date(r.date) >= cutoff)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Builds and mounts the Blood Pressure SVG chart with AHA safe-zone band.
   */
  function renderBPChart() {
    const wrap = $("bpChartWrap");
    const metricsWrap = $("bpMetricChips");
    if (!wrap) return;

    const data = getFilteredRecords("bp");

    if (data.length < 2) {
      wrap.innerHTML = `
        <div class="hc-chart-empty tc-chart-empty">
          <i class="bi bi-graph-up text-danger"></i>
          <p>${t("chartNoData")}<br><span class="small opacity-75">${t("chartNoDataSub")}</span></p>
          <div class="d-flex gap-2 mt-3">
            <a href="health-reading.html#entrySection" class="btn btn-sm btn-primary rounded-pill px-3">${t("addReadingBtn")}</a>
            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="window.htLoadDemo()">${t("loadDemoBtn")}</button>
          </div>
        </div>`;
      if (metricsWrap) metricsWrap.innerHTML = "";
      return;
    }

    // Summary Metrics Calculation
    const avgSys = Math.round(data.reduce((s, r) => s + r.sys, 0) / data.length);
    const avgDia = Math.round(data.reduce((s, r) => s + r.dia, 0) / data.length);
    const inSafe = Math.round((data.filter(r => r.sys <= 120 && r.dia <= 80).length / data.length) * 100);

    if (metricsWrap) {
      metricsWrap.innerHTML = `
        <span class="hc-metric-chip tc-metric-chip">${htLang === "bn" ? "গড় রিডিং" : "Average"}: <strong>${avgSys}/${avgDia} mmHg</strong></span>
        <span class="hc-metric-chip tc-metric-chip">${htLang === "bn" ? "নিরাপদ জোনে" : "In Safe Zone"}: <strong class="text-success">${inSafe}%</strong></span>
      `;
    }

    wrap.innerHTML = renderLineChart(data, [
      { key: "sys", color: "var(--hc-systolic, #ef4444)", label: `${t("lblSystolic")} (${t("unitMmhg")})` },
      { key: "dia", color: "var(--hc-diastolic, #3b82f6)", label: `${t("lblDiastolic")} (${t("unitMmhg")})` },
    ], "bp");
  }

  /**
   * Builds and mounts the Blood Glucose SVG chart with ADA target band.
   */
  function renderBGChart() {
    const wrap = $("bgChartWrap");
    const metricsWrap = $("bgMetricChips");
    if (!wrap) return;

    const data = getFilteredRecords("bg");

    if (data.length < 2) {
      wrap.innerHTML = `
        <div class="hc-chart-empty tc-chart-empty">
          <i class="bi bi-droplet-half" style="color:#8b5cf6"></i>
          <p>${t("chartNoData")}<br><span class="small opacity-75">${t("chartNoDataSub")}</span></p>
          <div class="d-flex gap-2 mt-3">
            <a href="health-reading.html#entrySection" class="btn btn-sm btn-primary rounded-pill px-3">${t("addReadingBtn")}</a>
            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="window.htLoadDemo()">${t("loadDemoBtn")}</button>
          </div>
        </div>`;
      if (metricsWrap) metricsWrap.innerHTML = "";
      return;
    }

    const avgVal = (data.reduce((s, r) => s + r.value, 0) / data.length).toFixed(1);
    const inTarget = Math.round((data.filter(r => r.value >= 4.0 && r.value <= 7.8).length / data.length) * 100);

    if (metricsWrap) {
      metricsWrap.innerHTML = `
        <span class="hc-metric-chip tc-metric-chip">${htLang === "bn" ? "গড় সুগার" : "Average"}: <strong>${avgVal} mmol/L</strong></span>
        <span class="hc-metric-chip tc-metric-chip">${htLang === "bn" ? "টার্গেট রেঞ্জে" : "In Target"}: <strong class="text-success">${inTarget}%</strong></span>
      `;
    }

    wrap.innerHTML = renderLineChart(data, [
      { key: "value", color: "var(--hc-glucose, #8b5cf6)", label: `${t("lblGlucose")} (${t("unitMmol")})` },
    ], "bg");
  }

  /**
   * Pure mathematical SVG line chart generator.
   * Maps time-series values to SVG viewBox coordinates with automatic padding,
   * horizontal reference grid lines, clinical safe bands, and interactive data nodes.
   *
   * @param {Array<Object>} data - Chronologically ordered data points.
   * @param {Array<{key: string, color: string, label: string}>} series - Series configuration.
   * @param {"bp"|"bg"} chartType - Diagnostic chart type.
   * @returns {string} Raw SVG string markup.
   */
  function renderLineChart(data, series, chartType) {
    const W = 620, H = 230, PAD = 42;
    const drawW = W - PAD * 2;
    const drawH = H - PAD * 2;

    let minVal = Infinity, maxVal = -Infinity;
    data.forEach(d => {
      series.forEach(s => {
        const v = d[s.key];
        if (v != null && !isNaN(v)) {
          if (v < minVal) minVal = v;
          if (v > maxVal) maxVal = v;
        }
      });
    });

    if (minVal === Infinity) return "";

    // Add 15% breathing room top and bottom of value scale
    const range = maxVal - minVal || 1;
    minVal = Math.max(0, minVal - range * 0.15);
    maxVal = maxVal + range * 0.15;
    const valRange = maxVal - minVal || 1;

    /** Coordinate transformation function: (index, value) -> {x, y} */
    const toXY = (i, val) => ({
      x: PAD + (i / Math.max(1, data.length - 1)) * drawW,
      y: PAD + drawH - ((val - minVal) / valRange) * drawH,
    });

    // Shaded Safe-Zone Target Band
    let targetBand = "";
    if (chartType === "bp") {
      const yTop = toXY(0, Math.min(maxVal, 120)).y;
      const yBtm = toXY(0, Math.max(minVal, 90)).y;
      if (yBtm > yTop) {
        targetBand = `<rect x="${PAD}" y="${yTop}" width="${drawW}" height="${yBtm - yTop}" fill="#22c55e" opacity="0.09"/>
                      <text x="${W - PAD - 4}" y="${yTop + 12}" font-size="8.5" fill="#16a34a" font-weight="bold" text-anchor="end">${t("safeZoneText")}</text>`;
      }
    } else if (chartType === "bg") {
      const yTop = toXY(0, Math.min(maxVal, 7.8)).y;
      const yBtm = toXY(0, Math.max(minVal, 4.0)).y;
      if (yBtm > yTop) {
        targetBand = `<rect x="${PAD}" y="${yTop}" width="${drawW}" height="${yBtm - yTop}" fill="#22c55e" opacity="0.09"/>
                      <text x="${W - PAD - 4}" y="${yTop + 12}" font-size="8.5" fill="#16a34a" font-weight="bold" text-anchor="end">${t("targetRangeText")}</text>`;
      }
    }

    // Gridlines (0%, 25%, 50%, 75%, 100%)
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(lvl => {
      const y = PAD + drawH - lvl * drawH;
      const rawV = minVal + lvl * valRange;
      const v = chartType === "bg" ? rawV.toFixed(1) : Math.round(rawV);
      return `<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>
              <text x="${PAD - 6}" y="${y + 4}" font-size="9" fill="#94a3b8" text-anchor="end">${v}</text>`;
    }).join("");

    // Horizontal Date Axis Labels
    const xLabels = data.map((d, i) => {
      const pt = toXY(i, minVal);
      const date = new Date(d.date);
      const label = `${date.getDate()}/${date.getMonth() + 1}`;
      const show = data.length <= 7 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0;
      return show
        ? `<text x="${pt.x}" y="${H - 10}" font-size="9" fill="#94a3b8" text-anchor="middle">${label}</text>`
        : "";
    }).join("");

    // Series Polylines & Shaded Gradient Fills
    const seriesSVG = series.map(s => {
      const pts = data.map((d, i) => {
        const v = d[s.key];
        if (v == null || isNaN(v)) return null;
        return toXY(i, v);
      }).filter(Boolean);

      if (pts.length < 2) return "";

      const polyPoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      const areaPoints = `${pts[0].x.toFixed(1)},${PAD + drawH} ${polyPoints} ${pts[pts.length-1].x.toFixed(1)},${PAD + drawH}`;

      const dots = pts.map((p, i) => {
        const d = data[i];
        const valText = chartType === "bp"
          ? `${d.sys}/${d.dia} mmHg`
          : `${Number(d.value).toFixed(1)} mmol/L`;
        return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="${s.color}" stroke="#fff" stroke-width="2"
          data-chart-tooltip="${valText} · ${htFormatDate(d.date)}"
          class="hc-chart-dot tc-chart-dot" style="cursor:pointer"/>`;
      }).join("");

      return `
        <polygon points="${areaPoints}" fill="${s.color}" opacity="0.08"/>
        <polyline points="${polyPoints}" fill="none" stroke="${s.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        ${dots}`;
    }).join("");

    return `
      <svg viewBox="0 0 ${W} ${H}" class="hc-chart-svg tc-chart-svg" preserveAspectRatio="none">
        ${targetBand}
        ${gridLines}
        ${xLabels}
        ${seriesSVG}
      </svg>
      <div class="hc-chart-tooltip tc-chart-tooltip" id="tcTooltip_${chartType}"></div>`;
  }

  /* ============================================================================
   * 6. INTERACTIVE TOOLTIP BINDINGS & FOCUS MANAGEMENT
   * ============================================================================
   */
  /**
   * Attaches mousemove and hover tracking to SVG data points for popover display.
   */
  function bindChartTooltips() {
    ["bp", "bg"].forEach(type => {
      const wrap = $(`${type}ChartWrap`);
      const tooltip = $(`tcTooltip_${type}`);
      if (!wrap || !tooltip) return;

      wrap.addEventListener("mousemove", e => {
        const dot = e.target.closest(".hc-chart-dot, .tc-chart-dot");
        if (dot && dot.dataset.chartTooltip) {
          const wrapRect = wrap.getBoundingClientRect();
          const x = e.clientX - wrapRect.left;
          const y = e.clientY - wrapRect.top;
          tooltip.textContent = dot.dataset.chartTooltip;
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;
          tooltip.classList.add("visible");
        } else {
          tooltip.classList.remove("visible");
        }
      });

      wrap.addEventListener("mouseleave", () => {
        tooltip.classList.remove("visible");
      });
    });
  }

  /* ============================================================================
   * 7. SMART CLINICAL INSIGHTS GENERATOR
   * ============================================================================
   */
  /**
   * Generates automated rule-based clinical health insights summarizing trends.
   */
  function renderInsights() {
    const wrap = $("hcInsightBody") || $("tcInsightBody") || $("smartInsightsBody");
    const chipsWrap = $("hcInsightChips") || $("tcInsightChips") || $("smartInsightsChips");
    const card = $("hcInsightCard") || $("tcInsightCard");
    if (!wrap) return;

    const bpRecs = getFilteredRecords("bp");
    const bgRecs = getFilteredRecords("bg");

    if (bpRecs.length < 2 && bgRecs.length < 2) {
      if (card) card.classList.add("d-none");
      wrap.textContent = t("insightNeedsMore");
      if (chipsWrap) chipsWrap.innerHTML = "";
      return;
    }

    if (card) card.classList.remove("d-none");
    const bullets = [];
    const chips = [];

    if (bpRecs.length >= 2) {
      const avgSys = bpRecs.reduce((s, r) => s + r.sys, 0) / bpRecs.length;
      if (avgSys <= 120) {
        bullets.push(t("insightStableBP"));
        chips.push(`<span class="hc-insight-chip tc-insight-chip">🩺 ${htLang === "bn" ? "স্থিতিশীল রক্তচাপ" : "Stable BP"}</span>`);
      } else {
        bullets.push(t("insightElevatedBP"));
        chips.push(`<span class="hc-insight-chip tc-insight-chip text-danger">⚠️ ${htLang === "bn" ? "উচ্চতর রক্তচাপ সতর্কতা" : "Elevated BP Alert"}</span>`);
      }
    }

    if (bgRecs.length >= 2) {
      const avgBG = bgRecs.reduce((s, r) => s + r.value, 0) / bgRecs.length;
      if (avgBG <= 7.0) {
        bullets.push(t("insightStableBG"));
        chips.push(`<span class="hc-insight-chip tc-insight-chip">🩸 ${htLang === "bn" ? "নিয়ন্ত্রিত গ্লুকোজ" : "Controlled Glucose"}</span>`);
      } else {
        bullets.push(t("insightHighBG"));
        chips.push(`<span class="hc-insight-chip tc-insight-chip text-warning">⚠️ ${htLang === "bn" ? "সুগার ট্র্যাকিং সতর্কতা" : "Glucose Alert"}</span>`);
      }
    }

    if (chipsWrap) chipsWrap.innerHTML = chips.join("");
    wrap.innerHTML = bullets.map(b => `<p class="mb-2">💡 ${b}</p>`).join("");
  }

  /* ============================================================================
   * 8. DEMO DATA GENERATOR & ACCESSIBLE TOAST NOTIFICATIONS
   * ============================================================================
   */
  /**
   * Displays an accessible floating toast message.
   * @param {string} msg - Message to display.
   * @param {"info"|"success"|"warning"} [type="info"] - Toast visual category.
   */
  function htToast(msg, type = "info") {
    const stack = $("hcToastStack") || $("tcToastStack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = `hc-toast tc-toast ${type}`;
    toast.innerHTML = `<i class="bi bi-info-circle-fill"></i><span>${msg}</span>`;
    stack.appendChild(toast);
    setTimeout(() => {
      if (toast.remove) toast.remove();
      else if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

  /**
   * Injects 7 days of realistic clinical demo data into LocalStorage for instant testing.
   */
  function htLoadDemo() {
    const demo = [];
    const now = new Date();
    const bpSamples = [
      { sys: 118, dia: 76 }, { sys: 122, dia: 80 }, { sys: 126, dia: 82 },
      { sys: 119, dia: 78 }, { sys: 132, dia: 84 }, { sys: 120, dia: 79 },
      { sys: 116, dia: 75 }
    ];
    const bgSamples = [
      { value: 5.1, timing: "fasting" }, { value: 7.5, timing: "postmeal" },
      { value: 5.4, timing: "fasting" }, { value: 7.9, timing: "postmeal" },
      { value: 4.9, timing: "fasting" }, { value: 7.1, timing: "random" },
      { value: 5.2, timing: "bedtime" }
    ];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      d.setHours(8, 15, 0, 0);
      demo.push({
        type: "bp",
        id: htUUID(),
        date: d.toISOString(),
        sys: bpSamples[6 - i].sys,
        dia: bpSamples[6 - i].dia,
        arm: "right",
        notes: "নমুনা রিডিং",
        status: bpSamples[6 - i].sys <= 120 ? "normal" : "elevated"
      });

      d.setHours(10, 30, 0, 0);
      demo.push({
        type: "bg",
        id: htUUID(),
        date: d.toISOString(),
        value: bgSamples[6 - i].value,
        timing: bgSamples[6 - i].timing,
        notes: "নমুনা সুগার রিডিং",
        status: "normal"
      });
    }

    htSaveRecords(demo);
    renderStats();
    renderBPChart();
    renderBGChart();
    bindChartTooltips();
    renderInsights();
    htToast(t("toastDemoLoaded"), "success");
  }

  // Globally exposed for demo button click handler
  window.htLoadDemo = htLoadDemo;

  /* ============================================================================
   * 9. LANGUAGE SWITCHER & DOM SYNCHRONIZATION
   * ============================================================================
   */
  /**
   * Sets language preference, updates DOM text nodes, and re-renders analytical graphs.
   * Supports both `data-hc-i18n` (modern) and `data-tc-i18n` (legacy) attribute selectors.
   * @param {"bn"|"en"} lang - Selected language.
   */
  function htSetLang(lang) {
    htLang = lang;
    try {
      localStorage.setItem(HT_LANG_KEY, lang);
      localStorage.setItem("bw-lang", lang);
    } catch (_) {}

    document.documentElement.lang = lang;
    document.body.className = lang;

    document.querySelectorAll("[data-hc-i18n], [data-tc-i18n]").forEach(el => {
      const k = el.dataset.hcI18n || el.dataset.tcI18n;
      if (k) el.textContent = t(k);
    });

    const toggleBtn = $("hcLangToggle") || $("tcLangToggle");
    if (toggleBtn) toggleBtn.textContent = lang === "bn" ? "English" : "বাংলা";

    renderStats();
    renderBPChart();
    renderBGChart();
    bindChartTooltips();
    renderInsights();
  }

  // Globally exposed for language toggle inspection
  window.hcSetLang = htSetLang;
  window.htSetLang = htSetLang;

  /* ============================================================================
   * 10. DOM READY BOOTSTRAP & EVENT LISTENERS
   * ============================================================================
   */
  function init() {
    htSetLang(htLang);

    // Language toggle button in navbar
    const langBtn = $("hcLangToggle") || $("tcLangToggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        htSetLang(htLang === "bn" ? "en" : "bn");
      });
    }

    // Timeframe switcher buttons (7D, 14D, 30D, All)
    document.querySelectorAll(".hc-tf-btn, .tc-tf-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentChartTimeframe = btn.dataset.tf;
        document.querySelectorAll(".hc-tf-btn, .tc-tf-btn").forEach(b => {
          b.classList.toggle("active", b.dataset.tf === currentChartTimeframe);
        });
        renderBPChart();
        renderBGChart();
        bindChartTooltips();
      });
    });

    // Mobile sidebar language pills
    document.querySelectorAll(".mobile-lang-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.lang;
        if (target) htSetLang(target);
      });
    });

    // Dynamic Sticky Navbar Offset Synchronizer
    function syncStickyNavOffset() {
      const nav = document.querySelector("nav.navbar");
      if (nav && document.documentElement && document.documentElement.style && document.documentElement.style.setProperty) {
        document.documentElement.style.setProperty("--bw-navbar-height", `${nav.offsetHeight}px`);
      }
    }
    syncStickyNavOffset();
    window.addEventListener("resize", syncStickyNavOffset);

    // Auto-scroll active tab into view on mobile touch devices
    const activeHeroTab = document.querySelector(".ht-hero-tab.active");
    if (activeHeroTab && typeof activeHeroTab.scrollIntoView === "function") {
      try {
        activeHeroTab.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      } catch (_) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
