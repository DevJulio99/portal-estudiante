export interface UbicacionEvento {
	latitud: string;
	longitud: string;
	direccion: string;
	nombre: string;
	url: string;
	url_mobile: string;
}
export interface EventData {
	id: string;
	titulo: string;
	imagen_desktop: string;
	imagen_mobile: string;
	url: string;
	prioridad: string;
	abrir_nueva_pagina: boolean;
	tipo_de_evento: string;
	categoria_evento: string;
	fecha_de_inicio: string;
	hora_de_inicio: string;
	fecha_de_fin: string;
	hora_de_fin: string;
	fecha_fin_evento: string;
	fecha_inicio_evento: string;
	hora_inicio_evento: string;
	nombre_boton: string;
	ubicacion: UbicacionEvento[];
	descripcion: string;
	capacidad: string;
}

export interface EventCategory {
	nombre: string;
}
