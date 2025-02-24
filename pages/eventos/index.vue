<script lang="ts" setup>
import CardEvent from "./CardEvent.vue";
import BasePagination from "~/components/base/BasePagination.vue";
import type { EventCategory, EventData } from "~/types/events.types";
import { TagStyle } from "~/types/helper.types";
import { useEventFilterStore } from '~/stores/filterEventCategories';

useHead({
  title: "Eventos",
});

definePageMeta({
  middleware: "auth",
});

const filterStore = useEventFilterStore();
const { $api } = useNuxtApp();

const isFromSuperapp = false;
const hasToken = false;

const breadcrumbsItem = [
  { name: "Inicio", current: false, url: "/inicio" },
  { name: "Eventos", current: false, url: "/eventos" },
  { name: "Resultados", current: true, url: "" },
];

const serviceError: Ref<any> = ref(null);
const eventsData = ref<EventData[] | null>(null);
const allEvents = ref<EventData[] | null>(null);
const currentEvent = ref<string>("");
const currentType = ref<string | undefined>(undefined);
const categories = ref<EventCategory[] | null>(null);
const typeId = ref<number>(1);
const filterTipo = ref([
  {
    id: 1,
    name: "Todos",
  },
  {
    id: 2,
    name: "Presencial",
  },
  {
    id: 3,
    name: "Virtual",
  },
]);
const limitItems = ref<number>(6);
const currentPage = ref<number>(1);
const totalEvents = ref<number>(0);
const pendingEvnt = ref<boolean>(true);
const pendingCategory = ref<boolean>(true);
// const pending = ref<boolean>(true);

const handlePage = (number: number) => {
  serviceError.value = null;
  pendingEvnt.value = true;
  currentPage.value = number;
};

const paginatedEvents = computed(() => {
  if (!eventsData.value || eventsData.value.length === 0) return [];
  const start = (currentPage.value - 1) * limitItems.value;
  const end = start + limitItems.value;
  return eventsData.value.slice(start, end);
});

const callEvents = async () => {
	return await $api.eventos.getEventos(
		{
			lazy: true,
		},
	);
};

const { data, error, pending } = await callEvents();

watch(() => filterStore.selectedCategory, (newCategory) => {
  applyFilters(newCategory);
});

const onSelectCategory = (category: string) => {
  filterStore.setCategory(category);
  applyFilters(category);
};

const onSelectType = (type: any) => {
  currentType.value = type.name.toLowerCase() === "todos" ? undefined : type.name.toLowerCase();
  applyFilters(filterStore.selectedCategory); 
};

const applyFilters = (category: string | null = null) => {
  if (!allEvents.value) return;

  let filteredEvents = [...allEvents.value];

  if (category) {
    filteredEvents = filteredEvents.filter(event =>
      event.categoriaEvento.toLowerCase() === category.toLowerCase()
    );
  }

  if (currentType.value) {
    filteredEvents = filteredEvents.filter(event =>
      event.tipoDeEvento.toLowerCase() === currentType.value
    );
  }

  eventsData.value = filteredEvents;
  totalEvents.value = filteredEvents.length;
  currentPage.value = 1;
};

const resetEvents = () => {
  filterStore.clearCategory();
  currentType.value = undefined;
  // callEvents();
};

watch(data, (response) => {
	if (response?.data?.length) {
    allEvents.value = response.data;
		eventsData.value = response.data;
		totalEvents.value = response.count;
	} else if (response?.error) {
		serviceError.value = response.error;
	}
});

onMounted(async() => {
  await callEvents();
  categories.value = Array.from(
    new Set(eventsData.value?.map((event) => event.categoriaEvento))
  ).map((categoriaEvento) => ({ nombre: categoriaEvento }));
  pendingCategory.value = false;

  const categoryFromStore = filterStore.selectedCategory;
  if (categoryFromStore) {
    applyFilters(categoryFromStore);
  } else {
    applyFilters(null);
  }
});

const isLargeScreen = useMediaQuery("(min-width: 1200px)");
</script>

