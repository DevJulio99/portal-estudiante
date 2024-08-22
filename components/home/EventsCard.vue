<script setup lang="ts">
import { TagStyle } from '~/types/helper.types';
import type { EventData } from '~/types/events.types';
import dataEventos from "~/utils/data/dataEventos.json";
// const { $api } = useNuxtApp();
const profileStore = useProfileStore();
// const config = useRuntimeConfig();
const router = useRouter();

const serviceError: Ref<any> = ref(null);
const newsData = ref<EventData[]>([]);
const pending = ref(true);

// const { data, error, pending } = await $api.events.getEvents(
// 	profileStore.profileData.data?.codCampus ?? '',
// 	profileStore.profileData.data?.codNivel ?? '',
// 	profileStore.profileData.data?.facultad ?? '',
// 	profileStore.profileData.data?.codProductoActual ?? '',
// 	profileStore.profileData.data?.status ?? '',
// 	'WEB',
// 	'0',
// 	'',
// 	undefined,
// 	{
// 		lazy: true,
// 	},
// );
// watch(data, (response) => {
// 	if (response?.flag) {
// 		newsData.value = response?.data.slice(0, 2);
// 	} else if (response?.error) {
// 		serviceError.value = response.error;
// 	}
// });

// const identifierEvent = (id: string) => {
// 	const objectIdentifier = {
// 		codCampus: profileStore.profileData.data?.codCampus,
// 		codNivel: profileStore.profileData.data?.codNivel,
// 		facultad: profileStore.profileData.data?.facultad,
// 		codProductoActual: profileStore.profileData.data?.codProductoActual,
// 		status: profileStore.profileData.data?.status,
// 		id,
// 	};

// 	const crypto = CryptoJS.AES.encrypt(
// 		JSON.stringify(objectIdentifier),
// 		config.public.keyCrypto,
// 	).toString();
// 	return crypto.replace(/[/]/g, 'U0002FSla');
// };

const eventClick = (id: string, title: string, tag: string) => {
	router.replace(`eventos/${id}`);
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Card-Eventos',
	// 		page_url: `${window.location.href}`,
	// 		tag,
	// 		url: `eventos/${id}`,
	// 		title,
	// 	});
	// }
};

onMounted(() => {
	newsData.value = dataEventos.slice(0, 2) as any;
	pending.value = false;
})
</script>

<template>
	<CardHome
		title="Eventos"
		url="/eventos"
		width="w-full xl:w-2/3"
		icon="iconEvents"
	>
		<div v-if="pending" class="text-xs text-black mt-6 mb-4">
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
		<!-- <div
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
		</div> -->
		<div v-else-if="newsData.length" class="flex flex-col gap-y-4">
			<CardEvents
				v-for="(item, i) in newsData"
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
				:style="TagStyle.neutral"
				:onGoDetail="eventClick"
				alt=""
				secondary
			/>
		</div>
	</CardHome>
</template>
