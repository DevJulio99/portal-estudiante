<script setup lang="ts">
defineProps<{
	text: string;
}>();
</script>
<template>
	<div
		class="h-[265px] flex flex-col justify-center items-center text-secondary"
	>
		<nuxt-icon name="clockNoData" class="text-secondary text-[24px]" />
		<p class="font-bold text-center leading-[1]">
			{{ text }}
		</p>
	</div>
</template>
