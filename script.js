/* ==========================================
   VYXEN LEDGER — SCRIPTS PREMIUM
   Interactividad, animaciones y funcionalidades
   ========================================== */

(function () {
  'use strict';

  /* ==============================
     1. PARTÍCULAS DE FONDO (CANVAS)
     ============================== */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECT_DIST = 140;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.15;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });

      // Líneas de conexión
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.06 * (1 - dist / CONNECT_DIST)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==============================
     2. MENÚ MÓVIL TOGGLE
     ============================== */
  const menuBtn = document.getElementById('menuBtn');
  const navMenu = document.getElementById('navMenu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Cerrar menú al hacer clic en un enlace
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuBtn.textContent = '☰';
      });
    });
  }

  /* ==============================
     3. HEADER SCROLL SHRINK
     ============================== */
  const header = document.getElementById('mainHeader');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = current;
  });

  /* ==============================
     4. REVEAL ON SCROLL (IntersectionObserver)
     ============================== */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==============================
     5. COUNTER ANIMATION (STATS)
     ============================== */
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '+';
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current) + suffix;
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ==============================
     6. TOAST NOTIFICATIONS
     ============================== */
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3800);
  }

  // Exponer globalmente
  window.showToast = showToast;

  /* ==============================
     7. DESCARGA DE RECURSOS
     ============================== */
  window.downloadNotice = function () {
    showToast('📥 ¡Descarga iniciada con éxito! Revisa tus archivos.');
  };

  /* ==============================
     8. BUSCADOR DE RECURSOS
     ============================== */
  window.filterResources = function () {
    const query = (document.getElementById('resource-search') && document.getElementById('resource-search').value.toLowerCase()) || '';
    const cards = document.querySelectorAll('.resource-grid .resource-card');
    cards.forEach(card => {
      const titleEl = card.querySelector('h3');
      const descEl = card.querySelector('p');
      const title = titleEl ? titleEl.textContent.toLowerCase() : '';
      const desc = descEl ? descEl.textContent.toLowerCase() : '';
      card.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
    });
  };

  /* ==============================
     9. CALCULADORA FINANCIERA
     ============================== */
  window.calcularUtilidad = function () {
    const ventas = parseFloat((document.getElementById('calc-ventas') && document.getElementById('calc-ventas').value)) || 0;
    const costos = parseFloat((document.getElementById('calc-costos') && document.getElementById('calc-costos').value)) || 0;
    const utilidad = ventas - costos;
    const resultadoEl = document.getElementById('calc-resultado');
    if (resultadoEl) {
      resultadoEl.textContent = `$${utilidad.toFixed(2)}`;
      resultadoEl.style.color = utilidad < 0 ? '#e74c3c' : 'var(--accent-gold)';
    }
  };

  /* ==============================
     10. VERIFICACIÓN DE HORARIOS
     ============================== */
  function verificarHorariosSucursales() {
    const ahora = new Date();
    const diaSemana = ahora.getDay();
    const horaActual = ahora.getHours() + ahora.getMinutes() / 60;
    const esDiaLaboral = diaSemana >= 1 && diaSemana <= 5;
    const esHoraLaboral = horaActual >= 8 && horaActual < 17;

    const statusSS = document.getElementById('status-ss');
    const statusST = document.getElementById('status-st');

    if (esDiaLaboral && esHoraLaboral) {
      if (statusSS) { statusSS.textContent = '● Abierto ahora'; statusSS.className = 'branch-status status-open'; }
      if (statusST) { statusST.textContent = '● Abierto ahora'; statusST.className = 'branch-status status-open'; }
    } else {
      if (statusSS) { statusSS.textContent = '○ Cerrado en este momento'; statusSS.className = 'branch-status status-closed'; }
      if (statusST) { statusST.textContent = '○ Cerrado en este momento'; statusST.className = 'branch-status status-closed'; }
    }
  }
  verificarHorariosSucursales();

  /* ==============================
     11. RESEÑAS DINÁMICAS
     ============================== */
  const defaultReviews = [
    { name: 'Marcela G.', stars: '⭐⭐⭐⭐⭐', text: 'La mentoría contable cambió por completo la salud financiera de mi negocio. ¡Super recomendado!' },
    { name: 'Carlos M.', stars: '⭐⭐⭐⭐⭐', text: 'Excelente servicio de formalización. Me guiaron paso a paso sin complicaciones legales.' },
    { name: 'Sofía R.', stars: '⭐⭐⭐⭐', text: 'Las plantillas de flujo de caja y la asesoría de costos me ayudaron a fijar precios reales.' },
    { name: 'Andrés L.', stars: '⭐⭐⭐⭐⭐', text: 'Mi inventario por fin está bajo control. La metodología que enseñan es clara y aplicable.' },
    { name: 'Patricia V.', stars: '⭐⭐⭐⭐⭐', text: 'Me sentí acompañada en cada paso de la formalización. Profesionalismo de principio a fin.' },
    { name: 'Diego H.', stars: '⭐⭐⭐⭐', text: 'La calculadora de precios me abrió los ojos. Ahora sí sé cuánto gano por cada producto.' }
  ];

  function renderReviews() {
    const sliderBox = document.getElementById('slider-box');
    if (!sliderBox) return;
    sliderBox.innerHTML = '';
    defaultReviews.forEach((rev, i) => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.style.animationDelay = `${i * 0.08}s`;

      const stars = document.createElement('div');
      stars.style.color = 'var(--accent-gold)';
      stars.style.marginBottom = '10px';
      stars.style.fontSize = '14px';
      stars.textContent = rev.stars;

      const p = document.createElement('p');
      p.style.cssText = 'font-size:14px;color:var(--text-muted);margin-bottom:18px;line-height:1.7';
      p.textContent = `"${rev.text}"`;

      const footer = document.createElement('div');
      footer.style.cssText = 'display:flex;align-items:center;gap:10px';

      const avatar = document.createElement('div');
      avatar.style.cssText = 'width:36px;height:36px;border-radius:50%;background:var(--accent-gold-soft);border:1px solid var(--border-color);display:flex;align-items:center;justify-content:center;color:var(--accent-gold);font-weight:700';
      const initials = rev.name.split(' ').map(n => n[0]).slice(0,2).join('').replace(/[^A-ZÁÉÍÓÚÑ]/ig, '').toUpperCase();
      avatar.textContent = initials;

      const b = document.createElement('b');
      b.style.cssText = 'font-size: 14px; color: var(--text-main);';
      b.textContent = rev.name;

      footer.appendChild(avatar);
      footer.appendChild(b);

      card.appendChild(stars);
      card.appendChild(p);
      card.appendChild(footer);
      sliderBox.appendChild(card);
    });
  }
  renderReviews();

  window.handleReviewSubmit = function (e) {
    e.preventDefault();
    const nameEl = document.getElementById('rev-name');
    const starsEl = document.getElementById('rev-stars');
    const textEl = document.getElementById('rev-text');
    if (!nameEl || !starsEl || !textEl) return;
    const name = nameEl.value.trim() || 'Anónimo';
    const starsCount = parseInt(starsEl.value) || 5;
    const text = textEl.value.trim() || '';
    const starsStr = '⭐'.repeat(starsCount);
    defaultReviews.unshift({ name, stars: starsStr, text });
    // Keep reviews list reasonably sized
    if (defaultReviews.length > 20) defaultReviews.pop();
    renderReviews();
    showToast('✨ ¡Gracias por compartir tu opinión!');
    const form = document.getElementById('new-review-form');
    if (form) form.reset();
  };

  /* ==============================
     12. MODAL DE CITAS
     ============================== */
  window.toggleAppointmentModal = function (open) {
    const modal = document.getElementById('appointment-modal');
    if (!modal) return;
    if (open) {
      modal.style.display = 'flex';
      requestAnimationFrame(() => modal.classList.add('active'));
    } else {
      modal.classList.remove('active');
      setTimeout(() => { modal.style.display = 'none'; }, 350);
    }
  };

  // Cerrar modal con Escape o clic fuera
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleAppointmentModal(false);
  });

  const modalOverlay = document.getElementById('appointment-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) toggleAppointmentModal(false);
    });
  }

  window.handleAppointmentSubmit = function (e) {
    e.preventDefault();
    toggleAppointmentModal(false);
    showToast('📅 ¡Cita agendada con éxito! Te contactaremos pronto.');
  };

  /* ==============================
     13. FORMULARIO DE CONTACTO
     ============================== */
  window.submitForm = function (e) {
    e.preventDefault();
    showToast('🚀 ¡Solicitud enviada con éxito! Nos pondremos en contacto contigo.');
    if (e && e.target) e.target.reset();
  };

  /* ==============================
     14. TILT EFFECT EN HERO CARD
     ============================== */
  const heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      heroCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  /* ==============================
     15. SMOOTH SCROLL CON OFFSET
     ============================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Allow external links and telephone/wa links
      const href = this.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      e.preventDefault();
      const targetId = href;
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ==============================
     16. PARALLAX SUAVE EN HERO
     ============================== */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 800) {
        const heroCopy = heroSection.querySelector('.hero-copy');
        const heroCardEl = heroSection.querySelector('.hero-card');
        if (heroCopy) heroCopy.style.transform = `translateY(${scrolled * 0.12}px)`;
        if (heroCardEl) {
          // Do not override tilt transform if active — apply a translate only
          const existing = heroCardEl.style.transform || '';
          heroCardEl.style.transform = `${existing} translateY(${scrolled * 0.06}px)`;
        }
      }
    });
  }

  /* ==============================
     17. NAV ACTIVE SECTION HIGHLIGHT
     ============================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navMenu a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('nav-cta');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav-cta');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  /* ==============================
     18. MAGNETIC HOVER EN BOTONES
     ============================== */
  document.querySelectorAll('.btn.primary, .btn.outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ==============================
     19. LOADING ANIMATION ON STARTUP
     ============================== */
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.6s ease';
      document.body.style.opacity = '1';
    });
  });

  /* ==============================
     20. AUTO-UPDATE BRANCH STATUS
     ============================== */
  setInterval(verificarHorariosSucursales, 60000); // Cada minuto

})();
