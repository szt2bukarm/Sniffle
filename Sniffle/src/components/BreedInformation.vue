<script setup>
import router from '@/router';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faDog, faWeightScale,faCake,faFaceFrown } from '@fortawesome/free-solid-svg-icons';

import { API_LINK } from '@/utils/config';
import { hideLoader, showLoader } from '@/utils/helper';
import { onBeforeUnmount, onMounted,ref,inject } from 'vue';
import { useRoute } from 'vue-router';
import ImageList from './ImageList.vue';
import ListingCard from './ListingCard.vue';
import LoaderBlock from './LoaderBlock.vue';

const breedData = ref([]);
const breedListings = ref([]);
const imageWrapper = ref(null);
const description = ref(null);
const descOverflowing = ref(false);
const route = useRoute()

const emitter = inject('emitter')

const props = defineProps({
    id: String
})



onMounted(async () => {
    console.log(props.id);
    window.addEventListener('resize', textIsOverflowing)
    showLoader()
        const resp = await fetch(`http://localhost:3000/api/breed/${route.name == 'breed' && route.params.id ? route.params.id : props.id}`)
        const data = await resp.json()

        if (data.status != 'success') {
            router.push('/404')
            return
        }

        console.log(data);
        breedData.value = data.data.doc
        setTimeout(() => {
            textIsOverflowing()
        }, 1);
        hideLoader()
        await getListingByBreed()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', textIsOverflowing)
})

const textIsOverflowing = function() {
    descOverflowing.value = description.value.scrollHeight > description.value.clientHeight
}

const getSliderBase = (score) => {
    switch (score) {
        case 0:
        case 1:
            return 'breed-information--statics-low'
        case 2:
        case 3:
            return 'breed-information--statics-mid'
        case 4:
        case 5:
            return 'breed-information--statics-high'
    }}

const getSliderInner = (score) => {
    switch (score) {
    case 0:
        return 'breed-information--statics-level0'
    case 1:
        return 'breed-information--statics-level1'
    case 2:
        return 'breed-information--statics-level2'
    case 3:
        return 'breed-information--statics-level3'
    case 4:
        return 'breed-information--statics-level4'
    case 5:
        return 'breed-information--statics-level5'
}}

const breedListingsLoaded = ref(false);
const getListingByBreed = async function() {
    showLoader()
    const resp = await fetch(`http://localhost:3000/api/listings/byBreedId/${route.params.id}`, {
        method: 'GET',
    })
    const data = await resp.json()
    console.log(data);

    breedListings.value = data.data.doc
    breedListingsLoaded.value = true
    hideLoader()
}


</script>

<template>


    <div class="breed-information container">
        <div class="breed-information--info-header">
            <div class="breed-information--info">
                <p class="breed-information--header">{{ breedData.name }}</p>
                <div class="breed-information--desc">
                    <p class="breed-information--desc-text" ref="description">{{ breedData.description }}</p>
                    <a tabindex="0" class="breed-information--desc-readmore" v-if="descOverflowing" @click="emitter.emit('readmore',breedData.description)">Read more.</a>
                </div>
            </div>
        <ImageList class="breed-information--images" :images="breedData.images" />
        </div>

        <div class="breed-information--metrics">
            <div class="breed-information--metrics-wrapper">
                <FontAwesomeIcon :icon="faDog" class="breed-information--metrics-icon" />
                <p class="breed-information--metrics-metric"><span>Height:</span><br> {{ breedData.minHeight }} - {{ breedData.maxHeigth }} inches</p>
            </div>
            <div class="breed-information--metrics-wrapper">
                <FontAwesomeIcon :icon="faWeightScale" class="breed-information--metrics-icon" />
                <p class="breed-information--metrics-metric"><span>Weight:</span><br> {{ breedData.minWeight }} - {{ breedData.maxWeight }} pounds</p>
            </div>
            <div class="breed-information--metrics-wrapper">
                <FontAwesomeIcon :icon="faCake" class="breed-information--metrics-icon" />
                <p class="breed-information--metrics-metric"><span>Life expectancy:</span><br> {{ breedData.minLifespan }} - {{ breedData.maxLifespan }} years</p>
            </div>
        </div>

        <div class="breed-information--statics">
            <div class="breed-information--statics-wrapper">
                <p class="breed-information--statics-title">Shedding:</p>
                <div class="breed-information--statics-slider" :class="getSliderBase(breedData.shedding)">
                    <div class="breed-information--statics-slider-inner" :class="getSliderInner(breedData.shedding)"></div>
                </div>
            </div>
            <div class="breed-information--statics-wrapper">
                <p class="breed-information--statics-title">Openness:</p>
                <div class="breed-information--statics-slider" :class="getSliderBase(breedData.openness)">
                    <div class="breed-information--statics-slider-inner" :class="getSliderInner(breedData.openness)"></div>
                </div>
            </div>
            <div class="breed-information--statics-wrapper">
                <p class="breed-information--statics-title">Playfulness:</p>
                <div class="breed-information--statics-slider" :class="getSliderBase(breedData.playfulness)">
                    <div class="breed-information--statics-slider-inner" :class="getSliderInner(breedData.playfulness)"></div>
                </div>
            </div>
            <div class="breed-information--statics-wrapper">
                <p class="breed-information--statics-title">Trainabilty:</p>
                <div class="breed-information--statics-slider" :class="getSliderBase(breedData.trainability)">
                    <div class="breed-information--statics-slider-inner" :class="getSliderInner(breedData.trainability)"></div>
                </div>
            </div>
            <div class="breed-information--statics-wrapper">
                <p class="breed-information--statics-title">Barking level:</p>
                <div class="breed-information--statics-slider" :class="getSliderBase(breedData.barking)">
                    <div class="breed-information--statics-slider-inner" :class="getSliderInner(breedData.barking)"></div>
                </div>
            </div>

        </div>

        <div v-if="route.name === 'breed'">
            <p class="section-text">Find {{ breedData.name }}s</p>
            <div class="section--listings">
                <LoaderBlock :height=20 v-if="!breedListingsLoaded"></LoaderBlock>
                <ListingCard @click="router.push(`/listing/${item._id}`)" v-for="item in breedListings" :key="item.id" :data="item" />
                <div class="section--listings-empty" v-if="breedListingsLoaded && breedListings.length == 0">
                    <FontAwesomeIcon class="section--listings-empty-icon" :icon="faFaceFrown"></FontAwesomeIcon>
                    <p>We couldn't find any listings for this breed.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang='scss'>
