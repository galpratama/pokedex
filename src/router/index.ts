import { createRouter, createWebHashHistory } from "vue-router";
import routes from "~pages";

const router = createRouter({
  scrollBehavior() {
    return { top: 0 };
  },
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
