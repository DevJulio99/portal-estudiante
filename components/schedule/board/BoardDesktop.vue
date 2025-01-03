<script setup lang="ts">
import { useNow, useDateFormat } from '@vueuse/core';
import { type WeekDates } from '~/types/schedule.types';
import { getDay } from '~/utils/schedule';

const props = withDefaults(
	defineProps<{
		pending: boolean;
		errorService: { titulo: string } | null;
		error: Error | null;
		dataWeek: WeekDates;
		pdf?: boolean;
	}>(),
	{
		pdf: false,
	},
);

const hourVal = props.pdf ? 48 : 72;

const hours = ref({
	'07': hourVal,
	'08': hourVal,
	'09': hourVal,
	10: hourVal,
	11: hourVal,
	12: hourVal,
	13: hourVal,
	14: hourVal,
	15: hourVal,
	16: hourVal,
	17: hourVal,
	18: hourVal,
	19: hourVal,
	20: hourVal,
	21: hourVal,
	22: hourVal,
	23: hourVal,
	24: 0,
});

const states = scheduleState();
const nowMark = useNow();

const getDiff = (init: string, fin: string) => {
	const timeArrFin = fin.split(':');
	const timeArrInit = init.split(':');
	return (
		Number(timeArrFin[0]) * 60 +
		Number(timeArrFin[1]) -
		(Number(timeArrInit[0]) * 60 + Number(timeArrInit[1]))
	);
};

const getTopAndHeight = (init: string, fin: string) => {
	const timeArrInit = init.split(':');
	const hCard = hourVal;
	const height = getDiff(init, fin) * (hCard / 60) - 2;
	let top = 0;
	Object.keys(hours.value)
		.sort()
		.forEach((item) => {
			if (Number(item) < Number(timeArrInit[0])) {
				top = top + hCard;
			}
		});

	if (Number(Number(timeArrInit[1])) / 60 > 0)
		top = top + Number(timeArrInit[1]) * (hCard / 60);
	return {
		top: `${top + 11}px`,
		height: `${height}px`,
	};
};

const currentDay = (getDay(new Date()) + 6) % 7;

onBeforeUnmount(() => {
	states.handleFilter('Todos');
});
</script>

<template>
	<div class="flex flex-col pl-1 pr-5 lg:py-2 bg-extra_gray">
		<!-- Días de la semana -->
		<div ref="datesList" class="datesList">
			<div v-for="(day, i) in dataWeek" :key="i" class="dateList-item">
				<div
					class="dateList-item-text"
					:class="{ isToday: day.getDay() === new Date().getDay() && !pdf }"
				>
					<p class="capitalize" :class="{ 'mb-1': !pdf, 'font-bold': pdf }">
						{{
							pdf
								? useDateFormat(day, 'dddd', { locales: 'es-ES' }).value
								: useDateFormat(day, 'ddd', { locales: 'es-ES' }).value
						}}
					</p>
					<p v-if="!pdf" class="font-robotoCondensed font-extrabold text-[2rem] leading-[1]">
						{{ useDateFormat(day, 'DD', { locales: 'es-ES' }).value }}
					</p>
				</div>
			</div>
		</div>
		<ScheduleStatusLoading v-if="pending" class="h-[280px]" />
		<!-- <ScheduleStatusError
			v-else-if="error || Boolean(errorService)"
			:text="
				errorService?.titulo || 'Lo sentimos, no pudimos cargar tu horario'
			"
		/>
		<ScheduleStatusNoData
			v-else-if="!states.dataStatus"
			:text="errorService?.titulo || 'No tienes cursos asignados esta semana'"
		/> -->
		<div v-else class="calendar-container">
			<!-- Hora de clases -->
			<div ref="listHours" class="hours-container relative">
				<div class="h-[10px] border-neutral"></div>
				<div
					v-for="(hour, i) in Object.keys(hours!).sort()"
					:key="hour"
					class="relative border-r-[1px] border-neutral"
					:class="{
						'h-[62px] lg:h-[72px]':
							i !== Object.keys(hours!).length - 1 && !pdf,
						'h-[48px]': i !== Object.keys(hours!).length - 1 && pdf,
					}"
				>
					<div
						class="leading-[1] text-xs absolute"
						:class="pdf ? 'top-[-15px]' : 'top-[-10px] lg:top-[-10px]'"
					>
						{{ hour === '24' ? '00' : hour }}:00
					</div>
				</div>
				<div class="lg:h-[5px]"></div>
			</div>
			<!-- Grilla de cursos -->
			<div class="calendar-grid relative">
				<div v-for="(item, ix) in states.fullWeek" :key="item" class="relative">
					<div class="absolute top-0 w-full h-full">
						<div class="h-[10px] border-b-[1px] border-neutral"></div>
						<!-- cuadros horas y marca de hora actual -->
						<ScheduleGridLayoutDesktop
							v-for="(hour, i) in Object.keys(hours!).sort()"
							:key="hour"
							:hours="hours"
							:hour="hour"
							:rowNumber="i"
							:columnNumber="ix"
							:nowMark="nowMark"
							:currentDay="currentDay"
							:pdf="pdf"
						/>
						<div class="lg:h-[5px]"></div>
					</div>
					<!-- card -->
					<template v-if="!item?.empty">
						<template v-for="(course, i) in item.detalleHorario" :key="i">
							<ScheduleCardContainer
								:course="course"
								:getTopAndHeight="getTopAndHeight"
								:positionX="ix"
								:pdf="pdf"
							/>
						</template>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.datesList {
	@apply ml-[40px] grid grid-cols-[repeat(7,_minmax(73px,_1fr))] mb-2 overflow-hidden;
}
.dateList-item {
	@apply flex flex-col lg:flex-row items-center justify-center;
}
.dateList-item-text {
	@apply flex flex-col text-sm text-center py-2;
}
.isToday {
	@apply bg-[#5dade2] w-full h-full rounded-lg;
}
.calendar-container {
	@apply relative grid grid-cols-[40px_1fr] w-full;
}
.hours-container {
	@apply mb-[25px] overflow-hidden;
}
.calendar-grid {
	@apply grid grid-cols-[repeat(7,_minmax(73px,_1fr))];
}
</style>
