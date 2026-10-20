// ==========================================
// SHINCHAN & DORAEMON BIRTHDAY WEBSITE SCRIPT
// Specially crafted by Sufiyan for Ritu Suparna (Supuu)
// ==========================================

// Global state
let storedName = localStorage.getItem('bday_friend_name');
if (!storedName || storedName === 'Sufiyan') {
  storedName = 'Ritu Suparna';
  localStorage.setItem('bday_friend_name', storedName);
}

let friendName = storedName;
let nickname = 'Supuu';
let senderName = 'Sufiyan';

let isAudioPlaying = false;
let audioCtx = null;
let musicInterval = null;
let currentNoteIndex = 0;
let noButtonClickCount = 0;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  updateAllNameReferences();
  initBalloons();
  initConfetti();
  initShinchanGatekeeper();
  initScanner();
  initCursorSparkles();
  initCake();
  initGadgets();
  initLetter();
  initFeelingsSection();
  initMiniGame();
  initAudioControls();
});

// ==========================================
// NAME CUSTOMIZATION
// ==========================================
function updateAllNameReferences() {
  document.querySelectorAll('.friend-name-display').forEach(el => {
    el.textContent = friendName;
  });
  document.querySelectorAll('.friend-nickname-display').forEach(el => {
    el.textContent = nickname;
  });
  document.querySelectorAll('.sender-name-display').forEach(el => {
    el.textContent = senderName;
  });
}

function openEditNameModal() {
  const modal = document.getElementById('name-modal');
  const input = document.getElementById('name-input');
  const nickInput = document.getElementById('nick-input');
  if (modal && input) {
    input.value = friendName;
    if (nickInput) nickInput.value = nickname;
    modal.classList.add('active');
    input.focus();
  }
}

function closeEditNameModal() {
  const modal = document.getElementById('name-modal');
  if (modal) modal.classList.remove('active');
}

function saveFriendName() {
  const input = document.getElementById('name-input');
  const nickInput = document.getElementById('nick-input');
  if (input && input.value.trim() !== '') {
    friendName = input.value.trim();
    if (nickInput && nickInput.value.trim() !== '') {
      nickname = nickInput.value.trim();
    }
    localStorage.setItem('bday_friend_name', friendName);
    updateAllNameReferences();
    closeEditNameModal();
    launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    playGadgetChime();
  }
}

// ==========================================
// WEB AUDIO API SOUND & MUSIC ENGINE
// ==========================================
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sound FX: Balloon Pop
function playPopSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {
    console.warn(e);
  }
}

// Sound FX: Cartoon Boing (Shinchan)
function playBoingSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.45);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.52);
  } catch (e) {
    console.warn(e);
  }
}

// Sound FX: Doraemon Magic Gadget Fanfare
function playGadgetChime() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.09;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  } catch (e) {
    console.warn(e);
  }
}

// Sound FX: Action Kamen Laser
function playLaserSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.28);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    console.warn(e);
  }
}

// Sound FX: Shiro Bark
function playBarkSound() {
  try {
    const ctx = getAudioContext();
    [0, 0.16].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + delay;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(450, now + 0.06);
      osc.frequency.linearRampToValueAtTime(200, now + 0.12);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    });
  } catch (e) {
    console.warn(e);
  }
}

// Sound FX: Candle Blowout
function playCandleBlowSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {
    console.warn(e);
  }
}

// Happy Birthday Chiptune / Synth Melody (Web Audio API)
const happyBirthdayNotes = [
  { f: 261.63, d: 0.35 }, // C4  Hap-
  { f: 261.63, d: 0.25 }, // C4  py
  { f: 293.66, d: 0.55 }, // D4  Birth-
  { f: 261.63, d: 0.55 }, // C4  day
  { f: 349.23, d: 0.55 }, // F4  to
  { f: 329.63, d: 0.95 }, // E4  you

  { f: 261.63, d: 0.35 }, // C4  Hap-
  { f: 261.63, d: 0.25 }, // C4  py
  { f: 293.66, d: 0.55 }, // D4  Birth-
  { f: 261.63, d: 0.55 }, // C4  day
  { f: 392.00, d: 0.55 }, // G4  to
  { f: 349.23, d: 0.95 }, // F4  you

  { f: 261.63, d: 0.35 }, // C4  Hap-
  { f: 261.63, d: 0.25 }, // C4  py
  { f: 523.25, d: 0.55 }, // C5  Birth-
  { f: 440.00, d: 0.55 }, // A4  day
  { f: 349.23, d: 0.55 }, // F4  dear
  { f: 329.63, d: 0.55 }, // E4  Su-
  { f: 293.66, d: 0.85 }, // D4  puu!

  { f: 466.16, d: 0.35 }, // Bb4 Hap-
  { f: 466.16, d: 0.25 }, // Bb4 py
  { f: 440.00, d: 0.55 }, // A4  Birth-
  { f: 349.23, d: 0.55 }, // F4  day
  { f: 392.00, d: 0.55 }, // G4  to
  { f: 349.23, d: 1.10 }  // F4  you!
];

