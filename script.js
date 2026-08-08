/**
 * Minimal Liquid Glass Messenger — iOS 26 Architecture
 */

/* ---------------------------------------------------------------- DATA */
let chats = [
  {
    id: 1, name: "Anna Smirnova", avatar: "А", color: "#8B5CF6", online: true,
    lastMsg: "Отлично, тогда до встречи!", time: "14:32", unread: 0, pinned: true,
    phone: "+7 (999) 123-45-67", bio: "Product designer."
  },
  {
    id: 2, name: "Design Team", avatar: "D", color: "#FF9F0A", online: false,
    lastMsg: "Игорь: Залил макеты", time: "13:05", unread: 3, pinned: false,
    phone: "—", bio: "Общий чат"
  },
  {
    id: 3, name: "Игорь Петров", avatar: "И", color: "#32ADE6", online: true,
    lastMsg: "Ок, созвонились", time: "Вчера", unread: 0, pinned: false,
    phone: "+7 (999) 555-11-22", bio: "Frontend"
  }
];

let globalContacts = [
  { id: 4, name: "Мама", avatar: "М", color: "#FF375F", online: true, phone: "+7 (999) 000-11-22", bio: "❤️" },
  { id: 5, name: "Elon", avatar: "E", color: "#FF3B30", online: true, phone: "скрыт", bio: "Mars" }
];

let messagesData = {
  1: [
    { id: 101, text: "Привет! Как дела?", time: "14:28", type: "in" },
    { id: 102, text: "Привет, очень хорошо! Готов к продакшену 🚀", time: "14:29", type: "out", status: "read" },
    { id: 104, text: "Отлично, тогда до встречи!", time: "14:32", type: "in" }
  ]
};

let currentChatId = null;
let recentSearches = [];
let isSearchActive = false;
let cameraStream = null;
let currentFacingMode = 'user';

/* ---------------------------------------------------------------- DOM & INIT */
const DOM = {
  chatList: document.getElementById('chatList'),
  messagesArea: document.getElementById('messagesArea'),
  messageInput: document.getElementById('messageInput'),
  sendBtn: document.getElementById('sendBtn'),
  mediaBtn: document.getElementById('mediaBtn'),
  searchRow: document.getElementById('searchRow'),
  searchState: document.getElementById('searchState'),
  searchInput: document.getElementById('searchInput'),
  recentList: document.getElementById('recentSearchList'),
  resultsList: document.getElementById('searchResultsList'),
  recordOverlay: document.getElementById('recordOverlay'),
  composerMain: document.getElementById('composerMain'),
  cameraFeed: document.getElementById('cameraFeed'),
  flipBtn: document.getElementById('flipCameraBtn'),
  ctxScrim: document.getElementById('ctxScrim'),
  ctxMenu: document.getElementById('ctxMenu'),
  ctxPreview: document.getElementById('ctxPreview'),
  toast: document.getElementById('toast')
};

function init() {
  renderChatList();
  renderGlobalContacts();
  setupEventListeners();
  setupSwipeGestures();
  setupLongPress();
  setupRecordingGestures();
}

