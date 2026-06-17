// Text Scramble Effect Class
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end, char: '' });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Intro Loading Logic ---
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const body = document.body;
    
    // Intro Typing Animation
    const introText = "당신이 당연하게 누리는 자유와 주체성은 지금 안전합니까?";
    const typingEl = document.getElementById('intro-typing');
    const loadingTextEl = document.getElementById('intro-loading-text');
    const progressFillEl = document.getElementById('intro-progress-fill');
    let typingInterval;
    let loadingInterval;
    
    function startIntro() {
        body.classList.add('locked-scroll');
        introOverlay.classList.remove('hidden', 'slide-up');
        mainContent.style.opacity = '0';
        typingEl.innerHTML = '';
        progressFillEl.style.width = '0%';
        loadingTextEl.innerHTML = 'BOOTING SYSTEM... [0%]';
        
        let i = 0;
        typingInterval = setInterval(() => {
            if (i < introText.length) {
                typingEl.innerHTML += introText.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                startProgressBar();
            }
        }, 80);
    }

    function startProgressBar() {
        let progress = 0;
        loadingTextEl.innerHTML = 'CONNECTING TO MINILUV... [0%]';
        loadingInterval = setInterval(() => {
            if (progress < 100) {
                progress += Math.floor(Math.random() * 8) + 3; // incremental steps
                if (progress > 100) progress = 100;
                progressFillEl.style.width = progress + '%';
                
                if (progress < 30) {
                    loadingTextEl.innerHTML = `CONNECTING TO MINILUV... [${progress}%]`;
                } else if (progress < 65) {
                    loadingTextEl.innerHTML = `DECRYPTING DATA STREAMS... [${progress}%]`;
                } else if (progress < 90) {
                    loadingTextEl.innerHTML = `SYNCHRONIZING TELESCREENS... [${progress}%]`;
                } else {
                    loadingTextEl.innerHTML = `ESTABLISHING SECURE CONNECTION... [${progress}%]`;
                }
            } else {
                clearInterval(loadingInterval);
                loadingTextEl.innerHTML = 'ACCESS GRANTED. ENTERING SYSTEM... [100%]';
                setTimeout(closeIntro, 800);
            }
        }, 60);
    }
    
    function closeIntro() {
        clearInterval(typingInterval);
        clearInterval(loadingInterval);
        introOverlay.classList.add('slide-up');
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            body.classList.remove('locked-scroll');
            mainContent.style.opacity = '1';
        }, 800);
    }

    // Start intro on initial load
    startIntro();

    // --- 2. Navigation / Menu Logic ---
    const menuBtn = document.getElementById('menu-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('active');
    });

    const menuItems = dropdownMenu.querySelectorAll('li');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            gsap.to(window, { duration: 1, scrollTo: { y: targetId, offsetY: 80 }, ease: "power3.inOut" });
        });
    });

    // UP Button
    const btnUp = document.getElementById('btn-up');
    if(btnUp) {
        btnUp.addEventListener('click', () => {
            gsap.to(window, { duration: 1, scrollTo: 0, ease: "power3.inOut" });
        });
    }

    // --- 3. Outro / Exit Logic (Reboot Loading) ---
    const btnShutdown = document.getElementById('btn-shutdown');
    const outroOverlay = document.getElementById('outro-overlay');
    const tvOff = document.getElementById('tv-off');
    const restartScreen = document.getElementById('restart-screen');
    const btnRestart = document.getElementById('btn-restart');
    
    const outroText = "모든 것을 의심하라.\n빅브라더는 당신을 지켜보고 있다.";
    const outroTypingEl = document.getElementById('outro-typing');
    let outroTypingInterval;
    let rebootInterval;

    btnShutdown.addEventListener('click', () => {
        body.classList.add('locked-scroll');
        outroOverlay.classList.remove('hidden');
        tvOff.classList.remove('hidden');
        tvOff.classList.add('animate');
        
        setTimeout(() => {
            restartScreen.classList.remove('hidden');
            outroTypingEl.innerHTML = '';
            btnRestart.classList.add('hidden');
            document.getElementById('outro-loading-container').style.display = 'none';
            
            let i = 0;
            outroTypingInterval = setInterval(() => {
                if (i < outroText.length) {
                    let char = outroText.charAt(i);
                    if(char === '\n') {
                        outroTypingEl.innerHTML += '<br>';
                    } else {
                        outroTypingEl.innerHTML += char;
                    }
                    i++;
                } else {
                    clearInterval(outroTypingInterval);
                    startRebootProgress();
                }
            }, 100);
        }, 1000);
    });

    function startRebootProgress() {
        const outroLoadingContainer = document.getElementById('outro-loading-container');
        const outroLoadingText = document.getElementById('outro-loading-text');
        const outroProgressFill = document.getElementById('outro-progress-fill');
        
        outroLoadingContainer.style.display = 'block';
        outroProgressFill.style.width = '0%';
        outroLoadingText.innerHTML = 'REBOOTING SYSTEM... [0%]';
        
        let progress = 0;
        rebootInterval = setInterval(() => {
            if (progress < 100) {
                progress += Math.floor(Math.random() * 8) + 4;
                if (progress > 100) progress = 100;
                outroProgressFill.style.width = progress + '%';
                
                if (progress < 40) {
                    outroLoadingText.innerHTML = `FLUSHING CACHE... [${progress}%]`;
                } else if (progress < 80) {
                    outroLoadingText.innerHTML = `RELOADING TELESCREENS... [${progress}%]`;
                } else {
                    outroLoadingText.innerHTML = `RESTABLISHING CONTROL GRID... [${progress}%]`;
                }
            } else {
                clearInterval(rebootInterval);
                outroLoadingText.innerHTML = 'SYSTEM REBOOT COMPLETE. [100%]';
                setTimeout(() => {
                    btnRestart.classList.remove('hidden');
                }, 500);
            }
        }, 80);
    }

    btnRestart.addEventListener('click', () => {
        clearInterval(rebootInterval);
        restartScreen.classList.add('hidden');
        tvOff.classList.remove('animate');
        tvOff.classList.add('hidden');
        outroOverlay.classList.add('hidden');
        outroTypingEl.innerHTML = '';
        btnRestart.classList.add('hidden');
        
        window.scrollTo(0, 0); // Scroll to top instantly
        startIntro(); // Restart the intro sequence
    });


    // --- 4. GSAP Scroll Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Entrance animations for the redesigned typography poster (stretching vertically and sliding up)
    gsap.fromTo('.stretched-char', 
        { scaleY: 0.1, y: 180, opacity: 0 },
        { 
            scaleY: 3.4, 
            y: 0, 
            opacity: 1, 
            duration: 1.8, 
            stagger: 0.15, 
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#message',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.from('.poster-slogan', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.4,
        scrollTrigger: {
            trigger: '#message',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    // Animate badge entrance slightly
    gsap.from('.citizen-badge', {
        scale: 0,
        rotation: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'back.out(1.7)',
        delay: 0.8,
        scrollTrigger: {
            trigger: '#message',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });

    // Quotes Section Columns Fade-in
    gsap.from('.quote-column', {
        scrollTrigger: {
            trigger: '#quotes',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 35,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out'
    });

    // Author Section Fade-in
    gsap.from('.author-window', {
        scrollTrigger: {
            trigger: '#author',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power2.out'
    });

    // Slogans English <-> Korean Click Toggle
    const slogansData = {
        'slogan-1': { en: 'WAR IS PEACE', ko: '전쟁은 평화' },
        'slogan-2': { en: 'FREEDOM IS SLAVERY', ko: '자유는 예속' },
        'slogan-3': { en: 'IGNORANCE IS STRENGTH', ko: '무지는 힘' }
    };

    Object.keys(slogansData).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
                const isKo = el.classList.toggle('is-ko');
                el.innerText = isKo ? slogansData[id].ko : slogansData[id].en;
                
                const baseRotation = 0;
                
                // Scale / Glitch transition effect while preserving flat rotation angle
                gsap.fromTo(el, 
                    { scale: 0.95, rotation: baseRotation, filter: 'blur(2px)' }, 
                    { duration: 0.3, scale: 1, rotation: baseRotation, filter: 'blur(0px)', ease: 'power2.out' }
                );
            });
        }
    });

    // --- Draggable Citizen Badges ---
    const badges = document.querySelectorAll('.citizen-badge');
    badges.forEach(badge => {
        let isDragging = false;
        let startX, startY;

        badge.addEventListener('mousedown', dragStart);
        badge.addEventListener('touchstart', dragStart, { passive: true });

        function dragStart(e) {
            isDragging = true;
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

            const rect = badge.getBoundingClientRect();
            startX = clientX - rect.left;
            startY = clientY - rect.top;

            badge.style.zIndex = '1000';
            badge.style.cursor = 'grabbing';

            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchmove', dragMove, { passive: false });
            document.addEventListener('touchend', dragEnd);
        }

        function dragMove(e) {
            if (!isDragging) return;
            if (e.type === 'touchmove') e.preventDefault();

            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            const container = document.getElementById('message');
            const containerRect = container.getBoundingClientRect();

            let x = clientX - containerRect.left - startX;
            let y = clientY - containerRect.top - startY;

            badge.style.left = `${x}px`;
            badge.style.top = `${y}px`;
        }

        function dragEnd() {
            isDragging = false;
            badge.style.cursor = 'grab';
            badge.style.zIndex = '10';

            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('touchend', dragEnd);
        }
    });

    // --- 5. Eye tracking mouse & toggle info panel ---
    const eyeContainer = document.getElementById('eye-container');
    const irisPupilGroup = document.getElementById('iris-pupil-group');
    const eyeInfoPanel = document.getElementById('eye-info-panel');
    const btnCloseEyeInfo = document.getElementById('btn-close-eye-info');
    
    // 항상 눈 표시
    eyeContainer.classList.remove('hidden');
    
    document.addEventListener('mousemove', (e) => {
        const eyeRect = eyeContainer.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        
        // Limit distance so eyeball movement looks natural and stays clipped
        const distance = Math.min(9, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) * 0.04);
        
        const dx = distance * Math.cos(angle);
        const dy = distance * Math.sin(angle);
        
        // Translate the entire iris/pupil group together for realism
        irisPupilGroup.setAttribute('transform', `translate(${dx}, ${dy})`);
    });

    // Eye container click toggles info panel
    eyeContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        eyeInfoPanel.classList.toggle('active');
    });

    // Close eye info panel
    btnCloseEyeInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        eyeInfoPanel.classList.remove('active');
    });

    // Click outside to close panel
    document.addEventListener('click', (e) => {
        if (!eyeInfoPanel.contains(e.target) && e.target !== eyeContainer && !eyeContainer.contains(e.target)) {
            eyeInfoPanel.classList.remove('active');
        }
    });

    // --- 6. Diary Interaction ---
    const diaryInput = document.getElementById('diary-input');
    const forbiddenWords = ['자유', '평화', '혁명', 'freedom', 'peace', 'revolution'];
    
    // Formatting Toolbar Listeners
    const btnBold = document.getElementById('btn-bold');
    const btnItalic = document.getElementById('btn-italic');
    const btnUnderline = document.getElementById('btn-underline');
    const btnFontSwitch = document.getElementById('btn-font-switch');
    const btnSizeInc = document.getElementById('btn-size-inc');
    const btnSizeDec = document.getElementById('btn-size-dec');
    
    let currentFontSize = 18; // default px

    if (btnBold) {
        btnBold.addEventListener('click', () => {
            btnBold.classList.toggle('active');
            diaryInput.style.fontWeight = btnBold.classList.contains('active') ? 'bold' : 'normal';
        });
    }
    if (btnItalic) {
        btnItalic.addEventListener('click', () => {
            btnItalic.classList.toggle('active');
            diaryInput.style.fontStyle = btnItalic.classList.contains('active') ? 'italic' : 'normal';
        });
    }
    if (btnUnderline) {
        btnUnderline.addEventListener('click', () => {
            btnUnderline.classList.toggle('active');
            diaryInput.style.textDecoration = btnUnderline.classList.contains('active') ? 'underline' : 'none';
        });
    }

    let currentFont = 'retro';
    if (btnFontSwitch) {
        btnFontSwitch.addEventListener('click', () => {
            if (currentFont === 'retro') {
                diaryInput.style.fontFamily = 'var(--font-modern)';
                btnFontSwitch.textContent = 'Font: Pretendard';
                currentFont = 'modern';
            } else if (currentFont === 'modern') {
                diaryInput.style.fontFamily = 'serif';
                btnFontSwitch.textContent = 'Font: Serif';
                currentFont = 'serif';
            } else {
                diaryInput.style.fontFamily = 'var(--font-retro)';
                btnFontSwitch.textContent = 'Font: D2Coding';
                currentFont = 'retro';
            }
        });
    }

    if (btnSizeInc) {
        btnSizeInc.addEventListener('click', () => {
            currentFontSize = Math.min(32, currentFontSize + 2);
            diaryInput.style.fontSize = `${currentFontSize}px`;
        });
    }
    if (btnSizeDec) {
        btnSizeDec.addEventListener('click', () => {
            currentFontSize = Math.max(12, currentFontSize - 2);
            diaryInput.style.fontSize = `${currentFontSize}px`;
        });
    }
    
    diaryInput.addEventListener('input', (e) => {
        let text = diaryInput.value;
        let detected = false;
        
        forbiddenWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            if (regex.test(text)) {
                detected = true;
                const replacement = '█'.repeat(word.length);
                text = text.replace(regex, replacement);
            }
        });
        
        if (detected) {
            diaryInput.value = text;
            const foregroundWin = document.querySelector('.foreground-win');
            if (foregroundWin) {
                foregroundWin.classList.add('shake');
                setTimeout(() => {
                    foregroundWin.classList.remove('shake');
                }, 400);
            }
        }
    });

    // --- 7. Pyramid / Class Nodes Hover Tooltip ---
    const classNodes = document.querySelectorAll('.class-node');
    const pyramidTooltip = document.getElementById('pyramid-tooltip');
    const tooltipTitle = pyramidTooltip.querySelector('.tooltip-title');
    const tooltipDesc = pyramidTooltip.querySelector('.tooltip-desc');
    const classData = {
        'inner': { title: 'Inner Party (내부당원 2%)', desc: '최상위 지배 계급, 빅브라더. 물질적 특권이 있으나 텔레스크린으로 가장 철저히 감시받음.' },
        'outer': { title: 'Outer Party (외부당원 13%)', desc: '당의 행정, 검열, 프로파간다 담당. 윈스턴 소속. 가장 가혹한 감시 대상이며 정서적 고립 상태.' },
        'proles': { title: 'Proles (프롤 85%)', desc: '하층 노동자 계급. "동물과 같다". 사상 교육이 없어 사상의 자유가 역설적으로 존재. 방치됨.' }
    };

    classNodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            const data = classData[node.dataset.class];
            if (!data) return;
            tooltipTitle.textContent = data.title;
            tooltipDesc.textContent = data.desc;
            
            // Position the tooltip relative to the hovered class-node inside the pyramid-box
            const box = document.querySelector('.pyramid-box');
            const boxRect = box.getBoundingClientRect();
            const nodeRect = node.getBoundingClientRect();
            
            const left = (nodeRect.left - boxRect.left) + (nodeRect.width / 2);
            const top = (nodeRect.top - boxRect.top) - 10;
            
            pyramidTooltip.style.left = `${left}px`;
            pyramidTooltip.style.top = `${top}px`;
            pyramidTooltip.classList.add('active');
        });
        
        node.addEventListener('mouseleave', () => {
            pyramidTooltip.classList.remove('active');
        });
    });

    // --- 8. Telescreen Live Stream & AI Chat ---
    const btnHate = document.getElementById('btn-hate');
    const btnStarBalloon = document.getElementById('btn-star-balloon');
    const tvGlitchOverlay = document.getElementById('tv-glitch-overlay');
    const tvCrackOverlay = document.getElementById('tv-crack-overlay');
    const tvDonationAlert = document.getElementById('tv-donation-alert');
    const telescreenWindow = document.querySelector('.telescreen-window');
    const chatMessages = document.getElementById('chat-messages');
    
    const mockChats = [
        "빅브라더 얼굴 찬양해 ㄷㄷ",
        "와 오늘 선전영상 퀄리티 쩐다",
        "배급량 늘려줘 ㅠㅠ",
        "사상검증 나왔습니다 당원증 까세요",
        "여기가 그 감시방송인가요?",
        "빅브라더 가즈아아아아!!",
        "방장님 사랑해요",
        "후원 리액션 개웃김 ㅋㅋㅋ",
        "경찰님들 여기 사상범 잡아가세요",
        "오늘 선전도 대성공인듯",
        "채팅창 물 좋네 ㅋㅋㅋ",
        "골드스타인 나쁜놈아!",
        "대양주 최고존엄 ㄷㄷㄷ",
        "다들 텔레스크린 켜라"
    ];

    setInterval(() => {
        if(mainContent.style.opacity === '1') {
            const div = document.createElement('div');
            div.className = 'chat-msg';
            div.innerHTML = `<span class="username">Citizen_${Math.floor(Math.random()*9000)+1000}:</span> ${mockChats[Math.floor(Math.random()*mockChats.length)]}`;
            chatMessages.appendChild(div);
            if(chatMessages.children.length > 20) chatMessages.removeChild(chatMessages.firstChild);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 2000);

    // Hate button floods screen with HATE comments and glitched overlay
    if (btnHate) {
        btnHate.addEventListener('click', () => {
            telescreenWindow.classList.add('shake');
            setTimeout(() => telescreenWindow.classList.remove('shake'), 500);
            
            tvGlitchOverlay.classList.add('active');
            setTimeout(() => tvGlitchOverlay.classList.remove('active'), 800);
            
            const hatePhrases = [
                "HATE!!! HATE!!!",
                "골드스타인을 처단하라!!",
                "배신자 처단!!!",
                "증오한다 죽여라!!",
                "오세아니아의 주적 Goldstein!",
                "HATE HATE HATE"
            ];
            for(let i=0; i<6; i++) {
                setTimeout(() => {
                    const div = document.createElement('div');
                    div.className = 'chat-msg';
                    div.style.color = 'var(--win-red)';
                    div.style.background = 'rgba(211, 47, 47, 0.05)';
                    div.innerHTML = `<span class="username" style="color:var(--win-red);">Citizen_${Math.floor(Math.random()*9000)+1000}:</span> ${hatePhrases[Math.floor(Math.random()*hatePhrases.length)]}`;
                    chatMessages.appendChild(div);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, i * 120);
            }
        });
    }

    // Star balloon donation button
    if (btnStarBalloon) {
        btnStarBalloon.addEventListener('click', () => {
            const donor = `Citizen_${Math.floor(Math.random()*9000)+1000}`;
            const div = document.createElement('div');
            div.className = 'chat-msg';
            div.style.border = '1px solid #ff9900';
            div.style.background = 'rgba(255, 153, 0, 0.05)';
            div.style.padding = '8px';
            div.innerHTML = `<span class="username" style="color:#ff9900;">👑 ${donor}:</span> 별풍선 100개 후원! "빅브라더 만세!!"`;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            tvDonationAlert.textContent = `${donor} 별풍선 100개 후원!`;
            tvDonationAlert.classList.add('active');
            
            tvGlitchOverlay.classList.add('active');
            tvCrackOverlay.classList.add('cracked');
            
            setTimeout(() => {
                tvDonationAlert.classList.remove('active');
            }, 2000);
            
            setTimeout(() => {
                tvGlitchOverlay.classList.remove('active');
            }, 850);
            
            // Repair crack after 5 seconds
            setTimeout(() => {
                tvCrackOverlay.classList.remove('cracked');
            }, 5000);
        });
    }

    // Chat input logic
    const chatInput = document.getElementById('chat-input');
    const btnChatSend = document.getElementById('btn-chat-send');
    
    function sendChat() {
        const text = chatInput.value.trim();
        if(!text) return;
        
        // Censor text if it contains forbidden words, or always censor for dystopia feel
        const censoredText = text.replace(/[가-힣a-zA-Z]/g, '■');
        
        const div = document.createElement('div');
        div.className = 'chat-msg';
        div.innerHTML = `<span class="username" style="color:var(--win-red);">Winston_Smith:</span> ${censoredText}`;
        chatMessages.appendChild(div);
        
        if(chatMessages.children.length > 20) chatMessages.removeChild(chatMessages.firstChild);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Immediate AI reply
        setTimeout(() => {
            const reply = document.createElement('div');
            reply.className = 'chat-msg';
            reply.innerHTML = `<span class="username" style="color:var(--win-border);">SYSTEM:</span> 귀하의 발언은 통제되었습니다.`;
            chatMessages.appendChild(reply);
            if(chatMessages.children.length > 20) chatMessages.removeChild(chatMessages.firstChild);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);
    }
    
    btnChatSend.addEventListener('click', sendChat);
    chatInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') sendChat();
    });

    // --- 1984 vs 2026 Card Flip & Full Scramble ---
    document.querySelectorAll('.comparison-card').forEach(card => {
        const frontSpan = card.querySelector('.card-front .card-desc span');
        const backSpan = card.querySelector('.card-back .card-desc span');
        
        if (frontSpan) frontSpan.dataset.original = frontSpan.textContent;
        if (backSpan) backSpan.dataset.original = backSpan.textContent;
        
        const frontScrambler = frontSpan ? new TextScramble(frontSpan) : null;
        const backScrambler = backSpan ? new TextScramble(backSpan) : null;
        
        card.addEventListener('mouseenter', () => {
            const isFlipped = card.classList.contains('flipped');
            if (!isFlipped && frontScrambler && frontSpan) {
                frontScrambler.setText(frontSpan.dataset.original);
            } else if (isFlipped && backScrambler && backSpan) {
                backScrambler.setText(backSpan.dataset.original);
            }
        });
        
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            
            // Trigger scramble on the newly visible face after a short delay for flip transition
            setTimeout(() => {
                const isFlipped = card.classList.contains('flipped');
                if (!isFlipped && frontScrambler && frontSpan) {
                    frontScrambler.setText(frontSpan.dataset.original);
                } else if (isFlipped && backScrambler && backSpan) {
                    backScrambler.setText(backSpan.dataset.original);
                }
            }, 150);
        });
    });

    // --- 9. 3D Book Setup (Three.js) ---
    function init3DBook() {
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Simple Book Geometry (Box)
        const geometry = new THREE.BoxGeometry(3, 4.5, 0.5);
        
        // Create retro texture programmatically via canvas
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff0000'; // modern red cover
        ctx.fillRect(0,0,256,512);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px NeoDunggeunmo, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('1 9 8 4', 128, 100);
        ctx.font = '20px NeoDunggeunmo, sans-serif';
        ctx.fillText('George Orwell', 128, 450);
        
        const texture = new THREE.CanvasTexture(canvas);
        const materialCover = new THREE.MeshLambertMaterial({ map: texture });
        const materialPages = new THREE.MeshLambertMaterial({ color: 0xffffff });
        
        const materials = [
            materialPages, // right
            materialCover, // left (spine)
            materialPages, // top
            materialPages, // bottom
            materialCover, // front
            materialCover  // back
        ];
        
        const book = new THREE.Mesh(geometry, materials);
        scene.add(book);
        
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5).normalize();
        scene.add(light);
        
        const ambientLight = new THREE.AmbientLight(0x606060);
        scene.add(ambientLight);
        
        camera.position.z = 7;
        
        function animateBook() {
            requestAnimationFrame(animateBook);
            book.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animateBook();

        // Handle resize
        window.addEventListener('resize', () => {
            if(container.clientWidth > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });
    }
    
    // Init book via intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                init3DBook();
                observer.disconnect();
            }
        });
    });
    observer.observe(document.getElementById('book'));


    // --- Helper: Create Windows Popup ---
    function createWinPopup(title, text, isError = false, topPos = 50, leftPos = 50) {
        const container = document.getElementById('popup-container');
        const popup = document.createElement('div');
        popup.className = 'popup-window win-window';
        popup.style.top = topPos + '%';
        popup.style.left = leftPos + '%';
        
        popup.innerHTML = `
            <div class="win-titlebar" style="background: ${isError ? 'var(--win-red)' : 'var(--win-blue)'}">
                <div class="win-title">${title}</div>
                <div class="win-controls"><button onclick="this.closest('.popup-window').remove()">X</button></div>
            </div>
            <div class="win-content" style="padding: 20px;">
                <div class="popup-content">
                    <div class="popup-icon">${isError ? '⚠️' : 'ℹ️'}</div>
                    <div class="popup-text">
                        <h3>${isError ? 'WARNING' : 'INFO'}</h3>
                        <p>${text}</p>
                    </div>
                </div>
                <div class="popup-btn-wrap">
                    <button class="popup-btn" onclick="this.closest('.popup-window').remove()">OK</button>
                </div>
            </div>
        `;
        container.appendChild(popup);
    }

    // --- 10. Win Buttons (Close) ---
    document.querySelectorAll('.win-btn-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const win = e.target.closest('.win-window');
            if(win) {
                win.style.display = 'none';
                createWinPopup("SYSTEM ERROR", "창을 강제로 닫을 수 없습니다. 감시가 진행 중입니다.", true, Math.random() * 50 + 20, Math.random() * 50 + 20);
                setTimeout(() => {
                    win.style.display = 'block';
                }, 2000);
            }
        });
    });

    // --- 11. Pyramid Click Logic ---
    const pyramidLayers = document.querySelectorAll('.tri-layer');
    pyramidLayers.forEach(layer => {
        layer.addEventListener('click', () => {
            layer.classList.add('active');
            setTimeout(() => {
                layer.classList.remove('active');
            }, 1000);
        });
    });

});
