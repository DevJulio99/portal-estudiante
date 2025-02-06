<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import type {
	PendingPaymentsData,
	PaymentMethodsData,
	PaymentOrderData,
} from '~/types/pagos.types';
import mediosPagosMock from "~/utils/data/dataMedioPago.json";
import pagosPendientesMock from "~/utils/data/dataPagosPendientes.json";

const { profileData } = useProfileStore();
const isMediumScreen = useMediaQuery('(min-width: 768px)');

const listaPaymentMethods = ref<PaymentMethodsData[]>([]);
const listaPagosPendientes = ref<PendingPaymentsData[]>([]);
const dataPaymentOrder = ref<PaymentOrderData>();
const popupDetalleData = ref();
const popupDetalleVisible = ref(false);
const popupMetodosPagoVisible = ref(false);
const montoTotalPagar = ref<Number>(0.0);
const servicesError: Ref<any> = ref(null);
const loadingPagos = ref(true);

const showPopup = (datos: object) => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-VerDetallePago',
	// 		page_url: `${window.location.href}`,
	// 		title: 'Detalle',
	// 	});
	// }
	popupDetalleData.value = datos;
	popupDetalleVisible.value = true;
};

const showPopupMethods = () => {
	const fechaActual = new Date();
	fechaActual.setUTCHours(fechaActual.getUTCHours() - 5);
	const montoTotal = montoTotalPagar.value.toString();
	const detailItems = listaPagosPendientes.value
		.filter((item) => item.debtChecked === true)
		.map((item) => ({
			coditem: item.numDoc,
			description: item.numDoc,
			price: item.arrearsTotal,
			quantity: 1,
			subtotal: item.balance,
			arrears: item.debtAmount,
			total: (
				parseFloat(item.balance) + parseFloat(item.debtAmount)
			).toString(),
			invoice: item.invoice,
		}));
	dataPaymentOrder.value = {
		userId: profileData.data?.codAlumno,
		methodPayment: '1',
		period: profileData.data?.codPeriodoBanner,
		campusCode: profileData.data?.codCampus,
		eticket: '',
		serviceId: '4',
		date: fechaActual.toISOString(),
		billingType: listaPagosPendientes.value[0].docType,
		amountOfCourses: 1,
		totalAmount: parseFloat(montoTotal),
		unitCostPerService: parseFloat(montoTotal),
		serviceCode: '0',
		operativeUnit: profileData.data?.codCampus,
		concept: detailItems,
	};
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-BotonMediosDePagoPopup',
	// 		page_url: `${window.location.href}`,
	// 	});
	// }
	popupMetodosPagoVisible.value = true;
};

const hidePopup = () => {
	popupDetalleVisible.value = false;
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.remove('overflow-hidden');
};

