import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import Particles from "@tsparticles/vue3";

async function initEngine(engine: Engine) {
  await loadSlim(engine);
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Particles, { init: initEngine });
});
