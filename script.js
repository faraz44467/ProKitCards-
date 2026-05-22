// ─── ProKitCards — script.js ────────────────────────────────────────

// Card type colour palettes [gradient-start, gradient-mid, gradient-end]
const CARD_THEMES = {
  gold:   ['#d4a843', '#a07020', '#f5d978'],
  silver: ['#b0b8c8', '#7a8898', '#dde4f0'],
  toty:   ['#1a1aff', '#0000aa', '#7ab4ff'],
  inform: ['#2ecc71', '#1a7a44', '#a8f0c8'],
  icon:   ['#b44aff', '#6600cc', '#e0aaff'],
  tots:   ['#ff4040', '#aa0000', '#ffaaaa'],
};

// ─── Element References ──────────────────────────────────────────────
const playerName    = document.getElementById('playerName');
const playerRating  = document.getElementById('playerRating');
const playerPos     = document.getElementById('playerPosition');
const playerNation  = document.getElementById('playerNation');
const playerClub    = document.getElementById('playerClub');
const photoInput    = document.getElementById('photoInput');

const cardName    = document.getElementById('cardName');
const cardRating  = document.getElementById('cardRating');
const cardPos     = document.getElementById('cardPos');
const cardFlag    = document.getElementById('cardFlag');
const cardClub    = document.getElementById('cardClub');
const cardPhoto   = document.getElementById('cardPhoto');
const cardStats   = document.getElementById('cardStats');
const cardBg      = document.querySelector('.card-bg');

const statIds = ['pac','sho','pas','dri','def','phy'];

// ─── Live Update Functions ────────────────────────────────────────────

function updateName()   { cardName.textContent   = playerName.value.toUpperCase() || 'PLAYER'; }
function updateRating() { cardRating.textContent  = playerRating.value || '90'; }
function updatePos()    { cardPos.textContent     = playerPos.value; }
function updateFlag()   { cardFlag.textContent    = playerNation.value; }
function updateClub()   { cardClub.textContent    = playerClub.value || 'Club Name'; }

function updateStats() {
  const statEls = cardStats.querySelectorAll('.stat-item');
  statIds.forEach((id, i) => {
    const input = document.getElementById('stat-' + id);
    if (input && statEls[i]) {
      statEls[i].querySelector('.sv').textContent = input.value || '0';
    }
  });
}

function setCardTheme(colors) {
  document.documentElement.style.setProperty('--card-c1', colors[0]);
  document.documentElement.style.setProperty('--card-c2', colors[1]);
  document.documentElement.style.setProperty('--card-c3', colors[2]);
  cardBg.style.background =
    `linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 55%, ${colors[2]} 100%)`;
}

// ─── Card Type Buttons ────────────────────────────────────────────────
document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const colors = btn.dataset.color.split(',');
    setCardTheme(colors);
  });
});

// ─── Photo Upload ─────────────────────────────────────────────────────
photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    cardPhoto.innerHTML = `<img src="${e.target.result}" alt="Player photo" />`;
  };
  reader.readAsDataURL(file);
});

// ─── Event Listeners ─────────────────────────────────────────────────
playerName.addEventListener('input',   updateName);
playerRating.addEventListener('input', updateRating);
playerPos.addEventListener('change',   updatePos);
playerNation.addEventListener('change',updateFlag);
playerClub.addEventListener('input',   updateClub);
statIds.forEach(id => {
  const el = document.getElementById('stat-' + id);
  if (el) el.addEventListener('input', updateStats);
});

// ─── Download Card ─────────────────────────────────────────────────────
document.getElementById('downloadBtn').addEventListener('click', () => {
  const card = document.getElementById('fifaCard');

  // Use html2canvas if available, otherwise prompt user
  if (typeof html2canvas !== 'undefined') {
    html2canvas(card, { scale: 3, useCORS: true, backgroundColor: null }).then(canvas => {
      const link = document.createElement('a');
      link.download = (playerName.value || 'player') + '_prokit_card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  } else {
    // Fallback: load html2canvas dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => {
      html2canvas(card, { scale: 3, useCORS: true, backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = (playerName.value || 'player') + '_prokit_card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    };
    document.head.appendChild(script);
  }
});

// ─── Initialise Defaults ───────────────────────────────────────────────
updateName();
updateRating();
updatePos();
updateFlag();
updateClub();
updateStats();
setCardTheme(CARD_THEMES.gold);