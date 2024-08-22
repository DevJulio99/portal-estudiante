<script setup lang="ts">
withDefaults(
	defineProps<{
		activeTab?: string;
	}>(),
	{
		activeTab: 'cursos',
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
	<div class="flex justify-center mt-4 mb-6 lg:mb-10">
		<nuxt-link
			to="/notas"
			class="box"
			:class="{
				'bg-celestial_white': activeTab !== 'cursos',
				'bg-black text-white': activeTab === 'cursos',
			}"
			@click="eventClick('/notas', 'Cursos y Notas')"
		>
			Cursos y Notas
		</nuxt-link>
		<nuxt-link
			to="/horarios"
			class="box"
			:class="{
				'bg-celestial_white': activeTab !== 'horario',
				'bg-black text-white': activeTab === 'horario',
			}"
			@click="eventClick('/horario', 'Horario Semanal')"
		>
			Horario Semanal
		</nuxt-link>
		<a
			href="https://upn.blackboard.com/auth-saml/saml/login?apId=_111_1&redirectUrl=https%3A%2F%2Fupn.blackboard.com%2Fultra"
			class="box"
			:class="{
				'bg-celestial_white': activeTab !== 'aulaVirtual',
				'bg-black text-white': activeTab === 'aulaVirtual',
			}"
			target="_blank"
			@click="eventClick('https://upn.blackboard.com/', 'Aula Virtual')"
		>
			Aula Virtual
		</a>
	</div>
</template>

<style lang="postcss" scoped>
.box {
	@apply cursor-pointer leading-[1] text-xs md:text-base py-2 md:py-4 px-4 md:px-[42px] min-w-[104px] md:min-w-[141px] flex justify-center items-center text-center font-extrabold;
}
</style>
