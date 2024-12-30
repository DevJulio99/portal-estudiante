<script setup lang="ts">
import type { DetalleHorario } from '~/types/cursos.types';

const props = withDefaults(
	defineProps<{
		course: DetalleHorario;
		getTopAndHeight: any;
		mobile?: boolean;
		pdf: boolean;
	}>(),
	{
		mobile: false,
	},
);
const states = scheduleState();
const show = computed(() => {
	if (props.mobile) return true;
	else if (
		states.selectedCourse === 'Todos' ||
		states.selectedCourse === props.course.codMateria
	) {
		return true;
	}
});

const popupIsVisible = ref(false);
const showPopup = () => {
	popupIsVisible.value = true;
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Card-Horario',
	// 		title: props.course.descripMateria,
	// 	});
	// }
};
const hidePopup = () => {
	popupIsVisible.value = false;
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.remove('overflow-hidden');
};
</script>
<template>
	<!-- <div v-if="showCourseCurrentWeek"> -->
	<div
		v-if="show"
		class="absolute ml-[45px] lg:ml-0"
		:class="{
			'w-[calc(100%_-_70px)] lg:w-[97%] lg:ml-[1px]': !Boolean(course.orden),
			'w-[40%] lgMobile:w-[45%] lg:w-[70%] lg:ml-[1px] lg:hover:z-[10]':
				course.orden === 1,
			'lg:z-[10]': course.orden === 1 && popupIsVisible,
			'w-[40%] ml-[calc(48px_+_40%)] lgMobile:w-[45%] lgMobile:ml-[calc(48px_+_45%)] lg:w-[70%] lg:ml-[28%]':
				course.orden === 2,
		}"
		:style="getTopAndHeight(course.horaInicio, course.horaFin)"
	>
		<ScheduleCardCourse
			v-if="showPopup"
			:course="course"
			:popupIsVisible="popupIsVisible"
			:pdf="pdf"
			@click="showPopup"
		/>
		<ScheduleCardPopUp
			v-if="popupIsVisible"
			:closePopup="hidePopup"
			:course="course"
		/>
	</div>
	<!-- </div> -->
</template>
