<script setup lang="ts">
// import { useProfileStore } from '~/stores/profile';
import { ref } from 'vue';
// import DetalleCurso from './DetalleCurso.vue';
import type { DataAsistencia } from '~/types/asistencia.types';
import type {
	Curso,
	Docente,
	HorarioData,
	Nota,
	NotaData,
	Participant,
} from '~/types/cursos.types';
// import type { DataResponse } from '~/types/responses.types';
import type { ErrorResponse } from '~/types/services.types';

import cursosMock from "~/utils/data/dataCursosMock.json";
import notasMock from "~/utils/data/dataNotasMock.json";
import asistenciasMock from "~/utils/data/dataAsistenciaMock.json";
import horarioMock from "~/utils/data/dataHorarioMock.json";
import NotasExpansionView from './NotasExpansionView.vue';

const { $api } = useNuxtApp();
// const user = useUserStoreAuth();
// const profileStore = useProfileStore();

interface CursoDetails {
	codCurso: string;
	dataCurso: Curso;
	dataNotas: Nota[];
	dataHorario: HorarioData[];
	dataAsistencias: DataAsistencia;
	loading: boolean;
	error: Error | null;
	errorResponse?: ErrorResponse;
	flag: boolean;
	message: string;
}

export interface ParticipantDetail {
	participants: Participant[];
	docentes: Docente[];
	loading: boolean;
	error: Error | null;
	errorResponse?: ErrorResponse;
	flag: boolean;
}

// const { handleRoute } = useBreadcrumb();

// const breadcrumb = [
// 	{ label: 'Inicio', goTo: () => handleRoute('/inicio', 'Inicio') },
// 	{ label: 'Cursos y Notas', goTo: () => {} },
// ];

let breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	// { name: 'Mis Estudios', current: false, url: '' },
	{ name: 'Cursos y Notas', current: true, url: '' },
];

// const infoAcademica = profileStore.profileData.data?.find(
// 	(x: any) => x.id === 'infoAcademica',
// );
/* const codAlum =
	infoAcademica?.data?.find((x) => x.id === 'codigo')?.value ?? ''; */

// const codAlum = user.codAlum;
// const codigoNivel = profileStore.profileData.data?.codNivel || '';
// const codPeriodo = profileStore.profileData.data?.codPeriodoBanner || '';

// const cursosTotalData = ref<CursoDetails[]>([]);
const cursosIniciadosTotalData = ref<CursoDetails[]>([]);
const cursosPorIniciarTotalData = ref<CursoDetails[]>([]);
const cursosFinalizadosTotalData = ref<CursoDetails[]>([]);
const cursosRetiradosTotalData = ref<CursoDetails[]>([]);
const requestQueueNota = ref<VoidFunction[]>([]);
const requestQueueAsis = ref<VoidFunction[]>([]);
const showDetail = ref(false);
const cursoCurrentDetail = ref<Curso>();

const openModalParticipants = ref(false);
const participantDetail = ref<ParticipantDetail>({
	participants: [],
	docentes: [],
	loading: true,
	error: null,
	flag: false,
});

const codCurso = ref('');
const nomCurso = ref('');
const periodo = ref('');
const seccion = ref('');
const modeCard = ref<'card' | 'list'>('card');

const dataCursos = ref<Curso[]>([]);

const servicesError: Ref<ErrorResponse | null> = ref(null);

const {
	data: CursosData,
	error: errorServices,
	pending: pendingServices,
} = await $api.cursos.getCursos("1" ,{
	lazy: true,
});

watch(CursosData, (response) => {
	if (response?.data.length) {
		console.log('response cursos', response)
		dataCursos.value = response.data;
		initNotasView();
	}

	if (response?.error) {
		servicesError.value = response.error;
	}
});

// async function callNotas() {
// 	const { data, error, pending } = await $api.notas.getNotas(
// 		codAlum,
// 		codCurso.value,
// 		periodo.value,
// 		seccion.value,
// 		{
// 			lazy: true,
// 		},
// 	);
// 	return { data, error, pending };
// }

// async function callHorarios() {
// 	const { data, error, pending } = await $api.horario.getHorarios(
// 		codAlum,
// 		codCurso.value,
// 		seccion.value,
// 		{
// 			lazy: true,
// 		},
// 	);
// 	return { data, error, pending };
// }

// async function callAsistencias() {
// 	const { data, error, pending } = await $api.asistencias.getAsistencias(
// 		codAlum,
// 		codCurso.value,
// 		periodo.value,
// 		seccion.value,
// 		{
// 			lazy: true,
// 		},
// 	);
// 	return { data, error, pending };
// }

