<script setup lang="ts">
import { onMounted } from 'vue';
import type { ObligacionPagada } from '~/types/obligations.types';
import type { ErrorResponse } from '~/types/services.types';

definePageMeta({
  middleware: "auth",
});

useHead({
	title: 'Obligaciones pagadas',
});

const { $api } = useNuxtApp();

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Pagos', current: false, url: '' },
	{ name: 'Obligaciones pagadas', current: true, url: '' },
];

// const user = useUserStoreAuth();
// const codAlumno = user.codAlum;
const dataObligations = ref<ObligacionPagada[]>([]);
const loading = ref(true);
const tokenStore = useTokenStore();
const obligationError: Ref<ErrorResponse | null> = ref(null);

const { data, error, pending } = await $api.obligacionesPagadas.getObligacionesPagadas(
	parseInt(tokenStore.getDataToken.Id),
	{
		lazy: true,
	},
);
watch(data, (response) => {
	if (response?.data?.length) {
		dataObligations.value = response.data;
	} else if (response?.error) {
		obligationError.value = response.error;
	} else {
		obligationError.value = {
			descripcion: '',
			icono: '',
			titulo: response?.message ?? '',
		};
	}
});

onMounted(() => {
	loading.value = false;
});
</script>
<template>
	<BaseLayout :rightAside="false" bgWhite>
		<div class="pb-[38px]">
			<BaseBreadcrumbs :items="breadcrumbsItem" />
			<BaseTabPayments activeTab="pagadas" />
			<div class="flex items-center gap-1.5">
				<BaseTitle text="Obligaciones Pagadas" />
				<NuxtIcon class="text-[20px]" filled name="CheckboxCircle" />
			</div>

			<div v-if="loading" class="w-full h-[240px] flex justify-center">
				<BaseStatusLoading />
			</div>

			<!-- <ScheduleStatusError
				v-else-if="error || obligationError"
				class="w-full !h-[240px] md:pt-[28px]"
				:text="
					obligationError?.titulo ??
					'Lo sentimos, no pudimos cargar tus Obligaciones pagadas'
				"
				:description="obligationError?.descripcion"
				:icono="obligationError?.icono"
			/> -->

			<div v-if="dataObligations.length">
				<BaseAcordion
					v-for="obligation in dataObligations"
					:key="obligation.periodo"
					:title="`${obligation.periodo}`"
					className="mb-5"
				>
					<div class="w-full overflow-auto">
						<table
							class="border border-x-0 border-b-disable border-t-0 min-w-[600px]"
						>
							<tr
								class="border border-b-disable border-x-0 border-t-0 bg-black"
							>
								<th class="text-white font-grotesk text-sm md:text-base">
									F. DE PAGO
								</th>
								<th class="text-white font-grotesk text-sm md:text-base">
									CONCEPTO
								</th>
								<th class="text-white font-grotesk text-sm md:text-base">
									N° DOCUMENTO
								</th>
								<th class="text-white font-grotesk text-sm md:text-base">
									N° CUOTA
								</th>
								<th class="text-white font-grotesk text-sm md:text-base">
									IMPORTE
								</th>
								<th class="text-white font-grotesk text-sm md:text-base">
									MONTO PAGADO
								</th>
							</tr>
							<tr v-for="(payment, index) in obligation.pagos" :key="index">
								<td class="font-nunito text-xs leading-5 md:text-sm">
									<div class="w-full flex justify-center">
										<span class="w-[144px] text-limit">{{
											payment.fechaPago
										}}</span>
									</div>
								</td>
								<td class="font-nunito text-xs md:text-sm leading-5">
									<div class="w-full flex justify-center items-center h-[40px]">
										<span class="w-[164px] !flex justify-center text-limit">
											{{ payment.concepto }}
										</span>
									</div>
								</td>
								<td class="font-nunito text-xs md:text-sm leading-5">
									<div class="w-full flex justify-center items-center h-[40px]">
										<span class="w-[144px] !flex justify-center text-limit">
											{{ payment.numeroDocumentoPago }}
										</span>
									</div>
								</td>
								<td class="font-nunito text-xs md:text-sm leading-5">
									<div class="w-full flex justify-center">
										<span class="w-[77px] text-limit">{{ payment.numeroCuota }}</span>
									</div>
								</td>
								<td class="font-nunito text-xs md:text-sm leading-5">
									<div class="w-full flex justify-center">
										<span class="w-[144px] text-limit">{{
											payment.importe
										}}</span>
									</div>
								</td>
								<td class="font-nunito text-xs md:text-sm leading-5">
									<div class="w-full flex justify-center">
										<span class="w-[144px] text-limit">{{ payment.montoPagado }}</span>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</BaseAcordion>
			</div>
		</div>
	</BaseLayout>
</template>

<style lang="postcss" scoped>
table {
	font-family: arial, sans-serif;
	border-collapse: collapse;
	width: 100%;
}

td,
th {
	text-align: left;
	text-align: center;
	padding: 8px;
	border: none;
}

th {
	font-weight: 600;
	font-size: 14px;
}

tr:nth-child(even) {
	background-color: #f6f6f6;
}

@media (min-width: 768px) {
	td,
	th {
		padding: 16px 8px;
	}

	th {
		font-size: 16px;
	}
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
	opacity: 1;
	margin-left: 10px;

	@media (min-width: 768px) {
		margin-left: 20px;
	}
}

.text-limit {
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 2;
	display: -webkit-box !important;
	-webkit-box-orient: vertical;
}
</style>
