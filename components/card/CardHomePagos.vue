<script lang="ts" setup>
import type { PendingPaymentsHomeData } from '~/types/pagos.types';
import checkBox from '~/assets/icons/CheckBoxCircle.svg'

const { $api } = useNuxtApp();

const tokenStore = useTokenStore();

const servicesData = ref<PendingPaymentsHomeData>();
const servicesError: Ref<any> = ref(null);

const {
	data: dataServices,
	error: errorServices,
	pending: pendingServices,
} = await $api.pagosPendientesHome.getResumenPagosPorAlumno(parseInt(tokenStore.getDataToken.Id_Alumno), new Date().getFullYear(), {
	lazy: true,
});

watch(dataServices, (response) => {
	if (response?.data?.length) {
		servicesData.value = response?.data[0] || [];
	} else if (response?.error) {
		servicesError.value = response.error;
	}
});

onMounted(() => {
	pendingServices.value = false;
});
</script>
<template>
	<div>
		<div v-if="pendingServices" class="text-xs text-black mt-6 mb-4">
			<BaseStatusLoading />
		</div>
		<div v-else-if="errorServices || servicesError">
			<BaseStatusError
				:text="
					servicesError?.titulo || 'Lo sentimos, no pudimos cargar tus pagos'
				"
				:description="
					servicesError?.descripcion || 'Inténtalo de nuevo más tarde'
				"
				:icono="servicesError?.icono"
			/>
		</div>
		<div v-else-if="servicesData?.montoTotalPendiente == 0">
			<BaseStatusError
				:text="servicesError?.titulo || '¡Muy bien!'"
				:description="
					servicesError?.descripcion || 'Sin pagos pendientes este mes'
				"
				:icono="checkBox"
			/>
		</div>
		<div v-else class="font-nunito">
			<p class="text-sm text-center">Pendientes del mes</p>
			<p class="text-[21px] text-center font-extrabold mb-1">
				S/ {{ servicesData?.montoTotalPendiente.toFixed(2) }}
			</p>
			<div class="flex flex-wrap justify-center">
				<div
					v-if="
						(servicesData?.pagosATiempo || 0) > 0 &&
						servicesData?.pagosPorVencer == 0 &&
						servicesData?.pagosVencidos == 0
					"
					class="flex items-center text-[13px] text-[#1762CA] font-extrabold gap-1"
				>
					<nuxt-icon class="text-[18px]" filled name="paymentTime" />
					<span
						>{{ String(servicesData?.pagosATiempo).padStart(2, '0') }} a tiempo</span
					>
				</div>
				<div
					v-if="(servicesData?.pagosVencidos || 0) > 0"
					class="flex items-center text-[13px] text-[#DC3545] font-extrabold gap-1"
				>
					<nuxt-icon class="text-[16px]" filled name="paymentWarning" />
					<span
						>{{ String(servicesData?.pagosVencidos).padStart(2, '0') }}
						{{ (servicesData?.pagosVencidos || 0) > 1 ? 'vencidos' : 'vencido' }}</span
					>
				</div>
				<div
					v-if="(servicesData?.pagosPorVencer || 0) > 0"
					class="flex items-center text-[13px] text-[#985108] font-extrabold"
				>
					<span
						v-if="!(servicesData?.pagosVencidos === 0)"
						class="text-[20px] mx-2 text-black"
						>+</span
					>
					<nuxt-icon class="text-[20px]" filled name="paymentAlarm" />
					<span
						>{{ String(servicesData?.pagosPorVencer).padStart(2, '0') }} por
						vencer</span
					>
				</div>
			</div>
		</div>
	</div>
</template>
