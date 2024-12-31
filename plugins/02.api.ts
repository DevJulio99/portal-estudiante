import { $fetch, type FetchOptions } from 'ofetch';
import CursosModule from '~/repository/modules/cursos';
import HorarioRangoModule from '~/repository/modules/horarioRango';
import LoginModule from '~/repository/modules/login';
import ProfileModule from '~/repository/modules/profile';


interface IApiInstance {
	profile: ProfileModule;
	horarioRango: HorarioRangoModule;
	cursos: CursosModule;
	login: LoginModule;
}

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const fetchOptions: FetchOptions = {
		baseURL: config.public.urlApi,
	};

	const apiFecther = $fetch.create(fetchOptions);

	const modules: IApiInstance = {
		profile: new ProfileModule(apiFecther),
		horarioRango: new HorarioRangoModule(apiFecther),
		cursos: new CursosModule(apiFecther),
		login: new LoginModule(apiFecther)
	};

	return {
		provide: {
			api: modules,
		},
	};
});
