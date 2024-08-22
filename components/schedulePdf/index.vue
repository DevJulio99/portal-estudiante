<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import type { CourseExtend } from '~/types/cursos.types';

defineProps<{
	dataHorario: { [key: string]: CourseExtend[] };
	dataWeek: any;
	currentCicle: { start: string; end: string; cicle: string } | null;
}>();
</script>

<template>
	<div>
		<div class="w-full">
			<div class="relative flex mb-4">
				<nuxt-icon name="upn-black-logo" class="text-[70px] mr-auto" filled />
				<div class="mr-auto pr-20">
					<BaseTitle
						class="!my-0"
						:text="`HORARIO ${currentCicle?.cicle || ''}`"
					/>
					<p
						v-if="currentCicle?.start && currentCicle?.end"
						class="text-[#523C0F] font-bold text-[13px]"
					>
						{{
							useDateFormat(currentCicle?.start, 'DD/MM/YY', {
								locales: 'es-ES',
							}).value
						}}
						-
						{{
							useDateFormat(currentCicle?.end, 'DD/MM/YY', { locales: 'es-ES' })
								.value
						}}
					</p>
				</div>
				<div class="absolute right-0 top-0 text-right">
					<p class="text-[12px]">Fecha y hora de descarga:</p>
					<p class="text-[12px]">
						{{
							useDateFormat(new Date(), 'DD/MM/YY - hh:mm A', {
								locales: 'es-ES',
							}).value
						}}
					</p>
				</div>
			</div>
			<div
				class="flex stripe-custom bg-black text-white items-center gap-[44px] p-[14px]"
			>
				<div
					class="grid grid-cols-[30%_11%_34%_15%_10%] w-full font-telegraf font-extrabold text-[13px]"
				>
					<div
						class="text-center uppercase col-start-2"
						:style="{ paddingBottom: '10px' }"
					>
						Modalidad
					</div>
					<div class="text-center uppercase" :style="{ paddingBottom: '10px' }">
						Horario y aula
					</div>
					<div class="text-center uppercase" :style="{ paddingBottom: '10px' }">
						Inicio y fin
					</div>
					<div class="text-center uppercase" :style="{ paddingBottom: '10px' }">
						Estado
					</div>
				</div>
			</div>
			<div class="mt-4">
				<div
					v-for="(calendar, index) of dataHorario"
					:key="`day${index}`"
					class="flex flex-wrap gap-2 mb-4"
				>
					<span
						v-if="
							calendar &&
							(calendar[0].statusCurso === 'Finalizado' ||
								calendar[0].statusCurso === 'Retirado')
						"
						class="block text-black text-sm font-extrabold font-telegraf mb-2 capitalize"
					>
						{{ calendar[0].statusCurso }}
					</span>
					<template v-if="calendar">
						<div
							v-for="(detail, index_) of calendar"
							:key="`detail${index_}`"
							class="grid grid-cols-[30%_11%_34%_15%_10%] pl-2 pr-4 w-full rounded-lg py-[10px] item-cource items-center"
							:class="[
								detail.statusCurso.toLowerCase() === 'retirado' ||
								detail.statusCurso.toLowerCase() === 'finalizado'
									? 'bg-[#F6F6F6]'
									: 'bg-white',
								{
									'border-primary border-s-8':
										detail.modalidad.toLowerCase() === 'presencial',
									'border-violet_60 border-s-8':
										detail.modalidad.toLowerCase() === 'remoto',
									'border-cyan_80 border-s-8':
										detail.modalidad.toLowerCase() === 'virtual',
								},
							]"
						>
							<div class="flex flex-wrap mb-[7px]">
								<p
									class="w-full block text-black font-telegraf text-[13px] font-extrabold leading-[1]"
								>
									{{ detail.descCurso }}
								</p>
								<span class="text-gray_80 font-telegraf text-[11px]">{{
									detail.codCurso
								}}</span>
							</div>
							<span class="text-[13px] font-telegraf text-black text-center">
								{{ detail.modalidad }}
							</span>
							<div v-if="detail.horario?.length">
								<div
									v-for="(item, i) in detail.horario"
									:key="i"
									class="text-[13px] text-center"
								>
									<span class="capitalize">
										{{ item.diaNombre }}
										{{ item.horaInicio.slice(0, 5) }}
										-
										{{ item.horaFin.slice(0, 5) }}
									</span>
									{{ ' ' }}
									<span class="text-[#808080]">
										{{ item.campus }} {{ item.codAula }}
									</span>
								</div>
							</div>
							<span v-else class="text-center">-</span>
							<span
								v-if="detail.horario?.length"
								class="text-[12px] font-telegraf text-black text-center"
							>
								Del
								{{
									useDateFormat(detail.horario[0].fechaInicio, 'DD-MM-YY', {
										locales: 'es-ES',
									}).value
								}}
								<br />
								al
								{{
									useDateFormat(detail.horario[0].fechaFin, 'DD-MM-YY', {
										locales: 'es-ES',
									}).value
								}}
							</span>
							<span v-else class="text-center">-</span>
							<span
								class="flex items-center justify-center text-[12px] font-telegraf font-bold text-center"
								:class="{
									'rounded-full bg-[#1F7634] text-white':
										detail.statusCurso.toLowerCase() === 'iniciado',
									'rounded-full text-[#1F7634] bg-[#C1F1CB]':
										detail.statusCurso.toLowerCase() === 'por iniciar',
									'rounded-full text-white bg-[#DC3545]':
										detail.statusCurso.toLowerCase() === 'finalizado',
									'rounded-full text-[#B7192C] bg-[#FCCFCF]':
										detail.statusCurso.toLowerCase() === 'retirado',
								}"
								:style="{ paddingBottom: '10px' }"
							>
								{{ detail.statusCurso }}
							</span>
							<!-- <span class="text-[13px] font-telegraf text-black text-center"
							>{{ detail.descripAula }} - {{ detail.descripEdificio }}</span
						> -->
						</div>
					</template>
				</div>
			</div>
		</div>
		<ul class="flex c-legend text-[13px]">
			<li>
				<span
					class="rounded-full bg-primary text-[13px] inline-block h-[10px] w-[10px] mr-[5px] mb-[-12px]"
				></span>
				Curso Presencial
			</li>
			<li>
				<span
					class="rounded-full bg-violet_60 text-[13px] inline-block h-[10px] w-[10px] mr-[5px] mb-[-12px]"
				></span>
				Curso Remoto
			</li>
			<li>
				<span
					class="rounded-full bg-cyan_80 text-[13px] inline-block h-[10px] w-[10px] mr-[5px] mb-[-12px]"
				></span>
				Curso Virtual
			</li>
		</ul>

		<div id="newPage" class="relative flex justify-center items-center mb-4">
			<nuxt-icon
				name="upn-black-logo"
				class="absolute left-0 text-[70px]"
				filled
			/>
			<BaseTitle class="mt-0" text="HORARIO SEMANAL" />
		</div>
		<ScheduleBoardDesktop
			:dataWeek="dataWeek"
			:pending="false"
			:errorService="null"
			:error="null"
			pdf
		/>
		<p class="text-[14px] mb-1">
			Los cursos virtuales no aparecen en el horario semanal porque se realizan
			de manera asincrónica; asegúrate de tenerlos en cuenta.
		</p>
	</div>
</template>
<style>
.stripe-custom {
	padding: 12px 16px;
}
.title-pdf {
	position: relative;
	padding-left: 0.75em;
	font-family: solano;
	font-size: 1.5em;
	line-height: 2em;
	line-height: 1;
	color: var(--base-color);
}
.point {
	display: inline-block;
	width: 0.5em;
	height: 0.5em;
	border-radius: 10px;
	margin-right: 5px;
}
.c-legend li {
	display: flex;
	align-items: center;
	margin-right: 10px;
	line-height: 1;
}
.title-pdf::before {
	position: absolute;
	left: 0px;
	height: 23px;
	width: 6px;
	border-bottom-right-radius: 1.5rem;
	background-color: var(--primary);
	--tw-content: '';
	content: var(--tw-content);
}
.item-cource {
	border-top: 1px solid #d9d9d9;
	border-bottom: 1px solid #d9d9d9;
	border-right: 1px solid #d9d9d9;
}
@media (min-width: 1024px) {
	.title-pdf {
		padding-left: 1rem;
		font-size: 1.75rem;
	}
	.title-pdf::before {
		top: -5px;
		height: 40px;
		content: var(--tw-content);
		width: 8px;
	}
}
</style>
