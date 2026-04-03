// src/scripts/animations.js

const SONG_DURATION = 275; // seconds
let isAutoScrolling = false;
let audioEl = null;
let animFrameId = null;

// Timeline mapping: audio time (seconds) -> target scroll position normalized (0 to 1)
const SCROLL_MAP = [
  { time: 0,   pos: 0.00 },  // Hero
  { time: 20,  pos: 0.08 },  // Chapter 1 
  { time: 55,  pos: 0.22 },  // Chapter 2
  { time: 80,  pos: 0.35 },  // Chapter 3
  { time: 120, pos: 0.48 },  // Chapter 4
  { time: 155, pos: 0.61 },  // Chapter 5
  { time: 190, pos: 0.74 },  // Chapter 6
  { time: 225, pos: 0.88 },  // Chapter 7
  { time: 255, pos: 1.00 },  // Finale & Closing
  { time: 275, pos: 1.00 },  // End
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getTargetScrollPos(currentTime) {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  for (let i = 0; i < SCROLL_MAP.length - 1; i++) {
    const from = SCROLL_MAP[i];
    const to = SCROLL_MAP[i + 1];

    if (currentTime >= from.time && currentTime <= to.time) {
      const progress = (currentTime - from.time) / (to.time - from.time);
      const normalizedPos = lerp(from.pos, to.pos, progress);
      return normalizedPos * maxScroll;
    }
  }

  return SCROLL_MAP[SCROLL_MAP.length - 1].pos * maxScroll;
}

function autoScrollLoop() {
  if (!isAutoScrolling || !audioEl) return;

  const currentTime = audioEl.currentTime;
  const targetY = getTargetScrollPos(currentTime);
  const currentY = window.scrollY;

  // Smoothing
  const newY = lerp(currentY, targetY, 0.03);
  window.scrollTo(0, newY);

  animFrameId = requestAnimationFrame(autoScrollLoop);
}

function startAutoScroll(audio) {
  audioEl = audio;
  isAutoScrolling = true;
  animFrameId = requestAnimationFrame(autoScrollLoop);
}

function stopAutoScroll() {
  isAutoScrolling = false;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

let resumeTimeout = null;
function handleUserScroll() {
  if (!isAutoScrolling) return; // if already stopped naturally or manually
  
  stopAutoScroll();

  clearTimeout(resumeTimeout);
  resumeTimeout = setTimeout(() => {
    if (audioEl && !audioEl.paused && window.scrollY < (document.documentElement.scrollHeight - window.innerHeight - 50)) {
       // Only resume if still playing and not at very bottom
      startAutoScroll(audioEl);
    }
  }, 3000);
}

window.addEventListener('wheel', handleUserScroll, { passive: true });
window.addEventListener('touchmove', handleUserScroll, { passive: true });

function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Background Theme Observer
  const sections = document.querySelectorAll('.js-section');
  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
        const bg = entry.target.dataset.bg;
        if(bg) {
          document.body.dataset.currentBg = bg;
          document.body.style.setProperty(
            '--current-bg',
            bg === 'cream' ? 'var(--color-cream)' : 'var(--color-navy)'
          );
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => bgObserver.observe(s));

  // Initialize Fade Ups
  document.querySelectorAll('.js-section').forEach((section) => {
    const fadeUps = section.querySelectorAll('.js-fade-up');
    
    gsap.fromTo(fadeUps, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
  
  // Polaroid grid animations
  document.querySelectorAll('.polaroid-grid').forEach((grid) => {
     gsap.fromTo(grid.querySelectorAll('.polaroid-wrapper'),
      { y: 50, opacity: 0, rotation: () => Math.random() * 20 - 10 },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

// Global start journey
window.startJourney = function() {
  const audio = document.getElementById('bgMusic');
  if (audio) {
    startAutoScroll(audio);
  }
  
  // Wait a tiny bit for splash to fade out before triggering initial animations
  setTimeout(initAnimations, 500);
}

// Prepare if ready
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup can go here
});
