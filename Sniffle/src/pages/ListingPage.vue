<script setup>
import { onMounted,ref, watch } from 'vue';
import ListingDetails from '../components/ListingDetails.vue';
import BreedInformation from '@/components/BreedInformation.vue';
import ListingCard from '@/components/ListingCard.vue';
import LoaderBlock from '@/components/LoaderBlock.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { LISTING_IMAGE } from '@/utils/config';
import { hideLoader, showLoader } from '@/utils/helper';
import { useRoute } from 'vue-router';
import router from '@/router';
const route = useRoute()
const listing = ref([])
const matchingBreedListings = ref([])
const randomListings = ref([])
const loaded = ref(false);


onMounted(async () => {
    window.scrollTo(0, 0)
    await getListing()
    await getMatchingBreedListings()
    await getRandomListings()
})

watch(() => route.params.id, async () => {
    window.scrollTo(0, 0)
    loaded.value = false
    matchingBreedListings.value = []
    listing.value = []
    await getListing()
    await getMatchingBreedListings()
    await getRandomListings()
})

const getListing = async function() {
    showLoader()
    const resp = await fetch(`http://localhost:3000/api/listings/${route.params.id}`, {
        method: 'GET',
    })
    const data = await resp.json()
    console.log(data);
    if (data.status != 'success') {
        router.push('/404')
        return
    }

    listing.value = data.data.doc
    loaded.value = true
    hideLoader()
}

const matchingBreedListingsLoaded = ref(false)
const getMatchingBreedListings = async function() {
    const resp = await fetch(`http://localhost:3000/api/listings/byBreedId/${listing.value.breed._id}`, {
        method: 'GET',
    })
    const data = await resp.json()
    data.data.doc.forEach(listing => {
        if (listing._id == route.params.id) {
            data.data.doc.splice(data.data.doc.indexOf(listing), 1)
        }
    });
    matchingBreedListings.value = data.data.doc
    matchingBreedListingsLoaded.value = true
}

const randomListingsLoaded = ref(false)
const getRandomListings = async function() {
    const resp = await fetch(`http://localhost:3000/api/listings/randomListings`, {
        method: 'GET',
    })
    const data = await resp.json()
    console.log(data);
    data.data.doc.forEach(listing => {
        if (listing._id == route.params.id) {
            data.data.doc.splice(data.data.doc.indexOf(listing), 1)
        }
    });
    randomListings.value = data.data.doc
    randomListingsLoaded.value = true
}



</script>

<template>
    <div class="listing">
        <div class="page--header">
            <img src="../images/headers/breeds.png" alt="">
            <div class="page--header-gradient"></div>
        </div>

        <div v-if="loaded">
            <ListingDetails :name="listing.name" :gender="listing.gender" :birthday="listing.birthday" :description="listing.description" :images="listing.images.map(image => LISTING_IMAGE + '/' + image.split('-')[1] + '/' + image)" :breed="listing.breed.name" :address="listing.approximateLocation.place + ', ' + listing.approximateLocation.country" :lat="listing.approximateLocation.coordinates[0]" :lng="listing.approximateLocation.coordinates[1]" :tags="listing.tags"/>


            <p class="section-text container">Breed information</p>
            <BreedInformation :id="listing.breed._id" />

            <div class="listing--matching-breed container">
                <p class="section-text">More {{ listing.breed.name }}s</p>
                <div class="section--listings">
                    <LoaderBlock v-if="!matchingBreedListingsLoaded"></LoaderBlock>
                    <ListingCard @click="$router.push(`/listing/${item._id}`)" v-for="item in matchingBreedListings" :key="item.id" :data="item" />
                    <div class="section--listings-empty" v-if="matchingBreedListingsLoaded && matchingBreedListings.length === 0">
                        <FontAwesomeIcon class="section--listings-empty-icon" :icon="faFaceFrown"></FontAwesomeIcon>
                        <p>We couldn't find any listings for this breed.</p>
                    </div>
                </div>
            </div>

            <div class="listing--discover container">
                <p class="section-text">Discover more listings</p>
                <div class="section--listings">
                    <LoaderBlock v-if="!randomListingsLoaded"></LoaderBlock>
                    <ListingCard @click="$router.push(`/listing/${item._id}`)" v-for="item in randomListings" :key="item.id" :data="item" />
                    <div class="section--listings-empty" v-if="randomListingsLoaded && randomListings.length === 0">
                        <FontAwesomeIcon class="section--listings-empty-icon" :icon="faFaceFrown"></FontAwesomeIcon>
                        <p>We couldn't find any listings for this breed.</p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<style lang='scss'>

.listing{
    margin-top: 25rem;
    height: 100vh;

    &--matching-breed__list{
        display: flex;
        flex-wrap: wrap;
        // gap: .5rem;
    }
}

</style>
