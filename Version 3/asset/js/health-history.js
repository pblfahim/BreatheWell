/**
 * @file health-history.js
 * @description Clinical Vitals DataTables 2 Ledger & Multi-Format Export (`health-history.html`):
 *   - 4-Card Pull-Up KPI Strip (`Total`, `BP`, `Glucose`, `Latest Date`)
 *   - Safe DataTables 2 Destroy/Re-Init on Member Switch or Language Change
 *   - RFC 4180 UTF-8 BOM CSV Export + Complete JSON Export (Fixed from V1!)
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Member Summary KPIs & DataTable Lifecycle Renderer
 *   3. Filter, Export & Delete Handlers
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'স্বাস্থ্য রিডিং ইতিহাস | ব্রিদওয়েল v3',
      heroTitle: 'সক্রিয় সদস্যের রক্তচাপ ও গ্লুকোজ লেজার',
      heroSub: 'DataTables সার্চ, সর্টিং এবং বাংলা-বান্ধব CSV/JSON এক্সপোর্টসহ সম্পূর্ণ ইতিহাস।',
      statTotal: 'মোট রেকর্ড',
      statBp: 'রক্তচাপ লগ',
      statBg: 'গ্লুকোজ লগ',
      statLatest: 'সর্বশেষ তারিখ',
      filterAll: 'সবগুলো',
      filterBp: 'রক্তচাপ',
      filterBg: 'গ্লুকোজ',
      toastDeleted: 'রেকর্ডটি মুছে ফেলা হয়েছে।'
    },
    en: {
      pageTitle: 'Vitals History Ledger | BreatheWell v3',
      heroTitle: 'Blood Pressure & Glucose Clinical Ledger',
      heroSub: 'Searchable DataTables 2 history isolated per active family member with BOM CSV & JSON backups.',
      statTotal: 'Total Logs',
      statBp: 'BP Readings',
      statBg: 'Glucose Readings',
      statLatest: 'Latest Entry',
      filterAll: 'All Vitals',
      filterBp: 'BP Only',
      filterBg: 'Glucose Only',
      toastDeleted: 'Clinical reading removed.'
    }
  };

  function tr(key) { return global.BWI18n.t(key, PAGE_DICT); }

  var filterMode = 'all';
  var dtInstance = null;

  function collectRows() {
    var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
    var rows = [];
    if (filterMode === 'all' || filterMode === 'bp') {
      (vitals.bp || []).forEach(function (b) {
        var cls = global.BWClinical.classifyBP(b.sys, b.dia);
        rows.push({
          id: b.id, dom: 'bp', ts: b.ts, type: 'Blood Pressure',
          displayVal: b.sys + '/' + b.dia + ' mmHg (HR ' + (b.pulse || '—') + ')',
          orderVal: Number(b.sys) || 0, status: tr(cls.labelKey), badge: cls.badgeClass, note: b.note || ''
        });
      });
    }
    if (filterMode === 'all' || filterMode === 'bg') {
      (vitals.glucose || []).forEach(function (g) {
        var cls = global.BWClinical.classifyGlucose(g.valueMgdl, g.context);
        var mmol = global.BWClinical.mgdlToMmol(g.valueMgdl);
        rows.push({
          id: g.id, dom: 'glucose', ts: g.ts, type: 'Glucose (' + g.context + ')',
          displayVal: mmol + ' mmol/L (' + g.valueMgdl + ' mg/dL)',
          orderVal: Number(g.valueMgdl) || 0, status: tr(cls.labelKey), badge: cls.badgeClass, note: g.note || ''
        });
      });
    }
    rows.sort(function (a, b) { return String(b.ts).localeCompare(String(a.ts)); });
    return { vitals: vitals, rows: rows };
  }

  function renderLedger() {
    var built = collectRows();
    var bpCount = (built.vitals.bp || []).length;
    var bgCount = (built.vitals.glucose || []).length;
    document.getElementById('hlTotalCount').textContent = String(bpCount + bgCount);
    document.getElementById('hlBPCount').textContent = String(bpCount);
    document.getElementById('hlBGCount').textContent = String(bgCount);
    document.getElementById('hlLatestDate').textContent = built.rows.length ? global.BWI18n.fmtDate(built.rows[0].ts, false) : '—';

    var tbl = document.getElementById('historyLogTable');
    if (dtInstance && typeof dtInstance.destroy === 'function') {
      try { dtInstance.destroy(); } catch (e) { /* Ignore */ }
      dtInstance = null;
    }

    var esc = global.BWI18n.escapeHtml;
    document.getElementById('historyLogBody').innerHTML = built.rows.map(function (r) {
      return (
        '<tr>' +
        '  <td data-order="' + esc(r.ts) + '">' + esc(global.BWI18n.fmtDate(r.ts, true)) + '</td>' +
        '  <td class="fw-semibold">' + esc(r.type) + '</td>' +
        '  <td data-order="' + esc(r.orderVal) + '" class="fw-bold tabular-nums">' + esc(r.displayVal) + '</td>' +
        '  <td><span class="bw-status-pill ' + esc(r.badge) + '">' + esc(r.status) + '</span></td>' +
        '  <td>' + esc(r.note || '—') + '</td>' +
        '  <td><button type="button" class="btn btn-sm btn-outline-danger" data-del-dom="' + esc(r.dom) + '" data-del-id="' + esc(r.id) + '" aria-label="Delete"><i class="bi bi-trash"></i></button></td>' +
        '</tr>'
      );
    }).join('');

    if (typeof global.jQuery === 'function' && global.jQuery.fn && global.jQuery.fn.DataTable) {
      dtInstance = global.jQuery(tbl).DataTable({
        pageLength: 10,
        order: [[0, 'desc']],
        columnDefs: [{ orderable: false, targets: 5 }],
        language: { emptyTable: esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) }
      });
    }
  }

  function init() {
    global.BWNav.init(PAGE_DICT);
    document.title = tr('pageTitle');

    Array.prototype.forEach.call(document.querySelectorAll('[data-hh-filter]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-hh-filter]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterMode = btn.getAttribute('data-hh-filter');
        renderLedger();
      });
    });

    document.getElementById('historyLogTable').addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('[data-del-id]') : null;
      if (!btn) return;
      var dom = btn.getAttribute('data-del-dom');
      var id = btn.getAttribute('data-del-id');
      var vitals = global.BWStore.getDomainData('vitals') || { bp: [], glucose: [] };
      if (dom === 'bp') vitals.bp = (vitals.bp || []).filter(function (x) { return x.id !== id; });
      else vitals.glucose = (vitals.glucose || []).filter(function (x) { return x.id !== id; });
      global.BWStore.setDomainData('vitals', vitals);
      global.BWI18n.showToast(tr('toastDeleted'), 'warning');
      renderLedger();
    });

    document.getElementById('hhExportCsvBtn').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      var rows = collectRows().rows;
      global.BWI18n.downloadCsv(
        'vitals-' + active.name.toLowerCase().replace(/\s+/g, '-') + '.csv',
        ['Date', 'Type', 'Reading', 'Status', 'Note'],
        rows.map(function (r) { return [r.ts, r.type, r.displayVal, r.status, r.note]; })
      );
    });

    document.getElementById('hhExportJsonBtn').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      global.BWI18n.downloadJson(
        'vitals-' + active.name.toLowerCase().replace(/\s+/g, '-') + '.json',
        { member: active.name, vitals: global.BWStore.getDomainData('vitals') }
      );
    });

    renderLedger();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderLedger();
    });
    global.addEventListener('bwMemberChanged', renderLedger);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
