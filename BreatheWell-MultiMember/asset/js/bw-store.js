/**
 * @file bw-store.js
 * @module BWStore
 * @description Multi-Member Scoped Privacy-First Storage Engine for BreatheWell.
 *
 * ARCHITECTURE & PRIVACY INVARIANTS:
 *   - 100% Client-Side: Zero cloud APIs or external persistence.
 *   - Account + Member Isolation: Every clinical domain (`vitals`, `breath_tests`,
 *     `exercises`, `rx_vault`, `rx_pad`, `prefs`) is keyed strictly by
 *     `bwmm_data_v1::<accountId>::<memberId>::<domain>`.
 *   - Zero-Friction Guest Preview: Unauthenticated visitors run all interactive
 *     calculators, timers, scanners, and charts inside an isolated session buffer
 *     (`guestStore`), and can unlock permanent family profiles anytime via Login,
 *     Register, or the 1-Click Pre-Populated Family Demo.
 *   - Cryptographic Salted SHA-256: Uses FIPS 180-4 SHA-256 for passwords and 4-digit PINs.
 *
 * TABLE OF CONTENTS:
 *   1. Storage Keys & Resilient Read/Write Helpers
 *   2. Cryptography: FIPS 180-4 SHA-256 & Random Salt
 *   3. Account & Session Management
 *   4. Default Domain Structures & Member-Scoped Read/Write API
 *   5. Auth, Registration & 1-Click Family Demo Seeder
 *   6. Multi-Member CRUD, Switching & Security PIN
 *   7. Aggregation, JSON Backup/Restore & Factory Reset
 */
