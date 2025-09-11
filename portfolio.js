document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById("main");
  const menuBtn = document.getElementById('nome');
  const navButtons = document.getElementById('headerBtn_container');

  if (!main || !menuBtn || !navButtons) {
    console.warn('Missing main, menu or nav container.');
    return;
  }

  // toggle menu (apre/chiude)
  const setOpen = (open) => {
    navButtons.classList.toggle('active', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    navButtons.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  menuBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    setOpen(!navButtons.classList.contains('active'));
  });

  // chiude se clicchi fuori (solo mobile)
  document.addEventListener('click', (ev) => {
    const isSmall = window.innerWidth <= 1200;
    if (isSmall && navButtons.classList.contains('active') && !navButtons.contains(ev.target) && ev.target !== menuBtn) {
      setOpen(false);
    }
  });

  // chiudi con Esc
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

      // chiudi menu su mobile
      if (window.innerWidth <= 1200) setOpen(false);
    });
  });

  // === EmailJS per il form contatti ===
  if (window.emailjs) {
    emailjs.init("cYrD4EGM9nyeNwm3l"); // 🔑 Sostituisci con la tua Public Key da EmailJS
  }

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
  
    if (!window.emailjs) {
      console.error("EmailJS non è stato caricato!");
      return;
    }
  
    emailjs.sendForm('service_m7sbyeo', 'template_5gryyku', e.target)
      .then(() => {
        formStatus.textContent = "✅ Messaggio inviato con successo!";
        formStatus.style.color = "#27AE60";
        contactForm.reset();
      })
      .catch((err) => {
        console.error("Errore:", err);
        formStatus.textContent = "❌ Si è verificato un errore. Riprova più tardi.";
        formStatus.style.color = "#E74C3C";
      });
  });
  
});
