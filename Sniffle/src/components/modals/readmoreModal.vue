<script setup>
import { inject } from 'vue';
const emitter = inject('emitter')
const props = defineProps({
    text: String
})

</script>

<template>
        <div class="popup-item breed-information-popup">
            <ion-icon name="close-outline" class="popup-close" @click="emitter.emit('closeModal')"></ion-icon>
            <div class="breed-information-popup-text" v-html="props.text">
</div>
        </div>
</template>

<style lang='scss'>
</style>