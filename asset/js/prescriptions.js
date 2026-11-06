/**
 * ============================================================================
 * BreatheWell – Prescription Vault Engine  (prescriptions.js)
 * ============================================================================
 * Description:
 *   Complete client-side prescription management system. Handles drag-and-drop
 *   multi-file uploads (images + PDFs), base64 compression & storage in
 *   localStorage, metadata entry (doctor, clinic, date, medications, refill),
 *   full-screen lightbox viewer with file-strip navigation, gallery with live
 *   search / category filter / sort, JSON export/import for family sharing,
 *   read-only URL-encoded view mode, and an in-page toast notification system.
 *
 * Table of Contents:
 *   1.  Constants & Configuration
 *   2.  LocalStorage Data Layer
 *   3.  Internationalization (Bengali / English)
 *   4.  Utility Helpers
 *   5.  Image Compression Engine
 *   6.  Upload Zone — Drag & Drop & File Picker
 *   7.  Pending Upload Queue & Preview Strip
 *   8.  Metadata Form — Save Prescription
 *   9.  Gallery Render (cards, search, filter, sort)
 *   10. Prescription Card HTML Builder
 *   11. Lightbox / Full-screen Viewer
 *   12. Delete & Edit Actions
 *   13. Share & Export Engine (JSON, URL, Print)
 *   14. Family Import (JSON restore)
 *   15. Storage Gauge
 *   16. Toast Notification System
 *   17. Language Toggle
 *   18. Application Bootstrap
 * ============================================================================
 */

/* ============================================================================
 * 1. CONSTANTS & CONFIGURATION
 * ============================================================================ */

/** localStorage key for all prescription records */
const RX_KEY = "bw_prescriptions";
/** localStorage key for language preference */
const RX_LANG_KEY = "bw_lang";
/** localStorage key for prescriptions PIN */
const RX_PIN_KEY = "bw_rx_pin";

/** Maximum compressed image dimension (px) before base64 storage */
const MAX_IMG_DIM = 1200;

/** JPEG quality for canvas compression (0–1) */
const JPEG_QUALITY = 0.72;

/** Maximum total localStorage usage before warning (bytes, ~4 MB) */
const STORAGE_WARN_BYTES = 4 * 1024 * 1024;

/** Supported MIME types */
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

/** Gallery records per render (all shown, no server pagination needed) */

/* ============================================================================
 * 1b. OCR ENGINE (Tesseract.js v5 — browser-based, no server needed)
 * ============================================================================ */

/**
 * Singleton Tesseract worker instance.
 * Lazily created on first OCR request to avoid startup cost.
 * @type {import('tesseract.js').Worker|null}
 */
let ocrWorker = null;

/**
 * Initialises (or returns cached) Tesseract worker loaded with Bengali+English.
 * @returns {Promise<import('tesseract.js').Worker>}
 */
async function rxInitOCR() {
    if (ocrWorker) return ocrWorker;
    // Tesseract.js v5 API: createWorker(lang)
    ocrWorker = await Tesseract.createWorker("ben+eng", 1, {
        // suppress verbose Tesseract console logs
        logger: () => {}
    });
    return ocrWorker;
}

/**
 * Runs OCR on a base64 image data URL and returns extracted raw text.
 * @param {string} imageDataUrl  base64 data URL of the image
 * @returns {Promise<string>}
 */
async function rxRunOCR(imageDataUrl) {
    const worker = await rxInitOCR();
    const { data: { text } } = await worker.recognize(imageDataUrl);
    return text || "";
}

/**
 * Heuristically parses OCR text from a Bengali/English prescription.
 * Extracts: doctor, clinic, medication names, diagnosis, refill date.
 *
 * @param {string} text  Raw OCR output
 * @returns {{ doctor: string, clinic: string, meds: string[], diagnosis: string, refillDate: string }}
 */
function rxParseOCRText(text) {
    const result = { doctor: "", clinic: "", meds: [], diagnosis: "", refillDate: "" };
    if (!text) return result;

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    // ── Doctor name ───────────────────────────────────────────────────────────
    // Look for "Dr.", "Dr", "ডাঃ", "ডক্তার" prefixes
    for (const line of lines) {
        const m = line.match(/(?:Dr\.?\s*|ডাঃ\s*|ডক্তার\s*)([A-Za-z\u0980-\u09FF][A-Za-z\u0980-\u09FF\s\.]{2,50})/i);
        if (m && !result.doctor) {
            result.doctor = m[1].trim().replace(/\s+/g, " ");
        }
    }

    // ── Clinic / Hospital name ────────────────────────────────────────────────
    for (const line of lines) {
        if (/hospital|clinic|centre|center|infirmary|হাসপাতাল|ক্লিনিক|স্বাস্থ্যকেন্দ্র|মেডিকেল/i.test(line) && !result.clinic) {
            result.clinic = line.trim().slice(0, 100);
        }
    }

    // ── Medications ───────────────────────────────────────────────────────────
    // Strategy: numbered lines, Rx header, common drug keywords
    let inMedSection = false;
    for (const line of lines) {
        // Detect start of medication section
        if (/^(?:Rx|℞|R\/|medication|medicine|ওষুধ|ট্যাবলেট|cap\.|tab\.)/i.test(line)) {
            inMedSection = true;
        }
        // Numbered or bulleted list items → likely a drug name
        const numMatch = line.match(/^(?:\d+[\.\)]\s*|[•\-]\s*)([A-Za-z\u0980-\u09FF][A-Za-z\u0980-\u09FF\s]{2,40})/);
        if (numMatch && inMedSection) {
            const med = numMatch[1].split(/[\s,]+/)[0];
            if (med.length > 2 && !result.meds.includes(med)) {
                result.meds.push(med);
            }
        }
        // Even outside section, lines starting with capitals that look like brand names
        const capMatch = line.match(/^([A-Z][a-z]{3,}(?:\s+[A-Z]?[a-z]+)?)\s+(?:\d+\s*mg|\d+\s*ml|\d+\s*tab)/i);
        if (capMatch && !result.meds.includes(capMatch[1])) {
            result.meds.push(capMatch[1]);
        }
    }

    // ── Diagnosis / Condition ─────────────────────────────────────────────────
    for (const line of lines) {
        const m = line.match(/(?:Dx|Diagnosis|Condition|রোগনির্ণয়|রোগ|অসুখ)[:\-\s]\s*(.{3,100})/i);
        if (m && !result.diagnosis) {
            result.diagnosis = m[1].trim();
        }
    }

    // ── Refill / Next visit date ──────────────────────────────────────────────
    for (const line of lines) {
        const m = line.match(/(?:next\s+visit|follow.?up|refill|পরবর্তী|আবার\s+আসুন)[^0-9]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i);
        if (m && !result.refillDate) {
            const parts = m[1].split(/[\/\-\.]/);
            if (parts.length === 3) {
                // Guess DD/MM/YYYY format (most common in BD)
                const yr = parts[2].length === 2 ? "20" + parts[2] : parts[2];
                const mm = parts[1].padStart(2, "0");
                const dd = parts[0].padStart(2, "0");
                result.refillDate = `${yr}-${mm}-${dd}`;
            }
        }
    }

    return result;
}

/**
 * Orchestrates OCR on the first pending image file (PDFs are skipped).
 * Shows a status banner below the upload zone, then fills the metadata form.
 *
 * @param {string} imageDataUrl  Compressed JPEG data URL
 */
