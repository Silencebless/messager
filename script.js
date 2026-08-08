/**
 * OLED Messenger — iOS 26 "Liquid Glass"
 */
let chats = [
  { id: 1, name: "Anna Smirnova", avatar: "А", color: "#8B5CF6", online: true, lastMsg: "Отлично, тогда до встречи!", time: "14:32", unread: 0, pinned: true },
  { id: 2, name: "Design Team", avatar: "D", color: "#FF9F0A", online: false, lastMsg: "Игорь: Залил макеты из Figma!", time: "13:05", unread: 3, pinned: false }
];
let messagesData = {
  1: [
    { id: 101, text: "Привет! Готов к продакшену 🚀", time: "14:29", type: "out", status: "read" },
    { id: 102, text: "Отлично, тогда до встречи!", time: "14:32", type: "in" }
  ]
};

let currentChatId = null;
let recordMode = 'audio';
let isSearchActive = false;

/* --- DOM & Init --- */
const DOM = {
  chatList: document.getElementById('chatList'),
  messagesArea: document.getElementById('messagesArea'),
  messageInput: document.getElementById('messageInput'),
  searchRow: document.getElementById('searchRow'),
  searchInput: document.getElementById('searchInput'),
  chatView: document.getElementById('chatView'),
  ctxMenu: document.getElementById('ctxMenu'),
  ctxScrim: document.getElementById('ctxScrim'),
  ctxPreview: document.getElementById('ctxPreview'),
  videoUI: document.getElementById('videoRecordUI')
};

function init() {
  renderChatList();
  setupSwipeToDelete();
  setupLongPress();
  setupComposer();
}

/* --- Render logic --- */
function renderChatList() {
  DOM.chatList.innerHTML = '';
  chats.sort((a, b) => b.pinned - a.pinned).forEach(chat => {
    const li = document.createElement('li');
    li.className = 'swipe-item';
    li.innerHTML = `
      <div class="swipe-actions"><button onclick="deleteChat(${chat.id})">Удалить</button></div>
      <div class="swipe-front chat-item ${chat.pinned ? 'is-pinned' : ''}" onclick="openChat(${chat.id})" data-chat-id="${chat.id}">
        <div class="avatar" style="background:${chat.color}">${chat.avatar}</div>
        <div class="chat-item__body">
          <div class="chat-item__top"><span class="chat-item__name">${chat.name}</span></div>
          <span class="chat-item__preview">${chat.lastMsg}</span>
        </div>
      </div>
    `;
    DOM.chatList.appendChild(li);
  });
  setupSwipeToDelete();
}

/* --- iOS Statuses --- */
function statusText(status) {
  if (status === 'sending') return `<span class="bubble__status">Отправка...</span>`;
  if (status === 'sent') return `<span class="bubble__status">Отправлено</span>`;
  if (status === 'delivered') return `<span class="bubble__status">Доставлено</span>`;
  if (status === 'read') return `<span class="bubble__status">Прочитано</span>`;
  return '';
}

function renderMessages(chatId) {
  DOM.messagesArea.innerHTML = '';
  (messagesData[chatId] || []).forEach(msg => {
    const row = document.createElement('div');
    row.className = `bubble-row bubble-row--${msg.type}`;
    row.innerHTML = `
      <div class="bubble bubble--${msg.type}" data-msg-id="${msg.id}">
        <div class="bubble__text">${msg.text}</div>
        <div class="bubble__meta">
          <span class="bubble__time">${msg.time}</span>
          ${msg.type === 'out' ? statusText(msg.status) : ''}
        </div>
      </div>`;
    DOM.messagesArea.appendChild(row);
  });
  DOM.messagesArea.scrollTop = DOM.messagesArea.scrollHeight;
}

/* --- Chat Navigation --- */
function openChat(id) {
  currentChatId = id;
  const chat = chats.find(c => c.id === id);
  document.getElementById('headerName').textContent = chat.name;
  document.getElementById('headerAvatarMobile').innerHTML = chat.avatar;
  document.getElementById('headerAvatarMobile').style.background = chat.color;
  
  DOM.chatView.classList.remove('is-hidden');
  requestAnimationFrame(() => DOM.chatView.classList.add('is-active'));
  renderMessages(id);
}

function closeChat() {
  DOM.chatView.classList.remove('is-active');
  setTimeout(() => DOM.chatView.classList.add('is-hidden'), 400);
}

function deleteChat(id) {
  chats = chats.filter(c => c.id !== id);
  renderChatList();
}

/* --- Search Fullscreen Logic --- */
DOM.searchInput.addEventListener('focus', () => {
  DOM.searchRow.classList.add('is-active');
  document.getElementById('chatList').classList.add('is-hidden');
  document.getElementById('searchState').classList.remove('is-hidden');
});

window.exitSearch = () => {
  DOM.searchRow.classList.remove('is-active');
  DOM.searchInput.value = '';
  document.getElementById('chatList').classList.remove('is-hidden');
  document.getElementById('searchState').classList.add('is-hidden');
};

/* --- Smooth Swipe To Delete --- */
function setupSwipeToDelete() {
  document.querySelectorAll('.swipe-front').forEach(item => {
    let startX = 0, currentX = 0;
    item.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      item.classList.add('is-swiping');
    }, {passive: true});
    item.addEventListener('touchmove', e => {
      currentX = e.touches[0].clientX - startX;
      if (currentX < 0 && currentX > -80) {
        item.style.transform = `translateX(${currentX}px)`;
      }
    }, {passive: true});
    item.addEventListener('touchend', () => {
      item.classList.remove('is-swiping');
      if (currentX < -45) item.style.transform = `translateX(-80px)`;
      else item.style.transform = `translateX(0px)`;
    });
  });
}

