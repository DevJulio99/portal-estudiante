<script setup lang="ts">
withDefaults(
	defineProps<{
		activeTab?: string;
	}>(),
	{
		activeTab: 'por-pagar',
	},
);

const eventClick = (url: string, title: string) => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-Tabs',
	// 		page_url: `${window.location.href}`,
	// 		url,
	// 		title,
	// 	});
	// }
};
</script>

<template>
	<div class="flex justify-center mt-4 mb-6 lg:mb-8">
		<nuxt-link
			to="/obligaciones-por-pagar"
			class="box"
			:class="{
				'bg-celestial_white': activeTab !== 'por-pagar',
				'bg-black text-white': activeTab === 'por-pagar',
			}"
			@click="eventClick('/obligaciones-por-pagar', 'Obligaciones por pagar')"
		>
			Obligaciones por pagar
		</nuxt-link>
		<nuxt-link
			to="/obligaciones-pagadas"
			class="box"
			:class="{
				'bg-celestial_white': activeTab !== 'pagadas',
				'bg-black text-white': activeTab === 'pagadas',
			}"
			@click="eventClick('/obligaciones-pagadas', 'Obligaciones pagadas')"
		>
			Obligaciones pagadas
		</nuxt-link>
	</div>
</template>

<style lang="postcss" scoped>
.box {
	@apply cursor-pointer leading-[1] text-xs md:text-base py-2 md:py-4 px-5 md:px-[42px] min-w-[104px] md:min-w-[141px] flex justify-center items-center text-center font-extrabold;
}
</style>
