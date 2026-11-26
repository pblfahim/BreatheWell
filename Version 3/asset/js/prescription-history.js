/**
 * @file prescription-history.js
 * @description Vault Prescription Archive (`prescription-history.html`):
 *   - Search, Urgency Filters (`all`, `normal`, `followup`, `urgent`), Sort & Card Grid / DataTables Toggle
 *   - Dual-Tab Lightbox (`#phLightbox`: Uploaded Scan Attachments vs Formatted 2-Col Clinical Sheet)
 *   - BOM UTF-8 CSV Export & Scoped Member Deletion
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Filtered / Sorted Query Builder
 *   3. Card Grid & Safe DataTables 2 Destroy/Init
 *   4. Dual-Tab Clinical & Attachment Lightbox
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'প্রেসক্রিপশন ইতিহাস | ব্রিদওয়েল v3',
      heroTitle: 'সক্রিয় সদস্যের প্রেসক্রিপশন ভল্ট ইতিহাস',
      heroSub: 'জরুরি অবস্থা অনুযায়ী ফিল্টার করুন এবং স্ক্যান ও ডিজিটাল ক্লিনিক্যাল শিট একসাথে দেখুন।',
      phSearch: 'ডাক্তার, হাসপাতাল, রোগ বা ওষুধ খুঁজুন...',
      fAll: 'সবগুলো',
      fNormal: 'সাধারণ',
      fFollowup: 'ফলো-আপ',
      fUrgent: 'জরুরি',
      viewGrid: 'কার্ড গ্রিড',
      viewTable: 'টেবিল ভিউ',
      lbTitle: 'প্রেসক্রিপশন প্রিভিউ ও ক্লিনিক্যাল শিট',
      tabClinical: 'ক্লিনিক্যাল শিট',
      tabAttachments: 'সংযুক্ত ফাইলসমূহ',
      toastDeleted: 'প্রেসক্রিপশনটি ভল্ট থেকে মুছে ফেলা হয়েছে।'
    },
    en: {
      pageTitle: 'Prescription History | BreatheWell v3',
      heroTitle: 'Active Member Prescription Archive',
      heroSub: 'Filter by clinical urgency, search across medications & inspect uploaded scans alongside structured sheets.',
      phSearch: 'Search physician, clinic, diagnosis or medication...',
      fAll: 'All',
      fNormal: 'Normal',
      fFollowup: 'Follow-Up',
      fUrgent: 'Urgent',
      viewGrid: 'Card Grid',
      viewTable: 'DataTables',
      lbTitle: 'Prescription Inspection Lightbox',
      tabClinical: 'Clinical Sheet',
      tabAttachments: 'Attachments',
      toastDeleted: 'Prescription deleted from vault.'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var filterUrgency = 'all';
  var viewMode = 'grid';
  var dtInstance = null;

  function queryVault() {
    var q = (document.getElementById('phSearch').value || '').trim().toLowerCase();
    var sort = document.getElementById('phSortSelect').value;
    var list = (global.BWStore.getDomainData('rx_vault') || []).slice();

    list = list.filter(function (rx) {
      if (filterUrgency !== 'all' && (rx.urgency || 'normal') !== filterUrgency) return false;
      if (!q) return true;
      var medsStr = (rx.medications || []).map(function (m) { return typeof m === 'string' ? m : m.name; }).join(' ');
      return [rx.doctor, rx.clinic, rx.specialty, rx.diagnosis, medsStr].join(' ').toLowerCase().indexOf(q) !== -1;
    });

    list.sort(function (a, b) {
      if (sort === 'old') return String(a.date || '').localeCompare(String(b.date || ''));
      if (sort === 'doctor') return String(a.doctor || '').localeCompare(String(b.doctor || ''));
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
    return list;
  }

  function openDualLightbox(rx) {
    var active = global.BWStore.getActiveMember();
    var sig = global.BWStore.getDomainData('signature', active.id) || '';
    document.getElementById('lbClinicalSheet').innerHTML = global.BWRxShared.buildClinicalPadHtml({
      doctorName: rx.doctor,
      doctorCreds: rx.degrees || rx.specialty,
      bmdc: rx.bmdc,
      clinicName: rx.clinic || rx.hospital,
      patientName: rx.patientName || active.name,
      patientAge: rx.patientAge || active.age,
      patientSex: rx.patientSex || active.gender,
      rxDate: rx.date,
      followUp: rx.refillDate,
      cc: rx.cc,
      ho: rx.ho,
      oe: rx.oe,
      inv: rx.inv,
      diagnosis: rx.diagnosis,
      meds: rx.medications,
      advice: rx.notes
    }, active, sig);

    var files = rx.files || (rx.imageDataUrl ? [rx.imageDataUrl] : []);
    document.getElementById('lbFilesWrap').innerHTML = files.length
      ? files.map(function (src) { return '<img src="' + src + '" alt="Rx scan" class="img-fluid rounded border mb-3 d-block mx-auto">'; }).join('')
      : '<p class="text-center text-muted py-4 small">No image/PDF files attached to this entry.</p>';

    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(document.getElementById('phLightbox')).show();
    }
  }

  function renderArchive() {
    var list = queryVault();
    var esc = global.BWI18n.escapeHtml;
    var gridPane = document.getElementById('phGallery');
    var tblWrap = document.getElementById('phTableViewWrap');

    if (viewMode === 'grid') {
      gridPane.classList.remove('d-none');
      tblWrap.classList.add('d-none');
      if (!list.length) {
        gridPane.innerHTML = '<div class="col-12"><div class="bw-card p-4 text-center text-muted">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</div></div>';
        return;
      }
      gridPane.innerHTML = list.map(function (rx) {
        var days = global.BWI18n.daysRemaining(rx.refillDate);
        var refillTag = days !== null ? '<span class="bw-status-pill ' + (days <= 5 ? 'bw-status-danger' : 'bw-status-normal') + '">Refill ' + days + 'd</span>' : '';
        var mCount = (rx.medications || []).length;
        return (
          '<div class="col-md-6 col-xl-4"><article class="rx-vault-card">' +
          '  <div>' +
          '    <div class="d-flex justify-content-between align-items-start gap-2 mb-2"><div><h2 class="h6 fw-bold mb-0">' + esc(rx.doctor) + '</h2><small class="text-muted">' + esc(rx.clinic || rx.specialty || '') + '</small></div><small class="tabular-nums text-muted">' + esc(rx.date || '') + '</small></div>' +
          '    <div class="small fw-semibold text-primary mb-2">' + esc(rx.diagnosis || 'General Consultation') + '</div>' +
          '    <div class="d-flex flex-wrap gap-1 mb-2">' + refillTag + '<span class="badge bg-secondary-subtle text-dark rounded-pill">' + mCount + ' Rx</span></div>' +
          '  </div>' +
          '  <div class="d-flex gap-2 pt-2 border-top">' +
          '    <button type="button" class="btn btn-sm btn-bw-outline flex-grow-1" data-open-rx="' + esc(rx.id) + '"><i class="bi bi-eye"></i> Inspect</button>' +
          '    <button type="button" class="btn btn-sm btn-outline-danger" data-del-rx="' + esc(rx.id) + '" aria-label="Delete"><i class="bi bi-trash"></i></button>' +
          '  </div>' +
          '</article></div>'
        );
      }).join('');
    } else {
      gridPane.classList.add('d-none');
      tblWrap.classList.remove('d-none');
      var tbl = document.getElementById('prescriptionHistoryTable');
      if (dtInstance && typeof dtInstance.destroy === 'function') {
        try { dtInstance.destroy(); } catch (e) { /* Ignore */ }
        dtInstance = null;
      }
      document.getElementById('phTableBody').innerHTML = list.map(function (rx) {
        var medsTxt = (rx.medications || []).map(function (m) { return typeof m === 'string' ? m : m.name; }).join('; ');
        return (
          '<tr>' +
          '  <td class="tabular-nums">' + esc(rx.date || '') + '</td>' +
          '  <td class="fw-semibold">' + esc(rx.doctor) + '</td>' +
          '  <td>' + esc(rx.patientName || '') + '</td>' +
          '  <td>' + esc(medsTxt) + '</td>' +
          '  <td><span class="badge bg-light text-dark text-uppercase">' + esc(rx.urgency || 'normal') + '</span></td>' +
          '  <td class="d-flex gap-1"><button type="button" class="btn btn-sm btn-bw-outline" data-open-rx="' + esc(rx.id) + '"><i class="bi bi-eye"></i></button><button type="button" class="btn btn-sm btn-outline-danger" data-del-rx="' + esc(rx.id) + '"><i class="bi bi-trash"></i></button></td>' +
          '</tr>'
        );
      }).join('');

      if (typeof global.jQuery === 'function' && global.jQuery.fn && global.jQuery.fn.DataTable) {
        dtInstance = global.jQuery(tbl).DataTable({ pageLength: 10, order: [[0, 'desc']] });
      }
    }
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    document.getElementById('phSearch').addEventListener('input', renderArchive);
    document.getElementById('phSortSelect').addEventListener('change', renderArchive);

    Array.prototype.forEach.call(document.querySelectorAll('[data-ph-urg]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-ph-urg]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterUrgency = btn.getAttribute('data-ph-urg');
        renderArchive();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-ph-view]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-ph-view]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        viewMode = btn.getAttribute('data-ph-view');
        renderArchive();
      });
    });

    document.getElementById('main').addEventListener('click', function (ev) {
      var openBtn = ev.target && ev.target.closest ? ev.target.closest('[data-open-rx]') : null;
      if (openBtn) {
        var id = openBtn.getAttribute('data-open-rx');
        var found = (global.BWStore.getDomainData('rx_vault') || []).filter(function (x) { return x.id === id; })[0];
        if (found) openDualLightbox(found);
        return;
      }
      var delBtn = ev.target && ev.target.closest ? ev.target.closest('[data-del-rx]') : null;
      if (delBtn) {
        var did = delBtn.getAttribute('data-del-rx');
        var next = (global.BWStore.getDomainData('rx_vault') || []).filter(function (x) { return x.id !== did; });
        global.BWStore.setDomainData('rx_vault', next);
        global.BWI18n.showToast(tr('toastDeleted'), 'warning');
        renderArchive();
      }
    });

    document.getElementById('btnExportCsv').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      var list = queryVault();
      global.BWI18n.downloadCsv(
        'rx-vault-' + active.name + '.csv',
        ['Date', 'Doctor', 'Clinic', 'Patient', 'Diagnosis', 'Medications', 'Urgency', 'RefillDate'],
        list.map(function (r) {
          return [r.date, r.doctor, r.clinic, r.patientName, r.diagnosis, (r.medications || []).map(function (m) { return typeof m === 'string' ? m : m.name; }).join('; '), r.urgency, r.refillDate];
        })
      );
    });

    renderArchive();
    global.addEventListener('bwLanguageChanged', function () { document.title = tr('pageTitle'); renderArchive(); });
    global.addEventListener('bwMemberChanged', renderArchive);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
