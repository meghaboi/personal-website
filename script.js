const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js-ready");

const siteHeader = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const mobileOverlay = document.querySelector(".mobile-overlay");
const mobileSidebar = document.querySelector(".mobile-sidebar");
const sidebarClose = document.querySelector(".sidebar-close");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");
const revealTargets = document.querySelectorAll(".reveal-on-scroll");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const formSuccess = document.getElementById("form-success");

function handleScrollUI() {
  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", window.scrollY > 80);
  }

  if (progressBar) {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }
}

function openMobileMenu() {
  if (!menuToggle || !mobileOverlay || !mobileSidebar) {
    return;
  }

  mobileOverlay.classList.add("is-open");
  mobileSidebar.classList.add("is-open");
  mobileSidebar.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  if (!menuToggle || !mobileOverlay || !mobileSidebar) {
    return;
  }

  mobileOverlay.classList.remove("is-open");
  mobileSidebar.classList.remove("is-open");
  mobileSidebar.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (menuToggle && mobileOverlay && mobileSidebar && sidebarClose) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMobileMenu();
      return;
    }

    openMobileMenu();
  });

  sidebarClose.addEventListener("click", closeMobileMenu);
  mobileOverlay.addEventListener("click", closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

if (reduceMotion) {
  revealTargets.forEach((target) => {
    target.classList.add("is-visible");
  });
} else if (revealTargets.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15
    }
  );

  revealTargets.forEach((target) => {
    revealObserver.observe(target);
  });
}

if (contactForm && formMessage && formSuccess) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formMessage.textContent = "Sending...";

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        contactForm.hidden = true;
        formSuccess.hidden = false;
        formMessage.textContent = "";
        return;
      }

      formMessage.textContent = result.message || "Message could not be sent right now.";
    } catch (error) {
      formMessage.textContent = "Message could not be sent right now.";
    }
  });
}

window.addEventListener("scroll", handleScrollUI, { passive: true });
window.addEventListener("resize", handleScrollUI);
handleScrollUI();
