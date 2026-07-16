<template>
  <q-card
    flat
    bordered
    class="full-height column rounded-borders"
    :class="{ 'plan-card--recommended': recommended }"
  >
    <q-card-section class="q-pa-lg col">
      <div class="row items-center q-gutter-sm q-mb-sm">
        <div class="text-h5 text-weight-bold">{{ name }}</div>
        <q-badge v-if="recommended" color="primary" label="Recomendado" />
      </div>

      <p class="text-body2 text-grey-7 q-mb-md">{{ description }}</p>

      <div class="q-mb-lg">
        <span class="text-h4 text-weight-bold">{{ price }}</span>
        <span v-if="priceSuffix" class="text-body2 text-grey-7">
          {{ priceSuffix }}
        </span>
      </div>

      <div class="text-subtitle2 text-weight-bold q-mb-sm">Inclui</div>
      <q-list dense>
        <q-item v-for="item in features" :key="item" class="q-px-none">
          <q-item-section avatar>
            <q-icon name="mdi-check" color="positive" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body2">{{ item }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <template v-if="limitations?.length">
        <q-separator class="q-my-md" />
        <div class="text-subtitle2 text-weight-bold q-mb-sm">Limitações</div>
        <q-list dense>
          <q-item v-for="item in limitations" :key="item" class="q-px-none">
            <q-item-section avatar>
              <q-icon name="mdi-minus" color="grey-5" size="xs" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-body2 text-grey-7">
                {{ item }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-card-section>

    <q-separator />

    <q-card-actions class="q-pa-lg">
      <q-btn
        :label="buttonLabel"
        :color="recommended ? 'primary' : undefined"
        :outline="!recommended"
        :text-color="recommended ? undefined : 'primary'"
        no-caps
        unelevated
        class="full-width"
        size="md"
        :href="adminUrl"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  description: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  limitations?: string[];
  recommended?: boolean;
  buttonLabel: string;
  adminUrl: string;
}>();
</script>

<style scoped>
.plan-card--recommended {
  border: 2px solid var(--q-primary);
  box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
}
</style>
