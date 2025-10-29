import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';

export interface ResponseNotasReporte {
  idSubperiodo: number;
  descripcionSubperiodo: string;
  descripcionCurso: string;
  promedioCurso: number;
  promedioBimestre: number;
  promedioAnual: number;
}

class ReporteNotaModulo extends FetchFactory<DataResponse<ResponseNotasReporte[]>> {
    private RESOURCE = '/api/v1/matricula/reporte-notas';

    async obtenernotasAlumno(
        idAlumno: number,
        asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseNotasReporte[]>>,
    ) {
        return useAsyncData(
            () => {
                const fetchOptions: FetchOptions<'json'> = {
                    headers: {},
                };
                return this.call('GET', `${this.RESOURCE}/${idAlumno}`, undefined, fetchOptions);
            },
            asyncDataOptions,
        );
    }
}

export default ReporteNotaModulo;