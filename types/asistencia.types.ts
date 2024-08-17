export interface Inasistencia {
	dia: string;
	inicio: string;
	fin: string;
	status: string;
}
export interface DataAsistencia {
	faltasPermitidas: string;
	cantidadFaltas: string;
	status: string;
	inasistencias: Inasistencia[];
}
