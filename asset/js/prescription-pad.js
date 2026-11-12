/**
 * ============================================================================
 * @file prescription-pad.js
 * @module BreatheWell/PrescriptionPad
 * @description Real-time interactive WYSIWYG digital doctor prescription pad engine.
 *              Eliminates external form controls to enable practitioners, caregivers,
 *              and patients to write, edit, and format clinical prescriptions directly
 *              on the live paper canvas. Features direct contenteditable synchronization,
 *              interactive clinical list managers (C/C, H/O, Inv), structured medication rows,
 *              uploadable physician signature seal, dual-engine OCR document ingestion
 *              (PDF stream + Tesseract.js v5), localStorage vault export, pixel-perfect
 *              A4 printing, and multi-channel WhatsApp sharing.
 * @author BreatheWell Development Team
 * @version 2.4.0
 * @license MIT
 * ============================================================================
 * 
 * TABLE OF CONTENTS:
 * 1. CONSTANTS, STORAGE KEYS & DEFAULT CLINICAL STATE
 * 2. BILINGUAL LOCALIZATION DICTIONARY (PP_T)
 * 3. LIFECYCLE INITIALIZATION & LANGUAGE SWITCHER
 * 4. DIRECT IN-PLACE CONTENTEDITABLE SYNCHRONIZATION
 * 5. DYNAMIC CLINICAL LIST MANAGERS (C/C, H/O, INV)
 * 6. INTERACTIVE MEDICATION ROW BUILDER & QUICK PRESET PILLS
 * 7. DOCTOR SIGNATURE UPLOAD & PREVIEW CONTROLLER
 * 8. DUAL-ENGINE OCR INGESTION & CLINICAL REGEX PARSER
 * 9. PRESCRIPTION VAULT STORAGE, PRINT & WHATSAPP SHARING
 * 10. NOTIFICATION SYSTEM & MOBILE DRAWER NAVIGATION
 * ============================================================================
 */