async function rxProcessOCR(imageDataUrl) {
    const status = $r("rxOcrStatus");

    // Show loading state
    if (status) {
        status.className = "rx-ocr-status loading";
        status.innerHTML = `<i class="bi bi-cpu-fill me-2"></i>
            <span>OCR বিশ্লেষণ চলছে — ছবি থেকে তথ্য পড়া হচ্ছে…</span>
            <span class="rx-ocr-spinner ms-2"></span>`;
        status.classList.remove("d-none");
    }

    try {
        const rawText = await rxRunOCR(imageDataUrl);
        const parsed  = rxParseOCRText(rawText);

        // Pre-fill form fields — only if the user hasn't typed anything yet
        if (parsed.doctor    && !$r("rxDoctor")?.value.trim())    $r("rxDoctor").value    = parsed.doctor;
        if (parsed.clinic    && !$r("rxClinic")?.value.trim())    $r("rxClinic").value    = parsed.clinic;
        if (parsed.diagnosis && !$r("rxDiagnosis")?.value.trim()) $r("rxDiagnosis").value = parsed.diagnosis;
        if (parsed.refillDate && !$r("rxRefill")?.value)          $r("rxRefill").value    = parsed.refillDate;

        // Add extracted meds as chips
        parsed.meds.forEach(med => {
            if (!currentMeds.includes(med)) rxAddMed(med);
        });

        const foundItems = [];
        if (parsed.doctor)         foundItems.push("ডাক্তার");
        if (parsed.meds.length)    foundItems.push(`${parsed.meds.length}টি ওষুধ`);
        if (parsed.diagnosis)      foundItems.push("রোগনির্ণয়");
        if (parsed.refillDate)     foundItems.push("পরবর্তী তারিখ");

        if (status) {
            status.className = "rx-ocr-status success";
            const summary = foundItems.length
                ? `${foundItems.join(", ")} পাওয়া গেছে।`
                : "কোনো স্বীকৃত তথ্য পাওয়া যায়নি — নিচে ম্যানুয়ালি পূরণ করুন।";
            status.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i><span>OCR সম্পন্ন। ${summary}</span>`;
        }
    } catch (err) {
        console.warn("[BreatheWell OCR] Error:", err);
        if (status) {
            status.className = "rx-ocr-status error";
            status.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>
                <span>OCR ব্যর্থ হয়েছে। দয়া করে তথ্য ম্যানুয়ালি পূরণ করুন।</span>`;
        }
    }
}

/* ============================================================================
 * 2. LOCALSTORAGE DATA LAYER
 * ============================================================================ */

/**
 * @typedef {Object} RxFile
 * @property {string}  name     - Original filename
 * @property {string}  mime     - MIME type
 * @property {string}  data     - base64 data URL
 * @property {number}  size     - Compressed byte size (approx)
 */

/**
 * @typedef {Object} Prescription
 * @property {string}    id         - UUID
 * @property {string}    createdAt  - ISO date added
 * @property {string}    prescDate  - Prescription date (ISO date)
 * @property {string}    doctor     - Doctor name
 * @property {string}    clinic     - Clinic / hospital name
 * @property {string[]}  meds       - Medication names
 * @property {string}    diagnosis  - Diagnosis / condition note
 * @property {string}    refillDate - Next refill date (ISO date)
 * @property {string}    urgency    - "normal" | "followup" | "urgent"
 * @property {string}    notes      - Free-text notes
 * @property {RxFile[]}  files      - Uploaded file data array
 */

/**
 * Loads all prescriptions from localStorage.
 * @returns {Prescription[]} Sorted newest-first.
 */