<template>
  <BaseLayout :isFromSuperapp="isFromSuperapp">
    <BaseBreadcrumbs
      v-if="!isFromSuperapp"
      :items="breadcrumbsItem"
      :on-select-item="resetEvents"
    />
    <BaseTitle text="Eventos" />
    <div class="flex justify-end mb-6 lg:mb-10">
      <div class="w-full flex gap-2 items-center lg:w-auto">
        <span
          v-if="isLargeScreen"
          class="font-nunito font-extrabold text-sm text-black"
          >Tipo:</span
        >
        <BaseVeeSelectV2
          id="filter"
          :icon="isLargeScreen ? 'arrowDownBlack' : 'iconFilter'"
          class="w-full lg:w-[149px] h-[46px]"
          label="tipo"
          placeholder="Todos"
          :options="filterTipo"
          responsivePlaceholder="Todos"
          custom-style="bg-white"
          :icon-style="isLargeScreen ? '!text-[12px]' : ''"
          :value="typeId"
          @change="onSelectType"
        />
      </div>
    </div>
    <div
      v-if="currentEvent.trim().length"
      class="flex flex-wrap gap-2 mb-6 lg:mb-5"
    >
      <div class="font-extrabold font-nunito text-sm text-black">
        RESULTADOS DE:
      </div>
      <div
        class="uppercase bg-violet_20 px-2 py-1 text-violet_100 text-[10px] font-bold leading-3 font-whitney rounded-2xl cursor-pointer tracking-[0.4px]"
      >
        {{ currentEvent }}
      </div>
    </div>
    <div v-if="pending" class="w-full h-[240px] flex justify-center">
      <BaseStatusLoading />
    </div>
    <!-- <div
			v-else-if="error || serviceError"
			class="flex flex-col items-center justify-center min-h-[240px] lg:pt-[28px]"
		>
			<BaseStatusError
				:text="
					serviceError?.titulo || 'Lo sentimos, no pudimos cargar tus Eventos'
				"
				:description="
					serviceError?.descripcion || 'Inténtalo de nuevo más tarde'
				"
				:icono="serviceError?.icono"
			/>
		</div> -->

    <div
      v-else-if="!eventsData?.length"
      class="flex flex-col items-center justify-center min-h-[240px] lg:pt-[28px]"
    >
      <BaseStatusNoDataDirectus
        :text="
          serviceError?.titulo ??
          'Estamos trabajando en el detalle de este contenido'
        "
        :description="serviceError?.descripcion"
        :icono="serviceError?.icono"
      />
    </div>
    <template v-if="eventsData && eventsData.length">
      <div
        class="grid grid-cols-1 lgMobile:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        <CardEvent
          v-for="(item, i) in paginatedEvents"
          :id="item.id"
          :key="i"
          :title="item.titulo"
          :dateStart="item.fechaInicioEvento"
          :dateEnd="item.fechaFinEvento"
          :time="item.horaInicioEvento"
          :imgDesktop="item.imagenDesktop"
          :imgMobile="item.imagenMobile"
          :url="item.url ?? ''"
          :description="item.descripcion"
          :tag="item.categoriaEvento"
          :tagUrl="item.categoriaEvento"
          :style="TagStyle.violet"
          :typeEvent="item.tipoDeEvento"
          :on-category="onSelectCategory"
          :isFromSuperapp="isFromSuperapp"
          :hasToken="hasToken"
          alt=""
          secondary
        />
      </div>
      <div
        v-if="eventsData?.length && totalEvents >= limitItems"
        class="flex justify-center mt-5 mx-auto"
      >
        <BasePagination
          :totalItems="eventsData.length"
          :currentPage="currentPage"
          :items-per-page="limitItems"
          @change="handlePage"
        />
      </div>
    </template>
    <template #secondary>
      <BaseSubtitle
        text="Categorías de eventos"
        class="!text-xs !px-1 !py-2 mb-4 font-semibold lg:!text-lg lg:!leading-[18px]"
      />
      <div v-if="pendingCategory" class="w-full h-[240px] flex justify-center">
        <BaseStatusLoading />
      </div>
      <div class="flex flex-wrap gap-2 mb-5">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="uppercase bg-violet_20 px-2 py-1 text-violet_100 text-[10px] font-bold leading-3 font-whitney rounded-2xl cursor-pointer tracking-[0.4px]"
          @click="() => onSelectCategory(category.nombre)"
        >
          {{ category.nombre }}
        </div>
      </div>
    </template>
  </BaseLayout>
</template>
