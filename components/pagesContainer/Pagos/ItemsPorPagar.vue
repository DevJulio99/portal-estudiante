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
	{ key: 'periodo', label: 'PERIODO' },
	{ key: 'saldo', label: 'SALDO' },
	{ key: 'mora', label: 'MORA' },
	{ key: 'totalAPagar', label: 'TOTAL A PAGAR' },
	{ key: 'estado', label: 'ESTADO' },
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

const SubirImagen = (idPago: number, estado?: string) => {
	// No permitir subir si está en revisión
	if (estado === 'En Revisión') {
		return;
	}
	pagoStore.setPago(idPago);
	toggleHiddenScroll();
	popupCaptcha.value = true;
}

const getEstadoBadgeClass = (estado?: string) => {
	if (!estado) return 'bg-gray-100 text-gray-800';
	switch (estado) {
		case 'En Revisión':
			return 'bg-yellow-100 text-yellow-800';
		case 'Rechazado':
			return 'bg-red-100 text-red-800';
		case 'Aprobado':
			return 'bg-green-100 text-green-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
}

const pagosRechazados = computed(() => {
	return pagoStore.lista.filter(p => p.estado === 'Rechazado' && p.observaciones);
});

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
		v-else-if="pagoStore.error || pagoStore.servicesError || !pagoStore.lista.length"
		class="flex items-center justify-center h-[240px] md:h-[380px]"
	>
		<BaseStatusError
			v-if="pagoStore.error"
			:text="'Lo sentimos, no pudimos cargar tus Obligaciones por pagar'"
			:description="'Inténtalo de nuevo más tarde'"
			:icono="null"
		/>
		<BaseStatusNoData
			v-else-if="pagoStore.servicesError"
			:text="
				pagoStore.servicesError?.titulo ??
				'Estamos trabajando en el detalle de este contenido'
			"
			:description="pagoStore.servicesError?.descripcion"
			:icono="pagoStore.servicesError?.icono"
		/>
		<BaseStatusNoData
			v-else
			:text="'No tienes obligaciones pendientes'"
			:description="'No se encontraron pagos por realizar'"
			:icono="null"
		/>
	</div>
	
	<div v-else>
		<BaseTable
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

			<template #cell-periodo="{ item }">
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

			<template #cell-estado="{ item }">
				<div class="flex justify-center">
					<span 
						:class="getEstadoBadgeClass(item.estado)"
						class="px-2 py-1 rounded-full text-xs font-semibold"
					>
						{{ item.estado || 'Pendiente' }}
					</span>
				</div>
			</template>

			<template #cell-subir="{ item }">
				<div class="flex justify-center">
					<div 
						v-if="item.estado === 'En Revisión'"
						class="p-2 bg-gray-300 rounded-lg cursor-not-allowed opacity-50"
						title="El comprobante ya fue enviado y está en revisión"
					>
						<nuxt-icon name="icon-upload" filled class="text-[18px] text-gray-500" />
					</div>
					<ImageUploader 
						v-else
						@click="() => SubirImagen(item.idPago, item.estado)"
					/>
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

		<!-- Mostrar observaciones de pagos rechazados -->
		<div 
			v-if="pagosRechazados.length > 0"
			class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"
		>
			<p class="text-sm font-semibold text-red-800 mb-2">Pagos Rechazados:</p>
			<div v-for="pago in pagosRechazados" :key="pago.idPago" class="mb-2">
				<p class="text-xs text-red-700">
					<strong>Documento {{ pago.documentoPago }}:</strong> {{ pago.observaciones }}
				</p>
			</div>
		</div>

		<div class="flex justify-between mt-7 items-center">
			<p class="mb-0 lg:text-[16px] text-[14px] font-extrabold">Monto total:</p>
			<span
				class="bg-gray text-dark_100 font-nunito py-2 px-8 font-extrabold lg:text-[16px] text-[14px]"
				:class="{ 'bg-white': montoTotalPagar == 0.0 }"
				>S/ {{ montoTotalPagar.toFixed(2) }}</span
			>
		</div>
	</div>
	
	<PagesContainerPagosPopupPaymentDetail
		v-if="popupDetalleVisible"
		:data="popupDetalleData"
		:closePopup="hidePopup"
	/>
	<PagesContainerPagosModalCaptcha 
		v-if="popupCaptcha" 
		@close="() => {
			toggleHiddenScroll();
			popupCaptcha = false
		}"
	/>
</template>