const hidePopupMetodosPapo = () => {
	popupMetodosPagoVisible.value = false;
	if (isMediumScreen) {
		const body: HTMLElement | null = document.querySelector('body');
		body?.classList.remove('overflow-hidden');
	}
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

const addSelectedDebts = (value: boolean, key: string) => {
	const index = parseInt(key);
	const debt = listaPagosPendientes.value[index];
	if (debt) {
		debt.debtChecked = !value;
		if (!value) {
			const nextDebt = listaPagosPendientes.value[index + 1];
			if (nextDebt) {
				nextDebt.debtDisabled = false;
			}
		} else {
			listaPagosPendientes.value.slice(index + 1).forEach((item) => {
				item.debtDisabled = true;
				item.debtChecked = false;
			});
		}
		montoTotalPagar.value = listaPagosPendientes.value.reduce(
			(monto, itemPago) => {
				if (itemPago.debtChecked) {
					return monto + parseFloat(itemPago.arrearsTotal);
				}
				return monto;
			},
			0,
		);
	}
};

// const { data: dataPaymentMethods } =
// 	await $api.paymentMethods.getPaymentMethods({
// 		lazy: true,
// 	});

// const {
// 	data: dataPagos,
// 	error: errorPagos,
// 	pending: loadingPagos,
// } = await $api.pagosPendientes.getPagosPendientes(profileData.data?.codAlumno, {
// 	lazy: true,
// });

// watch(dataPaymentMethods, (response) => {
// 	if (response?.flag) {
// 		listaPaymentMethods.value = response.data;
// 	}
// });

// watch(dataPagos, (response) => {
// 	if (response?.flag) {
// 		listaPagosPendientes.value = response?.data;
// 		listaPagosPendientes.value[0].debtDisabled = false;
// 	} else if (response?.error) {
// 		servicesError.value = response.error;
// 	}
// });

onMounted(() => {
	listaPaymentMethods.value = mediosPagosMock;

	listaPagosPendientes.value = pagosPendientesMock as any;
	listaPagosPendientes.value[0].debtDisabled = false;

	loadingPagos.value = false;
});
</script>
<template aria-label="TableItemsPorPagar">
	<div
		v-if="loadingPagos"
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
			:description="'Intántalo de nuevo más tarde'"
			:icono="null"
		/>
	</div> -->
	<!-- <div
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
	</div> -->
	<div
		v-if="!loadingPagos && listaPagosPendientes.length > 0"
		class="w-full"
		:class="{
			'min-h-[100vh]': popupMetodosPagoVisible && !isMediumScreen,
		}"
	>
		<div v-if="isMediumScreen" class="mb-3">
			Selecciona las obligaciones que deseas pagar. Debes seleccionar primero
			las obligaciones más antiguas.
		</div>
		<div
			class="w-full"
			:class="{ hidden: popupMetodosPagoVisible && !isMediumScreen }"
		>
			<div class="box-table overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border border-b-disable border-x-0 border-t-0">
							<th class="min-w-[50px] max-w-[50px] sticky left-0"></th>
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
							<td class="flex justify-center items-center sticky left-0">
								<BaseCheck
									:itemKey="index.toString()"
									:isChecked="Boolean(item.debtChecked)"
									:isDisabled="item.debtDisabled ?? true"
									:label="null"
									@change="addSelectedDebts"
								/>
							</td>
							<td>{{ item.numDoc != '' ? item.numDoc : '-' }}</td>
							<td
								:class="{
									'text-red-600 font-semibold': dateIsExpired(
										item.expirationDate,
									),
								}"
							>
								{{ item.expirationDate }}
							</td>
							<td>
								{{ item.semester }}
							</td>
							<td>
								S/
								{{
									(
										parseFloat(item.arrearsTotal) - parseFloat(item.debtAmount)
									).toFixed(2)
								}}
							</td>
							<td>S/ {{ item.debtAmount }}</td>
							<td>S/ {{ item.arrearsTotal }}</td>
							<td>
								<div class="flex gap-[9px] items-center justify-center">
									<nuxt-icon
										name="iconEye"
										filled
										class="text-[21px] cursor-pointer"
										@click="
											showPopup({
												...item,
												isExpired: dateIsExpired(item.expirationDate),
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
			<p class="mb-0 lg:text-[16px] text-[14px]">Total seleccionado:</p>
			<span
				class="bg-green_40 text-dark_100 font-nunito py-2 px-8 font-extrabold lg:text-[16px] text-[14px]"
				:class="{ 'bg-white': montoTotalPagar == 0.0 }"
				>S/{{ montoTotalPagar.toFixed(2) }}</span
			>
		</div>
		<div class="flex mt-5">
			<button
				class="w-full rounded-md gap-1 font-extrabold bg-green_40 py-3 disabled:bg-green_10 disabled:text-[#4F6168]"
				:disabled="montoTotalPagar == 0.0"
				@click="showPopupMethods"
			>
				<span>Pagar S/{{ montoTotalPagar.toFixed(2) }}</span>
			</button>
		</div>
	</div>
	<PagesContainerPagosPopupPaymentDetail
		v-if="popupDetalleVisible"
		:data="popupDetalleData"
		:closePopup="hidePopup"
	/>
	<PagesContainerPagosPopupPaymentMethods
		v-if="isMediumScreen && popupMetodosPagoVisible"
		:dataPayment="dataPaymentOrder"
		:listPaymentMethods="listaPaymentMethods"
		:closePopup="hidePopupMetodosPapo"
	/>
	<PagesContainerPagosPopupPaymentMethodsMobile
		v-if="!isMediumScreen && popupMetodosPagoVisible"
		:dataPayment="dataPaymentOrder"
		:listPaymentMethods="listaPaymentMethods"
		:closePopup="hidePopupMetodosPapo"
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
