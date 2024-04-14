<script setup>
import { ref,onMounted, inject } from 'vue';
import { useUserState } from '@/stores/userState';
const userState = useUserState()
const entrance = ref(null);
const emitter = inject('emitter');
onMounted(() => {
    console.log(userState.isLoggedIn);
    // entrance.value.style.background = `url('src/images/headers/header${Math.floor(Math.random()*3)+1}.png')`
})
</script>

<template>
    <div class="entrance" ref="entrance">
        <div class="entrance--content">
            <h1 class="entrance--text">Find your new best friend</h1>
            <button @click="userState.isLoggedIn ? $router.push('/breeds') : emitter.emit('signup')" class="entrance--cta">
                <ion-icon name="paw"></ion-icon>
                <p>Adopt a dog today!</p>
            </button>
        </div>
        <img class="entrance--image" :src="`src/images/headers/header${Math.floor(Math.random()*3)+1}.png`">
    </div>
</template>

<style lang='scss'>

.entrance{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    z-index: 1;
    margin-bottom: 10rem;
    background-color: #000000f1;

    &--image{
        position: absolute;
        left: 0;
        width: 100%;
        height: 120%;
        object-fit: cover;
        object-position: 70% bottom;
        
        z-index: -1;

        @media screen and (max-width: 800px) {
            object-position: 80%;
            opacity: .5;
        }
    }

    &--content{
        position: absolute;
        left: 16%;
        width: 60rem;

        @media screen and (max-width: 1400px) {
            left: 7%;
        }

        @media screen and (max-width: 1000px) {
            left: 5%;
        }

        @media screen and (max-width: 600px) {
            width: 80%;
            
        }
    }

    &--text{
        margin-top: 10rem;
        font-family: Berlin;
        letter-spacing: -1.5px;
        color: #fff;
        font-size: 8rem;
        line-height: 1.1;
        margin-bottom: 5rem;
        text-shadow: 0 0 2rem rgba(0, 0, 0, 0.1);

        @media screen and (max-width: 1000px) {
            font-size: 6rem;
        }
    }

    &--cta{
        padding: 2rem 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-size: 1.8rem;
        border-radius: 5rem;
        border: 0;
        box-shadow: 0 0 3rem rgba(0, 0, 0, 0.1);
        transition: 100ms;
        cursor: pointer;


        &:hover{
            background-color: darken($color: #fff, $amount: 15%);
            scale: .95;
        }
    }
}

</style>