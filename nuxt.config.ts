// https://nuxt.com/docs/api/configuration/nuxt-config
import { quasarConfig } from "./app/configs/quasar.config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  routeRules: {
    "/auth/**": { ssr: false },
  },
  css: ["@/assets/styles/custom.sass", "@/assets/styles/colors.sass"],
  modules: ["@nuxt/eslint", "@nuxt/fonts", "@pinia/nuxt", "nuxt-quasar-ui"],
  quasar: quasarConfig,
});
