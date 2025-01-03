<script setup lang="ts">
import type { DetalleHorario } from '~/types/cursos.types';
defineProps<{
	course: DetalleHorario;
	popupIsVisible: boolean;
	pdf: boolean;
}>();

const getDiff = (init: string, fin: string) => {
	const timeArrFin = fin.split(':');
	const timeArrInit = init.split(':');
	return (
		Number(timeArrFin[0]) * 60 +
		Number(timeArrFin[1]) -
		(Number(timeArrInit[0]) * 60 + Number(timeArrInit[1]))
	);
};
</script>

<template>
	<div
		class="card-container"
		role="button"
		tabindex="1"
		:class="[
			pdf ? 'pb-2' : 'py-2',
			{
				'before:bg-turquoise': course.descripMetodoEducativo === 'Presencial',
				'before:bg-violet_100': course.descripMetodoEducativo === 'Remoto',
			},
		]"
	>
		<span v-if="!pdf" class="text-[0.625rem]">
			{{ course.horaInicio.slice(0, 5) }} - {{ course.horaFin.slice(0, 5) }}
		</span>
		<p
			class="font-bold text-xs leading-[1] break-words capitalize"
			:class="{
				truncate: getDiff(course.horaInicio, course.horaFin) <= 60 && !pdf,
			}"
		>
			{{
				pdf &&
				course.descripMateria.length >= 10 &&
				getDiff(course.horaInicio, course.horaFin) <= 60
					? course.descripMateria.toLowerCase().slice(0, 10) + '...'
					: course.descripMateria.toLowerCase()
			}}
		</p>
		<p
			v-if="getDiff(course.horaInicio, course.horaFin) > 60 && !pdf"
			class="text-neutral text-[0.625rem] leading-[1] pt-2"
		>
			{{ course.codSeccion }}
		</p>
		<!-- <span
			v-if="course.codAula"
			class="text-[0.625rem] leading-[1] font-bold mt-auto"
		>
			{{ course.codAula }}
		</span> -->
		<div
			v-if="course.descripMetodoEducativo === 'Remoto' || course.codAula"
			class="mt-auto flex gap-1"
		>
			<div
				class="text-[0.725rem] text-center px-1 font-nunito color-black font-extrabold rounded min-w-[48px]"
				:class="{
					'bg-turquoise text-neutron80':
						course.descripMetodoEducativo === 'Presencial',
					'bg-violet_20 text-violet_100':
						course.descripMetodoEducativo === 'Remoto',
					'pb-2 leading-[1]': pdf,
				}"
			>
				{{
					course.descripMetodoEducativo === 'Remoto'
						? 'Blackboard'
						: course.codAula
				}}
			</div>
		</div>
		<div
			v-if="!pdf"
			class="absolute right-0 bottom-0"
			:class="{ 'bg-cyan_40 rounded-[4px]': popupIsVisible }"
		>
			<nuxt-icon
				class="text-darkBlue text-xl"
				:class="{ 'text-white': popupIsVisible }"
				name="defaultDia"
			/>
		</div>
	</div>
</template>
<style lang="postcss" scoped>
.card-container {
	@apply relative flex flex-col bg-white pl-[10px] pr-[8px] before:content-[''] w-full h-full before:absolute rounded-[4px] overflow-hidden
	shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.15)] before:left-0 before:top-0 before:h-full before:w-[5px] before:rounded-l-sm;
}
</style>
