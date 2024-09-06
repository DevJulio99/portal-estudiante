<script setup lang="ts">
import type { HorarioData } from '~/types/cursos.types';
import dataHorarioMock from '~/utils/data/dataHorarioMock.json'

// const { $api } = useNuxtApp();

const dataHorario = ref<HorarioData[]>([]);
const user = useUserStoreAuth();
const elementHorario = ref<HTMLDivElement | null>(null);
const isScrolled = ref(false);
const servicesError: Ref<any> = ref(null);
const selectDay = ref(0);
const codAlum = user.codAlum;
const currentDay = new Date();
const nextDay = new Date(new Date().setDate(currentDay.getDate() + 1));
const dayNum = (day: Date) => (day.getDay() + 6) % 7;
const visibleDay = ref(dayNum(currentDay));
const pending = ref(true);

const Days = [
	'Lunes',
	'Martes',
	'Miércoles',
	'Jueves',
	'Viernes',
	'Sábado',
	'Domingo',
];

const fechaSession1 = ref(
	`${currentDay.getFullYear()}-${
		currentDay.getMonth() + 1
	}-${currentDay.getDate()}T00:00:00Z`,
);
const fechaSession2 = ref(
	`${currentDay.getFullYear()}-${
		currentDay.getMonth() + 1
	}-${currentDay.getDate()}T23:59:00Z`,
);

// async function callHorarios() {
// 	const { data, error, pending } = await $api.horario.getHorariosByCodeAlum(
// 		codAlum,
// 		fechaSession1.value,
// 		fechaSession2.value,
// 		{
// 			lazy: true,
// 		},
// 	);
// 	return { data, error, pending };
// }

// const {
// 	data: horarioDataResponse,
// 	error: errorServicesHorario,
// 	pending,
// } = await callHorarios();

// watch(horarioDataResponse, (response) => {
// 	if (response?.flag) {
// 		dataHorario.value = response.data.filter((item) => {
// 			return Number(item.horario.diaNumero) === visibleDay.value;
// 		});
// 	}
// 	if (response?.error) {
// 		servicesError.value = response.error;
// 	}
// 	// unwatch();
// });

function callCurrentDayClass() {
	if (visibleDay.value === dayNum(currentDay)) return;
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-Dashboard',
	// 		section: 'Mis horarios',
	// 		title: 'Hoy',
	// 	});
	// }
	selectDay.value = 0;
	visibleDay.value = dayNum(currentDay);
	fechaSession1.value = `${currentDay.getFullYear()}-${
		currentDay.getMonth() + 1
	}-${currentDay.getDate()}T00:00:00Z`;
	fechaSession2.value = `${currentDay.getFullYear()}-${
		currentDay.getMonth() + 1
	}-${currentDay.getDate()}T23:00:00Z`;
	callHorarios();
}

function callNextDayClass() {
	if (visibleDay.value === dayNum(nextDay)) return;
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-Dashboard',
	// 		section: 'Mis horarios',
	// 		title: 'Mañana',
	// 	});
	// }
	selectDay.value = 1;
	visibleDay.value = dayNum(nextDay);
	fechaSession1.value = `${nextDay.getFullYear()}-${
		nextDay.getMonth() + 1
	}-${nextDay.getDate()}T00:00:00Z`;
	fechaSession2.value = `${nextDay.getFullYear()}-${
		nextDay.getMonth() + 1
	}-${nextDay.getDate()}T23:00:00Z`;
	callHorarios();
}

const handleScroll = (e: any) => {
	if (e.target.scrollTop > 10 && !isScrolled.value) {
		// if (window.dataLayer) {
		// 	isScrolled.value = true;
		// 	window.dataLayer.push({
		// 		event: 'Scroll-Dashboard',
		// 		section: 'Mis horarios',
		// 	});
		// }
	}
};

const callHorarios = () => {
	dataHorario.value = dataHorarioMock.filter((item) => {
			return Number(item.horario.diaNumero) === visibleDay.value;
	}) as any;
}

onMounted(() => {
	elementHorario.value?.addEventListener('scroll', handleScroll);
	callHorarios();
	pending.value = false;
});

onUnmounted(() => {
	elementHorario.value?.removeEventListener('scroll', handleScroll);
});
</script>
<template>
	<CardHome title="Mis Horarios" url="/horarios" width="w-full" icon="myPagos">
		<div class="flex gap-2 mb-2">
			<button
				class="border border-purple text-purple py-2 px-2 lg:px-4 text-xs font-extrabold rounded hover:bg-purple hover:text-white"
				:class="selectDay == 0 && 'bg-purple text-white'"
				@click="callCurrentDayClass"
			>
				HOY {{ Days[currentDay.getDay() - 1] }}
				{{
					`${
						currentDay.getDate() <= 9
							? `0${currentDay.getDate()}`
							: currentDay.getDate()
					}`
				}}/{{ currentDay.getMonth() + 1 }}
			</button>
			<button
				class="border border-purple py-2 px-2 lg:px-4 text-xs text-purple font-extrabold rounded hover:bg-purple hover:text-white"
				:class="selectDay == 1 && 'bg-purple text-white'"
				@click="callNextDayClass"
			>
				Mañana {{ Days[nextDay.getDay() - 1] }}
				{{
					`${
						nextDay.getDate() <= 9 ? `0${nextDay.getDate()}` : nextDay.getDate()
					}`
				}}/{{ nextDay.getMonth() + 1 }}
			</button>
		</div>
		<div
			ref="elementHorario"
			class="overflow-auto costum-scroll"
			:class="{
				'h-[220px]': !(
					// errorServicesHorario ||
					servicesError ||
					dataHorario.length == 0
				),
			}"
		>
			<div class="flex flex-wrap gap-2 justify-center items-center">
				<div v-if="pending" class="text-xs text-black pt-24">
					<BaseStatusLoading />
				</div>
				<!-- <div
					v-else-if="errorServicesHorario"
					class="flex items-center justify-center py-[20px] lg:min-h-[220px] sm:min-h-[0px]"
				>
					<BaseStatusError
						:text="
							servicesError?.titulo ??
							'Lo sentimos, no pudimos cargar tus horarios'
						"
						:description="servicesError?.descripcion"
						:icono="servicesError?.icono"
					/>
				</div> -->
				<div
					v-else-if="!dataHorario.length"
					class="flex items-center justify-center py-[20px] lg:min-h-[220px] sm:min-h-[0px]"
				>
					<BaseStatusNoData
						:text="
							servicesError?.titulo ??
							'No tienes cursos asignados para este día'
						"
						:description="servicesError?.descripcion"
						:icono="servicesError?.icono"
					/>
				</div>
				<template v-else-if="dataHorario.length">
					<PagesContainerHorariosCursoHorario
						v-for="(horario, index) of dataHorario"
						:key="index"
						:item="horario"
					/>
				</template>
			</div>
		</div>
	</CardHome>
</template>
