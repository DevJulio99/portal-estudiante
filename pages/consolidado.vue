<script lang="ts" setup>
import { onMounted } from 'vue';
import type { ErrorResponse } from '~/types/services.types';
// const { $api } = useNuxtApp();
import dataConsolidado from "~/utils/data/dataConsolidado.json";

useHead({
	title: 'Consolidados de Matrícula',
});

// const { handleRoute } = useBreadcrumb();

// const breadcrumb = [
// 	{ label: 'Inicio', goTo: () => handleRoute('/inicio', 'Inicio') },
// 	{ label: 'Consolidados de matrícula', goTo: () => {} },
// ];

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Consolidados de matrícula', current: true, url: '' },
];

// const user = useUserStoreAuth();
// const nameConsolidado = user.codAlum;
const urlDoc = ref('');
const docUploaded = ref(false);
const documentsError: Ref<ErrorResponse | null> = ref(null);
const loading = ref(true);

// const { data, error, pending } = await $api.consolidado.getConsolidado(
// 	nameConsolidado,
// 	{
// 		lazy: true,
// 	},
// );

// watch(data, (response) => {
// 	if (response?.flag) {
// 		getDoc(response.data?.[0]?.url);
// 	} else if (response?.error) {
// 		documentsError.value = response.error;
// 	} else {
// 		documentsError.value = {
// 			icono: '',
// 			descripcion: '',
// 			titulo: response?.message ?? '',
// 		};
// 	}
// });

function getDoc(url: string | null) {
	console.log('url', url)
	if (url) {
		urlDoc.value = url;
		docUploaded.value = true;
	} else {
		docUploaded.value = true;
	}
}

onMounted(() => {
	getDoc(dataConsolidado[0]?.url);
	loading.value = false;
})
</script>

<template>
	<BaseLayout :rightAside="false" bgWhite>
		<div class="section-container px-3 xl:px-0">
			<BaseBreadcrumbs :items="breadcrumbsItem" />
			<BaseTitle text="CONSOLIDADOS DE MATRÍCULA" />

			<div v-if="loading" class="w-full h-[240px] flex justify-center">
				<BaseStatusLoading />
			</div>
			<!-- <ScheduleStatusError
				v-else-if="error || documentsError"
				class="w-full !h-[50vh] md:pt-[28px]"
				:text="
					documentsError?.titulo ??
					'Lo sentimos, no pudimos cargar tus Consolidados de matrícula.'
				"
				:description="documentsError?.descripcion"
				:icono="documentsError?.icono"
			/> -->

			<iframe
				v-else-if="urlDoc && urlDoc.trim().length"
				:src="urlDoc"
				frameborder="0"
				width="100%"
				height="693px"
			></iframe>

			<!-- <ScheduleStatusNoData
				v-else-if="!urlDoc.trim().length && docUploaded"
				class="w-full !h-[240px] md:!h-[280px]"
				text="Estamos trabajando en el detalle de este contenido"
			/> -->
		</div>
	</BaseLayout>
</template>
