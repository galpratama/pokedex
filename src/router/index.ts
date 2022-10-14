import AboutView from "@/views/AboutView.vue";
import CompareView from "@/views/CompareView.vue";
import HomeView from "@/views/HomeView.vue";
import PokemonView from "@/views/PokemonView.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  scrollBehavior() {
    return { top: 0 };
  },
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/compare",
      name: "compare",
      component: CompareView,
    },
    {
      path: "/pokemon/:name",
      name: "detail",
      component: PokemonView,
    },
  ],
});

export default router;
