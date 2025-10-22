// ========== DADOS DOS CERTIFICADOS ==========
const certificates = [
    {
        id: 1,
        title: "React Avançado",
        issuer: "UDEMY",
        image: "https://via.placeholder.com/400x300?text=React+Avançado",
        fileName: "certificado-react-avancado"
    },
    {
        id: 2,
        title: "Node.js Completo",
        issuer: "COURSERA",
        image: "https://via.placeholder.com/400x300?text=Node.js+Completo",
        fileName: "certificado-nodejs-completo"
    },
    {
        id: 3,
        title: "AWS Cloud Practitioner",
        issuer: "AMAZON WEB SERVICES",
        image: "https://via.placeholder.com/400x300?text=AWS+Cloud+Practitioner",
        fileName: "certificado-aws-cloud"
    }
];

// ========== RENDERIZAR CERTIFICADOS ==========
function renderCertificates() {
    const certificatesGrid = document.getElementById('certificatesGrid');
    if (!certificatesGrid) return;
    
    certificatesGrid.innerHTML = certificates.map(cert => `
        <div class="certificate-card">
            <div class="certificate-image-wrapper">
                <img src="${cert.image}" alt="${cert.title}">
            </div>
            <div class="certificate-content">
                <h4>${cert.title}</h4>
                <p>${cert.issuer}</p>
                <div class="certificate-links">
                    <button class="btn-view-certificate" data-title="${cert.title}" data-img-src="${cert.image}">
                        <i class="fas fa-eye"></i> Visualizar
                    </button>
                    <button class="btn-download-certificate" data-cert-id="${cert.id}">
                        <i class="fas fa-download"></i> Baixar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Reattach event listeners após renderizar
    document.querySelectorAll('.btn-view-certificate').forEach(btn => {
        btn.addEventListener('click', function() {
            const certificateModal = new CertificateModal();
            certificateModal.openModal(this);
        });
    });

    document.querySelectorAll('.btn-download-certificate').forEach(btn => {
        btn.addEventListener('click', function() {
            const certId = parseInt(this.dataset.certId);
            const cert = certificates.find(c => c.id === certId);
            if (cert) {
                const link = document.createElement('a');
                link.href = cert.image;
                link.download = `${cert.fileName}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    });
}

// ===== BACKGROUND ANIMATION =====
class BackgroundAnimation {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.mouse = { x: null, y: null };
        this.rafId = null;

        this.init();
    }

    init() {
        this.resize();
        this.createDots();
        this.animate();
        this.setupListeners();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight,
                                      document.body.offsetHeight, document.documentElement.offsetHeight,
                                      document.body.clientHeight, document.documentElement.clientHeight);
    }

    createDots() {
        this.dots = [];
        const spacing = 50;
        const numDots = Math.min(Math.floor((this.canvas.width * this.canvas.height) / (spacing * spacing)), 500);

        for (let i = 0; i < numDots; i++) {
              const baseX = Math.random() * this.canvas.width;
              const baseY = Math.random() * this.canvas.height;
              this.dots.push({
                  x: baseX + (Math.random() - 0.5) * 20,
                  y: baseY + (Math.random() - 0.5) * 20,
                  baseX: baseX,
                  baseY: baseY,
                  vx: 0,
                  vy: 0
              });
        }
    }


    animate() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.dots.forEach(dot => {
            let targetX = dot.baseX;
            let targetY = dot.baseY;

            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - dot.x;
                const dy = this.mouse.y - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance && distance > 0) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    targetX -= Math.cos(angle) * force * 50;
                    targetY -= Math.sin(angle) * force * 50;
                }
            }

            dot.vx += (targetX - dot.x) * 0.03;
            dot.vy += (targetY - dot.y) * 0.03;

            dot.vx *= 0.96;
            dot.vy *= 0.96;

            dot.x += dot.vx;
            dot.y += dot.vy;

              this.ctx.beginPath();
              this.ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
              this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#64748b';
              this.ctx.fill();
        });

        this.rafId = requestAnimationFrame(() => this.animate());
    }

     stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    setupListeners() {
        let resizeTimer;
        const debouncedResize = () => {
              clearTimeout(resizeTimer);
              resizeTimer = setTimeout(() => {
                this.stop();
                this.resize();
                this.createDots();
                this.animate();
              }, 300);
        };
        window.addEventListener('resize', debouncedResize);


        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY + window.scrollY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        let scrollTimer;
        let lastHeight = document.documentElement.scrollHeight;
        window.addEventListener('scroll', (e) => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const currentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
                if (currentHeight !== lastHeight) {
                    lastHeight = currentHeight;
                      this.resize();
                }
                  if (this.mouse.x !== null) {
                      const currentClientY = (typeof e?.clientY !== 'undefined') ? e.clientY : (this.mouse.y - window.scrollY);
                    this.mouse.y = currentClientY + window.scrollY;
                  }
            }, 100);
        }, { passive: true });
    }
}


// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinksContainer = document.querySelector('.nav-links');
        this.navLinks = document.querySelectorAll('.nav-links a');

        if (!this.navbar || !this.menuToggle || !this.navLinksContainer) return;

        this.navbarHeight = this.navbar.offsetHeight;
        const resizeObserver = new ResizeObserver(() => {
            this.navbarHeight = this.navbar.offsetHeight;
        });
        resizeObserver.observe(this.navbar);

        this.init();
    }

    init() {
        let lastScrollY = window.scrollY;
        const scrollThreshold = 5;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            this.navbar.classList.toggle('scrolled', currentScrollY > 100);

            if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
                if (currentScrollY > lastScrollY && currentScrollY > this.navbarHeight) {
                    if (!this.navLinksContainer.classList.contains('active')) {
                        this.navbar.style.transform = `translateY(-${this.navbarHeight}px)`;
                    }
                } else {
                    this.navbar.style.transform = 'translateY(0)';
                }
            }

            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        }, { passive: true });

        this.menuToggle.addEventListener('click', () => {
            const isActive = this.navLinksContainer.classList.toggle('active');
            this.menuToggle.classList.toggle('active');
            this.menuToggle.setAttribute('aria-expanded', isActive);
            document.documentElement.style.overflow = isActive ? 'hidden' : '';
            document.body.style.overflow = isActive ? 'hidden' : '';
            if (isActive) {
                this.navbar.style.transform = 'translateY(0)';
            }
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - this.navbarHeight - 10;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
                this.closeMobileMenu();
            });
        });

         document.addEventListener('click', (e) => {
            if (this.navLinksContainer.classList.contains('active') &&
                !this.navLinksContainer.contains(e.target) &&
                !this.menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        this.navLinksContainer.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }
}

// ===== TYPING EFFECT =====
class TypingEffect {
    constructor(element, texts, speed = 100, pause = 2000) {
        if (!element || !texts || texts.length === 0) return;
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.pause = pause;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.timeoutId = null;

        this.timeoutId = setTimeout(() => this.type(), 500);
    }

    type() {
        clearTimeout(this.timeoutId);

        const currentText = this.texts[this.textIndex];
        let typeSpeed = this.isDeleting ? this.speed / 2 : this.speed;

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = this.speed * 1.5;
        }

        this.timeoutId = setTimeout(() => this.type(), typeSpeed);
    }

    stop() {
        clearTimeout(this.timeoutId);
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.observer = null;

        if ('IntersectionObserver' in window) {
            this.init();
        } else {
              console.warn("IntersectionObserver not supported, showing all elements.");
              const animatedElements = document.querySelectorAll('.section, .project-card, .certificate-card, .skill-category-group, .skill-icon-item, .about-card, .contact-card');
              animatedElements.forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
        }
    }

    init() {
        this.observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observerInstance.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        const animatedElements = document.querySelectorAll('.section, .project-card, .certificate-card, .skill-category-group, .skill-icon-item, .about-card, .contact-card');

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            const isSection = el.classList.contains('section');
            el.style.transform = `translateY(${isSection ? '40px' : '30px'})`;
            el.style.transition = isSection
                ? 'opacity 0.8s ease-out, transform 0.8s ease-out'
                : `opacity 0.6s ease-out ${index * 0.05}s, transform 0.6s ease-out ${index * 0.05}s`;

            this.observer.observe(el);
        });
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}


// ===== PROJECT MODAL LOGIC (Sua classe original) =====
class Modal {
    constructor() {
        this.modalOverlay = document.getElementById('project-modal');
        if (!this.modalOverlay) return;

        this.modalContent = this.modalOverlay.querySelector('.modal-content');
        this.modalCloseBtn = this.modalOverlay.querySelector('.modal-close');
        this.projectCards = document.querySelectorAll('.project-card');

        this.modalTitleEl = this.modalOverlay.querySelector('#modal-title');
        this.modalDescriptionEl = this.modalOverlay.querySelector('#modal-description');
        this.modalTechListEl = this.modalOverlay.querySelector('#modal-tech-list');
        this.modalRepoLinkEl = this.modalOverlay.querySelector('#modal-repo-link');
        this.modalLiveLinkEl = this.modalOverlay.querySelector('#modal-live-link');

        if (!this.modalContent || !this.modalCloseBtn) return;

        this.originalBodyOverflow = document.body.style.overflow;
        this.originalHTMLOverflow = document.documentElement.style.overflow;
        this.boundTransitionEndHandler = this.transitionEndHandler.bind(this);

        this.init();
    }