function playNextMelodyNote() {
  if (!isAudioPlaying) return;
  const note = happyBirthdayNotes[currentNoteIndex];
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.f, now);
    
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.setValueAtTime(5, now);
    vibratoGain.gain.setValueAtTime(2.5, now);
    vibrato.connect(osc.frequency);
    vibrato.start(now);
    vibrato.stop(now + note.d);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.d * 0.95);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + note.d);

    if (currentNoteIndex % 2 === 0) {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(note.f / 2, now);
      bassGain.gain.setValueAtTime(0.18, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + note.d * 1.2);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + note.d * 1.2);
    }
  } catch (e) {
    console.warn(e);
  }

  currentNoteIndex = (currentNoteIndex + 1) % happyBirthdayNotes.length;
  musicInterval = setTimeout(playNextMelodyNote, note.d * 1000 + 40);
}

function startMusic() {
  if (isAudioPlaying) return;
  getAudioContext();
  isAudioPlaying = true;
  document.getElementById('music-toggle')?.classList.add('playing');
  const btn = document.getElementById('music-toggle-text');
  if (btn) btn.textContent = 'Pause Song 🎵';
  playNextMelodyNote();
}

function stopMusic() {
  isAudioPlaying = false;
  if (musicInterval) clearTimeout(musicInterval);
  document.getElementById('music-toggle')?.classList.remove('playing');
  const btn = document.getElementById('music-toggle-text');
  if (btn) btn.textContent = 'Play Song 🎶';
}

