import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ResponsePeriodoSede } from '~/types/periodo.types';

class PeriodoNotasModulo extends FetchFactory<DataResponse<ResponsePeriodoSede>> {
	private RESOURCE = '/api/v1/notas/periodo-sede';

	async obtenerPeriodoPorSede(
		body: { codSede: string },
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponsePeriodoSede>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				body,
			};
			return this.call('POST', this.RESOURCE, undefined, fetchOptions);
		}, asyncDataOptions);
	}
}

export default PeriodoNotasModulo;