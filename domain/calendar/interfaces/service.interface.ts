import type { EventStatus } from '../enums/index';

export interface Calendar {
	actividad: string;
	fechaFin: string;
	modalidadEstudios: string;
	tipoActividad: EventStatus;
	fechaInicio: string;
	now: boolean;
}

export interface CalendarPdf {
	modalidad: string;
	periodo: string;
	archivo: string;
}
