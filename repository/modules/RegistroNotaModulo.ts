import type { $Fetch, FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';

export interface RequestRegistroNota {
    idAlumno: number;
    idCurso: number;
    idPeriodo: number;
    tipoNota: string;
    nota: number | null;
    peso: number;
    idSubperiodo: number;
}

class RegistroNotaModulo extends FetchFactory<DataResponse<any>> {
    private RESOURCE = '/api/v1/notas';

    async registrarNotaAlumno(
        body: RequestRegistroNota,
        asyncDataOptions?: AsyncDataOptions<DataResponse<any>>,
    ) {
        return useAsyncData(() => this.call('POST', `${this.RESOURCE}/registrar`, body), asyncDataOptions);
    }
}

export default RegistroNotaModulo;