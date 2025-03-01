
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

export interface Competencia {
    id_compentencia: number;
    nombreCompetencia: string;
    pesoCompetencia: string;
    descripcion: string;
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
    urlImagen: string;
    finalizado: boolean;
}