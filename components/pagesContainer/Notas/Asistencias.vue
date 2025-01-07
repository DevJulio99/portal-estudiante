<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import type { DataAsistencia } from '~/types/asistencia.types';
import type { CursoAsistencia } from '~/types/cursos.types';
import type { ErrorResponse } from '~/types/services.types';

const StatusAsistencia = {
	asistido: 'Presente',
	tardanza: 'T',
	falta: 'Ausente',
};

const props = defineProps<{
	data?: CursoAsistencia[];
	curso: string;
	loading: boolean;
	error: Error | null;
	errorResponse?: ErrorResponse;
	modalidad: string;
}>();

let assistance = 0;
let tardiness = 0;
let faults = 0;

// const faultLimit = 8;
const element = ref<HTMLDivElement | null>(null);
const isScrolled = ref(false);
const totalFaults = ref(0);
const TotalAssists = ref<number[]>([]);


const calculateAssistance = () => {
	// if (props.data) {
	// 	const total = props.data.inasistencias.length;
	// 	const assistance_ = props.data.inasistencias.filter(
	// 		(x) => x.status === 'A',
	// 	);
	// 	const tardiness_ = props.data.inasistencias.filter((x) => x.status === 'T');
	// 	const faults_ = props.data.inasistencias.filter((x) => x.status === 'F');
	// 	totalFaults.value = faults_.length;
	// 	TotalAssists.value = [
	// 		assistance_.length,
	// 		tardiness_.length,
	// 		faults_.length,
	// 	];

	// 	assistance = Math.round((assistance_.length / total) * 100);
	// 	tardiness = Math.round((tardiness_.length / total) * 100);
	// 	faults = Math.round((faults_.length / total) * 100);
	// }
};

const getStringAssists = (indexAssist: number) => {
	const quantity = TotalAssists.value[indexAssist];

	return `${quantity} ${quantity > 1 ? 'clases' : 'clase'}`;
};

const handleTooltip = (element: any) => {
	resetArrowsTooptip();
	const { dataIndex, label } = element;

	const tooltip = document.getElementById('tp');
	const titleTp = document.getElementById('t_tp');
	const descripTp = document.getElementById('d_tp');

	if (tooltip && titleTp && descripTp) {
		titleTp.innerHTML = `${label}:`;
		descripTp.innerHTML = getStringAssists(dataIndex);

		const chartInstance = element.chart;
		const datasetMeta = chartInstance.getDatasetMeta(0);
		const centerPoint = datasetMeta.data[dataIndex].getCenterPoint();

		tooltip.style.top = `${centerPoint.y}px`;
		tooltip.style.left = `${centerPoint.x}px`;

		// console.log('centerPoint', centerPoint);

		// const isMediumright =
		// 	centerPoint.x > 55 && centerPoint.y > 30 && centerPoint.y < 55;
		// const isMediumrightTop = centerPoint.x > 55 && centerPoint.y < 30;

		// const isMediumleft =
		// 	centerPoint.x < 55 && centerPoint.y > 30 && centerPoint.y <= 56;
		// const isMediumleftTop = centerPoint.x < 55 && centerPoint.y < 30;

		// const istopMediumLeftBottom = centerPoint.x < 55 && centerPoint.y > 56;
		// const istopMediumRightBottom = centerPoint.x > 55 && centerPoint.y > 55;

		// if (isMediumright) {
		// 	// console.log('en medio derecha');
		// 	tooltip.style.top = `${centerPoint.y - 27}px`;
		// 	tooltip.style.left = `${centerPoint.x + 7}px`;
		// 	tooltip.classList.add('top-arrow-default');
		// }

		// if (isMediumrightTop) {
		// 	// console.log('en medio derecha arriba');
		// 	tooltip.style.top = `-${centerPoint.y + 22}px`;
		// 	tooltip.style.left = `${centerPoint.x + 7}px`;
		// 	tooltip.classList.add('bottom-arrow-right-top');
		// }

		// if (isMediumleft) {
		// 	// console.log('en medio izquierda');
		// 	tooltip.style.top = `${centerPoint.y - 15}px`;
		// 	tooltip.style.left = `-${centerPoint.x + 72}px`;
		// 	tooltip.classList.add('right-arrow-medium');
		// }

		// if (isMediumleftTop) {
		// 	// console.log('en medio izquierda arriba');
		// 	tooltip.style.top = `${centerPoint.y - 56}px`;
		// 	tooltip.style.left = `-${centerPoint.x - 10}px`;
		// 	tooltip.classList.add('right-arrow-bottom');
		// }

		// if (istopMediumLeftBottom) {
		// 	// console.log('izquierda abajo');
		// 	tooltip.style.top = `${centerPoint.y}px`;
		// 	tooltip.style.left = `-${centerPoint.x + 27}px`;
		// 	tooltip.classList.add('top-arrow-medium');
		// }

		// if (istopMediumRightBottom) {
		// 	// console.log('derecha abajo');
		// 	tooltip.style.top = `${centerPoint.y}px`;
		// 	tooltip.style.left = `${centerPoint.x}px`;
		// 	tooltip.classList.add('top-arrow-left');
		// }

		// if (
		// 	!isMediumright &&
		// 	!isMediumrightTop &&
		// 	!isMediumleft &&
		// 	!isMediumleftTop &&
		// 	!istopMediumLeftBottom &&
		// 	!istopMediumRightBottom
		// ) {
		// 	tooltip.style.top = `${centerPoint.y}px`;
		// 	tooltip.style.left = `${centerPoint.x}px`;
		// 	tooltip.classList.add('top-arrow-default');
		// }

		tooltip.classList.remove('hidden');
		tooltip.classList.add('block');

		let hideTooltipTimer: NodeJS.Timeout;

		const startHideTooltipTimer = () => {
			hideTooltipTimer = setTimeout(() => {
				tooltip.classList.add('hidden');
				tooltip.classList.remove('block');
			}, 500);
		};

		tooltip.addEventListener('mouseenter', () => {
			clearTimeout(hideTooltipTimer);
		});

		tooltip.addEventListener('mouseleave', () => {
			startHideTooltipTimer();
		});
	}
};

