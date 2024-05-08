import './assets/main.css'
import './scss/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import 'bootstrap'

import favicon from './assets/favicon.ico'
import App from './App.vue'

// Create the favicon link element
const link = document.createElement('link')
link.rel = 'icon'
link.href = favicon
document.head.appendChild(link)

// create the app instance
const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)

app.mount('#app')
