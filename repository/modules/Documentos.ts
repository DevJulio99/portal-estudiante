import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { DataDocumento } from '~/types/documento.types';

class DocumentosModule extends FetchFactory<DataResponse<DataDocumento[]>> {
	private RESOURCE = '/api/v1/DocumentosConCategoria';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async getDocumentos(
		asyncDataOptions?: AsyncDataOptions<DataResponse<DataDocumento[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default DocumentosModule;
