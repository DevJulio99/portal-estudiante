import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { ListaPagos, PagosPendientesData } from '~/types/pagos.types';
import type { DataResponse } from '~/types/services.types';

class PagosModule extends FetchFactory<DataResponse<PagosPendientesData[]>> {
	private RESOURCE = 'api/v1/';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async getPagosPendientes(
		id: number,
        anio: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<PagosPendientesData[]>>,
	) {
		return await useAsyncData(
			() => {
				const fetchOptions: FetchOptions<'json'> = {
					headers: {},
				};
				return this.call(
					'GET',
					`${this.RESOURCE}alumno/${id}/${anio}`,
					undefined,
					fetchOptions,
				);
			},
			asyncDataOptions,
		);
	}

	async getPagosPorSede(
		body: ListaPagos,
		asyncDataOptions?: AsyncDataOptions<DataResponse<PagosPendientesData[]>>,
	) {
		return await useAsyncData(
			() => {
				const fetchOptions: FetchOptions<'json'> = {
					headers: {},
				};
				return this.call(
					'POST',
					`${this.RESOURCE}listar-pago-sede`,
					body,
					fetchOptions,
				);
			},
			asyncDataOptions,
		);
	}
}

export default PagosModule;
