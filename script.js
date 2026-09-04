'use strict';

/* ════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursor && cursorRing) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function followRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(followRing);
  })();

  document.querySelectorAll('a, button, input, textarea, .proj-card, .stag, .info-card, .c-row').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('grow');    cursorRing.classList.add('grow'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('grow'); cursorRing.classList.remove('grow'); });
  });
}

/* ════════════════════════════════════════════════
   NAVBAR — scroll state
═══════════════════════════════════════════════ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
  updateDots();
  toggleScrollTopBtn();
}, { passive: true });

/* ════════════════════════════════════════════════
   HAMBURGER / MOBILE MENU
═══════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  // Remove any inline style that might have been set in HTML
  // (mobile-menu is hidden via CSS by default, JS controls it)
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.classList.toggle('locked', isOpen);
    // remove inline styles so CSS class takes over
    mobileMenu.style.opacity    = '';
    mobileMenu.style.visibility = '';
    mobileMenu.style.pointerEvents = '';
  });

  mobileMenu.querySelectorAll('.mob-link').forEach(link =>
    link.addEventListener('click', closeMobileMenu)
  );
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

function closeMobileMenu() {
  if (!mobileMenu || !hamburger) return;
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.classList.remove('locked');
}

/* ════════════════════════════════════════════════
   ACTIVE NAV + SECTION DOTS
═══════════════════════════════════════════════ */
function getCurrentSection() {
  let current = '';
  document.querySelectorAll('.section').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  return current;
}

function updateActiveNav() {
  const cur = getCurrentSection();
  document.querySelectorAll('.nav-link').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur)
  );
  document.querySelectorAll('.mob-link').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur)
  );
}

function updateDots() {
  const cur = getCurrentSection();
  document.querySelectorAll('.dot').forEach(d =>
    d.classList.toggle('active', d.dataset.sec === cur)
  );
}

updateActiveNav();
updateDots();

/* ════════════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeMobileMenu();
    const navH = nav ? nav.offsetHeight : 68;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════════════
   SCROLL-TO-TOP BUTTON
═══════════════════════════════════════════════ */
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTopBtn() {
  if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 500);
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ════════════════════════════════════════════════
   FLOATING PARTICLES
═══════════════════════════════════════════════ */
const particlesWrap = document.getElementById('particles');
if (particlesWrap) {
  const COLORS = ['#e63946','#ff6b6b','#ffffff','#ff4d6d'];
  for (let i = 0; i < 50; i++) {
    const p    = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 4 + 1;
    p.style.cssText = [
      `left:${Math.random()*100}%`,
      `width:${size}px`,
      `height:${size}px`,
      `background:${COLORS[Math.floor(Math.random()*COLORS.length)]}`,
      `opacity:${(Math.random()*.45+.05).toFixed(2)}`,
      `animation-duration:${(Math.random()*18+10).toFixed(1)}s`,
      `animation-delay:${(Math.random()*12).toFixed(1)}s`,
      `border-radius:${Math.random()>.5?'50%':'2px'}`
    ].join(';');
    particlesWrap.appendChild(p);
  }
}

/* ════════════════════════════════════════════════
   HERO ENTRANCE
═══════════════════════════════════════════════ */
window.addEventListener('load', () => {
  const hl = document.getElementById('homeLeft');
  const hr = document.getElementById('homeRight');
  if (hl) { hl.style.cssText = 'opacity:0;transform:translateX(-40px);transition:opacity .9s ease,transform .9s ease'; }
  if (hr) { hr.style.cssText = 'opacity:0;transform:translateX(40px);transition:opacity .9s ease .3s,transform .9s ease .3s'; }
  setTimeout(() => {
    if (hl) { hl.style.opacity = '1'; hl.style.transform = 'none'; }
    if (hr) { hr.style.opacity = '1'; hr.style.transform = 'none'; }
  }, 100);
});

/* ════════════════════════════════════════════════
   SCROLL REVEAL (.rv)
═══════════════════════════════════════════════ */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealIO.unobserve(entry.target);
  });
}, { threshold: 0.1 });

// Stagger delays for skill columns
document.querySelectorAll('.skills-grid .rv').forEach((el, i) => {
  el.dataset.delay = i * 100;
});

document.querySelectorAll('.rv').forEach(el => revealIO.observe(el));

/* ════════════════════════════════════════════════
   SKILL BARS
═══════════════════════════════════════════════ */
const skillsSec = document.getElementById('skills');
if (skillsSec) {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.sk-fill').forEach(bar =>
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 300)
      );
      obs.unobserve(e.target);
    });
  }, { threshold: 0.25 }).observe(skillsSec);
}

/* ════════════════════════════════════════════════
   GPA COUNTER
═══════════════════════════════════════════════ */
const eduSec = document.getElementById('education');
if (eduSec) {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.gpa-val').forEach(el => {
        const val = parseFloat(el.textContent);
        if (isNaN(val) || val > 5) return;
        const start = performance.now();
        (function tick(now) {
          const p    = Math.min((now - start) / 1300, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = (val * ease).toFixed(2);
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 }).observe(eduSec);
}

/* ════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════ */
const cform = document.getElementById('cform');
if (cform) {
  cform.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = cform.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'SENDING... <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled  = true;
    setTimeout(() => {
      btn.innerHTML      = 'SENT! <i class="fa-solid fa-check"></i>';
      btn.style.background = '#4caf50';
      setTimeout(() => {
        btn.innerHTML        = orig;
        btn.disabled         = false;
        btn.style.background = '';
        cform.reset();
      }, 3000);
    }, 1500);
  });
}

