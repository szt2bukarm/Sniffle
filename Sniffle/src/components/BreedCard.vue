<script setup>
import { defineProps, onMounted } from 'vue';
const props = defineProps({
    data: Object
})

onMounted(() => {
    console.log(props.data)
})

import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
const giveTag = (score) => {
    switch (score) {
        case 0:
        case 1:
            return 'tag-low'
        case 2:
        case 3:
            return 'tag-mid'
        case 4:
        case 5:
            return 'tag-high'
    }
}

</script>

<template>
            <div class="breed-cards--card">
            <div class="breed-cards--card-img-wrapper">
                <carousel :itemsToShow=1 :wrapAround=true :autoplay=5000>
                    <slide v-for="image in props.data.images" :key="props.data._id">
                        <div class="breed-cards--card-img-inner">
                            <img :src="image" alt="" class="breed-cards--card-img">
                        </div>
                    </slide>
                </carousel>
            </div>
            <p class="breed-cards--card-name">{{props.data.name}}</p>
            <div class="breed-cards--card-tags">
                <p class="breed-cards--card-tag" :class="giveTag(props.data.trainability)">Trainable</p>
                <p class="breed-cards--card-tag" :class="giveTag(props.data.openness)">Openness</p>
                <p class="breed-cards--card-tag" :class="giveTag(props.data.playfulness)">Playfulness</p>
                <p class="breed-cards--card-tag" :class="giveTag(props.data.barking)">Barking</p>
            </div>
        </div>
</template>

<style lang='scss'>

.tag{
    &-low{
        background-color: var(--low);
    }

    &-mid{
        background-color: var(--mid);
    }

    &-high{
        background-color: var(--high);
    }
}

.breed-cards{

    &--card{
        width: 25%;
        padding: 1rem;
        cursor: pointer;
        margin-bottom: 3rem;

        &:hover &-img-wrapper{
            transform: translateY(-5px);
            box-shadow: 0 5px 2rem rgba(0, 0, 0, 0.2);
        }

        @media screen and (max-width: 1400px) {
            width: 33.3%;
        }

        @media screen and (max-width: 950px) {
            width: 50%;
        }

        @media screen and (max-width: 680px) {
            width: 100%;
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
                // width: 100%;
                height: 30rem;
                // object-fit: ;

                @media screen and (max-width: 950px) {
                    height: 30rem;
                }

                @media screen and (max-width: 680px) {
                    height: 35rem;
                }
            }
        }
        
        &-name{
            font-size: var(--heading5);
            font-weight: 400;
            margin-bottom: 1rem;
            // font-family: BerlinLight;
        }

        &-tags{
            display: flex;
            flex-wrap: wrap;
            width: 90%;
            gap: 1rem;
        }

        &-tag{
            font-size: var(--small);
            padding: .3rem 1rem;
            // background-color: #a2d2ff;
            border-radius: 5rem;
            color: #003049;
        }
    }
}
</style>