// async function callParticipants() {
// 	const { data, error, pending } = await $api.participant.getParticipants(
// 		periodo.value,
// 		codCurso.value,
// 		seccion.value,
// 		{
// 			lazy: true,
// 		},
// 	);
// 	return { data, error, pending };
// }

async function initCallNotas(
	status: boolean,
	indexCurso: number,
	totalData: CursoDetails[],
) {
	// const { data: NotasData, error: errorServicesNotas } = await callNotas();
	CallNotas(status, indexCurso, notasMock, totalData);
}

async function initCallHorarios(
	status: boolean,
	indexCurso: number,
	totalData: CursoDetails[],
) {
	// const { data: HorariosData, error: errorServicesHorario } =
	// 	await callHorarios();
	CallHorarios(
		status,
		indexCurso,
		horarioMock,
		//errorServicesHorario,
		totalData
	);
}

function CallAsistencias(
	status: boolean,
	indexCurso: number,
	asistenciaData: any,
	// asistenciaData: globalThis.Ref<DataResponse<DataAsistencia> | null>,
	// error: globalThis.Ref<Error | null>,
	totalData: CursoDetails[],
) {
	// if (status) {
	// 	const unwatch = watch(
	// 		asistenciaData,
	// 		(response) => {
	// 			if (response?.flag) {
					const dataNota = {
						...totalData[indexCurso],
						dataAsistencias: asistenciaData,
						loading: false,
						error: null,
					};
					totalData.splice(indexCurso, 1, dataNota);
	// 			}
	// 			if (response?.error || error.value) {
	// 				const dataNota = {
	// 					...totalData[indexCurso],
	// 					dataAsistencias: response?.data,
	// 					loading: false,
	// 					error: error.value,
	// 					errorResponse: response?.error,
	// 				};
	// 				totalData.splice(indexCurso, 1, dataNota);
	// 			}
	// 		},
	// 		{ immediate: true },
	// 	);
	// 	unwatch();
	// } else {
	// 	const dataNota = {
	// 		...totalData[indexCurso],
	// 		dataAsistencias: {} as DataAsistencia,
	// 		loading: true,
	// 	};
	// 	totalData.splice(indexCurso, 1, dataNota);
	// }
}

async function initCallAsistencias(
	status: boolean,
	indexCurso: number,
	totalData: CursoDetails[],
) {
	// const { data: AsistenciasData, error: errorServicesAsistencia } =
	// 	await callAsistencias();

	CallAsistencias(
		status,
		indexCurso,
		asistenciasMock,
		// AsistenciasData,
		// errorServicesAsistencia,
		totalData,
	);
}

// async function initCallParticipants() {
// 	const { data: ParticipantsData, error: errorServicesParticipant } =
// 		await callParticipants();
// 	CallParticipants(ParticipantsData, errorServicesParticipant);
// }

function CallHorarios(
	status: boolean,
	indexCurso: number,
	dataHorario: any,
	// responseHorario: globalThis.Ref<DataResponse<HorarioData[]> | null>,
	// error: globalThis.Ref<Error | null>,
	totalData: CursoDetails[],
) {
	// if (status) {
	// 	const unwatch = watch(
	// 		responseHorario,
	// 		(response) => {
				let dataNota: any = {
					...totalData[indexCurso],
				};
				//if (response?.flag) {
					dataNota = {
						...dataNota,
						dataHorario: dataHorario,
						loading: false,
						error: null,
						flag: true,
						message: '',
					//};
	// 			} else {
	// 				dataNota = {
	// 					...dataNota,
	// 					dataHorario: response?.data,
	// 					loading: false,
	// 					error: error.value,
	// 					errorResponse: response?.error,
	// 					flag: false,
	// 					message: response?.message,
	// 				};
	// 			}
	// 			totalData.splice(indexCurso, 1, dataNota);
	// 		},
	// 		{ immediate: true },
	// 	);
	// 	unwatch();
	// } else {
	// 	const dataNota = {
	// 		...totalData[indexCurso],
	// 		dataHorario: [],
	// 		loading: true,
	// 	};
	// 	totalData.splice(indexCurso, 1, dataNota);
	// }
}}

