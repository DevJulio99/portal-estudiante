<script setup lang="ts">
import { getProfile } from '~/services/profile';
const router = useRouter();
const tokenStore = useTokenStore();
const isLogin = ref(router.currentRoute.value.name == 'login');
const pendingLog = ref(false);
//const isLogin = router.currentRoute.value.name == 'login';

onMounted(() => {
  const unWatch = watch(
    () => [
      tokenStore.logued,
      tokenStore.pending
    ],
    async ([logueado, pendingLogued]) => {
      isLogin.value = !logueado;
      pendingLog.value = pendingLogued;
      if (!logueado ) {
        unWatch();
      }
    }
  );
});

await getProfile(1);
</script>
<template>
  <div class="fixed w-full h-full top-0 bg-green_60 flex justify-center items-center" v-if="pendingLog">
      <p class="text-white font-bold text-xl font-grotesk">Cargando...</p>
  </div>
  <div class="md:grid md:grid-cols-[auto_1fr]" v-if="!pendingLog && router.currentRoute.value.name != 'login'">
    <MenuComponent />
    <div class="relative top-[64px] flex flex-col min-h-[calc(100vh_-_64px)]">
      <div class="h-full">
        <slot></slot>
      </div>
    </div>
  </div>
  <div class="h-full" v-if="!pendingLog && router.currentRoute.value.name == 'login'">
    <slot></slot>
  </div>
</template>
