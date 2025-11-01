import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ResponseSeccionGrado } from '~/types/seccion.types';

interface RequestSeccionGrado {
  codSede: string;
  idGrado: number;
  tipoInstitucion: string;
  idCiclo: number | null;
}

class SeccionGradoModulo extends FetchFactory<DataResponse<ResponseSeccionGrado>> {
	private RESOURCE = '/api/v1/notas/secciones-por-grado';

	async getSeccionPorGrado(
		body: RequestSeccionGrado,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseSeccionGrado>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = { body };
			return this.call('POST', this.RESOURCE, undefined, fetchOptions);
		}, asyncDataOptions);
	}
}

export default SeccionGradoModulo;