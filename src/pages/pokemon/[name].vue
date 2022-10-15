<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { ElNotification } from "element-plus";
import { useRoute } from "vue-router";
import getPokemonName from "@/utils/getPokemonName";
import axios from "axios";

const route = useRoute();
const pokemon = ref<any>(null);

const pokemonFlavourText = computed(() => {
  if (pokemon.value) {
    if (pokemon.value.species.flavor_text_entries) {
      const flavourText = pokemon.value.species.flavor_text_entries.filter(
        (flavour: any) => flavour.language.name === "en"
      );
      return flavourText[0].flavor_text;
    }
  }
  return "";
});

const fetchPokemon = async (name: string | string[]) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    const data = await response.data;
    pokemon.value = data;
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

const fetchPokemonSpecies = async (name: string | string[]) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    );
    const data = await response.json();
    pokemon.value = { ...pokemon.value, species: data };
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "There was an error fetching the pokemon species",
      type: "error",
      showClose: false,
      position: "bottom-right",
    });
  }
};

onMounted(async () => {
  await fetchPokemon(route.params.name);
  fetchPokemonSpecies(route.params.name);
});
</script>

<template>
  <main class="container mx-auto my-10" v-if="pokemon">
    <!-- Back to previous page link -->
    <div class="flex items-center justify-start mx-10 mb-4 md:mx-0">
      <router-link to="/">
        <el-button plain>
          <el-icon><ArrowLeft /></el-icon> Back
        </el-button>
      </router-link>
    </div>

    <div class="mx-10 md:flex md:mx-0">
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
        <p class="my-4">
          {{ pokemonFlavourText }}
        </p>
        <el-descriptions border title="Base Stats" class="mt-4">
          <template v-for="(stat, index) in pokemon.stats" :key="index">
            <el-descriptions-item
              :label="stat.stat.name"
              label-class-name="font-bold capitalize"
              >{{ stat.base_stat }}</el-descriptions-item
            >
          </template>
        </el-descriptions>
      </div>
    </div>
  </main>
</template>
