'use strict';
/* =========================================================================
   iOS 26 "Liquid Glass" Messenger — application logic
   ========================================================================= */

/* ---------------------------------------------------------------------- */
/* ICONS                                                                    */
/* ---------------------------------------------------------------------- */
const SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
const ICONS = {
  chevronLeft:  SVG_OPEN + '<path d="M15 6l-6 6 6 6"/></svg>',
  chevronRight: SVG_OPEN + '<path d="M9 6l6 6-6 6"/></svg>',
  plus:         SVG_OPEN + '<path d="M12 5v14M5 12h14"/></svg>',
  search:       SVG_OPEN + '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/></svg>',
  xmarkCircle:  SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4"/></svg>',
  mic:          SVG_OPEN + '<path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/><path d="M6 11v1a6 6 0 0 0 12 0v-1"/><path d="M12 18v3"/><path d="M9 21h6"/></svg>',
  camera:       SVG_OPEN + '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9z"/><circle cx="12" cy="13" r="3.4"/></svg>',
  paperclip:    SVG_OPEN + '<path d="M8 12.5l6.5-6.5a3.2 3.2 0 0 1 4.5 4.5l-8 8a5 5 0 0 1-7-7l7.5-7.5"/></svg>',
  arrowUp:      SVG_OPEN + '<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg>',
  bell:         SVG_OPEN + '<path d="M6 10a6 6 0 0 1 12 0v4l1.5 3h-15L6 14v-4z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
  bellSlash:    SVG_OPEN + '<path d="M6 10a6 6 0 0 1 9.8-4.6M18 10v4l1.5 3h-15L6 14v-1.5"/><path d="M10 20a2 2 0 0 0 4 0"/><path d="M3 3l18 18"/></svg>',
  phone:        SVG_OPEN + '<path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 2.3c0-.5.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"/></svg>',
  video:        SVG_OPEN + '<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 10.5l6-3.5v10l-6-3.5z"/></svg>',
  pin:          SVG_OPEN + '<rect x="8" y="3.5" width="8" height="5" rx="2"/><path d="M9 8.5l3 5 3-5"/><path d="M12 13.5V20.5"/></svg>',
  archive:      SVG_OPEN + '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"/><path d="M10 12h4"/></svg>',
  trash:        SVG_OPEN + '<path d="M4 7h16"/><path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/><path d="M10 11v6M14 11v6"/></svg>',
  personPlus:   SVG_OPEN + '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M18 8v6M15 11h6"/></svg>',
  megaphone:    SVG_OPEN + '<path d="M3 10v4a1 1 0 0 0 1 1h2l7 4V5L6 9H4a1 1 0 0 0-1 1z"/><path d="M17 9a4 4 0 0 1 0 6"/></svg>',
  people:       SVG_OPEN + '<circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9" r="2.5"/><path d="M2.5 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M14.5 14.2c2.6.3 4.5 2.4 4.5 5.3"/></svg>',
  pencil:       SVG_OPEN + '<path d="M4 16.5V20h3.5L18 9.5l-3.5-3.5L4 16.5z"/><path d="M14.5 6l3.5 3.5"/></svg>',
  photo:        SVG_OPEN + '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.8"/><path d="M21 16l-5.5-5.5-4 4L9 12l-6 6"/></svg>',
  palette:      SVG_OPEN + '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-7.7-9-7.7z"/><circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7.8" r="1" fill="currentColor" stroke="none"/><circle cx="17" cy="11" r="1" fill="currentColor" stroke="none"/></svg>',
  globe:        SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.8 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.8-3.8-9S9.5 5.5 12 3z"/></svg>',
  question:     SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.2 1-1.2 2"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>',
  info:         SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/></svg>',
  lock:         SVG_OPEN + '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  laptop:       SVG_OPEN + '<rect x="4" y="5" width="16" height="10" rx="1.5"/><path d="M2 19h20"/></svg>',
  tray:         SVG_OPEN + '<path d="M4 13V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7"/><path d="M4 13l2.5 5h11L20 13"/><path d="M4 13h4.5l1 2h5l1-2H20"/></svg>',
  play:         SVG_OPEN + '<path d="M8 5l11 7-11 7V5z" fill="currentColor" stroke="none"/></svg>',
  share:        SVG_OPEN + '<path d="M12 15V4"/><path d="M8 8l4-4 4 4"/><path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/></svg>',
  checkmark:    SVG_OPEN + '<path d="M4 12l5 5L20 6"/></svg>',
  music:        SVG_OPEN + '<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>',
  stack:        SVG_OPEN + '<rect x="4" y="4" width="16" height="4" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/></svg>',
  bubble:       SVG_OPEN + '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4v-4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>',
  reply:        SVG_OPEN + '<path d="M10 6l-6 6 6 6"/><path d="M4 12h9a5 5 0 0 0 5-5V5"/></svg>',
  copy:         SVG_OPEN + '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>'
};

function mountIcons(root) {
  (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
    var name = el.getAttribute('data-icon');
    if (ICONS[name]) el.innerHTML = ICONS[name];
  });
}

/* ---------------------------------------------------------------------- */
/* UTILITIES                                                                */
/* ---------------------------------------------------------------------- */
function qs(sel, root) { return (root || document).querySelector(sel); }
function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function formatDuration(sec) {
  sec = Math.max(0, Math.round(sec));
  var m = Math.floor(sec / 60), s = sec % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}
function initialsOf(name) {
  var parts = name.trim().split(/\s+/).filter(Boolean);
  var letters = parts.slice(0, 2).map(function (w) { return w[0]; });
  return letters.join('').toUpperCase();
}
function addPressFeedback(el, cls) {
  cls = cls || 'pressed';
  var active = false;
  var down = function () { active = true; el.classList.add(cls); };
  var up = function () { if (active) { active = false; el.classList.remove(cls); } };
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointerleave', up);
  el.addEventListener('pointercancel', up);
}

/* ---------------------------------------------------------------------- */
/* TIME HELPERS                                                             */
/* ---------------------------------------------------------------------- */
const NOW = Date.now();
const MIN = 60 * 1000, HOUR = 60 * MIN, DAY = 24 * HOUR;
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function startOfDay(ts) {
  var d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function dayDiff(ts) {
  return Math.round((startOfDay(NOW) - startOfDay(ts)) / DAY);
}
function clockTime(ts) {
  var d = new Date(ts);
  var h = d.getHours(), m = d.getMinutes();
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}
function listTimeLabel(ts) {
  var diff = dayDiff(ts);
  if (diff <= 0) return clockTime(ts);
  if (diff === 1) return 'Вчера';
  if (diff < 7) return WEEKDAYS[new Date(ts).getDay()];
  var d = new Date(ts);
  var cur = new Date(NOW).getFullYear() !== d.getFullYear() ? '.' + String(d.getFullYear()).slice(2) : '';
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + cur;
}
function dividerLabel(ts) {
  var diff = dayDiff(ts);
  if (diff <= 0) return 'Сегодня';
  if (diff === 1) return 'Вчера';
  var d = new Date(ts);
  if (diff < 7) return WEEKDAYS[d.getDay()].replace(/^./, function (c) { return c.toUpperCase(); });
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + (new Date(NOW).getFullYear() !== d.getFullYear() ? ' ' + d.getFullYear() : '');
}

/* ---------------------------------------------------------------------- */
/* DATA                                                                      */
/* ---------------------------------------------------------------------- */
const AVATAR_PALETTES = [
  ['#0A84FF', '#5E5CE6'],
  ['#FF9F0A', '#FF375F'],
  ['#30D158', '#0AC8B9'],
  ['#BF5AF2', '#FF375F'],
  ['#64D2FF', '#0A84FF'],
  ['#FFD60A', '#FF9F0A'],
  ['#FF6961', '#FF453A'],
  ['#5E5CE6', '#BF5AF2'],
  ['#34D7C6', '#0AA89B'],
  ['#FF9F0A', '#FFD60A'],
  ['#7D7AFF', '#5E5CE6']
];

const currentUser = {
  id: 'me',
  name: 'Александр Волков',
  tag: '@alex.volkov',
  phone: '+7 999 123-45-67',
  birthday: '14 марта 2000',
  bio: 'Дизайнер интерфейсов. Люблю минимализм и хороший кофе.',
  palette: AVATAR_PALETTES[0],
  track: { title: 'Вечерний бриз', artist: 'Тихий берег' }
};
currentUser.initials = initialsOf(currentUser.name);

/* Each chat seed: relative "ago" values (minutes) are used to build a
   believable, always-fresh timeline regardless of when the app is opened. */
const CHAT_SEED = [
  {
    name: 'Мария Соколова', tag: '@maria.s', phone: '+7 916 220-14-02',
    birthday: '2 июля 1999', bio: 'Люблю горы, кофе и долгие прогулки по вечернему городу.',
    online: true, muted: false, pinned: true, unread: 2,
    track: { title: 'Синий час', artist: 'Кофе и дождь' },
    messages: [
      { from: 'them', type: 'text', text: 'Привет! Как добрались вчера?', ago: 260 },
      { from: 'me', type: 'text', text: 'Привет 🙂 Отлично, только поздно совсем добрались', ago: 255 },
      { from: 'them', type: 'photo', ago: 200 },
      { from: 'them', type: 'text', text: 'Вот вид с той смотровой, о которой рассказывала', ago: 199 },
      { from: 'me', type: 'text', text: 'Красота! Надо будет съездить в следующий раз', ago: 190, status: 'read' },
      { from: 'them', type: 'voice', duration: 14, ago: 40 },
      { from: 'them', type: 'text', text: 'Отправила голосовое сообщение', ago: 39, hidden: true },
      { from: 'them', type: 'text', text: 'Слушай, ты завтра свободна?', ago: 8, replyTo: { name: 'Александр', text: 'Красота! Надо будет съездить в следующий раз' } },
      { from: 'them', type: 'text', text: 'Хотела предложить сходить на выставку', ago: 6 }
    ]
  },
  {
    name: 'Дмитрий Волков', tag: '@dmitry.v', phone: '+7 903 555-91-77',
    birthday: '19 декабря 1996', bio: 'Backend-разработчик. Кофе, код, велосипед.',
    online: false, lastSeenAgo: 340, muted: true, pinned: false, unread: 0,
    track: { title: 'Городской шум', artist: 'Ночной маршрут' },
    messages: [
      { from: 'me', type: 'text', text: 'Смотрел новый релиз API?', ago: 1500 },
      { from: 'them', type: 'text', text: 'Да, вечером гляну доку подробнее', ago: 1470 },
      { from: 'them', type: 'text', text: 'Кстати, там переехали лимиты запросов, надо будет поправить ретраи на нашей стороне, иначе продакшн начнёт сыпать ошибками в пиковые часы', ago: 500, status: 'delivered' }
    ]
  },
  {
    name: 'Анна Петрова', tag: '@anna.p', phone: '+7 926 118-40-33',
    birthday: '30 января 2001', bio: 'Фотограф. Снимаю плёнку и людей.',
    online: false, lastSeenAgo: 300, muted: false, pinned: false, unread: 0,
    track: null,
    messages: [
      { from: 'them', type: 'text', text: 'Скинь плейлист, который вчера включала', ago: 620 },
      { from: 'me', type: 'text', text: 'Ща найду, погоди', ago: 615 },
      { from: 'me', type: 'video', duration: 8, ago: 305, status: 'read' }
    ]
  },
  {
    name: 'Иван Кузнецов', tag: '@ivan.kz', phone: '+7 917 340-25-19',
    birthday: '11 сентября 1998', bio: 'QA-инженер. Найду баг там, где его не ждут.',
    online: true, muted: false, pinned: false, unread: 1,
    track: null,
    messages: [
      { from: 'them', type: 'text', text: 'Билд собрался, гоняю регресс', ago: 90 },
      { from: 'them', type: 'text', text: 'Нашёл баг на экране оплаты, заведу тикет', ago: 20 }
    ]
  },
  {
    name: 'Дизайн-команда', tag: '@design.team', phone: '—',
    birthday: '—', bio: 'Общий чат дизайн-отдела.',
    online: false, muted: false, pinned: false, unread: 5,
    track: null,
    messages: [
      { from: 'them', type: 'text', text: 'Выложила новые макеты онбординга в Figma', ago: 3200 },
      { from: 'them', type: 'text', text: 'Гляньте, пожалуйста, до вечера пятницы', ago: 3100 },
      { from: 'them', type: 'text', text: 'Обновила цветовые токены под тёмную тему', ago: 2900 }
    ]
  },
  {
    name: 'Ольга Смирнова', tag: '@olga.s', phone: '+7 963 271-08-56',
    birthday: '5 мая 1997', bio: 'Копирайтер. Слова — моя работа и моё хобби.',
    online: false, lastSeenAgo: 4200, muted: false, pinned: false, unread: 0,
    track: { title: 'Медленный вальс', artist: 'Бумажный самолёт' },
    messages: [
      { from: 'me', type: 'text', text: 'Как продвигается текст для лендинга?', ago: 1600 },
      { from: 'them', type: 'text', text: 'Почти готов, пришлю сегодня вечером', ago: 1580 },
      { from: 'them', type: 'photo', ago: 1440 }
    ]
  },
  {
    name: 'Сергей Никитин', tag: '@sergey.n', phone: '+7 985 402-77-11',
    birthday: '23 августа 1995', bio: 'Продакт-менеджер.',
    online: false, lastSeenAgo: 6000, muted: true, pinned: false, unread: 0,
    track: null,
    messages: [
      { from: 'them', type: 'text', text: 'Созвон переносим на 15:00', ago: 4400 },
      { from: 'me', type: 'text', text: 'Хорошо, буду', ago: 4395, status: 'read' }
    ]
  },
  {
    name: 'Екатерина Волкова', tag: '@kate.v', phone: '+7 925 611-93-84',
    birthday: '17 февраля 2000', bio: 'Иллюстратор. Рисую котиков и интерфейсы.',
    online: true, muted: false, pinned: true, unread: 0,
    track: { title: 'Летние вспышки', artist: 'Розовый закат' },
    messages: [
      { from: 'them', type: 'text', text: 'С днём рождения! 🎉', ago: 130 },
      { from: 'me', type: 'text', text: 'Спасибо большое! ❤️', ago: 128, status: 'read' },
      { from: 'them', type: 'text', text: 'Заходи вечером, если будет настроение', ago: 60 }
    ]
  },
  {
    name: 'Павел Орлов', tag: '@pavel.o', phone: '+7 909 774-32-08',
    birthday: '9 июня 1994', bio: 'Ведёт вело-путешествия.',
    online: false, lastSeenAgo: 900, muted: false, pinned: false, unread: 3,
    track: null,
    messages: [
      { from: 'them', type: 'voice', duration: 22, ago: 50 },
      { from: 'them', type: 'text', text: 'Отправил голосовое сообщение', ago: 49, hidden: true }
    ]
  },
  {
    name: 'Наталья Ким', tag: '@natalie.k', phone: '+7 968 500-19-45',
    birthday: '28 октября 1999', bio: 'HR-менеджер.',
    online: false, lastSeenAgo: 15000, muted: false, pinned: false, unread: 0,
    track: null,
    messages: [
      { from: 'them', type: 'text', text: 'Собеседование подтвердили на вторник', ago: 11000 },
      { from: 'me', type: 'text', text: 'Отлично, спасибо!', ago: 10990, status: 'read' }
    ]
  },
  {
    name: 'Максим Беляев', tag: '@max.b', phone: '+7 977 230-66-91',
    birthday: '3 апреля 2002', bio: 'Фронтенд-разработчик.',
    online: true, muted: false, pinned: false, unread: 0,
    track: null,
    messages: [
      { from: 'them', type: 'text', text: 'Запушил фикс анимации в ветку', ago: 700 },
      { from: 'me', type: 'text', text: 'Гляну после обеда', ago: 690, status: 'delivered' }
    ]
  }
];

function buildChat(seed, idx) {
  var palette = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
  var messages = seed.messages
    .filter(function (m) { return !m.hidden; })
    .map(function (m, i) {
      return {
        id: 'm' + idx + '-' + i,
        from: m.from,
        type: m.type,
        text: m.text || '',
        duration: m.duration || 0,
        ts: NOW - m.ago * MIN,
        replyTo: m.replyTo || null,
        status: m.status || null
      };
    });
  var last = messages[messages.length - 1];
  return {
    id: idx + 1,
    name: seed.name,
    tag: seed.tag,
    phone: seed.phone,
    birthday: seed.birthday,
    bio: seed.bio,
    initials: initialsOf(seed.name),
    palette: palette,
    online: !!seed.online,
    lastSeenTs: seed.lastSeenAgo ? NOW - seed.lastSeenAgo * MIN : null,
    muted: !!seed.muted,
    pinned: !!seed.pinned,
    unread: seed.unread || 0,
    track: seed.track,
    messages: messages,
    lastTs: last ? last.ts : NOW,
    typing: false,
    archived: false,
    pinnedMessageId: null
  };
}

let chats = CHAT_SEED.map(buildChat);

/* ---------------------------------------------------------------------- */
/* STATE                                                                     */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* THEME + ACCENT (persisted safely; never throws if storage unavailable)   */
/* ---------------------------------------------------------------------- */
const APP_VERSION = '26.3';
const ACCENT_OPTIONS = [
  { key: 'blue', label: 'Синий' }, { key: 'purple', label: 'Фиолетовый' },
  { key: 'pink', label: 'Розовый' }, { key: 'red', label: 'Красный' },
  { key: 'orange', label: 'Оранжевый' }, { key: 'yellow', label: 'Жёлтый' },
  { key: 'green', label: 'Зелёный' }, { key: 'teal', label: 'Бирюзовый' },
  { key: 'indigo', label: 'Индиго' }
];
var LS = (function () {
  try { var k = '__t'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); return window.localStorage; }
  catch (err) { return null; }
})();
function saveSetting(key, val) { if (LS) { try { LS.setItem(key, val); } catch (err) {} } }
function loadSetting(key, fallback) {
  if (LS) { try { var v = LS.getItem(key); return v === null ? fallback : v; } catch (err) {} }
  return fallback;
}