function toggleMusic() {
  if (isAudioPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
}

function initAudioControls() {
  const toggleBtn = document.getElementById('music-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMusic);
  }
}

// ==========================================
// SHINCHAN & DORAEMON INTERACTIVE GATEKEEPER
// ==========================================
function initShinchanGatekeeper() {
  const overlay = document.getElementById('gatekeeper-overlay');
  const btnYes = document.getElementById('btn-gate-yes');
  const btnNo = document.getElementById('btn-gate-no');
  const speechText = document.getElementById('shinchan-speech-text');
  const mascotShinchan = document.getElementById('mascot-shinchan');
  const mascotDoraemon = document.getElementById('mascot-doraemon');

  const funnyNoDialogues = [
    `Hey hey! You clicked NO?! Are you crazy?! Sufiyan prepared this entire secret party for you, Supuu! 🤨`,
    `Action Kamen told me strictly: NOBODY says NO to a birthday surprise from Sufiyan! Try clicking YES, Supuu! 🦸‍♂️💥`,
    `Buri Buri Buri! 🍑 Look at my wiggle dance, Ritu! Now will you click YES, or do I eat all the cake?! 💃`,
    `Aha! Trying to run away, Supuu? The door is locked with Doraemon's Anywhere Key! Click YES! 🚪✨`,
    `Okay birthday girl, my button has special magic powers! Catch it if you can! 🤣`
  ];

  if (mascotShinchan) {
    mascotShinchan.addEventListener('click', () => {
      playBoingSound();
      speakShinchanVoice(`Oi oi! Happy Birthday Supuu! Stop tickling me and let's party!`);
      launchConfettiBurst(window.innerWidth * 0.35, window.innerHeight * 0.35);
      if (speechText) {
        speechText.innerHTML = `Hehehe! That tickles! Are you going to click YES, <strong>${nickname}</strong>, or stare at my handsome face?! 😏`;
      }
    });
  }

  if (mascotDoraemon) {
    mascotDoraemon.addEventListener('click', () => {
      playGadgetChime();
      speakShinchanVoice(`Boku Doraemon! Happy Birthday Ritu! Sufiyan asked me to open the 4D pocket for you!`);
      launchConfettiBurst(window.innerWidth * 0.65, window.innerHeight * 0.35);
      if (speechText) {
        speechText.innerHTML = `Doraemon says: <em>"Shinchan, stop teasing our birthday girl <strong>${nickname}</strong>! Look how happy Sufiyan is to celebrate her special day!"</em> 🐱✨`;
      }
    });
  }

  // Handle "NO" button dodges & antics
  if (btnNo) {
    const dodge = (e) => {
      e.preventDefault();
      noButtonClickCount++;
      playBoingSound();

      const maxOffset = 150;
      const randomX = (Math.random() - 0.5) * maxOffset * 2;
      const randomY = (Math.random() - 0.5) * maxOffset;
      btnNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.92)`;

      const dialogueIndex = (noButtonClickCount - 1) % funnyNoDialogues.length;
      if (speechText) {
        speechText.textContent = funnyNoDialogues[dialogueIndex];
      }

      if (noButtonClickCount >= 4) {
        btnNo.innerHTML = `<span>Fine, YES! 🎂🥳</span>`;
        btnNo.classList.remove('btn-gate-no');
        btnNo.classList.add('btn-gate-yes');
        btnNo.onclick = () => openWebsiteCelebration();
      }
    };

    btnNo.addEventListener('mouseenter', dodge);
    btnNo.addEventListener('click', dodge);
    btnNo.addEventListener('touchstart', dodge, { passive: false });
  }

  if (btnYes) {
    btnYes.addEventListener('click', () => {
      openWebsiteCelebration();
    });
  }
}

// Gatekeeper Tab Switcher
function switchGateTab(tabId) {
  playGadgetChime();
  document.querySelectorAll('.gate-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.gate-tab-content').forEach(c => c.classList.remove('active'));

  const activeBtn = Array.from(document.querySelectorAll('.gate-tab-btn')).find(b => b.getAttribute('onclick')?.includes(tabId));
  if (activeBtn) activeBtn.classList.add('active');

  const content = document.getElementById('tab-' + tabId);
  if (content) content.classList.add('active');
}

// Biometric VIP Thumbprint Scanner
let scanHoldInterval = null;
let scanProgress = 0;

function initScanner() {
  const pad = document.getElementById('scanner-pad');
  const box = document.getElementById('scanner-box');
  const fill = document.getElementById('scan-progress-fill');
  const status = document.getElementById('scan-status-text');

  if (!pad) return;

  const startScan = (e) => {
    e.preventDefault();
    box?.classList.add('scanning');
    playScanHumSound();
    scanProgress = 0;
    if (status) status.textContent = 'Scanning DNA & Birthday Royalty aura...';

    scanHoldInterval = setInterval(() => {
      scanProgress += 7;
      if (fill) fill.style.width = Math.min(scanProgress, 100) + '%';

      if (scanProgress >= 100) {
        clearInterval(scanHoldInterval);
        box?.classList.remove('scanning');
        playGadgetChime();
        if (status) {
          status.innerHTML = `✅ <strong style="color: #4ade80;">MATCH 100%!</strong> Verified: Ritu Suparna (Supuu)! VIP of Sufiyan! 👑`;
        }
        launchMassiveConfetti();
        speakShinchanVoice(`Match confirmed! Supuu is the true birthday queen! Entering party!`);
        setTimeout(() => {
          openWebsiteCelebration();
        }, 1100);
      }
    }, 60);
  };

  const endScan = () => {
    if (scanProgress < 100) {
      clearInterval(scanHoldInterval);
      box?.classList.remove('scanning');
      scanProgress = 0;
      if (fill) fill.style.width = '0%';
      if (status) status.textContent = 'Scan canceled. Hold thumbprint down firmly to verify!';
    }
  };

  pad.addEventListener('mousedown', startScan);
  pad.addEventListener('mouseup', endScan);
  pad.addEventListener('mouseleave', endScan);
  pad.addEventListener('touchstart', startScan, { passive: false });
  pad.addEventListener('touchend', endScan);
}

function playScanHumSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 1.2);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.25);
  } catch (e) {
    console.warn(e);
  }
}

// Chocobi Bribe Feeder Game
let chocobiFedCount = 0;
function feedShinchanCookie() {
  if (chocobiFedCount >= 3) {
    speakShinchanVoice("I'm already full of yummy cookies, Supuu! Opening the party!");
    openWebsiteCelebration();
    return;
  }
  chocobiFedCount++;
  playBoingSound();
  launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4);

  const slot = document.getElementById(`cookie-${chocobiFedCount}`);
  if (slot) slot.classList.add('fed');

  const status = document.getElementById('bribe-status-text');
  const speechText = document.getElementById('shinchan-speech-text');

  if (chocobiFedCount === 1) {
    if (status) status.textContent = 'Snack meter: 1 / 3 Chocobi fed 🍫';
    if (speechText) speechText.textContent = `Crunch crunch! Delicious! ${nickname}, give me another one and I might consider opening it! 😜`;
    speakShinchanVoice("Yummy cookie! Give me more, Supuu!");
  } else if (chocobiFedCount === 2) {
    if (status) status.textContent = 'Snack meter: 2 / 3 Chocobi fed 🍫🍫';
    if (speechText) speechText.textContent = `Nom nom nom! My belly is getting rounder! Just ONE more cookie, Supuu! 🤤`;
    speakShinchanVoice("So tasty! One more and I'll open the door!");
  } else if (chocobiFedCount === 3) {
    if (status) status.innerHTML = '🎉 <strong>3 / 3 FULL! SHINCHAN APPROVED VIP ENTRY!</strong>';
    if (speechText) speechText.textContent = `BURRP! 😋 Action Kamen power activated! You are the best, ${nickname}! Unlocking party door now! 🎉`;
    speakShinchanVoice("Burp! Thank you Supuu! Entrance granted!");
    playGadgetChime();
    launchMassiveConfetti();
    setTimeout(() => {
      openWebsiteCelebration();
    }, 1200);
  }
}

// First Page Soundboard Functions
function playShinchanVoiceSample() {
  playBoingSound();
  speakShinchanVoice(`Oi oi oi! Happy Birthday to the prettiest girl Supuu! Action Kamen and Sufiyan love you!`);
  launchConfettiBurst(window.innerWidth * 0.35, window.innerHeight * 0.4);
}

function playDoraemonVoiceSample() {
  playGadgetChime();
  speakShinchanVoice(`Boku Doraemon! Happy Birthday Supuu! Take this Take-copter and fly to your dreams with Sufiyan!`);
  launchConfettiBurst(window.innerWidth * 0.65, window.innerHeight * 0.4);
}

function playBuriBuriBeatSample() {
  playBoingSound();
  speakShinchanVoice(`Buri Buri Buri Buri beat!`);
  try {
    const ctx = getAudioContext();
    const notes = [220, 277, 330, 440, 554, 660];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.1;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  } catch (e) {
    console.warn(e);
  }
}

// Anywhere Door 3D Portal Transition & Celebration Launch
function openWebsiteCelebration() {
  const overlay = document.getElementById('gatekeeper-overlay');
  const portal = document.getElementById('anywhere-door-portal');

  playGadgetChime();
  launchMassiveConfetti();
  speakShinchanVoice(`Woohoo! Happy Birthday Ritu Suparna! Welcome to your party!`);

  if (portal) {
    portal.classList.add('active');
    setTimeout(() => {
      portal.classList.add('door-open-anim');
      launchMassiveConfetti();
      playGadgetChime();
    }, 150);

    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
      }
      portal.classList.remove('active', 'door-open-anim');
      startMusic();
    }, 1600);
  } else {
    if (overlay) {
      overlay.classList.add('hidden');
      setTimeout(() => {
        overlay.style.display = 'none';
        startMusic();
      }, 800);
    }
  }
}

// Cursor Sparkle Trails
function initCursorSparkles() {
  const sparkles = ['✨', '💖', '⭐', '🥞', '🍫', '🌸'];
  let throttle = 0;
  window.addEventListener('mousemove', (e) => {
    throttle++;
    if (throttle % 4 !== 0) return;
    const sp = document.createElement('div');
    sp.className = 'cursor-sparkle';
    sp.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sp.style.left = e.clientX + 'px';
    sp.style.top = e.clientY + 'px';
    document.body.appendChild(sp);

    setTimeout(() => {
      sp.style.transform = `translate(${(Math.random() - 0.5) * 60}px, -40px) scale(0)`;
      sp.style.opacity = '0';
      setTimeout(() => sp.remove(), 800);
    }, 20);
  });
}

// Shinchan Voice Synthesis (Playful Web Speech API)
function speakShinchanVoice(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.6;
    utterance.rate = 1.05;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

// ==========================================
// FLOATING BALLOONS
// ==========================================
function initBalloons() {
  const container = document.getElementById('balloons-container');
  if (!container) return;

  const colors = [
    '#ff3366', '#00a2ed', '#ffd700', '#2ecc71', '#ff761a',
    '#a855f7', '#ec4899', '#06b6d4', '#f43f5e', '#3b82f6'
  ];

  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const color = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = color;
    balloon.style.color = color;
    balloon.style.left = Math.random() * 92 + 'vw';
    const duration = 10 + Math.random() * 8;
    balloon.style.animationDuration = duration + 's';
    balloon.style.animationDelay = Math.random() * 2 + 's';

    const string = document.createElement('div');
    string.className = 'balloon-string';
    balloon.appendChild(string);

    balloon.addEventListener('click', (e) => {
      playPopSound();
      launchConfettiBurst(e.clientX, e.clientY);
      balloon.style.transform = 'scale(1.4)';
      balloon.style.opacity = '0';
      setTimeout(() => balloon.remove(), 150);
    });

    container.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, (duration + 3) * 1000);
  }

  for (let i = 0; i < 8; i++) {
    setTimeout(createBalloon, i * 600);
  }

  setInterval(createBalloon, 2200);
}

// ==========================================
// INTERACTIVE BIRTHDAY CAKE & BLOW CANDLES
// ==========================================
function initCake() {
  const btnBlow = document.getElementById('btn-blow-candles');
  const banner = document.getElementById('wish-status-banner');
  const cakeStage = document.getElementById('cake-stage');
  let blown = false;

  if (btnBlow && cakeStage) {
    btnBlow.addEventListener('click', () => {
      if (!blown) {
        blown = true;
        playCandleBlowSound();
        cakeStage.classList.add('candles-blown');
        btnBlow.innerHTML = '<span>Relight Candles 🕯️</span>';
        
        if (banner) {
          banner.classList.add('active');
          banner.innerHTML = `✨ <strong>WISH GRANTED!</strong> Doraemon has stored ${friendName}'s (${nickname}'s) birthday wish into the 4D Pocket, stamped with Action Kamen's seal & sent with love from ${senderName}! 🎉🎂`;
        }

        setTimeout(() => {
          playGadgetChime();
          launchMassiveConfetti();
        }, 300);
      } else {
        blown = false;
        cakeStage.classList.remove('candles-blown');
        btnBlow.innerHTML = '<span>💨 Make a Wish & Blow Candles!</span>';
        if (banner) {
          banner.classList.remove('active');
        }
        playBoingSound();
      }
    });
  }
}

