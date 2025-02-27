export interface Postulante {
    idPostulante: number;
    dni: string;
    nombre: string;
    apellido: string;
    correo: string;
    celular: string;
    codigoPostulante: number;
    estado: boolean;
    idGrado: number;
}

export interface RegistrarPostulante {
    dni: string;
    nombre: string;
    apellido: string;
    correo: string;
    estado: boolean;
}