// Temporary demo file to show cart UI without authentication
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import CSS
import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

// For demo purposes, simulate a logged-in user
const userStore = {
  isAuthenticated: true,
  userName: 'Demo User',
  userEmail: 'demo@example.com'
}

// Mock localStorage
if (typeof window !== 'undefined') {
  window.localStorage.setItem('token', 'demo-token')
}

app.use(createPinia())
app.use(router)

app.mount('#app')