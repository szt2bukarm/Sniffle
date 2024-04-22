<script setup>
import { onMounted,ref,inject } from 'vue';
import { useUserState } from '@/stores/userState';
import router from '@/router';
import { useRoute } from 'vue-router';
import searchbox from './SearchBox.vue';
const userState = useUserState();
const userOptions = ref(false);
const shrinkedNav = ref(false);
const searchFocused = ref(false);
const emitter = inject('emitter');
const route = useRoute();

const checkNavScroll = function() {
    if (scrollY > 50) {
        shrinkedNav.value = true
    } else {
        shrinkedNav.value = false
    }
}


window.addEventListener('scroll', checkNavScroll)


const logOut = function() {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log(document.cookie);
    userState.isLoggedIn = false
    userState.name = null
    userState.email = null
    userOptions.value = false
}

const returnHome = function() {
    if(route.name == 'home') return
    window.scrollTo(0,0)
    router.push('/')
}


const expandSearch = function() {
    searchFocused.value = true;
    shrinkedNav.value = true
    window.removeEventListener('scroll', checkNavScroll)
}

const shrinkSearch = function() {
    searchFocused.value = false;
    scrollY > 50 ? shrinkedNav.value = true : shrinkedNav.value = false
    window.addEventListener('scroll', checkNavScroll)
}


</script>

<template>
    <div class="navbar" :class="{ 'navbar--shrinked': shrinkedNav }">
        <img @click="returnHome" style="z-index: -2;" src="../images/logo.png" class="navbar--logo" :class="{ 'navbar--shrinked--logo': shrinkedNav }">
        <div class="navbar--search" :class="{ 'navbar--shrinked--search': shrinkedNav }">
            <input @click="expandSearch" :class="{ 'navbar--shrinked--search__input': shrinkedNav }" type="text" class="navbar--search__input" placeholder="Find your new best friend..." >
            <ion-icon class="navbar--search__input-icon" name="search"></ion-icon>
            <transition name="fade" mode="out-in">
                <div v-if="searchFocused" :key="searchFocused">
                    <div class="navbar--overlay" @click="shrinkSearch"></div>
                    <div class="navbar--search__box">
                        <searchbox />
                    </div>
                </div>
            </transition>
        </div>
        <button v-if="!userState.isLoggedIn" style="z-index: -2;" @click="emitter.emit('signup')" class="navbar--profile-login" :class="{ 'navbar--shrinked--cta': shrinkedNav }">
            <ion-icon class="navbar--profile-icon" name="person"></ion-icon>
            Sign up
        </button>
        <div v-else style="z-index: -2;" class="navbar--profile-loggedin-wrapper">
            <button @click="userOptions = !userOptions" class="navbar--profile-loggedin" :class="{ 'navbar--shrinked--cta': shrinkedNav }">
            <ion-icon class="navbar--profile-arrow" name="chevron-down" :style="{ transform: userOptions ? 'rotate(180deg)' : 'rotate(0deg)' }"></ion-icon>
            <div class="navbar--profile-loggedin-image-wrapper">
                <img src="https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg" alt="" class="navbar--profile-loggedin-image">
            </div>
        </button>
        <div class="navbar--user-options" v-if="userOptions">
           <p class="navbar--user-options-name">{{ userState.name }}</p>
            <div class="navbar--user-options-item" @click="$router.push('/newlisting'); userOptions = false">
                <ion-icon name="add-circle" class="navbar--user-options-icon" ></ion-icon>
                <p>Add Listing</p>
            </div>
            <div class="navbar--user-options-item navbar--user-options-logout" @click="logOut">
                <ion-icon name="log-out" class="navbar--user-options-icon" ></ion-icon>
                <p>Log out</p>
            </div>
        </div>
        </div>
    </div>
</template>

