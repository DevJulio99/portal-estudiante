export const conditionedString = (value: string) => {
  if (!value?.trim()) return ' - ';
  return value;
}

export const formatDateString = (value: string) => {
  if (!value?.trim()) return ' - ';
  
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return useDateFormat(date, 'DD/MM/YYYY').value;
  }
  
  return ' - ';
}