// ==========================================
// DORAEMON'S 4D GADGETS
// ==========================================
function initGadgets() {
  const gadgetCards = document.querySelectorAll('.gadget-card');
  const gadgetBlessingBox = document.getElementById('gadget-blessing-box');

  const gadgetDialogues = {
    'anywhere-door': `🚪 **Doraemon's Anywhere Door**: "Whenever you feel stressed or tired, ${nickname}, just open this door and teleport straight to your dream vacation paradise! Safe travels, with love from ${senderName}!"`,
    'bamboo-copter': `🚁 **Take-Copter (Bamboo Copter)**: "May ${nickname}'s happiness, success, and smiles fly way above the clouds this year! - Best wishes from ${senderName}"`,
    'memory-bread': `🍞 **Anki-Pan (Memory Bread)**: "Eat this magical bread, ${nickname}, to ace every test, interview, and always remember all our wonderful friendship memories!"`,
    'big-light': `🔦 **Big & Small Light**: "Shrink all troubles and worries to 0mm, and multiply ${nickname}'s joy, laughter, and wealth by 1000x!"`,
    'time-machine': `⏳ **Time Machine**: "Whenever you finish that delicious birthday cake, jump back in time to eat it all over again, ${nickname}!"`,
    'dorayaki-plate': `🥞 **Endless Dorayaki Platter**: "Wishing birthday girl ${nickname} an abundance of sweets, treats, and smiles! Doraemon and ${senderName} prepared this feast!"`
  };

  gadgetCards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-gadget');
      playGadgetChime();
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.7);

      if (gadgetBlessingBox) {
        gadgetBlessingBox.style.display = 'block';
        gadgetBlessingBox.innerHTML = gadgetDialogues[type] || `✨ Gadget activated for ${nickname}!`;
        gadgetBlessingBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

// ==========================================
// SHINCHAN FUN ACTIONS
// ==========================================
function triggerBuriBuriDance() {
  playBoingSound();
  speakShinchanVoice(`Buri Buri Buri Buri! Happy Birthday Supuu! Watch me shake for you!`);
  const card = document.getElementById('shinchan-card');
  if (card) {
    card.style.animation = 'playfulWobble 0.25s infinite';
    setTimeout(() => {
      card.style.animation = '';
    }, 2000);
  }
  launchConfettiBurst(window.innerWidth * 0.3, window.innerHeight * 0.5);
}

function triggerActionKamenBeam() {
  playLaserSound();
  speakShinchanVoice(`ACTION BEEEAAAM! Happy Birthday Supuu from Sufiyan!`);
  
  const beam = document.createElement('div');
  beam.style.position = 'fixed';
  beam.style.top = '50%';
  beam.style.left = '0';
  beam.style.width = '100vw';
  beam.style.height = '14px';
  beam.style.background = 'linear-gradient(90deg, #ff0055, #ffd700, #00f0ff)';
  beam.style.boxShadow = '0 0 25px #00f0ff, 0 0 40px #ff0055';
  beam.style.zIndex = '9998';
  beam.style.transform = 'translateY(-50%) scaleY(1)';
  beam.style.transition = 'all 0.4s ease';
  document.body.appendChild(beam);

  setTimeout(() => {
    beam.style.transform = 'translateY(-50%) scaleY(0)';
    beam.style.opacity = '0';
    setTimeout(() => beam.remove(), 400);
  }, 500);

  document.querySelectorAll('.balloon').forEach(b => {
    b.click();
  });
}

function petShiroDog() {
  playBarkSound();
  speakShinchanVoice(`Shiro says woof woof! Happy birthday Supuu!`);
  
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = (window.innerWidth * 0.35 + (Math.random() - 0.5) * 150) + 'px';
    heart.style.top = '55%';
    heart.style.fontSize = '2rem';
    heart.style.zIndex = '9999';
    heart.style.transition = 'all 1.2s ease-out';
    document.body.appendChild(heart);
    
    setTimeout(() => {
      heart.style.transform = `translateY(-140px) scale(1.4)`;
      heart.style.opacity = '0';
      setTimeout(() => heart.remove(), 1200);
    }, 20);
  }
}

