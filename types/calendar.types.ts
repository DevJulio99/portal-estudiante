export enum EventStatus {
	ACADEMIC = 'PR',
	HOLIDAY = 'FE',
	CEREMONY = 'CE',
	STANDARD = 'ES',
}

export interface Calendar {
	actividad: string;
	fechaFin: string;
	modalidadEstudios: string;
	tipoActividad: EventStatus;
	fechaInicio: string;
	now: boolean;
	// is_start_end_date: boolean;
}

export interface CalendarPdf {
	modalidad: string;
	periodo: string;
	archivo: string;
}
