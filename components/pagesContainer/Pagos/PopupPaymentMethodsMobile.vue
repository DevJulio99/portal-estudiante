<script setup lang="ts">
import type { PaymentMethodsData, PaymentOrderData } from '~/types/pagos.types';
const { $api } = useNuxtApp();

const props = defineProps<{
	dataPayment: PaymentOrderData | undefined;
	listPaymentMethods: PaymentMethodsData[];
	closePopup: () => void;
}>();

const selectedMethodIndex = ref<number | null>(null);
const linkOrderPay = ref<string | null>('');
const listPayDocuments = ref();
const checkTermsConditions = ref<boolean>(false);
const paymenyCheckTermsDisabled = ref<boolean>(true);
const showPopUpError = ref<boolean>(false);
const buttonTextContinue = ref<string>('Continuar');
const serviceErrorLinkOrder = ref();

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: '. . .', current: false, url: '' },
	{ name: 'Pagar seccionados', current: true, url: '' },
];

const generatePaymentOrder = async () => {
	buttonTextContinue.value = 'Generando orden de pago ...';
	checkTermsConditions.value = false;
	const { data } = await $api.payOrderPost.generatePaymentLink(
		props.dataPayment,
		{
			lazy: true,
		},
	);
	const unwatch = watch(
		data,
		(response) => {
			if (response?.flag) {
				linkOrderPay.value = response?.data[0].url;
				buttonTextContinue.value = 'Continuar';
				window.open(linkOrderPay.value?.toString(), '_blank');
				props.closePopup();
			} else {
				serviceErrorLinkOrder.value = response?.error;
				showPopUpError.value = true;
			}
		},
		{ immediate: true },
	);
	unwatch();
};

const redirectPayment = () => {
	const index = selectedMethodIndex.value ?? 0;
	if (window.dataLayer) {
		window.dataLayer.push({
			event: 'Click/Boton-Pagar',
			page_url: `${window.location.href}`,
		});
	}
	if (index === 99) {
		generatePaymentOrder();
	} else {
		window.open(props.listPaymentMethods[index].url?.toString(), '_blank');
	}
};

const activatePaymentItem = (index: number) => {
	selectedMethodIndex.value = index;
	checkTermsConditions.value = false;
	if (index === 99) {
		buttonTextContinue.value = 'Continuar';
		paymenyCheckTermsDisabled.value = false;
		if (window.dataLayer) {
			window.dataLayer.push({
				event: 'Click/Select-MedioDePago',
				section: 'Otros',
				page_url: `${window.location.href}`,
				title: 'Otros medios de pago',
			});
		}
	} else {
		buttonTextContinue.value = 'Ir a la web del banco';
		paymenyCheckTermsDisabled.value = true;
		if (window.dataLayer) {
			window.dataLayer.push({
				event: 'Click/Select-MedioDePago',
				section: 'Bancos',
				page_url: `${window.location.href}`,
				url: props.listPaymentMethods[index].url,
				title: props.listPaymentMethods[index].nombreMedioDePago,
			});
		}
	}
};

listPayDocuments.value = props.dataPayment?.concept
	.map((item) => (item.coditem !== '' ? item.coditem : '-'))
	.join(', ');
