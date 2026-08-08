// script.js

// --- Data ---
const currentUser = {
    name: 'Александр',
    tag: '@alexander',
    phone: '+7 (999) 123-45-67',
    birth: '15 марта 1995',
    description: 'Жизнь — это путешествие 🌍',
    avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 40 40\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'20\' fill=\'%23587a9e\'/%3E%3Ccircle cx=\'20\' cy=\'14\' r=\'6\' fill=\'%23a8c8e8\'/%3E%3Cellipse cx=\'20\' cy=\'34\' rx=\'12\' ry=\'8\' fill=\'%23a8c8e8\'/%3E%3C/svg%3E'
};

const contacts = [
    { id: 1, name: 'Мария', avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 40 40\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'20\' fill=\'%238a6b9e\'/%3E%3Ccircle cx=\'20\' cy=\'14\' r=\'6\' fill=\'%23d4b8e8\'/%3E%3Cellipse cx=\'20\' cy=\'34\' rx=\'12\' ry=\'8\' fill=\'%23d4b8e8\'/%3E%3C/svg%3E', status: 'была недавно', tag: '@maria', phone: '+7 (999) 234-56-78', birth: '22 июня 1997', description: 'Люблю кофе и книги ☕📚' },
    { id: 2, name: 'Дмитрий', avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 40 40\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'20\' fill=\'%23587a9e\'/%3E%3Ccircle cx=\'20\' cy=\'14\' r=\'6\' fill=\'%23a8c8e8\'/%3E%3Cellipse cx=\'20\' cy=\'34\' rx=\'12\' ry=\'8\' fill=\'%23a8c8e8\'/%3E%3C/svg%3E', status: 'в сети', tag: '@dmitry', phone: '+7 (999) 345-67-89', birth: '5 октября 1993', description: 'Разработчик 👨‍💻' },
    { id: 3, name: 'Елена', avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 40 40\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'20\' fill=\'%239e6b6b\'/%3E%3Ccircle cx=\'20\' cy=\'14\' r=\'6\' fill=\'%23e8b8b8\'/%3E%3Cellipse cx=\'20\' cy=\'34\' rx=\'12\' ry=\'8\' fill=\'%23e8b8b8\'/%3E%3C/svg%3E', status: 'была вчера', tag: '@elena', phone: '+7 (999) 456-78-90', birth: '11 ноября 1999', description: 'Путешественница ✈️' },
    { id: 4, name: 'Алексей', avatar: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 40 40\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'20\' fill=\'%235e9e6b\'/%3E%3Ccircle cx=\'20\' cy=\'14\' r=\'6\' fill=\'%23b8e8b8\'/%3E%3Cellipse cx=\'20\' cy=\'34\' rx=\'12\' ry=\'8\' fill=\'%23b8e8b8\'/%3E%3C/svg%3E', status: 'был недавно', tag: '@alexey', phone: '+7 (999) 567-89-01', birth: '30 апреля 1996', description: 'Спортсмен 🏋️' }
];

let chatsData = [
    { id: 1, contactId: 1, messages: [
        { sender: 'me', text: 'Привет! Как дела?', time: '12:30', status: 'read' },
        { sender: 'contact', text: 'Привет! Всё отлично, спасибо :)', time: '12:31' },
        { sender: 'me', text: 'Чем занимаешься?', time: '12:32', status: 'delivered' }
    ], unread: 0, muted: false, lastMessage: 'Чем занимаешься?', lastTime: '12:32' },
    { id: 2, contactId: 2, messages: [
        { sender: 'contact', text: 'Встречаемся завтра в 10', time: 'Пн' }
    ], unread: 2, muted: true, lastMessage: 'Встречаемся завтра в 10', lastTime: 'Пн' },
    { id: 3, contactId: 3, messages: [
        { sender: 'contact', text: 'Скинь фото с отпуска', time: 'Вчера' }
    ], unread: 0, muted: false, lastMessage: 'Скинь фото с отпуска', lastTime: 'Вчера' },
    { id: 4, contactId: 4, messages: [], unread: 0, muted: false, lastMessage: 'Нет сообщений', lastTime: '' }
];

let currentChatId = null;
let longPressTimer = null;
let startX = 0;
let currentSwipeItem = null;

// --- DOM Elements ---
const views = {
    main: document.getElementById('mainView'),
    settings: document.getElementById('settingsView'),
    profile: document.getElementById('profileView'),
    editProfile: document.getElementById('editProfileView'),
    chat: document.getElementById('chatView'),
    contactProfile: document.getElementById('contactProfileView')
};

