<template>
  <q-page class="bg-grey-1">
    <InstitutionalHeader :admin-url="adminUrl" />
    <InstitutionalHero :admin-url="adminUrl" />
    <InstitutionalBenefits />
    <InstitutionalHowItWorks />
    <InstitutionalFeatures />
    <InstitutionalPlans :admin-url="adminUrl" />
    <InstitutionalFaq />
    <InstitutionalFinalCta :admin-url="adminUrl" />
    <InstitutionalFooter :admin-url="adminUrl" />
  </q-page>
</template>

<script setup lang="ts">
import InstitutionalBenefits from "./InstitutionalBenefits.vue";
import InstitutionalFaq from "./InstitutionalFaq.vue";
import InstitutionalFeatures from "./InstitutionalFeatures.vue";
import InstitutionalFinalCta from "./InstitutionalFinalCta.vue";
import InstitutionalFooter from "./InstitutionalFooter.vue";
import InstitutionalHeader from "./InstitutionalHeader.vue";
import InstitutionalHero from "./InstitutionalHero.vue";
import InstitutionalHowItWorks from "./InstitutionalHowItWorks.vue";
import InstitutionalPlans from "./InstitutionalPlans.vue";

const { adminUrl } = useInstitutionalAdminUrl();

useSeoMeta({
  title: "AgendaAI | Gestão e agendamento online",
  description:
    "Crie uma página personalizada, receba agendamentos online e gerencie seu negócio em um só lugar.",
  ogTitle: "AgendaAI",
  ogDescription: "Gestão e agendamento online para o seu negócio.",
});
</script>
