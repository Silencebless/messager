/**
 * OLED Messenger — iOS 26 "Liquid Glass" build
 */

/* ---------------------------------------------------------------- DATA */

let chats = [
  {
    id: 1, name: "Anna Smirnova", avatar: "А", color: "#8B5CF6", online: true,
    lastMsg: "Отлично, тогда до встречи!", time: "14:32", unread: 0, muted: false, pinned: true,
    username: "@anna.smirnova", phone: "+7 (999) 123-45-67", birthday: "14 марта",
    bio: "Product designer. Люблю кофе и хорошие интерфейсы ☕️",
    pinnedTrack: { title: "Рок Стар (Sh)", artist: "PHARAOH" }
  },
  {
    id: 2, name: "Design Team", avatar: "D", color: "#FF9F0A", online: false,
    lastMsg: "Игорь: Залил макеты из Figma!", time: "13:05", unread: 3, muted: true, pinned: false,
    username: "@design_team", phone: "—", birthday: "—",
    bio: "Общий чат команды дизайна",
    pinnedTrack: { title: "Рок Стар (Sh)", artist: "PHARAOH" }
  },
  {
    id: 3, name: "Игорь Петров", avatar: "И", color: "#32ADE6", online: true,
    lastMsg: "Ок, созвонились", time: "Вчера", unread: 0, muted: false, pinned: false,
    username: "@igor.petrov", phone: "+7 (999) 555-11-22", birthday: "2 июля",
    bio: "Frontend разработчик",
    pinnedTrack: { title: "Рок Стар (Sh)", artist: "PHARAOH" }
  }
];

let globalContacts = [
  { id: 4, name: "Мама", avatar: "М", color: "#FF375F", online: true, username: "@mama", phone: "+7 (999) 000-11-22", birthday: "9 мая", bio: "❤️", pinnedTrack: { title: "Рок Стар (Sh)", artist: "PHARAOH" } },
  { id: 5, name: "Elon Musk", avatar: "E", color: "#FF3B30", online: true, username: "@elonmusk", phone: "скрыт", birthday: "28 июня", bio: "Occupy Mars", pinnedTrack: { title: "Рок Стар (Sh)", artist: "PHARAOH" } },
  { id: 6, name: "Tim Cook", avatar: "T", color: "#34C759", online: false, username: "@tim_cook", phone: "скрыт", birthday: "1 ноября", bio: "Think different.", pinnedTrack: { title: "Рок Стар (Sh)", artist: "PHARAOH" } }
];

