/**
 * @file bw-i18n.js
 * @module BWI18n & BWAudio
 * @description Unified Bilingual Dictionary (`bn` / `en` with 100% key parity across 15 relations,
 * clinical labels, nav chrome & modals), Safe Escaping, Date/CSV/JSON Utilities, Toast Engine,
 * and Procedural Web Audio Harmonic Synthesizer (`window.BWAudio`).
 *
 * TABLE OF CONTENTS:
 *   1. Shared Bilingual Dictionary (`DICT.bn` <-> `DICT.en`)
 *   2. Language State & DOM Hydration
 *   3. Escaping, Formatting, Clipboard & CSV/JSON Exporters
 *   4. Accessible Toast Engine (`showToast`)
 *   5. Shared Procedural Web Audio Engine (`BWAudio`)
 */
(function (global) {
  'use strict';

  var LANG_KEY = 'bwmm_v3_lang';

  var DICT = {
    bn: {
      brandName: 'ব্রিদওয়েল',
      brandFamilyTag: 'পরিবার v3',
      skipToMain: 'মূল অংশে যান',
      navHome: 'হোম',
      navExercises: 'শ্বাস ব্যায়াম',
      navBreathTest: 'ব্রিদ টেস্ট',
      navVitals: 'স্বাস্থ্য রিডিং',
      navRx: 'প্রেসক্রিপশন',
      navSafety: 'নিরাপত্তা',
      navFamily: 'পরিবার ও প্রোফাইল',
      navMore: 'সব মডিউল',
      subTabExStudio: 'শ্বাস ব্যায়াম',
      subTabExTest: 'শ্বাসের পরীক্ষা',
      subTabVitalsEntry: 'নতুন রিডিং',
      subTabVitalsHistory: 'ইতিহাস লগ',
      subTabVitalsCharts: 'ট্রেন্ড চার্ট',
      subTabVitalsDemo: 'নমুনা ডেটা',
      subTabRxVault: 'প্রেসক্রিপশন ভল্ট',
      subTabRxHistory: 'প্রেসক্রিপশন ইতিহাস',
      subTabRxPadHistory: 'ডিজিটাল প্যাড ইতিহাস',
      subTabRxCreate: 'প্রেসক্রিপশন তৈরি',
      subTabRxPad: 'ডিজিটাল প্যাড',
      rel_self: 'নিজ (প্রধান)',
      rel_father: 'বাবা',
      rel_mother: 'মা',
      rel_spouse: 'স্বামী / স্ত্রী',
      rel_son: 'ছেলে',
      rel_daughter: 'মেয়ে',
      rel_brother: 'ভাই',
      rel_sister: 'বোন',
      rel_grandfather: 'দাদা / নানা',
      rel_grandmother: 'দাদি / নানি',
      rel_uncle: 'চাচা / মামা',
      rel_aunt: 'চাচি / খালা / ফুপু',
      rel_inlaw: 'আত্মীয়',
      rel_friend: 'বন্ধু',
      rel_other: 'অন্যান্য',
      rel_guest: 'গেস্ট প্রিভিউ',
      guestBannerText: 'আপনি এখন গেস্ট প্রিভিউ মোডে আছেন। সব পরিবারের সদস্যের আলাদা ডেটা স্থায়ীভাবে সংরক্ষণ করতে সাইন ইন বা ১-ক্লিক ডেমো চালু করুন।',
      activeMemberPrefix: 'সক্রিয় সদস্য:',
      btnDemoFamily: '১-ক্লিক ৪ সদস্যের ডেমো',
      btnSignIn: 'লগইন / অ্যাকাউন্ট',
      btnRegister: 'নতুন পরিবার অ্যাকাউন্ট',
      btnLogout: 'লগআউট',
      btnSwitchMember: 'সদস্য পরিবর্তন',
      btnManageFamily: 'পরিবারের সদস্য যোগ / পরিচালনা',
      authModalTitle: 'পারিবারিক অ্যাকাউন্ট আনলক করুন',
      authModalBody: 'সব সদস্যের শ্বাস ব্যায়াম, BOLT, রক্তচাপ, ডায়াবেটিস এবং প্রেসক্রিপশন আলাদাভাবে সুরক্ষিত রাখতে সাইন ইন করুন অথবা ডেমো পরিবার চালু করুন।',
      authModalGoLogin: 'লগইন পেজে যান',
      authModalGoRegister: 'নতুন পরিবার খুলুন',
      authModalClose: 'গেস্ট হিসেবে চালিয়ে যান',
      pinModalTitle: 'প্রাইভেসি পিন যাচাই',
      pinModalBody: 'সদস্য পরিবর্তন বা সংবেদনশীল তথ্য আনলক করতে ৪-অঙ্কের পিন লিখুন।',
      pinPlaceholder: '৪-অঙ্কের পিন',
      pinConfirm: 'আনলক করুন',
      pinWrong: 'পিন মেলেনি। অনুগ্রহ করে আবার চেষ্টা করুন।',
      drawerDirectoryTitle: 'ব্রিদওয়েল v3 ডিরেক্টরি',
      drawerToolsEmergency: 'জরুরি SOS শান্ত শ্বাস',
      drawerToolsLungTest: 'ফুসফুস ও BOLT পরীক্ষা',
      footerPrivacyNote: 'BreatheWell v3 · প্রতিটি নিঃশ্বাসে একটি প্রশান্তি • ১০০% লোকাল ব্রাউজার প্রাইভেসি।',
      footerEmergencyNote: 'সাধারণ সুস্থতা ও ট্র্যাকিংয়ের জন্য। জরুরি চিকিৎসায় সর্বদা ৯৯৯ বা চিকিৎসকের পরামর্শ নিন।',
      statusLow: 'স্বাভাবিকের নিচে / কম',
      statusNormal: 'স্বাভাবিক / উত্তম',
      statusElevated: 'উচ্চতর সতর্কতা',
      statusStage1: 'উচ্চ রক্তচাপ স্টেজ ১',
      statusStage2: 'উচ্চ রক্তচাপ স্টেজ ২',
      statusCrisis: 'জরুরি সংকট',
      statusPrediabetes: 'প্রি-ডায়াবেটিস',
      statusDiabetes: 'ডায়াবেটিস স্তর',
      commonSave: 'সংরক্ষণ করুন',
      commonCancel: 'বাতিল',
      commonDelete: 'মুছুন',
      commonEdit: 'সম্পাদনা',
      commonPrint: 'প্রিন্ট',
      commonCopy: 'কপি',
      commonCopied: 'ক্লিপবোর্ডে কপি হয়েছে!',
      commonExportCsv: 'CSV ডাউনলোড',
      commonExportJson: 'JSON ব্যাকআপ',
      commonYears: 'বছর',
      commonNoRecords: 'এই সদস্যের জন্য এখনো কোনো রেকর্ড পাওয়া যায়নি।',
      toastMemberSwitched: 'সক্রিয় সদস্য পরিবর্তিত হয়েছে:',
      toastSavedMember: 'নতুন তথ্য সক্রিয় সদস্যের প্রোফাইলে সংরক্ষিত হয়েছে।',
      toastSavedGuest: 'গেস্ট প্রিভিউতে সংরক্ষিত (স্থায়ী সংরক্ষণের জন্য লগইন বা ডেমো ব্যবহার করুন)।',
      toastDemoLoaded: '৪ সদস্যের পারিবারিক ডেমো চালু হয়েছে!'
    },
    en: {
      brandName: 'BreatheWell',
      brandFamilyTag: 'Family v3',
      skipToMain: 'Skip to main content',
      navHome: 'Home',
      navExercises: 'Exercises',
      navBreathTest: 'Breath Test',
      navVitals: 'Vitals Suite',
      navRx: 'Prescriptions',
      navSafety: 'Safety',
      navFamily: 'Family & Profile',
      navMore: 'All Modules',
      subTabExStudio: 'Breathing Studio',
      subTabExTest: 'Breath Test',
      subTabVitalsEntry: 'New Reading',
      subTabVitalsHistory: 'History Log',
      subTabVitalsCharts: 'Trend Charts',
      subTabVitalsDemo: 'Sample Data',
      subTabRxVault: 'Prescription Vault',
      subTabRxHistory: 'Rx History',
      subTabRxPadHistory: 'Digital Pad History',
      subTabRxCreate: 'Create Prescription',
      subTabRxPad: 'Digital Pad',
      rel_self: 'Self (Primary)',
      rel_father: 'Father',
      rel_mother: 'Mother',
      rel_spouse: 'Spouse',
      rel_son: 'Son',
      rel_daughter: 'Daughter',
      rel_brother: 'Brother',
      rel_sister: 'Sister',
      rel_grandfather: 'Grandfather',
      rel_grandmother: 'Grandmother',
      rel_uncle: 'Uncle',
      rel_aunt: 'Aunt',
      rel_inlaw: 'In-Law',
      rel_friend: 'Friend',
      rel_other: 'Other',
      rel_guest: 'Guest Preview',
      guestBannerText: 'You are in Guest Preview mode. Sign in or launch the 1-Click Family Demo to save & switch across private household members.',
      activeMemberPrefix: 'Active Member:',
      btnDemoFamily: '1-Click 4-Member Demo',
      btnSignIn: 'Sign In / Account',
      btnRegister: 'Create Family Account',
      btnLogout: 'Sign Out',
      btnSwitchMember: 'Switch Family Member',
      btnManageFamily: 'Add / Manage Family Members',
      authModalTitle: 'Unlock Household Member Profiles',
      authModalBody: 'Sign in or try the 1-Click Family Demo to store breathing stats, BOLT tests, AHA vitals, and prescriptions isolated per member.',
      authModalGoLogin: 'Go to Sign In',
      authModalGoRegister: 'Create Household',
      authModalClose: 'Continue as Guest',
      pinModalTitle: 'Privacy PIN Verification',
      pinModalBody: 'Enter your 4-digit household PIN to unlock member controls.',
      pinPlaceholder: '4-digit PIN',
      pinConfirm: 'Unlock',
      pinWrong: 'Incorrect PIN. Please try again.',
      drawerDirectoryTitle: 'BreatheWell v3 Directory',
      drawerToolsEmergency: 'Emergency Calm Breath (SOS)',
      drawerToolsLungTest: 'Lung & BOLT Assessment',
      footerPrivacyNote: 'BreatheWell v3 · Serenity in Every Breath • 100% Local Browser Privacy.',
      footerEmergencyNote: 'For wellness awareness only. In medical emergencies call 999 / local emergency services.',
      statusLow: 'Low / Below Range',
      statusNormal: 'Normal / Optimal',
      statusElevated: 'Elevated Watch',
      statusStage1: 'High BP (Stage 1)',
      statusStage2: 'High BP (Stage 2)',
      statusCrisis: 'Hypertensive Crisis',
      statusPrediabetes: 'Prediabetes Range',
      statusDiabetes: 'Diabetes Range',
      commonSave: 'Save',
      commonCancel: 'Cancel',
      commonDelete: 'Delete',
      commonEdit: 'Edit',
      commonPrint: 'Print',
      commonCopy: 'Copy',
      commonCopied: 'Copied to clipboard!',
      commonExportCsv: 'Export CSV',
      commonExportJson: 'JSON Backup',
      commonYears: 'yrs',
      commonNoRecords: 'No records saved for this member yet.',
      toastMemberSwitched: 'Switched active member to:',
      toastSavedMember: 'Saved permanently to active member profile.',
      toastSavedGuest: 'Saved in Guest Preview (Sign in or try Demo to persist permanently).',
      toastDemoLoaded: '4-Member Family Demo activated!'
    }
  };

  /* --------------------------------------------------------------------------
     2. LANGUAGE STATE & DOM HYDRATION
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
      if (global.localStorage) {
        global.localStorage.setItem(LANG_KEY, normalized);
        /* Also mirror V1 keys cleanly for backwards interoperability */
        global.localStorage.setItem('bw_lang', normalized);
      }
    } catch (err) {
      /* Ignore storage quota errors */
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

    function resolve(key) { return t(key, pageDict, lang); }

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
      var isAct = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
    });
  }

  /* --------------------------------------------------------------------------
     3. ESCAPING, FORMATTING, CLIPBOARD & EXPORTS
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
    rows.forEach(function (r) { lines.push(r.map(csvCell).join(',')); });
    triggerDownload(filename, new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' }));
  }

  function downloadJson(filename, dataObj) {
    triggerDownload(filename, new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json;charset=utf-8;' }));
  }

  function copyText(str) {
    if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
      return global.navigator.clipboard.writeText(str).then(function () {
        showToast(t('commonCopied'), 'success');
      });
    }
    showToast(t('commonCopied'), 'info');
    return Promise.resolve();
  }

  /* --------------------------------------------------------------------------
     4. ACCESSIBLE TOAST ENGINE
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

  /* --------------------------------------------------------------------------
     5. PROCEDURAL WEB AUDIO ENGINE (BWAudio)
     -------------------------------------------------------------------------- */
  var sharedAudioCtx = null;

  function ensureAudioCtx() {
    var Ctx = global.AudioContext || global.webkitAudioContext;
    if (!sharedAudioCtx && typeof Ctx === 'function') {
      sharedAudioCtx = new Ctx();
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  }

  function playTone(fStart, fEnd, durSec, peakGain) {
    var ctx = ensureAudioCtx();
    if (!ctx) return;
    try {
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fStart, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, fEnd), now + durSec);
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(peakGain || 0.1, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, now + durSec);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durSec + 0.02);
    } catch (err) {
      /* Gracefully handle strict browser autoplay locks */
    }
  }

  function playCelebrationChime() {
    var notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach(function (freq, i) {
      setTimeout(function () { playTone(freq, freq * 1.01, 0.28, 0.09); }, i * 95);
    });
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
    copyText: copyText,
    showToast: showToast
  };

  global.BWAudio = {
    ensureAudioCtx: ensureAudioCtx,
    playTone: playTone,
    playCelebrationChime: playCelebrationChime
  };
})(typeof window !== 'undefined' ? window : globalThis);
