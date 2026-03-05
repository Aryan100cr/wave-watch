/* ============================
   ANTIGRAVITY WATCHES — MAIN JS
   ============================ */
(function () {
    'use strict';

    // ============================
    // PARTICLE BACKGROUND
    // ============================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let w, h;

    function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 186 : 270; // cyan or purple
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // mouse repel
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x += (dx / dist) * force * 1.5;
                this.y += (dy / dist) * force * 1.5;
            }

            if (this.x < 0 || this.x > w) this.speedX *= -1;
            if (this.y < 0 || this.y > h) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor((w * h) / 8000), 200);
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // ============================
    // NAVBAR
    // ============================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    function highlightNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    allNavLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    // ============================
    // SCROLL REVEAL ANIMATIONS
    // ============================
    function revealElements() {
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const delay = parseInt(el.dataset.delay || 0);
            if (rect.top < window.innerHeight - 80) {
                setTimeout(() => el.classList.add('visible'), delay);
            }
        });
    }
    window.addEventListener('scroll', revealElements);
    window.addEventListener('load', revealElements);

    // ============================
    // HERO WATCH PARALLAX
    // ============================
    const heroWatchImg = document.getElementById('hero-watch-img');
    document.addEventListener('mousemove', e => {
        if (!heroWatchImg || window.innerWidth < 768) return;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        heroWatchImg.style.transform = `translateY(${-24 + dy * -12}px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg)`;
    });

    // ============================
    // GALLERY LIGHTBOX
    // ============================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    document.querySelectorAll('.gallery-img-wrap').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    // ============================
    // INTERACTIVE WATCH (Tilt on Mouse)
    // ============================
    const stage = document.getElementById('interactive-stage');
    const interactiveWatch = document.getElementById('interactive-watch');
    const stageGlow = document.getElementById('stage-glow');

    if (stage && interactiveWatch) {
        stage.addEventListener('mousemove', e => {
            const rect = stage.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            interactiveWatch.style.transform =
                `perspective(800px) rotateY(${x * 30}deg) rotateX(${-y * 20}deg) scale(1.05)`;

            if (stageGlow) {
                stageGlow.style.left = e.clientX - rect.left + 'px';
                stageGlow.style.top = e.clientY - rect.top + 'px';
            }
        });

        stage.addEventListener('mouseleave', () => {
            interactiveWatch.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
        });
    }

    // ============================
    // CONTACT FORM
    // ============================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            btn.innerHTML = '<span>Sending...</span>';
            btn.disabled = true;

            setTimeout(() => {
                formSuccess.classList.add('active');
                contactForm.reset();
                btn.innerHTML = '<span>Subscribe Now</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
                btn.disabled = false;
            }, 1200);
        });
    }

    // ============================
    // SMOOTH SCROLL (polyfill-like)
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

})();
