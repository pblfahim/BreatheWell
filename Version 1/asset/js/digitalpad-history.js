/**
 * ============================================================================
 * BreatheWell - Digital Pad History Engine (digitalpad-history.js)
 * ============================================================================
 * @file        asset/js/digitalpad-history.js
 * @module      BreatheWell/DigitalPadHistory
 * @author      BreatheWell Health Informatics Team
 * @version     1.0.0
 * @license     MIT
 * @description
 *   Client-side controller for digitalpad-history.html. Manages and displays
 *   digital prescriptions created via prescription-create.html & prescription-pad.html.
 *   Provides dual-view formatting (Card Grid & DataTables 2 Data Table), search &
 *   filter toolbar, full clinical digital prescription modal viewer, CSV export,
 *   and 100% bilingual (Bengali/English) i18n support.
 * ============================================================================
 */

(function () {
  "use strict";

  // ============================================================================
  // 1. CONSTANTS & STATE
  // ============================================================================
  const DPAD_KEY = "bw_digitalpad_prescriptions";
  const RX_VAULT_KEY = "bw_prescriptions";
  const LANG_KEY = "bw_lang";
  const VIEW_KEY = "bw_dh_view_format";

  let currentLang = localStorage.getItem(LANG_KEY) || "bn";
  let currentViewFormat = localStorage.getItem(VIEW_KEY) || "grid";
  let activeFilter = "all";
  let activeSort = "new";
  let searchQuery = "";
  let dataTableInstance = null;
  let activeSelectedRecord = null;

  const $ = (id) => document.getElementById(id);

  // ============================================================================
  // 2. I18N DICTIONARY
  // ============================================================================
  const DH_T = {
    bn: {
      tabVault: "প্রেসক্রিপশন ভল্ট",
      tabHistory: "প্রেসক্রিপশন ইতিহাস",
      tabDigitalPadHistory: "ডিজিটাল প্যাড ইতিহাস",
      tabCreate: "প্রেসক্রিপশন তৈরি",
      tabPad: "ডিজিটাল প্যাড",
      pageTitle: "ডিজিটাল প্যাড ইতিহাস ও রেকর্ডস - BreatheWell",
      heroTitle: "ডিজিটাল প্যাড ইতিহাস ও রেকর্ডস",
      heroSubtitle: "প্রেসক্রিপশন স্টুডিও ও ডিজিটাল প্যাড থেকে তৈরি করা সকল ডিজিটাল প্রেসক্রিপশনের সমন্বিত ক্লিনিক্যাল আর্কাইভ",
      statTotal: "মোট প্রেসক্রিপশন",
      statPatients: "মোট রোগী",
      statToday: "আজকের রেকর্ড",
      searchPh: "রোগীর নাম, সিরিয়াল, ডাক্তার, ওষুধ বা রোগ খুঁজুন...",
      filterAll: "সবগুলো",
      filterPad: "ডিজিটাল প্যাড",
      filterStudio: "স্টুডিও",
      filterToday: "আজকে",
      sortNew: "নতুন আগে",
      sortOld: "পুরনো আগে",
      sortPatient: "রোগীর নাম",
      sortDoctor: "ডাক্তারের নাম",
      viewGrid: "কার্ড গ্রিড",
      viewTable: "ডেটা টেবিল",
      tableCardTitle: "ডিজিটাল প্রেসক্রিপশন ডেটা টেবিল",
      btnExportCsv: "CSV এক্সপোর্ট",
      thDate: "তারিখ ও সময়",
      thPatient: "রোগী ও সিরিয়াল",
      thDoctor: "ডাক্তার ও হাসপাতাল",
      thDiagnosis: "রোগ ও লক্ষণ",
      thMeds: "ওষুধসমূহ (Rx)",
      thVitals: "ভাইটালস",
      thSource: "উৎস",
      thAction: "অ্যাকশন",
      btnView: "দেখুন",
      btnPrint: "প্রিন্ট",
      btnShare: "শেয়ার",
      btnDelete: "মুছুন",
      btnCreateNew: "নতুন প্রেসক্রিপশন তৈরি",
      btnOpenPad: "ডিজিটাল প্যাড",
      emptyTitle: "এখনো কোনো ডিজিটাল প্রেসক্রিপশন তৈরি করা হয়নি",
      emptyDesc: "প্রেসক্রিপশন তৈরি পেজ অথবা ডিজিটাল প্যাড থেকে নতুন প্রেসক্রিপশন তৈরি করুন। সেগুলো স্বয়ংক্রিয়ভাবে এখানে সংরক্ষিত থাকবে।",
      toastDeleted: "প্রেসক্রিপশনটি সফলভাবে মুছে ফেলা হয়েছে।",
      toastCsvExported: "CSV ফাইল সফলভাবে ডাউনলোড হয়েছে!",
      toastCopied: "প্রেসক্রিপশনের বিবরণ ক্লিপবোর্ডে কপি করা হয়েছে!",
      confirmDelete: "আপনি কি নিশ্চিতভাবে এই ডিজিটাল প্রেসক্রিপশনটি মুছে ফেলতে চান?",
      sourcePad: "ডিজিটাল প্যাড",
      sourceStudio: "প্রেসক্রিপশন স্টুডিও",
      footerTag: "প্রতিটি নিঃশ্বাসে একটি প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।"
    },
    en: {
      tabVault: "Prescription Vault",
      tabHistory: "Prescription History",
      tabDigitalPadHistory: "Digital Pad History",
      tabCreate: "Create Prescription",
      tabPad: "Digital Pad",
      pageTitle: "Digital Pad History & Records - BreatheWell",
      heroTitle: "Digital Pad History & Records",
      heroSubtitle: "Unified clinical archive of all digital prescriptions created via Studio & Digital Pad",
      statTotal: "Total Prescriptions",
      statPatients: "Total Patients",
      statToday: "Today's Records",
      searchPh: "Search by patient name, serial, doctor, medicine or diagnosis...",
      filterAll: "All",
      filterPad: "Digital Pad",
      filterStudio: "Studio",
      filterToday: "Today",
      sortNew: "Newest First",
      sortOld: "Oldest First",
      sortPatient: "Patient Name",
      sortDoctor: "Doctor Name",
      viewGrid: "Card Grid",
      viewTable: "Data Table",
      tableCardTitle: "Digital Prescription Data Table",
      btnExportCsv: "Export CSV",
      thDate: "Date & Time",
      thPatient: "Patient & Serial",
      thDoctor: "Doctor & Hospital",
      thDiagnosis: "Diagnosis & Complaints",
      thMeds: "Medicines (Rx)",
      thVitals: "Vitals",
      thSource: "Source",
      thAction: "Action",
      btnView: "View",
      btnPrint: "Print",
      btnShare: "Share",
      btnDelete: "Delete",
      btnCreateNew: "Create Prescription",
      btnOpenPad: "Digital Pad",
      emptyTitle: "No Digital Prescriptions Created Yet",
      emptyDesc: "Generate digital prescriptions using Prescription Studio or Digital Pad. They will be automatically archived here.",
      toastDeleted: "Prescription deleted successfully.",
      toastCsvExported: "CSV file downloaded successfully!",
      toastCopied: "Prescription details copied to clipboard!",
      confirmDelete: "Are you sure you want to delete this digital prescription?",
      sourcePad: "Digital Pad",
      sourceStudio: "Prescription Studio",
      footerTag: "Peace in every breath",
      footerDisclaimer: "For general wellness. Not a substitute for medical advice."
    }
  };

  function tr(key) {
    const dict = DH_T[currentLang] || DH_T.bn;
    return dict[key] || key;
  }

  // ============================================================================
  // 3. SEED CLINICAL DATA (Sample initial records if empty)
  // ============================================================================
  function seedInitialRecords() {
    return [
      {
        id: "dpad_seed_001",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        prescDate: new Date().toISOString().split("T")[0],
        date: new Date().toISOString().split("T")[0],
        doctor: "Dr. A. Rahman",
        degrees: "MBBS, FCPS (Medicine), MD (Neurology)",
        clinic: "City General Hospital",
        hospital: "City General Hospital",
        doctorPhone: "+880 1711-234567",
        doctorReg: "BMDC-A45892",
        doctorAddress: "House 12, Road 5, Dhanmondi, Dhaka",
        patientName: "Rahim Uddin",
        patName: "Rahim Uddin",
        patientAge: "45",
        patientGender: "Male",
        serialNo: "SL-2026-001",
        diagnosis: "Essential Hypertension & Gastritis",
        meds: ["Tab. Olmesartan 20mg", "Cap. Omeprazole 20mg", "Tab. Paracetamol 500mg"],
        medicines: [
          { name: "Tab. Olmesartan", dosage: "20mg", form: "Tablet", freq: "১+০+০", duration: "১ মাস", instructions: "সকালে খাবার পর" },
          { name: "Cap. Omeprazole", dosage: "20mg", form: "Capsule", freq: "১+০+১", duration: "১৪ দিন", instructions: "খাবারের ৩০ মিনিট পূর্বে" },
          { name: "Tab. Paracetamol", dosage: "500mg", form: "Tablet", freq: "১+১+১", duration: "৩ দিন", instructions: "জ্বর বা ব্যথায় ভরা পেটে" }
        ],
        clinical: {
          cc: ["মাথাব্যথা ৩ দিন ধরে", "বুক জ্বালাপোড়া ও এসিডিটি"],
          oe: { bp: "135/85 mmHg", pulse: "76 bpm", temp: "98.4°F", wt: "68 kg" },
          dx: "Essential Hypertension & Gastritis",
          inv: "CBC, Lipid Profile, Serum Creatinine"
        },
        treatment: {
          meds: [
            { name: "Tab. Olmesartan", dosage: "20mg", form: "Tablet", freq: "১+০+০", duration: "১ মাস", instructions: "সকালে খাবার পর" },
            { name: "Cap. Omeprazole", dosage: "20mg", form: "Capsule", freq: "১+০+১", duration: "১৪ দিন", instructions: "খাবারের ৩০ মিনিট পূর্বে" }
          ],
          advice: "• পাতে অতিরিক্ত কাঁচা লবণ বর্জন করুন।\n• প্রতিদিন ৩০ মিনিট দ্রুত হাঁটুন।\n• তেল-চর্বিযুক্ত খাবার এড়িয়ে চলুন।",
          followUp: "১৪ দিন পর প্রেসক্রিপশন ও রিপোর্টসহ দেখা করবেন।"
        },
        advice: "পাতে অতিরিক্ত কাঁচা লবণ বর্জন করুন। প্রতিদিন ৩০ মিনিট হাঁটুন।",
        followUp: "১৪ দিন পর",
        refillDate: "",
        urgency: "normal",
        source: "prescription-create",
        type: "digital_pad"
      },
      {
        id: "dpad_seed_002",
        createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
        prescDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        doctor: "Prof. Dr. Nusrat Jahan",
        degrees: "MBBS, FCPS (Pediatrics), MRCPCH (UK)",
        clinic: "Square Medical Center",
        hospital: "Square Medical Center",
        doctorPhone: "+880 1819-876543",
        doctorReg: "BMDC-A32190",
        doctorAddress: "Panthapath, Dhaka",
        patientName: "Tasnim Begum",
        patName: "Tasnim Begum",
        patientAge: "32",
        patientGender: "Female",
        serialNo: "SL-2026-002",
        diagnosis: "Acute Bronchitis & Allergic Rhinitis",
        meds: ["Syp. Montelukast 10mg", "Inhaler Salbutamol 100mcg", "Tab. Fexofenadine 120mg"],
        medicines: [
          { name: "Syp. Montelukast", dosage: "10mg", form: "Tablet", freq: "০+০+১", duration: "১ মাস", instructions: "রাতে ঘুমানোর পূর্বে" },
          { name: "Inhaler Salbutamol", dosage: "100mcg", form: "Inhaler", freq: "২ পাফ প্রয়োজনমত", duration: "৭ দিন", instructions: "শ্বাসকষ্টের সময় স্পেসার সহ" },
          { name: "Tab. Fexofenadine", dosage: "120mg", form: "Tablet", freq: "১+০+০", duration: "১০ দিন", instructions: "সকালে খাবার পর" }
        ],
        clinical: {
          cc: ["শুষ্ক কাশি ও শ্বাসটান ৪ দিন", "হাঁচি ও সর্দি"],
          oe: { bp: "115/75 mmHg", pulse: "82 bpm", temp: "99.1°F", wt: "54 kg" },
          dx: "Acute Bronchitis & Allergic Rhinitis",
          inv: "CXR (P/A view), IgE level"
        },
        treatment: {
          advice: "• ধুলাবালি ও ঠান্ডা বাতাস থেকে দূরে থাকুন।\n• হালকা কুসুম গরম পানির ভাপ নিন।\n• কোনো ভাবেই ধূমপানের সংস্পর্শে আসবেন না।",
          followUp: "৭ দিন পর শ্বাসকষ্ট না কমলে যোগাযোগ করবেন।"
        },
        advice: "ধুলাবালি ও ঠান্ডা বাতাস পরিহার করুন। গরম পানির ভাপ নিন।",
        followUp: "৭ দিন পর",
        refillDate: "",
        urgency: "urgent",
        source: "prescription-pad",
        type: "digital_pad"
      }
    ];
  }

  // ============================================================================
  // 4. DATA PERSISTENCE & RETRIEVAL
  // ============================================================================
  function getDigitalPadRecords() {
    let records = [];
    try {
      // 1. Primary: dedicated digital pad storage
      const dpadRaw = localStorage.getItem(DPAD_KEY);
      if (dpadRaw) {
        records = JSON.parse(dpadRaw);
      }

      // 2. Fallback check: retrieve any digital prescriptions stored in general vault
      const vaultRaw = localStorage.getItem(RX_VAULT_KEY);
      if (vaultRaw) {
        const vaultAll = JSON.parse(vaultRaw);
        vaultAll.forEach((item) => {
          if ((item.type === "digital_pad" || item.digitalPrescriptionData || item.source?.includes("prescription-")) &&
              !records.some((r) => r.id === item.id)) {
            records.push(item);
          }
        });
      }

      // 3. If completely empty, seed with realistic initial sample records
      if (!records || records.length === 0) {
        records = seedInitialRecords();
        localStorage.setItem(DPAD_KEY, JSON.stringify(records));
      }
    } catch (err) {
      console.error("Failed to load digital pad records:", err);
      records = seedInitialRecords();
    }
    return records;
  }

  function saveDigitalPadRecords(records) {
    try {
      localStorage.setItem(DPAD_KEY, JSON.stringify(records));
    } catch (err) {
      console.error("Failed to save digital pad records:", err);
    }
  }

  // ============================================================================
  // 5. STATS & METRICS
  // ============================================================================
  function updateStatsMetrics(records) {
    const totalCount = records.length;
    const patientSet = new Set(records.map((r) => r.patientName || r.patName).filter(Boolean));
    const todayStr = new Date().toISOString().split("T")[0];
    const todayCount = records.filter((r) => (r.createdAt || "").startsWith(todayStr) || (r.prescDate || "") === todayStr).length;

    if ($("statTotalVal")) $("statTotalVal").textContent = totalCount;
    if ($("statPatientsVal")) $("statPatientsVal").textContent = patientSet.size;
    if ($("statTodayVal")) $("statTodayVal").textContent = todayCount;
  }

  // ============================================================================
  // 6. FILTERING & SORTING ENGINE
  // ============================================================================
  function filterAndSortRecords(records) {
    let list = [...records];

    // Filter Pills
    if (activeFilter === "pad") {
      list = list.filter((r) => r.source === "prescription-pad");
    } else if (activeFilter === "studio") {
      list = list.filter((r) => r.source === "prescription-create");
    } else if (activeFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      list = list.filter((r) => (r.createdAt || "").startsWith(today) || (r.prescDate || "") === today);
    } else if (activeFilter === "urgent") {
      list = list.filter((r) => r.urgency === "urgent");
    }

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => {
        const pName = (r.patientName || r.patName || "").toLowerCase();
        const sNo = (r.serialNo || "").toLowerCase();
        const doc = (r.doctor || "").toLowerCase();
        const hosp = (r.clinic || r.hospital || "").toLowerCase();
        const dx = (r.diagnosis || "").toLowerCase();
        const meds = (r.meds || []).join(" ").toLowerCase();
        const cc = ((r.clinical?.cc || []).join(" ")).toLowerCase();
        return pName.includes(q) || sNo.includes(q) || doc.includes(q) || hosp.includes(q) || dx.includes(q) || meds.includes(q) || cc.includes(q);
      });
    }

    // Sort Dropdown
    if (activeSort === "new") {
      list.sort((a, b) => new Date(b.createdAt || b.prescDate || 0) - new Date(a.createdAt || a.prescDate || 0));
    } else if (activeSort === "old") {
      list.sort((a, b) => new Date(a.createdAt || a.prescDate || 0) - new Date(b.createdAt || b.prescDate || 0));
    } else if (activeSort === "patient") {
      list.sort((a, b) => (a.patientName || a.patName || "").localeCompare(b.patientName || b.patName || ""));
    } else if (activeSort === "doctor") {
      list.sort((a, b) => (a.doctor || "").localeCompare(b.doctor || ""));
    }

    return list;
  }

  // ============================================================================
  // 7. RENDER CARD GRID (FORMAT A)
  // ============================================================================
  function dhRenderCards() {
    const galleryEl = $("dhGallery");
    if (!galleryEl) return;

    const all = getDigitalPadRecords();
    updateStatsMetrics(all);
    const records = filterAndSortRecords(all);

    if (records.length === 0) {
      galleryEl.innerHTML = `
        <div class="col-12 dh-empty">
          <i class="bi bi-file-earmark-medical dh-empty-icon"></i>
          <h4 class="dh-empty-title">${tr("emptyTitle")}</h4>
          <p class="dh-empty-desc">${tr("emptyDesc")}</p>
          <div class="d-flex justify-content-center gap-2">
            <a href="prescription-create.html" class="btn btn-primary px-3 py-2 rounded-pill fw-semibold">
              <i class="bi bi-pencil-square me-1"></i> ${tr("btnCreateNew")}
            </a>
            <a href="prescription-pad.html" class="btn btn-outline-teal px-3 py-2 rounded-pill fw-semibold">
              <i class="bi bi-clipboard2-pulse me-1"></i> ${tr("btnOpenPad")}
            </a>
          </div>
        </div>
      `;
      return;
    }

    galleryEl.innerHTML = records
      .map((r, idx) => {
        const isPad = r.source === "prescription-pad";
        const sourceLabel = isPad ? tr("sourcePad") : tr("sourceStudio");
        const sourceClass = isPad ? "pad" : "studio";
        const dateFmt = fmtDate(r.createdAt || r.prescDate);
        const serial = r.serialNo || `SL-${idx + 100}`;
        const patientName = r.patientName || r.patName || "–";
        const diagnosis = r.diagnosis || r.treatment?.dx || "Clinical Consultation";

        // Vitals
        const bp = r.clinical?.oe?.bp || "";
        const pulse = r.clinical?.oe?.pulse || "";
        const temp = r.clinical?.oe?.temp || "";

        // Medicines chips
        const medsArray = r.medicines && r.medicines.length > 0 ? r.medicines : (r.meds || []).map((m) => ({ name: m }));
        const medsHtml = medsArray
          .slice(0, 3)
          .map((m) => `<span class="dh-med-chip"><i class="bi bi-capsule"></i> ${escapeHtml(m.name || m)}</span>`)
          .join("");
        const moreMeds = medsArray.length > 3 ? `<span class="dh-med-chip">+${medsArray.length - 3}</span>` : "";

        // Advice
        const advice = r.advice || r.treatment?.advice || "";

        return `
          <div class="dh-card" data-id="${r.id}">
            <!-- Header -->
            <div class="dh-card-header">
              <div class="dh-card-doc-info">
                <div class="dh-card-doc-avatar">
                  <i class="bi bi-heart-pulse-fill"></i>
                </div>
                <div>
                  <h4 class="dh-card-doc-name">${escapeHtml(r.doctor || "Dr. A. Rahman")}</h4>
                  <div class="dh-card-doc-clinic">${escapeHtml(r.clinic || r.hospital || "General Hospital")}</div>
                </div>
              </div>
              <span class="dh-source-badge ${sourceClass}">
                <i class="bi ${isPad ? "bi-clipboard-pulse" : "bi-pencil-square"}"></i> ${sourceLabel}
              </span>
            </div>

            <!-- Body -->
            <div class="dh-card-body">
              <!-- Patient & Serial -->
              <div class="dh-card-pat-bar">
                <div class="d-flex align-items-center gap-1.5">
                  <i class="bi bi-person-fill text-muted"></i>
                  <span class="dh-pat-name">${escapeHtml(patientName)}</span>
                  ${r.patientAge ? `<span class="badge bg-light text-secondary border">${r.patientAge}y</span>` : ""}
                </div>
                <span class="dh-serial-badge">${escapeHtml(serial)}</span>
              </div>

              <!-- Diagnosis -->
              <div class="dh-card-dx-row">
                <i class="bi bi-stethoscope text-teal"></i>
                <span class="dh-dx-tag">${escapeHtml(diagnosis)}</span>
              </div>

              <!-- Vitals -->
              ${
                bp || pulse || temp
                  ? `
                <div class="dh-vitals-strip">
                  ${bp ? `<span class="dh-vital-pill"><i class="bi bi-activity"></i> BP: ${escapeHtml(bp)}</span>` : ""}
                  ${pulse ? `<span class="dh-vital-pill"><i class="bi bi-heart-fill"></i> Pulse: ${escapeHtml(pulse)}</span>` : ""}
                  ${temp ? `<span class="dh-vital-pill"><i class="bi bi-thermometer-half"></i> ${escapeHtml(temp)}</span>` : ""}
                </div>
              `
                  : ""
              }

              <!-- Medicines -->
              <div class="dh-meds-box">
                ${medsHtml} ${moreMeds}
              </div>

              <!-- Advice -->
              ${advice ? `<div class="dh-card-advice">"${escapeHtml(advice)}"</div>` : ""}
            </div>

            <!-- Footer -->
            <div class="dh-card-footer">
              <span class="dh-card-date">
                <i class="bi bi-calendar3 me-1"></i>${dateFmt}
              </span>
              <div class="dh-card-actions">
                <button type="button" class="dh-btn-action view" onclick="dhViewRecord('${r.id}')" title="সম্পূর্ণ প্রেসক্রিপশন দেখুন">
                  <i class="bi bi-eye"></i> ${tr("btnView")}
                </button>
                <button type="button" class="dh-btn-action delete" onclick="dhDeleteRecord('${r.id}')" title="মুছে ফেলুন">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // ============================================================================
  // 8. RENDER DATA TABLE (FORMAT B)
  // ============================================================================
  function dhRenderTable() {
    const tbody = $("dhTableTbody");
    if (!tbody) return;

    if (dataTableInstance) {
      dataTableInstance.destroy();
      dataTableInstance = null;
    }

    const all = getDigitalPadRecords();
    const records = filterAndSortRecords(all);

    tbody.innerHTML = records
      .map((r, idx) => {
        const isPad = r.source === "prescription-pad";
        const sourceLabel = isPad ? tr("sourcePad") : tr("sourceStudio");
        const sourceClass = isPad ? "pad" : "studio";
        const dateFmt = fmtDate(r.createdAt || r.prescDate);
        const timestamp = new Date(r.createdAt || r.prescDate || 0).getTime();
        const serial = r.serialNo || `SL-${idx + 100}`;
        const patientName = r.patientName || r.patName || "–";
        const diagnosis = r.diagnosis || r.treatment?.dx || "Clinical Consultation";

        const medsArray = r.medicines && r.medicines.length > 0 ? r.medicines : (r.meds || []).map((m) => ({ name: m }));
        const medsSummary = medsArray.slice(0, 2).map((m) => escapeHtml(m.name || m)).join(", ");
        const medsCountBadge = medsArray.length > 2 ? ` <span class="badge bg-light text-dark border">+${medsArray.length - 2}</span>` : "";

        const bp = r.clinical?.oe?.bp || "";
        const pulse = r.clinical?.oe?.pulse || "";
        const vitalsStr = [bp ? `BP: ${bp}` : "", pulse ? `P: ${pulse}` : ""].filter(Boolean).join(" · ") || "–";

        return `
          <tr data-id="${r.id}">
            <td data-order="${timestamp}">
              <div class="fw-semibold text-dark">${dateFmt}</div>
            </td>
            <td>
              <span class="dh-tbl-pat">${escapeHtml(patientName)}</span>
              <span class="dh-tbl-serial">${escapeHtml(serial)}</span>
            </td>
            <td>
              <span class="dh-tbl-doc">${escapeHtml(r.doctor || "Dr. A. Rahman")}</span>
              <span class="dh-tbl-clinic">${escapeHtml(r.clinic || r.hospital || "General Hospital")}</span>
            </td>
            <td>
              <span class="fw-semibold text-dark">${escapeHtml(diagnosis)}</span>
            </td>
            <td>
              <span class="text-secondary small">${medsSummary}${medsCountBadge}</span>
            </td>
            <td>
              <span class="badge bg-light text-secondary border">${escapeHtml(vitalsStr)}</span>
            </td>
            <td>
              <span class="dh-source-badge ${sourceClass}">${sourceLabel}</span>
            </td>
            <td class="text-end">
              <div class="d-inline-flex gap-1">
                <button type="button" class="btn btn-sm btn-teal rounded-pill px-2.5 py-1 fw-bold" onclick="dhViewRecord('${r.id}')" title="দেখুন">
                  <i class="bi bi-eye me-1"></i>${tr("btnView")}
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-2 py-1" onclick="dhDeleteRecord('${r.id}')" title="মুছুন">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");

    if (window.jQuery && $.fn && $.fn.DataTable) {
      dataTableInstance = window.$("#digitalpadHistoryTable").DataTable({
        pageLength: 10,
        responsive: true,
        destroy: true,
        order: [[0, "desc"]],
        columnDefs: [{ targets: [4, 7], orderable: false }],
        language: getDTLanguageConfig()
      });
    }
  }

  function getDTLanguageConfig() {
    return currentLang === "bn"
      ? {
          search: "টেবিলে খুঁজুন:",
          searchPlaceholder: "ফিল্টার...",
          lengthMenu: "প্রতি পেজে _MENU_ টি",
          info: "মোট _TOTAL_ টি ডিজিটাল প্রেসক্রিপশনের মধ্যে _START_ থেকে _END_ প্রদর্শিত",
          infoEmpty: "কোনো রেকর্ড পাওয়া যায়নি",
          infoFiltered: "(মোট _MAX_ টি থেকে ফিল্টারকৃত)",
          zeroRecords: "মিল পাওয়া যায়নি",
          paginate: { first: "প্রথম", last: "শেষ", next: "পরবর্তী", previous: "পূর্ববর্তী" }
        }
      : {
          search: "Search Table:",
          searchPlaceholder: "Filter...",
          lengthMenu: "Show _MENU_ entries",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          infoEmpty: "No entries available",
          infoFiltered: "(filtered from _MAX_ total entries)",
          zeroRecords: "No matching records found",
          paginate: { first: "First", last: "Last", next: "Next", previous: "Previous" }
        };
  }

  // ============================================================================
  // 9. VIEW FORMAT SWITCHER
  // ============================================================================
  function dhApplyViewFormat(format) {
    currentViewFormat = format === "table" ? "table" : "grid";
    localStorage.setItem(VIEW_KEY, currentViewFormat);

    const btnGrid = $("btnViewGrid");
    const btnTable = $("btnViewTable");
    const wrapGrid = $("dhGalleryViewWrap");
    const wrapTable = $("dhTableViewWrap");

    if (currentViewFormat === "table") {
      btnGrid?.classList.remove("active");
      btnTable?.classList.add("active");
      wrapGrid?.classList.add("d-none");
      wrapTable?.classList.remove("d-none");
      dhRenderTable();
      if (dataTableInstance) {
        setTimeout(() => dataTableInstance?.columns?.adjust?.(), 50);
      }
    } else {
      btnTable?.classList.remove("active");
      btnGrid?.classList.add("active");
      wrapTable?.classList.add("d-none");
      wrapGrid?.classList.remove("d-none");
      dhRenderCards();
    }
  }

  // ============================================================================
  // 10. CLINICAL PRESCRIPTION PAD MODAL VIEWER
  // ============================================================================
  function dhViewRecord(recordId) {
    const all = getDigitalPadRecords();
    const record = all.find((r) => r.id === recordId);
    if (!record) return;

    activeSelectedRecord = record;

    // Doctor & Hospital Header
    if ($("modalDocName")) $("modalDocName").textContent = record.doctor || "Dr. A. Rahman";
    if ($("modalDocDegrees")) $("modalDocDegrees").textContent = record.degrees || "MBBS, FCPS";
    if ($("modalDocReg")) $("modalDocReg").textContent = record.doctorReg ? `Reg: ${record.doctorReg}` : "";
    if ($("modalHospitalName")) $("modalHospitalName").textContent = record.clinic || record.hospital || "City General Hospital";
    if ($("modalHospitalAddress")) $("modalHospitalAddress").textContent = record.doctorAddress || record.doctorPhone || "";

    // Patient Bar
    if ($("modalPatName")) $("modalPatName").textContent = record.patientName || record.patName || "–";
    if ($("modalSerialNo")) $("modalSerialNo").textContent = record.serialNo || "–";
    if ($("modalPatAge")) $("modalPatAge").textContent = record.patientAge ? `${record.patientAge} Years` : "–";
    if ($("modalPatGender")) $("modalPatGender").textContent = record.patientGender || "–";
    if ($("modalPrescDate")) $("modalPrescDate").textContent = fmtDate(record.createdAt || record.prescDate);

    // Clinical Column (Left)
    const ccList = record.clinical?.cc || [];
    if ($("modalCCBox")) {
      $("modalCCBox").innerHTML = ccList.length > 0 ? ccList.map((c) => `<div class="dh-clinical-item">• ${escapeHtml(c)}</div>`).join("") : '<div class="text-muted small">None</div>';
    }

    const oe = record.clinical?.oe || {};
    if ($("modalVitalsBox")) {
      const vItems = [
        oe.bp ? `BP: ${oe.bp}` : "",
        oe.pulse ? `Pulse: ${oe.pulse}` : "",
        oe.temp ? `Temp: ${oe.temp}` : "",
        oe.wt ? `Weight: ${oe.wt}` : ""
      ].filter(Boolean);
      $("modalVitalsBox").innerHTML = vItems.length > 0 ? vItems.map((v) => `<div class="dh-clinical-item">• ${escapeHtml(v)}</div>`).join("") : '<div class="text-muted small">None</div>';
    }

    if ($("modalDiagnosisBox")) {
      $("modalDiagnosisBox").textContent = record.diagnosis || record.treatment?.dx || "Clinical Consultation";
    }

    const inv = record.clinical?.inv || "";
    if ($("modalInvBox")) {
      $("modalInvBox").textContent = inv || "Routine monitoring";
    }

    // Treatment Column (Right) - Medicines Table
    const meds = record.medicines && record.medicines.length > 0 ? record.medicines : (record.meds || []).map((m) => ({ name: m }));
    if ($("modalMedsTbody")) {
      $("modalMedsTbody").innerHTML = meds
        .map((m, i) => `
          <tr>
            <td class="text-muted fw-bold">${i + 1}.</td>
            <td class="dh-med-name-cell">${escapeHtml(m.name || m)} ${m.dosage ? `<small class="text-muted">(${m.dosage})</small>` : ""}</td>
            <td class="dh-med-dose-cell">${escapeHtml(m.freq || "১+০+১")}</td>
            <td>${escapeHtml(m.duration || "৭ দিন")}</td>
            <td class="text-muted small">${escapeHtml(m.instructions || "খাবারের পরে")}</td>
          </tr>
        `)
        .join("");
    }

    // Advice
    if ($("modalAdviceText")) {
      $("modalAdviceText").textContent = record.advice || record.treatment?.advice || "পর্যাপ্ত বিশ্রাম নিন এবং নির্দেশিত ওষুধ যথাসময়ে গ্রহণ করুন।";
    }

    // Next Visit
    if ($("modalFollowUpText")) {
      $("modalFollowUpText").textContent = record.followUp || record.treatment?.followUp || "প্রয়োজনে যোগাযোগ করবেন।";
    }

    // Signature
    const sigImgEl = $("modalSigImg");
    if (sigImgEl) {
      if (record.signature) {
        sigImgEl.src = record.signature;
        sigImgEl.classList.remove("d-none");
      } else {
        sigImgEl.classList.add("d-none");
      }
    }

    // Show Modal
    const modalEl = $("dhDetailModal");
    if (modalEl && window.bootstrap?.Modal) {
      const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  }

  // ============================================================================
  // 11. RECORD DELETION
  // ============================================================================
  function dhDeleteRecord(recordId) {
    if (!confirm(tr("confirmDelete"))) return;

    let all = getDigitalPadRecords();
    all = all.filter((r) => r.id !== recordId);
    saveDigitalPadRecords(all);

    // Also remove from general vault if present
    try {
      const vaultAll = JSON.parse(localStorage.getItem(RX_VAULT_KEY) || "[]");
      const updatedVault = vaultAll.filter((r) => r.id !== recordId);
      localStorage.setItem(RX_VAULT_KEY, JSON.stringify(updatedVault));
    } catch (_) {}

    dhToast(tr("toastDeleted"), "success");
    dhRenderCards();
    dhRenderTable();
  }

  // ============================================================================
  // 12. CSV EXPORT
  // ============================================================================
  function dhExportCSV() {
    const records = getDigitalPadRecords();
    if (!records || records.length === 0) {
      dhToast("কোনো ডেটা পাওয়া যায়নি।", "warn");
      return;
    }

    const headers = [
      "Record ID",
      "Date",
      "Serial Number",
      "Patient Name",
      "Patient Age",
      "Patient Gender",
      "Doctor Name",
      "Hospital/Clinic",
      "Diagnosis",
      "Vitals (BP/Pulse)",
      "Medicines (Rx)",
      "General Advice",
      "Source"
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = records.map((r) => {
      const medsStr = (r.medicines || (r.meds || []).map((m) => ({ name: m })))
        .map((m) => `${m.name || ""}${m.dosage ? ` (${m.dosage})` : ""}${m.freq ? ` [${m.freq}]` : ""}`)
        .join("; ");

      const vitalsStr = `BP: ${r.clinical?.oe?.bp || "–"}, Pulse: ${r.clinical?.oe?.pulse || "–"}`;

      return [
        escapeCsv(r.id),
        escapeCsv(r.createdAt || r.prescDate || ""),
        escapeCsv(r.serialNo || ""),
        escapeCsv(r.patientName || r.patName || ""),
        escapeCsv(r.patientAge || ""),
        escapeCsv(r.patientGender || ""),
        escapeCsv(r.doctor || ""),
        escapeCsv(r.clinic || r.hospital || ""),
        escapeCsv(r.diagnosis || ""),
        escapeCsv(vitalsStr),
        escapeCsv(medsStr),
        escapeCsv(r.advice || r.treatment?.advice || ""),
        escapeCsv(r.source || "digital_pad")
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `BreatheWell_DigitalPad_Prescriptions_${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    dhToast(tr("toastCsvExported"), "success");
  }

  // ============================================================================
  // 13. WHATSAPP & CLIPBOARD ACTIONS
  // ============================================================================
  function shareViaWhatsApp() {
    if (!activeSelectedRecord) return;
    const r = activeSelectedRecord;
    const text = `📋 *Digital Prescription - BreatheWell*\n` +
      `👨‍⚕️ *Doctor:* ${r.doctor} (${r.clinic || r.hospital})\n` +
      `👤 *Patient:* ${r.patientName || r.patName} (SL: ${r.serialNo})\n` +
      `🩺 *Diagnosis:* ${r.diagnosis || "Consultation"}\n` +
      `💊 *Rx Medicines:*\n${(r.medicines || (r.meds || []).map(m => ({name: m}))).map((m, i) => `${i+1}. ${m.name} (${m.freq || "১+০+১"})`).join("\n")}\n` +
      `💡 *Advice:* ${r.advice || r.treatment?.advice || "Rest & hydrate"}`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function copyPrescriptionText() {
    if (!activeSelectedRecord) return;
    const r = activeSelectedRecord;
    const text = `MEDICAL PRESCRIPTION\nDoctor: ${r.doctor}\nHospital: ${r.clinic || r.hospital}\nPatient: ${r.patientName || r.patName} | Serial: ${r.serialNo}\nDiagnosis: ${r.diagnosis}\nMedicines:\n${(r.medicines || []).map((m, i) => `${i+1}. ${m.name} - ${m.freq || ""} - ${m.duration || ""}`).join("\n")}\nAdvice: ${r.advice || ""}`;

    navigator.clipboard?.writeText(text).then(() => {
      dhToast(tr("toastCopied"), "success");
    }).catch(() => {
      dhToast("কপি করা সম্ভব হয়নি।", "warn");
    });
  }

  // ============================================================================
  // 14. TOAST NOTIFICATIONS
  // ============================================================================
  function dhToast(message, type = "info") {
    let stack = $("rxToastStack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "rxToastStack";
      stack.className = "rx-toast-stack";
      document.body.appendChild(stack);
    }

    const toast = document.createElement("div");
    toast.className = `rx-toast-item ${type}`;
    const icon = type === "success" ? "bi-check-circle-fill" : type === "warn" ? "bi-exclamation-triangle-fill" : "bi-info-circle-fill";

    toast.innerHTML = `
      <i class="bi ${icon} rx-toast-icon"></i>
      <span class="rx-toast-msg">${escapeHtml(message)}</span>
      <button type="button" class="rx-toast-close" aria-label="Close">&times;</button>
    `;

    toast.querySelector(".rx-toast-close").addEventListener("click", () => toast.remove());
    stack.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // ============================================================================
  // 15. LIFECYCLE & EVENT ROUTING
  // ============================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    bindToolbarEvents();
    bindModalActionButtons();
    dhRenderCards();
    dhRenderTable();
    dhApplyViewFormat(currentViewFormat);

    $("btnExportCsv")?.addEventListener("click", dhExportCSV);
  });

  function bindToolbarEvents() {
    // Filter pills
    document.querySelectorAll(".dh-filter-pill[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.filter;
        document.querySelectorAll(".dh-filter-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        dhRenderCards();
        dhRenderTable();
      });
    });

    // Sort select
    $("dhSortSelect")?.addEventListener("change", (e) => {
      activeSort = e.target.value;
      dhRenderCards();
      dhRenderTable();
    });

    // Search input
    $("dhSearch")?.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      dhRenderCards();
      dhRenderTable();
    });

    // View format switchers
    $("btnViewGrid")?.addEventListener("click", () => dhApplyViewFormat("grid"));
    $("btnViewTable")?.addEventListener("click", () => dhApplyViewFormat("table"));
  }

  function bindModalActionButtons() {
    $("btnPrintModalPrescription")?.addEventListener("click", () => window.print());
    $("btnShareModalWhatsApp")?.addEventListener("click", shareViaWhatsApp);
    $("btnCopyModalText")?.addEventListener("click", copyPrescriptionText);
  }

  function initLanguage() {
    applyTranslations();

    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("bwLanguageChanged", (e) => {
        if (e.detail?.lang && e.detail.lang !== currentLang) {
          currentLang = e.detail.lang;
          applyTranslations();
          dhRenderCards();
          dhRenderTable();
        }
      });
    }
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-dh-i18n]").forEach((el) => {
      const k = el.getAttribute("data-dh-i18n");
      if (k && tr(k)) {
        el.textContent = tr(k);
      }
    });

    document.querySelectorAll("[data-dh-i18n-placeholder]").forEach((el) => {
      const k = el.getAttribute("data-dh-i18n-placeholder");
      if (k && tr(k)) {
        el.placeholder = tr(k);
      }
    });
  }

  // ============================================================================
  // 16. UTILITY HELPERS
  // ============================================================================
  function fmtDate(iso) {
    if (!iso) return "–";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      if (currentLang === "bn") {
        return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
      }
      return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    } catch (_) {
      return iso;
    }
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
  window.dhViewRecord = dhViewRecord;
  window.dhDeleteRecord = dhDeleteRecord;
  window.dhExportCSV = dhExportCSV;
  window.dhApplyViewFormat = dhApplyViewFormat;
})();

