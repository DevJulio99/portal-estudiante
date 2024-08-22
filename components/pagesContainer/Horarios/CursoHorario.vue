<script setup lang="ts">
import type { HorarioData } from '~/types/cursos.types';

defineProps<{
	item: HorarioData;
}>();

function formatHora(hora: string) {
	const splitHora = hora.split(':');
	return conditionedString(`${splitHora[0]}:${splitHora[1]}`);
}

const popupIsVisible = ref(false);
const showPopup = (title: string) => {
	popupIsVisible.value = true;
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Modal-Dashboard',
	// 		section: 'Mis horarios',
	// 		title,
	// 	});
	// }
};
const hidePopup = () => {
	popupIsVisible.value = false;
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.remove('overflow-hidden');
};
</script>

<template aria-label="CursoHorario">
	<div
		class="w-full border-l-4 flex items-center py-2 px-4 rounded relative"
		:class="{
			'border-primary':
				item.detalleHorario[0].descripMetodoEducativo === 'Presencial',
			'border-midnightBlue':
				item.detalleHorario[0].descripMetodoEducativo === 'Virtual',
			'border-[#D191FF]':
				item.detalleHorario[0].descripMetodoEducativo === 'Remoto',
		}"
	>
		<div class="text-center">
			<div class="text-base font-telegraf color-black font-extrabold">
				{{ formatHora(item.detalleHorario[0].horaInicio) }}
			</div>
			<div class="font-telegraf colo-neutral text-sm">
				{{ formatHora(item.detalleHorario[0].horaFin) }}
			</div>
		</div>
		<div
			class="relative before:absolute before:left-[-9px] before:w-[1px] before:h-full before:bg-disable ml-[18px]"
		>
			<div class="text-sm font-extrabold color-black font-telegraf text-cut">
				{{ conditionedString(item.detalleHorario[0].descripMateria) }}
			</div>
			<div class="font-telegraf colo-neutral text-xs">
				{{ conditionedString(item.detalleHorario[0].codSeccion) }}
			</div>
			<div
				v-if="
					item.detalleHorario[0].descripMetodoEducativo === 'Remoto' ||
					item.detalleHorario[0].codAula
				"
				class="flex gap-1 mt-2"
			>
				<span>Salón:</span>
				<div
					class="text-center px-1 pt-1 font-telegraf text-[0.78rem] color-black font-extrabold rounded-md min-w-[48px]"
					:class="{
						'bg-[#FDC979] text-[#523C0F]':
							item.detalleHorario[0].descripMetodoEducativo === 'Presencial',
						'bg-[#E6C2FF] text-[#430073]':
							item.detalleHorario[0].descripMetodoEducativo === 'Remoto',
					}"
				>
					{{
						item.detalleHorario[0].descripMetodoEducativo === 'Remoto'
							? 'Blackboard'
							: conditionedString(item.detalleHorario[0].codAula)
					}}
				</div>
			</div>
		</div>
		<button
			class="absolute bottom-0 right-0 rounded-[4px] lg:hover:bg-purple group"
			:class="{ 'bg-purple_80': popupIsVisible }"
			@click="showPopup(item.detalleHorario[0].descripMateria)"
		>
			<nuxt-icon
				class="text-[20px] text-purple_80 lg:group-hover:text-white"
				:class="{ 'text-white': popupIsVisible }"
				name="defaultDia"
			/>
		</button>
	</div>
	<ScheduleCardPopUp
		v-if="popupIsVisible"
		:course="item.detalleHorario[0]"
		:closePopup="hidePopup"
	/>
</template>

<style lang="postcss" scoped>
.text-cut {
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	white-space: normal;
}
</style>
