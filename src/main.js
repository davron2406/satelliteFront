
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import router from './router'

axios.defaults.baseURL = 'http://localhost:8080/api';

const app = createApp(App).use(router)

app.config.globalProperties.$axios = axios

app.mount('#app')
