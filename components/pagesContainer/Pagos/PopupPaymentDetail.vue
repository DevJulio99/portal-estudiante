<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import type { PagosPendientesData } from '~/types/pagos.types';

const props = defineProps<{
	data: PagosPendientesData | null;
	closePopup: () => void;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const smallerThanLg = breakpoints.smaller('lg');
const target = ref(null);

const isExpired = computed(() => {
  if (props.data?.fechaVencimiento) {
    const fechaVencimiento = new Date(props.data.fechaVencimiento);
    const today = new Date();

    fechaVencimiento.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return today > fechaVencimiento;
  }
  return false;
});

onClickOutside(target, () => props.closePopup());
onMounted(() => {
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.add('overflow-hidden');
});
</script>
<template>
	<div class="content-popup">
		<div
			ref="target"
			class="popup-schedule"
			:class="{
				'mobile-popup': smallerThanLg,
			}"
		>
			<button @click.stop="closePopup">
				<NuxtIcon class="close-schedule-popup" name="closeIcon" />
			</button>

			<div class="card-content">
				<div class="grid grid-cols-2 gap-y-[10px] mt-4 mb-2">
					<div>
						<span
							class="bg-dark_100 text-white font-grotesk py-1 px-2 font-semibold lg:text-lg text-sm"
							>DETALLE</span
						>
					</div>
					<div v-if="smallerThanLg" class="flex items-center justify-end">
						<div
							class="w-fit rounded-2xl py-1 px-5"
							:class="
								!isExpired
									? 'bg-[#C5E5FF] text-[#00608D]'
									: 'bg-[#F7D4D7] text-[#DC3545]'
							"
						>
							<p class="text-[12px]">
								<b>{{ isExpired ? 'Vencido' : 'A tiempo' }}</b>
							</p>
						</div>
					</div>
				</div>
				<div
					class="grid gap-y-[10px] gap-x-[3em] my-3"
					:class="!smallerThanLg ? 'grid-cols-3' : 'grid-cols-2'"
				>
					<div>
						<p class="font-nunito text-[#333333] text-[12px]">N° Documento</p>
						<div class="font-nunito font-extrabold text-[#000]">
							<span class="text-[14px]">{{
								data?.documentoPago != '' ? data?.documentoPago : '-'
							}}</span>
						</div>
					</div>
					<div>
						<p class="font-nunito text-[#333333] text-[12px]">
							Fecha de vencimiento
						</p>
						<div class="font-nunito font-extrabold text-[#000]">
							<span
								class="text-[14px]"
								:class="{
									'text-red-600': isExpired,
								}"
								>{{ useDateFormat(data?.fechaVencimiento, 'DD/MM/YYYY', { locales: 'es-ES' }) }}</span
							>
						</div>
					</div>
					<div v-if="!smallerThanLg" class="flex items-center justify-end">
						<div
							class="w-fit rounded-2xl py-1 px-5"
							:class="
								!isExpired
									? 'bg-[#C5E5FF] text-[#00608D]'
									: 'bg-[#F7D4D7] text-[#DC3545]'
							"
						>
							<p class="text-[12px]">
								<b>{{ isExpired ? 'Vencido' : 'A tiempo' }}</b>
							</p>
						</div>
					</div>
				</div>
				<hr class="mb-3 text-[#D9D9D9]" />
				<!-- <div v-for="(item, index) in data?.amountDetail" :key="index">
					<div
						class="bg-[#F6F6F6] font-nunito font-extrabold px-2 py-1 capitalize"
						:class="!smallerThanLg ? 'text-[16px]' : 'text-[14px]'"
					>
						{{ item.description }}
					</div>
					<div class="grid grid-cols-4 gap-y-[10px] gap-x-[8px] my-3 px-2">
						<div>
							<p class="font-nunito text-[#333333] text-[12px]">Cuota</p>
							<div class="font-nunito font-extrabold text-[#000]">
								<span class="text-[14px]">{{ item.fee }}</span>
							</div>
						</div>
						<div>
							<p class="font-nunito text-[#333333] text-[12px]">Cantidad</p>
							<div class="font-nunito font-extrabold text-[#000]">
								<span class="text-[14px]">{{ parseInt(item.amount) }}</span>
							</div>
						</div>
						<div>
							<p class="font-nunito text-[#333333] text-[12px]">
								Precio Unitario
							</p>
							<div class="font-nunito font-extrabold text-[#000]">
								<span class="text-[14px]">S/{{ item.price }}</span>
							</div>
						</div>
						<div>
							<p class="font-nunito text-[#333333] text-[12px]">Subtotal</p>
							<div class="font-nunito font-extrabold text-[#000]">
								<span class="text-[14px]">S/{{ item.subtotal }}</span>
							</div>
						</div>
					</div>
				</div> -->
				<div v-if="data?.imagen" class="flex justify-center items-center mx-auto">
					<div class="max-w-[500px] max-h-[300px] overflow-auto border border-gray">
						<img :src="data.imagen" alt="Imagen de detalle" class="w-full h-full object-cover" />
					</div>
				</div>

				<hr class="my-3 text-[#D9D9D9]" />
				<div class="grid grid-cols-4 gap-y-[10px] gap-x-[8px] mt-3">
					<div
						class="col-span-3 flex items-center font-nunito font-extrabold text-[#000]"
					>
						<span class="text-sm">Total a pagar</span>
					</div>
					<div class="col-span-1 flex items-center">
						<span
							class="bg-gray text-dark_100 font-nunito p-1 font-extrabold lg:text-[16px] text-[14px]"
							>S/ {{ data?.totalAPagar.toFixed(2) }}</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.content-popup {
	@apply fixed top-0 h-screen w-full bg-black bg-opacity-30 flex items-center justify-center z-[105] left-[50%] translate-x-[-50%];
}
.popup-schedule {
	@apply relative bg-white lg:fixed z-50 lg:w-[620px] lg:rounded-[8px] lg:cursor-auto;
}
.close-schedule-popup {
	@apply text-[#000000] text-[16px] absolute right-4 top-4 leading-[1] font-[600]
	hover:text-primary;
}
.popup-schedule.mobile-popup {
	@apply fixed bottom-0 left-0 right-0 w-full z-[110] rounded-t-[15px];
	animation-duration: 0.2s;
	animation-name: animate-entrance;
}
.mobile-popup .close-schedule-popup {
	@apply right-4 top-4 text-[16px];
}

.card-content {
	@apply px-[28px] pb-[65px] lg:pb-[40px];
}

@media (max-width: 600px) {
	.card-content {
		@apply px-[15px];
	}
}

@keyframes animate-entrance {
	0% {
		opacity: 0;
		transform: translateY(100%);
	}

	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