/* ════════════════════════════════════════════════
   MUSIC PLAYER
═══════════════════════════════════════════════ */
const audioEl    = document.getElementById('audioEl');
const playBtn    = document.getElementById('playBtn');
const playIcon   = document.getElementById('playIcon');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');
const vinyl      = document.getElementById('vinyl');
const trackTitle = document.getElementById('trackTitle');
const musicProg  = document.getElementById('musicProgress');

const playlist = [{ title: 'JayQ - ยังไงก็เธอ feat. Z9', src: 'music.mp3' }];
let trackIdx = 0, isPlaying = false;

function loadTrack(i) {
  if (!audioEl) return;
  audioEl.src = playlist[i].src;
  if (trackTitle) trackTitle.innerHTML = playlist[i].title;
  if (musicProg)  musicProg.style.width = '0';
  if (isPlaying)  audioEl.play().catch(() => {});
}

function togglePlay() {
  if (!audioEl) return;
  if (isPlaying) {
    audioEl.pause(); isPlaying = false;
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (vinyl)    vinyl.classList.remove('spin');
  } else {
    audioEl.play()
      .then(() => {
        isPlaying = true;
        if (playIcon) playIcon.className = 'fa-solid fa-pause';
        if (vinyl)    vinyl.classList.add('spin');
      })
      .catch(() => showToast('ไม่พบไฟล์เพลง'));
  }
}

if (playBtn) playBtn.addEventListener('click', togglePlay);
if (prevBtn) prevBtn.addEventListener('click', () => { trackIdx = (trackIdx - 1 + playlist.length) % playlist.length; loadTrack(trackIdx); });
if (nextBtn) nextBtn.addEventListener('click', () => { trackIdx = (trackIdx + 1) % playlist.length; loadTrack(trackIdx); });

if (audioEl) {
  audioEl.addEventListener('timeupdate', () => {
    if (audioEl.duration && musicProg)
      musicProg.style.width = (audioEl.currentTime / audioEl.duration * 100) + '%';
  });
  audioEl.addEventListener('ended', () => { trackIdx = (trackIdx + 1) % playlist.length; loadTrack(trackIdx); });
}

document.querySelector('.music-bar')?.addEventListener('click', e => {
  const rect = e.currentTarget.getBoundingClientRect();
  if (audioEl && audioEl.duration)
    audioEl.currentTime = audioEl.duration * ((e.clientX - rect.left) / rect.width);
});

loadTrack(0);

/* ════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = [
      'position:fixed','bottom:6rem','right:1.5rem',
      'background:#161616','color:#dedede',
      'border:1px solid rgba(230,57,70,.4)','border-left:2px solid #e63946',
      'padding:.75rem 1.3rem',
      "font-family:'Space Grotesk',sans-serif",
      'font-size:.73rem','z-index:99999',
      'opacity:0','transition:opacity .3s ease',
      'pointer-events:none','max-width:280px'
    ].join(';');
    document.body.appendChild(t);
  }
  t.textContent   = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 3500);
}

/* ════════════════════════════════════════════════
   LOGO GLITCH on hover
═══════════════════════════════════════════════ */
const navLogo    = document.querySelector('.nav-logo');
const logoText   = 'RESUME';
const glyphChars = '!@#$%^&*<>?/\\|';

function glitchLogo() {
  let iter = 0;
  const iv = setInterval(() => {
    if (!navLogo) { clearInterval(iv); return; }
    navLogo.textContent = logoText.split('').map((ch, i) =>
      i < iter ? ch : glyphChars[Math.floor(Math.random() * glyphChars.length)]
    ).join('');
    if (iter >= logoText.length) clearInterval(iv);
    iter += 0.4;
  }, 55);
}

if (navLogo) navLogo.addEventListener('mouseenter', glitchLogo);

/* ════════════════════════════════════════════════
   DOT-GRID PARALLAX
═══════════════════════════════════════════════ */
const dotGrid = document.querySelector('.dot-grid');
if (dotGrid) {
  document.addEventListener('mousemove', e => {
    const xShift = ((e.clientX / window.innerWidth)  - 0.5) * 12;
    const yShift = ((e.clientY / window.innerHeight) - 0.5) * 12;
    dotGrid.style.transform = `translate(${xShift}px,${yShift}px)`;
  });
}

/* ════════════════════════════════════════════════
   PROJECT CARD NUMBER BADGES
═══════════════════════════════════════════════ */
document.querySelectorAll('.proj-card').forEach((card, i) => {
  const thumb = card.querySelector('.proj-thumb');
  if (!thumb) return;
  const num = document.createElement('span');
  num.style.cssText = [
    'position:absolute','top:.9rem','right:.9rem',
    "font-family:'Space Grotesk',sans-serif",
    'font-size:.6rem','font-weight:700','letter-spacing:1px',
    'color:rgba(255,255,255,.12)','z-index:2',
    'pointer-events:none','transition:color .3s ease'
  ].join(';');
  num.textContent = String(i + 1).padStart(2, '0');
  thumb.appendChild(num);
  card.addEventListener('mouseenter', () => { num.style.color = 'rgba(230,57,70,.6)'; });
  card.addEventListener('mouseleave', () => { num.style.color = 'rgba(255,255,255,.12)'; });
});
