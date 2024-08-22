<script setup lang="ts">
import { TagStyle } from '~/types/helper.types';
withDefaults(
	defineProps<{
		title: string;
		color?: TagStyle;
		url?: string;
	}>(),
	{
		color: TagStyle.default,
		url: '',
	},
);
const eventClick = (url: string, title: string) => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-Tag',
	// 		page_url: `${window.location.href}`,
	// 		url,
	// 		title,
	// 	});
	// }
};
</script>

<template>
	<nuxt-link
		v-if="url"
		:to="url"
		class="max-w-full inline-block truncate font-whitney font-bold rounded-full h-[20px] uppercase text-[.625rem] px-2 leading-[20px] tracking-[0.4px]"
		:class="{
			'bg-[#0072AB] text-white': color === TagStyle.default,
			'bg-[#E4F2FF] text-[#0072AB] font-bold': color === TagStyle.light,
			'bg-celestial_white text-neutral font-bold': color === TagStyle.neutral,
			'bg-violet_20 text-violet_100 font-bold': color === TagStyle.violet,
		}"
		@click="eventClick(url, title)"
	>
		{{ title }}
	</nuxt-link>
	<span
		v-else
		class="max-w-full inline-block truncate font-whitney font-bold rounded-full h-[20px] uppercase text-[.625rem] px-2 leading-[20px] tracking-[0.4px]"
		:class="{
			'bg-[#0072AB] text-white': color === TagStyle.default,
			'bg-[#E4F2FF] text-[#0072AB] font-bold': color === TagStyle.light,
			'bg-celestial_white text-neutral font-bold': color === TagStyle.neutral,
			'bg-violet_20 text-violet_100 font-bold': color === TagStyle.violet,
		}"
	>
		{{ title }}
	</span>
</template>
