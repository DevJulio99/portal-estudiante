<script lang="ts" setup>
import CardEvent from "./CardEvent.vue";
import BasePagination from "~/components/base/BasePagination.vue";
import type { EventCategory, EventData } from "~/types/events.types";
import { TagStyle } from "~/types/helper.types";
import dataEventos from "~/utils/data/dataEventos.json";
import dataCategoriaEventos from "~/utils/data/dataCategoriaEventos.json";

useHead({
  title: "Eventos",
});

// const profileStore = useProfileStore();
// const route = useRoute();
const isFromSuperapp = false;
const hasToken = false;

const breadcrumbsItem = [
  { name: "Inicio", current: false, url: "/inicio" },
  { name: "Eventos", current: false, url: "/eventos" },
  { name: "Resultados", current: true, url: "" },
];

const serviceError: Ref<any> = ref(null);
const serviceErrorCategory: Ref<any> = ref(null);
const eventsData = ref<EventData[] | null>(null);
const currentEvent = ref<string>("");
const currentType = ref<string | undefined>(undefined);
const categories = ref<EventCategory[] | null>(null);
const typeId = ref<number>(1);
const offset = ref<string>("0");
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
const limitItems = ref<number>(12);
const currentPage = ref<number>(1);
const totalEvents = ref<number>(0);
const pendingEvnt = ref<boolean>(true);
const pendingCategory = ref<boolean>(true);
const pending = ref<boolean>(true);

const handlePage = (number: number) => {
  serviceError.value = null;
  pendingEvnt.value = true;
  currentPage.value = number;
  offset.value = number === 1 ? "0" : `${limitItems.value * (number - 1)}`;
  callEvents();
  localStorage.setItem("offsetValue", offset.value);
};

// const callEvents = async () => {
// 	return await $api.events.getEvents(
// 		profileStore.profileData.data?.codCampus ?? '',
// 		profileStore.profileData.data?.codNivel ?? '',
// 		profileStore.profileData.data?.facultad ?? '',
// 		profileStore.profileData.data?.codProductoActual ?? '',
// 		profileStore.profileData.data?.status ?? '',
// 		'WEB',
// 		offset.value,
// 		currentEvent.value,
// 		currentType.value,
// 		{
// 			lazy: true,
// 		},
// 	);
// };

// const { data, error, pending } = await callEvents();
const callEvents = () => {
  eventsData.value = dataEventos as any;
  totalEvents.value = dataEventos.length;
  pending.value = false;
};

// const {
// 	data: dataCategory,
// 	error: errorCategory,
// 	pending: pendingCategory,
// } = await $api.eventsCategory.getCategories({
// 	lazy: true,
// });

const eventClick = (title: string, nameEvent: string) => {
  // if (window.dataLayer) {
  // 	window.dataLayer.push({
  // 		event: nameEvent,
  // 		page_url: `${window.location.href}`,
  // 		title,
  // 	});
  // }
};

const onSelectCategory = (name: string) => {
  const filter = dataEventos.filter(
    (x) => x.categoria_evento.toLocaleLowerCase() === name.toLocaleLowerCase()
  ) as any;
  currentPage.value = 1;
  serviceError.value = null;
  offset.value = "0";
  currentEvent.value = name;
  localStorage.setItem("offsetValue", offset.value);
  // callEvents();
  eventClick(name, "Click/Select-category");
  localStorage.removeItem("cat_prev_select");

  eventsData.value = filter;
  totalEvents.value = filter.length;
};

const onSelectType = (val: any) => {
  if (val.id !== 1) {
    const filter = dataEventos.filter(
      (x) =>
        x.tipo_de_evento.toLocaleLowerCase() === val.name.toLocaleLowerCase()
    ) as any;
    typeId.value = val.id;
    currentPage.value = 1;
    serviceError.value = null;
    offset.value = "0";
    currentType.value =
      val.name.toLowerCase() === "todos" ? undefined : val.name.toLowerCase();
    localStorage.setItem("offsetValue", offset.value);
    eventClick(val.name, "Click/Select-type");

    eventsData.value = filter;
    totalEvents.value = filter.length;
  } else {
	typeId.value = val.id;
	eventsData.value = dataEventos as any;
    totalEvents.value = dataEventos.length;
  }
};

const resetEvents = (title: string) => {
  if (title === "Eventos") {
    currentPage.value = 1;
    typeId.value = 1;
    serviceError.value = null;
    offset.value = "0";
    currentEvent.value = "";
    currentType.value = undefined;
    localStorage.setItem("offsetValue", offset.value);
    callEvents();
  }
};

// watch(data, (response) => {
// 	if (response?.flag) {
// 		eventsData.value = response.data;
// 		totalEvents.value = response.count;
// 	} else if (response?.error) {
// 		serviceError.value = response.error;
// 	}
// });

// watch(dataCategory, (response) => {
// 	if (response?.flag) {
// 		categories.value = response.data;
// 	} else if (response?.error) {
// 		serviceErrorCategory.value = response.error;
// 	}
// });

function preselectedCategory() {
  const name = localStorage.getItem("cat_prev_select");
  name &&
    setTimeout(() => {
      onSelectCategory(name);
    }, 0);
}

onMounted(() => {
  localStorage.setItem("offsetValue", offset.value);
  callEvents();
  categories.value = dataCategoriaEventos;
  pendingCategory.value = false;
});

onBeforeMount(() => {
  preselectedCategory();
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
          class="font-telegraf font-extrabold text-sm text-black"
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
      <div class="font-extrabold font-telegraf text-sm text-black">
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
          v-for="(item, i) in eventsData"
          :id="item.id"
          :key="i"
          :title="item.titulo"
          :dateStart="item.fecha_inicio_evento.replaceAll('-', '/')"
          :dateEnd="item.fecha_fin_evento.replaceAll('-', '/')"
          :time="item.hora_inicio_evento"
          :imgDesktop="item.imagen_desktop"
          :imgMobile="item.imagen_mobile"
          :url="item.url ?? ''"
          :description="item.descripcion"
          :tag="item.categoria_evento"
          :tagUrl="item.categoria_evento"
          :style="TagStyle.violet"
          :typeEvent="item.tipo_de_evento"
          :on-category="onSelectCategory"
          :isFromSuperapp="isFromSuperapp"
          :hasToken="hasToken"
          alt=""
          secondary
        />
      </div>
      <div
        v-if="eventsData?.length && totalEvents >= 12"
        class="flex justify-center mt-5 mx-auto"
      >
        <BasePagination
          :totalItems="totalEvents || 1"
          :currentPage="currentPage"
          :items-per-page="12"
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
      <!-- <div
				v-else-if="errorCategory || serviceErrorCategory"
				class="flex flex-col items-center justify-center min-h-[240px] lg:pt-[28px]"
			>
				<BaseStatusError
					:text="
						serviceErrorCategory?.titulo ||
						'Lo sentimos, no pudimos cargar las etiquetas relacionadas'
					"
					:description="
						serviceErrorCategory?.descripcion || 'Inténtalo de nuevo más tarde'
					"
					:icono="serviceErrorCategory?.icono"
				/>
			</div> -->

      <!-- <div
				v-else-if="!categories?.length"
				class="flex flex-col items-center justify-center min-h-[240px] lg:pt-[28px]"
			>
				<BaseStatusNoDataDirectus
					:text="
						serviceErrorCategory?.titulo ??
						'Estamos trabajando en el detalle de este contenido'
					"
					:description="serviceErrorCategory?.descripcion"
					:icono="serviceErrorCategory?.icono"
				/>
			</div> -->
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