let messagesData = {
  1: [
    { id: 101, text: "Привет! Как дела?", time: "14:28", type: "in" },
    { id: 102, text: "Привет, очень хорошо! Готов к продакшену 🚀", time: "14:29", type: "out", status: "read" },
    { id: 103, text: "", time: "14:30", type: "out", status: "read", mediaType: "image", mediaUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80" },
    { id: 104, text: "Отлично, тогда до встречи!", time: "14:32", type: "in" }
  ],
  3: [
    { id: 301, text: "Слушай, звонок в 15:00", time: "Вчера", type: "in" },
    { id: 302, text: "Ок, созвонились", time: "Вчера", type: "out", status: "read" }
  ]
};

let currentChatId = null;
let recordMode = 'audio';
let recentSearches = []; // {id, name, avatar, color}
let isSearchActive = false;
let ctxTarget = null; // {type: 'chat'|'message', id}

/* ---------------------------------------------------------------- DOM */

const DOM = {
  sidebarNav: document.getElementById('sidebarNav'),
  chatList: document.getElementById('chatList'),
  globalContactList: document.getElementById('globalContactList'),
  messagesArea: document.getElementById('messagesArea'),
  messageInput: document.getElementById('messageInput'),
  sendBtn: document.getElementById('sendBtn'),
  mediaBtn: document.getElementById('mediaBtn'),
  iconMic: document.getElementById('iconMic'),
  iconCam: document.getElementById('iconCam'),
  recordOverlay: document.getElementById('recordOverlay'),
  composerMain: document.getElementById('composerMain'),
  recordTimer: document.getElementById('recordTimer'),
  slideCancelText: document.getElementById('slideCancelText'),
  searchInput: document.getElementById('searchInput'),
  searchRow: document.getElementById('searchRow'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  searchState: document.getElementById('searchState'),
  recentSearchSection: document.getElementById('recentSearchSection'),
  recentSearchList: document.getElementById('recentSearchList'),
  searchResultsList: document.getElementById('searchResultsList'),
  searchEmptyState: document.getElementById('searchEmptyState'),
  ctxScrim: document.getElementById('ctxScrim'),
  ctxMenu: document.getElementById('ctxMenu'),
  ctxPreview: document.getElementById('ctxPreview'),
  ctxActions: document.getElementById('ctxActions'),
  toast: document.getElementById('toast'),
  settingsContent: document.getElementById('settingsContent'),
  profileContent: document.getElementById('profileContent')
};

/* ---------------------------------------------------------------- INIT */

function init() {
  renderChatList();
  renderGlobalContacts();
  renderSettings();
  setupEventListeners();
  setupSwipeGestures();
  setupRecordingGestures();
  setupLongPress();
  setupSidebarScroll();
}

/* ---------------------------------------------------------------- ICONS */

const ICONS = {
  check1: `<svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path d="M1 5.5 5 9.5 14 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  check2: `<svg width="19" height="11" viewBox="0 0 19 11" fill="none"><path d="M1 5.5 5 9.5 14 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 5.5 10 9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  clock: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  pin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 3a1 1 0 0 1 .8 1.6l-1.6 2.1 2 5.4a1 1 0 0 1-1 1.35H14l-2.3 6.9a.6.6 0 0 1-1.14 0L8.5 13.5H6.2a1 1 0 0 1-.9-1.6l2-4.9L5.7 4.6A1 1 0 0 1 6.5 3z"/></svg>`,
  mute: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m23 9-6 6M17 9l6 6"/></svg>`,
  reply: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17 4 12l5-5"/><path d="M4 12h10a6 6 0 0 1 6 6v1"/></svg>`,
  copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  forward: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="m15 17 5-5-5-5"/><path d="M20 12H10a6 6 0 0 0-6 6v1"/></svg>`,
  trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  bellFill: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a6 6 0 0 0-6 6v3.6c0 .8-.3 1.6-.9 2.1L4 15h16l-1.1-1.3a3 3 0 0 1-.9-2.1V8a6 6 0 0 0-6-6Z"/><path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" stroke-width="0"/></svg>`,
  lockFill: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10.5" width="16" height="10" rx="2.5"/><path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5"/></svg>`,
  data: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>`,
  palette: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.5" cy="10.5" r="1.3" fill="currentColor" stroke="none"/></svg>`,
  globe: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/></svg>`,
  chatIcon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  folder: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>`,
  faceid: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M20 8V6a2 2 0 0 0-2-2h-2M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M9 10v2M15 10v2M9 16s1.2 1 3 1 3-1 3-1"/></svg>`,
  help: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2 1.7-2.5 3.3M12 17h.01"/></svg>`,
  chevron: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  logout: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>`,
  play: `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
  phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  video: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="3"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><circle cx="11" cy="11" r="7.2"/><path d="m21 21-4.4-4.4"/></svg>`,
  muteFilled: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m23 9-6 6M17 9l6 6"/></svg>`
};

function statusTicks(status) {
  if (status === 'sending') return `<span class="bubble__ticks">${ICONS.clock}</span>`;
  if (status === 'sent') return `<span class="bubble__ticks">${ICONS.check1}</span>`;
  if (status === 'delivered') return `<span class="bubble__ticks">${ICONS.check2}</span>`;
  if (status === 'read') return `<span class="bubble__ticks is-read">${ICONS.check2}</span>`;
  return '';
}

/* ---------------------------------------------------------------- CHAT LIST */

function findContact(id) {
  return chats.find(c => c.id === id) || globalContacts.find(c => c.id === id);
}

function renderChatList() {
  DOM.chatList.innerHTML = '';
  const sorted = [...chats].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  sorted.forEach(chat => {
    DOM.chatList.appendChild(buildChatListItem(chat));
  });
  setupSwipeGestures();
}

function buildChatListItem(chat) {
  const isActive = chat.id === currentChatId ? 'is-active' : '';
  const badge = chat.unread > 0 ? `<span class="chat-item__badge">${chat.unread}</span>` : '';
  const muteIcon = chat.muted ? `<span class="chat-item__muted-icon">${ICONS.muteFilled.replace('width="18" height="18"', 'width="14" height="14"')}</span>` : '';
  const pinIcon = chat.pinned ? `<span class="chat-item__pin">${ICONS.pin}</span>` : '';

  const li = document.createElement('li');
  li.className = 'swipe-item';
  li.dataset.chatId = chat.id;
  li.innerHTML = `
    <div class="swipe-actions">
      <button class="btn btn--icon" style="color: #fff;" onclick="deleteChat(${chat.id})" aria-label="Удалить">
        ${ICONS.trash}
      </button>
    </div>
    <div class="swipe-front chat-item ${isActive}" data-chat-id="${chat.id}" onclick="openChat(${chat.id})">
      <div class="avatar" style="background: ${chat.color}">
        ${chat.avatar}${chat.online ? '<span class="avatar__status"></span>' : ''}
      </div>
      <div class="chat-item__body">
        <div class="chat-item__top">
          <span class="chat-item__name">${pinIcon}${escapeHtml(chat.name)}</span>
          <span class="chat-item__time ${chat.unread > 0 ? 'is-unread' : ''}">${chat.time}</span>
        </div>
        <div class="chat-item__bottom">
          <span class="chat-item__preview">${escapeHtml(chat.lastMsg || '...')}</span>
          ${muteIcon}
          ${badge}
        </div>
      </div>
    </div>
  `;
  return li;
}

function renderGlobalContacts() {
  DOM.globalContactList.innerHTML = '';
  globalContacts.forEach(user => {
    const li = document.createElement('li');
    li.className = 'chat-item';
    li.onclick = () => { toggleNewChat(false); openChat(user.id, user); };
    li.innerHTML = `
      <div class="avatar" style="background: ${user.color}">${user.avatar}</div>
      <div class="chat-item__body">
        <div class="chat-item__name">${escapeHtml(user.name)}</div>
      </div>
    `;
    DOM.globalContactList.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

/* ---------------------------------------------------------------- CHAT VIEW */

function openChat(chatId, newUser = null) {
  currentChatId = chatId;
  if (newUser && !chats.find(c => c.id === chatId)) {
    chats.unshift({ ...newUser, lastMsg: '', time: '', unread: 0, muted: false, pinned: false });
  }

  const chat = chats.find(c => c.id === chatId);
  chat.unread = 0;
  renderChatList();

  document.getElementById('chatEmptyState').classList.add('is-hidden');
  document.getElementById('chatContent').classList.remove('is-hidden');
  if (window.innerWidth < 768) document.getElementById('chatView').classList.remove('is-hidden');

  document.getElementById('headerName').textContent = chat.name;
  document.getElementById('headerStatus').textContent = chat.online ? 'в сети' : 'не в сети';
  document.getElementById('headerStatus').className = `chat-view__subtitle ${chat.online ? 'online' : ''}`;

  const avHTML = `${chat.avatar}${chat.online ? '<span class="avatar__status"></span>' : ''}`;
  document.getElementById('headerAvatarDesktop').innerHTML = avHTML;
  document.getElementById('headerAvatarDesktop').style.background = chat.color;
  document.getElementById('headerAvatarMobile').innerHTML = avHTML;
  document.getElementById('headerAvatarMobile').style.background = chat.color;

  renderMessages(chatId);
}

function closeChat() {
  currentChatId = null;
  document.getElementById('chatView').classList.add('is-hidden');
  renderChatList();
}

function deleteChat(id) {
  chats = chats.filter(c => c.id !== id);
  if (currentChatId === id) closeChat();
  renderChatList();
  vibrate(30);
  showToast('Чат удалён');
}

function toggleMuteChat(id) {
  const chat = chats.find(c => c.id === id);
  if (!chat) return;
  chat.muted = !chat.muted;
  renderChatList();
  showToast(chat.muted ? 'Уведомления выключены' : 'Уведомления включены');
}

function togglePinChat(id) {
  const chat = chats.find(c => c.id === id);
  if (!chat) return;
  chat.pinned = !chat.pinned;
  renderChatList();
  showToast(chat.pinned ? 'Чат закреплён' : 'Чат откреплён');
}

/* ---------------------------------------------------------------- MESSAGES */

function renderMessages(chatId) {
  DOM.messagesArea.innerHTML = '';
  const msgs = messagesData[chatId] || [];
  msgs.forEach(msg => appendMessage(msg));
  scrollToBottom();
}

function appendMessage(msg) {
  const row = document.createElement('div');
  row.className = `bubble-row bubble-row--${msg.type}`;
  row.dataset.msgId = msg.id;

  const div = document.createElement('div');
  div.dataset.msgId = msg.id;

  if (msg.mediaType === 'audio') {
    div.className = `bubble bubble--${msg.type} bubble--voice`;
    div.innerHTML = `<div class="play-btn">${ICONS.play}</div><div class="waveform"></div><span class="bubble__meta"><span class="bubble__time">${msg.time}</span>${msg.type === 'out' ? statusTicks(msg.status) : ''}</span>`;
  } else if (msg.mediaType === 'video') {
    div.className = `bubble bubble--${msg.type} bubble--video`;
    div.innerHTML = `<img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" alt="video"><span class="bubble__time" style="position:absolute; bottom:12px; right:12px; color:#fff; text-shadow: 0 1px 2px #000;">${msg.time}</span>`;
  } else if (msg.mediaType === 'image') {
    div.className = `bubble bubble--${msg.type} bubble--media`;
    div.innerHTML = `<img src="${msg.mediaUrl}" alt="photo"><span class="bubble__meta"><span class="bubble__time">${msg.time}</span>${msg.type === 'out' ? statusTicks(msg.status) : ''}</span>`;
  } else {
    div.className = `bubble bubble--${msg.type}`;
    div.innerHTML = `<span class="bubble__text">${escapeHtml(msg.text)}</span><span class="bubble__meta"><span class="bubble__time">${msg.time}</span>${msg.type === 'out' ? statusTicks(msg.status) : ''}</span>`;
  }

  row.appendChild(div);
  DOM.messagesArea.appendChild(row);
}

function sendMessage(text = '', mediaType = null) {
  if (!currentChatId) return;
  if (!text.trim() && !mediaType) return;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMsg = { id: Date.now(), text, time: timeStr, type: "out", mediaType, status: 'sending' };
  if (!messagesData[currentChatId]) messagesData[currentChatId] = [];
  messagesData[currentChatId].push(newMsg);

  const chat = chats.find(c => c.id === currentChatId);
  chat.lastMsg = mediaType === 'audio' ? '🎤 Голосовое сообщение' : mediaType === 'video' ? '🎥 Видеосообщение' : mediaType === 'image' ? '📷 Фото' : text;
  chat.time = timeStr;

  renderChatList();
  appendMessage(newMsg);
  scrollToBottom();

  DOM.messageInput.value = '';
  DOM.messageInput.style.height = 'auto';
  checkInputState();
  vibrate(10);

  simulateMessageStatus(currentChatId, newMsg.id);
}

function simulateMessageStatus(chatId, msgId) {
  const updateStatus = (status) => {
    const msg = (messagesData[chatId] || []).find(m => m.id === msgId);
    if (!msg) return;
    msg.status = status;
    if (currentChatId === chatId) {
      const bubbleEl = DOM.messagesArea.querySelector(`.bubble[data-msg-id="${msgId}"] .bubble__meta`);
      if (bubbleEl) {
        const timeEl = bubbleEl.querySelector('.bubble__time');
        bubbleEl.innerHTML = `<span class="bubble__time">${timeEl ? timeEl.textContent : msg.time}</span>${statusTicks(status)}`;
      }
    }
  };
  setTimeout(() => updateStatus('sent'), 450);
  setTimeout(() => updateStatus('delivered'), 1200);
  setTimeout(() => updateStatus('read'), 2600 + Math.random() * 1500);
}

/* ---------------------------------------------------------------- SEARCH */

function enterSearch() {
  if (isSearchActive) return;
  isSearchActive = true;
  DOM.searchRow.classList.add('is-active');
  document.getElementById('chatList').classList.add('is-hidden');
  DOM.searchState.classList.remove('is-hidden');
  renderRecentSearches();
}

function exitSearch() {
  isSearchActive = false;
  DOM.searchInput.value = '';
  DOM.searchInput.classList.add('is-empty');
  DOM.searchInput.blur();
  DOM.searchClearBtn.classList.add('is-hidden');
  DOM.searchRow.classList.remove('is-active');
  DOM.searchState.classList.add('is-hidden');
  document.getElementById('chatList').classList.remove('is-hidden');
  DOM.searchResultsList.classList.add('is-hidden');
  DOM.recentSearchSection.classList.remove('is-hidden');
  DOM.searchEmptyState.classList.add('is-hidden');
}

function renderRecentSearches() {
  DOM.recentSearchList.innerHTML = '';
  if (recentSearches.length === 0) {
    DOM.recentSearchSection.classList.add('is-hidden');
    return;
  }
  DOM.recentSearchSection.classList.remove('is-hidden');
  recentSearches.forEach(c => {
    const li = document.createElement('li');
    li.className = 'recent-item';
    li.innerHTML = `
      <div class="avatar avatar--sm" style="background:${c.color}">${c.avatar}</div>
      <span class="recent-item__name">${escapeHtml(c.name)}</span>
      <button class="recent-item__remove" onclick="removeRecentSearch(event, ${c.id})" aria-label="Убрать">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.6 12.2-1.4 1.4L12 13.4l-2.2 2.2-1.4-1.4L10.6 12 8.4 9.8l1.4-1.4L12 10.6l2.2-2.2 1.4 1.4L13.4 12l2.2 2.2Z"/></svg>
      </button>
    `;
    li.addEventListener('click', (e) => {
      if (e.target.closest('.recent-item__remove')) return;
      exitSearch();
      const full = findContact(c.id);
      openChat(c.id, chats.find(ch => ch.id === c.id) ? null : full);
      toggleProfile(true);
    });
    DOM.recentSearchList.appendChild(li);
  });
}

function removeRecentSearch(e, id) {
  e.stopPropagation();
  recentSearches = recentSearches.filter(c => c.id !== id);
  renderRecentSearches();
}

function clearRecentSearches() {
  recentSearches = [];
  renderRecentSearches();
}

function addRecentSearch(contact) {
  recentSearches = recentSearches.filter(c => c.id !== contact.id);
  recentSearches.unshift({ id: contact.id, name: contact.name, avatar: contact.avatar, color: contact.color });
  recentSearches = recentSearches.slice(0, 6);
}

function performSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    DOM.searchResultsList.classList.add('is-hidden');
    DOM.recentSearchSection.classList.remove('is-hidden');
    DOM.searchEmptyState.classList.add('is-hidden');
    renderRecentSearches();
    return;
  }
  DOM.recentSearchSection.classList.add('is-hidden');
  const pool = [...chats, ...globalContacts.filter(g => !chats.find(c => c.id === g.id))];
  const results = pool.filter(c => c.name.toLowerCase().includes(q) || (c.username || '').toLowerCase().includes(q));

  DOM.searchResultsList.innerHTML = '';
  if (results.length === 0) {
    DOM.searchResultsList.classList.add('is-hidden');
    DOM.searchEmptyState.classList.remove('is-hidden');
    return;
  }
  DOM.searchEmptyState.classList.add('is-hidden');
  DOM.searchResultsList.classList.remove('is-hidden');
  results.forEach(c => {
    const li = document.createElement('li');
    li.className = 'chat-item';
    li.innerHTML = `
      <div class="avatar" style="background:${c.color}">${c.avatar}${c.online ? '<span class="avatar__status"></span>' : ''}</div>
      <div class="chat-item__body">
        <div class="chat-item__name">${escapeHtml(c.name)}</div>
        <span class="chat-item__preview">${escapeHtml(c.username || '')}</span>
      </div>
    `;
    li.onclick = () => { exitSearch(); openChat(c.id, chats.find(ch => ch.id === c.id) ? null : c); };
    DOM.searchResultsList.appendChild(li);
  });
}

/* ---------------------------------------------------------------- PROFILE */

function toggleProfile(open) {
  const panel = document.getElementById('profilePanel');
  const scrim = document.getElementById('profileScrim');
  if (open) {
    const chat = findContact(currentChatId);
    if (!chat) return;
    renderProfile(chat);
    if (chat.id) addRecentSearch(chat);
    scrim.classList.remove('is-hidden');
    requestAnimationFrame(() => panel.classList.add('is-open'));
  } else {
    panel.classList.remove('is-open');
    setTimeout(() => scrim.classList.add('is-hidden'), 400);
  }
}

function renderProfile(chat) {
  const media = (messagesData[chat.id] || []).filter(m => m.mediaType === 'image' || m.mediaType === 'video');
  const mediaHTML = media.length
    ? `<div class="media-grid">${media.map(m => `<div class="media-grid__item"><img src="${m.mediaUrl || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'}" alt=""></div>`).join('')}</div>`
    : `<div class="info-group"><div class="media-empty">Общих медиафайлов пока нет</div></div>`;

  document.getElementById('profileContent').innerHTML = `
    <div class="profile-hero">
      <div class="avatar avatar--xl" style="background:${chat.color}">${chat.avatar}</div>
      <h2>${escapeHtml(chat.name)}</h2>
      <p class="profile-hero__status ${chat.online ? 'online' : 'offline'}">${chat.online ? 'в сети' : 'не в сети'}</p>

      <div class="profile-actions">
        <button class="profile-action" onclick="showToast('Звонок…')">${ICONS.phone}<span>Аудио</span></button>
        <button class="profile-action" onclick="showToast('Видеозвонок…')">${ICONS.video}<span>Видео</span></button>
        <button class="profile-action" onclick="toggleMuteChat(${chat.id})">${ICONS.mute}<span>Без звука</span></button>
        <button class="profile-action" onclick="enterSearchInChat()">${ICONS.search}<span>Поиск</span></button>
      </div>
    </div>

    <div class="pinned-track">
      <div class="pinned-track__art">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      </div>
      <div class="pinned-track__meta">
        <div class="pinned-track__title">${escapeHtml(chat.pinnedTrack.title)}</div>
        <div class="pinned-track__artist">${escapeHtml(chat.pinnedTrack.artist)}</div>
      </div>
      <button class="pinned-track__play" aria-label="Слушать">${ICONS.play}</button>
    </div>

    <div class="info-group">
      <div class="info-row"><span class="info-row__label">Телефон</span><span class="info-row__value">${escapeHtml(chat.phone || '—')}</span></div>
      <div class="info-row"><span class="info-row__label">Имя пользователя</span><span class="info-row__value">${escapeHtml(chat.username || '—')}</span></div>
      <div class="info-row"><span class="info-row__label">Дата рождения</span><span class="info-row__value">${escapeHtml(chat.birthday || '—')}</span></div>
      <div class="info-row"><span class="info-row__label">О себе</span><span class="info-row__value info-row__value--muted">${escapeHtml(chat.bio || '—')}</span></div>
    </div>

    <div class="section-label">Общие медиа</div>
    ${mediaHTML}
  `;
}

function enterSearchInChat() {
  toggleProfile(false);
  showToast('Поиск по чату');
}

/* ---------------------------------------------------------------- SETTINGS */

function renderSettings() {
  const chip = (bg) => `background:${bg}`;
  DOM.settingsContent.innerHTML = `
    <button class="settings-profile" style="width:100%;">
      <div class="avatar avatar--xl avatar--me">М</div>
      <div>
        <div class="settings-profile__name">Maxim</div>
        <div class="settings-profile__sub">+7 (999) 000-00-00</div>
      </div>
      <span class="settings-profile__chevron">${ICONS.chevron}</span>
    </button>

    <div class="settings-group">
      <div class="settings-item is-tappable">
        <span class="settings-icon" style="${chip('#FF9F0A')}">${ICONS.bellFill}</span>
        <span class="settings-item__label">Уведомления и звуки</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
      <div class="settings-item is-tappable">
        <span class="settings-icon" style="${chip('#34E572')}">${ICONS.lockFill}</span>
        <span class="settings-item__label">Конфиденциальность</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
      <div class="settings-item is-tappable">
        <span class="settings-icon" style="${chip('#0A84FF')}">${ICONS.data}</span>
        <span class="settings-item__label">Данные и память</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
      <div class="settings-item is-tappable">
        <span class="settings-icon" style="${chip('#BF5AF2')}">${ICONS.palette}</span>
        <span class="settings-item__label">Оформление</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
      <div class="settings-item is-tappable">
        <span class="settings-icon" style="${chip('#64D2FF')}">${ICONS.globe}</span>
        <span class="settings-item__label">Язык</span>
        <span class="settings-item__value">Русский</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-item is-tappable">
        <span class="settings-icon" style="${chip('#5E5CE6')}">${ICONS.chatIcon}</span>
        <span class="settings-item__label">Чаты</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
      <div class="settings-item is-tappable">
        <span class="settings-icon" style="${chip('#FF375F')}">${ICONS.folder}</span>
        <span class="settings-item__label">Папки с чатами</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-item">
        <span class="settings-icon" style="${chip('#34E572')}">${ICONS.faceid}</span>
        <span class="settings-item__label">Face ID</span>
        <label class="toggle-switch"><input type="checkbox"><span class="slider"></span></label>
      </div>
      <div class="settings-item">
        <span class="settings-icon" style="${chip('#8E8E93')}">${ICONS.lockFill}</span>
        <span class="settings-item__label">Код-пароль</span>
        <span class="settings-item__value">Выкл.</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-item is-tappable">
        <span class="settings-icon" style="${chip('#0A84FF')}">${ICONS.help}</span>
        <span class="settings-item__label">Задать вопрос</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
      <div class="settings-item is-tappable">
        <span class="settings-icon" style="${chip('#8E8E93')}">${ICONS.help}</span>
        <span class="settings-item__label">Политика конфиденциальности</span>
        <span class="settings-item__chevron">${ICONS.chevron}</span>
      </div>
    </div>

    <div class="settings-group">
      <button class="settings-item is-tappable settings-item--danger" style="width:100%;" onclick="showToast('Выход из аккаунта')">
        <span class="settings-icon">${ICONS.logout}</span>
        <span class="settings-item__label">Выйти из аккаунта</span>
      </button>
    </div>

    <p class="settings-footer-note">Messenger для iOS 26<br>версия 12.4.1</p>
  `;
}

/* ---------------------------------------------------------------- CONTEXT MENU */

function buildChatPreview(chat) {
  return `
    <div class="ctx-preview-chat">
      <div class="avatar" style="background:${chat.color}">${chat.avatar}${chat.online ? '<span class="avatar__status"></span>' : ''}</div>
      <div class="ctx-preview-chat__body">
        <div class="ctx-preview-chat__name">${escapeHtml(chat.name)}</div>
        <div class="ctx-preview-chat__msg">${escapeHtml(chat.lastMsg || '')}</div>
      </div>
    </div>
  `;
}

function chatContextActions(chat) {
  return [
    { icon: ICONS.pin, label: chat.pinned ? 'Открепить' : 'Закрепить', onClick: () => togglePinChat(chat.id) },
    { icon: ICONS.mute, label: chat.muted ? 'Включить звук' : 'Выключить звук', onClick: () => toggleMuteChat(chat.id) },
    { icon: ICONS.trash, label: 'Удалить чат', danger: true, onClick: () => deleteChat(chat.id) }
  ];
}

function messageContextActions(msg) {
  const actions = [
    { icon: ICONS.reply, label: 'Ответить', onClick: () => showToast('Ответ на сообщение') },
    { icon: ICONS.copy, label: 'Копировать', onClick: () => copyMessage(msg) },
    { icon: ICONS.forward, label: 'Переслать', onClick: () => showToast('Пересылка сообщения') }
  ];
  if (msg.type === 'out') {
    actions.push({ icon: ICONS.trash, label: 'Удалить', danger: true, onClick: () => deleteMessage(msg.id) });
  }
  return actions;
}

function copyMessage(msg) {
  if (msg.text && navigator.clipboard) {
    navigator.clipboard.writeText(msg.text).catch(() => {});
  }
  showToast('Скопировано');
}

function deleteMessage(id) {
  if (!currentChatId) return;
  messagesData[currentChatId] = (messagesData[currentChatId] || []).filter(m => m.id !== id);
  renderMessages(currentChatId);
  showToast('Сообщение удалено');
}

function openContextMenu(type, targetEl, anchorRect) {
  let previewHTML = '';
  let actions = [];

  if (type === 'chat') {
    const id = Number(targetEl.dataset.chatId);
    const chat = chats.find(c => c.id === id);
    if (!chat) return;
    previewHTML = buildChatPreview(chat);
    actions = chatContextActions(chat);
  } else if (type === 'message') {
    const id = Number(targetEl.dataset.msgId);
    const msg = (messagesData[currentChatId] || []).find(m => m.id === id);
    if (!msg) return;
    const clone = targetEl.cloneNode(true);
    clone.classList.remove('is-pressed');
    previewHTML = `<div class="ctx-preview-bubble" style="display:flex; justify-content:${msg.type === 'out' ? 'flex-end' : 'flex-start'};">${clone.outerHTML}</div>`;
    actions = messageContextActions(msg);
  }

  DOM.ctxPreview.innerHTML = previewHTML;
  DOM.ctxActions.innerHTML = actions.map(a => `
    <button class="ctx-action ${a.danger ? 'ctx-action--danger' : ''}" data-action="${a.label}">
      <span>${a.label}</span>${a.icon}
    </button>
  `).join('');

  // wire actions
  [...DOM.ctxActions.children].forEach((btn, i) => {
    btn.addEventListener('click', () => {
      closeContextMenu();
      actions[i].onClick();
    });
  });

  DOM.ctxScrim.classList.remove('is-hidden');
  DOM.ctxMenu.classList.remove('is-hidden');

  // position
  const menuWidth = Math.min(280, window.innerWidth * 0.82);
  let left = anchorRect.left + anchorRect.width / 2 - menuWidth / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - menuWidth - 12));
  let top = anchorRect.bottom + 10;
  DOM.ctxMenu.style.width = menuWidth + 'px';
  DOM.ctxMenu.style.left = left + 'px';
  DOM.ctxMenu.style.top = top + 'px';

  requestAnimationFrame(() => {
    const menuHeight = DOM.ctxMenu.offsetHeight;
    if (top + menuHeight > window.innerHeight - 16) {
      top = Math.max(16, anchorRect.top - menuHeight - 10);
      DOM.ctxMenu.style.top = top + 'px';
    }
    DOM.ctxMenu.classList.add('is-open');
  });

  vibrate(15);
}

function closeContextMenu() {
  DOM.ctxMenu.classList.remove('is-open');
  DOM.ctxScrim.classList.add('is-hidden');
  setTimeout(() => DOM.ctxMenu.classList.add('is-hidden'), 260);
}

DOM.ctxScrim.addEventListener('click', closeContextMenu);

/* Delegated long-press: attached once to stable containers so it keeps
   working for chat items / message bubbles that get re-rendered later. */
function setupLongPress() {
  attachLongPress(document.getElementById('chatList'), '.swipe-front.chat-item[data-chat-id]', 'chat');
  attachLongPress(document.getElementById('messagesArea'), '.bubble[data-msg-id]', 'message');
}

function attachLongPress(container, selector, type) {
  let pressTimer = null;
  let moved = false;
  let startX = 0, startY = 0;
  let activeEl = null;

  const start = (e) => {
    const el = e.target.closest(selector);
    if (!el || !container.contains(el)) return;
    activeEl = el;
    moved = false;
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX; startY = point.clientY;
    pressTimer = setTimeout(() => {
      if (moved || !activeEl) return;
      const el2 = activeEl;
      el2.classList.add('is-pressed');
      setTimeout(() => {
        el2.classList.remove('is-pressed');
        openContextMenu(type, el2, el2.getBoundingClientRect());
      }, 90);
    }, 420);
  };
  const move = (e) => {
    if (!activeEl) return;
    const point = e.touches ? e.touches[0] : e;
    if (Math.abs(point.clientX - startX) > 8 || Math.abs(point.clientY - startY) > 8) {
      moved = true;
      clearTimeout(pressTimer);
    }
  };
  const end = () => { clearTimeout(pressTimer); activeEl = null; };

  container.addEventListener('touchstart', start, { passive: true });
  container.addEventListener('touchmove', move, { passive: true });
  container.addEventListener('touchend', end);
  container.addEventListener('mousedown', start);
  container.addEventListener('mousemove', move);
  container.addEventListener('mouseup', end);
  container.addEventListener('mouseleave', end);
  container.addEventListener('contextmenu', (e) => e.preventDefault());
}

/* ---------------------------------------------------------------- TOAST */

let toastTimer = null;
function showToast(text) {
  DOM.toast.textContent = text;
  DOM.toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => DOM.toast.classList.remove('is-visible'), 1800);
}

