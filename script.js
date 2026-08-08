/**
 * Messenger — iOS 26 Fixed Build
 */

let chats = [
  {
    id: 1, name: "Anna Smirnova", avatar: "А", color: "#8B5CF6", online: true,
    lastMsg: "Отлично, тогда до встречи!", time: "14:32", unread: 0, pinned: true,
    username: "@anna.smirnova", phone: "+7 (999) 123-45-67", bio: "Product designer."
  },
  {
    id: 2, name: "Design Team", avatar: "D", color: "#FF9F0A", online: false,
    lastMsg: "Игорь: Залил макеты!", time: "13:05", unread: 3, pinned: false,
    username: "@design_team", phone: "—", bio: "Общий чат"
  }
];

let globalContacts = [
  { id: 4, name: "Мама", avatar: "М", color: "#FF375F", online: true, username: "@mama", phone: "+7 (999) 000-11-22", bio: "❤️" },
  { id: 5, name: "Elon Musk", avatar: "E", color: "#FF3B30", online: true, username: "@elonmusk", phone: "скрыт", bio: "Occupy Mars" }
];

let messagesData = {
  1: [
    { id: 101, text: "Привет! Как дела?", time: "14:28", type: "in" },
    { id: 102, text: "Привет, все отлично!", time: "14:29", type: "out", status: "read" }
  ]
};

let currentChatId = null;
let cameraStream = null;
let currentFacingMode = 'user';
let recentSearches = [];

