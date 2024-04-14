<script setup>
import { onMounted,ref } from 'vue';
import ListingDetails from '../components/ListingDetails.vue';
import BreedInformation from '@/components/BreedInformation.vue';
import { LISTING_IMAGE } from '@/utils/config';
import { hideLoader, showLoader } from '@/utils/helper';
import { useRoute } from 'vue-router';
import router from '@/router';
const route = useRoute()
const listing = ref('')
const loaded = ref(false);


onMounted(async () => {
    window.scrollTo(100, 100)
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
})



</script>

<template>
    <div class="listing">
        <ListingDetails v-if="loaded" :name="listing.name" :gender="listing.gender" :birthday="listing.birthday" :description="listing.description" :images="listing.images.map(image => LISTING_IMAGE + '/' + image.split('-')[1] + '/' + image)" :breed="listing.breed.name" :address="listing.approximateLocation.place + ', ' + listing.approximateLocation.country" :lat="listing.approximateLocation.coordinates[0]" :lng="listing.approximateLocation.coordinates[1]" :tags="listing.tags"/>
        <BreedInformation v-if="loaded" :id="listing.breed._id" />
    </div>
</template>

<style lang='scss'>

.listing{
    margin-top: 25rem;
    height: 100vh;
}

</style>
