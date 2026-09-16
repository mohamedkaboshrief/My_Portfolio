/**
 * Mohamed Khaled Aboshrief — Portfolio Script
 * Vanilla JavaScript implementation for Theme, Navigation, Animations, Modal, and Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Theme Toggle (Dark / Light Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Initialize theme from localStorage or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = root.getAttribute('data-theme');
      const targetTheme = activeTheme === 'light' ? 'dark' : 'light';
      
      root.setAttribute('data-theme', targetTheme);
      try {
        localStorage.setItem('theme', targetTheme);
      } catch (e) {
        console.warn('LocalStorage unavailable for theme storage:', e);
      }

      showToast(`Switched to ${targetTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }

  /* ==========================================================================
     2. Sticky Header Elevation on Scroll
     ========================================================================== */
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ==========================================================================
     3. Mobile Navigation Drawer
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuToggle && navLinksContainer) {
    const toggleMobileMenu = () => {
      const isOpen = mobileMenuToggle.classList.toggle('open');
      navLinksContainer.classList.toggle('mobile-open');
      mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    };

    const closeMobileMenu = () => {
      mobileMenuToggle.classList.remove('open');
      navLinksContainer.classList.remove('mobile-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    };

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu upon clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when clicking outside of nav
    document.addEventListener('click', (event) => {
      if (
        navLinksContainer.classList.contains('mobile-open') &&
        !navLinksContainer.contains(event.target) &&
        !mobileMenuToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });
  }

  /* ==========================================================================
     4. Active Nav Link on Scroll via IntersectionObserver
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserverOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ==========================================================================
     5. Scroll Reveal Animations via IntersectionObserver
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal immediately if IntersectionObserver is unsupported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ==========================================================================
     6. Modal Dialog Handling (Car Price Prediction Project)
     ========================================================================== */
  const carModal = document.getElementById('car-project-modal');
  const openCarModalBtn = document.getElementById('open-car-modal-btn');
  const closeCarModalBtn = document.getElementById('close-car-modal-btn');

  if (carModal && openCarModalBtn) {
    openCarModalBtn.addEventListener('click', () => {
      if (typeof carModal.showModal === 'function') {
        carModal.showModal();
        document.body.style.overflow = 'hidden';
      }
    });

    const closeModal = () => {
      if (typeof carModal.close === 'function') {
        carModal.close();
      }
      document.body.style.overflow = '';
    };

    if (closeCarModalBtn) {
      closeCarModalBtn.addEventListener('click', closeModal);
    }

    carModal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });

    // Light-dismiss fallback for browsers without native closedby support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      carModal.addEventListener('click', (event) => {
        if (event.target !== carModal) return;
        const rect = carModal.getBoundingClientRect();
        const isInside = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isInside) {
          closeModal();
        }
      });
    }
  }

  /* ==========================================================================
     7. Toast Notification Utility
     ========================================================================== */
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /* ==========================================================================
     8. Copy to Clipboard Functionality
     ========================================================================== */
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      let succeeded = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          succeeded = true;
        } catch (err) {
          console.warn('Clipboard API failed, falling back:', err);
        }
      }

      if (!succeeded) {
        // Fallback for older contexts
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          succeeded = document.execCommand('copy');
        } catch (e) {
          succeeded = false;
        }
        document.body.removeChild(textarea);
      }

      if (succeeded) {
        showToast(`Copied to clipboard: ${textToCopy}`);
      } else {
        showToast('Unable to copy automatically');
      }
    });
  });

  /* ==========================================================================
     9. Contact Form Handling — Formspree real email delivery
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput  = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const name    = nameInput    ? nameInput.value.trim()    : '';
      const email   = emailInput   ? emailInput.value.trim()   : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Client-side validation
      if (!name || !email || !message) {
        showToast('Please complete all required fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please provide a valid email address.');
        return;
      }

      // Loading state on submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';
      }

      try {
        const response = await fetch('https://formspree.io/f/xnpnazql', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(contactForm),
        });

        if (response.ok) {
          showToast(`Message sent! I'll get back to you soon, ${name} ✅`);
          contactForm.reset();
        } else {
          const data = await response.json();
          const errMsg = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
          showToast(errMsg);
        }
      } catch (err) {
        showToast('Network error — please check your connection and try again.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
        }
      }
    });
  }

  /* ==========================================================================
     10. Expandable Skills ("View More / View Less")
     ========================================================================== */
  const skillToggleBtns = document.querySelectorAll('.skill-toggle-btn');

  skillToggleBtns.forEach((btn) => {
    const targetId = btn.getAttribute('aria-controls');
    if (!targetId) return;
    const targetContainer = document.getElementById(targetId);
    if (!targetContainer) return;

    const toggleText = btn.querySelector('.skill-toggle-text');
    const togglePill = btn.querySelector('.skill-toggle-pill');

    const expandSkills = () => {
      targetContainer.removeAttribute('hidden');
      targetContainer.classList.add('is-expanded');
      targetContainer.setAttribute('aria-hidden', 'false');
      btn.classList.add('is-expanded');
      btn.setAttribute('aria-expanded', 'true');
      if (toggleText) toggleText.textContent = 'View Less';
      if (togglePill) togglePill.style.display = 'none';
    };

    const collapseSkills = () => {
      targetContainer.classList.remove('is-expanded');
      targetContainer.setAttribute('aria-hidden', 'true');
      btn.classList.remove('is-expanded');
      btn.setAttribute('aria-expanded', 'false');
      if (toggleText) toggleText.textContent = 'View More';
      if (togglePill) togglePill.style.display = '';

      // Set hidden="until-found" after transition completes to preserve smooth animation
      setTimeout(() => {
        if (!targetContainer.classList.contains('is-expanded')) {
          targetContainer.setAttribute('hidden', 'until-found');
        }
      }, 300);
    };

    btn.addEventListener('click', () => {
      const isExpanded = btn.classList.contains('is-expanded');
      if (isExpanded) {
        collapseSkills();
      } else {
        expandSkills();
      }
    });

    // Native "Find in page" (Ctrl+F) compatibility via 'beforematch'
    targetContainer.addEventListener('beforematch', () => {
      expandSkills();
    });
  });

});
