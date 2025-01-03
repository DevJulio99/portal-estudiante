<script setup lang="ts">
import { ref } from 'vue';
import TableNotas from './TableNotas.vue';
import type { DataAsistencia } from '~/types/asistencia.types';
import type { Curso, CursoAsistencia, HorarioData, Nota } from '~/types/cursos.types';
import CursoDetail from '../Cursos/CursoDetail.vue';
import type { ErrorResponse, DataResponse } from '~/types/services.types';

interface Option {
	id: number;
	name: string;
}

const props = defineProps<{
	id: string;
	item: Curso;
	dataNotas: Nota[];
	dataAsistencias: DataAsistencia;
	dataHorario: HorarioData[];
	loading: boolean;
	error: Error | null;
	errorResponse?: ErrorResponse;
	flag: boolean;
	message: string;
	disable?: boolean;
	onExpansion: (curso: Curso, status: boolean, tab: number) => void;
	onOpenModalParticipants: (curso: Curso) => void;
}>();

const openExpansion = ref(false);
const currentOption = ref<Option | null>();
const showTooptipWarn = ref(true);
const pendingAsistencia = ref<boolean>(true);
const serviceAsistencia = ref<DataResponse<CursoAsistencia[]> | null>();
const dataAsistencia = ref<CursoAsistencia[]>([]);
const { $api } = useNuxtApp();


const callAsistencias = async (idAlum: number, bimestre: string, anio: number) =>
  await $api.asistencia.getCursoAsistencia(idAlum, bimestre,anio ,{
    lazy: true,
});

const optionsNotas = [
	{
		id: 1,
		name: 'Detalle',
	},
	{
		id: 2,
		name: 'Asistencias',
	},
	{
		id: 3,
		name: 'Notas',
	},
];

if (props.item.modalidad === 'Virtual') {
	optionsNotas.splice(1, 1);
}

async function actionExpansion(option: Option) {
	if (option.id !== currentOption.value?.id) {
		currentOption.value = option;
		openExpansion.value = true;
	} else {
		currentOption.value = null;
		openExpansion.value = !openExpansion.value;
		pendingAsistencia.value = true;
		serviceAsistencia.value = null;
	}

	if(option.id == 2 && currentOption.value){
		const { data, error, pending } = await callAsistencias(2, 'Bimestre 3 - 2024'/*props.item.periodo*/, 2024);
		setTimeout(() => {
			serviceAsistencia.value = data.value;
		}, 0);
		pendingAsistencia.value = pending.value;

		const unWatch = watch(serviceAsistencia, (response) => {
             if (response) {
				console.log('response asistencia', response);
				 dataAsistencia.value = response.data;
             }
             if (!response) {
               unWatch();
             }
        });
	}

	props.onExpansion(
		props.item,
		openExpansion.value,
		currentOption.value?.id ?? 0,
	);
}
</script>

