<script setup lang="ts">
import type { NotaBimestre } from '~/types/notas.types';

defineProps<{
	item: NotaBimestre;
}>();
</script>

<template>
	<div
		v-if="item.tipoNota !== 'PF'"
		aria-label="TicketNotas"
		class="tckt-nota relative w-full flex flex-wrap items-center justify-center gap-1 py-2 px-1 border border-disable text-sm rounded-sm shadow-sm"
	>
		<div
			class="dtooltip absolute text-[12px] w-max right-[-50px] top-[-50px] z-10 bg-black text-white py-2 px-[16px]"
		>
			{{ item.tipoNota }}
		</div>
		<p class="uppercase text-[#5E757C] text-center">{{ item.tipoNota }}:</p>
		<p
			class="font-bold"
			:class="
				parseInt(item.nota) == 0
					? 'text-[#6D6D6D]'
					: parseInt(item.nota) < 12
						? 'text-[#DC3545]'
						: 'text-[#1F7634]'
			"
		>
			{{ item.nota }}
		</p>
	</div>
</template>

<style lang="postcss" scoped>
.dtooltip {
	visibility: hidden;
}

.dtooltip::after {
	content: '';
	display: block;
	position: absolute;
	width: 0;
	height: 0;
	background-color: transparent;
	bottom: -5px;
	border: 3.93px solid transparent;
	border-bottom: 0;
	border-top: 6px solid #000000;
	text-align: center;
	left: 20%;
	transform: translateX(-60%);
}

.tckt-nota:hover .dtooltip {
	visibility: visible;
}
</style>
