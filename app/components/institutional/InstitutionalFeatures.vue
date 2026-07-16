<template>
  <section id="funcionalidades" class="q-py-xl bg-white">
    <div class="wrapper q-px-md">
      <div class="text-center q-mb-xl">
        <div class="text-overline text-primary">Funcionalidades</div>
        <h2 class="text-h4 text-weight-bold q-my-sm">
          Recursos para o seu dia a dia
        </h2>
        <p class="text-body1 text-grey-7 q-mb-none">
          Tudo integrado para você focar no atendimento.
        </p>
      </div>

      <div class="row q-col-gutter-md">
        <div
          v-for="feature in features"
          :key="feature"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-item class="rounded-borders bg-grey-1 q-pa-md full-height">
            <q-item-section avatar>
              <q-icon name="mdi-check-circle" color="positive" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">
                {{ feature }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  "Página pública personalizada",
  "Cadastro de serviços",
  "Preço e duração por serviço",
  "Agenda do dia",
  "Horários disponíveis",
  "Pedido de agendamento",
  "Confirmação pelo WhatsApp",
  "Bloqueio de horários",
  "Cadastro simples de clientes",
  "Visualização mobile",
];
</script>
