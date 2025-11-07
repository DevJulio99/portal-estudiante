import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { ResponseCategoria } from '~/types/documento.types';

class CategoriasDocumentoModule extends FetchFactory<
	DataResponse<ResponseCategoria[]>
> {
	private RESOURCE = 'api/v1/categorias-documento';

	async getCategoriasDocumentos(
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseCategoria[]>>,
	) {
		return useAsyncData('categorias-documento', () => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call('GET', `${this.RESOURCE}`, undefined, fetchOptions);
		}, asyncDataOptions);
	}
}

export default CategoriasDocumentoModule;