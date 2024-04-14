<script setup>
import { ref,inject } from 'vue';
const forgotPasswordOpen = ref(false);
const emitter = inject('emitter');

</script>

<template>
    <!-- <div class="popup" :class="{ 'popup-open': forgotPasswordOpen }"> -->
        <div class="popup-item reset-passsword">
            <ion-icon name="close-outline" class="popup-close" @click="emitter.emit('signup')"></ion-icon>
            <h1 class="popup-item--title">Forgot password</h1>
            <p class="popup-item--text ">Enter your email address and we will send you a code to verify your ownership.</p>
            <form class="popup-item--group">
                <div class="popup-item--input">
                    <label class="popup-item--input-label" for="email">Email</label>
                    <input type="email" class="popup-item--input-field" name="email" required>
                </div>
                <button class="popup-item--button">Reset password</button>
            </form>
        </div>
    <!-- </div> -->
</template>

<style lang='scss'>
.reset-passsword{
    width: 50rem;
}
</style>