/* ---------------------------------------------------------------- SIDEBAR SCROLL (collapsing large title) */

function setupSidebarScroll() {
  const list = document.getElementById('chatList');
  const nav = DOM.sidebarNav;
  const onScroll = () => {
    if (list.scrollTop > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  list.addEventListener('scroll', onScroll, { passive: true });
  DOM.searchState.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------------------------------------------------------- SWIPE TO DELETE */

function setupSwipeGestures() {
  const items = document.querySelectorAll('.swipe-front');
  items.forEach(item => {
    let startX = 0, currentX = 0, isDragging = false;

    item.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
      item.classList.add('is-swiping');
    }, { passive: true });

    item.addEventListener('touchmove', e => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX - startX;
      if (currentX < 0 && currentX > -76) {
        item.style.transform = `translateX(${currentX}px)`;
      }
    }, { passive: true });

    item.addEventListener('touchend', () => {
      isDragging = false;
      item.classList.remove('is-swiping');
      if (currentX < -38) {
        item.style.transform = `translateX(-76px)`;
        vibrate(20);
      } else {
        item.style.transform = `translateX(0px)`;
      }
      currentX = 0;
    });
  });
}

/* ---------------------------------------------------------------- VOICE / VIDEO RECORDING */

function setupRecordingGestures() {
  let recordTimeout, timerInterval;
  let isRecording = false;
  let seconds = 0;
  let startX = 0;

  DOM.mediaBtn.addEventListener('click', () => {
    if (isRecording) return;
    recordMode = recordMode === 'audio' ? 'video' : 'audio';
    if (recordMode === 'audio') {
      DOM.iconMic.classList.remove('is-hidden');
      DOM.iconCam.classList.add('is-hidden');
    } else {
      DOM.iconMic.classList.add('is-hidden');
      DOM.iconCam.classList.remove('is-hidden');
    }
    vibrate(10);
  });

  const startRecording = (e) => {
    if (DOM.messageInput.value.trim().length > 0) return;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

    recordTimeout = setTimeout(() => {
      isRecording = true;
      vibrate([20, 40, 20]);
      DOM.recordOverlay.classList.add('is-active');
      DOM.composerMain.classList.add('is-recording');

      seconds = 0;
      DOM.recordTimer.textContent = "00:00";
      timerInterval = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        DOM.recordTimer.textContent = `${m}:${s}`;
      }, 1000);
    }, 250);
  };

  const moveRecording = (e) => {
    if (!isRecording) return;
    const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;

    if (diff > 0 && diff < 120) {
      DOM.slideCancelText.style.transform = `translateX(-${diff}px)`;
      DOM.slideCancelText.style.opacity = 1 - (diff / 100);
    }
    if (diff > 100) {
      isRecording = false;
      clearInterval(timerInterval);
      resetRecordUI();
      vibrate(40);
    }
  };

  const stopRecording = () => {
    clearTimeout(recordTimeout);
    if (isRecording) {
      isRecording = false;
      clearInterval(timerInterval);
      resetRecordUI();
      if (seconds > 0) sendMessage('', recordMode);
    }
  };

  const resetRecordUI = () => {
    DOM.recordOverlay.classList.remove('is-active');
    DOM.composerMain.classList.remove('is-recording');
    DOM.slideCancelText.style.transform = `translateX(0)`;
    DOM.slideCancelText.style.opacity = 1;
  };

  DOM.mediaBtn.addEventListener('mousedown', startRecording);
  DOM.mediaBtn.addEventListener('touchstart', startRecording, { passive: true });
  document.addEventListener('mousemove', moveRecording);
  document.addEventListener('touchmove', moveRecording, { passive: true });
  document.addEventListener('mouseup', stopRecording);
  document.addEventListener('touchend', stopRecording);
}

