/**
 * ============================================================================
 * BreatheWell - Prescription History & Vault Engine (prescription-history.js)
 * ============================================================================
 * @file        asset/js/prescription-history.js
 * @module      BreatheWell/PrescriptionHistory
 * @author      BreatheWell Health Informatics Team
 * @version     2.1.0
 * @license     MIT
 * @description
 *   Dedicated, robust client-side engine for prescription-history.html.
 *   Provides TWO synchronized history formats:
 *     1. Data Table View (styled as health-history table with DataTables 2 & CSV export)
 *     2. Gallery Card Grid View (interactive responsive cards with lightbox preview)
 *   Includes full-text search, urgency filtering, dynamic sorting, single-item deletion,
 *   rich digital clinical prescription sheet viewer in lightbox, and 100% bilingual (Bengali/English) i18n.
 * ============================================================================
 */

(function () {
  "use strict";

  // ============================================================================
  // 1. CONSTANTS, STORAGE KEYS & STATE
  // ============================================================================
  const RX_KEY = "bw_prescriptions";
  const LANG_KEY = "bw_lang";
  const VIEW_KEY = "bw_rx_view_format";
  const STORAGE_MAX_BYTES = 10 * 1024 * 1024; // 10 MB limit

  let currentLang = localStorage.getItem(LANG_KEY) || "bn";
  let currentViewFormat = localStorage.getItem(VIEW_KEY) || "grid";
  let galleryFilter = "all";
  let gallerySort = "new";
  let gallerySearch = "";

  let lbRecordList = [];
  let lbRecordIndex = 0;
  let lbFileIndex = 0;
  let lbActiveTab = "file"; // 'file' or 'clinical'
  let dataTableInstance = null;

  /**
   * Helper to retrieve DOM element by ID.
   * @param {string} id - HTML element ID.
   * @returns {HTMLElement|null}
   */
  const $ = (id) => document.getElementById(id);

  // ============================================================================
  // 2. BILINGUAL LOCALIZATION DICTIONARIES (PH_T)
  // ============================================================================
  const PH_T = {
    bn: {
      navHome: "হোম",
      navExercises: "শ্বাস ব্যায়াম",
      navTest: "শ্বাসের পরীক্ষা",
      navHealth: "হেলথ ট্র্যাকার",
      navRx: "প্রেসক্রিপশন",
      navSafety: "নিরাপত্তা",
      navMore: "আরও",
      tabVault: "প্রেসক্রিপশন ভল্ট",
      tabHistory: "প্রেসক্রিপশন ইতিহাস",
      tabDigitalPadHistory: "ডিজিটাল প্যাড ইতিহাস",
      tabCreate: "প্রেসক্রিপশন তৈরি",
      tabPad: "ডিজিটাল প্যাড",
      historyEyebrow: "ডিজিটাল প্রেসক্রিপশন আর্কাইভ",
      historyTitle: "সংরক্ষিত প্রেসক্রিপশন ইতিহাস",
      historySub: "ভল্টে সংরক্ষিত সব প্রেসক্রিপশন সহজেই খুঁজুন, ফিল্টার করুন এবং সম্পূর্ণ স্ক্রিনে দেখুন।",
      storageLabel: "স্টোরেজ ব্যবহার",
      storageCount: "টি প্রেসক্রিপশন সংরক্ষিত",
      searchPh: "ডাক্তার, ওষুধ বা ফাইলের নাম খুঁজুন...",
      filterAll: "সবগুলো",
      filterNormal: "স্বাভাবিক",
      filterFollowup: "ফলো-আপ",
      filterUrgent: "জরুরি",
      sortNew: "নতুন আগে",
      sortOld: "পুরনো আগে",
      sortDoctor: "ডাক্তারের নাম",
      viewGrid: "কার্ড গ্রিড",
      viewTable: "ডেটা টেবিল",
      tableCardTitle: "প্রেসক্রিপশন ডেটা টেবিল",
      btnExportCsv: "CSV এক্সপোর্ট",
      thDate: "তারিখ ও সময়",
      thDoctor: "ডাক্তার ও হাসপাতাল",
      thPatient: "রোগীর তথ্য",
      thMeds: "ওষুধসমূহ (Rx)",
      thStatus: "ক্যাটাগরি ও রিফিল",
      thFiles: "সংযুক্তি",
      thAction: "অ্যাকশন",
      noFiles: "সংযুক্তি নেই",
      openBtn: "দেখুন",
      btnDownload: "ডাউনলোড",
      btnPrint: "প্রিন্ট করুন",
      btnClose: "বন্ধ করুন",
      btnUploadNew: "নতুন আপলোড করুন",
      btnCreateStudio: "প্রেসক্রিপশন তৈরি",
      emptyTitle: "এখনো কোনো প্রেসক্রিপশন সংরক্ষিত নেই",
      emptyDesc: "প্রেসক্রিপশন ভল্টে ছবি বা PDF আপলোড করে সংরক্ষণ করুন অথবা ডিজিটাল প্রেসক্রিপশন স্টুডিওতে নতুন প্রেসক্রিপশন তৈরি করুন।",
      confirmDelete: "আপনি কি নিশ্চিতভাবে এই প্রেসক্রিপশনটি ভল্ট থেকে মুছে ফেলতে চান?",
      toastDeleted: "প্রেসক্রিপশন সফলভাবে মুছে ফেলা হয়েছে।",
      toastCsvExported: "CSV ফাইল সফলভাবে ডাউনলোড হয়েছে!",
      refillDue: "রিফিল বাকি!",
      refillSoon: "শীঘ্রই রিফিল",
      refillOk: "রিফিল ঠিক আছে",
      moreFiles: "+{n}টি ফাইল",
      moreMeds: "+{n}টি আরও",
      langSelectTitle: "ভাষা পরিবর্তন",
      quickToolsTitle: "দ্রুত অ্যাকশন",
      navPagesTitle: "পেজ ও মডিউল",
      titleViewGrid: "কার্ড গ্রিড ভিউ",
      titleViewTable: "ডেটা টেবিল ভিউ",
      footerTag: "প্রতিটি নিঃশ্বাসে একটি প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।",
      sidebarBrandSub: "ডিজিটাল স্বাস্থ্য ভল্ট",
      digitalRxRecord: "ডিজিটাল প্রেসক্রিপশন",
      tabDocView: "সংযুক্ত ফাইল",
      tabRecordView: "ক্লিনিক্যাল প্রেসক্রিপশন",
      lblVitals: "শারীরিক পরীক্ষা (Vitals)",
      lblDx: "রোগনির্ণয় (Dx)",
      lblCC: "প্রধান সমস্যা (C/C)",
      lblHO: "অতীত ইতিহাস (H/O)",
      lblInv: "ল্যাব পরীক্ষা (Inv.)",
      lblAdvice: "পরামর্শ ও নির্দেশনা",
      lblRefill: "পরবর্তী সাক্ষাৎ / রিফিল",
      noClinicalData: "কোনো ক্লিনিক্যাল তথ্য রেকর্ড করা নেই।"
    },
    en: {
      navHome: "Home",
      navExercises: "Breathing Exercises",
      navTest: "Breath Test",
      navHealth: "Health Tracker",
      navRx: "Prescriptions",
      navSafety: "Safety",
      navMore: "More",
      tabVault: "Prescription Vault",
      tabHistory: "Prescription History",
      tabDigitalPadHistory: "Digital Pad History",
      tabCreate: "Create Prescription",
      tabPad: "Digital Pad",
      historyEyebrow: "Digital Prescription Archive",
      historyTitle: "Prescription History & Vault",
      historySub: "Easily search, filter by urgency, inspect documents in high resolution, and manage refill dates.",
      storageLabel: "Storage Usage",
      storageCount: "prescriptions saved",
      searchPh: "Search doctor, medicine or file...",
      filterAll: "All",
      filterNormal: "Normal",
      filterFollowup: "Follow-up",
      filterUrgent: "Urgent",
      sortNew: "Newest First",
      sortOld: "Oldest First",
      sortDoctor: "Doctor Name",
      viewGrid: "Card Grid",
      viewTable: "Data Table",
      tableCardTitle: "Prescription Data Table",
      btnExportCsv: "Export CSV",
      thDate: "Date & Time",
      thDoctor: "Doctor & Hospital",
      thPatient: "Patient Info",
      thMeds: "Medicines (Rx)",
      thStatus: "Category & Refill",
      thFiles: "Attachments",
      thAction: "Actions",
      noFiles: "No files",
      openBtn: "View",
      btnDownload: "Download",
      btnPrint: "Print",
      btnClose: "Close",
      btnUploadNew: "Upload New",
      btnCreateStudio: "Create Prescription",
      emptyTitle: "No Prescriptions Found",
      emptyDesc: "Upload clinical prescription files in the Vault or design custom prescriptions in the Digital Studio to populate your archive.",
      confirmDelete: "Are you sure you want to permanently delete this prescription?",
      toastDeleted: "Prescription deleted successfully.",
      toastCsvExported: "CSV file downloaded successfully!",
      refillDue: "Refill due!",
      refillSoon: "Refill soon",
      refillOk: "Refill OK",
      moreFiles: "+{n} files",
      moreMeds: "+{n} more",
      langSelectTitle: "Language Selection",
      quickToolsTitle: "Quick Actions",
      navPagesTitle: "Pages & Modules",
      titleViewGrid: "Card Grid View",
      titleViewTable: "Data Table View",
      footerTag: "A touch of serenity with every breath",
      footerDisclaimer: "For general wellness only. Not medical advice.",
      sidebarBrandSub: "Digital Health Vault",
      digitalRxRecord: "Digital Prescription",
      tabDocView: "Attached Files",
      tabRecordView: "Clinical Prescription",
      lblVitals: "Physical Exam (Vitals)",
      lblDx: "Diagnosis (Dx)",
      lblCC: "Chief Complaints (C/C)",
      lblHO: "History of Illness (H/O)",
      lblInv: "Investigations (Inv.)",
      lblAdvice: "Advice & Instructions",
      lblRefill: "Next Follow-up / Refill",
      noClinicalData: "No clinical data recorded."
    }
  };

  /**
   * Helper to retrieve localized text.
   * @param {string} key - Dictionary key.
   * @returns {string} Localized string.
   */
  function tr(key) {
    return PH_T[currentLang]?.[key] || PH_T["en"]?.[key] || key;
  }

  /**
   * Returns localized configuration object for DataTables 2 internationalization.
   * @returns {Object} DataTables language configuration.
   */
  function getDTLanguageConfig() {
    const isBn = currentLang === "bn";
    return {
      search: isBn ? "টেবিলে খুঁজুন:" : "Search Table:",
      searchPlaceholder: isBn ? "ডাক্তার, ওষুধ বা তারিখ..." : "Doctor, meds or date...",
      lengthMenu: isBn ? "_MENU_ টি রেকর্ড প্রদর্শন" : "Show _MENU_ entries",
      info: isBn ? "_TOTAL_ টির মধ্যে _START_ থেকে _END_ টি প্রদর্শন" : "Showing _START_ to _END_ of _TOTAL_ entries",
      infoEmpty: isBn ? "কোনো রেকর্ড পাওয়া যায়নি" : "No entries available",
      infoFiltered: isBn ? "(মোট _MAX_ টি রেকর্ড থেকে ফিল্টারকৃত)" : "(filtered from _MAX_ total entries)",
      zeroRecords: isBn ? "কোনো রেকর্ড মেলেনি" : "No matching records found",
      paginate: {
        first: isBn ? "প্রথম" : "First",
        last: isBn ? "শেষ" : "Last",
        next: isBn ? "পরবর্তী" : "Next",
        previous: isBn ? "পূর্ববর্তী" : "Previous"
      }
    };
  }

  // ============================================================================
  // 3. STORAGE & DATA NORMALIZATION ENGINE
  // ============================================================================
  function phLoad() {
    try {
      const raw = localStorage.getItem(RX_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error reading prescriptions vault:", e);
      return [];
    }
  }

  function phSave(records) {
    try {
      localStorage.setItem(RX_KEY, JSON.stringify(records));
    } catch (e) {
      console.error("Error saving prescriptions vault:", e);
      phToast("স্টোরেজ পূর্ণ হয়ে গেছে। কিছু ফাইল মুছে ফেলুন।", "error");
    }
  }

  /**
   * Normalizes any prescription record (from vault, pad, or create-studio)
   * into a unified schema with 100% field availability.
   * @param {Object} r - Raw prescription record.
   * @returns {Object} Normalized record.
   */
  function phNormalizeRecord(r) {
    if (!r) return null;
    const dateVal = r.date || r.prescDate || (r.createdAt ? r.createdAt.split("T")[0] : "");
    const docName = r.doctor || r.doctorName || "";
    const docDeg = r.degrees || "";
    const docReg = r.regNo || r.doctorReg || "";
    const hosp = r.hospital || r.clinic || "";
    const hospAddr = r.address || r.doctorAddress || "";
    const hospPhone = r.phone || r.doctorPhone || "";
    const patName = r.patientName || r.patName || "";
    const patAge = r.patientAge || r.age || "";
    const patSex = r.patientGender || r.sex || "";
    const serialNo = r.serialNo || "";
    const dx = r.diagnosis || r.treatment?.dx || "";
    const adv = r.notes || r.advice || r.treatment?.advice || "";
    const refill = r.refillDate || r.followUp || "";
    const urgency = r.urgency || "normal";
    const vitals = r.vitals || r.clinical?.oe || {};
    const cc = Array.isArray(r.cc) ? r.cc : Array.isArray(r.clinical?.cc) ? r.clinical.cc : [];
    const ho = Array.isArray(r.ho) ? r.ho : Array.isArray(r.clinical?.ho) ? r.clinical.ho : [];
    const inv = Array.isArray(r.inv) ? r.inv : Array.isArray(r.clinical?.inv) ? r.clinical.inv : [];
    const files = Array.isArray(r.files) ? r.files : [];

    // Normalize medicines to array of structured objects
    let meds = [];
    if (Array.isArray(r.medsStructured) && r.medsStructured.length) {
      meds = r.medsStructured.map((m) =>
        typeof m === "string" ? { name: m, form: "Tab", dosage: "", timing: "", duration: "", note: "" } : m
      );
    } else if (Array.isArray(r.medicines) && r.medicines.length) {
      meds = r.medicines.map((m) =>
        typeof m === "string" ? { name: m, form: "Tab", dosage: "", timing: "", duration: "", note: "" } : m
      );
    } else if (Array.isArray(r.meds) && r.meds.length) {
      meds = r.meds.map((m) =>
        typeof m === "string" ? { name: m, form: "Tab", dosage: "", timing: "", duration: "", note: "" } : m
      );
    }

    return {
      ...r,
      date: dateVal,
      prescDate: dateVal,
      doctor: docName,
      doctorName: docName,
      degrees: docDeg,
      regNo: docReg,
      doctorReg: docReg,
      hospital: hosp,
      clinic: hosp,
      address: hospAddr,
      phone: hospPhone,
      patientName: patName,
      patName: patName,
      patientAge: patAge,
      age: patAge,
      patientGender: patSex,
      sex: patSex,
      serialNo: serialNo,
      diagnosis: dx,
      notes: adv,
      advice: adv,
      refillDate: refill,
      followUp: refill,
      urgency: urgency,
      vitals: vitals,
      cc: cc,
      ho: ho,
      inv: inv,
      medicines: meds,
      meds: meds.map((m) =>
        typeof m === "string" ? m : `${m.form ? m.form + ". " : ""}${m.name} (${m.dosage || "1+0+1"})`
      ),
      files: files
    };
  }

  function phUpdateStorage() {
    const records = phLoad();
    const countEl = $("phStorageCount");
    const bytesEl = $("phStorageBytes");
    const barEl = $("phStorageBar");

    const raw = localStorage.getItem(RX_KEY) || "";
    const bytes = new Blob([raw]).size;
    const kb = (bytes / 1024).toFixed(1);
    const pct = Math.min(100, Math.round((bytes / STORAGE_MAX_BYTES) * 100));

    if (countEl) {
      const countNum = currentLang === "bn" ? records.length.toLocaleString("bn-BD") : records.length;
      countEl.textContent = `${countNum} ${tr("storageCount")}`;
    }

    if (bytesEl) {
      bytesEl.textContent = `${kb} KB / 10 MB (${pct}%)`;
    }

    if (barEl) {
      barEl.style.width = `${pct}%`;
      barEl.classList.toggle("warn", pct > 75);
    }
  }

  // ============================================================================
  // 4. FILTERING & SORTING LOGIC
  // ============================================================================
  function phGetDisplayRecords() {
    let records = phLoad().map(phNormalizeRecord).filter(Boolean);

    // 1. Urgency filter
    if (galleryFilter !== "all") {
      records = records.filter((r) => r.urgency === galleryFilter);
    }

    // 2. Search query filter
    if (gallerySearch) {
      const q = gallerySearch.toLowerCase();
      records = records.filter((r) => {
        const doc = (r.doctor || "").toLowerCase();
        const deg = (r.degrees || "").toLowerCase();
        const hosp = (r.hospital || "").toLowerCase();
        const pat = (r.patientName || "").toLowerCase();
        const dx = (r.diagnosis || "").toLowerCase();
        const notes = (r.notes || "").toLowerCase();
        const fName = (r.fileName || "").toLowerCase();
        const ccStr = (r.cc || []).join(" ").toLowerCase();
        const hoStr = (r.ho || []).join(" ").toLowerCase();
        const invStr = (r.inv || []).join(" ").toLowerCase();
        const medsStr = (r.medicines || []).map((m) => (m.name || m || "")).join(" ").toLowerCase();
        const filesStr = (r.files || []).map((f) => (f.name || "")).join(" ").toLowerCase();

        return (
          doc.includes(q) ||
          deg.includes(q) ||
          hosp.includes(q) ||
          pat.includes(q) ||
          dx.includes(q) ||
          notes.includes(q) ||
          fName.includes(q) ||
          ccStr.includes(q) ||
          hoStr.includes(q) ||
          invStr.includes(q) ||
          medsStr.includes(q) ||
          filesStr.includes(q)
        );
      });
    }

    // 3. Sorting
    records.sort((a, b) => {
      if (gallerySort === "new") return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0);
      if (gallerySort === "old") return new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0);
      if (gallerySort === "doctor") return (a.doctor || "").localeCompare(b.doctor || "");
      return 0;
    });

    return records;
  }

  // ============================================================================
  // 5. FORMAT 1: GALLERY CARD GRID RENDERING
  // ============================================================================
  function phRenderGallery() {
    const gallery = $("phGallery");
    if (!gallery) return;

    const records = phGetDisplayRecords();
    lbRecordList = records;

    if (!records.length) {
      gallery.innerHTML = `
        <div class="ph-empty">
          <i class="bi bi-folder2-open ph-empty-icon"></i>
          <h3 class="ph-empty-title">${escapeHtml(tr("emptyTitle"))}</h3>
          <p class="ph-empty-desc">${escapeHtml(tr("emptyDesc"))}</p>
          <div class="d-flex flex-wrap align-items-center justify-content-center gap-2">
            <a href="prescriptions-volt.html" class="btn btn-sm btn-primary rounded-pill px-4 py-2 fw-semibold">
              <i class="bi bi-cloud-arrow-up-fill me-1"></i> ${escapeHtml(tr("btnUploadNew"))}
            </a>
            <a href="prescription-create.html" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2 fw-semibold">
              <i class="bi bi-pencil-square me-1"></i> ${escapeHtml(tr("btnCreateStudio"))}
            </a>
          </div>
        </div>
      `;
      return;
    }

    gallery.innerHTML = records
      .map((rec, idx) => {
        const fileCount = rec.files?.length || 0;
        const firstFile = rec.files?.[0];
        const isPdf = firstFile?.mime === "application/pdf" || (firstFile?.name || "").endsWith(".pdf");

        // Urgency ribbon
        const urgency = rec.urgency || "normal";
        const urgencyLabel =
          urgency === "urgent"
            ? tr("filterUrgent")
            : urgency === "followup"
              ? tr("filterFollowup")
              : tr("filterNormal");

        // Refill calculation
        let refillHtml = "";
        if (rec.refillDate) {
          const days = phDaysUntilRefill(rec.refillDate);
          if (days <= 0) {
            refillHtml = `<span class="ph-card-refill due">${escapeHtml(tr("refillDue"))}</span>`;
          } else if (days <= 5) {
            refillHtml = `<span class="ph-card-refill soon">${escapeHtml(tr("refillSoon"))} (${days}d)</span>`;
          } else {
            refillHtml = `<span class="ph-card-refill ok">${escapeHtml(tr("refillOk"))}</span>`;
          }
        }

        // Medicines chip preview
        const meds = rec.medicines || [];
        const medPreview = meds
          .slice(0, 3)
          .map((m) => `<span class="ph-card-med-chip">${escapeHtml(m.name || m)}</span>`)
          .join("");
        const moreCount = meds.length - 3;
        const moreMeds =
          moreCount > 0
            ? `<span class="ph-card-med-more">${tr("moreMeds").replace("{n}", moreCount)}</span>`
            : "";

        // Vitals row
        let vitalsHtml = "";
        const v = rec.vitals || {};
        if (v.bp || v.pulse || v.temp || v.weight) {
          vitalsHtml = `
            <div class="ph-card-vitals-row">
              ${v.bp ? `<span class="ph-card-vital-pill"><i class="bi bi-heart-pulse text-danger me-1"></i>BP ${escapeHtml(v.bp)}</span>` : ""}
              ${v.pulse ? `<span class="ph-card-vital-pill"><i class="bi bi-activity text-teal me-1"></i>Pulse ${escapeHtml(v.pulse)}</span>` : ""}
              ${v.temp ? `<span class="ph-card-vital-pill"><i class="bi bi-thermometer-half text-warning me-1"></i>${escapeHtml(v.temp)}°F</span>` : ""}
              ${v.weight ? `<span class="ph-card-vital-pill"><i class="bi bi-speedometer2 text-primary me-1"></i>${escapeHtml(v.weight)}kg</span>` : ""}
            </div>
          `;
        }

        // Thumbnail markup
        let thumbContent = "";
        if (firstFile) {
          if (isPdf) {
            thumbContent = `
              <div class="ph-card-thumb-pdf">
                <i class="bi bi-file-earmark-pdf-fill"></i>
                <span>PDF DOCUMENT</span>
              </div>
            `;
          } else {
            thumbContent = `<img src="${firstFile.data}" alt="${escapeHtml(rec.doctor || "Prescription")}" loading="lazy">`;
          }
        } else {
          thumbContent = `
            <div class="ph-card-thumb-digital">
              <i class="bi bi-file-earmark-medical"></i>
              <span>${escapeHtml(tr("digitalRxRecord"))}</span>
              ${rec.diagnosis ? `<div class="ph-digital-dx">${escapeHtml(rec.diagnosis)}</div>` : ""}
            </div>
          `;
        }

        const dateStr = phFmtDate(rec.date);

        return `
          <div class="ph-card" data-id="${rec.id}">
            <div class="ph-card-thumb" role="button" tabindex="0" aria-label="Open viewer" data-record-idx="${idx}">
              <span class="ph-card-ribbon ${urgency}">${escapeHtml(urgencyLabel)}</span>
              ${fileCount > 1 ? `<span class="ph-files-count">${tr("moreFiles").replace("{n}", fileCount)}</span>` : ""}
              ${thumbContent}
              <div class="ph-thumb-overlay">
                <button type="button" class="ph-open-btn">
                  <i class="bi bi-arrows-fullscreen"></i> ${escapeHtml(tr("openBtn"))}
                </button>
              </div>
            </div>

            <div class="ph-card-body">
              <h3 class="ph-card-doctor" title="${escapeHtml(rec.doctor || "ডাক্তারের নাম উল্লেখ নেই")}">
                ${escapeHtml(rec.doctor || (currentLang === "bn" ? "ডাক্তার: উল্লেখ নেই" : "Doctor: Not specified"))}
              </h3>
              ${rec.degrees ? `<div class="text-xs text-muted mb-1 text-truncate">${escapeHtml(rec.degrees)}</div>` : ""}
              <div class="ph-card-clinic" title="${escapeHtml(rec.hospital || "")}">
                ${escapeHtml(rec.hospital || (currentLang === "bn" ? "হাসপাতাল/ক্লিনিক নেই" : "No clinic info"))}
              </div>

              ${rec.patientName ? `
                <div class="ph-card-patient">
                  <i class="bi bi-person text-secondary"></i>
                  <span>${escapeHtml(rec.patientName)}</span>
                  ${rec.patientAge ? `<span class="text-muted">(${escapeHtml(rec.patientAge)})</span>` : ""}
                  ${rec.patientGender ? `<span class="badge bg-light text-muted border text-xs ms-1">${escapeHtml(rec.patientGender)}</span>` : ""}
                </div>
              ` : ""}

              ${rec.diagnosis ? `
                <div class="my-1">
                  <span class="badge bg-teal-subtle text-teal border border-teal-subtle text-xs">${escapeHtml(rec.diagnosis)}</span>
                </div>
              ` : ""}

              ${vitalsHtml}

              ${meds.length ? `<div class="ph-card-meds">${medPreview}${moreMeds}</div>` : ""}

              <div class="ph-card-footer">
                <span class="ph-card-date">
                  <i class="bi bi-calendar3"></i> ${dateStr}
                </span>
                ${refillHtml}
                <div class="ph-card-actions">
                  <button type="button" class="ph-card-btn view" title="${escapeHtml(tr("openBtn"))}" data-record-idx="${idx}">
                    <i class="bi bi-eye-fill"></i>
                  </button>
                  <button type="button" class="ph-card-btn del" title="Delete" data-id="${rec.id}">
                    <i class="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    // Bind card thumbnail & view buttons
    gallery.querySelectorAll(".ph-card-thumb, .ph-card-btn.view").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.dataset.recordIdx, 10);
        if (!isNaN(idx) && lbRecordList[idx]) {
          phOpenLightbox(idx, 0);
        }
      });
    });

    // Bind card delete buttons
    gallery.querySelectorAll(".ph-card-btn.del").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (!id) return;
        if (confirm(tr("confirmDelete"))) {
          const records = phLoad().filter((item) => item.id !== id);
          phSave(records);
          phRenderGallery();
          phRenderTable();
          phUpdateStorage();
          phToast(tr("toastDeleted"), "info");
        }
      });
    });
  }

  // ============================================================================
  // 6. FORMAT 2: DATA TABLE VIEW (Styled as Health History Table)
  // ============================================================================
  function phRenderTable() {
    const tbody = $("phTableTbody");
    const tableEl = $("prescriptionHistoryTable");
    if (!tbody || !tableEl) return;

    const records = phGetDisplayRecords();
    lbRecordList = records;

    // Destroy previous DataTable instance before re-populating DOM
    if (dataTableInstance) {
      try {
        dataTableInstance.destroy();
      } catch (e) {
        console.warn("DataTable destroy warning:", e);
      }
      dataTableInstance = null;
    }

    if (!records.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-5 text-muted">
            <i class="bi bi-folder2-open fs-2 d-block mb-2 text-secondary"></i>
            <div class="fw-bold mb-1">${escapeHtml(tr("emptyTitle"))}</div>
            <div class="small">${escapeHtml(tr("emptyDesc"))}</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = records
      .map((rec, idx) => {
        const fileCount = rec.files?.length || 0;
        const firstFile = rec.files?.[0];
        const isPdf = firstFile?.mime === "application/pdf" || (firstFile?.name || "").endsWith(".pdf");

        // Urgency ribbon label & class
        const urgency = rec.urgency || "normal";
        const urgencyLabel =
          urgency === "urgent"
            ? tr("filterUrgent")
            : urgency === "followup"
              ? tr("filterFollowup")
              : tr("filterNormal");

        // Refill badge
        let refillHtml = "";
        if (rec.refillDate) {
          const days = phDaysUntilRefill(rec.refillDate);
          if (days <= 0) {
            refillHtml = `<span class="ph-card-refill due d-inline-block mt-1">${escapeHtml(tr("refillDue"))}</span>`;
          } else if (days <= 5) {
            refillHtml = `<span class="ph-card-refill soon d-inline-block mt-1">${escapeHtml(tr("refillSoon"))} (${days}d)</span>`;
          } else {
            refillHtml = `<span class="ph-card-refill ok d-inline-block mt-1">${escapeHtml(tr("refillOk"))}</span>`;
          }
        }

        // Medicines chip preview
        const meds = rec.medicines || [];
        const medPreview = meds
          .slice(0, 3)
          .map((m) => `<span class="ph-card-med-chip">${escapeHtml(m.name || m)}</span>`)
          .join("");
        const moreCount = meds.length - 3;
        const moreMeds =
          moreCount > 0
            ? `<span class="ph-card-med-more">${tr("moreMeds").replace("{n}", moreCount)}</span>`
            : "";

        const timeMs = new Date(rec.date || rec.createdAt || 0).getTime() || 0;
        const dateStr = phFmtDate(rec.date);

        // Attachment badge
        let fileBadge = "";
        if (fileCount > 0) {
          fileBadge = `
            <button type="button" class="btn ph-tbl-file-badge" data-record-idx="${idx}" title="${escapeHtml(tr("openBtn"))}">
              <i class="bi ${isPdf ? "bi-file-earmark-pdf-fill text-danger" : "bi-image text-teal"}"></i>
              <span>${fileCount} ${tr("moreFiles").replace("{n}", "")}</span>
            </button>
          `;
        } else {
          fileBadge = `
            <button type="button" class="btn ph-tbl-file-badge border-primary-subtle text-primary bg-primary-subtle" data-record-idx="${idx}" title="${escapeHtml(tr("openBtn"))}">
              <i class="bi bi-file-earmark-medical"></i>
              <span>${escapeHtml(tr("digitalRxRecord"))}</span>
            </button>
          `;
        }

        return `
          <tr>
            <td data-order="${timeMs}">
              <span class="text-nowrap"><i class="bi bi-calendar3 me-1 text-muted"></i>${dateStr}</span>
            </td>
            <td>
              <span class="ph-tbl-doc">${escapeHtml(rec.doctor || "—")}</span>
              ${rec.degrees ? `<div class="text-xs text-muted">${escapeHtml(rec.degrees)}</div>` : ""}
              ${rec.regNo ? `<span class="badge bg-light text-secondary border text-xs me-1">BMDC: ${escapeHtml(rec.regNo)}</span>` : ""}
              ${rec.hospital ? `<span class="ph-tbl-clinic"><i class="bi bi-hospital me-1"></i>${escapeHtml(rec.hospital)}</span>` : ""}
            </td>
            <td>
              <span class="ph-tbl-pat">
                <i class="bi bi-person text-secondary"></i>
                ${escapeHtml(rec.patientName || "—")}
              </span>
              <div class="d-flex align-items-center gap-1 mt-1">
                ${rec.patientAge ? `<span class="ph-tbl-age">${escapeHtml(rec.patientAge)}</span>` : ""}
                ${rec.patientGender ? `<span class="badge bg-light text-muted border text-xs">${escapeHtml(rec.patientGender)}</span>` : ""}
                ${rec.serialNo ? `<span class="text-xs text-muted ms-1">SL: ${escapeHtml(rec.serialNo)}</span>` : ""}
              </div>
            </td>
            <td>
              ${rec.diagnosis ? `<div class="mb-1"><span class="badge bg-teal-subtle text-teal border border-teal-subtle text-xs">${escapeHtml(rec.diagnosis)}</span></div>` : ""}
              <div class="ph-tbl-meds">
                ${medPreview || '<span class="text-muted small">—</span>'}
                ${moreMeds}
              </div>
            </td>
            <td>
              <span class="ph-card-ribbon position-static ${urgency}">${escapeHtml(urgencyLabel)}</span>
              ${refillHtml ? `<div>${refillHtml}</div>` : ""}
            </td>
            <td>${fileBadge}</td>
            <td class="text-end">
              <div class="d-inline-flex align-items-center gap-1">
                <button type="button" class="ph-card-btn view" title="${escapeHtml(tr("openBtn"))}" data-record-idx="${idx}">
                  <i class="bi bi-eye-fill"></i>
                </button>
                <button type="button" class="ph-card-btn del" title="Delete" data-id="${rec.id}">
                  <i class="bi bi-trash3-fill"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");

    // Initialize DataTables 2 if library is loaded
    if (typeof DataTable !== "undefined" && records.length > 0) {
      try {
        dataTableInstance = new DataTable(tableEl, {
          order: [[0, "desc"]],
          columnDefs: [{ orderable: false, targets: [3, 5, 6] }],
          pageLength: 10,
          lengthMenu: [5, 10, 25, 50],
          language: getDTLanguageConfig()
        });
      } catch (err) {
        console.warn("DataTable initialization error:", err);
      }
    }

    // Bind table viewer buttons
    tbody.querySelectorAll(".ph-tbl-file-badge, .ph-card-btn.view").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.dataset.recordIdx, 10);
        if (!isNaN(idx) && lbRecordList[idx]) {
          phOpenLightbox(idx, 0);
        }
      });
    });

    // Bind table delete buttons
    tbody.querySelectorAll(".ph-card-btn.del").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (!id) return;
        if (confirm(tr("confirmDelete"))) {
          const records = phLoad().filter((item) => item.id !== id);
          phSave(records);
          phRenderGallery();
          phRenderTable();
          phUpdateStorage();
          phToast(tr("toastDeleted"), "info");
        }
      });
    });
  }

  // ============================================================================
  // 7. VIEW FORMAT SWITCHER (Grid vs Table)
  // ============================================================================
  function phApplyViewFormat(format) {
    currentViewFormat = format === "table" ? "table" : "grid";
    try {
      localStorage.setItem(VIEW_KEY, currentViewFormat);
    } catch (_) { }

    const btnGrid = $("btnViewGrid");
    const btnTable = $("btnViewTable");
    const wrapGrid = $("phGalleryViewWrap");
    const wrapTable = $("phTableViewWrap");

    if (btnGrid && btnTable) {
      btnGrid.classList.toggle("active", currentViewFormat === "grid");
      btnTable.classList.toggle("active", currentViewFormat === "table");
    }

    if (wrapGrid && wrapTable) {
      if (currentViewFormat === "table") {
        wrapGrid.classList.add("d-none");
        wrapTable.classList.remove("d-none");
        if (dataTableInstance) {
          setTimeout(() => {
            try {
              dataTableInstance.columns.adjust();
            } catch (_) { }
          }, 50);
        }
      } else {
        wrapTable.classList.add("d-none");
        wrapGrid.classList.remove("d-none");
      }
    }
  }

  // ============================================================================
  // 8. RFC 4180 CSV EXPORT ENGINE (With UTF-8 BOM)
  // ============================================================================
  function phExportCSV() {
    const records = phGetDisplayRecords();
    if (!records.length) {
      phToast("এক্সপোর্ট করার মতো কোনো প্রেসক্রিপশন পাওয়া যায়নি।", "warn");
      return;
    }

    const headers = [
      "Record ID",
      "Date",
      "Doctor Name",
      "Degrees",
      "BMDC Reg",
      "Hospital/Clinic",
      "Hospital Address",
      "Phone",
      "Patient Name",
      "Patient Age",
      "Patient Gender",
      "Serial No",
      "Blood Pressure",
      "Pulse Rate",
      "Temperature",
      "Weight",
      "Chief Complaints (C/C)",
      "History of Illness (H/O)",
      "Investigations (Inv.)",
      "Diagnosis (Dx)",
      "Medicines (Rx)",
      "Doctor Advice",
      "Urgency",
      "Refill Date",
      "Files Count"
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = records.map((r) => {
      const v = r.vitals || {};
      const medsStr = (r.medicines || [])
        .map((m) =>
          typeof m === "object"
            ? `${m.form ? m.form + ". " : ""}${m.name || ""}${m.dosage ? ` (${m.dosage})` : ""}${m.timing ? ` - ${m.timing}` : ""}${m.duration ? ` - ${m.duration}` : ""}`
            : m
        )
        .join("; ");

      return [
        escapeCsv(r.id),
        escapeCsv(r.date || ""),
        escapeCsv(r.doctor || ""),
        escapeCsv(r.degrees || ""),
        escapeCsv(r.regNo || ""),
        escapeCsv(r.hospital || ""),
        escapeCsv(r.address || ""),
        escapeCsv(r.phone || ""),
        escapeCsv(r.patientName || ""),
        escapeCsv(r.patientAge || ""),
        escapeCsv(r.patientGender || ""),
        escapeCsv(r.serialNo || ""),
        escapeCsv(v.bp || ""),
        escapeCsv(v.pulse || ""),
        escapeCsv(v.temp || ""),
        escapeCsv(v.weight || ""),
        escapeCsv((r.cc || []).join(", ")),
        escapeCsv((r.ho || []).join(", ")),
        escapeCsv((r.inv || []).join(", ")),
        escapeCsv(r.diagnosis || ""),
        escapeCsv(medsStr),
        escapeCsv(r.notes || r.advice || ""),
        escapeCsv(r.urgency || "normal"),
        escapeCsv(r.refillDate || ""),
        escapeCsv(r.files?.length || 0)
      ].join(",");
    });

    // UTF-8 BOM (\uFEFF) ensures Bengali characters render correctly in Excel
    const csvContent = "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `BreatheWell_Prescriptions_${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    phToast(tr("toastCsvExported"), "success");
  }

  // ============================================================================
  // 9. LIGHTBOX & CLINICAL SHEET VIEWER
  // ============================================================================
  function phOpenLightbox(recIdx, fileIdx = 0) {
    lbRecordIndex = recIdx;
    lbFileIndex = fileIdx;

    const rec = lbRecordList[lbRecordIndex];
    const files = rec?.files || [];
    lbActiveTab = files.length > 0 ? "file" : "clinical";

    const lb = $("phLightbox");
    if (!lb) return;

    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    phRenderLightboxContent();
  }

  function phCloseLightbox() {
    const lb = $("phLightbox");
    if (lb) lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  function phRenderLightboxContent() {
    const rec = lbRecordList[lbRecordIndex];
    if (!rec) return phCloseLightbox();

    const titleEl = $("lbTitle");
    const metaEl = $("lbMeta");
    const viewer = $("lbViewer");
    const strip = $("lbStrip");
    const prevBtn = $("lbPrev");
    const nextBtn = $("lbNext");
    const dlBtn = $("lbDownload");

    const files = rec.files || [];
    const isBn = currentLang === "bn";
    const dateStr = phFmtDate(rec.date);

    if (titleEl) {
      titleEl.innerHTML = `
        <div class="d-flex align-items-center flex-wrap gap-2">
          <span>${escapeHtml(rec.doctor || (isBn ? "প্রেসক্রিপশন বিবরণী" : "Prescription Document"))}</span>
          ${files.length > 0 ? `
            <div class="ph-lb-tab-group ms-2">
              <button type="button" class="ph-lb-tab ${lbActiveTab === "file" ? "active" : ""}" id="btnLbTabFile">
                <i class="bi bi-file-earmark-image me-1"></i>${escapeHtml(tr("tabDocView"))}
              </button>
              <button type="button" class="ph-lb-tab ${lbActiveTab === "clinical" ? "active" : ""}" id="btnLbTabClinical">
                <i class="bi bi-file-earmark-text me-1"></i>${escapeHtml(tr("tabRecordView"))}
              </button>
            </div>
          ` : ""}
        </div>
      `;

      // Bind tab switchers
      $("btnLbTabFile")?.addEventListener("click", () => {
        lbActiveTab = "file";
        phRenderLightboxContent();
      });
      $("btnLbTabClinical")?.addEventListener("click", () => {
        lbActiveTab = "clinical";
        phRenderLightboxContent();
      });
    }

    if (metaEl) {
      metaEl.textContent = `${rec.patientName ? rec.patientName + " · " : ""}${dateStr} · ${rec.hospital || ""}`;
    }

    // --- CASE 1: Active Tab is FILE and files exist ---
    if (lbActiveTab === "file" && files.length > 0) {
      if (prevBtn) prevBtn.style.display = files.length > 1 ? "grid" : "none";
      if (nextBtn) nextBtn.style.display = files.length > 1 ? "grid" : "none";

      if (strip) {
        if (files.length > 1) {
          strip.style.display = "flex";
          strip.innerHTML = files
            .map((f, i) => {
              const isPdf = f.mime === "application/pdf" || (f.name || "").endsWith(".pdf");
              const src = isPdf ? "https://cdn-icons-png.flaticon.com/512/337/337946.png" : f.data;
              return `<img src="${src}" class="ph-lb-thumb ${i === lbFileIndex ? "active" : ""}" data-idx="${i}" alt="Attachment ${i + 1}">`;
            })
            .join("");

          strip.querySelectorAll(".ph-lb-thumb").forEach((th) => {
            th.addEventListener("click", () => {
              lbFileIndex = parseInt(th.dataset.idx, 10);
              phRenderLightboxContent();
            });
          });
        } else {
          strip.style.display = "none";
        }
      }

      if (viewer) {
        const file = files[lbFileIndex];
        const isPdf = file?.mime === "application/pdf" || (file?.name || "").endsWith(".pdf");
        if (isPdf) {
          viewer.innerHTML = `<iframe src="${file.data}" class="w-100 h-100 border-0 rounded-2" style="min-height:70vh;"></iframe>`;
        } else if (file?.data) {
          viewer.innerHTML = `<img src="${file.data}" class="ph-lb-img" alt="${escapeHtml(file.name || "Prescription")}">`;
        } else {
          viewer.innerHTML = `<div class="text-white text-center p-4">${escapeHtml(tr("noFiles"))}</div>`;
        }
      }

      if (dlBtn) {
        dlBtn.innerHTML = `<i class="bi bi-download"></i> <span>${escapeHtml(tr("btnDownload"))}</span>`;
        const file = files[lbFileIndex];
        dlBtn.onclick = () => {
          if (!file) return;
          const a = document.createElement("a");
          a.href = file.data;
          a.download = file.name || "prescription";
          a.click();
        };
      }
      return;
    }

    // --- CASE 2: Active Tab is CLINICAL or NO files attached ---
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (strip) strip.style.display = "none";

    const v = rec.vitals || {};
    const hasVitals = v.bp || v.pulse || v.temp || v.weight;
    const hasCC = rec.cc && rec.cc.length > 0;
    const hasHO = rec.ho && rec.ho.length > 0;
    const hasInv = rec.inv && rec.inv.length > 0;
    const medsList = rec.medicines || [];

    const vitalsHtml = hasVitals
      ? `
        <div class="mb-3">
          <div class="ph-sheet-section-title"><i class="bi bi-heart-pulse text-danger"></i>${escapeHtml(tr("lblVitals"))}</div>
          <div class="ph-sheet-chip-list">
            ${v.bp ? `<span class="ph-sheet-chip"><strong>BP:</strong> ${escapeHtml(v.bp)}</span>` : ""}
            ${v.pulse ? `<span class="ph-sheet-chip"><strong>Pulse:</strong> ${escapeHtml(v.pulse)} bpm</span>` : ""}
            ${v.temp ? `<span class="ph-sheet-chip"><strong>Temp:</strong> ${escapeHtml(v.temp)}°F</span>` : ""}
            ${v.weight ? `<span class="ph-sheet-chip"><strong>Weight:</strong> ${escapeHtml(v.weight)} kg</span>` : ""}
          </div>
        </div>
      `
      : "";

    const ccHtml = hasCC
      ? `
        <div class="mb-3">
          <div class="ph-sheet-section-title"><i class="bi bi-exclamation-circle text-warning"></i>${escapeHtml(tr("lblCC"))}</div>
          <div class="ph-sheet-chip-list">
            ${rec.cc.map((item) => `<span class="ph-sheet-chip">${escapeHtml(item)}</span>`).join("")}
          </div>
        </div>
      `
      : "";

    const hoHtml = hasHO
      ? `
        <div class="mb-3">
          <div class="ph-sheet-section-title"><i class="bi bi-clock-history text-secondary"></i>${escapeHtml(tr("lblHO"))}</div>
          <div class="ph-sheet-chip-list">
            ${rec.ho.map((item) => `<span class="ph-sheet-chip">${escapeHtml(item)}</span>`).join("")}
          </div>
        </div>
      `
      : "";

    const invHtml = hasInv
      ? `
        <div class="mb-3">
          <div class="ph-sheet-section-title"><i class="bi bi-eyedropper text-teal"></i>${escapeHtml(tr("lblInv"))}</div>
          <div class="ph-sheet-chip-list">
            ${rec.inv.map((item) => `<span class="ph-sheet-chip">${escapeHtml(item)}</span>`).join("")}
          </div>
        </div>
      `
      : "";

    const dxHtml = rec.diagnosis
      ? `
        <div class="mb-3 p-2.5 bg-teal-subtle border border-teal-subtle rounded-3">
          <div class="ph-sheet-section-title text-teal mb-1"><i class="bi bi-stethoscope"></i>${escapeHtml(tr("lblDx"))}</div>
          <div class="fw-bold text-dark fs-6">${escapeHtml(rec.diagnosis)}</div>
        </div>
      `
      : "";

    const medsTableHtml = medsList.length
      ? `
        <div class="mb-3">
          <div class="ph-sheet-section-title text-primary"><i class="bi bi-capsule"></i>${escapeHtml(tr("thMeds"))}</div>
          <div class="table-responsive">
            <table class="ph-sheet-med-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>${isBn ? "ওষুধের নাম" : "Medicine"}</th>
                  <th>${isBn ? "ডোজ" : "Dosage"}</th>
                  <th>${isBn ? "সময়" : "Timing"}</th>
                  <th>${isBn ? "মেয়াদ" : "Duration"}</th>
                </tr>
              </thead>
              <tbody>
                ${medsList
                  .map((m, mIdx) => {
                    const isObj = typeof m === "object";
                    const name = isObj ? m.name : m;
                    const form = isObj && m.form ? m.form : "Tab";
                    const dosage = isObj && m.dosage ? m.dosage : "1+0+1";
                    const timing = isObj && m.timing ? m.timing : "After meal";
                    const duration = isObj && m.duration ? m.duration : "—";
                    const note = isObj && m.note ? m.note : "";
                    return `
                      <tr>
                        <td class="text-muted small">${mIdx + 1}</td>
                        <td>
                          <span class="badge bg-primary-subtle text-primary border border-primary-subtle me-1">${escapeHtml(form)}</span>
                          <strong>${escapeHtml(name)}</strong>
                          ${note ? `<div class="text-xs text-muted">${escapeHtml(note)}</div>` : ""}
                        </td>
                        <td><span class="badge bg-light text-dark border">${escapeHtml(dosage)}</span></td>
                        <td><span class="badge bg-light text-teal border">${escapeHtml(timing)}</span></td>
                        <td><small class="text-muted">${escapeHtml(duration)}</small></td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `
      : `<div class="text-muted small py-2">${escapeHtml(tr("noClinicalData"))}</div>`;

    const adviceHtml = rec.notes || rec.advice
      ? `
        <div class="p-3 bg-light rounded-3 border mb-3">
          <div class="ph-sheet-section-title text-secondary mb-1"><i class="bi bi-chat-left-heart"></i>${escapeHtml(tr("lblAdvice"))}</div>
          <div class="small text-dark" style="white-space: pre-line;">${escapeHtml(rec.notes || rec.advice)}</div>
        </div>
      `
      : "";

    const refillInfoHtml = rec.refillDate
      ? `
        <div class="d-flex align-items-center justify-content-between p-2.5 bg-light rounded-3 border small">
          <span class="fw-semibold text-secondary"><i class="bi bi-calendar-check text-teal me-1"></i>${escapeHtml(tr("lblRefill"))}:</span>
          <span class="fw-bold text-dark">${escapeHtml(rec.refillDate)}</span>
        </div>
      `
      : "";

    if (viewer) {
      viewer.innerHTML = `
        <div class="ph-lb-rx-sheet">
          <!-- Top Header -->
          <div class="ph-sheet-header d-flex flex-wrap justify-content-between align-items-start border-bottom pb-3 mb-3 gap-2">
            <div>
              <h3 class="ph-sheet-doc-name mb-1">${escapeHtml(rec.doctor || "Dr. —")}</h3>
              ${rec.degrees ? `<div class="text-muted small">${escapeHtml(rec.degrees)}</div>` : ""}
              ${rec.regNo ? `<div class="text-xs text-muted mt-0.5"><span class="badge bg-light text-secondary border">BMDC Reg: ${escapeHtml(rec.regNo)}</span></div>` : ""}
            </div>
            <div class="text-md-end">
              <h4 class="ph-sheet-hosp-name text-teal mb-1">${escapeHtml(rec.hospital || "Clinical Care Hospital")}</h4>
              ${rec.address ? `<div class="text-muted small">${escapeHtml(rec.address)}</div>` : ""}
              ${rec.phone ? `<div class="text-xs text-muted mt-0.5"><i class="bi bi-telephone me-1"></i>${escapeHtml(rec.phone)}</div>` : ""}
            </div>
          </div>

          <!-- Patient Strip -->
          <div class="ph-sheet-pat-strip bg-light rounded-3 p-2.5 mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2 small">
            <div><strong>${isBn ? "রোগীর নাম" : "Patient"}:</strong> ${escapeHtml(rec.patientName || "—")}</div>
            <div><strong>${isBn ? "বয়স" : "Age"}:</strong> ${escapeHtml(rec.patientAge || "—")}</div>
            <div><strong>${isBn ? "লিঙ্গ" : "Sex"}:</strong> ${escapeHtml(rec.patientGender || "—")}</div>
            <div><strong>${isBn ? "তারিখ" : "Date"}:</strong> ${dateStr}</div>
            ${rec.serialNo ? `<div><strong>SL:</strong> ${escapeHtml(rec.serialNo)}</div>` : ""}
          </div>

          <!-- Two Column Grid -->
          <div class="row g-3">
            <div class="col-md-4 border-end-md">
              ${vitalsHtml}
              ${ccHtml}
              ${hoHtml}
              ${invHtml}
            </div>
            <div class="col-md-8">
              ${dxHtml}
              ${medsTableHtml}
              ${adviceHtml}
              ${refillInfoHtml}
            </div>
          </div>
        </div>
      `;
    }

    if (dlBtn) {
      dlBtn.innerHTML = `<i class="bi bi-printer-fill"></i> <span>${escapeHtml(tr("btnPrint"))}</span>`;
      dlBtn.onclick = () => window.print();
    }
  }

  function phNavigateLightbox(direction) {
    const rec = lbRecordList[lbRecordIndex];
    if (!rec || !rec.files) return;
    const count = rec.files.length;
    if (count <= 1) return;

    lbFileIndex = (lbFileIndex + direction + count) % count;
    phRenderLightboxContent();
  }

  function bindLightboxControls() {
    $("lbCloseBtn")?.addEventListener("click", phCloseLightbox);
    $("lbPrev")?.addEventListener("click", () => phNavigateLightbox(-1));
    $("lbNext")?.addEventListener("click", () => phNavigateLightbox(1));

    const lb = $("phLightbox");
    if (lb) {
      lb.addEventListener("click", (e) => {
        if (e.target === lb) phCloseLightbox();
      });
    }

    document.addEventListener("keydown", (e) => {
      const lbEl = $("phLightbox");
      if (lbEl && lbEl.classList.contains("open")) {
        if (e.key === "Escape") phCloseLightbox();
        if (e.key === "ArrowLeft") phNavigateLightbox(-1);
        if (e.key === "ArrowRight") phNavigateLightbox(1);
      }
    });
  }

  // ============================================================================
  // 10. TOAST NOTIFICATION
  // ============================================================================
  function phToast(message, type = "info") {
    let stack = $("rxToastStack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "rxToastStack";
      stack.className = "rx-toast-stack";
      document.body.appendChild(stack);
    }

    const toast = document.createElement("div");
    toast.className = `rx-toast ${type}`;
    const icon =
      type === "success"
        ? "bi-check-circle-fill text-success"
        : type === "warn"
          ? "bi-exclamation-triangle-fill text-warning"
          : type === "error"
            ? "bi-x-circle-fill text-danger"
            : "bi-info-circle-fill text-info";

    toast.innerHTML = `
      <i class="bi ${icon} fs-5"></i>
      <span>${escapeHtml(message)}</span>
    `;

    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(15px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // ============================================================================
  // 11. LIFECYCLE & EVENT ROUTING
  // ============================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    bindToolbarEvents();
    bindLightboxControls();
    initMobileSidebar();
    phUpdateStorage();
    phRenderGallery();
    phRenderTable();
    phApplyViewFormat(currentViewFormat);

    // Bind CSV Export
    $("btnExportCsv")?.addEventListener("click", phExportCSV);
  });

  function bindToolbarEvents() {
    // Filter pills
    document.querySelectorAll(".ph-filter-pill[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        galleryFilter = btn.dataset.filter;
        document.querySelectorAll(".ph-filter-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        phRenderGallery();
        phRenderTable();
      });
    });

    // Sort dropdown
    $("phSortSelect")?.addEventListener("change", (e) => {
      gallerySort = e.target.value;
      phRenderGallery();
      phRenderTable();
    });

    // Search input
    $("phSearch")?.addEventListener("input", (e) => {
      gallerySearch = e.target.value.trim().toLowerCase();
      phRenderGallery();
      phRenderTable();
    });

    // View format buttons
    $("btnViewGrid")?.addEventListener("click", () => phApplyViewFormat("grid"));
    $("btnViewTable")?.addEventListener("click", () => phApplyViewFormat("table"));
  }

  function initLanguage() {
    applyTranslations();

    const topToggle = $("langToggle") || $("phLangToggle") || $("rxLangToggle");
    if (topToggle) {
      topToggle.textContent = currentLang === "bn" ? "English" : "বাংলা";
    }

    // Language synchronization (handled globally by global-nav.js)
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("bwLanguageChanged", (e) => {
        if (e.detail && e.detail.lang && e.detail.lang !== currentLang) {
          currentLang = e.detail.lang;
          if (topToggle) topToggle.textContent = currentLang === "bn" ? "English" : "বাংলা";
          applyTranslations();
          phUpdateStorage();
          phRenderGallery();
          phRenderTable();
        }
      });
    }

    document.querySelectorAll(".mobile-lang-pill[data-lang]").forEach((pill) => {
      if (pill.dataset.lang === currentLang) pill.classList.add("active");
      pill.addEventListener("click", () => {
        currentLang = pill.dataset.lang;
        localStorage.setItem(LANG_KEY, currentLang);
        document.querySelectorAll(".mobile-lang-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        if (topToggle) topToggle.textContent = currentLang === "bn" ? "English" : "বাংলা";
        applyTranslations();
        phUpdateStorage();
        phRenderGallery();
        phRenderTable();
      });
    });
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-ph-i18n], [data-rx-i18n]").forEach((el) => {
      const k = el.getAttribute("data-ph-i18n") || el.getAttribute("data-rx-i18n");
      if (k && tr(k)) {
        const span = el.querySelector("span");
        if (span && el.querySelector("i")) {
          span.textContent = tr(k);
        } else {
          el.textContent = tr(k);
        }
      }
    });

    document.querySelectorAll("[data-ph-i18n-placeholder], [data-rx-i18n-placeholder]").forEach((el) => {
      const k = el.getAttribute("data-ph-i18n-placeholder") || el.getAttribute("data-rx-i18n-placeholder");
      if (k && tr(k)) el.placeholder = tr(k);
    });

    document.querySelectorAll("[data-ph-i18n-title], [data-rx-i18n-title]").forEach((el) => {
      const k = el.getAttribute("data-ph-i18n-title") || el.getAttribute("data-rx-i18n-title");
      if (k && tr(k)) el.setAttribute("title", tr(k));
    });
  }

  function initMobileSidebar() {
    const sidebar = $("mobileSidebarMenu");
    if (!sidebar) return;

    sidebar.querySelectorAll(".mobile-sidebar-nav-item, .mobile-sidebar-action-card").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href) return;

        try {
          const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(sidebar);
          bsOffcanvas?.hide();
        } catch (_) { }

        if (link.dataset.action === "emergency-sos" || href.includes("#safety")) {
          e.preventDefault();
          window.location.href = "index.html#safety";
          return;
        }

        if (href === "prescription-history.html" || href.endsWith("prescription-history.html")) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        e.preventDefault();
        window.location.href = href;
      });
    });
  }

  // ============================================================================
  // 12. UTILITY HELPERS
  // ============================================================================
  function phFmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString(currentLang === "bn" ? "bn-BD" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function phDaysUntilRefill(refillDate) {
    if (!refillDate) return Infinity;
    const diff = new Date(refillDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
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

  // Expose global actions
  window.phExportCSV = phExportCSV;
  window.phApplyViewFormat = phApplyViewFormat;
})();
