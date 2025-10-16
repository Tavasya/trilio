import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import sitemap from "vite-plugin-sitemap"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    sitemap({
      hostname: 'https://trilio.app',
      dynamicRoutes: [
        '/blog/linkedin-content-strategies',
        '/blog/ai-replacing-linkedin-marketers',
        '/blog/personal-brand-founder-linkedin',
        '/blog/student-linkedin-opportunities-guide',
        '/tools/linkedin-character-counter',
        '/tools/linkedin-hashtag-generator',
        '/rate-linkedin',
      ],
      readable: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})