    init() {
        this.projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.project-links a')) {
                    return;
                }
                this.openModal(e, card);
            });
        });

        this.modalCloseBtn.addEventListener('click', () => this.closeModal());

        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(e, card) {
        if (e) e.preventDefault();

        this.originalBodyOverflow = document.body.style.overflow;
        this.originalHTMLOverflow = document.documentElement.style.overflow;

        const title = card.dataset.modalTitle || 'Título Indisponível';
        const description = card.dataset.modalDescription || 'Descrição não fornecida.';
        const techString = card.dataset.modalTech || '';
        const repoLink = card.dataset.modalRepo || '#';
        const liveLink = card.dataset.modalLive || '#';

        if(this.modalTitleEl) this.modalTitleEl.textContent = title;
        if(this.modalDescriptionEl) this.modalDescriptionEl.textContent = description;
        if(this.modalRepoLinkEl) this.modalRepoLinkEl.href = repoLink;
        if(this.modalLiveLinkEl) this.modalLiveLinkEl.href = liveLink;

        if (this.modalTechListEl) {
            this.modalTechListEl.innerHTML = '';
            const techs = techString.split(',');
            let hasTechs = false;
            techs.forEach(tech => {
                const trimmedTech = tech.trim();
                if (trimmedTech) {
                    hasTechs = true;
                    const li = document.createElement('li');
                    li.textContent = trimmedTech;
                    this.modalTechListEl.appendChild(li);
                }
            });
            const techSectionHeader = this.modalTechListEl.previousElementSibling;
              if(techSectionHeader && techSectionHeader.tagName === 'H4'){
                  techSectionHeader.style.display = hasTechs ? '' : 'none';
              }
            this.modalTechListEl.style.display = hasTechs ? '' : 'none';
        }

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        this.modalContent.style.transform = 'scale(0.95) translateY(10px)';
        this.modalContent.style.opacity = '0';
        this.modalOverlay.classList.add('active');

        this.modalOverlay.focus();

        requestAnimationFrame(() => {
            this.modalContent.style.transform = 'scale(1) translateY(0)';
            this.modalContent.style.opacity = '1';
        });
    }

    closeModal() {
        this.modalContent.removeEventListener('transitionend', this.boundTransitionEndHandler);

        this.modalContent.style.transform = 'scale(0.95) translateY(10px)';
        this.modalContent.style.opacity = '0';
        this.modalContent.addEventListener('transitionend', this.boundTransitionEndHandler, { once: true });
    }

    transitionEndHandler() {
         if (!this.modalOverlay.classList.contains('active')) return;

         this.modalOverlay.classList.remove('active');

         document.documentElement.style.overflow = this.originalHTMLOverflow;
         document.body.style.overflow = this.originalBodyOverflow;
    }
}

// ===================================
// === NOVA CLASSE: CERTIFICATE MODAL ===
// ===================================
class CertificateModal {
    constructor() {
        this.modalOverlay = document.getElementById('certificate-modal');
        if (!this.modalOverlay) return;

        this.modalContent = this.modalOverlay.querySelector('.modal-content');
        this.modalCloseBtn = this.modalOverlay.querySelector('.modal-close');

        this.modalTitleEl = this.modalOverlay.querySelector('#certificate-modal-title');
        this.modalImageEl = this.modalOverlay.querySelector('#certificate-modal-image');

        if (!this.modalContent || !this.modalCloseBtn || !this.modalImageEl) return;

        this.originalBodyOverflow = document.body.style.overflow;
        this.originalHTMLOverflow = document.documentElement.style.overflow;
        this.boundTransitionEndHandler = this.transitionEndHandler.bind(this);

        this.init();
    }

    init() {
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());

        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(button) {
        this.originalBodyOverflow = document.body.style.overflow;
        this.originalHTMLOverflow = document.documentElement.style.overflow;

        const title = button.dataset.title || 'Certificado';
        const imgSrc = button.dataset.imgSrc || '';

        if(this.modalTitleEl) this.modalTitleEl.textContent = title;
        if(this.modalImageEl) {
            this.modalImageEl.src = imgSrc;
            this.modalImageEl.alt = `Certificado de ${title}`;
        }

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        this.modalContent.style.transform = 'scale(0.95) translateY(10px)';
        this.modalContent.style.opacity = '0';
        this.modalOverlay.classList.add('active');
        this.modalOverlay.focus();

        requestAnimationFrame(() => {
            this.modalContent.style.transform = 'scale(1) translateY(0)';
            this.modalContent.style.opacity = '1';
        });
    }