/* --- Context Menu (Scrollable Preview) --- */
function setupLongPress() {
  let pressTimer;
  DOM.chatList.addEventListener('touchstart', (e) => {
    const el = e.target.closest('.swipe-front');
    if (!el) return;
    pressTimer = setTimeout(() => openContextMenu(el.dataset.chatId), 500);
  }, {passive: true});
  DOM.chatList.addEventListener('touchmove', () => clearTimeout(pressTimer), {passive: true});
  DOM.chatList.addEventListener('touchend', () => clearTimeout(pressTimer));
}

function openContextMenu(chatId) {
  const chat = chats.find(c => c.id == chatId);
  if (navigator.vibrate) navigator.vibrate(15);
  
  // Clone actual chat layout for preview
  DOM.ctxPreview.innerHTML = `
    <div style="padding: 10px; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.1)">${chat.name}</div>
    <div style="padding:10px; font-size:14px; opacity:0.8;">${chat.lastMsg}</div>
  `;
  document.getElementById('ctxActions').innerHTML = `
    <div class="ctx-action" onclick="showToast('Закреплено')">Закрепить</div>
    <div class="ctx-action" style="color:#FF453A" onclick="deleteChat(${chat.id}); closeCtx()">Удалить</div>
  `;
  
  DOM.ctxScrim.classList.remove('is-hidden');
  DOM.ctxMenu.classList.remove('is-hidden');
  
  // Center screen placement
  DOM.ctxMenu.style.top = '50%';
  DOM.ctxMenu.style.left = '50%';
  DOM.ctxMenu.style.transform = 'translate(-50%, -50%) scale(0.8)';
  requestAnimationFrame(() => DOM.ctxMenu.style.transform = 'translate(-50%, -50%) scale(1)');
}

window.closeCtx = () => {
  DOM.ctxMenu.style.transform = 'translate(-50%, -50%) scale(0.8)';
  DOM.ctxMenu.style.opacity = '0';
  setTimeout(() => {
    DOM.ctxMenu.classList.add('is-hidden');
    DOM.ctxScrim.classList.add('is-hidden');
    DOM.ctxMenu.style.opacity = '1';
  }, 300);
};
DOM.ctxScrim.addEventListener('click', closeCtx);

/* --- Composer & Video Circle --- */
function setupComposer() {
  DOM.messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    if(this.value.trim().length > 0) {
      document.getElementById('mediaBtn').classList.add('is-hidden');
      document.getElementById('sendBtn').classList.remove('is-hidden');
    } else {
      document.getElementById('mediaBtn').classList.remove('is-hidden');
      document.getElementById('sendBtn').classList.add('is-hidden');
    }
  });

  const mediaBtn = document.getElementById('mediaBtn');
  mediaBtn.addEventListener('click', () => {
    recordMode = recordMode === 'audio' ? 'video' : 'audio';
    document.getElementById('iconMic').classList.toggle('is-hidden', recordMode === 'video');
    document.getElementById('iconCam').classList.toggle('is-hidden', recordMode === 'audio');
  });

  // Long press for video recording UI
  let recTimer;
  mediaBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if(recordMode === 'video') {
      recTimer = setTimeout(() => {
        if(navigator.vibrate) navigator.vibrate(20);
        DOM.videoUI.classList.remove('is-hidden');
      }, 400);
    }
  });
  mediaBtn.addEventListener('touchend', (e) => {
    clearTimeout(recTimer);
    if(!DOM.videoUI.classList.contains('is-hidden')) {
      DOM.videoUI.classList.add('is-hidden');
      sendMessage("🎥 Видеосообщение");
    }
  });
}

function sendMessage(overrideText = null) {
  const text = overrideText || DOM.messageInput.value.trim();
  if(!text) return;
  const newMsg = { id: Date.now(), text, time: "14:35", type: "out", status: "delivered" };
  messagesData[currentChatId].push(newMsg);
  renderMessages(currentChatId);
  DOM.messageInput.value = '';
  DOM.messageInput.dispatchEvent(new Event('input'));
  renderChatList();
}
document.getElementById('sendBtn').addEventListener('click', () => sendMessage());

/* --- Avatar full preview --- */
window.openAvatarPreview = () => {
  const chat = chats.find(c => c.id === currentChatId);
  const container = document.getElementById('avatarPreviewContainer');
  container.innerHTML = `<div class="avatar" style="width:100%; height:100%; font-size:100px; background:${chat.color}">${chat.avatar}</div>`;
  document.getElementById('avatarPreviewOverlay').classList.remove('is-hidden');
};
window.closeAvatarPreview = () => document.getElementById('avatarPreviewOverlay').classList.add('is-hidden');

/* --- Utilities --- */
window.toggleSettings = (open) => {
  document.getElementById('settingsScrim').classList.toggle('is-hidden', !open);
  const panel = document.getElementById('settingsPanel');
  if(open) { requestAnimationFrame(() => panel.classList.add('is-open')); }
  else { panel.classList.remove('is-open'); }
};
window.toggleProfile = (open) => {
  document.getElementById('profileScrim').classList.toggle('is-hidden', !open);
  const p = document.getElementById('profilePanel');
  if(open) { requestAnimationFrame(() => p.classList.add('is-open')); }
  else { p.classList.remove('is-open'); }
};
window.toggleNewChat = (open) => {
  document.getElementById('newChatScrim').classList.toggle('is-hidden', !open);
  const p = document.getElementById('newChatPanel');
  if(open) { requestAnimationFrame(() => p.classList.add('is-open')); }
  else { p.classList.remove('is-open'); }
};
window.showToast = (msg) => {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('is-visible');
  setTimeout(() => t.classList.remove('is-visible'), 2000);
};

init();
