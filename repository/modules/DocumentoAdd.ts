import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { DocumentoAdd } from '~/types/documento.types';

class DocumentoAddModule extends FetchFactory<DataResponse<string>> {
	private RESOURCE = 'api/v1/agregar-documento';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async agregarDocumento(
		request: DocumentoAdd,
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

export default DocumentoAddModule;
