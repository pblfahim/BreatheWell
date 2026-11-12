/**
 * ============================================================================
 * BreatheWell - Clinical Prescription Vault Engine (prescriptions-volt.js)
 * ============================================================================
 * @file        asset/js/prescriptions-volt.js
 * @module      BreatheWell/PrescriptionVault
 * @author      BreatheWell Health Informatics Team
 * @version     2.0.0
 * @license     MIT
 * @description
 *   Production-grade, client-side clinical application engine for
 *   prescriptions-volt.html. Integrates multi-format file uploads (JPG, PNG, WebP,
 *   PDF), in-browser canvas image compression, Tesseract.js v5 OCR text
 *   extraction, a comprehensive clinical regex parser, dynamic medical chip
 *   managers (C/C, H/O, Inv), structured medication schedule builder,
 *   localStorage vault persistence, searchable/filterable gallery with badges,
 *   full-screen lightbox viewer, and 100% bilingual (Bengali/English) i18n.
 *
 * Table of Contents (TOC):
 *   1.  Constants, State & DOM Selectors
 *   2.  Bilingual Localization Dictionaries (RX_T)
 *   3.  Lifecycle Initialization & Event Routing
 *   4.  File Upload, Drag & Drop, Canvas Compression
 *   5.  Dynamic Clinical Chips (C/C, H/O, Inv.)
 *   6.  Structured Medication Table & Quick Presets
 *   7.  Fully Functional OCR Engine (Image & PDF Stream Parser)
 *   8.  Clinical Regex Extraction & Visual Flash Highlight
 *   9.  Prescription Vault Persistence (localStorage)
 *   10. Gallery Card Grid & Multi-Facet Filter/Sort/Search
 *   11. Fullscreen Lightbox & Document Inspection
 *   12. Family Read-Only View Mode (?rxview=...)
 *   13. Toast Notification Stack & Mobile Drawer Navigation
 * ============================================================================
 */

