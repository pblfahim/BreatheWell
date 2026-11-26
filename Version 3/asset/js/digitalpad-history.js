/**
 * @file digitalpad-history.js
 * @description Digital Pad History & Full 2-Column A4 Clinical Modal (`digitalpad-history.html`):
 *   - 3-Card Pull-Up KPI Strip (`Total`, `Distinct Patients`, `Created Today`)
 *   - Search, Filter (`all`, `pad`, `studio`), Sort & Card Grid <-> DataTables 2 Toggle
 *   - Full Printable `#dhDetailModal` w/ Member Signature, Print A4, WhatsApp Share & BOM CSV Export
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Filtered Archive Query, 3-Card KPI Strip & Grid/DataTables Renderer
 *   3. Full A4 Detail Modal & Actions
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'ডিজিটাল প্যাড ইতিহাস | ব্রিদওয়েল v3',
      heroTitle: 'সক্রিয় সদস্যের ডিজিটাল প্যাড আর্কাইভ',
      heroSub: 'স্টুডিও বা ডিরেক্ট প্যাডে তৈরি প্রেসক্রিপশন দেখুন, A4 প্রিন্ট ও শেয়ার করুন।',
      statTotal: 'মোট ডিজিটাল প্যাড',
      statPatients: 'সদস্য / রোগী',
      statToday: 'আজ তৈরি হয়েছে',
      phSearch: 'রোগী, ডাক্তার বা রোগ নির্ণয় খুঁজুন...',
      fAll: 'সবগুলো',
      fPad: 'ডিরেক্ট প্যাড',
      fStudio: 'রচয়িতা স্টুডিও',
      modalTitle: 'ক্লিনিক্যাল A4 ডিজিটাল প্রেসক্রিপশন',
      toastDeleted: 'ডিজিটাল প্যাড রেকর্ড মুছে ফেলা হয়েছে।'
    },
    en: {
      pageTitle: 'Digital Pad Archive | BreatheWell v3',
      heroTitle: 'Active Member Digital Pad Archive',
      heroSub: 'Inspect, print A4 sheets & WhatsApp-share authored prescriptions isolated per active member.',
      statTotal: 'Total Digital Pads',
      statPatients: 'Distinct Patients',
      statToday: 'Created Today',
      phSearch: 'Filter by patient, doctor or diagnosis...',
      fAll: 'All Sources',
      fPad: 'Direct Pad',
      fStudio: 'Creator Studio',
      modalTitle: 'Clinical A4 Digital Prescription',
      toastDeleted: 'Digital pad deleted from archive.'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var srcFilter = 'all';
  var viewMode = 'grid';
  var dtInstance = null;
  var activeInspectedPad = null;

  function queryPads() {
    var q = (document.getElementById('dhSearch').value || '').trim().toLowerCase();
    var sort = document.getElementById('dhSortSelect').value;
    var list = (global.BWStore.getDomainData('rx_pad') || []).slice();

    var patients = Object.create(null);
    var today = new Date().toISOString().slice(0, 10);
    var todayCount = 0;
    list.forEach(function (p) {
      if (p.patientName) patients[p.patientName] = 1;
      if (String(p.rxDate || p.createdAt || '').slice(0, 10) === today) todayCount++;
    });

    document.getElementById('statTotalVal').textContent = String(list.length);
    document.getElementById('statPatientsVal').textContent = String(Object.keys(patients).length);
    document.getElementById('statTodayVal').textContent = String(todayCount);

    list = list.filter(function (p) {
      if (srcFilter !== 'all' && (p.source || 'studio') !== srcFilter) return false;
      if (!q) return true;
      return [p.doctorName, p.patientName, p.diagnosis, p.serialNo].join(' ').toLowerCase().indexOf(q) !== -1;
    });

    list.sort(function (a, b) {
      if (sort === 'old') return String(a.rxDate || '').localeCompare(String(b.rxDate || ''));
      if (sort === 'patient') return String(a.patientName || '').localeCompare(String(b.patientName || ''));
      return String(b.rxDate || '').localeCompare(String(a.rxDate || ''));
    });
    return list;
  }

  function openPadModal(pad) {
    activeInspectedPad = pad;
    var active = global.BWStore.getActiveMember();
    var sig = global.BWStore.getDomainData('signature', active.id) || '';
    document.getElementById('dhModalPadSheet').innerHTML = global.BWRxShared.buildClinicalPadHtml(pad, active, sig);
    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(document.getElementById('dhDetailModal')).show();
    }
  }

  function renderArchive() {
    var list = queryPads();
    var esc = global.BWI18n.escapeHtml;
    var grid = document.getElementById('dhGallery');
    var tblWrap = document.getElementById('dhTableViewWrap');

    if (viewMode === 'grid') {
      grid.classList.remove('d-none');
      tblWrap.classList.add('d-none');
      if (!list.length) {
        grid.innerHTML = '<div class="col-12"><div class="bw-card p-4 text-center text-muted">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</div></div>';
        return;
      }
      grid.innerHTML = list.map(function (pad) {
        return (
          '<div class="col-md-6 col-xl-4"><article class="rx-vault-card">' +
          '  <div>' +
          '    <div class="d-flex justify-content-between mb-2"><strong class="h6 mb-0 text-primary">' + esc(pad.doctorName || 'Physician') + '</strong><span class="badge bg-info-subtle text-info rounded-pill">' + esc(pad.source || 'studio') + '</span></div>' +
          '    <div class="small fw-semibold mb-1">Patient: ' + esc(pad.patientName || '—') + (pad.serialNo ? ' (' + esc(pad.serialNo) + ')' : '') + '</div>' +
          '    <div class="small text-muted mb-2">' + esc(pad.diagnosis || '—') + '</div>' +
          '    <small class="text-muted tabular-nums d-block">' + esc(pad.rxDate || '') + ' • ' + (pad.meds || []).length + ' Rx items</small>' +
          '  </div>' +
          '  <div class="d-flex gap-2 pt-2 border-top mt-3">' +
          '    <button type="button" class="btn btn-sm btn-bw-outline flex-grow-1" data-open-pad="' + esc(pad.id) + '"><i class="bi bi-file-earmark-medical"></i> Open Sheet</button>' +
          '    <button type="button" class="btn btn-sm btn-outline-danger" data-del-pad="' + esc(pad.id) + '" aria-label="Delete"><i class="bi bi-trash"></i></button>' +
          '  </div>' +
          '</article></div>'
        );
      }).join('');
    } else {
      grid.classList.add('d-none');
      tblWrap.classList.remove('d-none');
      var tbl = document.getElementById('digitalpadHistoryTable');
      if (dtInstance && typeof dtInstance.destroy === 'function') {
        try { dtInstance.destroy(); } catch (e) { /* Ignore */ }
        dtInstance = null;
      }
      document.getElementById('dhTableBody').innerHTML = list.map(function (pad) {
        return (
          '<tr>' +
          '  <td class="tabular-nums">' + esc(pad.rxDate || '') + '</td>' +
          '  <td class="fw-semibold">' + esc(pad.patientName || '') + '</td>' +
          '  <td>' + esc(pad.doctorName || '') + '</td>' +
          '  <td>' + esc(pad.diagnosis || '—') + '</td>' +
          '  <td><span class="badge bg-light text-dark">' + esc(pad.source || 'studio') + '</span></td>' +
          '  <td class="d-flex gap-1"><button type="button" class="btn btn-sm btn-bw-outline" data-open-pad="' + esc(pad.id) + '"><i class="bi bi-eye"></i></button><button type="button" class="btn btn-sm btn-outline-danger" data-del-pad="' + esc(pad.id) + '"><i class="bi bi-trash"></i></button></td>' +
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

    document.getElementById('dhSearch').addEventListener('input', renderArchive);
    document.getElementById('dhSortSelect').addEventListener('change', renderArchive);

    Array.prototype.forEach.call(document.querySelectorAll('[data-dh-src]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-dh-src]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        srcFilter = btn.getAttribute('data-dh-src');
        renderArchive();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-dh-view]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-dh-view]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        viewMode = btn.getAttribute('data-dh-view');
        renderArchive();
      });
    });

    document.getElementById('main').addEventListener('click', function (ev) {
      var openBtn = ev.target && ev.target.closest ? ev.target.closest('[data-open-pad]') : null;
      if (openBtn) {
        var pid = openBtn.getAttribute('data-open-pad');
        var found = (global.BWStore.getDomainData('rx_pad') || []).filter(function (x) { return x.id === pid; })[0];
        if (found) openPadModal(found);
        return;
      }
      var delBtn = ev.target && ev.target.closest ? ev.target.closest('[data-del-pad]') : null;
      if (delBtn) {
        var did = delBtn.getAttribute('data-del-pad');
        var next = (global.BWStore.getDomainData('rx_pad') || []).filter(function (x) { return x.id !== did; });
        global.BWStore.setDomainData('rx_pad', next);
        global.BWI18n.showToast(tr('toastDeleted'), 'warning');
        renderArchive();
      }
    });

    document.getElementById('btnPrintModalPrescription').addEventListener('click', function () { global.print(); });
    document.getElementById('btnShareModalWhatsApp').addEventListener('click', function () {
      if (activeInspectedPad) global.BWRxShared.sharePadWhatsApp(activeInspectedPad);
    });
    document.getElementById('btnCopyModalText').addEventListener('click', function () {
      if (activeInspectedPad) global.BWI18n.copyText(global.BWRxShared.buildPadPlainSummary(activeInspectedPad));
    });

    document.getElementById('btnExportCsv').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      var list = queryPads();
      global.BWI18n.downloadCsv(
        'digitalpad-' + active.name + '.csv',
        ['Date', 'Serial', 'Doctor', 'Patient', 'Diagnosis', 'Source', 'Advice'],
        list.map(function (p) { return [p.rxDate, p.serialNo, p.doctorName, p.patientName, p.diagnosis, p.source, p.advice]; })
      );
    });

    renderArchive();
    global.addEventListener('bwLanguageChanged', function () { document.title = tr('pageTitle'); renderArchive(); });
    global.addEventListener('bwMemberChanged', renderArchive);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
