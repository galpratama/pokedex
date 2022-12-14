<script setup lang="ts">
import { ref, computed } from "vue";
import getPokemonName from "@/utils/getPokemonName";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

// Types
const types = ref<string[]>([
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
]);
const checkedTypes = ref<string[]>(types.value);
const checkAllTypes = ref<boolean>(false);
const isTypesIndeterminate = ref<boolean>(false);
const handleCheckAllTypesChange = (value: boolean) => {
  checkedTypes.value = value ? types.value : [];
  isTypesIndeterminate.value = false;
  refresh();
};
const handleCheckedTypesChange = (value: string[]) => {
  checkedTypes.value = value;
  isTypesIndeterminate.value =
    value.length > 0 && value.length < types.value.length;
  refresh();
};

// Generation
const generation = ref<string[]>([
  "generation-i",
  "generation-ii",
  "generation-iii",
  "generation-iv",
  "generation-v",
  "generation-vi",
  "generation-vii",
  "generation-viii",
]);
const checkedGeneration = ref<string[]>(generation.value);
const checkAllGeneration = ref<boolean>(false);
const isGenerationIndeterminate = ref<boolean>(false);
const handleCheckAllGenerationChange = (value: boolean) => {
  checkedGeneration.value = value ? generation.value : [];
  isGenerationIndeterminate.value = false;
  refresh();
};
const handleCheckedGenerationChange = (value: string[]) => {
  checkedGeneration.value = value;
  isGenerationIndeterminate.value =
    value.length > 0 && value.length < generation.value.length;
  refresh();
};

// Pokemon
const pokemons = computed(() => result.value?.species ?? []);
const offset = ref<number>(0);
const { result, loading, fetchMore, refetch } = useQuery(
  gql`
    query getPokemons($offset: Int!, $type: [String], $generation: [String]) {
      species: pokemon_v2_pokemonspecies(
        limit: 24
        offset: $offset
        order_by: { id: asc }
        where: {
          pokemon_v2_pokemons: {
            pokemon_v2_pokemontypes: {
              pokemon_v2_type: { name: { _in: $type } }
            }
          }
          pokemon_v2_generation: { name: { _in: $generation } }
        }
      ) {
        id
        name
        pokemons: pokemon_v2_pokemons {
          id
          types: pokemon_v2_pokemontypes {
            type: pokemon_v2_type {
              name
            }
          }
        }
      }
    }
  `,
  {
    offset: offset.value,
    type: checkedTypes.value,
    generation: checkedGeneration.value,
  }
);

const loadMore = async () => {
  offset.value += 24;
  fetchMore({
    variables: {
      offset: offset.value,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) return previousResult;
      return {
        ...previousResult,
        species: [...previousResult.species, ...fetchMoreResult.species],
      };
    },
  });
};

const refresh = async () => {
  offset.value = 0;
  refetch({
    offset: offset.value,
    type: checkedTypes.value,
    generation: checkedGeneration.value,
  });
};
</script>

<template>
  <main class="container mx-auto my-10">
    <div class="grid grid-cols-1 gap-2 mx-2 mb-2 sm:grid-cols-2 sm:md-0">
      <div class="p-4 border rounded-lg">
        <h2 class="pb-3 mb-2 text-xl border-b">Filter by Type</h2>
        <el-checkbox
          class="font-bold"
          v-model="checkAllTypes"
          :indeterminate="isTypesIndeterminate"
          @change="handleCheckAllTypesChange"
          >Check all</el-checkbox
        >
        <el-checkbox-group
          :min="1"
          v-model="checkedTypes"
          @change="handleCheckedTypesChange"
        >
          <el-checkbox
            v-for="pokeType in types"
            :key="pokeType"
            :label="pokeType"
            >{{ pokeType.toUpperCase() }}</el-checkbox
          >
        </el-checkbox-group>
      </div>

      <div class="p-4 border rounded-lg">
        <h2 class="pb-3 mb-2 text-xl border-b">Filter by Generation</h2>
        <el-checkbox
          class="font-bold"
          v-model="checkAllGeneration"
          :indeterminate="isGenerationIndeterminate"
          @change="handleCheckAllGenerationChange"
          >Check all</el-checkbox
        >
        <el-checkbox-group
          :min="1"
          v-model="checkedGeneration"
          @change="handleCheckedGenerationChange"
        >
          <el-checkbox
            v-for="pokeGeneration in generation"
            :key="pokeGeneration"
            :label="pokeGeneration"
            >{{ pokeGeneration.toUpperCase() }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </div>
    <el-row
      v-loading="loading"
      v-infinite-scroll="loadMore"
      infinite-scroll-delay="500"
    >
      <el-col
        v-for="(pokemon, index) in pokemons"
        :key="index"
        :xs="12"
        :sm="6"
        :md="4"
        :lg="3"
      >
        <el-card class="m-2 rounded-xl">
          <RouterLink
            class="block p-4 text-center"
            :to="`pokemon/${pokemon.name}`"
          >
            <el-image
              lazy
              class="h-24 mx-auto mb-8"
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`"
              :alt="pokemon.name"
            />
            <span>{{ getPokemonName(pokemon) }}</span>
          </RouterLink>
        </el-card>
      </el-col>
    </el-row>
  </main>
</template>
