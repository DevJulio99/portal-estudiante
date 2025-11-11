import { defineStore } from 'pinia';
import { getPostulante } from '~/services/postulante';
import { getProfile } from '~/services/profile';
import { Roles } from '~/types/roles.types';
import { HabilitadoState } from '~/utils/enums';
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
			this.profileData = payload; // Asigna los datos del perfil
			// Solo llama a getPostulante si el rol NO es 'admin' (insensible a mayúsculas/minúsculas)
			tokenStore.getDataToken?.Role?.toLowerCase() !== Roles.Admin && getPostulante();
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
				postulanteStore.setHabilitado(HabilitadoState.HABILITADO);	
			}else {
				postulanteStore.setHabilitado(HabilitadoState.NO_HABILITADO);	
			}
			
		},
		/**
		 * Obtiene los datos del perfil si no existen.
		 * Ideal para ser llamado desde el layout principal al iniciar la app.
		 */
		async fetchProfile() {
			const tokenStore = useTokenStore();
			const isAuth = tokenStore.accessToken.trim().length > 0;

			// Si está autenticado y no hay datos, los busca.
			if (isAuth && !this.profileData.data) {
				tokenStore.setPending(true); // Mantenemos el loader global
				try {
					// La función getProfile ya setea los datos en el store
					await getProfile(tokenStore.getDataToken.Dni_Usuario);
				} finally {
					tokenStore.setPending(false);
				}
			}
		}
	},
});
