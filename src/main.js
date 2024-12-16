
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import router from './router'

axios.defaults.baseURL = 'https://satelliteback.onrender.com/api';

const app = createApp(App).use(router)

app.config.globalProperties.$axios = axios

app.mount('#app')
