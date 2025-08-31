import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize user store after pinia is set up
import { useUserStore } from './stores/user.js'
const userStore = useUserStore()
userStore.initializeAuth()

app.mount('#app')
