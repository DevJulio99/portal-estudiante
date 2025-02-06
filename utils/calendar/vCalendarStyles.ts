import { EventStatus } from '~/domain/calendar/enums';

export const eventsDates = (
	type: string,
	start: string,
	end: string,
	isSameDay: boolean,
) => {
	const startDate = new Date(start.replaceAll('-', '/'));
	const endDate = new Date(end.replaceAll('-', '/'));

	if (type === EventStatus.ACADEMIC && start === end && !isSameDay)
		return [
			{
				highlight: {
					color: 'blue',
					fillMode: 'light',
				},
				dot: 'blue',
				dates: new Date(startDate),
			},
		];
	if (type === EventStatus.ACADEMIC && start === end && isSameDay)
		return [
			{
				dot: 'blue',
				dates: new Date(startDate),
			},
		];
	if (type === EventStatus.ACADEMIC && start !== end && !isSameDay)
		return [
			{
				highlight: {
					color: 'blue',
					fillMode: 'light',
				},
				dates: {
					start: new Date(startDate),
					end: new Date(endDate),
				},
			},
			{
				dot: 'blue',
				dates: new Date(startDate),
			},
		];
	if (type === EventStatus.ACADEMIC && start !== end && isSameDay)
		return [
			{
				highlight: {
					color: 'blue',
					fillMode: 'light',
				},
				dates: {
					start: new Date(startDate),
					end: new Date(endDate),
				},
			},
			{
				dot: 'blue',
				dates: new Date(startDate),
			},
			{
				highlight: {
					color: 'yellow',
					fillMode: 'solid',
				},
				dates: new Date(),
			},
		];
	if (type === EventStatus.HOLIDAY && start === end)
		return [
			{
				highlight: {
					color: 'pink',
					fillMode: isSameDay ? 'solid' : 'light',
				},
				bar: {
					style: {
						backgroundColor: isSameDay ? '#FFE6FB' : '#d900b9',
					},
				},
				dot: 'pink',
				dates: {
					start: new Date(startDate),
					end: new Date(endDate),
				},
			},
		];
	if (type === EventStatus.HOLIDAY && start !== end)
		return [
			{
				highlight: {
					color: 'pink',
					fillMode: 'light',
				},
				bar: {
					style: {
						backgroundColor: '#d900b9',
					},
				},
				dates: {
					start: new Date(startDate),
					end: new Date(endDate),
				},
			},
			{
				highlight: {
					color: 'pink',
					fillMode:
						String(new Date(startDate)) === String(new Date())
							? 'solid'
							: 'light',
				},
				bar: {
					style: {
						backgroundColor:
							String(new Date(startDate)) === String(new Date())
								? '#FFE6FB'
								: '#d900b9',
					},
				},
				dot: 'pink',
				dates: new Date(startDate),
			},
		];
};

export const defineText = (init: string, fin: string, status: string) => {
	if (status === EventStatus.CEREMONY) {
		const string = useDateFormat(init, 'MMMM', { locales: 'es-ES' }).value;
		return string.charAt(0).toUpperCase() + string.slice(1);
	} else if (init === fin) {
		const string = useDateFormat(init, 'dddd DD', { locales: 'es-ES' }).value;
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	const string1 = useDateFormat(init, 'dddd DD', { locales: 'es-ES' }).value;
	const string2 = useDateFormat(fin, 'dddd DD', { locales: 'es-ES' }).value;
	return `${string1.charAt(0).toUpperCase() + string1.slice(1)} al ${string2.charAt(0).toUpperCase() + string2.slice(1)}`;
};