/* ---------------------------------------------------------------- GENERAL EVENTS */

function setupEventListeners() {
  DOM.messageInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    checkInputState();
  });

  DOM.messageInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(this.value.trim());
    }
  });

  DOM.sendBtn.addEventListener('click', () => sendMessage(DOM.messageInput.value.trim()));

  DOM.searchInput.addEventListener('focus', enterSearch);
  DOM.searchInput.addEventListener('input', function () {
    if (this.value.length > 0) {
      this.classList.remove('is-empty');
      DOM.searchClearBtn.classList.remove('is-hidden');
    } else {
      this.classList.add('is-empty');
      DOM.searchClearBtn.classList.add('is-hidden');
    }
    performSearch(this.value);
  });

  DOM.searchClearBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    DOM.searchInput.classList.add('is-empty');
    DOM.searchClearBtn.classList.add('is-hidden');
    DOM.searchInput.focus();
    performSearch('');
  });

  // Prevent iOS Safari's rubber-band scroll on the whole page
  document.body.addEventListener('touchmove', (e) => {
    if (!e.target.closest('.messages, .sidebar__list, .search-state, .slide-panel__content, .composer__input')) {
      e.preventDefault();
    }
  }, { passive: false });
}

function checkInputState() {
  const val = DOM.messageInput.value.trim();
  if (val.length > 0) {
    DOM.sendBtn.classList.remove('is-hidden');
    DOM.mediaBtn.classList.add('is-hidden');
  } else {
    DOM.sendBtn.classList.add('is-hidden');
    DOM.mediaBtn.classList.remove('is-hidden');
  }
}

