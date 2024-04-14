<script setup>
</script>

<template>

    <div class="loaderblock-wrapper">
        <ion-icon class="loaderblock" name="paw"></ion-icon>
    </div>

</template>

<style lang='scss'>

.loaderblock{
    &-wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 20rem;
        background-color: #00000030;
        border-radius: 2rem;
        transition: 200ms;
        pointer-events: none;
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