import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { MaterialSesion, RequestMaterial } from '~/types/silabo';

class MaterialModulo extends FetchFactory<DataResponse<MaterialSesion[]>> {
	private RESOURCE = '/api/AulaVirtual/materiales'; 
	async GetMateriales(
		body: { idContenido: number, idAlumno: number },
		asyncDataOptions?: AsyncDataOptions<DataResponse<MaterialSesion[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				body,
			};
			return this.call('POST', this.RESOURCE, undefined, fetchOptions);
		}, asyncDataOptions);
	}

    async RegistrarMaterial(
		body: RequestMaterial,
		asyncDataOptions?: AsyncDataOptions<DataResponse<MaterialSesion[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				body,
			};
			return this.call('POST', 'api/AulaVirtual/registrar-material', undefined, fetchOptions);
		}, asyncDataOptions);
	}
}

export default MaterialModulo;