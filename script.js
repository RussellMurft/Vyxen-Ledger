const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');

menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function showToast(message) {
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function downloadNotice() {
  showToast('Enlace de descarga simulado: Conecta aquí tu archivo PDF o Excel.');
}

function submitForm(e) {
  e.preventDefault();
  showToast('¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.');
  e.target.reset();
}