// ==========================
// FRIENDSHIP LETTER ENVELOPE
// ==========================
function initLetter() {
  const envelope = document.getElementById('friendship-envelope');
  const letter = document.getElementById('letter-content');
  if (envelope && letter) {
    envelope.addEventListener('click', () => {
      playGadgetChime();
      letter.classList.toggle('open');
      if (letter.classList.contains('open')) {
        launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.8);
      }
    });
  }
}

// ==========================================
// CHOCOBI & DORAYAKI CATCHING MINI-GAME
// ==========================================
function initMiniGame() {
  const canvas = document.getElementById('game-canvas');
  const overlay = document.getElementById('game-overlay');
  const startBtn = document.getElementById('start-game-btn');
  const scoreEl = document.getElementById('game-score');
  const timerEl = document.getElementById('game-timer');

  if (!canvas || !overlay || !startBtn) return;

  const ctx = canvas.getContext('2d');
  let gameRunning = false;
  let score = 0;
  let timeLeft = 25;
  let gameInterval = null;
  let items = [];
  let basketX = 150;
  const basketWidth = 90;
  const basketHeight = 22;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    basketX = canvas.width / 2 - basketWidth / 2;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left - basketWidth / 2;
  });

  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches[0]) {
      basketX = e.touches[0].clientX - rect.left - basketWidth / 2;
    }
  }, { passive: true });

  const itemTypes = [
    { name: 'dorayaki', emoji: '🥞', points: 10, speed: 2.8 },
    { name: 'chocobi', emoji: '🍫', points: 15, speed: 3.2 },
    { name: 'bell', emoji: '🔔', points: 20, speed: 3.6 },
    { name: 'action', emoji: '🦸‍♂️', points: 30, speed: 4.2 },
    { name: 'capsicum', emoji: '🫑', points: -10, speed: 3.0 }
  ];

  function spawnItem() {
    if (!gameRunning) return;
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    items.push({
      x: Math.random() * (canvas.width - 40) + 20,
      y: -20,
      type: type,
      speed: type.speed + Math.random() * 1.5
    });
  }

  function gameLoop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (basketX < 0) basketX = 0;
    if (basketX > canvas.width - basketWidth) basketX = canvas.width - basketWidth;

    ctx.fillStyle = '#ff3366';
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(basketX, canvas.height - basketHeight - 12, basketWidth, basketHeight, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎁 SUPUU', basketX + basketWidth / 2, canvas.height - 18);

    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed;

      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.fillText(it.type.emoji, it.x, it.y);

      const basketY = canvas.height - basketHeight - 12;
      if (
        it.y >= basketY - 10 &&
        it.y <= basketY + basketHeight &&
        it.x >= basketX - 10 &&
        it.x <= basketX + basketWidth + 10
      ) {
        score += it.type.points;
        if (score < 0) score = 0;
        scoreEl.textContent = score;
        
        if (it.type.points > 0) {
          playPopSound();
        } else {
          playBoingSound();
        }

        items.splice(i, 1);
        continue;
      }

      if (it.y > canvas.height + 30) {
        items.splice(i, 1);
      }
    }

    requestAnimationFrame(gameLoop);
  }

  startBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    score = 0;
    timeLeft = 25;
    items = [];
    scoreEl.textContent = score;
    timerEl.textContent = timeLeft + 's';
    gameRunning = true;

    playGadgetChime();

    const spawnTimer = setInterval(spawnItem, 600);

    gameInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft + 's';

      if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(spawnTimer);
        gameRunning = false;
        overlay.style.display = 'flex';
        overlay.innerHTML = `
          <h3>🏆 PARTY CHAMPION! 🏆</h3>
          <p style="font-size: 1.3rem; margin-bottom: 1rem;">
            Awesome! You collected <strong>${score} treats</strong> for birthday girl ${nickname}!
          </p>
          <p style="font-size: 1rem; color: #fde047; margin-bottom: 1.5rem;">
            Doraemon & Sufiyan awarded you 100 dorayakis and Shinchan's seal of excellence!
          </p>
          <button id="restart-game-btn" class="btn-party">Play Again 🎮</button>
        `;
        playGadgetChime();
        launchMassiveConfetti();

        document.getElementById('restart-game-btn')?.addEventListener('click', () => {
          overlay.style.display = 'none';
          initMiniGame();
          startBtn.click();
        });
      }
    }, 1000);

    gameLoop();
  });
}

