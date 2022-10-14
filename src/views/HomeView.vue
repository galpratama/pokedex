<script setup lang="ts">
import { onMounted, ref } from "vue";
type Pokemon = {
  name: string;
  url: string;
};

const pokemons = ref<Pokemon[]>([]);
const offset = ref(0);

const fetchPokemon = async ({
  offset = 0,
  limit = 24,
}: {
  offset?: number;
  limit?: number;
}) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    pokemons.value = data.results;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const getPokemonId = (url: string) => {
  const id = url.split("/")[6];
  return id;
};

onMounted(() => {
  fetchPokemon({ offset: offset.value });
});

// Data
</script>

<template>
  <main class="container mx-auto my-10">
    <el-row>
      <el-col
        v-for="(pokemon, index) in pokemons"
        infinite-scroll-delay="1000"
        :key="index"
        :xs="8"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="1"
      >
        <el-card class="m-2 rounded-xl">
          <div class="p-4 text-center">
            <img
              class="h-24 mx-auto mb-8"
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${getPokemonId(
                pokemon.url
              )}.svg`"
              :alt="pokemon.name"
            />
            <span>{{ pokemon.name }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </main>
</template>
