let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    if (typeof pokemon === 'object' && 'name' in pokemon && 'detailsUrl' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.error('Invalid Pokémon format.');
    }
  }

  function loadList() {
    return fetch(apiUrl)
      .then(response => response.json())
      .then(json => {
        json.results.forEach(item => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(error => {
        console.error('Failed to load Pokémon list:', error);
      });
  }

  function loadDetails(pokemon) {
    return fetch(pokemon.detailsUrl)
      .then(response => response.json())
      .then(details => {
        pokemon.imgUrl = details.sprites.front_default;
        pokemon.height = details.height;
      })
      .catch(error => {
        console.error('Failed to load Pokémon details:', error);
      });
  }

  // Simple modal in showDetails
  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      let modalContainer = document.querySelector('#modal-container');
      modalContainer.innerHTML = '';

      let modal = document.createElement('div');
      modal.classList.add('modal');

      let closeButton = document.createElement('button');
      closeButton.innerText = 'Close';
      closeButton.classList.add('modal-close');
      closeButton.addEventListener('click', () => {
        modalContainer.classList.remove('is-visible');
      });

      let title = document.createElement('h2');
      title.innerText = pokemon.name;

      let content = document.createElement('p');
      content.innerText = 'Height: ' + pokemon.height;

      let image = document.createElement('img');
      image.src = pokemon.imgUrl;
      image.alt = pokemon.name;

      modal.appendChild(closeButton);
      modal.appendChild(title);
      modal.appendChild(content);
      modal.appendChild(image);
      modalContainer.appendChild(modal);

      modalContainer.classList.add('is-visible');
    });
  }

  return {
    getAll,
    add,
    loadList,
    loadDetails,
    showDetails
  };
})();

// Renders Pokémon list
function addListItem(pokemon) {
  let pokemonListElement = document.querySelector('.pokemon-list');
  let listItem = document.createElement('li');
  let button = document.createElement('button');
  button.innerText = pokemon.name;
  button.classList.add('pokemon-button');
  listItem.appendChild(button);
  pokemonListElement.appendChild(listItem);

  button.addEventListener('click', function () {
    pokemonRepository.showDetails(pokemon);
  });
}

// Close modal with ESC
window.addEventListener('keydown', (e) => {
  let modalContainer = document.querySelector('#modal-container');
  if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
    modalContainer.classList.remove('is-visible');
  }
});

// Close modal by clicking outside
document.querySelector('#modal-container').addEventListener('click', (e) => {
  if (e.target === document.querySelector('#modal-container')) {
    e.target.classList.remove('is-visible');
  }
});

// Load and render
pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach((pokemon) => {
    addListItem(pokemon);
  });
});
