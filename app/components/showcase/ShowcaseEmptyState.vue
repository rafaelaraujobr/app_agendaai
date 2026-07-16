<template>
  <div
    class="column items-center justify-center text-center q-pa-lg"
    style="min-height: 70vh"
  >
    <q-icon
      :name="
        isBusinessNotFound
          ? 'mdi-store-search-outline'
          : 'mdi-alert-circle-outline'
      "
      color="grey-6"
      size="80px"
    />
    <h1 class="text-h5 text-weight-bold q-mb-sm">
      {{
        isBusinessNotFound
          ? "Loja não encontrada"
          : "Não foi possível carregar a loja"
      }}
    </h1>
    <p class="text-body1 text-grey-7 q-mt-none">
      {{
        isBusinessNotFound
          ? "Não encontramos uma loja cadastrada neste endereço."
          : "Ocorreu um erro ao carregar as informações. Tente novamente."
      }}
    </p>
    <q-btn
      label="Tentar novamente"
      icon="mdi-refresh"
      color="primary"
      no-caps
      unelevated
      class="q-mt-md"
      @click="$emit('retry')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isBusinessNotFound: boolean;
}>();

defineEmits<{
  retry: [];
}>();
</script>
