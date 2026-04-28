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
            const isOpen = mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
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

    // ═══════════════════════════════════════════════════
    // ANALYTICS — Event Tracking
    // Tracks: scroll depth, button clicks, tab switches,
    // FAQ opens, and outbound links.
    // ═══════════════════════════════════════════════════

    const _ga = (eventName, params = {}) => {
        if (typeof gtag === 'function') gtag('event', eventName, params);
    };

    // ─── Section scroll-depth tracking (fires once per section) ───
    const sectionIds = ['hero', 'product', 'features', 'pricing', 'faq'];
    const sectionsSeen = new Set();

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !sectionsSeen.has(entry.target.id)) {
                sectionsSeen.add(entry.target.id);
                _ga('section_view', { section: entry.target.id });
            }
        });
    }, { threshold: 0.3 });

    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });

    // Current page path for attribution (e.g. "/for-creators.html")
    const _page = window.location.pathname;

    // ─── UNIVERSAL: Download CTA clicks (all pages) ───
    // Catches every link to download.html regardless of page structure
    document.querySelectorAll('a[href="download.html"], a[href="/download.html"]').forEach(link => {
        link.addEventListener('click', () => {
            const label = link.textContent.trim().replace(/\s+/g, ' ');
            const location = _ctaLocation(link);
            _ga('click_cta', { cta_text: label, cta_location: location, page: _page });
        });
    });

    // ─── UNIVERSAL: Sales enquiry mailto clicks (all pages) ───
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            const label = link.textContent.trim().replace(/\s+/g, ' ');
            const email = link.href.replace('mailto:', '').split('?')[0];
            const location = _ctaLocation(link);
            _ga('sales_enquiry', { cta_text: label, email: email, cta_location: location, page: _page });
        });
    });

    // ─── UNIVERSAL: Outbound link clicks (all pages) ───
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.addEventListener('click', () => {
                _ga('outbound_click', { link_text: link.textContent.trim(), url: link.href, page: _page });
            });
        }
    });

    // ─── UNIVERSAL: Nav link clicks (all pages) ───
    document.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
        link.addEventListener('click', () => {
            _ga('nav_click', { link_text: link.textContent.trim(), page: _page });
        });
    });

    // ─── UNIVERSAL: FAQ opens (all pages) ───
    document.querySelectorAll('.faq-item summary').forEach(summary => {
        summary.addEventListener('click', () => {
            _ga('faq_open', { question: summary.textContent.trim(), page: _page });
        });
    });

    // ─── UNIVERSAL: Footer link clicks (all pages) ───
    document.querySelectorAll('footer a').forEach(link => {
        link.addEventListener('click', () => {
            _ga('footer_click', { link_text: link.textContent.trim(), href: link.href, page: _page });
        });
    });

    // ─── UNIVERSAL: Compare page internal links (vs-*, for-*) ───
    document.querySelectorAll('a[href*="vs-"], a[href*="for-"]').forEach(link => {
        if (!link.closest('footer') && !link.closest('.nav-links')) {
            link.addEventListener('click', () => {
                _ga('compare_link_click', { link_text: link.textContent.trim(), destination: link.getAttribute('href'), page: _page });
            });
        }
    });

    // ─── INDEX ONLY: Hero CTA buttons ───
    document.querySelectorAll('.hero-ctas .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            _ga('hero_cta_click', { button_text: btn.textContent.trim().replace(/\s+/g, ' ') });
        });
    });

    // ─── INDEX ONLY: Product showcase tab switches ───
    document.querySelectorAll('.showcase-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            _ga('showcase_tab', { tab: tab.dataset.tab });
        });
    });

    // ─── INDEX ONLY: Pricing button clicks ───
    document.querySelectorAll('.pricing-card .btn, .enterprise-card .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            _ga('pricing_click', { button_text: btn.textContent.trim().replace(/\s+/g, ' ') });
        });
    });

    // ─── UNIVERSAL: CTA strip / bottom CTA (works on all pages) ───
    document.querySelectorAll('.cta-strip .btn, .cta-card .btn, .final-cta .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            _ga('bottom_cta_click', { button_text: btn.textContent.trim().replace(/\s+/g, ' '), page: _page });
        });
    });

    // ─── UNIVERSAL: Time on page (fires at 30s, 60s, 120s) ───
    [30, 60, 120].forEach(seconds => {
        setTimeout(() => {
            _ga('time_on_page', { seconds: seconds, page: _page });
        }, seconds * 1000);
    });

    /**
     * Determine CTA location from DOM context.
     * Returns a human-readable string like "navbar", "hero", "bottom_cta", "body".
     */
    function _ctaLocation(el) {
        if (el.closest('nav, .mobile-menu')) return 'navbar';
        if (el.closest('#hero, .hero-creator, .hero-regulated, .hero-uni')) return 'hero';
        if (el.closest('.cta-strip, .cta-card, #bottom-cta, .final-cta')) return 'bottom_cta';
        if (el.closest('.pricing-card, .enterprise-card, #pricing')) return 'pricing';
        if (el.closest('footer')) return 'footer';
        return 'body';
    }
});
