import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { ResponseLogin } from '~/types/login.types';

class LoginModule extends FetchFactory<ResponseLogin> {
	private RESOURCE = 'api/auth/login';

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
		return await useAsyncData(
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
					undefined, // body
					fetchOptions,
				);
			},
			asyncDataOptions,
		);
	}
}

export default LoginModule;
