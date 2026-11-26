/**
 * @file bw-nav.js
 * @module BWNav
 * @description Global Navigation Hydrator, Live Multi-Member Switcher Dropdown,
 * Guest Preview Unlock Modal (`#bwAuthPromptModal`), Privacy PIN Modal (`#bwPinPromptModal`),
 * and Active Link Synchronization across Desktop Navbar, Mobile Bottom Nav & Drawer.
 *
 * ZERO INLINE JS / CSS: All event bindings use addEventListener and clean CSS classes.
 *
 * TABLE OF CONTENTS:
 *   1. Active Navigation Link Sync & Language Toggle Binding
 *   2. PIN Challenge & Guest Unlock Modals
 *   3. Multi-Member Switcher Dropdown Renderer
 *   4. Global Context Strip Updater
 *   5. Initialization on DOMContentLoaded
 */
(function (global) {
  'use strict';

  var currentPageDict = null;

  function currentPageFile() {
    if (!global.location || !global.location.pathname) return 'index.html';
    var clean = global.location.pathname.split('/').pop();
    return clean || 'index.html';
  }

  function highlightActiveLinks() {
    var file = currentPageFile();
    var vitalsPages = ['health-reading.html', 'health-history.html', 'health-charts.html', 'health-demo.html'];
    var rxPages = ['prescriptions-volt.html', 'prescription-history.html', 'prescription-create.html', 'prescription-pad.html', 'digitalpad-history.html'];
    var authPages = ['login.html', 'register.html', 'profile.html'];

    Array.prototype.forEach.call(document.querySelectorAll('[data-nav-page]'), function (el) {
      var target = el.getAttribute('data-nav-page') || '';
      var isGroupMatch =
        (target === file) ||
        (target === '@vitals' && vitalsPages.indexOf(file) !== -1) ||
        (target === '@rx' && rxPages.indexOf(file) !== -1) ||
        (target === '@family' && authPages.indexOf(file) !== -1);
      el.classList.toggle('active', isGroupMatch);
      if (isGroupMatch) {
        el.setAttribute('aria-current', 'page');
      } else {
        el.removeAttribute('aria-current');
      }
    });
  }

  function bindLanguageButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('.bw-lang-btn'), function (btn) {
      if (btn.dataset.bwLangBound) return;
      btn.dataset.bwLangBound = '1';
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-lang') || 'bn';
        global.BWI18n.setLang(next);
        global.BWI18n.applyTranslations(currentPageDict);
        renderMemberControls();
        renderContextStrip();
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. PIN & AUTH UNLOCK MODALS
     -------------------------------------------------------------------------- */
  function ensureAuthModal() {
    var existing = document.getElementById('bwAuthPromptModal');
    if (existing) return existing;

    var modal = document.createElement('div');
    modal.id = 'bwAuthPromptModal';
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'bwAuthModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML =
      '<div class="modal-dialog modal-dialog-centered">' +
      '  <div class="modal-content border-0 shadow-lg">' +
      '    <div class="modal-header border-0 pb-0">' +
      '      <h5 class="modal-title fw-bold" id="bwAuthModalLabel" data-i18n="authModalTitle"></h5>' +
      '      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '    </div>' +
      '    <div class="modal-body pt-2">' +
      '      <p class="text-muted small mb-3" data-i18n="authModalBody"></p>' +
      '      <div class="d-grid gap-2">' +
      '        <button type="button" class="btn btn-bw-primary" id="bwAuthModalDemoBtn">' +
      '          <i class="bi bi-people-fill" aria-hidden="true"></i>' +
      '          <span data-i18n="btnDemoFamily"></span>' +
      '        </button>' +
      '        <div class="row g-2">' +
      '          <div class="col-6">' +
      '            <a href="login.html" class="btn btn-bw-outline w-100" id="bwAuthModalLoginLink" data-i18n="authModalGoLogin"></a>' +
      '          </div>' +
      '          <div class="col-6">' +
      '            <a href="register.html" class="btn btn-outline-secondary w-100" data-i18n="authModalGoRegister"></a>' +
      '          </div>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="modal-footer border-0 pt-0">' +
      '      <button type="button" class="btn btn-link text-muted text-decoration-none w-100" data-bs-dismiss="modal" data-i18n="authModalClose"></button>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(modal);
    var demoBtn = modal.querySelector('#bwAuthModalDemoBtn');
    demoBtn.addEventListener('click', function () {
      global.BWStore.loginDemoFamily();
      hideModalById('bwAuthPromptModal');
      global.BWI18n.showToast(global.BWI18n.t('toastDemoLoaded', currentPageDict), 'success');
      renderMemberControls();
      renderContextStrip();
    });
    return modal;
  }

  var pendingPinCallback = null;

  function ensurePinModal() {
    var existing = document.getElementById('bwPinPromptModal');
    if (existing) return existing;

    var modal = document.createElement('div');
    modal.id = 'bwPinPromptModal';
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'bwPinModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML =
      '<div class="modal-dialog modal-dialog-centered modal-sm">' +
      '  <div class="modal-content border-0 shadow-lg">' +
      '    <div class="modal-header border-0 pb-0">' +
      '      <h5 class="modal-title fw-bold" id="bwPinModalLabel" data-i18n="pinModalTitle"></h5>' +
      '      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
      '    </div>' +
      '    <div class="modal-body">' +
      '      <p class="small text-muted mb-3" data-i18n="pinModalBody"></p>' +
      '      <input type="password" inputmode="numeric" maxlength="4" pattern="[0-9]*" id="bwPinInput" class="form-control text-center fw-bold fs-4 tabular-nums" data-i18n-placeholder="pinPlaceholder">' +
      '      <div id="bwPinError" class="text-danger small mt-2 d-none" data-i18n="pinWrong"></div>' +
      '      <button type="button" id="bwPinSubmitBtn" class="btn btn-bw-primary w-100 mt-3" data-i18n="pinConfirm"></button>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(modal);
    var input = modal.querySelector('#bwPinInput');
    var errBox = modal.querySelector('#bwPinError');
    var submitBtn = modal.querySelector('#bwPinSubmitBtn');

    function handleVerify() {
      var val = String(input.value || '').trim();
      if (global.BWStore.verifyPin(val)) {
        errBox.classList.add('d-none');
        input.value = '';
        hideModalById('bwPinPromptModal');
        if (typeof pendingPinCallback === 'function') {
          var fn = pendingPinCallback;
          pendingPinCallback = null;
          fn();
        }
      } else {
        errBox.classList.remove('d-none');
        input.focus();
      }
    }

    submitBtn.addEventListener('click', handleVerify);
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') handleVerify();
    });
    return modal;
  }

  function showModalById(id) {
    var el = document.getElementById(id);
    if (!el || !global.bootstrap || !global.bootstrap.Modal) return;
    global.bootstrap.Modal.getOrCreateInstance(el).show();
  }

  function hideModalById(id) {
    var el = document.getElementById(id);
    if (!el || !global.bootstrap || !global.bootstrap.Modal) return;
    global.bootstrap.Modal.getOrCreateInstance(el).hide();
  }

  function promptPinThen(callback) {
    var acc = global.BWStore.getActiveAccount();
    if (!acc || !acc.pinEnabled) {
      callback();
      return;
    }
    ensurePinModal();
    global.BWI18n.applyTranslations(currentPageDict);
    pendingPinCallback = callback;
    showModalById('bwPinPromptModal');
  }

  function openAuthPrompt() {
    ensureAuthModal();
    global.BWI18n.applyTranslations(currentPageDict);
    showModalById('bwAuthPromptModal');
  }

  /* --------------------------------------------------------------------------
     3. MULTI-MEMBER SWITCHER DROPDOWN RENDERING
     -------------------------------------------------------------------------- */
  function relationLabel(relationKey) {
    return global.BWI18n.t('rel_' + (relationKey || 'other'), currentPageDict);
  }

  function handleMemberSwitch(memberId, memberName) {
    promptPinThen(function () {
      var res = global.BWStore.switchMember(memberId);
      if (res && res.ok) {
        global.BWI18n.showToast(
          global.BWI18n.t('toastMemberSwitched', currentPageDict) + ' ' + memberName,
          'success'
        );
        renderMemberControls();
        renderContextStrip();
      }
    });
  }

  function renderMemberControls() {
    var slot = document.getElementById('bwNavMemberSlot');
    var drawerMemberBox = document.getElementById('bwDrawerMemberBox');
    var esc = global.BWI18n.escapeHtml;
    var isAuth = global.BWStore.isAuthenticated();
    var active = global.BWStore.getActiveMember();
    var members = global.BWStore.getMembers();
    var relText = relationLabel(active.relation);
    var colorIdx = typeof active.avatarColor === 'number' ? active.avatarColor : 1;

    if (slot) {
      if (!isAuth) {
        slot.innerHTML =
          '<button type="button" class="bw-member-pill" id="bwGuestUnlockBtn" aria-label="Unlock family accounts">' +
          '  <span class="bw-avatar-circle bw-avatar-color-1">GE</span>' +
          '  <span class="d-none d-xl-inline">' + esc(relText) + '</span>' +
          '  <span class="badge bg-primary-subtle text-primary rounded-pill ms-1">' + esc(global.BWI18n.t('btnSignIn', currentPageDict)) + '</span>' +
          '</button>';
        var unlockBtn = document.getElementById('bwGuestUnlockBtn');
        if (unlockBtn) {
          unlockBtn.addEventListener('click', openAuthPrompt);
        }
      } else {
        var optionsHtml = members.map(function (m) {
          var actCls = m.id === active.id ? ' active' : '';
          var mColor = typeof m.avatarColor === 'number' ? m.avatarColor : 0;
          return (
            '<button type="button" class="bw-member-option' + actCls + '" data-switch-member-id="' + esc(m.id) + '" data-switch-member-name="' + esc(m.name) + '">' +
            '  <span class="bw-avatar-circle bw-avatar-color-' + mColor + '">' + esc(m.avatarInitials || 'FM') + '</span>' +
            '  <span class="bw-member-meta">' +
            '    <strong>' + esc(m.name) + '</strong>' +
            '    <small>' + esc(relationLabel(m.relation)) + ' • ' + esc(m.bloodGroup || 'O+') + '</small>' +
            '  </span>' +
            (m.id === active.id ? '<i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i>' : '') +
            '</button>'
          );
        }).join('');

        slot.innerHTML =
          '<div class="dropdown">' +
          '  <button type="button" class="bw-member-pill dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">' +
          '    <span class="bw-avatar-circle bw-avatar-color-' + colorIdx + '">' + esc(active.avatarInitials || 'FM') + '</span>' +
          '    <span class="d-none d-md-inline text-truncate bw-member-name-label">' + esc(active.name) + '</span>' +
          '    <span class="badge bg-success-subtle text-success rounded-pill d-none d-xl-inline">' + esc(relText) + '</span>' +
          '  </button>' +
          '  <div class="dropdown-menu dropdown-menu-end bw-member-menu">' +
          '    <div class="px-2 py-1 small fw-bold text-uppercase text-muted">' + esc(global.BWI18n.t('btnSwitchMember', currentPageDict)) + '</div>' +
          '    <div class="d-grid gap-1 my-1">' + optionsHtml + '</div>' +
          '    <hr class="dropdown-divider my-2">' +
          '    <a href="profile.html" class="bw-drawer-link"><i class="bi bi-people-fill text-primary" aria-hidden="true"></i> ' + esc(global.BWI18n.t('btnManageFamily', currentPageDict)) + '</a>' +
          '    <button type="button" class="bw-drawer-link border-0 bg-transparent w-100 text-danger" id="bwNavLogoutBtn"><i class="bi bi-box-arrow-right" aria-hidden="true"></i> ' + esc(global.BWI18n.t('btnLogout', currentPageDict)) + '</button>' +
          '  </div>' +
          '</div>';

        Array.prototype.forEach.call(slot.querySelectorAll('[data-switch-member-id]'), function (opt) {
          opt.addEventListener('click', function () {
            var mid = opt.getAttribute('data-switch-member-id');
            var mname = opt.getAttribute('data-switch-member-name');
            if (mid && mid !== active.id) handleMemberSwitch(mid, mname);
          });
        });

        var logoutBtn = document.getElementById('bwNavLogoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function () {
            global.BWStore.logout();
            renderMemberControls();
            renderContextStrip();
          });
        }
      }
    }

    if (drawerMemberBox) {
      if (!isAuth) {
        drawerMemberBox.innerHTML =
          '<div class="bw-card p-3 mb-3">' +
          '  <div class="d-flex align-items-center gap-2 mb-2">' +
          '    <span class="bw-avatar-circle bw-avatar-color-1">GE</span>' +
          '    <div class="bw-member-meta"><strong>' + esc(active.name) + '</strong><small>' + esc(relText) + '</small></div>' +
          '  </div>' +
          '  <div class="d-grid gap-2">' +
          '    <button type="button" class="btn btn-bw-primary btn-sm" id="bwDrawerDemoBtn">' + esc(global.BWI18n.t('btnDemoFamily', currentPageDict)) + '</button>' +
          '    <a href="login.html" class="btn btn-bw-outline btn-sm">' + esc(global.BWI18n.t('btnSignIn', currentPageDict)) + '</a>' +
          '  </div>' +
          '</div>';
        var drDemo = document.getElementById('bwDrawerDemoBtn');
        if (drDemo) {
          drDemo.addEventListener('click', function () {
            global.BWStore.loginDemoFamily();
            global.BWI18n.showToast(global.BWI18n.t('toastDemoLoaded', currentPageDict), 'success');
            renderMemberControls();
            renderContextStrip();
          });
        }
      } else {
        var drawerOpts = members.map(function (m) {
          var isSel = m.id === active.id;
          return '<option value="' + esc(m.id) + '"' + (isSel ? ' selected' : '') + '>' + esc(m.name) + ' (' + esc(relationLabel(m.relation)) + ')</option>';
        }).join('');
        drawerMemberBox.innerHTML =
          '<div class="bw-card p-3 mb-3">' +
          '  <label for="bwDrawerMemberSelect" class="form-label small fw-bold text-muted mb-1">' + esc(global.BWI18n.t('activeMemberPrefix', currentPageDict)) + '</label>' +
          '  <select id="bwDrawerMemberSelect" class="form-select mb-2">' + drawerOpts + '</select>' +
          '  <div class="d-flex gap-2">' +
          '    <a href="profile.html" class="btn btn-bw-outline btn-sm flex-fill">' + esc(global.BWI18n.t('navFamily', currentPageDict)) + '</a>' +
          '    <button type="button" class="btn btn-outline-danger btn-sm" id="bwDrawerLogoutBtn">' + esc(global.BWI18n.t('btnLogout', currentPageDict)) + '</button>' +
          '  </div>' +
          '</div>';
        var sel = document.getElementById('bwDrawerMemberSelect');
        if (sel) {
          sel.addEventListener('change', function () {
            var chosen = sel.options[sel.selectedIndex];
            handleMemberSwitch(sel.value, chosen ? chosen.textContent : '');
          });
        }
        var dLogout = document.getElementById('bwDrawerLogoutBtn');
        if (dLogout) {
          dLogout.addEventListener('click', function () {
            global.BWStore.logout();
            renderMemberControls();
            renderContextStrip();
          });
        }
      }
    }
  }

  /* --------------------------------------------------------------------------
     4. ACTIVE CONTEXT / GUEST BANNER STRIP
     -------------------------------------------------------------------------- */
  function renderContextStrip() {
    var strip = document.getElementById('bwContextStrip');
    if (!strip) return;
    var esc = global.BWI18n.escapeHtml;
    var isAuth = global.BWStore.isAuthenticated();
    var active = global.BWStore.getActiveMember();
    var relText = relationLabel(active.relation);

    if (!isAuth) {
      strip.innerHTML =
        '<div class="container d-flex flex-wrap align-items-center justify-content-between gap-2">' +
        '  <div class="d-flex align-items-center gap-2">' +
        '    <i class="bi bi-shield-check text-primary" aria-hidden="true"></i>' +
        '    <span>' + esc(global.BWI18n.t('guestBannerText', currentPageDict)) + '</span>' +
        '  </div>' +
        '  <div class="d-flex flex-wrap gap-2">' +
        '    <button type="button" class="btn btn-bw-primary btn-sm" id="bwStripDemoBtn">' +
        '      <i class="bi bi-people-fill" aria-hidden="true"></i> ' + esc(global.BWI18n.t('btnDemoFamily', currentPageDict)) +
        '    </button>' +
        '    <a href="login.html" class="btn btn-bw-outline btn-sm">' + esc(global.BWI18n.t('btnSignIn', currentPageDict)) + '</a>' +
        '  </div>' +
        '</div>';
      var demoBtn = document.getElementById('bwStripDemoBtn');
      if (demoBtn) {
        demoBtn.addEventListener('click', function () {
          global.BWStore.loginDemoFamily();
          global.BWI18n.showToast(global.BWI18n.t('toastDemoLoaded', currentPageDict), 'success');
          renderMemberControls();
          renderContextStrip();
        });
      }
    } else {
      var bloodBadge = active.bloodGroup ? ' <span class="badge bg-danger-subtle text-danger rounded-pill">' + esc(active.bloodGroup) + '</span>' : '';
      var ageText = active.age ? ' • ' + esc(active.age) + ' ' + esc(global.BWI18n.t('commonYears', currentPageDict)) : '';
      strip.innerHTML =
        '<div class="container d-flex flex-wrap align-items-center justify-content-between gap-2">' +
        '  <div class="d-flex flex-wrap align-items-center gap-2">' +
        '    <span class="bw-context-badge">' +
        '      <i class="bi bi-person-check-fill text-success" aria-hidden="true"></i>' +
        '      <span>' + esc(global.BWI18n.t('activeMemberPrefix', currentPageDict)) + '</span>' +
        '      <strong>' + esc(active.name) + '</strong>' +
        '      <span class="text-muted">(' + esc(relText) + ageText + ')</span>' + bloodBadge +
        '    </span>' +
        '  </div>' +
        '  <a href="profile.html" class="small fw-semibold text-decoration-none">' +
        '    <i class="bi bi-sliders2" aria-hidden="true"></i> ' + esc(global.BWI18n.t('btnManageFamily', currentPageDict)) +
        '  </a>' +
        '</div>';
    }
  }

  /* --------------------------------------------------------------------------
     5. PUBLIC INIT & AUTO BOOTSTRAP
     -------------------------------------------------------------------------- */
  function init(pageDict) {
    currentPageDict = pageDict || null;
    highlightActiveLinks();
    bindLanguageButtons();
    if (global.BWI18n) {
      global.BWI18n.applyTranslations(currentPageDict);
    }
    if (global.BWStore) {
      renderMemberControls();
      renderContextStrip();
    }
  }

  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', function () {
      init(currentPageDict);
    });
  }
  if (typeof global.addEventListener === 'function') {
    global.addEventListener('bwMemberChanged', function () {
      renderMemberControls();
      renderContextStrip();
    });
  }

  global.BWNav = {
    init: init,
    renderMemberControls: renderMemberControls,
    renderContextStrip: renderContextStrip,
    openAuthPrompt: openAuthPrompt,
    promptPinThen: promptPinThen,
    relationLabel: relationLabel
  };
})(typeof window !== 'undefined' ? window : globalThis);
