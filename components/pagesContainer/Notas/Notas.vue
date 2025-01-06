<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ExpansionNotas from './ExpansionNotas.vue';
// import { useProfileStore } from '~/stores/profile';
import dataNotasMock from "~/utils/data/dataNotasMock.json";
import dataCursosMock from "~/utils/data/dataCursosMock.json";
import type { Curso, Nota } from '~/types/cursos.types';
import type { NotaBimestre } from '~/types/notas.types';

const { $api } = useNuxtApp();

interface CursoDetails {
	codCurso: string;
	dataCurso: Curso;
	dataNotas: NotaBimestre[];
	loading: boolean;
	error: Error | null;
	openCard: boolean;
}

// const user = useUserStoreAuth();
// const profileStore = useProfileStore();

// const infoAcademica = profileStore.profileData.data?.find(
// 	(x: any) => x.id === 'infoAcademica',
// );
/* const codAlum =
	infoAcademica?.data?.find((x) => x.id === 'codigo')?.value ?? ''; */
// const codAlum = user.codAlum;
// const codigoNivel = profileStore.profileData.data?.codNivel || '';
// const codPeriodo = profileStore.profileData.data?.codPeriodoBanner || '';

const cursosTotalData = ref<CursoDetails[]>([]);
const elementNotas = ref<HTMLDivElement | null>(null);
const isScrolled = ref(false);
const codCurso = ref('');
const periodo = ref('');
const seccion = ref('');
const requestQueueNota = ref<VoidFunction[]>([]);

const servicesError: Ref<unknown> = ref(null);
const tokenStore = useTokenStore();

const callNotas = async (idAlum: number, tipoPeriodo: string, anio: number) =>
  await $api.notas.getNotasxBimestre(idAlum, tipoPeriodo, anio ,{
    lazy: true,
});

const serviceNotas = ref<any>(null);
const errorNotas = ref<any>(null);
const pendingNotas = ref<boolean>(false);
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

function getFinalAverage(notas: NotaBimestre[]) {
	return ({} as NotaBimestre);
}

// const {
// 	data: CursosData,
// 	error: errorServices,
// 	pending: pendingServices,
// } = await $api.cursos.getCursos(codAlum, codigoNivel, codPeriodo, {
// 	lazy: true,
// });

const {
	data: CursosData,
	error: errorServices,
	pending: pendingServices,
} = await $api.cursos.getCursosColegio(parseInt(tokenStore.getDataToken.Id), new Date().getFullYear() ,{
	lazy: true,
});

// function handlerScrollMove(curso: string) {
// 	if (elementNotas.value) {
// 		const elementCurItem: HTMLElement | null = document.getElementById(
// 			'cur-item-' + curso,
// 		);
// 		const itemCursoRect = elementCurItem?.getBoundingClientRect();
// 		const containerRect = elementNotas.value.getBoundingClientRect();
// 		if (itemCursoRect) {
// 			if (
// 				itemCursoRect.bottom > containerRect.bottom ||
// 				itemCursoRect.top < containerRect.top
// 			) {
// 				elementNotas.value.scrollTo({
// 					top: elementCurItem.offsetTop - elementNotas.value.offsetTop,
// 					behavior: 'smooth',
// 				});
// 			}
// 		}
// 	}
// }

async function initCallNotas(curso: Curso, status: boolean) {
	// codCurso.value = curso.codCurso;
	// periodo.value = curso.periodo;
	// seccion.value = curso.seccion;
	const indexCurso = cursosTotalData.value.findIndex(
		(x) => x.codCurso === curso.codCurso,
	);
	if (status) {
		// handlerScrollMove(curso.codCurso);
		// const { data: NotasData, error: errorServicesNotas } = await callNotas();
		const { data, error, pending } = await callNotas(parseInt(tokenStore.getDataToken.Id), 'Bimestre', new Date().getFullYear());
		onExpansionNota(indexCurso, data);
	} else {
		const dataNota = {
			...cursosTotalData.value[indexCurso],
			dataNotas: [],
			loading: true,
		};
		cursosTotalData.value.splice(indexCurso, 1, dataNota);
	}
}

