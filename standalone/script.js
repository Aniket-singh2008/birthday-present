/**
 * 💖 ROMANTIC BIRTHDAY SURPRISE SCRIPT
 * Scene State Machine + Parametric Heart + IndexedDB Photo Storage
 */

// ==========================================
// 1. CONFIGURATION (EDIT YOUR DETAILS HERE)
// ==========================================
const CONFIG = {
  // Birthday person's name
  name: 'Neha',

  // Countdown & text items for Scene 1 Matrix intro
  countdownItems: ['3', '2', '1', 'Happy', 'Birthday', 'Neha', '💖'],
  countdownDurationMs: 1100,

  // Scene 2: Cat display duration (seconds)
  catDurationSec: 4,

  // Scene 4: Message and photo pages
  pages: [
    {
      text: 'Happy birthday my love ❤️',
      leftPhoto: 'images/p1-left.jpg',
      rightPhoto: 'images/p1-right.jpg',
    },
    {
      text: "As long as you're smiling, I'm happy. Stay happy, my love.",
      leftPhoto: 'images/p2-left.jpg',
      rightPhoto: 'images/p2-right.jpg',
    },
  ],

  // Scene 6: Finale text under the heart
  finaleText: 'I love you ❤️',

  // Default gallery photos for heart tiles (g1.jpg to g20.jpg)
  galleryPhotos: Array.from({ length: 20 }, (_, i) => `images/gallery/g${i + 1}.jpg`),
};

// ==========================================
// 2. STATE & INITIALIZATION
// ==========================================
let currentScene = 1;
let currentPageIndex = 0;
let userHeartPhotos = [];
let userPagePhotos = {};
let isMusicPlaying = false;

// DOM Elements
const scenes = {
  1: document.getElementById('scene1'),
  2: document.getElementById('scene2'),
  3: document.getElementById('scene3'),
  4: document.getElementById('scene4'),
  5: document.getElementById('scene5'),
  6: document.getElementById('scene6'),
};

function switchScene(sceneNum) {
  currentScene = sceneNum;
  Object.values(scenes).forEach((el) => el.classList.remove('active'));
  if (scenes[sceneNum]) {
    scenes[sceneNum].classList.add('active');
  }

  if (sceneNum === 2) {
    setTimeout(() => {
      if (currentScene === 2) switchScene(3);
    }, CONFIG.catDurationSec * 1000);
  } else if (sceneNum === 4) {
    renderPage(currentPageIndex);
  } else if (sceneNum === 5) {
    setTimeout(() => {
      switchScene(6);
    }, 1800);
  } else if (sceneNum === 6) {
    buildHeartFinale();
  }
}

// ==========================================
// 3. INDEXEDDB STORAGE FOR USER PHOTOS
// ==========================================
const DB_NAME = 'RomanticBirthdayDB';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject('No IndexedDB');
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToDB(key, val) {
  try {
    const db = await openDB();
    const tx = db.transaction('photos', 'readwrite');
    tx.objectStore('photos').put(val, key);
  } catch (e) {
    try {
      localStorage.setItem(`bday_${key}`, JSON.stringify(val));
    } catch {}
  }
}

async function getFromDB(key) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('photos', 'readonly');
      const req = tx.objectStore('photos').get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    try {
      const val = localStorage.getItem(`bday_${key}`);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  }
}

async function clearDB() {
  try {
    const db = await openDB();
    const tx = db.transaction('photos', 'readwrite');
    tx.objectStore('photos').clear();
  } catch {}
  localStorage.removeItem('bday_heart_photos');
  localStorage.removeItem('bday_page_photos');
}

// ==========================================
// 4. SCENE 1: MATRIX DIGITAL RAIN
// ==========================================
function initMatrixRain() {
  const canvas = document.getElementById('matrixCanvas');
  const textEl = document.getElementById('matrixText');
  if (!canvas || !textEl) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const chars = '0123456789ABCDEF♥♡✦💖AYAﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
  const fontSize = 16;
  const cols = Math.floor(width / fontSize);
  const drops = Array.from({ length: cols }, () => Math.random() * -50);
  const speeds = Array.from({ length: cols }, () => 0.8 + Math.random() * 1.4);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 13, 26, 0.22)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = Math.random() > 0.8 ? '#ffffff' : '#f43f5e';
      ctx.fillText(text, x, y);

      if (y > height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += speeds[i];
    }
    if (currentScene === 1) requestAnimationFrame(drawMatrix);
  }
  drawMatrix();

  // Step through countdown text
  let index = 0;
  function nextCountdownItem() {
    if (currentScene !== 1) return;
    textEl.style.opacity = '1';
    textEl.style.transform = 'scale(1)';
    textEl.innerText = CONFIG.countdownItems[index];

    setTimeout(() => {
      textEl.style.opacity = '0';
      textEl.style.transform = 'scale(1.15)';
    }, CONFIG.countdownDurationMs - 200);

    setTimeout(() => {
      index++;
      if (index < CONFIG.countdownItems.length) {
        nextCountdownItem();
      } else {
        switchScene(2);
      }
    }, CONFIG.countdownDurationMs);
  }
  nextCountdownItem();

  document.getElementById('skipIntroBtn')?.addEventListener('click', () => switchScene(2));
}

