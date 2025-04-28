export interface Course {
    idCurso: number;
    codigoCurso: string;
    descripcion: string;
    creditos: number;
    modalidad: string;
    nivel: string;
    total: number;
}

export interface RequestCourse{
    descripcion: string;
    creditos: number;
    modalidad: string;
    nivel: string;
}

export interface RegistrarCurso extends RequestCourse {
    codigoSede: string;
}

export interface ActualizarCurso extends RequestCourse {
    idCurso: number;
}

export interface Paginado {
    pagina: number;
    itemsPorPagina: number;
}

export interface ListaCurso extends Paginado {
    codigoSede: string;
}

export interface FiltroCurso extends ListaCurso {
    filtro: string;
}