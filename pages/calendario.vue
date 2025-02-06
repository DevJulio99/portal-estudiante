<script setup lang="ts">
import { type Calendar } from '~/domain/calendar/interfaces/service.interface';
import { type ErrorResponse } from '~/types/services.types';

definePageMeta({
	middleware: 'auth',
});

useHead({
	title: 'Calendario académico',
});

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Calendario académico', current: true, url: '' },
];

const { $api } = useNuxtApp();

const dataCalendar = ref<Calendar[]>([]);
const servicesError = ref<ErrorResponse | null>(null);

const { data, pending, error } = await $api.calendario.getCalendar(
	2025,
	{
		lazy: true,
	},
);
watch(data, (response) => {
	if (response?.data.length) {
		dataCalendar.value = response?.data;
	} else if (response?.error) {
		servicesError.value = response.error;
	} else {
		servicesError.value = {
			titulo: 'Lo sentimos, no pudimos cargar tu calendario académico',
			icono: '',
			descripcion: 'Inténtalo de nuevo más tarde',
		};
	}
});
</script>

<template>
	<BaseLayout bg-white :right-aside="false">
		<BaseBreadcrumbs :items="breadcrumbsItem" />
		<BaseTitle text="Calendario académico" />
		<div v-if="pending" class="w-full h-[240px] flex justify-center">
			<BaseStatusLoading />
		</div>
		<BaseStatusError
			v-else-if="error || servicesError"
			class="w-full h-[240px] md:h-[280px]"
			:text="
				servicesError?.titulo ??
				'Lo sentimos, no pudimos cargar tu calendario académico'
			"
			:description="servicesError?.descripcion"
			:icono="servicesError?.icono"
		/>
		<CalendarView
			v-else-if="dataCalendar.length"
			:data="dataCalendar"
		/>
	</BaseLayout>
</template>
