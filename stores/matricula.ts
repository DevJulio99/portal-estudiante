import { defineStore } from 'pinia';
import type { ResponseMatricula, ResponsePeriodo, RequestMatricula } from '~/types/matricula.types';
import { useMsgPopUpStore } from './msgPopup';

export const useMatriculaStore = defineStore('matriculaStore', {
	state: () => ({
		lista: [] as ResponseMatricula[],
		listaPeriodos: [] as ResponsePeriodo[],
		// paginado: {
		// 	pagina: 1,
		// 	itemsPorPagina: 10,
		// } as Paginado,
		total: 0,
		pending: false,
		pendingActions: false,
		pendingTable: false,
		pendingPeriodos: false,
		error: null as any,
		activeFilter: false,
		activeList: true,
	}),
	actions: {
		async getMatriculas() {
			const tokenStore = useTokenStore();
			const { $api } = useNuxtApp();
			this.pending = true;
			this.activeList = true;
			this.activeFilter = false;
            const codSede = tokenStore.getDataToken.Codigo_Sede;
			try {
				const { data, error } = await $api.matricula.getMatriculaPorSede(codSede);
                console.log('data:', data);
				if (error.value) {
					throw error.value;
				}

				if (data.value?.data) {
					this.lista = data.value.data;
				}
			} catch (error) {
				this.error = error;
			} finally {
				this.pending = false;
			}
		},
		async getPeriodos() {
			const tokenStore = useTokenStore();
			const { $api } = useNuxtApp();
			this.pendingPeriodos = true;
			const codSede = tokenStore.getDataToken.Codigo_Sede;
			try {
				const { data, error } = await $api.periodo.getPeriodos(codSede);
				if (error.value) {
					throw error.value;
				}
				if (data.value?.data) {
					this.listaPeriodos = data.value.data;
				}
			} catch (error) {
				this.error = error;
			} finally {
				this.pendingPeriodos = false;
			}
		},
		async RegistrarMatricula(payload: RequestMatricula) {
			const msgPopupStore = useMsgPopUpStore();
			const { $api } = useNuxtApp();
			this.pendingActions = true;
			msgPopupStore.setError(false, '');
			console.log('registrar');
			try {
				const { error } = await $api.matricula.registrarMatricula(payload);
				if (error.value) { throw error.value; }
				msgPopupStore.setError(true, 'Matrícula registrada correctamente');
				await this.getMatriculas(); // Refrescar lista
				return true;
			} catch (error) {
				const err = error as any;
				msgPopupStore.setError(true, err.data?.message ?? 'No se pudo registrar la matrícula', 'error');
				return false;
			} finally {
				this.pendingActions = false;
			}
		},
		async ActualizarMatricula(idMatricula: number, estado: string) {
			const msgPopupStore = useMsgPopUpStore();
			const { $api } = useNuxtApp();
			this.pendingActions = true;
			msgPopupStore.setError(false, '');
			try {
				const { error } = await $api.matricula.actualizarEstadoMatricula(idMatricula, estado);
				if (error.value) { throw error.value; }
				msgPopupStore.setError(true, 'Matrícula actualizada correctamente');
				await this.getMatriculas(); // Refrescar lista
				return true;
			} catch (error) {
				const err = error as any;
				msgPopupStore.setError(true, err.data?.message ?? 'No se pudo actualizar la matrícula', 'error');
				return false;
			} finally {
				this.pendingActions = false;
			}
		},
        // setPagina(pagina: number) {
		// 	this.paginado.pagina = pagina;
		// },
	},
});