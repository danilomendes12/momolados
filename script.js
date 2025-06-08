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

        // Sistema de upload
        function openUpload() {
            document.getElementById('uploadOverlay').style.display = 'flex';
        }

        function closeUpload() {
            document.getElementById('uploadOverlay').style.display = 'none';
        }

        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        function handleFiles(files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    addNewItem(file);
                }
            });
            closeUpload();
        }

        function addNewItem(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const isVideo = file.type.startsWith('video/');
                const newItem = document.createElement('div');
                newItem.className = 'video-item';
                
                const heartsId = 'hearts' + (Date.now());
                
                newItem.innerHTML = `
                    ${isVideo ? 
                        `<video class="media-content" muted loop><source src="${e.target.result}" type="${file.type}"></video>
                         <button class="play-btn" onclick="toggleVideo(this)">▶</button>` :
                        `<img class="media-content" src="${e.target.result}" alt="Nova memória">`
                    }
                    <div class="overlay"></div>
                    <div class="floating-hearts" id="${heartsId}"></div>
                    
                    <div class="content-info">
                        <div class="title">💝 Nova memória adicionada</div>
                        <div class="description">Um momento especial para guardar para sempre. Mais uma lembrança do nosso amor!</div>
                        <div class="date">${new Date().toLocaleDateString('pt-BR')}</div>
                    </div>
                    
                    <div class="sidebar">
                        <div class="action-btn" onclick="toggleLike(this)">💖</div>
                        <div class="action-btn" onclick="showComments()">💬</div>
                        <div class="action-btn" onclick="shareContent()">📤</div>
                    </div>
                `;
                
                container.insertBefore(newItem, container.firstChild);
                createHearts(heartsId);
                
                // Scroll para o novo item
                container.scrollTo({ top: 0, behavior: 'smooth' });
            };
            reader.readAsDataURL(file);
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