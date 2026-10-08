/* ═══════════════════════════════════════════════
   BIRTHDAY STORY — SCRIPT.JS
   A personal digital love story
═══════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   ██████╗  CONFIG — Edit everything here
   ██╔════╝ Change names, letter, captions, paths
   ██║      This is the only file you need to touch
   ╚█████╗
    ╚════╝
────────────────────────────────────────────── */
const CONFIG = {

  /* ── Names ─────────────────────────────────── */
  girlfriendName: "Ritu",      // ← Her name
  myName: "Dharmesh",               // ← Your name

  /* ── The letter text ────────────────────────
     Use \n for line breaks between paragraphs.
     Each entry in the array becomes a paragraph.
  ───────────────────────────────────────────── */
  letter: [
    "I don't know if I can put everything I feel into words, but I wanted to try. You have this quiet way of making everything feel a little more worth it the ordinary days, the long evenings, the moments that don't seem important until I look back and realize you were in all of them.",
    "I think about the first time I realized how much you meant to me. It wasn't one dramatic moment. It was a hundred small ones. The way you laugh at your own jokes. The way you remember the things I say when I thought no one was listening.",
    "Thank you for being a part of my life for the memories we've created, and for all the little moments that mean more to me than you probably realize.",
    "I hope this year brings you everything you deserve. And no matter where life takes us, I hope we always have moments worth remembering."
  ],

  /* ── Birthday wish ──────────────────────────── */
  birthdayMessage: "Happy Birthday ❤️",

  /* ── Photos ─────────────────────────────────
     src:     path to image (replace with your photos)
     caption: short caption shown below the card
     alt:     accessible image description
  ───────────────────────────────────────────── */
  photos: [
    {
      src: "images/photo1.jpg",
      caption: "One of my favourite moments.",
      alt: "A memory with you",
    },
    {
      src: "images/photo2.jpg",
      caption: "A memory I never want to forget.",
      alt: "A moment I cherish",
    },
    {
      src: "images/photo3.jpg",
      caption: "Somewhere between these moments,\nyou became my favourite person.",
      alt: "Us, together",
    },
    {
      src: "images/photo4.jpg",
      caption: "This one always makes me smile.",
      alt: "A quiet moment",
    },
  ],
};
/* ──────────────────────────────────────────────
   END OF CONFIG — don't need to edit below
────────────────────────────────────────────── */


/* ══════════════════════════════════════════════
   INITIALIZATION
══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  injectConfig();
  setupParticleCanvas();
  setupParallax();
  setupPageTransitions();
  setupLightbox();
  setupScrollReveal();
  setupEnvelope();
  setupChapterNav();
});


/* ══════════════════════════════════════════════
   CONFIG INJECTION
   Populates dynamic content from CONFIG object
══════════════════════════════════════════════ */
function injectConfig() {
  // ── Inject photo data into cards ────────────
  const cards = document.querySelectorAll(".photo-card");
  cards.forEach((card, i) => {
    const data = CONFIG.photos[i];
    if (!data) return;

    const img = card.querySelector("img");
    const caption = card.querySelector(".photo-caption");

    if (img) {
      img.src = data.src;
      img.alt = data.alt;
    }
    if (caption) {
      // Support \n in captions → <br>
      caption.innerHTML = data.caption.replace(/\n/g, "<br>");
    }
  });

  // ── Build the letter ──────────────────────────
  buildLetter();
}

function buildLetter() {
  const container = document.getElementById("letterContent");
  if (!container) return;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let html = `
    <p class="letter-date">${dateStr}</p>
    <p class="letter-salutation">Dear ${CONFIG.girlfriendName},</p>
    <p class="letter-salutation" style="font-size:1.1rem; margin-bottom:2rem;">${CONFIG.birthdayMessage}</p>
    <div class="letter-body">
  `;

  CONFIG.letter.forEach((para) => {
    html += `<p>${para}</p>`;
  });

  html += `
    </div>
    <div class="letter-sign">
      <span>With love,</span>
      <span class="sig-name">${CONFIG.myName}</span>
    </div>
  `;

  container.innerHTML = html;
}


