/**
 * ============================================================================
 * BreatheWell — History Log Controller (history-log.js)
 * DataTables Bootstrap 5, Record Management, CSV/JSON Exports & Deletions
 * ============================================================================
 */

(function () {
  "use strict";

  const HT_KEY = "bw_health_records_v1";
  const HT_LANG_KEY = "bw_ht_lang_v1";
  let htLang = localStorage.getItem(HT_LANG_KEY) || localStorage.getItem("bw-lang") || "bn";
  let currentTab = "all";
  let dataTableInstance = null;

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
      heroBadge: "বিস্তারিত স্বাস্থ্য রেকর্ড ও আর্কাইভ",
      heroTitle: "📋 স্বাস্থ্য ইতিহাস ও বিস্তারিত লগ",
      heroSub: "আপনার সংরক্ষিত রক্তচাপ ও গ্লুকোজ পরিমাপের পূর্ণাঙ্গ ইতিহাস, তাৎক্ষণিক অনুসন্ধান, ফিল্টারিং ও এক্সপোর্ট।",
      quickAdd: "➕ নতুন রিডিং",
      quickTrends: "📈 ট্রেন্ড চার্ট",
      quickLog: "📋 ইতিহাস লগ",
      quickDemo: "🧪 নমুনা ডেটা",
      cardTitle: "ইতিহাস ও পরিমাপ রেকর্ড",
      tabAll: "সব",
      tabBP: "রক্তচাপ",
      tabBG: "গ্লুকোজ",
      btnCsv: "CSV ডাউনলোড",
      btnJson: "JSON ব্যাকআপ",
      btnClearAll: "সব মুছুন",
      colDate: "তারিখ ও সময়",
      colType: "ধরন",
      colReading: "রিডিং মান",
      colStatus: "অবস্থা ও শ্রেণী",
      colNotes: "নোট",
      colAction: "অ্যাকশন",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      noRecords: "কোনো স্বাস্থ্য রেকর্ড পাওয়া যায়নি",
      noRecordsSub: "নতুন রিডিং যুক্ত করুন অথবা নমুনা ডেটা দিয়ে পরীক্ষা করুন।",
      loadDemoBtn: "🧪 নমুনা ডেটা লোড করুন",
      confirmDelete: "আপনি কি নিশ্চিতভাবে এই রেকর্ডটি মুছে ফেলতে চান?",
      confirmClearAll: "⚠️ আপনি কি সমস্ত স্বাস্থ্য রেকর্ড মুছে ফেলতে চান? এটি পুনরুদ্ধার করা যাবে না!",
      toastDeleted: "রেকর্ডটি সফলভাবে মুছে ফেলা হয়েছে",
      toastAllCleared: "সমস্ত রেকর্ড সফলভাবে মুছে ফেলা হয়েছে",
      toastCSVDone: "CSV ফাইল প্রস্তুত ও ডাউনলোড সম্পন্ন!",
      toastJSONDone: "JSON ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে!",
      toastDemoLoaded: "৭ দিনের নমুনা ডেটা সফলভাবে লোড হয়েছে!",
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
      heroBadge: "Detailed Health Records & Archive",
      heroTitle: "📋 Health Records History & Log",
      heroSub: "Complete history of your logged blood pressure and blood glucose readings with instant search, filtering, and export.",
      quickAdd: "➕ Add Reading",
      quickTrends: "📈 Trends & Charts",
      quickLog: "📋 History Log",
      quickDemo: "🧪 Demo Data",
      cardTitle: "History & Health Logs",
      tabAll: "All",
      tabBP: "Blood Pressure",
      tabBG: "Glucose",
      btnCsv: "Download CSV",
      btnJson: "JSON Backup",
      btnClearAll: "Clear All",
      colDate: "Date & Time",
      colType: "Type",
      colReading: "Reading",
      colStatus: "Status",
      colNotes: "Notes",
      colAction: "Action",
      unitMmhg: "mmHg",
      unitMmol: "mmol/L",
      noRecords: "No health records found",
      noRecordsSub: "Log new readings or generate realistic sample data.",
      loadDemoBtn: "🧪 Load Demo Data",
      confirmDelete: "Are you sure you want to delete this record?",
      confirmClearAll: "⚠️ Are you sure you want to delete ALL health records? This cannot be undone!",
      toastDeleted: "Record deleted successfully",
      toastAllCleared: "All records cleared successfully",
      toastCSVDone: "CSV export downloaded successfully!",
      toastJSONDone: "JSON backup downloaded successfully!",
      toastDemoLoaded: "7 days of sample records loaded!",
      footerTag: "Peace of mind with every breath",
      footerDisclaimer: "For wellness tracking only. Not a medical substitute."
    }
  };

  function t(key) {
    return (T[htLang] && T[htLang][key]) || T.bn[key] || key;
  }

  /* ============================================================================
   * 2. DATA LAYER & CLINICAL CLASSIFIERS
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

  function htFormatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    const opts = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return d.toLocaleString(htLang === "bn" ? "bn-BD" : "en-GB", opts);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function classifyBP(sys, dia) {
    if (sys >= 180 || dia >= 120) return { key: "crisis",   label: bpLabel("crisis"),   cls: "crisis",   icon: "🆘" };
    if (sys >= 140 || dia >= 90)  return { key: "high2",    label: bpLabel("high2"),    cls: "high2",    icon: "🚨" };
    if (sys >= 130 || dia > 80)   return { key: "high1",    label: bpLabel("high1"),    cls: "high1",    icon: "🔴" };
    if (sys > 120 && dia <= 80)   return { key: "elevated", label: bpLabel("elevated"), cls: "elevated", icon: "⚠️" };
    if (sys < 90 || dia < 60)     return { key: "low",      label: bpLabel("low"),      cls: "low",      icon: "⬇️" };
    return { key: "normal", label: bpLabel("normal"), cls: "normal", icon: "✅" };
  }

  function bpLabel(key) {
    const map = {
      normal:   { bn: "স্বাভাবিক",              en: "Normal"             },
      elevated: { bn: "উচ্চতর",                 en: "Elevated"           },
      high1:    { bn: "উচ্চ রক্তচাপ (পর্যায় ১)",en: "High BP – Stage 1" },
      high2:    { bn: "উচ্চ রক্তচাপ (পর্যায় ২)",en: "High BP – Stage 2" },
      crisis:   { bn: "জরুরি অবস্থা",           en: "Crisis"             },
      low:      { bn: "নিম্ন রক্তচাপ",          en: "Low BP"             },
    };
    return (map[key] && map[key][htLang]) || key;
  }

  function classifyBG(val, timing) {
    const t = timing || "fasting";
    const isPostOrRandom = t === "postmeal" || t === "random";
    const normMax = isPostOrRandom ? 7.8 : 5.6;
    const preMax  = isPostOrRandom ? 11.1 : 7.0;

    if (val < 4.0) {
      return { key: "hypo", cls: "low", icon: "⬇️", label: htLang === "bn" ? "হাইপোগ্লাইসেমিয়া" : "Hypoglycemia" };
    }
    if (val <= normMax) {
      return { key: "normal", cls: "normal", icon: "✅", label: htLang === "bn" ? "স্বাভাবিক" : "Normal" };
    }
    if (val < preMax) {
      return { key: "prediab", cls: "elevated", icon: "⚠️", label: htLang === "bn" ? "প্রি-ডায়াবেটিস" : "Pre-diabetes" };
    }
    return { key: "diabetic", cls: "high2", icon: "🚨", label: htLang === "bn" ? "ডায়াবেটিস" : "Diabetes" };
  }

  function bgTimingLabel(timing) {
    const map = {
      fasting:  { bn: "খালি পেটে", en: "Fasting" },
      postmeal: { bn: "খাবার পর",  en: "Post-meal" },
      random:   { bn: "যেকোনো সময়", en: "Random" },
      bedtime:  { bn: "ঘুমানোর আগে", en: "Bedtime" },
    };
    return (map[timing] && map[timing][htLang]) || timing;
  }

  /* ============================================================================
   * 3. SUMMARY COUNTERS
   * ============================================================================ */
  function renderSummary() {
    const records = htLoadRecords();
    const bpCount = records.filter(r => r.type === "bp").length;
    const bgCount = records.filter(r => r.type === "bg").length;
    const latest = records[0];

    const totalEl = $("hlTotalCount");
    const bpEl = $("hlBPCount");
    const bgEl = $("hlBGCount");
    const dateEl = $("hlLatestDate");

    if (totalEl) totalEl.textContent = records.length;
    if (bpEl) bpEl.textContent = bpCount;
    if (bgEl) bgEl.textContent = bgCount;
    if (dateEl) dateEl.textContent = latest ? htFormatDate(latest.date) : "—";
  }

  /* ============================================================================
   * 4. DATATABLES 2 BOOTSTRAP 5 RENDERING
   * ============================================================================ */
  function getDTLanguageConfig() {
    const isBn = htLang === "bn";
    return {
      search: isBn ? "অনুসন্ধান:" : "Search:",
      searchPlaceholder: isBn ? "তারিখ, মান বা নোট দিয়ে খুঁজুন..." : "Search date, value, or notes...",
      lengthMenu: isBn ? "_MENU_ টি রেকর্ড প্রদর্শন" : "Show _MENU_ entries",
      info: isBn ? "_TOTAL_ টির মধ্যে _START_ থেকে _END_ টি দেখানো হচ্ছে" : "Showing _START_ to _END_ of _TOTAL_ entries",
      infoEmpty: isBn ? "কোনো রেকর্ড পাওয়া যায়নি" : "No entries to show",
      infoFiltered: isBn ? "(মোট _MAX_ টি রেকর্ড থেকে ফিল্টার করা)" : "(filtered from _MAX_ total entries)",
      zeroRecords: `
        <div class="hl-empty-state py-4 my-2">
          <span class="hl-empty-icon fs-1">🔍</span>
          <div class="hl-empty-title">${isBn ? "কোনো মিল পাওয়া যায়নি" : "No matching records found"}</div>
          <div class="small">${isBn ? "ভিন্ন কি-ওয়ার্ড দিয়ে আবার চেষ্টা করুন" : "Try searching with different terms"}</div>
        </div>`,
      emptyTable: `
        <div class="hl-empty-state py-4 my-2">
          <span class="hl-empty-icon fs-1">📋</span>
          <div class="hl-empty-title">${t("noRecords")}</div>
          <div class="small mb-3">${t("noRecordsSub")}</div>
          <div class="d-flex justify-content-center gap-2">
            <a href="health-tracker.html#entrySection" class="btn btn-sm btn-primary rounded-pill px-3">➕ নতুন রিডিং</a>
            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="window.htLoadDemoData()">${t("loadDemoBtn")}</button>
          </div>
        </div>`,
      paginate: {
        first: isBn ? "প্রথম" : "First",
        last: isBn ? "শেষ" : "Last",
        next: isBn ? "পরবর্তী" : "Next",
        previous: isBn ? "পূর্ববর্তী" : "Previous"
      }
    };
  }

  function renderTable() {
    const tableEl = $("historyLogTable");
    const tbody = $("historyLogTbody");
    if (!tableEl || !tbody) return;

    if (dataTableInstance) {
      try {
        dataTableInstance.destroy();
      } catch (e) {
        console.warn("DataTable destroy error:", e);
      }
      dataTableInstance = null;
    }

    const records = htLoadRecords();
    const filtered = currentTab === "all" ? records : records.filter(r => r.type === currentTab);

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4">
            <div class="hl-empty-state">
              <span class="hl-empty-icon fs-1">📋</span>
              <div class="hl-empty-title">${t("noRecords")}</div>
              <div class="small mb-3">${t("noRecordsSub")}</div>
              <div class="d-flex justify-content-center gap-2">
                <a href="health-tracker.html#entrySection" class="btn btn-sm btn-primary rounded-pill px-3">➕ নতুন রিডিং</a>
                <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="window.htLoadDemoData()">${t("loadDemoBtn")}</button>
              </div>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(r => {
      const timeMs = new Date(r.date).getTime() || 0;
      if (r.type === "bp") {
        const cls = classifyBP(r.sys, r.dia);
        const armStr = r.arm ? ` (${r.arm === "left" ? "বাম হাত" : "ডান হাত"})` : "";
        return `
          <tr>
            <td data-order="${timeMs}"><i class="bi bi-clock me-1 text-muted"></i>${htFormatDate(r.date)}</td>
            <td data-order="bp"><span class="badge bg-danger-subtle text-danger fw-bold">❤️ রক্তচাপ</span></td>
            <td data-order="${r.sys}"><span class="hl-val-bp">${r.sys}/${r.dia}</span> <span class="text-muted small">${t("unitMmhg")}${armStr}</span></td>
            <td data-order="${cls.key}"><span class="ht-status-chip ${cls.cls}">${cls.icon} ${cls.label}</span></td>
            <td class="text-muted small">${escapeHtml(r.notes || "—")}</td>
            <td class="text-end">
              <button class="hl-row-del" onclick="window.htDeleteRecord('${r.id}')" title="Delete" aria-label="Delete record">
                <i class="bi bi-trash3"></i>
              </button>
            </td>
          </tr>`;
      } else {
        const cls = classifyBG(r.value, r.timing);
        const mgdl = Math.round(r.value * 18.0182);
        return `
          <tr>
            <td data-order="${timeMs}"><i class="bi bi-clock me-1 text-muted"></i>${htFormatDate(r.date)}</td>
            <td data-order="bg"><span class="badge bg-purple-subtle text-purple fw-bold" style="background:#ede9fe;color:#6d28d9">🩸 গ্লুকোজ</span></td>
            <td data-order="${r.value}"><span class="hl-val-bg">${Number(r.value).toFixed(1)}</span> <span class="text-muted small">${t("unitMmol")} (${mgdl} mg/dL · ${bgTimingLabel(r.timing)})</span></td>
            <td data-order="${cls.key}"><span class="ht-status-chip ${cls.cls}">${cls.icon} ${cls.label}</span></td>
            <td class="text-muted small">${escapeHtml(r.notes || "—")}</td>
            <td class="text-end">
              <button class="hl-row-del" onclick="window.htDeleteRecord('${r.id}')" title="Delete" aria-label="Delete record">
                <i class="bi bi-trash3"></i>
              </button>
            </td>
          </tr>`;
      }
    }).join("");

    if (typeof DataTable !== "undefined") {
      try {
        dataTableInstance = new DataTable(tableEl, {
          order: [[0, "desc"]],
          columnDefs: [{ orderable: false, targets: 5 }],
          pageLength: 10,
          lengthMenu: [5, 10, 25, 50],
          language: getDTLanguageConfig()
        });
      } catch (err) {
        console.error("DataTable init error:", err);
      }
    }
  }

  /* ============================================================================
   * 5. ACTIONS: DELETE, CLEAR, EXPORT, DEMO
   * ============================================================================ */
  function hlToast(msg, type = "info") {
    const stack = $("hlToastStack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = `hl-toast ${type}`;
    toast.innerHTML = `<i class="bi bi-info-circle-fill"></i><span>${msg}</span>`;
    stack.appendChild(toast);
    setTimeout(() => {
      if (toast.remove) toast.remove();
      else if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  function htDeleteRecord(id) {
    if (!confirm(t("confirmDelete"))) return;
    const records = htLoadRecords().filter(r => r.id !== id);
    htSaveRecords(records);
    renderSummary();
    renderTable();
    hlToast(t("toastDeleted"), "info");
  }

  function htClearAllRecords() {
    if (!confirm(t("confirmClearAll"))) return;
    localStorage.removeItem(HT_KEY);
    renderSummary();
    renderTable();
    hlToast(t("toastAllCleared"), "warning");
  }

  function htExportCSV() {
    const records = htLoadRecords();
    if (!records.length) {
      hlToast(t("noRecords"), "warning");
      return;
    }

    const rows = [["Type", "Date", "Systolic", "Diastolic", "Glucose (mmol/L)", "Timing", "Status", "Notes"]];
    records.forEach(r => {
      if (r.type === "bp") {
        rows.push(["BP", r.date, r.sys, r.dia, "", "", r.status, r.notes || ""]);
      } else {
        rows.push(["BG", r.date, "", "", Number(r.value).toFixed(1), r.timing, r.status, r.notes || ""]);
      }
    });

    const csvContent = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `breathewell-records-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    hlToast(t("toastCSVDone"), "success");
  }

  function htExportJSON() {
    const records = htLoadRecords();
    if (!records.length) {
      hlToast(t("noRecords"), "warning");
      return;
    }

    const data = JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), records }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `breathewell-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    hlToast(t("toastJSONDone"), "success");
  }

  function htLoadDemoData() {
    const demo = [];
    const now = new Date();
    const bpSamples = [
      { sys: 118, dia: 76, notes: "সকালে ঘুম থেকে উঠে স্বাভাবিক" },
      { sys: 122, dia: 80, notes: "ব্যায়ামের পর" },
      { sys: 126, dia: 82, notes: "অফিসের কাজের পর" },
      { sys: 119, dia: 78, notes: "বিশ্রামের পর" },
      { sys: 132, dia: 84, notes: "চা খাওয়ার পর" },
      { sys: 120, dia: 79, notes: "সন্ধ্যায় হাঁটাহাঁটির পর" },
      { sys: 116, dia: 75, notes: "ছুটির দিন সকালে" },
    ];
    const bgSamples = [
      { value: 5.1, timing: "fasting",  notes: "খালি পেটে পরিমাপ" },
      { value: 7.5, timing: "postmeal", notes: "দুপুরের খাবারের ২ ঘণ্টা পর" },
      { value: 5.4, timing: "fasting",  notes: "সকালের রিডিং" },
      { value: 7.9, timing: "postmeal", notes: "রাতের খাবারের পর" },
      { value: 4.9, timing: "fasting",  notes: "নিয়ন্ত্রিত সুগার" },
      { value: 7.1, timing: "random",   notes: "বিকালে পরিমাপ" },
      { value: 5.2, timing: "bedtime",  notes: "ঘুমানোর আগে" },
    ];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      d.setHours(8, 15, 0, 0);
      demo.push({
        type: "bp",
        id: "rec_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 5),
        date: d.toISOString(),
        sys: bpSamples[6 - i].sys,
        dia: bpSamples[6 - i].dia,
        arm: "right",
        notes: bpSamples[6 - i].notes,
        status: classifyBP(bpSamples[6 - i].sys, bpSamples[6 - i].dia).key
      });

      d.setHours(10, 30, 0, 0);
      demo.push({
        type: "bg",
        id: "rec_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 5),
        date: d.toISOString(),
        value: bgSamples[6 - i].value,
        timing: bgSamples[6 - i].timing,
        notes: bgSamples[6 - i].notes,
        status: classifyBG(bgSamples[6 - i].value, bgSamples[6 - i].timing).key
      });
    }

    htSaveRecords(demo);
    renderSummary();
    renderTable();
    hlToast(t("toastDemoLoaded"), "success");
  }

  window.htDeleteRecord = htDeleteRecord;
  window.htClearAllRecords = htClearAllRecords;
  window.htExportCSV = htExportCSV;
  window.htExportJSON = htExportJSON;
  window.htLoadDemoData = htLoadDemoData;

  /* ============================================================================
   * 6. LANGUAGE SWITCHER
   * ============================================================================ */
  function htSetLang(lang) {
    htLang = lang;
    localStorage.setItem(HT_LANG_KEY, lang);
    localStorage.setItem("bw-lang", lang);
    document.documentElement.lang = lang;
    document.body.className = lang;

    document.querySelectorAll("[data-hl-i18n]").forEach(el => {
      const k = el.dataset.hlI18n;
      if (k) el.textContent = t(k);
    });

    const toggleBtn = $("hlLangToggle");
    if (toggleBtn) toggleBtn.textContent = lang === "bn" ? "English" : "বাংলা";

    renderSummary();
    renderTable();
  }

  /* ============================================================================
   * 7. BOOTSTRAP & EVENTS
   * ============================================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    htSetLang(htLang);

    // Language toggle
    const langBtn = $("hlLangToggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        htSetLang(htLang === "bn" ? "en" : "bn");
      });
    }

    // Tabs
    document.querySelectorAll(".hl-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentTab = btn.dataset.tab;
        document.querySelectorAll(".hl-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === currentTab));
        renderTable();
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
