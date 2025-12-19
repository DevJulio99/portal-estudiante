export interface ISilaboRequestBody {
	codCurso: string;
	idAlumno: number;
}

interface IContenidoHijo {
	id_contenido_hijo: number;
	tipo: string;
	titulo: string;
	fecha_apertura: string | null;
	fecha_cierre: string | null;
    tiene_material: boolean;
}

interface IContenidoSesion {
	tipo: string;
	titulo: string;
	contenido_hijo: IContenidoHijo[];
}

interface ISesion {
	numero: number;
	titulo: string;
	fecha: string;
	descripcion: string | null;
	contenido_sesion: IContenidoSesion[];
}

export interface IUnidad {
	id_unidad: number;
	unidad_titulo: string;
	fecha_inicio: string | null;
	fecha_fin: string | null;
	sesiones: ISesion[] | null;
}

export interface IApiResponse<T> {
	success: boolean;
	message: string | null;
	data: T;
}

export interface MaterialSesion {
	id_archivo:   number;
	id_contenido: number;
	nombre:       string;
	url:          string;
	extension:    string;
}

export interface RequestMaterial {
	idContenido: number;
	nombre:      string;
	url:         string;
	extension:   string;
	pesoMb:      number;
	idAlumno:    number;
}