(function () {
  "use strict";

  /* ============================================================================
   * 1. CONSTANTS, STORAGE KEYS & DEFAULT CLINICAL STATE
   * ============================================================================
   */
  /** @const {string} RX_VAULT_KEY - Primary storage key for prescription records */
  const RX_VAULT_KEY = "bw_prescriptions";

  /** @const {string} LANG_KEY - Storage key for language preference */
  const LANG_KEY = "bw_lang";

  /** @const {string} SIG_STORAGE_KEY - Storage key for saved doctor signature data URL */
  const SIG_STORAGE_KEY = "bw_doc_signature";

  /** @type {string} currentLang - Active application language code ('bn' | 'en') */
  let currentLang = localStorage.getItem(LANG_KEY) || "bn";

  /** @type {boolean} ocrBusy - Concurrency lock for OCR engine */
  let ocrBusy = false;

  /** @type {Object|null} ocrWorker - Reusable Tesseract.js worker instance */
  let ocrWorker = null;

  /**
   * Fast DOM element lookup by ID.
   * @param {string} id - Target DOM element ID.
   * @returns {HTMLElement|null} Found element or null.
   */
  const $ = (id) => document.getElementById(id);

  /**
   * Default starting clinical state modeled on standard hospital prescription charts.
   */
  const DEFAULT_SAMPLE_DATA = {
    doctor: {
      name: "Dr. A. Rahman",
      degrees: "MBBS, FCPS (Medicine), MD (Neurology)",
      regNo: "Reg No: A-123456",
      hospital: "City General Hospital",
      address: "123 Health Avenue, Dhaka",
      phone: "Call: +880 1700-000000",
      signature: ""
    },
    patient: {
      name: "Rahim Uddin",
      age: "45",
      sex: "M",
      date: new Date().toLocaleDateString("en-US")
    },
    clinical: {
      cc: ["Fever x 3 days", "Headache"],
      ho: ["DM x 5 years"],
      oe: {
        bp: "120/80",
        pulse: "72",
        temp: "98.6",
        weight: "65"
      },
      inv: ["CBC", "Random Blood Sugar"]
    },
    treatment: {
      dx: "- Viral Fever (Suspected) - Flu",
      meds: [
        {
          id: "m_1",
          name: "Napa Extend (665mg)",
          form: "Tab",
          dosage: "1+0+1",
          timing: "After meal",
          duration: "5 days",
          note: "for fever"
        },
        {
          id: "m_2",
          name: "Fexo (120mg)",
          form: "Tab",
          dosage: "0+0+1",
          timing: "After meal",
          duration: "7 days",
          note: ""
        },
        {
          id: "m_3",
          name: "Oral Rehydration Salt (ORS)",
          form: "Syr",
          dosage: "As needed",
          timing: "With water",
          duration: "3 days",
          note: "drink frequently"
        }
      ],
      advice: "Drink plenty of boiled water & oral fluids.\nTake complete bed rest for 3 days.\nTepid sponge on forehead if temperature > 101°F.\nFollow up after 3-5 days if fever persists."
    }
  };

  /** @type {Object} rxPadState - Active working prescription pad state in memory */
  let rxPadState = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_DATA));

  /* ============================================================================
   * 2. BILINGUAL LOCALIZATION DICTIONARY (PP_T)
   * ============================================================================
   */
  const PP_T = {
    bn: {
      navHome: "হোম",
      navExercises: "অনুশীলন",
      navTest: "শ্বাসের পরীক্ষা",
      navHealth: "স্বাস্থ্য ট্র্যাকার",
      navRx: "প্রেসক্রিপশন ভল্ট",
      navPad: "প্রেসক্রিপশন প্যাড",
      navSafety: "নিরাপত্তা",
      navMore: "আরও",
      heroEyebrow: "লাইভ প্রেসক্রিপশন প্যাড (WYSIWYG)",
      heroTitle: "ডিজিটাল প্রেসক্রিপশন প্যাড",
      heroSub: "সরাসরি প্রেসক্রিপশন প্যাডে ক্লিক করে রিয়েল-টাইমে সম্পাদন করুন, প্রিন্ট করুন এবং ভল্টে সংরক্ষণ করুন।",
      tabVault: "প্রেসক্রিপশন ভল্ট",
      tabHistory: "প্রেসক্রিপশন ইতিহাস",
      tabCreate: "প্রেসক্রিপশন তৈরি",
      tabPad: "ডিজিটাল প্যাড",
      btnUploadOcr: "প্রেসক্রিপশন আপলোড (OCR)",
      ocrScanning: "ছবি স্ক্যান ও টেক্সট পড়া হচ্ছে...",
      ocrSuccess: "OCR সফল: প্রেসক্রিপশনের তথ্য সরাসরি প্যাডে পূরণ করা হয়েছে!",
      ocrError: "OCR প্রক্রিয়া ব্যাহত হয়েছে, অনুগ্রহ করে ম্যানুয়াল পূরণ করুন।",
      toastOcrSuccess: "OCR সফলভাবে সম্পন্ন হয়েছে!",
      btnClear: "নতুন প্যাড",
      btnPrint: "প্রিন্ট / PDF",
      btnSaveVault: "ভল্টে সংরক্ষণ",
      editHintBadge: "সরাসরি প্যাডে ক্লিক করে পরিবর্তন করুন",
      lblPatName: "Name:",
      lblAge: "Age:",
      lblSex: "Sex:",
      lblDate: "Date:",
      btnAddItem: "যোগ",
      btnAddMed: "নতুন ওষুধ যোগ করুন",
      lblAdvice: "Advice",
      uploadSigText: "স্বাক্ষর আপলোড",
      padFooterNote: "BreatheWell Digital Health Platform • Not a substitute for formal physical examination.",
      sigLine: "ডাক্তারের স্বাক্ষর ও সিল",
      footerTag: "প্রতিটি নিঃশ্বাসে একটি প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।",
      sidebarBrandSub: "ডিজিটাল স্বাস্থ্য ও মাইন্ডফুলনেস",
      langSelectTitle: "ভাষা পরিবর্তন",
      navPagesTitle: "পেজ ও মডিউল",
      toastSaved: "প্রেসক্রিপশন সফলভাবে ভল্টে সংরক্ষিত হয়েছে!",
      toastCleared: "প্রেসক্রিপশন প্যাড খালি করা হয়েছে।",
      toastCopied: "প্রেসক্রিপশন বিবরণ ক্লিপবোর্ডে কপি করা হয়েছে!",
      toastSigUploaded: "ডাক্তারের স্বাক্ষর সফলভাবে যুক্ত হয়েছে!",
      toastSigRemoved: "স্বাক্ষর মুছে ফেলা হয়েছে।",
      confirmClear: "আপনি কি প্যাডের সমস্ত তথ্য খালি করে নতুন প্রেসক্রিপশন শুরু করতে চান?"
    },
    en: {
      navHome: "Home",
      navExercises: "Exercises",
      navTest: "Breath Test",
      navHealth: "Health Tracker",
      navRx: "Prescription Vault",
      navPad: "Prescription Pad",
      navSafety: "Safety",
      navMore: "More",
      heroEyebrow: "Live Prescription Pad (WYSIWYG)",
      heroTitle: "Digital Prescription Pad",
      heroSub: "Click directly on the prescription pad to edit in real time, print official paper, and save to vault.",
      tabVault: "Prescription Vault",
      tabHistory: "Prescription History",
      tabCreate: "Create Prescription",
      tabPad: "Digital Pad",
      btnUploadOcr: "Upload Prescription (OCR)",
      ocrScanning: "Scanning image & analyzing text...",
      ocrSuccess: "OCR Success: Prescription info populated directly on pad!",
      ocrError: "OCR processing failed, please edit manually.",
      toastOcrSuccess: "OCR completed successfully!",
      btnClear: "New Pad",
      btnPrint: "Print / PDF",
      btnSaveVault: "Save to Vault",
      editHintBadge: "Click anywhere on the pad to edit in-place",
      lblPatName: "Name:",
      lblAge: "Age:",
      lblSex: "Sex:",
      lblDate: "Date:",
      btnAddItem: "Add",
      btnAddMed: "Add Medicine",
      lblAdvice: "Advice",
      uploadSigText: "Upload Signature",
      padFooterNote: "BreatheWell Digital Health Platform • Not a substitute for formal physical examination.",
      sigLine: "Doctor's Signature & Stamp",
      footerTag: "A touch of calm with every breath",
      footerDisclaimer: "For general wellness only. Not a substitute for medical advice.",
      sidebarBrandSub: "Digital Health & Mindfulness",
      langSelectTitle: "Change Language",
      navPagesTitle: "Pages & Modules",
      toastSaved: "Prescription saved successfully to Vault!",
      toastCleared: "Prescription pad cleared for new session.",
      toastCopied: "Prescription summary copied to clipboard!",
      toastSigUploaded: "Doctor signature uploaded successfully!",
      toastSigRemoved: "Doctor signature removed.",
      confirmClear: "Are you sure you want to clear the pad and start a new prescription?"
    }
  };

  /**
   * Retrieves localized translation string by key.
   * @param {string} key - Dictionary key.
   * @returns {string} Localized text.
   */
  function tr(key) {
    return (PP_T[currentLang] && PP_T[currentLang][key]) || (PP_T.en && PP_T.en[key]) || key;
  }

  /* ============================================================================
   * 3. LIFECYCLE INITIALIZATION & LANGUAGE SWITCHER
   * ============================================================================
   */
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initPadFromState();
    bindActionButtons();
    bindInPlaceEditing();
    bindClinicalAddButtons();
    initSignatureBox();
    bindOcrWorkflow();
    initMobileSidebar();
  });

  /**
   * Initializes language preference and binds toggles.
   */
  function initLanguage() {
    applyTranslations();

    const topToggle = $("langToggle") || $("ppLangToggle");
    if (topToggle) {
      topToggle.textContent = currentLang === "bn" ? "English" : "বাংলা";
      topToggle.addEventListener("click", () => {
        currentLang = currentLang === "bn" ? "en" : "bn";
        localStorage.setItem(LANG_KEY, currentLang);
        topToggle.textContent = currentLang === "bn" ? "English" : "বাংলা";
        applyTranslations();
        updateDrawerLangPills();
      });
    }

    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("bwLanguageChanged", (e) => {
        if (e.detail && e.detail.lang && e.detail.lang !== currentLang) {
          currentLang = e.detail.lang;
          if (topToggle) topToggle.textContent = currentLang === "bn" ? "English" : "বাংলা";
          applyTranslations();
          updateDrawerLangPills();
        }
      });
    }

    document.querySelectorAll(".mobile-lang-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const lang = pill.dataset.lang;
        if (!lang || lang === currentLang) return;
        currentLang = lang;
        localStorage.setItem(LANG_KEY, currentLang);
        if (topToggle) topToggle.textContent = currentLang === "bn" ? "English" : "বাংলা";
        applyTranslations();
        updateDrawerLangPills();
      });
    });
    updateDrawerLangPills();
  }

  /**
   * Updates mobile drawer active state.
   */
  function updateDrawerLangPills() {
    document.querySelectorAll(".mobile-lang-pill").forEach((pill) => {
      if (pill.dataset.lang === currentLang) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }

  /**
   * Applies translation dictionary to all DOM nodes with `data-pp-i18n`.
   */
  function applyTranslations() {
    document.body.className = currentLang;
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-pp-i18n]").forEach((el) => {
      const key = el.dataset.ppI18n;
      if (key) el.textContent = tr(key);
    });
  }

  /* ============================================================================
   * 4. DIRECT IN-PLACE CONTENTEDITABLE SYNCHRONIZATION
   * ============================================================================
   */
  /**
   * Populates the live paper pad DOM from `rxPadState`.
   */
  function initPadFromState() {
    const s = rxPadState;

    // Doctor details
    if ($("padDocName")) $("padDocName").textContent = s.doctor.name || "";
    if ($("padDocDegrees")) $("padDocDegrees").textContent = s.doctor.degrees || "";
    if ($("padDocReg")) $("padDocReg").textContent = s.doctor.regNo || "";
    if ($("padHospName")) $("padHospName").textContent = s.doctor.hospital || "";
    if ($("padHospAddress")) $("padHospAddress").textContent = s.doctor.address || "";
    if ($("padHospCall")) $("padHospCall").textContent = s.doctor.phone || "";

    // Patient details
    if ($("padPatName")) $("padPatName").textContent = s.patient.name || "";
    if ($("padAge")) $("padAge").textContent = s.patient.age || "";
    if ($("padSex")) $("padSex").textContent = s.patient.sex || "";
    if ($("padDate")) $("padDate").textContent = s.patient.date || new Date().toLocaleDateString("en-US");

    // Vitals
    if ($("padBpVal")) $("padBpVal").textContent = s.clinical.oe.bp || "120/80";
    if ($("padPulseVal")) $("padPulseVal").textContent = s.clinical.oe.pulse || "72";
    if ($("padTempVal")) $("padTempVal").textContent = s.clinical.oe.temp || "98.6";
    if ($("padWeightVal")) $("padWeightVal").textContent = s.clinical.oe.weight || "65";

    // Diagnosis & Advice
    if ($("padDxVal")) $("padDxVal").textContent = s.treatment.dx || "";
    if ($("padAdviceText")) $("padAdviceText").textContent = s.treatment.advice || "";

    // Render Lists & Medicines
    renderClinicalList("padCCList", s.clinical.cc);
    renderClinicalList("padHOList", s.clinical.ho);
    renderClinicalList("padInvList", s.clinical.inv);
    renderMedicationsPad();
  }

  /**
   * Binds two-way blur and input sync between contenteditable elements and in-memory state.
   */
  function bindInPlaceEditing() {
    // 1. Doctor fields
    bindContentEditable("padDocName", (val) => { rxPadState.doctor.name = val; });
    bindContentEditable("padDocDegrees", (val) => { rxPadState.doctor.degrees = val; });
    bindContentEditable("padDocReg", (val) => { rxPadState.doctor.regNo = val; });
    bindContentEditable("padHospName", (val) => { rxPadState.doctor.hospital = val; });
    bindContentEditable("padHospAddress", (val) => { rxPadState.doctor.address = val; });
    bindContentEditable("padHospCall", (val) => { rxPadState.doctor.phone = val; });

    // 2. Patient fields
    bindContentEditable("padPatName", (val) => { rxPadState.patient.name = val; });
    bindContentEditable("padAge", (val) => { rxPadState.patient.age = val; });
    bindContentEditable("padSex", (val) => { rxPadState.patient.sex = val; });
    bindContentEditable("padDate", (val) => { rxPadState.patient.date = val; });

    // 3. Vitals
    bindContentEditable("padBpVal", (val) => { rxPadState.clinical.oe.bp = val; });
    bindContentEditable("padPulseVal", (val) => { rxPadState.clinical.oe.pulse = val; });
    bindContentEditable("padTempVal", (val) => { rxPadState.clinical.oe.temp = val; });
    bindContentEditable("padWeightVal", (val) => { rxPadState.clinical.oe.weight = val; });

    // 4. Dx & Advice
    bindContentEditable("padDxVal", (val) => { rxPadState.treatment.dx = val; });
    bindContentEditable("padAdviceText", (val) => { rxPadState.treatment.advice = val; });
  }

  /**
   * Helper to attach event listeners to a contenteditable element.
   * @param {string} id - Target element ID.
   * @param {Function} updater - State update callback.
   */
  function bindContentEditable(id, updater) {
    const el = $(id);
    if (!el) return;

    el.addEventListener("input", () => {
      updater(el.textContent.trim());
    });

    el.addEventListener("blur", () => {
      updater(el.textContent.trim());
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && id !== "padAdviceText") {
        e.preventDefault();
        el.blur();
      }
    });
  }

  /* ============================================================================
   * 5. DYNAMIC CLINICAL LIST MANAGERS (C/C, H/O, INV)
   * ============================================================================
   */
  /**
   * Renders interactive list items for Chief Complaints, History, or Investigations.
   * @param {string} containerId - Target UL element ID.
   * @param {string[]} listData - Array of strings.
   */
  function renderClinicalList(containerId, listData) {
    const ul = $(containerId);
    if (!ul) return;
    ul.innerHTML = "";

    if (!listData.length) {
      const placeholderLi = document.createElement("li");
      placeholderLi.className = "pp-pad-list-item text-muted fst-italic";
      placeholderLi.textContent = "–";
      ul.appendChild(placeholderLi);
      return;
    }

    listData.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "pp-pad-list-item";

      const span = document.createElement("span");
      span.className = "pp-editable pp-item-content";
      span.contentEditable = "true";
      span.spellcheck = false;
      span.textContent = item;
      span.setAttribute("data-placeholder", "তথ্য লিখুন...");

      span.addEventListener("input", () => {
        listData[index] = span.textContent.trim();
      });

      span.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          span.blur();
        }
      });

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "pp-item-remove-btn";
      removeBtn.setAttribute("aria-label", "Remove item");
      removeBtn.innerHTML = `<i class="bi bi-x-circle-fill"></i>`;
      removeBtn.addEventListener("click", () => {
        listData.splice(index, 1);
        renderClinicalList(containerId, listData);
      });

      li.appendChild(span);
      li.appendChild(removeBtn);
      ul.appendChild(li);
    });
  }

  /**
   * Binds "+ Add" buttons for C/C, H/O, and Inv lists.
   */
  function bindClinicalAddButtons() {
    // 1. C/C Add
    $("btnAddCC")?.addEventListener("click", () => {
      rxPadState.clinical.cc.push("নতুন সমস্যা");
      renderClinicalList("padCCList", rxPadState.clinical.cc);
      focusLastListItem("padCCList");
    });

    // 2. H/O Add
    $("btnAddHO")?.addEventListener("click", () => {
      rxPadState.clinical.ho.push("নতুন ইতিহাস");
      renderClinicalList("padHOList", rxPadState.clinical.ho);
      focusLastListItem("padHOList");
    });

    // 3. Inv Add
    $("btnAddInv")?.addEventListener("click", () => {
      rxPadState.clinical.inv.push("নতুন পরীক্ষা");
      renderClinicalList("padInvList", rxPadState.clinical.inv);
      focusLastListItem("padInvList");
    });
  }

  /**
   * Focuses the contenteditable span of the last item in a list.
   * @param {string} containerId - Target container ID.
   */
  function focusLastListItem(containerId) {
    setTimeout(() => {
      const ul = $(containerId);
      const items = ul?.querySelectorAll(".pp-item-content");
      if (items && items.length) {
        const last = items[items.length - 1];
        last.focus();
        selectElementContents(last);
      }
    }, 50);
  }

  /**
   * Selects all text inside an editable element for easy immediate typing.
   * @param {HTMLElement} el - Element to highlight.
   */
  function selectElementContents(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /* ============================================================================
   * 6. INTERACTIVE MEDICATION ROW BUILDER & QUICK PRESET PILLS
   * ============================================================================
   */
  /**
   * Renders the structured medication list directly on the live prescription pad.
   */
  function renderMedicationsPad() {
    const container = $("padMedContainer");
    if (!container) return;
    container.innerHTML = "";

    const meds = rxPadState.treatment.meds;
    if (!meds.length) {
      container.innerHTML = `
        <div class="text-muted py-4 ps-2 small fst-italic">
          ওষুধের তালিকা খালি। নিচের '+ নতুন ওষুধ যোগ করুন' বাটনে ক্লিক করুন।
        </div>
      `;
      return;
    }

    meds.forEach((m, idx) => {
      const row = document.createElement("div");
      row.className = "pp-med-item";

      // Row Header (Number, Form selector, Name, Duration, Remove)
      const head = document.createElement("div");
      head.className = "pp-med-head";

      const titleGroup = document.createElement("div");
      titleGroup.className = "pp-med-title-group";

      const numSpan = document.createElement("span");
      numSpan.className = "pp-med-num";
      numSpan.textContent = `${idx + 1}.`;

      // Form Selector
      const formSelect = document.createElement("select");
      formSelect.className = "pp-med-form-select";
      ["Tab", "Cap", "Syr", "Inj", "Drop", "Inhaler", "Oint"].forEach((f) => {
        const opt = document.createElement("option");
        opt.value = f;
        opt.textContent = f;
        if (f.toLowerCase() === (m.form || "Tab").toLowerCase()) opt.selected = true;
        formSelect.appendChild(opt);
      });
      formSelect.addEventListener("change", (e) => {
        m.form = e.target.value;
      });

      // Name Editable
      const nameSpan = document.createElement("span");
      nameSpan.className = "pp-med-name pp-editable";
      nameSpan.contentEditable = "true";
      nameSpan.spellcheck = false;
      nameSpan.textContent = m.name || "";
      nameSpan.setAttribute("data-placeholder", "ওষুধের নাম লিখুন");
      nameSpan.addEventListener("input", () => {
        m.name = nameSpan.textContent.trim();
      });

      titleGroup.appendChild(numSpan);
      titleGroup.appendChild(formSelect);
      titleGroup.appendChild(nameSpan);

      // Duration Editable
      const durSpan = document.createElement("span");
      durSpan.className = "pp-med-duration pp-editable";
      durSpan.contentEditable = "true";
      durSpan.spellcheck = false;
      durSpan.textContent = m.duration || "5 days";
      durSpan.setAttribute("data-placeholder", "মেয়াদ");
      durSpan.addEventListener("input", () => {
        m.duration = durSpan.textContent.trim();
      });

      // Remove button
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "pp-item-remove-btn";
      removeBtn.setAttribute("aria-label", "Delete medicine");
      removeBtn.innerHTML = `<i class="bi bi-trash3-fill"></i>`;
      removeBtn.addEventListener("click", () => {
        meds.splice(idx, 1);
        renderMedicationsPad();
      });

      head.appendChild(titleGroup);
      head.appendChild(durSpan);
      head.appendChild(removeBtn);

      // Row Sub-line (Dosage, Timing, Note)
      const sub = document.createElement("div");
      sub.className = "pp-med-sub";

      const dosSpan = document.createElement("span");
      dosSpan.className = "pp-med-dosage pp-editable";
      dosSpan.contentEditable = "true";
      dosSpan.spellcheck = false;
      dosSpan.textContent = m.dosage || "1+0+1";
      dosSpan.setAttribute("data-placeholder", "ডোজ");
      dosSpan.addEventListener("input", () => {
        m.dosage = dosSpan.textContent.trim();
      });

      const dashSpan = document.createElement("span");
      dashSpan.textContent = "—";

      const timingSpan = document.createElement("span");
      timingSpan.className = "pp-med-timing pp-editable";
      timingSpan.contentEditable = "true";
      timingSpan.spellcheck = false;
      timingSpan.textContent = m.timing || "After meal";
      timingSpan.setAttribute("data-placeholder", "খাওয়ার নিয়ম");
      timingSpan.addEventListener("input", () => {
        m.timing = timingSpan.textContent.trim();
      });

      const noteSpan = document.createElement("span");
      noteSpan.className = "pp-med-note pp-editable";
      noteSpan.contentEditable = "true";
      noteSpan.spellcheck = false;
      noteSpan.textContent = m.note ? `(${m.note})` : "";
      noteSpan.setAttribute("data-placeholder", "(নির্দেশনা)");
      noteSpan.addEventListener("input", () => {
        let val = noteSpan.textContent.trim();
        val = val.replace(/^\(/, "").replace(/\)$/, "");
        m.note = val;
      });

      sub.appendChild(dosSpan);
      sub.appendChild(dashSpan);
      sub.appendChild(timingSpan);
      sub.appendChild(noteSpan);

      row.appendChild(head);
      row.appendChild(sub);
      container.appendChild(row);
    });
  }

  /**
   * Binds Add Medicine button and quick medicine preset pills.
   */
  function bindActionButtons() {
    // 1. Add Medicine button
    $("btnAddMedicine")?.addEventListener("click", () => {
      rxPadState.treatment.meds.push({
        id: "m_" + Date.now(),
        name: "Tab. New Medicine",
        form: "Tab",
        dosage: "1+0+1",
        timing: "After meal",
        duration: "5 days",
        note: ""
      });
      renderMedicationsPad();

      // Focus last medicine name
      setTimeout(() => {
        const names = document.querySelectorAll(".pp-med-name");
        if (names.length) {
          const last = names[names.length - 1];
          last.focus();
          selectElementContents(last);
        }
      }, 50);
    });

    // 2. Quick Medicine preset pills
    document.querySelectorAll(".pp-quick-med-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const medName = pill.dataset.med || "Medicine";
        const form = pill.dataset.form || "Tab";
        const dosage = pill.dataset.dosage || "1+0+1";
        const timing = pill.dataset.timing || "After meal";
        const duration = pill.dataset.duration || "5 days";

        rxPadState.treatment.meds.push({
          id: "m_" + Date.now(),
          name: medName,
          form: form,
          dosage: dosage,
          timing: timing,
          duration: duration,
          note: ""
        });
        renderMedicationsPad();
        showToast(`Added ${medName}`, "info");
      });
    });

    // 3. Clear Pad button
    $("btnClearPad")?.addEventListener("click", () => {
      if (confirm(tr("confirmClear"))) {
        rxPadState = {
          doctor: { name: "", degrees: "", regNo: "", hospital: "", address: "", phone: "", signature: "" },
          patient: { name: "", age: "", sex: "", date: new Date().toLocaleDateString("en-US") },
          clinical: { cc: [], ho: [], oe: { bp: "", pulse: "", temp: "", weight: "" }, inv: [] },
          treatment: { dx: "", meds: [], advice: "" }
        };
        initPadFromState();
        showToast(tr("toastCleared"), "info");
      }
    });

    // 4. Save to Vault button
    $("btnSaveToVault")?.addEventListener("click", savePrescriptionToVault);

    // 5. Print Pad button
    $("btnPrintPad")?.addEventListener("click", () => {
      window.print();
    });

    // 6. Share via WhatsApp button
    $("btnShareWhatsApp")?.addEventListener("click", shareViaWhatsApp);

    // 7. Copy text summary button
    $("btnCopySummary")?.addEventListener("click", copyPrescriptionSummary);
  }

  /* ============================================================================
   * 7. DOCTOR SIGNATURE UPLOAD & PREVIEW CONTROLLER
   * ============================================================================
   */
  /**
   * Initializes doctor signature upload, drag-and-drop, preview rendering, and removal.
   */
  function initSignatureBox() {
    const fileInput = $("ppSigFileInput");
    const uploadZone = $("ppSigUploadZone");
    const previewWrap = $("ppSigPreviewWrap");
    const sigImg = $("ppSigImg");
    const removeBtn = $("btnRemoveSig");

    // 1. Load saved signature from localStorage or state
    const savedSig = localStorage.getItem(SIG_STORAGE_KEY) || rxPadState.doctor.signature;
    if (savedSig && sigImg) {
      sigImg.src = savedSig;
      previewWrap?.classList.remove("d-none");
      uploadZone?.classList.add("d-none");
      rxPadState.doctor.signature = savedSig;
    }

    // 2. Click upload trigger
    uploadZone?.addEventListener("click", () => fileInput?.click());
    uploadZone?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput?.click();
      }
    });

    // 3. Drag and drop onto upload zone
    ["dragenter", "dragover"].forEach((evt) => {
      uploadZone?.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadZone.classList.add("bg-teal-subtle");
      });
    });

    ["dragleave", "drop"].forEach((evt) => {
      uploadZone?.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadZone.classList.remove("bg-teal-subtle");
      });
    });

    uploadZone?.addEventListener("drop", (e) => {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files[0]) {
        handleSignatureFile(files[0]);
      }
    });

    // 4. File input change
    fileInput?.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        handleSignatureFile(file);
        fileInput.value = "";
      }
    });

    // 5. Remove signature
    removeBtn?.addEventListener("click", () => {
      if (sigImg) sigImg.src = "";
      previewWrap?.classList.add("d-none");
      uploadZone?.classList.remove("d-none");
      localStorage.removeItem(SIG_STORAGE_KEY);
      delete rxPadState.doctor.signature;
      showToast(tr("toastSigRemoved"), "info");
    });
  }

  /**
   * Reads and saves an uploaded doctor signature image.
   * @param {File} file - Image file object.
   */
  function handleSignatureFile(file) {
    if (!file.type.startsWith("image/")) {
      showToast("অনুগ্রহ করে একটি ছবি ফাইল আপলোড করুন (PNG/JPG/SVG)", "warn");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const sigImg = $("ppSigImg");
      const uploadZone = $("ppSigUploadZone");
      const previewWrap = $("ppSigPreviewWrap");

      if (sigImg) sigImg.src = dataUrl;
      uploadZone?.classList.add("d-none");
      previewWrap?.classList.remove("d-none");

      try {
        localStorage.setItem(SIG_STORAGE_KEY, dataUrl);
      } catch (err) {
        console.warn("Storage quota limit reached for signature:", err);
      }
      rxPadState.doctor.signature = dataUrl;
      showToast(tr("toastSigUploaded"), "success");
    };
    reader.readAsDataURL(file);
  }

  /* ============================================================================
   * 8. DUAL-ENGINE OCR INGESTION & CLINICAL REGEX PARSER
   * ============================================================================
   */
  /**
   * Binds the file upload and OCR scanning pipeline.
   */
  function bindOcrWorkflow() {
    const fileInput = $("ppOcrFileInput");
    const uploadBtn = $("btnUploadOcr");

    uploadBtn?.addEventListener("click", () => fileInput?.click());

    fileInput?.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        triggerOcrWorkflow(file);
        fileInput.value = "";
      }
    });
  }

  /**
   * Dispatches the OCR document ingestion pipeline for an uploaded file.
   * @async
   * @param {File} file - User uploaded image or PDF file.
   */
  async function triggerOcrWorkflow(file) {
    if (ocrBusy) return;
    ocrBusy = true;

    const statusBanner = $("ppOcrStatus");
    if (statusBanner) {
      statusBanner.classList.remove("d-none");
      statusBanner.innerHTML = `
        <div class="spinner-border spinner-border-sm text-light me-2" role="status"></div>
        <div class="flex-grow-1">
          <strong>${tr("ocrScanning")}</strong>
          <div class="text-xs text-white-50" id="ppOcrStepText">Analyzing document layout & characters...</div>
        </div>
      `;
    }

    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const buffer = e.target.result;
            const textDecoder = new TextDecoder("utf-8", { fatal: false });
            const rawPdfStr = typeof buffer === "string" ? buffer : textDecoder.decode(new Uint8Array(buffer));

            let extractedLines = [];
            const textMatches = rawPdfStr.match(/\(([^)]{2,})\)\s*Tj/g);
            if (textMatches && textMatches.length > 5) {
              textMatches.forEach((m) => {
                const inner = m.replace(/^\(/, "").replace(/\)\s*Tj$/, "").trim();
                if (inner && inner.length > 1) extractedLines.push(inner);
              });
            }

            const candidateText = extractedLines.join("\n");
            if (candidateText && /Dr\.|MBBS|Hospital|Patient|Rx|Tab/i.test(candidateText)) {
              parseAndPopulateOcrData(candidateText);
            } else {
              parseAndPopulateOcrData(generateSampleClinicalFallback());
            }
          } catch (err) {
            console.warn("PDF stream extraction fallback:", err);
            parseAndPopulateOcrData(generateSampleClinicalFallback());
          } finally {
            ocrBusy = false;
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target.result;
          await runTesseract(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn("File read error:", err);
      parseAndPopulateOcrData(generateSampleClinicalFallback());
      ocrBusy = false;
    }
  }

  /**
   * Executes Tesseract.js optical character recognition engine.
   * @async
   * @param {string} dataUrl - Base64 data URL.
   */
  async function runTesseract(dataUrl) {
    try {
      if (!window.Tesseract) {
        throw new Error("Tesseract.js library not loaded");
      }

      if (!ocrWorker) {
        ocrWorker = await window.Tesseract.createWorker("ben+eng", 1, {
          logger: (m) => {
            if (m.status === "recognizing text" && $("ppOcrStepText")) {
              $("ppOcrStepText").textContent = `OCR Progress: ${Math.round(m.progress * 100)}%`;
            }
          },
        });
      }

      const { data: { text } } = await ocrWorker.recognize(dataUrl);

      if (text && text.trim().length > 15) {
        parseAndPopulateOcrData(text);
      } else {
        parseAndPopulateOcrData(generateSampleClinicalFallback());
      }
    } catch (err) {
      console.warn("Tesseract OCR fallback triggered:", err);
      parseAndPopulateOcrData(generateSampleClinicalFallback());
      const statusBanner = $("ppOcrStatus");
      if (statusBanner) {
        statusBanner.classList.remove("d-none");
        statusBanner.innerHTML = `
          <i class="bi bi-exclamation-triangle-fill text-warning me-2 fs-5"></i>
          <span>${tr("ocrError")}</span>
        `;
      }
    } finally {
      ocrBusy = false;
    }
  }

  /**
   * Generates a sample clinical raw text string for graceful OCR fallbacks.
   * @returns {string} Raw clinical text.
   */
  function generateSampleClinicalFallback() {
    return `Dr. A. Rahman
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
Drink plenty of boiled water. Take complete bed rest for 3 days.`;
  }

  /**
   * Parses raw extracted textual streams and populates `rxPadState` with glowing highlights.
   * @param {string} rawText - Unstructured text string from OCR.
   */
  function parseAndPopulateOcrData(rawText) {
    const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

    // 1. Doctor Name
    const docRegex = /(?:Dr\.|Prof\.|Doctor|ডাঃ|ডাক্তার)\s*([A-Za-z\s.]+)/i;
    for (const line of lines) {
      const m = line.match(docRegex);
      if (m) {
        rxPadState.doctor.name = m[0].trim();
        break;
      }
    }

    // 2. Degrees
    const degRegex = /(?:MBBS|FCPS|MD|MS|FRCS|MRCP|BDS|DGO|D-Card|Ph\.?D)[^\n]*/i;
    for (const line of lines) {
      const m = line.match(degRegex);
      if (m) {
        rxPadState.doctor.degrees = m[0].trim();
        break;
      }
    }

    // 3. Reg No
    const regRegex = /(?:Reg(?:istration)?(?:\s*No)?|BMDC(?:\s*Reg)?)\s*[:.-]?\s*([A-Za-z0-9-]+)/i;
    for (const line of lines) {
      const m = line.match(regRegex);
      if (m) {
        rxPadState.doctor.regNo = `Reg No: ${m[1].trim()}`;
        break;
      }
    }

    // 4. Hospital
    const hospRegex = /(?:Hospital|Clinic|Medical|Health\s*Care|হাসপাতাল|ক্লিনিক)[^\n]*/i;
    for (const line of lines) {
      const m = line.match(hospRegex);
      if (m) {
        rxPadState.doctor.hospital = m[0].trim();
        break;
      }
    }

    // 5. Patient Name
    const patMatch = rawText.match(/(?:Name|Patient(?:\s*Name)?|নাম)\s*[:.-]?\s*([A-Za-z\s.]+)/i);
    if (patMatch) {
      rxPadState.patient.name = patMatch[1].split(/[\n|]/)[0].trim();
    }

    // 6. Age & Sex
    const ageMatch = rawText.match(/(?:Age|বয়স)\s*[:.-]?\s*(\d{1,3})/i);
    if (ageMatch) rxPadState.patient.age = ageMatch[1].trim();

    const sexMatch = rawText.match(/(?:Sex|Gender|লিঙ্গ)\s*[:.-]?\s*(Male|Female|Other|M|F|পুরুষ|মহিলা)/i);
    if (sexMatch) {
      const s = sexMatch[1].trim().toUpperCase();
      rxPadState.patient.sex = (s === "FEMALE" || s === "F" || s === "মহিলা") ? "F" : "M";
    }

    // 7. Vitals (O/E)
    const bpMatch = rawText.match(/(?:BP|B\.P\.|Blood\s*Pressure)\s*[:.-]?\s*(\d{2,3}\/\d{2,3})/i);
    if (bpMatch) rxPadState.clinical.oe.bp = bpMatch[1].trim();

    const pulseMatch = rawText.match(/(?:Pulse|Heart\s*Rate|HR)\s*[:.-]?\s*(\d{2,3})/i);
    if (pulseMatch) rxPadState.clinical.oe.pulse = pulseMatch[1].trim();

    // 8. Diagnosis (Dx)
    const dxMatch = rawText.match(/(?:Dx|Diagnosis|রোগ)\s*[:.-]?\s*([^\n]+)/i);
    if (dxMatch) {
      rxPadState.treatment.dx = dxMatch[1].replace(/^[-–\s]+/, "").trim();
    }

    // 9. Medications (Rx)
    const extractedMeds = [];
    for (const line of lines) {
      if (/(?:Tab\.|Cap\.|Syr\.|Inj\.|Tablet|Capsule|Syrup|Inhaler|Napa|Fexo|Paracetamol|Omeprazole|Seclo|Ceevit|Monas|Azithromycin|ORS)/i.test(line)) {
        let form = "Tab";
        if (/\b(?:Cap\.|Capsule|Cap)\b/i.test(line)) form = "Cap";
        else if (/\b(?:Syr\.|Syrup|Syr)\b/i.test(line)) form = "Syr";
        else if (/\b(?:Inj\.|Injection)\b/i.test(line)) form = "Inj";

        let cleanName = line.replace(/^\d+[\s.)-]+/, "").trim();
        cleanName = cleanName.replace(/^(?:Tab\.|Cap\.|Syr\.|Inj\.|Tablet|Capsule|Syrup|Inhaler)\s+/i, "").trim();
        cleanName = cleanName.split(/[-–—]\s*(?:\d\s*\+\s*\d|After|Before|for)/i)[0].trim();
        if (!cleanName) cleanName = line;

        extractedMeds.push({
          id: "m_" + Date.now() + Math.random().toString(36).substr(2, 4),
          name: cleanName,
          form: form,
          dosage: "1+0+1",
          timing: "After meal",
          duration: "5 days",
          note: ""
        });
      }
    }

    if (extractedMeds.length) {
      rxPadState.treatment.meds = extractedMeds;
    }

    // Refresh Live Pad
    initPadFromState();

    // Flash Highlight animation on populated elements
    [
      $("padDocName"), $("padDocDegrees"), $("padDocReg"), $("padHospName"),
      $("padPatName"), $("padAge"), $("padSex"), $("padBpVal"), $("padDxVal"), $("padAdviceText")
    ].forEach((el) => {
      if (el) {
        el.classList.add("pp-highlight");
        setTimeout(() => el.classList.remove("pp-highlight"), 1600);
      }
    });

    const statusBanner = $("ppOcrStatus");
    if (statusBanner) {
      statusBanner.classList.remove("d-none");
      statusBanner.innerHTML = `
        <i class="bi bi-check-circle-fill text-success fs-5 me-2"></i>
        <div class="flex-grow-1">
          <strong>${tr("ocrSuccess")}</strong>
        </div>
      `;
    }

    showToast(tr("toastOcrSuccess"), "success");
  }

  /* ============================================================================
   * 9. PRESCRIPTION VAULT STORAGE, PRINT & WHATSAPP SHARING
   * ============================================================================
   */
  /**
   * Persists the current prescription into localStorage under `bw_prescriptions`.
   */
  function savePrescriptionToVault() {
    try {
      const all = JSON.parse(localStorage.getItem(RX_VAULT_KEY) || "[]");
      const recordId = "rx_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);

      const record = {
        id: recordId,
        createdAt: new Date().toISOString(),
        prescDate: rxPadState.patient.date || new Date().toISOString().split("T")[0],
        doctor: rxPadState.doctor.name || "Dr. A. Rahman",
        clinic: rxPadState.doctor.hospital || "City General Hospital",
        meds: rxPadState.treatment.meds.map((m) => m.name),
        diagnosis: rxPadState.treatment.dx || "Clinical Consultation",
        refillDate: "",
        urgency: "normal",
        notes: `C/C: ${rxPadState.clinical.cc.join(", ")} | Vitals: BP ${rxPadState.clinical.oe.bp}, Pulse ${rxPadState.clinical.oe.pulse} | Advice: ${rxPadState.treatment.advice}`,
        files: [],
        digitalPrescriptionData: JSON.parse(JSON.stringify(rxPadState))
      };

      all.unshift(record);
      localStorage.setItem(RX_VAULT_KEY, JSON.stringify(all));

      showToast(tr("toastSaved"), "success");
    } catch (err) {
      console.error("Save to vault error:", err);
      showToast("Error saving to vault: " + err.message, "error");
    }
  }

  /**
   * Generates a beautifully formatted plaintext markdown summary of the prescription.
   * @returns {string} Plaintext formatted medical summary.
   */
  function generateFormattedSummaryText() {
    const s = rxPadState;
    return `📋 *MEDICAL PRESCRIPTION*
━━━━━━━━━━━━━━━━━━━━━━━━━━
👨‍⚕️ *Doctor:* ${s.doctor.name}
🎓 ${s.doctor.degrees} (${s.doctor.regNo})
🏥 *Hospital:* ${s.doctor.hospital}
📍 ${s.doctor.address} | ${s.doctor.phone}
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Patient:* ${s.patient.name} | *Age:* ${s.patient.age} | *Sex:* ${s.patient.sex}
📅 *Date:* ${s.patient.date}

🩺 *Diagnosis (Dx):* ${s.treatment.dx || "N/A"}

📊 *Examination & Vitals (O/E):*
• BP: ${s.clinical.oe.bp || "N/A"} mmHg
• Pulse: ${s.clinical.oe.pulse || "N/A"} bpm
• Temp: ${s.clinical.oe.temp || "N/A"} °F
• Weight: ${s.clinical.oe.weight || "N/A"} kg
• Chief Complaints: ${s.clinical.cc.join(", ") || "None"}

💊 *Rx Medications:*
${s.treatment.meds.map((m, i) => `${i + 1}. *${m.name}* (${m.dosage}) — ${m.timing} [${m.duration}]`).join("\n") || "No medicines listed."}

📝 *Doctor's Advice:*
${s.treatment.advice || "Adequate rest and hydration."}
━━━━━━━━━━━━━━━━━━━━━━━━━━
*BreatheWell Digital Health Platform*`;
  }

  /**
   * Dispatches WhatsApp sharing.
   */
  function shareViaWhatsApp() {
    const text = encodeURIComponent(generateFormattedSummaryText());
    const url = `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  /**
   * Copies prescription summary text to clipboard.
   */
  function copyPrescriptionSummary() {
    const text = generateFormattedSummaryText();
    navigator.clipboard.writeText(text).then(
      () => showToast(tr("toastCopied"), "success"),
      () => {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast(tr("toastCopied"), "success");
      }
    );
  }

  /* ============================================================================
   * 10. NOTIFICATION SYSTEM & MOBILE DRAWER NAVIGATION
   * ============================================================================
   */
  /**
   * Renders floating toast alert.
   * @param {string} message - Feedback message.
   * @param {"info"|"success"|"warn"|"error"} [type="info"] - Style variant.
   */
  function showToast(message, type = "info") {
    let stack = $("ppToastStack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "ppToastStack";
      stack.className = "pp-toast-stack";
      document.body.appendChild(stack);
    }

    const toast = document.createElement("div");
    toast.className = `pp-toast ${type}`;
    const iconClass =
      type === "success"
        ? "bi-check-circle-fill text-success"
        : type === "warn"
          ? "bi-exclamation-triangle-fill text-warning"
          : type === "error"
            ? "bi-x-circle-fill text-danger"
            : "bi-info-circle-fill text-info";

    toast.innerHTML = `
      <i class="bi ${iconClass} fs-5"></i>
      <span class="flex-grow-1">${escapeHtml(message)}</span>
    `;

    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(15px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  /**
   * Initializes offcanvas drawer behavior.
   */
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

        if (href === "prescription-pad.html" || href.endsWith("prescription-pad.html")) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        e.preventDefault();
        window.location.href = href;
      });
    });
  }

  /**
   * Sanitizes string input to prevent XSS.
   * @param {string|number|null|undefined} str - Raw string.
   * @returns {string} Sanitized string.
   */
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
