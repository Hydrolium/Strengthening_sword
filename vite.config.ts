import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: 'index.html',
        howToPlay: 'how_to_play.html'
      }
    }
  },
  base: '/Strengthening_sword/'
})