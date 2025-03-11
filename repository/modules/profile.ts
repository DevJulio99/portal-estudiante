import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { ProfileData } from '~/types/profile.types';
import type { DataResponse } from '~/types/responses.types';

class ProfileModule extends FetchFactory<DataResponse<ProfileData[]>> {
	private RESOURCE = '/api/v1/AlumnosxId';

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async getProfile(
		CodAlumno: string,
		asyncDataOptions?: AsyncDataOptions<DataResponse<ProfileData[]>>,
	) {
		return await useAsyncData(() => {
			const fetchOptions: FetchOptions<'json'> = {
				headers: {},
			};
			return this.call(
				'GET',
				`${this.RESOURCE}/${CodAlumno}`,
				undefined, // body
				fetchOptions,
			);
		}, asyncDataOptions);
	}
}

export default ProfileModule;
