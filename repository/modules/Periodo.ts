import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ResponsePeriodo } from '~/types/matricula.types';

class PeriodoModule extends FetchFactory<DataResponse<ResponsePeriodo[]>> {
	private RESOURCE = '/api/v1';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */

	async getPeriodos(
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponsePeriodo[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/matricula/periodos-disponibles`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default PeriodoModule;
