<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import ImageUploader from '~/components/base/ImageUploader.vue';
import BaseTable from '~/components/base/BaseTable.vue';
import type { PagosPendientesData } from '~/types/pagos.types';
import type { ErrorResponse } from '~/types/services.types';

const isMediumScreen = useMediaQuery('(min-width: 768px)');

const popupDetalleData = ref();
const popupDetalleVisible = ref(false);
const popupCaptcha = ref(false);
const pagoStore = usePagoStore();
const imageLoaderStore = useImageLoaderStore();

const columns = [
	{ key: 'documentoPago', label: 'N° DOCUMENTO' },
	{ key: 'fechaVencimiento', label: 'F. VENCIMIENTO' },
	{ key: 'ciclo', label: 'CICLO' },
	{ key: 'saldo', label: 'SALDO' },
	{ key: 'mora', label: 'MORA' },
	{ key: 'totalAPagar', label: 'TOTAL A PAGAR' },
	{ key: 'subir', label: 'SUBIR' },
	{ key: 'detalle', label: 'DETALLE', isAction: true }
];

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

const SubirImagen = (idPago: number) => {
	pagoStore.setPago(idPago);
	toggleHiddenScroll();
	popupCaptcha.value = true;
}

const montoTotalPagar = computed(() => {
  return pagoStore.lista.reduce((total, item) => {
    return total + (item.totalAPagar || 0);
  }, 0);
});

onMounted(() => {
	// Asumiendo que tienes una acción en tu store para cargar los pagos.
	// Esto centraliza la lógica de fetching.
	if(!pagoStore.lista.length) {
		console.log('listarPagos:');
		pagoStore.listarPagosPendientes();
	}
	imageLoaderStore.enabledButton = false;
})
</script>
<template aria-label="TableItemsPorPagar">
	<div
		v-if="pagoStore.pending"
		class="w-full h-[200px] md:h-[350px] flex justify-center"
	>
		<BaseStatusLoading />
	</div>
	<div
		v-else-if="pagoStore.error"
		class="flex items-center justify-center h-[240px] md:h-[380px]"
	>
		<BaseStatusError
			:text="'Lo sentimos, no pudimos cargar tus Obligaciones por pagar'"
			:description="'Inténtalo de nuevo más tarde'"
			:icono="null"
		/>
	</div>
	<div
		v-else-if="pagoStore.servicesError"
		class="flex items-center justify-center h-[240px] md:h-[380px]"
	>
		<BaseStatusNoData
			:text="
				pagoStore.servicesError?.titulo ??
				'Estamos trabajando en el detalle de este contenido'
			"
			:description="pagoStore.servicesError?.descripcion"
			:icono="pagoStore.servicesError?.icono"
		/>
	</div>
	<BaseTable
		v-if="!pagoStore.pending"
		:columns="columns"
		:data="pagoStore.lista"
		:loading="false"
		:show-pagination="false"
		:show-info-action="false"
		:show-edit-action="false"
		:show-delete-action="false"
		row-key="idPago"
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

		<template #cell-subir="{ item }">
			<div class="flex justify-center">
				<ImageUploader @click="() => SubirImagen(item.idPago)"/>
			</div>
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

	<div v-if="!pagoStore.pending && pagoStore.lista.length > 0" class="flex justify-between mt-7 items-center">
		<p class="mb-0 lg:text-[16px] text-[14px] font-extrabold">Monto total:</p>
		<span
			class="bg-gray text-dark_100 font-nunito py-2 px-8 font-extrabold lg:text-[16px] text-[14px]"
			:class="{ 'bg-white': montoTotalPagar == 0.0 }"
			>S/ {{ montoTotalPagar.toFixed(2) }}</span
		>
	</div>
	<PagesContainerPagosPopupPaymentDetail
		v-if="popupDetalleVisible"
		:data="popupDetalleData"
		:closePopup="hidePopup"
	/>
	<PagesContainerPagosModalCaptcha v-if="popupCaptcha" @close="() => {
		toggleHiddenScroll();
		popupCaptcha = false
	}"/>
</template>

