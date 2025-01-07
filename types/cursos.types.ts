export interface Docente {
	nombresDocentes: string;
	apellidoPaternoDocente: string;
	apellidoMaternoDocente: string;
	emailDocente: string;
	descCategoriaDocente: string;
	codUsuarioDocente: string;
	codCategoriaDocente: string;
}

export interface Curso {
	codCurso: string;
	ciclo: string;
	salon: string;
	email: string;
	ciclo_name: string;
	orden: number;
	cursado: string;
	modalidad: string;
	descCurso: string;
	periodo: string;
	seccion: string;
	docente: Docente[];
	creditos: string;
	cantidadVeces: string;
	inasistencias: number;
	statusCurso: string;
	tieneHorario: boolean;
	notaFinal: number;
	nivel?: string;
	grado?:string;
}

export interface CursoAsistencia {
	idAsistencia: number;
	dia: string;
	estadoAsistencia: string;
	descripcionCurso: string;
	modalidad: string;
	horaInicio: string;
	horaFin: string;
  }

export interface CourseExtend extends Curso {
	horario: {
		fechaInicio: string;
		fechaFin: string;
		horaInicio: string;
		horaFin: string;
		diaNombre: string;
		codAula: string;
		campus: string;
	}[];
}

export interface Nota {
	codTipoPrueba: string;
	nota: string;
	desTipoPrueba: string;
	numPrueba: string;
	pesoPonderado: string;
}

export interface NotaData {
	descFormula: string;
	inasistencias: number;
	notaFinal: number;
	notas: Nota[];
}

export interface Horario {
	fechaInicio: string | null;
	fechaFin: string | null;
	diaNombre: string;
	diaNumero: string;
	codPeriodo: string | null;
}

export interface Professor {
	apellido: string;
	correo: string;
	idBanner: string;
	nombreCompleto: string;
	nombres: string;
	pidm: string;
	tipodesc: string;
}

export interface DetalleHorario {
	titulo: string | null;
	nrc: string | null;
	descripMetodoEducativo: string | null;
	codmetodoEducativo: string | null;
	descripMateria: string;
	codMateria: string;
	descripPartePeriodo: string | null;
	codPartePeriodo: string;
	codAula: string;
	codSeccion: string;
	descripAula: string;
	codCampus: string;
	descripCampus: string;
	codEdificio: string | null;
	descripEdificio: string | null;
	fechaInicio: string;
	fechaFin: string;
	diaNombre: string;
	diaNumero: string;
	horaInicio: string;
	horaFin: string;
	profesor: Professor[] | [];
	orden: null | number;
}

export interface HorarioData {
	horario: Horario;
	detalleHorario: DetalleHorario[];
}

export interface Participant {
	nombre: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	email: string;
	foto: string;
	codigoAlumno: string;
	nombreCompleto: string;
}

export interface CursoListData {
	cursoId: string;
	cursoNombre: string;
	notaFinal: string;
	estado: string;
	periodo: string;
	ciclo: string;
	credito: string;
	promedioSemestre: string;
}

export interface CursoHistoricoDetData {
	periodo: string;
	periodoDesc: string;
	promSemetre: string;
	historial: CursoListData[];
}

export interface CursoHistoricoData {
	progNombre: string;
	progPromedio: number;
	progDetalle: CursoHistoricoDetData[];
}

export interface RecordAcademico {
	creditosInscritos: number;
	creditosAprobados: number;
	creditosDesaproados: number;
	creditosPendientes: number;
	creditosConvalidados: number;
	totalDeCreditos: number;
	promedioPrograma: number;
}

export interface ProgramasInscritosData {
	nivel: string;
	nivelDescripcion: string;
	periodoActivo: string;
	periodoInscrito: string;
	programaNombre: string;
	programaId: string;
	branch: string;
	campus: string;
	facultad: string;
}
