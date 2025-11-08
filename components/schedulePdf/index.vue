<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import type { CourseExtend } from '~/types/cursos.types';
import { scheduleState } from '~/stores/scheduleStates';
import { TipoInstitucion } from '~/types/institucion.types';
import { useTokenStore } from '~/stores/token';

const props = defineProps<{
	dataWeek: any;
	currentCicle: { start: string; end: string; cicle: string } | null;
}>();

const tokenStore = useTokenStore();
const esColegio = computed(() => tokenStore.getDataToken?.Tipo_Institucion === TipoInstitucion.Colegio);
const states = scheduleState();

// Obtener días de la semana
const weekDays = computed(() => {
	const days = [
		{ date: props.dataWeek.Monday, name: 'Lunes', index: 0 },
		{ date: props.dataWeek.Tuesday, name: 'Martes', index: 1 },
		{ date: props.dataWeek.Wednesday, name: 'Miércoles', index: 2 },
		{ date: props.dataWeek.Thursday, name: 'Jueves', index: 3 },
		{ date: props.dataWeek.Friday, name: 'Viernes', index: 4 },
		{ date: props.dataWeek.Saturday, name: 'Sábado', index: 5 },
		{ date: props.dataWeek.Sunday, name: 'Domingo', index: 6 },
	];
	
	if (esColegio.value) {
		return days.slice(0, 5); // Solo lunes a viernes
	}
	return days;
});

// Calcular horas mínimas y máximas de todos los cursos
const timeRange = computed(() => {
	let minHour = 24;
	let maxHour = 0;
	
	states.fullWeek.forEach((day) => {
		if (!day?.empty && day?.detalleHorario) {
			day.detalleHorario.forEach((course: any) => {
				const [startHour] = course.horaInicio.split(':').map(Number);
				const [endHour] = course.horaFin.split(':').map(Number);
				
				if (startHour < minHour) minHour = startHour;
				// Solo considerar hasta la última hora donde comienza un curso
				// No agregar una hora extra si el curso termina exactamente en una hora
				if (endHour > maxHour) {
					maxHour = endHour;
				}
			});
		}
	});
	
	// Si no hay cursos, usar horario por defecto
	if (minHour === 24) {
		minHour = 7;
		maxHour = 22;
	}
	
	return { minHour, maxHour };
});

// Generar array de horas a mostrar (solo hasta la última hora donde comienza un curso)
const hoursToShow = computed(() => {
	const hours = [];
	// Solo mostrar hasta la última hora donde comienza un curso
	for (let h = timeRange.value.minHour; h < timeRange.value.maxHour; h++) {
		hours.push(h);
	}
	return hours;
});

// Obtener cursos que comienzan en una hora específica (solo mostrar una vez)
const getCoursesStartingAtHour = (dayIndex: number, hour: number) => {
	const day = states.fullWeek[dayIndex];
	if (!day || day.empty || !day.detalleHorario) return [];
	
	return day.detalleHorario.filter((course: any) => {
		const [startHour] = course.horaInicio.split(':').map(Number);
		return startHour === hour;
	});
};

// Calcular cuántas filas debe abarcar un curso
const getCourseRowSpan = (course: any) => {
	const [startHour, startMin] = course.horaInicio.split(':').map(Number);
	const [endHour, endMin] = course.horaFin.split(':').map(Number);
	
	const startTime = startHour * 60 + startMin;
	const endTime = endHour * 60 + endMin;
	const duration = endTime - startTime;
	
	// Calcular cuántas horas completas abarca (redondeado hacia arriba)
	const hoursSpanned = Math.ceil(duration / 60);
	return hoursSpanned;
};

// Fecha y hora de descarga
const downloadDateTime = computed(() => {
	return useDateFormat(new Date(), 'DD/MM/YYYY - hh:mm A', {
		locales: 'es-ES',
	}).value;
});
</script>

