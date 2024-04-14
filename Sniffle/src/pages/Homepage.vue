<script setup>
import Entrance from '../views/Entrance.vue';
import DiscoverCards from '../views/DiscoverCards.vue';
import { onMounted } from 'vue';
import { hideLoader } from '@/utils/helper';

onMounted(() => {
    hideLoader()
})
</script>

<template>
    <Entrance class="entrance" /> 
    <DiscoverCards />
</template>

<style lang='scss'>

</style>