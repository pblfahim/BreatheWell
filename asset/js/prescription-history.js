/**
 * ============================================================================
 * BreatheWell - Prescription History & Vault Engine (prescription-history.js)
 * ============================================================================
 * @file        asset/js/prescription-history.js
 * @module      BreatheWell/PrescriptionHistory
 * @author      BreatheWell Health Informatics Team
 * @version     1.0.0
 * @license     MIT
 * @description
 *   Dedicated, robust client-side engine for prescription-history.html.
 *   Provides multi-facet search, urgency filtering, dynamic sorting, rich card
 *   rendering, interactive full-screen lightbox viewer for images & PDFs,
 *   single-item deletion, storage calculations, and 100% bilingual (Bengali/English) i18n.
 * ============================================================================
 */

(function () {
  "use strict";

  // ============================================================================
  // 1. CONSTANTS, STORAGE KEYS & STATE
  // ============================================================================
  const RX_KEY = "bw_prescriptions";
  const LANG_KEY = "bw_lang";
  const STORAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB typical localStorage limit

  let currentLang = localStorage.getItem(LANG_KEY) || "bn";
  let galleryFilter = "all";
  let gallerySort = "new";
  let gallerySearch = "";

  let lbRecordList = [];
  let lbRecordIndex = 0;
  let lbFileIndex = 0;

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
      navExercises: "অনুশীলন",
      navTest: "শ্বাসের পরীক্ষা",
      navHealth: "স্বাস্থ্য ট্র্যাকার",
      navRx: "প্রেসক্রিপশন",
      navSafety: "নিরাপত্তা",
      navMore: "আরও",
      tabVault: "প্রেসক্রিপশন ভল্ট",
      tabHistory: "প্রেসক্রিপশন ইতিহাস",
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
      openBtn: "দেখুন",
      btnDownload: "ডাউনলোড",
      btnClose: "বন্ধ করুন",
      btnUploadNew: "নতুন আপলোড করুন",
      btnCreateStudio: "প্রেসক্রিপশন তৈরি করুন",
      emptyTitle: "এখনো কোনো প্রেসক্রিপশন সংরক্ষিত নেই",
      emptyDesc: "প্রেসক্রিপশন ভল্টে ছবি বা PDF আপলোড করে সংরক্ষণ করুন অথবা ডিজিটাল প্রেসক্রিপশন স্টুডিওতে নতুন প্রেসক্রিপশন তৈরি করুন।",
      confirmDelete: "আপনি কি নিশ্চিতভাবে এই প্রেসক্রিপশনটি ভল্ট থেকে মুছে ফেলতে চান?",
      toastDeleted: "প্রেসক্রিপশন সফলভাবে মুছে ফেলা হয়েছে।",
      refillDue: "রিফিল বাকি!",
      refillSoon: "শীঘ্রই রিফিল",
      refillOk: "রিফিল ঠিক আছে",
      moreFiles: "+{n}টি ফাইল",
      moreMeds: "+{n}টি আরও",
      langSelectTitle: "ভাষা পরিবর্তন",
      quickToolsTitle: "দ্রুত অ্যাকশন",
      navPagesTitle: "পেজ ও মডিউল",
      footerTag: "প্রতিটি নিঃশ্বাসে একটু প্রশান্তি",
      footerDisclaimer: "সাধারণ সুস্থতার জন্য। চিকিৎসার বিকল্প নয়।",
      sidebarBrandSub: "ডিজিটাল স্বাস্থ্য ভল্ট"
    },
    en: {
      navHome: "Home",
      navExercises: "Exercises",
      navTest: "Breath Test",
      navHealth: "Health Tracker",
      navRx: "Prescriptions",
      navSafety: "Safety",
      navMore: "More",
      tabVault: "Prescription Vault",
      tabHistory: "Prescription History",
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
      openBtn: "View",
      btnDownload: "Download",
      btnClose: "Close",
      btnUploadNew: "Upload New",
      btnCreateStudio: "Create Prescription",
      emptyTitle: "No Prescriptions Found",
      emptyDesc: "Upload clinical prescription files in the Vault or design custom prescriptions in the Digital Studio to populate your archive.",
      confirmDelete: "Are you sure you want to permanently delete this prescription?",
      toastDeleted: "Prescription deleted successfully.",
      refillDue: "Refill due!",
      refillSoon: "Refill soon",
      refillOk: "Refill OK",
      moreFiles: "+{n} files",
      moreMeds: "+{n} more",
      langSelectTitle: "Language Selection",
      quickToolsTitle: "Quick Actions",
      navPagesTitle: "Pages & Modules",
      footerTag: "A touch of serenity with every breath",
      footerDisclaimer: "For general wellness only. Not medical advice.",
      sidebarBrandSub: "Digital Health Vault"
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

  // ============================================================================
  // 3. STORAGE & DATA ENGINE
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
      bytesEl.textContent = `${kb} KB / 5 MB (${pct}%)`;
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
    let records = phLoad();

    // 1. Urgency filter
    if (galleryFilter !== "all") {
      records = records.filter((r) => r.urgency === galleryFilter);
    }

    // 2. Search query filter
    if (gallerySearch) {
      records = records.filter((r) => {
        const doc = (r.doctor || "").toLowerCase();
        const hosp = (r.hospital || "").toLowerCase();
        const pat = (r.patientName || "").toLowerCase();
        const fName = (r.fileName || "").toLowerCase();
        const meds = (r.medicines || []).map((m) => (m.name || "").toLowerCase()).join(" ");
        const files = (r.files || []).map((f) => (f.name || "").toLowerCase()).join(" ");

        return (
          doc.includes(gallerySearch) ||
          hosp.includes(gallerySearch) ||
          pat.includes(gallerySearch) ||
          fName.includes(gallerySearch) ||
          meds.includes(gallerySearch) ||
          files.includes(gallerySearch)
        );
      });
    }

    // 3. Sorting
    records.sort((a, b) => {
      if (gallerySort === "new") return new Date(b.date || 0) - new Date(a.date || 0);
      if (gallerySort === "old") return new Date(a.date || 0) - new Date(b.date || 0);
      if (gallerySort === "doctor") return (a.doctor || "").localeCompare(b.doctor || "");
      return 0;
    });

    return records;
  }

  // ============================================================================
  // 5. GALLERY CARD GRID RENDERING
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
            <div class="ph-card-thumb-pdf" style="background:#f1f5f9;">
              <i class="bi bi-prescription2 text-secondary"></i>
              <span class="text-secondary">NO FILE ATTACHED</span>
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
              <div class="ph-card-clinic" title="${escapeHtml(rec.hospital || "")}">
                ${escapeHtml(rec.hospital || (currentLang === "bn" ? "হাসপাতাল/ক্লিনিক নেই" : "No clinic info"))}
              </div>

              ${rec.patientName ? `
                <div class="ph-card-patient">
                  <i class="bi bi-person text-secondary"></i>
                  <span>${escapeHtml(rec.patientName)}</span>
                  ${rec.patientAge ? `<span class="text-muted">(${escapeHtml(rec.patientAge)})</span>` : ""}
                </div>
              ` : ""}

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
          phUpdateStorage();
          phToast(tr("toastDeleted"), "info");
        }
      });
    });
  }

  // ============================================================================
  // 6. LIGHTBOX VIEWER
  // ============================================================================
  function phOpenLightbox(recIdx, fileIdx = 0) {
    lbRecordIndex = recIdx;
    lbFileIndex = fileIdx;

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

    if (titleEl) titleEl.textContent = rec.doctor || "Prescription Document";
    if (metaEl) {
      metaEl.textContent = `${rec.patientName ? rec.patientName + " · " : ""}${phFmtDate(rec.date)} · ${rec.hospital || ""}`;
    }

    const files = rec.files || [];

    // Navigation buttons
    if (prevBtn) prevBtn.style.display = files.length > 1 ? "grid" : "none";
    if (nextBtn) nextBtn.style.display = files.length > 1 ? "grid" : "none";

    // Strip
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

    // Main Viewer
    if (viewer) {
      const file = files[lbFileIndex];
      if (!file) {
        viewer.innerHTML = `<div class="text-white text-center p-4">কোনো ফাইল সংযুক্ত নেই।</div>`;
        return;
      }

      const isPdf = file.mime === "application/pdf" || (file.name || "").endsWith(".pdf");
      if (isPdf) {
        viewer.innerHTML = `<iframe src="${file.data}" style="width:100%;height:70vh;border:none;border-radius:6px;"></iframe>`;
      } else {
        viewer.innerHTML = `<img src="${file.data}" class="ph-lb-img" alt="${escapeHtml(file.name || "Prescription")}">`;
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
  // 7. TOAST NOTIFICATION
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
  // 8. LIFECYCLE & EVENT ROUTING
  // ============================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    bindToolbarEvents();
    bindLightboxControls();
    initMobileSidebar();
    phUpdateStorage();
    phRenderGallery();
  });

  function bindToolbarEvents() {
    // Filter pills
    document.querySelectorAll(".ph-filter-pill[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        galleryFilter = btn.dataset.filter;
        document.querySelectorAll(".ph-filter-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        phRenderGallery();
      });
    });

    // Sort dropdown
    $("phSortSelect")?.addEventListener("change", (e) => {
      gallerySort = e.target.value;
      phRenderGallery();
    });

    // Search input
    $("phSearch")?.addEventListener("input", (e) => {
      gallerySearch = e.target.value.trim().toLowerCase();
      phRenderGallery();
    });
  }

  function initLanguage() {
    applyTranslations();

    const topToggle = $("phLangToggle") || $("rxLangToggle");
    if (topToggle) {
      topToggle.textContent = currentLang === "bn" ? "English" : "বাংলা";
      topToggle.addEventListener("click", () => {
        currentLang = currentLang === "bn" ? "en" : "bn";
        localStorage.setItem(LANG_KEY, currentLang);
        topToggle.textContent = currentLang === "bn" ? "English" : "বাংলা";
        applyTranslations();
        phUpdateStorage();
        phRenderGallery();
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
        } catch (_) {}

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
  // 9. UTILITY HELPERS
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
})();

