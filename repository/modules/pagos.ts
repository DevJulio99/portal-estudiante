import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { PagosPendientesData } from '~/types/pagos.types';
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
		codigoSede: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<PagosPendientesData[]>>,
	) {
		return await useAsyncData(
			() => {
				const fetchOptions: FetchOptions<'json'> = {
					headers: {},
				};
				return this.call(
					'GET',
					`${this.RESOURCE}listar-pago-sede/${codigoSede}`,
					undefined,
					fetchOptions,
				);
			},
			asyncDataOptions,
		);
	}
}

export default PagosModule;
