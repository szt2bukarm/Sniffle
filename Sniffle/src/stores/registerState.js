import { defineStore } from "pinia";

export const useRegisterState = defineStore("registerState", {
    state: () => ({
        email: null,
        name: null,
        password: null
    }),

    persist: {
        storage: sessionStorage
    }
})