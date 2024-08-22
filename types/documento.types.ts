export interface DataDocumento {
	id: number;
	status: string;
	descripcion: string | null;
	imagen: string | null;
	nombre?: string;
	titulo?: string;
	secuencia: number;
	secuencia_mas_buscada?: number;
	date_created: string | null;
	mas_buscados?: boolean;
	documento?: string;
	documento_descarga: string;
	documentos?: DataDocumento[];
	type?: string;
	interno: boolean;
}

export interface DocumentosParamsBk {
	codNivel: string | null;
	codCampus: string | null;
	facultad: string | null;
	codProductoActual: string | null;
	facultadId: string | null;
}

export interface DocumentosParams {
	cod_modalidad: string | null;
	status: string | null;
}

export interface UrlDoc {
	url: string;
}
