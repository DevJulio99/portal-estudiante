import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { RequestEstado } from '~/types/competencia.types';

class cambiarEstadoCompetenciaModule extends FetchFactory<DataResponse<null>> {
	private RESOURCE = '/api/v1/competencias-generales';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async registrarEstado(
		body: RequestEstado,
		asyncDataOptions?: AsyncDataOptions<DataResponse<null>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/registrar-estado-competencia`,
                body,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async actualizarEstado(
		body: RequestEstado,
		asyncDataOptions?: AsyncDataOptions<DataResponse<null>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'PUT',
				`${this.RESOURCE}/actualizar-estado-competencia`,
                body,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default cambiarEstadoCompetenciaModule;
