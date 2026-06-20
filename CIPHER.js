/* ═══════════════════════════════════════════
   SIGNAL CHAT — JS
   ═══════════════════════════════════════════ */
'use strict';

var fieldData = {};
var msgCount  = 0;

var BOTS    = ['streamelements','nightbot','moobot','fossabot','streamlabs','wizebot','commanderroot','botrixoficial'];
var PALETTE = ['#ff6b6b','#ff9f43','#ffd32a','#0be881','#00d2d3','#54a0ff','#c56cf0','#fd79a8','#26de81','#4ecdc4','#a29bfe','#ee5a24'];
var colorCache = {};

var list = document.getElementById('chat-list');
var wrap = document.getElementById('chat-wrap');

function fd(k) { return fieldData[k]; }

function now() {
  var d = new Date();
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

function userColor(name, raw) {
  if (raw && raw !== '' && raw !== '#000000' && raw !== '#000') return raw;
  if (!colorCache[name]) {
    var sum = 0;
    for (var i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    colorCache[name] = PALETTE[sum % PALETTE.length];
  }
  return colorCache[name];
}

function safeText(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/@(\w+)/g,'<span class="mention">@$1</span>');
}

function hexToRgb(hex) {
  if (!hex || hex.length < 7) return '6,4,16';
  return parseInt(hex.slice(1,3),16) + ',' + parseInt(hex.slice(3,5),16) + ',' + parseInt(hex.slice(5,7),16);
}

// ── Thème ────────────────────────────────────
function applyTheme() {
  var R = document.documentElement;
  R.style.setProperty('--width',      (fd('chatWidth')        || 400) + 'px');
  R.style.setProperty('--font-size',  (fd('fontSize')         || 14)  + 'px');
  R.style.setProperty('--uname-size', (fd('usernameFontSize') || 12)  + 'px');
  R.style.setProperty('--spacing',    (fd('msgSpacing')       || 7)   + 'px');
  R.style.setProperty('--anim-in',    (fd('animIn')           || 380) + 'ms');
  R.style.setProperty('--radius',     (fd('radius')           || 4)   + 'px');
  R.style.setProperty('--text',        fd('textColor')        || '#c0bcd8');

  var bgOp = (parseInt(fd('cardOpacity')) || 92) / 100;
  R.style.setProperty('--card-bg', 'rgba(' + hexToRgb(fd('cardColor') || '#06040f') + ',' + bgOp + ')');

  var side = fd('chatSide') || 'left';
  document.body.classList.toggle('chat-right', side === 'right');

  var font = fd('fontName') || 'Inter';
  var link = document.getElementById('dyn-font');
  if (!link) {
    link = document.createElement('link');
    link.id  = 'dyn-font';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = 'https://fonts.googleapis.com/css2?family=' + font.replace(/ /g,'+') + ':wght@400;500;600;700&display=swap';
}

// ── Mention flash ────────────────────────────
function checkMention(text) {
  var raw = fd('mentionAliases') || 'DoktorP3st,Paglorieux';
  var aliases = raw.split(',').map(function(s){ return s.trim().toLowerCase(); }).filter(Boolean);
  var lower = String(text).toLowerCase();
  if (!aliases.some(function(a){ return lower.indexOf(a) !== -1; })) return;
  wrap.classList.remove('mention-flash');
  void wrap.offsetWidth;
  wrap.classList.add('mention-flash');
  setTimeout(function(){ wrap.classList.remove('mention-flash'); }, 700);
}

// ── Ajout message ────────────────────────────
function addMessage(data) {
  if (!data) return;
  if (fd('hideCommands') && String(data.text || '').charAt(0) === '!') return;
  var lname = String(data.displayName || '').toLowerCase();
  if (fd('hideBots') && BOTS.indexOf(lname) !== -1) return;
  if (String(data.text || '').trim().length < (parseInt(fd('minLen')) || 1)) return;

  var uc = userColor(data.displayName || 'anon', data.displayColor || '');

  var li = document.createElement('li');
  li.className   = 'chat-msg';
  li.dataset.id  = 'msg-' + (++msgCount);
  li.dataset.uid = lname;
  li.dataset.mid = data.msgId || '';
  li.style.setProperty('--uc', uc);

  // Hiérarchie badge — override --uc via style inline (les !important ne marchent pas sur custom props)
  var badges = data.badges || [];
  var bt = badges.map(function(b){ return String(b.type || b.t || '').toLowerCase(); });
  if (bt.indexOf('broadcaster') !== -1) { li.classList.add('is-broadcaster'); li.style.setProperty('--uc','#ff3838'); }
  else if (bt.indexOf('moderator') !== -1) { li.classList.add('is-mod'); li.style.setProperty('--uc','#0be8a8'); }
  else if (bt.indexOf('vip')       !== -1) { li.classList.add('is-vip'); li.style.setProperty('--uc','#ee5a24'); }
  else if (bt.indexOf('subscriber')!== -1) { li.classList.add('is-sub'); }

  li.innerHTML =
    '<div class="msg-inner">' +
      '<div class="corner tl"></div><div class="corner tr"></div>' +
      '<div class="corner bl"></div><div class="corner br"></div>' +
      '<div class="scan-line"></div>' +
      '<div class="msg-header">' +
        '<div class="sig-bars"><span></span><span></span><span></span></div>' +
        '<span class="msg-badges"></span>' +
        '<span class="msg-username"></span>' +
        '<span class="msg-timestamp"></span>' +
      '</div>' +
      '<div class="msg-sep"></div>' +
      '<div class="msg-body"></div>' +
    '</div>';

  li.querySelector('.msg-username').textContent = data.displayName || 'Anonyme';

  var tsEl = li.querySelector('.msg-timestamp');
  if (fd('showTimestamp')) { tsEl.textContent = now(); } else { tsEl.style.display = 'none'; }

  var bdgEl = li.querySelector('.msg-badges');
  if (fd('showBadges') !== false && Array.isArray(data.badges)) {
    data.badges.forEach(function(b) {
      if (b.url) { var img = document.createElement('img'); img.src = b.url; img.alt = b.type || ''; bdgEl.appendChild(img); }
    });
  }

  li.querySelector('.msg-body').innerHTML = data.renderedText || safeText(data.text || '');

  list.appendChild(li);

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      li.classList.add('visible');
    });
  });

  // Retire la scanline après animation
  setTimeout(function() { var sl = li.querySelector('.scan-line'); if (sl) sl.remove(); }, 600);

  // Max messages
  var max = parseInt(fd('maxMessages')) || 8;
  var all = list.querySelectorAll('.chat-msg');
  if (all.length > max) removeMsg(all[0]);

  // Durée de vie
  var life = parseInt(fd('lifetime')) || 0;
  if (life > 0) setTimeout(function(){ removeMsg(li); }, life * 1000);

  checkMention(data.text || '');
}

