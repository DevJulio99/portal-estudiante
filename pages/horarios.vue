<script lang="ts" setup>
// @ts-ignore
// import html2pdf from 'html2pdf.js';
import { useDateFormat } from "@vueuse/core";
import { EventStatus } from "~/types/calendar.types";
import type { HorarioData, CourseExtend } from "~/types/cursos.types";
import type { RangeWeek, WeekDates } from "~/types/schedule.types";
import dataHorarioMock from "~/utils/data/dataHorarioMock.json";

const { $api } = useNuxtApp();
const { codAlum } = useUserStoreAuth();
const { profileData } = useProfileStore();
const tokenStore = useTokenStore();
// const states = scheduleState();

useHead({
  title: "Horario",
});

definePageMeta({
  middleware: "auth",
});

const breadcrumbsItem = [
  { name: "Inicio", current: false, url: "/inicio" },
  { name: "Mis Estudios", current: false, url: "" },
  { name: "Horario", current: true, url: "" },
];

const states = scheduleState();
const weekDate = getWeekDates();
const dataHorario = ref<HorarioData[]>([]);
const dataWeek = ref<WeekDates>(weekDate);
const dataPdf = ref<{ [key: string]: CourseExtend[] }>({});
const loadingPdf = ref(false);
const startDate = ref<string>(
  `${useDateFormat(weekDate.Monday, "YYYY-MM-DD").value}T00:00:00Z`
);
const endDate = ref<string>(
  `${useDateFormat(weekDate.Sunday, "YYYY-MM-DD").value}T23:59:00Z`
);

console.log("startDate", startDate.value);
console.log("endDate", endDate.value);
const pendingSchedule = ref<boolean>(true);

const callHorarioRango = async () =>
  await $api.horarioRango.getHorariosRango(
    tokenStore.getDataToken.Id,
    startDate.value,
    endDate.value,
    {
      lazy: true,
    }
  );

const { data, error, pending } = await callHorarioRango();

// const errorService: Ref<{ titulo: string } | null> = ref(null);
watch(data, (response) => {
  console.log("response rango horario", response);
  if (response?.data.length) {
    states.setWeekCourses(response.data);
    states.setFilter(response.data);
    states.setDataStatus(true);
    dataHorario.value = response.data;
  } else if (response?.error) {
    // errorService.value = response?.error;
  }
});
// const { data: calendar, pending: pendingCalendar } =
// 	await $api.calendar.getCalendar(profileData.data?.codNivel ?? '', {
// 		lazy: true,
// 	});

const generatePDF = async () => {
  // loadingPdf.value = true;
  // const newData = await useGeneratePdf(
  // 	codAlum,
  // 	profileData.data?.codNivel || '',
  // 	profileData.data?.codPeriodoBanner || '',
  // );
  // dataPdf.value = newData;
  // const content = document.getElementById('pdf-content');
  // const pdfOptions = {
  // 	margin: 5,
  // 	filename: 'horario-semanal.pdf',
  // 	image: { type: 'jpeg', quality: 0.98 },
  // 	html2canvas: {
  // 		scale: 2,
  // 		dpi: 192,
  // 		letterRendering: true,
  // 	},
  // 	jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  // 	pagebreak: { mode: 'avoid-all', before: '#newPage' },
  // };
  // await html2pdf().from(content).set(pdfOptions).outputPdf().save();
  // loadingPdf.value = false;
};

const actionWeek = (range: RangeWeek) => {
  console.log("actionWeek", range);
  startDate.value = range.init;
  endDate.value = range.end;
  dataWeek.value = range.weekDates;
  dataHorario.value = [];

  states.setWeekCourses([]);
  states.setFilter([]);
  states.setDataStatus(false);
  // callHorarioRango();
};

onMounted(() => {
  //states.setWeekCourses(dataHorarioMock);
  //states.setFilter(dataHorarioMock as any);
  //states.setDataStatus(true);
  //dataHorario.value = dataHorarioMock as any;
  // pending.value = false;
});
</script>
<template>
  <BaseLayout bgWhite>
    <BaseBreadcrumbs :items="breadcrumbsItem" />
    <BaseTabMyStudies activeTab="horario" />
    <BaseTitle text="Horario Semanal" />
    <div class="layout-container">
      <div id="pdf-content" ref="pdfSection" class="mt-[18px]">
        <SchedulePdf
          :dataHorario="dataPdf"
          :dataWeek="dataWeek"
          :current-cicle="states.currentCicle"
        />
      </div>
    </div>
    <Schedule
      :pending="pending"
      :errorService="null"
      :error="null"
      :on-download="generatePDF"
      :on-action-week="actionWeek"
      :loadingPdf="loadingPdf"
    />
    <!-- <template #secondary>
			<CardHome
				v-if="!pendingCalendar"
				icon="calendarIcon"
				width="w-full"
				title="Calendario"
				url="/calendario"
				marginTitle="mb-0"
				event="Click/Calendario-Horario"
				class="!p-4"
			>
				<Calendar
					:data="
						calendar?.data.filter(
							(item) => item.PriorityStatus !== EventStatus.STANDARD,
						) || []
					"
				/>
			</CardHome>
		</template> -->
  </BaseLayout>
</template>

<style scoped>
.layout-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: -100vw;
  top: 0;
  z-index: -9999;
  background: rgba(95, 95, 95, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
}
</style>
