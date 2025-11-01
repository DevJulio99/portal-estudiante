export interface GradoSede {
  idGrado: number;
  descripcionGrado: string;
  nivelEducativo: string;
  tipoInstitucion: string;
}

export type ResponseGradoSede = GradoSede[];