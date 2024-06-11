import './assets/main.css'
import './scss/styles.scss'
import 'vuetify/styles'

import { createApp } from 'vue'
import Notifications from '@kyvg/vue3-notification'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import 'bootstrap'

import App from './App.vue'

// create the app instance
const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)

const vuetify = createVuetify()
app.use(vuetify)

app.use(Notifications);

app.mount('#app')
