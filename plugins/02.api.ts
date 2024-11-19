import { $fetch, type FetchOptions } from 'ofetch';
import ProfileModule from '~/repository/modules/profile';


interface IApiInstance {
	profile: ProfileModule;
}

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const fetchOptions: FetchOptions = {
		baseURL: config.public.urlApi,
	};

	const apiFecther = $fetch.create(fetchOptions);

	const modules: IApiInstance = {
		profile: new ProfileModule(apiFecther),
	};

	return {
		provide: {
			api: modules,
		},
	};
});
