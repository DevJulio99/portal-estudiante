<script setup lang="ts">
import Notas from "~/components/pagesContainer/Notas/Notas.vue";
import BaseLayout from "../components/base/BaseLayout.vue";
import { EventStatus } from '~/types/calendar.types';

const { $api } = useNuxtApp();

definePageMeta({
  middleware: "auth",
});

const { data: calendar, pending: pendingCalendar } =
	await $api.calendario.getCalendar(2025, {
		lazy: true,
	});


</script>
<template>
  <BaseLayout :pageHome="true">
    <div class="py-8 px-3 lg:px-7">
      <div class="flex flex-wrap gap-6 mb-6">
        <Notas class="w-full xl:max-w-[48%] max-h-[360px]" />
        <PagesContainerHorarios class="w-full xl:max-w-[48%] max-h-[360px]" />
      </div>
      <div class="flex flex-wrap gap-6 mb-6">
				<HomePagosCard
					class="xl:max-w-[36%]"
					:codAlumno="''"
				/>
				<!-- <CardHomeServices class="xl:max-w-[60%]" /> -->
			</div>
      <div class="flex flex-wrap gap-6 mb-6">
				<!-- <HomeNewsCard class="w-full xl:max-w-[48%] max-h-[600px]" /> -->
				<HomeEventsCard class="w-full xl:max-w-[48%]" />
			</div>
    </div>

		<template #secondary>
      <CardHome
					v-if="!pendingCalendar"
					icon="calendarIcon"
					width="w-full"
					title="Calendario"
					url="/calendario"
					marginTitle="mb-0"
					class="!p-4"
				>
					<Calendar
						:data="
							calendar?.data.filter(
								(item) => item.tipoActividad !== EventStatus.STANDARD,
							) || []
						"
					/>
				</CardHome>
		</template>

  </BaseLayout>
</template>
