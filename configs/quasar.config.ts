import type { ModuleOptions } from "nuxt-quasar-ui";

export const quasarConfig: ModuleOptions = {
  sassVariables: "~/assets/styles/quasar-variables.sass",
  plugins: ["Dialog", "Loading", "Notify", "Dark", "Screen"],
  lang: "pt-BR",
  extras: {
    fontIcons: ["mdi-v7"],
  },
  config: {
    loading: {
      message: "Carregando...",
      spinnerColor: "primary",
      spinnerSize: 140,
      backgroundColor: "white",
    },
    notify: { position: "top", timeout: 2500 },
  },
  components: {
    defaults: {
      QBtn: {
        unelevated: true,
      },
    },
  },
};
