import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ResponseAlumnoFiltro } from '~/types/alumnoFiltro.types';

interface RequestAlumnosPorFiltro {
  idPeriodo: number;
  idSubperiodo: number;
  codSede: string;
  idGrado: number;
  idSeccion: number;
  idCurso: number;
}

class AlumnoFiltroModulo extends FetchFactory<DataResponse<ResponseAlumnoFiltro>> {
	private RESOURCE = '/api/v1/notas/alumnos-por-filtro'; 

	async GetAlumnosPorFiltro(
		body: RequestAlumnosPorFiltro,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseAlumnoFiltro>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = { body };
			return this.call('POST', this.RESOURCE, undefined, fetchOptions);
		}, asyncDataOptions);
	}
}

export default AlumnoFiltroModulo;