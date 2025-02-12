<script setup lang="ts">
import { getProfile } from '~/services/profile';
const router = useRouter();
const tokenStore = useTokenStore();

console.log('tokenStore accessToken', tokenStore.accessToken);

const unWatch = watch(
    () => [
      tokenStore.logued,
      tokenStore.pending,
      tokenStore.accessToken
    ],
    async ([logueado, pendingLogued, accessToken]) => {
      //console.log('pendingLogued', pendingLogued)
      //console.log('logueado', logueado)
      if(logueado && !pendingLogued){
        await getProfile(parseInt(tokenStore.getDataToken.Id));
      }

      if(!logueado){
       // unWatch();
      }
    }
  );


if(tokenStore.getDataToken && tokenStore.getDataToken.Id && tokenStore.accessToken.trim().length){
    await getProfile(parseInt(tokenStore.getDataToken.Id));
  }


</script>
<template>
  <div class="fixed w-full h-full top-0 bg-green_60 flex justify-center items-center" v-if="tokenStore.pending">
      <p class="text-white font-bold text-xl font-grotesk">Cargando...</p>
  </div>
  <div class="md:grid md:grid-cols-[auto_1fr]" v-if="!tokenStore.pending && router.currentRoute.value.name != 'login'">
    <MenuComponent />
    <div class="relative top-[64px] flex flex-col min-h-[calc(100vh_-_64px)]">
      <div class="h-full">
        <slot></slot>
      </div>
    </div>
  </div>
  <div class="h-full" v-if="!tokenStore.pending && router.currentRoute.value.name == 'login'">
    <slot></slot>
  </div>
</template>
