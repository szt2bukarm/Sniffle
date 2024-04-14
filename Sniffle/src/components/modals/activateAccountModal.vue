<script setup>
import { ref,inject } from 'vue';
import {useRegisterState} from '@/stores/registerState'
import { hideLoader, showLoader } from '@/utils/helper';

// register state
const regState = useRegisterState()

// user state
import {useUserState} from '@/stores/userState'
const userState = useUserState()

const code = ref('')

const emitter = inject('emitter');

const signUp = async function(e) {
    e.preventDefault()
    // if(code.value != 6) return;
    showLoader()
    const resp = await fetch('http://localhost:3000/api/users/signup', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            'email': regState.email,
            'name': regState.name,
            'password': regState.password,
            'code': code.value
        })
    })
    const data = await resp.json()
    console.log(data);
    if(data.status == 'fail') {
        alert(data.message)
        hideLoader()
        return
    }
    regState.email = null
    regState.name = null
    regState.password = null
    userState.email = data.data.user.email
    userState.name = data.data.user.name
    userState.isLoggedIn = true;
    emitter.emit('closeModal')
    hideLoader()
}


</script>

<template>
    <!-- <div class="popup" :class="{ 'popup-open': activateOpen }"> -->
        <div class="popup-item activate-account">
            <ion-icon name="close-outline" class="popup-close" @click="emitter.emit('signup')"></ion-icon>
            <h1 class="popup-item--title">Activate account</h1>
            <p class="popup-item--text ">We've slid a code into your postbox. Take a peek at it.</p>
            <form class="popup-item--group">
                <div class="popup-item--input">
                    <label class="popup-item--input-label" for="code">Code</label>
                    <input v-model="code" type="text" class="popup-item--input-field" name="code" required>
                </div>
                <button class="popup-item--button" @click="signUp($event)">Activate</button>
            </form>
        </div>
    <!-- </div> -->
</template>

<style lang='scss'>
.activate-account{
    width: 50rem;
}
</style>