<script lang="ts" setup>
export interface Props {
	url?: string;
	icon?: string;
	title?: string;
	width?: string;
	marginTitle?: string;
	event?: string;
}

withDefaults(defineProps<Props>(), {
	url: '/',
	icon: 'iconSearch',
	title: 'Título',
	width: 'w-full',
	marginTitle: 'mb-6',
	event: 'Click-Dashboard',
});
</script>

<template>
	<div class="card-home" :class="width">
		<div class="card-title" :class="marginTitle">
			<div class="flex justify-between items-start mb-1">
				<nuxt-icon class="text-[24px]" filled :name="icon" />
				<h2 class="font-grotesk font-bold ml-2 text-xl">{{ title }}</h2>
			</div>
			<nuxt-link
				class="flex items-center"
				:to="url"
			>
				<span class="link-text font-bold text-sm text-[#4F6168]">Ver todo</span>
				<nuxt-icon name="Nav-Arrow-right-lg" class="text-[28px]" filled />
			</nuxt-link>
		</div>
		<slot></slot>
	</div>
</template>

<style lang="postcss" scoped>
.card-home {
	@apply bg-white rounded-lg p-6;
}

.card-title {
	@apply flex justify-between border-b-[1px] border-b-[#D9D9D9];
}
</style>
