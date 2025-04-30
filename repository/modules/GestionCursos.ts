import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ActualizarCurso, Course, FiltroCurso, ListaCurso, RegistrarCurso } from '~/types/gestionCursos.types';

class GestionCursosModule extends FetchFactory<DataResponse<Course[]>> {
	private RESOURCE = '/api/v1';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */

	async obtenerCursosPorSede(
		body: ListaCurso,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Course[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/listar-cursos`,
				body,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async registrarCurso(
		request: RegistrarCurso,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Course[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/registrar-curso`,
				request,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async actualizarCurso(
		request: ActualizarCurso,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Course[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'PUT',
				`${this.RESOURCE}/actualizar-curso`,
				request,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async eliminarCurso(
		idCurso: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Course[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'DELETE',
				`${this.RESOURCE}/eliminar-curso?idCurso=${idCurso}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

	async filtrarCursos(
		body: FiltroCurso,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Course[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/filtrar-cursos`,
				body,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default GestionCursosModule;
