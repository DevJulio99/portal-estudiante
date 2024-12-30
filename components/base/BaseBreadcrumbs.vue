<script setup lang="ts">
interface Props {
	name: string;
	current: boolean;
	url: string;
}
const props = defineProps<{
	items: Props[];
	onSelectItem?: (title: string) => void;
}>();

const eventClick = (url: string, title: string) => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-Breadcrumbs',
	// 		page_url: `${window.location.href}`,
	// 		url,
	// 		title,
	// 	});
	// }
	props.onSelectItem && props.onSelectItem(title);
};
</script>

<template>
	<nav aria-label="Breadcrumbs">
		<ol class="flex items-center">
			<li v-for="item in items" :key="item.name" class="breadcrumbs-item flex">
				<span
					v-if="!item.current && !item.url"
					class="font-nunito text-sm md:text-base"
				>
					{{ item.name }}
				</span>
				<NuxtLink
					v-else-if="!item.current"
					class="nuxt-link"
					:to="item.url"
					@click="eventClick(item.url, item.name)"
				>
					{{ item.name }}
				</NuxtLink>
				<span v-else class="font-nunito font-extrabold text-sm md:text-base">
					{{ item.name }}
				</span>
			</li>
		</ol>
	</nav>
</template>

<style lang="postcss" scoped>
.nuxt-link {
	@apply hover:underline font-nunito;
}
.breadcrumbs-item:not(:last-child) {
	@apply after:content-[url(/assets/icons/chevronRightBlack.svg)] after:mx-[10px] md:after:mx-[24px] items-center;
}
</style>