let selectedTheme = loadSetting('theme', 'dark'); // 'dark' | 'light' | 'system'
let selectedAccent = loadSetting('accent', 'blue');
var systemThemeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

function applyTheme(mode) {
  selectedTheme = mode;
  saveSetting('theme', mode);
  var effective = mode === 'system' ? (systemThemeQuery && systemThemeQuery.matches ? 'light' : 'dark') : mode;
  if (effective === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
}
function applyAccent(key) {
  selectedAccent = key;
  saveSetting('accent', key);
  if (key === 'blue') document.documentElement.removeAttribute('data-accent');
  else document.documentElement.setAttribute('data-accent', key);
}
if (systemThemeQuery) {
  var onSystemThemeChange = function () { if (selectedTheme === 'system') applyTheme('system'); };
  if (systemThemeQuery.addEventListener) systemThemeQuery.addEventListener('change', onSystemThemeChange);
  else if (systemThemeQuery.addListener) systemThemeQuery.addListener(onSystemThemeChange);
}
applyTheme(selectedTheme);
applyAccent(selectedAccent);

const state = {
  stack: ['chatlist'],
  activeChatId: null,
  activeDetailKey: null,
  searchQuery: '',
  replyTarget: null,
  contactMuted: {} // per-chat mute override toggled from contact profile
};

/* ---------------------------------------------------------------------- */
/* DOM REFS                                                                  */
/* ---------------------------------------------------------------------- */
const D = {};
function grabRefs() {
  [
    'appShell', 'paneDetail', 'detailEmptyState',
    'openSettingsBtn', 'openNewChatBtn',
    'chatSearchBar', 'chatSearchInput', 'searchClearBtn', 'searchCancelBtn', 'searchWrap',
    'chatList', 'chatListScroll', 'chatListEmpty', 'archiveReveal', 'archiveRevealCount',
    'recentSearchPanel', 'recentSearchList',
    'screen-archive', 'archiveChatList', 'archiveEmpty',
    'screen-settings', 'settingsName', 'settingsTag', 'settingsProfileRow', 'settingsVersionFooter',
    'screen-detail-generic', 'genericDetailTitle', 'genericDetailContent',
    'screen-profile-self', 'selfProfileName', 'selfProfileTag', 'sPhone', 'sTag', 'sBirthday', 'sBio',
    'selfTrackCard', 'selfTrackTitle', 'selfTrackArtist', 'selfTrackPlay',
    'editProfileBtn', 'shareProfileBtn',
    'screen-profile-edit', 'editCancelBtn', 'editDoneBtn', 'editAvatarBtn',
    'editName', 'editBio', 'editBirthday', 'editPhone', 'editTag',
    'screen-chat', 'chatMessages', 'chatTitleBtn', 'chatHeaderName', 'chatHeaderStatus',
    'chatHeaderAvatarBtn', 'chatHeaderAvatar',
    'chatSearchBarInChat', 'chatSearchInChatInput', 'chatSearchCount',
    'chatSearchPrevBtn', 'chatSearchNextBtn', 'chatSearchInChatCloseBtn',
    'pinnedMsgBanner', 'pinnedMsgBannerSnippet', 'pinnedMsgBannerCloseBtn',
    'replyPreviewBar', 'replyPreviewName', 'replyPreviewSnippet', 'replyPreviewCloseBtn',
    'attachBtn', 'inputFieldWrap', 'messageInput', 'sendBtn', 'sendBtnIcon',
    'recordingUI', 'recordingTimer',
    'screen-profile-contact', 'contactProfileAvatar', 'contactProfileName', 'contactProfileStatus',
    'contactMuteBtn', 'contactMuteLabel', 'contactTrackCard', 'contactTrackTitle', 'contactTrackArtist',
    'cPhone', 'cTag', 'cBirthday', 'cBio', 'mediaCount', 'mediaGrid', 'shareContactBtn',
    'newChatOverlay', 'newChatCancelBtn', 'newChatSearchInput', 'newChatContactList',
    'previewOverlay', 'previewCard', 'previewCloseBtn', 'previewName', 'previewMessages',
    'previewActions', 'previewArchiveBtn', 'previewArchiveLabel', 'previewPinBtn', 'previewPinLabel',
    'avatarPreviewOverlay', 'avatarPreviewCloseBtn', 'avatarPreviewSquare',
    'messageMenuOverlay', 'messageMenuWrap', 'quickReactions', 'messageMenuBubble', 'messageMenuActions', 'messageMenuCancelBtn',
    'forwardOverlay', 'forwardCancelBtn', 'forwardContactList',
    'trackPickerOverlay', 'trackPickerCancelBtn', 'trackPickerList',
    'confirmOverlay', 'confirmCard', 'confirmTitle', 'confirmMessage', 'confirmActions', 'confirmCancelBtn',
    'replySwipeIcon',
    'toast'
  ].forEach(function (id) { D[id] = document.getElementById(id); });
}

/* ---------------------------------------------------------------------- */
/* TOAST                                                                     */
/* ---------------------------------------------------------------------- */
let toastTimer = null;
function showToast(msg) {
  D.toast.textContent = msg;
  D.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { D.toast.classList.remove('show'); }, 2000);
}

/* ---------------------------------------------------------------------- */
/* NAVIGATION STACK                                                          */
/* ---------------------------------------------------------------------- */
const SCREEN_EL = {}; // name -> element, populated in init()

function setInert(el, value) {
  if (!el) return;
  if (value) {
    el.setAttribute('inert', '');
    try { el.inert = true; } catch (err) {}
  } else {
    el.removeAttribute('inert');
    try { el.inert = false; } catch (err) {}
  }
}
function isDesktopLayout() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

function syncStackUI() {
  const stack = state.stack;
  const topName = stack[stack.length - 1];
  Object.keys(SCREEN_EL).forEach(function (name) {
    var el = SCREEN_EL[name];
    if (!el) return;
    el.classList.remove('active', 'prev');
  });
  stack.forEach(function (name, i) {
    var el = SCREEN_EL[name];
    if (!el) return;
    el.style.zIndex = String(i + 1);
    if (i === stack.length - 1) el.classList.add('active');
    else if (i === stack.length - 2) el.classList.add('prev');
  });
  Object.keys(SCREEN_EL).forEach(function (name) {
    var el = SCREEN_EL[name];
    if (!el) return;
    var alwaysVisible = name === 'chatlist' && isDesktopLayout();
    setInert(el, !(name === topName || alwaysVisible));
  });
  if (D.detailEmptyState) {
    D.detailEmptyState.classList.toggle('is-hidden', stack.length > 1);
  }
}

function pushScreen(name) {
  state.stack.push(name);
  syncStackUI();
}

function popScreen() {
  if (state.stack.length <= 1) return;
  var leaving = state.stack.pop();
  syncStackUI();
  if (leaving === 'chat') {
    stopRecording(true);
    state.activeChatId = null;
  }
}

function resetToRoot() {
  state.stack = ['chatlist'];
  syncStackUI();
}

/* ---------------------------------------------------------------------- */
/* EDGE SWIPE-BACK (item 16)                                                */
/* ---------------------------------------------------------------------- */
function initEdgeSwipeBack() {
  var EDGE_ZONE = 24;
  var eg = null;
  var blockingOverlays = [
    D.messageMenuOverlay, D.confirmOverlay, D.forwardOverlay, D.newChatOverlay,
    D.previewOverlay, D.avatarPreviewOverlay, D.trackPickerOverlay
  ];
  function anyOverlayOpen() {
    return blockingOverlays.some(function (el) { return el && el.classList.contains('open'); });
  }

  document.addEventListener('pointerdown', function (e) {
    if (state.stack.length < 2) return;
    if (anyOverlayOpen()) return;
    var topName = state.stack[state.stack.length - 1];
    var activeEl = SCREEN_EL[topName];
    if (!activeEl) return;
    var rect = activeEl.getBoundingClientRect();
    if (e.clientX - rect.left > EDGE_ZONE) return;
    var prevName = state.stack[state.stack.length - 2];
    var prevEl = prevName ? SCREEN_EL[prevName] : null;
    eg = {
      startX: e.clientX, startY: e.clientY, activeEl: activeEl, prevEl: prevEl,
      width: rect.width || window.innerWidth, moved: false, dragging: false,
      progress: 0, lastX: e.clientX, lastT: Date.now(), velocity: 0,
      pointerId: e.pointerId
    };
  });

  document.addEventListener('pointermove', function (e) {
    if (!eg || e.pointerId !== eg.pointerId) return;
    var dx = e.clientX - eg.startX;
    var dy = e.clientY - eg.startY;
    if (!eg.moved) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (dx <= 0 || Math.abs(dy) > Math.abs(dx) * 1.2) { eg = null; return; }
      eg.moved = true;
      eg.dragging = true;
      try { eg.activeEl.setPointerCapture(e.pointerId); } catch (err) {}
      eg.activeEl.style.transition = 'none';
      if (eg.prevEl) eg.prevEl.style.transition = 'none';
    }
    if (!eg.dragging) return;
    e.preventDefault();
    var now = Date.now();
    var dt = now - eg.lastT;
    if (dt > 0) eg.velocity = (e.clientX - eg.lastX) / dt;
    eg.lastX = e.clientX; eg.lastT = now;
    var progress = clamp(dx / eg.width, 0, 1);
    eg.progress = progress;
    eg.activeEl.style.transform = 'translateX(' + (progress * 100) + '%)';
    if (eg.prevEl) {
      eg.prevEl.style.transform = 'translateX(' + (-26 + progress * 26) + '%)';
      eg.prevEl.style.filter = 'brightness(' + (0.55 + progress * 0.45) + ')';
    }
  }, { passive: false });

  function finish(e) {
    if (!eg || e.pointerId !== eg.pointerId) return;
    var g = eg;
    eg = null;
    if (!g.dragging) return;
    var shouldPop = g.progress > 0.38 || g.velocity > 0.5;
    g.activeEl.style.transition = '';
    if (g.prevEl) g.prevEl.style.transition = '';
    void g.activeEl.offsetHeight; // force reflow so the transition starts from the current dragged position
    if (shouldPop) {
      g.activeEl.style.transform = 'translateX(100%)';
      if (g.prevEl) { g.prevEl.style.transform = 'translateX(0%)'; g.prevEl.style.filter = 'brightness(1)'; }
      setTimeout(function () {
        g.activeEl.style.transform = ''; g.activeEl.style.transition = '';
        if (g.prevEl) { g.prevEl.style.transform = ''; g.prevEl.style.transition = ''; g.prevEl.style.filter = ''; }
        popScreen();
      }, 340);
    } else {
      g.activeEl.style.transform = 'translateX(0%)';
      if (g.prevEl) { g.prevEl.style.transform = 'translateX(-26%)'; g.prevEl.style.filter = 'brightness(.55)'; }
      setTimeout(function () {
        g.activeEl.style.transform = ''; g.activeEl.style.transition = '';
        if (g.prevEl) { g.prevEl.style.transform = ''; g.prevEl.style.transition = ''; g.prevEl.style.filter = ''; }
      }, 340);
    }
  }
  document.addEventListener('pointerup', finish);
  document.addEventListener('pointercancel', finish);
}

