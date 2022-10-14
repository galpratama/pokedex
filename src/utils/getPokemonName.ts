type Pokemon = {
  name: string;
  url: string;
};

const getPokemonName = (pokemon: Pokemon) => {
  return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
};

export default getPokemonName;
