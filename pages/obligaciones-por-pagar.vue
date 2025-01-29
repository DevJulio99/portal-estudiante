<script setup>
useHead({
	title: 'Obligaciones por pagar',
});

definePageMeta({
  middleware: "auth",
});

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Pagos', current: false, url: '' },
	{ name: 'Obligaciones por pagar', current: true, url: '' },
];
</script>

<template>
	<BaseLayout :rightAside="false" class="relative" bgWhite>
		<BaseBreadcrumbs :items="breadcrumbsItem" />
		<BaseTabPayments activeTab="por-pagar" />
		<div class="flex items-center gap-2">
			<BaseTitle text="Obligaciones por pagar" />
			<nuxt-icon name="clockPagos" filled class="text-[21px] cursor-pointer" />
		</div>
		<PagesContainerPagosItemsPorPagar />
	</BaseLayout>
</template>
