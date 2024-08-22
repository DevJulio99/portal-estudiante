<script setup lang="ts">
const props = defineProps<{
	text: string;
	description?: string;
	icono?: string | null;
	styleIcon?: string;
}>();

const icon = props.icono?.trim();
</script>
<template>
	<div
		class="h-[265px] flex flex-col justify-center items-center text-secondary"
	>
		<nuxt-icon
			v-if="!icon"
			name="error"
			class="text-secondary text-[24px] mb-2"
			:class="styleIcon"
		/>
		<img
			v-if="icon"
			:src="icon"
			alt="icon-error"
			class="w-[24px] h-[24px] mb-2"
			:class="styleIcon"
		/>
		<p class="text-xs md:text-sm font-bold text-center leading-[1]">
			{{ text }}
		</p>
		<p class="text-xs md:text-sm">
			{{ description ?? 'Inténtalo de nuevo más tarde' }}
		</p>
	</div>
</template>
