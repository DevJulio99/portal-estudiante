<script setup>
import NotasView from '~/components/pagesContainer/Notas/NotasView.vue';


useHead({
	title: 'Cursos y notas',
});
</script>

<template>
	<BaseLayout bgWhite styles-main="lg:!px-6">
		<NotasView />
	</BaseLayout>
</template>
