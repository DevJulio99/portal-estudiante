export interface DataDocumento {
	id: number;
	status: string;
	descripcion: string | null;
	imagen: string | null;
	nombre?: string;
	titulo?: string;
	secuencia: number;
	secuenciaMasBuscada?: number;
	dateCreated: string | null;
	masBuscados?: boolean;
	documento?: string;
	documentoDescarga: string;
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

export interface DocumentoAdd {
	idCategoriaDocumento: Number;
	titulo: string;
	descripcion: string;
	documento: string;
	interno: Boolean;
	documentoDescarga: string;
}
