import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { Grado } from '~/types/grado.types';

class GradosModule extends FetchFactory<DataResponse<Grado[]>> {
    private RESOURCE = '/api/v1/listar-grados';

    /**
     * @param asyncDataOptions options for `useAsyncData`
     * @returns
     */
    async getGrados(
        asyncDataOptions?: AsyncDataOptions<DataResponse<Grado[]>>,
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

export default GradosModule;
