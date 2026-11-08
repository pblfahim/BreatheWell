/**
 * ============================================================================
 * BreatheWell — Trends & Charts Controller (trends-charts.js)
 * Interactive Visual Analytics, SVG Line Charts, Safe-Zone Bands & Insights
 * ============================================================================
 */

(function () {
  "use strict";

  const HT_KEY = "bw_health_records_v1";
  const HT_LANG_KEY = "bw_ht_lang_v1";
  let htLang = localStorage.getItem(HT_LANG_KEY) || localStorage.getItem("bw-lang") || "bn";
  let currentChartTimeframe = "14d";

  const $ = id => document.getElementById(id);

  /* ============================================================================
   * 1. INTERNATIONALIZATION (I18N)
   * ============================================================================ */
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
      quickAdd: "➕ নতুন রিডিং",
      quickTrends: "📈 ট্রেন্ড চার্ট",
      quickLog: "📋 ইতিহাস লগ",
      quickDemo: "🧪 নমুনা ডেটা",
      statLatestBP: "সর্বশেষ রক্তচাপ",
      statLatestBG: "সর্বশেষ গ্লুকোজ",
      statToday: "আজকের রিডিং",
      statStreak: "লগিং স্ট্রিক",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      lblSystolic: "সিস্টোলিক",
      lblDiastolic: "ডায়াস্টোলিক",
      lblGlucose: "গ্লুকোজ",
      chartBPTitle: "রক্তচাপের ধারাবাহিক প্রবণতা",
      chartBPSub: "নিরাপদ জোন চিহ্নিত (৯০–১২০ mmHg সিস্টোলিক)",
      chartBGTitle: "গ্লুকোজের ধারাবাহিক প্রবণতা",
      chartBGSub: "টার্গেট রেঞ্জ হাইলাইটেড (৪.০–৭.৮ mmol/L)",
      tf7d: "৭ দিন",
      tf14d: "১৪ দিন",
      tf30d: "৩০ দিন",
      tfAll: "সব",
      chartNoData: "চার্ট তৈরির জন্য অন্তত ২টি রেকর্ড প্রয়োজন।",
      chartNoDataSub: "নতুন রিডিং যুক্ত করুন অথবা নমুনা ডেটা লোড করুন।",
      loadDemoBtn: "🧪 নমুনা ডেটা লোড করুন",
      addReadingBtn: "➕ নতুন রিডিং যোগ করুন",
      safeZoneText: "নিরাপদ জোন (৯০–১২০)",
      targetRangeText: "টার্গেট রেঞ্জ (৪.০–৭.৮ mmol/L)",
      insightTitle: "স্মার্ট স্বাস্থ্য অ্যানালিটিক্স",
      insightSub: "গত ৭ দিনের রেকর্ড বিশ্লেষণ",
      days: "দিন",
      readings: "টি রিডিং",
      toastDemoLoaded: "৭ দিনের নমুনা ডেটা সফলভাবে লোড হয়েছে!",
      toastLangChanged: "ভাষা পরিবর্তিত হয়েছে",
      footerTag: "প্রতিটি নিঃশ্বাসে একটু প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।"
    },
    en: {
      navHome: "Home",
      navExercises: "Exercises",
      navTest: "Breath Test",
      navHealth: "Health Tracker",
      navRx: "Prescriptions",
      navSafety: "Safety",
      heroBadge: "Visual Analytics & Continuous Monitoring",
      heroTitle: "📈 Blood Pressure & Glucose Trends",
      heroSub: "Interactive SVG line charts, clinical safe-zones, and automated 7-day health analytics from your logged readings.",
      quickAdd: "➕ Add Reading",
      quickTrends: "📈 Trends & Charts",
      quickLog: "📋 History Log",
      quickDemo: "🧪 Demo Data",
      statLatestBP: "Latest BP",
      statLatestBG: "Latest Glucose",
      statToday: "Today's Readings",
      statStreak: "Logging Streak",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      lblSystolic: "Systolic",
      lblDiastolic: "Diastolic",
      lblGlucose: "Glucose",
      chartBPTitle: "Blood Pressure Trends",
      chartBPSub: "Safe Zone Highlighted (90–120 mmHg Systolic)",
      chartBGTitle: "Blood Glucose Trends",
      chartBGSub: "Target Range Highlighted (4.0–7.8 mmol/L)",
      tf7d: "7 Days",
      tf14d: "14 Days",
      tf30d: "30 Days",
      tfAll: "All Time",
      chartNoData: "At least 2 records are required to render trend lines.",
      chartNoDataSub: "Log new readings or load demo sample data.",
      loadDemoBtn: "🧪 Load Demo Data",
      addReadingBtn: "➕ Add New Reading",
      safeZoneText: "Safe Zone (90–120)",
      targetRangeText: "Target Range (4.0–7.8 mmol/L)",
      insightTitle: "Smart Health Analytics",
      insightSub: "7-Day Continuous Review",
      days: "days",
      readings: "readings",
      toastDemoLoaded: "7 days of realistic demo records loaded!",
      toastLangChanged: "Language switched",
      footerTag: "Peace of mind with every breath",
      footerDisclaimer: "For wellness tracking only. Not a medical substitute."
    }
  };

  function t(key) {
    return (T[htLang] && T[htLang][key]) || T.bn[key] || key;
  }

  /* ============================================================================
   * 2. DATA LAYER
   * ============================================================================ */
  function htLoadRecords() {
    try {
      const raw = localStorage.getItem(HT_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];

      let migrated = false;
      data.forEach(r => {
        if (r && r.type === "bg" && typeof r.value === "number" && r.value > 35) {
          r.value = parseFloat((r.value / 18.0182).toFixed(1));
          migrated = true;
        }
      });
      if (migrated) {
        try { localStorage.setItem(HT_KEY, JSON.stringify(data)); } catch (_) {}
      }
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      return data;
    } catch {
      return [];
    }
  }

  function htSaveRecords(records) {
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem(HT_KEY, JSON.stringify(records));
  }

  function htUUID() {
    return "rec_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 5);
  }

  function htFormatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    const opts = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return d.toLocaleString(htLang === "bn" ? "bn-BD" : "en-GB", opts);
  }

  /* ============================================================================
   * 3. STATS & SPARKLINES
   * ============================================================================ */
  function renderStats() {
    const records = htLoadRecords();
    const bpRecs = records.filter(r => r.type === "bp");
    const bgRecs = records.filter(r => r.type === "bg");

    // Latest BP
    const latestBP = bpRecs[0];
    const bpEl = $("tcStatBPVal");
    const bpSubEl = $("tcStatBPSub");
    const bpBadge = $("tcStatBPBadge");
    if (bpEl) bpEl.textContent = latestBP ? `${latestBP.sys}/${latestBP.dia}` : "—";
    if (bpSubEl) bpSubEl.textContent = latestBP ? `${t("unitMmhg")} · ${htFormatDate(latestBP.date)}` : "—";
    if (bpBadge) {
      if (latestBP) {
        const isNormal = latestBP.sys <= 120 && latestBP.dia <= 80;
        const isElevated = latestBP.sys <= 129 && latestBP.dia <= 80;
        bpBadge.className = `tc-stat-badge ${isNormal ? "normal" : isElevated ? "elevated" : "high"}`;
        bpBadge.textContent = isNormal ? (htLang === "bn" ? "স্বাভাবিক" : "Normal") : (htLang === "bn" ? "উচ্চতর" : "Elevated");
      } else {
        bpBadge.className = "tc-stat-badge neutral";
        bpBadge.textContent = "—";
      }
    }

    // Latest BG
    const latestBG = bgRecs[0];
    const bgEl = $("tcStatBGVal");
    const bgSubEl = $("tcStatBGSub");
    const bgBadge = $("tcStatBGBadge");
    if (bgEl) bgEl.textContent = latestBG ? `${Number(latestBG.value).toFixed(1)}` : "—";
    if (bgSubEl) bgSubEl.textContent = latestBG ? `${t("unitMmol")} · ${htFormatDate(latestBG.date)}` : "—";
    if (bgBadge) {
      if (latestBG) {
        const isNormal = latestBG.value >= 4.0 && latestBG.value <= 7.8;
        bgBadge.className = `tc-stat-badge ${isNormal ? "normal" : "elevated"}`;
        bgBadge.textContent = isNormal ? (htLang === "bn" ? "স্বাভাবিক" : "Normal") : (htLang === "bn" ? "পর্যবেক্ষণ" : "Monitor");
      } else {
        bgBadge.className = "tc-stat-badge neutral";
        bgBadge.textContent = "—";
      }
    }

    // Today count
    const today = new Date().toDateString();
    const todayCount = records.filter(r => new Date(r.date).toDateString() === today).length;
    const todayEl = $("tcStatTodayVal");
    const todaySubEl = $("tcStatTodaySub");
    if (todayEl) todayEl.textContent = todayCount;
    if (todaySubEl) {
      todaySubEl.textContent = todayCount > 0
        ? (htLang === "bn" ? `${todayCount}টি রিডিং সম্পন্ন` : `${todayCount} logged today`)
        : (htLang === "bn" ? "আজ কোনো রিডিং নেই" : "No readings yet");
    }

    // Streak
    let streak = 0;
    const check = new Date();
    check.setHours(23, 59, 59, 999);
    while (true) {
      const dayStr = check.toDateString();
      const hasRecord = records.some(r => new Date(r.date).toDateString() === dayStr);
      if (!hasRecord) break;
      streak++;
      check.setDate(check.getDate() - 1);
    }
    const streakEl = $("tcStatStreakVal");
    const streakSubEl = $("tcStatStreakSub");
    if (streakEl) streakEl.textContent = streak;
    if (streakSubEl) {
      streakSubEl.textContent = streak > 0
        ? (htLang === "bn" ? `${streak} দিন সক্রিয়` : `${streak} days active`)
        : (htLang === "bn" ? "শুরু করুন" : "Start now");
    }

    // Sparklines
    renderSparklines(bpRecs.slice(0, 10).reverse(), bgRecs.slice(0, 10).reverse());
  }

  function renderSparklines(bpRecs, bgRecs) {
    const bpSpark = $("tcBPSparkline");
    const bgSpark = $("tcBGSparkline");

    if (bpSpark && bpRecs.length) {
      const vals = bpRecs.map(r => r.sys);
      const mx = Math.max(...vals, 140);
      bpSpark.innerHTML = vals.map((v, i) => `
        <div class="tc-spark-bar ${i === vals.length - 1 ? "active" : ""}"
          style="height:${Math.max(4, Math.round((v / mx) * 26))}px;color:#ef4444;"></div>
      `).join("");
    }

    if (bgSpark && bgRecs.length) {
      const vals = bgRecs.map(r => r.value);
      const mx = Math.max(...vals, 15);
      bgSpark.innerHTML = vals.map((v, i) => `
        <div class="tc-spark-bar ${i === vals.length - 1 ? "active" : ""}"
          style="height:${Math.max(4, Math.round((v / mx) * 26))}px;color:#8b5cf6;"></div>
      `).join("");
    }
  }

  /* ============================================================================
   * 4. CHART RENDERING & TIME-SERIES MATH
   * ============================================================================ */
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

  function renderBPChart() {
    const wrap = $("bpChartWrap");
    const metricsWrap = $("bpMetricChips");
    if (!wrap) return;

    const data = getFilteredRecords("bp");

    if (data.length < 2) {
      wrap.innerHTML = `
        <div class="tc-chart-empty">
          <i class="bi bi-graph-up text-danger"></i>
          <p>${t("chartNoData")}<br><span class="small opacity-75">${t("chartNoDataSub")}</span></p>
          <div class="d-flex gap-2 mt-3">
            <a href="health-tracker.html#entrySection" class="btn btn-sm btn-primary rounded-pill px-3">${t("addReadingBtn")}</a>
            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="window.htLoadDemo()">${t("loadDemoBtn")}</button>
          </div>
        </div>`;
      if (metricsWrap) metricsWrap.innerHTML = "";
      return;
    }

    // Calculate Summary Metrics
    const avgSys = Math.round(data.reduce((s, r) => s + r.sys, 0) / data.length);
    const avgDia = Math.round(data.reduce((s, r) => s + r.dia, 0) / data.length);
    const inSafe = Math.round((data.filter(r => r.sys <= 120 && r.dia <= 80).length / data.length) * 100);

    if (metricsWrap) {
      metricsWrap.innerHTML = `
        <span class="tc-metric-chip">${htLang === "bn" ? "গড় রিডিং" : "Average"}: <strong>${avgSys}/${avgDia} mmHg</strong></span>
        <span class="tc-metric-chip">${htLang === "bn" ? "নিরাপদ জোনে" : "In Safe Zone"}: <strong class="text-success">${inSafe}%</strong></span>
      `;
    }

    wrap.innerHTML = renderLineChart(data, [
      { key: "sys", color: "var(--tc-systolic)", label: `${t("lblSystolic")} (${t("unitMmhg")})` },
      { key: "dia", color: "var(--tc-diastolic)", label: `${t("lblDiastolic")} (${t("unitMmhg")})` },
    ], "bp");
  }

  function renderBGChart() {
    const wrap = $("bgChartWrap");
    const metricsWrap = $("bgMetricChips");
    if (!wrap) return;

    const data = getFilteredRecords("bg");

    if (data.length < 2) {
      wrap.innerHTML = `
        <div class="tc-chart-empty">
          <i class="bi bi-droplet-half" style="color:#8b5cf6"></i>
          <p>${t("chartNoData")}<br><span class="small opacity-75">${t("chartNoDataSub")}</span></p>
          <div class="d-flex gap-2 mt-3">
            <a href="health-tracker.html#entrySection" class="btn btn-sm btn-primary rounded-pill px-3">${t("addReadingBtn")}</a>
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
        <span class="tc-metric-chip">${htLang === "bn" ? "গড় সুগার" : "Average"}: <strong>${avgVal} mmol/L</strong></span>
        <span class="tc-metric-chip">${htLang === "bn" ? "টার্গেট রেঞ্জে" : "In Target"}: <strong class="text-success">${inTarget}%</strong></span>
      `;
    }

    wrap.innerHTML = renderLineChart(data, [
      { key: "value", color: "var(--tc-glucose)", label: `${t("lblGlucose")} (${t("unitMmol")})` },
    ], "bg");
  }

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

    const range = maxVal - minVal || 1;
    minVal = Math.max(0, minVal - range * 0.15);
    maxVal = maxVal + range * 0.15;
    const valRange = maxVal - minVal || 1;

    const toXY = (i, val) => ({
      x: PAD + (i / Math.max(1, data.length - 1)) * drawW,
      y: PAD + drawH - ((val - minVal) / valRange) * drawH,
    });

    // Target shaded safe-zone band
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

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(lvl => {
      const y = PAD + drawH - lvl * drawH;
      const rawV = minVal + lvl * valRange;
      const v = chartType === "bg" ? rawV.toFixed(1) : Math.round(rawV);
      return `<line x1="${PAD}" y1="${y}" x2="${W - PAD}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>
              <text x="${PAD - 6}" y="${y + 4}" font-size="9" fill="#94a3b8" text-anchor="end">${v}</text>`;
    }).join("");

    const xLabels = data.map((d, i) => {
      const pt = toXY(i, minVal);
      const date = new Date(d.date);
      const label = `${date.getDate()}/${date.getMonth() + 1}`;
      const show = data.length <= 7 || i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0;
      return show
        ? `<text x="${pt.x}" y="${H - 10}" font-size="9" fill="#94a3b8" text-anchor="middle">${label}</text>`
        : "";
    }).join("");

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
          class="tc-chart-dot" style="cursor:pointer"/>`;
      }).join("");

      return `
        <polygon points="${areaPoints}" fill="${s.color}" opacity="0.08"/>
        <polyline points="${polyPoints}" fill="none" stroke="${s.color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        ${dots}`;
    }).join("");

    return `
      <svg viewBox="0 0 ${W} ${H}" class="tc-chart-svg" preserveAspectRatio="none">
        ${targetBand}
        ${gridLines}
        ${xLabels}
        ${seriesSVG}
      </svg>
      <div class="tc-chart-tooltip" id="tcTooltip_${chartType}"></div>`;
  }

  function bindChartTooltips() {
    ["bp", "bg"].forEach(type => {
      const wrap = $(`${type}ChartWrap`);
      const tooltip = $(`tcTooltip_${type}`);
      if (!wrap || !tooltip) return;

      wrap.addEventListener("mousemove", e => {
        const dot = e.target.closest(".tc-chart-dot");
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
   * 5. SMART INSIGHTS
   * ============================================================================ */
  function renderInsights() {
    const card = $("tcInsightCard");
    if (!card) return;

    const records = htLoadRecords();
    if (records.length === 0) {
      card.classList.add("d-none");
      return;
    }
    card.classList.remove("d-none");

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const weekRecs = records.filter(r => new Date(r.date) >= cutoff);
    const bpWeek = weekRecs.filter(r => r.type === "bp");
    const bgWeek = weekRecs.filter(r => r.type === "bg");

    let avgSys = 0, avgDia = 0, avgBG = 0;
    if (bpWeek.length) {
      avgSys = Math.round(bpWeek.reduce((s, r) => s + r.sys, 0) / bpWeek.length);
      avgDia = Math.round(bpWeek.reduce((s, r) => s + r.dia, 0) / bpWeek.length);
    }
    if (bgWeek.length) {
      avgBG = (bgWeek.reduce((s, r) => s + r.value, 0) / bgWeek.length).toFixed(1);
    }

    const chipsEl = $("tcInsightChips");
    if (chipsEl) {
      chipsEl.innerHTML = `
        ${bpWeek.length ? `<span class="tc-insight-chip"><i class="bi bi-heart-pulse text-danger"></i> ${htLang === "bn" ? "৭ দিনের গড় বিপি" : "7-day Avg BP"}: ${avgSys}/${avgDia} mmHg</span>` : ""}
        ${bgWeek.length ? `<span class="tc-insight-chip"><i class="bi bi-droplet text-purple" style="color:#8b5cf6"></i> ${htLang === "bn" ? "৭ দিনের গড় গ্লুকোজ" : "7-day Avg Glucose"}: ${avgBG} mmol/L</span>` : ""}
        <span class="tc-insight-chip"><i class="bi bi-check-circle text-success"></i> ${htLang === "bn" ? `মোট রেকর্ড: ${weekRecs.length}টি` : `Total entries: ${weekRecs.length}`}</span>
      `;
    }

    const bodyEl = $("tcInsightBody");
    if (bodyEl) {
      if (avgSys >= 135 || avgDia >= 88) {
        bodyEl.textContent = htLang === "bn"
          ? "গত ৭ দিনের হিসেবে আপনার রক্তচাপ কিছুটা উচ্চতর প্রবণতা দেখাচ্ছে। প্রতিদিন নিয়মিত ৫ মিনিট ধীর ও শান্ত শ্বাসচর্চা হৃদস্পন্দন স্বাভাবিক রাখতে অত্যন্ত সহায়ক।"
          : "Your average blood pressure over the last 7 days is slightly elevated. A daily 5-minute deep breathing session significantly supports autonomic regulation.";
      } else {
        bodyEl.textContent = htLang === "bn"
          ? "চমৎকার! আপনার সাম্প্রতিক রিডিংগুলো সার্বিকভাবে নিয়ন্ত্রিত ও ইতিবাচক অবস্থায় রয়েছে। এই সুস্থ রুটিন বজায় রাখুন।"
          : "Great job! Your recent health readings are well-balanced and stable. Keep maintaining this healthy routine.";
      }
    }
  }

  /* ============================================================================
   * 6. DEMO DATA & TOAST NOTIFICATION
   * ============================================================================ */
  function htToast(msg, type = "info") {
    const stack = $("tcToastStack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = `tc-toast ${type}`;
    toast.innerHTML = `<i class="bi bi-info-circle-fill"></i><span>${msg}</span>`;
    stack.appendChild(toast);
    setTimeout(() => {
      if (toast.remove) toast.remove();
      else if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

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

  window.htLoadDemo = htLoadDemo;

  /* ============================================================================
   * 7. LANGUAGE SWITCHER
   * ============================================================================ */
  function htSetLang(lang) {
    htLang = lang;
    localStorage.setItem(HT_LANG_KEY, lang);
    localStorage.setItem("bw-lang", lang);
    document.documentElement.lang = lang;
    document.body.className = lang;

    document.querySelectorAll("[data-tc-i18n]").forEach(el => {
      const k = el.dataset.tcI18n;
      if (k) el.textContent = t(k);
    });

    const toggleBtn = $("tcLangToggle");
    if (toggleBtn) toggleBtn.textContent = lang === "bn" ? "English" : "বাংলা";

    renderStats();
    renderBPChart();
    renderBGChart();
    bindChartTooltips();
    renderInsights();
  }

  /* ============================================================================
   * 8. BOOTSTRAP & EVENTS
   * ============================================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    htSetLang(htLang);

    // Language button
    const langBtn = $("tcLangToggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        htSetLang(htLang === "bn" ? "en" : "bn");
      });
    }

    // Timeframe switcher buttons
    document.querySelectorAll(".tc-tf-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentChartTimeframe = btn.dataset.tf;
        document.querySelectorAll(".tc-tf-btn").forEach(b => b.classList.toggle("active", b.dataset.tf === currentChartTimeframe));
        renderBPChart();
        renderBGChart();
        bindChartTooltips();
      });
    });

    // Mobile sidebar bindings
    document.querySelectorAll(".mobile-lang-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.lang;
        if (target) htSetLang(target);
      });
    });
  });

})();
