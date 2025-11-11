import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { ResponseLogin } from '~/types/login.types';

class LoginModule extends FetchFactory<ResponseLogin> {
	private RESOURCE = 'api/auth/login';

	async loginDirect(
		email: string,
		password: string,
		captchaId: string,
		captchaCode: string,
	): Promise<ResponseLogin> {
		const fetchOptions: FetchOptions<'json'> = {
			headers: {},
			body: {
				email, 
				password, 
				captchaId, 
				captchaCode
			}
		};
		
		return this.call(
			'POST',
			`${this.RESOURCE}`,
			undefined,
			fetchOptions,
		);
	}

	/**
	 * @param asyncDataOptions options for `useAsyncData`
	 * @returns
	 */
	async login(
		email: string,
		password: string,
		captchaId: string,
		captchaCode: string,
		asyncDataOptions?: AsyncDataOptions<ResponseLogin>,
	) {
		const uniqueKey = `login-${Date.now()}`;
		
		return await useAsyncData(
			uniqueKey,
			() => {
				const fetchOptions: FetchOptions<'json'> = {
					headers: {},
                    body: {
                     email, password, captchaId, captchaCode
                    }
				};
				return this.call(
					'POST',
					`${this.RESOURCE}`,
					undefined,
					fetchOptions,
				);
			},
			{
				...asyncDataOptions,
				server: false,
				getCachedData: () => null,
			},
		);
	}
}

export default LoginModule;
