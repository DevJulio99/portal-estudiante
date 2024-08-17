export interface Services {
	id: number;
	status: string;
	categoria: number;
	nombre: string;
	descripcion: null | string;
	icono: null | string;
	alt_icono: null | string;
	url: string;
	abrir_nueva_pagina: boolean;
	sort: number;
	prioridad_servicio: number | null;
	date_created: Date;
}

export interface Category {
	id: number;
	status: string;
	nombre: string;
	descripcion: null | string;
	icono: null;
	alt_icono: null | string;
	sort: number;
	prioridad_categoria: number | null;
	seccion: number;
	date_created: Date;
	servicios: Services[];
}

export interface Internal {
	id: number;
	status: string;
	nombre: string;
	ocultar_nombre: boolean;
	descripcion: null;
	ocultar_descripcion: boolean;
	icono: null;
	ocultar_icono: boolean;
	alt_icono: null;
	sort: number;
	top: boolean;
	date_created: Date;
	categorias: Category[];
}

export interface MyServicesData {
	home: Services[];
	internal: Internal[];
}

export interface MyServicesParams {
	codNivel: string | null;
	codCampus: string | null;
	facultad: string | null;
	codProductoActual: string | null;
	facultadId: string | null;
}

export interface ProfileDataStore {
	data: null | MyServicesData[];
	error: unknown;
}

export interface ErrorResponse {
	icono: string;
	titulo: string;
	descripcion: string;
}

export type DataResponse<T> = {
	message: string;
	flag: boolean;
	error: ErrorResponse | null;
	data: T;
};

export type DataResponseOffset<T> = {
	message: string;
	count: number;
	flag: boolean;
	error: ErrorResponse | null;
	data: T;
};

export interface BodyDetailService {
	titulo: string;
	icono: string;
	secuencia: string;
	descripcion: string;
	url: string;
	id: number;
	body_id: number;
	ariaLabel: string;
}

export interface BodyService {
	id: number;
	titulo: string;
	body_details: BodyDetailService[];
}

export interface ServiceExperience {
	logo: string;
	imagen_desktop: string;
	imagen_mobile: string;
	subtitulo: string;
	subtitulo_secundario: string;
	descripcion: string;
	descripcion_secundaria: string;
	mostrar_boton: boolean;
	mostrar_boton_secundario: boolean;
	texto_boton: string;
	texto_boton_secundario: string;
	imagen_secundaria_desktop: string;
	imagen_secundaria_mobile: string;
	titulo: string;
	url_boton: string;
	url_boton_secundario: string;
	body: BodyService[];
}