/* ---------------------------------------------------------------------- */
/* CHAT LIST RENDERING                                                       */
/* ---------------------------------------------------------------------- */
function lastMessagePreview(chat) {
  if (chat.typing) return { icon: null, text: 'печатает…', typing: true };
  var last = chat.messages[chat.messages.length - 1];
  if (!last) return { icon: null, text: '', typing: false };
  var prefix = last.from === 'me' ? 'Вы: ' : '';
  if (last.type === 'voice') return { icon: 'mic', text: prefix + 'Голосовое сообщение', typing: false };
  if (last.type === 'video') return { icon: 'video', text: prefix + 'Видеосообщение', typing: false };
  if (last.type === 'photo') return { icon: 'photo', text: prefix + 'Фото', typing: false };
  return { icon: null, text: prefix + last.text, typing: false };
}

function sortedChats(list) {
  return list.slice().sort(function (a, b) {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.lastTs - a.lastTs;
  });
}

function activeChats() { return chats.filter(function (c) { return !c.archived; }); }
function archivedChats() { return chats.filter(function (c) { return c.archived; }); }

function filterChats(list, query) {
  if (!query) return list;
  var q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(function (c) {
    var last = c.messages[c.messages.length - 1];
    return c.name.toLowerCase().indexOf(q) !== -1 ||
      c.tag.toLowerCase().indexOf(q) !== -1 ||
      (last && last.text && last.text.toLowerCase().indexOf(q) !== -1);
  });
}

function chatCardHTML(chat) {
  var preview = lastMessagePreview(chat);
  var muteIcon = chat.muted ? '<i class="icon mute-icon" data-icon="bellSlash"></i>' : '';
  var previewIcon = preview.icon ? '<i class="icon" data-icon="' + preview.icon + '"></i>' : '';
  var right;
  if (chat.unread > 0) {
    right = '<span class="chat-badge">' + (chat.unread > 99 ? '99+' : chat.unread) + '</span>';
  } else if (chat.pinned) {
    right = '<span class="pin-badge"><i class="icon" data-icon="pin"></i></span>';
  } else {
    right = '';
  }
  return (
    '<div class="chat-card' + (chat.pinned ? ' chat-card--pinned' : '') + '" data-id="' + chat.id + '">' +
      '<div class="chat-card-actions">' +
        '<button class="swipe-action swipe-action--mute" data-action="mute" data-id="' + chat.id + '"><i class="icon" data-icon="bellSlash"></i><span>' + (chat.muted ? 'Вкл. звук' : 'Заглушить') + '</span></button>' +
        '<button class="swipe-action swipe-action--delete" data-action="delete" data-id="' + chat.id + '"><i class="icon" data-icon="trash"></i><span>Удалить</span></button>' +
      '</div>' +
      '<div class="chat-card-swipe" data-id="' + chat.id + '">' +
        '<div class="chat-card-main" data-id="' + chat.id + '">' +
          '<span class="avatar avatar--stretch" style="--c1:' + chat.palette[0] + ';--c2:' + chat.palette[1] + '"><span>' + chat.initials + '</span></span>' +
          '<span class="chat-card-body">' +
            '<span class="chat-card-top">' +
              '<span class="chat-card-name">' + escapeHtml(chat.name) + muteIcon + '</span>' +
              '<span class="chat-card-time">' + listTimeLabel(chat.lastTs) + '</span>' +
            '</span>' +
            '<span class="chat-card-bottom">' +
              '<span class="chat-card-preview' + (preview.typing ? ' is-typing' : '') + '">' + previewIcon + escapeHtml(preview.text) + '</span>' +
              right +
            '</span>' +
          '</span>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function renderChatList() {
  var list = filterChats(sortedChats(activeChats()), state.searchQuery);
  if (!list.length) {
    D.chatList.innerHTML = '';
    D.chatListScroll.hidden = true;
    D.chatListEmpty.hidden = false;
  } else {
    D.chatListScroll.hidden = false;
    D.chatListEmpty.hidden = true;
    D.chatList.innerHTML = list.map(chatCardHTML).join('');
    mountIcons(D.chatList);
    qsa('.chat-card-main', D.chatList).forEach(function (el) { addPressFeedback(el); });
  }
  var archivedCount = archivedChats().length;
  D.archiveRevealCount.textContent = archivedCount ? String(archivedCount) : '';
}

function renderArchiveList() {
  var list = sortedChats(archivedChats());
  if (!list.length) {
    D.archiveChatList.innerHTML = '';
    D.archiveChatList.hidden = true;
    D.archiveEmpty.hidden = false;
  } else {
    D.archiveChatList.hidden = false;
    D.archiveEmpty.hidden = true;
    D.archiveChatList.innerHTML = list.map(chatCardHTML).join('');
    mountIcons(D.archiveChatList);
    qsa('.chat-card-main', D.archiveChatList).forEach(function (el) { addPressFeedback(el); });
  }
}

function getChat(id) {
  id = Number(id);
  for (var i = 0; i < chats.length; i++) if (chats[i].id === id) return chats[i];
  return null;
}

/* ---------------------------------------------------------------------- */
/* CHAT LIST GESTURES — swipe to reveal actions, long-press to preview      */
/* ---------------------------------------------------------------------- */
const SWIPE_OPEN = -156;
const LONG_PRESS_MS = 480;
const MOVE_THRESHOLD = 9;

let gesture = null; // active gesture bookkeeping
let openSwipeId = null;

function findSwipeEl(id) {
  return D.chatList.querySelector('.chat-card-swipe[data-id="' + id + '"]') ||
    D.archiveChatList.querySelector('.chat-card-swipe[data-id="' + id + '"]');
}
function closeSwipe(id, animate) {
  var el = findSwipeEl(id);
  if (!el) { if (openSwipeId === Number(id)) openSwipeId = null; return; }
  el.classList.toggle('is-settling', animate !== false);
  el.classList.remove('is-dragging');
  el.style.transform = 'translateX(0px)';
  if (openSwipeId === Number(id)) openSwipeId = null;
}
function openSwipeFor(id) {
  var el = findSwipeEl(id);
  if (!el) return;
  el.classList.add('is-settling');
  el.classList.remove('is-dragging');
  el.style.transform = 'translateX(' + SWIPE_OPEN + 'px)';
  openSwipeId = Number(id);
}

function initChatListGestures(container) {
  container.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.chat-card-actions')) return; // let Delete/Mute handle their own tap
    var main = e.target.closest('.chat-card-main');
    var id = main ? Number(main.dataset.id) : null;

    if (openSwipeId !== null && openSwipeId !== id) closeSwipe(openSwipeId);
    if (!main || gesture) return; // no card here, or a gesture is already in progress (ignore extra fingers)

    var swipeEl = container.querySelector('.chat-card-swipe[data-id="' + id + '"]');
    try { main.setPointerCapture(e.pointerId); } catch (err) {}

    gesture = {
      id: id, mainEl: main, swipeEl: swipeEl,
      startX: e.clientX, startY: e.clientY,
      lastX: e.clientX, lastT: Date.now(), velocity: 0,
      baseOffset: openSwipeId === id ? SWIPE_OPEN : 0,
      moved: false, swiping: false, longFired: false,
      pointerId: e.pointerId
    };
    gesture.timer = setTimeout(function () {
      if (!gesture || gesture.moved) return;
      gesture.longFired = true;
      if (navigator.vibrate) { try { navigator.vibrate(8); } catch (err) {} }
      openChatPreview(id, main);
      // Reset gesture bookkeeping immediately: the preview modal now sits on
      // top and owns further interaction, so don't wait on a pointerup that
      // may not reliably reach this handler once the modal is topmost.
      try { main.releasePointerCapture(gesture.pointerId); } catch (err) {}
      gesture = null;
    }, LONG_PRESS_MS);
  });

  container.addEventListener('pointermove', function (e) {
    if (!gesture || e.pointerId !== gesture.pointerId) return;
    var dx = e.clientX - gesture.startX;
    var dy = e.clientY - gesture.startY;
    if (!gesture.moved && (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD)) {
      gesture.moved = true;
      clearTimeout(gesture.timer);
      // Require a clearly horizontal gesture (not just a jittery sample during
      // a fast vertical flick) before committing to swipe mode — prevents the
      // action buttons from flashing during rapid up/down scrolling.
      if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 2.2) gesture.swiping = true;
    }
    if (gesture.swiping) {
      e.preventDefault();
      var now = Date.now();
      var dt = now - gesture.lastT;
      if (dt > 0) gesture.velocity = (e.clientX - gesture.lastX) / dt; // px/ms
      gesture.lastX = e.clientX;
      gesture.lastT = now;
      var t = clamp(gesture.baseOffset + dx, SWIPE_OPEN, 0);
      gesture.swipeEl.classList.add('is-dragging');
      gesture.swipeEl.classList.remove('is-settling');
      gesture.swipeEl.style.transform = 'translateX(' + t + 'px)';
    }
  }, { passive: false });

  function finish(e) {
    if (!gesture || e.pointerId !== gesture.pointerId) return;
    clearTimeout(gesture.timer);
    var g = gesture;
    gesture = null;
    g.mainEl.classList.remove('long-pressed');

    if (g.longFired) return; // preview already opened by timer

    if (g.swiping) {
      var dx = (typeof e.clientX === 'number' ? e.clientX : g.startX) - g.startX;
      var finalOffset = clamp(g.baseOffset + dx, SWIPE_OPEN, 0);
      var isFastFlick = Math.abs(g.velocity) > 0.5;
      var shouldOpen = isFastFlick ? g.velocity < 0 : finalOffset < SWIPE_OPEN * 0.45;
      if (shouldOpen) openSwipeFor(g.id);
      else closeSwipe(g.id);
      return;
    }

    if (!g.moved) {
      if (openSwipeId === g.id) { closeSwipe(g.id); return; }
      openChat(g.id);
    }
  }
  container.addEventListener('pointerup', finish);
  container.addEventListener('pointercancel', finish);

  container.addEventListener('scroll', function () {
    if (openSwipeId !== null) closeSwipe(openSwipeId);
  }, { passive: true });

  container.addEventListener('click', function (e) {
    var actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    var id = Number(actionBtn.dataset.id);
    var action = actionBtn.dataset.action;
    var chat = getChat(id);
    if (!chat) return;
    if (action === 'mute') {
      chat.muted = !chat.muted;
      closeSwipe(id, false);
      renderChatList();
      if (state.stack.indexOf('archive') !== -1) renderArchiveList();
      showToast(chat.muted ? 'Уведомления выключены' : 'Уведомления включены');
    } else if (action === 'delete') {
      closeSwipe(id, true);
      showConfirm({
        title: 'Удалить чат с ' + chat.name + '?',
        message: 'История сообщений будет удалена без возможности восстановления.',
        actions: [{ label: 'Удалить чат', danger: true, onSelect: function () { deleteChatWithAnimation(id, container); } }]
      });
    }
  });
}

function deleteChatWithAnimation(id, container) {
  var swipeEl = container.querySelector('.chat-card-swipe[data-id="' + id + '"]');
  var card = swipeEl ? swipeEl.closest('.chat-card') : null;
  if (openSwipeId === id) openSwipeId = null;
  if (!card) {
    chats = chats.filter(function (c) { return c.id !== id; });
    renderChatList();
    if (state.stack.indexOf('archive') !== -1) renderArchiveList();
    return;
  }
  card.style.transition = 'max-height .32s ease, opacity .32s ease';
  card.style.maxHeight = card.offsetHeight + 'px';
  requestAnimationFrame(function () {
    card.style.maxHeight = '0px';
    card.style.opacity = '0';
  });
  setTimeout(function () {
    chats = chats.filter(function (c) { return c.id !== id; });
    renderChatList();
    if (state.stack.indexOf('archive') !== -1) renderArchiveList();
    showToast('Чат удалён');
  }, 320);
}
ICONS.pause = SVG_OPEN + '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/></svg>';

