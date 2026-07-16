<template>
  <section class="q-py-xl bg-grey-1">
    <div class="wrapper q-px-md">
      <q-card flat class="rounded-borders bg-primary text-white">
        <q-card-section class="column items-center text-center q-pa-xl">
          <q-icon name="mdi-calendar-check-outline" size="48px" class="q-mb-md" />
          <h2 class="text-h4 text-weight-bold q-my-none">
            Comece hoje a organizar sua agenda online
          </h2>
          <p class="text-body1 q-mt-md q-mb-none opacity-90">
            Crie sua página, compartilhe seu link e facilite o agendamento dos
            seus clientes.
          </p>

          <div class="row q-gutter-sm q-mt-xl justify-center full-width">
            <div class="col-12 col-sm-auto">
              <q-btn
                label="Começar agora"
                icon-right="mdi-arrow-right"
                color="white"
                text-color="primary"
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
                color="white"
                size="lg"
                no-caps
                outline
                class="full-width"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  adminUrl: string;
}>();
</script>
