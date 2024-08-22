<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { type RangeWeek } from '~/types/schedule.types';
import { getWeekDates } from '~/utils/schedule';

const props = defineProps<{
	pending: boolean;
	errorService: { titulo: string } | null;
	error: Error | null;
	onDownload: () => void;
	onActionWeek: (range: RangeWeek) => void;
	loadingPdf: boolean;
}>();

const isLargeScreen = useMediaQuery('(min-width: 1024px)');
const selectedCourseWeek = ref('Todos');
const today = new Date().getDay();
const currentDay = (today + 6) % 7;
const weekData = ref(getWeekDates());

const states = scheduleState();
states.setDay(currentDay);

const handleDay = (day: number) => states.setDay(day);

const eventClick = () => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-Horario',
	// 		url: 'https://contacto.upn.edu.pe/',
	// 		title: 'Contacto UPN',
	// 	});
	// }
};

const getWeekData = (range: RangeWeek) => {
	weekData.value = range.weekDates;
	props.onActionWeek(range);
};
</script>

<template>
	<div>
		<div class="controls-container">
			<!-- Cambio de fecha -->
			<ScheduleDayControls
				:on-action-week="getWeekData"
				:activeWeek="`${
					useDateFormat(getWeekDates().Monday, 'DD MMMM', { locales: 'es-ES' })
						.value
				} - ${
					useDateFormat(getWeekDates().Sunday, 'DD MMMM', { locales: 'es-ES' })
						.value
				}`"
				:pending="pending"
			/>
			<!-- Filtro  -->
			<ScheduleCourseFilter
				:selectedCourseWeek="selectedCourseWeek"
				:handleCourse="states.handleFilter"
				:filteredCourses="states.filter"
				:on-download="onDownload"
				:loadingPdf="loadingPdf"
			/>
		</div>
		<!-- Calendario -->
		<ScheduleBoardDesktop
			v-if="isLargeScreen"
			:data-week="weekData"
			:pending="pending"
			:errorService="errorService"
			:error="error"
		/>
		<ScheduleBoardMobile
			v-else
			:data="states.fullWeek[states.day] ?? null"
			:data-week="weekData"
			:day="states.day"
			:handleDay="handleDay"
			:pending="pending"
			:errorService="errorService"
			:error="error"
		/>
		<div class="lg:pt-5 text-sm">
			<div class="flex">
				<p class="mr-[13px] before:bg-primary disclaimer">Curso Presencial</p>
				<p class="mb-4 before:bg-[#D191FF] disclaimer">Curso Remoto</p>
			</div>
			<p class="leading-[1]">
				*Para dudas con los horarios, consúltalo en
				<a
					class="text-blue_link underline"
					href="https://contacto.upn.edu.pe/"
					target="_blank"
					@click="eventClick"
				>
					Contacto UPN</a
				>, con nuestros “accesos rápidos”, o comunícate con nosotros en los
				medios de contacto ubicados en el botón del menú “¿Necesitas ayuda?”.
			</p>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.controls-container {
	@apply bg-purple_80 gap-x-3 gap-y-4 flex xl:flex-row justify-between px-3 py-4 lg:px-6 lg:py-5 -mx-[12px] lg:mx-0 flex-row;
}

.disclaimer {
	@apply before:inline-block before:w-[10px] before:h-[10px] before:rounded-full;
}
</style>
