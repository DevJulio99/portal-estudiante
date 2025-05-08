import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse, ErrorResponsePortal } from '~/types/services.types';
import type { ActualizarRespuesta, Examen, GenerarExamen } from '~/types/examen.types';

class ExamenModule extends FetchFactory<DataResponse<Examen[]>> {
	private RESOURCE = '/api/v1/competencias-generales';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async generarExamen(
		body: GenerarExamen,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Examen[]>>,
	) {
		return await useAsyncData<DataResponse<Examen[]> ,ErrorResponsePortal>(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/generar-examen`,
				body,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

	async listarExamen(
		idPostulante: number,
		IdCompetencia: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Examen[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/listar-examen/${idPostulante}/${IdCompetencia}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

	async actualizarRespuesta(
		body: ActualizarRespuesta,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Examen[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/actualizar-respuesta`,
				body,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default ExamenModule;
