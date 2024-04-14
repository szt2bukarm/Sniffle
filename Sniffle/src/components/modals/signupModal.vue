<script setup>
import { hideLoader, showLoader } from '@/utils/helper';
import { ref,inject } from 'vue';

// register state
import {useRegisterState} from '@/stores/registerState'
const regState = useRegisterState()

// user state
import {useUserState} from '@/stores/userState'
const userState = useUserState()

const scrolledToggled = ref(false);

const email = ref(regState.email || '')
const name = ref(regState.name || '')
const password = ref(regState.password || '')

const emailLogin = ref('')
const passwordLogin = ref('')

const emitter = inject('emitter');

const getActivationCode = async function(e) {
    if (!email.value || !password.value || !name.value) return
    e.preventDefault()
    showLoader()
    const resp = await (await fetch('http://localhost:3000/api/users/getsignuptoken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email': email.value,
        })
    }))
    const data = await resp.json()
    console.log(data);
    if(data.status == 'fail') {
        alert(data.message)
        hideLoader()
        return
    }
    regState.email = email.value
    regState.name = name.value
    regState.password = password.value
    emitter.emit('activateAccount')
    hideLoader()
}

const login = async function(e) {
    e.preventDefault()
    showLoader()
    const resp = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            'email': emailLogin.value,
            'password': passwordLogin.value
        })
    })
    const data = await resp.json()
    // console.log(data.user);
    hideLoader()
    if(data.status == 'fail') {
        alert(data.message)
        hideLoader()
        return
    }
    userState.name = data.data.user.name
    userState.email = data.data.user.email
    userState.isLoggedIn = true;
    emitter.emit('closeModal')
    // SignUpPopupOpen.value = false;
}

</script>

<template>
    <!-- <div class="popup" :class="{ 'popup-open': SignUpPopupOpen }"> -->
        <div class="popup-item scale popup-row">
            <ion-icon name="close-outline" class="popup-close" @click="emitter.emit('closeModal')"></ion-icon>
            <div class="signup--inputs">
                <img src="../../images/logo.png" alt="" class="signup--logo">
                <p class="signup--header">Welcome to sniffle!</p>
                <p class="signup--subheader">Let's get you adopting.</p>
                <div class="signup--scroller popup-row" :class="{ 'signup--scroller-toggled': scrolledToggled }">
                    <div class="signup">
                    <form class="popup-item--group">
                        <div class="popup-item--input">
                            <label class="popup-item--input-label" for="email">Email</label>
                            <input :disabled="scrolledToggled" type="email" class="popup-item--input-field" name="email" v-model="email" required>
                        </div>
                        <div class="popup-item--input">
                            <label class="popup-item--input-label" for="fullname">Full name</label>
                            <input :disabled="scrolledToggled" type="fullname" class="popup-item--input-field" name="fullname" v-model="name" required>
                        </div>
                        <div class="popup-item--input">
                            <label class="popup-item--input-label" for="password">Password</label>
                            <input :disabled="scrolledToggled" type="password" class="popup-item--input-field" name="password" v-model="password" required>
                        </div>
                        <button :disabled="scrolledToggled" class="popup-item--button" @click="getActivationCode($event)">Open your account now!</button>
                    </form>
                </div>
                <div class="login">
                    <form class="popup-item--group">
                    <div class="popup-item--input">
                        <label class="popup-item--input-label" for="email">Email</label>
                        <input :disabled="!scrolledToggled" type="email" class="popup-item--input-field" name="email" v-model="emailLogin" required>
                    </div>
                    <div class="popup-item--input">
                        <label class="popup-item--input-label" for="password">Password</label>
                        <input :disabled="!scrolledToggled" type="password" class="popup-item--input-field" name="password" v-model="passwordLogin" required>
                    </div>
                    <button :disabled="!scrolledToggled" class="popup-item--button" @click="login($event)">Continue adopting!</button>
                    <a :disabled="!scrolledToggled" @click="$event.preventDefault(); emitter.emit('forgotPassword')" class="signup--changeview signup--forgotpass">Forgot password</a>
                </form>
                </div>
                </div>
                <a href="" @click="$event.preventDefault(); scrolledToggled = !scrolledToggled" class="signup--changeview">{{ scrolledToggled ? "I am not adopting yet." : 'I am adopting already!' }}</a>
            </div>
            <img class="signup--image" src="../../images/modal/signup.png" alt="">
        </div>
    <!-- </div> -->
</template>

<style lang='scss'>

.signup{
    &--logo{
        width: 20rem;
        margin-bottom: 2rem;
    }

    &--image{
        @media screen and (max-width: 1000px) {
            display: none;
        }
    }

    &--inputs{
        width: 36rem;
        overflow: hidden;
    }

    &--header{
        font-size: var(--heading3);
        font-family: BerlinBold;
        letter-spacing: -1.5px;
    }

    &--subheader{
        font-size: var(--heading5);
        // font-family: BerlinMedium;
        // letter-spacing: -1.5px;
        margin-bottom: 4rem;
        font-weight: 300;
    }

    &--scroller{
        position: relative;
        width: 36rem;
        transition: 100ms;

        &-toggled{
            transform: translateX(-105%);
        }

        & .signup, & .login{
            padding: .3rem;
            min-width: 36rem;
        }
    }

    &--changeview{
        display: block;
        // width: 100%;
        text-align: center;
        text-decoration: none;
        font-size: var(--small);
        color: #000;
        cursor: pointer;

        &:hover{
            text-decoration: underline;
        }
    }

    &--forgotpass{
        margin-top: 2rem;
    }
}

</style>