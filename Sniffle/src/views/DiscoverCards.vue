<script setup>
import { ref,onMounted } from 'vue';
import listingCard from '../components/ListingCard.vue'
import { hideLoader, showLoader } from '@/utils/helper';
import loaderblock from '../components/LoaderBlock.vue';
const listings = ref([])

onMounted(async () => {
    await getListings()
})

const listingsLoaded = ref(false);
const getListings = async () => {
    showLoader()
    const resp = await fetch(`http://localhost:3000/api/listings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
    const data = await resp.json()
    listings.value = data.data.doc
    listingsLoaded.value = true
    hideLoader()
}


</script>

<template>
    <div class="discover discover-container">
        <h1 class="section-text">Let's find you a friend.</h1>
        <div class="discover--cards">
            <loaderblock v-if="!listingsLoaded" />
            <listingCard v-for="listing in listings" @click="$router.push(`/listing/${listing._id}`)" :key="listing._id" :data="listing" />
        </div>
        <a tabindex="0" class="discover--findmore" @click="$router.push('/breeds')">Find more friends!</a tabindex="0">
    </div>
</template>

<style lang='scss'>

.discover{

    &--cards{
        display: flex;
        flex-wrap: wrap;
        min-height: 40rem;
        width: 100%;
    }


    &--heading{
        font-size: var(--heading2);
        font-family: BerlinBold;
        letter-spacing: -1.5px;
        margin-bottom: 3rem;
    }

    &--findmore{
        display: block;
        text-align: center;
        font-size: var(--heading5);
        font-family: BerlinLight;
        font-weight: 600;
        margin-top: 5rem;
        letter-spacing: -1px;

        &:hover{
            cursor: pointer;
            text-decoration: underline;
        }
    }
}

.discover-container{
    max-width: 168rem;
    margin: 0 auto;
    padding: 0 3rem;
}

</style>