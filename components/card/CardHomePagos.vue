<script lang="ts" setup>
import type { PendingPaymentsHomeData } from '~/types/pagos.types';
import obligacionesPagadasMock from "~/utils/data/dataObligacionesPagadas.json";
const { $api } = useNuxtApp();

const props = defineProps<{
	codAlumno: string | undefined;
}>();

const servicesData = ref<PendingPaymentsHomeData>();
const servicesError: Ref<any> = ref(null);
const pendingServices = ref(true);

// const {
// 	data: dataServices,
// 	error: errorServices,
// 	pending: pendingServices,
// } = await $api.pagosPendHome.getPagosPendientes(props.codAlumno, {
// 	lazy: true,
// });
// watch(dataServices, (response) => {
// 	if (response?.flag) {
// 		servicesData.value = response?.data[0] || [];
// 	} else if (response?.error) {
// 		servicesError.value = response.error;
// 	}
// });

onMounted(() => {
	pendingServices.value = false;
});
</script>
<template>
	<div>
		<div v-if="pendingServices" class="text-xs text-black mt-6 mb-4">
			<BaseStatusLoading />
		</div>
		<!-- <div v-else-if="errorServices || servicesError">
			<BaseStatusError
				:text="
					servicesError?.titulo || 'Lo sentimos, no pudimos cargar tus pagos'
				"
				:description="
					servicesError?.descripcion || 'Inténtalo de nuevo más tarde'
				"
				:icono="servicesError?.icono"
			/>
		</div> -->
		<div v-else-if="servicesData?.total == 0">
			<BaseStatusError
				:text="servicesError?.titulo || '¡Muy Bien!'"
				:description="
					servicesError?.descripcion || 'Sin pagos pendientes este mes'
				"
				:icono="'https://adminmi.upn.edu.pe/assets/7679a111-0454-4766-a8d0-6082c9d81347.svg'"
			/>
		</div>
		<div v-else class="font-nunito">
			<p class="text-sm text-center">Pendientes del mes</p>
			<p class="text-[21px] text-center font-extrabold mb-1">
				S/ {{ servicesData?.total.toFixed(2) }}
			</p>
			<div class="flex flex-wrap justify-center">
				<div
					v-if="
						(servicesData?.countAT || 0) > 0 &&
						servicesData?.countPV == 0 &&
						servicesData?.countV == 0
					"
					class="flex items-center text-[13px] text-[#1762CA] font-extrabold"
				>
					<nuxt-icon class="text-[18px]" filled name="payHomeTime" />
					<span
						>{{ String(servicesData?.countAT).padStart(2, '0') }} a tiempo</span
					>
				</div>
				<div
					v-if="(servicesData?.countV || 0) > 0"
					class="flex items-center text-[13px] text-[#DC3545] font-extrabold gap-1"
				>
					<nuxt-icon class="text-[18px]" filled name="payHomeWarning" />
					<span
						>{{ String(servicesData?.countV).padStart(2, '0') }}
						{{ (servicesData?.countV || 0) > 1 ? 'vencidas' : 'vencida' }}</span
					>
				</div>
				<div
					v-if="(servicesData?.countPV || 0) > 0"
					class="flex items-center text-[13px] text-[#985108] font-extrabold"
				>
					<span
						v-if="!(servicesData?.countV === 0)"
						class="text-[20px] mx-2 text-black"
						>+</span
					>
					<nuxt-icon class="text-[18px]" filled name="payHomeAlarm" />
					<span
						>{{ String(servicesData?.countPV).padStart(2, '0') }} por
						vencer</span
					>
				</div>
			</div>
		</div>
	</div>
</template>
