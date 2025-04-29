import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { PendingPaymentsHomeData } from '~/types/pagos.types';
import type { DataResponse } from '~/types/services.types';

class PagosPendientesHomeModule extends FetchFactory<DataResponse<PendingPaymentsHomeData[]>> {
    private RESOURCE = 'api/v1/';

    /**
     * @param asyncDataOptions options for `useAsyncData`
     * @returns
     */
    async getResumenPagosPorAlumno(
        id: number,
        anio: number,
        asyncDataOptions?: AsyncDataOptions<DataResponse<PendingPaymentsHomeData[]>>,
    ) {
        return await useAsyncData(
            () => {
                const fetchOptions: FetchOptions<'json'> = {
                    headers: {},
                };
                return this.call(
                    'GET',
                    `${this.RESOURCE}resumen-pagos-alumno/${id}/${anio}`,
                    undefined,
                    fetchOptions,
                );
            },
            asyncDataOptions,
        );
    }
}

export default PagosPendientesHomeModule;