<template>
	<div class="schedule-pdf-container">
		<!-- Encabezado con título y fecha de descarga -->
		<div class="schedule-header">
			<div class="schedule-title-wrapper">
				<BaseTitle class="schedule-title" text="HORARIO DE CLASES" />
			</div>
			<div class="download-info">
				<p class="download-label">Fecha y hora de descarga:</p>
				<p class="download-date">{{ downloadDateTime }}</p>
			</div>
		</div>

		<!-- Tabla del horario -->
		<div class="schedule-table">
			<!-- Encabezado de días -->
			<div class="schedule-row header-row">
				<div class="schedule-cell hour-header"></div>
				<div
					v-for="day in weekDays"
					:key="day.index"
					class="schedule-cell day-header"
				>
					<p class="day-name">{{ day.name }}</p>
				</div>
			</div>

			<!-- Contenedor de horas y días -->
			<div class="schedule-body">
				<!-- Columna de horas -->
				<div class="hours-column">
					<div
						v-for="hour in hoursToShow"
						:key="hour"
						class="hour-row"
					>
						<div class="schedule-cell hour-cell">
							<div class="hour-range">
								<span class="hour-start">{{ hour.toString().padStart(2, '0') }}:00</span>
								<span class="hour-separator">a</span>
								<span class="hour-end">{{ (hour + 1).toString().padStart(2, '0') }}:00</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Columnas de días -->
				<div
					v-for="day in weekDays"
					:key="day.index"
					class="day-column"
				>
					<div
						v-for="hour in hoursToShow"
						:key="`${day.index}-${hour}`"
						class="course-cell-wrapper"
					>
						<div class="schedule-cell course-cell"></div>
					</div>
					<!-- Cursos posicionados absolutamente sobre toda la columna -->
					<template
						v-for="hour in hoursToShow"
						:key="`courses-${day.index}-${hour}`"
					>
						<template
							v-for="course in getCoursesStartingAtHour(day.index, hour)"
							:key="`${day.index}-${hour}-${course.codMateria}`"
						>
							<div
								class="course-item"
								:class="{
									'course-presencial': course.descripMetodoEducativo?.toLowerCase() === 'presencial',
									'course-remoto': course.descripMetodoEducativo?.toLowerCase() === 'remoto',
									'course-virtual': course.descripMetodoEducativo?.toLowerCase() === 'virtual',
								}"
								:style="{
									top: `${(hour - timeRange.minHour) * 80}px`,
									height: `${getCourseRowSpan(course) * 80}px`,
								}"
							>
								<p class="course-name">{{ course.descripMateria }}</p>
								<p class="course-time">
									{{ course.horaInicio.slice(0, 5) }} - {{ course.horaFin.slice(0, 5) }}
								</p>
								<p class="course-code">{{ course.codMateria }}</p>
							</div>
						</template>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.schedule-pdf-container {
	width: 100%;
	padding: 20px;
}

.schedule-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 30px;
	position: relative;
}

.schedule-title-wrapper {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	text-align: center;
	pointer-events: none;
}

.schedule-title {
	margin: 0;
}

.download-info {
	text-align: right;
	margin-left: auto;
}

.download-label {
	font-size: 11px;
	color: #666;
	margin: 0 0 4px 0;
}

.download-date {
	font-size: 12px;
	font-weight: bold;
	color: #333;
	margin: 0;
}

.schedule-table {
	width: 100%;
	border-collapse: collapse;
}

.schedule-row {
	display: grid;
	grid-template-columns: 70px repeat(auto-fit, minmax(120px, 1fr));
	border-bottom: 1px solid #e0e0e0;
}

.schedule-body {
	display: grid;
	grid-template-columns: 70px repeat(auto-fit, minmax(120px, 1fr));
}

.hours-column {
	display: flex;
	flex-direction: column;
}

.hour-row {
	border-bottom: 1px solid #e0e0e0;
}

.day-column {
	display: flex;
	flex-direction: column;
	border-right: 1px solid #e0e0e0;
	position: relative;
}

.day-column:last-child {
	border-right: none;
}

.course-cell-wrapper {
	border-bottom: 1px solid #e0e0e0;
	position: relative;
	min-height: 80px;
	height: 80px;
}

.schedule-cell {
	padding: 8px;
	border-right: 1px solid #e0e0e0;
	min-height: 80px;
	display: flex;
	align-items: center;
}

.header-row .schedule-cell {
	min-height: auto !important;
	height: auto !important;
	padding: 12px 8px !important;
}

.schedule-cell:last-child {
	border-right: none;
}

.hour-header {
	background-color: #f5f5f5;
	font-weight: bold;
}

.day-header {
	background-color: #031448;
	color: white;
	text-align: center;
	padding: 0 !important;
	justify-content: center;
	align-items: center;
	min-height: auto !important;
	height: auto !important;
	display: flex;
}

.day-name {
	font-weight: bold;
	font-size: 13px;
	margin: 0;
	padding: 8px 8px 18px 8px;
	text-align: center;
	line-height: 1.3;
	display: block;
	width: 100%;
	box-sizing: border-box;
}

.hour-cell {
	background-color: #f9f9f9;
	font-weight: 600;
	font-size: 11px;
	justify-content: center;
	align-items: center;
	color: #333;
	text-align: center;
	padding: 8px 4px;
}

.hour-range {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2px;
}

.hour-start,
.hour-end {
	font-size: 11px;
	font-weight: 600;
}

.hour-separator {
	font-size: 9px;
	font-weight: 400;
	opacity: 0.7;
}

.course-cell {
	background-color: white;
	padding: 0;
	position: relative;
	width: 100%;
	height: 100%;
	min-height: 80px;
}

.course-item {
	width: calc(100% - 12px);
	padding: 8px;
	border-radius: 4px;
	border-left: 4px solid;
	box-sizing: border-box;
	word-wrap: break-word;
	overflow-wrap: break-word;
	position: absolute;
	left: 6px;
	right: 6px;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	z-index: 1;
}

.course-item:last-child {
	margin-bottom: 0;
}

.course-presencial {
	background-color: #e8f5e9;
	border-left-color: #4caf50;
}

.course-remoto {
	background-color: #f3e5f5;
	border-left-color: #9c27b0;
}

.course-virtual {
	background-color: #e0f7fa;
	border-left-color: #00bcd4;
}

.course-name {
	font-size: 12px;
	font-weight: bold;
	color: #333;
	margin: 0 0 4px 0;
	line-height: 1.3;
}

.course-time {
	font-size: 11px;
	color: #666;
	margin: 0 0 2px 0;
}

.course-code {
	font-size: 10px;
	color: #999;
	margin: 0;
}
</style>
