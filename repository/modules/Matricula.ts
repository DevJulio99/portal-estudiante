import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { RequestMatricula, ResponseMatricula } from '~/types/matricula.types';
//import type { ActualizarAlumno, Alumno, FiltroAlumno, ListaAlumno, RegistrarAlumno } from '~/types/alumno.types';

class MatriculaModule extends FetchFactory<DataResponse<ResponseMatricula[]>> {
	private RESOURCE = '/api/v1';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */

	async getMatriculaPorSede(
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseMatricula[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/matricula/obtener-por-sede`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async registrarMatricula(
		request: RequestMatricula,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseMatricula[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/matricula/realizar`,
				request,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

	 async registrarMatriculaInstituto(
		request: RequestMatricula,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseMatricula[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/matricula-instituto/realizar`,
				request,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async actualizarEstadoMatricula(
		idMatricula: number,
		estado: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseMatricula[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: { 'Content-Type': 'application/json' },
			};
			return this.call(
				'PUT',
				`${this.RESOURCE}/matricula/actualizar-estado/${idMatricula}`,
				JSON.stringify(estado),
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async desactivarMatricula(
		idMatricula: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseMatricula[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'DELETE',
				`${this.RESOURCE}/matricula/desactivar/${idMatricula}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

	// async filtrarAlumno(
	// 	body: FiltroAlumno,
	// 	asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseMatricula[]>>,
	// ) {
	// 	return await useAsyncData(() => {
	// 		const fetchOptions: FetchOptions<'json'> = {
	// 			headers: {},
	// 		};
	// 		return this.call(
	// 			'POST',
	// 			`${this.RESOURCE}/filtrar-alumno-sede`,
	// 			body,
	// 			fetchOptions,
	// 		);
	// 	}, asyncDataOptions);
	// }
}

export default MatriculaModule;
