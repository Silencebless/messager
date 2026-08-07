/**
 * OLED Messenger — Production Script
 */

let chats = [
  { id: 1, name: "Anna Smirnova", avatar: "А", color: "#8B5CF6", online: true, lastMsg: "Hello, how are you?", time: "14:32", unread: 0 },
  { id: 2, name: "Design-team", avatar: "D", color: "#FF9F0A", online: false, lastMsg: "Igor: Upload makets from Figma!", time: "13:05", unread: 3 },
  { id: 3, name: "Igor", avatar: "И", color: "#32ADE6", online: true, lastMsg: "Ok, called", time: "Вчера", unread: 0 }
];

let globalContacts = [
  { id: 4, name: "Elon Musk", avatar: "E", color: "#FF3B30", online: true },
  { id: 5, name: "Tim Cook", avatar: "T", color: "#34C759", online: false }
];

let messagesData = {
  1: [
    { id: 101, text: "Hello, how are you?", time: "14:30", type: "in" },
    { id: 102, text: "Hello, very good! Ready for production.", time: "14:31", type: "out" }
  ]
};

let currentChatId = null;
let recordMode = 'audio';

const DOM = {
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
  slideCancelText: document.getElementById('slideCancelText')
};

function init() {
  renderChatList();
  renderGlobalContacts();
  setupEventListeners();
  setupSwipeGestures();
  setupRecordingGestures();
}

function renderChatList() {
  DOM.chatList.innerHTML = '';
  chats.forEach(chat => {
    const isActive = chat.id === currentChatId ? 'is-active' : '';
    const badge = chat.unread > 0 ? `<span class="chat-item__badge">${chat.unread}</span>` : '';
    
    const li = document.createElement('li');
    li.className = 'swipe-item';
    li.innerHTML = `
      <div class="swipe-actions">
        <button class="btn btn--icon" style="color: #fff;" onclick="deleteChat(${chat.id})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
      <div class="swipe-front chat-item ${isActive}" onclick="openChat(${chat.id})">
        <div class="avatar" style="background: ${chat.color}">
          ${chat.avatar}${chat.online ? '<span class="avatar__status"></span>' : ''}
        </div>
        <div class="chat-item__body">
          <div class="chat-item__top">
            <span class="chat-item__name">${chat.name}</span>
            <span class="chat-item__time">${chat.time}</span>
          </div>
          <span class="chat-item__preview">${chat.lastMsg || '...'}</span>
        </div>
        ${badge}
      </div>
    `;
    DOM.chatList.appendChild(li);
  });
  setupSwipeGestures();
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
        <div class="chat-item__name">${user.name}</div>
      </div>
    `;
    DOM.globalContactList.appendChild(li);
  });
}

function openChat(chatId, newUser = null) {
  currentChatId = chatId;
  if (newUser && !chats.find(c => c.id === chatId)) {
    chats.unshift({ ...newUser, lastMsg: '', time: '', unread: 0 });
  }

  const chat = chats.find(c => c.id === chatId);
  chat.unread = 0;
  renderChatList();

  document.getElementById('chatEmptyState').classList.add('is-hidden');
  document.getElementById('chatContent').classList.remove('is-hidden');
  if (window.innerWidth < 768) document.getElementById('chatView').classList.remove('is-hidden');

  document.getElementById('headerName').textContent = chat.name;
  document.getElementById('headerStatus').textContent = chat.online ? 'Online' : 'Offline';
  document.getElementById('headerStatus').className = `chat-view__subtitle ${chat.online ? 'online' : ''}`;
  
  const avHTML = `${chat.avatar}${chat.online ? '<span class="avatar__status"></span>' : ''}`;
  document.getElementById('headerAvatarDesktop').innerHTML = avHTML;
  document.getElementById('headerAvatarDesktop').style.background = chat.color;
  document.getElementById('headerAvatarMobile').innerHTML = avHTML;
  document.getElementById('headerAvatarMobile').style.background = chat.color;

  document.getElementById('profileContent').innerHTML = `
    <div class="profile-hero">
      <div class="avatar avatar--xl" style="background: ${chat.color}">${chat.avatar}</div>
      <h2>${chat.name}</h2>
      <p style="color: ${chat.online ? 'var(--color-online)' : 'var(--text-secondary)'}; margin-top:4px;">${chat.online ? 'Online' : 'Offline'}</p>
    </div>
  `;

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
}

function renderMessages(chatId) {
  DOM.messagesArea.innerHTML = '';
  const msgs = messagesData[chatId] || [];
  msgs.forEach(msg => appendMessage(msg));
  scrollToBottom();
}

function appendMessage(msg) {
  const div = document.createElement('div');
  
  if (msg.mediaType === 'audio') {
    div.className = `bubble bubble--out bubble--voice`;
    div.innerHTML = `<div class="play-btn"><svg width="14" height="14" fill="#fff" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div><div class="waveform"></div><span class="bubble__time">${msg.time}</span>`;
  } else if (msg.mediaType === 'video') {
    div.className = `bubble bubble--out bubble--video`;
    div.innerHTML = `<img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" alt="video"><span class="bubble__time" style="position:absolute; bottom:12px; right:12px; color:#fff; text-shadow: 0 1px 2px #000;">${msg.time}</span>`;
  } else {
    div.className = `bubble ${msg.type === 'in' ? 'bubble--in' : 'bubble--out'}`;
    const p = document.createElement('p');
    p.textContent = msg.text;
    div.appendChild(p);
    div.insertAdjacentHTML('beforeend', `<span class="bubble__time">${msg.time}</span>`);
  }
  
  DOM.messagesArea.appendChild(div);
}

