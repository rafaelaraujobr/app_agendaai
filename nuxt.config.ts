// https://nuxt.com/docs/api/configuration/nuxt-config
import { quasarConfig } from "./configs/quasar.config";
import { nitroConfig } from "./configs/nitro.config";
import { appConfig } from "./configs/app.config";
import { nodemailerConfig } from "./configs/nodemailer.config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  routeRules: {
    "/auth/**": { ssr: false },
  },
  vite: {
    optimizeDeps: {
      include: [
        "vue-advanced-cropper",
        "vue3-lottie",
      ],
    },
  },
  css: ["@/assets/styles/custom.sass", "@/assets/styles/colors.sass"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "nuxt-quasar-ui",
    "nuxt-auth-utils",
    "nuxt-nodemailer",
  ],
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD,
      cookie: {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  nodemailer: nodemailerConfig,
  quasar: quasarConfig,
  nitro: nitroConfig,
  app: appConfig,
});
