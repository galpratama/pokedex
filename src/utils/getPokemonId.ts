const getPokemonId = (url: string) => {
  const id = url.split("/")[6];
  return id;
};

export default getPokemonId;
