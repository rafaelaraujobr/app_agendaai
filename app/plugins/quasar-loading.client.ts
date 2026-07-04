import { Loading } from "quasar";
import LottieLoading from "@/components/loading/LottieLoading.vue";

export default defineNuxtPlugin(() => {
  Loading.setDefaults({
    spinner: LottieLoading,
    message: "Carregando...",
    spinnerColor: "primary",
    spinnerSize: 300,
    backgroundColor: "white",
  });
});