.breed-information{
    // height: 200vh;

    &-popup{
        width: 50%;
        font-size: var(--heading6);

        &-text{
            overflow-y: auto;
            height: 30rem;
            padding: 1rem
        }

        @media screen and (max-width: 1000px) {
            width: 70%;
        }

        @media screen and (max-width: 800px) {
            width: 90%;
            // font-size: var(--paragraph);
        }
    }

    &--header{
        font-size: var(--heading3);
        font-family: BerlinBold;
        margin-bottom: 2rem;
    }

    &--images{
        width: 50%;

        @media screen and (max-width: 800px) {
            width: 100%;
        }
    }

    &--info{
        width: 45%;

        @media screen and (max-width: 800px) {
            width: 100%;
        }

        &-header{
            display: flex;
            justify-content: space-between;
            margin-bottom: 10rem;

            @media screen and (max-width: 800px) {
                flex-direction: column-reverse;
                gap: 2rem;
            }
        }
    }

    &--desc{
        font-size: var(--heading6);
        line-height: 1.3;
        letter-spacing: -.5px;
        height: 35rem;

        @media screen and (max-width: 800px) {
            height: auto;
        }

        &-text{
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 12;
            -webkit-box-orient: vertical;
        }

        &-readmore{
            display: inline-block;
            margin-top: 1rem;
            color: lighten($color: #000000, $amount: 50%);
            cursor: pointer;

            &:hover{
                text-decoration: underline;
            }
        }
    }



        

    &--metrics{
        margin: 0 auto;
        display: flex;
        width: 80%;
        justify-content: space-around;
        padding: 2rem;
        box-shadow: 0 2rem 3rem rgba(0, 0, 0, 0.05);
        border-radius: 2rem;
        margin-bottom: 5rem;

        @media screen and (max-width: 1200px) {
            width: 90%;
            justify-content: space-between;
        }

        @media screen and (max-width: 900px) {
            width: 90%;
            flex-direction: column;
            gap: 4rem;
            align-items: center;
        }

        &-wrapper{
            display: flex;
            gap: 3rem;
            align-items: center;
        }

        &-icon{
            font-size: 6rem;

            @media screen and (max-width: 900px) {
                font-size: 5rem;
            }
        }

        &-metric{
            font-size: var(--heading6);

            @media screen and (max-width: 900px) {
                // font-size: var(--small);
            }

            & span{
                font-weight: 600;
                font-size: var(--heading5);
            }
        }
    }

    &--statics{
        display: flex;
        justify-content: space-around;
        gap: 2rem;

        @media screen and (max-width: 800px) {
            flex-direction: column;
        }
        &-title{
            font-size: var(--heading6);
            margin-bottom: 1rem;
        }

        &-wrapper{
            display: flex;
            flex-direction: column;
            width: 50%;
            @media screen and (max-width: 800px) {
                width: 100%;
            }
        }

        &-slider{
            width: 100%;
            // height: 1rem;
            border-radius: 1rem;
            // background-color: var(--mid);
            box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
            padding: .3rem;
            margin-bottom: 1rem;
            transition: background-color 200ms;
            &-inner{
                width: 0%;
                height: 1rem;
                background-color: darken($color: #ffe8a2, $amount: 60%);
                border-radius: 1rem;
                transition: width 1000ms;
            }
        }

        &-low{
            background-color: var(--low) !important
        }

        &-mid{
            background-color: var(--mid) !important
        }

        &-high{
            background-color: var(--high) !important
        }

        &-level0{
            width: 5%;
            background-color: darken($color: #ffa2a2, $amount: 60%);
        }

        &-level1{
            width: 20%;
            background-color: darken($color: #ffa2a2, $amount: 60%);
        }
        &-level2{
            width: 40%;
            background-color: darken($color: #ffe8a2, $amount: 60%);
        }

        &-level3{
            width: 60%;
            background-color: darken($color: #ffe8a2, $amount: 60%);
        }

        &-level4{
            width: 80%;
            background-color: darken($color: #a2ffad, $amount: 60%);
        }

        &-level5{
            width: 100%;
            background-color: darken($color: #a2ffad, $amount: 60%);
        }
    }
}


</style>