    closeModal() {
        this.modalContent.removeEventListener('transitionend', this.boundTransitionEndHandler);

        this.modalContent.style.transform = 'scale(0.95) translateY(10px)';
        this.modalContent.style.opacity = '0';
        this.modalContent.addEventListener('transitionend', this.boundTransitionEndHandler, { once: true });
    }

    transitionEndHandler() {
        if (!this.modalOverlay.classList.contains('active')) return;
        this.modalOverlay.classList.remove('active');
        document.documentElement.style.overflow = this.originalHTMLOverflow;
        document.body.style.overflow = this.originalBodyOverflow;
    }
}
// ===================================
// === FIM DA NOVA CLASSE ===
// ===================================


// ===== PROJECTS MANAGER =====
class ProjectManager {
    constructor(initialCount = 6) {
        this.projectGrid = document.querySelector('.projects-grid');
        this.viewMoreBtn = document.getElementById('view-more-projects');
        this.initialProjectsCount = initialCount;

        if (!this.projectGrid) return;

        this.allProjectCards = Array.from(this.projectGrid.querySelectorAll('.project-card'));

        this.init();
    }

    init() {
        this.displayInitialProjects();
        if (this.viewMoreBtn) {
            this.viewMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleViewMoreProjects();
            });
              if (this.allProjectCards.length <= this.initialProjectsCount) {
                  this.viewMoreBtn.style.display = 'none';
              }
        } else {
            if (this.allProjectCards.length <= this.initialProjectsCount) {
                this.allProjectCards.forEach(card => card.classList.remove('project-hidden'));
            }
        }
    }

    displayInitialProjects() {
        this.allProjectCards.forEach((card, index) => {
            card.classList.toggle('project-hidden', index >= this.initialProjectsCount);
        });
         if (this.viewMoreBtn) this.viewMoreBtn.textContent = 'Ver Mais';
    }

    toggleViewMoreProjects() {
        const hasHiddenProjects = this.allProjectCards.some(card => card.classList.contains('project-hidden'));

        if (hasHiddenProjects) {
            this.allProjectCards.forEach(card => card.classList.remove('project-hidden'));
            if (this.viewMoreBtn) this.viewMoreBtn.textContent = 'Ver Menos';
        } else {
            if (this.viewMoreBtn && this.allProjectCards.length > this.initialProjectsCount) {
                this.displayInitialProjects();
            }
        }
    }
}

// ===== TECH ICONS FLOATING =====
class TechIcons {
    constructor(count = 20) {
        this.techIconsContainer = document.getElementById('tech-icons');
        if (!this.techIconsContainer) return;
        this.iconCount = count;
        this.icons = [
            'fab fa-html5', 'fab fa-css3-alt', 'fab fa-js-square', 'fab fa-react', 'fab fa-node-js',
            'fab fa-python', 'fab fa-git-alt', 'fab fa-docker', 'fab fa-aws', 'fab fa-linux',
            'fab fa-sass', 'fab fa-bootstrap', 'fab fa-php', 'fab fa-java', 'fab fa-vuejs',
            'fab fa-angular', 'fab fa-wordpress', 'fab fa-figma', 'fab fa-chrome', 'fab fa-github'
        ];
        this.init();
    }

    init() {
        this.createFloatingIcons();
    }

    createFloatingIcons() {
        this.techIconsContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < this.iconCount; i++) {
            const icon = document.createElement('i');
            icon.className = `tech-icon ${this.icons[Math.floor(Math.random() * this.icons.length)]}`;
            icon.style.left = `${Math.random() * 95}%`;
            icon.style.top = `${Math.random() * 95}%`;
            icon.style.animationDelay = `${Math.random() * 15}s`;
            icon.style.animationDuration = `${20 + Math.random() * 20}s`;
            icon.style.fontSize = `${1.5 + Math.random() * 1.5}rem`;
            icon.style.opacity = `${0.1 + Math.random() * 0.1}`;
            fragment.appendChild(icon);
        }
        this.techIconsContainer.appendChild(fragment);
    }
}

// =============================================
// === Inicialização de todas as classes ===
// =============================================
function initializePortfolio() {
    new BackgroundAnimation();
    new Navigation();

    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypingEffect(typingElement,
            ['Desenvolvedor Web', 'Criador de Soluções'],
            120,
            2200
        );
    }

    new ScrollAnimations();
    new Modal();
    new CertificateModal();
    new ProjectManager(6);
    new TechIcons(25);

    // Renderizar certificados
    renderCertificates();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

