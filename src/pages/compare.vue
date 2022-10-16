<script setup lang="ts">
import axios from "axios";
import { ElNotification } from "element-plus";
import { ref, onMounted } from "vue";
import getPokemonName from "@/utils/getPokemonName";
import getPokemonId from "@/utils/getPokemonId";
import { Delete } from "@element-plus/icons-vue";

interface Pokemon {
  name: string;
  url: string;
}

const pokemons = ref<Pokemon[]>([]);
const selectedPokemon = ref<string>("");
const comparedPokemons = ref<Array<any>>([]);

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? pokemons.value.filter(createFilter(queryString))
    : pokemons.value;
  cb(results);
};

const createFilter = (queryString: string) => {
  return (pokemon: Pokemon) => {
    return pokemon.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};

const fetchAllPokemons = async () => {
  try {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=10000"
    );
    const data = await response.data;
    pokemons.value = data.results;
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "There was an error fetching the pokemons",
      type: "error",
      showClose: false,
      position: "bottom-right",
    });
  }
};

const fetchPokemon = async (name: string | Pokemon) => {
  if (typeof name === "object") {
    name = name.name;
  }
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    comparedPokemons.value.push(response.data);
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "There was an error fetching the pokemon",
      type: "error",
      showClose: false,
      position: "bottom-right",
    });
  }
};

onMounted(async () => {
  await fetchAllPokemons();
});
</script>

<template>
  <main>
    <div
      class="container grid grid-cols-1 mx-10 my-10 md:mx-auto md:grid-cols-2"
    >
      <div class="mb-2">
        <h1 class="text-2xl">Compare Pokémon</h1>
        <p>
          You can compare Pokémon here. Start adding pokemon by searching in the
          search box
        </p>
      </div>
      <div class="md:ml-auto">
        <el-autocomplete
          v-model="selectedPokemon"
          :fetch-suggestions="querySearch"
          clearable
          class="inline-input w-96"
          placeholder="Search pokémon here..."
          autofocus
          @select="fetchPokemon"
        >
          <template #default="{ item }">
            <div class="text-center value">
              <el-image
                lazy
                class="inline-block w-24 mx-auto"
                :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(
                  item.url
                )}.png`"
                :alt="item.name"
              />
              <div class="mb-4">{{ getPokemonName(item) }}</div>
            </div>
          </template>
        </el-autocomplete>
      </div>
    </div>
    <div
      class="container grid grid-cols-1 gap-5 mx-auto my-10 overflow-x-scroll sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="(pokemon, index) in comparedPokemons"
        :key="index"
        class="mx-10 sm:mx-0"
      >
        <div class="mr-2 md:mr-10">
          <img
            :src="pokemon.sprites.front_default"
            class="p-8 mb-10 rounded-lg shadow-md h-52"
            alt=""
          />
        </div>
        <div>
          <span>#{{ pokemon.id }}</span>
          <h1 class="mb-2 text-3xl">{{ getPokemonName(pokemon) }}</h1>
          <section class="pokemon-info">
            <template v-for="(type, index) in pokemon.types" :key="index">
              <el-tag class="mr-2" type="info">{{ type.type.name }}</el-tag>
            </template>
          </section>
          <section class="pokemon-stats">
            <table class="w-full mt-10" aria-describedby="Pokemon Stat">
              <thead>
                <tr class="font-bold">
                  <th class="text-left">Stat</th>
                  <th class="text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(stat, index) in pokemon.stats"
                  :key="index"
                  class="border-b"
                >
                  <td class="p-2 text-left">
                    {{ stat.stat.name.toUpperCase() }}
                  </td>
                  <td class="p-2 text-right">{{ stat.base_stat }}</td>
                </tr>
              </tbody>
            </table>
          </section>
          <div class="flex justify-end mt-10">
            <el-button
              plain
              type="danger"
              @click="comparedPokemons.splice(index, 1)"
              :icon="Delete"
              circle
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
