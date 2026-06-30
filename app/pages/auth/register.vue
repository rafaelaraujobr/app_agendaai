<template>
  <q-page class="flex flex-center">
    <q-card flat style="width: 350px" class="bg-transparent">
      <q-form @submit.prevent="handleSubmit">
        <q-card-section>
          <div class="row items-center justify-center">
            <div class="col-12 text-center text-weight-medium text-h6 q-mt-sm">
              Crie sua conta
            </div>
            <div class="col-12 text-center text-grey-6 text-subtitle2">
              É rápido e fácil!
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row items-center justify-center q-gutter-y-sm">
            <q-btn
              no-caps
              unelevated
              dense
              label="Continuar com Google"
              :icon="`img:${googleIcon}`"
              :loading="googleLoading"
              padding="sm md"
              class="bg-white full-width border-xs-grey-3 text-primary"
              @click="handleGoogleLogin"
            />
          </div>
          <div class="row items-center q-mt-md">
            <div class="col-5"><q-separator /></div>
            <div class="col-2 text-center text-grey-6 text-subtitle2">Ou</div>
            <div class="col-5"><q-separator /></div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            Nome completo
          </label>
          <q-input
            v-model="name"
            outlined
            autocomplete="off"
            bg-color="grey-1"
            dense
            outofocus
            :rules="[
              (val) => (val !== null && val !== '') || 'O email é obrigatório',
              (val) => val.length <= 50 || 'Máximo de 50 caracteres',
              (val) => val.length >= 3 || 'Mínimo de 3 caracteres',
            ]"
          />
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
          <label class="text-weight-medium text-subtitle2">Senha</label>
          <q-input
            v-model="password"
            outlined
            bg-color="grey-1"
            autocomplete="new-password"
            dense
            maxlength="20"
            :type="showPassword ? 'text' : 'password'"
            :rules="[
              (val) => (val !== null && val !== '') || 'A senha é obrigatória',
              (val) => val.length <= 20 || 'Máximo de 20 caracteres',
              (val) => val.length >= 6 || 'Mínimo de 8 caracteres',
            ]"
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                :name="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <div class="row items-center justify-start q-px-none">
            <div class="col-auto">
              <q-checkbox
                v-model="terms"
                label="Li e aceito com os "
                color="primary"
                dense
              />
            </div>
            <div class="col-auto text-grey-6 text-subtitle2 q-ml-xs">
              <router-link
                to="/auth/terms"
                class="text-primary text-weight-medium text-subtitle2"
                style="text-decoration: none"
                >Termos e condições</router-link
              >
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn
            type="submit"
            label="Criar conta"
            color="primary"
            :loading="loading"
            no-caps
            padding="sm lg"
            class="full-width"
          />
          <div class="row items-center justify-center q-my-md">
            <span class="text-grey-6 text-weight-medium text-subtitle2 q-mr-xs">
              Já tem uma conta?
            </span>
            <router-link
              to="/auth/login"
              class="text-primary text-weight-medium text-subtitle2"
              style="text-decoration: none"
              >Fazer login</router-link
            >
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import googleIcon from "~/assets/images/google.svg";
const name = ref<string>("");
const email = ref<string>("");
const terms = ref<boolean>(false);
const password = ref<string>("");
const showPassword = ref<boolean>(false);
const loading = ref<boolean>(false);
const googleLoading = ref<boolean>(false);

const handleSubmit = async () => {
  loading.value = true;
};

const handleGoogleLogin = async () => {
  googleLoading.value = true;
};
</script>
