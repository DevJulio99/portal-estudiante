import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { EstadoCompencia } from '~/types/competencia.types';

class EstadoCompetenciaModule extends FetchFactory<DataResponse<EstadoCompencia[]>> {
	private RESOURCE = '/api/v1/competencias-generales/listar-estado-competencia';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async getListarEstado(
		idPostulante: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<EstadoCompencia[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/${idPostulante}`,
				undefined, // body
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default EstadoCompetenciaModule;
