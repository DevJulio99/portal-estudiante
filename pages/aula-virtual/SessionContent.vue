<script setup lang="ts">
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

defineProps({
  title: {
    type: String,
    required: true,
  },
  resources: {
    type: Array as () => Resource[],
    required: true,
  },
});
</script>

<template>
  <div>
    <h5 class="font-bold text-white bg-primary mb-3 px-3 py-2 rounded-md">{{ title }}</h5>
    <div class="space-y-3">
      <div v-for="(resource, index) in resources" :key="index" class="flex items-start gap-4">
        <div :class="[resource.iconBgColor, 'flex justify-center items-center w-8 h-8 rounded-md flex-shrink-0']">
          <nuxt-icon :name="resource.icon" />
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500">{{ resource.type }}</p>
          <NuxtLink :to="resource.link" class="text-md font-bold text-gray-800 hover:text-primary hover:underline">{{ resource.title }}</NuxtLink>
          <div v-if="resource.dates" class="flex gap-2 text-xs text-gray-600 mt-1">
            <p><strong>abrió:</strong> {{ resource.dates.opens }}</p>
            <p><strong>cerró:</strong> {{ resource.dates.closes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>