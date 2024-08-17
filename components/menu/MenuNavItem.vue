<script setup lang="ts">
defineProps<{
	name: string;
	icon: string;
	isOpen: boolean;
	lg: boolean;
}>();
</script>
<template>
	<img :src="icon" alt="" class="pr-1 w-[25px] h-[25px]" />
	<span class="text-styles">
		{{ name }}
	</span>
	<nuxt-icon
		name="NavArrowDown"
		class="ml-auto text-[18px] no-margin"
		:class="{ 'lg:hidden': lg, 'md:hidden': !lg, 'rotate-180': isOpen }"
	/>
</template>

<style lang="postcss" scoped>
.text-styles {
	@apply leading-[1] font-telegraf font-bold capitalize text-[14px];
}
</style>
