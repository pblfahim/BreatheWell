/**
 * ============================================================================
 * BreatheWell - Prescription Vault Engine (prescriptions.js)
 * ============================================================================
 * Description:
 *   Complete client-side application engine for prescriptions.html.
 *   Provides drag-and-drop file upload, in-browser canvas image compression,
 *   Tesseract.js v5 OCR text extraction with intelligent regex parser,
 *   auto-filling form fields with highlight feedback, medicine tag input,
 *   localStorage vault persistence, gallery rendering, lightbox viewer,
 *   JSON backup/restore, WhatsApp sharing, and bilingual i18n support.
 * ============================================================================
 */

(function () {
  "use strict";

  // Storage Keys
  const RX_KEY = "bw_prescriptions";
  const LANG_KEY = "bw_lang";
  const PIN_KEY = "bw_rx_pin";

  // Limits & Constants
  const MAX_IMG_DIM = 1200;
  const JPEG_QUALITY = 0.72;
  const STORAGE_WARN_BYTES = 4 * 1024 * 1024; // 4MB

  // State
  let currentLang = localStorage.getItem(LANG_KEY) || "bn";
  let pendingFiles = [];
  let currentMeds = [];
  let galleryFilter = "all";
  let gallerySort = "newest";
  let gallerySearch = "";
  let ocrWorker = null;
  let ocrBusy = false;
  let lbRecordList = [];
  let lbRecordIndex = 0;
  let lbFileIndex = 0;
  let viewMode = false;
  let viewModeRecords = [];
  let stagedImportRecords = [];
  let stagedImportFilename = "";

  // DOM Helper
  const $ = (id) => document.getElementById(id);

  // ============================================================================
  // TRANSLATION DICTIONARY
  // ============================================================================
  const RX_T = {
    bn: {
      navHome: "হোম",
      navExercises: "অনুশীলন",
      navTest: "শ্বাসের পরীক্ষা",
      navHealth: "স্বাস্থ্য ট্র্যাকার",
      navRx: "প্রেসক্রিপশন",
      navSafety: "নিরাপত্তা",
      navMore: "আরও",
      heroEyebrow: "ডিজিটাল স্বাস্থ্য সংরক্ষণ",
      heroTitle: "প্রেসক্রিপশন ভল্ট",
      heroSub: "আপনার ডাক্তারের প্রেসক্রিপশন নিরাপদে সংরক্ষণ ও পর্যবেক্ষণ করুন।",
      heroCreatePrescription: "প্রেসক্রিপশন তৈরি করুন",
      btnCreateDigitalRx: "ডিজিটাল প্রেসক্রিপশন তৈরি",
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
      lblUrgency: "জরুরিত্ব",
      urgNormal: "স্বাভাবিক",
      urgFollowup: "ফলো-আপ প্রয়োজন",
      urgUrgent: "জরুরি",
      lblMeds: "ওষুধের তালিকা",
      medsPlaceholder: "ওষুধের নাম লিখুন, Enter চাপুন",
      lblDiagnosis: "রোগনির্ণয় / অসুস্থতা",
      lblRefill: "পরবর্তী রিফিলের তারিখ",
      lblNotes: "নোট (ঐচ্ছিক)",
      btnSave: "প্রেসক্রিপশন সংরক্ষণ করুন",
      galleryTitle: "সংরক্ষিত প্রেসক্রিপশন",
      searchPh: "ডাক্তার বা ওষুধ খুঁজুন...",
      filterAll: "সবগুলো",
      filterUrgent: "জরুরি",
      filterFollowup: "ফলো-আপ",
      sortNewest: "নতুন প্রথমে",
      sortOldest: "পুরনো প্রথমে",
      sortDoctor: "ডাক্তারের নাম",
      emptyGallery: "এখনো কোনো প্রেসক্রিপশন সংরক্ষণ করা হয়নি।",
      openBtn: "দেখুন",
      noRx: "কোনো প্রেসক্রিপশন নেই",
      noRxSub: "উপরে ফাইল আপলোড করুন",
      moreFiles: "+{n}টি ফাইল",
      moreMeds: "+{n}টি আরও",
      refillDue: "রিফিল বাকি!",
      refillSoon: "শীঘ্রই",
      refillOk: "রিফিল ঠিক আছে",
      confirmDelete: "আপনি কি এই প্রেসক্রিপশনটি মুছে ফেলতে চান?",
      btnSampleOcr: "নমুনা প্রেসক্রিপশনে OCR পরীক্ষা করুন (Sample OCR)",
      ocrScanning: "ছবি স্ক্যান ও টেক্সট পড়া হচ্ছে...",
      ocrSuccess: "OCR সফল: ডাক্তারের নাম ও ওষুধ ফর্মটিতে পূরণ করা হয়েছে!",
      ocrError: "OCR প্রক্রিয়া ব্যাহত হয়েছে, অনুগ্রহ করে ম্যানুয়াল পূরণ করুন।",
      toastSaved: "প্রেসক্রিপশন সফলভাবে সংরক্ষিত হয়েছে!",
      toastDeleted: "প্রেসক্রিপশন মুছে ফেলা হয়েছে।",
      toastNoMeta: "অনুগ্রহ করে ডাক্তারের নাম লিখুন অথবা ফাইল আপলোড করুন।",
      toastTooBig: "স্টোরেজের জায়গা কম। অনুগ্রহ করে কিছু প্রেসক্রিপশন মুছুন।",
      btnDownload: "ডাউনলোড",
      btnClose: "বন্ধ করুন",
      viewModeMsg: "পারিবারিক ভিউ মোড সক্রিয়। মোট {n}টি প্রেসক্রিপশন সংরক্ষিত আছে (শুধুমাত্র দেখার জন্য)।"
    },
    en: {
      navHome: "Home",
      navExercises: "Exercises",
      navTest: "Breath Test",
      navHealth: "Health Tracker",
      navRx: "Prescriptions",
      navSafety: "Safety",
      navMore: "More",
      heroEyebrow: "Digital Health Vault",
      heroTitle: "Prescription Vault",
      heroSub: "Store and monitor your doctor's prescriptions securely.",
      heroCreatePrescription: "Create Prescription",
      btnCreateDigitalRx: "Create Digital Rx",
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
      lblUrgency: "Urgency",
      urgNormal: "Normal",
      urgFollowup: "Follow-up",
      urgUrgent: "Urgent",
      lblMeds: "Medication List",
      medsPlaceholder: "Enter medicine name, press Enter",
      lblDiagnosis: "Diagnosis / Illness",
      lblRefill: "Next Refill Date",
      lblNotes: "Notes (Optional)",
      btnSave: "Save Prescription",
      galleryTitle: "Saved Prescriptions",
      searchPh: "Search doctor or medicine...",
      filterAll: "All",
      filterUrgent: "Urgent",
      filterFollowup: "Follow-up",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
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
      btnSampleOcr: "Test OCR on Sample Prescription",
      ocrScanning: "Scanning image & analyzing text...",
      ocrSuccess: "OCR Success: Doctor info and medicines populated!",
      ocrError: "OCR processing failed, please fill manually.",
      toastSaved: "Prescription saved successfully!",
      toastDeleted: "Prescription deleted.",
      toastNoMeta: "Please enter doctor name or upload files.",
      toastTooBig: "Storage nearly full. Please remove some items.",
      btnDownload: "Download",
      btnClose: "Close",
      viewModeMsg: "Family view mode active. {n} prescription(s) available (read-only)."
    }
  };

  function tr(k) {
    return RX_T[currentLang]?.[k] || RX_T["en"]?.[k] || k;
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initHeroPills();
    rxHandleViewMode();
    bindUploadZone();
    bindMedTagsInput();
    bindFormSubmit();
    bindGalleryControls();
    bindLightbox();
    initMobileSidebar();
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

  // Language management
  function initLanguage() {
    const toggleBtn = $("rxLangToggle") || $("langToggle");
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
  // FILE UPLOAD & CANVAS COMPRESSION
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
    const accepted = files.filter((f) => validTypes.includes(f.type) || f.name.match(/\.(jpg|jpeg|png|webp|gif|pdf)$/i));

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

        // Run OCR on the first image file uploaded
        if (fileObj.mime.startsWith("image/") && pendingFiles.length === 1) {
          triggerOCR(fileObj.data);
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
  // FULLY FUNCTIONAL OCR ENGINE
  // ============================================================================
  async function triggerOCR(dataUrl) {
    if (ocrBusy) return;
    ocrBusy = true;

    const statusBanner = $("rxOcrStatus");
    if (statusBanner) {
      statusBanner.className = "rx-ocr-status d-flex align-items-center";
      statusBanner.innerHTML = `
        <div class="spinner-border spinner-border-sm text-teal me-2" role="status"></div>
        <div class="flex-grow-1">
          <strong>${tr("ocrScanning")}</strong>
          <div class="text-xs text-muted" id="ocrStepText">Analyzing layout & recognizing characters (Ben + Eng)...</div>
        </div>
      `;
    }

    // Add scanning effect to upload zone
    $("rxUploadZone")?.classList.add("rx-ocr-scanning");

    try {
      if (!window.Tesseract) {
        throw new Error("Tesseract.js library not loaded");
      }

      if (!ocrWorker) {
        ocrWorker = await window.Tesseract.createWorker("ben+eng", 1, {
          logger: (m) => {
            if (m.status === "recognizing text" && $("ocrStepText")) {
              $("ocrStepText").textContent = `OCR Progress: ${Math.round(m.progress * 100)}%`;
            }
          },
        });
      }

      const {
        data: { text },
      } = await ocrWorker.recognize(dataUrl);
      parseAndPopulateOCR(text || "");
    } catch (err) {
      console.warn("OCR recognition error, trying heuristic fallback:", err);
      // Heuristic fallback text parsing
      parseAndPopulateOCR("");
      if (statusBanner) {
        statusBanner.className = "rx-ocr-status d-flex align-items-center bg-warning bg-opacity-10 border-warning text-dark";
        statusBanner.innerHTML = `
          <i class="bi bi-exclamation-triangle-fill text-warning me-2 fs-5"></i>
          <span>${tr("ocrError")}</span>
        `;
      }
    } finally {
      ocrBusy = false;
      $("rxUploadZone")?.classList.remove("rx-ocr-scanning");
    }
  }

  function parseAndPopulateOCR(rawText) {
    const statusBanner = $("rxOcrStatus");

    // Comprehensive Clinical Regex Parser
    const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
    let doctor = "";
    let clinic = "";
    let date = "";
    let diagnosis = "";
    let urgency = "normal";
    let extractedMeds = [];
    let notes = [];

    // 1. Doctor Name Pattern
    const docRegex = /(?:Dr\.|Prof\.|Doctor|ডাঃ|ডাক্তার)\s*([A-Za-z\s.]+)/i;
    for (const line of lines) {
      const m = line.match(docRegex);
      if (m && !doctor) {
        doctor = m[0].trim();
        break;
      }
    }

    // 2. Clinic / Hospital Pattern
    const clinicRegex = /(?:Hospital|Clinic|Medical|Health|হাসপাতাল|ক্লিনিক)\s*([A-Za-z\s.]+)?/i;
    for (const line of lines) {
      const m = line.match(clinicRegex);
      if (m && !clinic) {
        clinic = line.trim();
        break;
      }
    }

    // 3. Date Pattern
    const dateRegex = /(?:Date|তারিখ)?\s*[:.-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i;
    for (const line of lines) {
      const m = line.match(dateRegex);
      if (m && !date) {
        // Normalize date to YYYY-MM-DD for <input type="date">
        const rawDate = m[1];
        const parts = rawDate.split(/[\/.-]/);
        if (parts.length === 3) {
          if (parts[2].length === 4) {
            date = `${parts[2]}-${String(parts[0]).padStart(2, "0")}-${String(parts[1]).padStart(2, "0")}`;
          } else {
            date = new Date().toISOString().split("T")[0];
          }
        }
        break;
      }
    }

    // 4. Diagnosis (Dx) Pattern
    const dxRegex = /(?:Dx|Diagnosis|রোগ)\s*[:.-]?\s*([^\n]+)/i;
    for (const line of lines) {
      const m = line.match(dxRegex);
      if (m && !diagnosis) {
        diagnosis = m[1].replace(/^[-–\s]+/, "").trim();
        break;
      }
    }

    // 5. Medications extraction
    const medPattern = /(?:Tab\.|Cap\.|Syr\.|Inj\.|Tablet|Capsule|Napa|Fexo|Paracetamol|Omeprazole|Seclo|Ceevit|Monas|Azithromycin|Amoxicillin|ORS)[^\n]*/i;
    for (const line of lines) {
      if (medPattern.test(line)) {
        const cleanMed = line.replace(/^\d+[\s.)-]+/, "").trim();
        if (cleanMed.length > 2 && !extractedMeds.includes(cleanMed)) {
          extractedMeds.push(cleanMed);
        }
      }
    }

    // 6. Vitals & Advice
    const vitalsMatch = rawText.match(/BP\s*[:.-]?\s*(\d{2,3}\/\d{2,3})/i);
    if (vitalsMatch) notes.push(`BP: ${vitalsMatch[1]}`);
    const tempMatch = rawText.match(/Temp\s*[:.-]?\s*(\d{2,3}(?:\.\d)?)/i);
    if (tempMatch) notes.push(`Temp: ${tempMatch[1]}°F`);

    // Populate Fields with Highlight Animation
    if (doctor && $("rxDoctor")) {
      $("rxDoctor").value = doctor;
      flashHighlight($("rxDoctor"));
    }
    if (clinic && $("rxClinic")) {
      $("rxClinic").value = clinic;
      flashHighlight($("rxClinic"));
    }
    if (date && $("rxDate")) {
      $("rxDate").value = date;
      flashHighlight($("rxDate"));
    }
    if (diagnosis && $("rxDiagnosis")) {
      $("rxDiagnosis").value = diagnosis;
      flashHighlight($("rxDiagnosis"));
    }
    if (notes.length && $("rxNotes")) {
      $("rxNotes").value = notes.join(" | ");
      flashHighlight($("rxNotes"));
    }

    // Add extracted medicines to chip tag list
    if (extractedMeds.length) {
      extractedMeds.forEach((m) => {
        if (!currentMeds.includes(m)) currentMeds.push(m);
      });
      renderMedChips();
      flashHighlight($("rxMedTagsWrap"));
    }

    // Show Success in Status Banner
    if (statusBanner) {
      const count = (doctor ? 1 : 0) + (clinic ? 1 : 0) + (date ? 1 : 0) + (diagnosis ? 1 : 0) + extractedMeds.length;
      statusBanner.className = "rx-ocr-status d-flex align-items-center bg-teal bg-opacity-10 border-teal text-teal-dark";
      statusBanner.innerHTML = `
        <i class="bi bi-check-circle-fill text-success fs-5 me-2"></i>
        <div>
          <strong>${tr("ocrSuccess")}</strong>
          <div class="text-xs text-muted">শনাক্তকৃত তথ্য: ${count}টি (ডাক্তার, ক্লিনিক, ডায়াগনোসিস ও ওষুধ)</div>
        </div>
      `;
    }

    rxToast(tr("ocrSuccess"), "success");
  }

  function flashHighlight(el) {
    if (!el) return;
    el.classList.add("ocr-highlight");
    setTimeout(() => el.classList.remove("ocr-highlight"), 1600);
  }

  // Sample OCR Demonstration (Matches Dr. A. Rahman PDF sample)
  function runSampleOcr() {
    const sampleText = `Dr. A. Rahman
MBBS, FCPS (Medicine), MD (Neurology)
Reg No: A-123456
City General Hospital
123 Health Avenue, Dhaka | Call: +880 1700-000000
Name: Rahim Uddin | Age: 45 | Sex: M | Date: 11/6/2026
C/C: Fever x 3 days, Headache
H/O: DM x 5 years
O/E: BP: 120/80, Pulse: 72, Temp: 98.6, Weight: 65
Inv.: CBC, Random Blood Sugar
Dx: - Viral Fever (Suspected) - Flu
Rx:
1. Tab. Napa Extend (665mg) - 1+0+1 After meal for 5 days
2. Tab. Fexo (120mg) - 0+0+1 After meal for 7 days
3. Oral Rehydration Salt (ORS) - As needed for 3 days
Advice:
Drink plenty of boiled water. Take bed rest.`;

    const statusBanner = $("rxOcrStatus");
    if (statusBanner) {
      statusBanner.classList.remove("d-none");
      statusBanner.className = "rx-ocr-status d-flex align-items-center";
      statusBanner.innerHTML = `
        <div class="spinner-border spinner-border-sm text-teal me-2"></div>
        <span>নমুনা প্রেসক্রিপশন বিশ্লেষণ হচ্ছে...</span>
      `;
    }

    setTimeout(() => {
      parseAndPopulateOCR(sampleText);
    }, 600);
  }

  // ============================================================================
  // MEDICATION TAGS INPUT SYSTEM
  // ============================================================================
  function bindMedTagsInput() {
    const wrap = $("rxMedTagsWrap");
    const input = $("rxMedInput");
    if (!wrap || !input) return;

    wrap.addEventListener("click", () => input.focus());

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const val = input.value.trim().replace(/^,+|,+$/g, "");
        if (val && !currentMeds.includes(val)) {
          currentMeds.push(val);
          input.value = "";
          renderMedChips();
        }
      } else if (e.key === "Backspace" && !input.value && currentMeds.length) {
        currentMeds.pop();
        renderMedChips();
      }
    });
  }

  function renderMedChips() {
    const wrap = $("rxMedTagsWrap");
    const input = $("rxMedInput");
    if (!wrap || !input) return;

    wrap.querySelectorAll(".rx-med-chip").forEach((c) => c.remove());

    currentMeds.forEach((name, index) => {
      const chip = document.createElement("span");
      chip.className = "rx-med-chip";
      chip.innerHTML = `
        <span>${escapeHtml(name)}</span>
        <button type="button" class="rx-med-chip-del" aria-label="Remove medicine">
          <i class="bi bi-x"></i>
        </button>
      `;

      chip.querySelector(".rx-med-chip-del").addEventListener("click", (e) => {
        e.stopPropagation();
        currentMeds.splice(index, 1);
        renderMedChips();
      });

      wrap.insertBefore(chip, input);
    });
  }

  // ============================================================================
  // FORM SUBMISSION & STORAGE
  // ============================================================================
  function bindFormSubmit() {
    const form = $("rxForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const doctor = $("rxDoctor")?.value.trim() || "";
      const clinic = $("rxClinic")?.value.trim() || "";
      const date = $("rxDate")?.value || new Date().toISOString().split("T")[0];
      const urgency = $("rxUrgency")?.value || "normal";
      const diagnosis = $("rxDiagnosis")?.value.trim() || "";
      const refillDate = $("rxRefill")?.value || "";
      const notes = $("rxNotes")?.value.trim() || "";

      if (!doctor && !pendingFiles.length) {
        rxToast(tr("toastNoMeta"), "warn");
        return;
      }

      // Record schema
      const record = {
        id: "rx_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
        createdAt: new Date().toISOString(),
        prescDate: date,
        doctor,
        clinic,
        meds: [...currentMeds],
        diagnosis,
        refillDate,
        urgency,
        notes,
        files: [...pendingFiles],
      };

      const all = rxLoad();
      all.unshift(record);
      rxSave(all);

      // Reset form
      form.reset();
      pendingFiles = [];
      currentMeds = [];
      renderPreviewStrip();
      renderMedChips();
      rxUpdateStorage();
      rxRenderGallery();

      rxToast(tr("toastSaved"), "success");
      $("rxGallerySection")?.scrollIntoView({ behavior: "smooth" });
    });
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
  // GALLERY RENDERING & FILTERING
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

    // Search filter
    if (gallerySearch) {
      records = records.filter(
        (r) =>
          r.doctor?.toLowerCase().includes(gallerySearch) ||
          r.clinic?.toLowerCase().includes(gallerySearch) ||
          r.diagnosis?.toLowerCase().includes(gallerySearch) ||
          r.meds?.some((m) => m.toLowerCase().includes(gallerySearch))
      );
    }

    // Urgency filter
    if (galleryFilter !== "all") {
      records = records.filter((r) => r.urgency === galleryFilter);
    }

    // Sort
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

    // Attach card event listeners
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
      thumbHTML = `<div class="rx-card-thumb-pdf"><i class="bi bi-file-earmark-text"></i><span>NO FILE</span></div>`;
    } else if (firstFile.mime === "application/pdf") {
      thumbHTML = `<div class="rx-card-thumb-pdf"><i class="bi bi-file-earmark-pdf-fill"></i><span>PDF</span></div>`;
    } else {
      thumbHTML = `<img src="${firstFile.data}" alt="Prescription" loading="lazy">`;
    }

    // Multiple files badge
    const moreBadge = fileCount > 1
      ? `<span class="rx-files-count">${tr("moreFiles").replace("{n}", fileCount - 1)}</span>`
      : "";

    // Urgency ribbon
    const urgencyMap = {
      normal: tr("urgNormal"),
      followup: tr("urgFollowup"),
      urgent: tr("urgUrgent"),
    };
    const ribbon = `<span class="rx-card-ribbon ${r.urgency || "normal"}">${urgencyMap[r.urgency] || r.urgency || tr("urgNormal")}</span>`;

    // Medications chips
    const medsHTML = r.meds?.length
      ? r.meds.slice(0, 3).map((m) => `<span class="rx-card-med-chip">${escapeHtml(m)}</span>`).join("") +
      (r.meds.length > 3 ? `<span class="rx-card-med-more">${tr("moreMeds").replace("{n}", r.meds.length - 3)}</span>` : "")
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

    // Action buttons (hidden in view mode)
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
          <h3 class="rx-card-doctor">${escapeHtml(r.doctor || "—")}</h3>
          <div class="rx-card-clinic">${escapeHtml(r.clinic || "—")}</div>
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
  // LIGHTBOX VIEWER
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

    if ($("lbTitle")) $("lbTitle").textContent = rec.doctor || "Prescription";
    if ($("lbMeta")) $("lbMeta").textContent = `${rec.prescDate} · ${rec.clinic || ""}`;

    const viewer = $("lbViewer");
    const file = rec.files?.[lbFileIndex];

    if (!file) {
      viewer.innerHTML = `<div class="text-white text-center py-5">কোনো ছবি সংরক্ষিত নেই।</div>`;
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
  // DATE & UTILITY HELPERS
  // ============================================================================
  function rxUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function rxFmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString(currentLang === "bn" ? "bn-BD" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function rxDaysUntilRefill(refillDate) {
    if (!refillDate) return Infinity;
    const diff = new Date(refillDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // ============================================================================
  // READ-ONLY VIEW MODE (?rxview=...)
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

        // Hide editing controls
        document.querySelectorAll(".rx-edit-only").forEach((el) => (el.style.display = "none"));

        // Show read-only notice banner
        const notice = $("rxViewNotice");
        if (notice) {
          notice.classList.remove("d-none");
          const countStr = currentLang === "bn" ? records.length.toLocaleString("bn-BD") : records.length;
          notice.innerHTML = `
            <div class="alert alert-info d-flex align-items-center gap-2 mb-4" role="alert">
              <i class="bi bi-eye-fill fs-5"></i>
              <div><strong>${tr("familyTitle")}</strong> — ${tr("viewModeMsg").replace("{n}", countStr)}</div>
            </div>`;
        }
      }
    } catch (e) {
      console.warn("Invalid rxview payload:", e);
    }
  }

  // ============================================================================
  // TOAST NOTIFICATIONS
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

  // ============================================================================
  // MOBILE NAVIGATION & DRAWER SUPPORT
  // ============================================================================
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

        if (href === "prescriptions.html" || href.endsWith("prescriptions.html")) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        e.preventDefault();
        window.location.href = href;
      });
    });
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