function rxLoad() {
    try {
        const raw = localStorage.getItem(RX_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch { return []; }
}

/**
 * Persists the given prescriptions array to localStorage.
 * @param {Prescription[]} records
 */
function rxSave(records) {
    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    localStorage.setItem(RX_KEY, JSON.stringify(records));
}

/**
 * Lightweight UUID v4 generator.
 * @returns {string}
 */
function rxUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}

/* ============================================================================
 * 3. INTERNATIONALIZATION (Bengali / English)
 * ============================================================================ */

/** Active language */
let rxLang = localStorage.getItem(RX_LANG_KEY) || "bn";

/** Translation table */
const RX_T = {
    bn: {
        skip: "মূল কনটেন্টে যান",
        navHome: "হোম", navExercises: "অনুশীলন", navTest: "শ্বাসের পরীক্ষা",
        navHealth: "স্বাস্থ্য ট্র্যাকার", navRx: "প্রেসক্রিপশন", navSafety: "নিরাপত্তা",

        heroEyebrow: "ডিজিটাল স্বাস্থ্য সংরক্ষণ",
        heroTitle: "প্রেসক্রিপশন ভল্ট",
        heroSub: "আপনার ডাক্তারের প্রেসক্রিপশন সংরক্ষণ করুন এবং পরিবারের সাথে শেয়ার করুন।",

        storageLabel: "স্টোরেজ ব্যবহার",
        storageCount: "টি প্রেসক্রিপশন",

        uploadTitle: "প্রেসক্রিপশন আপলোড করুন",
        uploadSub: "ছবি বা PDF ড্র্যাগ করুন অথবা ক্লিক করে বেছে নিন",
        uploadPick: "ফাইল বেছে নিন",

        formTitle: "প্রেসক্রিপশন তথ্য",
        formSub: "ডাক্তারের তথ্য ও ওষুধের তালিকা যোগ করুন",
        lblDoctor: "ডাক্তারের নাম",
        lblClinic: "ক্লিনিক / হাসপাতাল",
        lblDate: "প্রেসক্রিপশনের তারিখ",
        lblMeds: "ওষুধের তালিকা",
        medsPlaceholder: "ওষুধের নাম লিখুন, Enter চাপুন",
        lblDiagnosis: "রোগনির্ণয় / অসুস্থতা",
        lblRefill: "পরবর্তী রিফিলের তারিখ",
        lblUrgency: "জরুরিত্ব",
        urgNormal: "স্বাভাবিক",
        urgFollowup: "ফলো-আপ প্রয়োজন",
        urgUrgent: "জরুরি",
        lblNotes: "নোট (ঐচ্ছিক)",
        btnSave: "প্রেসক্রিপশন সংরক্ষণ করুন",

        galleryTitle: "সংরক্ষিত প্রেসক্রিপশন",
        searchPh: "ডাক্তার বা ওষুধ খুঁজুন...",
        filterAll: "সব",
        filterNormal: "স্বাভাবিক",
        filterFollowup: "ফলো-আপ",
        filterUrgent: "জরুরি",
        sortNew: "নতুন আগে",
        sortOld: "পুরনো আগে",
        sortDoctor: "ডাক্তার",
        colDate: "তারিখ",
        moreFiles: "+{n}টি ফাইল",
        moreMeds: "+{n}টি আরও",
        refillDue: "রিফিল বাকি!",
        refillSoon: "শীঘ্রই",
        refillOk: "রিফিল ঠিক আছে",

        openBtn: "দেখুন",
        btnDownload: "ডাউনলোড",
        btnClose: "বন্ধ করুন",
        btnPrev: "পূর্ববর্তী",
        btnNext: "পরবর্তী",

        shareTitle: "পরিবারের সাথে শেয়ার করুন",
        shareSub: "আপনার ছেলে বা মেয়ে দূর থেকে প্রেসক্রিপশন দেখতে পারবেন",
        shareBadge: "পারিবারিক শেয়ার ও ব্যাকআপ",
        shareCardExportTitle: "শেয়ার ও এক্সপোর্ট অপশন",
        shareSecurityBadge: "নিরাপদ ও রিড-অনলি",
        btnWhatsAppShare: "হোয়াটসঅ্যাপে ছেলে/মেয়েকে পাঠান",
        msgPreviewTitle: "মেসেজের প্রিভিউ:",
        btnCopyReport: "মেসেজ কপি করুন",
        btnCopySummary: "টেক্সট সামারি",
        btnJson: "JSON ব্যাকআপ",
        btnLink: "শেয়ার লিংক (তথ্য মাত্র)",
        btnPrint: "প্রিন্ট করুন",
        btnCopy: "কপি",
        btnCopied: "কপি ✓",
        linkNote: "শেয়ার লিংকে ফাইল থাকবে না — শুধু প্রেসক্রিপশন তথ্য থাকবে। পূর্ণ ব্যাকআপের জন্য JSON ব্যবহার করুন।",

        familyTitle: "পরিবার দেখার মোড",
        familyDesc: "JSON ব্যাকআপ পরিবারকে পাঠান। তারা এখানে আমদানি করলে শুধু দেখতে পাবেন।",
        step1Title: "ব্যাকআপ তৈরি",
        step1Desc: "JSON ব্যাকআপ বা মেসেজ কপি করে ছেলে/মেয়েকে পাঠান",
        step2Title: "ফ্যামিলি ইমপোর্ট",
        step2Desc: "পরিবারের সদস্য এখানে ফাইল ড্রপ করে সহজেই লোড করতে পারেন",
        step3Title: "রিড-অনলি মনিটরিং",
        step3Desc: "কোনো ডেটা ডিলিট বা এডিট হওয়ার ঝুঁকি ছাড়া সুরক্ষিত দেখা যাবে",
        importDropTitle: "JSON ব্যাকআপ ফাইল ড্রপ করুন অথবা বেছে নিন",
        importDropHint: "BreatheWell ব্যাকআপ ফাইল (.json) সমর্থিত",
        importBtn: "JSON আমদানি করুন",
        importSub: "পরিবারের কাছ থেকে প্রাপ্ত JSON ফাইল",
        importMergeBtn: "নতুনগুলো যোগ করুন (Merge)",
        importReplaceBtn: "সম্পূর্ণ প্রতিস্থাপন (Replace)",
        importCancelBtn: "বাতিল",
        btnTestView: "পরিবার কীভাবে দেখবে তা পরীক্ষা করুন",

        noRx: "কোনো প্রেসক্রিপশন নেই",
        noRxSub: "উপরে ফাইল আপলোড করুন",

        toastSaved: "প্রেসক্রিপশন সংরক্ষিত হয়েছে",
        toastDeleted: "মুছে ফেলা হয়েছে",
        toastCopied: "লিংক কপি হয়েছে",
        toastJsonDone: "JSON ডাউনলোড হয়েছে",
        toastImported: "প্রেসক্রিপশন আমদানি হয়েছে",
        toastMsgCopied: "হোয়াটসঅ্যাপ মেসেজ কপি হয়েছে!",
        toastSummaryCopied: "প্রেসক্রিপশন সামারি কপি হয়েছে!",
        toastImportEmpty: "ফাইলে কোনো বৈধ প্রেসক্রিপশন পাওয়া যায়নি",
        toastImportMergeDone: "{n}টি নতুন প্রেসক্রিপশন ভল্টে যোগ করা হয়েছে!",
        toastImportReplaceDone: "ভল্ট সফলভাবে প্রতিস্থাপিত হয়েছে ({n}টি প্রেসক্রিপশন)!",
        toastNoFile: "কোনো ফাইল বাছাই করা হয়নি",
        toastBadType: "শুধু JPG, PNG, WebP বা PDF আপলোড করুন",
        toastTooBig: "স্টোরেজ প্রায় পূর্ণ! কিছু পুরনো এন্ট্রি মুছুন",
        toastNoMeta: "ডাক্তারের নাম অথবা তারিখ আবশ্যক",
        confirmDelete: "এই প্রেসক্রিপশন মুছে ফেলবেন?",

        viewModeMsg: "পরিবার দেখার মোড চালু আছে। মোট {n}টি প্রেসক্রিপশন দেখানো হচ্ছে।",
        footerTag: "প্রতিটি নিঃশ্বাসে একটি প্রশান্তি",
        footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।",
        langToggle: "English",
    },
    en: {
        skip: "Skip to main content",
        navHome: "Home", navExercises: "Exercises", navTest: "Breath Test",
        navHealth: "Health Tracker", navRx: "Prescriptions", navSafety: "Safety",

        heroEyebrow: "Digital Health Vault",
        heroTitle: "Prescription Vault",
        heroSub: "Store your doctor's prescriptions and share them with family members.",

        storageLabel: "Storage used",
        storageCount: "prescriptions",

        uploadTitle: "Upload Prescription",
        uploadSub: "Drag & drop images or PDFs, or click to browse",
        uploadPick: "Browse files",

        formTitle: "Prescription Details",
        formSub: "Add doctor info and medication list",
        lblDoctor: "Doctor Name",
        lblClinic: "Clinic / Hospital",
        lblDate: "Prescription Date",
        lblMeds: "Medications",
        medsPlaceholder: "Type medicine name, press Enter",
        lblDiagnosis: "Diagnosis / Condition",
        lblRefill: "Next Refill Date",
        lblUrgency: "Urgency",
        urgNormal: "Normal",
        urgFollowup: "Follow-up needed",
        urgUrgent: "Urgent",
        lblNotes: "Notes (optional)",
        btnSave: "Save Prescription",

        galleryTitle: "Saved Prescriptions",
        searchPh: "Search by doctor or medicine...",
        filterAll: "All",
        filterNormal: "Normal",
        filterFollowup: "Follow-up",
        filterUrgent: "Urgent",
        sortNew: "Newest first",
        sortOld: "Oldest first",
        sortDoctor: "By doctor",
        colDate: "Date",
        moreFiles: "+{n} files",
        moreMeds: "+{n} more",
        refillDue: "Refill due!",
        refillSoon: "Refill soon",
        refillOk: "Refill OK",

        openBtn: "View",
        btnDownload: "Download",
        btnClose: "Close",
        btnPrev: "Previous",
        btnNext: "Next",

        shareTitle: "Share with Family",
        shareSub: "Your son or daughter can remotely view prescriptions",
        shareBadge: "Family Sharing & Backup",
        shareCardExportTitle: "Share & Export Options",
        shareSecurityBadge: "Secure & Read-Only",
        btnWhatsAppShare: "Send to Son/Daughter via WhatsApp",
        msgPreviewTitle: "WhatsApp Message Preview:",
        btnCopyReport: "Copy Message",
        btnCopySummary: "Text Summary",
        btnJson: "JSON Backup",
        btnLink: "Share Link (metadata only)",
        btnPrint: "Print",
        btnCopy: "Copy",
        btnCopied: "Copied ✓",
        linkNote: "Share link contains metadata only — no files. Use JSON backup for full data.",

        familyTitle: "Family View Mode",
        familyDesc: "Send the JSON backup to family. They import it here to view (read-only).",
        step1Title: "Create Backup",
        step1Desc: "Download JSON backup or copy message for your son/daughter",
        step2Title: "Family Import",
        step2Desc: "Family members drop the file here to easily load it",
        step3Title: "Read-Only Monitoring",
        step3Desc: "Safe remote tracking with zero risk of accidental editing or deletion",
        importDropTitle: "Drop JSON backup file here or click to browse",
        importDropHint: "BreatheWell vault backup file (.json) supported",
        importBtn: "Import JSON",
        importSub: "JSON file received from family member",
        importMergeBtn: "Add to Existing (Merge)",
        importReplaceBtn: "Replace Entire Vault (Replace)",
        importCancelBtn: "Cancel",
        btnTestView: "Test How Family Sees This",

        noRx: "No prescriptions yet",
        noRxSub: "Upload a file above to get started",

        toastSaved: "Prescription saved",
        toastDeleted: "Deleted successfully",
        toastCopied: "Link copied to clipboard",
        toastJsonDone: "JSON downloaded",
        toastImported: "Prescriptions imported",
        toastMsgCopied: "WhatsApp message copied to clipboard!",
        toastSummaryCopied: "Prescription summary copied to clipboard!",
        toastImportEmpty: "No valid prescriptions found in file",
        toastImportMergeDone: "{n} new prescription(s) added to vault!",
        toastImportReplaceDone: "Vault replaced successfully ({n} prescriptions)!",
        toastNoFile: "No files selected",
        toastBadType: "Only JPG, PNG, WebP or PDF supported",
        toastTooBig: "Storage nearly full! Delete older entries",
        toastNoMeta: "Doctor name or date is required",
        confirmDelete: "Delete this prescription?",

        viewModeMsg: "Family view mode active. Showing {n} prescription(s).",
        footerTag: "A little calm with every breath",
        footerDisclaimer: "For general wellness. Not a substitute for medical advice.",
        langToggle: "বাংলা",
    }
};

/**
 * Returns a translated string.
 * @param {string} key
 * @returns {string}
 */
function rx(key) {
    return (RX_T[rxLang] && RX_T[rxLang][key]) || RX_T.bn[key] || key;
}

/* ============================================================================
 * 4. UTILITY HELPERS
 * ============================================================================ */

/** @param {string} id @returns {HTMLElement|null} */
const $r = id => document.getElementById(id);

/**
 * Formats ISO date string for display.
 * @param {string} iso
 * @returns {string}
 */
function rxFmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString(rxLang === "bn" ? "bn-BD" : "en-GB",
        { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Returns "YYYY-MM-DD" for today (for date input defaults).
 * @returns {string}
 */
function rxToday() {
    return new Date().toISOString().slice(0, 10);
}

/**
 * Formats bytes to human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
function rxFmtBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Returns days until refill date (negative = overdue).
 * @param {string} refillDate
 * @returns {number}
 */
function rxDaysUntilRefill(refillDate) {
    if (!refillDate) return Infinity;
    const diff = new Date(refillDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ============================================================================
 * 5. IMAGE COMPRESSION ENGINE
 * ============================================================================ */

/**
 * Reads a File as a data URL (base64).
 * @param {File} file
 * @returns {Promise<string>}
 */
function rxReadFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Compresses an image file by resizing on a canvas and re-encoding as JPEG.
 * PDFs are stored as-is (base64 of the original file data).
 * @param {File} file
 * @returns {Promise<{ name: string, mime: string, data: string, size: number }>}
 */
async function rxCompressFile(file) {
    if (file.type === "application/pdf") {
        const data = await rxReadFile(file);
        return { name: file.name, mime: file.type, data, size: data.length };
    }

    const dataUrl = await rxReadFile(file);

    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;
            const scale = Math.min(1, MAX_IMG_DIM / Math.max(width, height));
            width = Math.round(width * scale);
            height = Math.round(height * scale);

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const compressed = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
            resolve({ name: file.name, mime: "image/jpeg", data: compressed, size: compressed.length });
        };
        img.src = dataUrl;
    });
}

/* ============================================================================
 * 6. UPLOAD ZONE — DRAG & DROP & FILE PICKER
 * ============================================================================ */

/** Files queued for the current prescription entry (not yet saved) */
let pendingFiles = [];

/**
 * Handles files selected via input or dropped via drag-and-drop.
 * Validates type, compresses, and adds to pendingFiles queue.
 * @param {FileList|File[]} fileList
 */
async function rxHandleFiles(fileList) {
    const files = Array.from(fileList);
    if (!files.length) return;

    // Validate types
    const invalid = files.filter(f => !ALLOWED_TYPES.includes(f.type));
    if (invalid.length) { rxToast(rx("toastBadType"), "error", "bi-x-circle"); return; }

    const zone = $r("rxUploadZone");
    const prog = $r("rxProgress");
    const fill = $r("rxProgressFill");
    const lbl = $r("rxProgressLabel");

    if (prog) prog.classList.add("visible");

    for (let i = 0; i < files.length; i++) {
        const pct = Math.round(((i + 1) / files.length) * 100);
        if (fill) fill.style.width = pct + "%";
        if (lbl) lbl.textContent = `${i + 1} / ${files.length}`;

        const compressed = await rxCompressFile(files[i]);
        pendingFiles.push(compressed);

        // OCR: run on the first image file only (PDFs cannot be OCR'd client-side)
        if (i === 0 && compressed.mime !== "application/pdf") {
            rxProcessOCR(compressed.data); // fire-and-forget — fills form asynchronously
        }
    }

    if (prog) {
        setTimeout(() => { prog.classList.remove("visible"); if (fill) fill.style.width = "0%"; }, 600);
    }

    rxRenderPreview();
    if (zone) zone.classList.remove("drag-over");
}

/** Binds drag-and-drop events to the upload zone. */
function rxBindUploadZone() {
    const zone = $r("rxUploadZone");
    const input = $r("rxFileInput");
    if (!zone || !input) return;

    // Click on zone triggers file picker
    zone.addEventListener("click", e => {
        if (e.target === input) return;
        input.click();
    });

    input.addEventListener("change", () => {
        if (input.files.length) rxHandleFiles(input.files);
        input.value = "";  // reset so same file can be re-picked
    });

    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", e => { if (!zone.contains(e.relatedTarget)) zone.classList.remove("drag-over"); });
    zone.addEventListener("drop", e => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        rxHandleFiles(e.dataTransfer.files);
    });
}

/* ============================================================================
 * 7. PENDING UPLOAD QUEUE & PREVIEW STRIP
 * ============================================================================ */

/** Renders the preview strip of pending (not-yet-saved) files. */
function rxRenderPreview() {
    const strip = $r("rxPreviewStrip");
    if (!strip) return;

    if (!pendingFiles.length) {
        strip.innerHTML = "";
        return;
    }

    strip.innerHTML = pendingFiles.map((f, i) => {
        if (f.mime === "application/pdf") {
            return `<div class="rx-preview-pdf" title="${f.name}">📄<button class="rx-remove-preview" onclick="rxRemovePending(${i})" aria-label="Remove">✕</button></div>`;
        }
        return `<div style="position:relative;display:inline-block">
      <img src="${f.data}" class="rx-preview-thumb" alt="${f.name}" title="${f.name}">
      <button class="rx-remove-preview" onclick="rxRemovePending(${i})" aria-label="Remove">✕</button>
    </div>`;
    }).join("");
}

/**
 * Removes a file from the pending queue by index.
 * @param {number} index
 */
function rxRemovePending(index) {
    pendingFiles.splice(index, 1);
    rxRenderPreview();
}

/* ============================================================================
 * 8. METADATA FORM — SAVE PRESCRIPTION
 * ============================================================================ */

/** Active medication tags for the current form entry */
let currentMeds = [];

/**
 * Adds a medication chip from the tag input.
 * @param {string} name
 */
function rxAddMed(name) {
    const trimmed = name.trim();
    if (!trimmed || currentMeds.includes(trimmed)) return;
    currentMeds.push(trimmed);
    rxRenderMedTags();
}

/**
 * Removes a medication chip by name.
 * @param {string} name
 */
function rxRemoveMed(name) {
    currentMeds = currentMeds.filter(m => m !== name);
    rxRenderMedTags();
}

/** Renders the medication tag chips in the tag input container. */
function rxRenderMedTags() {
    const wrap = $r("rxMedTagsWrap");
    const tagInput = $r("rxMedInput");
    if (!wrap) return;

    // Remove old chips (keep the input)
    wrap.querySelectorAll(".rx-med-tag").forEach(t => t.remove());

    currentMeds.forEach(med => {
        const chip = document.createElement("span");
        chip.className = "rx-med-tag";
        chip.innerHTML = `${med}<button onclick="rxRemoveMed('${med.replace(/'/g, "\\'")}')">✕</button>`;
        wrap.insertBefore(chip, tagInput || null);
    });
}

/**
 * Handles the prescription metadata form submit.
 * Validates, assembles the Prescription record, saves to localStorage.
 * @param {Event} e
 */
function rxHandleSave(e) {
    e.preventDefault();

    const doctor = $r("rxDoctor")?.value.trim() || "";
    const clinic = $r("rxClinic")?.value.trim() || "";
    const date = $r("rxDate")?.value || rxToday();
    const diag = $r("rxDiagnosis")?.value.trim() || "";
    const refill = $r("rxRefill")?.value || "";
    const urgency = $r("rxUrgency")?.value || "normal";
    const notes = $r("rxNotes")?.value.trim() || "";

    // At least doctor name OR files must be present
    if (!doctor && !pendingFiles.length) {
        rxToast(rx("toastNoMeta"), "warn", "bi-exclamation-triangle");
        return;
    }

    // Check storage headroom
    const used = (localStorage.getItem(RX_KEY) || "").length;
    const totalAdded = pendingFiles.reduce((sum, f) => sum + f.size, 0);
    if (used + totalAdded > STORAGE_WARN_BYTES * 1.3) {
        rxToast(rx("toastTooBig"), "warn", "bi-hdd");
        return;
    }

    /** @type {Prescription} */
    const record = {
        id: rxUUID(),
        createdAt: new Date().toISOString(),
        prescDate: date,
        doctor, clinic,
        meds: [...currentMeds],
        diagnosis: diag,
        refillDate: refill,
        urgency, notes,
        files: [...pendingFiles],
    };

    const all = rxLoad();
    all.unshift(record);
    rxSave(all);

    // Reset form
    pendingFiles = [];
    currentMeds = [];
    rxRenderPreview();
    rxRenderMedTags();
    if ($r("rxForm")) $r("rxForm").reset();
    if ($r("rxDate")) $r("rxDate").value = rxToday();

    rxRenderGallery();
    rxUpdateStorage();
    rxRefreshShareLink();
    rxToast(rx("toastSaved"), "success", "bi-check-circle-fill");
}

/** Binds the medication tag input keyboard handler. */
function rxBindMedInput() {
    const input = $r("rxMedInput");
    if (!input) return;

    input.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            rxAddMed(input.value);
            input.value = "";
        }
        if (e.key === "Backspace" && !input.value && currentMeds.length) {
            currentMeds.pop();
            rxRenderMedTags();
        }
    });

    // Clicking the wrap focuses the input
    $r("rxMedTagsWrap")?.addEventListener("click", () => input.focus());
}

