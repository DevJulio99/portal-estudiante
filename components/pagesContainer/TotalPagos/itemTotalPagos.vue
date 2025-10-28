<script setup lang="ts">
import BaseTable from '~/components/base/BaseTable.vue';
import type { PagosPendientesData } from '~/types/pagos.types';

useHead({
  title: "Total Pagos",
});

const tokenStore = useTokenStore();
const { $api } = useNuxtApp();
const servicesError: Ref<any> = ref(null);
const listaPagosPendientes = ref<PagosPendientesData[]>([]);
const popupDetalleData = ref();
const popupDetalleVisible = ref(false);
const isMediumScreen = useMediaQuery("(min-width: 768px)");
const pagoStore = usePagoStore();

const columns = [
	{ key: 'documentoPago', label: 'N° DOCUMENTO' },
	{ key: 'fechaVencimiento', label: 'F. VENCIMIENTO' },
	{ key: 'ciclo', label: 'CICLO' },
	{ key: 'saldo', label: 'SALDO' },
	{ key: 'mora', label: 'MORA' },
	{ key: 'totalAPagar', label: 'TOTAL A PAGAR' },
	{ key: 'detalle', label: 'DETALLE', isAction: true }
];

const paginationData = computed(() => ({
	total: pagoStore.total,
	currentPage: pagoStore.paginado.pagina,
	itemsPerPage: pagoStore.paginado.itemsPorPagina
}));

const showPopup = (datos: object) => {
	popupDetalleData.value = datos;
	popupDetalleVisible.value = true;
};

const hidePopup = () => {
	popupDetalleVisible.value = false;
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.remove('overflow-hidden');
};

const dateIsExpired = (strFechaDoc: string) => {
	const partesFecha = strFechaDoc.split('/');
	const dia = parseInt(partesFecha[0], 10);
	const mes = parseInt(partesFecha[1], 10) - 1;
	const anio = parseInt(partesFecha[2], 10);
	const fechaDocumento = new Date(anio, mes, dia);
	const fechaActual = new Date();
	return fechaDocumento < fechaActual;
};

const handlePage = (number: number) => {
	if(pagoStore.paginado.pagina !== number){
		pagoStore.paginado.pagina = number;
	    pagoStore.listarPagos();
	}
};
</script>

<template>
  <div
    v-if="pagoStore.pending"
    class="w-full h-[200px] md:h-[350px] flex justify-center"
  >
    <BaseStatusLoading />
  </div>
  <!-- <div
    v-else-if="errorPagos"
    class="flex items-center justify-center h-[240px] md:h-[380px]"
  >
    <BaseStatusError
      :text="'Lo sentimos, no pudimos cargar tus Obligaciones por pagar'"
      :description="'Inténtalo de nuevo más tarde'"
      :icono="null"
    />
  </div> -->
  <div
    v-else-if="servicesError"
    class="flex items-center justify-center h-[240px] md:h-[380px]"
  >
    <BaseStatusNoData
      :text="
        servicesError?.titulo ??
        'Estamos trabajando en el detalle de este contenido'
      "
      :description="servicesError?.descripcion"
      :icono="servicesError?.icono"
    />
  </div>
  <div v-if="!pagoStore.pending && !pagoStore.lista.length" class="w-full py-10 text-xl font-bold text-center">No se encontro datos</div>
  
  <BaseTable
		v-if="!pagoStore.pending"
		:columns="columns"
		:data="pagoStore.lista"
		:loading="false"
		:show-pagination="pagoStore.lista.length > 0"
		:pagination-data="paginationData"
		:show-info-action="false"
		:show-edit-action="false"
		:show-delete-action="false"
		row-key="idPago"
		@page-change="handlePage"
	>
		<template #cell-documentoPago="{ item }">
			{{ item.documentoPago != '' ? item.documentoPago : '-' }}
		</template>

		<template #cell-fechaVencimiento="{ item }">
			<span
				:class="{
					'text-red-600 font-semibold': dateIsExpired(item.fechaVencimiento),
				}"
			>
				{{ useDateFormat(item.fechaVencimiento, 'DD/MM/YYYY', { locales: 'es-ES' }) }}
			</span>
		</template>

		<template #cell-ciclo="{ item }">
			{{ item.ciclo }}
		</template>

		<template #cell-saldo="{ item }">
			S/ {{ (item.totalAPagar - item.mora).toFixed(2) }}
		</template>

		<template #cell-mora="{ item }">
			S/ {{ item.mora.toFixed(2) }}
		</template>

		<template #cell-totalAPagar="{ item }">
			<strong>S/ {{ item.totalAPagar.toFixed(2) }}</strong>
		</template>

		<template #custom-actions="{ item }">
			<div class="flex gap-[9px] items-center justify-center">
				<nuxt-icon
					name="iconEye"
					filled
					class="text-[21px] cursor-pointer"
					@click="
						showPopup({
							...item,
							isExpired: dateIsExpired(item.fechaVencimiento),
						})
					"
				/>
			</div>
		</template>
	</BaseTable>
  <PagesContainerPagosPopupPaymentDetail
		v-if="popupDetalleVisible"
		:data="popupDetalleData"
		:closePopup="hidePopup"
	/>
</template>