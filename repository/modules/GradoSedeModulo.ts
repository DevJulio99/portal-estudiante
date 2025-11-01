import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { ResponseGradoSede } from '~/types/grado.types';

class GradoSedeModulo extends FetchFactory<DataResponse<ResponseGradoSede>> {
	private RESOURCE = '/api/v1/notas/grado-sede';


	async GetGradoPorSede(
		body: { codSede: string },
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseGradoSede>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				body,
			};
			return this.call('POST', this.RESOURCE, undefined, fetchOptions);
		}, asyncDataOptions);
	}
}

export default GradoSedeModulo;