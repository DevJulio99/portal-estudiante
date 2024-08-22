<script setup lang="ts">
const props = defineProps<{
	text: string;
	description?: string;
	icono?: string | null;
	defaultIcon?: string | null;
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
		<nuxt-icon
			v-else
			:name="defaultIcon || 'error'"
			class="text-[#4f6168] text-[24px]"
		/>
		<p
			class="text-xs md:text-sm font-bold text-center leading-[1] md:leading-[1.2] mt-2 mb-1"
		>
			{{ text }}
		</p>
		<p class="text-center text-xs md:text-sm leading-[1] md:leading-[1.2]">
			{{ description ?? 'Inténtalo de nuevo más tarde' }}
		</p>
	</div>
</template>
