<script setup lang="ts">
import { ref } from 'vue';
import TicketNota from './TicketNota.vue';
import type { Curso, Nota } from '~/types/cursos.types';
import { useMediaQuery } from '@vueuse/core';

const isMediumScreen = useMediaQuery('(max-width: 700px)');

const props = defineProps<{
	item: Curso;
	dataNotas: Nota[];
	loading: boolean;
	error: Error | null;
	finalAverage: Nota;
	openCard: boolean;
	onExpansion: (curso: Curso, status: boolean) => void;
}>();

const openExpansion = ref(props.openCard);

function actionExpansion(title: string) {
	openExpansion.value = !props.openCard;
	props.onExpansion(props.item, !props.openCard);
}
</script>

<template>
	<div class="w-full" aria-label="ExpansionNotas">
		<div class="w-full py-2 border border-t-0 border-x-0 border-b-disable">
			<div class="cursor-pointer" @click="actionExpansion(item.descCurso)">
				<div
					class="w-fit rounded-2xl py-1 px-2"
					:class="
						item.modalidad !== 'Presencial'
							? item.modalidad == 'Remoto'
								? 'bg-[#6A00B5] text-white'
								: 'bg-[#0072AB] text-white'
							: 'bg-primary'
					"
				>
					<p class="text-[10px]">
						<b>{{ item.modalidad }}</b>
					</p>
				</div>
				<div class="w-full justify-between flex items-baseline gap-[5px] pt-1">
					<span class="p-1 text-sm uppercase text-dark_100">{{
						item.descCurso
					}}</span>
					<nuxt-icon
						role="button"
						name="NavArrowDown"
						class="no-margin text-black"
						:class="openCard ? 'rotate-180' : ''"
					/>
				</div>
			</div>
			<div v-if="openCard">
				<!-- <div
					v-if="loading"
					class="w-full text-xs text-black h-[150px] flex justify-center items-center"
				>
					<BaseStatusLoading />
				</div>
				<div
					v-else-if="error"
					class="flex items-center justify-center w-full py-[1.5em]"
				>
					<BaseStatusError
						:text="error?.titulo ?? 'Lo sentimos, no pudimos cargar tus notas'"
						:description="error?.descripcion"
						:icono="error?.icono"
					/>
				</div> -->
				<!-- <div
					v-else-if="!dataNotas.length"
					class="flex items-center justify-center w-full py-[1.5em]"
				>
					<BaseStatusNoDataDirectus
						:text="
							error?.titulo ??
							'Estamos trabajando en traer la información de tus notas'
						"
						:description="error?.descripcion"
						:icono="error?.icono"
					/>
				</div> -->
				<div v-if="dataNotas.length">
					<div class="grid grid-cols-3 2xl:grid-cols-4 gap-5 mb-6 pt-3">
						<TicketNota
							v-for="nota in dataNotas"
							:key="nota.codTipoPrueba"
							:item="nota"
						/>
					</div>

					<div
						class="w-full mb-2 flex gap-5"
						:class="isMediumScreen ? 'flex-col' : ''"
					>
						<div v-if="item.modalidad !== 'Virtual'" class="flex flex-1">
							<div
								class="border border-[#C2D1D9] border-r-0 flex flex-1 py-1 shadow-sm"
							>
								<div
									v-if="item.modalidad !== 'Virtual'"
									class="flex items-center text-neutral text-sm py-[5px] px-2 mr-1"
								>
									Inasistencias
								</div>
							</div>
							<div
								v-if="item.modalidad !== 'Virtual'"
								class="flex items-center justify-center bg-disable w-[46px] text-sm font-extrabold"
							>
								{{ item.inasistencias }}
							</div>
						</div>
						<div class="flex flex-1">
							<div
								class="border border-[#C2D1D9] border-r-0 flex flex-1 py-1 shadow-sm"
							>
								<div
									class="text-neutral text-sm px-2 py-[5px] mr-1 flex-1 text-left"
								>
									Promedio Final
								</div>
							</div>
							<div
								:class="
									item.statusCurso !== 'Finalizado'
										? 'bg-disable'
										: parseInt(finalAverage?.nota ?? '00') >= 12
											? 'bg-[#1F7634] text-white'
											: 'bg-[#DC3545] text-white'
								"
								class="flex items-center justify-center w-[46px] text-sm font-extrabold"
							>
								{{
									item.statusCurso == 'Finalizado' ? finalAverage?.nota : '-'
								}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
