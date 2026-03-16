/* ============================================
   Chetan Soni Portfolio - Main JavaScript
   ============================================ */

// ============================================
// Configuration
// ============================================
const CONFIG = {
    typingSpeed: 100,
    typingDeleteSpeed: 50,
    typingPause: 2000,
    counterDuration: 2000,
    githubUsername: 'ErChetanSoni',
    titles: [
        'Lead DevOps Engineer',
        'Cloud Platform Architect',
        'Kubernetes Expert',
        'Infrastructure Specialist',
        'Automation Enthusiast'
    ]
};

// ============================================
// Projects Data
// ============================================
const projectsData = [
    {
        id: 1,
        title: 'Particle41 DevOps Challenge',
        description: 'Senior DevOps challenge showcasing Terraform, AWS ECS, and infrastructure automation skills.',
        tech: ['Terraform', 'AWS', 'ECS', 'HCL'],
        category: 'devops',
        github: 'https://github.com/ErChetanSoni/particle41-devops-challenge-senior',
        icon: 'fas fa-cloud'
    },
    {
        id: 2,
        title: 'Node PostgreSQL Redis/Valkey',
        description: 'Full-stack application with Node.js, PostgreSQL database, and Redis/Valkey caching.',
        tech: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
        category: 'infra',
        github: 'https://github.com/ErChetanSoni/node-postgres-redis-valkey',
        icon: 'fas fa-database'
    },
    {
        id: 3,
        title: 'Chaos Monkey',
        description: 'Chaos engineering tool for testing system resilience and fault tolerance.',
        tech: ['Shell', 'Kubernetes', 'DevOps'],
        category: 'devops',
        github: 'https://github.com/ErChetanSoni/chaos-monkey',
        icon: 'fas fa-bug'
    },
    {
        id: 4,
        title: 'Authelia Authentication',
        description: 'Multi-factor authentication solution for securing applications and services.',
        tech: ['Docker', 'Security', 'OAuth'],
        category: 'infra',
        github: 'https://github.com/ErChetanSoni/authelia',
        icon: 'fas fa-shield-alt'
    },
    {
        id: 5,
        title: 'Email Automation',
        description: 'Python-based email automation tool for batch processing and sending.',
        tech: ['Python', 'SMTP', 'Automation'],
        category: 'automation',
        github: 'https://github.com/ErChetanSoni/send-email',
        icon: 'fas fa-envelope'
    },
    {
        id: 6,
        title: 'FastAPI Request Handler',
        description: 'High-performance API handling with FastAPI framework and async capabilities.',
        tech: ['Python', 'FastAPI', 'REST API'],
        category: 'automation',
        github: 'https://github.com/ErChetanSoni/FastAPI-handling-requests',
        icon: 'fas fa-bolt'
    },
    {
        id: 7,
        title: 'PostgreSQL pgAdmin Docker',
        description: 'Containerized PostgreSQL with pgAdmin for database management.',
        tech: ['Docker', 'PostgreSQL', 'pgAdmin'],
        category: 'infra',
        github: 'https://github.com/ErChetanSoni/PostgresSQL-pgAdmin4-Docker',
        icon: 'fas fa-server'
    },
    {
        id: 8,
        title: 'Metabase MySQL',
        description: 'Business intelligence platform with MySQL backend for data visualization.',
        tech: ['Metabase', 'MySQL', 'Docker'],
        category: 'infra',
        github: 'https://github.com/ErChetanSoni/metabase-mysql',
        icon: 'fas fa-chart-bar'
    }
];

