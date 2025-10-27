export interface RequestCursoGrado {
    idGrado: number;
    tipoInstitucion: string;
}

export interface ResponseCursoGrado {
    id_curso: number;
    codigo_curso: string;
    descripcion_curso: string;
    secciones: Seccion[];
}

export interface Seccion {
    id_seccion: number;
    codigo_seccion: string;
    descripcion_seccion: string;
    horario: Horario;
}

export interface Horario {
    turno: string;
    nombre_dia: string;
    fecha_inicio: string;
    fecha_fin: string;
    hora_inicio: string;
    hora_fin: string;
}