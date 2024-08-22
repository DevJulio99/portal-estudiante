export interface WeekDates {
	Monday: Date;
	Tuesday: Date;
	Wednesday: Date;
	Thursday: Date;
	Friday: Date;
	Saturday: Date;
	Sunday: Date;
}

export interface RangeWeek {
	init: string;
	end: string;
	weekDates: WeekDates;
}
