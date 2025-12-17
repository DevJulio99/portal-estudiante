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
import CategoriasDocumentoModule from '~/repository/modules/CategoriasDocumento';
import ExamenModule from '~/repository/modules/Examen';
import CalendarModule from '~/repository/modules/Calendario';
import EventosModule from '~/repository/modules/Eventos';
import ObligacionesPagadasModule from '~/repository/modules/ObligacionesPagadas';
import ResultadoCompetenciaModule from '~/repository/modules/ResultadoCompetencia';
import ImagenPagoModule from '~/repository/modules/ImagePago';
import AprobarPagoModule from '~/repository/modules/AprobarPago';
import AlumnoModule from '~/repository/modules/Alumno';
import DocumentoAddModule from '~/repository/modules/DocumentoAdd';
import GradosModule from '~/repository/modules/Grados';
import CaptchaModule from '~/repository/modules/Captcha';
import GestionCursosModule from '~/repository/modules/GestionCursos';
import PagosPendientesHomeModule from '~/repository/modules/pagosPendHome';
import MatriculaModule from '~/repository/modules/Matricula';
import PeriodoModule from '~/repository/modules/Periodo';
import PeriodoNotasModulo from '~/repository/modules/PeriodoNotasModulo';
import GradoSedeModulo from '~/repository/modules/GradoSedeModulo';
import SubperiodoModulo from '~/repository/modules/SubperiodoModulo';
import SeccionGradoModulo from '~/repository/modules/SeccionGradoModulo';
import CursoGradoModulo from '~/repository/modules/CursoGradoModulo';
import AlumnoFiltroModulo from '~/repository/modules/AlumnoFiltroModulo';
import NotasAlumnoModulo from '~/repository/modules/NotasAlumnoModulo';
import ReporteNotaModulo from '~/repository/modules/ReporteNotaModulo';
import RegistroNotaModulo from '~/repository/modules/RegistroNotaModulo';
import CursoGradoModule from '~/repository/modules/cursoGrado';
import SilaboModulo from '~/repository/modules/SilaboModulo';


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
	categoriasDocumento: CategoriasDocumentoModule;
	examen: ExamenModule;
	calendario: CalendarModule;
	eventos: EventosModule;
	obligacionesPagadas: ObligacionesPagadasModule;
	resultadoCompetencia: ResultadoCompetenciaModule;
	imagenPago: ImagenPagoModule;
	aprobarPago: AprobarPagoModule;
	alumno: AlumnoModule;
	agregarDocumento: DocumentoAddModule;
	grados: GradosModule;
	captcha: CaptchaModule;
	gestionCursos: GestionCursosModule;
	pagosPendientesHome: PagosPendientesHomeModule;
	matricula: MatriculaModule;
	periodo: PeriodoModule;
	periodoNotas: PeriodoNotasModulo;
	gradoSede: GradoSedeModulo;
	subperiodo: SubperiodoModulo;
	seccionGrado: SeccionGradoModulo;
	cursoGradoModulo: CursoGradoModulo;
	alumnoFiltro: AlumnoFiltroModulo;
	notasAlumno: NotasAlumnoModulo;
	cursoGrado: CursoGradoModule;
	reporteNota: ReporteNotaModulo;
	registroNota: RegistroNotaModulo;
	silabo: SilaboModulo;
}

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();
	const fetchOptions: FetchOptions = {
		baseURL: config.public.urlApi,
		// El manejo de errores 401 se hace en FetchFactory.call() para tener más control
		// Este interceptor global actúa como respaldo
		onResponseError({ response }) {
			// Solo loguear errores críticos, el manejo real se hace en FetchFactory
			if (response.status === 401) {
				console.warn('[API Plugin] Error 401 detectado. El manejo se realiza en FetchFactory.');
			}
		},
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
		categoriasDocumento: new CategoriasDocumentoModule(apiFecther),
		examen: new ExamenModule(apiFecther),
		calendario: new CalendarModule(apiFecther),
		eventos: new EventosModule(apiFecther),
		obligacionesPagadas: new ObligacionesPagadasModule(apiFecther),
		resultadoCompetencia: new ResultadoCompetenciaModule(apiFecther),
		imagenPago: new ImagenPagoModule(apiFecther),
		aprobarPago: new AprobarPagoModule(apiFecther),
		alumno: new AlumnoModule(apiFecther),
		agregarDocumento: new DocumentoAddModule(apiFecther),
		grados: new GradosModule(apiFecther),
		captcha: new CaptchaModule(apiFecther),
		gestionCursos: new GestionCursosModule(apiFecther),
		pagosPendientesHome: new PagosPendientesHomeModule(apiFecther),
		matricula: new MatriculaModule(apiFecther),
		periodo: new PeriodoModule(apiFecther),
		periodoNotas: new PeriodoNotasModulo(apiFecther),
		gradoSede: new GradoSedeModulo(apiFecther),
		subperiodo: new SubperiodoModulo(apiFecther),
		seccionGrado: new SeccionGradoModulo(apiFecther),
		cursoGradoModulo: new CursoGradoModulo(apiFecther),
		alumnoFiltro: new AlumnoFiltroModulo(apiFecther),
		notasAlumno: new NotasAlumnoModulo(apiFecther),
		cursoGrado: new CursoGradoModule(apiFecther),
		reporteNota: new ReporteNotaModulo(apiFecther),
		registroNota: new RegistroNotaModulo(apiFecther),
		silabo: new SilaboModulo(apiFecther),
	};

	return {
		provide: {
			api: modules,
		},
	};
});
