<script setup>
import { onMounted, ref,computed } from 'vue';
import { useRoute } from 'vue-router';
import { LISTING_IMAGE } from '@/utils/config';
const selectedImage = ref(0)
const translateValue = ref(0);
const route = useRoute();

const props = defineProps({
    images: Array
})



let slideInterval;
const resetInterval = function() {
    clearInterval(slideInterval)
    slideInterval = setInterval(() => {
        selectedImage.value = (selectedImage.value + 1) % props.images.length
        translateValue.value = selectedImage.value * 100
    }, 5000)
}

const changeImageTo = function(slide) {
    selectedImage.value = slide
    translateValue.value = selectedImage.value * 100
    resetInterval()
}

const nextImage = function() {
    selectedImage.value = (selectedImage.value + 1) % props.images.length
    translateValue.value = selectedImage.value * 100
    resetInterval()
}

const previousImage = function() {
    selectedImage.value = (selectedImage.value - 1 + 4) % props.images.length
    translateValue.value = selectedImage.value * 100
    resetInterval()
}

onMounted(() => resetInterval())

</script>

<template>

    <div class="images">
        <div class="images-viewer">
            <ion-icon @click="previousImage()" class="images-viewer--navigation images-viewer--navigation-left" name="chevron-back"></ion-icon>
            <ion-icon @click="nextImage()" class="images-viewer--navigation images-viewer--navigation-right" name="chevron-forward"></ion-icon>
            <div class="images-viewer--inner"  :style="{ transform: `translateX(-${translateValue}%)` }">
                <div class="images-viewer--wrapper" v-for="image in props.images">
                    <img :src="image">
                </div>
            </div>
        </div>
        <div class="images-list">
            <div class="images-list--inner">
                <div class="images-list--wrapper" @click="changeImageTo(index)" :style="{ opacity: selectedImage == index ? '1' : '0.8'}" v-for="(image, index) in props.images">
                    <img :src="image" alt="">
                </div>
            </div>
        </div>
    </div>

</template>

<style lang='scss'>

    .images{
        width: 100%;
        height: 45rem;
        user-select: none;
        -webkit-user-drag: none;
        display: grid;
        grid-template-columns: .8fr .2fr;
        gap: 1rem;

        @media screen and (max-width: 800px) {
            grid-template-columns: 1fr;
            height: 50rem;
        }


        &-viewer{
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            margin-bottom: 1rem;
            border-radius: 1rem;
            box-shadow: 0 5px 1rem rgba(0, 0, 0, 0.2);

            &--navigation{
                position: absolute;
                font-size: 2rem;
                padding: 1rem;
                color: #000;
                background-color: #fff;
                z-index: 1;
                top:50%;
                transform: translateY(-50%);
                border-radius: 1rem;
                transition: 100ms;

                &:hover{
                    cursor: pointer;
                    scale: .95;
                    background-color: lighten($color: #000000, $amount: 95%);
                }

                &-left{
                    left: 1rem;
                }

                &-right{
                    right: 1rem;
                }
            }

            &--inner{
                display: flex;
                transition: 300ms;
                // overflow: hidden;
            }

            &--wrapper{
                min-width: 100%;
                height: 45rem;
                overflow: hidden;
                user-select: none;
                -webkit-user-drag: none;

                @media screen and (max-width: 800px) {
                    height: 50rem;
                }

                & img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    user-select: none;
                    -webkit-user-drag: none;

                }
            }
        }

        &-list{
            width: 100%;
            overflow-y: auto;
            

            &--inner{
                display: flex;
                flex-direction: column;
                gap: 1rem;
                // overflow-x: auto;
                // overflow-y: hidden;
                transition: 100ms;

                @media screen and (max-width: 800px) {
                    flex-direction: row;
                }
            }

            &--wrapper{
                min-width: 100%;
                height: 10.5rem;
                transition: 100ms;
                user-select: none;
                -webkit-user-drag: none;
                border-radius: .5rem;
                overflow: hidden;

                @media screen and (max-width: 800px) {
                    height: 10rem;
                    min-width: 10rem;
                }


                & img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    user-select: none;
                    -webkit-user-drag: none;

                }
            }
        }
    }

</style>