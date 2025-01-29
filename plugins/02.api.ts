import { $fetch, type FetchOptions } from 'ofetch';
import AsistenciaModule from '~/repository/modules/Asistencia';
import NotasModule from '~/repository/modules/Notas';
import CursosModule from '~/repository/modules/cursos';
import HorarioRangoModule from '~/repository/modules/horarioRango';
import LoginModule from '~/repository/modules/login';
import ProfileModule from '~/repository/modules/profile';
import PagosModule from '~/repository/modules/pagos';


interface IApiInstance {
	profile: ProfileModule;
	horarioRango: HorarioRangoModule;
	cursos: CursosModule;
	login: LoginModule;
	asistencia: AsistenciaModule;
	notas: NotasModule;
	pagos: PagosModule;
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
		login: new LoginModule(apiFecther),
		asistencia : new AsistenciaModule(apiFecther),
		notas: new NotasModule(apiFecther),
		pagos: new PagosModule(apiFecther),
	};

	return {
		provide: {
			api: modules,
		},
	};
});
