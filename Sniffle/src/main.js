import './assets/base.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

import App from './App.vue'
import router from './router'

import mitt from 'mitt';                  // Import mitt
const emitter = mitt();                   // Initialize mitt

const app = createApp(App);
app.provide('emitter', emitter);          // ✅ Provide as `emitter`
app.use(createPinia().use(piniaPluginPersistedState))
app.use(router)

app.mount('#app')
