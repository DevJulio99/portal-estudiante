export interface ResponseMatricula {
    idMatricula:        number;
    idAlumno:           number;
    fechaInicio:        string;
    fechaFin:           string;
    tipoMatricula:      string;
    estadoMatricula:    string;
    idSeccion:          number;
    observaciones:      string;
    veces:              null;
    idPeriodo:          number;
    idGrado:            number;
    codigoSede:         string;
    fechaMatricula:     string;
    usuarioRegistro:    string;
    activo:             boolean;
    nombreAlumno:       string;
    apellidoPaterno:    string;
    apellidoMaterno:    string;
    dniAlumno:          string;
    descripcionGrado:   string;
    nivelEducativo:     string;
    descripcionPeriodo: string;
    codigoPeriodo:      string;
    descripcionSede:    string;
}


export interface RequestMatricula {
    idAlumno:        number;
    idPeriodo:       number;
    idGrado:         number | null;
    tipoMatricula:   string;
    estadoMatricula: string;
    observaciones:   string;
    usuarioRegistro: string;
    tipoInstitucion: string;
    cursos?: CursoSeccion[];
}

export interface CursoSeccion {
    idCurso: number;
    idSeccion: number;
}

export interface ActualizarMatricula {
    idMatricula:     number;
    estado:          boolean;
    usuarioModifica: string;
}

export interface ResponsePeriodo {
    idPeriodo:          number;
    codigoPeriodo:      string;
    descripcionPeriodo: string;
    tipoPeriodo:        string;
    estadoPeriodo:      string;
    fechaInicio:        Date;
    fechaFin:           Date;
    anio:               number;
}
