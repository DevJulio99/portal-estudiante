export interface NotaAlumno {
  idNota: number;
  nota: number;
  peso: number;
  tipoNota: string;
  idAlumno: number;
}

export type ResponseNotasAlumno = NotaAlumno[];