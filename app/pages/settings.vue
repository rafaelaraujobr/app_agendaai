<template>
  <q-page padding class="wrapper">
    <q-toolbar>
      <q-toolbar-title> Configurações </q-toolbar-title>
    </q-toolbar>
    <q-tabs
      v-model="tab"
      class="text-grey-8"
      active-color="primary"
      indicator-color="primary"
      align="left"
      no-caps
    >
      <q-tab name="company" label="Empresa" />
      <q-tab name="profile" label="Meu Perfil" />
      <q-tab name="plans" label="Planos e Pagamentos" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="company" class="q-pa-none">
        <q-splitter v-model="splitterModel" style="height: 250px">
          <template v-slot:before>
            <q-tabs
              v-model="innerTab"
              vertical
              no-caps
              inline-label
              align="left"
              class="settings-nav-tabs"
            >
              <q-tab
                name="innerCompany"
                label="Perfil do Negócio"
                icon="business"
              />
              <q-tab name="innerProfile" label="Link de acesso" icon="link" />
              <q-tab name="innerPlans" label="Localização" icon="location_on" />
              <q-tab
                name="innerPlans"
                label="Horários de atendimento"
                icon="schedule"
              />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="innerTab"
              animated
              transition-prev="slide-down"
              transition-next="slide-up"
            >
              <q-tab-panel name="innerCompany">
                <div class="text-h4 q-mb-md">Perfil do Negócio</div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
                  praesentium cumque magnam odio iure quidem, quod illum numquam
                  possimus obcaecati commodi minima assumenda consectetur culpa
                  fuga nulla ullam. In, libero.
                </p>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
                  praesentium cumque magnam odio iure quidem, quod illum numquam
                  possimus obcaecati commodi minima assumenda consectetur culpa
                  fuga nulla ullam. In, libero.
                </p>
              </q-tab-panel>
              ▸ …
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-tab-panel>

      <q-tab-panel name="profile">
        <div class="text-h6">Meu Perfil</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="plans">
        <div class="text-h6">Planos e Pagamentos</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const tab = ref("company");
const innerTab = ref("innerCompany");
const splitterModel = ref(20);
</script>

<style scoped lang="sass">
.settings-nav-tabs
  :deep(.q-tab)
    justify-content: flex-start

  :deep(.q-tab__content)
    width: 100%
    justify-content: flex-start
    text-align: left
</style>
