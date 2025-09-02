import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import router from './router'

import { createI18n } from 'vue-i18n'
import EN from './locale/en.json'
import UZ from './locale/uz.json'


const i18n = createI18n({
    locale: 'UZ',
    messages: {
        EN: EN,
        UZ: UZ,
    }
  })

  const app = createApp(App).use(i18n).use(axios).use(router)

app.mount('#app')
