<script setup>
import { hideLoader } from '@/utils/helper';
import { onMounted } from 'vue';

onMounted(() => {
    hideLoader()
})
</script>

<template>
    <div class="notfound">
        <p class="notfound--bg">404</p>
        <p class="notfound--text">Woof! You've Strayed Off Leash!</p>
        <p class="notfound--subtext">Don't worry, even the best of pups take wrong turns sometimes.</p>
        <img class="notfound--image" src="../images/404/1.png">
        <a href="/" class="notfound--back">Return to the dog park</a>
    </div>
    
</template>

<style lang='scss'>
.notfound{
    // margin-top: 25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    // height: calc(100vh - 30rem);
    overflow: hidden;
    
    &--bg{
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        font-size: 65rem;
        font-weight: 600;
        opacity: .2;
        font-family: BerlinBold;
        background: -webkit-linear-gradient(#000000, #fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        z-index: -1;

        @media screen and (max-width: 800px) {
            top: 55%;
            font-size: 80vw;
        }
    }

    &--subtext{
        font-size: var(--heading4);
        // letter-spacing: -1.5px;
        margin-bottom: 5rem;
        text-align: center;

        @media screen and (max-width: 800px) {
            width: 80%;
            font-size: var(--heading5); 
        }
    }
    &--text{
        margin-top: 15rem;
        font-size: var(--heading2);
        font-family: BerlinBold;
        letter-spacing: -1.5px;
        text-align: center;

        @media screen and (max-width: 800px) {
            width: 90%;
            font-size: var(--heading3); 
        }
    }

    &--back{
        // margin-top: 5rem;
        margin-bottom: 2rem;
        font-size: var(--heading5);
        text-decoration: underline;
        color: #000;
        font-weight: 500;
        cursor: pointer;
    }

    &--image{
        width: 90rem;

        @media screen and (max-width: 800px) {
            width: 100%;
        }
    }
}
</style>