
export interface EstadoCompencia {
    idPostulante: number;
    idCompetencia: number;
    estado: string;
    tiempoIniciado: string;
    tiempoFinalizado: string;
}

export interface RequestEstado {
    idCompetencia: number;
    idPostulante: number;
    estado: string;
}

export interface CompetenciaBase {
    id_compentencia: number;
    nombreCompetencia: string;
    descripcion: string;
    urlImagen: string;
}

export interface Competencia extends CompetenciaBase{
    pesoCompetencia: string;
    numeroPreguntas: number;
    fechaDisponibilidad: string;
    fechaInicio: string;
    fechaFin: string;
    horaInicio: string;
    ordenCompetencia: string;
    estadoCompetencia: string;
    dependenciaCompetencia: string;
    idEtapa: string;
    idProceso: string;
    tiempoLimite: string;
    finalizado: boolean;
    esGrupal: boolean;
}

export interface PreguntaResultado {
    idPregunta: number;
    ordenPregunta: number;
    estado: number;
}

export interface ResultadoEvaluacion {
    preguntas: PreguntaResultado[];
    totalPreguntas: number;
    correctas: number;
    incorrectas: number;
    enblanco: number;
    puntaje: number;
}