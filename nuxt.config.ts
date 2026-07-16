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
      include: ["vue-advanced-cropper", "vue3-lottie"],
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
    "@nuxtjs/leaflet",
  ],
  fonts: {
    defaults: {
      weights: [400, 500, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
    },
    families: [
      {
        name: "Montserrat",
        provider: "google",
        global: true,
      },
      {
        name: "Roboto",
        provider: "google",
        global: true,
      },
      {
        name: "Poppins",
        provider: "google",
        global: true,
      },
      {
        name: "Inter",
        provider: "google",
        global: true,
      },
    ],
  },
  runtimeConfig: {
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
      apiKey: process.env.CLOUDINARY_API_KEY || "",
      apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },
    geoapify: {
      apiKey: process.env.GEOAPIFY_API_KEY || "",
    },
    public: {
      rootDomain: process.env.NUXT_PUBLIC_ROOT_DOMAIN || "",
    },
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
