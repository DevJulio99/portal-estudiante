<script setup lang="ts">
defineProps<{
  loading: boolean;
  data: Array<{
    businessName: string;
    address: string;
    id: string;
    ruc: string;
  }>;
}>();

const emit = defineEmits(['select']);
const handleSelectCompany = (item: object) => {
  emit('select', item);
};
</script>
<template>
  <div class="filter-company-popover top-15">
    <div v-if="loading" class="flex items-center justify-center">
      <img class="w-[45px]" src="../../assets/images/spinner.gif" />
    </div>
    <div v-else @click="handleSelectCompany(item)" v-for="item in data" :key="item.id" class="filter-item">
      {{ item.businessName }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.filter-company-popover {
  @apply w-full max-h-56 rounded-sm bg-white absolute z-10 overflow-y-auto p-2 shadow-xl;
}

.filter-item {
  @apply p-3 rounded-sm text-sm text-[#4F6168] hover:bg-[#E4F2FF] focus:bg-[##A1D7FF] hover:cursor-pointer;
}

.filter-company-popover::-webkit-scrollbar {
  width: 19px;
}

.filter-company-popover::-webkit-scrollbar-thumb {
  background-color: #dadcdd;
  border-radius: 19px;
  border: 6px solid transparent;
  background-clip: content-box;
}

.filter-company-popover::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>