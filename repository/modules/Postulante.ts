import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { Postulante, RegistrarPostulante } from '~/types/postulante.types';

class PostulanteModule extends FetchFactory<DataResponse<Postulante[]>> {
	private RESOURCE = '/api/v1/competencias-generales';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async getPostulante(
		dniPostulante: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Postulante[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
                params: {dniPostulante}
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/listar-postulante`,
				undefined, // body
				fetchOptions,
			);
		}, asyncDataOptions);
	}

    async registrarPostulante(
		body: RegistrarPostulante,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Postulante[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'POST',
				`${this.RESOURCE}/registrar-postulante`,
				body,
				fetchOptions,
			);
		}, asyncDataOptions);
	}

	async alumnoHabilitado(
		dniAlumno: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Postulante[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/alumno-habilitado?dniAlumno=${dniAlumno}`,
				undefined,
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default PostulanteModule;