function sendMessage(text = '', mediaType = null) {
  if (!currentChatId) return;
  const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const newMsg = { id: Date.now(), text, time: timeStr, type: "out", mediaType };
  if (!messagesData[currentChatId]) messagesData[currentChatId] = [];
  messagesData[currentChatId].push(newMsg);

  const chat = chats.find(c => c.id === currentChatId);
  chat.lastMsg = mediaType === 'audio' ? '🎤 Voice message' : mediaType === 'video' ? '🎥 Video message' : text;
  chat.time = timeStr;
  
  renderChatList();
  appendMessage(newMsg);
  scrollToBottom();

  DOM.messageInput.value = '';
  DOM.messageInput.style.height = 'auto';
  checkInputState();
  vibrate(10);
}

function setupSwipeGestures() {
  const items = document.querySelectorAll('.swipe-front');
  let startX = 0, currentX = 0, isDragging = false;

  items.forEach(item => {
    item.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
      item.classList.add('is-swiping');
    }, {passive: true});

    item.addEventListener('touchmove', e => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX - startX;
      if (currentX < 0 && currentX > -76) {
        item.style.transform = `translateX(${currentX}px)`;
      }
    }, {passive: true});

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
    if(DOM.messageInput.value.trim().length > 0) return;
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
  DOM.mediaBtn.addEventListener('touchstart', startRecording, {passive: true});
  document.addEventListener('mousemove', moveRecording);
  document.addEventListener('touchmove', moveRecording, {passive: true});
  document.addEventListener('mouseup', stopRecording);
  document.addEventListener('touchend', stopRecording);
}

function setupEventListeners() {
  DOM.messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    checkInputState();
  });

  DOM.messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(this.value.trim());
    }
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

function scrollToBottom() {
  DOM.messagesArea.scrollTop = DOM.messagesArea.scrollHeight;
}

function vibrate(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

window.toggleSettings = (s) => s ? document.getElementById('settingsPanel').classList.add('is-open') : document.getElementById('settingsPanel').classList.remove('is-open');
window.toggleProfile = (s) => s ? document.getElementById('profilePanel').classList.add('is-open') : document.getElementById('profilePanel').classList.remove('is-open');
window.toggleNewChat = (s) => s ? document.getElementById('newChatPanel').classList.add('is-open') : document.getElementById('newChatPanel').classList.remove('is-open');

init();