</script>
<template>
	<div class="content-popup">
		<BaseBreadcrumbs :items="breadcrumbsItem" />
		<div class="card-content pt-2">
			<div class="my-4">
				<span
					class="bg-dark_100 text-white font-grotesk py-2 px-2 font-semibold text-md"
					>RESUMEN DEL PAGO SELECCIONADO</span
				>
			</div>
			<div
				class="bg-[#F6F6F6] font-telegraf font-bold px-2 py-1 my-3 capitalize text-sm"
			>
				Concepto: Pago de obligaciones
			</div>
			<div class="grid grid-cols-2 gap-y-[10px] gap-x-[8px] mt-3">
				<div>
					<p class="font-telegraf text-[#333333] text-[12px]">Documentos</p>
					<div class="font-telegraf font-bold text-[#000]">
						<div class="text-[14px]">{{ listPayDocuments }}</div>
					</div>
				</div>
				<div>
					<p class="font-telegraf text-[#333333] text-[12px]">Cantidad</p>
					<div class="font-telegraf font-bold text-[#000]">
						<span class="text-[14px]">{{ dataPayment?.concept.length }}</span>
					</div>
				</div>
			</div>
			<hr class="my-3 text-[#D9D9D9]" />
			<div class="flex justify-between items-center mb-7">
				<p class="mb-0 lg:text-[16px] text-[14px] font-bold">Total a pagar</p>
				<span
					class="bg-[#00B9FF] text-dark_100 font-telegraf py-1 px-3 font-extrabold text-[17px]"
					>S/{{
						dataPayment?.totalAmount ? dataPayment?.totalAmount.toFixed(2) : 0.0
					}}</span
				>
			</div>
			<div>
				<span
					class="bg-dark_100 text-white font-grotesk py-2 px-2 font-semibold text-md"
					>MÉTODOS DE PAGO</span
				>
			</div>
			<p class="text-sm mt-3">
				Realiza tu pago a través de Banca por internet, Banca móvil, Agentes o
				Agencias de los siguientes bancos:
			</p>
			<div>
				<ul>
					<li
						class="items-methods cursor-pointer"
						:class="{
							selected: selectedMethodIndex == 99,
						}"
						@click="activatePaymentItem(99)"
					>
						<div
							class="custom-radio"
							:class="{ selected: selectedMethodIndex == 99 }"
						></div>

						<NuxtIcon name="payIcon" class="text-[21px]" />
						<span class="text-sm text-[#4F6168]"
							>(Pagos con tarjeta, PagoEfectivo y Powerpay)</span
						>
					</li>
					<li
						v-for="(metodo, index) in listPaymentMethods"
						:key="index"
						class="items-methods cursor-pointer"
						:class="{
							selected: selectedMethodIndex == index,
						}"
						@click="activatePaymentItem(index)"
					>
						<div
							class="custom-radio"
							:class="{ selected: selectedMethodIndex == index }"
						></div>
						<nuxt-img :src="metodo.icono ?? ''" class="h-[16px]" />
						<span class="text-sm text-[#4F6168]"
							>&#40;Banca por internet {{ metodo.nombreMedioDePago }}&#41;</span
						>
					</li>
				</ul>
			</div>
			<div class="flex items-center gap-3 mt-4 ms-1">
				<input
					type="checkbox"
					class="accent-primary scale-150"
					:checked="checkTermsConditions"
					:disabled="paymenyCheckTermsDisabled"
					@change="
						() => {
							checkTermsConditions = !checkTermsConditions;
						}
					"
				/>
				<span
					class="text-sm select-none"
					:class="{ 'text-[#5E757C]': selectedMethodIndex != 99 }"
					>Acepto los
					<a
						href="https://www.upn.edu.pe/politica-de-privacidad"
						target="_blank"
						class="underline"
						:class="{ 'text-[#0056B3]': selectedMethodIndex == 99 }"
						>Términos y condiciones.</a
					></span
				>
			</div>
			<div class="flex flex-col mt-5 gap-3">
				<button
					class="w-full rounded-md gap-1 text-sm font-extrabold bg-primary py-3 disabled:bg-[#FFE2BE] disabled:text-[#4F6168]"
					:disabled="
						selectedMethodIndex == null ||
						(selectedMethodIndex == 99 && !checkTermsConditions)
					"
					@click="redirectPayment"
				>
					<span>{{ buttonTextContinue }}</span>
				</button>
				<button
					class="w-full rounded-md gap-1 text-sm font-extrabold bg-dark_100 text-white py-3"
					@click.stop="closePopup"
				>
					Volver
				</button>
			</div>
		</div>
	</div>
	<BaseStatusErrorPopUp
		v-if="showPopUpError"
		:icono="serviceErrorLinkOrder?.icono"
		:text="
			serviceErrorLinkOrder?.titulo ??
			'Lo sentimos, no pudimos generar tu orden de pago'
		"
		:description="serviceErrorLinkOrder?.descripcion"
		:closePopup="closePopup"
	/>
</template>
<style lang="postcss" scoped>
.content-popup {
	@apply absolute z-10 left-0 top-0 w-full h-auto min-h-[50vh] px-3 pt-8 bg-white;
}
li.items-methods {
	@apply flex items-center border-2 border-[#C2D1D9] rounded-md py-3 px-3 my-2 gap-3;
}
li.items-methods.selected {
	@apply border-[#FDBA30] bg-[#FEF8F2];
}
.custom-radio {
	width: 20px;
	height: 20px;
	min-width: 20px;
	min-height: 20px;
	background-color: #fff;
	border: 2px solid #ccc;
	border-radius: 50%;
	cursor: pointer;
	position: relative;
}
.custom-radio.selected {
	border-color: #fdba30;
}
.custom-radio.selected::before {
	content: '';
	width: 10px;
	height: 10px;
	background-color: #fdba30;
	border-radius: 50%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
