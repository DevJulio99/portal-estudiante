<script setup lang="ts">
defineProps<{
	text: string;
}>();
</script>
<template>
	<div
		class="h-[265px] flex flex-col justify-center items-center text-dark_100"
	>
		<nuxt-icon name="noDataIcon" class="text-dark_100 text-[24px]" />
		<p class="text-xs md:text-sm font-bold text-center leading-[1] mt-2">
			{{ text }}
		</p>
	</div>
</template>
