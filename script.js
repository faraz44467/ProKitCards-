// ─── ProKitCards v2 — script.js ────────────────────────────────────

// ─── Particles ───────────────────────────────────────────────────────
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
})();

// ─── Mode Toggle ─────────────────────────────────────────────────────
function setMode(mode) {
  const single  = document.getElementById('singleMode');
  const compare = document.getElementById('compareMode');
  const btnS    = document.getElementById('btnSingle');
  const btnC    = document.getElementById('btnCompare');

  if (mode === 'single') {
    single.classList.remove('hidden');
    compare.classList.add('hidden');
    btnS.classList.add('active');
    btnC.classList.remove('active');
  } else {
    compare.classList.remove('hidden');
    single.classList.add('hidden');
    btnC.classList.add('active');
    btnS.classList.remove('active');
    compareCards();
  }
}

// ─── Card Type Selection ─────────────────────────────────────────────
function selectType(btn, cardNum) {
  const grid = document.getElementById('typeGrid' + cardNum);
  grid.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const [c1, c2, c3] = btn.dataset.color.split(',');
  applyTheme(cardNum, c1, c2, c3);
}

function applyTheme(cardNum, c1, c2, c3) {
  const bg = document.getElementById('bg' + cardNum);
  if (bg) {
    bg.style.background = `linear-gradient(160deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`;
  }
}

// ─── Photo Upload ─────────────────────────────────────────────────────
function loadPhoto(input, cardNum) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const photoEl = document.getElementById('cph' + cardNum);
    if (photoEl) {
      photoEl.innerHTML = `<img src="${e.target.result}" alt="Player"/>`;
    }
  };
  reader.readAsDataURL(file);
}

// ─── Update Card Preview ──────────────────────────────────────────────
function updateCard(n) {
  const get = id => document.getElementById(id);

  // Name
  const nameEl = get('name' + n);
  if (nameEl && get('cn' + n)) {
    get('cn' + n).textContent = (nameEl.value || 'PLAYER').toUpperCase();
  }

  // Rating
  const ratingEl = get('rating' + n);
  if (ratingEl && get('cr' + n)) {
    get('cr' + n).textContent = ratingEl.value || '—';
  }

  // Position
  const posEl = get('pos' + n);
  if (posEl && get('cp' + n)) {
    get('cp' + n).textContent = posEl.value;
  }

  // Nation
  const nationEl = get('nation' + n);
  if (nationEl && get('cf' + n)) {
    get('cf' + n).textContent = nationEl.value;
  }

  // Club
  const clubEl = get('club' + n);
  if (clubEl && get('ccl' + n)) {
    get('ccl' + n).textContent = clubEl.value || '—';
  }

  // Stats
  const statKeys = ['pac','sho','pas','dri','def','phy'];
  const statEls  = get('cst' + n) ? get('cst' + n).querySelectorAll('.stat-item') : [];
  statKeys.forEach((key, i) => {
    const inp = get('s' + n + '-' + key);
    if (inp && statEls[i]) {
      statEls[i].querySelector('.sv').textContent = inp.value || '0';
    }
  });
}

// ─── Compare Logic ────────────────────────────────────────────────────
const STATS = ['pac','sho','pas','dri','def','phy'];

function compareCards() {
  let winsA = 0, winsB = 0;

  STATS.forEach(stat => {
    const aVal = parseInt(document.getElementById('s2-' + stat)?.value) || 0;
    const bVal = parseInt(document.getElementById('s3-' + stat)?.value) || 0;
    const total = aVal + bVal || 1;

    // Update bar values
    const barA = document.getElementById('bar-a-' + stat);
    const barB = document.getElementById('bar-b-' + stat);
    if (barA) barA.textContent = aVal;
    if (barB) barB.textContent = bVal;

    // Fill bars proportionally
    const fillA = document.getElementById('fill-a-' + stat);
    const fillB = document.getElementById('fill-b-' + stat);
    const pctA  = Math.round((aVal / total) * 100);
    const pctB  = 100 - pctA;
    if (fillA) fillA.style.width = pctA + '%';
    if (fillB) fillB.style.width = pctB + '%';

    // Track wins
    if (aVal > bVal) winsA++;
    else if (bVal > aVal) winsB++;
  });

  // Winner banner
  const banner = document.getElementById('winnerBanner');
  const nameEl = document.getElementById('winnerName');
  if (!banner || !nameEl) return;

  const nameA = (document.getElementById('name2')?.value || 'PLAYER A').toUpperCase();
  const nameB = (document.getElementById('name3')?.value || 'PLAYER B').toUpperCase();

  if (winsA > winsB) {
    nameEl.textContent = nameA + ' wins!';
    banner.style.color = 'var(--a-color)';
    banner.style.borderColor = 'rgba(0,212,255,.4)';
    banner.style.background  = 'rgba(0,212,255,.08)';
  } else if (winsB > winsA) {
    nameEl.textContent = nameB + ' wins!';
    banner.style.color = 'var(--b-color)';
    banner.style.borderColor = 'rgba(255,64,96,.4)';
    banner.style.background  = 'rgba(255,64,96,.08)';
  } else {
    nameEl.textContent = "It's a draw!";
    banner.style.color = 'var(--gold2)';
    banner.style.borderColor = 'rgba(212,168,67,.3)';
    banner.style.background  = 'rgba(212,168,67,.08)';
  }
}

// ─── 3D Tilt on Mouse Move ────────────────────────────────────────────
document.querySelectorAll('.fifa-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.06)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── Download Card ────────────────────────────────────────────────────
function downloadCard(cardId) {
  const card = document.getElementById(cardId);
  const playerName = document.getElementById('name1')?.value || 'player';

  const doCapture = () => {
    html2canvas(card, { scale: 3, useCORS: true, backgroundColor: null }).then(canvas => {
      const link = document.createElement('a');
      link.download = playerName.toLowerCase() + '_prokit_card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  if (typeof html2canvas !== 'undefined') {
    doCapture();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = doCapture;
    document.head.appendChild(script);
  }
}

// ─── Init ────────────────────────────────────────────────────────────
(function init() {
  applyTheme(1, '#d4a843', '#7a4f00', '#f5d978');
  applyTheme(2, '#d4a843', '#7a4f00', '#f5d978');
  applyTheme(3, '#d4a843', '#7a4f00', '#f5d978');

  updateCard(1);
  updateCard(2);
  updateCard(3);
  compareCards();
})();