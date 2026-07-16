<template>
  <section class="hero-section q-py-xl">
    <div class="wrapper q-px-md">
      <div class="row q-col-gutter-xl items-center">
        <div class="col-12 col-lg-6">
          <q-badge
            color="blue-1"
            text-color="primary"
            class="q-mb-md q-pa-sm text-body2"
          >
            <q-icon name="mdi-cellphone-check" class="q-mr-xs" />
            Agenda online simples para pequenos negócios
          </q-badge>

          <h1 class="text-h3 text-weight-bold q-my-none hero-title">
            Agenda online simples para organizar seus horários e receber mais
            clientes
          </h1>

          <p class="text-body1 text-grey-7 q-mt-lg q-mb-none">
            Crie uma página de agendamento para seu negócio, compartilhe o link
            no WhatsApp ou Instagram e deixe seus clientes marcarem horário de
            forma rápida e prática.
          </p>

          <div class="row q-gutter-sm q-mt-xl">
            <div class="col-12 col-sm-auto">
              <q-btn
                label="Começar agora"
                icon-right="mdi-arrow-right"
                color="primary"
                size="lg"
                no-caps
                unelevated
                class="full-width"
                :href="adminUrl"
              />
            </div>
            <div class="col-12 col-sm-auto">
              <q-btn
                label="Ver planos"
                href="#planos"
                color="primary"
                size="lg"
                no-caps
                outline
                class="full-width"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <q-card flat bordered class="rounded-borders overflow-hidden shadow-3">
            <q-toolbar class="bg-primary text-white">
              <q-avatar color="white" text-color="primary" icon="mdi-store" />
              <q-toolbar-title class="text-subtitle1 text-weight-bold">
                Studio Bella Unhas
              </q-toolbar-title>
              <q-btn icon="mdi-instagram" flat round dense />
              <q-btn icon="mdi-whatsapp" flat round dense />
            </q-toolbar>

            <q-card-section class="bg-grey-1 q-pa-md">
              <div class="text-caption text-grey-7">Próximos horários</div>
              <div class="text-subtitle1 text-weight-bold">
                Escolha um serviço
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-md">
              <q-list separator class="rounded-borders">
                <q-item v-for="service in previewServices" :key="service.name">
                  <q-item-section avatar>
                    <q-avatar
                      :icon="service.icon"
                      color="blue-1"
                      text-color="primary"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ service.name }}
                    </q-item-label>
                    <q-item-label caption>{{ service.duration }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-weight-bold">
                      {{ service.price }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-btn
                label="Agendar horário"
                icon-right="mdi-calendar-check-outline"
                color="secondary"
                no-caps
                unelevated
                class="full-width q-mt-md"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  adminUrl: string;
}>();

const previewServices = [
  {
    name: "Manicure tradicional",
    duration: "45 min",
    price: "R$ 45",
    icon: "mdi-hand-back-right-outline",
  },
  {
    name: "Design de sobrancelha",
    duration: "30 min",
    price: "R$ 35",
    icon: "mdi-eye-outline",
  },
];
</script>

<style scoped>
.hero-section {
  background: linear-gradient(180deg, #fff 0%, #f9fafb 100%);
}

.hero-title {
  max-width: 640px;
  line-height: 1.15;
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 2.75rem;
  }
}
</style>
