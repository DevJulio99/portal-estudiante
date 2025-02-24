import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ObligacionPagada } from '~/types/obligations.types';

class ObligacionesPagadasModule extends FetchFactory<DataResponse<ObligacionPagada[]>> {
	private RESOURCE = 'api/v1/ObtenerObligacionesPagadas';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async getObligacionesPagadas(
		idAlumno: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ObligacionPagada[]>>,
	) {
		return await useAsyncData(
			() => {
				const fetchOptions: FetchOptions<'json'> = {
					headers: {},
				};
				return this.call(
					'GET',
					`${this.RESOURCE}/${idAlumno}`,
					undefined,
					fetchOptions,
				);
			},
			asyncDataOptions,
		);
	}
}

export default ObligacionesPagadasModule;
