<script setup lang="ts">
import HorarioCurso from './HorarioCurso.vue';
import type { ErrorResponse } from '~/types/services.types';
import type { Curso, HorarioData } from '~/types/cursos.types';

const props = defineProps<{
	item: Curso;
	dataHorario: HorarioData[];
	loading: boolean;
	error: Error | null;
	errorResponse?: ErrorResponse;
	flag: boolean;
	message: string;
	seeParticipants: (data: Curso) => void;
}>();

const selectDocente = ref(props.item.docente[0] ?? '');
const showTooptipWarn = ref(false);
const showCopyEnabled = ref(false);

async function copyEmail() {
	await navigator.clipboard.writeText(selectDocente.value.emailDocente);
	showCopyEnabled.value = true;
	setTimeout(() => {
		showCopyEnabled.value = false;
	}, 2000);
}

function getOrdinalWithLabel(number: string | number): string {
	const actualNumber =
		typeof number === 'string' ? parseInt(number, 10) : number;
	if (actualNumber === 0) {
		return 'Ciclo 0';
	}

	const suffixes = [
		'',
		'er',
		'do',
		'er',
		'to',
		'to',
		'to',
		'mo',
		'vo',
		'no',
		'mo',
	];
	const v = actualNumber % 100;
	const ordinal =
		actualNumber + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
	return `${ordinal} ciclo`;
}

function formatCredits(credits: string | number): string {
	const creditsNumber =
		typeof credits === 'string' ? parseInt(credits, 10) : credits;
	return `${creditsNumber} Créd`;
}

function formatCantidadVeces(veces: string | number): string {
	const vecesNumber = typeof veces === 'string' ? parseInt(veces, 10) : veces;
	vecesNumber === 3 && (showTooptipWarn.value = true);
	const ordinalSuffixes = [
		'',
		'ra',
		'da',
		'ra',
		'ta',
		'ta',
		'ta',
		'ma',
		'va',
		'na',
		'ma',
	];

	if (vecesNumber === 0) {
		return '0 veces';
	}

	return `${vecesNumber}${
		ordinalSuffixes[vecesNumber % 100] ||
		ordinalSuffixes[vecesNumber] ||
		ordinalSuffixes[0]
	} vez`;
}
</script>

<template aria-label="CursoDetail">
	<!-- <div v-if="loading" class="w-full h-[80px] md:h-[240px] flex justify-center">
		<BaseStatusLoading />
	</div> -->
	<div v-if="!loading" class="py-4 px-6 flex flex-wrap gap-4">
		<div class="w-full flex flex-wrap gap-4 justify-between">
			<div class="w-full md:max-w-[389px]">
				<span class="text-xs text-secondary block">Docente</span>
				<div
					v-if="item.docente.length > 1"
					class="block text-[14px] text-black font-extrabold"
				>
					<select
						id="docentes"
						v-model="selectDocente"
						class="select-curso w-full border border-black rounded p-2 outline-none"
						name="docentes"
					>
						<optgroup>
							<option
								v-for="(docente, index) in item.docente"
								:key="index"
								:value="docente"
							>
								{{ docente.nombresDocentes }}
							</option>
						</optgroup>
					</select>
				</div>
				<span
					v-else-if="item.docente.length == 1"
					class="text-sm font-extrabold"
				>
					{{ item.docente[0].nombresDocentes ?? '' }}
				</span>
				<span v-else>
					<span class="text-black font-extrabold">-</span>
				</span>
			</div>

			<div class="w-full md:flex-1">
				<span class="block text-xs text-secondary">Correo del docente</span>
				<span class="block text-sm text-black font-extrabold">
					<div class="flex items-center gap-[9px]">
						<p v-if="selectDocente.emailDocente">
							{{ selectDocente.emailDocente }}
						</p>
						<p v-else>-</p>
						<div class="relative">
							<nuxt-icon
								v-if="selectDocente.emailDocente"
								role="button"
								class="cursor-pointer"
								name="MultipleBlank"
								filled
								@click="copyEmail"
							/>
							<div
								v-if="showCopyEnabled"
								class="flex gap-1 absolute p-2 bg-black text-white right-0 text-xs rounded"
							>
								<nuxt-icon class="cursor-pointer" name="CheckWhite" filled />
								Copiado
							</div>
						</div>
					</div>
				</span>
			</div>
		</div>

		<div class="w-full">
			<div v-if="item.modalidad == 'Virtual'" class="text-xs text-black">
				Horario
				<div class="text-sm text-black">
					Tus cursos virtuales no tienen horario fijo. Para ver el contenido del
					curso ingresa en cualquier momento al
					<a
						href="https://upn.blackboard.com/auth-saml/saml/login?apId=_111_1&redirectUrl=https%3A%2F%2Fupn.blackboard.com%2Fultra"
						target="_blank"
						class="text-blue_link underline decoration-blue_link"
						>aula Virtual (Blackboard)</a
					>
				</div>
			</div>
			<horario-curso
				v-else
				:dataHorario="dataHorario"
				:error="error"
				:errorResponse="errorResponse"
				:loading="loading"
				:message="message"
				:modalidad="item.modalidad"
			/>
		</div>

		<div class="w-[77px] md:w-[187px]">
			<span class="block text-xs text-secondary">Ciclo</span>
			<span class="block text-sm text-black font-extrabold">{{
				getOrdinalWithLabel(item.ciclo)
			}}</span>
		</div>

		<div class="w-[77px] md:w-[187px]">
			<span class="block text-xs text-secondary">Créditos</span>
			<span class="block text-sm text-black font-extrabold">{{
				formatCredits(item.creditos)
			}}</span>
		</div>

		<div class="w-[70px] md:w-[187px]">
			<span class="block text-xs text-secondary">Cursado por</span>
			<div class="relative flex gap-2">
				<span class="block text-sm text-black font-extrabold">
					{{ formatCantidadVeces(item.cantidadVeces) }}
				</span>
				<div v-if="showTooptipWarn" class="relative icon-warn">
					<nuxt-icon class="cursor-pointer" name="ErrorWarning" filled />
					<div
						class="dtooltip rounded text-center absolute text-[12px] w-[177px] left-[-130px] md:left-[-8px] top-auto bottom-[23px] z-10 bg-black text-white py-2 px-[16px]"
					>
						Recuerda que si desapruebas un curso por tercera vez tendrás la
						condición de baja académica. Revisa más información
						<a
							href="https://contacto.upn.edu.pe/cursos-y-notas/que-sucede-si-desaprobe-un-curso-por-tercera-vez"
							target="_blank"
							class="text-primary underline decoration-solid decoration-primary"
							>aquí.</a
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.select-curso {
	font-size: 12px;
	appearance: none;
	background-image: url('../../../assets/icons/arrowDownBlack.svg');
	background-repeat: no-repeat;
	background-position-x: 95%;
	background-position-y: 50%;
}

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
	left: 78%;
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

.filter-blue-60 {
	filter: brightness(0) saturate(100%) invert(17%) sepia(99%) saturate(2794%)
		hue-rotate(199deg) brightness(92%) contrast(103%);
}
</style>
