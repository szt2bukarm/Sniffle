<script setup>
</script>

<template>

    <div class="loader-wrapper">
        <ion-icon class="loader" name="paw"></ion-icon>
    </div>

</template>

<style lang='scss'>

.loader{
    z-index: 99999;
    &-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #00000030;
        opacity: 0;
        z-index: 99;
        transition: 200ms;
        pointer-events: none;
    }

    &-show{
        opacity: 1;
        pointer-events: auto;
    }

    font-size: 7rem;
    animation: loading 700ms infinite;
}

@keyframes loading {
    50% {
        scale: 1.1;
        color: lighten($color: #000, $amount: 70%);
    }
}

</style>