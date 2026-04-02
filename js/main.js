/* ============================================================
   MAIN.JS — Aaron Muti Portfolio
   Vanilla JS — no jQuery, no external dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initBlog();
  initContactForm();
  hideLoader();
});

/* ── Page Loader ────────────────────────────────────────── */
function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 400);
}

/* ── Dark / Light Theme ─────────────────────────────────── */
function initTheme() {
  const stored = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', stored);

  function handleToggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', handleToggle);
  });
}

/* ── Navbar ─────────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');
  const sections = document.querySelectorAll('section[id]');

  // Scroll: add .scrolled class + active link highlight
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // Close mobile menu when a link is clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (toggle) toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links (offset for fixed nav)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 16 : 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
}

/* ── Scroll Reveal ──────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* ── Skill Bar Animations ───────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-item__bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/* ── Counter Animation ──────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1800;
        const start = performance.now();

        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
}

/* ── Blog Renderer ──────────────────────────────────────── */
function initBlog() {
  const container = document.getElementById('blog-grid');
  if (!container || typeof BLOG_POSTS === 'undefined') return;

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  container.innerHTML = BLOG_POSTS.map(post => `
    <article class="blog-card reveal">
      <a href="${post.url}" class="blog-card__img-wrap"${post.url !== '#' ? ' target="_blank" rel="noopener noreferrer"' : ''}>
        <img
          class="blog-card__img"
          src="${post.image}"
          alt="${post.title}"
          loading="lazy"
          decoding="async"
        >
      </a>
      <div class="blog-card__body">
        <div class="blog-card__meta">
          <span class="blog-card__category">${post.category}</span>
          <time class="blog-card__date" datetime="${post.date}">${formatDate(post.date)}</time>
        </div>
        <h3 class="blog-card__title">${post.title}</h3>
        <p class="blog-card__excerpt">${post.excerpt}</p>
        <a href="${post.url}" class="btn btn-ghost">
          Read More <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </article>
  `).join('');

  // Observe newly inserted cards
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  container.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ── Contact Form ───────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Sending...';
    if (status) {
      status.className = 'form-status';
      status.textContent = '';
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        if (status) {
          status.textContent = 'Message sent! I will reply within 24 hours.';
          status.className = 'form-status success';
        }
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (status) {
        status.textContent = 'Something went wrong. Please email mutiaaron2@gmail.com directly.';
        status.className = 'form-status error';
      }
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}
