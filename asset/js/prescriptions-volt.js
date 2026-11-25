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
  let lastScanMeta = { source: "", confidence: null, lang: "", rotated: 0 };

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
      navExercises: "শ্বাস ব্যায়াম",
      navExercisesSub: "শ্বাস-প্রশ্বাসের ব্যায়াম ও BOLT টেস্ট",
      navTest: "শ্বাসের পরীক্ষা",
      navTestSub: "BOLT ও শ্বাস গণনা ল্যাব",
      navHealth: "হেলথ ট্র্যাকার",
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
      tabDigitalPadHistory: "ডিজিটাল প্যাড ইতিহাস",
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
      skip: "মূল কনটেন্টে যান",
      optOcrAuto: "অটো (বাংলা + Eng)",
      optOcrEn: "English Only",
      optOcrBn: "শুধুমাত্র বাংলা",
      titleRotateLeft: "বাম দিকে ঘোরান (Rotate 90° Left)",
      titleRotateRight: "ডান দিকে ঘোরান (Rotate 90° Right)",
      titleEnhance: "অ্যাডাপ্টিভ কনট্রাস্ট ও শ্যাডো রিমুভার ফিল্টার",
      titleRerunOcr: "পুনরায় OCR স্ক্যান চালান",
      ocrTipTitle: "স্মার্ট ওসিআর সুবিধা:",
      ocrTipDesc: "ছবি বা PDF আপলোড করলে সিস্টেম স্বয়ংক্রিয়ভাবে ডাক্তার, রোগী, ডায়াগনোসিস ও প্রেসক্রিপশনের ওষুধ শনাক্ত করে ডানদিকের ফর্মটিতে পূরণ করে দিবে।",
      btnAddMedicine: "যোগ করুন",
      vaultSecured: "ভল্ট সুরক্ষিত",
      rawTextTitle: "এক্সট্রাক্টকৃত র-টেক্সট (Raw OCR Text):",
      phRawText: "OCR টেক্সট এখানে প্রদর্শিত হবে...",
      rawTipLabel: "টিপস:",
      rawTipDesc: "প্রেসক্রিপশনে ডাক্তারের হাতের লেখা বা অস্পষ্ট কোনো তথ্য থাকলে তা উপরে ঠিক করে 'ফর্মে রি-পার্স করুন' চাপুন। সঙ্গে সঙ্গে ডাক্তার, রোগী, ওষুধ ও ভাইটালস সঠিক ফিল্ডে আপডেট হয়ে যাবে।",
      phCC: "যেমন: Fever x 3 days (Enter চাপুন)",
      phHO: "যেমন: DM x 5 years, HTN (Enter চাপুন)",
      phInv: "যেমন: CBC, Random Blood Sugar (Enter চাপুন)",
      phMedName: "ওষুধের নাম (e.g. Tab. Napa)",
      phMedNote: "নির্দেশনা (ঐচ্ছিক)"
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
      tabDigitalPadHistory: "Digital Pad History",
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
      skip: "Skip to main content",
      optOcrAuto: "Auto (Bengali + English)",
      optOcrEn: "English Only",
      optOcrBn: "Bengali Only",
      titleRotateLeft: "Rotate 90° Left",
      titleRotateRight: "Rotate 90° Right",
      titleEnhance: "Adaptive Contrast & Shadow Removal Filter",
      titleRerunOcr: "Re-run OCR Scan",
      ocrTipTitle: "Smart OCR Feature:",
      ocrTipDesc: "Upload an image or PDF and the system will automatically extract doctor, patient, diagnosis, and medications into the form.",
      btnAddMedicine: "Add Medicine",
      vaultSecured: "Vault Secured",
      rawTextTitle: "Extracted Raw OCR Text:",
      phRawText: "OCR text will appear here...",
      rawTipLabel: "Tips:",
      rawTipDesc: "If any handwriting or text is inaccurate, correct it above and click 'Re-parse into Form' to immediately update all clinical fields.",
      phCC: "e.g. Fever x 3 days (Press Enter)",
      phHO: "e.g. DM x 5 years, HTN (Press Enter)",
      phInv: "e.g. CBC, Random Blood Sugar (Press Enter)",
      phMedName: "Medicine name (e.g. Tab. Napa)",
      phMedNote: "Instruction (Optional)"
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
    initDefaultDates();
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

  function initDefaultDates() {
    const dateInput = $("rxDate");
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }
    const refillInput = $("rxRefill");
    if (refillInput && !refillInput.value) {
      const defRefill = new Date();
      defRefill.setDate(defRefill.getDate() + 14);
      refillInput.value = defRefill.toISOString().split("T")[0];
    }
  }

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
    }

    // Language synchronization (handled globally by global-nav.js)
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

    document.querySelectorAll("[data-rx-i18n-title]").forEach((el) => {
      const k = el.getAttribute("data-rx-i18n-title");
      if (k && tr(k)) el.setAttribute("title", tr(k));
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

        // Trigger OCR for the newly uploaded primary prescription file
        if (i === 0) {
          ocrActiveSource = {
            type: fileObj.mime === "application/pdf" ? "pdf" : "image",
            file: f,
            dataUrl: fileObj.data,
            name: f.name,
          };
          if (!ocrBusy) {
            runModernOCR(ocrActiveSource);
          }
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
        if (!pendingFiles.length) {
          ocrActiveSource = null;
        }
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

    // Add Medicine Button & Enter Key Triggers
    const addMedAction = () => {
      const name = $("rxMedNameInput")?.value.trim();
      if (!name) {
        rxToast(currentLang === "bn" ? "অনুগ্রহ করে ওষুধের নাম লিখুন" : "Please enter medicine name", "warn");
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
      $("rxMedNameInput")?.focus();
    };

    $("btnRxAddMedicine")?.addEventListener("click", addMedAction);

    ["rxMedNameInput", "rxMedDosageInput", "rxMedDurationInput", "rxMedNoteInput"].forEach((id) => {
      $(id)?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addMedAction();
        }
      });
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
  // 7. CLINICAL MULTI-PASS DOCUMENT SCANNER (PDF.js + Local Illumination Normalization + Tesseract.js v5)
  // ============================================================================

  /**
   * Asynchronously loads an image URL, Blob URL, or data URL into an Image element.
   * @param {string} src
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      if (/^https?:/i.test(src)) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(currentLang === "bn" ? "ইমেজ লোড করতে ব্যর্থ হয়েছে" : "Failed to load image file"));
      img.src = src;
    });
  }

  /**
   * Resolves the highest-fidelity image source (preferring raw native File over JPEG thumbnail).
   * @param {Object|string} sourceInput
   * @returns {Promise<HTMLImageElement|null>}
   */
  async function loadLosslessSourceImage(sourceInput) {
    if (!sourceInput) return null;
    if (typeof sourceInput === "string") {
      return loadImageElement(sourceInput);
    }
    if (sourceInput.file) {
      const objectUrl = URL.createObjectURL(sourceInput.file);
      try {
        return await loadImageElement(objectUrl);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    }
    if (sourceInput.dataUrl) {
      return loadImageElement(sourceInput.dataUrl);
    }
    return null;
  }

  /**
   * Applies fast O(W*H) 2D integral-image local illumination normalization and unsharp
   * stroke sharpening to suppress camera shadows and brighten prescription text.
   * @param {Uint8ClampedArray} rgba - Mutable RGBA buffer.
   * @param {number} width
   * @param {number} height
   * @param {boolean} sharpen
   */
  function normalizeDocumentIllumination(rgba, width, height, sharpen = true) {
    const pixelCount = width * height;
    const gray = new Uint8Array(pixelCount);
    for (let p = 0, i = 0; p < pixelCount; p++, i += 4) {
      gray[p] = (rgba[i] * 77 + rgba[i + 1] * 150 + rgba[i + 2] * 29) >> 8;
    }

    // Build summed-area table with (width + 1) x (height + 1) stride for O(1) local window means
    const stride = width + 1;
    const integral = new Float64Array(stride * (height + 1));
    for (let y = 0; y < height; y++) {
      let rowSum = 0;
      const rowOffset = y * width;
      const intRow = (y + 1) * stride;
      const prevIntRow = y * stride;
      for (let x = 0; x < width; x++) {
        rowSum += gray[rowOffset + x];
        integral[intRow + x + 1] = integral[prevIntRow + x + 1] + rowSum;
      }
    }

    const radius = Math.max(14, Math.min(34, Math.round(Math.min(width, height) * 0.025)));
    const normalized = new Uint8Array(pixelCount);

    for (let y = 0; y < height; y++) {
      const y1 = Math.max(0, y - radius);
      const y2 = Math.min(height - 1, y + radius);
      const rTop = y1 * stride;
      const rBot = (y2 + 1) * stride;
      const rowOffset = y * width;

      for (let x = 0; x < width; x++) {
        const x1 = Math.max(0, x - radius);
        const x2 = Math.min(width - 1, x + radius);
        const area = (x2 - x1 + 1) * (y2 - y1 + 1);
        const sum =
          integral[rBot + x2 + 1] -
          integral[rTop + x2 + 1] -
          integral[rBot + x1] +
          integral[rTop + x1];
        const localMean = Math.max(24, sum / area);

        // Divide gray pixel by local illumination envelope so paper becomes crisp white
        const ratio = gray[rowOffset + x] / localMean;
        let outVal;
        if (ratio >= 0.94) {
          outVal = 255;
        } else if (ratio <= 0.48) {
          outVal = 0;
        } else {
          const t = (ratio - 0.48) / 0.46;
          outVal = Math.round(t * t * (3 - 2 * t) * 255); // Smoothstep contrast curve
        }
        normalized[rowOffset + x] = outVal;
      }
    }

    // Optional 3x3 unsharp mask preserves thin Bengali matras, decimal points, and '+' glyphs
    if (sharpen && width > 2 && height > 2) {
      for (let y = 1; y < height - 1; y++) {
        const row = y * width;
        for (let x = 1; x < width - 1; x++) {
          const idx = row + x;
          const blur =
            (normalized[idx - width] +
              normalized[idx + width] +
              normalized[idx - 1] +
              normalized[idx + 1]) * 0.25;
          const crisp = Math.max(0, Math.min(255, Math.round(normalized[idx] + (normalized[idx] - blur) * 0.45)));
          const p = idx * 4;
          rgba[p] = crisp;
          rgba[p + 1] = crisp;
          rgba[p + 2] = crisp;
          rgba[p + 3] = 255;
        }
      }
      // Borders
      for (let x = 0; x < width; x++) {
        [x, (height - 1) * width + x].forEach((idx) => {
          const v = normalized[idx];
          const p = idx * 4;
          rgba[p] = v;
          rgba[p + 1] = v;
          rgba[p + 2] = v;
          rgba[p + 3] = 255;
        });
      }
      for (let y = 0; y < height; y++) {
        [y * width, y * width + width - 1].forEach((idx) => {
          const v = normalized[idx];
          const p = idx * 4;
          rgba[p] = v;
          rgba[p + 1] = v;
          rgba[p + 2] = v;
          rgba[p + 3] = 255;
        });
      }
    } else {
      for (let p = 0, i = 0; p < pixelCount; p++, i += 4) {
        const v = normalized[p];
        rgba[i] = v;
        rgba[i + 1] = v;
        rgba[i + 2] = v;
        rgba[i + 3] = 255;
      }
    }
  }

  /**
   * Preprocesses image or canvas for OCR: scales to optimal ~300 DPI range (1800-2600px),
   * rotates around center, backfills opaque white, and applies either local illumination
   * normalization (enhance=true) or clean high-contrast grayscale (enhance=false).
   * @param {HTMLImageElement|HTMLCanvasElement} source
   * @param {Object} options - { rotation: number, enhance: boolean, sharpen: boolean }
   * @returns {HTMLCanvasElement}
   */
  function preprocessImageForOCR(source, options = {}) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return source;

    const srcW = source.naturalWidth || source.videoWidth || source.width || 1200;
    const srcH = source.naturalHeight || source.videoHeight || source.height || 1200;

    let scale = 1.0;
    const maxDim = Math.max(srcW, srcH);
    if (maxDim < 1800) {
      scale = Math.min(2.6, 1900 / maxDim);
    } else if (maxDim > 2600) {
      scale = 2600 / maxDim;
    }

    const targetW = Math.round(srcW * scale);
    const targetH = Math.round(srcH * scale);
    const rot = (((options.rotation || 0) % 360) + 360) % 360;
    const isRotated90or270 = rot === 90 || rot === 270;

    canvas.width = isRotated90or270 ? targetH : targetW;
    canvas.height = isRotated90or270 ? targetW : targetH;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.drawImage(source, -targetW / 2, -targetH / 2, targetW, targetH);
    ctx.restore();

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgba = imgData.data;

      if (options.enhance !== false) {
        normalizeDocumentIllumination(rgba, canvas.width, canvas.height, options.sharpen !== false);
      } else {
        // Clean grayscale conversion (safe fallback for crisp vector/screenshot documents)
        for (let i = 0; i < rgba.length; i += 4) {
          const g = (rgba[i] * 77 + rgba[i + 1] * 150 + rgba[i + 2] * 29) >> 8;
          rgba[i] = g;
          rgba[i + 1] = g;
          rgba[i + 2] = g;
          rgba[i + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } catch (err) {
      console.warn("Canvas image preprocessing skipped:", err);
    }

    return canvas;
  }

  /**
   * Reconstructs PDF text lines with horizontal column separation so side-by-side clinical
   * notes (C/C, H/O, O/E) and right-hand Rx medication lists do not merge onto one line.
   * @param {Object} textContent
   * @param {number} pageWidth
   * @returns {string}
   */
  function extractOrderedPdfText(textContent, pageWidth) {
    const items = (textContent?.items || [])
      .filter((it) => it && typeof it.str === "string" && it.str.trim().length > 0)
      .map((it) => ({
        str: it.str.trim(),
        x: it.transform ? it.transform[4] : 0,
        y: it.transform ? it.transform[5] : 0,
        w: it.width || it.str.length * 4,
      }));

    if (!items.length) return "";

    // Cluster into horizontal visual rows (PDF y grows upward -> sort descending)
    items.sort((a, b) => b.y - a.y || a.x - b.x);
    const rows = [];
    for (const item of items) {
      const lastRow = rows[rows.length - 1];
      if (lastRow && Math.abs(lastRow.y - item.y) <= 5.5) {
        lastRow.cells.push(item);
      } else {
        rows.push({ y: item.y, cells: [item] });
      }
    }

    const gutterMin = Math.max(52, (pageWidth || 595) * 0.085);
    const leftBlock = [];
    const rightBlock = [];
    const lines = [];

    for (const row of rows) {
      row.cells.sort((a, b) => a.x - b.x);
      const chunks = [];
      let curText = row.cells[0].str;
      let startX = row.cells[0].x;
      let prevEndX = row.cells[0].x + row.cells[0].w;

      for (let i = 1; i < row.cells.length; i++) {
        const cell = row.cells[i];
        const gap = cell.x - prevEndX;
        if (gap > gutterMin) {
          chunks.push({ x: startX, text: curText.trim() });
          curText = cell.str;
          startX = cell.x;
        } else {
          curText += (gap > 1.5 ? " " : "") + cell.str;
        }
        prevEndX = Math.max(prevEndX, cell.x + cell.w);
      }
      if (curText.trim()) {
        chunks.push({ x: startX, text: curText.trim() });
      }

      if (chunks.length >= 2 && (pageWidth || 595) > 200) {
        // Two-column row: separate columns cleanly rather than concatenating left & right sections
        leftBlock.push(chunks[0].text);
        rightBlock.push(chunks.slice(1).map((c) => c.text).join("  "));
      } else if (chunks.length === 1) {
        if (leftBlock.length || rightBlock.length) {
          lines.push(...leftBlock, ...rightBlock);
          leftBlock.length = 0;
          rightBlock.length = 0;
        }
        lines.push(chunks[0].text);
      }
    }

    if (leftBlock.length || rightBlock.length) {
      lines.push(...leftBlock, ...rightBlock);
    }

    return lines.join("\n").trim();
  }

  /**
   * PDF.js processing: extracts reading-order digital text across up to 5 pages,
   * or renders scanned pages (up to 2 pages) at high DPI (~2200px wide) for OCR.
   * @param {File} file
   * @returns {Promise<{type: 'digital'|'canvas', text?: string, canvases?: HTMLCanvasElement[]}>}
   */
  async function extractTextOrCanvasFromPDF(file) {
    if (!window.pdfjsLib) {
      throw new Error(currentLang === "bn" ? "PDF.js লাইব্রেরি লোড হয়নি।" : "PDF.js library is not available.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages || 1;
    const textPages = Math.min(totalPages, 5);

    let fullDigitalText = "";
    for (let pageNum = 1; pageNum <= textPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const textContent = await page.getTextContent();
      const pageText = extractOrderedPdfText(textContent, viewport.width);
      if (pageText) {
        fullDigitalText += (fullDigitalText ? "\n\n" : "") + pageText;
      }
    }

    const readableChars = fullDigitalText.replace(/[^A-Za-z0-9\u0980-\u09FF]/g, "");
    const hasClinicalHints = /(?:Dr|MBBS|FCPS|Hospital|Clinic|Patient|Name|Age|Rx|Tab|Cap|Syr|BP|Diagnosis|Date|Advice|ডাঃ|হাসপাতাল|রোগী|ওষুধ)/i.test(
      fullDigitalText
    );

    if (readableChars.length >= 40 || (readableChars.length >= 18 && hasClinicalHints)) {
      return { type: "digital", text: fullDigitalText.trim(), pagesProcessed: textPages };
    }

    // Scanned / image-based PDF: Render up to first 2 pages at crisp ~2200px width
    const renderCount = Math.min(totalPages, 2);
    const canvases = [];
    for (let p = 1; p <= renderCount; p++) {
      const page = await pdfDoc.getPage(p);
      const baseVp = page.getViewport({ scale: 1.0 });
      const targetScale = Math.min(3.0, Math.max(2.0, 2200 / Math.max(400, baseVp.width)));
      const viewport = page.getViewport({ scale: targetScale });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;
      canvases.push(canvas);
    }

    return { type: "canvas", canvases };
  }

  /**
   * Initializes or reuses the Tesseract.js v5 worker with layout-aware clinical parameters.
   * @param {string} targetLang
   * @param {Function} onProgress
   * @returns {Promise<{worker: Object, actualLang: string}>}
   */
  async function getTesseractWorker(targetLang, onProgress) {
    if (!window.Tesseract) {
      throw new Error(currentLang === "bn" ? "Tesseract.js লাইব্রেরি লোড হয়নি।" : "Tesseract.js library is not loaded.");
    }

    const desired = targetLang || selectedOcrLang || "eng+ben";

    if (ocrWorker && currentWorkerLang === desired) {
      return { worker: ocrWorker, actualLang: currentWorkerLang };
    }

    if (ocrWorker) {
      try {
        await ocrWorker.terminate();
      } catch (_) { }
      ocrWorker = null;
    }

    let usedLang = desired;
    const workerOpts = {
      logger: (m) => {
        if (typeof onProgress === "function") onProgress(m);
      },
    };

    try {
      ocrWorker = await window.Tesseract.createWorker(desired, 1, workerOpts);
    } catch (err) {
      if (desired !== "eng") {
        console.warn(`Tesseract pack '${desired}' unavailable, retrying 'eng':`, err);
        usedLang = "eng";
        ocrWorker = await window.Tesseract.createWorker("eng", 1, workerOpts);
      } else {
        throw err;
      }
    }

    currentWorkerLang = usedLang;

    if (ocrWorker && typeof ocrWorker.setParameters === "function") {
      try {
        await ocrWorker.setParameters({
          tessedit_pageseg_mode: window.Tesseract.PSM?.AUTO || "3",
          preserve_interword_spaces: "1",
        });
      } catch (_) { }
    }

    return { worker: ocrWorker, actualLang: usedLang };
  }

  /**
   * Computes an objective composite score ranking OCR candidates across passes.
   * @param {string} text
   * @param {number} confidence
   * @returns {number}
   */
  function scoreOcrCandidate(text, confidence) {
    const cleanText = (text || "").trim();
    if (!cleanText) return 0;
    const readable = cleanText.match(/[A-Za-z0-9\u0980-\u09FF]/g)?.length || 0;
    const clinicalHits = (
      cleanText.match(
        /\b(?:Dr|MBBS|FCPS|MD|Patient|Age|Sex|Date|BP|Pulse|Temp|Rx|Tab|Cap|Syr|Inj|Advice|Diagnosis)\b|ডাঃ|রোগী|বয়স|তারিখ/gi
      ) || []
    ).length;
    const conf = typeof confidence === "number" && !isNaN(confidence) ? confidence : 0;
    return conf + clinicalHits * 6 + Math.min(25, readable / 12);
  }

  /**
   * Executes preprocessing + recognition for a single visual pass.
   */
  async function recognizeCanvasPass(worker, sourceEl, passOpts) {
    const processedCanvas = preprocessImageForOCR(sourceEl, passOpts);
    const result = await worker.recognize(processedCanvas);
    const data = result?.data || {};
    const text = (data.text || "").trim();
    const confidence = typeof data.confidence === "number" ? Math.round(data.confidence) : 0;
    return {
      text,
      confidence,
      score: scoreOcrCandidate(text, confidence),
      passLabel: passOpts.enhance ? "illumination-normalized" : "clean-grayscale",
    };
  }

  /**
   * Runs adaptive multi-pass OCR over a single image/page element, automatically falling
   * back to an alternate grayscale pass when Pass 1 yields low confidence or sparse text.
   */
  async function runAdaptiveImageOcr(worker, sourceEl, label, fill) {
    const primaryPass = await recognizeCanvasPass(worker, sourceEl, {
      rotation: ocrRotation,
      enhance: ocrEnhanceFilter,
      sharpen: true,
    });

    const readableLen = primaryPass.text.replace(/[^A-Za-z0-9\u0980-\u09FF]/g, "").length;
    if (readableLen >= 35 && primaryPass.confidence >= 55) {
      return primaryPass;
    }

    if (label) {
      label.textContent =
        currentLang === "bn"
          ? "দ্বিতীয় ধাপের সূক্ষ্ম রিকগনিশন চেষ্টা চলছে..."
          : "Running second-pass optical verification...";
    }
    if (fill) fill.style.width = "88%";

    const secondaryPass = await recognizeCanvasPass(worker, sourceEl, {
      rotation: ocrRotation,
      enhance: !ocrEnhanceFilter,
      sharpen: false,
    });

    return secondaryPass.score > primaryPass.score ? secondaryPass : primaryPass;
  }

  /**
   * Renders a transparent, trustworthy status banner without fabricating sample clinical data.
   */
  function renderOcrDiagnosticBanner(statusType, titleText, detailText, showRawBtn = true) {
    const statusBanner = $("rxOcrStatus");
    if (!statusBanner) return;

    const palette =
      statusType === "success"
        ? "bg-teal bg-opacity-10 border-teal text-teal-dark"
        : statusType === "warn"
          ? "bg-warning bg-opacity-10 border-warning text-dark"
          : "bg-danger bg-opacity-10 border-danger text-dark";

    const icon =
      statusType === "success"
        ? "bi-check-circle-fill text-success"
        : statusType === "warn"
          ? "bi-exclamation-triangle-fill text-warning"
          : "bi-x-octagon-fill text-danger";

    statusBanner.classList.remove("d-none");
    statusBanner.className = `rx-ocr-status d-flex align-items-center ${palette}`;
    statusBanner.innerHTML = `
      <div class="d-flex align-items-center justify-content-between w-100 flex-wrap gap-2">
        <div class="d-flex align-items-center">
          <i class="bi ${icon} fs-5 me-2"></i>
          <div>
            <strong>${escapeHtml(titleText)}</strong>
            ${detailText ? `<div class="text-xs text-muted">${escapeHtml(detailText)}</div>` : ""}
          </div>
        </div>
        ${showRawBtn
        ? `<button type="button" class="btn btn-sm btn-outline-teal bg-white rounded-pill px-3 py-1 text-xs fw-bold shadow-xs" id="btnOpenOcrModal">
               <i class="bi bi-file-earmark-code me-1"></i>${escapeHtml(tr("btnViewRawOcr"))}
             </button>`
        : ""
      }
      </div>
    `;
    $("btnOpenOcrModal")?.addEventListener("click", openOcrReviewModal);
  }

  /**
   * Main trustworthy scanner orchestrator: handles digital & scanned PDFs, full-res images,
   * multi-pass adaptive OCR, real confidence scoring, and strict non-fabrication guarantees.
   * @param {Object} sourceInput
   */
  async function runModernOCR(sourceInput) {
    if (!sourceInput || ocrBusy) return;
    ocrBusy = true;

    const statusBanner = $("rxOcrStatus");
    const progress = $("rxProgress");
    const fill = $("rxProgressFill");
    const label = $("rxProgressLabel");

    if (progress) progress.classList.add("active");
    if (fill) fill.style.width = "15%";
    if (label) {
      label.textContent =
        currentLang === "bn" ? "ডকুমেন্ট বিশ্লেষণ ও অপ্টিমাইজেশন চলছে..." : "Optimizing document for clinical OCR...";
    }

    if (statusBanner) {
      statusBanner.classList.remove("d-none");
      statusBanner.className = "rx-ocr-status d-flex align-items-center";
      statusBanner.innerHTML = `
        <div class="spinner-border spinner-border-sm text-teal me-2" role="status"></div>
        <div class="flex-grow-1">
          <strong>${escapeHtml(tr("ocrScanning"))}</strong>
          <div class="text-xs text-muted" id="ocrStepText">${currentLang === "bn" ? "ডকুমেন্ট বিশ্লেষণ শুরু হচ্ছে..." : "Starting optical analysis..."
        }</div>
        </div>
      `;
    }

    $("rxUploadZone")?.classList.add("rx-ocr-scanning");

    try {
      let recognizedText = "";
      let scanConfidence = 0;
      let scanSourceLabel = "";
      let actualLang = selectedOcrLang;

      const onOcrProgress = (m) => {
        if (m && m.status === "recognizing text") {
          const pct = Math.round((m.progress || 0) * 100);
          if ($("ocrStepText")) {
            $("ocrStepText").textContent =
              currentLang === "bn" ? `OCR প্রসেসিং: ${pct}%` : `OCR processing: ${pct}%`;
          }
          if (fill) fill.style.width = `${Math.min(82, 20 + Math.round(pct * 0.6))}%`;
          if (label) label.textContent = `OCR: ${pct}%`;
        } else if (m && m.status) {
          if ($("ocrStepText")) {
            $("ocrStepText").textContent =
              currentLang === "bn" ? `ইঞ্জিন প্রস্তুত হচ্ছে (${m.status})...` : `Preparing engine (${m.status})...`;
          }
        }
      };

      // 1. PDF Handling (Digital Text Extraction or High-DPI Multi-Page Scanned OCR)
      if (sourceInput.type === "pdf" && sourceInput.file) {
        if (label) {
          label.textContent =
            currentLang === "bn" ? "PDF টেক্সট লেয়ার যাচাই হচ্ছে..." : "Inspecting PDF text layer...";
        }
        const pdfResult = await extractTextOrCanvasFromPDF(sourceInput.file);

        if (pdfResult.type === "digital" && pdfResult.text) {
          recognizedText = pdfResult.text;
          scanConfidence = 99;
          scanSourceLabel =
            currentLang === "bn" ? "PDF ডিজিটাল টেক্সট লেয়ার" : "PDF Digital Text Layer";
          if (fill) fill.style.width = "95%";
        } else if (pdfResult.canvases && pdfResult.canvases.length) {
          const { worker, actualLang: resolvedLang } = await getTesseractWorker(selectedOcrLang, onOcrProgress);
          actualLang = resolvedLang;
          const pageTexts = [];
          const pageConfs = [];

          for (let p = 0; p < pdfResult.canvases.length; p++) {
            if ($("ocrStepText")) {
              $("ocrStepText").textContent =
                currentLang === "bn"
                  ? `PDF পেজ ${p + 1}/${pdfResult.canvases.length} স্ক্যান হচ্ছে...`
                  : `Scanning PDF page ${p + 1}/${pdfResult.canvases.length}...`;
            }
            const res = await runAdaptiveImageOcr(worker, pdfResult.canvases[p], label, fill);
            if (res.text) pageTexts.push(res.text);
            if (res.confidence) pageConfs.push(res.confidence);
          }

          recognizedText = pageTexts.join("\n").trim();
          scanConfidence = pageConfs.length
            ? Math.round(pageConfs.reduce((a, b) => a + b, 0) / pageConfs.length)
            : 0;
          scanSourceLabel =
            currentLang === "bn"
              ? `স্ক্যানকৃত PDF (${pdfResult.canvases.length} পেজ · Tesseract ${actualLang})`
              : `Scanned PDF (${pdfResult.canvases.length}p · Tesseract ${actualLang})`;
        }
      }
      // 2. Lossless Image Handling
      else {
        const imageElement = await loadLosslessSourceImage(sourceInput);
        if (!imageElement) {
          throw new Error(
            currentLang === "bn" ? "ইমেজ সোর্স পাওয়া যায়নি।" : "No valid image source found for scanning."
          );
        }

        const { worker, actualLang: resolvedLang } = await getTesseractWorker(selectedOcrLang, onOcrProgress);
        actualLang = resolvedLang;
        const res = await runAdaptiveImageOcr(worker, imageElement, label, fill);
        recognizedText = res.text;
        scanConfidence = res.confidence;
        scanSourceLabel = `Tesseract OCR (${actualLang} · ${res.passLabel})`;
      }

      const readableChars = (recognizedText || "").replace(/[^A-Za-z0-9\u0980-\u09FF]/g, "");
      latestRawOcrText = (recognizedText || "").trim();

      if (readableChars.length < 8) {
        lastScanMeta = {
          source: scanSourceLabel,
          confidence: scanConfidence,
          lang: actualLang,
          rotated: ocrRotation,
        };
        const noTextTitle =
          currentLang === "bn"
            ? "ডকুমেন্ট থেকে পর্যাপ্ত পাঠযোগ্য টেক্সট পাওয়া যায়নি"
            : "No sufficient readable text detected in uploaded file";
        const noTextHint =
          currentLang === "bn"
            ? "ভুল তথ্য এড়াতে স্বয়ংক্রিয় নমুনা ডাটা যোগ করা হয়নি। অনুগ্রহ করে ছবি রোটেট করুন, হাই-কনট্রাস্ট টগল করুন অথবা ম্যানুয়ালি পূরণ করুন।"
            : "No placeholder data was injected to protect accuracy. Try rotating the image, toggling High-Contrast, or entering details manually.";
        renderOcrDiagnosticBanner("warn", noTextTitle, noTextHint, true);
        rxToast(noTextTitle, "warn");
        return;
      }

      lastScanMeta = {
        source: scanSourceLabel,
        confidence: scanConfidence,
        lang: actualLang,
        rotated: ocrRotation,
      };

      parseAndPopulateOCR(latestRawOcrText, { resetFirst: true, scanMeta: lastScanMeta });
    } catch (err) {
      console.warn("OCR scanner error (no synthetic data injected):", err);
      const isOfflineErr = typeof navigator !== "undefined" && navigator.onLine === false;
      const errDetail = isOfflineErr
        ? currentLang === "bn"
          ? "অফলাইন অবস্থায় ভাষা প্যাক লোড হয়নি। অনুগ্রহ করে অনলাইন সংযোগ নিশ্চিত করুন বা ম্যানুয়ালি পূরণ করুন।"
          : "Offline mode cannot download Tesseract language traineddata. Connect online or enter prescription manually."
        : err && err.message
          ? err.message
          : currentLang === "bn"
            ? "ডকুমেন্ট স্ক্যান ব্যর্থ হয়েছে। অনুগ্রহ করে ম্যানুয়ালি পূরণ করুন।"
            : "Document scanning failed. Please fill details manually.";

      renderOcrDiagnosticBanner("error", tr("ocrError"), errDetail, Boolean(latestRawOcrText));
      rxToast(tr("ocrError"), "error");
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

    $("btnRotateOcrLeft")?.addEventListener("click", () => {
      ocrRotation = (ocrRotation + 270) % 360;
      rxToast(`ছবি ঘোরানো হয়েছে: ${ocrRotation}°`, "info");
      if (ocrActiveSource && !ocrBusy) {
        runModernOCR(ocrActiveSource);
      }
    });

    $("btnRotateOcrRight")?.addEventListener("click", () => {
      ocrRotation = (ocrRotation + 90) % 360;
      rxToast(`ছবি ঘোরানো হয়েছে: ${ocrRotation}°`, "info");
      if (ocrActiveSource && !ocrBusy) {
        runModernOCR(ocrActiveSource);
      }
    });

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

    $("btnRerunOcr")?.addEventListener("click", () => {
      if (ocrActiveSource) {
        runModernOCR(ocrActiveSource);
      } else {
        rxToast("পুনরায় স্ক্যান করতে প্রথমে একটি প্রেসক্রিপশন ফাইল আপলোড করুন।", "warn");
      }
    });

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

    $("btnReparseOcr")?.addEventListener("click", () => {
      const textarea = $("rxRawOcrText");
      const editedText = textarea ? textarea.value.trim() : "";
      if (!editedText) {
        rxToast("পার্স করার জন্য কোনো টেক্সট নেই।", "warn");
        return;
      }
      latestRawOcrText = editedText;
      parseAndPopulateOCR(editedText, {
        resetFirst: true,
        fromModal: true,
        scanMeta: { source: "Manual Raw Text Edit", confidence: 100, lang: selectedOcrLang, rotated: ocrRotation },
      });

      const modalEl = $("rxOcrModal");
      if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        const bsModal = window.bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
      }
      rxToast(tr("toastOcrReparsed"), "success");
    });
  }

  /**
   * Opens the Raw OCR inspection modal populated strictly with extracted text (no fabricated data).
   */
  function openOcrReviewModal() {
    const modalEl = $("rxOcrModal");
    if (!modalEl) return;
    const textarea = $("rxRawOcrText");
    if (textarea) {
      textarea.value = latestRawOcrText || "";
    }
    if (window.bootstrap && window.bootstrap.Modal) {
      const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  }

  // ============================================================================
  // 8. CLINICAL NORMALIZATION, REGEX PARSER & VERIFIED EXTRACTION TELEMETRY
  // ============================================================================

  /**
   * Maps Bengali numerals (০-৯) to ASCII digits for reliable vitals, dates, and dosage schedules.
   */
  function bnToEnDigits(str) {
    if (!str) return "";
    const map = { "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9" };
    return String(str).replace(/[০-৯]/g, (d) => map[d] || d);
  }

  /**
   * Repairs common OCR character confusions inside medication schedules (e.g. "l+O+1" -> "1+0+1").
   */
  function repairDosageGlyphs(token) {
    return bnToEnDigits(token)
      .replace(/[lI|]/g, "1")
      .replace(/[OoD]/g, "0")
      .replace(/\s*[+\-–/]\s*/g, "+")
      .replace(/\+\++/g, "+")
      .trim();
  }

  /**
   * Parses DD/MM/YYYY (clinical standard), YYYY-MM-DD, or written months into ISO YYYY-MM-DD.
   */
  function parseFlexibleClinicalDate(rawText) {
    const asciiText = bnToEnDigits(rawText);

    // 1. ISO YYYY-MM-DD
    const isoMatch = asciiText.match(/(?:Date|তারিখ)?\s*[:.-]?\s*((?:19|20)\d{2})[\/.-](\d{1,2})[\/.-](\d{1,2})\b/i);
    if (isoMatch) {
      const y = Number(isoMatch[1]), m = Number(isoMatch[2]), d = Number(isoMatch[3]);
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      }
    }

    // 2. DD/MM/YYYY or MM/DD/YYYY (prefer DD/MM/YYYY unless middle > 12)
    const dmyMatch = asciiText.match(/(?:Date|তারিখ)\s*[:.-]?\s*(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/i)
      || asciiText.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](20\d{2})\b/);
    if (dmyMatch) {
      const p1 = Number(dmyMatch[1]), p2 = Number(dmyMatch[2]);
      let y = dmyMatch[3];
      if (y.length === 2) y = "20" + y;
      let day = p1, mon = p2;
      if (p2 > 12 && p1 <= 12) {
        mon = p1;
        day = p2;
      }
      if (mon >= 1 && mon <= 12 && day >= 1 && day <= 31) {
        return `${y}-${String(mon).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }
    }

    // 3. Written months (e.g. "06 Nov 2026" or "25 November 2026")
    const months = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
    const wordMatch = asciiText.match(/\b(\d{1,2})[\s,-]+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,-]+(20\d{2})\b/i);
    if (wordMatch) {
      const d = Number(wordMatch[1]);
      const m = months[wordMatch[2].slice(0, 3).toLowerCase()];
      const y = wordMatch[3];
      if (m && d >= 1 && d <= 31) {
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      }
    }

    return "";
  }

  const SCAN_HIGHLIGHT_IDS = [
    "rxDoctor", "rxDegrees", "rxRegNo", "rxClinic", "rxAddress", "rxPhone",
    "rxPatName", "rxAge", "rxSex", "rxDate", "rxUrgency", "rxRefill",
    "rxBp", "rxPulse", "rxTemp", "rxWeight",
    "rxCCChipContainer", "rxHOChipContainer", "rxInvChipContainer",
    "rxDiagnosis", "rxMedsTbody", "rxNotes",
  ];

  /**
   * Removes OCR focus highlights from all form fields and containers.
   */
  function clearOcrHighlights() {
    SCAN_HIGHLIGHT_IDS.forEach((id) => {
      const el = $(id);
      if (el) el.classList.remove("ocr-highlight");
    });
  }

  /**
   * Resolves a container/display element into an actual focusable form control.
   */
  function resolveFocusableControl(el) {
    if (!el) return null;
    if (el.id === "rxCCChipContainer") return $("rxCCInput") || el;
    if (el.id === "rxHOChipContainer") return $("rxHOInput") || el;
    if (el.id === "rxInvChipContainer") return $("rxInvInput") || el;
    if (el.id === "rxMedsTbody") return $("rxMedNameInput") || el;
    return el;
  }

  /**
   * Moves viewport scroll and keyboard focus to the first field populated by scanning.
   */
  function focusFirstFulfilledField(fulfilledEls, deferUntilModalHidden = false) {
    if (!fulfilledEls || !fulfilledEls.length) return;
    const focusEl = fulfilledEls.map(resolveFocusableControl).find((el) => el && typeof el.focus === "function");
    if (!focusEl) return;

    const applyFocus = () => {
      try {
        if (typeof focusEl.scrollIntoView === "function") {
          focusEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        focusEl.focus({ preventScroll: true });
      } catch (_) {
        try { focusEl.focus(); } catch (__) { }
      }
    };

    const modalEl = $("rxOcrModal");
    if (deferUntilModalHidden && modalEl && modalEl.classList.contains("show")) {
      modalEl.addEventListener("hidden.bs.modal", applyFocus, { once: true });
    } else {
      applyFocus();
    }
  }

  /**
   * Resets clinical form inputs & arrays prior to populating a newly scanned prescription
   * so fields from an earlier prescription never bleed across uploads.
   */
  function resetExtractedFormState() {
    clearOcrHighlights();
    [
      "rxDoctor", "rxDegrees", "rxRegNo", "rxClinic", "rxAddress", "rxPhone",
      "rxPatName", "rxAge", "rxSex", "rxBp", "rxPulse", "rxTemp", "rxWeight",
      "rxDiagnosis", "rxNotes",
    ].forEach((id) => {
      if ($(id)) $(id).value = "";
    });
    if ($("rxUrgency")) $("rxUrgency").value = "normal";
    currentCC = [];
    currentHO = [];
    currentInv = [];
    currentMeds = [];
  }

  /**
   * Section-aware clinical entity extractor populating form fields from genuine OCR/PDF text.
   * @param {string} rawText
   * @param {Object} [opts] - { resetFirst: boolean, scanMeta: Object }
   */
  function parseAndPopulateOCR(rawText, opts = {}) {
    if (!rawText || !rawText.trim()) {
      renderOcrDiagnosticBanner(
        "warn",
        currentLang === "bn" ? "পার্স করার মতো টেক্সট পাওয়া যায়নি" : "No text available to parse",
        currentLang === "bn" ? "অনুগ্রহ করে ফর্মের ঘরগুলো ম্যানুয়ালি পূরণ করুন।" : "Please enter prescription details manually.",
        false
      );
      return;
    }

    if (opts.resetFirst) {
      resetExtractedFormState();
    }

    latestRawOcrText = rawText;
    const normalizedLines = rawText
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    let docName = "", degrees = "", regNo = "", clinic = "", address = "", phone = "";
    let patName = "", age = "", sex = "", date = "";
    let bp = "", pulse = "", temp = "", weight = "";
    let diagnosis = "", advice = "", urgency = "normal";

    // Split inline pipe/double-tab segments softly where labels exist on one line
    const expandedLines = [];
    for (const ln of normalizedLines) {
      if (/\s+\|\s+/.test(ln)) {
        ln.split(/\s+\|\s+/).forEach((seg) => {
          if (seg.trim()) expandedLines.push(seg.trim());
        });
      } else {
        expandedLines.push(ln);
      }
    }

    // 1. Doctor Name (stops cleanly before degrees, BMDC, pipe, or numeric metadata)
    const docRegex = /(?:(?:Assoc\.?|Asst\.?)\s*Prof\.?\s*)?(?:Prof\.?\s*)?(?:Dr\.?|Doctor|Consultant|ডাঃ|অধ্যাপক\s*ডাঃ|ডাক্তার|প্রফেসর)\s*([A-Za-z\u0980-\u09FF.\s'-]{2,55})/i;
    for (const line of expandedLines) {
      if (/Signature|স্বাক্ষর/i.test(line)) continue;
      const m = line.match(docRegex);
      if (m && !docName) {
        let cand = m[0]
          .split(/(?:MBBS|FCPS|MD|MS|FRCS|MRCP|BDS|DGO|D-Card|Ph\.?D|MPH|MCPS|FACS|BMDC|Reg|Phone|Call|[,;|(\n])/i)[0]
          .trim();
        cand = cand.replace(/[.,:;-]+$/, "").trim();
        if (cand.length >= 4) {
          docName = cand;
          break;
        }
      }
    }

    // 2. Degrees
    const degRegex = /\b(?:MBBS|FCPS|MD|MS|FRCS|MRCP|BDS|DGO|D-Card|Ph\.?D|MPH|MCPS|FACS|BCS(?:\s*\(Health\))?)\b[^\n|]*/i;
    for (const line of expandedLines) {
      const m = line.match(degRegex);
      if (m && !degrees) {
        degrees = m[0].split(/(?:Reg|BMDC|Chamber|Phone|Call|Tel)/i)[0].replace(/[,;:\s]+$/, "").trim();
        break;
      }
    }

    // 3. Reg No / BMDC
    const regRegex = /(?:BMDC\s*(?:Reg(?:istration)?\s*(?:No)?)?|Reg(?:istration)?(?:\s*No)?|রেজি[\u0983:]?(?:\s*নং)?|রেজিস্ট্রেশন)\s*[\u0983:.-]?\s*([A-Za-z0-9\u0980-\u09FF-]{3,20})/i;
    for (const line of expandedLines) {
      const m = line.match(regRegex);
      if (m && !regNo) {
        regNo = `Reg No: ${bnToEnDigits(m[1].trim())}`;
        break;
      }
    }

    // 4. Hospital / Clinic Name
    const hospRegex = /^[^\n]*?\b(?:Hospital|Clinic|Medical\s*(?:College|Center|Centre)?|Health\s*Care|Diagnostic|Foundation|Specialized|হাসপাতাল|ক্লিনিক|ডায়াগনস্টিক|মেডিকেল)[^\n|]*/i;
    for (const line of expandedLines) {
      if (/(?:Dr\.|MBBS|C\/C|Dx|Rx)/i.test(line) && !/Hospital|Clinic|Medical/i.test(line.split(",")[0])) continue;
      const m = line.match(hospRegex);
      if (m && !clinic) {
        clinic = m[0].split(/(?:Chamber|Phone|Call|Tel|\d{3,}-\d+)/i)[0].replace(/[,;:\s]+$/, "").trim();
        break;
      }
    }

    // 5. Address
    for (const line of expandedLines) {
      if (/(?:Road|Ave|Avenue|Street|Lane|Block|Sector|House|Holding|Dhanmondi|Uttara|Banani|Gulshan|Mirpur|Dhaka|Chittagong|Chattogram|Sylhet|Khulna|Rajshahi|Barisal|Rangpur|Mymensingh|Bangladesh|ঢাকা|চট্টগ্রাম|সিলেট|খুলনা|রাজশাহী)/i.test(line)) {
        if (!/^(?:Dr\.|Patient|Name|Rx|1\.)/i.test(line)) {
          address = line.split(/(?:Call|Phone|Tel|Mobile|মোবাইল)/i)[0].replace(/[|,:;\s]+$/, "").trim();
          break;
        }
      }
    }

    // 6. Phone / Helpline
    const asciiRaw = bnToEnDigits(rawText);
    const phoneMatch = asciiRaw.match(/(?:Call|Phone|Tel|Mobile|Helpline|মোবাইল|ফোন)?\s*[\u0983:.-]?\s*((?:\+?880[-\s]?)?0?1[3-9]\d{2}[-\s]?\d{6})/i);
    if (phoneMatch) phone = phoneMatch[1].replace(/\s+/g, " ").trim();

    // 7. Patient Name, Age, Sex, Date
    const patMatch = rawText.match(/(?:Patient(?:\s*Name)?|Pt\.?\s*Name|Name|নাম|রোগীর\s*নাম)\s*[\u0983:.-]\s*([A-Za-z\u0980-\u09FF.\s'-]+)/i);
    if (patMatch) {
      patName = patMatch[1]
        .split(/(?:\bAge\b|\bSex\b|\bGender\b|\bDate\b|\bবয়স\b|\bতারিখ\b|[|\n,])/i)[0]
        .trim();
    }

    const ageMatch = asciiRaw.match(/(?:Age|বয়স)\s*[\u0983:.-]?\s*(\d{1,3}(?:\s*(?:Y(?:rs?|ears?)?|M(?:onths?|os?)?|D(?:ays?)?|বছর|মাস|দিন))?)/i);
    if (ageMatch) age = ageMatch[1].trim();

    const sexMatch = rawText.match(/(?:Sex|Gender|লিঙ্গ)\s*[\u0983:.-]?\s*(Female|Male|Other|F|M|মহিলা|পুরুষ)/i)
      || rawText.match(/\b\d{1,3}\s*(?:Y(?:rs?|ears?)?|বছর)?\s*\/\s*(Female|Male|F|M)\b/i);
    if (sexMatch) {
      const s = sexMatch[1].trim().toUpperCase();
      sex = s === "FEMALE" || s === "F" || s === "মহিলা" ? "F" : s === "OTHER" ? "Other" : "M";
    }

    date = parseFlexibleClinicalDate(rawText);

    // 8. Vitals with Clinical Sanity Bounds
    const bpMatch = asciiRaw.match(/(?:BP|B\.P\.|Blood\s*Pressure|রক্তচাপ)\s*[\u0983:.-]?\s*(\d{2,3})\s*\/\s*(\d{2,3})/i);
    if (bpMatch) {
      const sys = Number(bpMatch[1]), dia = Number(bpMatch[2]);
      if (sys >= 60 && sys <= 260 && dia >= 30 && dia <= 160) {
        bp = `${sys}/${dia}`;
      }
    }

    const pulseMatch = asciiRaw.match(/(?:Pulse|Heart\s*Rate|HR|PR|পালস|নাড়ির\s*গতি)\s*[\u0983:.-]?\s*(\d{2,3})/i);
    if (pulseMatch) {
      const pv = Number(pulseMatch[1]);
      if (pv >= 30 && pv <= 220) pulse = String(pv);
    }

    const tempMatch = asciiRaw.match(/(?:Temp(?:erature)?|তাপমাত্রা)\s*[\u0983:.-]?\s*(\d{2,3}(?:\.\d)?)/i);
    if (tempMatch) {
      const tv = Number(tempMatch[1]);
      if ((tv >= 94 && tv <= 108) || (tv >= 34 && tv <= 43)) temp = String(tv);
    }

    const weightMatch = asciiRaw.match(/(?:Weight|Wt|ওজন)\s*[\u0983:.-]?\s*(\d{1,3}(?:\.\d)?)/i);
    if (weightMatch) {
      const wv = Number(weightMatch[1]);
      if (wv >= 1 && wv <= 250) weight = String(wv);
    }

    // 9. Section-State Machine across all lines (handles multi-line C/C, H/O, Inv., Dx, Rx, Advice)
    let activeSection = "";
    const ccItems = [], hoItems = [], invItems = [], dxLines = [], adviceLines = [], extractedMeds = [];

    const pushChips = (target, textStr) => {
      textStr
        .split(/[,;•]/)
        .map((s) => s.replace(/^[-*:\s]+/, "").trim())
        .filter((s) => s.length >= 2)
        .forEach((s) => {
          if (!target.includes(s)) target.push(s);
        });
    };

    const formRegex = /\b(Tab\.?|Tablet|Cap\.?|Capsule|Syr\.?|Syrup|Susp\.?|Suspension|Inj\.?|Injection|Inh\.?|Inhaler|Drop|Drops|Oint\.?|Cream|Gel|Spray|Neb|Rotacap|Supp|Sachet|ORS|ট্যাব\.?|ক্যাপ\.?|সিরাপ)\b/i;
    const drugLexiconRegex = /\b(?:Napa|Ace|Paracetamol|Tylenol|Fexo|Fexofenadine|Cetirizine|Alatrol|Seclo|Omeprazole|Esomeprazole|Sergel|Maxpro|Pantoprazole|Monas|Montelukast|Ceevit|Azith|Azithromycin|Amoxicillin|Cefixime|Ciprofloxacin|Levofloxacin|Metformin|Atorvastatin|Losartan|Amlodipine|Domperidone|Motigut|Salbutamol|Seretide|Budesonide|Prednisolone|Vitamin|Calcium|ORS)\b/i;
    const medStrengthOrDoseRegex = /\b\d+(?:\.\d+)?\s*(?:mg|mcg|gm|g|ml|iu)\b|(?:\d|[০-৯lI])\s*[+\-–]\s*(?:\d|[০-৯Oo])\s*[+\-–]\s*(?:\d|[০-৯lI])|\b(?:OD|BD|BID|TDS|TID|QID|HS|SOS)\b/i;

    const parseMedicationLine = (line) => {
      if (/(?:Dr\.|MBBS|FCPS|Hospital|Clinic|Reg\s*No|Phone|Call|BP\s*:|Pulse\s*:|Temp\s*:|Next\s*Refill|Signature)/i.test(line)) {
        return null;
      }
      const hasForm = formRegex.test(line);
      const hasNumberPrefix = /^\d{1,2}\s*[.)\-:]/.test(line);
      const hasDrugOrDose = drugLexiconRegex.test(line) || medStrengthOrDoseRegex.test(line);

      if (!hasForm && !hasDrugOrDose && !(activeSection === "RX" && hasNumberPrefix)) {
        return null;
      }

      let form = "Tab";
      const fm = line.match(formRegex);
      if (fm) {
        const fLow = fm[1].toLowerCase().replace(".", "");
        if (fLow.startsWith("cap") || fLow.startsWith("ক্যাপ")) form = "Cap";
        else if (fLow.startsWith("syr") || fLow.startsWith("susp") || fLow.startsWith("সিরাপ")) form = "Syr";
        else if (fLow.startsWith("inj")) form = "Inj";
        else if (fLow.startsWith("drop")) form = "Drop";
        else if (fLow.startsWith("inh") || fLow === "rotacap" || fLow === "neb") form = "Inhaler";
        else if (fLow.startsWith("oint") || fLow === "cream" || fLow === "gel") form = "Topical";
        else if (fLow === "spray") form = "Spray";
        else if (fLow === "ors" || fLow === "sachet") form = "Sachet";
        else form = "Tab";
      }

      const lineAscii = bnToEnDigits(line);
      let dosage = "1+0+1";
      const dosPatternMatch = lineAscii.match(
        /([0-2lI|]\s*[+\-–]\s*[0-2OoD]\s*[+\-–]\s*[0-2lI|]|[0-2lI|]\s*[+\-–]\s*[0-2lI|]|\b(?:BD|BID|TDS|TID|QID|OD|HS|SOS)\b|\d\s*times\s*(?:a\s*day|daily)|once\s*daily|as\s*needed)/i
      );
      if (dosPatternMatch) {
        const rawDos = dosPatternMatch[1];
        if (/^(?:BD|BID)$/i.test(rawDos)) dosage = "1+0+1";
        else if (/^(?:TDS|TID)$/i.test(rawDos)) dosage = "1+1+1";
        else if (/^QID$/i.test(rawDos)) dosage = "1+1+1+1";
        else if (/^(?:OD|once\s*daily)$/i.test(rawDos)) dosage = "1+0+0";
        else if (/^HS$/i.test(rawDos)) dosage = "0+0+1";
        else if (/^(?:SOS|as\s*needed)$/i.test(rawDos)) dosage = "As needed";
        else dosage = repairDosageGlyphs(rawDos);
      }

      let timing = "After meal";
      if (/(?:before\s*meal|empty\s*stomach|\bAC\b|খাওয়ার\s*আগে)/i.test(line)) {
        timing = "Before meal";
      } else if (/(?:after\s*meal|with\s*food|\bPC\b|খাওয়ার\s*পরে)/i.test(line)) {
        timing = "After meal";
      } else if (/(?:bedtime|\bHS\b|রাতে\s*শোবার\s*আগে)/i.test(line)) {
        timing = "At bedtime";
      } else if (/(?:as\s*needed|\bSOS\b|\bPRN\b|প্রয়োজনে)/i.test(line)) {
        timing = "As needed";
      }

      let duration = "5 days";
      const durMatch = lineAscii.match(
        /(\d+\s*(?:days?|d|weeks?|wks?|months?|mos?)|continue|চলবে|১\s*সপ্তাহ|৫\s*দিন|৭\s*দিন|১০\s*দিন|১৪\s*দিন|১\s*মাস)/i
      );
      if (durMatch) duration = durMatch[1].trim();

      let cleanName = line
        .replace(/^\(?\d{1,2}\)?[\s.)-]+/, "")
        .replace(/^[•*-]\s*/, "")
        .replace(/^(?:Tab\.?|Tablet|Cap\.?|Capsule|Syr\.?|Syrup|Susp\.?|Suspension|Inj\.?|Injection|Inh\.?|Inhaler|ট্যাব\.?|ক্যাপ\.?|সিরাপ)\s+/i, "")
        .trim();

      cleanName = cleanName
        .split(/\s*[-–—]\s*(?:[0-2০-৯lI]+\s*[+\-–]|After|Before|At bedtime|As needed|\d+\s*(?:days?|weeks?|months?)|খাওয়ার|BD|TDS|OD)/i)[0]
        .replace(/\s+(?:[0-2০-৯lI|]\s*[+\-–]\s*[0-2০-৯OoD]\s*[+\-–]\s*[0-2০-৯lI|]|BD|BID|TDS|TID|QID|OD|HS|SOS|Before\s*meal|After\s*meal|খাওয়ার\s*(?:আগে|পরে))\b.*$/i, "")
        .trim();

      if (!cleanName || cleanName.length < 2) return null;
      return { name: cleanName, form, dosage, timing, duration, note: "" };
    };

    for (const rawLine of expandedLines) {
      const headerMatch = rawLine.match(
        /^(C\/C|Chief\s*Complaints?|উপসর্গ|H\/O|History\s*of(?:\s*Illness)?|অতীত\s*ইতিহাস|Inv\.?|Investigations?|পরীক্ষা(?:-নিরীক্ষা)?|Dx|Diagnosis|ডায়াগনোসিস|Rx|Treatment|চিকিৎসা|ওষুধের\s*তালিকা|Advice|পরামর্শ|উপদেশ|O\/E(?:\s*Vitals)?|Vitals)\s*[\u0983:.-]?\s*(.*)$/i
      );

      if (headerMatch) {
        const key = headerMatch[1].toLowerCase();
        const rest = (headerMatch[2] || "").trim();

        if (key.startsWith("c/c") || key.startsWith("chief") || key.includes("উপসর্গ")) {
          activeSection = "CC";
          if (rest) pushChips(ccItems, rest);
        } else if (key.startsWith("h/o") || key.startsWith("history") || key.includes("ইতিহাস")) {
          activeSection = "HO";
          if (rest) pushChips(hoItems, rest);
        } else if (key.startsWith("inv") || key.includes("পরীক্ষা")) {
          activeSection = "INV";
          if (rest) pushChips(invItems, rest);
        } else if (key === "dx" || key.startsWith("diag") || key.includes("ডায়াগনোসিস")) {
          activeSection = "DX";
          if (rest) dxLines.push(rest);
        } else if (key === "rx" || key.startsWith("treat") || key.includes("চিকিৎসা") || key.includes("ওষুধ")) {
          activeSection = "RX";
          if (rest) {
            const med = parseMedicationLine(rest);
            if (med) extractedMeds.push(med);
          }
        } else if (key.startsWith("adv") || key.includes("পরামর্শ") || key.includes("উপদেশ")) {
          activeSection = "ADVICE";
          if (rest) adviceLines.push(rest);
        } else if (key.startsWith("o/e") || key.startsWith("vital")) {
          activeSection = "OE";
        }
        continue;
      }

      if (/^(?:Next\s*Refill|Refill|Follow\s*up|পরবর্তী\s*সাক্ষাৎ|Signature|Urgency)/i.test(rawLine)) {
        activeSection = "";
        continue;
      }

      if (activeSection === "CC") {
        pushChips(ccItems, rawLine);
      } else if (activeSection === "HO") {
        pushChips(hoItems, rawLine);
      } else if (activeSection === "INV") {
        pushChips(invItems, rawLine);
      } else if (activeSection === "DX") {
        dxLines.push(rawLine);
      } else if (activeSection === "ADVICE") {
        adviceLines.push(rawLine);
      } else {
        const med = parseMedicationLine(rawLine);
        if (med) {
          activeSection = "RX";
          extractedMeds.push(med);
        }
      }
    }

    if (ccItems.length) currentCC = ccItems;
    if (hoItems.length) currentHO = hoItems;
    if (invItems.length) currentInv = invItems;
    if (dxLines.length) diagnosis = dxLines.join("; ").replace(/^[\s/–—:-]+/, "").trim();
    if (adviceLines.length) advice = adviceLines.join("\n").trim();

    if (extractedMeds.length) {
      currentMeds = extractedMeds;
    }

    if (/(?:\bUrgent\b|\bEmergency\b|\bSTAT\b|\bCrisis\b|জরুরি)/i.test(rawText)) {
      urgency = "urgent";
    } else if (/(?:Follow[\s-]?up|Review|Revisit|ফলো[- ]?আপ)/i.test(rawText)) {
      urgency = "followup";
    }

    // 10. Populate Form DOM Controls safely and track only fields fulfilled by scanning
    const fulfilledEls = [];
    const markFilled = (el) => {
      if (el && !fulfilledEls.includes(el)) fulfilledEls.push(el);
    };

    if (docName && $("rxDoctor")) { $("rxDoctor").value = docName; markFilled($("rxDoctor")); }
    if (degrees && $("rxDegrees")) { $("rxDegrees").value = degrees; markFilled($("rxDegrees")); }
    if (regNo && $("rxRegNo")) { $("rxRegNo").value = regNo; markFilled($("rxRegNo")); }
    if (clinic && $("rxClinic")) { $("rxClinic").value = clinic; markFilled($("rxClinic")); }
    if (address && $("rxAddress")) { $("rxAddress").value = address; markFilled($("rxAddress")); }
    if (phone && $("rxPhone")) { $("rxPhone").value = phone; markFilled($("rxPhone")); }
    if (patName && $("rxPatName")) { $("rxPatName").value = patName; markFilled($("rxPatName")); }
    if (age && $("rxAge")) { $("rxAge").value = age; markFilled($("rxAge")); }
    if (sex && $("rxSex")) { $("rxSex").value = sex; markFilled($("rxSex")); }
    if (date && $("rxDate")) { $("rxDate").value = date; markFilled($("rxDate")); }
    if (bp && $("rxBp")) { $("rxBp").value = bp; markFilled($("rxBp")); }
    if (pulse && $("rxPulse")) { $("rxPulse").value = pulse; markFilled($("rxPulse")); }
    if (temp && $("rxTemp")) { $("rxTemp").value = temp; markFilled($("rxTemp")); }
    if (weight && $("rxWeight")) { $("rxWeight").value = weight; markFilled($("rxWeight")); }
    if (diagnosis && $("rxDiagnosis")) { $("rxDiagnosis").value = diagnosis; markFilled($("rxDiagnosis")); }
    if (advice && $("rxNotes")) { $("rxNotes").value = advice; markFilled($("rxNotes")); }
    if ($("rxUrgency")) {
      $("rxUrgency").value = urgency;
      if (urgency !== "normal") markFilled($("rxUrgency"));
    }

    // Refill Calculation
    const refillMatch = asciiRaw.match(
      /(?:Next\s*Refill|Refill|Follow\s*up|পরবর্তী\s*সাক্ষাৎ)\s*[:.-]?\s*(\d{1,2})\s*(days?|weeks?|months?|দিন|সপ্তাহ|মাস)/i
    );
    if (refillMatch && $("rxRefill")) {
      const unit = refillMatch[2].toLowerCase();
      const mult = unit.includes("week") || unit.includes("সপ্তাহ") ? 7 : unit.includes("month") || unit.includes("মাস") ? 30 : 1;
      const daysAhead = parseInt(refillMatch[1], 10) * mult;
      const refillD = new Date();
      refillD.setDate(refillD.getDate() + (daysAhead || 14));
      $("rxRefill").value = refillD.toISOString().split("T")[0];
      markFilled($("rxRefill"));
    } else if ($("rxRefill") && !$("rxRefill").value) {
      const defRefill = new Date();
      defRefill.setDate(defRefill.getDate() + 14);
      $("rxRefill").value = defRefill.toISOString().split("T")[0];
    }

    if (ccItems.length) markFilled($("rxCCChipContainer"));
    if (hoItems.length) markFilled($("rxHOChipContainer"));
    if (invItems.length) markFilled($("rxInvChipContainer"));
    if (extractedMeds.length) markFilled($("rxMedsTbody"));

    renderChips("cc");
    renderChips("ho");
    renderChips("inv");
    renderMedicineTable();

    // Keep persistent focus/highlight only on fields fulfilled by scanning, and focus first one
    clearOcrHighlights();
    fulfilledEls.forEach((el) => markScanHighlight(el));
    focusFirstFulfilledField(fulfilledEls, Boolean(opts.fromModal));

    // Verified Status & Confidence Telemetry
    const extractedFieldsCount =
      (docName ? 1 : 0) + (degrees ? 1 : 0) + (clinic ? 1 : 0) + (patName ? 1 : 0) +
      (bp ? 1 : 0) + (pulse ? 1 : 0) + (diagnosis ? 1 : 0) + currentMeds.length +
      currentCC.length + currentHO.length + currentInv.length;

    const meta = opts.scanMeta || lastScanMeta || {};
    const confStr =
      typeof meta.confidence === "number" && meta.confidence > 0
        ? currentLang === "bn"
          ? `আত্মবিশ্বাস: ${meta.confidence}%`
          : `Confidence: ${meta.confidence}%`
        : "";
    const srcStr = meta.source ? `${meta.source}` : "";
    const metaLine = [srcStr, confStr].filter(Boolean).join(" · ");

    if (extractedFieldsCount === 0) {
      const partialTitle =
        currentLang === "bn"
          ? "টেক্সট পড়া হয়েছে তবে স্ট্রাকচার্ড ফিল্ড শনাক্ত হয়নি"
          : "Text extracted, but structured clinical fields were not recognized";
      const partialSub =
        currentLang === "bn"
          ? `${metaLine ? metaLine + " — " : ""}স্ক্যানকৃত টেক্সট রিভিউ মডালে দেখে ফর্মে বসান বা হাত দিয়ে লিখুন।`
          : `${metaLine ? metaLine + " — " : ""}Open raw text review to adjust labels and re-parse, or fill manually.`;
      renderOcrDiagnosticBanner("warn", partialTitle, partialSub, true);
      rxToast(partialTitle, "warn");
      return;
    }

    const lowConfNote =
      typeof meta.confidence === "number" && meta.confidence > 0 && meta.confidence < 55
        ? currentLang === "bn"
          ? " (কম স্পষ্টতা — সংরক্ষণের আগে তথ্য যাচাই করুন)"
          : " (Low legibility — verify before saving)"
        : "";

    const summaryText =
      currentLang === "bn"
        ? `শনাক্তকৃত তথ্য: ${extractedFieldsCount}টি${metaLine ? ` (${metaLine})` : ""}${lowConfNote}`
        : `Extracted ${extractedFieldsCount} clinical item(s)${metaLine ? ` (${metaLine})` : ""}${lowConfNote}`;

    renderOcrDiagnosticBanner(
      typeof meta.confidence === "number" && meta.confidence > 0 && meta.confidence < 55 ? "warn" : "success",
      tr("ocrSuccess"),
      summaryText,
      true
    );
    rxToast(tr("ocrSuccess"), "success");
  }

  function markScanHighlight(el) {
    if (!el) return;
    el.classList.add("ocr-highlight");
    if (!el.dataset.bwHighlightBound && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT")) {
      el.dataset.bwHighlightBound = "true";
      el.addEventListener("input", () => {
        if (!String(el.value || "").trim()) {
          el.classList.remove("ocr-highlight");
        }
      });
    }
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
      parseAndPopulateOCR(sampleFallbackText, {
        resetFirst: true,
        scanMeta: { source: "Sample Prescription Template", confidence: 100, lang: "eng+ben", rotated: 0 },
      });
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
      date: date,
      fileName: fileName,
      doctor: doctor,
      doctorName: doctor,
      degrees: degrees,
      regNo: regNo,
      doctorReg: regNo,
      clinic: clinic,
      hospital: clinic,
      address: address,
      doctorAddress: address,
      phone: phone,
      doctorPhone: phone,
      patName: patName,
      patientName: patName,
      age: age,
      patientAge: age,
      sex: sex,
      patientGender: sex,
      serialNo: "SL-" + Math.floor(1000 + Math.random() * 9000),
      vitals: { bp, pulse, temp, weight },
      clinical: {
        cc: [...currentCC],
        ho: [...currentHO],
        inv: [...currentInv],
        oe: { bp, pulse, temp, weight }
      },
      cc: [...currentCC],
      ho: [...currentHO],
      inv: [...currentInv],
      meds: currentMeds.map((m) =>
        typeof m === "string" ? m : `${m.form ? m.form + ". " : ""}${m.name} (${m.dosage || "1+0+1"})`
      ),
      medicines: currentMeds.map((m) =>
        typeof m === "string" ? { name: m, dosage: "", form: "Tab", timing: "", duration: "" } : { ...m }
      ),
      medsStructured: [...currentMeds],
      diagnosis: diagnosis,
      refillDate: refillDate,
      followUp: refillDate,
      urgency: urgency,
      notes: notes,
      advice: notes,
      files: [...pendingFiles],
      type: pendingFiles.length > 0 ? "vault_upload" : "vault_form",
      source: "prescriptions-volt",
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

    // Reset form controls and clear scan focus highlights
    clearOcrHighlights();
    const form = $("rxForm");
    if (form) form.reset();
    if ($("rxDate")) $("rxDate").value = new Date().toISOString().split("T")[0];
    if ($("rxRefill")) {
      const defRefill = new Date();
      defRefill.setDate(defRefill.getDate() + 14);
      $("rxRefill").value = defRefill.toISOString().split("T")[0];
    }
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

    const isBn = currentLang === "bn";
    rxToast(
      isBn ? "প্রেসক্রিপশন সফলভাবে ভল্টে সংরক্ষিত হয়েছে!" : "Prescription saved to vault successfully!",
      "success",
      {
        text: isBn ? "ইতিহাস দেখুন →" : "View History →",
        href: "prescription-history.html"
      }
    );
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
  function rxToast(message, type = "info", action = null) {
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

    const contentHtml = typeof message === "string" && message.includes("<") ? message : escapeHtml(message);
    const actionHtml = action
      ? `<a href="${escapeHtml(action.href)}" class="btn btn-sm btn-outline-light rounded-pill px-2.5 py-0.5 text-xs fw-semibold text-nowrap">${escapeHtml(action.text)}</a>`
      : "";

    toast.innerHTML = `
      <div class="d-flex align-items-center justify-content-between w-100 gap-2">
        <div class="d-flex align-items-center gap-2">
          <i class="bi ${icon} fs-5"></i>
          <span>${contentHtml}</span>
        </div>
        ${actionHtml}
      </div>
    `;

    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(15px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, action ? 5000 : 3200);
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