// ==========================================
// 5. STARRY NIGHT & FLOATING HEARTS (SCENE 2-6)
// ==========================================
function initStarryNight() {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 0.8 + Math.random() * 1.5,
    alpha: 0.3 + Math.random() * 0.7,
    speed: 0.02 + Math.random() * 0.03,
  }));

  const hearts = Array.from({ length: 22 }, () => ({
    x: Math.random() * width,
    y: height + Math.random() * height,
    size: 12 + Math.random() * 16,
    speedY: 0.7 + Math.random() * 1.1,
    color: ['#f43f5e', '#ec4899', '#ef4444', '#fb923c'][Math.floor(Math.random() * 4)],
  }));

  let tick = 0;
  function renderStars() {
    tick++;
    ctx.clearRect(0, 0, width, height);

    // Stars
    for (let s of stars) {
      const a = Math.max(0.1, s.alpha + Math.sin(tick * s.speed) * 0.35);
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hearts
    for (let h of hearts) {
      h.y -= h.speedY;
      ctx.fillStyle = h.color;
      ctx.font = `${h.size}px serif`;
      ctx.fillText('♥', h.x + Math.sin(tick * 0.02) * 20, h.y);

      if (h.y < -30) {
        h.y = height + 20;
        h.x = Math.random() * width;
      }
    }

    requestAnimationFrame(renderStars);
  }
  renderStars();
}

// ==========================================
// 6. SCENE 3 & 4: CARD AND BOOK PAGES
// ==========================================
function initCardAndBook() {
  document.getElementById('tapToOpenBtn')?.addEventListener('click', () => switchScene(4));
  document.getElementById('greetingCard')?.addEventListener('click', () => switchScene(4));
  document.getElementById('openCardEarlyBtn')?.addEventListener('click', () => switchScene(3));

  document.getElementById('nextPageBtn')?.addEventListener('click', () => {
    if (currentPageIndex < CONFIG.pages.length - 1) {
      currentPageIndex++;
      renderPage(currentPageIndex);
    } else {
      switchScene(5);
    }
  });

  document.getElementById('prevPageBtn')?.addEventListener('click', () => {
    if (currentPageIndex > 0) {
      currentPageIndex--;
      renderPage(currentPageIndex);
    }
  });

  // Photo replacement handlers
  setupPhotoSlot('leftPhotoSlot', 'leftFileInput', 'leftPhotoImg', 'leftPlaceholder', 'left');
  setupPhotoSlot('rightPhotoSlot', 'rightFileInput', 'rightPhotoImg', 'rightPlaceholder', 'right');
}

function setupPhotoSlot(slotId, inputId, imgId, placeholderId, side) {
  const slot = document.getElementById(slotId);
  const input = document.getElementById(inputId);
  const img = document.getElementById(imgId);

  slot?.addEventListener('click', () => input?.click());

  input?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        img.src = dataUrl;
        slot.classList.add('has-image');
        const key = `p${currentPageIndex}_${side}`;
        userPagePhotos[key] = dataUrl;
        saveToDB('page_photos', userPagePhotos);
      };
      reader.readAsDataURL(file);
    }
  });
}

function renderPage(idx) {
  const page = CONFIG.pages[idx] || CONFIG.pages[0];
  const textEl = document.getElementById('typewriterText');
  const indicator = document.getElementById('pageIndicator');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  if (indicator) indicator.innerText = `Page ${idx + 1} / ${CONFIG.pages.length}`;
  if (prevBtn) prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
  if (nextBtn) nextBtn.innerText = idx === CONFIG.pages.length - 1 ? 'Turn to Finale ➔' : 'Next Page ➔';

  // Typewriter
  if (textEl) {
    textEl.innerText = '';
    let charIndex = 0;
    const timer = setInterval(() => {
      charIndex++;
      textEl.innerText = page.text.slice(0, charIndex);
      if (charIndex >= page.text.length) clearInterval(timer);
    }, 45);
  }

  // Photos
  const leftKey = `p${idx}_left`;
  const rightKey = `p${idx}_right`;
  updateSlot('leftPhotoSlot', 'leftPhotoImg', 'leftFilename', userPagePhotos[leftKey] || page.leftPhoto, `/images/p${idx + 1}-left.jpg`);
  updateSlot('rightPhotoSlot', 'rightPhotoImg', 'rightFilename', userPagePhotos[rightKey] || page.rightPhoto, `/images/p${idx + 1}-right.jpg`);
}

function updateSlot(slotId, imgId, fnId, src, defaultFn) {
  const slot = document.getElementById(slotId);
  const img = document.getElementById(imgId);
  const fnEl = document.getElementById(fnId);
  if (fnEl) fnEl.innerText = defaultFn;

  if (src && src.startsWith('data:')) {
    img.src = src;
    slot.classList.add('has-image');
  } else {
    // Check if image loads, else show neat placeholder
    const testImg = new Image();
    testImg.src = src;
    testImg.onload = () => {
      img.src = src;
      slot.classList.add('has-image');
    };
    testImg.onerror = () => {
      slot.classList.remove('has-image');
    };
  }
}

