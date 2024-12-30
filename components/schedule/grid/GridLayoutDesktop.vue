<script setup lang="ts">
import { getHourMinutes } from '~/utils/schedule';

const props = withDefaults(
	defineProps<{
		hours: { [key: string]: number };
		hour: string;
		nowMark: Date;
		rowNumber: number;
		columnNumber: number;
		currentDay: number;
		pdf: boolean;
	}>(),
	{
		hour: '55',
		rowNumber: 0,
		columnNumber: 0,
		currentDay: 1,
	},
);
const currentHour = computed(() =>
	props.nowMark.getHours() < 7 ? 7 : props.nowMark.getHours(),
);
const positionFromTop = computed(() =>
	props.nowMark.getHours() < 7
		? '-1px'
		: `${(72 / 60) * props.nowMark.getMinutes() - 1}px`,
);
</script>

<template>
	<div
		v-if="rowNumber !== Object.keys(hours!).length - 1"
		class="grid-box relative"
		:class="pdf ? 'h-[48px]' : 'h-[72px]'"
	>
		<div
			v-if="columnNumber === 0 && Number(hour) === currentHour && !pdf"
			class="hour-mark top-[10px]"
			:style="{
				top: positionFromTop,
			}"
		>
			{{ getHourMinutes(props.nowMark) }}
		</div>
		<div
			v-if="Number(hour) === currentHour && !pdf"
			class="absolute top-[10px] h-[1px] w-full z-[15]"
			:class="{
				'bg-[#d0ece7]': columnNumber !== currentDay,
				'mark-today': columnNumber === currentDay,
			}"
			:style="{
				top: positionFromTop,
			}"
		></div>
	</div>
</template>

<style lang="postcss" scoped>
.grid-box {
	@apply border-r-[1px] border-b-[1px] border-neutral;
}

.hour-mark {
	@apply absolute right-[calc(100%_+_1px)] z-20 translate-y-[-50%] bg-[#d0ece7] text-[#287f6b] rounded-sm px-1 py-[1px] text-xs font-bold;
}

.mark-today {
	@apply bg-[#287f6b] after:content-[''] after:absolute after:h-[5px] after:w-[5px]
	after:rounded after:bg-[#287f6b] after:top-0 after:translate-y-[-2px];
}
</style>
