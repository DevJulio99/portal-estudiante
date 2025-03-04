import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { Competencia } from '~/types/competencia.types';

class CompetenciaModule extends FetchFactory<DataResponse<Competencia[]>> {
	private RESOURCE = '/api/v1/competencias-generales';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async listarCompetencias(
		idPostulante: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Competencia[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/competencias?idPostulante=${idPostulante}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

	async listarCompetenciasFinalizadas(
		idPostulante: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Competencia[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/competencias-finalizadas?idPostulante=${idPostulante}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default CompetenciaModule;
