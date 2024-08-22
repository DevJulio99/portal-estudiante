import { defineStore } from 'pinia';
import type { HorarioData } from './../types/cursos.types';
export const scheduleState = defineStore('scheduleState', {
	state: () => ({
		day: 0,
		filter: {} as any,
		dataStatus: false,
		currentCicle: null as { start: string; end: string; cicle: string } | null,
		selectedCourse: 'Todos',
		fullWeek: Array(7).fill({ empty: true }),
	}),
	actions: {
		setDay(payload: any) {
			this.day = payload;
		},
		setWeekCourses(payload: any) {
			payload.forEach((course: any) => {
				const index = Number(course.horario.diaNumero);
				this.fullWeek[index] = course;
			});
		},
		setFilter(payload: HorarioData[]) {
			payload?.forEach((item) => {
				item.detalleHorario.forEach((course) => {
					this.filter[course.codMateria as keyof typeof this.filter] = {
						DescEspecialCurso: course.descripMateria,
						CodCurso: course.codMateria,
					};
				});
			});
		},
		handleFilter(payload: string) {
			this.selectedCourse = payload;
		},
		setDataStatus(payload: boolean) {
			this.dataStatus = payload;
		},
		setCicles(payload: {
			[key: string]: { start: string; end: string; cicle: string };
		}) {
			const today = new Date().getTime();
			const currentCicle = ref<{
				start: string;
				end: string;
				cicle: string;
			} | null>(null);
			for (const item in payload) {
				const startDate = new Date(payload[item].start).getTime();
				const endDate = new Date(payload[item].end).getTime();
				if (startDate < today && endDate > today)
					currentCicle.value = payload[item];
			}
			this.currentCicle = currentCicle.value;
		},
	},
});
