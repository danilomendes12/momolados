let currentIndex = 0;
const items = document.querySelectorAll('.video-item');
const container = document.getElementById('container');
const progressFill = document.getElementById('progressFill');

// Função para criar corações flutuantes
function createHearts(containerId) {
    const heartsContainer = document.getElementById(containerId);
    if (!heartsContainer) return;
    
    const heartSymbols = ['💕', '💖', '💗', '💘', '💝', '💞'];
    
    setInterval(() => {
        if (heartsContainer.children.length < 8) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.left = Math.random() * 90 + '%';
            heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
            heart.style.animationDelay = Math.random() * 1 + 's';
            heartsContainer.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 5000);
        }
    }, 1500);
}

// Inicializar corações para todos os itens
for (let i = 1; i <= 6; i++) {
    createHearts(`hearts${i}`);
}

// Controle de scroll
container.addEventListener('scroll', () => {
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressFill.style.height = progress + '%';
    
    // Determinar item atual
    const itemHeight = window.innerHeight;
    currentIndex = Math.round(scrollTop / itemHeight);
    
    // Pausar todos os vídeos exceto o atual
    items.forEach((item, index) => {
        const video = item.querySelector('video');
        const playBtn = item.querySelector('.play-btn');
        
        if (video) {
            if (index === currentIndex) {
                // Auto-play do vídeo atual se não estiver pausado manualmente
                if (!video.dataset.paused) {
                    video.play();
                    if (playBtn) playBtn.classList.add('playing');
                }
            } else {
                video.pause();
                if (playBtn) playBtn.classList.remove('playing');
            }
        }
    });
});

// Controle de vídeo
function toggleVideo(btn) {
    const videoItem = btn.closest('.video-item');
    const video = videoItem.querySelector('video');
    
    if (video.paused) {
        video.play();
        video.dataset.paused = 'false';
        btn.classList.add('playing');
        btn.textContent = '⏸';
    } else {
        video.pause();
        video.dataset.paused = 'true';
        btn.classList.remove('playing');
        btn.textContent = '▶';
    }
}

// Função de like
function toggleLike(btn) {
    if (btn.style.color === 'red') {
        btn.style.color = 'white';
        btn.textContent = '💖';
    } else {
        btn.style.color = 'red';
        btn.textContent = '❤️';
        
        // Efeito de explosão de corações
        createLikeExplosion(btn);
    }
}

function createLikeExplosion(btn) {
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.style.position = 'fixed';
        heart.style.left = rect.left + 'px';
        heart.style.top = rect.top + 'px';
        heart.style.fontSize = '20px';
        heart.style.color = 'red';
        heart.style.zIndex = '1000';
        heart.style.pointerEvents = 'none';
        heart.textContent = '❤️';
        heart.style.animation = `explodeHeart 1s ease-out`;
        
        const angle = (i / 6) * Math.PI * 2;
        const distance = 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        heart.style.setProperty('--dx', x + 'px');
        heart.style.setProperty('--dy', y + 'px');
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 1000);
    }
}

