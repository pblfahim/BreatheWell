/**
 * ============================================================================
 * BreatheWell - Create Prescription Engine (create-prescription.js)
 * ============================================================================
 * Description:
 *   Interactive clinical prescription authoring engine. Provides real-time
 *   two-way synchronization between input forms and a pixel-perfect digital
 *   doctor prescription pad preview modeled on hospital clinical charts.
 *   Includes one-click PDF sample loading, medicine scheduling, print layout,
 *   localStorage vault persistence, and WhatsApp sharing.
 * ============================================================================
 */

(function () {
  "use strict";

  // Storage key compatibility with BreatheWell Prescription Vault
  const RX_VAULT_KEY = "bw_prescriptions";
  const LANG_KEY = "bw_lang";

  // Current language state
  let currentLang = localStorage.getItem(LANG_KEY) || "bn";

  // Default Sample Data (Matches the user's PDF file precisely)
  const PDF_SAMPLE_DATA = {
    doctor: {
      name: "Dr. A. Rahman",
      degrees: "MBBS, FCPS (Medicine), MD (Neurology)",
      regNo: "Reg No: A-123456",
      hospital: "City General Hospital",
      address: "123 Health Avenue, Dhaka",
      phone: "Call: +880 1700-000000"
    },
    patient: {
      name: "Rahim Uddin",
      age: "45",
      sex: "M",
      date: "11/6/2026"
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
      dx: "Viral Fever (Suspected) - Flu",
      meds: [
        {
          name: "Tab. Napa Extend (Paracetamol)",
          form: "Tab",
          strength: "665mg",
          dosage: "1+0+1",
          timing: "After meal",
          duration: "5 days",
          note: "Take after food"
        },
        {
          name: "Tab. Fexo (Fexofenadine HCl)",
          form: "Tab",
          strength: "120mg",
          dosage: "0+0+1",
          timing: "After meal",
          duration: "7 days",
          note: "For body aches & congestion"
        },
        {
          name: "Oral Rehydration Salt (ORS)",
          form: "Sachet",
          strength: "1 sachet",
          dosage: "As needed",
          timing: "In 500ml pure water",
          duration: "3 days",
          note: "Drink plenty of electrolytes"
        }
      ],
      advice: "Drink plenty of boiled water & oral fluids.\nTake complete bed rest for 3 days.\nTepid sponge on forehead if temperature > 101°F.\nFollow up after 3-5 days if fever persists."
    }
  };

  // Live Working Prescription State
  let rxState = JSON.parse(JSON.stringify(PDF_SAMPLE_DATA));

  // ============================================================================
  // TRANSLATION DICTIONARY
  // ============================================================================
  const CP_T = {
    bn: {
      navHome: "হোম",
      navExercises: "অনুশীলন",
      navTest: "শ্বাসের পরীক্ষা",
      navHealth: "স্বাস্থ্য ট্র্যাকার",
      navRx: "প্রেসক্রিপশন ভল্ট",
      navSafety: "নিরাপত্তা",
      navMore: "আরও",
      heroEyebrow: "ডিজিটাল প্রেসক্রিপশন মেকার",
      heroTitle: "প্রেসক্রিপশন তৈরি করুন",
      heroSub: "ডাক্তারের ব্যবস্থাপত্র তৈরি করুন, প্রিন্ট করুন এবং ভল্টে সংরক্ষণ করুন।",
      btnLoadPdfSample: "নমুনা লোড করুন (PDF)",
      btnClear: "নতুন ফর্ম",
      btnPrint: "প্রিন্ট / PDF",
      btnSaveVault: "ভল্টে সংরক্ষণ করুন",
      btnShareWA: "হোয়াটসঅ্যাপ শেয়ার",
      btnCopyText: "কপি বিবরণ",
      cardDoctorTitle: "ডাক্তার ও হাসপাতালের তথ্য",
      cardPatientTitle: "রোগীর তথ্য",
      cardClinicalTitle: "ক্লিনিক্যাল হিস্ট্রি ও পরীক্ষা (O/E)",
      cardTreatmentTitle: "চিকিৎসা ও ওষুধ (Rx)",
      lblDoctorName: "ডাক্তারের নাম",
      lblDegrees: "ডিগ্রি ও বিশেষজ্ঞতা",
      lblRegNo: "রেজিস্ট্রেশন নম্বর",
      lblHospitalName: "হাসপাতাল / ক্লিনিক",
      lblHospitalAddress: "ঠিকানা",
      lblHospitalPhone: "মোবাইল / হেল্পলাইন",
      lblPatientName: "রোগীর নাম",
      lblAge: "বয়স",
      lblSex: "লিঙ্গ",
      lblDate: "তারিখ",
      lblCC: "প্রধান সমস্যা (C/C)",
      lblHO: "অতীত রোগ ইতিহাস (H/O)",
      lblOE: "শারীরিক পরীক্ষা (O/E Vitals)",
      lblInv: "ল্যাব পরীক্ষা (Inv.)",
      lblDx: "রোগনির্ণয় (Dx)",
      lblMeds: "ওষুধের তালিকা (Rx)",
      lblAdvice: "পরামর্শ ও নির্দেশনা",
      addMedicine: "ওষুধ যোগ করুন",
      typeSlash: "কমান্ড দিতে বা দ্রুত ওষুধ যোগ করতে '/' চাপুন",
      colMedName: "ওষুধের নাম",
      colDosage: "ডোজ",
      colTiming: "সময়",
      colDuration: "মেয়াদ",
      colAction: "একশন",
      toastSaved: "প্রেসক্রিপশন সফলভাবে ভল্টে সংরক্ষিত হয়েছে!",
      toastLoaded: "PDF নমুনা প্রেসক্রিপশন সফলভাবে লোড হয়েছে!",
      toastCleared: "নতুন প্রেসক্রিপশনের জন্য ফর্ম খালি করা হয়েছে।",
      toastCopied: "প্রেসক্রিপশনের বিবরণ ক্লিপবোর্ডে কপি করা হয়েছে!",
      confirmClear: "আপনি কি ফর্মটি খালি করে নতুন প্রেসক্রিপশন তৈরি করতে চান?",
      sexMale: "পুরুষ (M)",
      sexFemale: "মহিলা (F)",
      sexOther: "অন্যান্য",
      sigLine: "ডাক্তারের স্বাক্ষর ও সিল"
    },
    en: {
      navHome: "Home",
      navExercises: "Exercises",
      navTest: "Breath Test",
      navHealth: "Health Tracker",
      navRx: "Prescription Vault",
      navSafety: "Safety",
      navMore: "More",
      heroEyebrow: "Digital Prescription Studio",
      heroTitle: "Create Prescription",
      heroSub: "Design, print, and save clinical medical prescriptions with instant PDF paper preview.",
      btnLoadPdfSample: "Load Sample (From PDF)",
      btnClear: "New / Clear",
      btnPrint: "Print / Save PDF",
      btnSaveVault: "Save to Vault",
      btnShareWA: "Share WhatsApp",
      btnCopyText: "Copy Summary",
      cardDoctorTitle: "Doctor & Hospital Information",
      cardPatientTitle: "Patient Information",
      cardClinicalTitle: "Clinical History & Examination (O/E)",
      cardTreatmentTitle: "Treatment & Medicines (Rx)",
      lblDoctorName: "Doctor Name",
      lblDegrees: "Degrees & Specialty",
      lblRegNo: "Registration No",
      lblHospitalName: "Hospital / Clinic",
      lblHospitalAddress: "Address",
      lblHospitalPhone: "Contact / Hotline",
      lblPatientName: "Patient Name",
      lblAge: "Age",
      lblSex: "Sex",
      lblDate: "Date",
      lblCC: "Chief Complaints (C/C)",
      lblHO: "History of Past Illness (H/O)",
      lblOE: "On Examination (O/E Vitals)",
      lblInv: "Investigations (Inv.)",
      lblDx: "Diagnosis (Dx)",
      lblMeds: "Medication List (Rx)",
      lblAdvice: "Doctor's Advice",
      addMedicine: "Add Medicine",
      typeSlash: "Press '/' to quickly add medicines or commands",
      colMedName: "Medicine Name",
      colDosage: "Dosage",
      colTiming: "Timing",
      colDuration: "Duration",
      colAction: "Action",
      toastSaved: "Prescription saved successfully to Vault!",
      toastLoaded: "PDF Sample prescription loaded successfully!",
      toastCleared: "Form cleared for new prescription.",
      toastCopied: "Prescription summary copied to clipboard!",
      confirmClear: "Are you sure you want to clear the form and start a new prescription?",
      sexMale: "Male (M)",
      sexFemale: "Female (F)",
      sexOther: "Other",
      sigLine: "Doctor's Signature & Stamp"
    }
  };

  function tr(key) {
    return CP_T[currentLang]?.[key] || CP_T["en"]?.[key] || key;
  }

  // Helper DOM selectors
  const $ = (id) => document.getElementById(id);

  // ============================================================================
  // INITIALIZATION & EVENT BINDINGS
  // ============================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initFormInputs();
    bindActionButtons();
    bindDynamicItemInputs();
    bindMedicineBuilder();
    initMobileSidebar();
    renderAll();
  });

  // Language switch
  function initLanguage() {
    const toggleBtn = $("cpLangToggle");
    if (toggleBtn) {
      toggleBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
      toggleBtn.addEventListener("click", () => {
        currentLang = currentLang === "bn" ? "en" : "bn";
        localStorage.setItem(LANG_KEY, currentLang);
        toggleBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
        applyTranslations();
        renderAll();
      });
    }

    // Sidebar pills
    document.querySelectorAll(".mobile-lang-pill[data-lang]").forEach((pill) => {
      if (pill.dataset.lang === currentLang) pill.classList.add("active");
      pill.addEventListener("click", () => {
        currentLang = pill.dataset.lang;
        localStorage.setItem(LANG_KEY, currentLang);
        document.querySelectorAll(".mobile-lang-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        if (toggleBtn) toggleBtn.textContent = currentLang === "bn" ? "English" : "বাংলা";
        applyTranslations();
        renderAll();
      });
    });

    applyTranslations();
  }

  function applyTranslations() {
    document.querySelectorAll("[data-cp-i18n]").forEach((el) => {
      const k = el.getAttribute("data-cp-i18n");
      if (k && tr(k)) el.textContent = tr(k);
    });
    document.querySelectorAll("[data-cp-placeholder]").forEach((el) => {
      const k = el.getAttribute("data-cp-placeholder");
      if (k && tr(k)) el.placeholder = tr(k);
    });
  }

  // Populate form controls from rxState
  function initFormInputs() {
    // Doctor
    if ($("inDocName")) $("inDocName").value = rxState.doctor.name;
    if ($("inDegrees")) $("inDegrees").value = rxState.doctor.degrees;
    if ($("inRegNo")) $("inRegNo").value = rxState.doctor.regNo;
    if ($("inHospital")) $("inHospital").value = rxState.doctor.hospital;
    if ($("inAddress")) $("inAddress").value = rxState.doctor.address;
    if ($("inPhone")) $("inPhone").value = rxState.doctor.phone;

    // Patient
    if ($("inPatName")) $("inPatName").value = rxState.patient.name;
    if ($("inAge")) $("inAge").value = rxState.patient.age;
    if ($("inSex")) $("inSex").value = rxState.patient.sex;
    if ($("inDate")) $("inDate").value = rxState.patient.date;

    // Vitals
    if ($("inBp")) $("inBp").value = rxState.clinical.oe.bp;
    if ($("inPulse")) $("inPulse").value = rxState.clinical.oe.pulse;
    if ($("inTemp")) $("inTemp").value = rxState.clinical.oe.temp;
    if ($("inWeight")) $("inWeight").value = rxState.clinical.oe.weight;

    // Dx & Advice
    if ($("inDx")) $("inDx").value = rxState.treatment.dx;
    if ($("inAdvice")) $("inAdvice").value = rxState.treatment.advice;

    // Listeners for live sync
    const liveFields = [
      ["inDocName", (v) => (rxState.doctor.name = v)],
      ["inDegrees", (v) => (rxState.doctor.degrees = v)],
      ["inRegNo", (v) => (rxState.doctor.regNo = v)],
      ["inHospital", (v) => (rxState.doctor.hospital = v)],
      ["inAddress", (v) => (rxState.doctor.address = v)],
      ["inPhone", (v) => (rxState.doctor.phone = v)],
      ["inPatName", (v) => (rxState.patient.name = v)],
      ["inAge", (v) => (rxState.patient.age = v)],
      ["inSex", (v) => (rxState.patient.sex = v)],
      ["inDate", (v) => (rxState.patient.date = v)],
      ["inBp", (v) => (rxState.clinical.oe.bp = v)],
      ["inPulse", (v) => (rxState.clinical.oe.pulse = v)],
      ["inTemp", (v) => (rxState.clinical.oe.temp = v)],
      ["inWeight", (v) => (rxState.clinical.oe.weight = v)],
      ["inDx", (v) => (rxState.treatment.dx = v)],
      ["inAdvice", (v) => (rxState.treatment.advice = v)],
    ];

    liveFields.forEach(([id, setter]) => {
      const el = $(id);
      if (el) {
        el.addEventListener("input", (e) => {
          setter(e.target.value.trim());
          renderPadPreview();
        });
      }
    });
  }

  // Action Buttons
  function bindActionButtons() {
    // Load PDF Sample
    $("btnLoadSample")?.addEventListener("click", () => {
      rxState = JSON.parse(JSON.stringify(PDF_SAMPLE_DATA));
      initFormInputs();
      renderAll();
      showToast(tr("toastLoaded"), "success");
    });

    // Clear Form
    $("btnClearForm")?.addEventListener("click", () => {
      if (confirm(tr("confirmClear"))) {
        rxState = {
          doctor: {
            name: "Dr. ",
            degrees: "MBBS",
            regNo: "Reg No: ",
            hospital: "City Hospital",
            address: "Dhaka, Bangladesh",
            phone: "+880 1..."
          },
          patient: {
            name: "",
            age: "",
            sex: "M",
            date: new Date().toLocaleDateString("en-US")
          },
          clinical: {
            cc: [],
            ho: [],
            oe: { bp: "", pulse: "", temp: "", weight: "" },
            inv: []
          },
          treatment: {
            dx: "",
            meds: [],
            advice: ""
          }
        };
        initFormInputs();
        renderAll();
        showToast(tr("toastCleared"), "info");
      }
    });

    // Print
    $("btnPrintPrescription")?.addEventListener("click", () => {
      window.print();
    });

    // Save to Vault
    $("btnSaveToVault")?.addEventListener("click", savePrescriptionToVault);

    // Share WhatsApp
    $("btnShareWhatsApp")?.addEventListener("click", shareViaWhatsApp);

    // Copy Summary Text
    $("btnCopySummary")?.addEventListener("click", copyPrescriptionSummary);

    // Keyboard shortcut '/' to focus medicine adder
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        $("medNameInput")?.focus();
        showToast(tr("typeSlash"), "info");
      }
    });
  }

  // Dynamic Chip Items (CC, HO, Inv)
  function bindDynamicItemInputs() {
    bindChipAdder("inCCInput", "btnCCAdd", rxState.clinical.cc, "ccChipContainer");
    bindChipAdder("inHOInput", "btnHOAdd", rxState.clinical.ho, "hoChipContainer");
    bindChipAdder("inInvInput", "btnInvAdd", rxState.clinical.inv, "invChipContainer");
  }

  function bindChipAdder(inputId, btnId, dataList, containerId) {
    const input = $(inputId);
    const btn = $(btnId);

    const addItem = () => {
      const val = input?.value.trim();
      if (!val) return;
      dataList.push(val);
      input.value = "";
      renderChips(containerId, dataList);
      renderPadPreview();
    };

    btn?.addEventListener("click", addItem);
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addItem();
      }
    });
  }

  function renderChips(containerId, dataList) {
    const cont = $(containerId);
    if (!cont) return;
    cont.innerHTML = "";

    dataList.forEach((item, index) => {
      const chip = document.createElement("span");
      chip.className = "cp-chip";
      chip.innerHTML = `
        <span>${escapeHtml(item)}</span>
        <button type="button" class="cp-chip-remove" aria-label="Remove item">
          <i class="bi bi-x"></i>
        </button>
      `;
      chip.querySelector(".cp-chip-remove").addEventListener("click", () => {
        dataList.splice(index, 1);
        renderChips(containerId, dataList);
        renderPadPreview();
      });
      cont.appendChild(chip);
    });
  }

  // ============================================================================
  // MEDICINE TABLE BUILDER & PRESETS
  // ============================================================================
  function bindMedicineBuilder() {
    const addBtn = $("btnAddMedicine");
    const nameInput = $("medNameInput");
    const formSelect = $("medFormSelect");
    const dosageInput = $("medDosageInput");
    const timingSelect = $("medTimingSelect");
    const durationInput = $("medDurationInput");
    const noteInput = $("medNoteInput");

    const addMedRow = () => {
      const name = nameInput?.value.trim();
      if (!name) {
        nameInput?.focus();
        return;
      }

      rxState.treatment.meds.push({
        name: name,
        form: formSelect?.value || "Tab",
        strength: "",
        dosage: dosageInput?.value.trim() || "1+0+1",
        timing: timingSelect?.value || "After meal",
        duration: durationInput?.value.trim() || "5 days",
        note: noteInput?.value.trim() || ""
      });

      // Clear input fields
      if (nameInput) nameInput.value = "";
      if (dosageInput) dosageInput.value = "1+0+1";
      if (durationInput) durationInput.value = "5 days";
      if (noteInput) noteInput.value = "";

      renderEditorMedsTable();
      renderPadPreview();
    };

    addBtn?.addEventListener("click", addMedRow);
    nameInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addMedRow();
      }
    });

    // Preset pills (quick popular medicines)
    document.querySelectorAll(".cp-med-preset-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const medName = pill.dataset.med;
        const medDosage = pill.dataset.dosage || "1+0+1";
        const medTiming = pill.dataset.timing || "After meal";
        const medDuration = pill.dataset.duration || "5 days";

        rxState.treatment.meds.push({
          name: medName,
          form: "Tab",
          strength: "",
          dosage: medDosage,
          timing: medTiming,
          duration: medDuration,
          note: ""
        });

        renderEditorMedsTable();
        renderPadPreview();
        showToast(`Added ${medName}`, "info");
      });
    });
  }

  function renderEditorMedsTable() {
    const tbody = $("editorMedsTbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    rxState.treatment.meds.forEach((m, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <input type="text" class="cp-med-input-compact" value="${escapeHtml(m.name)}" data-idx="${idx}" data-field="name">
        </td>
        <td style="width: 100px;">
          <input type="text" class="cp-med-input-compact text-center" value="${escapeHtml(m.dosage)}" data-idx="${idx}" data-field="dosage">
        </td>
        <td style="width: 120px;">
          <input type="text" class="cp-med-input-compact" value="${escapeHtml(m.timing)}" data-idx="${idx}" data-field="timing">
        </td>
        <td style="width: 100px;">
          <input type="text" class="cp-med-input-compact" value="${escapeHtml(m.duration)}" data-idx="${idx}" data-field="duration">
        </td>
        <td style="width: 50px; text-align: center;">
          <button type="button" class="btn btn-sm btn-link text-danger p-0 delete-med-btn" data-idx="${idx}" aria-label="Delete medicine">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </td>
      `;

      // Inline edits
      tr.querySelectorAll("input").forEach((inp) => {
        inp.addEventListener("input", (e) => {
          const index = parseInt(e.target.dataset.idx, 10);
          const field = e.target.dataset.field;
          rxState.treatment.meds[index][field] = e.target.value;
          renderPadPreview();
        });
      });

      // Delete row
      tr.querySelector(".delete-med-btn").addEventListener("click", () => {
        rxState.treatment.meds.splice(idx, 1);
        renderEditorMedsTable();
        renderPadPreview();
      });

      tbody.appendChild(tr);
    });
  }

  // ============================================================================
  // RENDER LIVE DIGITAL PRESCRIPTION PAD PREVIEW
  // ============================================================================
  function renderAll() {
    renderChips("ccChipContainer", rxState.clinical.cc);
    renderChips("hoChipContainer", rxState.clinical.ho);
    renderChips("invChipContainer", rxState.clinical.inv);
    renderEditorMedsTable();
    renderPadPreview();
  }

  function renderPadPreview() {
    // 1. Doctor Header
    if ($("padDocName")) $("padDocName").textContent = rxState.doctor.name || "Dr. Rahman";
    if ($("padDocDegrees")) $("padDocDegrees").textContent = rxState.doctor.degrees || "MBBS";
    if ($("padDocReg")) $("padDocReg").textContent = rxState.doctor.regNo || "";
    if ($("padHospName")) $("padHospName").textContent = rxState.doctor.hospital || "City General Hospital";
    if ($("padHospAddress")) $("padHospAddress").textContent = rxState.doctor.address || "Dhaka, Bangladesh";
    if ($("padHospCall")) $("padHospCall").textContent = rxState.doctor.phone || "Call: +880 1700-000000";

    // 2. Patient Info Bar
    if ($("padPatName")) $("padPatName").textContent = rxState.patient.name || "–";
    if ($("padAge")) $("padAge").textContent = rxState.patient.age || "–";
    if ($("padSex")) $("padSex").textContent = rxState.patient.sex || "–";
    if ($("padDate")) $("padDate").textContent = rxState.patient.date || new Date().toLocaleDateString("en-US");

    // 3. Left Column: C/C
    const padCCList = $("padCCList");
    if (padCCList) {
      padCCList.innerHTML = "";
      if (!rxState.clinical.cc.length) {
        padCCList.innerHTML = `<li class="text-muted">–</li>`;
      } else {
        rxState.clinical.cc.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          padCCList.appendChild(li);
        });
      }
    }

    // 4. Left Column: H/O
    const padHOList = $("padHOList");
    if (padHOList) {
      padHOList.innerHTML = "";
      if (!rxState.clinical.ho.length) {
        padHOList.innerHTML = `<li class="text-muted">–</li>`;
      } else {
        rxState.clinical.ho.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          padHOList.appendChild(li);
        });
      }
    }

    // 5. Left Column: O/E Vitals
    if ($("padBpVal")) $("padBpVal").textContent = rxState.clinical.oe.bp || "120/80";
    if ($("padPulseVal")) $("padPulseVal").textContent = rxState.clinical.oe.pulse ? `${rxState.clinical.oe.pulse}` : "72";
    if ($("padTempVal")) $("padTempVal").textContent = rxState.clinical.oe.temp ? `${rxState.clinical.oe.temp}` : "98.6";
    if ($("padWeightVal")) $("padWeightVal").textContent = rxState.clinical.oe.weight ? `${rxState.clinical.oe.weight}` : "65";

    // 6. Left Column: Inv
    const padInvList = $("padInvList");
    if (padInvList) {
      padInvList.innerHTML = "";
      if (!rxState.clinical.inv.length) {
        padInvList.innerHTML = `<li class="text-muted">–</li>`;
      } else {
        rxState.clinical.inv.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          padInvList.appendChild(li);
        });
      }
    }

    // 7. Right Column: Dx
    if ($("padDxVal")) {
      $("padDxVal").textContent = rxState.treatment.dx ? `- ${rxState.treatment.dx}` : "–";
    }

    // 8. Right Column: Rx Medicines
    const padMedContainer = $("padMedContainer");
    if (padMedContainer) {
      padMedContainer.innerHTML = "";
      if (!rxState.treatment.meds.length) {
        padMedContainer.innerHTML = `
          <div class="text-muted py-4 ps-2" style="font-size:0.875rem;">
            <em>Type '/' to add medicine or commands...</em>
          </div>
        `;
      } else {
        rxState.treatment.meds.forEach((m, idx) => {
          const row = document.createElement("div");
          row.className = "cp-pad-med-item";
          row.innerHTML = `
            <div class="cp-pad-med-head">
              <div>
                <span class="cp-pad-med-form">${escapeHtml(m.form || "Tab")}</span>
                <span class="cp-pad-med-name">${idx + 1}. ${escapeHtml(m.name)}</span>
              </div>
              <span class="cp-pad-med-duration">${escapeHtml(m.duration || "")}</span>
            </div>
            <div class="cp-pad-med-sub">
              <span class="cp-pad-med-dosage">${escapeHtml(m.dosage || "1+0+1")}</span>
              <span>— ${escapeHtml(m.timing || "After meal")}</span>
              ${m.note ? `<span>(${escapeHtml(m.note)})</span>` : ""}
            </div>
          `;
          padMedContainer.appendChild(row);
        });
      }
    }

    // 9. Advice
    const padAdviceText = $("padAdviceText");
    if (padAdviceText) {
      padAdviceText.textContent = rxState.treatment.advice || "Write advice here...";
    }
  }

  // ============================================================================
  // VAULT STORAGE, WHATSAPP & CLIPBOARD
  // ============================================================================
  function savePrescriptionToVault() {
    try {
      const all = JSON.parse(localStorage.getItem(RX_VAULT_KEY) || "[]");
      const recordId = "rx_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);

      const record = {
        id: recordId,
        createdAt: new Date().toISOString(),
        prescDate: rxState.patient.date || new Date().toISOString().split("T")[0],
        doctor: rxState.doctor.name || "Dr. A. Rahman",
        clinic: rxState.doctor.hospital || "City General Hospital",
        meds: rxState.treatment.meds.map((m) => m.name),
        diagnosis: rxState.treatment.dx || "Clinical Consultation",
        refillDate: "",
        urgency: "normal",
        notes: `C/C: ${rxState.clinical.cc.join(", ")} | Vitals: BP ${rxState.clinical.oe.bp}, Pulse ${rxState.clinical.oe.pulse} | Advice: ${rxState.treatment.advice}`,
        files: [],
        digitalPrescriptionData: JSON.parse(JSON.stringify(rxState))
      };

      all.unshift(record);
      localStorage.setItem(RX_VAULT_KEY, JSON.stringify(all));

      showToast(tr("toastSaved"), "success");
    } catch (err) {
      console.error("Save to vault error:", err);
      showToast("Error saving to vault: " + err.message, "error");
    }
  }

  function generateFormattedSummaryText() {
    const s = rxState;
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

  function shareViaWhatsApp() {
    const text = encodeURIComponent(generateFormattedSummaryText());
    const url = `https://wa.me/?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function copyPrescriptionSummary() {
    const text = generateFormattedSummaryText();
    navigator.clipboard.writeText(text).then(
      () => showToast(tr("toastCopied"), "success"),
      () => {
        // Fallback
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

  // ============================================================================
  // TOAST NOTIFICATION SYSTEM
  // ============================================================================
  function showToast(message, type = "info") {
    let stack = $("cpToastStack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "cpToastStack";
      stack.className = "cp-toast-stack";
      document.body.appendChild(stack);
    }

    const toast = document.createElement("div");
    toast.className = `cp-toast ${type}`;
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

        // Programmatically close drawer
        try {
          const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(sidebar);
          bsOffcanvas?.hide();
        } catch (_) {}

        // Emergency SOS
        if (link.dataset.action === "emergency-sos" || href.includes("#safety")) {
          e.preventDefault();
          window.location.href = "index.html#safety";
          return;
        }

        // Current page scroll top
        if (href === "create-prescription.html" || href.endsWith("create-prescription.html")) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        // Cross page routing
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

