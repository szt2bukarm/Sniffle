<script setup>
import { ref,inject } from 'vue';
import signupModal from './modals/signupModal.vue';
import forgotPasswordModal from './modals/forgotPasswordModal.vue'
import activateAccountModal from './modals/activateAccountModal.vue'
import readmoreModal from './modals/readmoreModal.vue'
const modalOpen = ref(false);
const modal = ref('signupModal');
const emitter = inject('emitter');

emitter.on('closeModal', () => {
    modalOpen.value = false
})

emitter.on('signup', () => {
    modalOpen.value = true
    modal.value = 'signupModal'
})
emitter.on('activateAccount', () => {
    modal.value = 'activateAccountModal'
})
emitter.on('forgotPassword', () => {
    modal.value = 'forgotPasswordModal'
})

const readmoreText = ref('')
emitter.on('readmore', (text) => {
    readmoreText.value = text
    modalOpen.value = true;
    modal.value = 'readmoreModal'
})



</script>

<template>
    <transition name="fade" mode="out-in">
    <div class="popup" v-if="modalOpen">
        <signupModal v-if="modal == 'signupModal'"/>
        <activateAccountModal v-if="modal == 'activateAccountModal'"/>
        <forgotPasswordModal v-if="modal == 'forgotPasswordModal'"/>
        <readmoreModal :text=readmoreText v-if="modal == 'readmoreModal'"/>
    </div>
    </transition>
</template>

<style lang='scss'>
</style>