// ==========================================
// 7. SCENE 6: PHOTO HEART FINALE
// ==========================================
function buildHeartFinale() {
  const arena = document.getElementById('heartArena');
  if (!arena) return;
  arena.innerHTML = '';

  const photos = userHeartPhotos.length > 0 ? userHeartPhotos : CONFIG.galleryPhotos;
  const isMobile = window.innerWidth < 640;
  const count = isMobile ? 26 : 34;
  const scale = isMobile ? 8.2 : 12.5;

  // Parametric Heart Formula
  for (let i = 0; i < count; i++) {
    const t = (i / count) * (Math.PI * 2);
    const mathX = 16 * Math.pow(Math.sin(t), 3);
    const mathY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const targetX = mathX * scale;
    const targetY = mathY * scale + 15;
    const rotation = (Math.random() - 0.5) * 20;

    // Start from offscreen/scattered
    const angle = Math.random() * Math.PI * 2;
    const dist = 500;
    const startX = Math.cos(angle) * dist;
    const startY = Math.sin(angle) * dist;

    const tile = document.createElement('div');
    tile.className = 'heart-tile';
    tile.style.transform = `translate(${startX}px, ${startY}px) rotate(${rotation * 3}deg) scale(0.3)`;
    tile.style.opacity = '0';

    const photoSrc = photos[i % photos.length];
    const img = document.createElement('img');
    img.src = photoSrc;
    img.onerror = () => {
      img.style.display = 'none';
      tile.innerHTML = '<span style="display:flex;align-items:center;justify-content:center;height:100%;font-size:18px;">❤️</span>';
    };
    tile.appendChild(img);

    tile.addEventListener('click', () => openLightbox(img.src));
    arena.appendChild(tile);

    // Fly in animation
    setTimeout(() => {
      tile.style.opacity = '1';
      tile.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${rotation}deg) scale(1)`;
    }, 150 + i * 25);
  }
}

function openLightbox(src) {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (box && img) {
    img.src = src;
    box.classList.add('active');
  }
}

document.getElementById('closeLightboxBtn')?.addEventListener('click', () => {
  document.getElementById('lightbox')?.classList.remove('active');
});

// Photo Upload for Heart
document.getElementById('addPhotosBtn')?.addEventListener('click', () => {
  document.getElementById('multiplePhotosInput')?.click();
});

document.getElementById('multiplePhotosInput')?.addEventListener('change', (e) => {
  const files = Array.from(e.target.files || []).slice(0, 40);
  if (files.length === 0) return;

  const urls = [];
  let done = 0;
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      urls.push(evt.target.result);
      done++;
      if (done === files.length) {
        userHeartPhotos = urls;
        saveToDB('heart_photos', urls);
        buildHeartFinale();
      }
    };
    reader.readAsDataURL(file);
  });
});

document.getElementById('resetPhotosBtn')?.addEventListener('click', async () => {
  userHeartPhotos = [];
  await clearDB();
  buildHeartFinale();
});

document.getElementById('replayBtn')?.addEventListener('click', () => {
  currentPageIndex = 0;
  switchScene(1);
});

// ==========================================
// 8. ROMANTIC WEB AUDIO SYNTH & MP3 PLAYER
// ==========================================
let audioCtx = null;
let synthTimer = null;
const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23, 349.23, 440.00, 523.25, 659.25, 523.25, 440.00];
let noteStep = 0;

function toggleMusic() {
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  const icon = document.getElementById('musicIcon');
  const label = document.getElementById('musicLabel');

  if (isMusicPlaying) {
    isMusicPlaying = false;
    audio?.pause();
    stopSynth();
    btn?.classList.remove('playing');
    if (icon) icon.innerText = '🔇';
    if (label) label.innerText = 'Play Music';
  } else {
    isMusicPlaying = true;
    btn?.classList.add('playing');
    if (icon) icon.innerText = '🎵';
    if (label) label.innerText = 'Music Playing';

    if (audio) {
      audio.play().catch(() => startSynth());
    } else {
      startSynth();
    }
  }
}

function startSynth() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  function playNote() {
    if (!isMusicPlaying || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[noteStep % notes.length], now);
    noteStep++;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.2);

    synthTimer = setTimeout(playNote, 420);
  }
  playNote();
}

function stopSynth() {
  if (synthTimer) clearTimeout(synthTimer);
}

document.getElementById('musicBtn')?.addEventListener('click', toggleMusic);

// ==========================================
// 9. STARTUP & LOAD STORED DATA
// ==========================================
window.addEventListener('DOMContentLoaded', async () => {
  initMatrixRain();
  initStarryNight();
  initCardAndBook();

  // Load photos from IndexedDB
  const storedHeart = await getFromDB('heart_photos');
  if (storedHeart && Array.isArray(storedHeart)) {
    userHeartPhotos = storedHeart;
  }
  const storedPages = await getFromDB('page_photos');
  if (storedPages) {
    userPagePhotos = storedPages;
  }
});
