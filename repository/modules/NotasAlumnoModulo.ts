import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ResponseNotasAlumno } from '~/types/notasAlumno.types';

interface RequestNotasAlumno {
  idAlumno: number;
  idCurso: number;
  idPeriodo: number;
  idSubperiodo: number;
}

class NotasAlumnoModulo extends FetchFactory<DataResponse<ResponseNotasAlumno>> {
	private RESOURCE = '/api/v1/notas/notas-alumno'; 
	async getNotasAlumnos(
		body: RequestNotasAlumno,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseNotasAlumno>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = { body };
			return this.call('POST', this.RESOURCE, undefined, fetchOptions);
		}, asyncDataOptions);
	}
}

export default NotasAlumnoModulo;