const chatList = document.getElementById('chatList');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const micIcon = document.getElementById('micIcon');
const cameraIcon = document.getElementById('cameraIcon');
const sendIcon = document.getElementById('sendIcon');
const newChatModal = document.getElementById('newChatModal');
const newChatSheet = document.getElementById('newChatSheet');
const previewOverlay = document.getElementById('previewOverlay');
const previewWindow = document.getElementById('previewWindow');
const previewMessages = document.getElementById('previewMessages');
const previewActions = document.getElementById('previewActions');
const avatarPreviewOverlay = document.getElementById('avatarPreviewOverlay');
const avatarPreviewImg = document.getElementById('avatarPreviewImg');
const voiceOverlay = document.getElementById('voiceOverlay');

// --- Navigation ---
function navigateTo(viewId) {
    Object.values(views).forEach(v => {
        if (v.classList.contains('active')) {
            v.classList.add('exit-left');
            setTimeout(() => v.classList.remove('active', 'exit-left'), 300);
        }
    });
    setTimeout(() => {
        document.getElementById(viewId).classList.add('active');
    }, 100);
}

function goBack(currentViewId, targetViewId = 'mainView') {
    const current = document.getElementById(currentViewId);
    if (current) {
        current.classList.add('exit-left');
        setTimeout(() => current.classList.remove('active', 'exit-left'), 300);
    }
    setTimeout(() => {
        document.getElementById(targetViewId).classList.add('active');
    }, 100);
}

// --- Render Chat List ---
function renderChatList() {
    chatList.innerHTML = '';
    chatsData.forEach(chat => {
        const contact = contacts.find(c => c.id === chat.contactId);
        if (!contact) return;
        const item = document.createElement('div');
        item.className = 'chat-item';
        item.dataset.chatId = chat.id;
        item.innerHTML = `
            <img src="${contact.avatar}" alt="${contact.name}" class="chat-avatar">
            <div class="chat-content">
                <div class="chat-header-row">
                    <span class="chat-name">${contact.name} ${chat.muted ? '<span class="mute-icon">🔇</span>' : ''}</span>
                    <span class="chat-time">${chat.lastTime}</span>
                </div>
                <div class="chat-footer">
                    <span class="chat-last-msg">${chat.lastMessage}</span>
                    ${chat.unread > 0 ? `<span class="unread-badge">${chat.unread}</span>` : ''}
                </div>
            </div>
            <div class="swipe-actions">
                <div class="swipe-btn swipe-delete">Удалить</div>
                <div class="swipe-btn swipe-mute">Заглушить</div>
            </div>
        `;
        // Click -> open chat
        item.addEventListener('click', (e) => {
            if (item.classList.contains('swiped')) {
                e.preventDefault();
                return;
            }
            openChat(chat.id);
        });
        // Long press -> preview
        item.addEventListener('touchstart', (e) => startLongPress(e, chat, item));
        item.addEventListener('touchend', cancelLongPress);
        item.addEventListener('touchmove', cancelLongPress);
        item.addEventListener('mousedown', (e) => startLongPress(e, chat, item));
        item.addEventListener('mouseup', cancelLongPress);
        item.addEventListener('mouseleave', cancelLongPress);
        // Swipe
        item.addEventListener('touchstart', handleSwipeStart, { passive: true });
        item.addEventListener('touchmove', handleSwipeMove, { passive: false });
        item.addEventListener('touchend', handleSwipeEnd);
        chatList.appendChild(item);
    });
}

// --- Long press preview ---
function startLongPress(e, chat, element) {
    longPressTimer = setTimeout(() => {
        showPreview(chat);
    }, 500);
}
function cancelLongPress() {
    clearTimeout(longPressTimer);
}

function showPreview(chat) {
    const contact = contacts.find(c => c.id === chat.contactId);
    previewMessages.innerHTML = chat.messages.slice(-4).map(m => 
        `<div style="margin-bottom:6px;color:${m.sender==='me'?'#0A84FF':'white'}">${m.text}</div>`
    ).join('');
    previewOverlay.classList.add('active');
    previewActions.innerHTML = `
        <button class="preview-action-btn glass-panel">📥 Архивировать</button>
        <button class="preview-action-btn glass-panel">📌 Закрепить</button>
    `;
    previewActions.onclick = (e) => {
        if (e.target.classList.contains('preview-action-btn')) {
            previewOverlay.classList.remove('active');
        }
    };
    previewOverlay.onclick = (e) => {
        if (e.target === previewOverlay) previewOverlay.classList.remove('active');
    };
}

