<script setup lang="ts">
interface Resource {
  id?: number;
  type: string;
  title: string;
  material: boolean;
  dates?: {
    opens: string;
    closes: string;
  };
}

const aulaVirtualStore = useAulaVirtualStore();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
    default: '',
  },
  resources: {
    type: Array as () => Resource[],
    required: true,
  },
});

const getResourceStyle = (type: string) => {
    const styles: { [key: string]: { icon: string; iconBgColor: string } } = {
        'recurso': { icon: 'icon-resources', iconBgColor: 'bg-green-200' },
        'carpeta': { icon: 'icon-folder-outline', iconBgColor: 'bg-green-200' },
        'página': { icon: 'icon-page-flip', iconBgColor: 'bg-green-200' },
        'tarea': { icon: 'icon-upload-file', iconBgColor: 'bg-red-200' },
        'default': { icon: 'icon-document', iconBgColor: 'bg-gray-200' },
    };
    return styles[type?.toLowerCase()] || styles.default;
};

const getResourceLink = (resource: Resource) => {
    const type = resource.type?.toLowerCase();
    if (type === 'tarea') {
        return { path: '/aula-virtual/tareaDetalle', query: { title: resource.title } };
    }
    if (type === 'página' || type === 'pagina') {
        return '/aula-virtual/pagina-grabacion';
    }
    return '/aula-virtual/material-complementario';
};

const handleResourceClick = (resource: Resource) => {
    aulaVirtualStore.setSelectedResource(resource);
};
</script>

<template>
  <div>
    <h5 class="font-bold text-white bg-primary mb-3 px-3 py-2 rounded-md">
      {{ title }}
      <span v-if="date" class="font-normal">
        ({{
          new Date(date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
          })
        }})
      </span>
    </h5>
    <div class="space-y-3">
      <div v-for="(resource, index) in resources" :key="index" class="flex items-start gap-4">
        <div :class="[getResourceStyle(resource.type).iconBgColor, 'flex justify-center items-center w-8 h-8 rounded-md flex-shrink-0']">
          <nuxt-icon :name="getResourceStyle(resource.type).icon" />
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500">{{ resource.type }}</p>
          <NuxtLink v-if="resource.material || resource.type?.toLowerCase() === 'tarea'" :to="getResourceLink(resource)" @click="handleResourceClick(resource)" class="text-md font-bold text-gray-800 hover:text-primary hover:underline">
            {{ resource.title }}
          </NuxtLink>
          <span v-else class="text-md font-bold text-gray-800">
            {{ resource.title }}
          </span>
          <div v-if="resource.dates" class="flex gap-2 text-xs text-gray-600 mt-1">
            <p><strong>abrió:</strong> {{ resource.dates.opens }}</p>
            <p><strong>cerró:</strong> {{ resource.dates.closes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>