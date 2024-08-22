export enum EventStatus {
	ACADEMIC = 'PR',
	HOLIDAY = 'FE',
	CEREMONY = 'CE',
	STANDARD = 'ES',
}

export interface Calendar {
	activity: string;
	endDate: string;
	modality: string;
	PriorityStatus: EventStatus;
	startDate: string;
	now: boolean;
	is_start_end_date: boolean;
}

export interface CalendarPdf {
	modalidad: string;
	periodo: string;
	archivo: string;
}
