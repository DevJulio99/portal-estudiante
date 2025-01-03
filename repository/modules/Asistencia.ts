import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { CursoAsistencia } from '~/types/cursos.types';

class AsistenciaModule extends FetchFactory<DataResponse<CursoAsistencia[]>> {
	private RESOURCE = '/api/v1/Asistencias';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */

	async getCursoAsistencia(
		CodAlumno: number,
		bimestre: string,
		anio: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<CursoAsistencia[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/${CodAlumno}/${bimestre}/${anio}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default AsistenciaModule;
