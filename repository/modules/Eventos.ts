import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse, DataResponseOffset } from '~/types/responses.types';
import type { EventData } from '~/types/events.types';

class EventosModule extends FetchFactory<DataResponseOffset<EventData[]>> {
	private RESOURCE = '/api/v1/ObtenerEventos';

	/**
	 * @param asyncDataOptions Opciones para `useAsyncData`
	 * @returns
	 */
	async getEventos(
		asyncDataOptions?: AsyncDataOptions<DataResponseOffset<EventData[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {}
			};
			return this.call(
				'GET',
				`${this.RESOURCE}`,
				undefined, // body
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default EventosModule;