const hiddenTooptip = () => {
	const t = document.getElementById('tp');
	if (t) {
		t.classList.remove('block');
		t.classList.add('hidden');
	}
};

const resetArrowsTooptip = () => {
	const t = document.getElementById('tp');
	if (t) {
		t.classList.remove('rightarrow');
		t.classList.remove('toparrow');
		t.classList.remove('leftarrow');
		// t.classList.remove('bottom-arrow-right-top');
		// t.classList.remove('top-arrow-left');
		// t.classList.remove('right-arrow-medium');
		// t.classList.remove('right-arrow-bottom');
		// t.classList.remove('top-arrow-medium');
		// t.classList.remove('top-arrow-default');
	}
};

const formatDate = (dateString: any) => {
	const [day, month, year] = dateString.split('/');

	const formattedDay = day.padStart(2, '0');
	const formattedMonth = month.padStart(2, '0');

	return useDateFormat(
		`${year}-${formattedMonth}-${formattedDay}`,
		'dddd DD/MM',
		{ locales: 'es-ES' },
	).value;
};

const formatTimeRange = (startTime: any, endTime: any) => {
	const convertTo24HourFormat = (time: any) => {
		const [timePart, modifier] = time.split(' ');
		let [hours, minutes] = timePart.split(':');

		if (hours === '12') {
			hours = '00';
		}
		if (modifier === 'PM') {
			hours = parseInt(hours, 10) + 12;
		}

		hours = String(hours).padStart(2, '0');

		return `${hours}:${minutes}`;
	};

	const formattedStart = convertTo24HourFormat(startTime);
	const formattedEnd = convertTo24HourFormat(endTime);

	return `${formattedStart}-${formattedEnd}h`;
};

onUpdated(() => {
	calculateAssistance();
	const contentCanvas = document.getElementById('cont_canv');
	contentCanvas?.addEventListener('mouseleave', () => {
		hiddenTooptip();
	});
});
</script>

