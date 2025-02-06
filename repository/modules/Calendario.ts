/* eslint-disable camelcase */
import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { Calendar } from '~/types/calendar.types';

class CalendarModule extends FetchFactory<DataResponse<Calendar[]>> {
	private RESOURCE = '/api/v1/CalendarioAcademico';

	/**
	 * @param year Año académico para el que se obtendrá el calendario
	 * @param asyncDataOptions Opciones para `useAsyncData`
	 * @returns
	 */
	async getCalendar(
		anio: number,
		asyncDataOptions?: AsyncDataOptions<DataResponse<Calendar[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {}
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/${anio}`,
				undefined, // body
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default CalendarModule;
