<script setup>
import ImageList from './ImageList.vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faDog,faCake,faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { useUserState } from '@/stores/userState';
import L from 'leaflet'
import { onMounted,onBeforeUnmount,ref,inject } from 'vue';
const map = ref(null)
const descOverflowing = ref(false)
const description = ref(null)
const dataFetched = ref(false);

const emitter = inject('emitter')
const userState = useUserState();

const props = defineProps({
    name: String,
    description: String,
    images: Array,
    birthday: Date,
    gender: String,
    breed: String,
    address: String,
    lat: Number,
    lng: Number,
    tags: Array
})

let leafletMap;
onMounted(() => {
    console.log(props.images);
    textIsOverflowing()
    window.addEventListener('resize', textIsOverflowing)
    leafletMap = L.map(map.value, {
        center: [0,0],
        zoom: 5,
        scrollWheelZoom: false 
    });
    console.log(props.lat,props.lng);
    setTimeout(() => {
        if (props.lat && props.lng) {
        leafletMap.setView([props.lng,props.lat], 13);
        }
    }, 1);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(leafletMap);
    // leafletMap.remove()

})

onBeforeUnmount(() => {
    window.removeEventListener('resize', textIsOverflowing)
    leafletMap.remove()
})

const textIsOverflowing = function() {
    descOverflowing.value = description.value.scrollHeight > description.value.clientHeight
}

</script>

<template>

    <div class="listing-details container">
        <div class="listing-details--header">
            <ImageList :images="props.images" class="listing-details--images" />
        <div class="listing-details--data">
            <div class="listing-details--name-wrapper">
                <p class="listing-details--name">{{ props.name }}</p>
                <div class="listing-details--tags">
                    <p class="listing-details--tag" v-for="tag in props.tags">{{ tag }}</p>
                </div>
            </div>
            <div class="listing-details--description">
                <p class="listing-details--description-text" ref="description"><span>Description:</span><br><br>{{ props.description }}</p>
                <a tabindex="0" class="listing-details--description-readmore" v-if="descOverflowing" @click="emitter.emit('readmore',$refs.description.innerHTML)">Read more.</a>
            </div>
            <div class="listing-details--about">
                <div class="listing-details--about__wrapper">
                    <p class="listing-details--about__label">
                        <FontAwesomeIcon :icon="faDog"/>
                    </p>
                    <p class="listing-details--about__value">{{ props.breed }}</p>
                </div>
                <div class="listing-details--about__wrapper">
                    <p class="listing-details--about__label">
                        <FontAwesomeIcon :icon="faCake"/>
                    </p>
                    <p class="listing-details--about__value">{{ props.birthday ? props.birthday : "N/A" }}</p>
                </div>
                <div class="listing-details--about__wrapper">
                    <p class="listing-details--about__label">
                        <FontAwesomeIcon :icon="faVenusMars"/>
                    </p>
                    <p class="listing-details--about__value">{{ props.gender }}</p>
                </div>

            </div>
            <div class="listing-details--poster">
                <div class="listing-details--poster-img-wrapper">
                    <img src="../images/card/lola.JPG" alt="" class="listing-details--poster-img">
                </div>
                <div class="listing-details--poster-info">
                    <div class="listing-details-poster-info--wrapper">
                        <p class="listing-details--poster-info__name"><span>Posted by:</span> {{ userState.name }} (member for 2 months)</p>
                        <p class="listing-details--poster-info__location">{{ props.address }}</p>
                    </div>
                    <button class="listing-details--poster-contact" @click="userState.isLoggedIn == true ? emitter.emit('contact') : emitter.emit('signup')">Contact owner!</button>
                </div>
            </div>
        </div>
        </div>

        <p class="listing-details--text">Location</p>
        <div class="listing-map" ref="map"></div>
    </div>

</template>

<style lang='scss'>

.listing-details{
    // display: flex;
    // flex-direction: column;
    // gap: 5rem;
    // height: 200vh;
    margin-bottom: 15rem;

    &--text{
        font-size: var(--heading2);
        margin-bottom: 3rem;
        font-family: berlinBold;
        letter-spacing: -1.5px;
    }

    &--header{
        display: flex;
        width: 100%;
        gap: 3rem;
        margin-bottom: 10rem;

        @media screen and (max-width: 850px) {
            flex-direction: column;
        }
    }

    &--images{
        width: 50%;

        @media screen and (max-width: 850px) {
            width: 100%;
        }
    }

    .listing-map{
        width: 100%;
        height: 40rem;
        box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.1);
        border-radius: 1rem;
    }

    &--data{
        width: 50%;
        display: flex;
        flex-direction: column;
        height: 44rem;

        @media screen and (max-width: 850px) {
            width: 100%;
    }
    }

    &--name{
        &-wrapper{
            display: flex;
            // align-items: center;
            flex-direction: column;
            // justify-content: space-between;
            border-bottom: 1px solid #00000020;
            margin-bottom: 2rem;
        }

        font-size: var(--heading2);
        font-family: berlinBold;
        letter-spacing: -2px;
    }

    &--tags{
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    &--tag{
        font-size: var(--small);
        background-color: #00000030;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
    }

    &--description{
        font-size: var(--paragraph);
        margin-bottom: auto;
        height: 20rem;
        // overflow: elipsis

        &-text {
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 8;
            -webkit-box-orient: vertical;
        }

        span{
            font-family: BerlinBold;
            font-size: var(--heading6);
        }

        &-readmore{
            display: inline-block;
            // margin: 1rem auto;
            // text-align: center;
            margin-top: 1rem;
            color: lighten($color: #000000, $amount: 50%);
            cursor: pointer;
        }
    }

    &--about{
        display: flex;
        // flex-direction: column;
        gap: 2rem;
        font-size: var(--paragraph);
        margin-bottom: 1rem;

        &__wrapper{
            display: flex;
            flex-direction: column;
            gap: .3rem;
        }

        &__label{
            font-weight: 600;
        }
    }

    &--poster{
        display: flex;
        align-items: center;
        // margin-top: auto;
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #00000020;

        &-contact{
            padding: 1rem 2rem;
            border-radius: 1rem;
            font-size: var(--small);
            border: 0;
            background-color: #000;
            color: #fff;
            cursor: pointer;
            transition: 200ms;
            width: 25rem;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 0.8rem 1rem rgba(0, 0, 0, 0.1);
                background-color: lighten($color: #000000, $amount: 50%);
            }
        }

        &-img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        
            &-wrapper{
                min-width: 4.5rem;
                height: 4.5rem;
            }
        }

        &-info{
            width: 100%;
            font-size: var(--small);
            display: flex;
            // gap: 3rem;
            justify-content: space-between;

            &__name span{
                font-weight: 600;
            }
        }
    }
}

</style>