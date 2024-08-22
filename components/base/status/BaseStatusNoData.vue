<script setup lang="ts">
const props = defineProps<{
	text: string;
	description?: string;
	icono?: string | null;
}>();
const errIcono = props.icono?.trim();
</script>
<template>
	<div class="text-xs flex flex-col justify-center items-center text-secondary">
		<img
			v-if="errIcono"
			:src="errIcono"
			alt="icon-error"
			class="w-[24px] h-[24px]"
		/>
		<nuxt-icon v-else name="noDataIcon" class="text-[#4f6168] text-[24px]" />
		<p class="text-xs md:text-sm font-bold text-center leading-[1] mt-2">
			{{ text }}
		</p>
		<p v-if="description" class="text-xs md:text-sm">
			{{ description ?? 'Inténtalo de nuevo más tarde' }}
		</p>
	</div>
</template>
