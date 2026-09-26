// Mobile nav
const menuToggle = document.querySelector(".menu-toggle");
const mobileSidebar = document.querySelector(".mobile-sidebar");
const mobileOverlay = document.querySelector(".mobile-overlay");
const sidebarClose = document.querySelector(".sidebar-close");

function openMenu() {
  mobileSidebar?.classList.add("open");
  mobileOverlay?.classList.add("open");
  mobileSidebar?.setAttribute("aria-hidden", "false");
  menuToggle?.setAttribute("aria-expanded", "true");
}
function closeMenu() {
  mobileSidebar?.classList.remove("open");
  mobileOverlay?.classList.remove("open");
  mobileSidebar?.setAttribute("aria-hidden", "true");
  menuToggle?.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", openMenu);
sidebarClose?.addEventListener("click", closeMenu);
mobileOverlay?.addEventListener("click", closeMenu);
document.querySelectorAll(".mobile-nav-links a").forEach((a) => a.addEventListener("click", closeMenu));

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
);
document.querySelectorAll(".reveal-on-scroll").forEach((el) => io.observe(el));

// Contact form
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const formSuccess = document.getElementById("form-success");
const submitBtn = contactForm?.querySelector(".submit-btn");

function setFormMessage(text) {
  if (formMessage) formMessage.textContent = text;
}

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!contactForm.reportValidity()) return;

  const originalLabel = submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "SENDING...";
  }
  setFormMessage("");

  try {
    const payload = Object.fromEntries(new FormData(contactForm));
    const res = await fetch(contactForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success) {
      contactForm.reset();
      contactForm.hidden = true;
      if (formSuccess) formSuccess.hidden = false;
    } else {
      setFormMessage(json.message || `Could not send (error ${res.status}). Please try again.`);
    }
  } catch {
    setFormMessage("Network error. Check your connection and try again.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  }
});
