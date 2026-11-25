/**
 * @file health-history.js
 * @description Clinical Vitals Ledger with jQuery DataTables 2 (`health-history.html`):
 *   - Unified Filterable Log (`All`, `BP Only`, `Glucose Only`) scoped per Active Member
 *   - Clean DataTables 2 Destroy + Re-Init lifecycle on Member Switch or Language Change
 *   - UTF-8 BOM CSV Export, JSON Backup Export & Deletion
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Member Metrics & DataTable Safe Destroy/Init Renderer
 *   3. Filter, Export & Delete Handlers
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'স্বাস্থ্য রিডিং ইতিহাস | ব্রিদওয়েল',
      heroTitle: 'সক্রিয় সদস্যের রক্তচাপ ও গ্লুকোজ লেজার',
      heroSub: 'DataTables সার্চ, সর্টিং এবং UTF-8 বাংলা-বান্ধব CSV/JSON এক্সপোর্টসহ সম্পূর্ণ ইতিহাস।',
      statTotalBp: 'মোট রক্তচাপ লগ',
      statTotalGl: 'মোট গ্লুকোজ লগ',
      statAvgBp: 'গড় রক্তচাপ',
      filterAll: 'সব ধরনের',
      filterBp: 'শুধু রক্তচাপ',
      filterGl: 'শুধু গ্লুকোজ',
      toastDeleted: 'রেকর্ডটি মুছে ফেলা হয়েছে।'
    },
    en: {
      pageTitle: 'Vitals History Table | BreatheWell',
      heroTitle: 'Blood Pressure & Glucose Clinical Ledger',
      heroSub: 'Searchable, sortable DataTables ledger scoped to your active family member with BOM CSV & JSON exports.',
      statTotalBp: 'BP Readings',
      statTotalGl: 'Glucose Readings',
      statAvgBp: 'Average BP',
      filterAll: 'All Vitals',
      filterBp: 'Blood Pressure',
      filterGl: 'Glucose Only',
      toastDeleted: 'Reading deleted.'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  var currentFilter = 'all';
  var dtInstance = null;

  function buildRows() {
    var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    var rows = [];
    if (currentFilter === 'all' || currentFilter === 'bp') {
      (vitals.bp || []).forEach(function (b) {
        var cls = global.BWClinical.classifyBP(b.sys, b.dia);
        rows.push({
          id: b.id,
          domain: 'bp',
          ts: b.ts,
          type: 'Blood Pressure',
          value: b.sys + '/' + b.dia + ' mmHg (HR ' + (b.pulse || '—') + ')',
          statusText: tr(cls.labelKey),
          badgeClass: cls.badgeClass,
          note: b.note || ''
        });
      });
    }
    if (currentFilter === 'all' || currentFilter === 'glucose') {
      (vitals.glucose || []).forEach(function (g) {
        var cls = global.BWClinical.classifyGlucose(g.valueMgdl, g.context);
        var mmol = global.BWClinical.mgdlToMmol(g.valueMgdl);
        rows.push({
          id: g.id,
          domain: 'glucose',
          ts: g.ts,
          type: 'Glucose (' + g.context + ')',
          value: g.valueMgdl + ' mg/dL (' + mmol + ' mmol/L)',
          statusText: tr(cls.labelKey),
          badgeClass: cls.badgeClass,
          note: g.note || ''
        });
      });
    }
    rows.sort(function (a, b) { return String(b.ts).localeCompare(String(a.ts)); });
    return { vitals: vitals, rows: rows };
  }

  function renderTable() {
    var built = buildRows();
    var vitals = built.vitals;
    var rows = built.rows;
    var esc = global.BWI18n.escapeHtml;

    /* Summary KPIs */
    document.getElementById('hhTotalBp').textContent = String((vitals.bp || []).length);
    document.getElementById('hhTotalGl').textContent = String((vitals.glucose || []).length);
    if (vitals.bp && vitals.bp.length) {
      var sSum = vitals.bp.reduce(function (a, b) { return a + Number(b.sys); }, 0);
      var dSum = vitals.bp.reduce(function (a, b) { return a + Number(b.dia); }, 0);
      document.getElementById('hhAvgBp').textContent = Math.round(sSum / vitals.bp.length) + '/' + Math.round(dSum / vitals.bp.length);
    } else {
      document.getElementById('hhAvgBp').textContent = '—';
    }

    /* Safely destroy existing DataTable instance before DOM replacement */
    var tableEl = document.getElementById('hhLedgerTable');
    if (dtInstance && typeof dtInstance.destroy === 'function') {
      try {
        dtInstance.destroy();
      } catch (e) {
        /* Ignore already-destroyed states */
      }
      dtInstance = null;
    }

    var tbody = document.getElementById('hhLedgerBody');
    tbody.innerHTML = rows.map(function (r) {
      return (
        '<tr>' +
        '  <td data-order="' + esc(r.ts) + '">' + esc(global.BWI18n.fmtDate(r.ts, true)) + '</td>' +
        '  <td class="fw-semibold">' + esc(r.type) + '</td>' +
        '  <td class="fw-bold tabular-nums">' + esc(r.value) + '</td>' +
        '  <td><span class="bw-status-pill ' + esc(r.badgeClass) + '">' + esc(r.statusText) + '</span></td>' +
        '  <td>' + esc(r.note || '—') + '</td>' +
        '  <td><button type="button" class="btn btn-sm btn-outline-danger" data-del-dom="' + esc(r.domain) + '" data-del-id="' + esc(r.id) + '" aria-label="Delete"><i class="bi bi-trash"></i></button></td>' +
        '</tr>'
      );
    }).join('');

    if (typeof global.jQuery === 'function' && global.jQuery.fn && global.jQuery.fn.DataTable) {
      dtInstance = global.jQuery(tableEl).DataTable({
        pageLength: 10,
        order: [[0, 'desc']],
        responsive: true,
        language: {
          emptyTable: esc(global.BWI18n.t('commonNoRecords', PAGE_DICT))
        }
      });
    }
  }

  function handleDeleteClick(ev) {
    var btn = ev.target && ev.target.closest ? ev.target.closest('[data-del-id]') : null;
    if (!btn) return;
    var dom = btn.getAttribute('data-del-dom');
    var id = btn.getAttribute('data-del-id');
    var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    if (dom === 'bp') {
      vitals.bp = (vitals.bp || []).filter(function (x) { return x.id !== id; });
    } else {
      vitals.glucose = (vitals.glucose || []).filter(function (x) { return x.id !== id; });
    }
    global.BWStore.setDomainData('vitals', vitals);
    global.BWI18n.showToast(tr('toastDeleted'), 'warning');
    renderTable();
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    Array.prototype.forEach.call(document.querySelectorAll('[data-hh-filter]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-hh-filter]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-hh-filter') || 'all';
        renderTable();
      });
    });

    document.getElementById('hhLedgerTable').addEventListener('click', handleDeleteClick);

    document.getElementById('hhExportCsvBtn').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      var rows = buildRows().rows;
      global.BWI18n.downloadCsv(
        'vitals-' + active.name.toLowerCase().replace(/\s+/g, '-') + '.csv',
        ['Date', 'Type', 'Value', 'Status', 'Note'],
        rows.map(function (r) { return [r.ts, r.type, r.value, r.statusText, r.note]; })
      );
    });

    document.getElementById('hhExportJsonBtn').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      var vitals = global.BWStore.getDomainData('vitals');
      global.BWI18n.downloadJson('vitals-' + active.name.toLowerCase().replace(/\s+/g, '-') + '.json', { member: active.name, vitals: vitals });
    });

    renderTable();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderTable();
    });
    global.addEventListener('bwMemberChanged', renderTable);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
