export interface Alumno {
    id_alumno: number;
    codigoAlumno: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    dni: string;
    correo: string;
    fechaNacimiento: string;
    telefono: string;
    direccion: string;
    fotoPerfil: string;
    genero: string;
    tipoAlumno: string;
    observaciones: string;
    apoderado: string;
    idGrado: number;
    habilitadoPrueba: boolean;
    total: number;
}

export interface RequestAlumno {
    correo: string;
    nombreUsuario: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    numeroDocumento: string;
    fechaNacimiento: string;
    direccion: string;
    fotoPerfil: string;
    genero: string;
    tipoAlumno: string;
    observaciones: string;
    apoderado: string;
    tipoInstitucion: string;
    idGrado: number;
    habilitadoPrueba: boolean;
}

export interface RegistrarAlumno extends RequestAlumno{
    codigoSede: string;
}

export interface ActualizarAlumno extends RequestAlumno{
    contraseña: string;
}

export interface Paginado {
    pagina: number;
    itemsPorPagina: number;
}

export interface ListaAlumno extends Paginado{
    codigoSede: string;
}

export interface FiltroAlumno extends ListaAlumno {
    filtro: string;
}