import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import router from './router/index.js'

import { createI18n } from 'vue-i18n'
import EN from './locale/en.json'
import UZ from './locale/uz.json'

const i18n = createI18n({
  locale: 'UZ',
  messages: { EN, UZ }
})

const app = createApp(App)
app.use(i18n)
app.use(router)

// OPTIONAL: make axios available as this.$http
app.config.globalProperties.$http = axios
// Or just import axios directly where you need it

app.mount('#app')