function CallNotas(
	status: boolean,
	indexCurso: number,
	dataNotas: any,
	// responseNotas: globalThis.Ref<DataResponse<NotaData> | null>,
	// error: globalThis.Ref<Error | null>,
	totalData: CursoDetails[],
) {
	// if (status) {
	// 	const unwatch = watch(
	// 		responseNotas,
	// 		(response) => {
				// if (response?.flag) {
					const dataNota = {
						...totalData[indexCurso],
						dataNotas: dataNotas.notas,
						loading: false,
						error: null,
					};
					totalData.splice(indexCurso, 1, dataNota);
				//}
				// if (response?.error || error.value) {
				// 	const dataNota = {
				// 		...totalData[indexCurso],
				// 		dataNotas: response?.data.notas,
				// 		loading: false,
				// 		error: error.value,
				// 		errorResponse: response?.error,
				// 	};
				// 	totalData.splice(indexCurso, 1, dataNota);
				// }
		// 	},
		// 	{ immediate: true },
		// );
		// unwatch();
	// } else {
	// 	const dataNota = {
	// 		...totalData[indexCurso],
	// 		dataNotas: [],
	// 		loading: true,
	// 	};
	// 	totalData.splice(indexCurso, 1, dataNota);
	// }
}

// function CallParticipants(
// 	participantData: globalThis.Ref<DataResponse<Participant[]> | null>,
// 	_error: globalThis.Ref<Error | null>,
// ) {
// 	const unwatch = watch(
// 		participantData,
// 		(response) => {
// 			if (response?.flag) {
// 				participantDetail.value = {
// 					...participantDetail.value,
// 					participants: response.data,
// 					loading: false,
// 					error: _error.value,
// 					flag: response.flag,
// 				};
// 			}
// 			if (!response?.flag) {
// 				participantDetail.value = {
// 					...participantDetail.value,
// 					participants: [],
// 					loading: false,
// 					error: _error.value,
// 					flag: false,
// 				};
// 			}
// 			if (response?.error || _error.value) {
// 				participantDetail.value = {
// 					...participantDetail.value,
// 					participants: [],
// 					loading: false,
// 					error: _error.value,
// 					errorResponse: response?.error,
// 					flag: response?.flag ?? false,
// 				};
// 			}
// 		},
// 		{ immediate: true },
// 	);
// 	unwatch();
// }

async function processRequestsNotas(
	status: boolean,
	indexCurso: number,
	totalData: CursoDetails[],
) {
	requestQueueNota.value.push(() =>
		initCallNotas(status, indexCurso, totalData),
	);
	if (requestQueueNota.value.length === 1) {
		while (requestQueueNota.value.length > 0) {
			const currentFunction = requestQueueNota.value[0];
			try {
				await currentFunction();
			} finally {
				requestQueueNota.value.shift();
			}
		}
	}
}

async function processRequestsAsistencia(
	status: boolean,
	indexCurso: number,
	totalData: CursoDetails[],
) {
	requestQueueAsis.value.push(() =>
		initCallAsistencias(status, indexCurso, totalData),
	);
	if (requestQueueAsis.value.length === 1) {
		while (requestQueueAsis.value.length > 0) {
			const currentFunction = requestQueueAsis.value[0];
			try {
				await currentFunction();
			} finally {
				requestQueueAsis.value.shift();
			}
		}
	}
}

function onExpansionNota(
	curso: Curso,
	status: boolean,
	tab: number,
	totalData: CursoDetails[],
) {
	const indexCurso = totalData.findIndex((x) => x.codCurso === curso.codCurso);
	const dataNota = {
		...totalData[indexCurso],
		loading: true,
		errorResponse: undefined,
		error: null,
	};
	totalData.splice(indexCurso, 1, dataNota);

	if (status) {
		codCurso.value = curso.codCurso;
		periodo.value = curso.periodo;
		seccion.value = curso.seccion;
	}

	if (tab === 1) {
		initCallHorarios(status, indexCurso, totalData);
	}
	if (tab === 2) {
		// initCallAsistencias(status, indexCurso, totalData);
		processRequestsAsistencia(status, indexCurso, totalData);
	}
	if (tab === 3) {
		// initCallNotas(status, indexCurso, totalData);
		processRequestsNotas(status, indexCurso, totalData);
	}
	if (!status) {
		const dataNota_ = {
			...dataNota,
			dataNotas: [],
			loading: true,
			errorResponse: undefined,
			error: null,
		};
		totalData.splice(indexCurso, 1, dataNota_);
	}
}

