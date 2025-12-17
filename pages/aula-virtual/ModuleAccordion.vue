<script setup lang="ts">
import SessionContent from './SessionContent.vue';

interface Resource {
  type: string;
  icon: string;
  iconBgColor: string;
  title: string;
  link: string;
  dates?: {
    opens: string;
    closes: string;
  };
}

interface Session {
  title: string;
  resources: Resource[];
}

defineProps({
  title: {
    type: String,
    required: true,
  },
  examTitle: {
    type: String,
    required: true,
  },
  examDates: {
    type: Object as () => { opens: string; closes: string },
    required: true,
  },
  sessions: {
    type: Array as () => Session[],
    required: true,
  },
});
</script>

<template>
  <BaseAcordion :title="title">
    <div class="p-4 bg-white rounded-b-lg border border-t-0 border-gray-100 space-y-6">
      <div class="flex items-start gap-4">
        <div class="flex justify-center items-center w-10 h-10 bg-blue-200 rounded-md flex-shrink-0">
          <nuxt-icon name="clockPagos" />
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500">Cuestionario</p>
          <h4 class="text-md font-bold text-gray-800">{{ examTitle }}</h4>
          <div class="text-xs text-gray-600 mt-1 flex gap-2">
            <p><strong>abrió:</strong> {{ examDates.opens }}</p>
            <p><strong>cerró:</strong> {{ examDates.closes }}</p>
          </div>
        </div>
      </div>
      <hr />
      <div class="space-y-4">
        <SessionContent v-for="(session, index) in sessions" :key="index" :title="session.title" :resources="session.resources" />
      </div>
    </div>
  </BaseAcordion>
</template>