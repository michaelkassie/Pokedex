let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  // Function to get all Pokémon
  function getAll() {
    return pokemonList;
  }

  // Function to add a Pokémon to the list
  function add(pokemon) {
    if (typeof pokemon === 'object' && 'name' in pokemon && 'detailsUrl' in pokemon) {
      pokemonList.push(pokemon);
    } else {
      console.error('Invalid Pokémon format.');
    }
  }

  // Function to fetch the list of Pokémon from the API
  function loadList() {
    return fetch(apiUrl)
      .then(response => response.json())
      .then(json => {
        json.results.forEach(item => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon); // Add each Pokémon to the list
        });
      })
      .catch(error => {
        console.error('Failed to load Pokémon list:', error);
      });
  }

  // Function to fetch detailed data of a Pokémon
  function loadDetails(pokemon) {
    return fetch(pokemon.detailsUrl)
      .then(response => response.json())
      .then(details => {
        pokemon.imgUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.types = details.types.map(t => t.type.name);
      })
      .catch(error => {
        console.error('Failed to load Pokémon details:', error);
      });
  }

  // Function to show Pokémon details in the console (instead of a modal)
  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      // Log Pokémon details to the console
      console.log(`Name: ${pokemon.name}`);
      console.log(`Height: ${pokemon.height}`);
      console.log(`Types: ${pokemon.types.join(', ')}`);
      console.log(`Image URL: ${pokemon.imgUrl}`);
    });
  }

  // Expose public methods
  return {
    getAll: getAll,
    add: add,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails
  };
})();

// Function to add a Pokémon item to the list on the page
function addListItem(pokemon) {
  let pokemonListElement = document.querySelector('.pokemon-list');
  let listItem = document.createElement('li');
  let button = document.createElement('button');

  button.innerText = pokemon.name;
  button.classList.add('pokemon-button');
  listItem.appendChild(button);
  pokemonListElement.appendChild(listItem);

  // Event listener to show Pokémon details when clicked
  button.addEventListener('click', function () {
    pokemonRepository.showDetails(pokemon);
  });
}

// Load Pokémon list from the API and render each Pokémon
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    addListItem(pokemon);  // Call addListItem to display each Pokémon
  });
});