/* ---------------------------------------------------------------------- */
/* PULL-TO-REVEAL ARCHIVE (item 17)                                         */
/* ---------------------------------------------------------------------- */
function initArchivePull() {
  var COMMIT_RATIO = 0.72;
  var pull = null;

  D.chatList.addEventListener('pointerdown', function (e) {
    if (pull || D.chatList.scrollTop > 0) return;
    pull = {
      startX: e.clientX, startY: e.clientY, active: false, dist: 0,
      maxDist: window.innerHeight * 0.30, wasCommitted: false, pointerId: e.pointerId
    };
  });

  D.chatList.addEventListener('pointermove', function (e) {
    if (!pull || e.pointerId !== pull.pointerId) return;
    var dy = e.clientY - pull.startY;
    var dx = e.clientX - pull.startX;
    if (!pull.active) {
      if (D.chatList.scrollTop > 0 || dy < 16 || Math.abs(dx) > dy * 0.8) { pull = null; return; }
      pull.active = true;
      D.chatList.classList.add('is-pulling');
      D.archiveReveal.style.transition = 'none';
      D.chatList.style.transition = 'none';
    }
    e.preventDefault();
    var raw = Math.max(0, dy);
    pull.dist = raw < pull.maxDist ? raw : pull.maxDist + (raw - pull.maxDist) * 0.25;
    D.archiveReveal.style.height = pull.dist + 'px';
    D.archiveReveal.style.opacity = String(clamp(pull.dist / 60, 0, 1));
    D.chatList.style.transform = 'translateY(' + pull.dist + 'px)';
    var committed = pull.dist >= pull.maxDist * COMMIT_RATIO;
    D.archiveReveal.classList.toggle('is-committed', committed);
    if (committed && !pull.wasCommitted && navigator.vibrate) { try { navigator.vibrate(8); } catch (err) {} }
    pull.wasCommitted = committed;
  }, { passive: false });

  function finish(e) {
    if (!pull || e.pointerId !== pull.pointerId) return;
    var p = pull;
    pull = null;
    if (!p.active) return;
    D.chatList.classList.remove('is-pulling');
    var committed = p.dist >= p.maxDist * COMMIT_RATIO;
    D.chatList.style.transition = 'transform .34s var(--ease-spring)';
    D.chatList.style.transform = '';
    D.archiveReveal.style.transition = 'height .34s var(--ease-spring), opacity .28s ease';
    D.archiveReveal.style.height = '0px';
    D.archiveReveal.style.opacity = '0';
    D.archiveReveal.classList.remove('is-committed');
    setTimeout(function () { D.chatList.style.transition = ''; D.archiveReveal.style.transition = ''; }, 360);
    if (committed) openArchive();
  }
  D.chatList.addEventListener('pointerup', finish);
  D.chatList.addEventListener('pointercancel', finish);
}

function openArchive() {
  renderArchiveList();
  pushScreen('archive');
}

