<script setup lang="ts">
import PopUpMensaje from '~/components/pagesContainer/Alumnos/PopUpMensaje.vue';
import { getProfile } from '~/services/profile';
import { useMsgPopUpStore } from '~/stores/msgPopup';

const router = useRouter();
const tokenStore = useTokenStore();
const msgPopupStore = useMsgPopUpStore();
const timeoutId = ref<any>(null);

console.log('tokenStore accessToken', tokenStore.accessToken);

watch(() => msgPopupStore.error, (error) => {
  if(error.status){
	clearTimeout(timeoutId.value);
  msgPopupStore.error.status = false;
	(document as any).getElementById('popupMsg').style.right = '20px';
	timeoutId.value = setTimeout(() => {
		(document as any).getElementById('popupMsg').style.right = '-1000px';
	}, 5000);
  }
});

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
        await getProfile(tokenStore.getDataToken.Dni_Usuario);
      }

      if(!logueado){
       // unWatch();
      }
    }
  );


if(tokenStore.getDataToken && tokenStore.getDataToken.Id_Alumno && tokenStore.accessToken.trim().length){
    await getProfile(tokenStore.getDataToken.Dni_Usuario);
  }


</script>
<template>
  <div class="fixed w-full h-full top-0 bg-primary flex justify-center items-center" v-if="tokenStore.pending">
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
  <PopUpMensaje :message="msgPopupStore.error.message" :type="msgPopupStore.tipoModal"/>
</template>