// --- Swipe ---
function handleSwipeStart(e) {
    startX = e.touches[0].clientX;
    const item = e.currentTarget;
    if (item.classList.contains('swiped')) {
        currentSwipeItem = item;
    } else {
        currentSwipeItem = null;
    }
}
function handleSwipeMove(e) {
    if (!currentSwipeItem) return;
    const dx = e.touches[0].clientX - startX;
    if (dx < -30) {
        currentSwipeItem.classList.add('swiped');
    } else if (dx > 30) {
        currentSwipeItem.classList.remove('swiped');
    }
}
function handleSwipeEnd(e) {
    if (currentSwipeItem && !currentSwipeItem.classList.contains('swiped')) {
        // maybe close if swiped back
    }
    currentSwipeItem = null;
}

// Swipe delete/mute actions
chatList.addEventListener('click', (e) => {
    if (e.target.classList.contains('swipe-delete')) {
        const item = e.target.closest('.chat-item');
        const chatId = parseInt(item.dataset.chatId);
        chatsData = chatsData.filter(c => c.id !== chatId);
        renderChatList();
    }
    if (e.target.classList.contains('swipe-mute')) {
        const item = e.target.closest('.chat-item');
        const chatId = parseInt(item.dataset.chatId);
        const chat = chatsData.find(c => c.id === chatId);
        if (chat) {
            chat.muted = !chat.muted;
            renderChatList();
            item.classList.remove('swiped');
        }
    }
});

// --- Open Chat ---
function openChat(chatId) {
    currentChatId = chatId;
    const chat = chatsData.find(c => c.id === chatId);
    const contact = contacts.find(c => c.id === chat.contactId);
    document.getElementById('chatContactName').textContent = contact.name;
    document.getElementById('chatContactStatus').textContent = contact.status;
    document.querySelector('.chat-avatar-btn .avatar-img').src = contact.avatar;
    renderMessages(chat.messages);
    navigateTo('chatView');
    messageInput.value = '';
    updateSendButton();
    // scroll to bottom
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    messages.forEach((msg, idx) => {
        const row = document.createElement('div');
        row.className = `message-row ${msg.sender === 'me' ? 'sent' : 'received'}`;
        let bubbleContent = '';
        if (msg.replyTo) {
            bubbleContent += `<div class="reply-preview">↩ ${msg.replyTo}</div>`;
        }
        bubbleContent += `<div class="message-bubble">${msg.text}</div>`;
        if (msg.sender === 'me') {
            bubbleContent += `<div class="message-status">${msg.status === 'read' ? 'Прочитано ✓✓' : msg.status === 'delivered' ? 'Доставлено ✓' : 'Отправлено'}</div>`;
        }
        row.innerHTML = bubbleContent;
        messagesContainer.appendChild(row);
    });
}

// --- Send message ---
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentChatId) return;
    const chat = chatsData.find(c => c.id === currentChatId);
    const newMsg = { sender: 'me', text, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), status: 'sent' };
    chat.messages.push(newMsg);
    chat.lastMessage = text;
    chat.lastTime = 'Сейчас';
    chat.unread = 0;
    renderMessages(chat.messages);
    messageInput.value = '';
    updateSendButton();
    renderChatList();
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        // Simulate read receipt
        newMsg.status = 'delivered';
        renderMessages(chat.messages);
        setTimeout(() => {
            newMsg.status = 'read';
            renderMessages(chat.messages);
        }, 1500);
    }, 300);
}

// --- Input / Send button logic ---
messageInput.addEventListener('input', updateSendButton);
function updateSendButton() {
    const hasText = messageInput.value.trim().length > 0;
    micIcon.classList.toggle('hidden', hasText);
    cameraIcon.classList.toggle('hidden', hasText);
    sendIcon.classList.toggle('hidden', !hasText);
}

