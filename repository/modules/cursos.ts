import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { Curso } from '~/types/cursos.types';

class CursosModule extends FetchFactory<DataResponse<Curso[]>> {
	private RESOURCE = '/api/v1/CursosxId';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async getCursos(
		CodAlumno: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Curso[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/${CodAlumno}`,
				undefined, // body
				fetchOptions,
			);
		}, asyncDataOptions);
	}

	async getCursosColegio(
		CodAlumno: number,
		anio: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Curso[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`/api/v1/CursosColegioxId/${CodAlumno}/${anio}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default CursosModule;