const initNotasView = () => {
	const dataCursos_ = dataCursos.value;//cursosMock;
	const cursosIniciados = dataCursos_.filter(
			(x) => x.statusCurso === 'Iniciado',
		);
		const cursosPorIniciar = dataCursos_.filter(
			(x) => x.statusCurso === 'Por iniciar',
		);
		const cursosFinalizados = dataCursos_.filter(
			(x) => x.statusCurso === 'Finalizado',
		);
		const cursosRetirados = dataCursos_.filter(
			(x) => x.statusCurso === 'Retirado',
		);

		cursosIniciadosTotalData.value = cursosIniciados.map((x) => ({
			codCurso: x.codCurso,
			dataCurso: x,
			dataNotas: [],
			dataHorario: [],
			dataAsistencias: {} as DataAsistencia,
			loading: true,
			error: null,
			flag: false,
			message: '',
		}));

		cursosPorIniciarTotalData.value = cursosPorIniciar.map((x) => ({
			codCurso: x.codCurso,
			dataCurso: x,
			dataNotas: [],
			dataHorario: [],
			dataAsistencias: {} as DataAsistencia,
			loading: true,
			error: null,
			flag: false,
			message: '',
		}));

		cursosFinalizadosTotalData.value = cursosFinalizados.map((x) => ({
			codCurso: x.codCurso,
			dataCurso: x,
			dataNotas: [],
			dataHorario: [],
			dataAsistencias: {} as DataAsistencia,
			loading: true,
			error: null,
			flag: false,
			message: '',
		}));

		cursosRetiradosTotalData.value = cursosRetirados.map((x) => ({
			codCurso: x.codCurso,
			dataCurso: x,
			dataNotas: [],
			dataHorario: [],
			dataAsistencias: {} as DataAsistencia,
			loading: true,
			error: null,
			flag: false,
			message: '',
		}));
}


function onOpenModalParticipants(curso: Curso) {
	openModalParticipants.value = true;
	codCurso.value = curso.codCurso;
	nomCurso.value = curso.descCurso;
	periodo.value = curso.periodo;
	seccion.value = curso.seccion;
	participantDetail.value.docentes = curso.docente;
	// initCallParticipants();
}

function closeModal() {
	openModalParticipants.value = false;
	participantDetail.value = {
		participants: [],
		docentes: [],
		loading: true,
		error: null,
		flag: false,
	};
}

const activeMode = (mode: 'card' | 'list') => {
	modeCard.value = mode;
};

const goDetail = (data: Curso) => {
	showDetail.value = true;
	const breadcrumbsItem_ = [...breadcrumbsItem];
	breadcrumbsItem_[1].current = false;
	breadcrumbsItem_[1].url = '/notas';
	breadcrumbsItem_.splice(2, 0, {
		name: data.descCurso,
		current: true,
		url: '',
	});
	breadcrumbsItem = breadcrumbsItem_;
	cursoCurrentDetail.value = data;
};

const hiddenDetail = (title: string) => {
	if (title === 'Cursos y Notas') {
		const breadcrumbsItem_ = [...breadcrumbsItem];
		breadcrumbsItem_[1].current = true;
		breadcrumbsItem_[1].url = '';
		breadcrumbsItem_.splice(2, 1);
		breadcrumbsItem = breadcrumbsItem_;
		showDetail.value = false;
		cursoCurrentDetail.value = undefined;
	}
};

const isLargeScreen = useMediaQuery('(min-width: 1024px)');

onMounted(() => {
	window.addEventListener('resize', () => {
		window.innerWidth < 1024 && (modeCard.value = 'card');
	});
});
</script>

