import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { NotaBimestre } from '~/types/notas.types';
import type { DataResponse } from '~/types/services.types';

class NotasModule extends FetchFactory<DataResponse<NotaBimestre[]>> {
	private RESOURCE = 'api/v1/NotasxBimestre';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async getNotasxBimestre(
		idAlum: number,
		tipoPeriodo: string,
        anio: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<NotaBimestre[]>>,
	) {
		return await useAsyncData(
			() => {
				const fetchOptions: FetchOptions<'json'> = {
					headers: {},
				};
				return this.call(
					'GET',
					`${this.RESOURCE}/${idAlum}/${tipoPeriodo}/${anio}`,
					undefined,
					fetchOptions,
				);
			},
			asyncDataOptions,
		);
	}
}

export default NotasModule;