(function (global) {
  'use strict';

  /* --------------------------------------------------------------------------
     1. STORAGE KEYS & RESILIENT READ/WRITE HELPERS
     -------------------------------------------------------------------------- */
  var KEYS = {
    ACCOUNTS: 'bwmm_accounts_v1',
    SESSION: 'bwmm_session_v1',
    LANG: 'bwmm_lang',
    GUEST_PREFIX: 'bwmm_guest_v1::',
    DATA_PREFIX: 'bwmm_data_v1::'
  };

  var DOMAINS = ['vitals', 'breath_tests', 'exercises', 'rx_vault', 'rx_pad', 'prefs'];
  var AVATAR_PALETTE = [0, 1, 2, 3, 4];

  /* Fallback in-memory storage mirror if restricted in private contexts or jsc */
  var memoryFallback = Object.create(null);

  function safeGet(store, key) {
    try {
      return store ? store.getItem(key) : (memoryFallback[key] || null);
    } catch (err) {
      return memoryFallback[key] || null;
    }
  }

  function safeSet(store, key, val) {
    memoryFallback[key] = String(val);
    try {
      if (store) store.setItem(key, String(val));
      return true;
    } catch (err) {
      return false;
    }
  }

  function safeRemove(store, key) {
    delete memoryFallback[key];
    try {
      if (store) store.removeItem(key);
    } catch (err) {
      /* Ignore restricted storage deletion errors */
    }
  }

  function getLocal() {
    try { return global.localStorage || null; } catch (e) { return null; }
  }

  function getSessionStore() {
    try { return global.sessionStorage || null; } catch (e) { return null; }
  }

  /* --------------------------------------------------------------------------
     2. CRYPTOGRAPHY: FIPS 180-4 SHA-256 & RANDOM SALT
     -------------------------------------------------------------------------- */
  /**
   * Generates a 16-char cryptographic hex salt.
   * @returns {string}
   */
  function generateSalt() {
    var bytes = new Uint8Array(8);
    if (global.crypto && typeof global.crypto.getRandomValues === 'function') {
      global.crypto.getRandomValues(bytes);
    } else {
      for (var i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.prototype.map.call(bytes, function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  }

  /**
   * Pure-JS FIPS 180-4 SHA-256 digest (UTF-8 encoded input -> lowercase hex).
   * Guarantees deterministic hashing across HTTPS, localhost, file://, and jsc.
   * @param {string} message
   * @returns {string}
   */
  function sha256Sync(message) {
    var K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    var utf8 = unescape(encodeURIComponent(String(message || '')));
    var bytes = [];
    for (var i = 0; i < utf8.length; i++) {
      bytes.push(utf8.charCodeAt(i));
    }
    var bitLen = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);
    var hi = Math.floor(bitLen / 0x100000000);
    var lo = bitLen >>> 0;
    bytes.push((hi >>> 24) & 0xff, (hi >>> 16) & 0xff, (hi >>> 8) & 0xff, hi & 0xff);
    bytes.push((lo >>> 24) & 0xff, (lo >>> 16) & 0xff, (lo >>> 8) & 0xff, lo & 0xff);

    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

    var W = new Array(64);
    for (var offset = 0; offset < bytes.length; offset += 64) {
      for (var t = 0; t < 16; t++) {
        W[t] = (bytes[offset + t * 4] << 24) |
               (bytes[offset + t * 4 + 1] << 16) |
               (bytes[offset + t * 4 + 2] << 8) |
               bytes[offset + t * 4 + 3];
      }
      for (t = 16; t < 64; t++) {
        var s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
        var s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
        W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
      }

      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ ((~e) & g);
        var temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + temp1) | 0;
        d = c; c = b; b = a; a = (temp1 + temp2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0;
      H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }

    return H.map(function (val) {
      return ('00000000' + (val >>> 0).toString(16)).slice(-8);
    }).join('');
  }

  function hashSecret(secret, salt) {
    return sha256Sync(salt + '::' + secret);
  }

  function createId(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function computeInitials(name) {
    var parts = String(name || 'FM').trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return String(name || 'FM').slice(0, 2).toUpperCase();
  }

  /* --------------------------------------------------------------------------
     3. ACCOUNT & SESSION READ / WRITE HELPERS
     -------------------------------------------------------------------------- */
  function readAccounts() {
    var raw = safeGet(getLocal(), KEYS.ACCOUNTS);
    if (!raw) return [];
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function writeAccounts(list) {
    return safeSet(getLocal(), KEYS.ACCOUNTS, JSON.stringify(list || []));
  }

  function readSession() {
    var raw = safeGet(getLocal(), KEYS.SESSION);
    if (!raw) return null;
    try {
      var s = JSON.parse(raw);
      if (s && s.accountId) return s;
      return null;
    } catch (err) {
      return null;
    }
  }

  function writeSession(sessionObj) {
    if (!sessionObj) {
      safeRemove(getLocal(), KEYS.SESSION);
      return;
    }
    safeSet(getLocal(), KEYS.SESSION, JSON.stringify(sessionObj));
  }

  function getActiveAccount() {
    var sess = readSession();
    if (!sess) return null;
    var accounts = readAccounts();
    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].id === sess.accountId) return accounts[i];
    }
    return null;
  }

  function isAuthenticated() {
    return !!getActiveAccount();
  }

  function emitChange(eventName, detail) {
    if (typeof global.dispatchEvent === 'function' && typeof global.CustomEvent === 'function') {
      try {
        global.dispatchEvent(new global.CustomEvent(eventName, { detail: detail || {} }));
      } catch (e) {
        /* Ignore CustomEvent errors in headless runtimes */
      }
    }
  }

  /* --------------------------------------------------------------------------
     4. DEFAULT DOMAIN STRUCTURES & MULTI-MEMBER SCOPED STORAGE
     -------------------------------------------------------------------------- */
  function defaultDomainData(domain) {
    if (domain === 'vitals') return { bp: [], glucose: [] };
    if (domain === 'breath_tests') return [];
    if (domain === 'exercises') return { sessions: [], streak: 0, lastDate: null, totalSeconds: 0, level: 1 };
    if (domain === 'rx_vault') return [];
    if (domain === 'rx_pad') return [];
    if (domain === 'prefs') return { glucoseUnit: 'mgdl', sound: true, tts: false, level: 1 };
    return null;
  }

  function cloneDefault(domain) {
    return JSON.parse(JSON.stringify(defaultDomainData(domain)));
  }

  function getGuestMember() {
    return {
      id: 'guest_preview',
      name: 'Guest Explorer',
      relation: 'guest',
      age: 30,
      gender: 'other',
      bloodGroup: 'O+',
      phone: '',
      allergies: '',
      conditions: '',
      notes: '',
      avatarColor: 1,
      avatarInitials: 'GE',
      isGuest: true
    };
  }

  function getActiveMember() {
    var acc = getActiveAccount();
    if (!acc || !Array.isArray(acc.members) || acc.members.length === 0) {
      return getGuestMember();
    }
    for (var i = 0; i < acc.members.length; i++) {
      if (acc.members[i].id === acc.activeMemberId) return acc.members[i];
    }
    return acc.members[0];
  }

  function getMembers() {
    var acc = getActiveAccount();
    if (!acc || !Array.isArray(acc.members)) return [getGuestMember()];
    return acc.members.slice();
  }

  function buildScopeKey(accountId, memberId, domain) {
    if (!accountId) {
      return KEYS.GUEST_PREFIX + 'preview::' + domain;
    }
    return KEYS.DATA_PREFIX + accountId + '::' + memberId + '::' + domain;
  }

  /**
   * Reads a domain payload (`vitals`, `breath_tests`, `exercises`, `rx_vault`,
   * `rx_pad`, `prefs`) strictly scoped to the active account + active member.
   */
  function getDomainData(domain, memberIdOverride) {
    var acc = getActiveAccount();
    var targetMemberId = memberIdOverride || (acc ? getActiveMember().id : 'preview');
    var key = buildScopeKey(acc ? acc.id : null, targetMemberId, domain);
    var store = acc ? getLocal() : getSessionStore();
    var raw = safeGet(store, key);
    if (!raw) return cloneDefault(domain);
    try {
      var parsed = JSON.parse(raw);
      return parsed != null ? parsed : cloneDefault(domain);
    } catch (err) {
      return cloneDefault(domain);
    }
  }

  /**
   * Persists a domain payload strictly scoped to the active account + active member
   * (or Guest preview session buffer when unauthenticated).
   */
  function setDomainData(domain, payload, memberIdOverride) {
    var acc = getActiveAccount();
    var targetMemberId = memberIdOverride || (acc ? getActiveMember().id : 'preview');
    var key = buildScopeKey(acc ? acc.id : null, targetMemberId, domain);
    var store = acc ? getLocal() : getSessionStore();
    var ok = safeSet(store, key, JSON.stringify(payload));
    emitChange('bwDataUpdated', { domain: domain, memberId: targetMemberId, isGuest: !acc });
    return ok;
  }

  /* --------------------------------------------------------------------------
     5. AUTHENTICATION, REGISTRATION & 1-CLICK DEMO FAMILY SEEDER
     -------------------------------------------------------------------------- */
  function registerAccount(opts) {
    var name = String((opts && opts.name) || '').trim();
    var email = String((opts && opts.email) || '').trim().toLowerCase();
    var password = String((opts && opts.password) || '');

    if (!name || !email || password.length < 6) {
      return { ok: false, error: 'invalid_input' };
    }

    var accounts = readAccounts();
    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].email === email) {
        return { ok: false, error: 'email_exists' };
      }
    }

    var salt = generateSalt();
    var primaryMemberId = createId('mem');
    var accountId = createId('acc');
    var primaryMember = {
      id: primaryMemberId,
      name: name,
      relation: 'self',
      age: Number((opts && opts.age) || 32),
      gender: (opts && opts.gender) || 'male',
      bloodGroup: (opts && opts.bloodGroup) || 'O+',
      phone: String((opts && opts.phone) || ''),
      allergies: '',
      conditions: '',
      notes: 'Primary household account holder.',
      avatarColor: 0,
      avatarInitials: computeInitials(name),
      isPrimary: true,
      createdAt: new Date().toISOString()
    };

    var newAcc = {
      id: accountId,
      email: email,
      ownerName: name,
      salt: salt,
      passwordHash: hashSecret(password, salt),
      pinEnabled: false,
      pinSalt: '',
      pinHash: '',
      activeMemberId: primaryMemberId,
      members: [primaryMember],
      createdAt: new Date().toISOString()
    };

    accounts.push(newAcc);
    writeAccounts(accounts);
    writeSession({ accountId: accountId, email: email, loggedInAt: new Date().toISOString() });
    emitChange('bwMemberChanged', { account: newAcc, member: primaryMember });
    return { ok: true, account: newAcc, member: primaryMember };
  }

  function login(email, password) {
    var normEmail = String(email || '').trim().toLowerCase();
    var rawPass = String(password || '');
    var accounts = readAccounts();

    for (var i = 0; i < accounts.length; i++) {
      var acc = accounts[i];
      if (acc.email === normEmail) {
        if (hashSecret(rawPass, acc.salt) === acc.passwordHash) {
          writeSession({ accountId: acc.id, email: acc.email, loggedInAt: new Date().toISOString() });
          var member = getActiveMember();
          emitChange('bwMemberChanged', { account: acc, member: member });
          return { ok: true, account: acc, member: member };
        }
        return { ok: false, error: 'wrong_password' };
      }
    }
    return { ok: false, error: 'account_not_found' };
  }

  function logout() {
    writeSession(null);
    emitChange('bwMemberChanged', { account: null, member: getGuestMember() });
  }

  function isoDaysAgo(daysAgo, hour) {
    var d = new Date(Date.now() - daysAgo * 86400000);
    d.setHours(hour || 9, 15, 0, 0);
    return d.toISOString();
  }

  function isoDaysAhead(daysAhead) {
    var d = new Date(Date.now() + daysAhead * 86400000);
    return d.toISOString().slice(0, 10);
  }

  /**
   * Provisions and signs into a pre-seeded 4-member Demo Household (`demo@breathewell.app`)
   * with separate clinical histories for Self, Father, Mother, and Child.
   */
  function loginDemoFamily() {
    var demoEmail = 'demo@breathewell.app';
    var accounts = readAccounts();
    var demoAcc = null;
    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].email === demoEmail) {
        demoAcc = accounts[i];
        break;
      }
    }

    if (!demoAcc) {
      var salt = generateSalt();
      var accId = 'acc_demo_family';
      var members = [
        {
          id: 'mem_demo_self',
          name: 'Arif Hossain',
          relation: 'self',
          age: 34,
          gender: 'male',
          bloodGroup: 'O+',
          phone: '+8801711223344',
          allergies: 'Dust pollen',
          conditions: 'Mild stress apnea',
          notes: 'Daily Box & BOLT coherence practitioner',
          avatarColor: 0,
          avatarInitials: 'AH',
          isPrimary: true,
          createdAt: '2026-01-10T08:00:00.000Z'
        },
        {
          id: 'mem_demo_father',
          name: 'Kamrul Hossain',
          relation: 'father',
          age: 63,
          gender: 'male',
          bloodGroup: 'B+',
          phone: '+8801711009988',
          allergies: 'Sulfa drugs',
          conditions: 'Stage 1 Hypertension, Type-2 Diabetes',
          notes: 'Morning & evening BP + Fasting Glucose tracking',
          avatarColor: 1,
          avatarInitials: 'KH',
          isPrimary: false,
          createdAt: '2026-01-10T08:05:00.000Z'
        },
        {
          id: 'mem_demo_mother',
          name: 'Nasrin Akter',
          relation: 'mother',
          age: 57,
          gender: 'female',
          bloodGroup: 'A+',
          phone: '+8801819334455',
          allergies: 'None reported',
          conditions: 'Prediabetes / Hypothyroid watch',
          notes: 'Post-meal glucose checks & 4-7-8 evening relaxation',
          avatarColor: 2,
          avatarInitials: 'NA',
          isPrimary: false,
          createdAt: '2026-01-10T08:10:00.000Z'
        },
        {
          id: 'mem_demo_child',
          name: 'Ayaan Hossain',
          relation: 'child',
          age: 11,
          gender: 'male',
          bloodGroup: 'O+',
          phone: '',
          allergies: 'Seasonal pollen',
          conditions: 'Pediatric asthma clearance',
          notes: 'Diaphragmatic play exercises before sleep',
          avatarColor: 3,
          avatarInitials: 'AY',
          isPrimary: false,
          createdAt: '2026-01-10T08:15:00.000Z'
        }
      ];

      demoAcc = {
        id: accId,
        email: demoEmail,
        ownerName: 'Arif Hossain',
        salt: salt,
        passwordHash: hashSecret('Demo@1234', salt),
        pinEnabled: false,
        pinSalt: '',
        pinHash: '',
        activeMemberId: 'mem_demo_self',
        members: members,
        createdAt: '2026-01-10T08:00:00.000Z'
      };

      accounts.push(demoAcc);
      writeAccounts(accounts);
      seedDemoMemberData(accId);
    }

    writeSession({ accountId: demoAcc.id, email: demoAcc.email, loggedInAt: new Date().toISOString() });
    var active = getActiveMember();
    emitChange('bwMemberChanged', { account: demoAcc, member: active });
    return { ok: true, account: demoAcc, member: active };
  }

  function seedDemoMemberData(accId) {
    var local = getLocal();

    /* --- 1. Arif (Self): Healthy baseline --- */
    safeSet(local, buildScopeKey(accId, 'mem_demo_self', 'vitals'), JSON.stringify({
      bp: [
        { id: 'bp_s1', sys: 116, dia: 74, pulse: 68, arm: 'left', ts: isoDaysAgo(0, 8), note: 'Morning baseline after Box breathing' },
        { id: 'bp_s2', sys: 118, dia: 76, pulse: 71, arm: 'left', ts: isoDaysAgo(2, 20), note: 'Evening check' },
        { id: 'bp_s3', sys: 114, dia: 72, pulse: 66, arm: 'left', ts: isoDaysAgo(5, 8), note: 'Rested fasting' }
      ],
      glucose: [
        { id: 'gl_s1', valueMgdl: 91, context: 'fasting', ts: isoDaysAgo(0, 7), note: 'Fasting morning test' },
        { id: 'gl_s2', valueMgdl: 122, context: 'postmeal', ts: isoDaysAgo(3, 14), note: '2h after lunch' }
      ]
    }));
    safeSet(local, buildScopeKey(accId, 'mem_demo_self', 'breath_tests'), JSON.stringify([
      { id: 'bt_s1', type: 'bolt', score: 26, bpm: 11, ts: isoDaysAgo(0, 8), note: 'Steady nasal recovery' },
      { id: 'bt_s2', type: 'bolt', score: 22, bpm: 13, ts: isoDaysAgo(4, 8), note: 'Pre-work warmup' },
      { id: 'bt_s3', type: 'bolt', score: 19, bpm: 14, ts: isoDaysAgo(9, 9), note: 'Week 1 baseline' }
    ]));
    safeSet(local, buildScopeKey(accId, 'mem_demo_self', 'exercises'), JSON.stringify({
      sessions: [
        { id: 'ex_s1', protocol: 'box', level: 2, durationSec: 300, cycles: 10, mood: 'calm', ts: isoDaysAgo(0, 7) },
        { id: 'ex_s2', protocol: '478', level: 1, durationSec: 240, cycles: 8, mood: 'sleepy', ts: isoDaysAgo(1, 22) }
      ],
      streak: 5,
      lastDate: new Date().toISOString().slice(0, 10),
      totalSeconds: 1860,
      level: 2
    }));
    safeSet(local, buildScopeKey(accId, 'mem_demo_self', 'rx_vault'), JSON.stringify([
      {
        id: 'rx_s1',
        doctor: 'Dr. Mahmudul Hasan',
        specialty: 'Pulmonology',
        hospital: 'Square Wellness Clinic',
        date: isoDaysAgo(12).slice(0, 10),
        refillDate: isoDaysAhead(18),
        diagnosis: 'Mild allergic rhinitis & nasal endurance plan',
        medications: ['Montelukast 10mg (0+0+1)', 'Saline Nasal Spray (1+0+1)'],
        notes: 'Practice nasal Box breathing 5 minutes twice daily.',
        imageDataUrl: '',
        source: 'manual',
        createdAt: isoDaysAgo(12)
      }
    ]));
    safeSet(local, buildScopeKey(accId, 'mem_demo_self', 'rx_pad'), JSON.stringify([
      {
        id: 'pad_s1',
        patientName: 'Arif Hossain',
        patientAge: '34 Yrs / Male',
        doctorName: 'Dr. Mahmudul Hasan',
        doctorCreds: 'MBBS, FCPS (Chest & Respiratory)',
        clinicName: 'BreatheWell Respiratory Center',
        rxDate: isoDaysAgo(12).slice(0, 10),
        diagnosis: 'Allergic Rhinitis - Controlled',
        advice: 'Continue morning BOLT assessment and dust avoidance.',
        followUp: isoDaysAhead(18),
        meds: [
          { name: 'Tab. Montelukast 10mg', dose: '0 + 0 + 1', duration: '30 Days', note: 'Before sleep' },
          { name: 'Nasal Saline Spray', dose: '2 puffs', duration: '15 Days', note: 'Morning & night' }
        ],
        createdAt: isoDaysAgo(12)
      }
    ]));

    /* --- 2. Kamrul Hossain (Father): Stage 1 HTN + Diabetes --- */
    safeSet(local, buildScopeKey(accId, 'mem_demo_father', 'vitals'), JSON.stringify({
      bp: [
        { id: 'bp_f1', sys: 136, dia: 86, pulse: 76, arm: 'left', ts: isoDaysAgo(0, 8), note: 'Before Losartan morning dose' },
        { id: 'bp_f2', sys: 142, dia: 89, pulse: 79, arm: 'left', ts: isoDaysAgo(2, 20), note: 'Evening check after dinner' },
        { id: 'bp_f3', sys: 134, dia: 84, pulse: 74, arm: 'left', ts: isoDaysAgo(5, 8), note: 'Following slow breathing' }
      ],
      glucose: [
        { id: 'gl_f1', valueMgdl: 132, context: 'fasting', ts: isoDaysAgo(0, 7), note: 'Fasting finger-prick' },
        { id: 'gl_f2', valueMgdl: 188, context: 'postmeal', ts: isoDaysAgo(1, 15), note: '2h post lunch' },
        { id: 'gl_f3', valueMgdl: 124, context: 'fasting', ts: isoDaysAgo(4, 7), note: 'Low-GI dinner previous night' }
      ]
    }));
    safeSet(local, buildScopeKey(accId, 'mem_demo_father', 'breath_tests'), JSON.stringify([
      { id: 'bt_f1', type: 'bolt', score: 17, bpm: 15, ts: isoDaysAgo(1, 9), note: 'Gentle sit-down check' }
    ]));
    safeSet(local, buildScopeKey(accId, 'mem_demo_father', 'exercises'), JSON.stringify({
      sessions: [
        { id: 'ex_f1', protocol: 'diaphragmatic', level: 1, durationSec: 240, cycles: 8, mood: 'relaxed', ts: isoDaysAgo(1, 18) }
      ],
      streak: 3,
      lastDate: isoDaysAgo(1).slice(0, 10),
      totalSeconds: 720,
      level: 1
    }));
    safeSet(local, buildScopeKey(accId, 'mem_demo_father', 'rx_vault'), JSON.stringify([
      {
        id: 'rx_f1',
        doctor: 'Dr. Shafiqur Rahman',
        specialty: 'Internal Medicine & Cardiology',
        hospital: 'United Heart Care',
        date: isoDaysAgo(25).slice(0, 10),
        refillDate: isoDaysAhead(4),
        diagnosis: 'Essential Hypertension (Stage 1) & T2DM',
        medications: ['Losartan 50mg (1+0+0)', 'Metformin SR 500mg (0+0+1)'],
        notes: 'Low salt diet, daily 25 min morning walk.',
        imageDataUrl: '',
        source: 'manual',
        createdAt: isoDaysAgo(25)
      }
    ]));
    safeSet(local, buildScopeKey(accId, 'mem_demo_father', 'rx_pad'), JSON.stringify([]));

    /* --- 3. Nasrin Akter (Mother): Prediabetes & Evening Relax --- */
    safeSet(local, buildScopeKey(accId, 'mem_demo_mother', 'vitals'), JSON.stringify({
      bp: [
        { id: 'bp_m1', sys: 124, dia: 78, pulse: 72, arm: 'left', ts: isoDaysAgo(1, 9), note: 'Normal morning check' }
      ],
      glucose: [
        { id: 'gl_m1', valueMgdl: 108, context: 'fasting', ts: isoDaysAgo(0, 7), note: 'Prediabetes border check' },
        { id: 'gl_m2', valueMgdl: 146, context: 'postmeal', ts: isoDaysAgo(2, 14), note: 'After afternoon snack' }
      ]
    }));
    safeSet(local, buildScopeKey(accId, 'mem_demo_mother', 'breath_tests'), JSON.stringify([
      { id: 'bt_m1', type: 'bolt', score: 21, bpm: 13, ts: isoDaysAgo(0, 19), note: 'Steady breathing' }
    ]));
    safeSet(local, buildScopeKey(accId, 'mem_demo_mother', 'exercises'), JSON.stringify({
      sessions: [
        { id: 'ex_m1', protocol: '478', level: 1, durationSec: 300, cycles: 9, mood: 'peaceful', ts: isoDaysAgo(0, 21) }
      ],
      streak: 4,
      lastDate: new Date().toISOString().slice(0, 10),
      totalSeconds: 1200,
      level: 1
    }));
    safeSet(local, buildScopeKey(accId, 'mem_demo_mother', 'rx_vault'), JSON.stringify([]));
    safeSet(local, buildScopeKey(accId, 'mem_demo_mother', 'rx_pad'), JSON.stringify([]));

    /* --- 4. Ayaan Hossain (Child): Youth Diaphragmatic Coherence --- */
    safeSet(local, buildScopeKey(accId, 'mem_demo_child', 'vitals'), JSON.stringify({ bp: [], glucose: [] }));
    safeSet(local, buildScopeKey(accId, 'mem_demo_child', 'breath_tests'), JSON.stringify([
      { id: 'bt_c1', type: 'bolt', score: 18, bpm: 16, ts: isoDaysAgo(2, 16), note: 'After school calm test' }
    ]));
    safeSet(local, buildScopeKey(accId, 'mem_demo_child', 'exercises'), JSON.stringify({
      sessions: [
        { id: 'ex_c1', protocol: 'pranayama', level: 1, durationSec: 180, cycles: 7, mood: 'happy', ts: isoDaysAgo(1, 17) }
      ],
      streak: 2,
      lastDate: isoDaysAgo(1).slice(0, 10),
      totalSeconds: 540,
      level: 1
    }));
    safeSet(local, buildScopeKey(accId, 'mem_demo_child', 'rx_vault'), JSON.stringify([]));
    safeSet(local, buildScopeKey(accId, 'mem_demo_child', 'rx_pad'), JSON.stringify([]));
  }

  /* --------------------------------------------------------------------------
     6. MULTI-MEMBER CRUD, SWITCHING & SECURITY PIN
     -------------------------------------------------------------------------- */
  function mutateAccount(mutatorFn) {
    var acc = getActiveAccount();
    if (!acc) return { ok: false, error: 'not_authenticated' };
    var accounts = readAccounts();
    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].id === acc.id) {
        var result = mutatorFn(accounts[i]);
        writeAccounts(accounts);
        return result || { ok: true, account: accounts[i] };
      }
    }
    return { ok: false, error: 'account_missing' };
  }

  function switchMember(memberId) {
    return mutateAccount(function (acc) {
      var found = null;
      for (var i = 0; i < acc.members.length; i++) {
        if (acc.members[i].id === memberId) {
          found = acc.members[i];
          break;
        }
      }
      if (!found) return { ok: false, error: 'member_not_found' };
      acc.activeMemberId = found.id;
      setTimeout(function () {
        emitChange('bwMemberChanged', { account: acc, member: found });
      }, 0);
      return { ok: true, member: found };
    });
  }

  function addMember(memberInput) {
    var name = String((memberInput && memberInput.name) || '').trim();
    if (!name) return { ok: false, error: 'name_required' };
    return mutateAccount(function (acc) {
      var newMember = {
        id: createId('mem'),
        name: name,
        relation: (memberInput && memberInput.relation) || 'other',
        age: Number((memberInput && memberInput.age) || 0) || '',
        gender: (memberInput && memberInput.gender) || 'other',
        bloodGroup: (memberInput && memberInput.bloodGroup) || 'O+',
        phone: String((memberInput && memberInput.phone) || ''),
        allergies: String((memberInput && memberInput.allergies) || ''),
        conditions: String((memberInput && memberInput.conditions) || ''),
        notes: String((memberInput && memberInput.notes) || ''),
        avatarColor: AVATAR_PALETTE[acc.members.length % AVATAR_PALETTE.length],
        avatarInitials: computeInitials(name),
        isPrimary: false,
        createdAt: new Date().toISOString()
      };
      acc.members.push(newMember);
      if (memberInput && memberInput.switchAfterAdd) {
        acc.activeMemberId = newMember.id;
      }
      setTimeout(function () {
        emitChange('bwMemberChanged', { account: acc, member: getActiveMember() });
      }, 0);
      return { ok: true, member: newMember };
    });
  }

  function updateMember(memberId, patch) {
    return mutateAccount(function (acc) {
      for (var i = 0; i < acc.members.length; i++) {
        if (acc.members[i].id === memberId) {
          var m = acc.members[i];
          if (patch.name && String(patch.name).trim()) {
            m.name = String(patch.name).trim();
            m.avatarInitials = computeInitials(m.name);
          }
          ['relation', 'age', 'gender', 'bloodGroup', 'phone', 'allergies', 'conditions', 'notes'].forEach(function (field) {
            if (patch[field] !== undefined) m[field] = patch[field];
          });
          setTimeout(function () {
            emitChange('bwMemberChanged', { account: acc, member: getActiveMember() });
          }, 0);
          return { ok: true, member: m };
        }
      }
      return { ok: false, error: 'member_not_found' };
    });
  }

  function deleteMember(memberId) {
    return mutateAccount(function (acc) {
      if (acc.members.length <= 1) {
        return { ok: false, error: 'cannot_delete_last_member' };
      }
      var idx = -1;
      for (var i = 0; i < acc.members.length; i++) {
        if (acc.members[i].id === memberId) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return { ok: false, error: 'member_not_found' };
      if (acc.members[idx].isPrimary) return { ok: false, error: 'cannot_delete_primary' };

      acc.members.splice(idx, 1);
      if (acc.activeMemberId === memberId) {
        acc.activeMemberId = acc.members[0].id;
      }
      var local = getLocal();
      DOMAINS.forEach(function (dom) {
        safeRemove(local, buildScopeKey(acc.id, memberId, dom));
      });
      setTimeout(function () {
        emitChange('bwMemberChanged', { account: acc, member: getActiveMember() });
      }, 0);
      return { ok: true };
    });
  }

  function setPin(pin4) {
    if (!/^\d{4}$/.test(String(pin4 || ''))) {
      return { ok: false, error: 'pin_must_be_4_digits' };
    }
    return mutateAccount(function (acc) {
      var salt = generateSalt();
      acc.pinSalt = salt;
      acc.pinHash = hashSecret(String(pin4), salt);
      acc.pinEnabled = true;
      return { ok: true };
    });
  }

  function verifyPin(pin4) {
    var acc = getActiveAccount();
    if (!acc || !acc.pinEnabled) return true;
    return hashSecret(String(pin4 || ''), acc.pinSalt) === acc.pinHash;
  }

  function clearPin() {
    return mutateAccount(function (acc) {
      acc.pinEnabled = false;
      acc.pinSalt = '';
      acc.pinHash = '';
      return { ok: true };
    });
  }

  /* --------------------------------------------------------------------------
     7. AGGREGATION, BACKUP EXPORT / IMPORT & FACTORY RESET
     -------------------------------------------------------------------------- */
  function getMemberSummary(memberId) {
    var targetId = memberId || getActiveMember().id;
    var vitals = getDomainData('vitals', targetId);
    var tests = getDomainData('breath_tests', targetId);
    var ex = getDomainData('exercises', targetId);
    var rxVault = getDomainData('rx_vault', targetId);
    var rxPad = getDomainData('rx_pad', targetId);

    return {
      bpCount: (vitals.bp || []).length,
      glucoseCount: (vitals.glucose || []).length,
      testCount: (tests || []).length,
      sessionCount: (ex.sessions || []).length,
      streak: ex.streak || 0,
      totalMinutes: Math.round((ex.totalSeconds || 0) / 60),
      rxVaultCount: (rxVault || []).length,
      rxPadCount: (rxPad || []).length,
      latestBp: Array.isArray(vitals.bp) && vitals.bp.length ? vitals.bp[0] : null,
      latestGlucose: Array.isArray(vitals.glucose) && vitals.glucose.length ? vitals.glucose[0] : null,
      latestBolt: Array.isArray(tests) && tests.length ? tests[0] : null
    };
  }

  function exportAccountBackup() {
    var acc = getActiveAccount();
    if (!acc) return null;
    var dataMap = {};
    acc.members.forEach(function (m) {
      dataMap[m.id] = {};
      DOMAINS.forEach(function (dom) {
        dataMap[m.id][dom] = getDomainData(dom, m.id);
      });
    });
    return {
      app: 'BreatheWell-MultiMember',
      version: 1,
      exportedAt: new Date().toISOString(),
      account: {
        email: acc.email,
        ownerName: acc.ownerName,
        activeMemberId: acc.activeMemberId,
        members: acc.members
      },
      memberData: dataMap
    };
  }

  function importAccountBackup(bundle) {
    if (!bundle || bundle.app !== 'BreatheWell-MultiMember' || !bundle.account || !bundle.memberData) {
      return { ok: false, error: 'invalid_backup_format' };
    }
    var acc = getActiveAccount();
    if (!acc) return { ok: false, error: 'not_authenticated' };

    return mutateAccount(function (targetAcc) {
      if (Array.isArray(bundle.account.members) && bundle.account.members.length > 0) {
        targetAcc.members = bundle.account.members;
        targetAcc.activeMemberId = bundle.account.activeMemberId || targetAcc.members[0].id;
      }
      var local = getLocal();
      targetAcc.members.forEach(function (m) {
        var incoming = bundle.memberData[m.id] || {};
        DOMAINS.forEach(function (dom) {
          if (incoming[dom] !== undefined) {
            safeSet(local, buildScopeKey(targetAcc.id, m.id, dom), JSON.stringify(incoming[dom]));
          }
        });
      });
      setTimeout(function () {
        emitChange('bwMemberChanged', { account: targetAcc, member: getActiveMember() });
      }, 0);
      return { ok: true };
    });
  }

  function resetMemberDomains(memberId) {
    var acc = getActiveAccount();
    var targetId = memberId || getActiveMember().id;
    DOMAINS.forEach(function (dom) {
      setDomainData(dom, cloneDefault(dom), targetId);
    });
    emitChange('bwMemberChanged', { account: acc, member: getActiveMember() });
  }

  /* --------------------------------------------------------------------------
     PUBLIC API
     -------------------------------------------------------------------------- */
  global.BWStore = {
    DOMAINS: DOMAINS,
    sha256: sha256Sync,
    isAuthenticated: isAuthenticated,
    getActiveAccount: getActiveAccount,
    getActiveMember: getActiveMember,
    getMembers: getMembers,
    registerAccount: registerAccount,
    login: login,
    loginDemoFamily: loginDemoFamily,
    logout: logout,
    switchMember: switchMember,
    addMember: addMember,
    updateMember: updateMember,
    deleteMember: deleteMember,
    setPin: setPin,
    verifyPin: verifyPin,
    clearPin: clearPin,
    getDomainData: getDomainData,
    setDomainData: setDomainData,
    getMemberSummary: getMemberSummary,
    exportAccountBackup: exportAccountBackup,
    importAccountBackup: importAccountBackup,
    resetMemberDomains: resetMemberDomains
  };
})(typeof window !== 'undefined' ? window : globalThis);
