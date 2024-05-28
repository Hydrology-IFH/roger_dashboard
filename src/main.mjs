import './assets/main.css'
import './scss/styles.scss'

import { createApp } from 'vue'
import Notifications from '@kyvg/vue3-notification'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import 'bootstrap'

import App from './App.vue'

// create the app instance
const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)

app.use(Notifications);

app.mount('#app')