/* ============================================================================
 * 9. GALLERY RENDER (cards, search, filter, sort)
 * ============================================================================ */

/** Active gallery state */
let galleryFilter = "all";
let gallerySort = "newest";
let gallerySearch = "";
/** Is the page in read-only view mode (family share URL) */
let viewMode = false;
/** Records to show in view mode (decoded from URL) */
let viewModeRecords = [];

/**
 * Derives the display dataset applying search + filter + sort.
 * @returns {Prescription[]}
 */
function rxGetDisplayRecords() {
    let records = viewMode ? viewModeRecords : rxLoad();

    // Filter by urgency
    if (galleryFilter !== "all") {
        records = records.filter(r => r.urgency === galleryFilter);
    }

    // Search
    if (gallerySearch) {
        const q = gallerySearch.toLowerCase();
        records = records.filter(r =>
            r.doctor.toLowerCase().includes(q) ||
            r.clinic.toLowerCase().includes(q) ||
            r.diagnosis.toLowerCase().includes(q) ||
            r.meds.some(m => m.toLowerCase().includes(q))
        );
    }

    // Sort
    if (gallerySort === "oldest") records = [...records].sort((a, b) => new Date(a.prescDate) - new Date(b.prescDate));
    if (gallerySort === "doctor") records = [...records].sort((a, b) => a.doctor.localeCompare(b.doctor));
    if (gallerySort === "newest") records = [...records].sort((a, b) => new Date(b.prescDate) - new Date(a.prescDate));

    return records;
}