// Adicionar CSS para animação de explosão
const style = document.createElement('style');
style.textContent = `
    @keyframes explodeHeart {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--dx), var(--dy)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Funções de placeholder
function showComments() {
    alert('💬 Comentários em breve!');
}

function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: 'Nossos Momentos Especiais',
            text: 'Confira este momento especial!',
            url: window.location.href
        });
    } else {
        alert('📤 Link copiado para compartilhar!');
    }
}

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
        container.scrollTo({
            top: (currentIndex + 1) * window.innerHeight,
            behavior: 'smooth'
        });
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        container.scrollTo({
            top: (currentIndex - 1) * window.innerHeight,
            behavior: 'smooth'
        });
    }
});

// Prevenção de zoom no iOS
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

// Touch controls para swipe
let startY = 0;
let endY = 0;

container.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});

container.addEventListener('touchend', (e) => {
    endY = e.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const diff = startY - endY;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < items.length - 1) {
            // Swipe up - próximo
            container.scrollTo({
                top: (currentIndex + 1) * window.innerHeight,
                behavior: 'smooth'
            });
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe down - anterior
            container.scrollTo({
                top: (currentIndex - 1) * window.innerHeight,
                behavior: 'smooth'
            });
        }
    }
}
// Sistema de Áudio
const backgroundMusic = document.getElementById('backgroundMusic');
const audioToggle = document.getElementById('audioToggle');
const volumeControl = document.getElementById('volumeControl');
const volumeFill = document.getElementById('volumeFill');
const volumeHandle = document.getElementById('volumeHandle');
const musicInfo = document.getElementById('musicInfo');
const equalizer = document.getElementById('equalizer');

let isPlaying = false;
let volume = 0.3; // Volume inicial (30%)

// Configurar áudio inicial
backgroundMusic.volume = volume;
updateVolumeDisplay();

// Tentar tocar música automaticamente quando o site carregar
window.addEventListener('load', () => {
    // Mostrar info da música brevemente
    showMusicInfo();
    
    // Tentar autoplay (pode ser bloqueado pelo browser)
    tryAutoplay();
});

function tryAutoplay() {
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Autoplay funcionou
            isPlaying = true;
            updateAudioButton();
            showEqualizer();
        }).catch(() => {
            // Autoplay foi bloqueado
            console.log('Autoplay bloqueado - clique no botão para tocar música');
            showMusicInfo('Clique em 🎵 para tocar música', 20000);
        });
    }
}

function toggleAudio() {
    if (isPlaying) {
        backgroundMusic.pause();
        isPlaying = false;
        hideEqualizer();
    } else {
        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                showEqualizer();
                showMusicInfo('🎶 Música tocando', 2000);
            }).catch((error) => {
                console.log('Erro ao tocar música:', error);
                showMusicInfo('❌ Erro ao tocar música', 2000);
            });
        }
    }
    updateAudioButton();
}

function updateAudioButton() {
    if (isPlaying) {
        audioToggle.textContent = '🎵';
        audioToggle.classList.add('playing');
    } else {
        audioToggle.textContent = '🔇';
        audioToggle.classList.remove('playing');
    }
}

function toggleVolumeControl() {
    volumeControl.classList.toggle('show');
}

function showEqualizer() {
    equalizer.style.display = 'flex';
}

function hideEqualizer() {
    equalizer.style.display = 'none';
}

function showMusicInfo(text = '🎶 Música Romântica', duration = 2000) {
    if (text !== '🎶 Música Romântica') {
        musicInfo.querySelector('div').innerHTML = text;
    }
    musicInfo.classList.add('show');
    setTimeout(() => {
        musicInfo.classList.remove('show');
    }, duration);
}

function updateVolumeDisplay() {
    const percentage = volume * 100;
    volumeFill.style.height = percentage + '%';
    volumeHandle.style.bottom = percentage + '%';
}

// Controle de volume por clique
volumeControl.addEventListener('click', (e) => {
    const rect = volumeControl.getBoundingClientRect();
    const y = rect.bottom - e.clientY;
    const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
    
    volume = percentage / 100;
    backgroundMusic.volume = volume;
    updateVolumeDisplay();
    
    if (volume === 0) {
        showMusicInfo('🔇 Som desligado', 1500);
    } else if (volume < 0.3) {
        showMusicInfo('🔉 Volume baixo', 1500);
    } else if (volume < 0.7) {
        showMusicInfo('🔊 Volume médio', 1500);
    } else {
        showMusicInfo('🔊 Volume alto', 1500);
    }
});

// Controle de volume por arrastar
let isDragging = false;

volumeHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = volumeControl.getBoundingClientRect();
        const y = rect.bottom - e.clientY;
        const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
        
        volume = percentage / 100;
        backgroundMusic.volume = volume;
        updateVolumeDisplay();
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Eventos de áudio
backgroundMusic.addEventListener('ended', () => {
    isPlaying = false;
    updateAudioButton();
    hideEqualizer();
});

backgroundMusic.addEventListener('error', (e) => {
    console.log('Erro ao carregar música:', e);
    showMusicInfo('❌ Erro ao carregar música', 3000);
});

// Esconder controles de volume quando clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.audio-controls')) {
        volumeControl.classList.remove('show');
    }
});