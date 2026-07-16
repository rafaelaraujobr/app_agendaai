<template>
  <InstitutionalHomePage v-if="accessContext === 'institutional'" />
  <ShowcaseHomePage v-else />
</template>

<script setup lang="ts">
import InstitutionalHomePage from "~/components/institutional/InstitutionalHomePage.vue";
import ShowcaseHomePage from "~/components/showcase/ShowcaseHomePage.vue";

definePageMeta({
  layout: "showcase",
  middleware: () => {
    const currentAccessContext = useState<
      "institutional" | "admin" | "showcase"
    >("access-context", () => "institutional");
    if (currentAccessContext.value !== "admin") return;

    const { loggedIn } = useUserSession();
    return navigateTo(loggedIn.value ? "/dashboard" : "/auth/login", {
      replace: true,
    });
  },
});

const accessContext = useState<"institutional" | "admin" | "showcase">(
  "access-context",
  () => "institutional",
);
</script>
