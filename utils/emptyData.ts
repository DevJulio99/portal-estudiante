export const conditionedString = (value: string) => {
	return value.trim() ? value : ' - ';
};
