<script setup>
import { onMounted } from 'vue';
import BreedInformation from '../components/BreedInformation.vue';
onMounted(() => {
    window.scrollTo(100,100)
})
</script>

<template>
    <div class="breed-details">
        <div class="page--header">
            <img src="../images/headers/breed.png" alt="">
            <div class="page--header-gradient"></div>
        </div>
        <BreedInformation/>
    </div>
</template>

<style lang='scss'>
.breed-details{
    margin-top: 25rem;

    &--text{
        font-size: var(--heading2);
    }
}
</style>