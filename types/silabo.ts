export interface ISilaboRequestBody {
	codCurso: string;
}

interface IContenidoHijo {
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