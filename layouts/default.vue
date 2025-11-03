<script setup lang="ts">
import PopUpMensaje from '~/components/pagesContainer/Alumnos/PopUpMensaje.vue';
import { useMsgPopUpStore } from '~/stores/msgPopup';

const router = useRouter();
const tokenStore = useTokenStore();
const msgPopupStore = useMsgPopUpStore();
const profileStore = useProfileStore();

// --- INICIO: LÓGICA DE CARGA DE PERFIL EN EL LAYOUT ---
// Esta función se ejecutará una sola vez cuando el layout se monte.
onMounted(async () => {
  await profileStore.fetchProfile();
});

</script>
<template>
  <div class="fixed w-full h-full top-0 bg-primary flex justify-center items-center" v-if="tokenStore.pending">
      <p class="text-white font-bold text-xl font-grotesk">Cargando...</p>
  </div>
  <div class="md:grid md:grid-cols-[auto_1fr]" v-if="!tokenStore.pending && router.currentRoute.value.name !== 'login' && tokenStore.accessToken">
    <MenuComponent />
    <div class="relative top-[64px] flex flex-col min-h-[calc(100vh_-_64px)]">
      <div class="h-full page">
        <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
      </div>
    </div>
  </div>
  <div class="h-full" v-if="!tokenStore.pending && router.currentRoute.value.name === 'login'">
    <NuxtPage />
  </div>
  <PopUpMensaje 
    :message="msgPopupStore.message" 
    :type="msgPopupStore.type"
    v-model:show="msgPopupStore.show"
  />
  <BasePopUpBottom />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.1s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
