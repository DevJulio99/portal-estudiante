<script setup lang="ts">
import { TagStyle } from '~/types/helper.types';
import type { EventData } from '~/types/events.types';
import debounce from 'lodash.debounce'

const { $api } = useNuxtApp();
const router = useRouter();

const serviceError: Ref<any> = ref(null);
const newsData = ref<EventData[]>([]);

const eventResponse = ref();
const pendingval = ref(true);

const fetchEvents = async () => {
  const { data, error, pending } = await $api.eventos.getEventos(
	{
		lazy: true,
	},
  );
  pendingval.value = pending.value;
  eventResponse.value = data.value || []
}

const debouncedFetch = debounce(fetchEvents, 500) 

watch(eventResponse, (response) => {
	if (response?.data?.length) {
		newsData.value = response?.data.slice(0, 2);
	} else if (response?.error) {
		serviceError.value = response.error;
	}
});

const eventClick = (id: string, title: string, tag: string) => {
	router.replace(`eventos/${id}`);
};

onMounted(() => {
	debouncedFetch();
})
</script>

<template>
	<CardHome
		title="Eventos"
		url="/eventos"
		width="w-full xl:w-2/3"
		icon="eventIcon"
	>
		<div v-if="pendingval" class="text-xs text-black mt-6 mb-4">
			<BaseStatusLoading />
		</div>
		<div
			v-else-if="serviceError"
			class="flex flex-col items-center justify-center lg:min-h-[220px] sm:min-h-[0px]"
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
		</div>
		<div
			v-else-if="!newsData.length"
			class="flex flex-col items-center justify-center lg:min-h-[220px] sm:min-h-[0px]"
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
		<div v-else-if="newsData.length" class="flex flex-col gap-y-4">
			<CardEvents
				v-for="(item, i) in newsData"
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
				:style="TagStyle.neutral"
				:onGoDetail="eventClick"
				alt=""
				secondary
			/>
		</div>
	</CardHome>
</template>
