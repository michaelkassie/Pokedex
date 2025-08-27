let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

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
        pokemon.imgUrl = details.sprites.front_default;
        pokemon.height = details.height;
      })
      .catch((error) => console.error('Failed to load Pokémon details:', error));
  }

  // DO NOT open/close modal here; Bootstrap handles it via data attributes
  function showDetails(pokemon) {
    const modalTitle = document.getElementById('pokemonModalLabel');
    const modalBody = document.getElementById('pokemonModalBody');

    modalTitle.textContent = 'Loading...';
    modalBody.innerHTML = '<p class="mb-0">Please wait</p>';

    loadDetails(pokemon).then(() => {
      modalTitle.textContent = pokemon.name;
      modalBody.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <img src="${pokemon.imgUrl}" alt="${pokemon.name}" class="img-fluid" style="width:72px;height:72px;">
          <div>
            <p class="mb-1"><strong>Height:</strong> ${pokemon.height}</p>
          </div>
        </div>
      `;
    });
  }

  return { getAll, add, loadList, loadDetails, showDetails };
})();

function addListItem(pokemon) {
  const list = document.querySelector('.pokemon-list');
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';

  const label = document.createElement('span');
  label.textContent = pokemon.name;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Details';
  btn.className = 'btn btn-primary btn-sm';
  btn.setAttribute('data-bs-toggle', 'modal');
  btn.setAttribute('data-bs-target', '#pokemonModal');

  btn.addEventListener('click', () => {
    pokemonRepository.showDetails(pokemon); // only sets content
  });

  li.appendChild(label);
  li.appendChild(btn);
  list.appendChild(li);
}

pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach((pokemon) => addListItem(pokemon));
});
