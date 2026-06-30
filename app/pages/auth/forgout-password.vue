<template>
  <q-page class="flex flex-center">
    <q-card flat style="width: 350px" class="bg-transparent">
      <q-form @submit.prevent="handleSubmit" class="q-mb-sm">
        <q-card-section>
          <div class="row items-center justify-center">
            <div class="col-12 text-center text-weight-medium text-h6 q-mt-sm">
              Esqueceu sua senha?
            </div>
            <div class="col-12 text-center text-grey-6 text-subtitle2 q-mt-sm">
              Enviaremos um link de recuperação de senha para o seu e-mail.
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pb-none">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            E-mail
          </label>
          <q-input
            v-model="email"
            outlined
            bg-color="grey-1"
            dense
            autocomplete="off"
            outofocus
            :rules="[
              (val) => (val !== null && val !== '') || 'O email é obrigatório',
              (val) => val.length <= 50 || 'Máximo de 50 caracteres',
              (val) => val.length >= 3 || 'Mínimo de 3 caracteres',
            ]"
          />
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <q-btn
            type="submit"
            label="Enviar link de recuperação"
            color="primary"
            :loading="loading"
            no-caps
            padding="sm lg"
            class="full-width"
          />
          <q-btn
            to="/auth/login"
            label="Voltar para o login"
            color="primary"
            no-caps
            outline
            padding="sm lg"
            class="full-width"
          />
        </q-card-section>
      </q-form>
      <q-item class="bg-grey-2 rounded-border">
        <q-item-section top side>
          <q-icon name="mdi-information-outline" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label caption class="text-dark text-weight-medium"
            >Não se preocupe, acontece com todo mundo!</q-item-label
          >
          <q-item-label caption> O link expira em 1 hora. </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
const email = ref<string>("");
const loading = ref<boolean>(false);

const handleSubmit = async () => {
  loading.value = true;
};
</script>