async function processRequestsNotas(curso: Curso, status: boolean) {
	const notasData = cursosTotalData.value.map((items) => {
		if (items.codCurso === curso.codCurso && status) {
			return { ...items, openCard: true };
		} else {
			return { ...items, openCard: false };
		}
	});
	cursosTotalData.value = notasData;
	requestQueueNota.value.push(() => initCallNotas(curso, status));
	if (requestQueueNota.value.length === 1) {
		while (requestQueueNota.value.length > 0) {
			const currentFunction = requestQueueNota.value[0];
			try {
				await currentFunction();
			} finally {
				requestQueueNota.value.shift();
				// handlerScrollMove(curso.codCurso);
			}
		}
	}
}

function onExpansionNota(
	indexCurso: number,
	responseData: any,
) {
	console.log("Datos notas:", responseData);
				const dataNota = {
					...cursosTotalData.value[indexCurso],
					dataNotas: responseData.value.data.filter(x => x.descripcionCurso == cursosTotalData.value[indexCurso].dataCurso.descCurso && x.descripcionPeriodo == cursosTotalData.value[indexCurso].dataCurso.periodo),
					loading: false,
					error: null,
				};
				cursosTotalData.value.splice(indexCurso, 1, dataNota);
			
}

watch(CursosData, (response) => {
	if (response?.data.length) {
		console.log('response cursos home', response)
		cursosTotalData.value = response.data.map((x) => ({
			codCurso: x.codCurso,
			dataCurso: x,
			dataNotas: [],
			loading: true,
			openCard: false,
			error: null,
		}));
	}
	if (response?.error) {
		servicesError.value = response.error;
	}
});

// onMounted(() => {
//     cursosTotalData.value = dataCursosMock.map((x) => ({
// 			codCurso: x.codCurso,
// 			dataCurso: x,
// 			dataNotas: [],
// 			loading: true,
// 			openCard: false,
// 			error: null,
// 	}));
// })

</script>

<template aria-label="Notas">
	<CardHome
		title="Notas"
		url="/notas"
		width="w-full xl:w-2/3 w-[50%]"
		icon="notasIcon"
		class="overflow-hidden flex flex-col"
	>
		<div
			ref="elementNotas"
			class="flex flex-wrap gap-1 overflow-auto costum-scroll overflow-x-hidden h-full"
			:class="{
				'min-h-[268px]': !(false || servicesError),
			}"
		>
			<div
				v-if="pendingServices"
				class="w-full text-xs text-black pt-15 flex justify-center items-center"
			>
				<BaseStatusLoading />
			</div>
			<div
				v-else-if="errorServices"
				class="flex items-center justify-center w-full h-[85%]"
			>
				<BaseStatusError
					text="Lo sentimos, no pudimos cargar tus notas"
				/>
			</div>
			<div v-if="cursosTotalData.length" class="w-full pr-4">
				<ExpansionNotas
					v-for="item in cursosTotalData"
					:id="'cur-item-' + item.codCurso"
					:key="item.codCurso"
					:item="item.dataCurso"
					cod-alum="codAlum"
					:on-expansion="processRequestsNotas"
					:data-notas="item.dataNotas"
					:final-average="getFinalAverage(item.dataNotas)"
					:error="item.error"
					:loading="item.loading"
					:openCard="item.openCard"
				/>
			</div>
			<!-- <div v-else class="flex items-center justify-center w-full h-[85%]">
				<BaseStatusNoData
					:text="
						servicesError?.titulo ?? 'No tienes cursos asignados para este día'
					"
					:description="servicesError?.descripcion"
					:icono="servicesError?.icono"
				/>
			</div> -->
		</div>
	</CardHome>
</template>
