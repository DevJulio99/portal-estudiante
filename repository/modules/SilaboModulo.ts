import type { $Fetch, FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { ISilaboRequestBody, IApiResponse, IUnidad } from '../../types/silabo';

class SilaboModulo extends FetchFactory<IApiResponse<IUnidad[]>> {
	private RESOURCE = '/api/AulaVirtual/silabo';

    constructor(fetcher: $Fetch) {
        super(fetcher);
    }
 
    async obtenerSilaboPorCurso(
        body: ISilaboRequestBody,
        asyncDataOptions?: AsyncDataOptions<IApiResponse<IUnidad[]>>
    ) {
        return useAsyncData(() => {
            const fetchOptions: FetchOptions<'json'> = {
                headers: {},
            };
            return this.call('POST', this.RESOURCE, body, fetchOptions);
        }, asyncDataOptions);
    }
}

export default SilaboModulo;