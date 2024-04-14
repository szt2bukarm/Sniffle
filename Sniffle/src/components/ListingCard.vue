<script setup>
import { onMounted } from 'vue';
import {LISTING_IMAGE} from '../utils/config'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const props = defineProps({
    data: Object
})

onMounted(() => {
    console.log(props.data);
})

</script>

<template>

    <div class="listing--card">
        <div class="listing--card-img-wrapper">
            <carousel :itemsToShow=1 :wrapAround=true :autoplay="props.data.images.length > 1 ? 5000 : 0">
                <slide v-for="image in props.data.images" :key="props.data._id">
                    <div class="listing--card-img-inner">
                        <img :src="LISTING_IMAGE + `${props.data._id}/${image}`" alt="" class="listing--card-img">
                    </div>
                </slide>
            </carousel>
        </div>
        <div class="listing--card-details">
            <div class="listing--card-details__info">
                <p class="listing--card-name">{{ props.data.name }}</p>
            <p class="listing--card-breed">{{ props.data.breed.name}}</p>  
        </div>
            <ion-icon v-if="props.data.gender == 'female'" class="listing--card-gender gender-female" name="female"></ion-icon>
            <ion-icon v-if="props.data.gender == 'male'" class="listing--card-gender gender-male" name="male"></ion-icon>
        </div>
        <div class="listing--card-tags">
            <p class="listing--card-tag" v-for="tag in props.data.tags">{{ tag }}</p>
        </div>
        <div class="listing--card-poster">
            <div class="listing--card-poster-img-wrapper">
                <img src="../images/card/lola.JPG" alt="" class="listing--card-poster-img">
            </div>
            <p class="listing--card-poster-name">{{ props.data.user.name }}</p>
        </div>
    </div>

</template>

<style lang='scss'>

.listing{

    &--card{
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        &:hover > &__card{
            opacity: .95;
        }
        
        &:hover > &__card:hover{
            opacity: 1;
        }
        
            width: 20%;
            border-radius: 1rem;
            padding: 1rem;
            margin-bottom: 2rem;
            transition: 100ms;
            
            @media screen and (max-width: 1300px) {
                width: 33.3%;
            }
            
            @media screen and (max-width: 950px) {
                width: 50%;
            }
            
            @media screen and (max-width: 680px) {
                width: 100%;
            }
            
            &:hover{
                cursor: pointer;
            }
            
            &:hover > &-img-wrapper{
                transform: translateY(-5px);
                box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.15);
            }
            
            
            &-img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            // object-position: center;
            &-wrapper{
                width: 100%;
                height: 25rem;
                overflow: hidden;
                border-radius: 1rem;
                margin-bottom: 1rem;
                transition: all 200ms;

                @media screen and (max-width: 680px) {
                    height: 35rem;
                }
            }

            &-inner{
                width: 100%;
                height: 30rem;

                @media screen and (max-width: 950px) {
                    height: 30rem;
                }

                @media screen and (max-width: 680px) {
                    height: 35rem;
                }
            }
        }

            &-gender{
                font-size: 2.5rem;
                transform: translateY(-5px);
            }

            &-details{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            &-name{
                font-size: var(--heading6);
            }
            &-breed{
                font-size: var(--paragraph);
                font-weight: 300;
                margin-bottom: 1rem;
            }
            &-tags{
                display: flex;
                gap: .5rem;
                flex-wrap: wrap;
                margin-bottom: 2em;
            }
            
            &-tag{
                padding: .4rem 1rem;
                font-size: var(--small);
                background-color: #a2d2ff;
                border-radius: 5rem;
                color: #003049;
            }
            &-poster{
                margin-top: auto;
                display: flex;
                align-items: center;
            }
            &-poster-img-wrapper{
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 1rem;
            }
            &-poster-img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            &-poster-name{
                font-size: var(--small);
                font-weight: 400;
            }
        }
    }

    
</style>