<template aria-label="Asistencias">
	<div
		v-if="props.modalidad === 'Virtual'"
		class="flex flex-col justify-center items-center w-full !h-[100px] md:!h-[280px]"
	>
		<nuxt-icon name="CheckboxCircle" class="mr-[1.33px] text-[28px]" filled />
		<span class="text-sm text-center"
			>No hay registro de asistencia para cursos virtuales</span
		>
	</div>
	<div
		v-else-if="props.loading"
		class="w-full h-[80px] md:h-[240px] flex justify-center"
	>
		<BaseStatusLoading />
	</div>

	<ScheduleStatusError
		v-else-if="props.error || errorResponse"
		class="w-full h-[113px] md:h-[280px]"
		:text="
			errorResponse?.titulo ?? 'Lo sentimos, no pudimos cargar las asistencias.'
		"
		:description="errorResponse?.descripcion"
		:icono="errorResponse?.icono"
	/>
	<ScheduleStatusNoData
		v-else-if="!data?.length"
		class="w-full !h-[100px] md:!h-[280px]"
		text="No encontramos información de asistencias para este curso"
	/>
	<div v-else-if="data?.length">
		<div ref="element" class="costum-scroll w-full overflow-auto max-h-[338px]">
			<table class="border border-x-0 border-b-disable border-t-0">
				<tr class="border border-b-disable border-x-0 border-t-0">
					<th class="font-robotoCondensed w-1/3">FECHA</th>
					<th class="font-robotoCondensed w-1/3">HORA</th>
					<th class="font-robotoCondensed w-1/3">ESTADO</th>
				</tr>
				<tr v-for="(item, index) in data" :key="index">
					<td class="text-black text-xs md:text-sm font-telegraf capitalize">
						{{ item.dia }}
					</td>
					<td class="text-black text-xs md:text-sm font-telegraf">
						{{ item.horaInicio }} - {{ item.horaFin }} 
					</td>
					<td class="text-xs md:text-sm flex justify-center">
						<div
							v-if="props.modalidad === 'Virtual'"
							class="rounded-2xl py-1 px-2 bg-[#C2D1D9] w-min flex items-center"
						>
							<nuxt-icon name="iconNoAplica" class="mr-[1.33px]" filled />
							<span
								class="font-nunito flex justify-center min-w-[67px] text-[#333333] font-extrabold text-xs hidden md:flex"
								>No aplica</span
							>
						</div>
						<div
							v-if="
								StatusAsistencia.asistido === item.estadoAsistencia &&
								props.modalidad !== 'Virtual'
							"
							class="rounded-2xl py-1 px-2 bg-green_30 w-min flex items-center"
						>
							<nuxt-icon name="CheckboxCircle" class="mr-[1.33px]" filled />
							<span
								class="font-nunito flex justify-center min-w-[67px] text-green_70 font-extrabold text-xs hidden md:flex"
								>Asistencia</span
							>
						</div>
						<div
							v-if="
								StatusAsistencia.tardanza === item.estadoAsistencia &&
								props.modalidad !== 'Virtual'
							"
							class="rounded-2xl py-1 px-2 bg-yellow_30 w-min flex items-center"
						>
							<nuxt-icon name="Alarm" class="mr-[1.33px]" filled />
							<span
								class="font-nunito flex justify-center min-w-[67px] text-yellow_90 font-extrabold text-xs hidden md:flex"
								>Tardanza</span
							>
						</div>
						<div
							v-if="
								StatusAsistencia.falta === item.estadoAsistencia &&
								props.modalidad !== 'Virtual'
							"
							class="rounded-2xl py-1 px-2 bg-red_30 w-min flex items-center"
						>
							<nuxt-icon name="CloseCircle" class="mr-[1.33px]" filled />
							<span
								class="font-nunito flex justify-center min-w-[67px] text-error font-extrabold text-xs hidden md:flex"
								>Falta</span
							>
						</div>

						<div
							v-if="!Object.values(StatusAsistencia).includes(item.estadoAsistencia)"
							class="min-w-[29px] md:min-w-[99px] rounded-2xl py-1 px-2 bg-disable w-min"
						>
							<span class="w-full text-center text-xs">-</span>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</div>
	<!-- <div
		v-if="data"
		class="text-right pt-2 md:pt-0 pb-4 bg-extra_gray rounded-b-lg"
	>
		<div class="inline-block py-2 px-6">
			<span class="text-secondary text-sm flex gap-1"
				>*Límite de faltas permitidas:
				<p class="font-extrabold">{{ faultLimit }}</p></span
			>
		</div>
	</div> -->
</template>

<style lang="postcss" scoped>
table {
	font-family: arial, sans-serif;
	border-collapse: collapse;
	width: 100%;
}

td,
th {
	text-align: left;
	text-align: center;
	padding: 8px;
	border: none;
}

th {
	font-weight: 600;
	font-size: 14px;
}

tr:nth-child(even) {
	background-color: #f6f6f6;
}

.right-arrow-medium::after {
	content: '';
	position: absolute;
	top: 55%;
	left: 98%;
	border-width: 8px;
	border-style: solid;
	border-color: transparent transparent transparent #000000;
}

.right-arrow-bottom::after {
	content: '';
	position: absolute;
	top: 95%;
	left: 80%;
	border-width: 8px;
	border-style: solid;
	border-color: #000000 transparent transparent transparent;
}

.top-arrow-left::after {
	content: '';
	position: absolute;
	top: -15px;
	left: 8%;
	border-width: 8px;
	border-style: solid;
	border-color: transparent transparent #000000 transparent;
}

.top-arrow-default::after {
	content: '';
	position: absolute;
	top: 18px;
	left: -13%;
	border-width: 8px;
	border-style: solid;
	border-color: transparent #000000 transparent transparent;
}

.top-arrow-medium::after {
	content: '';
	position: absolute;
	top: -15px;
	left: 46%;
	border-width: 8px;
	border-style: solid;
	border-color: transparent transparent #000000 transparent;
}

.bottom-arrow-right-top::after {
	content: '';
	position: absolute;
	bottom: -15px;
	left: 2%;
	border-width: 8px;
	border-style: solid;
	border-color: #000000 transparent transparent transparent;
}

@media (min-width: 768px) {
	td {
		padding: 8px 8px;
	}

	th {
		font-size: 16px;
		padding: 16px 8px;
	}
}
</style>
