'use strict';
/* =========================================================================
   MESSAGES — app logic
   ========================================================================= */

/* ---------------------------- utilities --------------------------------- */
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const el = (tag, cls, html) => { const n = document.createElement(tag); if(cls) n.className = cls; if(html!==undefined) n.innerHTML = html; return n; };

function hashStr(str){
  let h = 0;
  for(let i=0;i<str.length;i++){ h = (h<<5) - h + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}
const GRADIENTS = [
  ['#FF9F0A','#FF453A'],
  ['#5E5CE6','#0A84FF'],
  ['#30D158','#0A84FF'],
  ['#FF375F','#FF9F0A'],
  ['#64D2FF','#5E5CE6'],
  ['#BF5AF2','#FF375F'],
  ['#FFD60A','#FF9F0A'],
  ['#30D158','#64D2FF'],
];
function gradientFor(seed){ return GRADIENTS[hashStr(seed) % GRADIENTS.length]; }
function initialsFor(name, isGroup){
  if(isGroup) return '👥';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if(parts.length===0) return '?';
  if(parts.length===1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
function paintAvatar(node, name, isGroup){
  const [a,b] = gradientFor(name);
  node.style.background = `linear-gradient(155deg, ${a}, ${b})`;
  node.textContent = initialsFor(name, isGroup);
  node.dataset.avatarName = name;
  node.dataset.avatarGroup = isGroup ? '1' : '0';
}

function pad2(n){ return n<10 ? '0'+n : ''+n; }
function fmtTime(d){ return `${d.getHours()}:${pad2(d.getMinutes())}`; }
function isSameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function dayLabel(d){
  const now = new Date();
  const yest = new Date(now); yest.setDate(now.getDate()-1);
  if(isSameDay(d, now)) return 'Сегодня';
  if(isSameDay(d, yest)) return 'Вчера';
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
function chatListTime(d){
  const now = new Date();
  const yest = new Date(now); yest.setDate(now.getDate()-1);
  if(isSameDay(d, now)) return fmtTime(d);
  if(isSameDay(d, yest)) return 'вчера';
  return `${d.getDate()}.${pad2(d.getMonth()+1)}.${(''+d.getFullYear()).slice(2)}`;
}

let toastTimer = null;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 1900);
}

function minutesAgo(n){ const d = new Date(); d.setMinutes(d.getMinutes()-n); return d; }
function hoursAgo(n){ const d = new Date(); d.setHours(d.getHours()-n); return d; }
function daysAgo(n){ const d = new Date(); d.setDate(d.getDate()-n); d.setHours(12,0,0,0); return d; }

/* ---------------------------- data model --------------------------------- */
const me = {
  name: 'Антон Волков',
  tag: '@anton',
  phone: '+7 999 000-11-22',
  birthday: '8 августа',
  bio: 'Разработчик. Делаю то, чем можно гордиться.',
  track: { title: 'Weightless', artist: 'Marconi Union' }
};

let uid = 1000;
function nextId(){ return String(uid++); }

const REPLIES = [
  'Окей, понял 👍', 'Ахах, точно!', 'Дай мне пару минут',
  'Согласен, давай так и сделаем', 'Хах, было бы неплохо',
  'Сейчас гляну и напишу', 'Отлично, спасибо!', 'Хм, дай подумать 🤔',
  'Именно об этом и подумал', 'Договорились ✅'
];

const chats = [
  {
    id:'c1', name:'Мария Соколова', isGroup:false, tag:'@masha_sok', phone:'+7 916 123-45-67',
    birthday:'14 марта', bio:'Дизайнер интерфейсов. Люблю кофе и котиков ☕🐈',
    online:true, muted:false, pinned:true, archived:false,
    track:{title:'Sunflower', artist:'Post Malone'},
    messages:[
      {id:nextId(), out:false, type:'text', text:'Привет! Как продвигается макет?', time:hoursAgo(5)},
      {id:nextId(), out:true, type:'text', text:'Привет 👋 Почти готово, добавляю анимации', time:hoursAgo(5)},
      {id:nextId(), out:false, type:'text', text:'Класс, жду не дождусь посмотреть', time:hoursAgo(4)},
      {id:nextId(), out:false, type:'voice', dur:12, time:hoursAgo(2)},
      {id:nextId(), out:true, type:'text', text:'Скинь ссылку на референсы, которые ты нашла', time:hoursAgo(2), replyTo:{name:'Мария', text:'Скинь ссылку на референсы'}},
      {id:nextId(), out:false, type:'text', text:'Отправлю сегодня вечером, сейчас на встрече', time:minutesAgo(40)},
    ]
  },
  {
    id:'c2', name:'Дизайн-команда', isGroup:true, memberCount:6,
    online:false, muted:true, pinned:true, archived:false,
    messages:[
      {id:nextId(), out:false, sender:'Игорь', text:'Завтра созвон в 11:00, не забудьте', type:'text', time:hoursAgo(20)},
      {id:nextId(), out:true, type:'text', text:'Записал, буду', time:hoursAgo(19)},
      {id:nextId(), out:false, sender:'Лена', text:'Обновила прототип, гляньте плиз', type:'text', time:hoursAgo(3)},
    ]
  },
  {
    id:'c3', name:'Дмитрий Орлов', isGroup:false, tag:'@d_orlov', phone:'+7 903 555-21-09',
    birthday:'2 ноября', bio:'CTO, люблю Rust и горы',
    online:false, lastSeen:'был(а) 3 часа назад', muted:false, pinned:false, archived:false,
    messages:[
      {id:nextId(), out:false, type:'text', text:'Смотрел новый релиз API?', time:daysAgo(1)},
      {id:nextId(), out:true, type:'text', text:'Да, вебхуки наконец починили', time:daysAgo(1)},
      {id:nextId(), out:false, type:'text', text:'Огонь, буду тестировать сегодня', time:hoursAgo(6)},
    ]
  },
  {
    id:'c4', name:'Катя ✨', isGroup:false, tag:'@katrin', phone:'+7 926 777-88-99',
    birthday:'19 июля', bio:'Фотограф 📷 Москва',
    online:true, muted:false, pinned:false, archived:false, draft:'Слушай, а ты свободна в',
    messages:[
      {id:nextId(), out:true, type:'text', text:'Привет! Долго не виделись', time:daysAgo(2)},
      {id:nextId(), out:false, type:'text', text:'Привет! Да, давай на неделе созвонимся', time:daysAgo(2)},
    ]
  },
  {
    id:'c5', name:'Максим Петров', isGroup:false, tag:'@maxp', phone:'+7 917 222-33-44',
    birthday:'30 января', bio:'Люблю велосипеды и хороший кофе',
    online:false, lastSeen:'был(а) вчера в 23:41', muted:false, pinned:false, archived:false, unread:3,
    messages:[
      {id:nextId(), out:false, type:'text', text:'Го в субботу покатаемся?', time:hoursAgo(30)},
      {id:nextId(), out:false, type:'text', text:'Погода вроде обещают хорошую', time:hoursAgo(29)},
      {id:nextId(), out:false, type:'text', text:'Ответь как будет минутка 🙂', time:hoursAgo(28)},
    ]
  },
  {
    id:'c6', name:'Family 🏡', isGroup:true, memberCount:4,
    online:false, muted:false, pinned:false, archived:false, unread:1,
    messages:[
      {id:nextId(), out:false, sender:'Мама', type:'text', text:'Не забудь позвонить бабушке', time:hoursAgo(9)},
      {id:nextId(), out:true, type:'text', text:'Хорошо, вечером наберу', time:hoursAgo(8)},
      {id:nextId(), out:false, sender:'Папа', type:'text', text:'👍', time:hoursAgo(1)},
    ]
  },
  {
    id:'c7', name:'Ольга Кузнецова', isGroup:false, tag:'@olga_k', phone:'+7 495 111-22-33',
    birthday:'5 июня', bio:'HR-менеджер',
    online:false, lastSeen:'был(а) на прошлой неделе', muted:false, pinned:false, archived:false,
    messages:[
      {id:nextId(), out:false, type:'text', text:'Собеседование перенесли на пятницу', time:daysAgo(6)},
      {id:nextId(), out:true, type:'text', text:'Спасибо, что предупредили!', time:daysAgo(6)},
    ]
  },
];

const contactsBook = [
  {name:'Сергей Иванов'}, {name:'Наталья Белова'}, {name:'Виктор Смирнов'},
  {name:'Алина Морозова'}, {name:'Павел Егоров'}, {name:'Юлия Романова'},
  {name:'Артём Соловьёв'}, {name:'Ксения Волкова'}
];

/* ------------------------------ state ------------------------------------ */
let screenStack = [];
let zCounter = 10;
let currentChatId = null;
let openSwipedWrap = null;
let previewChatId = null;
let sendMode = 'mic'; // mic | camera | send
let groupFlowMode = 'group'; // group | channel
let groupFlowStep = 'select';
const selectedGroupMembers = new Set();

/* --------------------------- screen navigation ---------------------------- */
function updateDesktopPlaceholder(){
  $('#desktopPlaceholder').classList.toggle('show', screenStack.length===0);
}
function refreshDepth(){
  $$('.screen').forEach(s=>s.classList.remove('exiting-behind'));
  if(screenStack.length>=1){
    const belowId = screenStack.length>=2 ? screenStack[screenStack.length-2] : null;
    if(belowId){
      const belowEl = document.getElementById('screen-'+belowId);
      if(belowEl) belowEl.classList.add('exiting-behind');
    }
  }
}
function pushScreen(id){
  const elm = document.getElementById('screen-'+id);
  if(!elm) return;
  zCounter += 1;
  elm.style.zIndex = zCounter;
  requestAnimationFrame(()=> elm.classList.add('active'));
  screenStack.push(id);
  refreshDepth();
  updateDesktopPlaceholder();
}
function popScreen(){
  if(screenStack.length===0) return;
  const id = screenStack.pop();
  const elm = document.getElementById('screen-'+id);
  if(elm) elm.classList.remove('active');
  refreshDepth();
  updateDesktopPlaceholder();
}
function popToRoot(){
  while(screenStack.length) popScreen();
}

/* ------------------------------- gestures ---------------------------------
   generic long-press + tap helper for elements                            */
function bindPressable(node, {onTap, onLongPress, longPressMs=480, moveTolerance=10} = {}){
  let startX=0, startY=0, timer=null, fired=false, moved=false, active=false;
  node.addEventListener('pointerdown', (e)=>{
    if(e.button !== undefined && e.button !== 0) return;
    active = true; fired=false; moved=false;
    startX = e.clientX; startY = e.clientY;
    timer = setTimeout(()=>{
      if(active && !moved){ fired=true; onLongPress && onLongPress(e); }
    }, longPressMs);
  });
  node.addEventListener('pointermove', (e)=>{
    if(!active) return;
    if(Math.abs(e.clientX-startX) > moveTolerance || Math.abs(e.clientY-startY) > moveTolerance){
      moved = true; clearTimeout(timer);
    }
  });
  const end = (e)=>{
    if(!active) return;
    active = false; clearTimeout(timer);
    if(!fired && !moved){ onTap && onTap(e); }
  };
  node.addEventListener('pointerup', end);
  node.addEventListener('pointercancel', ()=>{ active=false; clearTimeout(timer); });
  node.addEventListener('pointerleave', ()=>{ /* keep tracking for touch drags */ });
}

/* =========================================================================
   CHAT LIST
   ========================================================================= */
function lastMessagePreview(chat){
  const last = chat.messages[chat.messages.length-1];
  if(chat.draft) return {text:chat.draft, isDraft:true, time:last?last.time:new Date()};
  if(!last) return {text:'', isDraft:false, time:new Date()};
  let text = last.type==='voice' ? '🎤 Голосовое сообщение' : last.text;
  if(last.sender) text = `${last.sender}: ${text}`;
  return {text, isDraft:false, time:last.time, out:last.out, status:last.status};
}

function closeSwipedCard(){
  if(openSwipedWrap){
    const card = openSwipedWrap.querySelector('.chat-card');
    if(card) card.classList.remove('swiped');
    openSwipedWrap = null;
  }
}

function buildChatCard(chat){
  const wrap = el('div','chat-card-wrap');
  wrap.dataset.chatId = chat.id;

  const actions = el('div','chat-card-actions', `
    <button class="swipe-action mute" data-role="mute">
      <svg viewBox="0 0 24 24" width="19" height="19"><path d="M9 18v1a3 3 0 006 0v-1M5 9a7 7 0 0114 0c0 5 2 6 2 6H3s2-1 2-6z" stroke="#fff" stroke-width="1.7" fill="none" stroke-linejoin="round"/><path d="M3 3l18 18" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/></svg>
      <span>${chat.muted?'Вкл. звук':'Заглушить'}</span>
    </button>
    <button class="swipe-action delete" data-role="delete">
      <svg viewBox="0 0 24 24" width="19" height="19"><path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-8 0v12a2 2 0 002 2h4a2 2 0 002-2V7" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Удалить</span>
    </button>
  `);
  wrap.appendChild(actions);

  const card = el('div','chat-card');
  const avatar = el('div','chat-card-avatar');
  paintAvatar(avatar, chat.name, chat.isGroup);
  if(chat.pinned){
    const pin = el('div','pin-badge', `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l1.5 5.5L19 9l-4.5 3.5L16 18l-4-3.2L8 18l1.5-5.5L5 9l5.5-1.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`);
    avatar.appendChild(pin);
  }
  card.appendChild(avatar);

  const preview = lastMessagePreview(chat);
  const unread = chat.unread || 0;

  const content = el('div','chat-card-content');
  content.innerHTML = `
    <div class="chat-card-top">
      <span class="chat-card-name">${chat.name}${chat.muted?'<svg class="mute-icon" viewBox="0 0 24 24" fill="none"><path d="M9 18v1a3 3 0 006 0v-1M5 9a7 7 0 0114 0c0 5 2 6 2 6H3s2-1 2-6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>':''}</span>
      <span class="chat-card-time ${unread>0?'unread':''}">${chatListTime(preview.time)}</span>
    </div>
    <div class="chat-card-bottom">
      <span class="chat-card-message">${preview.isDraft?`<span class="draft">Черновик: </span>${escapeHtml(preview.text)}`: (preview.out?`<span class="sent-tick">${preview.status==='read'?'Прочитано:':'Отправлено:'}</span> ${escapeHtml(preview.text)}` : escapeHtml(preview.text))}</span>
      <span class="chat-card-badge ${chat.muted?'muted':''}">${unread>0?unread:''}</span>
    </div>
  `;
  card.appendChild(content);
  wrap.appendChild(card);

  // swipe + long-press + tap
  let dragX = 0, dragging = false, startX = 0, startTranslate = 0, longTimer=null, longFired=false, moved=false;

  card.addEventListener('pointerdown', (e)=>{
    if(openSwipedWrap && openSwipedWrap !== wrap) closeSwipedCard();
    dragging = true; moved = false; longFired = false;
    startX = e.clientX;
    startTranslate = wrap.dataset.swiped === '1' ? -168 : 0;
    card.classList.add('pressing');
    card.setPointerCapture && card.setPointerCapture(e.pointerId);
    longTimer = setTimeout(()=>{
      if(!moved){ longFired = true; openPreview(chat.id); }
    }, 480);
  });
  card.addEventListener('pointermove', (e)=>{
    if(!dragging) return;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > 8) { moved = true; clearTimeout(longTimer); }
    let t = startTranslate + dx;
    t = Math.max(-168, Math.min(0, t));
    if(moved) card.style.transform = `translate3d(${t}px,0,0)`;
    dragX = t;
  });
  const finishDrag = ()=>{
    if(!dragging) return;
    dragging = false;
    clearTimeout(longTimer);
    card.classList.remove('pressing');
    card.style.transform = '';
    if(moved){
      if(dragX < -60){
        card.classList.add('swiped'); wrap.dataset.swiped='1'; openSwipedWrap = wrap;
      } else {
        card.classList.remove('swiped'); wrap.dataset.swiped='0';
        if(openSwipedWrap===wrap) openSwipedWrap=null;
      }
    } else if(!longFired){
      openChat(chat.id);
    }
  };
  card.addEventListener('pointerup', finishDrag);
  card.addEventListener('pointercancel', finishDrag);

  actions.querySelector('[data-role="mute"]').addEventListener('click', (e)=>{
    e.stopPropagation();
    chat.muted = !chat.muted;
    closeSwipedCard();
    renderChatList($('#searchInput').value);
    toast(chat.muted ? 'Уведомления отключены' : 'Уведомления включены');
  });
  actions.querySelector('[data-role="delete"]').addEventListener('click', (e)=>{
    e.stopPropagation();
    const idx = chats.findIndex(c=>c.id===chat.id);
    if(idx>-1) chats.splice(idx,1);
    openSwipedWrap = null;
    renderChatList($('#searchInput').value);
    toast('Чат удалён');
  });

  return wrap;
}

function escapeHtml(s){
  return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderChatList(filter=''){
  const list = $('#chatList');
  list.innerHTML = '';
  openSwipedWrap = null;
  const f = filter.trim().toLowerCase();
  let visible = chats.filter(c=>!c.archived);
  if(f){
    visible = visible.filter(c=> c.name.toLowerCase().includes(f) || lastMessagePreview(c).text.toLowerCase().includes(f));
  }
  visible.sort((a,b)=>{
    if(!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    const at = lastMessagePreview(a).time, bt = lastMessagePreview(b).time;
    return bt - at;
  });
  if(visible.length===0){
    list.appendChild(el('div','empty-state', `<div class="glyph">🔍</div><div>Ничего не найдено</div>`));
    return;
  }
  const frag = document.createDocumentFragment();
  visible.forEach(chat=> frag.appendChild(buildChatCard(chat)));
  list.appendChild(frag);
}

/* ------------------------------ preview overlay --------------------------- */
function openPreview(chatId){
  const chat = chats.find(c=>c.id===chatId);
  if(!chat) return;
  previewChatId = chatId;
  const cardEl = $('#previewCard');
  cardEl.innerHTML = '';
  const header = el('div','', `<div style="display:flex;align-items:center;gap:10px;padding-bottom:10px;margin-bottom:8px;border-bottom:1px solid var(--separator)">
      <div class="chat-card-avatar" style="width:40px;height:40px;font-size:15px" id="previewAvatarHolder"></div>
      <div style="font-weight:650;font-size:15.5px">${escapeHtml(chat.name)}</div>
    </div>`);
  cardEl.appendChild(header);
  const av = header.querySelector('#previewAvatarHolder');
  paintAvatar(av, chat.name, chat.isGroup);

  chat.messages.slice(-8).forEach(m=>{
    const row = el('div','msg-row '+(m.out?'out':'in'), '');
    row.style.margin = '6px 0';
    const bubble = el('div','bubble', m.type==='voice' ? '🎤 Голосовое сообщение' : escapeHtml(m.text));
    row.appendChild(bubble);
    cardEl.appendChild(row);
  });

  $('#previewOverlay').classList.add('open');
}
function closePreview(){
  $('#previewOverlay').classList.remove('open');
  previewChatId = null;
}
$('#previewOverlay').addEventListener('click', (e)=>{
  if(e.target.id === 'previewOverlay') closePreview();
});
$('[data-action="archive-preview"]').addEventListener('click', ()=>{
  const chat = chats.find(c=>c.id===previewChatId);
  if(chat){ chat.archived = true; renderChatList($('#searchInput').value); toast('Чат архивирован'); }
  closePreview();
});
$('[data-action="pin-preview"]').addEventListener('click', ()=>{
  const chat = chats.find(c=>c.id===previewChatId);
  if(chat){ chat.pinned = !chat.pinned; renderChatList($('#searchInput').value); toast(chat.pinned?'Чат закреплён':'Чат откреплён'); }
  closePreview();
});

/* =========================================================================
   CHAT SCREEN
   ========================================================================= */
function renderMessages(chat){
  const list = $('#messagesList');
  list.innerHTML = '';
  let lastDay = null, lastSenderKey = null, lastTime = 0;
  chat.messages.forEach((m, idx)=>{
    if(!lastDay || !isSameDay(lastDay, m.time)){
      list.appendChild(el('div','day-divider', dayLabel(m.time)));
      lastDay = m.time; lastSenderKey = null;
    }
    const senderKey = m.out ? 'me' : (m.sender || 'them');
    const grouped = senderKey===lastSenderKey && (m.time - lastTime) < 3*60*1000;
    lastSenderKey = senderKey; lastTime = m.time;

    const row = el('div', `msg-row ${m.out?'out':'in'} ${grouped?'':'grouped-top'}`);
    const bubble = el('div','bubble');

    if(m.replyTo){
      const rq = el('div','reply-quote', `<div class="rq-body"><div class="rq-name">${escapeHtml(m.replyTo.name)}</div><div class="rq-text">${escapeHtml(m.replyTo.text)}</div></div>`);
      bubble.appendChild(rq);
    }
    if(chat.isGroup && !m.out && m.sender){
      bubble.appendChild(el('div','', `<div style="font-size:12px;font-weight:700;color:var(--accent-2);margin-bottom:2px">${escapeHtml(m.sender)}</div>`));
    }
    if(m.type==='voice'){
      const bars = Array.from({length:18},()=> `<span style="height:${6+Math.round(Math.random()*14)}px"></span>`).join('');
      const vm = el('div','voice-msg', `
        <div class="play-btn"><svg viewBox="0 0 24 24" width="13" height="13"><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg></div>
        <div class="vw">${bars}</div>
        <div class="vdur">0:${pad2(m.dur||8)}</div>
      `);
      bubble.appendChild(vm);
    } else {
      bubble.appendChild(el('span','', escapeHtml(m.text)));
    }
    row.appendChild(bubble);
    list.appendChild(row);
  });

  // delivered/read marker under the very last outgoing message
  const lastOut = [...chat.messages].reverse().find(m=>m.out);
  if(lastOut){
    const rows = $$('.msg-row.out', list);
    const lastRow = rows[rows.length-1];
    if(lastRow){
      const label = lastOut.status==='read' ? `Прочитано в ${fmtTime(lastOut.readAt||lastOut.time)}`
                    : lastOut.status==='delivered' ? 'Доставлено' : 'Отправлено';
      lastRow.appendChild(el('div','msg-meta', `<span class="${lastOut.status==='read'?'read':''}">${label}</span>`));
    }
  }

  list.scrollTop = list.scrollHeight + 999;
}

function openChat(chatId){
  const chat = chats.find(c=>c.id===chatId);
  if(!chat) return;
  currentChatId = chatId;
  if(chat.unread){ chat.unread = 0; }
  chat.draft = null;

  $('#chatHeaderName').textContent = chat.name;
  $('#chatHeaderStatus').textContent = chat.isGroup ? `${chat.memberCount||0} участников` : (chat.online ? 'в сети' : (chat.lastSeen || 'недавно'));
  paintAvatar($('#chatHeaderAvatar'), chat.name, chat.isGroup);

  $('#messageInput').value = '';
  autoResizeInput();
  setSendMode('mic');

  renderMessages(chat);
  renderChatList($('#searchInput').value);
  pushScreen('chat');
}

function scrollMessagesToEnd(){
  const list = $('#messagesList');
  list.scrollTop = list.scrollHeight + 999;
}

function currentChat(){ return chats.find(c=>c.id===currentChatId); }

function sendTextMessage(){
  const input = $('#messageInput');
  const text = input.value.trim();
  if(!text) return;
  const chat = currentChat();
  if(!chat) return;
  const msg = {id:nextId(), out:true, type:'text', text, time:new Date(), status:'sent'};
  chat.messages.push(msg);
  input.value = '';
  autoResizeInput();
  setSendMode('mic');
  renderMessages(chat);
  renderChatList($('#searchInput').value);
  progressMessageStatus(chat, msg);
}

function sendVoiceMessage(durSec){
  const chat = currentChat();
  if(!chat) return;
  const msg = {id:nextId(), out:true, type:'voice', dur:Math.max(1,durSec), time:new Date(), status:'sent'};
  chat.messages.push(msg);
  renderMessages(chat);
  renderChatList($('#searchInput').value);
  progressMessageStatus(chat, msg);
}

function progressMessageStatus(chat, msg){
  setTimeout(()=>{
    if(currentChatId !== chat.id) return;
    msg.status = 'delivered';
    renderMessages(chat);
  }, 750);
  setTimeout(()=>{
    msg.status = 'read';
    msg.readAt = new Date();
    if(currentChatId === chat.id) renderMessages(chat);
    simulateReply(chat);
  }, 1900);
}

function simulateReply(chat){
  if(chat.isGroup) return; // keep group chats quiet in the demo
  if(Math.random() < 0.25) return;
  const showTyping = currentChatId === chat.id;
  if(showTyping) $('#typingIndicator').hidden = false;
  setTimeout(()=>{
    if(showTyping) $('#typingIndicator').hidden = true;
    const text = REPLIES[Math.floor(Math.random()*REPLIES.length)];
    chat.messages.push({id:nextId(), out:false, type:'text', text, time:new Date()});
    if(currentChatId === chat.id){ renderMessages(chat); scrollMessagesToEnd(); }
    renderChatList($('#searchInput').value);
  }, 1300 + Math.random()*900);
}

/* --------------------------- input bar behaviour --------------------------- */
function autoResizeInput(){
  const ta = $('#messageInput');
  ta.style.height = 'auto';
  ta.style.height = Math.min(108, ta.scrollHeight) + 'px';
}
function setSendMode(mode){
  sendMode = mode;
  const btn = $('#sendBtn');
  btn.querySelector('.icon-mic').hidden = mode !== 'mic';
  btn.querySelector('.icon-camera').hidden = mode !== 'camera';
  btn.querySelector('.icon-send').hidden = mode !== 'send';
}
$('#messageInput').addEventListener('input', ()=>{
  autoResizeInput();
  const hasText = $('#messageInput').value.trim().length > 0;
  setSendMode(hasText ? 'send' : 'mic');
});
$('#messageInput').addEventListener('keydown', (e)=>{
  if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendTextMessage(); }
});

/* mic / camera / send button interactions */
(function setupSendButton(){
  const btn = $('#sendBtn');
  let pressTimer = null, holding = false, startX = 0, cancelZone = false, pressStart = 0;

  btn.addEventListener('pointerdown', (e)=>{
    pressStart = Date.now();
    startX = e.clientX;
    cancelZone = false;
    if(sendMode === 'send') return; // no hold behaviour while sending text
    pressTimer = setTimeout(()=>{
      holding = true;
      startVoiceRecording();
    }, 320);
  });
  btn.addEventListener('pointermove', (e)=>{
    if(!holding) return;
    const dx = e.clientX - startX;
    if(dx < -70) cancelZone = true; else if(dx > -30) cancelZone = false;
    const hint = $('.rec-hint');
    if(hint) hint.style.opacity = cancelZone ? '1' : '.6';
  });
  const release = ()=>{
    clearTimeout(pressTimer);
    const heldMs = Date.now() - pressStart;
    if(holding){
      holding = false;
      const dur = Math.max(1, Math.round((Date.now()-recordStartedAt)/1000));
      stopVoiceRecording(cancelZone, dur);
      return;
    }
    if(heldMs < 320){
      // quick tap
      if(sendMode === 'send'){ sendTextMessage(); }
      else if(sendMode === 'mic'){ setSendMode('camera'); }
      else if(sendMode === 'camera'){ toast('Открытие камеры…'); setSendMode('mic'); }
    }
  };
  btn.addEventListener('pointerup', release);
  btn.addEventListener('pointercancel', ()=>{ if(holding){ holding=false; stopVoiceRecording(true, 0); } clearTimeout(pressTimer); });
})();

let recordTimerInterval = null, recordStartedAt = 0;
function startVoiceRecording(){
  recordStartedAt = Date.now();
  const overlay = $('#voiceRecordOverlay');
  overlay.hidden = false;
  $('#recTime').textContent = '0:00';
  clearInterval(recordTimerInterval);
  recordTimerInterval = setInterval(()=>{
    const s = Math.floor((Date.now()-recordStartedAt)/1000);
    $('#recTime').textContent = `${Math.floor(s/60)}:${pad2(s%60)}`;
  }, 200);
}
function stopVoiceRecording(cancelled, durSec){
  clearInterval(recordTimerInterval);
  $('#voiceRecordOverlay').hidden = true;
  if(cancelled){ toast('Запись отменена'); return; }
  if(durSec >= 1){ sendVoiceMessage(durSec); }
}

$('#attachBtn').addEventListener('click', ()=> toast('Выбор вложения (демо)'));
$('#cameraInlineBtn').addEventListener('click', ()=> toast('Открытие камеры…'));

/* =========================================================================
   CONTACT PROFILE / OWN PROFILE / AVATAR ZOOM
   ========================================================================= */
function openContactProfile(){
  const chat = currentChat();
  if(!chat) return;
  const body = $('#contactProfileBody');
  const statusText = chat.isGroup ? `${chat.memberCount||0} участников` : (chat.online ? 'в сети' : (chat.lastSeen||'недавно'));

  body.innerHTML = `
    <div class="profile-hero">
      <div class="avatar-xl zoomable-avatar" id="contactAvatarXl"></div>
      <div class="profile-name">${escapeHtml(chat.name)}</div>
      <div class="profile-status">${escapeHtml(statusText)}</div>
    </div>
    <div class="profile-call-row">
      <button class="call-btn" data-toast="Аудиозвонок"><span class="circle"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" fill="currentColor"/></svg></span>Аудио</button>
      <button class="call-btn" data-toast="Видеозвонок"><span class="circle"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M3 7a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M20 9l-3 2.2v1.6l3 2.2V9z" fill="currentColor"/></svg></span>Видео</button>
      <button class="call-btn" data-action="toggle-mute-profile"><span class="circle"><svg viewBox="0 0 24 24" width="19" height="19"><path d="M9 18v1a3 3 0 006 0v-1M5 9a7 7 0 0114 0c0 5 2 6 2 6H3s2-1 2-6z" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linejoin="round"/>${chat.muted?'<path d="M3 3l18 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>':''}</svg></span>${chat.muted?'Вкл. звук':'Без звука'}</button>
      <button class="call-btn" data-toast="Поиск по чату"><span class="circle"><svg viewBox="0 0 24 24" width="19" height="19"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span>Поиск</button>
    </div>
    ${chat.track ? `
    <div class="glass-card pinned-track">
      <div class="art">🎵</div>
      <div class="meta"><div class="t">${escapeHtml(chat.track.title)}</div><div class="a">${escapeHtml(chat.track.artist)}</div></div>
      <div class="wave"><span></span><span></span><span></span></div>
    </div>` : ''}
    <div class="glass-card info-card">
      ${chat.phone ? `<div class="info-row"><span class="label">Телефон</span><span class="value">${chat.phone}</span></div>`:''}
      ${chat.tag ? `<div class="info-row"><span class="label">Тег</span><span class="value">${chat.tag}</span></div>`:''}
      ${chat.birthday ? `<div class="info-row"><span class="label">Дата рождения</span><span class="value">${chat.birthday}</span></div>`:''}
      ${chat.bio ? `<div class="info-row"><span class="label">Описание</span><span class="value">${escapeHtml(chat.bio)}</span></div>`:''}
      ${chat.isGroup ? `<div class="info-row"><span class="label">Участники</span><span class="value">${chat.memberCount||0} человек</span></div>`:''}
    </div>
    <div class="media-section">
      <div class="section-label" style="padding-left:0">Общие медиа</div>
      <div class="media-grid">
        ${['🖼️','📷','🎞️','🖼️','📄','🎵','📷','🖼️'].map(g=>`<div class="cell" style="background:${gradientCss(chat.name+g)}">${g}</div>`).join('')}
      </div>
    </div>
  `;
  const av = $('#contactAvatarXl');
  paintAvatar(av, chat.name, chat.isGroup);
  $$('.call-btn[data-toast]', body).forEach(b=> b.addEventListener('click', ()=> toast(b.dataset.toast)));
  const muteBtn = $('.call-btn[data-action="toggle-mute-profile"]', body);
  if(muteBtn) muteBtn.addEventListener('click', ()=>{ chat.muted=!chat.muted; renderChatList($('#searchInput').value); openContactProfile(); });

  pushScreen('contact-profile');
}
function gradientCss(seed){ const [a,b] = gradientFor(seed); return `linear-gradient(155deg, ${a}, ${b})`; }

function renderOwnProfile(){
  const body = $('#ownProfileBody');
  body.innerHTML = `
    <div class="profile-hero">
      <div class="avatar-xl zoomable-avatar" id="ownAvatarXl"></div>
      <div class="profile-name">${escapeHtml(me.name)}</div>
      <div class="profile-status">${me.tag}</div>
    </div>
    <div class="glass-card pinned-track">
      <div class="art">🎵</div>
      <div class="meta"><div class="t">${escapeHtml(me.track.title)}</div><div class="a">${escapeHtml(me.track.artist)}</div></div>
      <div class="wave"><span></span><span></span><span></span></div>
    </div>
    <div class="glass-card info-card">
      <div class="info-row"><span class="label">Телефон</span><span class="value">${me.phone}</span></div>
      <div class="info-row"><span class="label">Тег</span><span class="value">${me.tag}</span></div>
      <div class="info-row"><span class="label">Дата рождения</span><span class="value">${me.birthday}</span></div>
      <div class="info-row"><span class="label">Описание</span><span class="value">${escapeHtml(me.bio)}</span></div>
    </div>
    <div class="share-btn-wrap">
      <button class="share-btn" id="shareProfileBtn">
        <svg viewBox="0 0 24 24" width="17" height="17"><path d="M12 3v13m0-13l-4 4m4-4l4 4M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Поделиться профилем
      </button>
    </div>
  `;
  paintAvatar($('#ownAvatarXl'), me.name, false);
  $('#shareProfileBtn').addEventListener('click', ()=> toast('Ссылка на профиль скопирована'));
  $('#settingsAvatar') && paintAvatar($('#settingsAvatar'), me.name, false);
  $('#settingsName').textContent = me.name;
  $('#settingsTag').textContent = me.tag;
}

function openEditProfile(){
  const body = $('#editProfileBody');
  body.innerHTML = `
    <div class="avatar-edit-wrap">
      <div class="avatar-lg avatar-picker" id="editAvatarPicker" style="width:92px;height:92px;font-size:30px"></div>
    </div>
    <div class="glass-card form-card">
      <label class="form-row"><span>Имя</span><input type="text" id="editName" value="${escapeHtml(me.name)}"></label>
      <label class="form-row"><span>Описание</span><textarea id="editBio">${escapeHtml(me.bio)}</textarea></label>
      <label class="form-row"><span>Дата рождения</span><input type="text" id="editBirthday" value="${escapeHtml(me.birthday)}"></label>
      <label class="form-row"><span>Телефон</span><input type="text" id="editPhone" value="${escapeHtml(me.phone)}"></label>
      <label class="form-row"><span>Тег</span><input type="text" id="editTag" value="${escapeHtml(me.tag)}"></label>
    </div>
  `;
  paintAvatar($('#editAvatarPicker'), me.name, false);
  $('#editAvatarPicker').addEventListener('click', ()=> toast('Загрузка фото (демо)'));
  pushScreen('edit-profile');
}
function saveProfile(){
  me.name = $('#editName').value.trim() || me.name;
  me.bio = $('#editBio').value.trim();
  me.birthday = $('#editBirthday').value.trim();
  me.phone = $('#editPhone').value.trim();
  me.tag = $('#editTag').value.trim();
  popScreen(); // back to own profile
  renderOwnProfile();
  toast('Профиль обновлён');
}

/* avatar zoom */
function openAvatarZoom(name, isGroup){
  const box = $('#avatarZoomBox');
  paintAvatar(box, name, isGroup);
  $('#avatarZoomOverlay').classList.add('open');
}
$('#avatarZoomOverlay').addEventListener('click', ()=> $('#avatarZoomOverlay').classList.remove('open'));

/* =========================================================================
   SETTINGS
   ========================================================================= */
function settingsDetailContent(title){
  const toggleRow = (label, on=false) => `<div class="toggle-row"><span>${label}</span><div class="switch ${on?'on':''}"></div></div>`;
  const radioRow = (label, selected=false) => `<button class="settings-row" data-radio><span>${label}</span>${selected?'<svg class="chevron" style="color:var(--accent-2)" viewBox="0 0 24 24" width="16" height="16"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</button>`;

  switch(title){
    case 'Конфиденциальность':
      return `<div class="glass-card settings-list">
        ${toggleRow('Последний визит и статус «в сети»', true)}
        ${toggleRow('Фото профиля — все', true)}
        ${toggleRow('Подтверждение звонков', false)}
        ${toggleRow('Разрешить добавлять в группы', true)}
      </div>
      <div class="glass-card settings-list">
        <button class="settings-row"><span>Активные сессии</span><svg class="chevron" viewBox="0 0 24 24" width="9" height="15"><path d="M2 2l8 8-8 8" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button class="settings-row"><span>Заблокированные</span><svg class="chevron" viewBox="0 0 24 24" width="9" height="15"><path d="M2 2l8 8-8 8" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>`;
    case 'Уведомления':
      return `<div class="glass-card settings-list">
        ${toggleRow('Показывать уведомления', true)}
        ${toggleRow('Превью сообщений', true)}
        ${toggleRow('Звук', true)}
        ${toggleRow('Вибрация', false)}
      </div>`;
    case 'Устройства':
      return `<div class="glass-card settings-list">
        <div class="settings-row"><span class="settings-icon" style="background:#0A84FF">📱</span><span>iPhone 16 Pro — это устройство</span></div>
        <div class="settings-row"><span class="settings-icon" style="background:#8E8E93">💻</span><span>MacBook Air · активно 2 часа назад</span></div>
        <div class="settings-row"><span class="settings-icon" style="background:#8E8E93">🖥️</span><span>iPad · активно вчера</span></div>
      </div>`;
    case 'Данные':
      return `<div class="glass-card settings-list">
        ${toggleRow('Автозагрузка фото', true)}
        ${toggleRow('Автозагрузка видео', false)}
        ${toggleRow('Экономия трафика', false)}
      </div>
      <div class="glass-card settings-list">
        <button class="settings-row" style="color:var(--red)"><span style="color:var(--red)">Очистить кэш</span></button>
      </div>`;
    case 'Оформление':
      return `<div class="glass-card settings-list">
        ${radioRow('Тёмная', true)}
        ${radioRow('Светлая', false)}
        ${radioRow('Системная', false)}
      </div>`;
    case 'Группировка чатов':
      return `<div class="glass-card settings-list">
        ${radioRow('Все чаты', true)}
        ${radioRow('Без групп', false)}
        ${radioRow('По папкам', false)}
      </div>`;
    case 'Язык':
      return `<div class="glass-card settings-list">
        ${radioRow('Русский', true)}
        ${radioRow('English', false)}
        ${radioRow('Українська', false)}
        ${radioRow('Deutsch', false)}
      </div>`;
    case 'Поддержка':
      return `<div class="glass-card settings-list">
        <button class="settings-row"><span>Написать в поддержку</span></button>
        <button class="settings-row"><span>Частые вопросы</span></button>
        <button class="settings-row"><span>Сообщить о проблеме</span></button>
      </div>`;
    case 'О приложении':
      return `<div class="detail-hero">
          <div class="glyph">💬</div>
          <div style="font-weight:700;font-size:17px">Messages</div>
          <p>iOS 26 style · Версия 1.0.0 (сборка 26A5326a)</p>
        </div>
        <div class="glass-card settings-list">
          <button class="settings-row"><span>Условия использования</span></button>
          <button class="settings-row"><span>Политика конфиденциальности</span></button>
          <button class="settings-row"><span>Оценить приложение</span></button>
        </div>`;
    default:
      return `<div class="detail-hero"><div class="glyph">⚙️</div><p>Раздел находится в разработке</p></div>`;
  }
}
function openSettingsDetail(title){
  $('#settingsDetailTitle').textContent = title;
  $('#settingsDetailBody').innerHTML = settingsDetailContent(title);
  pushScreen('settings-detail');
}

/* =========================================================================
   NEW CHAT / ADD CONTACT / CREATE GROUP
   ========================================================================= */
function openSheet(id){
  const overlay = document.getElementById(id);
  overlay.classList.add('open');
}
function closeSheet(id){
  document.getElementById(id).classList.remove('open');
}

function renderNewChatContacts(filter=''){
  const wrap = $('#newChatContactList');
  wrap.innerHTML = '<div class="section-label" style="padding-left:0">Контакты</div>';
  const f = filter.trim().toLowerCase();
  const names = contactsBook.map(c=>c.name).filter(n=> n.toLowerCase().includes(f));
  names.forEach(name=>{
    const row = el('button','contact-row');
    row.innerHTML = `<div class="chat-card-avatar"></div><span class="cname">${escapeHtml(name)}</span>`;
    paintAvatar(row.querySelector('.chat-card-avatar'), name, false);
    row.addEventListener('click', ()=>{
      const newChat = getOrCreateChatWithContact(name);
      closeSheet('newChatOverlay');
      openChat(newChat.id);
    });
    wrap.appendChild(row);
  });
}
function getOrCreateChatWithContact(name){
  let chat = chats.find(c=>c.name===name);
  if(!chat){
    chat = { id: nextId(), name, isGroup:false, tag:'@'+name.split(' ')[0].toLowerCase(),
      phone:'+7 900 000-00-00', birthday:'—', bio:'', online:Math.random()>0.5,
      muted:false, pinned:false, archived:false, messages:[] };
    chats.unshift(chat);
  }
  return chat;
}

function renderGroupContacts(){
  const wrap = $('#groupContactList');
  wrap.innerHTML = '';
  contactsBook.forEach(c=>{
    const row = el('button','contact-row');
    row.innerHTML = `<div class="chat-card-avatar"></div><span class="cname">${escapeHtml(c.name)}</span><div class="checkbox"><svg viewBox="0 0 24 24" width="13" height="13"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
    paintAvatar(row.querySelector('.chat-card-avatar'), c.name, false);
    const box = row.querySelector('.checkbox');
    row.addEventListener('click', ()=>{
      if(selectedGroupMembers.has(c.name)){ selectedGroupMembers.delete(c.name); box.classList.remove('checked'); }
      else { selectedGroupMembers.add(c.name); box.classList.add('checked'); }
    });
    wrap.appendChild(row);
  });
}

function startGroupFlow(mode){
  groupFlowMode = mode;
  groupFlowStep = 'select';
  selectedGroupMembers.clear();
  $('#createGroupTitle').textContent = mode==='group' ? 'Новая группа' : 'Новый канал';
  $('#groupNextBtn').textContent = 'Далее';
  $('#groupStepSelect').hidden = false;
  $('#groupStepDetails').hidden = true;
  $('#groupAvatarPreview').textContent = '📷';
  $('#groupAvatarPreview').style.background = 'var(--glass-fill)';
  $('#groupNameInput').value = '';
  renderGroupContacts();
  closeSheet('newChatOverlay');
  openSheet('createGroupOverlay');
}
function groupNextAction(){
  if(groupFlowStep === 'select'){
    groupFlowStep = 'details';
    $('#groupStepSelect').hidden = true;
    $('#groupStepDetails').hidden = false;
    $('#groupNextBtn').textContent = groupFlowMode==='group' ? 'Создать' : 'Создать';
  } else {
    const name = $('#groupNameInput').value.trim() || (groupFlowMode==='group' ? 'Новая группа' : 'Новый канал');
    const chat = {
      id: nextId(), name, isGroup:true, memberCount: selectedGroupMembers.size + 1,
      online:false, muted:false, pinned:false, archived:false,
      messages:[{id:nextId(), out:false, sender:'Система', type:'text', text: groupFlowMode==='group' ? 'Группа создана 🎉' : 'Канал создан 🎉', time:new Date()}]
    };
    chats.unshift(chat);
    closeSheet('createGroupOverlay');
    renderChatList($('#searchInput').value);
    openChat(chat.id);
  }
}

/* =========================================================================
   GLOBAL EVENT DELEGATION
   ========================================================================= */
document.addEventListener('click', (e)=>{
  const actionEl = e.target.closest('[data-action]');
  if(!actionEl) return;
  const action = actionEl.dataset.action;

  switch(action){
    case 'back': popScreen(); break;
    case 'open-own-profile': renderOwnProfile(); pushScreen('own-profile'); break;
    case 'open-settings-detail': openSettingsDetail(actionEl.dataset.title); break;
    case 'open-edit-profile': openEditProfile(); break;
    case 'save-profile': saveProfile(); break;
    case 'close-sheet': closeSheet('newChatOverlay'); break;
    case 'close-inner-sheet': closeSheet('addContactOverlay'); closeSheet('createGroupOverlay'); break;
    case 'add-contact':
      closeSheet('newChatOverlay'); openSheet('addContactOverlay');
      $('#newContactName').value=''; $('#newContactPhone').value='';
      break;
    case 'create-channel': startGroupFlow('channel'); break;
    case 'create-group': startGroupFlow('group'); break;
    case 'save-contact': {
      const name = $('#newContactName').value.trim();
      if(!name){ toast('Введите имя контакта'); break; }
      contactsBook.push({name});
      closeSheet('addContactOverlay');
      toast('Контакт добавлен');
      break;
    }
    case 'group-next': groupNextAction(); break;
    default: break;
  }
});

// avatar zoom delegation (profile hero avatars + chat header avatar)
document.addEventListener('click', (e)=>{
  if(e.target.closest('#chatHeaderAvatar')){
    const chat = currentChat();
    if(chat) openAvatarZoom(chat.name, chat.isGroup);
    return;
  }
  const zoomable = e.target.closest('.zoomable-avatar');
  if(zoomable){
    openAvatarZoom(zoomable.dataset.avatarName, zoomable.dataset.avatarGroup==='1');
  }
});

// toggle switches
document.addEventListener('click', (e)=>{
  const sw = e.target.closest('.switch');
  if(sw) sw.classList.toggle('on');
  const radio = e.target.closest('[data-radio]');
  if(radio){
    const group = radio.parentElement;
    $$('[data-radio]', group).forEach(r=> r.querySelector('.chevron')?.remove());
    radio.insertAdjacentHTML('beforeend', '<svg class="chevron" style="color:var(--accent-2)" viewBox="0 0 24 24" width="16" height="16"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  }
});

/* explicit top-level buttons */
$('#openSettingsBtn').addEventListener('click', ()=>{ renderOwnProfile(); pushScreen('settings'); });
$('#openNewChatBtn').addEventListener('click', ()=>{
  $('#newChatSearch').value = '';
  renderNewChatContacts();
  openSheet('newChatOverlay');
});
$('#chatHeaderInfo').addEventListener('click', openContactProfile);

$('#searchInput').addEventListener('input', (e)=> renderChatList(e.target.value));
$('#newChatSearch').addEventListener('input', (e)=> renderNewChatContacts(e.target.value));

// close sheets by tapping outside the sheet panel
['newChatOverlay','addContactOverlay','createGroupOverlay'].forEach(id=>{
  document.getElementById(id).addEventListener('click', (e)=>{
    if(e.target.id === id) closeSheet(id);
  });
});

/* prevent iOS-style rubber band scroll on the whole page, but allow inside scroll areas */
document.addEventListener('touchmove', (e)=>{
  if(!e.target.closest('.scroll-area, .chat-list, .messages-scroll, .sheet, .preview-card')){
    e.preventDefault();
  }
}, {passive:false});

/* =========================================================================
   INIT
   ========================================================================= */
function init(){
  renderChatList('');
  renderOwnProfile();
  updateDesktopPlaceholder();
}
init();