<template aria-label="NotasView">
	<BaseBreadcrumbs :items="breadcrumbsItem"/>
	<div v-if="!showDetail" class="pb-[38px]">
		<BaseTabMyStudies />
		<div class="flex justify-between items-center">
			<div>
				<BaseTitle text="CURSOS Y NOTAS" />
				<div class="font-nunito mb-4 text-sm leading-[22px]">
					Nota mínima aprobatoria: 12
				</div>
			</div>

		</div>
		<div class="flex flex-wrap px-3 md:px-0 gap-7">
			<!--<div v-if="pendingServices" class="w-full h-[240px] flex justify-center">
				<BaseStatusLoading />
			</div>
			<ScheduleStatusError
				v-else-if="errorServices || servicesError"
				class="w-full"
				:text="`${
					servicesError
						? servicesError.titulo
						: 'Lo sentimos, no pudimos cargar tus cursos.'
				}`"
				:description="`${
					servicesError
						? servicesError.descripcion
						: 'Inténtalo de nuevo más tarde'
				}`"
				:icono="servicesError ? servicesError.icono : null"
			/>

			<ScheduleStatusNoData
				v-else-if="
					!cursosIniciadosTotalData.length &&
					!cursosPorIniciarTotalData.length &&
					!cursosFinalizadosTotalData.length &&
					!cursosRetiradosTotalData.length
				"
				class="w-full"
				text="No tienes cursos asignados"
			/>-->


			<NotasExpansionView
				v-for="(curso, index) in cursosIniciadosTotalData"
				:id="`init-${index + 1}`"
				:key="index"
				:item="curso.dataCurso"
				:onExpansion="
					(curso, status, tab) =>
						onExpansionNota(curso, status, tab, cursosIniciadosTotalData)
				"
				:data-notas="curso.dataNotas"
				:data-horario="curso.dataHorario"
				:data-asistencias="curso.dataAsistencias"
				:loading="curso.loading"
				:error="curso.error"
				:error-response="curso.errorResponse"
				:flag="curso.flag"
				:message="curso.message"
				:on-open-modal-participants="onOpenModalParticipants"
			/>

			<NotasExpansionView
				v-for="(curso, index) in cursosPorIniciarTotalData"
				:id="`tostart-${index + 1}`"
				:key="index"
				:item="curso.dataCurso"
				:onExpansion="
					(curso, status, tab) =>
						onExpansionNota(curso, status, tab, cursosPorIniciarTotalData)
				"
				:data-notas="curso.dataNotas"
				:data-horario="curso.dataHorario"
				:data-asistencias="curso.dataAsistencias"
				:loading="curso.loading"
				:error="curso.error"
				:error-response="curso.errorResponse"
				:flag="curso.flag"
				:message="curso.message"
				:on-open-modal-participants="onOpenModalParticipants"
			/>

			<div v-if="cursosFinalizadosTotalData.length" class="w-full">
				<div
					class="w-min mb-5 bg-black font-grotesk text-white leading-[18px] font-semibold text-lg px-1 py-2"
				>
					FINALIZADOS
				</div>

				<div class="flex flex-wrap gap-10">
					<NotasExpansionView
						v-for="(curso, index) in cursosFinalizadosTotalData"
						:id="`completed-${index + 1}`"
						:key="index"
						:item="curso.dataCurso"
						:onExpansion="
							(curso, status, tab) =>
								onExpansionNota(curso, status, tab, cursosFinalizadosTotalData)
						"
						:data-notas="curso.dataNotas"
						:data-horario="curso.dataHorario"
						:data-asistencias="curso.dataAsistencias"
						:loading="curso.loading"
						:error="curso.error"
						:error-response="curso.errorResponse"
						:flag="curso.flag"
						:message="curso.message"
						:on-open-modal-participants="onOpenModalParticipants"
					/>
				</div>
			</div>

			<div v-if="cursosRetiradosTotalData.length" class="w-full">
				<div
					class="w-min mb-5 bg-black font-grotesk text-white leading-[18px] font-semibold text-lg px-1 py-2"
				>
					RETIRADOS
				</div>
				<div class="flex flex-wrap gap-10">
					<NotasExpansionView
						v-for="(curso, index) in cursosRetiradosTotalData"
						:id="`retired-${index + 1}`"
						:key="index"
						:disable="true"
						:item="curso.dataCurso"
						:onExpansion="
							(curso, status, tab) =>
								onExpansionNota(curso, status, tab, cursosRetiradosTotalData)
						"
						:data-notas="curso.dataNotas"
						:data-horario="curso.dataHorario"
						:data-asistencias="curso.dataAsistencias"
						:loading="curso.loading"
						:error="curso.error"
						:error-response="curso.errorResponse"
						:flag="curso.flag"
						:message="curso.message"
						:on-open-modal-participants="onOpenModalParticipants"
					/>
				</div>
			</div>
			<div class="text-sm text-black leading-[18px]">
				*Para dudas con tus cursos, consúltalo en
				<a
					href="https://www.google.com/"
					target="_blank"
					class="text-blue_link underline decoration-solid decoration-blue_link"
					>Contacto Estudiante</a
				>
				con nuestros “accesos rápidos”, o comunícate con nosotros en los medios
				de contacto ubicados en el botón del menú “¿Necesitas ayuda?”.
			</div>
		</div>
	</div>
	<!-- <DetalleCurso
		v-if="showDetail && cursoCurrentDetail"
		:item="cursoCurrentDetail"
		:on-open-modal-participants="onOpenModalParticipants"
	/> -->
	<!-- <ModalListParticipants
		:show="openModalParticipants"
		:nom-curso="nomCurso"
		:data-participants="participantDetail"
		:on-close="closeModal"
	/> -->
</template>
<style lang="postcss" scoped>
.filter-gray-10 {
	filter: brightness(0) saturate(100%) invert(100%) sepia(13%) saturate(141%)
		hue-rotate(173deg) brightness(116%) contrast(100%);
}
</style>
