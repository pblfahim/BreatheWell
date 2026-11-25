/**
 * @file prescription-history.js
 * @description Prescription Vault Archive (`prescription-history.html`):
 *   - Dual Card Grid <-> jQuery DataTables 2 Toggle
 *   - Real-time Search + UTF-8 BOM CSV Export scoped per Active Member
 *   - Fullscreen Clinical Record Modal
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Card Grid & Safe DataTables Destroy/Init Renderers
 *   3. Detail Modal & CSV Export
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'ভল্ট ইতিহাস | ব্রিদওয়েল',
      heroTitle: 'সক্রিয় সদস্যের প্রেসক্রিপশন ভল্ট আর্কাইভ',
      heroSub: 'কার্ড গ্রিড অথবা সার্চেবল DataTables টেবিলে প্রেসক্রিপশন খুঁজুন, দেখুন ও এক্সপোর্ট করুন।',
      viewCards: 'কার্ড গ্রিড',
      viewTable: 'টেবিল ভিউ',
      phSearch: 'ডাক্তার, হাসপাতাল, রোগ বা ওষুধ লিখুন...',
      modalTitle: 'প্রেসক্রিপশন বিস্তারিত'
    },
    en: {
      pageTitle: 'Vault Archive History | BreatheWell',
      heroTitle: 'Active Member Prescription Vault Archive',
      heroSub: 'Switch cleanly between Card Grid and DataTables Ledger to search, inspect & export member prescriptions.',
      viewCards: 'Card Grid',
      viewTable: 'DataTables View',
      phSearch: 'Filter by doctor, hospital, diagnosis or drug...',
      modalTitle: 'Prescription Inspection'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  var viewMode = 'cards';
  var dtInstance = null;

  function filteredRecords() {
    var q = (document.getElementById('phSearchInput').value || '').trim().toLowerCase();
    var list = global.BWStore.getDomainData('rx_vault') || [];
    if (!q) return list;
    return list.filter(function (rx) {
      var blob = [rx.doctor, rx.specialty, rx.hospital, rx.diagnosis, rx.notes, (rx.medications || []).join(' ')].join(' ').toLowerCase();
      return blob.indexOf(q) !== -1;
    });
  }

  function openDetailModal(rx) {
    var esc = global.BWI18n.escapeHtml;
    var active = global.BWStore.getActiveMember();
    document.getElementById('phModalBody').innerHTML =
      '<div class="mb-2"><strong class="h5 text-primary">' + esc(rx.doctor) + '</strong></div>' +
      '<div class="small text-muted mb-3">' + esc(rx.specialty || '') + (rx.hospital ? ' • ' + esc(rx.hospital) : '') + ' • ' + esc(rx.date || '') + '</div>' +
      '<div class="mb-2"><strong>Patient:</strong> ' + esc(active.name) + '</div>' +
      (rx.diagnosis ? '<div class="mb-2"><strong>Dx:</strong> ' + esc(rx.diagnosis) + '</div>' : '') +
      '<div class="mb-2"><strong>Medications:</strong><ul>' + (rx.medications || []).map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>' +
      (rx.notes ? '<div class="small text-muted mb-3">' + esc(rx.notes) + '</div>' : '') +
      (rx.imageDataUrl ? '<img src="' + rx.imageDataUrl + '" alt="Scan" class="img-fluid rounded border">' : '');

    var modalEl = document.getElementById('phDetailModal');
    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  function renderView() {
    var list = filteredRecords();
    var esc = global.BWI18n.escapeHtml;
    var cardsPane = document.getElementById('phCardsPane');
    var tablePane = document.getElementById('phTablePane');

    if (viewMode === 'cards') {
      cardsPane.classList.remove('d-none');
      tablePane.classList.add('d-none');
      if (!list.length) {
        cardsPane.innerHTML = '<div class="col-12"><div class="bw-card p-4 text-center text-muted">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</div></div>';
        return;
      }
      cardsPane.innerHTML = list.map(function (rx) {
        return (
          '<div class="col-md-6 col-xl-4">' +
          '  <div class="rx-vault-card">' +
          '    <div>' +
          '      <div class="d-flex justify-content-between mb-2"><strong class="h6 mb-0">' + esc(rx.doctor) + '</strong><small class="text-muted tabular-nums">' + esc(rx.date || '') + '</small></div>' +
          '      <div class="small text-muted mb-2">' + esc(rx.hospital || rx.specialty || '—') + '</div>' +
          '      <div class="small fw-semibold text-primary mb-2">' + esc(rx.diagnosis || '—') + '</div>' +
          '      <div class="small text-muted">' + (rx.medications || []).length + ' medications</div>' +
          '    </div>' +
          '    <div class="pt-2 border-top mt-3 d-flex justify-content-end">' +
          '      <button type="button" class="btn btn-sm btn-bw-outline" data-inspect-id="' + esc(rx.id) + '"><i class="bi bi-eye"></i> Inspect</button>' +
          '    </div>' +
          '  </div>' +
          '</div>'
        );
      }).join('');

      Array.prototype.forEach.call(cardsPane.querySelectorAll('[data-inspect-id]'), function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-inspect-id');
          var found = list.filter(function (x) { return x.id === id; })[0];
          if (found) openDetailModal(found);
        });
      });
    } else {
      cardsPane.classList.add('d-none');
      tablePane.classList.remove('d-none');
      var tbl = document.getElementById('phDataTable');
      if (dtInstance && typeof dtInstance.destroy === 'function') {
        try { dtInstance.destroy(); } catch (e) { /* ignore */ }
        dtInstance = null;
      }
      document.getElementById('phTableBody').innerHTML = list.map(function (rx) {
        return (
          '<tr>' +
          '  <td class="tabular-nums">' + esc(rx.date || '') + '</td>' +
          '  <td class="fw-semibold">' + esc(rx.doctor) + '</td>' +
          '  <td>' + esc(rx.diagnosis || '—') + '</td>' +
          '  <td>' + esc((rx.medications || []).join('; ')) + '</td>' +
          '  <td><button type="button" class="btn btn-sm btn-bw-outline" data-inspect-id="' + esc(rx.id) + '"><i class="bi bi-eye"></i></button></td>' +
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

    Array.prototype.forEach.call(document.querySelectorAll('[data-ph-view]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-ph-view]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        viewMode = btn.getAttribute('data-ph-view') || 'cards';
        renderView();
      });
    });

    document.getElementById('phSearchInput').addEventListener('input', renderView);
    document.getElementById('phTablePane').addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('[data-inspect-id]') : null;
      if (!btn) return;
      var id = btn.getAttribute('data-inspect-id');
      var list = global.BWStore.getDomainData('rx_vault') || [];
      var found = list.filter(function (x) { return x.id === id; })[0];
      if (found) openDetailModal(found);
    });

    document.getElementById('phExportCsvBtn').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      var list = global.BWStore.getDomainData('rx_vault') || [];
      global.BWI18n.downloadCsv(
        'rx-vault-' + active.name.toLowerCase().replace(/\s+/g, '-') + '.csv',
        ['Date', 'Doctor', 'Hospital', 'Diagnosis', 'Medications', 'RefillDate'],
        list.map(function (r) { return [r.date, r.doctor, r.hospital, r.diagnosis, (r.medications || []).join('; '), r.refillDate || '']; })
      );
    });

    renderView();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderView();
    });
    global.addEventListener('bwMemberChanged', renderView);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
