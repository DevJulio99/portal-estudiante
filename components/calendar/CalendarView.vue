<script setup lang="ts">
import { sortCalendarData } from '~/utils/calendar/functions';
import { type Calendar } from '~/domain/calendar/interfaces/service.interface';
import { EventStatus } from '~/domain/calendar/enums';
import { months } from '~/domain/calendar/constants';

const props = defineProps<{
	data: Calendar[];
}>();

const monthSelect: Ref<number> = ref(new Date().getMonth());
const yearSelect: Ref<number> = ref(new Date().getFullYear());
const disabledNextBtn = ref(false);
const disabledPreviousBtn = ref(false);

const { yearsFound, ceremoniesPerMonth, eventsPerMonth } = sortCalendarData(
	props.data,
);

const order = yearsFound.indexOf(String(new Date().getFullYear())) * 12;
const currentMonthData = ref(eventsPerMonth[new Date().getMonth() + order]);

const handleMonth = (action: number) => {
	if (action) {
		monthSelect.value = monthSelect.value === 11 ? 0 : monthSelect.value + 1;
		monthSelect.value === 0 && (yearSelect.value = yearSelect.value + 1);
	} else {
		monthSelect.value = monthSelect.value === 0 ? 11 : monthSelect.value - 1;
		monthSelect.value === 11 && (yearSelect.value = yearSelect.value - 1);
	}
	const order = yearsFound.indexOf(String(yearSelect.value)) * 12;
	currentMonthData.value = eventsPerMonth[monthSelect.value + order];

	const monthPosition =
		monthSelect.value + yearsFound.indexOf(String(yearSelect.value)) * 12;
	disabledPreviousBtn.value = monthPosition === 0;
	disabledNextBtn.value = monthPosition === eventsPerMonth.length - 1;
};
</script>

<template>
	<div
		class="flex flex-wrap justify-between py-4 border border-x-0 border-t-0 border-b-neutral60 mb-5"
	>
		<div class="flex items-center w-fit">
			<button
				aria-label="Mes anterior"
				:disabled="disabledPreviousBtn"
				@click="handleMonth(0)"
			>
				<NuxtIcon
					:class="
						disabledPreviousBtn
							? 'text-gray'
							: 'text-black'
					"
					name="icon-nav-arrow-black-left"
					size="24"
				/>
			</button>
			<span
				class="font-telegraf font-extrabold uppercase w-[170px] text-center"
			>
				{{ months[monthSelect as keyof typeof months] }} -
				{{ yearSelect }}</span
			>
			<button
				aria-label="Mes siguiente"
				:disabled="disabledNextBtn"
				@click="handleMonth(1)"
			>
				<NuxtIcon
					:class="
						disabledNextBtn ? 'text-gray' : 'text-black'
					"
					name="icon-nav-arrow-black-right"
					size="24"
				/>
			</button>
		</div>
	</div>
	<div class="flex flex-wrap gap-6 mb-14">
		<div v-if="!currentMonthData || !currentMonthData.length" class="w-full mt-20">
			<BaseStatusError
				text="Estamos trabajando en el detalle de este contenido"
				default-icon="icon-clock"
			/>
		</div>
		<template v-else>
			<div
				v-if="ceremoniesPerMonth[`${monthSelect}-${yearSelect}`]"
				class="flex flex-col lg:w-[196px] px-4 py-[10px] self-start"
			>
				<p
					v-for="(item, i) in ceremoniesPerMonth[
						`${monthSelect}-${yearSelect}`
					]"
					:key="i"
					class="font-bold relative before:absolute before:left-0 before:top-[7px] before:inline-block before:w-[7.5px] before:h-[7.5px] before:rounded-full before:bg-current pl-4 mb-2"
					:class="
						ceremoniesPerMonth[`${monthSelect}-${yearSelect}`].length > 1
							? 'text-base'
							: 'text-xl'
					"
				>
					{{ item.actividad }}
				</p>
			</div>
	
			<template
				v-for="(calendar, index) in currentMonthData"
				:key="`day${index}`"
			>
				<div
					class="w-full py-2.5 pl-2.5 pr-5 lg:w-auto text-neutral100 border-l-[1px] border-gray_40"
					:class="{
						'bg-[#FFE6FB]':
							calendar.type === EventStatus.HOLIDAY &&
							calendar.date === useDateFormat(new Date(), 'YYYY-MM-DD').value,
						'bg-[#FEF8F2]':
							calendar.type === EventStatus.STANDARD &&
							calendar.date === useDateFormat(new Date(), 'YYYY-MM-DD').value,
						'bg-[#E4F2FF]':
							calendar.type === EventStatus.ACADEMIC &&
							calendar.date === useDateFormat(new Date(), 'YYYY-MM-DD').value,
					}"
				>
					<span class="font-grotesk font-bold block text-xl">
						{{ calendar.day }}
					</span>
					<div class="flex gap-2">
						<div
							class="font-grotesk font-bold text-[76px] leading-[84px]"
							:class="{
								'text-magenta_60': calendar.type === EventStatus.HOLIDAY,
								'text-cyan-80': calendar.type === EventStatus.ACADEMIC,
								'text-primary': calendar.type === EventStatus.STANDARD,
							}"
						>
							{{ calendar.numberDay }}
						</div>
						<div class="flex flex-col flex-wrap lg:max-h-[192px] gap-2">
							<template
								v-for="(event, index_) in calendar.events"
								:key="`activity${index_}`"
							>
								<div
									class="lg:w-[180px] relative before:absolute before:left-0 before:top-[7px] before:inline-block before:w-[7.5px] before:h-[7.5px] before:rounded-full pl-4"
									:class="{
										'before:bg-primary':
											event.tipoActividad === EventStatus.STANDARD,
										'before:bg-cyan-80 text-cyan-80 font-bold':
											event.tipoActividad === EventStatus.ACADEMIC,
										'before:bg-magenta_60 text-magenta_80 font-bold':
											event.tipoActividad === EventStatus.HOLIDAY,
									}"
								>
									<p
										v-if="event.fechaInicio !== event.fechaFin"
										class="block text-base leading-5 lg:text-xl lg:leading-6 font-grotesk font-bold"
										:class="{
											'text-primary':
												event.tipoActividad === EventStatus.STANDARD,
										}"
									>
										Al
										{{
											useDateFormat(
												new Date(event.fechaFin.replace(/-/g, '/')),
												'D',
											).value
										}}
										<span
											v-if="new Date(event.fechaFin).getMonth() !== monthSelect"
										>
											{{
												useDateFormat(
													new Date(event.fechaFin.replace(/-/g, '/')),
													'MMMM',
												).value
											}}
										</span>
									</p>
									<p>
										{{ event.actividad }}
									</p>
								</div>
							</template>
						</div>
					</div>
				</div>
			</template>
		</template>
	</div>
</template>
