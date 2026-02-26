const navbar = document.querySelector('.navbar');
const progress = document.querySelector('.scroll-progress');
const cursor = document.querySelector('.cursor-dot');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 8);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? (y / scrollable) * 100 : 0;
  progress.style.width = `${ratio}%`;
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!reduceMotion && desktopPointer) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.style.opacity = '1';
  });

  const animateCursor = () => {
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;
    cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
}

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  if (expanded) {
    mobileMenu.setAttribute('hidden', '');
  } else {
    mobileMenu.removeAttribute('hidden');
  }
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('hidden', '');
  });
});

const sections = document.querySelectorAll('.reveal-section');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.id === 'skills') {
          revealSkills();
        }
      }
    });
  },
  { threshold: 0.25 }
);

sections.forEach((section) => observer.observe(section));

function revealSkills() {
  const tags = document.querySelectorAll('.skill-tags span');
  tags.forEach((tag, index) => {
    setTimeout(() => {
      tag.classList.add('visible');
    }, index * 120);
  });
}

const hero = document.querySelector('.hero');
if (!reduceMotion && window.innerWidth > 900) {
  window.addEventListener('scroll', () => {
    const offset = Math.min(window.scrollY * 0.2, 90);
    hero.style.backgroundPosition = `center ${offset}px`;
  });
}
