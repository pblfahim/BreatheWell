/**
 * ============================================================================
 * BreatheWell — Demo Data Controller (demo-data.js)
 * Clinical Scenario Generators, Custom Presets & Storage Inspector
 * ============================================================================
 */

(function () {
  "use strict";

  const HT_KEY = "bw_health_records_v1";
  const HT_LANG_KEY = "bw_ht_lang_v1";
  let htLang = localStorage.getItem(HT_LANG_KEY) || localStorage.getItem("bw-lang") || "bn";

  const $ = id => document.getElementById(id);

  /* ============================================================================
   * 1. TRANSLATION DICTIONARY
   * ============================================================================ */
  const T = {
    bn: {
      navHome: "হোম",
      navExercises: "অনুশীলন",
      navTest: "শ্বাসের পরীক্ষা",
      navHealth: "স্বাস্থ্য ট্র্যাকার",
      navRx: "প্রেসক্রিপশন",
      navSafety: "নিরাপত্তা",
      heroBadge: "ক্লিনিক্যাল টেস্টিং ও নমুনা ডেটা জেনারেটর",
      heroTitle: "🧪 নমুনা ডেটা ল্যাব ও জেনারেটর",
      heroSub: "বাস্তবসম্মত রক্তচাপ ও গ্লুকোজ ডেটা তৈরি করে চার্ট, অ্যানালিটিক্স ও লগিং সিস্টেম তাৎক্ষণিক পরীক্ষা করুন।",
      quickAdd: "➕ নতুন রিডিং",
      quickTrends: "📈 ট্রেন্ড চার্ট",
      quickLog: "📋 ইতিহাস লগ",
      quickDemo: "🧪 নমুনা ডেটা",
      storageCountLbl: "বর্তমানে সংরক্ষিত রেকর্ড",
      btnViewCharts: "📈 ট্রেন্ড চার্টে দেখুন",
      btnViewLog: "📋 ইতিহাস লগে দেখুন",
      btnClearAll: "সব মুছুন",
      confirmClear: "⚠️ আপনি কি সমস্ত রেকর্ড মুছে ফেলতে চান?",
      toastCleared: "সমস্ত রেকর্ড সফলভাবে মুছে ফেলা হয়েছে",
      toastGenerated: "নমুনা ডেটা সফলভাবে তৈরি ও সংরক্ষিত হয়েছে!",
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
      heroBadge: "Clinical Testing & Sample Data Generator",
      heroTitle: "🧪 Demo Data Lab & Generator",
      heroSub: "Generate realistic blood pressure and glucose test scenarios to inspect trend charts, analytics, and history logs.",
      quickAdd: "➕ Add Reading",
      quickTrends: "📈 Trends & Charts",
      quickLog: "📋 History Log",
      quickDemo: "🧪 Demo Data",
      storageCountLbl: "Currently Stored Records",
      btnViewCharts: "📈 View in Charts",
      btnViewLog: "📋 View in History Log",
      btnClearAll: "Clear All",
      confirmClear: "⚠️ Are you sure you want to clear all records?",
      toastCleared: "All records cleared successfully",
      toastGenerated: "Demo records generated and saved successfully!",
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
    const opts = { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" };
    return d.toLocaleString(htLang === "bn" ? "bn-BD" : "en-GB", opts);
  }

  /* ============================================================================
   * 3. STORAGE STATUS INSPECTOR
   * ============================================================================ */
  function updateStorageInspector() {
    const records = htLoadRecords();
    const bpCount = records.filter(r => r.type === "bp").length;
    const bgCount = records.filter(r => r.type === "bg").length;

    const countEl = $("ddStorageCount");
    const subEl = $("ddStorageSub");
    const previewList = $("ddPreviewList");

    if (countEl) countEl.textContent = `${records.length} টি রেকর্ড`;
    if (subEl) subEl.textContent = `রক্তচাপ: ${bpCount}টি · গ্লুকোজ: ${bgCount}টি`;

    if (previewList) {
      if (records.length === 0) {
        previewList.innerHTML = `
          <div class="text-center py-4 text-muted">
            <i class="bi bi-inbox fs-2 d-block mb-1 opacity-50"></i>
            <span>কোনো রেকর্ড সংরক্ষিত নেই। নিচের যে কোনো প্রিসেটে ক্লিক করে ডেটা তৈরি করুন।</span>
          </div>`;
      } else {
        const top5 = records.slice(0, 6);
        previewList.innerHTML = top5.map(r => {
          const isBP = r.type === "bp";
          const valStr = isBP ? `${r.sys}/${r.dia} mmHg` : `${Number(r.value).toFixed(1)} mmol/L`;
          const badgeClass = isBP ? "bg-danger-subtle text-danger" : "bg-purple-subtle text-purple";
          const icon = isBP ? "❤️" : "🩸";
          return `
            <div class="dd-preview-item">
              <div class="d-flex align-items-center gap-2">
                <span class="badge ${badgeClass} fw-bold">${icon} ${isBP ? "রক্তচাপ" : "গ্লুকোজ"}</span>
                <strong>${valStr}</strong>
                <span class="text-muted small">· ${r.notes || "—"}</span>
              </div>
              <span class="text-muted small">${htFormatDate(r.date)}</span>
            </div>`;
        }).join("");
      }
    }
  }

  /* ============================================================================
   * 4. SCENARIO PRESETS GENERATOR
   * ============================================================================ */
  function ddToast(msg, type = "info") {
    const stack = $("ddToastStack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = `dd-toast ${type}`;
    toast.innerHTML = `<i class="bi bi-info-circle-fill"></i><span>${msg}</span>`;
    stack.appendChild(toast);
    setTimeout(() => {
      if (toast.remove) toast.remove();
      else if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  function generateHealthyScenario() {
    const records = [];
    const now = new Date();
    const bpBase = [118, 120, 116, 122, 119, 117, 121];
    const diaBase = [76, 78, 75, 80, 77, 76, 79];
    const bgFast = [5.1, 5.3, 4.9, 5.2, 5.0, 5.4, 5.1];
    const bgPost = [7.2, 6.9, 7.5, 7.1, 7.4, 6.8, 7.3];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      // Morning BP
      d.setHours(8, 0, 0, 0);
      records.push({
        type: "bp",
        id: htUUID(),
        date: d.toISOString(),
        sys: bpBase[6 - i],
        dia: diaBase[6 - i],
        arm: "right",
        notes: "সকালের পরিমাপ · স্বাভাবিক ও শান্ত",
        status: "normal"
      });

      // Fasting BG
      d.setHours(8, 30, 0, 0);
      records.push({
        type: "bg",
        id: htUUID(),
        date: d.toISOString(),
        value: bgFast[6 - i],
        timing: "fasting",
        notes: "খালি পেটে পরিমাপ",
        status: "normal"
      });

      // Post-meal BG
      d.setHours(14, 0, 0, 0);
      records.push({
        type: "bg",
        id: htUUID(),
        date: d.toISOString(),
        value: bgPost[6 - i],
        timing: "postmeal",
        notes: "দুপুরের খাবারের ২ ঘণ্টা পর",
        status: "normal"
      });
    }

    htSaveRecords(records);
    updateStorageInspector();
    ddToast("✅ ৭ দিনের স্বাভাবিক জীবনধারা প্রোফাইল সফলভাবে তৈরি হয়েছে!", "success");
  }

  function generateHypertensionScenario() {
    const records = [];
    const now = new Date();
    const bpSys = [132, 138, 142, 135, 148, 140, 136, 144, 150, 138, 142, 146, 139, 145];
    const bpDia = [84, 88, 92, 86, 94, 89, 87, 91, 95, 88, 90, 93, 88, 92];

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      d.setHours(9, 15, 0, 0);
      const s = bpSys[13 - i];
      const dia = bpDia[13 - i];
      records.push({
        type: "bp",
        id: htUUID(),
        date: d.toISOString(),
        sys: s,
        dia: dia,
        arm: "right",
        notes: "কাজের চাপের পর পরিমাপ",
        status: s >= 140 || dia >= 90 ? "high2" : "high1"
      });

      d.setHours(11, 0, 0, 0);
      records.push({
        type: "bg",
        id: htUUID(),
        date: d.toISOString(),
        value: 5.5,
        timing: "fasting",
        notes: "স্বাভাবিক সুগার রিডিং",
        status: "normal"
      });
    }

    htSaveRecords(records);
    updateStorageInspector();
    ddToast("⚠️ ১৪ দিনের উচ্চ রক্তচাপ প্রবণতা প্রোফাইল তৈরি হয়েছে!", "warning");
  }

  function generateDiabetesScenario() {
    const records = [];
    const now = new Date();
    const fasting = [6.8, 7.2, 6.9, 7.5, 7.1, 7.8, 7.4, 8.1, 7.3, 7.6, 7.9, 8.4, 7.5, 7.8];
    const postmeal = [9.4, 10.2, 9.8, 11.2, 10.5, 11.8, 10.1, 12.0, 10.8, 11.4, 10.6, 12.3, 11.0, 11.5];

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      // Fasting
      d.setHours(8, 0, 0, 0);
      const fVal = fasting[13 - i];
      records.push({
        type: "bg",
        id: htUUID(),
        date: d.toISOString(),
        value: fVal,
        timing: "fasting",
        notes: "সকালে খালি পেটে পরিমাপ",
        status: fVal >= 7.0 ? "high2" : "elevated"
      });

      // Postmeal
      d.setHours(14, 30, 0, 0);
      const pVal = postmeal[13 - i];
      records.push({
        type: "bg",
        id: htUUID(),
        date: d.toISOString(),
        value: pVal,
        timing: "postmeal",
        notes: "ভারী খাবারের পর",
        status: pVal >= 11.1 ? "high2" : "elevated"
      });

      // Normal BP companion
      d.setHours(18, 0, 0, 0);
      records.push({
        type: "bp",
        id: htUUID(),
        date: d.toISOString(),
        sys: 122,
        dia: 78,
        arm: "left",
        notes: "বিশ্রামের পর পরিমাপ",
        status: "normal"
      });
    }

    htSaveRecords(records);
    updateStorageInspector();
    ddToast("🩸 ১৪ দিনের ডায়াবেটিস পর্যবেক্ষণ প্রোফাইল তৈরি হয়েছে!", "success");
  }

  function generateCrisisScenario() {
    const records = htLoadRecords();
    const d = new Date();

    // High BP Crisis
    records.unshift({
      type: "bp",
      id: htUUID(),
      date: d.toISOString(),
      sys: 195,
      dia: 125,
      arm: "right",
      notes: "🚨 সিমুলেশন: মাথাব্যথা ও অস্বস্তি অনুভব",
      status: "crisis"
    });

    // High Glucose Crisis
    d.setMinutes(d.getMinutes() - 30);
    records.unshift({
      type: "bg",
      id: htUUID(),
      date: d.toISOString(),
      value: 20.4,
      timing: "random",
      notes: "🚨 সিমুলেশন: চরম তৃষ্ণা ও ক্লান্তি",
      status: "high2"
    });

    htSaveRecords(records);
    updateStorageInspector();
    ddToast("🆘 ক্রাইসিস এলার্ট সিমুলেশন তৈরি হয়েছে! হোমপেজে লাল ব্যানার দেখতে পাবেন।", "warning");
  }

  function htClearAllRecords() {
    if (!confirm(t("confirmClear"))) return;
    localStorage.removeItem(HT_KEY);
    updateStorageInspector();
    ddToast(t("toastCleared"), "info");
  }

  window.generateHealthyScenario = generateHealthyScenario;
  window.generateHypertensionScenario = generateHypertensionScenario;
  window.generateDiabetesScenario = generateDiabetesScenario;
  window.generateCrisisScenario = generateCrisisScenario;
  window.htClearAllRecords = htClearAllRecords;

  /* ============================================================================
   * 5. LANGUAGE & BOOTSTRAP
   * ============================================================================ */
  function htSetLang(lang) {
    htLang = lang;
    localStorage.setItem(HT_LANG_KEY, lang);
    localStorage.setItem("bw-lang", lang);
    document.documentElement.lang = lang;
    document.body.className = lang;

    document.querySelectorAll("[data-dd-i18n]").forEach(el => {
      const k = el.dataset.ddI18n;
      if (k) el.textContent = t(k);
    });

    const toggleBtn = $("ddLangToggle");
    if (toggleBtn) toggleBtn.textContent = lang === "bn" ? "English" : "বাংলা";

    updateStorageInspector();
  }

  document.addEventListener("DOMContentLoaded", () => {
    htSetLang(htLang);

    const langBtn = $("ddLangToggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        htSetLang(htLang === "bn" ? "en" : "bn");
      });
    }

    // Custom Generator Form Submit
    const customForm = $("ddCustomForm");
    if (customForm) {
      customForm.addEventListener("submit", e => {
        e.preventDefault();
        const days = parseInt($("customDays").value, 10) || 7;
        const type = $("customType").value || "both";
        const profile = $("customProfile").value || "balanced";

        const generated = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);

          if (type === "both" || type === "bp") {
            d.setHours(8, 30, 0, 0);
            let sys = 120, dia = 80;
            if (profile === "balanced") {
              sys = Math.round(115 + Math.random() * 8);
              dia = Math.round(74 + Math.random() * 6);
            } else if (profile === "elevated") {
              sys = Math.round(130 + Math.random() * 15);
              dia = Math.round(84 + Math.random() * 10);
            } else {
              sys = Math.round(110 + Math.random() * 40);
              dia = Math.round(70 + Math.random() * 25);
            }
            generated.push({
              type: "bp",
              id: htUUID(),
              date: d.toISOString(),
              sys, dia,
              arm: "right",
              notes: "কাস্টম জেনারেটেড রিডিং",
              status: sys <= 120 ? "normal" : (sys <= 129 ? "elevated" : "high1")
            });
          }

          if (type === "both" || type === "bg") {
            d.setHours(11, 30, 0, 0);
            let val = 5.4;
            if (profile === "balanced") {
              val = parseFloat((4.8 + Math.random() * 1.5).toFixed(1));
            } else if (profile === "elevated") {
              val = parseFloat((7.0 + Math.random() * 2.8).toFixed(1));
            } else {
              val = parseFloat((4.5 + Math.random() * 5.5).toFixed(1));
            }
            generated.push({
              type: "bg",
              id: htUUID(),
              date: d.toISOString(),
              value: val,
              timing: "fasting",
              notes: "কাস্টম সুগার রিডিং",
              status: val <= 5.6 ? "normal" : "elevated"
            });
          }
        }

        htSaveRecords(generated);
        updateStorageInspector();
        ddToast(`🚀 ${days} দিনের কাস্টম নমুনা ডেটা সফলভাবে তৈরি হয়েছে!`, "success");
      });
    }

    // Mobile sidebar
    document.querySelectorAll(".mobile-lang-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.lang;
        if (target) htSetLang(target);
      });
    });
  });

})();
