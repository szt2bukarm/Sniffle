<script setup>
import { onMounted, ref } from 'vue';
import {showLoader,hideLoader} from '../utils/helper.js'
import BreedCard from '../components/BreedCard.vue'
const breeds = ref([])

onMounted(async () => {
    showLoader()
    // setTimeout(async () => {
        await getBreeds()
    // }, 500);
})

const getBreeds = async () => {
    const resp = await fetch(`http://localhost:3000/api/breed`, {
        method: 'GET',
    })
    const data = await resp.json()
    breeds.value = data.data.doc
    hideLoader()
}

</script>

<template>

    <div class="breed-cards">
        <BreedCard v-for="breed in breeds" :key="breed._id" @click="$router.push(`/breed/${breed._id}`)" :data="breed" />
    </div>

</template>

<style lang='scss'>

.breed-cards{
    display: flex;
    flex-wrap: wrap;
}

</style>