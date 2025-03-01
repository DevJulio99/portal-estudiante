export interface GenerarExamen {
    idPostulante: number;
    numeroPreguntas: number;
    idCompetencia: number;
    idGrado: number;
}

export interface ExamenGenerado {
    idExamenGenerado: number;
    idPostulante: number;
    idPregunta: number;
    ordenPregunta: number;
    respuestaSeleccionada: string;
    tiempoRespuesta: string;
    completado: boolean;
}

export interface Pregunta {
    tipoEvaluacion: string;
    grupo: string;
    textoTitulo: string;
    textoSuperior: string;
    textoImagen: string;
    textoInferior: string;
    textoGrupo: string;
    idArchivoCarga: number;
    pregunta: string;
    opcionA: string;
    opcionB: string;
    opcionC: string;
    opcionD: string;
    respuestaCorrecta: string;
    numeroPregunta: number;
    idCompetencia: number;
}

export interface Examen {
    nombreCompetencia: string;
    examenGenerado: ExamenGenerado;
    preguntas: Pregunta
}

export interface Respuesta {
    descripcion: string;
    opcion: string;
}

export interface BancoRespuesta {
    numeroPregunta: number;
    respuestaSeleccionada: string;
}

export interface ActualizarRespuesta {
    idPostulante: number;
    idPregunta: number
    respuestSeleccionada: string;
}