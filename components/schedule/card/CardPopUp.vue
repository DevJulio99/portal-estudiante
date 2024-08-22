<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import type { DetalleHorario, Professor } from '~/types/cursos.types';

const props = defineProps<{
	course: DetalleHorario;
	closePopup: () => void;
}>();
const showTooptipWarn = ref(true);
const breakpoints = useBreakpoints(breakpointsTailwind);
const smallerThanLg = breakpoints.smaller('lg');
const msgCopy = ref<{ text: null | string; id: string | null }>({
	text: null,
	id: null,
});

let timeOut: string | number | NodeJS.Timeout | undefined;
const copy = (text: string) => {
	clearTimeout(timeOut);
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Copy-HorarioPopup',
	// 		page_url: `${window.location.href}`,
	// 		section: props.course.descripMateria,
	// 		title: 'email Docente',
	// 	});
	// }
	try {
		navigator.clipboard.writeText(text);
		msgCopy.value.text = `copiado`;
		msgCopy.value.id = text;
	} catch {
		msgCopy.value.text = 'No se pudo copiar';
		msgCopy.value.id = text;
	} finally {
		timeOut = setTimeout(() => {
			msgCopy.value.text = null;
			msgCopy.value.id = null;
		}, 2000);
	}
};
const selectedProfessor = ref<Professor>(props.course.profesor[0]);
const handleChange = (e: any) => {
	selectedProfessor.value = props.course.profesor[e.target.value ?? 0];
};

const eventClick = () => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Select-HorarioPopup',
	// 		page_url: `${window.location.href}`,
	// 		section: props.course.descripMateria,
	// 		title: 'Docente',
	// 	});
	// }
};

const eventClickCorreo = () => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Url-HorarioPopup',
	// 		page_url: `${window.location.href}`,
	// 		section: props.course.descripMateria,
	// 		title: 'email docente',
	// 	});
	// }
};

const eventClickRemoto = (title: string, url: string) => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Remoto-HorarioPopup',
	// 		page_url: `${window.location.href}`,
	// 		section: props.course.descripMateria,
	// 		url,
	// 		title,
	// 	});
	// }
};