/* ══════════════════════════════════════════════
   PARTICLE CANVAS
   Floating light motes on Page 1
══════════════════════════════════════════════ */
function setupParticleCanvas() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animFrame;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.alpha = 0;
      this.targetAlpha = Math.random() * 0.5 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      // Colour: cream or gold
      this.color = Math.random() > 0.5
        ? `rgba(245, 240, 232,`
        : `rgba(201, 169, 110,`;
    }

    update() {
      this.life++;
      this.x += this.speedX;
      this.y += this.speedY;

      // Fade in / out
      const progress = this.life / this.maxLife;
      if (progress < 0.2) {
        this.alpha = (progress / 0.2) * this.targetAlpha;
      } else if (progress > 0.8) {
        this.alpha = ((1 - progress) / 0.2) * this.targetAlpha;
      } else {
        this.alpha = this.targetAlpha;
      }

      if (this.life >= this.maxLife) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `${this.color}0.8)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 70 }, () => {
      const p = new Particle();
      // Scatter random start life so they don't all appear at once
      p.life = Math.floor(Math.random() * p.maxLife);
      return p;
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    animFrame = requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener("resize", () => {
    resize();
    particles.forEach((p) => p.reset());
  });
}


/* ══════════════════════════════════════════════
   PARALLAX — Mouse movement on Page 1
══════════════════════════════════════════════ */
function setupParallax() {
  const wrapper = document.getElementById("parallaxWrapper");
  const blob1 = document.querySelector(".blob-1");
  const blob2 = document.querySelector(".blob-2");
  if (!wrapper) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetX = (e.clientX - cx) / cx;
    targetY = (e.clientY - cy) / cy;
  });

  function tick() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    if (wrapper) {
      wrapper.style.transform = `translate(${currentX * 12}px, ${currentY * 8}px)`;
    }
    if (blob1) {
      blob1.style.transform = `translate(${currentX * -20}px, ${currentY * -15}px)`;
    }
    if (blob2) {
      blob2.style.transform = `translate(${currentX * 15}px, ${currentY * 10}px)`;
    }

    requestAnimationFrame(tick);
  }

  tick();
}


/* ══════════════════════════════════════════════
   PAGE TRANSITIONS
   Smooth cinematic wipe between chapters
══════════════════════════════════════════════ */
let currentPage = 1;

function setupPageTransitions() {
  // Create overlay element
  const overlay = document.createElement("div");
  overlay.className = "page-transition-overlay";
  overlay.id = "pageOverlay";
  document.body.appendChild(overlay);

  // Button bindings
  document.getElementById("startBtn")?.addEventListener("click", () => navigateTo(2));
  document.getElementById("toLetterBtn")?.addEventListener("click", () => navigateTo(3));
}

function navigateTo(targetPage) {
  if (targetPage === currentPage) return;

  const overlay = document.getElementById("pageOverlay");

  // Phase 1: Cover screen
  overlay.classList.add("covering");

  setTimeout(() => {
    // Hide current page, show target
    document.getElementById(`page${currentPage}`)?.classList.add("hidden");

    const nextPage = document.getElementById(`page${targetPage}`);
    nextPage?.classList.remove("hidden");
    nextPage?.classList.add("entering");

    // Scroll to top
    window.scrollTo(0, 0);

    // Update chapter nav
    currentPage = targetPage;
    updateChapterNav(targetPage);

    // Trigger scroll reveal for new page
    setTimeout(triggerReveal, 200);

    // Phase 2: Uncover
    setTimeout(() => {
      overlay.classList.remove("covering");
      // Clean up entering class after animation
      setTimeout(() => nextPage?.classList.remove("entering"), 1200);
    }, 100);
  }, 600);
}


/* ══════════════════════════════════════════════
   CHAPTER NAV DOTS
══════════════════════════════════════════════ */
function setupChapterNav() {
  document.querySelectorAll(".chapter-dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = parseInt(dot.dataset.page, 10);
      navigateTo(target);
    });
  });
}

function updateChapterNav(pageNum) {
  document.querySelectorAll(".chapter-dot").forEach((dot) => {
    dot.classList.toggle("active", parseInt(dot.dataset.page, 10) === pageNum);
  });
}


/* ══════════════════════════════════════════════
   LIGHTBOX
   Full-screen photo viewer
══════════════════════════════════════════════ */
function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  const lbClose = document.getElementById("lightboxClose");
  const lbBackdrop = document.getElementById("lightboxBackdrop");

  // Open on photo card click
  document.querySelectorAll(".photo-card").forEach((card, i) => {
    card.addEventListener("click", () => {
      const data = CONFIG.photos[i];
      const img = card.querySelector("img");

      lbImg.src = img?.src || (data?.src ?? "");
      lbImg.alt = data?.alt ?? "";
      lbCaption.innerHTML = data?.caption.replace(/\n/g, "<br>") ?? "";

      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  // Close handlers
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => {
      lbImg.src = "";
    }, 500);
  }

  lbClose?.addEventListener("click", closeLightbox);
  lbBackdrop?.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}


/* ══════════════════════════════════════════════
   SCROLL REVEAL
   Animate elements when they enter viewport
══════════════════════════════════════════════ */
let revealObserver;

function setupScrollReveal() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay based on sibling index
          const delay = Array.from(entry.target.parentElement?.children ?? [])
            .indexOf(entry.target) * 100;

          setTimeout(() => {
            entry.target.classList.add("revealed");
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );
}

function triggerReveal() {
  // Observe all .reveal-item elements on the currently visible page
  document.querySelectorAll(`#page${currentPage} .reveal-item`).forEach((el) => {
    revealObserver?.observe(el);
  });
}