<style lang='scss'>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 100ms;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.navbar{
    display: flex;
    height: 20rem;
    padding: 2rem 15%;
    align-items: center;
    background: linear-gradient(#000000ab 0%, transparent 90%);
    z-index: 9;
    transition: 200ms;

    @media screen and (max-width: 1400px) {
        padding: 2rem 5%;
    }

    &--overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        opacity: 1;
        background-color: #00000050;
        z-index: -1;
    }

    &--logo{
        width: 20%;
        filter: invert(100%);
        transition: 200ms;
    }

    &--search{
        position: relative;
        width: 50rem;
        transition: 200ms;
        margin-inline: auto;


        &__input{
            width: 100%;
            height: 5rem;
            border-radius: 2rem;
            border: 0;
            padding: 2rem;
            transition: 200ms;
            z-index: 99;

            &-icon{
                position: absolute;
                right: 2rem;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1;
                font-size: 2rem;
            }
        }

        &__box{
            position: absolute;
            top: 0;
            // opacity: 0;
            width: 100%;
            height: 0;
            background-color: #fff;
            box-shadow: 0 0 3rem rgba(0, 0, 0, 0.2);
            border-radius: 2rem;
            z-index: -1;
            animation: showBox 200ms forwards 100ms;
            overflow-y: hidden;

            @keyframes showBox {
                to{
                    height: 40rem;
                }
            }
        }
    }

    &--profile{
        
        &-login{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 11rem;
            padding: 1.5rem;
            font-size: 1.6rem;
            border-radius: 2rem;
            border: 0;
            background-color: #fff;
            color: #000;
            transition: 100ms;
            cursor: pointer;

            &:hover{
                background-color: darken($color: #fff, $amount: 15%);
                scale: .95;
            }   
        }

        &-icon{
            transform: translateY(1px);
            // font-size: 1.9rem;
        }

        &-arrow{
                margin-inline: .5rem;
                font-size: 2rem;
                transition: 50ms;
        }

        &-loggedin{
            &-wrapper{
                position: relative;
            }
            display: flex;
            justify-content: space-between;
            align-items: center;
            // width: 11rem;
            padding: 1rem;
            font-size: 1.6rem;
            border-radius: 2rem;
            border: 0;
            background-color: #fff;
            color: #000;
            transition: 100ms;
            cursor: pointer;
            overflow: hidden;

            &:hover{
                background-color: darken($color: #fff, $amount: 15%);
                scale: .95;
            } 

            &-image{
                &-wrapper{
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    overflow: hidden;
                    box-shadow: 0 0 3rem rgba(0, 0, 0, 0.25);
                }
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    &--user-options{
        position: absolute;
        bottom: -14rem;
        right: 0;
        width: 15.5rem;
        background-color: #fff;
        box-shadow: 0 0 3rem rgba(0, 0, 0, 0.2);
        border-radius: 1rem;
        // padding: 2rem;
        display: flex;
        flex-direction: column;
        // gap: 1rem;
        overflow: hidden;

        &-name{
            // padding: 1rem 2rem;
            font-size: var(--paragraph);
            padding: 1rem;
            text-align: right;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        &-item{
            display: flex;
            align-items: center;
            gap: 1rem;
            // justify-content: center;
            font-size: var(--paragraph);
            padding: 1rem 2rem;
            cursor: pointer;
            transition: 100ms;

            &:hover{
                scale: .99;
                background-color: lighten($color: #000000, $amount: 90%);
            }
        }

        &-logout{
            &:hover{
                scale: .99;
                background-color: var(--low);
            }
        }

        &-icon{
            font-size: var(--heading5) !important;
        }
    }
}

.navbar--shrinked{
    width: 100%;
    height: 8rem;
    padding: 1rem 5%;
    background: #fff;
    box-shadow: 0 0 3rem rgba(0, 0, 0, 0.2);


    &--logo{
        width: 10rem;
        filter: invert(0);
    }

    &--search{
        width: 65rem;

        &__input{
        height: 4rem;
        padding: 1rem;
        box-shadow: 0 0 3rem rgba(0, 0, 0, 0.1);
    }
    }

    &--cta{
        box-shadow: 0 0 3rem rgba(0, 0, 0, 0.1);
        border-radius: 5rem
    }
}


</style>