/** Renders the full gallery. */
function rxRenderGallery() {
    const gallery = $r("rxGallery");
    if (!gallery) return;

    const records = rxGetDisplayRecords();

    if (!records.length) {
        gallery.innerHTML = `
      <div class="rx-empty">
        <span class="rx-empty-icon">📋</span>
        <div class="rx-empty-title">${rx("noRx")}</div>
        <div class="rx-empty-desc">${rx("noRxSub")}</div>
      </div>`;
        return;
    }

    gallery.innerHTML = records.map((r, i) => rxCardHTML(r, i)).join("");
}

/* ============================================================================
 * 10. PRESCRIPTION CARD HTML BUILDER
 * ============================================================================ */

/**
 * Builds the HTML for a single prescription card.
 * @param {Prescription} rx
 * @param {number} index
 * @returns {string}
 */
function rxCardHTML(r, index) {
    const delay = Math.min(index * 50, 400);
    const fileCount = r.files?.length || 0;
    const firstFile = r.files?.[0];

    // Thumbnail HTML
    let thumbHTML;
    if (!firstFile) {
        thumbHTML = `<div class="rx-card-thumb-pdf"><i class="bi bi-file-earmark-text"></i><span>NO FILE</span></div>`;
    } else if (firstFile.mime === "application/pdf") {
        thumbHTML = `<div class="rx-card-thumb-pdf"><i class="bi bi-file-earmark-pdf-fill"></i><span>PDF</span></div>`;
    } else {
        thumbHTML = `<img src="${firstFile.data}" alt="Prescription" loading="lazy">`;
    }

    // Multiple files badge
    const moreBadge = fileCount > 1
        ? `<span class="rx-files-count">${rx("moreFiles").replace("{n}", fileCount - 1)}</span>`
        : "";

    // Urgency ribbon
    const urgencyMap = {
        normal: rx("urgNormal"),
        followup: rx("urgFollowup"),
        urgent: rx("urgUrgent"),
    };
    const ribbon = `<span class="rx-card-ribbon ${r.urgency}">${urgencyMap[r.urgency] || r.urgency}</span>`;

    // Medications chips
    const medsHTML = r.meds?.length
        ? r.meds.slice(0, 3).map(m => `<span class="rx-card-med-chip">${m}</span>`).join("")
        + (r.meds.length > 3 ? `<span class="rx-card-med-more">${rx("moreMeds").replace("{n}", r.meds.length - 3)}</span>` : "")
        : "";

    // Refill status
    let refillHTML = "";
    if (r.refillDate) {
        const days = rxDaysUntilRefill(r.refillDate);
        if (days < 0) refillHTML = `<span class="rx-card-refill due"><i class="bi bi-exclamation-triangle-fill me-1"></i>${rx("refillDue")}</span>`;
        else if (days <= 7) refillHTML = `<span class="rx-card-refill soon">↺ ${rx("refillSoon")}</span>`;
        else refillHTML = `<span class="rx-card-refill ok">↺ ${rx("refillOk")}</span>`;
    }

    // Action buttons (hidden in view mode)
    const actions = viewMode ? "" : `
    <div class="rx-card-actions">
      <button class="rx-card-btn view" onclick="rxOpenLightbox('${r.id}')" title="${rx('openBtn')}"><i class="bi bi-eye-fill"></i></button>
      <button class="rx-card-btn del"  onclick="rxDelete('${r.id}')" title="Delete"><i class="bi bi-trash3-fill"></i></button>
    </div>`;

    return `
    <div class="rx-card" style="animation-delay:${delay}ms">
      <div class="rx-card-thumb" onclick="rxOpenLightbox('${r.id}')">
        ${thumbHTML}
        <div class="rx-thumb-overlay">
          <button class="rx-open-btn"><i class="bi bi-eye-fill"></i> ${rx("openBtn")}</button>
        </div>
        ${ribbon}
        ${moreBadge}
      </div>
      <div class="rx-card-body">
        <h3 class="rx-card-doctor">${r.doctor || "—"}</h3>
        <div class="rx-card-clinic">${r.clinic || "—"}</div>
        ${medsHTML ? `<div class="rx-card-meds">${medsHTML}</div>` : ""}
        <div class="rx-card-footer">
          <span class="rx-card-date"><i class="bi bi-calendar3"></i> ${rxFmtDate(r.prescDate)}</span>
          ${refillHTML}
          ${actions}
        </div>
      </div>
    </div>`;
}

/* ============================================================================
 * 11. LIGHTBOX / FULL-SCREEN VIEWER
 * ============================================================================ */

/** ID of the prescription currently shown in lightbox */
let lbCurrentId = null;
/** Index of the currently shown file within the prescription */
let lbFileIndex = 0;
/** All prescriptions for lightbox prev/next navigation */
let lbRecordList = [];
/** Index into lbRecordList for the currently shown prescription */
let lbRecordIndex = 0;

/**
 * Opens the lightbox viewer for a prescription record.
 * @param {string} id
 */
function rxOpenLightbox(id) {
    lbRecordList = rxGetDisplayRecords();
    lbRecordIndex = lbRecordList.findIndex(r => r.id === id);
    if (lbRecordIndex < 0) return;
    lbCurrentId = id;
    lbFileIndex = 0;
    rxRenderLightbox();

    const lb = $r("rxLightbox");
    if (lb) {
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
    }
}

/** Closes the lightbox. */
function rxCloseLightbox() {
    const lb = $r("rxLightbox");
    if (lb) {
        lb.classList.remove("open");
        document.body.style.overflow = "";
    }
    lbCurrentId = null;
}

