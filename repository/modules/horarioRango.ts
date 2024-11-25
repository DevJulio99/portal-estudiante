import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { HorarioData } from '~/types/cursos.types';

class HorarioRangoModule extends FetchFactory<DataResponse<HorarioData[]>> {
	private RESOURCE = '/api/v1/HorarioxId';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async getHorariosRango(
		CodAlumno: string,
		FechaSesion1: string,
		FechaSesion2: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<HorarioData[]>>,
	) {
		return await useAsyncData(
			() => {
				const fetchOptions: FetchOptions<'json'> = {
					headers: {}
				};
				return this.call(
					'GET',
					`${this.RESOURCE}/${CodAlumno}/${FechaSesion1}/${FechaSesion2}`,
					undefined, // body
					fetchOptions,
				);
			},
			asyncDataOptions,
		);
	}
}

export default HorarioRangoModule;
