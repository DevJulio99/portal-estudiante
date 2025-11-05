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

export interface RequestGestionarNotas {
    idAlumno: number;
    idCurso: number;
    idPeriodo: number;
    idSubperiodo: number;
    notasInsertar: NotaPayload[];
    notasActualizar: NotaPayloadActualizar[];
}

class RegistroNotaModulo extends FetchFactory<DataResponse<any>> {
    private RESOURCE = '/api/v1/notas';

    async gestionarNotas(
        body: RequestGestionarNotas,
        asyncDataOptions?: AsyncDataOptions<DataResponse<any>>,
    ) {
        return useAsyncData(() => this.call('POST', `${this.RESOURCE}/gestionar`, body), asyncDataOptions);
    }
}

export default RegistroNotaModulo;