/** Renders the current file in the lightbox. */
function rxRenderLightbox() {
    const record = lbRecordList[lbRecordIndex];
    if (!record) return;

    const files = record.files || [];
    const file = files[lbFileIndex];

    // Title / meta
    const titleEl = $r("lbTitle");
    const metaEl = $r("lbMeta");
    if (titleEl) titleEl.textContent = record.doctor || rx("galleryTitle");
    if (metaEl) metaEl.textContent =
        `${rxFmtDate(record.prescDate)}${record.clinic ? " · " + record.clinic : ""}` +
        (record.meds?.length ? " · " + record.meds.slice(0, 3).join(", ") : "");

    // Main viewer area
    const viewer = $r("lbViewer");
    if (viewer) {
        if (!file) {
            viewer.innerHTML = `<div style="height:300px;display:grid;place-items:center;color:#94a3b8;font-size:3rem">📄</div>`;
        } else if (file.mime === "application/pdf") {
            viewer.innerHTML = `<iframe class="rx-lightbox-pdf" src="${file.data}" title="${file.name}"></iframe>`;
        } else {
            viewer.innerHTML = `<img class="rx-lightbox-img" src="${file.data}" alt="${file.name}">`;
        }
    }

    // File strip (thumbnails)
    const strip = $r("lbStrip");
    if (strip && files.length > 1) {
        strip.innerHTML = files.map((f, i) => {
            const active = i === lbFileIndex ? "active" : "";
            if (f.mime === "application/pdf") {
                return `<div class="rx-lb-strip-pdf-thumb ${active}" onclick="rxLbFile(${i})">📄</div>`;
            }
            return `<img class="rx-lb-strip-thumb ${active}" src="${f.data}" onclick="rxLbFile(${i})" alt="file ${i + 1}">`;
        }).join("");
        strip.style.display = "flex";
    } else if (strip) {
        strip.style.display = "none";
    }

    // Nav prev/next visibility
    const prev = $r("lbPrev");
    const next = $r("lbNext");
    if (prev) prev.style.display = lbRecordIndex > 0 ? "" : "none";
    if (next) next.style.display = lbRecordIndex < lbRecordList.length - 1 ? "" : "none";

    // Download button target
    const dlBtn = $r("lbDownload");
    if (dlBtn && file) {
        dlBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = file.data;
            a.download = file.name || "prescription";
            a.click();
        };
        dlBtn.style.display = "";
    } else if (dlBtn) {
        dlBtn.style.display = "none";
    }
}

/**
 * Switches to a file within the current prescription (file strip).
 * @param {number} index
 */
function rxLbFile(index) {
    lbFileIndex = index;
    rxRenderLightbox();
}

/** Navigates to the previous prescription in the gallery. */
function rxLbPrev() {
    if (lbRecordIndex > 0) {
        lbRecordIndex--;
        lbFileIndex = 0;
        rxRenderLightbox();
    }
}

/** Navigates to the next prescription in the gallery. */
function rxLbNext() {
    if (lbRecordIndex < lbRecordList.length - 1) {
        lbRecordIndex++;
        lbFileIndex = 0;
        rxRenderLightbox();
    }
}

/* ============================================================================
 * 12. DELETE & EDIT ACTIONS
 * ============================================================================ */

/**
 * Deletes a prescription record after confirmation.
 * @param {string} id
 */
function rxDelete(id) {
    if (!confirm(rx("confirmDelete"))) return;
    const all = rxLoad().filter(r => r.id !== id);
    rxSave(all);
    rxRenderGallery();
    rxUpdateStorage();
    rxRefreshShareLink();
    rxToast(rx("toastDeleted"), "info", "bi-trash3");
}

/* ============================================================================
 * 13. SHARE & EXPORT ENGINE (JSON, WhatsApp, URL, Print, Text)
 * ============================================================================ */

/**
 * Exports all prescriptions (including files as base64) as a JSON file.
 * This is the "full backup" for family sharing.
 */
