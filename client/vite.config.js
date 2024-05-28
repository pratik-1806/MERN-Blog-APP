import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/api': {
        target: 'https://mern-blog-app-0dcs.onrender.com', // Replace with your backend API URL
        changeOrigin: true, // Change the origin header to match frontend
        secure: false, // Allow for insecure connections if needed (for development)
      },
    }
  },
  plugins: [react()],
})