/* ---------------------------------------------------------------------- */
/* MESSAGE RENDERING                                                         */
/* ---------------------------------------------------------------------- */
function chatPaletteFor(msg) {
  var s = String(msg.id), seed = 0;
  for (var i = 0; i < s.length; i++) seed += s.charCodeAt(i);
  return AVATAR_PALETTES[seed % AVATAR_PALETTES.length];
}
function waveformBars(seedStr) {
  var seed = 7;
  for (var i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  var bars = [];
  for (var j = 0; j < 26; j++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    var h = 22 + (seed % 1000) / 1000 * 78;
    bars.push('<span style="height:' + h.toFixed(0) + '%"></span>');
  }
  return bars.join('');
}
function replyChipHTML(reply) {
  if (!reply) return '';
  return '<div class="reply-chip"><span class="reply-bar"></span><span class="reply-text"><b>' +
    escapeHtml(reply.name) + '</b>' + escapeHtml(reply.text) + '</span></div>';
}
function messageBubbleHTML(msg) {
  var dir = msg.from === 'me' ? 'out' : 'in';
  var tailClass = msg._tail ? ' bubble--tail' : '';
  if (msg.type === 'voice') {
    return '<div class="bubble bubble--voice ' + dir + tailClass + '">' +
      '<button class="voice-play pressable" data-voice="' + msg.id + '"><i class="icon" data-icon="play"></i></button>' +
      '<div class="voice-wave">' + waveformBars(msg.id) + '</div>' +
      '<span class="voice-duration">' + formatDuration(msg.duration) + '</span></div>';
  }
  if (msg.type === 'video') {
    var pv = chatPaletteFor(msg);
    return '<div class="bubble-circle pressable ' + dir + '" style="--g1:' + pv[0] + ';--g2:' + pv[1] + '">' +
      '<span class="circle-play"><i class="icon" data-icon="play"></i></span>' +
      '<span class="circle-duration">' + formatDuration(msg.duration) + '</span></div>';
  }
  if (msg.type === 'photo') {
    var pp = chatPaletteFor(msg);
    return '<div class="bubble-photo pressable ' + dir + tailClass + '" style="--g1:' + pp[0] + ';--g2:' + pp[1] + '"><i class="icon" data-icon="photo"></i></div>';
  }
  return '<div class="bubble ' + dir + tailClass + '">' + forwardedLabelHTML(msg) + replyChipHTML(msg.replyTo) + escapeHtml(msg.text) + '</div>';
}
function forwardedLabelHTML(msg) {
  if (!msg.forwardedFrom) return '';
  return '<div class="forwarded-label">Переслано от ' + escapeHtml(msg.forwardedFrom) + '</div>';
}
function messageRowHTML(msg, groupStart) {
  var dir = msg.from === 'me' ? 'out' : 'in';
  var reactionHTML = msg.reaction ? '<span class="msg-reaction">' + msg.reaction + '</span>' : '';
  return '<div class="msg-row ' + dir + (groupStart ? ' msg-row--group-start' : '') + '" data-mid="' + msg.id + '">' +
    messageBubbleHTML(msg) + reactionHTML + '</div>';
}
function computeGroups(messages) {
  var out = [], lastDay = null;
  for (var i = 0; i < messages.length; i++) {
    var m = messages[i];
    var day = startOfDay(m.ts);
    if (day !== lastDay) { out.push({ kind: 'divider', label: dividerLabel(m.ts) }); lastDay = day; }
    var prev = messages[i - 1], next = messages[i + 1];
    var groupStart = !prev || prev.from !== m.from || startOfDay(prev.ts) !== day || (m.ts - prev.ts) > 5 * MIN;
    var groupEnd = !next || next.from !== m.from || startOfDay(next.ts) !== day || (next.ts - m.ts) > 5 * MIN;
    m._tail = groupEnd;
    out.push({ kind: 'msg', msg: m, groupStart: groupStart });
  }
  return out;
}
function statusLabelText(status) {
  return status === 'read' ? 'Прочитано' : status === 'delivered' ? 'Доставлено' : 'Отправлено';
}
function renderMessages(chat) {
  var groups = computeGroups(chat.messages);
  var lastOutId = null;
  for (var i = chat.messages.length - 1; i >= 0; i--) { if (chat.messages[i].from === 'me') { lastOutId = chat.messages[i].id; break; } }
  var html = groups.map(function (g) {
    if (g.kind === 'divider') return '<div class="date-divider"><span>' + g.label + '</span></div>';
    var row = messageRowHTML(g.msg, g.groupStart);
    if (g.msg.id === lastOutId && g.msg.status) {
      row += '<div class="msg-status" id="msgStatusLabel">' + statusLabelText(g.msg.status) + '</div>';
    }
    return row;
  }).join('');
  D.chatMessages.innerHTML = html;
  mountIcons(D.chatMessages);
}
function scrollChatToBottom(smooth) {
  requestAnimationFrame(function () {
    D.chatMessages.scrollTo({ top: D.chatMessages.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  });
}
function relativeLastSeen(ts) {
  var diffMin = Math.round((NOW - ts) / MIN);
  if (diffMin < 5) return 'только что';
  if (diffMin < 60) return diffMin + ' мин назад';
  var diffH = Math.round(diffMin / 60);
  if (diffH < 24) return diffH + ' ч назад';
  var d = dayDiff(ts);
  if (d === 1) return 'вчера в ' + clockTime(ts);
  return listTimeLabel(ts).toLowerCase();
}

/* ---------------------------------------------------------------------- */
/* GENERIC CONFIRM MODAL (item 18)                                          */
/* ---------------------------------------------------------------------- */
let confirmPendingActions = [];
let confirmPendingCancel = null;
function showConfirm(opts) {
  D.confirmTitle.textContent = opts.title || '';
  D.confirmMessage.textContent = opts.message || '';
  D.confirmMessage.hidden = !opts.message;
  confirmPendingActions = opts.actions || [];
  confirmPendingCancel = opts.onCancel || null;
  D.confirmActions.innerHTML = confirmPendingActions.map(function (a, i) {
    return '<button class="confirm-action-btn' + (a.danger ? ' confirm-action-btn--danger' : '') + '" data-idx="' + i + '">' + escapeHtml(a.label) + '</button>';
  }).join('');
  qsa('.confirm-action-btn', D.confirmActions).forEach(function (el) { addPressFeedback(el); });
  setInert(D.confirmOverlay, false);
  D.confirmOverlay.classList.add('open');
}
function closeConfirm() {
  D.confirmOverlay.classList.remove('open');
  setInert(D.confirmOverlay, true);
}

/* ---------------------------------------------------------------------- */
/* MESSAGE INTERACTIONS — long-press menu, swipe-to-reply, double-tap heart */
/* (items 18, 19, 20)                                                       */
/* ---------------------------------------------------------------------- */
const QUICK_REACTIONS = ['❤️', '👍', '👎', '😂', '😮', '😢'];
let msgGesture = null;
let lastTapInfo = null;
let activeMenuMid = null;
let forwardPendingMid = null;

function findMessage(chatId, mid) {
  var chat = getChat(chatId);
  if (!chat) return null;
  for (var i = 0; i < chat.messages.length; i++) {
    if (String(chat.messages[i].id) === String(mid)) return chat.messages[i];
  }
  return null;
}
function messageSnippet(msg) {
  if (!msg) return '';
  if (msg.type === 'voice') return '🎤 Голосовое сообщение';
  if (msg.type === 'video') return '⭕ Видеосообщение';
  if (msg.type === 'photo') return '📷 Фото';
  return msg.text || '';
}
function scrollToMessage(mid, smooth) {
  var row = qs('.msg-row[data-mid="' + mid + '"]', D.chatMessages);
  if (!row) return;
  row.scrollIntoView({ block: 'center', behavior: smooth === false ? 'auto' : 'smooth' });
  row.classList.add('is-search-current');
  setTimeout(function () { row.classList.remove('is-search-current'); }, 900);
}

function initMessageGestures() {
  D.chatMessages.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.voice-play')) return;
    var row = e.target.closest('.msg-row');
    if (!row || msgGesture) return;
    var bubbleEl = row.querySelector('.bubble, .bubble-circle, .bubble-photo');
    if (!bubbleEl) return;
    try { row.setPointerCapture(e.pointerId); } catch (err) {}
    msgGesture = {
      mid: row.dataset.mid, row: row, bubbleEl: bubbleEl,
      startX: e.clientX, startY: e.clientY,
      moved: false, swiping: false, longFired: false,
      pointerId: e.pointerId
    };
    msgGesture.timer = setTimeout(function () {
      if (!msgGesture || msgGesture.moved) return;
      msgGesture.longFired = true;
      if (navigator.vibrate) { try { navigator.vibrate(8); } catch (err) {} }
      try { row.releasePointerCapture(msgGesture.pointerId); } catch (err) {}
      openMessageMenu(msgGesture.mid, row);
      msgGesture = null;
    }, LONG_PRESS_MS);
  });

  D.chatMessages.addEventListener('pointermove', function (e) {
    if (!msgGesture || e.pointerId !== msgGesture.pointerId) return;
    var dx = e.clientX - msgGesture.startX;
    var dy = e.clientY - msgGesture.startY;
    if (!msgGesture.moved && (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD)) {
      msgGesture.moved = true;
      clearTimeout(msgGesture.timer);
      if (dx < -14 && Math.abs(dx) > Math.abs(dy) * 2.2) {
        msgGesture.swiping = true;
        setInert(D.replySwipeIcon, false);
      }
    }
    if (msgGesture.swiping) {
      e.preventDefault();
      var t = clamp(dx, -60, 0);
      if (t < -52) t = -52 - (Math.abs(-52 - t)) * 0.3;
      msgGesture.bubbleEl.style.transform = 'translateX(' + t + 'px)';
      var armed = t <= -44;
      if (armed !== msgGesture.row.classList.contains('is-swipe-armed')) {
        msgGesture.row.classList.toggle('is-swipe-armed', armed);
        D.replySwipeIcon.classList.toggle('is-armed', armed);
        if (armed && navigator.vibrate) { try { navigator.vibrate(6); } catch (err) {} }
      }
      var rect = msgGesture.bubbleEl.getBoundingClientRect();
      D.replySwipeIcon.style.left = Math.round(rect.right + 8) + 'px';
      D.replySwipeIcon.style.top = Math.round(rect.top + rect.height / 2 - 15) + 'px';
    }
  }, { passive: false });

  function finish(e) {
    if (!msgGesture || e.pointerId !== msgGesture.pointerId) return;
    clearTimeout(msgGesture.timer);
    var g = msgGesture;
    msgGesture = null;
    if (g.longFired) return;
    if (g.swiping) {
      var wasArmed = g.row.classList.contains('is-swipe-armed');
      g.bubbleEl.style.transition = 'transform .32s var(--ease-spring)';
      g.bubbleEl.style.transform = '';
      g.row.classList.remove('is-swipe-armed');
      D.replySwipeIcon.classList.remove('is-armed');
      setInert(D.replySwipeIcon, true);
      setTimeout(function () { g.bubbleEl.style.transition = ''; }, 340);
      if (wasArmed) setReplyTarget(g.mid);
      return;
    }
    if (!g.moved) {
      var now = Date.now();
      if (lastTapInfo && lastTapInfo.mid === g.mid && (now - lastTapInfo.time) < 320) {
        lastTapInfo = null;
        toggleHeartReaction(g.mid, g.row, e.clientX, e.clientY);
      } else {
        lastTapInfo = { mid: g.mid, time: now };
      }
    }
  }
  D.chatMessages.addEventListener('pointerup', finish);
  D.chatMessages.addEventListener('pointercancel', finish);
}

function toggleHeartReaction(mid, row, clientX, clientY) {
  var chat = getChat(state.activeChatId);
  var msg = chat && findMessage(state.activeChatId, mid);
  if (!msg) return;
  if (msg.reaction === '❤️') {
    msg.reaction = null;
    var existing = row.querySelector('.msg-reaction');
    if (existing) existing.remove();
    return;
  }
  msg.reaction = '❤️';
  if (navigator.vibrate) { try { navigator.vibrate(10); } catch (err) {} }
  if (!row.querySelector('.msg-reaction')) {
    var span = document.createElement('span');
    span.className = 'msg-reaction';
    span.textContent = '❤️';
    row.appendChild(span);
  }
  var rect = row.getBoundingClientRect();
  var burst = document.createElement('div');
  burst.className = 'heart-burst';
  burst.textContent = '❤️';
  burst.style.left = (typeof clientX === 'number' ? clientX : rect.left + rect.width / 2) + 'px';
  burst.style.top = (typeof clientY === 'number' ? clientY : rect.top + rect.height / 2) + 'px';
  document.body.appendChild(burst);
  burst.addEventListener('animationend', function () { burst.remove(); });
}

function setReplyTarget(mid) {
  var chat = getChat(state.activeChatId);
  var msg = chat && findMessage(state.activeChatId, mid);
  if (!msg || !chat) return;
  state.replyTarget = { id: msg.id, name: msg.from === 'me' ? currentUser.name : chat.name, text: messageSnippet(msg) };
  D.replyPreviewName.textContent = state.replyTarget.name;
  D.replyPreviewSnippet.textContent = state.replyTarget.text;
  D.replyPreviewBar.hidden = false;
  D.messageInput.focus();
}
function clearReplyTarget() {
  state.replyTarget = null;
  D.replyPreviewBar.hidden = true;
}

function renderPinnedBanner(chat) {
  if (!chat || !chat.pinnedMessageId) { D.pinnedMsgBanner.hidden = true; return; }
  var msg = findMessage(chat.id, chat.pinnedMessageId);
  if (!msg) { chat.pinnedMessageId = null; D.pinnedMsgBanner.hidden = true; return; }
  D.pinnedMsgBannerSnippet.textContent = messageSnippet(msg);
  D.pinnedMsgBanner.hidden = false;
}

/* ---------------------------------------------------------------------- */
/* SEARCH IN CHAT (item 15)                                                 */
/* ---------------------------------------------------------------------- */
let chatSearchState = null;
function openChatSearch() {
  if (!state.activeChatId) return;
  chatSearchState = { query: '', matches: [], index: -1 };
  D.chatSearchBarInChat.hidden = false;
  D.chatSearchInChatInput.value = '';
  D.chatSearchCount.textContent = '';
  requestAnimationFrame(function () { D.chatSearchInChatInput.focus(); });
}
function closeChatSearch() {
  if (D.chatSearchBarInChat) D.chatSearchBarInChat.hidden = true;
  clearChatSearchHighlights();
  chatSearchState = null;
}
function clearChatSearchHighlights() {
  qsa('.msg-row.is-search-match, .msg-row.is-search-current', D.chatMessages).forEach(function (el) {
    el.classList.remove('is-search-match', 'is-search-current');
  });
}
function runChatSearch(query) {
  var chat = getChat(state.activeChatId);
  if (!chat || !chatSearchState) return;
  clearChatSearchHighlights();
  chatSearchState.query = query;
  var q = query.trim().toLowerCase();
  chatSearchState.matches = [];
  if (q) {
    chat.messages.forEach(function (m) {
      if (m.type === 'text' && m.text && m.text.toLowerCase().indexOf(q) !== -1) chatSearchState.matches.push(m.id);
    });
  }
  chatSearchState.index = chatSearchState.matches.length ? chatSearchState.matches.length - 1 : -1;
  chatSearchState.matches.forEach(function (id) {
    var row = qs('.msg-row[data-mid="' + id + '"]', D.chatMessages);
    if (row) row.classList.add('is-search-match');
  });
  updateChatSearchNav();
  goToCurrentSearchMatch();
}
function updateChatSearchNav() {
  if (!chatSearchState) return;
  var total = chatSearchState.matches.length;
  D.chatSearchCount.textContent = total ? (chatSearchState.index + 1) + '/' + total : (chatSearchState.query ? '0/0' : '');
}
function goToCurrentSearchMatch() {
  if (!chatSearchState || !chatSearchState.matches.length) return;
  qsa('.is-search-current', D.chatMessages).forEach(function (el) { el.classList.remove('is-search-current'); });
  var id = chatSearchState.matches[chatSearchState.index];
  var row = qs('.msg-row[data-mid="' + id + '"]', D.chatMessages);
  if (row) { row.classList.add('is-search-current'); row.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
}
function stepChatSearch(dir) {
  if (!chatSearchState || !chatSearchState.matches.length) return;
  chatSearchState.index = (chatSearchState.index + dir + chatSearchState.matches.length) % chatSearchState.matches.length;
  updateChatSearchNav();
  goToCurrentSearchMatch();
}

function openMessageMenu(mid, row) {
  var chat = getChat(state.activeChatId);
  var msg = chat && findMessage(state.activeChatId, mid);
  if (!msg || !chat) return;
  activeMenuMid = mid;

  D.quickReactions.innerHTML = QUICK_REACTIONS.map(function (r) {
    return '<button class="quick-reaction-btn pressable" data-reaction="' + r + '">' + r + '</button>';
  }).join('');
  qsa('.quick-reaction-btn', D.quickReactions).forEach(function (b) { addPressFeedback(b); });

  D.messageMenuBubble.innerHTML = messageRowHTML(msg, true);
  mountIcons(D.messageMenuBubble);

  var isPinned = chat.pinnedMessageId === msg.id;
  var actions = [{ action: 'reply', icon: 'reply', label: 'Ответить' }];
  if (msg.type === 'text') actions.push({ action: 'copy', icon: 'copy', label: 'Скопировать' });
  actions.push({ action: 'pin', icon: 'pin', label: isPinned ? 'Открепить' : 'Закрепить' });
  actions.push({ action: 'forward', icon: 'share', label: 'Переслать' });
  actions.push({ action: 'select', icon: 'checkmark', label: 'Выделить' });
  actions.push({ action: 'delete', icon: 'trash', label: 'Удалить', danger: true });

  D.messageMenuActions.innerHTML = actions.map(function (a) {
    return '<button class="message-action-row' + (a.danger ? ' message-action-row--danger' : '') + '" data-msg-action="' + a.action + '">' +
      '<span>' + a.label + '</span><i class="icon" data-icon="' + a.icon + '"></i></button>';
  }).join('');
  mountIcons(D.messageMenuActions);
  qsa('.message-action-row', D.messageMenuActions).forEach(function (el) { addPressFeedback(el); });

  setInert(D.messageMenuOverlay, false);
  D.messageMenuOverlay.classList.add('open');
}
function closeMessageMenu() {
  D.messageMenuOverlay.classList.remove('open');
  setInert(D.messageMenuOverlay, true);
  activeMenuMid = null;
}

function confirmMessageDelete(mid) {
  showConfirm({
    title: 'Удалить сообщение?',
    actions: [
      { label: 'Удалить у всех', danger: true, onSelect: function () { deleteMessage(mid); } },
      { label: 'Удалить у меня', danger: true, onSelect: function () { deleteMessage(mid); } }
    ]
  });
}
function deleteMessage(mid) {
  var chat = getChat(state.activeChatId);
  if (!chat) return;
  chat.messages = chat.messages.filter(function (m) { return String(m.id) !== String(mid); });
  if (chat.pinnedMessageId && String(chat.pinnedMessageId) === String(mid)) chat.pinnedMessageId = null;
  renderMessages(chat);
  renderPinnedBanner(chat);
  showToast('Сообщение удалено');
}

function openForwardSheet(mid) {
  forwardPendingMid = mid;
  D.forwardContactList.innerHTML = activeChats().map(function (c) {
    return '<button class="contact-row" data-id="' + c.id + '">' +
      '<span class="avatar" style="width:42px;height:42px;font-size:15px;--c1:' + c.palette[0] + ';--c2:' + c.palette[1] + '"><span>' + c.initials + '</span></span>' +
      '<span class="contact-row-text"><span class="contact-row-name">' + escapeHtml(c.name) + '</span></span></button>';
  }).join('');
  qsa('.contact-row', D.forwardContactList).forEach(function (el) { addPressFeedback(el); });
  setInert(D.forwardOverlay, false);
  D.forwardOverlay.classList.add('open');
}
function closeForwardSheet() {
  D.forwardOverlay.classList.remove('open');
  setInert(D.forwardOverlay, true);
  forwardPendingMid = null;
}

/* ---------------------------------------------------------------------- */
/* OPEN CHAT                                                                 */
/* ---------------------------------------------------------------------- */
function openChat(id) {
  var chat = getChat(id);
  if (!chat) return;
  chat.unread = 0;
  state.activeChatId = id;
  D.chatHeaderName.textContent = chat.name;
  D.chatHeaderAvatar.style.setProperty('--c1', chat.palette[0]);
  D.chatHeaderAvatar.style.setProperty('--c2', chat.palette[1]);
  D.chatHeaderAvatar.innerHTML = '<span>' + chat.initials + '</span>';
  D.chatHeaderStatus.textContent = chat.online ? 'в сети' : ('был(а) ' + relativeLastSeen(chat.lastSeenTs || NOW));
  D.chatHeaderStatus.classList.toggle('is-online', chat.online);
  resetInputState();
  clearReplyTarget();
  closeChatSearch();
  renderPinnedBanner(chat);
  renderMessages(chat);
  scrollChatToBottom(false);
  pushScreen('chat');
  renderChatList();
}

/* ---------------------------------------------------------------------- */
/* CHAT PREVIEW (long-press)                                                 */
/* ---------------------------------------------------------------------- */
function openChatPreview(id) {
  var chat = getChat(id);
  if (!chat) return;
  D.previewName.textContent = chat.name;
  var groups = computeGroups(chat.messages.slice(-14));
  D.previewMessages.innerHTML = groups.map(function (g) {
    if (g.kind === 'divider') return '<div class="date-divider"><span>' + g.label + '</span></div>';
    return messageRowHTML(g.msg, g.groupStart);
  }).join('');
  mountIcons(D.previewMessages);
  D.previewPinLabel.textContent = chat.pinned ? 'Открепить' : 'Закрепить';
  D.previewArchiveLabel.textContent = chat.archived ? 'Разархивировать' : 'Архивировать';
  D.previewOverlay.dataset.id = String(id);
  setInert(D.previewOverlay, false);
  D.previewOverlay.classList.add('open');
  requestAnimationFrame(function () { D.previewMessages.scrollTop = D.previewMessages.scrollHeight; });
}
function closeChatPreview() { D.previewOverlay.classList.remove('open'); setInert(D.previewOverlay, true); }

/* ---------------------------------------------------------------------- */
/* AVATAR PREVIEW                                                            */
/* ---------------------------------------------------------------------- */
function openAvatarPreview(person) {
  D.avatarPreviewSquare.style.setProperty('--c1', person.palette[0]);
  D.avatarPreviewSquare.style.setProperty('--c2', person.palette[1]);
  D.avatarPreviewSquare.textContent = person.initials;
  setInert(D.avatarPreviewOverlay, false);
  D.avatarPreviewOverlay.classList.add('open');
}
function closeAvatarPreview() { D.avatarPreviewOverlay.classList.remove('open'); setInert(D.avatarPreviewOverlay, true); }

/* ---------------------------------------------------------------------- */
/* CONTACT PROFILE                                                           */
/* ---------------------------------------------------------------------- */
function renderMediaGrid(chat) {
  var n = 3 + (chat.id % 4);
  var tiles = [];
  for (var i = 0; i < n; i++) {
    var p = AVATAR_PALETTES[(chat.id + i) % AVATAR_PALETTES.length];
    var icon = i % 3 === 0 ? 'video' : 'photo';
    tiles.push('<div class="media-tile" style="background:linear-gradient(150deg,' + p[0] + ',' + p[1] + ')"><i class="icon" data-icon="' + icon + '"></i></div>');
  }
  D.mediaGrid.innerHTML = tiles.join('');
  mountIcons(D.mediaGrid);
  D.mediaCount.textContent = String(n);
}
function openContactProfile(id) {
  var chat = getChat(id);
  if (!chat) return;
  D.contactProfileAvatar.style.setProperty('--c1', chat.palette[0]);
  D.contactProfileAvatar.style.setProperty('--c2', chat.palette[1]);
  D.contactProfileAvatar.innerHTML = '<span>' + chat.initials + '</span>';
  D.contactProfileName.textContent = chat.name;
  D.contactProfileStatus.textContent = chat.online ? 'в сети' : ('был(а) ' + relativeLastSeen(chat.lastSeenTs || NOW));
  D.contactProfileStatus.classList.toggle('is-online', chat.online);
  D.contactMuteLabel.textContent = chat.muted ? 'Звук' : 'Без звука';
  D.contactMuteBtn.classList.toggle('is-active', chat.muted);
  D['screen-profile-contact'].dataset.id = String(id);
  D.contactTrackCard.hidden = !chat.track;
  if (chat.track) { D.contactTrackTitle.textContent = chat.track.title; D.contactTrackArtist.textContent = chat.track.artist; }
  D.cPhone.textContent = chat.phone;
  D.cTag.textContent = chat.tag;
  D.cBirthday.textContent = chat.birthday;
  D.cBio.textContent = chat.bio;
  renderMediaGrid(chat);
  pushScreen('profile-contact');
}

/* ---------------------------------------------------------------------- */
/* SELF PROFILE                                                              */
/* ---------------------------------------------------------------------- */
function renderSelfProfile() {
  D.selfProfileName.textContent = currentUser.name;
  D.selfProfileTag.textContent = currentUser.tag;
  D.sPhone.textContent = currentUser.phone;
  D.sTag.textContent = currentUser.tag;
  D.sBirthday.textContent = currentUser.birthday;
  D.sBio.textContent = currentUser.bio;
  D.settingsName.textContent = currentUser.name;
  D.settingsTag.textContent = currentUser.tag;
  if (currentUser.track) {
    D.selfTrackTitle.textContent = currentUser.track.title;
    D.selfTrackArtist.textContent = currentUser.track.artist;
  }
  qsa('[data-avatar="me"]').forEach(function (el) {
    el.style.setProperty('--c1', currentUser.palette[0]);
    el.style.setProperty('--c2', currentUser.palette[1]);
    if (!el.querySelector('span')) el.innerHTML = '<span>' + currentUser.initials + '</span>';
    else el.querySelector('span').textContent = currentUser.initials;
  });
}
function wireTrackPlay(btn) {
  btn.addEventListener('click', function () {
    var willPlay = !btn.classList.contains('is-playing');
    qsa('.track-play.is-playing').forEach(function (b) {
      b.classList.remove('is-playing');
      var ic = b.querySelector('[data-icon]');
      if (ic) { ic.setAttribute('data-icon', 'play'); mountIcons(b); }
    });
    btn.classList.toggle('is-playing', willPlay);
    var icon = btn.querySelector('[data-icon]');
    if (icon) { icon.setAttribute('data-icon', willPlay ? 'pause' : 'play'); mountIcons(btn); }
  });
}

/* ---------------------------------------------------------------------- */
/* PINNED TRACK PICKER                                                      */
/* ---------------------------------------------------------------------- */
const TRACK_LIBRARY = [
  { title: 'Вечерний бриз', artist: 'Тихий берег' },
  { title: 'Городской шум', artist: 'Ночной маршрут' },
  { title: 'Синий час', artist: 'Кофе и дождь' },
  { title: 'Медленный вальс', artist: 'Бумажный самолёт' },
  { title: 'Летние вспышки', artist: 'Розовый закат' },
  { title: 'Немного тишины', artist: 'Городской бриз' },
  { title: 'Дальний путь', artist: 'Осенний джаз' },
  { title: 'Тихий свет', artist: 'Мятная волна' },
  { title: 'Первый снег', artist: 'Тёплый плед' }
];
function trackKey(t) { return t ? (t.title + '|' + t.artist) : ''; }
function openTrackPicker() {
  var currentKey = trackKey(currentUser.track);
  D.trackPickerList.innerHTML = TRACK_LIBRARY.map(function (t) {
    var selected = trackKey(t) === currentKey;
    return '<button class="contact-row" data-title="' + escapeHtml(t.title) + '" data-artist="' + escapeHtml(t.artist) + '">' +
      '<span class="track-art" style="width:42px;height:42px;flex-shrink:0;"><i class="icon" data-icon="music"></i></span>' +
      '<span class="contact-row-text"><span class="contact-row-name">' + escapeHtml(t.title) + '</span><span class="contact-row-sub">' + escapeHtml(t.artist) + '</span></span>' +
      (selected ? '<i class="icon" data-icon="checkmark" style="color:var(--accent);font-size:18px;"></i>' : '') +
      '</button>';
  }).join('');
  mountIcons(D.trackPickerList);
  qsa('.contact-row', D.trackPickerList).forEach(function (el) { addPressFeedback(el); });
  setInert(D.trackPickerOverlay, false);
  D.trackPickerOverlay.classList.add('open');
}
function closeTrackPicker() {
  D.trackPickerOverlay.classList.remove('open');
  setInert(D.trackPickerOverlay, true);
}

/* ---------------------------------------------------------------------- */
/* SETTINGS — GENERIC DETAIL SCREENS                                        */
/* ---------------------------------------------------------------------- */
const LANGUAGES = ['Русский', 'English', 'Deutsch', 'Français', 'Español', '中文'];
const APPEARANCE_OPTIONS = ['Тёмная', 'Светлая', 'Системная'];
const APPEARANCE_TO_THEME = { 'Тёмная': 'dark', 'Светлая': 'light', 'Системная': 'system' };
const THEME_TO_APPEARANCE = { dark: 'Тёмная', light: 'Светлая', system: 'Системная' };
const GROUPING_OPTIONS = ['По времени', 'По папкам', 'По непрочитанным'];
let selectedLanguage = 'Русский';
let selectedAppearance = THEME_TO_APPEARANCE[selectedTheme] || 'Тёмная';
let selectedGrouping = 'По времени';

function toggleRowHTML(label, id, on) {
  return '<div class="detail-row"><span class="detail-row-label">' + label + '</span>' +
    '<span class="ios-toggle' + (on ? ' on' : '') + '" data-toggle="' + id + '"></span></div>';
}
function checkRowHTML(label, selected) {
  return '<button class="detail-row' + (selected ? ' is-selected' : '') + '" data-select="' + escapeHtml(label) + '">' +
    '<span class="detail-row-label">' + escapeHtml(label) + '</span>' +
    '<i class="icon detail-row-check" data-icon="checkmark"></i></button>';
}

const DETAIL_SCREENS = {
  privacy: {
    title: 'Конфиденциальность',
    html: function () {
      return '<div class="glass-card settings-group">' +
        toggleRowHTML('Показывать «в сети»', 'online', true) +
        toggleRowHTML('Показывать дату рождения', 'birthday', true) +
        toggleRowHTML('Подтверждение о прочтении', 'read', true) +
        '</div><div class="glass-card settings-group">' +
        toggleRowHTML('Приглашения в группы', 'invites', true) +
        '</div><p class="detail-note">Эти настройки определяют, какую информацию о вас видят другие пользователи.</p>';
    }
  },
  notifications: {
    title: 'Уведомления',
    html: function () {
      return '<div class="glass-card settings-group">' +
        toggleRowHTML('Показывать уведомления', 'show', true) +
        toggleRowHTML('Звук', 'sound', true) +
        toggleRowHTML('Превью сообщений', 'preview', true) +
        '</div>';
    }
  },
  devices: {
    title: 'Устройства',
    html: function () {
      return '<div class="glass-card settings-group">' +
        '<div class="detail-row"><span class="settings-icon settings-icon--blue"><i class="icon" data-icon="laptop"></i></span><span class="detail-row-label">Этот браузер</span></div>' +
        '<div class="detail-row"><span class="settings-icon settings-icon--gray"><i class="icon" data-icon="phone"></i></span><span class="detail-row-label">iPhone · вчера в 21:14</span></div>' +
        '</div><p class="detail-note">Список устройств, где выполнен вход в аккаунт.</p>';
    }
  },
  data: {
    title: 'Данные',
    html: function () {
      return '<div class="glass-card settings-group">' +
        toggleRowHTML('Автозагрузка медиа', 'autoDl', true) +
        toggleRowHTML('Экономия трафика', 'saveData', false) +
        '</div><div class="glass-card settings-group">' +
        '<button class="detail-row" id="clearCacheBtn"><span class="detail-row-label" style="color:var(--danger)">Очистить кэш</span></button>' +
        '</div>';
    }
  },
  appearance: {
    title: 'Оформление',
    html: function () {
      return '<div class="glass-card settings-group">' +
        APPEARANCE_OPTIONS.map(function (o) { return checkRowHTML(o, o === selectedAppearance); }).join('') +
        '</div>' +
        '<p class="section-label">Акцентный цвет</p>' +
        '<div class="glass-card accent-picker-card"><div class="accent-swatch-row">' +
        ACCENT_OPTIONS.map(function (a) {
          return '<button class="accent-swatch' + (a.key === selectedAccent ? ' is-selected' : '') + '" data-accent-key="' + a.key + '" aria-label="' + a.label + '" style="--sw:var(--accent-swatch-' + a.key + ')"><i class="icon" data-icon="checkmark"></i></button>';
        }).join('') +
        '</div></div>' +
        '<p class="detail-note">Приложение оптимизировано для тёмной темы с эффектом «жидкого стекла».</p>';
    }
  },
  grouping: {
    title: 'Группировка чатов',
    html: function () {
      return '<div class="glass-card settings-group">' +
        GROUPING_OPTIONS.map(function (o) { return checkRowHTML(o, o === selectedGrouping); }).join('') +
        '</div>';
    }
  },
  language: {
    title: 'Язык',
    html: function () {
      return '<div class="glass-card settings-group">' +
        LANGUAGES.map(function (l) { return checkRowHTML(l, l === selectedLanguage); }).join('') +
        '</div>';
    }
  },
  support: {
    title: 'Поддержка',
    html: function () {
      return '<div class="glass-card settings-group">' +
        '<button class="detail-row"><span class="detail-row-label">Связаться с поддержкой</span><i class="icon chevron-icon" data-icon="chevronRight"></i></button>' +
        '<button class="detail-row"><span class="detail-row-label">Часто задаваемые вопросы</span><i class="icon chevron-icon" data-icon="chevronRight"></i></button>' +
        '</div>';
    }
  },
  about: {
    title: 'О приложении',
    html: function () {
      return '<div class="about-hero"><div class="about-icon"><i class="icon" data-icon="bubble"></i></div><h3>Сообщения</h3><span>Версия ' + APP_VERSION + '</span></div>' +
        '<div class="glass-card settings-group">' +
        '<button class="detail-row"><span class="detail-row-label">Условия использования</span><i class="icon chevron-icon" data-icon="chevronRight"></i></button>' +
        '<button class="detail-row"><span class="detail-row-label">Политика конфиденциальности</span><i class="icon chevron-icon" data-icon="chevronRight"></i></button>' +
        '</div>';
    }
  }
};

function syncSettingsRowValues() {
  var map = { appearance: selectedAppearance, grouping: selectedGrouping, language: selectedLanguage };
  Object.keys(map).forEach(function (key) {
    var valueEl = qs('.settings-row[data-detail="' + key + '"] .settings-row-value');
    if (valueEl) valueEl.textContent = map[key];
  });
}

function openDetailScreen(key) {
  var def = DETAIL_SCREENS[key];
  if (!def) return;
  state.activeDetailKey = key;
  D.genericDetailTitle.textContent = def.title;
  D.genericDetailContent.innerHTML = def.html();
  mountIcons(D.genericDetailContent);
  qsa('.ios-toggle', D.genericDetailContent).forEach(function (t) {
    addPressFeedback(t);
    t.addEventListener('click', function () { t.classList.toggle('on'); });
  });
  qsa('[data-select]', D.genericDetailContent).forEach(function (row) {
    addPressFeedback(row);
    row.addEventListener('click', function () {
      qsa('[data-select]', D.genericDetailContent).forEach(function (r) { r.classList.remove('is-selected'); });
      row.classList.add('is-selected');
      var val = row.dataset.select;
      if (key === 'language') selectedLanguage = val;
      if (key === 'grouping') selectedGrouping = val;
      if (key === 'appearance') { selectedAppearance = val; applyTheme(APPEARANCE_TO_THEME[val] || 'dark'); }
      syncSettingsRowValues();
    });
  });
  qsa('.accent-swatch', D.genericDetailContent).forEach(function (btn) {
    addPressFeedback(btn);
    btn.addEventListener('click', function () {
      applyAccent(btn.dataset.accentKey);
      qsa('.accent-swatch', D.genericDetailContent).forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      if (navigator.vibrate) { try { navigator.vibrate(6); } catch (err) {} }
    });
  });
  var clearBtn = qs('#clearCacheBtn', D.genericDetailContent);
  if (clearBtn) clearBtn.addEventListener('click', function () { showToast('Кэш очищен'); });
  pushScreen('detail-generic');
}

/* ---------------------------------------------------------------------- */
/* NEW CHAT SHEET                                                            */
/* ---------------------------------------------------------------------- */
function renderNewChatContacts(query) {
  var list = chats.slice().sort(function (a, b) { return a.name.localeCompare(b.name, 'ru'); });
  if (query) {
    var q = query.trim().toLowerCase();
    list = list.filter(function (c) { return c.name.toLowerCase().indexOf(q) !== -1 || c.tag.toLowerCase().indexOf(q) !== -1; });
  }
  D.newChatContactList.innerHTML = list.map(function (c) {
    return '<button class="contact-row" data-id="' + c.id + '">' +
      '<span class="avatar" style="width:42px;height:42px;font-size:15px;--c1:' + c.palette[0] + ';--c2:' + c.palette[1] + '"><span>' + c.initials + '</span></span>' +
      '<span class="contact-row-text"><span class="contact-row-name">' + escapeHtml(c.name) + '</span><span class="contact-row-sub">' + escapeHtml(c.tag) + '</span></span>' +
      '</button>';
  }).join('');
  qsa('.contact-row', D.newChatContactList).forEach(function (el) { addPressFeedback(el); });
}
function openNewChatSheet() {
  renderNewChatContacts('');
  D.newChatSearchInput.value = '';
  setInert(D.newChatOverlay, false);
  D.newChatOverlay.classList.add('open');
}
function closeNewChatSheet() { D.newChatOverlay.classList.remove('open'); setInert(D.newChatOverlay, true); }

/* ---------------------------------------------------------------------- */
/* INPUT BAR — mic / camera / send / voice recording                        */
/* ---------------------------------------------------------------------- */
let inputMode = 'mic';
let recording = null;
let sendPress = null;

function resetInputState() {
  inputMode = 'mic';
  D.messageInput.textContent = '';
  D.recordingUI.hidden = true;
  D.sendBtn.classList.remove('is-recording', 'is-send');
  D.sendBtnIcon.setAttribute('data-icon', 'mic');
  mountIcons(D.sendBtn);
}
function swapSendIcon(name) {
  if (D.sendBtnIcon.getAttribute('data-icon') === name) return;
  D.sendBtnIcon.classList.add('icon-swap');
  setTimeout(function () {
    D.sendBtnIcon.setAttribute('data-icon', name);
    mountIcons(D.sendBtn);
    requestAnimationFrame(function () { D.sendBtnIcon.classList.remove('icon-swap'); });
  }, 130);
}
function updateSendButton() {
  var hasText = D.messageInput.textContent.trim().length > 0;
  if (hasText) {
    inputMode = 'typing';
    D.sendBtn.classList.add('is-send');
    swapSendIcon('arrowUp');
  } else {
    D.sendBtn.classList.remove('is-send');
    if (inputMode === 'typing') inputMode = 'mic';
    swapSendIcon(inputMode === 'camera' ? 'camera' : 'mic');
  }
}

function startRecording(kind) {
  recording = { start: Date.now(), cancelling: false, kind: kind || 'voice' };
  D.recordingUI.hidden = false;
  D.recordingUI.classList.remove('is-cancelling');
  D.recordingUI.classList.toggle('is-video', recording.kind === 'video');
  D.sendBtn.classList.add('is-recording');
  D.recordingTimer.textContent = '0:00';
  recording.interval = setInterval(function () {
    var sec = Math.floor((Date.now() - recording.start) / 1000);
    D.recordingTimer.textContent = formatDuration(sec);
  }, 200);
  if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
}
function stopRecording(cancelled) {
  if (!recording) return;
  clearInterval(recording.interval);
  var duration = Math.max(1, Math.round((Date.now() - recording.start) / 1000));
  var wasCancelled = cancelled || recording.cancelling;
  var kind = recording.kind;
  D.recordingUI.hidden = true;
  D.recordingUI.classList.remove('is-video');
  D.sendBtn.classList.remove('is-recording');
  recording = null;
  if (!wasCancelled && state.activeChatId) {
    if (kind === 'video') {
      addOutgoingMessage(state.activeChatId, { type: 'video', duration: duration });
      showToast('Видеосообщение отправлено');
    } else {
      addOutgoingMessage(state.activeChatId, { type: 'voice', duration: duration });
      showToast('Голосовое сообщение отправлено');
    }
    inputMode = 'mic';
    swapSendIcon('mic');
  } else if (wasCancelled) {
    showToast('Запись отменена');
  }
}
function flashScreen() {
  var f = document.createElement('div');
  f.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:999;opacity:.85;pointer-events:none;transition:opacity .35s ease;';
  document.body.appendChild(f);
  requestAnimationFrame(function () { f.style.opacity = '0'; });
  setTimeout(function () { f.remove(); }, 380);
}
function simulateCameraCapture() {
  flashScreen();
  if (state.activeChatId) addOutgoingMessage(state.activeChatId, { type: 'photo' });
  inputMode = 'mic';
  swapSendIcon('mic');
}
function onSendPointerDown(e) {
  if (inputMode === 'typing' || sendPress) return;
  try { D.sendBtn.setPointerCapture(e.pointerId); } catch (err) {}
  sendPress = { startX: e.clientX, longFired: false, pointerId: e.pointerId };
  sendPress.timer = setTimeout(function () {
    if (!sendPress) return;
    sendPress.longFired = true;
    startRecording(inputMode === 'camera' ? 'video' : 'voice');
  }, 260);
}
function onSendPointerMove(e) {
  if (!sendPress || e.pointerId !== sendPress.pointerId || !recording) return;
  var dx = e.clientX - sendPress.startX;
  var cancelling = dx < -70;
  D.recordingUI.classList.toggle('is-cancelling', cancelling);
  recording.cancelling = cancelling;
}
function finishSendPress(e) {
  if (!sendPress) return;
  if (e && e.pointerId !== undefined && e.pointerId !== sendPress.pointerId) return;
  clearTimeout(sendPress.timer);
  var wasLong = sendPress.longFired;
  sendPress = null;
  if (wasLong) { stopRecording(recording && recording.cancelling); return; }
  if (inputMode === 'mic') { inputMode = 'camera'; swapSendIcon('camera'); }
  else if (inputMode === 'camera') { simulateCameraCapture(); }
}
function sendTextMessage() {
  var text = D.messageInput.textContent.trim();
  if (!text || !state.activeChatId) return;
  D.messageInput.textContent = '';
  updateSendButton();
  var partial = { type: 'text', text: text };
  if (state.replyTarget) { partial.replyTo = { name: state.replyTarget.name, text: state.replyTarget.text }; }
  clearReplyTarget();
  addOutgoingMessage(state.activeChatId, partial);
}

/* ---------------------------------------------------------------------- */
/* SENDING / AUTO-REPLY SIMULATION                                          */
/* ---------------------------------------------------------------------- */
let statusTimers = [];
function clearStatusTimers() { statusTimers.forEach(clearTimeout); statusTimers = []; }
function addOutgoingMessage(chatId, partial) {
  var chat = getChat(chatId);
  if (!chat) return;
  var base = { id: 'm-out-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), from: 'me', ts: Date.now(), duration: 0, text: '', replyTo: null, status: 'sent' };
  var msg = Object.assign(base, partial);
  chat.messages.push(msg);
  chat.lastTs = msg.ts;
  if (state.activeChatId === chatId) { renderMessages(chat); scrollChatToBottom(true); }
  renderChatList();
  clearStatusTimers();
  statusTimers.push(setTimeout(function () {
    msg.status = 'delivered';
    if (state.activeChatId === chatId) renderMessages(chat);
  }, 700));
  statusTimers.push(setTimeout(function () {
    msg.status = 'read';
    if (state.activeChatId === chatId) renderMessages(chat);
    triggerAutoReply(chat);
  }, 2200));
}
const CANNED_REPLIES = [
  'Хорошо, поняла 👍', 'Ага, договорились', 'Окей, спишемся позже', 'Отлично, спасибо!',
  'Хм, дай подумать', 'Согласен, так и сделаем', 'Ты как всегда вовремя 🙂', 'Понял, отвечу чуть позже подробнее'
];
function showTypingIndicator() {
  if (qs('#typingRow')) return;
  var row = document.createElement('div');
  row.id = 'typingRow';
  row.className = 'msg-row in msg-row--group-start';
  row.innerHTML = '<div class="bubble in bubble--tail typing-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  D.chatMessages.appendChild(row);
  scrollChatToBottom(true);
}
function hideTypingIndicator() { var row = qs('#typingRow'); if (row) row.remove(); }
function triggerAutoReply(chat) {
  chat.typing = true;
  if (state.activeChatId === chat.id) { showTypingIndicator(); renderChatList(); }
  var delay = 1200 + Math.random() * 900;
  setTimeout(function () {
    chat.typing = false;
    if (state.activeChatId === chat.id) hideTypingIndicator();
    var reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
    var msg = { id: 'm-in-' + Date.now(), from: 'them', type: 'text', text: reply, ts: Date.now(), duration: 0, replyTo: null, status: null };
    chat.messages.push(msg);
    chat.lastTs = msg.ts;
    if (state.activeChatId === chat.id) { renderMessages(chat); scrollChatToBottom(true); }
    renderChatList();
  }, delay);
}

/* ---------------------------------------------------------------------- */
/* INIT                                                                      */
/* ---------------------------------------------------------------------- */
let paletteCycleIdx = 0;

/* ---------------------------------------------------------------------- */
/* VIEWPORT / KEYBOARD FIX                                                   */
/* ---------------------------------------------------------------------- */
function setupViewportFix() {
  var vv = window.visualViewport;
  if (!vv) return;
  var raf = null;
  function apply() {
    document.documentElement.style.setProperty('--vvh', vv.height + 'px');
    if (D.appShell) {
      var offset = vv.offsetTop || 0;
      D.appShell.style.transform = offset > 0.5 ? 'translateY(' + (-offset) + 'px)' : '';
    }
  }
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; apply(); });
  }
  vv.addEventListener('resize', schedule);
  vv.addEventListener('scroll', schedule);
  apply();
}