// ==========================================
// HIGH PERFORMANCE CANVASES CONFETTI
// ==========================================
let confettiParticles = [];

function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function confettiLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.life -= 0.012;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      if (p.life <= 0 || p.y > canvas.height + 50) {
        confettiParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(confettiLoop);
  }

  confettiLoop();
}

function launchConfettiBurst(x, y) {
  const colors = ['#ff3366', '#00a2ed', '#ffd700', '#2ecc71', '#ff761a', '#a855f7', '#ffffff'];
  const shapes = ['rect', 'circle', 'star'];
  for (let i = 0; i < 45; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    confettiParticles.push({
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      gravity: 0.15,
      size: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      life: 1.0
    });
  }
}

function launchMassiveConfetti() {
  launchConfettiBurst(window.innerWidth * 0.2, window.innerHeight * 0.4);
  launchConfettiBurst(window.innerWidth * 0.5, window.innerHeight * 0.3);
  launchConfettiBurst(window.innerWidth * 0.8, window.innerHeight * 0.4);
}

// ==========================================
// SHARE OUR FEELINGS & MEMORIES ENGINE
// ==========================================
let feelingNotes = [];
let selectedNoteColor = '#fef08a';
let isVoiceNotePlaying = false;

function initFeelingsSection() {
  const savedNotes = localStorage.getItem('bday_feelings_notes');
  if (savedNotes) {
    try {
      feelingNotes = JSON.parse(savedNotes);
    } catch (e) {
      feelingNotes = [];
    }
  }

  if (!feelingNotes || feelingNotes.length === 0) {
    feelingNotes = [
      {
        id: 1,
        text: `You have one of the purest, kindest hearts, ${nickname}. Never let the world dim your sweetness and bright smile! 🌟`,
        author: senderName,
        color: '#fef08a',
        rotation: -2,
        time: 'Special Birthday Note'
      },
      {
        id: 2,
        text: `Whenever you doubt yourself, remember how much potential and grace you carry. I am proud of your journey always! 💖`,
        author: senderName,
        color: '#fbcfe8',
        rotation: 2.5,
        time: "From Sufiyan's Heart"
      },
      {
        id: 3,
        text: `Just like Doraemon never leaves Nobita, you can always count on my support, laughs, and friendship! 🐱✨`,
        author: senderName,
        color: '#bae6fd',
        rotation: -1.5,
        time: 'Friendship Promise'
      }
    ];
    localStorage.setItem('bday_feelings_notes', JSON.stringify(feelingNotes));
  }

  renderStickyNotes();
}

function renderStickyNotes() {
  const grid = document.getElementById('sticky-notes-grid');
  if (!grid) return;
  grid.innerHTML = '';

  feelingNotes.forEach(note => {
    const el = document.createElement('div');
    el.className = 'sticky-note';
    el.style.backgroundColor = note.color;
    el.style.transform = `rotate(${note.rotation || 0}deg)`;

    el.innerHTML = `
      <div class="note-pin"></div>
      <div class="note-body">"${note.text}"</div>
      <div class="note-footer">
        <span>✍️ <strong>${note.author}</strong></span>
        <span>${note.time}</span>
      </div>
    `;
    grid.appendChild(el);
  });
}

function switchDiaryTab(tabId) {
  playGadgetChime();
  document.querySelectorAll('.diary-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.diary-page-content').forEach(p => p.classList.remove('active'));

  const activeBtn = Array.from(document.querySelectorAll('.diary-tab-btn')).find(b => b.getAttribute('onclick')?.includes(tabId));
  if (activeBtn) activeBtn.classList.add('active');

  const page = document.getElementById('diary-' + tabId);
  if (page) page.classList.add('active');
}