const DOM = {
  chatList: document.getElementById('chatList'),
  messagesArea: document.getElementById('messagesArea'),
  messageInput: document.getElementById('messageInput'),
  sendBtn: document.getElementById('sendBtn'),
  mediaBtn: document.getElementById('mediaBtn'),
  iconMic: document.getElementById('iconMic'),
  iconCam: document.getElementById('iconCam'),
  searchRow: document.getElementById('searchRow'),
  searchInput: document.getElementById('searchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  searchState: document.getElementById('searchState'),
  recentSearchSection: document.getElementById('recentSearchSection'),
  recentSearchList: document.getElementById('recentSearchList'),
  searchResultsList: document.getElementById('searchResultsList'),
  searchEmptyState: document.getElementById('searchEmptyState'),
  recordOverlay: document.getElementById('recordOverlay'),
  cameraPreview: document.getElementById('cameraPreview'),
  cameraFlipBtn: document.getElementById('cameraFlipBtn'),
  recordTimer: document.getElementById('recordTimer'),
  ctxScrim: document.getElementById('ctxScrim'),
  ctxMenu: document.getElementById('ctxMenu'),
  ctxPreview: document.getElementById('ctxPreview'),
  ctxActions: document.getElementById('ctxActions'),
  toast: document.getElementById('toast'),
  settingsContent: document.getElementById('settingsContent'),
  profileContent: document.getElementById('profileContent')
};

function init() {
  renderChatList();
  renderGlobalContacts();
  renderSettings();
  setupEventListeners();
  setupSwipeGestures();
  setupRecordingGestures();
}

function renderChatList() {
  DOM.chatList.innerHTML = '';
  const sorted = [...chats].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  sorted.forEach(chat => {
    DOM.chatList.appendChild(buildChatListItem(chat));
  });
}

function buildChatListItem(chat) {
  const li = document.createElement('li');
  li.className = 'swipe-item';
  li.innerHTML = `
    <div class="swipe-actions">
      <button class="btn btn--icon" style="color:#fff;" onclick="deleteChat(${chat.id})">Удалить</button>
    </div>
    <div class="swipe-front chat-item ${chat.pinned ? 'is-pinned' : ''}" onclick="openChat(${chat.id})">
      <div class="avatar" style="background: ${chat.color}">${chat.avatar}</div>
      <div class="chat-item__body">
        <div class="chat-item__top">
          <span class="chat-item__name">${escapeHtml(chat.name)}</span>
          <span class="chat-item__time">${chat.time}</span>
        </div>
        <div class="chat-item__bottom">
          <span class="chat-item__preview">${escapeHtml(chat.lastMsg)}</span>
        </div>
      </div>
    </div>
  `;
  return li;
}

function renderGlobalContacts() {
  const list = document.getElementById('globalContactList');
  list.innerHTML = '';
  globalContacts.forEach(user => {
    const li = document.createElement('li');
    li.className = 'chat-item';
    li.onclick = () => { toggleNewChat(false); openChat(user.id, user); };
    li.innerHTML = `
      <div class="avatar" style="background: ${user.color}">${user.avatar}</div>
      <div class="chat-item__body"><div class="chat-item__name">${escapeHtml(user.name)}</div></div>
    `;
    list.appendChild(li);
  });
}

function openChat(chatId, newUser = null) {
  currentChatId = chatId;
  if (newUser && !chats.find(c => c.id === chatId)) {
    chats.unshift({ ...newUser, lastMsg: '', time: '', unread: 0, pinned: false });
  }
  const chat = chats.find(c => c.id === chatId);
  
  document.getElementById('chatEmptyState').classList.add('is-hidden');
  document.getElementById('chatContent').classList.remove('is-hidden');
  document.getElementById('chatView').classList.remove('is-hidden');

  document.getElementById('headerName').textContent = chat.name;
  document.getElementById('headerStatus').textContent = chat.online ? 'в сети' : 'не в сети';
  document.getElementById('headerStatus').className = `chat-view__subtitle ${chat.online ? 'online' : ''}`;

  document.getElementById('headerAvatarDesktop').innerHTML = chat.avatar;
  document.getElementById('headerAvatarDesktop').style.background = chat.color;
  document.getElementById('headerAvatarMobile').innerHTML = chat.avatar;
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
  showToast('Чат удален');
}

function renderMessages(chatId) {
  DOM.messagesArea.innerHTML = '';
  (messagesData[chatId] || []).forEach(msg => appendMessage(msg));
  scrollToBottom();
}

function appendMessage(msg) {
  const row = document.createElement('div');
  row.className = `bubble-row bubble-row--${msg.type}`;
  
  const div = document.createElement('div');
  div.className = `bubble bubble--${msg.type}`;
  
  const statusLabel = msg.type === 'out' ? ` · ${msg.status === 'read' ? 'Прочитано' : 'Доставлено'}` : '';
  div.innerHTML = `<span class="bubble__text">${escapeHtml(msg.text)}</span><span class="bubble__meta">${msg.time}${statusLabel}</span>`;
  
  row.appendChild(div);
  DOM.messagesArea.appendChild(row);
}

function sendMessage(text = '') {
  if (!currentChatId || !text.trim()) return;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newMsg = { id: Date.now(), text, time: timeStr, type: "out", status: 'delivered' };
  
  if (!messagesData[currentChatId]) messagesData[currentChatId] = [];
  messagesData[currentChatId].push(newMsg);

  const chat = chats.find(c => c.id === currentChatId);
  chat.lastMsg = text;
  chat.time = timeStr;

  renderChatList();
  appendMessage(newMsg);
  scrollToBottom();

  DOM.messageInput.value = '';
  DOM.messageInput.style.height = 'auto';
  checkInputState();
}

/* Search behavior */
DOM.searchInput.addEventListener('focus', () => {
  DOM.searchRow.classList.add('is-active');
  DOM.searchState.classList.remove('is-hidden');
});

function exitSearch() {
  DOM.searchRow.classList.remove('is-active');
  DOM.searchState.classList.add('is-hidden');
  DOM.searchInput.value = '';
  DOM.searchInput.blur();
}

DOM.searchInput.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) {
    DOM.searchResultsList.classList.add('is-hidden');
    DOM.recentSearchSection.classList.remove('is-hidden');
    return;
  }
  DOM.recentSearchSection.classList.add('is-hidden');
  DOM.searchResultsList.classList.remove('is-hidden');
  
  const results = chats.filter(c => c.name.toLowerCase().includes(q));
  DOM.searchResultsList.innerHTML = '';
  if (results.length === 0) {
    DOM.searchEmptyState.classList.remove('is-hidden');
    return;
  }
  DOM.searchEmptyState.classList.add('is-hidden');
  results.forEach(c => {
    const li = document.createElement('li');
    li.className = 'chat-item';
    li.innerHTML = `<div class="avatar" style="background:${c.color}">${c.avatar}</div><div class="chat-item__name">${escapeHtml(c.name)}</div>`;
    li.onclick = () => { exitSearch(); openChat(c.id); };
    DOM.searchResultsList.appendChild(li);
  });
});

/* Camera Preview logic for circles */
async function startCamera() {
  try {
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: currentFacingMode }, audio: false });
    DOM.cameraPreview.srcObject = cameraStream;
  } catch (err) {
    console.warn("Camera access restricted", err);
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }
  DOM.cameraPreview.srcObject = null;
}

DOM.cameraFlipBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
  startCamera();
});

function setupRecordingGestures() {
  let isRec = false;
  const start = () => {
    if (DOM.messageInput.value.trim()) return;
    isRec = true;
    DOM.recordOverlay.classList.add('is-active');
    startCamera();
  };
  const stop = () => {
    if (!isRec) return;
    isRec = false;
    DOM.recordOverlay.classList.remove('is-active');
    stopCamera();
  };
  DOM.mediaBtn.addEventListener('mousedown', start);
  DOM.mediaBtn.addEventListener('touchstart', start, { passive: true });
  document.addEventListener('mouseup', stop);
  document.addEventListener('touchend', stop);
}

