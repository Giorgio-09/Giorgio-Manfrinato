document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById("main");
  const menuBtn = document.getElementById('nome');
  const navButtons = document.getElementById('headerBtn_container');

  if (!main || !menuBtn || !navButtons) {
    console.warn('Missing main, menu or nav container.');
    return;
  }

  // === utils: smart scroll con offset header
  const smartScrollTo = (el) => {
    if (!el) return;
    const header = document.querySelector('.header');
    const headerH = header ? header.offsetHeight : 0;
    const rect = el.getBoundingClientRect();
    const y = window.scrollY + rect.top - (headerH - 1);
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

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

  // gestione bottoni del menu
  navButtons.querySelectorAll('.headerBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('value');
      if (value && main) main.className = 'main main_' + value;

      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) smartScrollTo(el);
      }

      if (window.innerWidth <= 1200) setOpen(false);
    });
  });

  // CTA interne (es. in home, pricing, footer)
  document.querySelectorAll('[data-target]').forEach(btn => {
    // evitare doppie bind sui bottoni del menu (già gestiti sopra)
    if (navButtons.contains(btn)) return;
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('value');
      if (value && main) main.className = 'main main_' + value;

      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) smartScrollTo(el);
      }

      if (window.innerWidth <= 1200) setOpen(false);
    });
  });

  // gestione bottoni "Inizia ora" nei prezzi (già hanno data-target="slide_contact")
  document.querySelectorAll('.pricing_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) smartScrollTo(el);
      }
      if (window.innerWidth <= 1200) setOpen(false);
    });
  });

  // Chiudi pannello se si torna a desktop
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 1201px)').matches) setOpen(false);
  });

  // === EmailJS per il form contatti ===
  if (window.emailjs) {
    // 🔑 Sostituisci con la tua Public Key
    emailjs.init("cYrD4EGM9nyeNwm3l");
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!window.emailjs) {
        console.error("EmailJS non è stato caricato!");
        showToast("❌ Invio disabilitato: configura EmailJS.", "error");
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
