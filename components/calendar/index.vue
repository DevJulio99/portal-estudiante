<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import CardCalendar from '../card/CardCalendar.vue';
import { eventsDates, defineText } from '~/utils/calendar/vCalendarStyles';
import { type Calendar } from '~/domain/calendar/interfaces/service.interface';
import { EventStatus } from '~/domain/calendar/enums';
import { CardStyle } from '~/domain/calendar/enums/styleCard';


const props = defineProps<{
	data: Calendar[];
}>();

const attrsData: any = [];
const isLargeScreen = useMediaQuery('(min-width: 1024px)');
const currentMonth = useDateFormat(new Date(), 'YYYY-MM').value;
const eventsList = ref<Calendar[]>([]);
const showMore = ref(false);

const defineList = (month: string) => {
	if (props.data.length) {
		const arrCeremony: Calendar[] = [];
		const arrOfMonth = props.data.filter((item) => {
			if (
				item.fechaInicio.slice(0, 7) === month &&
				item.tipoActividad === EventStatus.CEREMONY
			)
				arrCeremony.push(item);
			return (
				item.fechaInicio.slice(0, 7) === month &&
				item.tipoActividad !== EventStatus.CEREMONY
			);
		});
		eventsList.value = arrOfMonth.concat(arrCeremony);
	}
};

if (props.data.length) {
	props.data.forEach((item) => {
		const result =
			eventsDates(
				item.tipoActividad,
				item.fechaInicio,
				item.fechaFin,
				item.now,
			) || [];
		if (result?.length >= 1 && item.tipoActividad === EventStatus.HOLIDAY) {
			attrsData.push(...result);
		} else if (
			result?.length >= 1 &&
			item.tipoActividad !== EventStatus.HOLIDAY
		) {
			attrsData.unshift(...result);
		}
	});
}
const attrs = ref([
	{
		highlight: {
			color: 'yellow',
			fillMode: 'solid',
		},
		dates: new Date(),
	},
	...attrsData,
]);
const showList = (e: { id: string }[]) => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/CambiarMes-Calendario',
	// 		page_url: `${window.location.href}`,
	// 	});
	// }
	defineList(e[0].id);
};
const showMoreEvent = () => {
	// if (window.dataLayer && !showMore.value) {
	// 	window.dataLayer.push({
	// 		event: 'Click/VerMás-Calendario',
	// 		page_url: `${window.location.href}`,
	// 	});
	// }
	showMore.value = !showMore.value;
};
const styles = {
	[EventStatus.ACADEMIC]: CardStyle.default,
	[EventStatus.HOLIDAY]: CardStyle.secondary,
	[EventStatus.CEREMONY]: CardStyle.dark,
};

onMounted(() => {
	defineList(currentMonth);
});
</script>

<template>
	<div class="-mb-4">
		<client-only>
			<VCalendar
				borderless
				:locale="{
					id: 'es',
					firstDayOfWeek: 2,
					masks: { weekdays: isLargeScreen ? 'WW' : 'WWW' },
				}"
				class="v-calendar-style"
				:attributes="attrs"
				@did-move="showList"
			/>
		</client-only>
		<div v-if="eventsList.length">
			<CardCalendar
				v-for="(item, i) in eventsList.slice(0, 3)"
				:key="i"
				:title="item.actividad"
				:style="styles[item.tipoActividad as keyof typeof styles]"
				:icon="
					item.tipoActividad === EventStatus.CEREMONY
						? 'birreteIcon'
						: item.tipoActividad === EventStatus.HOLIDAY
							? 'calendarIcon'
							: 'calendarDateIcon'
				"
				:description="
					defineText(item.fechaInicio, item.fechaFin, item.tipoActividad)
				"
			/>
		</div>
		<div v-if="eventsList.length > 3" class="flex flex-col items-center">
			<template v-if="showMore">
				<CardCalendar
					v-for="(item, i) in eventsList.slice(3)"
					:key="i"
					:title="item.actividad"
					:style="styles[item.tipoActividad as keyof typeof styles]"
					:icon="
						item.tipoActividad === EventStatus.CEREMONY
							? 'birreteIcon'
							: item.tipoActividad === EventStatus.HOLIDAY
								? 'calendarIcon'
								: 'calendarDateIcon'
					"
					:description="
						defineText(item.fechaInicio, item.fechaFin, item.tipoActividad)
					"
					class="w-full"
				/>
			</template>
			<button
				class="underline decoration-1 mb-4 text-blue_light text-sm"
				@click="showMoreEvent"
			>
				Ver
				<template v-if="!showMore">
					<span class="font-bold">
						{{
							String(eventsList.length - 3).length === 1
								? `0${eventsList.length - 3}`
								: eventsList.length - 3
						}}
					</span>
					más
				</template>
				<template v-else> menos </template>
			</button>
		</div>
	</div>
