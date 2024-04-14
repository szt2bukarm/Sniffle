<script setup>
import { onMounted } from 'vue';
import BreedInformation from '../components/BreedInformation.vue';
onMounted(() => {
    window.scrollTo(100,100)
})
</script>

<template>
    <div class="breed-details">
        <BreedInformation/>
    </div>
</template>

<style lang='scss'>
.breed-details{
    margin-top: 25rem;
}
</style>