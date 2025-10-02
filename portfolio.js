document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById("main");
  const menuBtn = document.getElementById('nome');
  const navButtons = document.getElementById('headerBtn_container');

  if (!main || !menuBtn || !navButtons) {
    console.warn('Missing main, menu or nav container.');
    return;
  }

  // toggle menu
  const setOpen = (open) => {
    navButtons.classList.toggle('active', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    navButtons.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  menuBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    setOpen(!navButtons.classList.contains('active'));
  });

  document.addEventListener('click', (ev) => {
    const isSmall = window.innerWidth <= 1200;
    if (isSmall && navButtons.classList.contains('active') && !navButtons.contains(ev.target) && ev.target !== menuBtn) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') setOpen(false);
  });

  // gestione bottoni
  navButtons.querySelectorAll('.headerBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('value');
      if (value && main) main.className = 'main main_' + value;

      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }

      if (window.innerWidth <= 1200) setOpen(false);
    });
  });

  // gestione bottoni "Inizia ora" nei prezzi
  document.querySelectorAll('.pricing_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('value');
      if (value && main) main.className = 'main main_' + value;

      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }

      if (window.innerWidth <= 1200) setOpen(false);
    });
  });

  // === EmailJS per il form contatti ===
  if (window.emailjs) {
    emailjs.init("cYrD4EGM9nyeNwm3l"); // 🔑 Sostituisci con la tua Public Key
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!window.emailjs) {
        console.error("EmailJS non è stato caricato!");
        return;
      }

      emailjs.sendForm('service_m7sbyeo', 'template_5gryyku', e.target)
        .then(() => {
          showToast("✅ Messaggio inviato con successo!", "success");
          contactForm.reset();
        })
        .catch((err) => {
          console.error("Errore:", err);
          showToast("❌ Si è verificato un errore. Riprova più tardi.", "error");
        });
    });
  }

  // === Toast Notification ===
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
