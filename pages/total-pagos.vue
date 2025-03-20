<script setup>
import ItemTotalPagos from '~/components/pagesContainer/TotalPagos/itemTotalPagos.vue';

useHead({
	title: 'Total Pagos',
});

definePageMeta({
  middleware: "auth",
});

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Total Pagos', current: true, url: '' },
];

const pagoStore = usePagoStore();

onMounted(() => {
	pagoStore.listarPagos();
})

onBeforeUnmount(() => {
	pagoStore.resetPagos();
})
</script>

<template>
	<BaseLayout :rightAside="false" class="relative" bgWhite>
		<BaseBreadcrumbs :items="breadcrumbsItem" />
		<div class="flex items-center gap-2">
			<BaseTitle text="Todos los Pagos" />
			<nuxt-icon name="clockPagos" filled class="text-[21px] cursor-pointer" />
		</div>
		<ItemTotalPagos />
	</BaseLayout>
</template>
