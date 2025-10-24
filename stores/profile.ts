import { defineStore } from 'pinia';
import { getPostulante } from '~/services/postulante';
import type { ProfileDataStore } from '~/types/profile.types';

export const useProfileStore = defineStore('profileStore', {
	state: () => {
		return {
			profileData: {
				data: null,//profileStoreMock as any,
				pending: false,
				error: null,
			} as ProfileDataStore,
		};
	},
	getters: {
		/**
		 * Devuelve el código del período actual del perfil del usuario.
		 * Es un getter, por lo que su valor se cachea y es reactivo.
		 */
		getPeriodoActual: (state): string => state.profileData.data?.codPeriodoActual ?? '',
		getSubperiodoActual: (state): string => state.profileData.data?.codSubperiodoActual ?? '',
	},
	actions: {
		setProfileData(payload: ProfileDataStore) {
			const tokenStore = useTokenStore();
			this.profileData = payload;
			tokenStore.getDataToken.Role !== 'Admin' && getPostulante();
		},
		clearPorfileData(){
			this.profileData = {
				data: null,
				pending: false,
				error: null,
			} as ProfileDataStore
		},
		async postulanteHabilitado() {
			// console.log('postulanteHabilitado', this.profileData.data)
			const postulanteStore = usePostulanteStore();
			if(!this.profileData.data?.documenIdentida) return
			const { $api } = useNuxtApp();
			const serviceHabilitado = await $api.postulante.alumnoHabilitado(
				this.profileData.data.documenIdentida
			  );
			  
			

			if(serviceHabilitado.data.value?.error) return

			if(serviceHabilitado.data.value?.success){
				console.log('habilitado service', serviceHabilitado.data.value);
				postulanteStore.setHabilitado(1);	
			}else {
				postulanteStore.setHabilitado(2);	
			}
			
		}
	},
});
