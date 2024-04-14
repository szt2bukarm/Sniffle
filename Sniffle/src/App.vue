<script setup>
import Navbar from './components/Navbar.vue';
import Loader from './components/Loader.vue';
import ModalManager from './components/ModalManager.vue';
</script>

<template>
  <div class="app">
    <Navbar class="nav"/>
    <router-view v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <div :key="route.name">
          <component :is="Component" />
        </div>
      </Transition>
    </router-view>
    </div>

  <ModalManager />
  <Loader />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.app{
  position: relative;
}

.nav{
  position: fixed;
  top: 0;
  z-index: 2;
}

</style>
