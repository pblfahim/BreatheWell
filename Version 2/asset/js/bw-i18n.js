/**
 * @file bw-i18n.js
 * @module BWI18n
 * @description Shared Bilingual (Bengali / English) Chrome Dictionary, Safe HTML Escaping,
 * Date Formatting, Toast Notification Engine & CSV/JSON Exporters.
 *
 * INVARIANTS:
 *   - `DICT.bn` and `DICT.en` maintain 100% key parity.
 *   - All user-generated text rendered into HTML passes through `escapeHtml()`.
 *   - `downloadCsv()` prepends UTF-8 BOM (`\uFEFF`) for clean Bengali Excel opening.
 *
 * TABLE OF CONTENTS:
 *   1. Shared Bilingual Dictionary (`DICT.bn` & `DICT.en`)
 *   2. Language Get/Set & Page Dictionary Hydration (`applyTranslations`)
 *   3. HTML Escaping, Date Formatting & CSV/JSON Exporters
 *   4. Accessible Live Toast Engine (`showToast`)
 */
(function (global) {
  'use strict';

  var LANG_KEY = 'bwmm_lang';

  /* --------------------------------------------------------------------------
     1. SHARED BILINGUAL DICTIONARY (100% PARITY bn <-> en)
     -------------------------------------------------------------------------- */
  var DICT = {
    bn: {
      brandName: 'ব্রিদওয়েল',
      brandFamilyTag: 'পরিবার কেয়ার',
      skipToMain: 'মূল অংশে যান',
      navHome: 'হোম',
      navExercises: 'শ্বাস ব্যায়াম',
      navBreathTest: 'ব্রিদ টেস্ট',
      navVitals: 'স্বাস্থ্য রিডিং',
      navRx: 'প্রেসক্রিপশন',
      navFamily: 'পরিবার ও প্রোফাইল',
      navMore: 'সব মডিউল',
      subTabVitalsEntry: 'নতুন রিডিং',
      subTabVitalsHistory: 'ইতিহাস টেবিল',
      subTabVitalsCharts: 'ট্রেন্ড চার্ট',
      subTabVitalsDemo: 'ডেমো ডেটা',
      subTabRxVault: 'ভল্ট ও স্ক্যানার',
      subTabRxHistory: 'ভল্ট ইতিহাস',
      subTabRxCreate: 'রচয়িতা স্টুডিও',
      subTabRxPad: 'ডিজিটাল প্যাড',
      subTabRxPadHistory: 'প্যাড ইতিহাস',
      rel_self: 'নিজ (প্রধান)',
      rel_father: 'বাবা',
      rel_mother: 'মা',
      rel_spouse: 'স্বামী / স্ত্রী',
      rel_child: 'সন্তান',
      rel_sibling: 'ভাই / বোন',
      rel_other: 'অন্যান্য সদস্য',
      rel_guest: 'গেস্ট প্রিভিউ',
      guestBannerText: 'আপনি এখন গেস্ট প্রিভিউ মোডে আছেন। সব পরিবারের সদস্যের আলাদা ডেটা সংরক্ষণ করতে লগইন বা ১-ক্লিক ডেমো ব্যবহার করুন।',
      activeMemberPrefix: 'সক্রিয় সদস্য:',
      btnDemoFamily: '১-ক্লিক ফ্যামিলি ডেমো',
      btnSignIn: 'লগইন / অ্যাকাউন্ট',
      btnRegister: 'নতুন অ্যাকাউন্ট',
      btnLogout: 'লগআউট',
      btnSwitchMember: 'সদস্য পরিবর্তন',
      btnManageFamily: 'পরিবারের সদস্য যোগ / পরিচালনা',
      authModalTitle: 'পারিবারিক অ্যাকাউন্ট আনলক করুন',
      authModalBody: 'সব সদস্যের স্বাস্থ্য রিডিং, ব্রিদ টেস্ট এবং প্রেসক্রিপশন আলাদাভাবে সুরক্ষিত রাখতে সাইন ইন করুন অথবা ১-ক্লিক ডেমো পরিবার চালু করুন।',
      authModalGoLogin: 'লগইন পেজে যান',
      authModalGoRegister: 'নতুন পরিবার খুলুন',
      authModalClose: 'গেস্ট হিসেবে চালিয়ে যান',
      pinModalTitle: 'প্রাইভেসি পিন যাচাই',
      pinModalBody: 'সদস্য পরিবর্তন বা সংবেদনশীল তথ্য আনলক করতে ৪-অঙ্কের পিন লিখুন।',
      pinPlaceholder: '৪-অঙ্কের পিন',
      pinConfirm: 'আনলক করুন',
      pinWrong: 'পিন মেলেনি। অনুগ্রহ করে আবার চেষ্টা করুন।',
      drawerDirectoryTitle: 'সকল মডিউল ডিরেক্টরি',
      footerPrivacyNote: '১০০% ব্রাউজার-ভিত্তিক প্রাইভেসি • আপনার ডিভাইসেই সকল পারিবারিক স্বাস্থ্য তথ্য সংরক্ষিত থাকে।',
      footerEmergencyNote: 'জরুরি মেডিকেল সহায়তার জন্য সর্বদা স্থানীয় জরুরি নম্বর (৯৯৯ / ডাক্তার) কল করুন।',
      statusNormal: 'স্বাভাবিক',
      statusElevated: 'উচ্চতর (সতর্কতা)',
      statusStage1: 'উচ্চ রক্তচাপ স্টেজ ১',
      statusStage2: 'উচ্চ রক্তচাপ স্টেজ ২',
      statusCrisis: 'জরুরি সংকট',
      statusLow: 'কম (হাইপো)',
      statusPrediabetes: 'প্রি-ডায়াবেটিস',
      statusDiabetes: 'ডায়াবেটিস স্তর',
      commonSave: 'সংরক্ষণ করুন',
      commonCancel: 'বাতিল',
      commonDelete: 'মুছুন',
      commonEdit: 'সম্পাদনা',
      commonPrint: 'প্রিন্ট',
      commonExportCsv: 'CSV ডাউনলোড',
      commonExportJson: 'JSON ব্যাকআপ',
      commonYears: 'বছর',
      commonNoRecords: 'এই সদস্যের জন্য এখনো কোনো রেকর্ড পাওয়া যায়নি।',
      toastMemberSwitched: 'সক্রিয় সদস্য পরিবর্তিত হয়েছে:',
      toastSavedMember: 'নতুন তথ্য সক্রিয় সদস্যের প্রোফাইলে সংরক্ষিত হয়েছে।',
      toastSavedGuest: 'গেস্ট প্রিভিউতে সংরক্ষিত (স্থায়ী সংরক্ষণের জন্য লগইন বা ডেমো ব্যবহার করুন)।',
      toastDemoLoaded: '৪ সদস্যের ডেমো পরিবার চালু হয়েছে!'
    },
    en: {
      brandName: 'BreatheWell',
      brandFamilyTag: 'Family Care',
      skipToMain: 'Skip to main content',
      navHome: 'Home',
      navExercises: 'Exercises',
      navBreathTest: 'Breath Test',
      navVitals: 'Vitals Suite',
      navRx: 'Prescriptions',
      navFamily: 'Family & Profile',
      navMore: 'All Pages',
      subTabVitalsEntry: 'Log Reading',
      subTabVitalsHistory: 'History Table',
      subTabVitalsCharts: 'Trend Charts',
      subTabVitalsDemo: 'Demo Datasets',
      subTabRxVault: 'Vault & OCR',
      subTabRxHistory: 'Vault History',
      subTabRxCreate: 'Creator Studio',
      subTabRxPad: 'Digital Pad',
      subTabRxPadHistory: 'Pad History',
      rel_self: 'Self (Primary)',
      rel_father: 'Father',
      rel_mother: 'Mother',
      rel_spouse: 'Spouse',
      rel_child: 'Child',
      rel_sibling: 'Sibling',
      rel_other: 'Other Member',
      rel_guest: 'Guest Preview',
      guestBannerText: 'You are in Guest Preview mode. Sign in or launch the 1-Click Family Demo to save & switch across separate family members.',
      activeMemberPrefix: 'Active Member:',
      btnDemoFamily: '1-Click Family Demo',
      btnSignIn: 'Sign In / Account',
      btnRegister: 'Create Account',
      btnLogout: 'Sign Out',
      btnSwitchMember: 'Switch Family Member',
      btnManageFamily: 'Add / Manage Family Members',
      authModalTitle: 'Unlock Household Member Profiles',
      authModalBody: 'Sign in or try our 1-Click Family Demo to save vitals, breath assessments, exercises, and prescriptions privately per family member.',
      authModalGoLogin: 'Go to Sign In',
      authModalGoRegister: 'Create Family Account',
      authModalClose: 'Continue as Guest',
      pinModalTitle: 'Privacy PIN Verification',
      pinModalBody: 'Enter your 4-digit household PIN to unlock member controls.',
      pinPlaceholder: '4-digit PIN',
      pinConfirm: 'Unlock',
      pinWrong: 'Incorrect PIN. Please try again.',
      drawerDirectoryTitle: 'Complete Page Directory',
      footerPrivacyNote: '100% Client-Side Privacy • All family health telemetry stays strictly inside your browser.',
      footerEmergencyNote: 'For clinical emergencies, always contact your local medical emergency service immediately.',
      statusNormal: 'Normal',
      statusElevated: 'Elevated',
      statusStage1: 'High (Stage 1)',
      statusStage2: 'High (Stage 2)',
      statusCrisis: 'Hypertensive Crisis',
      statusLow: 'Low (Hypoglycemia)',
      statusPrediabetes: 'Prediabetes',
      statusDiabetes: 'Diabetes Range',
      commonSave: 'Save',
      commonCancel: 'Cancel',
      commonDelete: 'Delete',
      commonEdit: 'Edit',
      commonPrint: 'Print',
      commonExportCsv: 'Export CSV',
      commonExportJson: 'Export JSON',
      commonYears: 'yrs',
      commonNoRecords: 'No records saved under this family member yet.',
      toastMemberSwitched: 'Switched active member to:',
      toastSavedMember: 'Saved permanently to active member profile.',
      toastSavedGuest: 'Saved in Guest Preview (Sign in or try Family Demo to keep permanently).',
      toastDemoLoaded: '4-Member Family Demo unlocked!'
    }
  };

  /* --------------------------------------------------------------------------
     2. LANGUAGE GET/SET & PAGE HYDRATION
     -------------------------------------------------------------------------- */
  function getLang() {
    try {
      var stored = global.localStorage && global.localStorage.getItem(LANG_KEY);
      return stored === 'en' ? 'en' : 'bn';
    } catch (err) {
      return 'bn';
    }
  }

  function setLang(lang) {
    var normalized = lang === 'en' ? 'en' : 'bn';
    try {
      if (global.localStorage) global.localStorage.setItem(LANG_KEY, normalized);
    } catch (err) {
      /* Ignore storage errors */
    }
    if (global.document && global.document.documentElement) {
      global.document.documentElement.lang = normalized;
    }
    if (typeof global.dispatchEvent === 'function' && typeof global.CustomEvent === 'function') {
      try {
        global.dispatchEvent(new global.CustomEvent('bwLanguageChanged', { detail: { lang: normalized } }));
      } catch (err2) {
        /* Ignore */
      }
    }
    return normalized;
  }

  function t(key, pageDict, langOverride) {
    var lang = langOverride || getLang();
    if (pageDict && pageDict[lang] && pageDict[lang][key] !== undefined) {
      return pageDict[lang][key];
    }
    if (DICT[lang] && DICT[lang][key] !== undefined) {
      return DICT[lang][key];
    }
    return DICT.en[key] || key;
  }

  function applyTranslations(pageDict) {
    if (!global.document) return;
    var lang = getLang();
    global.document.documentElement.lang = lang;

    function resolve(key) {
      return t(key, pageDict, lang);
    }

    Array.prototype.forEach.call(global.document.querySelectorAll('[data-i18n]'), function (el) {
      var k = el.getAttribute('data-i18n');
      if (k) el.textContent = resolve(k);
    });

    Array.prototype.forEach.call(global.document.querySelectorAll('[data-i18n-placeholder]'), function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      if (k) el.setAttribute('placeholder', resolve(k));
    });

    Array.prototype.forEach.call(global.document.querySelectorAll('[data-i18n-title]'), function (el) {
      var k = el.getAttribute('data-i18n-title');
      if (k) el.setAttribute('title', resolve(k));
    });

    Array.prototype.forEach.call(global.document.querySelectorAll('[data-i18n-aria]'), function (el) {
      var k = el.getAttribute('data-i18n-aria');
      if (k) el.setAttribute('aria-label', resolve(k));
    });

    Array.prototype.forEach.call(global.document.querySelectorAll('.bw-lang-btn'), function (btn) {
      var btnLang = btn.getAttribute('data-lang');
      var isAct = btnLang === lang;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
    });
  }

  /* --------------------------------------------------------------------------
     3. ESCAPING, FORMATTING & FILE EXPORTERS
     -------------------------------------------------------------------------- */
  function escapeHtml(input) {
    if (input === null || input === undefined) return '';
    return String(input)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function fmtDate(isoStr, withTime) {
    if (!isoStr) return '—';
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return String(isoStr);
    var lang = getLang();
    try {
      var opts = withTime
        ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { year: 'numeric', month: 'short', day: 'numeric' };
      return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', opts);
    } catch (err) {
      return d.toISOString().slice(0, withTime ? 16 : 10).replace('T', ' ');
    }
  }

  function daysRemaining(targetDateStr) {
    if (!targetDateStr) return null;
    var target = new Date(targetDateStr);
    if (isNaN(target.getTime())) return null;
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - now.getTime()) / 86400000);
  }

  function triggerDownload(filename, blob) {
    if (!global.document || typeof global.URL === 'undefined') return;
    var url = global.URL.createObjectURL(blob);
    var a = global.document.createElement('a');
    a.href = url;
    a.download = filename;
    global.document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      global.document.body.removeChild(a);
      global.URL.revokeObjectURL(url);
    }, 100);
  }

  function downloadCsv(filename, headers, rows) {
    function csvCell(val) {
      var s = val === null || val === undefined ? '' : String(val);
      return '"' + s.replace(/"/g, '""') + '"';
    }
    var lines = [headers.map(csvCell).join(',')];
    rows.forEach(function (r) {
      lines.push(r.map(csvCell).join(','));
    });
    var bomContent = '\uFEFF' + lines.join('\r\n');
    var blob = new Blob([bomContent], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(filename, blob);
  }

  function downloadJson(filename, dataObj) {
    var blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json;charset=utf-8;' });
    triggerDownload(filename, blob);
  }

  /* --------------------------------------------------------------------------
     4. ACCESSIBLE LIVE TOAST ENGINE
     -------------------------------------------------------------------------- */
  function showToast(message, variant) {
    if (!global.document) return;
    var stack = global.document.getElementById('rxToastStack');
    if (!stack) {
      stack = global.document.createElement('div');
      stack.id = 'rxToastStack';
      stack.className = 'bw-toast-stack no-print';
      stack.setAttribute('aria-live', 'polite');
      stack.setAttribute('aria-atomic', 'true');
      global.document.body.appendChild(stack);
    }

    var kind = variant || 'info';
    var iconMap = {
      success: 'bi-check-circle-fill text-success',
      danger: 'bi-exclamation-octagon-fill text-danger',
      warning: 'bi-exclamation-triangle-fill text-warning',
      info: 'bi-info-circle-fill text-info'
    };

    var item = global.document.createElement('div');
    item.className = 'bw-toast-item bw-toast-' + kind;
    item.setAttribute('role', 'status');

    var icon = global.document.createElement('i');
    icon.className = 'bi ' + (iconMap[kind] || iconMap.info) + ' mt-1';
    icon.setAttribute('aria-hidden', 'true');

    var msgSpan = global.document.createElement('span');
    msgSpan.className = 'flex-grow-1';
    msgSpan.textContent = String(message || '');

    var closeBtn = global.document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close btn-close-white ms-2';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.addEventListener('click', function () {
      if (item.parentNode) item.parentNode.removeChild(item);
    });

    item.appendChild(icon);
    item.appendChild(msgSpan);
    item.appendChild(closeBtn);
    stack.appendChild(item);

    setTimeout(function () {
      if (item.parentNode) item.parentNode.removeChild(item);
    }, 4200);
  }

  global.BWI18n = {
    SHARED_DICT: DICT,
    getLang: getLang,
    setLang: setLang,
    t: t,
    applyTranslations: applyTranslations,
    escapeHtml: escapeHtml,
    fmtDate: fmtDate,
    daysRemaining: daysRemaining,
    downloadCsv: downloadCsv,
    downloadJson: downloadJson,
    showToast: showToast
  };
})(typeof window !== 'undefined' ? window : globalThis);
