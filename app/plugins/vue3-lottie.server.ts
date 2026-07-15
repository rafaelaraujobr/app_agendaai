import { defineComponent } from "vue";

const Vue3LottieServerPlaceholder = defineComponent({
  name: "Vue3LottieServerPlaceholder",
  setup: () => () => null,
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Vue3Lottie", Vue3LottieServerPlaceholder);
});