<template aria-label="NotasExpansionView">
	<div
		class="border border-disable w-full rounded-lg"
		:class="dataNotas.length ? 'mb-6 sm:mb-0' : ''"
	>
		<!-- overflow-hidden -->
		<div>
			<div
				class="transition-colors flex flex-wrap items-center bg-extra_gray pt-6 px-6 pb-[14px] rounded-lg"
			>
				<div class="w-full flex justify-between">
					<div class="flex items-center">
						<div
							class="w-fit rounded-2xl py-1 px-2"
							:class="
								disable
									? 'bg-disable'
									: item.modalidad == 'Presencial'
										? 'bg-turquoise text-black'
										: item.modalidad == 'Remoto'
											? 'bg-violet_100 text-white'
											: 'bg-blue_link text-white'
							"
						>
							<p class="text-[10px] leading-[11px] font-extrabold">
								<b>{{ item.modalidad }}</b>
							</p>
						</div>
					</div>
					<div
						v-if="item.tieneHorario || item.modalidad == 'Virtual'"
						class="flex items-center"
					>
						<div
							class="w-fit rounded-2xl py-1 px-2"
							:class="{
								'bg-[#C1F1CB]':
									item.statusCurso == 'Habilitado' ||
									item.statusCurso == 'Iniciado',
								'bg-yellow_30': item.statusCurso == 'Por iniciar',
								'bg-[#FCCFCF]': item.statusCurso == 'Finalizado',
								'bg-disable': item.statusCurso == 'Retirado',
							}"
						>
							<p
								:class="{
									'text-green_70':
										item.statusCurso == 'Habilitado' ||
										item.statusCurso == 'Iniciado',
									'text-yellow_90': item.statusCurso == 'Por iniciar',
									'text-error': item.statusCurso == 'Finalizado',
									'text-dark_100': item.statusCurso == 'Retirado',
								}"
								class="text-[12px] leading-[16px] text-black font-whitney"
							>
								<b>{{ item.statusCurso }}</b>
							</p>
						</div>
					</div>
				</div>

				<div class="w-full font-extrabold text-sm md:text-base text-black mt-2">
					{{ item.descCurso }}
				</div>
				<div class="relative text-neutral text-sm flex items-center gap-1">
					<span>{{ item.seccion }}</span>
					<div v-if="showTooptipWarn" class="relative icon-warn">
						<nuxt-icon
							class="cursor-pointer text-[20px]"
							name="questionIcon"
							filled
						/>
						<div
							class="dtooltip rounded text-center absolute text-[12px] w-[177px] left-[-78px] top-auto bottom-[28px] z-10 bg-black text-white py-2 px-[16px]"
						>
							<div class="flex flex-col gap-2">
								<span
									>Código identificador del curso para gestiones de reclamos o
									problemas.</span
								>
								<span>Código de Sección: {{ item.seccion }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="px-6 flex flex-wrap gap-[5px] justify-between pb-2 bg-extra_gray"
			>
				<div
					role="button"
					class="w-full md:w-auto flex flex-wrap items-center gap-1"
					@click="() => onOpenModalParticipants(item)"
				>
					<nuxt-icon name="team" filled />
					<span
						class="cursor-pointer text-blue_light text-[12px] md:text-sm underline"
						>Ver lista de participantes</span
					>
				</div>

				<div v-if="item.modalidad !== 'Virtual'" class="flex">
					<div
						class="text-[12px] md:text-sm text-black pl-2 pr-[4px] flex items-center"
					>
						Inasistencias:
					</div>
					<div
						class="flex justify-center text-lg items-center font-bold"
						:class="disable ? 'text-neutral' : 'text-error-dark'"
					>
						{{ item.inasistencias }}
					</div>
				</div>

				<div class="flex bg-white">
					<div
						class="text-[12px] md:text-sm text-black pl-2 pr-[12px] flex items-center"
					>
						Promedio:
					</div>
					<div
						class="flex justify-center text-sm items-center w-[46px] h-[36px] font-extrabold"
						:class="
							item.statusCurso !== 'Finalizado'
								? 'bg-disable'
								: item.notaFinal < 12
									? 'bg-error'
									: 'bg-[#00A5E4]'
						"
					>
						{{ item.statusCurso == 'Finalizado' ? item.notaFinal : '-' }}
					</div>
				</div>
			</div>
		</div>
		<div
			class="flex gap-1 bg-extra_gray rounded-b-lg overflow-hidden"
			:class="openExpansion && 'pb-1'"
		>
			<div
				v-for="(option, index) in optionsNotas"
				:key="index"
				role="button"
				:class="currentOption?.id === option.id && '!bg-teal-900'"
				class="w-full transition-colors bg-white text-black flex justify-center py-2 cursor-pointer"
				@click="actionExpansion(option)"
			>
				<div class="flex gap-[5px] md:gap-2 items-center">
					<span
						:class="currentOption?.id === option.id && 'text-white'"
						class="text-black font-extrabold text-xs md:text-sm"
						>{{ option.name }}</span
					>
					<nuxt-icon
						name="NavArrowDown"
						class="no-margin"
						:class="
							currentOption?.id === option.id ? 'rotate-180 text-white' : ''
						"
					/>
				</div>
			</div>
		</div>

		<div v-if="openExpansion" class="w-full">
			<PagesContainerCursosCursoDetail
				v-if="currentOption?.id === 1"
				:item="item"
				:data-horario="dataHorario || []"
				:loading="false"
				:error="error"
				:error-response="errorResponse"
				:flag="flag"
				:message="message"
			/>
			<span v-if="currentOption?.id === 2">
				<PagesContainerNotasAsistencias
					:data="dataAsistencia"
					:curso="item.descCurso"
					:loading="pendingAsistencia"
					:error="error"
					:error-response="errorResponse"
					:modalidad="props.item.modalidad"
				/>
			</span>
			<div v-if="currentOption?.id === 3">
				<!-- <div
					v-if="loading"
					class="w-full h-[80px] md:h-[240px] flex justify-center"
				>
					<BaseStatusLoading />
				</div>
				<ScheduleStatusError
					v-else-if="error || errorResponse"
					class="w-full h-[113px] md:h-[280px]"
					:text="
						errorResponse?.titulo ?? 'Lo sentimos, no pudimos cargar tus notas.'
					"
					:description="errorResponse?.descripcion"
					:icono="errorResponse?.icono"
				/>
				<ScheduleStatusNoData
					v-else-if="!dataNotas.length"
					class="w-full !h-[100px] md:!h-[280px]"
					text="Estamos trabajando en el detalle de este contenido"
				/> -->
				<TableNotas
					v-if="dataNotas.length"
					:id-table="id"
					:item="dataNotas"
					:curso="item.descCurso"
					:modalidad="item.statusCurso"
				/>
			</div>
		</div>
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
	transform: translateX(-60%);
	left: 50%;
}

@media (min-width: 768px) {
	.dtooltip::after {
		left: 10%;
	}
}

@media (min-width: 1024px) {
	.dtooltip::after {
		left: 10%;
	}
}

@media (min-width: 1024px) {
	.dtooltip {
		left: -80px;
		&::after {
			left: 50%;
		}
	}
}

.icon-warn:hover .dtooltip {
	visibility: visible;
}
</style>
