<script setup lang="ts">
import Notas from "~/components/pagesContainer/Notas/Notas.vue";
import BaseLayout from "../components/base/BaseLayout.vue";
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
  </BaseLayout>
</template>
