import { defineStore } from 'pinia';
import type { RequestCursoGrado, ResponseCursoGrado } from '~/types/cursoGrado.types';
import type { RequestMatricula, ResponseMatricula, ResponsePeriodo } from '~/types/matricula.types';
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

		// Nuevos estados para cursos por grado
		cursosPorGrado: [] as ResponseCursoGrado[],
		pendingCursos: false,
		errorCursos: null as any,
	}),
	actions: {
		async getMatriculas() {
			const tokenStore = useTokenStore();
			const { $api } = useNuxtApp();
			this.pending = true;
			this.activeList = true;
			this.activeFilter = false;
            //const codSede = tokenStore.getDataToken.Codigo_Sede;
			try {
				const { data, error } = await $api.matricula.getMatriculaPorSede();
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
			const tokenStore = useTokenStore();
			const msgPopupStore = useMsgPopUpStore();
			const { $api } = useNuxtApp();
			this.pendingActions = true;
			const tipoInstitucion = tokenStore.getDataToken.Tipo_Institucion;
			try {
				let response;
				if (tipoInstitucion?.toLowerCase() === 'i') {
					response = await $api.matricula.registrarMatriculaInstituto(payload);
				} else {
					response = await $api.matricula.registrarMatricula(payload);
				}

				if (response.error.value) {
					throw response.error.value;
				}
				msgPopupStore.showSuccess('Matrícula registrada correctamente');
				await this.getMatriculas(); // Refrescar lista
				return true;
			} catch (error) {
				const err = error as any;
				msgPopupStore.showError(err.data?.message ?? 'No se pudo registrar la matrícula');
				return false;
			} finally {
				this.pendingActions = false;
			}
		},
		async ActualizarMatricula(idMatricula: number, estado: string) {
			const msgPopupStore = useMsgPopUpStore();
			const { $api } = useNuxtApp();
			this.pendingActions = true;
			try {
				const { error } = await $api.matricula.actualizarEstadoMatricula(idMatricula, estado);
				if (error.value) { throw error.value; }
				msgPopupStore.showSuccess('Matrícula actualizada correctamente');
				await this.getMatriculas(); // Refrescar lista
				return true;
			} catch (error) {
				const err = error as any;
				msgPopupStore.showError(err.data?.message ?? 'No se pudo actualizar la matrícula');
				return false;
			} finally {
				this.pendingActions = false;
			}
		},
        // setPagina(pagina: number) {
		// 	this.paginado.pagina = pagina;
		// },

		async fetchCursosPorGrado(body: RequestCursoGrado) {
			this.pendingCursos = true;
			this.errorCursos = null;
			const { $api } = useNuxtApp();

			try {
				const { data, error } = await $api.cursoGrado.obtenerCursosPorGrado(body);

				if (error.value) {
					console.error('Error al obtener cursos por grado:', error.value);
					this.errorCursos = error.value;
					this.cursosPorGrado = [];
					return;
				}

				if (data.value?.success) {
					this.cursosPorGrado = data.value.data;
				} else {
					console.warn('La API no devolvió datos exitosos para cursos por grado:', data.value);
					this.cursosPorGrado = [];
				}
			} catch (e) {
				console.error('Excepción al llamar a fetchCursosPorGrado:', e);
				this.errorCursos = e;
				this.cursosPorGrado = [];
			} finally {
				this.pendingCursos = false;
			}
		},

		clearCursosPorGrado() {
			this.cursosPorGrado = [];
			this.errorCursos = null;
		},
	},
});