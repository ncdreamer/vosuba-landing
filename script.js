/* ═══════════════════════════════════════════════════
   VOSUBA AI — Landing Page Scripts V3
   Handles: scroll animations, navbar, mobile menu, 
   product showcase tabs, FAQ accordion
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Scroll-triggered animations ───
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observerOptions = { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('animate-in'), parseInt(delay));
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => animationObserver.observe(el));

    // ─── Navbar scroll effect ───
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ─── Mobile menu toggle ───
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // ─── Smooth scroll for anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ─── Product Showcase Tabs ───
    const tabs = document.querySelectorAll('.showcase-tab');
    const panels = document.querySelectorAll('.showcase-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel with fade
            panels.forEach(p => {
                p.classList.remove('active');
                p.style.opacity = '0';
            });

            const targetPanel = document.getElementById(`panel-${targetTab}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                requestAnimationFrame(() => {
                    targetPanel.style.opacity = '1';
                    targetPanel.style.transition = 'opacity 0.3s ease';
                });
            }
        });
    });

    // ─── FAQ accordion (one at a time) ───
    document.querySelectorAll('.faq-item').forEach(item => {
        const summary = item.querySelector('summary');
        if (summary) {
            summary.addEventListener('click', () => {
                const parent = item.parentElement;
                parent.querySelectorAll('.faq-item[open]').forEach(openItem => {
                    if (openItem !== item) openItem.removeAttribute('open');
                });
            });
        }
    });

    // ─── Mouse parallax on hero orbs ───
    const heroSection = document.getElementById('hero');
    const orbs = document.querySelectorAll('.hero-orb');

    if (heroSection && orbs.length > 0 && window.matchMedia('(min-width: 768px)').matches) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 15;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
});
