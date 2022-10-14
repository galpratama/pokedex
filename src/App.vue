<script setup lang="ts">
import { ref } from "vue";

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      <RouterLink to="/">
        <img src="./assets/img/logo.svg" alt="" class="h-8 m-3" />
      </RouterLink>
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">
      <RouterLink to="/">Home</RouterLink>
    </el-menu-item>
    <el-menu-item index="2">
      <RouterLink to="/about">About</RouterLink>
    </el-menu-item>
  </el-menu>
  <RouterView />
</template>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
