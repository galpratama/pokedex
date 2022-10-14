<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElNotification } from "element-plus";
import getPokemonName from "@/utils/getPokemonName";

type Pokemon = {
  name: string;
  url: string;
};

const pokemons = ref<Pokemon[]>([]);
const offset = ref<number>(0);

const fetchPokemons = async ({
  offset = 0,
  limit = 8,
}: {
  offset?: number;
  limit?: number;
}) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    pokemons.value = [...pokemons.value, ...data.results];
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

const loadMore = () => {
  offset.value += 8;
  fetchPokemons({ offset: offset.value });
};

const getPokemonId = (url: string) => {
  const id = url.split("/")[6];
  return id;
};

onMounted(() => {
  fetchPokemons({ offset: offset.value });
});
</script>

<template>
  <main class="container mx-auto my-10">
    <el-row
      v-loading="pokemons.length === 0"
      v-infinite-scroll="loadMore"
      infinite-scroll-delay="100"
    >
      <el-col
        v-for="(pokemon, index) in pokemons"
        :key="index"
        :xs="8"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="1"
      >
        <el-card class="m-2 rounded-xl">
          <RouterLink
            class="block p-4 text-center"
            :to="`pokemon/${pokemon.name}`"
          >
            <el-image
              lazy
              class="h-24 mx-auto mb-8"
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(
                pokemon.url
              )}.png`"
              :alt="pokemon.name"
            />
            <span>{{ getPokemonName(pokemon) }}</span>
          </RouterLink>
        </el-card>
      </el-col>
    </el-row>
  </main>
</template>
