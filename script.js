document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation System ---
    const views = {
        chats: document.getElementById('view-chats'),
        settings: document.getElementById('view-settings'),
        chatRoom: document.getElementById('view-chat-room')
    };
    
    let viewStack = ['chats'];

    function navigateTo(viewId) {
        const currentView = views[viewStack[viewStack.length - 1]];
        const nextView = views[viewId.replace('view-', '')];
        
        if(!nextView) return;

        currentView.classList.remove('active');
        currentView.classList.add('left-hidden');
        
        nextView.classList.add('active');
        nextView.classList.remove('right');
        
        viewStack.push(viewId.replace('view-', ''));
    }

    function goBack() {
        if(viewStack.length <= 1) return;
        
        const currentView = views[viewStack.pop()];
        const prevView = views[viewStack[viewStack.length - 1]];

        currentView.classList.remove('active');
        currentView.classList.add('right');
        
        prevView.classList.remove('left-hidden');
        prevView.classList.add('active');
    }

    // Bind Navigation Buttons
    document.querySelector('.profile-trigger').addEventListener('click', () => navigateTo('view-settings'));
    
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', goBack);
    });

    document.querySelectorAll('.chat-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent navigation if we are swiping
            if(card.style.transform !== '' && card.style.transform !== 'translateX(0px)') {
                card.style.transform = 'translateX(0px)';
                return;
            }
            navigateTo('view-chat-room');
        });
    });

    // --- Bottom Sheet Modal (New Chat) ---
    const btnNewChat = document.getElementById('btn-new-chat');
    const modalNewChat = document.getElementById('modal-new-chat');
    
    btnNewChat.addEventListener('click', () => {
        modalNewChat.classList.add('active');
    });
    document.querySelector('[data-close="modal-new-chat"]').addEventListener('click', () => {
        modalNewChat.classList.remove('active');
    });

    // --- Input Area Logic (Mic -> Camera -> Send) ---
    const msgInput = document.getElementById('msg-input');
    const btnAction = document.getElementById('btn-msg-action');
    let inputState = 'mic'; // mic, cam, send

    const icons = {
        mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`,
        cam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
        send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`
    };

    msgInput.addEventListener('input', () => {
        if(msgInput.value.trim().length > 0) {
            if(inputState !== 'send') {
                inputState = 'send';
                btnAction.innerHTML = icons.send;
            }
        } else {
            inputState = 'mic';
            btnAction.innerHTML = icons.mic;
        }
    });

    btnAction.addEventListener('click', () => {
        if(inputState === 'mic') {
            inputState = 'cam';
            btnAction.innerHTML = icons.cam;
        } else if(inputState === 'cam') {
            inputState = 'mic';
            btnAction.innerHTML = icons.mic;
        } else if(inputState === 'send') {
            // Logic to send msg, then reset to mic
            msgInput.value = '';
            inputState = 'mic';
            btnAction.innerHTML = icons.mic;
        }
    });

    // --- Swipe & Long Press Logic for Chat Cards ---
    let startX = 0, currentX = 0;
    let holdTimer = null;
    let isSwiping = false;

    const modalPreview = document.getElementById('modal-preview');
    const previewContent = document.getElementById('preview-content');
    const modalAvatar = document.getElementById('modal-avatar');

    document.querySelectorAll('.chat-card').forEach(card => {
        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = false;
            
            // Start Long Press timer
            holdTimer = setTimeout(() => {
                if(!isSwiping) {
                    navigator.vibrate && navigator.vibrate(50); // Haptic feedback
                    // Setup preview content
                    previewContent.innerHTML = `<div style="padding:20px;text-align:center;">
                        <h2>${card.querySelector('.chat-name').innerText}</h2>
                        <p style="color:var(--text-secondary);margin-top:10px">Предпросмотр чата...</p>
                    </div>`;
                    modalPreview.classList.add('active');
                }
            }, 500); // 500ms hold
        }, {passive: true});

        card.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            
            if(Math.abs(diffX) > 10) {
                isSwiping = true;
                clearTimeout(holdTimer);
            }

            // Swipe Left only
            if(diffX < 0 && diffX > -140) {
                card.style.transform = `translateX(${diffX}px)`;
                card.style.transition = 'none';
            }
        }, {passive: true});

        card.addEventListener('touchend', (e) => {
            clearTimeout(holdTimer);
            card.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
            const diffX = currentX - startX;

            if(diffX < -60) {
                // Snap open actions
                card.style.transform = `translateX(-140px)`;
            } else {
                // Snap closed
                card.style.transform = `translateX(0px)`;
            }
        });
    });

    // Close Modals on background click
    document.querySelectorAll('.blur-bg').forEach(bg => {
        bg.addEventListener('click', (e) => {
            e.target.parentElement.classList.remove('active');
        });
    });

    // Avatar preview in Header
    document.querySelector('.chat-header-avatar').addEventListener('click', (e) => {
        const bgImg = window.getComputedStyle(e.target).backgroundImage;
        document.getElementById('avatar-large-view').style.backgroundImage = bgImg;
        modalAvatar.classList.add('active');
    });
});
