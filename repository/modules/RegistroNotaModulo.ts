import type { $Fetch, FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';

interface NotaPayload {
    tipo_nota: string;
    nota: number | null;
    peso: number;
}

interface NotaPayloadActualizar extends NotaPayload {
    id_nota: number;
}

export interface RequestRegistroNota {
    idAlumno: number;
    idCurso: number;
    idPeriodo: number;
    idSubperiodo: number;
    notas: NotaPayload[];
}

export interface RequestActualizarNota {
    idAlumno: number;
    idCurso: number;
    idPeriodo: number;
    idSubperiodo: number;
    notas: NotaPayloadActualizar[];
}

class RegistroNotaModulo extends FetchFactory<DataResponse<any>> {
    private RESOURCE = '/api/v1/notas';

    async registrarNotasAlumno(
        body: RequestRegistroNota,
        asyncDataOptions?: AsyncDataOptions<DataResponse<any>>,
    ) {
        return useAsyncData(() => this.call('POST', `${this.RESOURCE}/registrar`, body), asyncDataOptions);
    }

    async actualizarNotasAlumno(
        body: RequestActualizarNota,
        asyncDataOptions?: AsyncDataOptions<DataResponse<any>>,
    ) {
        return useAsyncData(() => this.call('PUT', `${this.RESOURCE}/actualizar`, body), asyncDataOptions);
    }
}

export default RegistroNotaModulo;