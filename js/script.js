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

  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');

    button.innerText = pokemon.name;
    button.classList.add('pokemon-button');
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);

    // Add event listener to load and show details
    button.addEventListener('click', function () {
      showDetails(pokemon);
    });
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
        // Add details to the Pokémon object
        pokemon.imgUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.types = details.types.map(t => t.type.name);
        return pokemon;
      })
      .catch(error => {
        console.error('Failed to load Pokémon details:', error);
      });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      console.log(pokemon);
    });
  }

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();

// Load the Pokémon list from API, then render it
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
