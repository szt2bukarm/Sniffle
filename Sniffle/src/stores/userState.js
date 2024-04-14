import { defineStore } from "pinia";

export const useUserState = defineStore("userState", {
    state: () => ({
        email: null,
        name: null,
        isLoggedIn: false
    }),

    persist: {
        storage: sessionStorage
    }
})