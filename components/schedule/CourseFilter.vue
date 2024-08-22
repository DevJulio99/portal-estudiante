<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		selectedCourseWeek: string;
		handleCourse: (e: any) => void;
		onDownload: () => void;
		loadingPdf: boolean;
		filteredCourses: any;
	}>(),
	{
		selectedCourseWeek: 'Todos',
		handleCourse: () => {},
		onDownload: () => {},
		filteredCourses: null,
	},
);
const handleSelect = (e: any) => {
	props.handleCourse(e.target.value);
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Select-Horario',
	// 		section: 'Filtro curso',
	// 		title: e.target.value,
	// 	});
	// }
};

const eventClick = (
	event: string,
	pageUrl: string,
	section: string,
	title: string,
) => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event,
	// 		pageUrl,
	// 		section,
	// 		title,
	// 	});
	// }
};

const downloadDoc = () => {
	eventClick(
		'Click/Descargar-Horario-Semanal',
		`${window.location.href}`,
		'Horarios',
		'Click en Descargar',
	);
	props.onDownload();
};

const isLargeScreen = useMediaQuery('(min-width: 1024px)');
</script>
<template>
	<div class="flex gap-4 items-center">
		<div
			v-if="isLargeScreen"
			class="flex items-center text-center justify-center"
		>
			<label class="text-sm text-white" for="filter">Filtrar por:</label>
			<select
				id="filter"
				class="base-select-purple text-dark-600 pl-3 pr-5 py-2 font-grotesk font-bold rounded bg-white w-full lg:w-[200px] lg:ml-4 mt-2 lg:mt-0"
				:value="selectedCourseWeek"
				@focus="
					() =>
						eventClick(
							'Click/Select-Horario',
							'Focus en filtro',
							'Horarios',
							'',
						)
				"
				@change="handleSelect"
			>
				<option value="Todos" selected>Todos los cursos</option>
				<option
					v-for="(item, i) in filteredCourses"
					:key="i"
					class="text-black"
					:value="item.CodCurso"
				>
					{{ item.DescEspecialCurso }}
				</option>
			</select>
		</div>
		<BaseButton
			styles="!w-auto !h-[48px] lg:!h-[38px] px-4"
			@click="downloadDoc"
		>
			<div class="flex gap-2 items-center">
				<img
					v-if="loadingPdf"
					class="w-[24px]"
					src="~/assets/images/SpinnerUPN_Black.gif"
				/>
				<nuxt-icon
					v-else
					name="upn-icon-download-box"
					filled
					class="text-2xl lg:text-xl"
				/>
				<p v-if="isLargeScreen">Descargar</p>
			</div>
		</BaseButton>
	</div>
</template>
