import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { ImagenPago } from '~/types/pagos.types';
import type { DataResponse } from '~/types/services.types';

class ImagenPagoModule extends FetchFactory<DataResponse<string>> {
	private RESOURCE = 'api/v1/registrar-imagen-pago';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async registrarImagenPago(
		request: ImagenPago,
		asyncDataOptions?: AsyncDataOptions<DataResponse<string>>,
	) {
		return await useAsyncData(
			() => {
				const fetchOptions: FetchOptions<'json'> = {
					headers: {},
				};
				return this.call(
					'POST',
					`${this.RESOURCE}`,
                    request,
					fetchOptions,
				);
			},
			asyncDataOptions,
		);
	}
}

export default ImagenPagoModule;
