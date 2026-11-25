/**
 * @file digitalpad-history.js
 * @description Digital Pad History & WYSIWYG Inspection Suite (`digitalpad-history.html`):
 *   - Dual Card Grid vs jQuery DataTables 2 Toggle scoped per Active Member
 *   - Full WYSIWYG `#dhDetailModal` inspection + Print + WhatsApp Share + CSV Export
 *
 * TABLE OF CONTENTS:
 *   1. Bilingual Dictionary (`PAGE_DICT`)
 *   2. Card Grid & Safe DataTables Destroy/Init
 *   3. Full WYSIWYG Modal, Print, WhatsApp & Delete
 */
(function (global) {
  'use strict';

  var PAGE_DICT = {
    bn: {
      pageTitle: 'ডিজিটাল প্যাড ইতিহাস | ব্রিদওয়েল',
      heroTitle: 'সক্রিয় সদস্যের ডিজিটাল প্যাড আর্কাইভ',
      heroSub: 'স্টুডিও বা ডিরেক্ট প্যাডে তৈরি সকল ডিজিটাল প্রেসক্রিপশন দেখুন, প্রিন্ট ও শেয়ার করুন।',
      viewCards: 'কার্ড গ্রিড',
      viewTable: 'টেবিল ভিউ',
      modalTitle: 'সম্পূর্ণ ডিজিটাল প্রেসক্রিপশন',
      btnPrintPad: 'প্রিন্ট A4',
      btnWaPad: 'হোয়াটসঅ্যাপ শেয়ার',
      toastDeleted: 'ডিজিটাল প্যাড রেকর্ড মুছে ফেলা হয়েছে।'
    },
    en: {
      pageTitle: 'Digital Pad Archive | BreatheWell',
      heroTitle: 'Active Member Digital Pad History',
      heroSub: 'Browse, print, and WhatsApp-share authored digital prescriptions saved under the active family member.',
      viewCards: 'Card Grid',
      viewTable: 'DataTables View',
      modalTitle: 'Clinical Digital Prescription',
      btnPrintPad: 'Print A4',
      btnWaPad: 'WhatsApp Share',
      toastDeleted: 'Digital pad entry deleted.'
    }
  };

  function tr(key) {
    return global.BWI18n.t(key, PAGE_DICT);
  }

  var viewMode = 'cards';
  var dtInstance = null;
  var inspectedPad = null;

  function openDetail(pad) {
    inspectedPad = pad;
    var active = global.BWStore.getActiveMember();
    document.getElementById('dhDetailSheet').innerHTML = global.BWRxShared.buildPaperPadHtml(pad, active);
    var modalEl = document.getElementById('dhDetailModal');
    if (global.bootstrap && global.bootstrap.Modal) {
      global.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  function deletePadById(id) {
    var next = (global.BWStore.getDomainData('rx_pad') || []).filter(function (x) { return x.id !== id; });
    global.BWStore.setDomainData('rx_pad', next);
    global.BWI18n.showToast(tr('toastDeleted'), 'warning');
    renderArchive();
  }

  function renderArchive() {
    var list = global.BWStore.getDomainData('rx_pad') || [];
    var esc = global.BWI18n.escapeHtml;
    var cardsPane = document.getElementById('dhCardsPane');
    var tablePane = document.getElementById('dhTablePane');

    if (viewMode === 'cards') {
      cardsPane.classList.remove('d-none');
      tablePane.classList.add('d-none');
      if (!list.length) {
        cardsPane.innerHTML = '<div class="col-12"><div class="bw-card p-4 text-center text-muted">' + esc(global.BWI18n.t('commonNoRecords', PAGE_DICT)) + '</div></div>';
        return;
      }
      cardsPane.innerHTML = list.map(function (pad) {
        return (
          '<div class="col-md-6 col-xl-4">' +
          '  <article class="rx-vault-card">' +
          '    <div>' +
          '      <div class="d-flex justify-content-between mb-2"><strong class="h6 mb-0 text-primary">' + esc(pad.doctorName || 'Doctor') + '</strong><small class="text-muted tabular-nums">' + esc(pad.rxDate || '') + '</small></div>' +
          '      <div class="small fw-semibold mb-1">Patient: ' + esc(pad.patientName || '—') + '</div>' +
          '      <div class="small text-muted mb-2">' + esc(pad.diagnosis || '—') + '</div>' +
          '      <div class="small text-muted">' + (pad.meds || []).length + ' Rx items</div>' +
          '    </div>' +
          '    <div class="pt-2 border-top mt-3 d-flex justify-content-between gap-2">' +
          '      <button type="button" class="btn btn-sm btn-bw-outline flex-grow-1" data-open-pad="' + esc(pad.id) + '"><i class="bi bi-file-earmark-medical"></i> View Pad</button>' +
          '      <button type="button" class="btn btn-sm btn-outline-danger" data-del-pad="' + esc(pad.id) + '" aria-label="Delete"><i class="bi bi-trash"></i></button>' +
          '    </div>' +
          '  </article>' +
          '</div>'
        );
      }).join('');
    } else {
      cardsPane.classList.add('d-none');
      tablePane.classList.remove('d-none');
      var tbl = document.getElementById('dhDataTable');
      if (dtInstance && typeof dtInstance.destroy === 'function') {
        try { dtInstance.destroy(); } catch (e) { /* ignore */ }
        dtInstance = null;
      }
      document.getElementById('dhTableBody').innerHTML = list.map(function (pad) {
        return (
          '<tr>' +
          '  <td class="tabular-nums">' + esc(pad.rxDate || '') + '</td>' +
          '  <td class="fw-semibold">' + esc(pad.doctorName || '') + '</td>' +
          '  <td>' + esc(pad.patientName || '') + '</td>' +
          '  <td>' + esc(pad.diagnosis || '—') + '</td>' +
          '  <td class="d-flex gap-1">' +
          '    <button type="button" class="btn btn-sm btn-bw-outline" data-open-pad="' + esc(pad.id) + '"><i class="bi bi-eye"></i></button>' +
          '    <button type="button" class="btn btn-sm btn-outline-danger" data-del-pad="' + esc(pad.id) + '"><i class="bi bi-trash"></i></button>' +
          '  </td>' +
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

    Array.prototype.forEach.call(document.querySelectorAll('[data-dh-view]'), function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-dh-view]'), function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        viewMode = btn.getAttribute('data-dh-view') || 'cards';
        renderArchive();
      });
    });

    document.getElementById('main').addEventListener('click', function (ev) {
      var openBtn = ev.target && ev.target.closest ? ev.target.closest('[data-open-pad]') : null;
      if (openBtn) {
        var pid = openBtn.getAttribute('data-open-pad');
        var list = global.BWStore.getDomainData('rx_pad') || [];
        var found = list.filter(function (x) { return x.id === pid; })[0];
        if (found) openDetail(found);
        return;
      }
      var delBtn = ev.target && ev.target.closest ? ev.target.closest('[data-del-pad]') : null;
      if (delBtn) {
        deletePadById(delBtn.getAttribute('data-del-pad'));
      }
    });

    document.getElementById('dhModalPrintBtn').addEventListener('click', function () { global.print(); });
    document.getElementById('dhModalWaBtn').addEventListener('click', function () {
      if (inspectedPad) global.BWRxShared.sharePadWhatsApp(inspectedPad);
    });

    document.getElementById('dhExportCsvBtn').addEventListener('click', function () {
      var active = global.BWStore.getActiveMember();
      var list = global.BWStore.getDomainData('rx_pad') || [];
      global.BWI18n.downloadCsv(
        'digital-pads-' + active.name.toLowerCase().replace(/\s+/g, '-') + '.csv',
        ['Date', 'Doctor', 'Patient', 'Diagnosis', 'Advice'],
        list.map(function (p) { return [p.rxDate, p.doctorName, p.patientName, p.diagnosis, p.advice]; })
      );
    });

    renderArchive();

    global.addEventListener('bwLanguageChanged', function () {
      document.title = tr('pageTitle');
      renderArchive();
    });
    global.addEventListener('bwMemberChanged', renderArchive);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
