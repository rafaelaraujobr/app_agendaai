<template>
  <section id="como-funciona" class="q-py-xl bg-grey-1">
    <div class="wrapper q-px-md">
      <div class="text-center q-mb-xl">
        <div class="text-overline text-primary">Como funciona</div>
        <h2 class="text-h4 text-weight-bold q-my-sm">
          Três passos para começar
        </h2>
      </div>

      <div class="row q-col-gutter-lg justify-center">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          class="col-12 col-md-4"
        >
          <q-card flat bordered class="full-height rounded-borders text-center">
            <q-card-section class="q-pa-lg">
              <q-avatar
                color="primary"
                text-color="white"
                size="56px"
                class="text-h6 text-weight-bold"
              >
                {{ index + 1 }}
              </q-avatar>
              <div class="text-h6 text-weight-bold q-mt-lg">
                {{ step.title }}
              </div>
              <p class="text-body2 text-grey-7 q-mb-none q-mt-sm">
                {{ step.description }}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: "Cadastre seu negócio",
    description:
      "Informe nome, serviços, valores, horários e dados básicos.",
  },
  {
    title: "Compartilhe seu link",
    description:
      "Envie pelo WhatsApp, coloque no Instagram ou publique nas suas redes.",
  },
  {
    title: "Receba agendamentos",
    description:
      "O cliente escolhe serviço, data e horário. Você acompanha tudo pela agenda.",
  },
];
</script>
