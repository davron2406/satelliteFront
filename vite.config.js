import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

    // options...
    devServer: {
          proxy: 'http://localhost:5173/',
    }
      
})