function selectNoteColor(el, color) {
  selectedNoteColor = color;
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
  playBoingSound();
}

function postNewFeelingNote() {
  const textarea = document.getElementById('note-input-text');
  if (!textarea || textarea.value.trim() === '') {
    alert('Please write a short feeling or message first! 💌');
    textarea?.focus();
    return;
  }

  const text = textarea.value.trim();
  const newNote = {
    id: Date.now(),
    text: text,
    author: nickname || friendName,
    color: selectedNoteColor,
    rotation: (Math.random() - 0.5) * 5,
    time: 'Just now'
  };

  feelingNotes.unshift(newNote);
  localStorage.setItem('bday_feelings_notes', JSON.stringify(feelingNotes));
  textarea.value = '';

  playPopSound();
  launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.7);
  renderStickyNotes();
}

function triggerMoodResponse(moodKey) {
  const box = document.getElementById('mood-response-box');
  if (!box) return;

  const responses = {
    'emotional': {
      title: `🥺 Sending you a Big Warm Friendship Hug!`,
      text: `Doraemon says: <em>"Aww, Supuu! It is totally wonderful to feel emotional today. Sufiyan spent so much time crafting this entire universe just to make your birthday special and see you smile!"</em><br><br>Shinchan adds: <em>"Hehehe, don't cry Supuu or my eyebrows will get wet! You are loved so much!"</em>`,
      voice: `Aww Supuu, sending you a warm hug from Doraemon and Sufiyan! You are so loved!`,
      sound: 'chime'
    },
    'hyped': {
      title: `🥳 MAXIMUM PARTY ENERGY ACTIVATED!`,
      text: `Shinchan yells: <em>"WAHAHAHA! Action Kamen music on full volume! Dance the Buri Buri dance, pop every single balloon, and eat cake until your belly is as round as Doraemon's!"</em>`,
      voice: `Action Kamen party time! Have the best birthday ever, Supuu!`,
      sound: 'fanfare'
    },
    'grateful': {
      title: `😌 Peaceful, Grateful & Blessed!`,
      text: `Doraemon says: <em>"Gratitude is the true magic that multiplies happiness. Sufiyan is just as grateful to have you as a wonderful, genuine friend in his life. May peace and warmth follow you every single day!"</em>`,
      voice: `Gratitude makes life beautiful. Happy birthday Supuu, from Sufiyan!`,
      sound: 'chime'
    },
    'comfort': {
      title: `🌸 A Cozy Warm Blanket for Supuu!`,
      text: `Doraemon took out his 22nd-century <strong>Cozy Comfort Blanket</strong>: <em>"Whenever you feel tired or overwhelmed, take a deep breath. You are doing fantastic, and you always have friends who believe in you 100%!"</em>`,
      voice: `Take a deep breath and relax, Supuu. You are doing fantastic!`,
      sound: 'chime'
    },
    'hungry': {
      title: `🥞 Feast Time for Birthday Queen Supuu!`,
      text: `Shinchan says: <em>"Dorayaki, Chocobi, pastries, and ice cream! Sufiyan, take Supuu out for a grand treat immediately!"</em><br><br>Doraemon agrees: <em>"I'm sharing my secret mountain of dorayaki with you today, Supuu!"</em>`,
      voice: `Feast time for birthday queen Supuu! Eat lots of cake!`,
      sound: 'boing'
    }
  };

  const current = responses[moodKey];
  if (!current) return;

  box.style.display = 'block';
  box.innerHTML = `
    <h4 style="font-family: 'Titan One', cursive; color: #ff3366; font-size: 1.3rem; margin-bottom: 0.6rem;">
      ${current.title}
    </h4>
    <p style="font-size: 1.05rem; line-height: 1.6; color: #334155;">
      ${current.text}
    </p>
  `;

  if (current.sound === 'fanfare') {
    playGadgetChime();
    launchMassiveConfetti();
  } else if (current.sound === 'boing') {
    playBoingSound();
    launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.7);
  } else {
    playGadgetChime();
    launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.7);
  }

  speakShinchanVoice(current.voice);
}

// Voice Note Simulation
function playSufiyanVoiceNote() {
  const cassette = document.getElementById('cassette-player');
  const btn = document.getElementById('btn-play-voice-note');
  const status = document.getElementById('cassette-status');

  if (!isVoiceNotePlaying) {
    isVoiceNotePlaying = true;
    cassette?.classList.add('playing');
    if (btn) btn.innerHTML = '<span>⏸️ Pause Message</span>';
    if (status) status.innerHTML = `<span style="color: #38bdf8;">▶️ Playing: "Dearest Supuu, Happy Birthday! Thank you for being such an awesome friend..."</span>`;

    // Gentle ambient synth chords
    const ctx = getAudioContext();
    const chords = [392.00, 440.00, 523.25, 659.25]; // G4, A4, C5, E5
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.15;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 2.6);
    });

    // Voice reading
    const speech = `Dear Supuu... Sufiyan here. Wishing you the happiest and most joyful birthday. Thank you for your warmth, your laughs, and your friendship. I hope today and every day ahead brings you endless reasons to smile. Happy Birthday, my wonderful friend!`;
    speakShinchanVoice(speech);

    setTimeout(() => {
      isVoiceNotePlaying = false;
      cassette?.classList.remove('playing');
      if (btn) btn.innerHTML = '<span>▶️ Replay Message</span>';
      if (status) status.innerHTML = `Track: "A Heartfelt Birthday Wish for Supuu" (Completed with love ❤️)`;
    }, 11000);
  } else {
    isVoiceNotePlaying = false;
    cassette?.classList.remove('playing');
    if (btn) btn.innerHTML = '<span>▶️ Listen to Message</span>';
    if (status) status.textContent = 'Track: "A Heartfelt Birthday Wish for Supuu" (Paused)';
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
}

