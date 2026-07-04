<template>
  <q-page class="flex flex-center">
    <q-card flat style="width: 350px" class="bg-transparent">
      <q-form @submit.prevent="handleLogin">
        <q-card-section>
          <div class="row items-center justify-center">
            <div class="col-12 text-center text-weight-medium text-h6 q-mt-sm">
              Bem-vindo de volta!
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
              :loading="isLoadingGoogle"
              padding="sm md"
              class="bg-white full-width border-xs-grey-3 text-primary"
              @click="handleGoogleLogin"
            >
              <template #loading>
                <div style="margin-top: -53px">
                  <client-only>
                    <Vue3Lottie
                      :animation-data="GoogleAnimation"
                      :height="150"
                      :width="150"
                    />
                  </client-only>
                </div>
              </template>
            </q-btn>
          </div>
          <div class="row items-center q-mt-md">
            <div class="col-5"><q-separator /></div>
            <div class="col-2 text-center text-grey-6 text-subtitle2">Ou</div>
            <div class="col-5"><q-separator /></div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <label class="text-weight-medium text-subtitle2 q-mb-xs">
            E-mail
          </label>
          <q-input
            v-model="email"
            outlined
            bg-color="grey-1"
            dense
            autocomplete="off"
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
            dense
            maxlength="20"
            autocomplete="new-password"
            :type="showPassword ? 'text' : 'password'"
            :rules="[
              (val) => (val !== null && val !== '') || 'A senha é obrigatória',
              (val) => val.length <= 20 || 'Máximo de 20 caracteres',
              (val) => val.length >= 5 || 'Mínimo de 5 caracteres',
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
          <div class="row justify-end items-center" style="margin-top: -20px">
            <router-link
              to="/auth/forgout-password"
              class="text-primary text-weight-medium text-subtitle2 q-py-sm"
              style="text-decoration: none"
              >Esqueci minha senha</router-link
            >
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn
            type="submit"
            label="Entrar"
            color="primary"
            :loading="loading"
            no-caps
            padding="sm lg"
            class="full-width"
          />
          <div class="row items-center justify-center q-my-md">
            <span class="text-subtitle2 q-mr-xs">Ainda não tem uma conta?</span>
            <router-link
              to="/auth/register"
              class="text-primary text-weight-medium text-subtitle2"
              style="text-decoration: none"
              >Criar conta</router-link
            >
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
import googleIcon from "~/assets/images/google.svg";
import GoogleAnimation from "~/assets/lotties/google.json";
import useAuth from "~/composables/useAuth";

const { loginWithGoogle, login } = useAuth();

const email = ref<string>("admin@gmail.com");
const password = ref<string>("admin@123");
const showPassword = ref<boolean>(false);
const loading = ref<boolean>(false);
const isLoadingGoogle = ref<boolean>(false);

const handleGoogleLogin = async () => {
  isLoadingGoogle.value = true;
  await loginWithGoogle();
};

const handleLogin = async () => {
  try {
    loading.value = true;
    await login(email.value, password.value);
    await navigateTo("/");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
