<script setup>
import BreedCards from '@/views/BreedCards.vue';
import { onMounted } from 'vue';

onMounted(() => {
    window.scrollTo(100, 100)
})

</script>

<template>
    <div class="page--header">
        <img src="../images/headers/breeds.png" alt="">
        <div class="page--header-gradient"></div>
    </div>
    <div class="breeds container">
        <p class="section-text">Let's see which breed suits you the best.</p>
        <BreedCards />
    </div>
</template>

<style lang='scss'>
.breeds{
    margin-top: 25rem;
    min-height: 200vh;

    &--heading{
        font-size: var(--heading2);
        font-family: BerlinBold;
        letter-spacing: -1.5px;
        margin-bottom: 2rem;
    }
}



</style>