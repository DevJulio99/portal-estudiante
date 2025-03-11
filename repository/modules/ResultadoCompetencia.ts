import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { ResultadoEvaluacion } from '~/types/competencia.types';

class ResultadoCompetenciaModule extends FetchFactory<DataResponse<ResultadoEvaluacion[]>> {
	private RESOURCE = '/api/v1/competencias-generales';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async listarCompetencias(
		idPostulante: number,
        idCompetencia: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ResultadoEvaluacion[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/resultado-competencia?idPostulante=${idPostulante}&idCompetencia=${idCompetencia}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default ResultadoCompetenciaModule;
