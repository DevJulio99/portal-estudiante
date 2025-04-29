<script lang="ts" setup>
defineProps<{
	codAlumno: string | undefined;
}>();

const hidePayment = ref(true);
const handleVisibility = () => {
	hidePayment.value = false;
};
</script>
<template>
	<CardHome
		title="Mis pagos"
		url="/obligaciones-por-pagar"
		width="w-full"
		icon="paymentIcon"
	>
		<button
			v-if="hidePayment"
			class="text-[#1762CA] flex flex-col justify-center items-center mx-auto mt-10"
			@click="handleVisibility"
		>
			<nuxt-icon name="eyeIcon" />
			<span class="underline">Ver pendientes del mes</span>
		</button>
		<CardHomePagos v-else />
	</CardHome>
</template>
