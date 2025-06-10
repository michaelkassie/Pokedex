/*alert("hello world");
let favoriteFood = "Pizza";
document.write(favoriteFood);*/

//let pokemonList=[];

let pokemonList = [
  { name: "bulbasaur", height: 7, types: ["poison", "grass"] },
  { name: "charmander", height: 6, types: ["fire"] },
  { name: "pikachu", height: 4, types: ["electric"] }
];

// Part 1 & 2: Loop through each Pokémon and display name and height
/*for (let i = 0; i < pokemonList.length; i++) {
  let pokemon = pokemonList[i]; // Current Pokémon object
  let output = pokemon.name + " (height: " + pokemon.height + ")";

  // Part 3: Add "Wow, that's big!" if height > 6
  if (pokemon.height > 6) {
    output += " - Wow, that's big!";
  }

  // Output to the DOM
  document.write("<p>" + output + "</p>");
}*/

pokemonList.forEach(function(pokemon) {
  let message = pokemon.name + " (height: " + pokemon.height + ")";
  if (pokemon.height > 6) {
    message += " - Wow, that’s big!";
  }
  document.write(message + "<br>");
});