/* ---------------------------------------------------------------- RENDER */
function renderChatList() {
  DOM.chatList.innerHTML = '';
  const sorted = [...chats].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  sorted.forEach(chat => {
    const li = document.createElement('li');
    li.className = 'swipe-item';
    li.dataset.chatId = chat.id;
    li.innerHTML = `
      <div class="swipe-actions">
        <button class="btn btn--icon" onclick="deleteChat(${chat.id})">Удалить</button>
      </div>
      <div class="swipe-front ${chat.pinned ? 'is-pinned' : ''}" data-chat-id="${chat.id}" onclick="openChat(${chat.id})">
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
    DOM.chatList.appendChild(li);
  });
  setupSwipeGestures();
}

function renderGlobalContacts() {
  const list = document.getElementById('globalContactList');
  list.innerHTML = '';
  globalContacts.forEach(user => {
    const li = document.createElement('li');
    li.className = 'swipe-front';
    li.style.marginBottom = '6px';
    li.onclick = () => { toggleNewChat(false); openChat(user.id, user); };
    li.innerHTML = `<div class="avatar" style="background: ${user.color}">${user.avatar}</div><div class="chat-item__name">${escapeHtml(user.name)}</div>`;
    list.appendChild(li);
  });
}

/* ---------------------------------------------------------------- CHAT LOGIC */
function openChat(chatId, newUser = null) {
  currentChatId = chatId;
  if (newUser && !chats.find(c => c.id === chatId)) {
    chats.unshift({ ...newUser, lastMsg: '', time: '', pinned: false });
  }
  const chat = chats.find(c => c.id === chatId);
  
  document.getElementById('chatEmptyState').classList.add('is-hidden');
  document.getElementById('chatContent').classList.remove('is-hidden');
  document.getElementById('chatView').classList.remove('is-hidden');

  document.getElementById('headerName').textContent = chat.name;
  document.getElementById('headerStatus').textContent = chat.online ? 'в сети' : 'не в сети';
  document.getElementById('headerAvatarMobile').innerHTML = chat.avatar;
  document.getElementById('headerAvatarMobile').style.background = chat.color;

  renderMessages(chatId);
}

function closeChat() {
  currentChatId = null;
  document.getElementById('chatView').classList.add('is-hidden');
}

function deleteChat(id) {
  chats = chats.filter(c => c.id !== id);
  if (currentChatId === id) closeChat();
  renderChatList();
  showToast('Удалено');
}

/* ---------------------------------------------------------------- MESSAGES */
function statusText(status) {
  if (status === 'sending') return 'Отправка...';
  if (status === 'sent') return 'Отправлено';
  if (status === 'delivered') return 'Доставлено';
  if (status === 'read') return 'Прочитано';
  return '';
}

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
  div.className = `bubble bubble--${msg.type}`;
  div.dataset.msgId = msg.id;
  div.innerHTML = `<span class="bubble__text">${escapeHtml(msg.text)}</span><span class="bubble__meta">${msg.time} ${msg.type === 'out' ? `· <span class="status-indicator">${statusText(msg.status)}</span>` : ''}</span>`;
  
  row.appendChild(div);
  DOM.messagesArea.appendChild(row);
}

function sendMessage(text = '') {
  if (!currentChatId || !text.trim()) return;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const newMsg = { id: Date.now(), text, time: timeStr, type: "out", status: 'sending' };
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

  simulateMessageStatus(currentChatId, newMsg.id);
}

function simulateMessageStatus(chatId, msgId) {
  const updateStatus = (status) => {
    const msg = (messagesData[chatId] || []).find(m => m.id === msgId);
    if (!msg) return;
    msg.status = status;
    if (currentChatId === chatId) {
      const row = DOM.messagesArea.querySelector(`.bubble-row[data-msg-id="${msgId}"] .status-indicator`);
      if (row) row.textContent = statusText(status);
    }
  };
  setTimeout(() => updateStatus('delivered'), 800);
  setTimeout(() => updateStatus('read'), 2500);
}

/* ---------------------------------------------------------------- GESTURES (SWIPE TO DELETE) */
function setupSwipeGestures() {
  const items = document.querySelectorAll('.swipe-front');
  items.forEach(item => {
    let startX = 0, currentX = 0, isDragging = false;
    
    item.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
      item.style.transition = 'none';
    }, { passive: true });

    item.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const x = e.touches[0].clientX - startX;
      if (x < 0 && x > -80) {
        currentX = x;
        requestAnimationFrame(() => { item.style.transform = `translateX(${currentX}px)`; });
      }
    }, { passive: true });

    item.addEventListener('touchend', () => {
      isDragging = false;
      item.style.transition = 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1.05)';
      if (currentX < -45) {
        item.style.transform = `translateX(-80px)`;
      } else {
        item.style.transform = `translateX(0px)`;
      }
      currentX = 0;
    });
  });
}

/* ---------------------------------------------------------------- CAMERA & RECORDING */
async function startCamera() {
  try {
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: currentFacingMode }, audio: false 
    });
    DOM.cameraFeed.srcObject = cameraStream;
  } catch (e) {
    console.warn("No camera access", e);
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }
  DOM.cameraFeed.srcObject = null;
}

DOM.flipBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
  DOM.cameraFeed.style.transform = currentFacingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)';
  startCamera();
});

function setupRecordingGestures() {
  let isRecording = false;
  let timer;

  const startRec = () => {
    if (DOM.messageInput.value.trim().length > 0) return;
    isRecording = true;
    DOM.composerMain.style.opacity = '0';
    DOM.recordOverlay.classList.add('is-active');
    startCamera();
    if(navigator.vibrate) navigator.vibrate(50);
  };

  const stopRec = () => {
    if (!isRecording) return;
    isRecording = false;
    DOM.composerMain.style.opacity = '1';
    DOM.recordOverlay.classList.remove('is-active');
    stopCamera();
    if(navigator.vibrate) navigator.vibrate(20);
  };

  DOM.mediaBtn.addEventListener('touchstart', startRec, { passive: true });
  DOM.mediaBtn.addEventListener('mousedown', startRec);
  document.addEventListener('touchend', stopRec);
  document.addEventListener('mouseup', stopRec);
}

/* ---------------------------------------------------------------- SEARCH FULLSCREEN */
DOM.searchInput.addEventListener('focus', () => {
  DOM.searchRow.classList.add('is-active');
  DOM.searchState.classList.remove('is-hidden');
  requestAnimationFrame(() => DOM.searchState.classList.add('is-open'));
});

window.exitSearch = () => {
  DOM.searchInput.value = '';
  DOM.searchRow.classList.remove('is-active');
  DOM.searchState.classList.remove('is-open');
  setTimeout(() => DOM.searchState.classList.add('is-hidden'), 400);
  DOM.searchInput.blur();
};

/* ---------------------------------------------------------------- PANELS */
window.toggleNewChat = (open) => {
  const p = document.getElementById('newChatPanel');
  if (open) requestAnimationFrame(() => p.classList.add('is-open'));
  else p.classList.remove('is-open');
};

window.toggleSettings = (open) => {
  const p = document.getElementById('settingsPanel');
  if (open) {
    document.getElementById('settingsContent').innerHTML = `
      <div class="info-group liquid-glass"><div class="info-row"><span class="info-row__value">Уведомления</span></div></div>
      <div class="info-group liquid-glass"><div class="info-row"><span class="info-row__value">Конфиденциальность</span></div></div>
    `;
    requestAnimationFrame(() => p.classList.add('is-open'));
  } else p.classList.remove('is-open');
};

window.toggleProfile = (open) => {
  const p = document.getElementById('profilePanel');
  if (open) {
    const chat = chats.find(c => c.id === currentChatId);
    document.getElementById('profileContent').innerHTML = `
      <div class="avatar avatar--giant" style="background:${chat.color}">${chat.avatar}</div>
      <div style="text-align:center; font-size:22px; font-weight:600; margin-bottom: 24px;">${chat.name}</div>
      <div class="info-group liquid-glass">
        <div class="info-row"><span class="info-row__label">Телефон</span><span class="info-row__value">${chat.phone}</span></div>
        <div class="info-row"><span class="info-row__label">О себе</span><span class="info-row__value">${chat.bio}</span></div>
      </div>
    `;
    requestAnimationFrame(() => p.classList.add('is-open'));
  } else p.classList.remove('is-open');
};

window.openAvatarPreview = () => {
  const modal = document.getElementById('avatarModal');
  const chat = chats.find(c => c.id === currentChatId);
  document.getElementById('avatarModalContent').innerHTML = chat.avatar;
  document.getElementById('avatarModalContent').style.background = chat.color;
  modal.classList.remove('is-hidden');
};

window.closeAvatarPreview = () => {
  const modal = document.getElementById('avatarModal');
  modal.classList.add('is-hidden');
};

/* ---------------------------------------------------------------- CONTEXT MENU (SMOOTH SCROLL PREVIEW) */
function setupLongPress() {
  let pressTimer;
  DOM.chatList.addEventListener('touchstart', (e) => {
    const item = e.target.closest('.swipe-front');
    if (!item) return;
    pressTimer = setTimeout(() => {
      const chat = chats.find(c => c.id == item.dataset.chatId);
      if(chat) openContext(chat);
    }, 500);
  }, { passive: true });
  DOM.chatList.addEventListener('touchmove', () => clearTimeout(pressTimer), { passive: true });
  DOM.chatList.addEventListener('touchend', () => clearTimeout(pressTimer));
}

function openContext(chat) {
  if(navigator.vibrate) navigator.vibrate(15);
  DOM.ctxPreview.innerHTML = `
    <div style="padding:16px;">
      <div class="avatar" style="background:${chat.color}; margin-bottom:12px;">${chat.avatar}</div>
      <div style="font-weight:600; font-size:18px;">${chat.name}</div>
      <div style="color:var(--text-secondary); margin-top:8px;">Здесь может быть длинная история сообщений для скролла. Liquid Glass архитектура позволяет легко скроллить этот блок.</div>
      <br><br><br><br><i>Скролл тест...</i>
    </div>
  `;
  DOM.ctxActions.innerHTML = `
    <div class="ctx-action"><span>Закрепить</span></div>
    <div class="ctx-action ctx-action--danger"><span>Удалить чат</span></div>
  `;
  DOM.ctxScrim.classList.remove('is-hidden');
  DOM.ctxMenu.classList.remove('is-hidden');
  requestAnimationFrame(() => DOM.ctxMenu.classList.add('is-open'));
}

DOM.ctxScrim.addEventListener('click', () => {
  DOM.ctxMenu.classList.remove('is-open');
  setTimeout(() => {
    DOM.ctxScrim.classList.add('is-hidden');
    DOM.ctxMenu.classList.add('is-hidden');
  }, 300);
});

/* ---------------------------------------------------------------- UTILS */
function setupEventListeners() {
  DOM.messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    checkInputState();
  });
  DOM.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(DOM.messageInput.value); }
  });
  DOM.sendBtn.addEventListener('click', () => sendMessage(DOM.messageInput.value));
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
window.showToast = (msg) => {
  DOM.toast.textContent = msg;
  DOM.toast.classList.add('is-visible');
  setTimeout(() => DOM.toast.classList.remove('is-visible'), 2000);
};

init();
