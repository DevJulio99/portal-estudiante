import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ResponseCursoGrado } from '~/types/curso.types';

interface RequestCursoGrado {
  codSede: string;
  tipoInstitucion: string;
  idGrado: number;
}

class CursoGradoModulo extends FetchFactory<DataResponse<ResponseCursoGrado>> {
	private RESOURCE = '/api/v1/notas/cursos-por-grado';

	async GetCursoPorGrado(
		body: RequestCursoGrado,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseCursoGrado>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = { body };
			return this.call('POST', this.RESOURCE, undefined, fetchOptions);
		}, asyncDataOptions);
	}
}

export default CursoGradoModulo;