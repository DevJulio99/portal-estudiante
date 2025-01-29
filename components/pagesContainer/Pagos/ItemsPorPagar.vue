<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import type { PagosPendientesData } from '~/types/pagos.types';

const { $api } = useNuxtApp();

const isMediumScreen = useMediaQuery('(min-width: 768px)');

const listaPagosPendientes = ref<PagosPendientesData[]>([]);
const popupDetalleData = ref();
const popupDetalleVisible = ref(false);
const servicesError: Ref<any> = ref(null);
// const loadingPagos = ref(true);
const tokenStore = useTokenStore();

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

const montoTotalPagar = computed(() => {
  return listaPagosPendientes.value.reduce((total, item) => {
    return total + (item.totalAPagar || 0);
  }, 0);
});

const {
	data: dataPagos,
	error: errorPagos,
	pending: loadingPagos,
} = await $api.pagos.getPagosPendientes(parseInt(tokenStore.getDataToken.Id), new Date().getFullYear(), {
	lazy: true,
});

watch(dataPagos, (response) => {
	if (response?.data?.length) {
		listaPagosPendientes.value = response?.data;
	} else if (response?.error) {
		servicesError.value = response.error;
	}
});
</script>
<template aria-label="TableItemsPorPagar">
	<div
		v-if="loadingPagos"
		class="w-full h-[200px] md:h-[350px] flex justify-center"
	>
		<BaseStatusLoading />
	</div>
	<div
		v-else-if="errorPagos"
		class="flex items-center justify-center h-[240px] md:h-[380px]"
	>
		<BaseStatusError
			:text="'Lo sentimos, no pudimos cargar tus Obligaciones por pagar'"
			:description="'Inténtalo de nuevo más tarde'"
			:icono="null"
		/>
	</div>
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
	<div
		v-if="!loadingPagos && listaPagosPendientes.length > 0"
		class="w-full"
	>
		<div v-if="isMediumScreen" class="mb-3">
			Aquí se muestra la lista de los pagos pendientes del alumno. Esta información te permitirá revisar los pagos que aún están por realizarse.
		</div>
		<div
			class="w-full"
		>
			<div class="box-table overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border border-b-disable border-x-0 border-t-0">
							<th class="min-w-[120px]">N° DOCUMENTO</th>
							<th class="min-w-[120px]">F. VENCIMIENTO</th>
							<th class="min-w-[120px]">CICLO</th>
							<th class="min-w-[120px]">SALDO</th>
							<th class="min-w-[120px]">MORA</th>
							<th class="min-w-[120px]">TOTAL A PAGAR</th>
							<th class="min-w-[120px]">DETALLE</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in listaPagosPendientes" :key="index">
							<td>{{ item.documentoPago != '' ? item.documentoPago : '-' }}</td>
							<td
								:class="{
									'text-red-600 font-semibold': dateIsExpired(
										item.fechaVencimiento,
									),
								}"
							>
								{{ useDateFormat(item.fechaVencimiento, 'DD/MM/YYYY', { locales: 'es-ES' }) }}
							</td>
							<td>
								{{ item.ciclo }}
							</td>
							<td>
								S/
								{{
										(item.totalAPagar - item.mora).toFixed(2)
								}}
							</td>
							<td>S/ {{ item.mora.toFixed(2) }}</td>
							<td><strong>S/ {{ item.totalAPagar.toFixed(2) }}</strong></td>
							<td>
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
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="flex justify-between mt-7 items-center">
			<p class="mb-0 lg:text-[16px] text-[14px] font-extrabold">Monto total:</p>
			<span
				class="bg-green_40 text-dark_100 font-nunito py-2 px-8 font-extrabold lg:text-[16px] text-[14px]"
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
</template>

<style lang="postcss" scoped>
.box-table {
	font-family: arial, sans-serif;
	border-collapse: collapse;
	width: 100%;
}

tr:nth-child(odd),
tr:nth-child(odd) td {
	background-color: white;
}

tr:nth-child(even),
tr:nth-child(even) td {
	background-color: #f6f6f6;
}

th {
	font-family: 'grotesk';
	padding-top: 1rem;
	padding-bottom: 1rem;
	color: white;
	background-color: #031448;
	font-weight: 600;
	font-size: 16px;
}

th:last-child {
	color: #031448;
	background-color: lightblue;
}

td {
	@apply lg:py-6 py-4 px-2 text-center font-nunito text-sm;
}

.box-table::-webkit-scrollbar {
	height: 8px;
}

.box-table::-webkit-scrollbar-thumb {
	background-color: rgb(151, 151, 151);
}

.box-table::-webkit-scrollbar-track {
	background-color: white;
}

@media (max-width: 600px) {
	th {
		font-size: 14px;
	}

	td {
		font-size: 12px;
	}
}
</style>