// ==========================================
// HAPPY ENDING: GOOD NIGHT & BEDTIME ENGINE
// ==========================================
let isBedtimeActive = false;
let lullabyInterval = null;
let lullabyNoteIdx = 0;

// Gentle soothing chimes lullaby (Twinkle Twinkle / Brahms Lullaby tone)
const lullabyNotes = [
  { f: 523.25, d: 0.6 }, // C5
  { f: 523.25, d: 0.6 }, // C5
  { f: 783.99, d: 0.6 }, // G5
  { f: 783.99, d: 0.6 }, // G5
  { f: 880.00, d: 0.6 }, // A5
  { f: 880.00, d: 0.6 }, // A5
  { f: 783.99, d: 1.2 }, // G5

  { f: 698.46, d: 0.6 }, // F5
  { f: 698.46, d: 0.6 }, // F5
  { f: 659.25, d: 0.6 }, // E5
  { f: 659.25, d: 0.6 }, // E5
  { f: 587.33, d: 0.6 }, // D5
  { f: 587.33, d: 0.6 }, // D5
  { f: 523.25, d: 1.2 }  // C5
];

function playNextLullabyNote() {
  if (!isBedtimeActive) return;
  const note = lullabyNotes[lullabyNoteIdx];
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.f, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.d * 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + note.d * 1.5);
  } catch (e) {
    console.warn(e);
  }

  lullabyNoteIdx = (lullabyNoteIdx + 1) % lullabyNotes.length;
  lullabyInterval = setTimeout(playNextLullabyNote, note.d * 1000 + 120);
}

function startLullaby() {
  if (isAudioPlaying) stopMusic();
  lullabyNoteIdx = 0;
  playNextLullabyNote();
}

function stopLullaby() {
  if (lullabyInterval) clearTimeout(lullabyInterval);
}

function toggleBedtimeMode() {
  const overlay = document.getElementById('bedtime-mode-overlay');
  if (!overlay) return;

  isBedtimeActive = !isBedtimeActive;

  if (isBedtimeActive) {
    overlay.classList.add('active');
    playBoingSound();
    startLullaby();
    speakShinchanVoice(`Good night Supuu... Sweet dreams and sleep tight from Sufiyan...`);
  } else {
    overlay.classList.remove('active');
    stopLullaby();
    playGadgetChime();
    launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
  }
}

// Shooting Star Wish Catcher
const bonusWishesPool = [
  { icon: '⭐', title: 'Answered Prayers', desc: 'May all your silent wishes and deepest aspirations be quietly and beautifully answered.' },
  { icon: '🌸', title: 'Gentle Mornings', desc: 'May every morning wake you with peaceful thoughts, fresh energy, and boundless hope.' },
  { icon: '🍫', title: 'Always Loved', desc: 'Remember that even on your quietest days, you hold a very special place in our hearts.' },
  { icon: '🌈', title: 'Pure Magic', desc: 'May life surprise you with extraordinary coincidences that bring you sheer happiness.' },
  { icon: '🐱', title: 'Doraemon Luck', desc: 'Doraemon placed a secret lucky charm beneath your pillow for good fortune all year!' },
  { icon: '🍰', title: 'Sweetest Tomorrows', desc: 'May every tomorrow be even sweeter than the sweetest piece of birthday cake.' }
];

let bonusWishIndex = 0;

function catchShootingStarWish() {
  const grid = document.getElementById('wishes-grid');
  playGadgetChime();

  const streak = document.createElement('div');
  streak.style.position = 'fixed';
  streak.style.top = (Math.random() * 40) + 'vh';
  streak.style.left = '-100px';
  streak.style.width = '160px';
  streak.style.height = '3px';
  streak.style.background = 'linear-gradient(90deg, transparent, #ffffff, #fde047)';
  streak.style.boxShadow = '0 0 15px #fde047';
  streak.style.transform = 'rotate(-25deg)';
  streak.style.zIndex = '25000';
  streak.style.transition = 'all 0.9s ease-out';
  document.body.appendChild(streak);

  setTimeout(() => {
    streak.style.left = '120vw';
    streak.style.top = '70vh';
    streak.style.opacity = '0';
    setTimeout(() => streak.remove(), 900);
  }, 20);

  if (grid) {
    const wish = bonusWishesPool[bonusWishIndex % bonusWishesPool.length];
    bonusWishIndex++;

    const card = document.createElement('div');
    card.className = 'wish-card';
    card.style.borderColor = '#fde047';
    card.style.background = 'rgba(79, 70, 229, 0.7)';
    card.innerHTML = `
      <span class="wish-icon">${wish.icon}</span>
      <div class="wish-title">🌟 Bonus: ${wish.title}</div>
      <div class="wish-desc">${wish.desc}</div>
    `;

    grid.insertBefore(card, grid.firstChild);
    launchConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.8);
    speakShinchanVoice(`Shooting star caught! New blessing for Supuu!`);
  }
}


