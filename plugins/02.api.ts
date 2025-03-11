import { $fetch, type FetchOptions } from 'ofetch';
import AsistenciaModule from '~/repository/modules/Asistencia';
import NotasModule from '~/repository/modules/Notas';
import CursosModule from '~/repository/modules/cursos';
import HorarioRangoModule from '~/repository/modules/horarioRango';
import LoginModule from '~/repository/modules/login';
import ProfileModule from '~/repository/modules/profile';
import PagosModule from '~/repository/modules/pagos';
import EstadoCompetenciaModule from '~/repository/modules/EstadoCompetencia';
import cambiarEstadoCompetenciaModule from '~/repository/modules/CambiarEstadoCompetencia';
import PostulanteModule from '~/repository/modules/Postulante';
import CompetenciaModule from '~/repository/modules/Competencias';
import DocumentosModule from '~/repository/modules/Documentos';
import ExamenModule from '~/repository/modules/Examen';
import CalendarModule from '~/repository/modules/Calendario';
import EventosModule from '~/repository/modules/Eventos';
import ObligacionesPagadasModule from '~/repository/modules/ObligacionesPagadas';
import ResultadoCompetenciaModule from '~/repository/modules/ResultadoCompetencia';
import ImagenPagoModule from '~/repository/modules/ImagePago';
import AlumnoModule from '~/repository/modules/Alumno';
import DocumentoAddModule from '~/repository/modules/DocumentoAdd';


interface IApiInstance {
	profile: ProfileModule;
	horarioRango: HorarioRangoModule;
	cursos: CursosModule;
	login: LoginModule;
	asistencia: AsistenciaModule;
	notas: NotasModule;
	pagos: PagosModule;
	estado: EstadoCompetenciaModule;
	cambiarEstado: cambiarEstadoCompetenciaModule;
	postulante: PostulanteModule;
	competencias: CompetenciaModule;
	documentos: DocumentosModule;
	examen: ExamenModule;
	calendario: CalendarModule;
	eventos: EventosModule;
	obligacionesPagadas: ObligacionesPagadasModule;
	resultadoCompetencia: ResultadoCompetenciaModule;
	imagenPago: ImagenPagoModule;
	alumno: AlumnoModule;
	agregarDocumento: DocumentoAddModule;
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
		estado: new EstadoCompetenciaModule(apiFecther),
		cambiarEstado: new cambiarEstadoCompetenciaModule(apiFecther),
		postulante: new PostulanteModule(apiFecther),
		competencias: new CompetenciaModule(apiFecther),
		documentos: new DocumentosModule(apiFecther),
		examen: new ExamenModule(apiFecther),
		calendario: new CalendarModule(apiFecther),
		eventos: new EventosModule(apiFecther),
		obligacionesPagadas: new ObligacionesPagadasModule(apiFecther),
		resultadoCompetencia: new ResultadoCompetenciaModule(apiFecther),
		imagenPago: new ImagenPagoModule(apiFecther),
		alumno: new AlumnoModule(apiFecther),
		agregarDocumento: new DocumentoAddModule(apiFecther),
	};

	return {
		provide: {
			api: modules,
		},
	};
});
