import './assets/main.css'
import './scss/styles.scss'

import { createApp } from 'vue'
import Notifications from '@kyvg/vue3-notification'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { createPersistedState } from "pinia-plugin-persistedstate"
import 'bootstrap'

import App from './App.vue'

// create the app instance
const app = createApp(App)

// initiate the pinia store
const pinia = createPinia()
pinia.use(createPersistedState({
  storage: {
    getItem: (key) => window.electron.store.get(key),
    setItem: (key, value) => window.electron.store.set(key, value)
  },
  serializer: {
    // those will make sure the config is saved as JSON and not as stringified JSON
    serialize: (value) => JSON.parse(JSON.stringify(value)),
    deserialize: (value) => value
  }
}))
app.use(pinia)

// initiate the vuetify instance
const vuetify = createVuetify()
app.use(vuetify)

// initiate the notification plugin
app.use(Notifications);

// mount the app
app.mount('#app')
