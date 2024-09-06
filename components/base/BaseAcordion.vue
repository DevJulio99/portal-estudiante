<script setup lang="ts">
const props = defineProps<{
	title: string;
	className?: string;
}>();

const openActive = ref(false);

function handleAcordion() {
	openActive.value = !openActive.value;
	// if (window.dataLayer && openActive.value) {
	// 	window.dataLayer.push({
	// 		event: 'Click-VerMasDetalles',
	// 		page_url: `${window.location.href}`,
	// 		title: props.title,
	// 	});
	// }
}
</script>

<template>
	<div :class="className">
		<div
			role="button"
			class="w-full flex justify-between gap-4 md:gap-[26px] py-4 px-6 border border-disable bg-extra_gray hover:bg-gray_40 transition-colors"
			:class="openActive ? 'rounded-t-lg' : 'rounded-lg'"
			@click="handleAcordion"
		>
			<span
				class="text-sm md:text-base text-black font-extrabold font-telegraf"
			>
				{{ title }}
			</span>
			<NuxtIcon
				name="NavArrowDown"
				class="text-[20px] no-margin"
				:class="{ 'rotate-180': openActive }"
			/>
		</div>
		<div
			v-if="openActive"
			class="overflow-hidden rounded-b-lg border border-disable"
		>
			<slot></slot>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.fill-violet-60 {
	filter: brightness(0) saturate(100%) invert(10%) sepia(97%) saturate(6531%)
		hue-rotate(276deg) brightness(108%) contrast(117%);
}
</style>