</template>

<style lang="postcss">
.vc-blue {
	--vc-accent-200: #e4f2ff;
	--vc-accent-600: #00b9ff;
	--vc-accent-900: #0072ab;
}
.vc-yellow {
	--vc-accent-600: #fdba30;
}
.vc-pink {
	--vc-accent-200: #ffe6fb;
	--vc-accent-600: #d900b9;
	--vc-accent-900: #d900b9;
}
.v-calendar-style {
	@apply w-full mb-4 font-telegraf;
}
.v-calendar-style .vc-pane {
	@apply min-w-full;
}
.v-calendar-style .vc-header {
	@apply mb-2 px-0;
}
.v-calendar-style .vc-header span {
	@apply mt-[2px];
}
.v-calendar-style .vc-title-wrapper span {
	@apply text-sm uppercase text-gray_80;
}
.v-calendar-style .vc-base-icon {
	@apply text-primary;
}
.v-calendar-style .vc-weeks {
	@apply p-0 min-w-full;
}
.v-calendar-style .vc-weekday {
	@apply text-black capitalize text-xs font-bold;
}
.v-calendar-style.vc-monthly .is-not-in-month * {
	@apply opacity-100 text-gray_80;
}
.v-calendar-style.vc-monthly .is-not-in-month .vc-highlight {
	@apply bg-transparent;
}
.v-calendar-style.vc-monthly .is-not-in-month .vc-bar,
.v-calendar-style.vc-monthly .is-not-in-month .vc-dot {
	@apply !bg-[#808080];
}
.v-calendar-style .vc-highlight-content-light {
	@apply font-[500];
}
.v-calendar-style .vc-highlight.vc-highlight-base-start,
.v-calendar-style .vc-highlight.vc-highlight-base-end {
	@apply bg-transparent;
}
.v-calendar-style .vc-highlight {
	@apply w-[24px] h-[24px];
}
.v-calendar-style .vc-highlight.vc-highlight-base-middle {
	@apply !rounded-full;
}
.v-calendar-style .is-today .vc-yellow {
	@apply text-black;
}
.vc-day-content {
	@apply text-xs;
}
.vc-day-content:hover {
	@apply bg-transparent;
}
.v-calendar-style .vc-bars {
	@apply -rotate-45 -translate-y-4 w-[30px];
}
.v-calendar-style .vc-focus {
	@apply focus-within:shadow-none cursor-default;
}
.v-calendar-style .vc-bars .vc-bar {
	@apply h-[1px];
}
.v-calendar-style .vc-dots .vc-dot {
	@apply w-[4px] h-[4px];
}
.v-calendar-style .vc-dots .vc-blue:not(:only-child) {
	@apply bg-[#d900b9];
}
.v-calendar-style .is-today .vc-bars .vc-bar:first-child:not(:only-child) {
	@apply !bg-[#E6F2F4];
}
.v-calendar-style .vc-dots .vc-blue + .vc-pink {
	@apply bg-[#00b9ff];
}
.v-calendar-style .is-today .vc-pink {
	@apply text-white;
}
.v-calendar-style .is-today .vc-pink .vc-highlight {
	@apply bg-[#d900b9];
}
.v-calendar-style .is-today .vc-pink .vc-highlight-base-end,
.v-calendar-style .is-today .vc-pink .vc-highlight-base-start {
	@apply bg-transparent;
}
.v-calendar-style .is-today .vc-bars .vc-bar {
	@apply !bg-[#FFE6FB];
}
</style>
