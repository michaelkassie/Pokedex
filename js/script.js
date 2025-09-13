

const pokemonRepository = (function () {
  const pokemonList = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    if (pokemon && typeof pokemon === 'object' && 'name' in pokemon && 'detailsUrl' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.error('Invalid Pokémon format.');
    }
  }

  function loadList() {
    return fetch(apiUrl)
      .then((response) => response.json())
      .then((json) => {
        json.results.forEach((item) => {
          add({ name: item.name, detailsUrl: item.url });
        });
      })
      .catch((error) => console.error('Failed to load Pokémon list:', error));
  }

  function loadDetails(pokemon) {
    return fetch(pokemon.detailsUrl)
      .then((response) => response.json())
      .then((details) => {
        // Sprites
        pokemon.imgUrl = details.sprites?.front_default || '';
        pokemon.bigImgUrl =
          details.sprites?.other?.['official-artwork']?.front_default || pokemon.imgUrl;

        // Stats
        pokemon.height = details.height;
        pokemon.weight = details.weight;

        // Types
        pokemon.types = (details.types || []).map((t) => capitalize(t.type.name));
      })
      .catch((error) => console.error('Failed to load Pokémon details:', error));
  }

  // Populate Bootstrap modal (open handled by data-bs-* attributes)
  function showDetails(pokemon) {
    const modalTitle = document.getElementById('pokemonModalLabel');
    const modalImage = document.getElementById('modalImage');
    const modalMeta = document.getElementById('modalMeta');
    const typeChips = document.getElementById('typeChips');

    modalTitle.textContent = 'Loading…';
    modalImage.src = '';
    modalMeta.textContent = '';
    typeChips.innerHTML = '';

    loadDetails(pokemon).then(() => {
      currentPokemon = pokemon; // used by Play Cry / Catch

      modalTitle.textContent = capitalize(pokemon.name);
      modalImage.src = pokemon.bigImgUrl || pokemon.imgUrl || '';
      modalImage.alt = pokemon.name;

      const h = pokemon.height != null ? pokemon.height : '?';
      const w = pokemon.weight != null ? pokemon.weight : '?';
      modalMeta.textContent = `Height: ${h}  •  Weight: ${w}`;

      typeChips.innerHTML = '';
      (pokemon.types || []).forEach((t) => {
        const span = document.createElement('span');
        span.className = `badge rounded-pill px-3 py-2 me-1 mb-1 type-chip ${typeClass(t)}`;
        span.textContent = t;
        typeChips.appendChild(span);
      });

      play(SFX.open);
    });
  }

  return { getAll, add, loadList, loadDetails, showDetails };
})();



// Elements
const gridEl = document.getElementById('pokemonGrid'); 
const searchInput = document.getElementById('search');

// Sound toggle
let soundOn = true;
const soundToggle = document.getElementById('soundToggle');
if (soundToggle) {
  const stored = localStorage.getItem('soundOn');
  if (stored !== null) {
    soundOn = stored === 'true';
    soundToggle.checked = soundOn;
  }
  soundToggle.addEventListener('change', (e) => {
    soundOn = e.target.checked;
    localStorage.setItem('soundOn', String(soundOn));
  });
}

// SFX
const SFX = {
  hover: new Audio('assets/sounds/ui-hover.mp3'),
  open: new Audio('assets/sounds/ui-open.mp3'),
  catch: new Audio('assets/sounds/ui-catch.mp3'),
  fail: new Audio('assets/sounds/ui-fail.mp3'),
};
Object.values(SFX).forEach((a) => {
  a.volume = 0.35;
  a.preload = 'auto';
});
function play(aud) {
  if (!soundOn || !aud) return;
  try {
    aud.currentTime = 0;
    aud.play();
  } catch (_) {}
}

// Confetti
function confettiBurst(x, y, count = 18) {
  const c = document.createElement('canvas');
  c.width = innerWidth;
  c.height = innerHeight;
  Object.assign(c.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    pointerEvents: 'none',
    zIndex: '9999',
  });
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const parts = Array.from({ length: count }).map(() => ({
    x,
    y,
    vx: (Math.random() * 2 - 1) * 5,
    vy: Math.random() * -6 - 4,
    g: 0.3,
    s: 3 + Math.random() * 3,
    a: 1,
    life: 60 + Math.random() * 30,
  }));
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, c.width, c.height);
    parts.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.g;
      p.a -= 0.012;
      p.life--;
      ctx.globalAlpha = Math.max(p.a, 0);
      const palette = ['#ff4757', '#ffa502', '#7bed9f', '#70a1ff', '#eccc68'];
      ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
      ctx.fillRect(p.x, p.y, p.s, p.s);
    });
    frames++;
    if (frames < 120) requestAnimationFrame(tick);
    else c.remove();
  })();
}



function clearGrid() {
  if (gridEl) gridEl.innerHTML = '';
}

function addGridCard(pokemon) {
  if (!gridEl) return;

  const card = document.createElement('div');
  card.className = 'pokemon-card';
  card.setAttribute('data-bs-toggle', 'modal');
  card.setAttribute('data-bs-target', '#pokemonModal');

  // Sprite
  const img = document.createElement('img');
  img.src = pokemon.imgUrl || '';
  img.alt = pokemon.name;

  // Name
  const name = document.createElement('h3');
  name.textContent = capitalize(pokemon.name);

  // Types
  const typesWrap = document.createElement('div');
  typesWrap.className = 'types';
  (pokemon.types || []).forEach((t) => {
    const span = document.createElement('span');
    span.className = `type-chip type-${t.toLowerCase()}`;
    span.textContent = t;
    typesWrap.appendChild(span);
  });

  card.append(img, name, typesWrap);

  card.addEventListener('mouseenter', () => play(SFX.hover));
  card.addEventListener('click', () => {
    pokemonRepository.showDetails(pokemon);
  });

  gridEl.appendChild(card);
}

function renderGrid(list) {
  clearGrid();
  list.forEach((p) => addGridCard(p));
}



let currentPokemon = null;

const playCryBtn = document.getElementById('playCry');
if (playCryBtn) {
  playCryBtn.addEventListener('click', () => {
    if (!currentPokemon || !soundOn) return;
    const filename = (currentPokemon.name || '').toLowerCase();
    const cry = new Audio(`assets/sounds/${filename}.mp3`);
    cry.volume = 0.5;
    try {
      cry.play();
    } catch (_) {}
  });
}

const catchBtn = document.getElementById('catchBtn');
if (catchBtn) {
  catchBtn.addEventListener('click', () => {
    const r = catchBtn.getBoundingClientRect();
    confettiBurst(r.left + r.width / 2, r.top);
    play(SFX.catch);
    
  });
}



if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    const base = pokemonRepository.getAll();
    const filtered = !q ? base : base.filter((p) => (p.name || '').toLowerCase().includes(q));
    renderGrid(filtered);
  });
}



pokemonRepository.loadList().then(() => {
  
  const loadPromises = pokemonRepository
    .getAll()
    .map((p) => pokemonRepository.loadDetails(p).catch(() => {}));
  Promise.all(loadPromises).then(() => {
    renderGrid(pokemonRepository.getAll());
  });
});


function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function typeClass(t) {
  return `type-${String(t || '').toLowerCase()}`;
}