/* Avatar Preview Modal */
function openAvatarPreview() {
  const chat = chats.find(c => c.id === currentChatId);
  if (!chat) return;
  document.getElementById('modalAvatarEl').textContent = chat.avatar;
  document.getElementById('modalAvatarEl').style.background = chat.color;
  document.getElementById('avatarModal').classList.remove('is-hidden');
}

function closeAvatarPreview() {
  document.getElementById('avatarModal').classList.add('is-hidden');
}

/* Swipe gestures for list */
function setupSwipeGestures() {
  document.querySelectorAll('.swipe-front').forEach(item => {
    let startX = 0, currentX = 0, isDragging = false;
    item.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
      item.style.transition = 'none';
    }, { passive: true });
    item.addEventListener('touchmove', e => {
      if (!isDragging) return;
      currentX = Math.max(-80, Math.min(0, e.touches[0].clientX - startX));
      item.style.transform = `translateX(${currentX}px)`;
    }, { passive: true });
    item.addEventListener('touchend', () => {
      isDragging = false;
      item.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
      item.style.transform = currentX < -40 ? 'translateX(-80px)' : 'translateX(0)';
      currentX = 0;
    });
  });
}

/* Panels toggling */
window.toggleSettings = (open) => {
  const p = document.getElementById('settingsPanel');
  const scrim = document.getElementById('settingsScrim');
  if (open) {
    scrim.classList.remove('is-hidden');
    requestAnimationFrame(() => p.classList.add('is-open'));
  } else {
    p.classList.remove('is-open');
    setTimeout(() => scrim.classList.add('is-hidden'), 350);
  }
};

window.toggleNewChat = (open) => {
  const p = document.getElementById('newChatPanel');
  const scrim = document.getElementById('newChatScrim');
  if (open) {
    scrim.classList.remove('is-hidden');
    requestAnimationFrame(() => p.classList.add('is-open'));
  } else {
    p.classList.remove('is-open');
    setTimeout(() => scrim.classList.add('is-hidden'), 350);
  }
};

window.toggleProfile = (open) => {
  const p = document.getElementById('profilePanel');
  const scrim = document.getElementById('profileScrim');
  if (open) {
    const chat = chats.find(c => c.id === currentChatId);
    if (chat) {
      DOM.profileContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div class="avatar avatar--giant" style="background:${chat.color}">${chat.avatar}</div>
          <h2 style="margin-top: 12px; font-size: 22px;">${chat.name}</h2>
          <p style="color: var(--color-online); font-size: 14px;">в сети</p>
        </div>
        <div class="glass-panel" style="padding: 12px 16px; border-radius: 16px;">
          <p style="font-size: 13px; color: var(--text-tertiary);">Телефон</p>
          <p style="font-size: 15px; margin-bottom: 12px;">${chat.phone}</p>
          <p style="font-size: 13px; color: var(--text-tertiary);">О себе</p>
          <p style="font-size: 15px;">${chat.bio}</p>
        </div>
      `;
    }
    scrim.classList.remove('is-hidden');
    requestAnimationFrame(() => p.classList.add('is-open'));
  } else {
    p.classList.remove('is-open');
    setTimeout(() => scrim.classList.add('is-hidden'), 350);
  }
};

function renderSettings() {
  DOM.settingsContent.innerHTML = `
    <div class="glass-panel" style="padding: 16px; border-radius: 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 14px;">
      <div class="avatar avatar--sm avatar--me">М</div>
      <div><div style="font-weight: 600;">Maxim</div><div style="font-size: 13px; color: var(--accent);">+7 (999) 000-00-00</div></div>
    </div>
    <div class="glass-panel" style="border-radius: 16px; overflow: hidden;">
      <div style="padding: 14px; border-bottom: 1px solid var(--stroke-subtle);">Уведомления и звуки</div>
      <div style="padding: 14px; border-bottom: 1px solid var(--stroke-subtle);">Конфиденциальность</div>
      <div style="padding: 14px;">Оформление iOS 26</div>
    </div>
  `;
}

function setupEventListeners() {
  DOM.messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    checkInputState();
  });
  DOM.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(DOM.messageInput.value.trim()); }
  });
  DOM.sendBtn.addEventListener('click', () => sendMessage(DOM.messageInput.value.trim()));
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

function scrollToBottom() { DOM.messagesArea.scrollTop = DOM.messagesArea.scrollHeight; }
function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }
function showToast(text) {
  DOM.toast.textContent = text;
  DOM.toast.classList.add('is-visible');
  setTimeout(() => DOM.toast.classList.remove('is-visible'), 1800);
}

init();