function rxExportJSON() {
    const all = rxLoad();
    if (!all.length) {
        rxToast(rxLang === "bn" ? "কোনো প্রেসক্রিপশন সংরক্ষিত নেই" : "No prescriptions saved", "warn", "bi-exclamation-circle");
        return;
    }
    const json = JSON.stringify({ exported: new Date().toISOString(), prescriptions: all }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `breathewell-prescriptions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    rxToast(rx("toastJsonDone"), "success", "bi-filetype-json");
}

/**
 * Generates a share URL containing prescription metadata (no files — too large).
 * Family opens the URL to get a read-only metadata view.
 * @returns {string}
 */
function rxGenerateShareURL() {
    const all = rxLoad();
    // Strip file data to keep URL compact
    const slim = all.map(r => ({
        id: r.id, prescDate: r.prescDate, doctor: r.doctor, clinic: r.clinic,
        meds: r.meds, diagnosis: r.diagnosis, refillDate: r.refillDate,
        urgency: r.urgency, notes: r.notes, createdAt: r.createdAt,
        files: (r.files || []).map(f => ({ name: f.name, mime: f.mime })), // names only
    }));
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(slim))));
    const base = window.location.href.split("?")[0];
    return `${base}?rxview=${payload}`;
}

/**
 * Generates a well-formatted bilingual WhatsApp summary message.
 * @returns {string}
 */
function rxGenerateWhatsAppMessage() {
    const records = rxLoad();
    const isBn = rxLang === "bn";
    const dateStr = new Date().toLocaleDateString(isBn ? "bn-BD" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });

    if (!records.length) {
        return isBn
            ? `📋 *BreatheWell প্রেসক্রিপশন ভল্ট* (${dateStr})\nবর্তমানে কোনো সংরক্ষিত প্রেসক্রিপশন নেই।`
            : `📋 *BreatheWell Prescription Vault* (${dateStr})\nNo prescriptions currently saved.`;
    }

    const shareUrl = rxGenerateShareURL();
    let msg = isBn
        ? `📋 *BreatheWell প্রেসক্রিপশন সামারি*\n📅 তারিখ: ${dateStr}\n📁 মোট প্রেসক্রিপশন: ${records.length}টি\n\n`
        : `📋 *BreatheWell Prescription Summary*\n📅 Date: ${dateStr}\n📁 Total Prescriptions: ${records.length}\n\n`;

    records.forEach((r, idx) => {
        const num = isBn ? (idx + 1).toLocaleString("bn-BD") : (idx + 1);
        const docName = r.doctor || (isBn ? "ডাক্তারের নাম উল্লেখ নেই" : "Doctor not specified");
        const clinic = r.clinic ? ` (${r.clinic})` : "";
        const pDate = r.prescDate ? rxFmtDate(r.prescDate) : "—";
        const meds = (r.meds && r.meds.length) ? r.meds.join(", ") : (isBn ? "কোনো ওষুধ নেই" : "None");
        const diag = r.diagnosis ? `\n   🩺 ${isBn ? "রোগ" : "Diagnosis"}: ${r.diagnosis}` : "";

        let refillInfo = "";
        if (r.refillDate) {
            const days = rxDaysUntilRefill(r.refillDate);
            if (days < 0) {
                refillInfo = `\n   ⚠️ ${isBn ? "রিফিল বাকি" : "Refill overdue"}: ${rxFmtDate(r.refillDate)}`;
            } else if (days <= 7) {
                refillInfo = `\n   ⏰ ${isBn ? "রিফিল আসন্ন" : "Refill soon"}: ${rxFmtDate(r.refillDate)} (${days} ${isBn ? "দিন বাকি" : "days left"})`;
            } else {
                refillInfo = `\n   🗓️ ${isBn ? "পরবর্তী রিফিল" : "Next refill"}: ${rxFmtDate(r.refillDate)}`;
            }
        }

        msg += `${num}. *${docName}*${clinic}\n`;
        msg += `   📅 ${isBn ? "প্রেসক্রিপশন তারিখ" : "Date"}: ${pDate}\n`;
        msg += `   💊 ${isBn ? "ওষুধ" : "Meds"}: ${meds}`;
        msg += diag;
        msg += refillInfo;
        msg += `\n\n`;
    });

    if (isBn) {
        msg += `🔗 *অনলাইনে দেখতে লিংকটিতে চাপুন (রিড-অনলি ভিউ):*\n${shareUrl}\n\n`;
        msg += `_BreatheWell ডিজিটাল স্বাস্থ্য ভল্ট থেকে প্রেরিত_`;
    } else {
        msg += `🔗 *Tap link to view details (Read-only view):*\n${shareUrl}\n\n`;
        msg += `_Sent via BreatheWell Digital Health Vault_`;
    }

    return msg;
}

/**
 * Directly shares prescription summary to son/daughter via WhatsApp Web / App.
 */
function rxShareWhatsApp() {
    const text = rxGenerateWhatsAppMessage();
    const encoded = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Copies formatted WhatsApp message to clipboard.
 */
function rxCopyWhatsAppMessage() {
    const text = rxGenerateWhatsAppMessage();
    navigator.clipboard.writeText(text).then(() => {
        const btn = $r("rxBtnCopyMsg");
        if (btn) {
            btn.innerHTML = `<i class="bi bi-check2"></i> <span>${rx("btnCopied")}</span>`;
            btn.classList.add("copied");
            setTimeout(() => {
                btn.innerHTML = `<i class="bi bi-clipboard"></i> <span>${rx("btnCopyReport")}</span>`;
                btn.classList.remove("copied");
            }, 2500);
        }
        rxToast(rx("toastMsgCopied"), "success", "bi-whatsapp");
    }).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        rxToast(rx("toastMsgCopied"), "success", "bi-whatsapp");
    });
}

/**
 * Copies a plain-text prescription summary to clipboard (for SMS / Email).
 */
function rxCopySummary() {
    const records = rxLoad();
    const isBn = rxLang === "bn";
    const dateStr = new Date().toLocaleDateString(isBn ? "bn-BD" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });

    if (!records.length) {
        rxToast(isBn ? "কোনো প্রেসক্রিপশন নেই" : "No prescriptions saved", "warn", "bi-exclamation-circle");
        return;
    }

    let summary = isBn
        ? `BreatheWell প্রেসক্রিপশন সামারি (${dateStr})\nমোট প্রেসক্রিপশন: ${records.length}টি\n---------------------------------\n`
        : `BreatheWell Prescription Summary (${dateStr})\nTotal Prescriptions: ${records.length}\n---------------------------------\n`;

    records.forEach((r, i) => {
        const doc = r.doctor || "—";
        const clinic = r.clinic ? ` (${r.clinic})` : "";
        const dt = r.prescDate ? rxFmtDate(r.prescDate) : "—";
        const meds = (r.meds && r.meds.length) ? r.meds.join(", ") : "—";
        const diag = r.diagnosis ? ` | ${isBn ? "রোগ" : "Diagnosis"}: ${r.diagnosis}` : "";
        const refill = r.refillDate ? ` | ${isBn ? "রিফিল" : "Refill"}: ${rxFmtDate(r.refillDate)}` : "";
        summary += `${i + 1}. ${doc}${clinic} - ${dt}\n   ${isBn ? "ওষুধ" : "Meds"}: ${meds}${diag}${refill}\n`;
    });

    navigator.clipboard.writeText(summary).then(() => {
        rxToast(rx("toastSummaryCopied"), "success", "bi-card-text");
    }).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = summary;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        rxToast(rx("toastSummaryCopied"), "success", "bi-card-text");
    });
}

/** Updates the share URL input, preview box, and test view link. */
function rxRefreshShareLink() {
    const shareUrl = rxGenerateShareURL();
    const input = $r("rxShareUrlInput");
    if (input) input.value = shareUrl;

    const preview = $r("rxWhatsappMsgPreview");
    if (preview) {
        preview.textContent = rxGenerateWhatsAppMessage();
    }

    const testLink = $r("rxBtnTestView");
    if (testLink) {
        testLink.href = shareUrl;
    }

    const statCount = $r("rxShareVaultCount");
    if (statCount) {
        const count = rxLoad().length;
        statCount.textContent = rxLang === "bn"
            ? `ভল্টে ${count.toLocaleString("bn-BD")}টি প্রেসক্রিপশন`
            : `${count} prescription(s) in vault`;
    }
}

/** Copies the share URL to clipboard. */
function rxCopyLink() {
    const input = $r("rxShareUrlInput");
    if (!input) return;
    navigator.clipboard.writeText(input.value).then(() => {
        const btn = $r("rxCopyBtn");
        if (btn) {
            btn.innerHTML = `<i class="bi bi-check2"></i> <span>${rx("btnCopied")}</span>`;
            btn.classList.add("copied");
            setTimeout(() => {
                btn.innerHTML = `<i class="bi bi-clipboard"></i> <span>${rx("btnCopy")}</span>`;
                btn.classList.remove("copied");
            }, 2500);
        }
        rxToast(rx("toastCopied"), "success", "bi-clipboard-check");
    }).catch(() => {
        input.select();
        document.execCommand("copy");
    });
}

/* ============================================================================
 * 14. FAMILY IMPORT & STAGED MERGE/REPLACE ENGINE
 * ============================================================================ */

/** Staged records from a parsed JSON backup file */
let stagedImportRecords = [];
let stagedImportFilename = "";

/** Binds drag-and-drop and click events to the JSON import zone */
function rxBindImportDropZone() {
    const dropzone = $r("rxImportDropZone");
    const input = $r("rxImportInput");
    if (!dropzone || !input) return;

    dropzone.addEventListener("click", e => {
        if (e.target === input) return;
        input.click();
    });

    dropzone.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            input.click();
        }
    });

    input.addEventListener("change", () => {
        if (input.files?.length) {
            rxStageImportFile(input.files[0]);
        }
    });

    dropzone.addEventListener("dragover", e => {
        e.preventDefault();
        dropzone.classList.add("drag-over");
    });

    dropzone.addEventListener("dragleave", e => {
        if (!dropzone.contains(e.relatedTarget)) {
            dropzone.classList.remove("drag-over");
        }
    });

    dropzone.addEventListener("drop", e => {
        e.preventDefault();
        dropzone.classList.remove("drag-over");
        if (e.dataTransfer.files?.length) {
            rxStageImportFile(e.dataTransfer.files[0]);
        }
    });
}

/**
 * Reads a JSON file and stages it for preview and user choice (Merge vs Replace).
 * @param {File} file
 */
function rxStageImportFile(file) {
    if (!file) return;
    stagedImportFilename = file.name;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const parsed = JSON.parse(ev.target.result);
            const records = parsed.prescriptions || (Array.isArray(parsed) ? parsed : []);
            if (!records.length) {
                rxToast(rx("toastImportEmpty"), "error", "bi-exclamation-triangle");
                return;
            }

            stagedImportRecords = records;
            rxRenderImportPreview(parsed.exported);
        } catch (err) {
            console.error("JSON parse error:", err);
            rxToast("Invalid JSON file", "error", "bi-x-circle");
        }
    };
    reader.readAsText(file);
}

/**
 * Renders the staged preview box with doctor names and count badge.
 * @param {string} [exportedDate]
 */
function rxRenderImportPreview(exportedDate) {
    const previewBox = $r("rxImportPreview");
    const badge = $r("rxImportCountBadge");
    const meta = $r("rxImportFileMeta");
    const list = $r("rxImportList");
    if (!previewBox || !badge || !list) return;

    const count = stagedImportRecords.length;
    badge.textContent = rxLang === "bn"
        ? `${count.toLocaleString("bn-BD")}টি প্রেসক্রিপশন পাওয়া গেছে`
        : `${count} prescription(s) found`;

    if (meta) {
        meta.textContent = stagedImportFilename + (exportedDate ? ` · ${rxFmtDate(exportedDate)}` : "");
    }

    list.innerHTML = stagedImportRecords.map((r, i) => {
        const doc = r.doctor || (rxLang === "bn" ? "ডাক্তারের নাম নেই" : "No doctor name");
        const dt = r.prescDate ? rxFmtDate(r.prescDate) : "";
        const medCount = (r.meds && r.meds.length)
            ? (rxLang === "bn" ? `${r.meds.length}টি ওষুধ` : `${r.meds.length} meds`)
            : "";
        return `<div class="rx-import-item-line">
            <strong>${i + 1}. ${doc}</strong>
            ${dt ? ` · <span class="text-muted">${dt}</span>` : ""}
            ${medCount ? ` · <span class="badge bg-light text-dark border">${medCount}</span>` : ""}
        </div>`;
    }).join("");

    previewBox.classList.remove("d-none");
    previewBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/** Merges imported prescriptions into existing vault. */
function rxExecuteMergeImport() {
    if (!stagedImportRecords.length) return;
    const existing = rxLoad();
    const existingIds = new Set(existing.map(r => r.id));
    let addedCount = 0;

    stagedImportRecords.forEach(r => {
        if (!r.id) r.id = rxUUID();
        if (!existingIds.has(r.id)) {
            existing.push(r);
            existingIds.add(r.id);
            addedCount++;
        }
    });

    rxSave(existing);
    rxCancelImport();
    rxRenderGallery();
    rxUpdateStorage();
    rxRefreshShareLink();

    const countStr = rxLang === "bn" ? addedCount.toLocaleString("bn-BD") : addedCount;
    const msg = rx("toastImportMergeDone").replace("{n}", countStr);
    rxToast(msg, "success", "bi-check-circle-fill");
}

/** Replaces entire vault with imported prescriptions. */
function rxExecuteReplaceImport() {
    if (!stagedImportRecords.length) return;
    const count = stagedImportRecords.length;
    stagedImportRecords.forEach(r => { if (!r.id) r.id = rxUUID(); });
    rxSave(stagedImportRecords);
    rxCancelImport();
    rxRenderGallery();
    rxUpdateStorage();
    rxRefreshShareLink();

    const countStr = rxLang === "bn" ? count.toLocaleString("bn-BD") : count;
    const msg = rx("toastImportReplaceDone").replace("{n}", countStr);
    rxToast(msg, "success", "bi-arrow-repeat");
}

/** Cancels staged import and resets preview. */
function rxCancelImport() {
    stagedImportRecords = [];
    stagedImportFilename = "";
    const previewBox = $r("rxImportPreview");
    if (previewBox) previewBox.classList.add("d-none");
    const input = $r("rxImportInput");
    if (input) input.value = "";
}

/** Backward-compatible direct handler */
function rxHandleImport(e) {
    if (e.target?.files?.length) {
        rxStageImportFile(e.target.files[0]);
    }
}

/**
 * Checks URL for ?rxview= payload and activates read-only view mode.
 */
function rxHandleViewMode() {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("rxview");
    if (!payload) return;

    try {
        const records = JSON.parse(decodeURIComponent(escape(atob(payload))));
        viewMode = true;
        viewModeRecords = records;

        // Hide editing UI
        document.querySelectorAll(".rx-edit-only").forEach(el => el.style.display = "none");

        // Show notice banner
        const notice = $r("rxViewNotice");
        if (notice) {
            notice.classList.remove("d-none");
            notice.innerHTML = `
        <div class="alert alert-info d-flex align-items-center gap-2 mb-4" role="alert">
          <i class="bi bi-eye-fill fs-5"></i>
          <div><strong>${rx("familyTitle")}</strong> —
            ${rx("viewModeMsg").replace("{n}", records.length)}
          </div>
        </div>`;
        }
    } catch { /* ignore malformed */ }
}

/* ============================================================================
 * 15. STORAGE GAUGE
 * ============================================================================ */

/** Calculates localStorage usage and updates the gauge UI. */
function rxUpdateStorage() {
    const used = JSON.stringify(localStorage).length * 2; // rough bytes (UTF-16)
    const max = 10 * 1024 * 1024;  // assume ~10 MB limit
    const pct = Math.min(100, Math.round((used / max) * 100));
    const count = rxLoad().length;

    const fill = $r("rxStorageFill");
    const pctEl = $r("rxStoragePct");
    const countEl = $r("rxStorageCount");

    if (fill) {
        fill.style.width = pct + "%";
        fill.className = "rx-storage-fill" + (pct > 85 ? " full" : pct > 60 ? " warn" : "");
    }
    if (pctEl) pctEl.textContent = `${rxFmtBytes(used / 2)} / ~10 MB (${pct}%)`;
    if (countEl) countEl.textContent = count;
}

/* ============================================================================
 * 16. TOAST NOTIFICATION SYSTEM
 * ============================================================================ */

const RX_TOAST_DUR = { success: 3000, error: 5000, info: 3000, warn: 4000 };

/**
 * Shows a branded toast notification.
 * @param {string}  message
 * @param {"success"|"error"|"info"|"warn"} type
 * @param {string}  [icon]
 */
function rxToast(message, type = "info", icon = "bi-info-circle-fill") {
    const stack = $r("rxToastStack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = `rx-toast ${type}`;
    toast.innerHTML = `
    <div class="rx-toast-icon"><i class="bi ${icon}"></i></div>
    <div><p class="rx-toast-ttl">${message}</p></div>`;
    stack.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("rx-toast-out");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }, RX_TOAST_DUR[type] || 3000);
}

/* ============================================================================
 * 17. LANGUAGE TOGGLE
 * ============================================================================ */

/**
 * Sets the language and re-renders all i18n text.
 * @param {"bn"|"en"} lang
 */
function rxSetLang(lang) {
    rxLang = lang;
    localStorage.setItem(RX_LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.body.className = lang;

    document.querySelectorAll("[data-rx-i18n]").forEach(el => {
        const key = el.dataset.rxI18n;
        if (key) el.textContent = rx(key);
    });
    document.querySelectorAll("[data-rx-i18n-ph]").forEach(el => {
        const key = el.dataset.rxI18nPh;
        if (key) el.placeholder = rx(key);
    });

    const btn = $r("rxLangToggle");
    if (btn) btn.textContent = lang === "bn" ? "English" : "বাংলা";

    // Re-render dynamic content
    rxRenderGallery();
    rxUpdateStorage();
    rxRefreshShareLink();
}

/* ============================================================================
 * 18. APPLICATION BOOTSTRAP
 * ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    // Handle read-only share view mode first
    rxHandleViewMode();

    // Initial renders
    rxSetLang(rxLang);

    // Set date fields to today
    if ($r("rxDate")) $r("rxDate").value = rxToday();

    // Bind upload zone
    rxBindUploadZone();

    // Bind medication tag input
    rxBindMedInput();

    // Bind save form
    $r("rxForm")?.addEventListener("submit", rxHandleSave);

    // Gallery filter pills
    document.querySelectorAll(".rx-filter-pill[data-filter]").forEach(btn => {
        btn.addEventListener("click", () => {
            galleryFilter = btn.dataset.filter;
            document.querySelectorAll(".rx-filter-pill").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            rxRenderGallery();
        });
    });

    // Sort select
    $r("rxSortSelect")?.addEventListener("change", e => {
        gallerySort = e.target.value;
        rxRenderGallery();
    });

    // Live search
    $r("rxSearch")?.addEventListener("input", e => {
        gallerySearch = e.target.value.trim();
        rxRenderGallery();
    });

    // Share & Export buttons
    $r("rxBtnWhatsApp")?.addEventListener("click", rxShareWhatsApp);
    $r("rxBtnCopyMsg")?.addEventListener("click", rxCopyWhatsAppMessage);
    $r("rxBtnCopySummary")?.addEventListener("click", rxCopySummary);
    $r("rxBtnJson")?.addEventListener("click", rxExportJSON);
    $r("rxBtnLink")?.addEventListener("click", rxRefreshShareLink);
    $r("rxCopyBtn")?.addEventListener("click", rxCopyLink);
    $r("rxBtnPrint")?.addEventListener("click", () => window.print());

    // Family Import Drag & Drop + Staged preview
    rxBindImportDropZone();
    $r("rxBtnMergeImport")?.addEventListener("click", rxExecuteMergeImport);
    $r("rxBtnReplaceImport")?.addEventListener("click", rxExecuteReplaceImport);
    $r("rxBtnCancelImport")?.addEventListener("click", rxCancelImport);

    // Lightbox close (backdrop + button)
    $r("rxLightbox")?.addEventListener("click", e => {
        if (e.target === $r("rxLightbox")) rxCloseLightbox();
    });
    $r("lbCloseBtn")?.addEventListener("click", rxCloseLightbox);
    $r("lbPrev")?.addEventListener("click", rxLbPrev);
    $r("lbNext")?.addEventListener("click", rxLbNext);

    // Keyboard shortcuts for lightbox
    document.addEventListener("keydown", e => {
        if (!$r("rxLightbox")?.classList.contains("open")) return;
        if (e.key === "Escape") rxCloseLightbox();
        if (e.key === "ArrowLeft") rxLbPrev();
        if (e.key === "ArrowRight") rxLbNext();
    });

    // Language toggle
    $r("rxLangToggle")?.addEventListener("click", () => {
        rxSetLang(rxLang === "bn" ? "en" : "bn");
    });

    // Initial share link
    rxRefreshShareLink();
});

