<template>
  <q-page class="flex flex-center">
    <div class="row q-gutter-x-md">
      <div class="col-12">
        <p>Subdomain: {{ subdomain }}</p>
      </div>
      <q-input
        v-model="text"
        color="primary"
        bg-color="grey-1"
        class="border-grey-2 prepend-custom"
        dense
        outlined
      >
        <template #prepend>
          <q-icon name="mdi-plus" />
        </template>
        <template #append>
          <q-icon name="mdi-ab-testing" />
        </template>
      </q-input>
    </div>
  </q-page>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
const subdomain = useState<string | null>("subdomain");

const text = ref<string>("");
</script>

<style lang="sass" scoped></style>