sendBtn.addEventListener('click', () => {
    if (!messageInput.value.trim()) {
        // Toggle camera/mic? For now just send if text exists
        if (micIcon.classList.contains('hidden')) {
            // camera mode: trigger camera? just placeholder
        } else {
            // mic mode: start voice? show voice overlay
            voiceOverlay.classList.remove('hidden');
            setTimeout(() => voiceOverlay.classList.add('hidden'), 2000);
        }
    } else {
        sendMessage();
    }
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// --- Settings navigation ---
document.getElementById('settingsBtn').addEventListener('click', () => navigateTo('settingsView'));
document.getElementById('settingsBackBtn').addEventListener('click', () => goBack('settingsView'));
document.getElementById('profileBlock').addEventListener('click', () => navigateTo('profileView'));
document.getElementById('profileBackBtn').addEventListener('click', () => goBack('profileView', 'settingsView'));
document.getElementById('editProfileBtn').addEventListener('click', () => navigateTo('editProfileView'));
document.getElementById('editProfileBackBtn').addEventListener('click', () => goBack('editProfileView', 'profileView'));
document.getElementById('editProfileDoneBtn').addEventListener('click', () => goBack('editProfileView', 'profileView'));

// --- Chat header buttons ---
document.getElementById('chatBackBtn').addEventListener('click', () => goBack('chatView'));
document.getElementById('chatContactInfo').addEventListener('click', () => {
    const chat = chatsData.find(c => c.id === currentChatId);
    const contact = contacts.find(c => c.id === chat.contactId);
    renderContactProfile(contact);
    navigateTo('contactProfileView');
});
document.getElementById('chatAvatarBtn').addEventListener('click', () => {
    const chat = chatsData.find(c => c.id === currentChatId);
    const contact = contacts.find(c => c.id === chat.contactId);
    avatarPreviewImg.src = contact.avatar;
    avatarPreviewOverlay.classList.add('active');
});
document.getElementById('contactProfileBackBtn').addEventListener('click', () => goBack('contactProfileView', 'chatView'));
avatarPreviewOverlay.addEventListener('click', () => avatarPreviewOverlay.classList.remove('active'));

function renderContactProfile(contact) {
    const container = document.getElementById('contactProfileContent');
    container.innerHTML = `
        <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar">
        <h2 class="contact-name">${contact.name}</h2>
        <p class="contact-status">${contact.status}</p>
        <div class="contact-actions">
            <button class="contact-action-btn"><span class="contact-action-icon">📞</span>Аудио</button>
            <button class="contact-action-btn"><span class="contact-action-icon">📹</span>Видео</button>
            <button class="contact-action-btn"><span class="contact-action-icon">🔇</span>Без звука</button>
            <button class="contact-action-btn"><span class="contact-action-icon">🔍</span>Поиск</button>
        </div>
        <div class="contact-track glass-panel">
            <div class="track-cover">🎵</div>
            <div class="track-info">
                <span class="track-title">Blinding Lights</span>
                <span class="track-artist">The Weeknd</span>
            </div>
        </div>
        <div class="contact-info-card glass-panel">
            <div class="info-row"><span class="info-label">Номер</span><span class="info-value">${contact.phone}</span></div>
            <div class="info-row"><span class="info-label">Тег</span><span class="info-value">${contact.tag}</span></div>
            <div class="info-row"><span class="info-label">Дата рождения</span><span class="info-value">${contact.birth}</span></div>
            <div class="info-row last"><span class="info-label">Описание</span><span class="info-value">${contact.description}</span></div>
        </div>
        <div class="settings-block glass-panel" style="width:100%; padding: 14px 16px; text-align:center; color:var(--text-secondary);">Общие медиа</div>
    `;
}

// --- New Chat Modal ---
document.getElementById('newChatBtn').addEventListener('click', () => {
    newChatModal.classList.add('active');
    renderModalContacts();
});
newChatModal.addEventListener('click', (e) => {
    if (e.target === newChatModal) newChatModal.classList.remove('active');
});
function renderModalContacts() {
    const container = document.getElementById('modalContacts');
    container.innerHTML = '<h4 style="margin:12px 0;color:var(--text-secondary);">Контакты</h4>';
    contacts.forEach(c => {
        const div = document.createElement('div');
        div.className = 'chat-item';
        div.innerHTML = `
            <img src="${c.avatar}" class="chat-avatar">
            <div class="chat-content">
                <span class="chat-name">${c.name}</span>
                <span class="chat-last-msg">${c.tag}</span>
            </div>
        `;
        div.addEventListener('click', () => {
            // Start chat with contact
            let chat = chatsData.find(ch => ch.contactId === c.id);
            if (!chat) {
                chat = {
                    id: Date.now(),
                    contactId: c.id,
                    messages: [],
                    unread: 0,
                    muted: false,
                    lastMessage: 'Нет сообщений',
                    lastTime: ''
                };
                chatsData.unshift(chat);
            }
            newChatModal.classList.remove('active');
            openChat(chat.id);
            renderChatList();
        });
        container.appendChild(div);
    });
}

// --- Init ---
renderChatList();
updateSendButton();

// Hide preview overlay on click outside
previewOverlay.addEventListener('click', (e) => {
    if (e.target === previewOverlay) previewOverlay.classList.remove('active');
});