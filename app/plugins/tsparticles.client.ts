import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

async function initEngine(engine: Engine) {
  await loadSlim(engine);
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Particles, { init: initEngine });
});