function scrollToBottom() {
  DOM.messagesArea.scrollTop = DOM.messagesArea.scrollHeight;
}

function vibrate(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

/* ---------------------------------------------------------------- PANEL TOGGLES */

window.toggleSettings = (open) => {
  const panel = document.getElementById('settingsPanel');
  const scrim = document.getElementById('settingsScrim');
  if (open) {
    scrim.classList.remove('is-hidden');
    requestAnimationFrame(() => panel.classList.add('is-open'));
  } else {
    panel.classList.remove('is-open');
    setTimeout(() => scrim.classList.add('is-hidden'), 400);
  }
};

window.toggleProfile = toggleProfile;

window.toggleNewChat = (open) => {
  const panel = document.getElementById('newChatPanel');
  const scrim = document.getElementById('newChatScrim');
  if (open) {
    scrim.classList.remove('is-hidden');
    requestAnimationFrame(() => panel.classList.add('is-open'));
  } else {
    panel.classList.remove('is-open');
    setTimeout(() => scrim.classList.add('is-hidden'), 400);
  }
};

window.openChat = openChat;
window.closeChat = closeChat;
window.deleteChat = deleteChat;
window.toggleMuteChat = toggleMuteChat;
window.togglePinChat = togglePinChat;
window.removeRecentSearch = removeRecentSearch;
window.clearRecentSearches = clearRecentSearches;
window.exitSearch = exitSearch;
window.enterSearchInChat = enterSearchInChat;
window.showToast = showToast;

init();
