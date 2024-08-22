export const getDay = (date: Date) => new Date(date).getDay();
export const getHour = (date: Date) => {
	const hour = new Date(date).getHours();
	return hour < 10 ? `0${hour}` : `${hour}`;
};
export const getMinutes = (date: Date) => {
	const minutes = new Date(date).getMinutes();
	return minutes < 10 ? `0${minutes}` : `${minutes}`;
};
export const getHourMinutes = (date: Date) =>
	`${getHour(date)}:${getMinutes(date)}`;
export const getWeekDates = (today_?: Date) => {
	const today = today_ ?? new Date();
	const dayOfWeek = today.getDay();
	const daysToSubtract = (dayOfWeek + 6) % 7;
	const mondayDate = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() - daysToSubtract,
	);

	const weekDates = {
		Monday: new Date(
			mondayDate.getFullYear(),
			mondayDate.getMonth(),
			mondayDate.getDate(),
		),
		Tuesday: new Date(
			mondayDate.getFullYear(),
			mondayDate.getMonth(),
			mondayDate.getDate() + 1,
		),
		Wednesday: new Date(
			mondayDate.getFullYear(),
			mondayDate.getMonth(),
			mondayDate.getDate() + 2,
		),
		Thursday: new Date(
			mondayDate.getFullYear(),
			mondayDate.getMonth(),
			mondayDate.getDate() + 3,
		),
		Friday: new Date(
			mondayDate.getFullYear(),
			mondayDate.getMonth(),
			mondayDate.getDate() + 4,
		),
		Saturday: new Date(
			mondayDate.getFullYear(),
			mondayDate.getMonth(),
			mondayDate.getDate() + 5,
		),
		Sunday: new Date(
			mondayDate.getFullYear(),
			mondayDate.getMonth(),
			mondayDate.getDate() + 6,
		),
	};

	return weekDates;
};