/* ══════════════════════════════════════════════
   ENVELOPE ANIMATION
   Page 3 envelope open + letter reveal
══════════════════════════════════════════════ */
function setupEnvelope() {
  const openBtn = document.getElementById("openLetterBtn");
  const envelope = document.getElementById("envelope");
  const envelopeWrap = document.getElementById("envelopeWrapper");
  const letterWrapper = document.getElementById("letterWrapper");

  if (!openBtn || !envelope || !letterWrapper) return;

  openBtn.addEventListener("click", openLetter);
  envelope.addEventListener("click", openLetter);

  function openLetter() {
    if (envelope.classList.contains("open")) return; // prevent double trigger

    // Step 1: Open envelope flap
    envelope.classList.add("open");

    // Step 2: After flap lifts, hide envelope + show letter
    setTimeout(() => {
      envelopeWrap.style.transition = "opacity 0.5s ease";
      envelopeWrap.style.opacity = "0";

      setTimeout(() => {
        envelopeWrap.style.display = "none";
        letterWrapper.classList.remove("hidden");

        // Animate warm background shift
        document.getElementById("page3")?.classList.add("letter-open");

        // Animate letter lines with stagger
        animateLetterLines();
      }, 500);
    }, 900);
  }
}

function animateLetterLines() {
  // Wrap each paragraph in the letter body with a stagger animation
  const paras = document.querySelectorAll("#letterContent p, #letterContent .letter-sign span");
  paras.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.transition = `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`;

    // Trigger the transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  });
}


/* ══════════════════════════════════════════════
   OPTIONAL: Warm background shift on letter open
   (CSS class hook for styling)
══════════════════════════════════════════════ */
// Add to style.css dynamically so page 3 warms up
const warmStyle = document.createElement("style");
warmStyle.textContent = `
  #page3.letter-open .blob-6 {
    background: radial-gradient(circle, rgba(201, 146, 124, 0.3), transparent 70%);
    transition: background 2s ease;
  }
  #page3.letter-open .blob-7 {
    background: radial-gradient(circle, rgba(201, 169, 110, 0.25), transparent 70%);
    transition: background 2s ease;
  }
`;
document.head.appendChild(warmStyle);


/* ══════════════════════════════════════════════
   PHOTO PLACEHOLDER FALLBACK
   If images don't load, show elegant gradient placeholders
══════════════════════════════════════════════ */
document.querySelectorAll(".photo-frame img").forEach((img) => {
  img.addEventListener("error", function () {
    this.style.display = "none";
    const placeholder = document.createElement("div");
    placeholder.style.cssText = `
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1e1a18 0%, #2d2420 40%, #1a1614 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 0.75rem;
    `;
    placeholder.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.4)" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
      <span style="font-family:'Inter',sans-serif;font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(201,169,110,0.4);">Add your photo</span>
    `;
    this.parentElement.appendChild(placeholder);
  });
});
