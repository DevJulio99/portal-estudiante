import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ActualizarAlumno, Alumno, RegistrarAlumno } from '~/types/alumno.types';

class AlumnoModule extends FetchFactory<DataResponse<Alumno[]>> {
	private RESOURCE = '/api/v1';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */

	async getAlumnoPorSede(
		CodSede: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Alumno[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/listar-alumno-sede/${CodSede}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async registrarAlumno(
		request: RegistrarAlumno,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Alumno[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/registrar-usuario-alumno`,
				request,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async actualizarAlumno(
		request: ActualizarAlumno,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Alumno[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'PUT',
				`${this.RESOURCE}/actualizar-usuario-alumno`,
				request,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async eliminarAlumno(
		numeroDocumento: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Alumno[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'DELETE',
				`${this.RESOURCE}/eliminar-usuario-alumno?numeroDocumento=${numeroDocumento}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default AlumnoModule;