function init() {
  grabRefs();
  SCREEN_EL.chatlist = qs('#screen-chatlist');
  SCREEN_EL.settings = qs('#screen-settings');
  SCREEN_EL['detail-generic'] = qs('#screen-detail-generic');
  SCREEN_EL['profile-self'] = qs('#screen-profile-self');
  SCREEN_EL['profile-edit'] = qs('#screen-profile-edit');
  SCREEN_EL.chat = qs('#screen-chat');
  SCREEN_EL['profile-contact'] = qs('#screen-profile-contact');
  SCREEN_EL.archive = qs('#screen-archive');
  window.addEventListener('resize', function () { syncStackUI(); });

  mountIcons(document);
  D.settingsVersionFooter.textContent = 'Мессенджер · версия ' + APP_VERSION;
  renderSelfProfile();
  renderChatList();
  initChatListGestures(D.chatList);
  initChatListGestures(D.archiveChatList);
  initArchivePull();

  qsa('button').forEach(function (b) { addPressFeedback(b); });
  qsa('.track-play').forEach(wireTrackPlay);

  /* -- Settings -- */
  D.openSettingsBtn.addEventListener('click', function () { pushScreen('settings'); });
  D.settingsProfileRow.addEventListener('click', function () { pushScreen('profile-self'); });
  D['screen-settings'].addEventListener('click', function (e) {
    var row = e.target.closest('[data-detail]');
    if (row) openDetailScreen(row.dataset.detail);
  });

  /* -- New chat sheet -- */
  D.openNewChatBtn.addEventListener('click', openNewChatSheet);
  D.newChatCancelBtn.addEventListener('click', closeNewChatSheet);
  D.newChatOverlay.addEventListener('click', function (e) { if (e.target === D.newChatOverlay) closeNewChatSheet(); });
  D.newChatSearchInput.addEventListener('input', function () { renderNewChatContacts(D.newChatSearchInput.value); });
  D.newChatContactList.addEventListener('click', function (e) {
    var row = e.target.closest('.contact-row');
    if (!row) return;
    var id = Number(row.dataset.id);
    closeNewChatSheet();
    setTimeout(function () { resetToRoot(); openChat(id); }, 260);
  });
  qsa('.action-row').forEach(function (b) {
    b.addEventListener('click', function () { showToast('Эта функция скоро появится'); });
  });

  /* -- Chat list search -- */
  var RECENT_SEARCHES = (function () {
    try { return JSON.parse(loadSetting('recentSearches', '[]')); } catch (err) { return []; }
  })();
  function saveRecentSearches() { saveSetting('recentSearches', JSON.stringify(RECENT_SEARCHES.slice(0, 8))); }
  function addRecentSearch(q) {
    q = q.trim();
    if (!q) return;
    RECENT_SEARCHES = RECENT_SEARCHES.filter(function (r) { return r.toLowerCase() !== q.toLowerCase(); });
    RECENT_SEARCHES.unshift(q);
    RECENT_SEARCHES = RECENT_SEARCHES.slice(0, 8);
    saveRecentSearches();
  }
  function renderRecentSearches() {
    if (!RECENT_SEARCHES.length) {
      D.recentSearchList.innerHTML = '<p class="detail-note" style="padding:8px 4px;">Здесь появятся ваши недавние запросы</p>';
      return;
    }
    D.recentSearchList.innerHTML = RECENT_SEARCHES.map(function (q, i) {
      return '<button class="recent-search-row" data-q="' + escapeHtml(q) + '">' +
        '<i class="icon" data-icon="search"></i><span class="rs-label">' + escapeHtml(q) + '</span>' +
        '<span class="rs-remove" data-remove-idx="' + i + '"><i class="icon" data-icon="xmarkCircle"></i></span></button>';
    }).join('');
    mountIcons(D.recentSearchList);
    qsa('.recent-search-row', D.recentSearchList).forEach(function (el) { addPressFeedback(el); });
  }
  function showRecentPanel() {
    renderRecentSearches();
    D.recentSearchPanel.hidden = false;
    D.chatList.hidden = true;
  }
  function hideRecentPanel() {
    D.recentSearchPanel.hidden = true;
    D.chatList.hidden = false;
  }
  D.chatSearchInput.addEventListener('focus', function () {
    D.chatSearchBar.classList.add('is-focused');
    D.searchWrap.classList.add('is-active');
    if (!D.chatSearchInput.value) showRecentPanel();
  });
  D.chatSearchInput.addEventListener('blur', function () {
    if (!D.chatSearchInput.value) D.chatSearchBar.classList.remove('is-focused');
  });
  D.chatSearchInput.addEventListener('input', function () {
    state.searchQuery = D.chatSearchInput.value;
    D.chatSearchBar.classList.toggle('has-value', !!state.searchQuery);
    if (state.searchQuery) hideRecentPanel(); else showRecentPanel();
    renderChatList();
  });
  D.chatSearchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && D.chatSearchInput.value.trim()) addRecentSearch(D.chatSearchInput.value);
  });
  D.recentSearchList.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('[data-remove-idx]');
    if (removeBtn) {
      RECENT_SEARCHES.splice(Number(removeBtn.dataset.removeIdx), 1);
      saveRecentSearches();
      renderRecentSearches();
      return;
    }
    var row = e.target.closest('.recent-search-row');
    if (!row) return;
    D.chatSearchInput.value = row.dataset.q;
    state.searchQuery = row.dataset.q;
    D.chatSearchBar.classList.add('has-value');
    hideRecentPanel();
    renderChatList();
  });
  D.searchClearBtn.addEventListener('click', function () {
    D.chatSearchInput.value = ''; state.searchQuery = '';
    D.chatSearchBar.classList.remove('has-value');
    showRecentPanel();
    renderChatList();
    D.chatSearchInput.focus();
  });
  D.searchCancelBtn.addEventListener('click', function () {
    if (D.chatSearchInput.value.trim()) addRecentSearch(D.chatSearchInput.value);
    D.chatSearchInput.value = ''; state.searchQuery = '';
    D.chatSearchBar.classList.remove('has-value', 'is-focused');
    D.searchWrap.classList.remove('is-active');
    D.chatSearchInput.blur();
    hideRecentPanel();
    renderChatList();
  });

  /* -- Self profile / edit -- */
  D.editProfileBtn.addEventListener('click', function () {
    D.editName.value = currentUser.name;
    D.editBio.value = currentUser.bio;
    D.editBirthday.value = currentUser.birthday;
    D.editPhone.value = currentUser.phone;
    D.editTag.value = currentUser.tag;
    pushScreen('profile-edit');
  });
  D.editCancelBtn.addEventListener('click', function () { popScreen(); });
  D.editDoneBtn.addEventListener('click', function () {
    currentUser.name = D.editName.value.trim() || currentUser.name;
    currentUser.bio = D.editBio.value.trim();
    currentUser.birthday = D.editBirthday.value.trim();
    currentUser.phone = D.editPhone.value.trim();
    currentUser.tag = D.editTag.value.trim() || currentUser.tag;
    renderSelfProfile();
    popScreen();
    showToast('Профиль обновлён');
  });
  D.editAvatarBtn.addEventListener('click', function () {
    paletteCycleIdx = (paletteCycleIdx + 1) % AVATAR_PALETTES.length;
    currentUser.palette = AVATAR_PALETTES[paletteCycleIdx];
    qsa('[data-avatar="me"]').forEach(function (el) {
      el.style.setProperty('--c1', currentUser.palette[0]);
      el.style.setProperty('--c2', currentUser.palette[1]);
    });
    showToast('Фото обновлено');
  });
  D.shareProfileBtn.addEventListener('click', function () {
    var shareText = currentUser.name + ' ' + currentUser.tag;
    if (navigator.share) {
      navigator.share({ title: currentUser.name, text: shareText }).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(function () { showToast('Ссылка скопирована'); }).catch(function () { showToast(shareText); });
    } else {
      showToast(shareText);
    }
  });
  D.shareContactBtn.addEventListener('click', function () {
    var chat = getChat(state.activeChatId);
    if (!chat) return;
    var shareText = chat.name + ' ' + chat.tag;
    if (navigator.share) {
      navigator.share({ title: chat.name, text: shareText }).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(function () { showToast('Ссылка скопирована'); }).catch(function () { showToast(shareText); });
    } else {
      showToast(shareText);
    }
  });
  D.selfTrackCard.addEventListener('click', function (e) {
    if (e.target.closest('.track-play')) return;
    openTrackPicker();
  });
  addPressFeedback(D.selfTrackCard);
  D.trackPickerCancelBtn.addEventListener('click', closeTrackPicker);
  D.trackPickerOverlay.addEventListener('click', function (e) { if (e.target === D.trackPickerOverlay) closeTrackPicker(); });
  D.trackPickerList.addEventListener('click', function (e) {
    var row = e.target.closest('.contact-row');
    if (!row) return;
    currentUser.track = { title: row.dataset.title, artist: row.dataset.artist };
    closeTrackPicker();
    renderSelfProfile();
    showToast('Трек закреплён');
  });

  /* -- Chat conversation -- */
  (function () {
    var titleTimer = null, titleLongFired = false, titleStartX = 0, titleStartY = 0;
    D.chatTitleBtn.addEventListener('pointerdown', function (e) {
      titleLongFired = false;
      titleStartX = e.clientX; titleStartY = e.clientY;
      titleTimer = setTimeout(function () {
        titleLongFired = true;
        if (navigator.vibrate) { try { navigator.vibrate(8); } catch (err) {} }
        openChatSearch();
      }, LONG_PRESS_MS);
    });
    D.chatTitleBtn.addEventListener('pointermove', function (e) {
      if (Math.abs(e.clientX - titleStartX) > MOVE_THRESHOLD || Math.abs(e.clientY - titleStartY) > MOVE_THRESHOLD) {
        clearTimeout(titleTimer);
      }
    });
    D.chatTitleBtn.addEventListener('pointerup', function () { clearTimeout(titleTimer); });
    D.chatTitleBtn.addEventListener('pointercancel', function () { clearTimeout(titleTimer); });
    D.chatTitleBtn.addEventListener('click', function () {
      if (titleLongFired) { titleLongFired = false; return; }
      if (state.activeChatId) openContactProfile(state.activeChatId);
    });
  })();
  D.chatSearchInChatCloseBtn.addEventListener('click', closeChatSearch);
  D.chatSearchInChatInput.addEventListener('input', function (e) { runChatSearch(e.target.value); });
  D.chatSearchInChatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); stepChatSearch(-1); }
  });
  D.chatSearchNextBtn.addEventListener('click', function () { stepChatSearch(1); });
  D.chatSearchPrevBtn.addEventListener('click', function () { stepChatSearch(-1); });
  D.chatHeaderAvatarBtn.addEventListener('click', function () {
    var chat = getChat(state.activeChatId);
    if (chat) openAvatarPreview(chat);
  });
  D.attachBtn.addEventListener('click', function () { showToast('Выбор вложения'); });
  D.messageInput.addEventListener('input', updateSendButton);
  D.messageInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTextMessage(); }
  });
  D.sendBtn.addEventListener('pointerdown', onSendPointerDown);
  D.sendBtn.addEventListener('pointermove', onSendPointerMove);
  D.sendBtn.addEventListener('pointerup', finishSendPress);
  D.sendBtn.addEventListener('pointercancel', function (e) {
    if (!sendPress || (e.pointerId !== undefined && e.pointerId !== sendPress.pointerId)) return;
    clearTimeout(sendPress.timer);
    sendPress = null;
    if (recording) stopRecording(true);
  });
  D.sendBtn.addEventListener('click', function () { if (inputMode === 'typing') sendTextMessage(); });
  D.chatMessages.addEventListener('click', function (e) {
    var voiceBtn = e.target.closest('.voice-play');
    if (voiceBtn) {
      var playing = voiceBtn.classList.toggle('is-playing');
      var ic = voiceBtn.querySelector('[data-icon]');
      if (ic) { ic.setAttribute('data-icon', playing ? 'pause' : 'play'); mountIcons(voiceBtn); }
      var wave = voiceBtn.parentElement.querySelector('.voice-wave');
      if (wave) qsa('span', wave).forEach(function (s) { s.classList.toggle('played', playing); });
    }
    var circle = e.target.closest('.bubble-circle');
    if (circle) showToast('Воспроизведение видеосообщения');
  });

  /* -- Contact profile -- */
  D['screen-profile-contact'].addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.dataset.action;
    if (action === 'call-audio') showToast('Аудиозвонок');
    else if (action === 'call-video') showToast('Видеозвонок');
    else if (action === 'search-in-chat') { popScreen(); openChatSearch(); }
  });
  D.contactMuteBtn.addEventListener('click', function () {
    var id = Number(D['screen-profile-contact'].dataset.id);
    var chat = getChat(id);
    if (!chat) return;
    chat.muted = !chat.muted;
    D.contactMuteLabel.textContent = chat.muted ? 'Звук' : 'Без звука';
    D.contactMuteBtn.classList.toggle('is-active', chat.muted);
    renderChatList();
  });

  /* -- Chat preview overlay -- */
  D.previewCloseBtn.addEventListener('click', closeChatPreview);
  D.previewOverlay.addEventListener('click', function (e) { if (e.target === D.previewOverlay) closeChatPreview(); });
  D.previewArchiveBtn.addEventListener('click', function () {
    var id = Number(D.previewOverlay.dataset.id);
    var chat = getChat(id);
    closeChatPreview();
    if (!chat) return;
    chat.archived = !chat.archived;
    renderChatList();
    if (state.stack.indexOf('archive') !== -1) renderArchiveList();
    showToast(chat.archived ? 'Чат архивирован' : 'Чат восстановлен из архива');
  });
  D.previewPinBtn.addEventListener('click', function () {
    var id = Number(D.previewOverlay.dataset.id);
    var chat = getChat(id);
    if (chat) { chat.pinned = !chat.pinned; renderChatList(); showToast(chat.pinned ? 'Чат закреплён' : 'Чат откреплён'); }
    closeChatPreview();
  });

  /* -- Avatar preview overlay -- */
  D.avatarPreviewCloseBtn.addEventListener('click', closeAvatarPreview);
  D.avatarPreviewOverlay.addEventListener('click', function (e) { if (e.target === D.avatarPreviewOverlay) closeAvatarPreview(); });

  /* -- Message menu, reactions, reply, pin, forward -- */
  initMessageGestures();
  D.messageMenuOverlay.addEventListener('click', function (e) { if (e.target === D.messageMenuOverlay) closeMessageMenu(); });
  D.messageMenuCancelBtn.addEventListener('click', closeMessageMenu);
  D.quickReactions.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-reaction]');
    if (!btn || !activeMenuMid) return;
    var mid = activeMenuMid;
    var chat = getChat(state.activeChatId);
    var msg = chat && findMessage(state.activeChatId, mid);
    closeMessageMenu();
    if (!msg) return;
    msg.reaction = btn.dataset.reaction;
    renderMessages(chat);
  });
  D.messageMenuActions.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-msg-action]');
    if (!btn || !activeMenuMid) return;
    var mid = activeMenuMid;
    var action = btn.dataset.msgAction;
    closeMessageMenu();
    if (action === 'reply') setReplyTarget(mid);
    else if (action === 'copy') {
      var chat = getChat(state.activeChatId);
      var msg = chat && findMessage(state.activeChatId, mid);
      var text = messageSnippet(msg);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { showToast('Скопировано'); }).catch(function () { showToast('Скопировано'); });
      } else { showToast('Скопировано'); }
    } else if (action === 'pin') {
      var chat2 = getChat(state.activeChatId);
      if (chat2) {
        chat2.pinnedMessageId = chat2.pinnedMessageId === mid ? null : mid;
        renderPinnedBanner(chat2);
        showToast(chat2.pinnedMessageId ? 'Сообщение закреплено' : 'Сообщение откреплено');
      }
    } else if (action === 'forward') openForwardSheet(mid);
    else if (action === 'select') {
      var row = qs('.msg-row[data-mid="' + mid + '"]', D.chatMessages);
      if (row) row.classList.toggle('is-selected');
      showToast('Сообщение выделено');
    } else if (action === 'delete') confirmMessageDelete(mid);
  });
  D.replyPreviewCloseBtn.addEventListener('click', clearReplyTarget);
  D.pinnedMsgBanner.addEventListener('click', function (e) {
    if (e.target.closest('#pinnedMsgBannerCloseBtn')) return;
    var chat = getChat(state.activeChatId);
    if (chat && chat.pinnedMessageId) scrollToMessage(chat.pinnedMessageId, true);
  });
  D.pinnedMsgBannerCloseBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var chat = getChat(state.activeChatId);
    if (chat) { chat.pinnedMessageId = null; renderPinnedBanner(chat); showToast('Сообщение откреплено'); }
  });

  /* -- Forward sheet -- */
  D.forwardCancelBtn.addEventListener('click', closeForwardSheet);
  D.forwardOverlay.addEventListener('click', function (e) { if (e.target === D.forwardOverlay) closeForwardSheet(); });
  D.forwardContactList.addEventListener('click', function (e) {
    var row = e.target.closest('.contact-row');
    if (!row || !forwardPendingMid) return;
    var targetId = Number(row.dataset.id);
    var sourceChat = getChat(state.activeChatId);
    var msg = sourceChat && findMessage(state.activeChatId, forwardPendingMid);
    closeForwardSheet();
    var targetChat = getChat(targetId);
    if (!msg || !targetChat) return;
    var forwarded = Object.assign({}, msg, {
      id: 'fwd' + Date.now() + Math.floor(Math.random() * 1000),
      from: 'me', ts: Date.now(), status: 'sent', reaction: null,
      replyTo: null, forwardedFrom: sourceChat ? sourceChat.name : ''
    });
    targetChat.messages.push(forwarded);
    targetChat.lastTs = forwarded.ts;
    showToast('Переслано: ' + targetChat.name);
    renderChatList();
    if (state.activeChatId === targetId) { renderMessages(targetChat); scrollChatToBottom(true); }
  });

  /* -- Confirm modal -- */
  D.confirmActions.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-idx]');
    if (!btn) return;
    var action = confirmPendingActions[Number(btn.dataset.idx)];
    closeConfirm();
    if (action && action.onSelect) action.onSelect();
  });
  D.confirmCancelBtn.addEventListener('click', function () {
    var cb = confirmPendingCancel;
    closeConfirm();
    if (cb) cb();
  });
  D.confirmOverlay.addEventListener('click', function (e) { if (e.target === D.confirmOverlay) closeConfirm(); });

  /* -- Global back / escape -- */
  document.addEventListener('click', function (e) {
    var back = e.target.closest('[data-action="pop"]');
    if (back) popScreen();
    if (openSwipeId !== null && !e.target.closest('.chat-card[data-id="' + openSwipeId + '"]')) {
      closeSwipe(openSwipeId);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (D.confirmOverlay.classList.contains('open')) return closeConfirm();
    if (D.messageMenuOverlay.classList.contains('open')) return closeMessageMenu();
    if (D.forwardOverlay.classList.contains('open')) return closeForwardSheet();
    if (D.trackPickerOverlay.classList.contains('open')) return closeTrackPicker();
    if (D.avatarPreviewOverlay.classList.contains('open')) return closeAvatarPreview();
    if (D.previewOverlay.classList.contains('open')) return closeChatPreview();
    if (D.newChatOverlay.classList.contains('open')) return closeNewChatSheet();
    if (chatSearchState) return closeChatSearch();
    if (state.replyTarget) return clearReplyTarget();
    if (state.stack.length > 1) popScreen();
  });

  wireAllScrollHairlines();
  setupViewportFix();
  initEdgeSwipeBack();
  setInert(D.newChatOverlay, true);
  setInert(D.previewOverlay, true);
  setInert(D.avatarPreviewOverlay, true);
  setInert(D.messageMenuOverlay, true);
  setInert(D.forwardOverlay, true);
  setInert(D.confirmOverlay, true);
  setInert(D.trackPickerOverlay, true);
  setInert(D.replySwipeIcon, true);
  syncStackUI();
}

function wireAllScrollHairlines() {
  qsa('.screen').forEach(function (screen) {
    var navbar = screen.querySelector(':scope > .navbar');
    var scroller = screen.querySelector('.scroll-area, .chat-list, .chat-messages');
    if (navbar && scroller) {
      scroller.addEventListener('scroll', function () {
        navbar.classList.toggle('is-scrolled', scroller.scrollTop > 2);
      }, { passive: true });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
