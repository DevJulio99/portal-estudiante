export interface UbicacionEvento {
	latitud: string;
	longitud: string;
	direccion: string;
	nombre: string;
	url: string;
	urlMobile: string;
}
export interface EventData {
	id: number;
	titulo: string;
	imagenDesktop: string;
	imagenMobile: string;
	url: string;
	prioridad: string;
	abrirNuevaPagina: boolean;
	tipoDeEvento: string;
	categoriaEvento: string;
	fechaDeInicio: string;
	horaDeInicio: string;
	fechaDeFin: string;
	horaDeFin: string;
	fechaFinEvento: string;
	fechaInicioEvento: string;
	horaInicioEvento: string;
	nombreBoton: string;
	ubicacion: UbicacionEvento[];
	descripcion: string;
	capacidad: string;
}

export interface EventCategory {
	nombre: string;
}
