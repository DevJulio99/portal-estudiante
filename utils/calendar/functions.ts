import { type Calendar } from '~/domain/calendar/interfaces/service.interface';
import { EventStatus } from '~/domain/calendar/enums';
import { days } from '~/domain/calendar/constants';

const getType = (arr: Calendar[]) => {
	let isAcademic = '';
	for (const x of arr) {
		if (x.tipoActividad === EventStatus.HOLIDAY) return EventStatus.HOLIDAY;
		if (x.tipoActividad === EventStatus.ACADEMIC)
			isAcademic = EventStatus.ACADEMIC;
	}
	return isAcademic || EventStatus.STANDARD;
};

export const sortCalendarData = (calendarData: Calendar[]) => {
	const eventsPerDay: { [key: string]: Calendar[] } = {};
	const years: { [key: string]: boolean } = {};
	const ceremoniesPerMonth: { [key: string]: Calendar[] } = {};

	// Agrupa eventos por día y ceremonias por mes, y en cuantos años se distribuyen
	for (const x of calendarData) {
		const date = new Date(x.fechaInicio.replace(/-/g, '/'));
		const dateEnd = new Date(x.fechaFin.replace(/-/g, '/'));

		if (!years[date.getFullYear() as keyof typeof years])
			years[date.getFullYear() as keyof typeof years] = true;

		if (!years[dateEnd.getFullYear() as keyof typeof years])
			years[dateEnd.getFullYear() as keyof typeof years] = true;

		if (x.tipoActividad !== EventStatus.CEREMONY) {
			if (!eventsPerDay[x.fechaInicio as keyof typeof eventsPerDay]) {
				eventsPerDay[x.fechaInicio as keyof typeof eventsPerDay] = [];
			}
			if (x.tipoActividad === EventStatus.STANDARD)
				eventsPerDay[x.fechaInicio as keyof typeof eventsPerDay].push(x);
			else eventsPerDay[x.fechaInicio as keyof typeof eventsPerDay].unshift(x);
		} else {
			const property = `${date.getMonth()}-${date.getFullYear()}`;
			if (!ceremoniesPerMonth[property as keyof typeof eventsPerDay]) {
				ceremoniesPerMonth[property as keyof typeof eventsPerDay] = [];
			}
			ceremoniesPerMonth[property as keyof typeof eventsPerDay].push(x);
		}
	}
	const yearsFound = Object.keys(years);
	const eventsPerMonth = Array(yearsFound.length * 12).fill([]);

	// Agrupa eventos por mes
	for (const data in eventsPerDay) {
		const date = new Date(data.replace(/-/g, '/'));
		const order = yearsFound.indexOf(String(date.getFullYear())) * 12;
		const month = Number(date.getMonth());
		const day = {
			day: days[date.getDay() as keyof typeof days],
			numberDay: date.getDate(),
			type: getType(eventsPerDay[data]),
			date: data,
			events: eventsPerDay[data],
		};
		eventsPerMonth[month + order] = eventsPerMonth[month + order].concat(day);
	}

	return {
		yearsFound,
		ceremoniesPerMonth,
		eventsPerMonth,
	};
};