// ============================================
// DOM Elements
// ============================================
const elements = {
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('nav-menu'),
    navToggle: document.getElementById('nav-toggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    themeToggle: document.getElementById('theme-toggle'),
    typingText: document.getElementById('typing-text'),
    projectsGrid: document.getElementById('projects-grid'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    contactForm: document.getElementById('contact-form'),
    backToTop: document.getElementById('back-to-top'),
    statNumbers: document.querySelectorAll('.stat-number'),
    skillLevels: document.querySelectorAll('.skill-level')
};

// ============================================
// Theme Management
// ============================================
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        elements.themeToggle?.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
}

// ============================================
// Typing Animation
// ============================================
class TypingAnimation {
    constructor(element, titles, speed = 100, deleteSpeed = 50, pause = 2000) {
        this.element = element;
        this.titles = titles;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pause = pause;
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;

        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentTitle = this.titles[this.currentIndex];

        if (this.isDeleting) {
            this.currentText = currentTitle.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = currentTitle.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.currentText;

        let timeout = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.currentText === currentTitle) {
            timeout = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.titles.length;
            timeout = 500;
        }

        setTimeout(() => this.type(), timeout);
    }
}

// ============================================
// Navigation
// ============================================
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        // Mobile menu toggle
        elements.navToggle?.addEventListener('click', () => this.toggleMenu());

        // Navigation links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleLinkClick(e, link);
            });
        });

        // Scroll effects
        window.addEventListener('scroll', () => this.handleScroll());

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && elements.navMenu?.classList.contains('active')) {
                this.toggleMenu();
            }
        });
    }

    toggleMenu() {
        elements.navMenu?.classList.toggle('active');
        elements.navToggle?.classList.toggle('active');
    }

    handleLinkClick(e, link) {
        // Close mobile menu
        if (elements.navMenu?.classList.contains('active')) {
            this.toggleMenu();
        }

        // Update active state
        elements.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    handleScroll() {
        const scrolled = window.scrollY > 50;
        elements.navbar?.classList.toggle('scrolled', scrolled);

        // Update active nav link based on section
        this.updateActiveSection();
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                elements.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ============================================
// Projects Manager
// ============================================
class ProjectsManager {
    constructor() {
        this.projects = projectsData;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderProjects();
        this.setupFilters();
    }

    renderProjects(filter = 'all') {
        if (!elements.projectsGrid) return;

        const filtered = filter === 'all'
            ? this.projects
            : this.projects.filter(p => p.category === filter);

        elements.projectsGrid.innerHTML = filtered.map(project => this.getProjectCard(project)).join('');

        // Animate cards
        const cards = elements.projectsGrid.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    getProjectCard(project) {
        return `
            <div class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <i class="${project.icon}"></i>
                    <div class="project-overlay">
                        <a href="${project.github}" target="_blank" title="View on GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    setupFilters() {
        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderProjects(btn.dataset.filter);
            });
        });
    }
}

// ============================================
// Counter Animation
// ============================================
class CounterAnimation {
    constructor() {
        this.animated = false;
        this.init();
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateCounters();
                    this.animated = true;
                }
            });
        }, { threshold: 0.5 });

        elements.statNumbers.forEach(el => observer.observe(el));
    }

    animateCounters() {
        elements.statNumbers.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = CONFIG.counterDuration;
            const start = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);

                counter.textContent = Math.floor(target * easeOutQuart);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = target + '+';
                }
            };

            requestAnimationFrame(animate);
        });
    }
}

// ============================================
// Skill Levels Animation
// ============================================
class SkillLevels {
    constructor() {
        this.init();
    }

    init() {
        elements.skillLevels.forEach(el => {
            const level = el.dataset.level;
            el.style.setProperty('--level', level);
        });
    }
}

// ============================================
// Contact Form
// ============================================
class ContactForm {
    constructor() {
        this.init();
    }

    init() {
        elements.contactForm?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Create mailto link
        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
        const mailtoLink = `mailto:chetansoni9991@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        // Show success message
        this.showNotification('Opening email client...', 'success');
        e.target.reset();
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#22c55e' : '#ef4444'};
            color: white;
            border-radius: 8px;
            font-weight: 500;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============================================
// Back to Top
// ============================================
class BackToTop {
    constructor() {
        this.init();
    }

    init() {
        elements.backToTop?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (elements.backToTop) {
                elements.backToTop.style.opacity = window.scrollY > 500 ? '1' : '0';
                elements.backToTop.style.pointerEvents = window.scrollY > 500 ? 'auto' : 'none';
            }
        });
    }
}

// ============================================
// Intersection Observer for Animations
// ============================================
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        // Observe all cards and sections
        document.querySelectorAll('.about-card, .skill-category, .timeline-item, .info-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
}

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new TypingAnimation(
        elements.typingText,
        CONFIG.titles,
        CONFIG.typingSpeed,
        CONFIG.typingDeleteSpeed,
        CONFIG.typingPause
    );
    new Navigation();
    new ProjectsManager();
    new CounterAnimation();
    new SkillLevels();
    new ContactForm();
    new BackToTop();
    new ScrollAnimations();

    console.log('🚀 Portfolio initialized successfully!');
});

// ============================================
// Service Worker Registration (PWA Ready)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added for PWA support
        console.log('📱 PWA ready for service worker registration');
    });
}
