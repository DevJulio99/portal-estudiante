<script setup lang="ts">
import debounce from 'lodash.debounce';
import type { HorarioData } from '~/types/cursos.types';
import { TipoInstitucion } from '~/types/institucion.types';

const { $api } = useNuxtApp();
const tokenStore = useTokenStore();

const allDataHorario = ref<HorarioData[]>([]);
const dataHorario = ref<HorarioData[]>([]);
const user = useUserStoreAuth();
const elementHorario = ref<HTMLDivElement | null>(null);
const isScrolled = ref(false);
const servicesError: Ref<any> = ref(null);
const selectDay = ref(0);
const codAlum = user.codAlum;

const esColegio = computed(() => tokenStore.getDataToken?.Tipo_Institucion === TipoInstitucion.Colegio);

const ajustarDiaHabil = (day: Date): Date => {
	if (!esColegio.value) return day;
	
	const dayNumber = (day.getDay() + 6) % 7;
	
	if (dayNumber === 5) {
		const adjustedDay = new Date(day);
		adjustedDay.setDate(day.getDate() + 2);
		return adjustedDay;
	}
	
	if (dayNumber === 6) {
		const adjustedDay = new Date(day);
		adjustedDay.setDate(day.getDate() + 1);
		return adjustedDay;
	}
	
	return day;
};

const currentDay = ajustarDiaHabil(new Date());
const tomorrowRaw = new Date();
tomorrowRaw.setDate(tomorrowRaw.getDate() + 1);
const nextDay = ajustarDiaHabil(tomorrowRaw);
const dayNum = (day: Date) => (day.getDay() + 6) % 7;
const visibleDay = ref(dayNum(currentDay));

const esRealmenteManana = computed(() => {
    const diffTime = nextDay.getTime() - currentDay.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays === 1;
});

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

const callHorarioRango = async () =>
  await $api.horarioRango.getHorariosRango(
    tokenStore.getDataToken.Id_Alumno,
    fechaSession1.value,
    fechaSession2.value,
    {
      lazy: true,
    }
  );

const {
	data: horarioDataResponse,
	error: errorServicesHorario,
	pending,
} = await callHorarioRango();

watch(horarioDataResponse, (response) => {
	if (response?.data.length) {
		// Filtrar solo días hábiles (0-4: lunes a viernes) si es colegio
		const filteredData = esColegio.value 
			? response.data.filter((item) => {
				const diaNum = Number(item.horario.diaNumero);
				return diaNum >= 0 && diaNum <= 4; // Solo lunes a viernes
			})
			: response.data;
		
		const repeatDay = allDataHorario.value.filter(x => Number(x.horario.diaNumero) === visibleDay.value);
		if(!repeatDay.length){
			const dayFilteredData = filteredData.filter((item) => {
				return Number(item.horario.diaNumero) === visibleDay.value;
			});
			allDataHorario.value = [...dataHorario.value, ...dayFilteredData];
			dataHorario.value = dayFilteredData;
		}
	}
	if (response?.error) {
		servicesError.value = response.error;
	}
	// unwatch();
});

const callCurrentDayClass = () => {
  const adjustedCurrentDay = ajustarDiaHabil(new Date());
  const currentDayNum = dayNum(adjustedCurrentDay);
  
  if (visibleDay.value === currentDayNum) return;
  
  selectDay.value = 0;
  visibleDay.value = currentDayNum;
  
  debounce(() => {
    fechaSession1.value = `${adjustedCurrentDay.getFullYear()}-${
      adjustedCurrentDay.getMonth() + 1
    }-${adjustedCurrentDay.getDate()}T00:00:00Z`;
    fechaSession2.value = `${adjustedCurrentDay.getFullYear()}-${
      adjustedCurrentDay.getMonth() + 1
    }-${adjustedCurrentDay.getDate()}T23:00:00Z`;
    getDataClass();
  }, 350)();
};

const callNextDayClass = () => {
  const adjustedNextDay = ajustarDiaHabil(new Date(new Date().setDate(new Date().getDate() + 1)));
  const nextDayNum = dayNum(adjustedNextDay);
  
  if (visibleDay.value === nextDayNum) return;
  
  selectDay.value = 1;
  visibleDay.value = nextDayNum;
  
  debounce(() => {
    fechaSession1.value = `${adjustedNextDay.getFullYear()}-${
    	adjustedNextDay.getMonth() + 1
    }-${adjustedNextDay.getDate()}T00:00:00Z`;
    fechaSession2.value = `${adjustedNextDay.getFullYear()}-${
    	adjustedNextDay.getMonth() + 1
    }-${adjustedNextDay.getDate()}T23:00:00Z`;
    getDataClass();
  }, 350)();
};

const getDataClass = () => {
	// Filtrar solo días hábiles (0-4: lunes a viernes) si es colegio
	const filteredData = esColegio.value
		? allDataHorario.value.filter((item) => {
			const diaNum = Number(item.horario.diaNumero);
			return diaNum >= 0 && diaNum <= 4 && diaNum === visibleDay.value;
		})
		: allDataHorario.value.filter(x => Number(x.horario.diaNumero) === visibleDay.value);
	
	if(!filteredData.length){
		callHorarioRango();
	}else {
		dataHorario.value = filteredData;
	}
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

onMounted(() => {
	elementHorario.value?.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
	elementHorario.value?.removeEventListener('scroll', handleScroll);
});
</script>
<template>
	<CardHome title="Mis Horarios" url="/horarios" width="w-full" icon="horarioIcon">
		<div class="flex gap-2 mb-2">
			<button
				class="border border-[#287f6b] text-[#287f6b] py-2 px-2 lg:px-4 text-xs font-extrabold rounded hover:bg-[#287f6b] hover:text-white"
				:class="selectDay == 0 && 'bg-[#287f6b] text-white'"
				@click="callCurrentDayClass"
			>
				HOY {{ Days[dayNum(currentDay)] }}
				{{
					`${
						currentDay.getDate() <= 9
							? `0${currentDay.getDate()}`
							: currentDay.getDate()
					}`
				}}/{{ currentDay.getMonth() + 1 }}
			</button>
			<button
				class="border border-[#287f6b] py-2 px-2 lg:px-4 text-xs text-[#287f6b] font-extrabold rounded hover:bg-[#287f6b] hover:text-white"
				:class="selectDay == 1 && 'bg-[#287f6b] text-white'"
				@click="callNextDayClass"
			>
				{{ esRealmenteManana ? 'Mañana' : '' }} {{ Days[dayNum(nextDay)] }}
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
