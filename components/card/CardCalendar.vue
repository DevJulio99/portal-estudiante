<script lang="ts" setup>
import { CardStyle } from '~/types/helper.types';

withDefaults(
	defineProps<{
		title: string;
		icon: string;
		description: string;
		style?: CardStyle;
	}>(),
	{
		style: CardStyle.default,
	},
);
</script>
<template>
	<div
		class="border rounded mb-4 font-telegraf py-2 px-4"
		:class="{
			'text-[#065074] bg-[#e4f2ff] border-[#00B9FF]':
				style === CardStyle.default,
			'text-[#B5009B] bg-[#ffe6fb] border-[#FF00DA]':
				style === CardStyle.secondary,
			'text-white bg-black': style === CardStyle.dark,
		}"
	>
		<h3 class="font-bold leading-[1] text-sm mb-1">{{ title }}</h3>
		<div class="text-sm">
			<p class="flex item-center gap-x-[3px]">
				<nuxt-icon class="mt-[1.5px]" :name="icon" />
				{{ description }}
			</p>
		</div>
	</div>
</template>