const target = ref(null);
onClickOutside(target, () => props.closePopup());
onMounted(() => {
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.add('overflow-hidden');
});
</script>
<template>
	<div class="content-popup">
		<div
			ref="target"
			class="popup-schedule"
			:class="{
				'mobile-popup': smallerThanLg,
			}"
		>
			<button @click.stop="closePopup">
				<NuxtIcon class="close-schedule-popup" name="navClose" />
			</button>

			<div class="px-[32px] pb-[65px] lg:pb-[40px]">
				<span
					class="fon-telegraf text-[#000] text-[0.625rem] font-bold px-[8px] py-[4px] rounded-[16px]"
					:class="{
						'bg-primary': course.descripMetodoEducativo === 'Presencial',
						'bg-[#D191FF]': course.descripMetodoEducativo === 'Remoto',
					}"
				>
					{{ course.descripMetodoEducativo }}
				</span>
				<h4 class="card-title-popup" :title="course.descripMateria">
					{{ course.descripMateria }}
				</h4>
				<div
					class="font-telegraf text-[#4F6168] text-sm mb-4 flex items-center gap-1"
				>
					<span>{{ course.codSeccion }}</span>
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
								<span>Código de Sección: {{ course.codSeccion }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-y-[10px] gap-x-[16px]">
					<div>
						<p
							class="font-telegraf text-secondary leading-[1] text-xs pb-[2px]"
						>
							Horario
						</p>
						<div class="font-telegraf font-bold text-[#000]">
							<span class="text-[16px]">{{
								course.horaInicio.slice(0, 5)
							}}</span>
							-
							<span class="text-xs">{{ course.horaFin.slice(0, 5) }}</span>
						</div>
					</div>
					<div>
						<p
							class="font-telegraf text-secondary leading-[1] text-xs pb-[2px]"
						>
							Salón
						</p>
						<p
							v-if="course.descripMetodoEducativo !== 'Remoto'"
							class="font-telegraf font-bold text-[#000] text-sm"
						>
							{{ course.codAula || '-' }}
						</p>
						<p v-else class="font-telegraf text-blue_light text-sm">
							<a
								href="https://upn.blackboard.com/auth-saml/saml/login?apId=_111_1&redirectUrl=https%3A%2F%2Fupn.blackboard.com%2Fultra"
								class="underline"
								target="_blank"
								@click="
									eventClickRemoto(
										'Aula virtual (Blackboard)',
										'https://upn.blackboard.com/auth-saml/saml/login?apId=_111_1&redirectUrl=https%3A%2F%2Fupn.blackboard.com%2Fultra',
									)
								"
								>Aula virtual (Blackboard)</a
							>
						</p>
					</div>
					<div v-if="course.descripMetodoEducativo == 'Presencial'">
						<p
							class="font-telegraf text-secondary leading-[1] text-xs pb-[2px]"
						>
							Campus
						</p>
						<p class="font-telegraf font-bold text-[#000] text-sm">
							{{ course.descripCampus || '-' }}
						</p>
					</div>
					<div v-if="course.descripMetodoEducativo == 'Presencial'">
						<p
							class="font-telegraf text-secondary leading-[1] text-xs pb-[2px]"
						>
							Referencia
						</p>
						<p class="font-telegraf font-bold text-[#000] text-sm">
							{{ course.descripAula || '-' }}
						</p>
					</div>
					<div v-if="course.profesor.length" class="col-span-2 lg:col-span-1">
						<label
							for="docentes"
							class="font-telegraf text-secondary leading-[1] text-xs pb-[6px] h-full"
						>
							Docente
						</label>
						<select
							id="docentes"
							class="font-telegraf font-bold capitalize w-full border border-black rounded p-2 outline-none text-sm"
							name="docentes"
							@click="eventClick"
							@change="handleChange"
						>
							<option
								v-for="(docente, k) in course.profesor"
								:key="k"
								class="capitalize"
								:selected="k === 0"
								:value="k"
							>
								{{ docente.nombreCompleto.toLowerCase() }}
							</option>
						</select>
					</div>
					<div
						v-if="course.profesor.length"
						class="flex flex-col justify-start col-span-2 lg:col-span-1 mt-3 lg:mt-0"
					>
						<p
							class="font-telegraf text-secondary leading-[1] text-xs pb-[6px] mt-auto"
						>
							Correo del docente
						</p>
						<div class="relative flex items-center lg:h-[31.2px] max-w-min">
							<a
								href="mailto:ernesto.castillo@upn.pe"
								class="font-telegraf text-blue_light text-sm pr-2 underline"
								@click="eventClickCorreo"
							>
								{{ selectedProfessor.correo }}
							</a>
							<button @click="copy(selectedProfessor.correo)">
								<NuxtIcon class="iconCopy" name="copy" />
							</button>
							<div
								v-if="msgCopy.id === selectedProfessor.correo"
								class="copy-msg"
							>
								<nuxt-icon name="IconCheckSim" class="mr-1" />
								{{ msgCopy.text }}
							</div>
						</div>
					</div>
				</div>
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
.content-popup {
	@apply fixed top-0 h-screen w-full bg-black bg-opacity-30 flex items-center justify-center z-[105] left-[50%] translate-x-[-50%];
}
.popup-schedule {
	@apply relative bg-white lg:fixed z-50 lg:w-[500px] lg:rounded-[8px] lg:cursor-auto;
}
.close-schedule-popup {
	@apply text-[#000000] text-[16px] absolute right-3 top-3 leading-[1] font-[600]
	hover:text-primary;
}
.popup-schedule.mobile-popup {
	@apply fixed bottom-0 left-0 right-0 w-full z-[110] rounded-t-[15px];
	animation-duration: 0.2s;
	animation-name: animate-entrance;
}
.mobile-popup .close-schedule-popup {
	@apply right-4 top-4 text-[16px];
}
.card-title-popup {
	@apply font-grotesk font-bold uppercase text-lg lg:text-[20px] text-[#000] mt-2 leading-[1] break-words col-span-2;
}
.iconCopy {
	@apply text-[#1938A6] cursor-pointer;
}

.copy-msg {
	@apply bg-[#404040] opacity-90 min-w-max flex items-center text-white text-xs ml-1 p-2 rounded absolute left-full bottom-0 lg:bottom-[initial] lg:top-0;
}

@keyframes animate-entrance {
	0% {
		opacity: 0;
		transform: translateY(100%);
	}

	100% {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>

<style lang="postcss">
.iconCopy svg {
	@apply !mb-0;
}
</style>
