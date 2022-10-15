<script setup lang="ts">
import { ref, computed } from "vue";
import getPokemonName from "@/utils/getPokemonName";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

const offset = ref(0);

const { result, loading, fetchMore } = useQuery(
  gql`
    query getPokemons($offset: Int!) {
      species: pokemon_v2_pokemonspecies(
        limit: 24
        offset: $offset
        order_by: { id: asc }
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
  },
  {
    fetchPolicy: "cache-first",
    pollInterval: 5000,
  }
);

const pokemons = computed(() => result.value?.species ?? []);

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
</script>

<template>
  <main class="container mx-auto my-10">
    <el-row
      v-loading="loading"
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