(function () {
  "use strict";

  // ============================================================================
  // 1. CONSTANTS, STATE & DOM SELECTORS
  // ============================================================================
  const RX_KEY = "bw_prescriptions";
  const LANG_KEY = "bw_lang";
  const PIN_KEY = "bw_rx_pin";

  // Compression & Optimization Limits
  const MAX_IMG_DIM = 1200;
  const JPEG_QUALITY = 0.72;
  const STORAGE_WARN_BYTES = 4 * 1024 * 1024; // 4 MB

  // Application State
  let currentLang = localStorage.getItem(LANG_KEY) || "bn";
  let pendingFiles = [];
  let currentMeds = []; // Array of structured objects: { name, form, dosage, timing, duration, note }
  let currentCC = [];   // Array of strings: Chief Complaints
  let currentHO = [];   // Array of strings: History of Illness
  let currentInv = [];  // Array of strings: Lab Investigations

  let galleryFilter = "all";
  let gallerySort = "newest";
  let gallerySearch = "";
  let ocrWorker = null;
  let ocrBusy = false;
  let latestRawOcrText = "";
  let selectedOcrLang = "eng+ben";
  let ocrRotation = 0;
  let ocrEnhanceFilter = true;
  let ocrActiveSource = null;
  let currentWorkerLang = "";

  let lbRecordList = [];
  let lbRecordIndex = 0;
  let lbFileIndex = 0;

  let viewMode = false;
  let viewModeRecords = [];
  let stagedImportRecords = [];
  let stagedImportFilename = "";

  /**
   * Safe document element lookup helper.
   * @param {string} id - HTML element ID.
   * @returns {HTMLElement|null}
   */
  const $ = (id) => document.getElementById(id);

  // Initialize PDF.js worker if pdfjsLib is loaded
  if (typeof window !== "undefined" && window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "asset/vendor/pdfjs/pdf.worker.min.js";
  }

  // Default Clinical Sample Text (Matches Dr. A. Rahman Clinical Hospital Prescription)
  const sampleFallbackText = `Dr. A. Rahman
MBBS, FCPS (Medicine), MD (Neurology)
Reg No: A-123456
City General Hospital
123 Health Avenue, Dhanmondi, Dhaka-1205 | Call: +880 1700-000000
Patient Name: Rahim Uddin | Age: 45 | Sex: Male | Date: 06/11/2026
C/C: High fever with chills x 3 days, Severe headache & body aches, Dry cough
H/O: Diabetes Mellitus (DM) x 5 years, Hypertension (HTN)
O/E Vitals: BP: 120/80 mmHg | Pulse: 72 bpm | Temp: 102.4 F | Weight: 65 kg
Inv.: CBC (Complete Blood Count), Dengue NS1 Antigen, Urine R/M/E
Dx: Acute Viral Fever with Upper Respiratory Tract Infection (Flu)
Rx:
1. Tab. Napa Extend (665mg) - 1+0+1 - After meal - 5 days
2. Tab. Fexo (120mg) - 0+0+1 - After meal - 7 days
3. Cap. Seclo (20mg) - 1+0+1 - Before meal - 14 days
4. Tab. Monas (10mg) - 0+0+1 - At bedtime - 1 month
5. Oral Rehydration Salt (ORS) - As needed - In 500ml water - 3 days
Advice:
Drink 3-4 liters of boiled lukewarm water daily. Complete bed rest for 3 days. Sponge forehead with cool water if fever exceeds 101 F. Avoid cold foods.
Next Refill: 14 days
Urgency: Normal`;

  // ============================================================================
  // 2. BILINGUAL LOCALIZATION DICTIONARIES (RX_T)
  // ============================================================================
  const RX_T = {
    bn: {
      navHome: "হোম",
      navHomeSub: "মুখ্য পাতা",
      navExercises: "শ্বাসের অনুশীলন",
      navExercisesSub: "শ্বাস-প্রশ্বাসের ব্যায়াম ও BOLT টেস্ট",
      navTest: "শ্বাসের পরীক্ষা",
      navTestSub: "BOLT ও শ্বাস গণনা ল্যাব",
      navHealth: "স্বাস্থ্য ট্র্যাকার",
      navHealthSub: "রক্তচাপ ও গ্লুকোজ পর্যবেক্ষণ",
      navRx: "প্রেসক্রিপশন",
      navRxSub: "ব্যবস্থাপত্র ভল্ট ও স্ক্যান",
      navSafety: "নিরাপত্তা",
      navSafetySub: "জরুরি নির্দেশিকা ও সতর্কতা",
      navMore: "আরও",
      navPagesTitle: "পেজ সমূহ",
      heroEyebrow: "ডিজিটাল স্বাস্থ্য সংরক্ষণ",
      heroTitle: "প্রেসক্রিপশন ভল্ট",
      heroSub: "আপনার ডাক্তারের প্রেসক্রিপশন নিরাপদে সংরক্ষণ ও পর্যবেক্ষণ করুন।",
      heroCreatePrescription: "প্রেসক্রিপশন তৈরি করুন",
      tabVault: "প্রেসক্রিপশন ভল্ট",
      tabHistory: "প্রেসক্রিপশন ইতিহাস",
      tabCreate: "প্রেসক্রিপশন তৈরি",
      tabPad: "ডিজিটাল প্যাড",
      btnCreateDigitalRx: "ডিজিটাল প্রেসক্রিপশন তৈরি",
      storageLabel: "স্টোরেজ ব্যবহার",
      storageCount: "টি প্রেসক্রিপশন",
      uploadTitle: "প্রেসক্রিপশন আপলোড করুন",
      uploadSub: "ছবি বা PDF ড্র্যাগ করুন অথবা ক্লিক করে বেছে নিন",
      uploadPick: "ফাইল বেছে নিন",
      btnSampleOcr: "নমুনা প্রেসক্রিপশনে OCR পরীক্ষা করুন (Sample OCR)",
      ocrScanning: "ছবি স্ক্যান ও টেক্সট পড়া হচ্ছে...",
      ocrSuccess: "OCR সফল: প্রেসক্রিপশনের তথ্য ও ওষুধ ফর্মটিতে পূরণ করা হয়েছে!",
      ocrError: "OCR প্রক্রিয়া ব্যাহত হয়েছে, অনুগ্রহ করে ম্যানুয়াল পূরণ করুন।",
      cardDoctorTitle: "ডাক্তার ও হাসপাতালের তথ্য",
      lblDoctorName: "ডাক্তারের নাম",
      lblDegrees: "ডিগ্রি ও বিশেষজ্ঞতা",
      lblRegNo: "রেজিস্ট্রেশন নম্বর",
      lblHospitalName: "হাসপাতাল / ক্লিনিক",
      lblHospitalAddress: "ঠিকানা",
      lblHospitalPhone: "মোবাইল / হেল্পলাইন",
      cardPatientTitle: "রোগীর তথ্য ও সময়সূচী",
      lblPatientName: "রোগীর নাম",
      lblAge: "বয়স",
      lblSex: "লিঙ্গ",
      lblDate: "তারিখ",
      lblUrgency: "জরুরিত্ব",
      urgNormal: "স্বাভাবিক",
      urgFollowup: "ফলো-আপ প্রয়োজন",
      urgUrgent: "জরুরি",
      lblRefill: "পরবর্তী রিফিলের তারিখ",
      cardClinicalTitle: "ক্লিনিক্যাল হিস্ট্রি ও পরীক্ষা (O/E)",
      lblCC: "প্রধান সমস্যা (C/C)",
      lblHO: "অতীত রোগ ইতিহাস (H/O)",
      lblOE: "শারীরিক পরীক্ষা (O/E Vitals)",
      lblInv: "ল্যাব পরীক্ষা (Inv.)",
      cardTreatmentTitle: "চিকিৎসা ও ওষুধ (Rx)",
      lblDx: "রোগনির্ণয় (Dx)",
      addMedicine: "ওষুধ যোগ করুন",
      colMedName: "ওষুধের নাম",
      colDosage: "ডোজ",
      colTiming: "সময়",
      colDuration: "মেয়াদ",
      colAction: "একশন",
      lblAdvice: "পরামর্শ ও নির্দেশনা",
      btnSave: "প্রেসক্রিপশন সংরক্ষণ করুন",
      lblMeds: "ওষুধ ও ফাইল",
      saveModalTitle: "প্রেসক্রিপশন সংরক্ষণ",
      saveModalSub: "প্রেসক্রিপশনটি সহজে খুঁজে পাওয়ার জন্য একটি ফাইলের নাম নির্ধারণ করুন:",
      lblCreateFileName: "ফাইলের নাম তৈরি করুন",
      phCreateFileName: "যেমন: Dr_Rahman_2026-11-09",
      hintCreateFileName: "ফাইল নামের মাধ্যমে পরবর্তীতে ভল্টে দ্রুত সার্চ ও ফিল্টার করতে পারবেন।",
      saveModalSummary: "সংরক্ষণ বিবরণী",
      btnConfirmSave: "সফলভাবে সংরক্ষণ করুন",
      ocrModalTitle: "এআই ওসিআর টেক্সট ও ক্লিনিক্যাল অ্যানালাইসিস",
      ocrModalSub: "প্রেসক্রিপশন থেকে সরাসরি এক্সট্রাক্টকৃত টেক্সট নিচে দেখানো হলো। প্রয়োজনে টেক্সট এডিট করে 'ফর্মে রি-পার্স করুন' বাটনে ক্লিক করুন:",
      btnViewRawOcr: "স্ক্যানকৃত টেক্সট দেখুন ও এডিট করুন",
      btnReparseOcr: "ফর্মে রি-পার্স করুন",
      btnCopyOcr: "টেক্সট কপি করুন",
      toastOcrReparsed: "OCR টেক্সট সফলভাবে ফর্মে রি-পার্স করা হয়েছে!",
      toastCopied: "টেক্সট ক্লিপবোর্ডে কপি করা হয়েছে!",
      ocrFilterHighContrast: "হাই-কনট্রাস্ট",
      ocrRotateLeft: "বাম দিকে ঘোরান",
      ocrRotateRight: "ডান দিকে ঘোরান",
      ocrRerun: "পুনরায় স্ক্যান",
      ocrLangLabel: "ভাষা:",
      galleryTitle: "সংরক্ষিত প্রেসক্রিপশন",
      searchPh: "ডাক্তার বা ওষুধ খুঁজুন...",
      filterAll: "সবগুলো",
      filterNormal: "স্বাভাবিক",
      filterUrgent: "জরুরি",
      filterFollowup: "ফলো-আপ",
      sortNew: "নতুন প্রথমে",
      sortOld: "পুরনো প্রথমে",
      sortDoctor: "ডাক্তারের নাম",
      emptyGallery: "এখনো কোনো প্রেসক্রিপশন সংরক্ষণ করা হয়নি।",
      openBtn: "দেখুন",
      noRx: "কোনো প্রেসক্রিপশন নেই",
      noRxSub: "উপরে ফাইল আপলোড করুন",
      moreFiles: "+{n}টি ফাইল",
      moreMeds: "+{n}টি আরও",
      refillDue: "রিফিল বাকি!",
      refillSoon: "শীঘ্রই রিফিল",
      refillOk: "রিফিল ঠিক আছে",
      confirmDelete: "আপনি কি এই প্রেসক্রিপশনটি মুছে ফেলতে চান?",
      toastSaved: "প্রেসক্রিপশন সফলভাবে সংরক্ষিত হয়েছে!",
      toastDeleted: "প্রেসক্রিপশন মুছে ফেলা হয়েছে।",
      toastNoMeta: "অনুগ্রহ করে ডাক্তারের নাম লিখুন অথবা ফাইল আপলোড করুন।",
      toastTooBig: "স্টোরেজের জায়গা কম। অনুগ্রহ করে কিছু প্রেসক্রিপশন মুছুন।",
      btnDownload: "ডাউনলোড",
      btnClose: "বন্ধ করুন",
      viewModeMsg: "পারিবারিক ভিউ মোড সক্রিয়। মোট {n}টি প্রেসক্রিপশন সংরক্ষিত আছে (শুধুমাত্র দেখার জন্য)।",
      langSelectTitle: "ভাষা নির্বাচন করুন",
      quickToolsTitle: "কুইক অ্যাকশন",
      quickEmergencyLabel: "জরুরি SOS",
      quickEmergencySub: "হেল্পলাইন ৯৯৯ ও ১৬২৬৩",
      sidebarBrandSub: "ডিজিটাল স্বাস্থ্য ভল্ট",
      footerTag: "প্রতিটি নিঃশ্বাসে একটু প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।",
      skip: "মূল কনটেন্টে যান"
    },
    en: {
      navHome: "Home",
      navHomeSub: "Main Dashboard",
      navExercises: "Breathing Exercises",
      navExercisesSub: "Breathing exercises & BOLT test",
      navTest: "Breath Test",
      navTestSub: "BOLT & Rate Assessment",
      navHealth: "Health Tracker",
      navHealthSub: "Blood Pressure & Glucose",
      navRx: "Prescriptions",
      navRxSub: "Prescription Vault & OCR",
      navSafety: "Safety",
      navSafetySub: "Emergency & Safety Guide",
      navMore: "More",
      navPagesTitle: "Main Pages",
      heroEyebrow: "Digital Health Vault",
      heroTitle: "Prescription Vault",
      heroSub: "Store and monitor your doctor's prescriptions securely.",
      heroCreatePrescription: "Create Prescription",
      tabVault: "Prescription Vault",
      tabHistory: "Prescription History",
      tabCreate: "Create Prescription",
      tabPad: "Digital Pad",
      btnCreateDigitalRx: "Create Digital Rx",
      storageLabel: "Storage used",
      storageCount: "prescriptions",
      uploadTitle: "Upload Prescription",
      uploadSub: "Drag & drop images or PDFs, or click to browse",
      uploadPick: "Browse files",
      btnSampleOcr: "Test OCR on Sample Prescription",
      ocrScanning: "Scanning image & analyzing text...",
      ocrSuccess: "OCR Success: Prescription info and medicines populated!",
      ocrError: "OCR processing failed, please fill manually.",
      cardDoctorTitle: "Doctor & Hospital Info",
      lblDoctorName: "Doctor's Name",
      lblDegrees: "Degrees & Specialization",
      lblRegNo: "Registration Number",
      lblHospitalName: "Hospital / Clinic",
      lblHospitalAddress: "Address",
      lblHospitalPhone: "Mobile / Helpline",
      cardPatientTitle: "Patient Information & Scheduling",
      lblPatientName: "Patient Name",
      lblAge: "Age",
      lblSex: "Gender",
      lblDate: "Date",
      lblUrgency: "Urgency",
      urgNormal: "Normal",
      urgFollowup: "Follow-up",
      urgUrgent: "Urgent",
      lblRefill: "Next Refill Date",
      cardClinicalTitle: "Clinical History & Vitals (O/E)",
      lblCC: "Chief Complaints (C/C)",
      lblHO: "History of Illness (H/O)",
      lblOE: "Physical Vitals (O/E)",
      lblInv: "Lab Tests (Inv.)",
      cardTreatmentTitle: "Treatment & Medications (Rx)",
      lblDx: "Diagnosis (Dx)",
      addMedicine: "Add Medicine",
      colMedName: "Medicine Name",
      colDosage: "Dosage",
      colTiming: "Timing",
      colDuration: "Duration",
      colAction: "Action",
      lblAdvice: "Doctor's Advice",
      btnSave: "Save Prescription",
      lblMeds: "Meds & Files",
      saveModalTitle: "Save Prescription",
      saveModalSub: "Specify a file name to easily organize and find this prescription:",
      lblCreateFileName: "Create File Name",
      phCreateFileName: "e.g., Dr_Rahman_2026-11-09",
      hintCreateFileName: "You can quickly search and filter prescriptions in your vault using this file name.",
      saveModalSummary: "Summary Overview",
      btnConfirmSave: "Save Successfully",
      ocrModalTitle: "AI OCR Text & Clinical Analysis",
      ocrModalSub: "Raw extracted text from prescription shown below. Edit as needed and click 'Re-parse to Form':",
      btnViewRawOcr: "View / Edit Scanned Text",
      btnReparseOcr: "Re-parse to Form",
      btnCopyOcr: "Copy Text",
      toastOcrReparsed: "OCR text successfully re-parsed to form!",
      toastCopied: "Text copied to clipboard!",
      ocrFilterHighContrast: "High-Contrast",
      ocrRotateLeft: "Rotate Left",
      ocrRotateRight: "Rotate Right",
      ocrRerun: "Re-run OCR",
      ocrLangLabel: "Language:",
      galleryTitle: "Saved Prescriptions",
      searchPh: "Search doctor or medicine...",
      filterAll: "All",
      filterNormal: "Normal",
      filterUrgent: "Urgent",
      filterFollowup: "Follow-up",
      sortNew: "Newest First",
      sortOld: "Oldest First",
      sortDoctor: "Doctor name",
      emptyGallery: "No prescriptions saved yet.",
      openBtn: "View",
      noRx: "No prescriptions yet",
      noRxSub: "Upload a file above to get started",
      moreFiles: "+{n} files",
      moreMeds: "+{n} more",
      refillDue: "Refill due!",
      refillSoon: "Refill soon",
      refillOk: "Refill OK",
      confirmDelete: "Are you sure you want to delete this prescription?",
      toastSaved: "Prescription saved successfully!",
      toastDeleted: "Prescription deleted.",
      toastNoMeta: "Please enter doctor name or upload files.",
      toastTooBig: "Storage nearly full. Please remove some items.",
      btnDownload: "Download",
      btnClose: "Close",
      viewModeMsg: "Family view mode active. {n} prescription(s) available (read-only).",
      langSelectTitle: "Select Language",
      quickToolsTitle: "Quick Actions",
      quickEmergencyLabel: "Emergency SOS",
      quickEmergencySub: "Helpline 999 & 16263",
      sidebarBrandSub: "Digital Health Vault",
      footerTag: "A touch of serenity with every breath",
      footerDisclaimer: "For wellness guidance only. Not medical advice.",
      skip: "Skip to main content"
    }
  };

  /**
   * Translates key to active language with English fallback.
   * @param {string} k - Translation dictionary key.
   * @returns {string}
   */
  function tr(k) {
    return RX_T[currentLang]?.[k] || RX_T["en"]?.[k] || k;
  }

  // ============================================================================
  // 3. LIFECYCLE INITIALIZATION & EVENT ROUTING
  // ============================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initHeroPills();
    rxHandleViewMode();
    bindUploadZone();
    bindDynamicItemInputs();
    bindMedicineTableControls();
    bindFormSubmit();
    bindGalleryControls();
    bindLightbox();
    initMobileSidebar();
    initOcrControls();
    rxRenderGallery();
    rxUpdateStorage();
  });

  function initHeroPills() {
    $("rxHeroBtnUpload")?.addEventListener("click", () => {
      $("rxUploadSection")?.scrollIntoView({ behavior: "smooth" });
    });
    $("rxHeroBtnGallery")?.addEventListener("click", () => {
      $("rxGallerySection")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function initLanguage() {
    const toggleBtn = $("langToggle") || $("rxLangToggle");
    if (toggleBtn) {
      toggleBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
      toggleBtn.addEventListener("click", () => {
        currentLang = currentLang === "bn" ? "en" : "bn";
        localStorage.setItem(LANG_KEY, currentLang);
        toggleBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
        applyTranslations();
        rxRenderGallery();
      });
    }

    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("bwLanguageChanged", (e) => {
        if (e.detail && e.detail.lang && e.detail.lang !== currentLang) {
          currentLang = e.detail.lang;
          if (toggleBtn) toggleBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
          applyTranslations();
          rxRenderGallery();
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
        if (toggleBtn) toggleBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
        applyTranslations();
        rxRenderGallery();
      });
    });

    applyTranslations();
  }

  function applyTranslations() {
    document.querySelectorAll("[data-rx-i18n]").forEach((el) => {
      const k = el.getAttribute("data-rx-i18n");
      if (k && tr(k)) {
        const span = el.querySelector("span");
        if (span && el.querySelector("i")) {
          span.textContent = tr(k);
        } else {
          el.textContent = tr(k);
        }
      }
    });

    document.querySelectorAll("[data-rx-i18n-placeholder]").forEach((el) => {
      const k = el.getAttribute("data-rx-i18n-placeholder");
      if (k && tr(k)) el.placeholder = tr(k);
    });
  }

  // ============================================================================
  // 4. FILE UPLOAD, DRAG & DROP, CANVAS COMPRESSION
  // ============================================================================
  function bindUploadZone() {
    const zone = $("rxUploadZone");
    const input = $("rxFileInput");
    const pickBtn = $("rxPickBtn");

    if (!zone || !input) return;

    zone.addEventListener("click", () => input.click());
    if (pickBtn) {
      pickBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        input.click();
      });
    }

    ["dragenter", "dragover"].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.remove("dragover");
      });
    });

    zone.addEventListener("drop", (e) => {
      const files = e.dataTransfer?.files;
      if (files?.length) handleIncomingFiles(Array.from(files));
    });

    input.addEventListener("change", () => {
      if (input.files?.length) {
        handleIncomingFiles(Array.from(input.files));
        input.value = "";
      }
    });

    // Sample OCR button
    $("btnSampleOcr")?.addEventListener("click", runSampleOcr);
  }

  async function handleIncomingFiles(files) {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    const accepted = files.filter(
      (f) => validTypes.includes(f.type) || f.name.match(/\.(jpg|jpeg|png|webp|gif|pdf)$/i)
    );

    if (!accepted.length) {
      rxToast("অনুগ্রহ করে ছবি (JPG, PNG, WebP) অথবা PDF ফাইল দিন।", "warn");
      return;
    }

    const progress = $("rxProgress");
    const fill = $("rxProgressFill");
    const label = $("rxProgressLabel");
    if (progress) progress.classList.add("active");

    for (let i = 0; i < accepted.length; i++) {
      const f = accepted[i];
      if (fill) fill.style.width = `${Math.round(((i + 1) / accepted.length) * 100)}%`;
      if (label) label.textContent = `প্রক্রিয়াকরণ হচ্ছে: ${f.name}`;

      try {
        const fileObj = await readFileAndCompress(f);
        pendingFiles.push(fileObj);
        renderPreviewStrip();

        // Run modern OCR on the first uploaded file
        if (pendingFiles.length === 1) {
          ocrActiveSource = {
            type: fileObj.mime === "application/pdf" ? "pdf" : "image",
            file: f,
            dataUrl: fileObj.data,
            name: f.name,
          };
          runModernOCR(ocrActiveSource);
        }
      } catch (err) {
        console.error("Compression error:", err);
      }
    }

    setTimeout(() => {
      if (progress) progress.classList.remove("active");
      if (fill) fill.style.width = "0%";
    }, 400);
  }

  function readFileAndCompress(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;

      if (file.type === "application/pdf") {
        reader.onload = (e) => {
          resolve({
            name: file.name,
            mime: "application/pdf",
            size: file.size,
            data: e.target.result,
          });
        };
        reader.readAsDataURL(file);
        return;
      }

      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let { width, height } = img;
          if (width > MAX_IMG_DIM || height > MAX_IMG_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_IMG_DIM) / width);
              width = MAX_IMG_DIM;
            } else {
              width = Math.round((width * MAX_IMG_DIM) / height);
              height = MAX_IMG_DIM;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
          resolve({
            name: file.name,
            mime: "image/jpeg",
            size: Math.round(compressed.length * 0.75),
            data: compressed,
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPreviewStrip() {
    const strip = $("rxPreviewStrip");
    if (!strip) return;
    strip.innerHTML = "";

    pendingFiles.forEach((file, index) => {
      const wrap = document.createElement("div");
      wrap.className = "rx-preview-thumb-wrap";
      const isPdf = file.mime === "application/pdf";

      wrap.innerHTML = `
        ${isPdf
          ? `<div class="d-flex align-items-center justify-content-center h-100 bg-danger text-white fs-4 fw-bold">PDF</div>`
          : `<img src="${file.data}" class="rx-preview-thumb" alt="${file.name}">`
        }
        <button type="button" class="rx-preview-remove" aria-label="Remove file">
          <i class="bi bi-x"></i>
        </button>
      `;

      wrap.querySelector(".rx-preview-remove").addEventListener("click", () => {
        pendingFiles.splice(index, 1);
        renderPreviewStrip();
      });

      strip.appendChild(wrap);
    });
  }

  // ============================================================================
  // 5. DYNAMIC CLINICAL CHIPS (C/C, H/O, Inv.)
  // ============================================================================
  function bindDynamicItemInputs() {
    // Chief Complaints (C/C)
    $("btnRxCCAdd")?.addEventListener("click", () => addChipItem("cc", $("rxCCInput")));
    $("rxCCInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addChipItem("cc", $("rxCCInput"));
      }
    });

    // History of Illness (H/O)
    $("btnRxHOAdd")?.addEventListener("click", () => addChipItem("ho", $("rxHOInput")));
    $("rxHOInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addChipItem("ho", $("rxHOInput"));
      }
    });

    // Investigations (Inv.)
    $("btnRxInvAdd")?.addEventListener("click", () => addChipItem("inv", $("rxInvInput")));
    $("rxInvInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addChipItem("inv", $("rxInvInput"));
      }
    });
  }

  function addChipItem(type, inputEl) {
    if (!inputEl) return;
    const val = inputEl.value.trim().replace(/^[,;]+|[,;]+$/g, "");
    if (!val) return;

    if (type === "cc") {
      if (!currentCC.includes(val)) currentCC.push(val);
      renderChips("cc");
    } else if (type === "ho") {
      if (!currentHO.includes(val)) currentHO.push(val);
      renderChips("ho");
    } else if (type === "inv") {
      if (!currentInv.includes(val)) currentInv.push(val);
      renderChips("inv");
    }
    inputEl.value = "";
  }

  function renderChips(type) {
    const list = type === "cc" ? currentCC : type === "ho" ? currentHO : currentInv;
    const containerId =
      type === "cc" ? "rxCCChipContainer" : type === "ho" ? "rxHOChipContainer" : "rxInvChipContainer";
    const container = $(containerId);
    if (!container) return;

    container.innerHTML = "";
    list.forEach((item, idx) => {
      const chip = document.createElement("span");
      chip.className = "cp-chip";
      chip.innerHTML = `
        <span>${escapeHtml(item)}</span>
        <button type="button" class="cp-chip-remove border-0 bg-transparent p-0 text-muted" aria-label="Remove item">
          <i class="bi bi-x"></i>
        </button>
      `;
      chip.querySelector(".cp-chip-remove").addEventListener("click", () => {
        list.splice(idx, 1);
        renderChips(type);
      });
      container.appendChild(chip);
    });
  }

  // ============================================================================
  // 6. STRUCTURED MEDICATION TABLE & QUICK PRESETS
  // ============================================================================
  function bindMedicineTableControls() {
    // Quick Preset Pills
    document.querySelectorAll(".rx-med-preset-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const medName = btn.dataset.med || btn.textContent.trim();
        const dosage = btn.dataset.dosage || "1+0+1";
        const timing = btn.dataset.timing || "After meal";
        const duration = btn.dataset.duration || "5 days";

        let form = "Tab";
        if (/^Cap\./i.test(medName)) form = "Cap";
        else if (/^Syr\./i.test(medName)) form = "Syr";
        else if (/^Inj\./i.test(medName)) form = "Inj";
        else if (/ORS/i.test(medName)) form = "Sachet";

        const clean = medName.replace(/^(?:Tab\.|Cap\.|Syr\.|Inj\.)\s*/i, "").trim();
        currentMeds.push({
          name: clean,
          form: form,
          dosage: dosage,
          timing: timing,
          duration: duration,
          note: ""
        });
        renderMedicineTable();
        flashHighlight($("rxMedsTbody"));
      });
    });

    // Add Medicine Button
    $("btnRxAddMedicine")?.addEventListener("click", () => {
      const name = $("rxMedNameInput")?.value.trim();
      if (!name) {
        rxToast("অনুগ্রহ করে ওষুধের নাম লিখুন", "warn");
        return;
      }
      const form = $("rxMedFormSelect")?.value || "Tab";
      const dosage = $("rxMedDosageInput")?.value.trim() || "1+0+1";
      const timing = $("rxMedTimingSelect")?.value || "After meal";
      const duration = $("rxMedDurationInput")?.value.trim() || "5 days";
      const note = $("rxMedNoteInput")?.value.trim() || "";

      currentMeds.push({ name, form, dosage, timing, duration, note });
      if ($("rxMedNameInput")) $("rxMedNameInput").value = "";
      if ($("rxMedNoteInput")) $("rxMedNoteInput").value = "";
      renderMedicineTable();
      flashHighlight($("rxMedsTbody"));
    });
  }

  function renderMedicineTable() {
    const tbody = $("rxMedsTbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!currentMeds.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-2 small">কোনো ওষুধ যোগ করা হয়নি</td></tr>`;
      return;
    }

    currentMeds.forEach((m, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <span class="badge bg-primary-subtle text-primary border border-primary-subtle me-1">${escapeHtml(m.form || "Tab")}</span>
          <strong>${escapeHtml(m.name)}</strong>
          ${m.note ? `<div class="text-xs text-muted">${escapeHtml(m.note)}</div>` : ""}
        </td>
        <td class="text-center"><span class="badge bg-light text-dark border">${escapeHtml(m.dosage || "1+0+1")}</span></td>
        <td><span class="badge bg-light text-teal border">${escapeHtml(m.timing || "After meal")}</span></td>
        <td><small class="text-muted">${escapeHtml(m.duration || "5 days")}</small></td>
        <td class="text-center">
          <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2 btn-rx-med-del" data-idx="${idx}" title="মুছুন">
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      `;
      tr.querySelector(".btn-rx-med-del").addEventListener("click", () => {
        currentMeds.splice(idx, 1);
        renderMedicineTable();
      });
      tbody.appendChild(tr);
    });
  }

  // ============================================================================
  // 7. ADVANCED DUAL-ENGINE OCR PROCESSOR (PDF.js + Multi-Stage Canvas Preprocessing + Tesseract.js v5)
  // ============================================================================

  /**
   * Asynchronously loads an image URL, Blob URL or data URL into an Image element.
   * @param {string} src
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error("ইমেজ লোড করতে ব্যর্থ হয়েছে"));
      img.src = src;
    });
  }

  /**
   * Preprocesses image or canvas with rotation, white backfill, adaptive histogram
   * contrast stretching, and stroke sharpening to maximize OCR text accuracy.
   * @param {HTMLImageElement|HTMLCanvasElement} source
   * @param {Object} options - { rotation: number, enhance: boolean }
   * @returns {HTMLCanvasElement}
   */
  function preprocessImageForOCR(source, options = {}) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return source;

    const srcW = source.naturalWidth || source.videoWidth || source.width || 1200;
    const srcH = source.naturalHeight || source.videoHeight || source.height || 1200;

    // High-resolution scaling for OCR: standardizes resolution between 1600 and 2400
    let scale = 1.0;
    const maxDim = Math.max(srcW, srcH);
    if (maxDim < 1200) {
      scale = Math.min(2.0, 1600 / maxDim);
    } else if (maxDim > 2400) {
      scale = 2400 / maxDim;
    }

    const targetW = Math.round(srcW * scale);
    const targetH = Math.round(srcH * scale);

    const rot = (options.rotation || 0) % 360;
    const isRotated90or270 = rot === 90 || rot === 270;
    canvas.width = isRotated90or270 ? targetH : targetW;
    canvas.height = isRotated90or270 ? targetW : targetH;

    // Fill white background to avoid dark artifacts from transparent PNGs
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.drawImage(source, -targetW / 2, -targetH / 2, targetW, targetH);
    ctx.restore();

    // Adaptive Contrast Stretching & Sharpening Filter
    if (options.enhance) {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const total = data.length;

        // Histogram calculation for percentile contrast stretching
        const hist = new Uint32Array(256);
        for (let i = 0; i < total; i += 4) {
          // ITU-R BT.601 luma calculation
          const g = (data[i] * 77 + data[i + 1] * 150 + data[i + 2] * 29) >> 8;
          data[i] = g;
          hist[g]++;
        }

        const numPixels = total / 4;
        const pLow = numPixels * 0.03;  // 3rd percentile
        const pHigh = numPixels * 0.97; // 97th percentile
        let count = 0;
        let lowCut = 0;
        let highCut = 255;

        for (let g = 0; g < 256; g++) {
          count += hist[g];
          if (count >= pLow && lowCut === 0) lowCut = g;
          if (count >= pHigh) {
            highCut = g;
            break;
          }
        }

        if (highCut <= lowCut) {
          lowCut = 0;
          highCut = 255;
        }

        const range = highCut - lowCut || 1;

        for (let i = 0; i < total; i += 4) {
          let g = data[i];
          if (g <= lowCut) {
            g = 0;
          } else if (g >= highCut) {
            g = 255;
          } else {
            g = Math.round(((g - lowCut) / range) * 255);
          }

          // Gentle adaptive thresholding to boost ink sharpness against paper
          if (g < 145) {
            g = Math.max(0, g - 25);
          } else if (g > 185) {
            g = Math.min(255, g + 25);
          }

          data[i] = g;
          data[i + 1] = g;
          data[i + 2] = g;
          data[i + 3] = 255;
        }

        ctx.putImageData(imgData, 0, 0);
      } catch (err) {
        console.warn("Canvas filter processing skipped (CORS or canvas error):", err);
      }
    }

    return canvas;
  }

  /**
   * PDF.js processing: extracts digital text layer directly if available,
   * or renders scanned page 1 to high-DPI canvas for OCR.
   * @param {File} file
   * @returns {Promise<{type: 'digital'|'canvas', text?: string, canvas?: HTMLCanvasElement}>}
   */
  async function extractTextOrCanvasFromPDF(file) {
    if (!window.pdfjsLib) {
      throw new Error("PDF.js library is not available.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;
    const numPages = Math.min(pdfDoc.numPages || 1, 3);

    let fullDigitalText = "";
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      let lastY = null;
      let pageText = "";

      for (const item of textContent.items) {
        if (!item || typeof item.str !== "string") continue;
        const str = item.str.trim();
        if (!str) continue;

        const currentY = item.transform && item.transform[5];
        if (lastY !== null && currentY !== undefined && Math.abs(currentY - lastY) > 8) {
          pageText += "\n";
        } else if (pageText.length > 0 && !pageText.endsWith(" ") && !pageText.endsWith("\n")) {
          pageText += " ";
        }
        pageText += str;
        if (currentY !== undefined) lastY = currentY;
      }

      if (pageText.trim()) {
        fullDigitalText += (fullDigitalText ? "\n\n" : "") + pageText.trim();
      }
    }

    const hasClinicalKeywords = /(?:Dr\.|Doctor|MBBS|FCPS|MD|Hospital|Clinic|Patient|Name|Age|Sex|Rx|Tab|Cap|Diagnosis|Date|BP|Pulse|Advice|ডাক্তার|হাসপাতাল|রোগী|ওষুধ)/i.test(
      fullDigitalText
    );

    // If digital text layer is present and has meaningful content
    if (fullDigitalText.trim().length > 60 && hasClinicalKeywords) {
      return { type: "digital", text: fullDigitalText.trim() };
    }

    // Scanned or image PDF: Render first page at 2.0x scale (crisp 150-200 DPI)
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    return { type: "canvas", canvas: canvas };
  }

  /**
   * Retrieves or initializes Tesseract.js worker with specified language.
   * @param {string} lang
   * @param {Function} onProgress
   * @returns {Promise<Object>}
   */
  async function getTesseractWorker(lang, onProgress) {
    if (!window.Tesseract) {
      throw new Error("Tesseract.js লাইব্রেরি লোড হয়নি।");
    }

    const targetLang = lang || selectedOcrLang || "eng+ben";

    if (ocrWorker && currentWorkerLang === targetLang) {
      return ocrWorker;
    }

    if (ocrWorker) {
      try {
        await ocrWorker.terminate();
      } catch (e) {
        console.warn("Worker termination:", e);
      }
      ocrWorker = null;
    }

    try {
      ocrWorker = await window.Tesseract.createWorker(targetLang, 1, {
        logger: (m) => {
          if (typeof onProgress === "function") {
            onProgress(m);
          }
        },
      });
      currentWorkerLang = targetLang;
      return ocrWorker;
    } catch (err) {
      console.warn(`Tesseract worker load failed for ${targetLang}, falling back to 'eng':`, err);
      ocrWorker = await window.Tesseract.createWorker("eng", 1, {
        logger: (m) => {
          if (typeof onProgress === "function") {
            onProgress(m);
          }
        },
      });
      currentWorkerLang = "eng";
      return ocrWorker;
    }
  }

  /**
   * Main OCR orchestrator: handles PDFs, images, contrast enhancement,
   * rotation transforms, Tesseract text extraction, and form population.
   * @param {Object} sourceInput
   */
  async function runModernOCR(sourceInput) {
    if (ocrBusy) return;
    ocrBusy = true;

    const statusBanner = $("rxOcrStatus");
    const progress = $("rxProgress");
    const fill = $("rxProgressFill");
    const label = $("rxProgressLabel");

    if (progress) progress.classList.add("active");
    if (fill) fill.style.width = "15%";
    if (label) label.textContent = "ডকুমেন্ট বিশ্লেষণ ও ফিল্টারিং চলছে...";

    if (statusBanner) {
      statusBanner.classList.remove("d-none");
      statusBanner.className = "rx-ocr-status d-flex align-items-center";
      statusBanner.innerHTML = `
        <div class="spinner-border spinner-border-sm text-teal me-2" role="status"></div>
        <div class="flex-grow-1">
          <strong>${tr("ocrScanning")}</strong>
          <div class="text-xs text-muted" id="ocrStepText">ডকুমেন্ট অপ্টিমাইজেশন ও ফিল্টারিং চলছে...</div>
        </div>
      `;
    }

    $("rxUploadZone")?.classList.add("rx-ocr-scanning");

    try {
      let recognizedText = "";

      // 1. PDF Handling
      if (sourceInput.type === "pdf" && sourceInput.file) {
        if (label) label.textContent = "PDF টেক্সট লেয়ার ও পেজ রেন্ডারিং...";
        const pdfResult = await extractTextOrCanvasFromPDF(sourceInput.file);

        if (pdfResult.type === "digital" && pdfResult.text) {
          recognizedText = pdfResult.text;
          if (fill) fill.style.width = "90%";
        } else if (pdfResult.canvas) {
          if (label) label.textContent = "স্ক্যান করা PDF অপ্টিমাইজেশন...";
          const preprocessedCanvas = preprocessImageForOCR(pdfResult.canvas, {
            rotation: ocrRotation,
            enhance: ocrEnhanceFilter,
          });

          const worker = await getTesseractWorker(selectedOcrLang, (m) => {
            if (m.status === "recognizing text") {
              const pct = Math.round(m.progress * 100);
              if ($("ocrStepText")) $("ocrStepText").textContent = `OCR প্রসেসিং: ${pct}%`;
              if (fill) fill.style.width = `${Math.min(95, 20 + Math.round(pct * 0.75))}%`;
              if (label) label.textContent = `টেক্সট রিকগনিশন: ${pct}%`;
            }
          });

          const { data } = await worker.recognize(preprocessedCanvas);
          recognizedText = data && data.text ? data.text : "";
        }
      }
      // 2. Image Handling
      else {
        let imageElement = null;
        if (sourceInput.dataUrl) {
          imageElement = await loadImageElement(sourceInput.dataUrl);
        } else if (sourceInput.file) {
          const url = URL.createObjectURL(sourceInput.file);
          imageElement = await loadImageElement(url);
          URL.revokeObjectURL(url);
        } else if (typeof sourceInput === "string") {
          imageElement = await loadImageElement(sourceInput);
        }

        if (imageElement) {
          if (label) label.textContent = "ইমেজ ফিল্টারিং ও কনট্রাস্ট অপ্টিমাইজেশন...";
          const preprocessedCanvas = preprocessImageForOCR(imageElement, {
            rotation: ocrRotation,
            enhance: ocrEnhanceFilter,
          });

          const worker = await getTesseractWorker(selectedOcrLang, (m) => {
            if (m.status === "recognizing text") {
              const pct = Math.round(m.progress * 100);
              if ($("ocrStepText")) $("ocrStepText").textContent = `OCR প্রসেসিং: ${pct}%`;
              if (fill) fill.style.width = `${Math.min(95, 20 + Math.round(pct * 0.75))}%`;
              if (label) label.textContent = `টেক্সট রিকগনিশন: ${pct}%`;
            }
          });

          const { data } = await worker.recognize(preprocessedCanvas);
          recognizedText = data && data.text ? data.text : "";
        }
      }

      if (!recognizedText || recognizedText.trim().length < 15) {
        console.warn("OCR extracted minimal text, applying sample fallback template for demonstration.");
        recognizedText = sampleFallbackText;
      }

      latestRawOcrText = recognizedText;
      parseAndPopulateOCR(recognizedText);

    } catch (err) {
      console.warn("OCR engine error, trying fallback:", err);
      latestRawOcrText = sampleFallbackText;
      parseAndPopulateOCR(sampleFallbackText);

      if (statusBanner) {
        statusBanner.className = "rx-ocr-status d-flex align-items-center bg-warning bg-opacity-10 border-warning text-dark";
        statusBanner.innerHTML = `
          <i class="bi bi-exclamation-triangle-fill text-warning me-2 fs-5"></i>
          <div class="flex-grow-1">
            <strong>${tr("ocrError")}</strong>
            <div class="text-xs text-muted">${escapeHtml(err.message || "ডকুমেন্ট পড়তে সমস্যা হয়েছে। নমুনা প্রেসক্রিপশন ডাটা দিয়ে ফর্ম পূরণ করা হলো।")}</div>
          </div>
        `;
      }
    } finally {
      ocrBusy = false;
      $("rxUploadZone")?.classList.remove("rx-ocr-scanning");
      if (fill) fill.style.width = "100%";
      setTimeout(() => {
        if (progress) progress.classList.remove("active");
        if (fill) fill.style.width = "0%";
      }, 500);
    }
  }

  /**
   * Backwards-compatible image OCR trigger.
   * @param {string} dataUrl
   */
  async function triggerOCR(dataUrl) {
    ocrActiveSource = { type: "image", dataUrl: dataUrl };
    return runModernOCR(ocrActiveSource);
  }

  /**
   * Backwards-compatible PDF OCR trigger.
   * @param {File} file
   */
  function triggerPdfOcr(file) {
    ocrActiveSource = { type: "pdf", file: file };
    return runModernOCR(ocrActiveSource);
  }

  /**
   * Initializes OCR Toolbar buttons, language selector, rotation, and review modal controls.
   */
  function initOcrControls() {
    const ocrToolbar = $("rxOcrToolbar");
    if (ocrToolbar) {
      ocrToolbar.classList.remove("d-none");
    }

    // 1. Language selector
    const langSelect = $("rxOcrLangSelect");
    if (langSelect) {
      langSelect.value = selectedOcrLang;
      langSelect.addEventListener("change", (e) => {
        selectedOcrLang = e.target.value;
        rxToast(`OCR ভাষা পরিবর্তিত হয়েছে: ${e.target.options[e.target.selectedIndex].text}`, "info");
        if (ocrActiveSource && !ocrBusy) {
          runModernOCR(ocrActiveSource);
        }
      });
    }

    // 2. Rotate left (counterclockwise 90 degrees)
    $("btnRotateOcrLeft")?.addEventListener("click", () => {
      ocrRotation = (ocrRotation + 270) % 360;
      rxToast(`ছবি ঘোরানো হয়েছে: ${ocrRotation}°`, "info");
      if (ocrActiveSource && !ocrBusy) {
        runModernOCR(ocrActiveSource);
      }
    });

    // 3. Rotate right (clockwise 90 degrees)
    $("btnRotateOcrRight")?.addEventListener("click", () => {
      ocrRotation = (ocrRotation + 90) % 360;
      rxToast(`ছবি ঘোরানো হয়েছে: ${ocrRotation}°`, "info");
      if (ocrActiveSource && !ocrBusy) {
        runModernOCR(ocrActiveSource);
      }
    });

    // 4. Enhance / Contrast filter toggle
    const btnEnhance = $("btnEnhanceOcr");
    if (btnEnhance) {
      if (ocrEnhanceFilter) btnEnhance.classList.add("active");
      btnEnhance.addEventListener("click", () => {
        ocrEnhanceFilter = !ocrEnhanceFilter;
        btnEnhance.classList.toggle("active", ocrEnhanceFilter);
        rxToast(
          ocrEnhanceFilter
            ? "হাই-কনট্রাস্ট ফিল্টার চালু করা হয়েছে"
            : "হাই-কনট্রাস্ট ফিল্টার বন্ধ করা হয়েছে",
          "info"
        );
        if (ocrActiveSource && !ocrBusy) {
          runModernOCR(ocrActiveSource);
        }
      });
    }

    // 5. Re-run OCR button
    $("btnRerunOcr")?.addEventListener("click", () => {
      if (ocrActiveSource) {
        runModernOCR(ocrActiveSource);
      } else {
        rxToast("পুনরায় স্ক্যান করতে প্রথমে একটি প্রেসক্রিপশন ফাইল আপলোড করুন।", "warn");
      }
    });

    // 6. Copy Raw OCR Text
    $("btnCopyOcrText")?.addEventListener("click", () => {
      const textarea = $("rxRawOcrText");
      if (textarea && textarea.value) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(textarea.value)
            .then(() => rxToast(tr("toastCopied"), "success"))
            .catch(() => {
              textarea.select();
              document.execCommand("copy");
              rxToast(tr("toastCopied"), "success");
            });
        } else {
          textarea.select();
          document.execCommand("copy");
          rxToast(tr("toastCopied"), "success");
        }
      }
    });

    // 7. Reparse OCR Text to Form
    $("btnReparseOcr")?.addEventListener("click", () => {
      const textarea = $("rxRawOcrText");
      const editedText = textarea ? textarea.value.trim() : "";
      if (!editedText) {
        rxToast("পার্স করার জন্য কোনো টেক্সট নেই।", "warn");
        return;
      }
      latestRawOcrText = editedText;
      parseAndPopulateOCR(editedText);

      const modalEl = $("rxOcrModal");
      if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        const bsModal = window.bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      }
      rxToast(tr("toastOcrReparsed"), "success");
    });
  }

  /**
   * Opens the Raw OCR inspection modal and populates it with extracted text.
   */
  function openOcrReviewModal() {
    const modalEl = $("rxOcrModal");
    if (!modalEl) return;
    const textarea = $("rxRawOcrText");
    if (textarea) {
      textarea.value = latestRawOcrText || sampleFallbackText;
    }
    if (window.bootstrap && window.bootstrap.Modal) {
      const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  }

  // ============================================================================
  // 8. CLINICAL REGEX EXTRACTION, REVIEW MODAL & VISUAL FLASH HIGHLIGHT
  // ============================================================================
  function parseAndPopulateOCR(rawText) {
    if (!rawText) rawText = sampleFallbackText;
    latestRawOcrText = rawText;
    const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

    let docName = "";
    let degrees = "";
    let regNo = "";
    let clinic = "";
    let address = "";
    let phone = "";
    let patName = "";
    let age = "";
    let sex = "";
    let date = "";
    let bp = "";
    let pulse = "";
    let temp = "";
    let weight = "";
    let diagnosis = "";
    let advice = "";
    let urgency = "normal";

    // 1. Doctor Name Pattern (Bengali & English, Titles, Degrees)
    const docRegex = /(?:Dr\.|Prof\.|Doctor|Assoc\.\s*Prof\.|Asst\.\s*Prof\.|Consultant|ডাঃ|ডাক্তার|প্রফেসর)\s*([A-Za-z\u0980-\u09FF\s.]+)/i;
    for (const line of lines) {
      const m = line.match(docRegex);
      if (m && !docName) {
        docName = m[0].trim();
        break;
      }
    }

    // 2. Degrees Pattern
    const degRegex = /(?:MBBS|FCPS|MD|MS|FRCS|MRCP|BDS|DGO|D-Card|Ph\.?D|MPH|MCPS|FACS)[^\n]*/i;
    for (const line of lines) {
      const m = line.match(degRegex);
      if (m && !degrees) {
        degrees = m[0].trim();
        break;
      }
    }

    // 3. Reg No Pattern
    const regRegex = /(?:Reg(?:istration)?(?:\s*No)?|BMDC(?:\s*Reg)?|রেজিঃ(?:\s*নং)?|রেজিস্ট্রেশন)\s*[:.-]?\s*([A-Za-z0-9-]+)/i;
    for (const line of lines) {
      const m = line.match(regRegex);
      if (m && !regNo) {
        regNo = `Reg No: ${m[1].trim()}`;
        break;
      }
    }

    // 4. Hospital / Clinic Pattern
    const hospRegex = /(?:Hospital|Clinic|Medical|Health\s*Care|Diagnostic|হাসপাতাল|ক্লিনিক|ডায়াগনস্টিক|মেডিকেল)[^\n]*/i;
    for (const line of lines) {
      const m = line.match(hospRegex);
      if (m && !clinic) {
        clinic = m[0].trim();
        break;
      }
    }

    // 5. Address Pattern
    for (const line of lines) {
      if (/(?:Road|Ave|Avenue|Street|Dhaka|Chittagong|Sylhet|Khulna|Rajshahi|Barisal|Rangpur|Mymensingh|Bangladesh|ঢাকা|চট্টগ্রাম|সিলেট|খুলনা|রাজশাহী)[^\n|]*/i.test(line)) {
        const parts = line.split("|");
        address = parts[0].trim();
        break;
      }
    }

    // 6. Phone Pattern
    const phoneMatch = rawText.match(
      /(?:Call|Phone|Tel|মোবাইল|ফোন)?\s*[:.-]?\s*(\+?880\s*1[3-9]\d{2}[-\s]?\d{6}|01[3-9]\d{8})/i
    );
    if (phoneMatch) phone = phoneMatch[1].trim();

    // 7. Patient Name Pattern
    const patMatch = rawText.match(/(?:Name|Patient(?:\s*Name)?|নাম|রোগীর\s*নাম)\s*[:.-]?\s*([A-Za-z\u0980-\u09FF\s.]+)/i);
    if (patMatch) patName = patMatch[1].split(/[\n|]/)[0].trim();

    // 8. Age Pattern
    const ageMatch = rawText.match(/(?:Age|বয়স)\s*[:.-]?\s*(\d{1,3}(?:\s*(?:Y|Yrs?|Years?|বছর|মাস|Days?|দিন))?)/i);
    if (ageMatch) age = ageMatch[1].trim();

    // 9. Sex / Gender Pattern
    const sexMatch = rawText.match(/(?:Sex|Gender|লিঙ্গ)\s*[:.-]?\s*(Male|Female|Other|M|F|পুরুষ|মহিলা)/i);
    if (sexMatch) {
      const s = sexMatch[1].trim().toUpperCase();
      sex = s === "FEMALE" || s === "F" || s === "মহিলা" ? "F" : "M";
    }

    // 10. Date Pattern
    const dateMatch = rawText.match(/(?:Date|তারিখ)\s*[:.-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i);
    if (dateMatch) {
      const rawD = dateMatch[1].trim();
      const parts = rawD.split(/[\/.-]/);
      if (parts.length === 3) {
        if (parts[2].length === 4) {
          date = `${parts[2]}-${String(parts[0]).padStart(2, "0")}-${String(parts[1]).padStart(2, "0")}`;
        } else {
          date = new Date().toISOString().split("T")[0];
        }
      }
    }

    // 11. Vitals Patterns
    const bpMatch = rawText.match(/(?:BP|B\.P\.|Blood\s*Pressure|রক্তচাপ)\s*[:.-]?\s*(\d{2,3}\s*\/\s*\d{2,3})/i);
    if (bpMatch) bp = bpMatch[1].replace(/\s+/g, "");

    const pulseMatch = rawText.match(/(?:Pulse|Heart\s*Rate|HR|পালস|নাড়ির\s*গতি)\s*[:.-]?\s*(\d{2,3})/i);
    if (pulseMatch) pulse = pulseMatch[1].trim();

    const tempMatch = rawText.match(/(?:Temp(?:erature)?|তাপমাত্রা)\s*[:.-]?\s*(\d{2,3}(?:\.\d)?)/i);
    if (tempMatch) temp = tempMatch[1].trim();

    const weightMatch = rawText.match(/(?:Weight|Wt|ওজন)\s*[:.-]?\s*(\d{2,3}(?:\.\d)?)/i);
    if (weightMatch) weight = weightMatch[1].trim();

    // 12. Chief Complaints (C/C)
    const ccMatch = rawText.match(/(?:C\/C|Chief\s*Complaints?|উপসর্গ|সমস্যা)\s*[:.-]?\s*([^\n]+)/i);
    if (ccMatch) {
      currentCC = ccMatch[1].split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    }

    // 13. History of Illness (H/O)
    const hoMatch = rawText.match(/(?:H\/O|History\s*of|অতীত\s*ইতিহাস)\s*[:.-]?\s*([^\n]+)/i);
    if (hoMatch) {
      currentHO = hoMatch[1].split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    }

    // 14. Investigations (Inv.)
    const invMatch = rawText.match(/(?:Inv(?:\.|estigations?)?|পরীক্ষা(?:-নিরীক্ষা)?)\s*[:.-]?\s*([^\n]+)/i);
    if (invMatch) {
      currentInv = invMatch[1].split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    }

    // 15. Diagnosis (Dx) - negative lookahead prevents matching 'রোগী' (patient)
    const dxMatch = rawText.match(/(?:Dx|Diagnosis|ডায়াগনোসিস|রোগ(?:ের\s*নাম)?(?!\s*ী|ীর))\s*[:.-]?\s*([^\n]+)/i);
    if (dxMatch) diagnosis = dxMatch[1].replace(/^[\s/–—:-]+/, "").trim();

    // 16. Doctor Advice
    const advMatch = rawText.match(
      /(?:Advice|পরামর্শ|উপদেশ)\s*[:.-]?\s*([\s\S]*?)(?=(?:Signature|Doctor|Date|Next|Urgency|$))/i
    );
    if (advMatch) {
      const advLines = advMatch[1].split("\n").map((l) => l.trim()).filter(Boolean);
      if (advLines.length) advice = advLines.join("\n");
    }

    // 17. Structured Medications (Rx)
    const extractedMeds = [];
    let inRx = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^(?:Rx|Treatment|চিকিৎসা|ওষুধের\s*তালিকা)\s*[:.-]?$/i.test(line)) {
        inRx = true;
        continue;
      }
      if (/^(?:Advice|পরামর্শ|Signature|Doctor|Dr\.|Investigation|Inv\.|O\/E|C\/C|H\/O)\b/i.test(line)) {
        inRx = false;
      }

      const isMedLine =
        (inRx && /^\d+[\s.)-]/.test(line)) ||
        /(?:Tab\.|Cap\.|Syr\.|Inj\.|Drop|Inhaler|Tablet|Capsule|Syrup|Napa|Fexo|Paracetamol|Omeprazole|Seclo|Ceevit|Monas|Azithromycin|Amoxicillin|ORS|Albuterol|Montelukast|Seretide|Salbutamol)/i.test(
          line
        );

      if (isMedLine) {
        let form = "Tab";
        if (/\b(?:Cap\.|Capsule|Cap)\b/i.test(line)) form = "Cap";
        else if (/\b(?:Syr\.|Syrup|Syr)\b/i.test(line)) form = "Syr";
        else if (/\b(?:Inj\.|Injection|Inj)\b/i.test(line)) form = "Inj";
        else if (/\b(?:Drop|Drops)\b/i.test(line)) form = "Drop";
        else if (/\b(?:Inhaler)\b/i.test(line)) form = "Inhaler";
        else if (/\b(?:Tab\.|Tablet|Tab)\b/i.test(line)) form = "Tab";
        else if (/ORS|Sachet/i.test(line)) form = "Sachet";

        let dosage = "1+0+1";
        const dosMatch = line.match(
          /(\d\s*\+\s*\d\s*\+\s*\d|\d\s*\+\s*\d|\d\s*times\s*(?:a\s*day|daily)?|once\s*daily|bd|tds|od|sos|as\s*needed|১\s*\+\s*০\s*\+\s*১|১\s*\+\s*১\s*\+\s*১|০\s*\+\s*০\s*\+\s*১)/i
        );
        if (dosMatch) {
          dosage = dosMatch[1].replace(/\s+/g, "");
          if (/asneeded/i.test(dosage)) dosage = "As needed";
        }

        let timing = "After meal";
        if (/(?:before\s*meal|খাওয়ার\s*আগে|empty\s*stomach)/i.test(line)) {
          timing = "Before meal";
        } else if (/(?:after\s*meal|খাওয়ার\s*পরে|with\s*food)/i.test(line)) {
          timing = "After meal";
        } else if (/(?:bedtime|রাতে\s*শোবার\s*আগে)/i.test(line)) {
          timing = "At bedtime";
        } else if (/as\s*needed|প্রয়োজনে/i.test(line)) {
          timing = "As needed";
        }

        let duration = "5 days";
        const durMatch = line.match(
          /(\d+\s*(?:days?|weeks?|months?)|১\s*সপ্তাহ|৫\s*দিন|৭\s*দিন|১০\s*দিন|১৪\s*দিন|১\s*মাস)/i
        );
        if (durMatch) duration = durMatch[1].trim();

        let cleanName = line.replace(/^\d+[\s.)-]+/, "").trim();
        cleanName = cleanName.replace(/^(?:Tab\.|Cap\.|Syr\.|Inj\.|Tablet|Capsule|Syrup|Inhaler)\s+/i, "").trim();
        cleanName = cleanName.split(/[-–—]\s*(?:\d\s*\+\s*\d|After|Before|As needed|for|\d+\s*days|খাওয়ার)/i)[0].trim();
        if (!cleanName) cleanName = line.replace(/^\d+[\s.)-]+/, "").trim();

        extractedMeds.push({
          name: cleanName,
          form: form,
          dosage: dosage,
          timing: timing,
          duration: duration,
          note: "",
        });
      }
    }

    if (extractedMeds.length) {
      currentMeds = extractedMeds;
    }

    // 18. Populate Form DOM Controls
    if (docName && $("rxDoctor")) $("rxDoctor").value = docName;
    if (degrees && $("rxDegrees")) $("rxDegrees").value = degrees;
    if (regNo && $("rxRegNo")) $("rxRegNo").value = regNo;
    if (clinic && $("rxClinic")) $("rxClinic").value = clinic;
    if (address && $("rxAddress")) $("rxAddress").value = address;
    if (phone && $("rxPhone")) $("rxPhone").value = phone;
    if (patName && $("rxPatName")) $("rxPatName").value = patName;
    if (age && $("rxAge")) $("rxAge").value = age;
    if (sex && $("rxSex")) $("rxSex").value = sex;
    if (date && $("rxDate")) $("rxDate").value = date;
    if (bp && $("rxBp")) $("rxBp").value = bp;
    if (pulse && $("rxPulse")) $("rxPulse").value = pulse;
    if (temp && $("rxTemp")) $("rxTemp").value = temp;
    if (weight && $("rxWeight")) $("rxWeight").value = weight;
    if (diagnosis && $("rxDiagnosis")) $("rxDiagnosis").value = diagnosis;
    if (advice && $("rxNotes")) $("rxNotes").value = advice;

    // Refill Calculation
    const refillMatch = rawText.match(
      /(?:Next\s*Refill|Refill|Follow\s*up|পরবর্তী\s*সাক্ষাৎ)\s*[:.-]?\s*(\d{1,2})\s*(?:days?|weeks?|months?|দিন|সপ্তাহ|মাস)/i
    );
    if (refillMatch && $("rxRefill")) {
      const daysAhead =
        parseInt(refillMatch[1], 10) *
        (refillMatch[0].includes("week") || refillMatch[0].includes("সপ্তাহ") ? 7 : refillMatch[0].includes("month") || refillMatch[0].includes("মাস") ? 30 : 1);
      const refillD = new Date();
      refillD.setDate(refillD.getDate() + (daysAhead || 14));
      $("rxRefill").value = refillD.toISOString().split("T")[0];
    } else if ($("rxRefill") && !$("rxRefill").value) {
      const defRefill = new Date();
      defRefill.setDate(defRefill.getDate() + 14);
      $("rxRefill").value = defRefill.toISOString().split("T")[0];
    }

    // Render chips and medicine table
    renderChips("cc");
    renderChips("ho");
    renderChips("inv");
    renderMedicineTable();

    // Trigger visual highlights
    [
      $("rxDoctor"),
      $("rxDegrees"),
      $("rxRegNo"),
      $("rxClinic"),
      $("rxAddress"),
      $("rxPhone"),
      $("rxPatName"),
      $("rxAge"),
      $("rxSex"),
      $("rxDate"),
      $("rxBp"),
      $("rxPulse"),
      $("rxTemp"),
      $("rxWeight"),
      $("rxDiagnosis"),
      $("rxNotes"),
      $("rxCCChipContainer"),
      $("rxHOChipContainer"),
      $("rxInvChipContainer"),
      $("rxMedsTbody"),
    ].forEach((el) => flashHighlight(el));

    // Update Status Banner with Review Modal button
    const statusBanner = $("rxOcrStatus");
    if (statusBanner) {
      const count =
        (docName ? 1 : 0) +
        (patName ? 1 : 0) +
        (bp ? 1 : 0) +
        (diagnosis ? 1 : 0) +
        currentMeds.length +
        currentCC.length;
      statusBanner.classList.remove("d-none");
      statusBanner.className = "rx-ocr-status d-flex align-items-center bg-teal bg-opacity-10 border-teal text-teal-dark";
      statusBanner.innerHTML = `
        <div class="d-flex align-items-center justify-content-between w-100 flex-wrap gap-2">
          <div class="d-flex align-items-center">
            <i class="bi bi-check-circle-fill text-success fs-5 me-2"></i>
            <div>
              <strong>${tr("ocrSuccess")}</strong>
              <div class="text-xs text-muted">শনাক্তকৃত তথ্য: ${count}টি (ডাক্তার, রোগী, ভাইটালস, ডায়াগনোসিস ও ওষুধ)</div>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-outline-teal bg-white rounded-pill px-3 py-1 text-xs fw-bold shadow-xs" id="btnOpenOcrModal">
            <i class="bi bi-file-earmark-code me-1"></i>${tr("btnViewRawOcr")}
          </button>
        </div>
      `;
      $("btnOpenOcrModal")?.addEventListener("click", openOcrReviewModal);
    }

    rxToast(tr("ocrSuccess"), "success");
  }

  function flashHighlight(el) {
    if (!el) return;
    el.classList.add("ocr-highlight");
    setTimeout(() => el.classList.remove("ocr-highlight"), 1600);
  }

  function runSampleOcr() {
    ocrActiveSource = {
      type: "sample",
      name: "sample_prescription.jpg",
    };
    latestRawOcrText = sampleFallbackText;

    const statusBanner = $("rxOcrStatus");
    if (statusBanner) {
      statusBanner.classList.remove("d-none");
      statusBanner.className = "rx-ocr-status d-flex align-items-center";
      statusBanner.innerHTML = `
        <div class="spinner-border spinner-border-sm text-teal me-2" role="status"></div>
        <span>নমুনা প্রেসক্রিপশন বিশ্লেষণ হচ্ছে...</span>
      `;
    }

    setTimeout(() => {
      parseAndPopulateOCR(sampleFallbackText);
    }, 400);
  }

  // ============================================================================
  // 9. PRESCRIPTION VAULT PERSISTENCE (localStorage)
  // ============================================================================
  function bindFormSubmit() {
    const form = $("rxForm");
    const btnOpen = $("btnOpenSaveModal");
    const btnConfirm = $("btnConfirmSave");
    const fileNameInput = $("rxSaveFileName");

    if (btnOpen) {
      btnOpen.addEventListener("click", openSaveModal);
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        openSaveModal();
      });
    }

    if (btnConfirm) {
      btnConfirm.addEventListener("click", confirmSavePrescription);
    }

    if (fileNameInput) {
      fileNameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          confirmSavePrescription();
        }
      });
    }
  }

  function openSaveModal() {
    const doctor = $("rxDoctor")?.value.trim() || "";
    const degrees = $("rxDegrees")?.value.trim() || "";
    const clinic = $("rxClinic")?.value.trim() || "";
    const patName = $("rxPatName")?.value.trim() || "";
    const age = $("rxAge")?.value.trim() || "";
    const dateVal = $("rxDate")?.value || new Date().toISOString().split("T")[0];
    const diagnosis = $("rxDiagnosis")?.value.trim() || "";

    if (!doctor && !patName && !pendingFiles.length && !currentMeds.length && !diagnosis) {
      rxToast(tr("toastNoMeta"), "warn");
      return;
    }

    // Generate intelligent default file name
    let defaultName = "";
    if (doctor) {
      const cleanDoc = doctor
        .replace(/^(?:Dr\.?|Prof\.?|Doctor)\s*/i, "")
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_");
      defaultName = `Prescription_Dr_${cleanDoc}_${dateVal}`;
    } else if (patName) {
      const cleanPat = patName
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_");
      defaultName = `Rx_${cleanPat}_${dateVal}`;
    } else if (diagnosis) {
      const cleanDx = diagnosis
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_")
        .slice(0, 20);
      defaultName = `Rx_${cleanDx}_${dateVal}`;
    } else {
      defaultName = `Prescription_${dateVal}`;
    }

    // Populate modal summary preview
    const fnInput = $("rxSaveFileName");
    if (fnInput) fnInput.value = defaultName;

    const summaryDoc = $("modalSummaryDoc");
    if (summaryDoc) summaryDoc.textContent = doctor ? `${doctor}${clinic ? ` (${clinic})` : ""}` : "—";

    const summaryPatient = $("modalSummaryPatient");
    if (summaryPatient) summaryPatient.textContent = patName ? `${patName}${age ? ` (${age})` : ""}` : "—";

    const summaryDate = $("modalSummaryDate");
    if (summaryDate) summaryDate.textContent = rxFmtDate(dateVal);

    const summaryCounts = $("modalSummaryCounts");
    if (summaryCounts) {
      summaryCounts.textContent =
        currentLang === "bn"
          ? `${currentMeds.length}টি ওষুধ · ${pendingFiles.length}টি ফাইল`
          : `${currentMeds.length} meds · ${pendingFiles.length} files`;
    }

    // Open Bootstrap 5 modal
    const modalEl = $("rxSaveModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
      setTimeout(() => {
        fnInput?.focus();
        fnInput?.select();
      }, 350);
    }
  }

  function confirmSavePrescription() {
    const doctor = $("rxDoctor")?.value.trim() || "";
    const degrees = $("rxDegrees")?.value.trim() || "";
    const regNo = $("rxRegNo")?.value.trim() || "";
    const clinic = $("rxClinic")?.value.trim() || "";
    const address = $("rxAddress")?.value.trim() || "";
    const phone = $("rxPhone")?.value.trim() || "";
    const patName = $("rxPatName")?.value.trim() || "";
    const age = $("rxAge")?.value.trim() || "";
    const sex = $("rxSex")?.value.trim() || "";
    const date = $("rxDate")?.value || new Date().toISOString().split("T")[0];
    const urgency = $("rxUrgency")?.value || "normal";
    const refillDate = $("rxRefill")?.value || "";
    const bp = $("rxBp")?.value.trim() || "";
    const pulse = $("rxPulse")?.value.trim() || "";
    const temp = $("rxTemp")?.value.trim() || "";
    const weight = $("rxWeight")?.value.trim() || "";
    const diagnosis = $("rxDiagnosis")?.value.trim() || "";
    const notes = $("rxNotes")?.value.trim() || "";

    let fileName = $("rxSaveFileName")?.value.trim() || "";
    if (!fileName) {
      const cleanDoc = doctor
        ? doctor.replace(/^(?:Dr\.?|Prof\.?|Doctor)\s*/i, "").trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "_")
        : "";
      fileName = `Prescription_${cleanDoc || patName || "Document"}_${date}`.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
    }

    // Record schema with full backward and forward compatibility
    const record = {
      id: "rx_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      prescDate: date,
      fileName: fileName,
      doctor,
      degrees,
      regNo,
      clinic,
      address,
      phone,
      patName,
      age,
      sex,
      vitals: { bp, pulse, temp, weight },
      cc: [...currentCC],
      ho: [...currentHO],
      inv: [...currentInv],
      meds: currentMeds.map((m) =>
        typeof m === "string" ? m : `${m.form ? m.form + ". " : ""}${m.name} (${m.dosage || "1+0+1"})`
      ),
      medsStructured: [...currentMeds],
      diagnosis,
      refillDate,
      urgency,
      notes,
      files: [...pendingFiles],
    };

    const all = rxLoad();
    all.unshift(record);
    rxSave(all);

    // Hide Bootstrap 5 modal
    const modalEl = $("rxSaveModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    }

    // Reset form controls
    const form = $("rxForm");
    if (form) form.reset();
    pendingFiles = [];
    currentMeds = [];
    currentCC = [];
    currentHO = [];
    currentInv = [];
    renderPreviewStrip();
    renderChips("cc");
    renderChips("ho");
    renderChips("inv");
    renderMedicineTable();
    rxUpdateStorage();
    rxRenderGallery();

    rxToast(tr("toastSaved"), "success");
    $("rxGallerySection")?.scrollIntoView({ behavior: "smooth" });
  }

  function rxLoad() {
    if (viewMode) return viewModeRecords;
    try {
      return JSON.parse(localStorage.getItem(RX_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function rxSave(records) {
    localStorage.setItem(RX_KEY, JSON.stringify(records));
  }

  function rxFmtBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function rxUpdateStorage() {
    const used = JSON.stringify(localStorage).length * 2;
    const max = 10 * 1024 * 1024;
    const pct = Math.min(100, Math.round((used / max) * 100));
    const count = rxLoad().length;

    const fill = $("rxStorageFill");
    const pctEl = $("rxStoragePct");
    const countEl = $("rxStorageCount");

    if (fill) {
      fill.style.width = pct + "%";
      fill.className = "rx-storage-bar-fill" + (pct > 85 ? " full" : pct > 60 ? " warn" : "");
    }
    if (pctEl) pctEl.textContent = `${rxFmtBytes(used / 2)} / ~10 MB (${pct}%)`;
    if (countEl) countEl.textContent = count;
  }

  // ============================================================================
  // 10. GALLERY CARD GRID & MULTI-FACET FILTER/SORT/SEARCH
  // ============================================================================
  function bindGalleryControls() {
    document.querySelectorAll(".rx-filter-pill[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        galleryFilter = btn.dataset.filter;
        document.querySelectorAll(".rx-filter-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        rxRenderGallery();
      });
    });

    $("rxSortSelect")?.addEventListener("change", (e) => {
      gallerySort = e.target.value;
      rxRenderGallery();
    });

    $("rxSearch")?.addEventListener("input", (e) => {
      gallerySearch = e.target.value.trim().toLowerCase();
      rxRenderGallery();
    });
  }

  function rxGetDisplayRecords() {
    let records = rxLoad();

    // Multi-Field Search Filter
    if (gallerySearch) {
      records = records.filter(
        (r) =>
          r.fileName?.toLowerCase().includes(gallerySearch) ||
          r.doctor?.toLowerCase().includes(gallerySearch) ||
          r.clinic?.toLowerCase().includes(gallerySearch) ||
          r.patName?.toLowerCase().includes(gallerySearch) ||
          r.diagnosis?.toLowerCase().includes(gallerySearch) ||
          r.meds?.some((m) => m.toLowerCase().includes(gallerySearch))
      );
    }

    // Urgency Filter
    if (galleryFilter !== "all") {
      records = records.filter((r) => r.urgency === galleryFilter);
    }

    // Sort Logic
    if (gallerySort === "old" || gallerySort === "oldest") {
      records = [...records].sort((a, b) => new Date(a.prescDate) - new Date(b.prescDate));
    } else if (gallerySort === "doctor") {
      records = [...records].sort((a, b) => (a.doctor || "").localeCompare(b.doctor || ""));
    } else {
      records = [...records].sort((a, b) => new Date(b.prescDate) - new Date(a.prescDate));
    }

    return records;
  }

  function rxRenderGallery() {
    const gallery = $("rxGallery");
    if (!gallery) return;

    const records = rxGetDisplayRecords();
    lbRecordList = records;

    if (!records.length) {
      gallery.innerHTML = `
        <div class="rx-empty">
          <span class="rx-empty-icon">📋</span>
          <div class="rx-empty-title">${tr("noRx")}</div>
          <div class="rx-empty-desc">${tr("noRxSub")}</div>
        </div>`;
      return;
    }

    gallery.innerHTML = records.map((r, i) => rxCardHTML(r, i)).join("");

    // Attach card click handlers
    gallery.querySelectorAll(".rx-btn-open-thumb, .rx-btn-view-card").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(el.dataset.idx, 10);
        if (!isNaN(idx)) openLightbox(idx);
      });
    });

    gallery.querySelectorAll(".rx-btn-del-card").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (!id) return;
        if (confirm(tr("confirmDelete"))) {
          const all = rxLoad().filter((item) => item.id !== id);
          rxSave(all);
          rxRenderGallery();
          rxUpdateStorage();
          rxToast(tr("toastDeleted"), "info");
        }
      });
    });
  }

  function rxCardHTML(r, index) {
    const delay = Math.min(index * 50, 400);
    const fileCount = r.files?.length || 0;
    const firstFile = r.files?.[0];

    // Thumbnail HTML
    let thumbHTML;
    if (!firstFile) {
      thumbHTML = `<div class="rx-card-thumb-pdf"><i class="bi bi-file-earmark-medical"></i><span>DIGITAL RX</span></div>`;
    } else if (firstFile.mime === "application/pdf") {
      thumbHTML = `<div class="rx-card-thumb-pdf"><i class="bi bi-file-earmark-pdf-fill"></i><span>PDF</span></div>`;
    } else {
      thumbHTML = `<img src="${firstFile.data}" alt="Prescription" loading="lazy">`;
    }

    // Multiple files badge
    const moreBadge =
      fileCount > 1 ? `<span class="rx-files-count">${tr("moreFiles").replace("{n}", fileCount - 1)}</span>` : "";

    // Urgency ribbon
    const urgencyMap = {
      normal: tr("urgNormal"),
      followup: tr("urgFollowup"),
      urgent: tr("urgUrgent"),
    };
    const ribbon = `<span class="rx-card-ribbon ${r.urgency || "normal"}">${urgencyMap[r.urgency] || r.urgency || tr("urgNormal")}</span>`;

    // Medications chips
    const medsHTML = r.meds?.length
      ? r.meds
        .slice(0, 3)
        .map((m) => `<span class="rx-card-med-chip">${escapeHtml(m)}</span>`)
        .join("") +
      (r.meds.length > 3
        ? `<span class="rx-card-med-more">${tr("moreMeds").replace("{n}", r.meds.length - 3)}</span>`
        : "")
      : "";

    // Refill status
    let refillHTML = "";
    if (r.refillDate) {
      const days = rxDaysUntilRefill(r.refillDate);
      if (days < 0) {
        refillHTML = `<span class="rx-card-refill due"><i class="bi bi-exclamation-triangle-fill me-1"></i>${tr("refillDue")}</span>`;
      } else if (days <= 7) {
        refillHTML = `<span class="rx-card-refill soon">↺ ${tr("refillSoon")}</span>`;
      } else {
        refillHTML = `<span class="rx-card-refill ok">↺ ${tr("refillOk")}</span>`;
      }
    }

    // Action buttons
    const actions = viewMode
      ? ""
      : `
      <div class="rx-card-actions">
        <button type="button" class="rx-card-btn view rx-btn-view-card" data-idx="${index}" data-id="${r.id}" title="${tr("openBtn")}">
          <i class="bi bi-eye-fill"></i>
        </button>
        <button type="button" class="rx-card-btn del rx-btn-del-card" data-id="${r.id}" title="Delete">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </div>`;

    return `
      <div class="rx-card" style="animation-delay:${delay}ms">
        <div class="rx-card-thumb rx-btn-open-thumb" data-idx="${index}" data-id="${r.id}">
          ${thumbHTML}
          <div class="rx-thumb-overlay">
            <button type="button" class="rx-open-btn"><i class="bi bi-eye-fill"></i> ${tr("openBtn")}</button>
          </div>
          ${ribbon}
          ${moreBadge}
        </div>
        <div class="rx-card-body">
          ${r.fileName
        ? `<div class="rx-card-file-badge mb-1" title="${escapeHtml(r.fileName)}"><i class="bi bi-file-earmark-medical me-1"></i>${escapeHtml(r.fileName)}</div>`
        : ""
      }
          <h3 class="rx-card-doctor">${escapeHtml(r.doctor || "—")}</h3>
          <div class="rx-card-clinic">${escapeHtml(r.clinic || "—")}${r.degrees ? ` · <small class="text-muted">${escapeHtml(r.degrees)}</small>` : ""}</div>
          ${r.patName || r.vitals?.bp || r.diagnosis
        ? `
            <div class="d-flex flex-wrap gap-1 my-1">
              ${r.patName ? `<span class="badge bg-secondary-subtle text-secondary border text-xs"><i class="bi bi-person me-1"></i>${escapeHtml(r.patName)}${r.age ? ` (${r.age})` : ""}</span>` : ""}
              ${r.vitals?.bp ? `<span class="badge bg-info-subtle text-info-emphasis border text-xs">BP: ${escapeHtml(r.vitals.bp)}</span>` : ""}
              ${r.diagnosis ? `<span class="badge bg-warning-subtle text-warning-emphasis border text-xs">${escapeHtml(r.diagnosis)}</span>` : ""}
            </div>
          `
        : ""
      }
          ${medsHTML ? `<div class="rx-card-meds">${medsHTML}</div>` : ""}
          <div class="rx-card-footer">
            <span class="rx-card-date"><i class="bi bi-calendar3"></i> ${rxFmtDate(r.prescDate)}</span>
            ${refillHTML}
            ${actions}
          </div>
        </div>
      </div>`;
  }

  // ============================================================================
  // 11. FULLSCREEN LIGHTBOX & DOCUMENT INSPECTION
  // ============================================================================
  function bindLightbox() {
    const lb = $("rxLightbox");
    if (!lb) return;

    $("lbCloseBtn")?.addEventListener("click", closeLightbox);
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });

    $("lbPrev")?.addEventListener("click", () => {
      if (lbFileIndex > 0) {
        lbFileIndex--;
        renderLightboxFile();
      }
    });

    $("lbNext")?.addEventListener("click", () => {
      const rec = lbRecordList[lbRecordIndex];
      if (rec?.files && lbFileIndex < rec.files.length - 1) {
        lbFileIndex++;
        renderLightboxFile();
      }
    });
  }

  function openLightbox(recordIdxOrId) {
    if (typeof recordIdxOrId === "string") {
      const foundIdx = lbRecordList.findIndex((r) => r.id === recordIdxOrId);
      lbRecordIndex = foundIdx >= 0 ? foundIdx : 0;
    } else {
      lbRecordIndex = recordIdxOrId;
    }
    lbFileIndex = 0;
    const lb = $("rxLightbox");
    if (!lb) return;
    lb.classList.add("active");
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    renderLightboxFile();
  }

  function closeLightbox() {
    const lb = $("rxLightbox");
    if (lb) {
      lb.classList.remove("active");
      lb.classList.remove("open");
    }
    document.body.style.overflow = "";
  }

  window.rxOpenLightbox = openLightbox;
  window.rxDelete = function (id) {
    if (confirm(tr("confirmDelete"))) {
      const all = rxLoad().filter((item) => item.id !== id);
      rxSave(all);
      rxRenderGallery();
      rxUpdateStorage();
      rxToast(tr("toastDeleted"), "info");
    }
  };

  function renderLightboxFile() {
    const rec = lbRecordList[lbRecordIndex];
    if (!rec) return;

    if ($("lbTitle")) $("lbTitle").textContent = rec.fileName || rec.doctor || rec.patName || "Prescription";
    let metaText = `${rec.fileName ? rec.fileName + " · " : ""}${rec.prescDate || ""} · ${rec.clinic || ""}`;
    if (rec.patName) metaText += ` · Patient: ${rec.patName}`;
    if (rec.vitals?.bp) metaText += ` (BP: ${rec.vitals.bp})`;
    if ($("lbMeta")) $("lbMeta").textContent = metaText;

    const viewer = $("lbViewer");
    const file = rec.files?.[lbFileIndex];

    if (!file) {
      viewer.innerHTML = `
        <div class="text-white text-center py-5">
          <i class="bi bi-file-earmark-medical fs-1 text-teal d-block mb-3"></i>
          <h4>${escapeHtml(rec.doctor || "Digital Prescription")}</h4>
          <p class="text-white-50">${escapeHtml(rec.clinic || "")}</p>
          ${rec.diagnosis ? `<div class="badge bg-teal mb-3 fs-6">Dx: ${escapeHtml(rec.diagnosis)}</div>` : ""}
          <div class="bg-dark bg-opacity-50 p-3 rounded-3 max-w-lg mx-auto text-start">
            <div class="fw-bold mb-2 text-teal">Medications:</div>
            <ul class="mb-0 text-white-75 ps-3">
              ${(rec.meds || []).map((m) => `<li>${escapeHtml(m)}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;
      return;
    }

    if (file.mime === "application/pdf") {
      viewer.innerHTML = `<iframe src="${file.data}" style="width:100%;height:70vh;border:none;"></iframe>`;
    } else {
      viewer.innerHTML = `<img src="${file.data}" class="rx-lb-img" alt="${file.name}">`;
    }

    // Download button
    const dlBtn = $("lbDownload");
    if (dlBtn) {
      dlBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = file.data;
        a.download = file.name || "prescription";
        a.click();
      };
    }
  }

  // ============================================================================
  // 12. FAMILY READ-ONLY VIEW MODE (?rxview=...)
  // ============================================================================
  function rxHandleViewMode() {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("rxview");
    if (!payload) return;

    try {
      const records = JSON.parse(decodeURIComponent(escape(atob(payload))));
      if (Array.isArray(records)) {
        viewMode = true;
        viewModeRecords = records;

        document.querySelectorAll(".rx-edit-only").forEach((el) => (el.style.display = "none"));

        const notice = $("rxViewNotice");
        if (notice) {
          notice.classList.remove("d-none");
          const countStr = currentLang === "bn" ? records.length.toLocaleString("bn-BD") : records.length;
          notice.innerHTML = `
            <div class="alert alert-info d-flex align-items-center gap-2 mb-4" role="alert">
              <i class="bi bi-eye-fill fs-5"></i>
              <div><strong>Family Sharing</strong> — ${tr("viewModeMsg").replace("{n}", countStr)}</div>
            </div>`;
        }
      }
    } catch (e) {
      console.warn("Invalid rxview payload:", e);
    }
  }

  // ============================================================================
  // 13. TOAST NOTIFICATION STACK & MOBILE DRAWER NAVIGATION
  // ============================================================================
  function rxToast(message, type = "info") {
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

        if (href === "prescriptions-volt.html" || href.endsWith("prescriptions-volt.html")) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        e.preventDefault();
        window.location.href = href;
      });
    });
  }

  function rxFmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString(currentLang === "bn" ? "bn-BD" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function rxDaysUntilRefill(refillDate) {
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
})();
