<script setup lang="ts">
import { type RangeWeek, type WeekDates } from '~/types/schedule.types';
import { getWeekDates } from '~/utils/schedule';

const props = defineProps<{
	activeWeek: string;
	pending: boolean;
	onActionWeek: (range: RangeWeek) => void;
}>();
const weekDate = getWeekDates();

const startDate = ref<string>(
	`${useDateFormat(weekDate.Monday, 'YYYY-MM-DD').value}`,
);
const endDate = ref<string>(
	`${useDateFormat(weekDate.Sunday, 'YYYY-MM-DD').value}`,
);
const initRangeWeek = ref<Date>(new Date());

const setDataRange = (date: Date) => {
	return `${useDateFormat(date, 'YYYY-MM-DD').value}`;
};

const actionWeek = (action: number) => {
	const day = initRangeWeek.value.getDay();
	const numberDay = initRangeWeek.value.getDate();
	const monthInit = initRangeWeek.value.getMonth();
	const yearInit = initRangeWeek.value.getFullYear();
	let weekData: WeekDates;

	if (action) {
		initRangeWeek.value = new Date(yearInit, monthInit, numberDay + (8 - day));
		const weekDate_ = getWeekDates(initRangeWeek.value);
		weekData = weekDate_;
		startDate.value = setDataRange(weekDate_.Monday);
		endDate.value = setDataRange(weekDate_.Sunday);
	} else {
		initRangeWeek.value = new Date(yearInit, monthInit, numberDay - (6 + day));
		const weekDate_ = getWeekDates(initRangeWeek.value);
		weekData = weekDate_;
		startDate.value = setDataRange(weekDate_.Monday);
		endDate.value = setDataRange(weekDate_.Sunday);
	}
	props.onActionWeek({
		init: `${startDate.value}T00:00:00Z`,
		end: `${endDate.value}T00:00:00Z`,
		weekDates: weekData,
	});
};
</script>
<template>
	<div class="col-span-2 flex items-center justify-center gap-2">
		<!-- <button
			aria-label="Icon left"
			class="xl:px-2 pr-1"
			:disabled="day <= 0 || active"
			:class="day <= 0 || active ? 'text-transparent' : 'text-neutral'"
			@click="handleChange(-1)"
		>
			<nuxt-icon filled class="text-[14px] text-white" name="left" />
		</button> -->
		<nuxt-icon
			filled
			:class="`text-2xl cursor-pointer ${
				pending ? 'cursor-not-allowed pointer-events-none' : ''
			}`"
			name="upn-icon-nav-arrow-white-left"
			:onclick="() => actionWeek(0)"
		/>
		<span class="font-bold text-sm text-white text-center uppercase">
			{{
				`${
					useDateFormat(startDate, 'DD MMMM', {
						locales: 'es-ES',
					}).value
				} - ${
					useDateFormat(endDate, 'DD MMMM', {
						locales: 'es-ES',
					}).value
				}`
			}}
		</span>
		<nuxt-icon
			filled
			:class="`text-2xl cursor-pointer ${
				pending ? 'cursor-not-allowed pointer-events-none' : ''
			}`"
			name="upn-icon-nav-arrow-white-right"
			:onclick="() => actionWeek(1)"
		/>
		<!-- <button
			aria-label="Icon right"
			class="xl:px-2 pl-1"
			:disabled="day >= courses.length - 1 || active"
			:class="
				day >= courses.length - 1 || active
					? 'text-transparent'
					: 'text-neutral'
			"
			@click="handleChange(1)"
		>
			<nuxt-icon filled class="text-[14px] text-white" name="right" />
		</button> -->
	</div>
</template>
