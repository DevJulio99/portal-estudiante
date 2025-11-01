import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ResponseSubperiodo } from '~/types/subperiodo.types';

class SubperiodoModulo extends FetchFactory<DataResponse<ResponseSubperiodo>> {
	private RESOURCE = '/api/v1/notas/subperiodos'; 
	async GetSubperiodoPorPeriodo(
		body: { idPeriodo: number },
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseSubperiodo>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				body,
			};
			return this.call('POST', this.RESOURCE, undefined, fetchOptions);
		}, asyncDataOptions);
	}
}

export default SubperiodoModulo;