// ── Suppression message ──────────────────────
function removeMsg(el) {
  if (!el || el.classList.contains('leaving')) return;
  el.classList.add('leaving');
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 500);
}

// ══ STREAMELEMENTS EVENTS ══════════════════════

var TEST_USERS = [
  { name: 'DoktorP3st',   color: '#c56cf0' },
  { name: 'SoldatAlpha',  color: '#54a0ff' },
  { name: 'NightRaven_',  color: '#ff6b6b' },
  { name: 'XxShadow99',   color: '#ffd32a' },
  { name: 'CryptoMike42', color: '#0be881' },
];
var TEST_MSGS = [
  'PogChamp le skill !!', 'GG ez clap', 'LUL LUL LUL', "T'es un dieu !",
  "C'est quoi ce jeu ?", 'Clip ca vite !', 'Bonsoir tout le monde !',
  "Let's go !!", 'OMEGALUL', 'La musique est feu',
];

window.addEventListener('onWidgetLoad', function(obj) {
  fieldData = (obj && obj.detail && obj.detail.fieldData) ? obj.detail.fieldData : {};
  applyTheme();
});

window.addEventListener('onEventReceived', function(obj) {
  if (!obj || !obj.detail) return;
  var listener = obj.detail.listener;
  var event    = obj.detail.event;
  if (!event) return;

  if (listener === 'message') {
    if (event.data) addMessage(event.data);
    return;
  }
  if (listener === 'delete-message') {
    var el = list.querySelector('[data-mid="' + event.msgId + '"]');
    if (el) removeMsg(el);
    return;
  }
  if (listener === 'delete-messages') {
    var uid = String(event.userId || event.username || '').toLowerCase();
    var items = list.querySelectorAll('.chat-msg');
    for (var i = 0; i < items.length; i++) {
      if (items[i].dataset.uid === uid) removeMsg(items[i]);
    }
  }
});

window.addEventListener('onFieldChange', function(obj) {
  if (!obj || !obj.detail) return;
  // SE peut envoyer 'fieldName' ou 'name' selon la version
  var fieldName = obj.detail.fieldName || obj.detail.name || '';
  var value     = obj.detail.value;

  // Vérifie par clé OU par valeur (compatibilité SE)
  if (fieldName === 'testMsg' || value === 'sendTestMsg') {
    sendTestMsg();
    return;
  }
  if (fieldName === 'testClear' || value === 'clearAllMsgs') {
    clearAllMsgs();
    return;
  }

  if (fieldName) fieldData[fieldName] = value;
  applyTheme();
});

// Exposées globalement — appelables aussi depuis la console SE si besoin
function sendTestMsg() {
  var u = TEST_USERS[Math.floor(Math.random() * TEST_USERS.length)];
  var t = TEST_MSGS[Math.floor(Math.random() * TEST_MSGS.length)];
  addMessage({ displayName: u.name, displayColor: u.color, text: t, badges: [], msgId: 'test-' + Date.now() });
}
function clearAllMsgs() {
  var all = list.querySelectorAll('.chat-msg');
  for (var i = 0; i < all.length; i++) removeMsg(all[i]);
}
window.sendTestMsg  = sendTestMsg;
window.clearAllMsgs = clearAllMsgs;
