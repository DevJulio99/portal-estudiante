<script lang="ts" setup>
import { onMounted } from 'vue';
import type { DataDocumento } from '~/types/documento.types';
import type { ErrorResponse } from '~/types/services.types';

useHead({
	title: 'Mis documentos',
});

definePageMeta({
  middleware: "auth",
});

const { $api } = useNuxtApp();

const tokenStore = useTokenStore();
const isAdmin = tokenStore.getDataToken.Role === "admin";

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Documentos', current: true, url: '/documentos' },
];

const filteredData: Ref<DataDocumento[]> | Ref<[]> = ref([]);
const documentsData: Ref<DataDocumento[]> | Ref<[]> = ref([]);
const documentsError: Ref<ErrorResponse | null> = ref(null);
const loading: Ref<boolean> = ref(true);

const { data, error, pending } = await $api.documentos.getDocumentos({
	lazy: true,
});

watch(data, (response) => {
	if (response?.data.length) {
		documentsData.value = response.data;
		filteredData.value = response.data;
		setFilterDefault();
	} else if (response?.error) {
		documentsError.value = response.error;
	}
});

const reloadDocuments = async() => {
	await $api.documentos.getDocumentos({
	lazy: true,
});
}

const filterMock = [
	{
		id: 0,
		name: 'Todos',
	},
	{
		id: 1,
		name: 'Reglamentos',
	},
	{
		id: 2,
		name: 'Manuales',
	},
	{
		id: 3,
		name: 'Estatutos',
	},
];

const orderMock = [
	{
		id: 5,
		name: 'Más vistos',
	},
	{
		id: 1,
		name: 'A - Z',
	},
	{
		id: 2,
		name: 'Z - A',
	},
	{
		id: 3,
		name: 'Más antiguos',
	},
	{
		id: 4,
		name: 'Más recientes',
	},
];

const searchVal = ref('');
const searchOnlyByFilter = ref(false);
const searchActive = ref(false);
const searchForce = ref(false);
const filterId = ref(0);
const orderId = ref(0);
const showPdfView = ref(false);
const detailDoc = ref({
	name: '',
	url: '',
	type: '',
});
const filterListWithCategories = ref<any[]>([]);
const filterListSearch = ref<DataDocumento[]>([]);

const categories = computed(() =>
  filterListWithCategories.value.map(category => ({
    id: category.id,
    nombre: category.nombre
  }))
);

onMounted(() => {
	setFilterDefault();
	loading.value = false;
});

const handleChangeSelect = (val: any, id: string) => {
	searchOnlyByFilter.value = true;
	if (id === 'filter') {
		filterId.value = val.id;
		filterListDoc(val);
	}
	id === 'order' && orderListDoc(val.id);
	eventClick(
		val.name,
		id === 'filter' ? 'Click/filter-Documentos' : 'Click/order-Documentos',
	);
};

const filterListDoc = (value: any) => {
	if (
		(value.id || value.id === 0) &&
		(searchActive.value || searchForce.value)
	) {
		if (searchActive.value || searchForce.value) {
			changeInputSearch(searchVal.value);
		} else {
			const result = filteredData.value.filter((x) => x.id === value.id);
			filterListWithCategories.value = result;
		}
	} else {
		orderCategoryListDocs(orderId.value);
	}
};

const isOrderActive = () => {
	if (orderId.value) {
		orderListDoc(orderId.value);
	}
};

const orderListDoc = (idOrder: number) => {
	orderId.value = idOrder;
	filterListDoc(filterId.value);
	if (searchActive.value) {
		orderListDocs(idOrder);
	} else {
		orderCategoryListDocs(idOrder);
	}
};

const orderListDocs = (idOrder: number) => {
	if (filterId.value) {
		filterListSearch.value = filteredData.value
			.filter((x) => x.id === filterId.value)
			.reduce((totalDocs: DataDocumento[], docs) => {
				if (docs?.documentos?.length) {
					totalDocs.push(...docs.documentos);
				}
				return totalDocs;
			}, []);
	} else {
		filterListSearch.value = getAllDocs();
	}
	if (searchVal.value.trim().length) {
		filterbyNameSearch(searchVal.value);
	}
	if (idOrder === 5) {
		filterListSearch.value = filterListSearch.value.filter(
			(x: any) => x.masBuscados,
		);
		filterListSearch.value.sort(
			(a: any, b: any) => a.secuenciaMasBuscada - b.secuenciaMasBuscada,
		);
	}
	if (idOrder === 1) {
		filterListSearch.value.sort((a: any, b: any) =>
			a.titulo.localeCompare(b.titulo),
		);
	}
	if (idOrder === 2) {
		filterListSearch.value.sort((a: any, b: any) =>
			b.titulo.localeCompare(a.titulo),
		);
	}
	if (idOrder === 3) {
		filterListSearch.value.sort(
			(a: any, b: any) =>
				new Date(a.date_created).getTime() - new Date(b.date_created).getTime(),
		);
	}
	if (idOrder === 4) {
		filterListSearch.value.sort(
			(a: any, b: any) =>
				new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
		);
	}
};

const orderCategoryListDocs = (idOrder: number) => {
	setFilterDefault();

	if (idOrder === 5) {
		const newFilterCategory = [];
		for (const doc of filterListWithCategories.value) {
			newFilterCategory.push({
				...doc,
				documentos: doc?.documentos?.filter((x: any) => x.masBuscados),
			});
		}
		for (const doc of newFilterCategory) {
			doc?.documentos?.sort(
				(a: any, b: any) => a.secuenciaMasBuscada - b.secuenciaMasBuscada,
			);
		}
		filterListWithCategories.value = newFilterCategory;
	}
	if (idOrder === 1) {
		for (const doc of filterListWithCategories.value) {
			doc.documentos.sort((a: any, b: any) => a.titulo.localeCompare(b.titulo));
		}
	}
	if (idOrder === 2) {
		for (const doc of filterListWithCategories.value) {
			doc.documentos.sort((a: any, b: any) => b.titulo.localeCompare(a.titulo));
		}
	}
	if (idOrder === 3) {
		for (const doc of filterListWithCategories.value) {
			doc.documentos.sort(
				(a: any, b: any) =>
					new Date(a.date_created).getTime() -
					new Date(b.date_created).getTime(),
			);
		}
	}
	if (idOrder === 4) {
		for (const doc of filterListWithCategories.value) {
			doc.documentos.sort(
				(a: any, b: any) =>
					new Date(b.date_created).getTime() -
					new Date(a.date_created).getTime(),
			);
		}
	}
};

const changeInputSearch = (val: string) => {
	searchOnlyByFilter.value = false;
	searchActive.value = false;
	searchVal.value = val;
	if (val.trim().length >= 3) {
		searchActive.value = true;
		searchForce.value = false;
		filterbyNameSearch(val);
	}
	if (val.trim().length < 3 && val.trim().length > 0 && searchForce.value) {
		searchActive.value = true;
		filterbyNameSearch(val);
	}
	if (!val.trim().length) {
		searchActive.value = false;
		searchForce.value = false;
		setFilterDefault();
		isOrderActive();
	}
};

const setFilterDefault = () => {
	if (filterId.value) {
		filterListWithCategories.value = filteredData.value.filter(
			(x) => x.id === filterId.value,
		);
	} else {
		filterListWithCategories.value = filteredData.value;
	}
};

const filterbyNameSearch = (val: string) => {
	let docsFilter: DataDocumento[] = [];
	const docs = getAllDocs();
	let resultTotal = [];

	if (filterId.value) {
		docsFilter = filteredData.value
			.filter((x) => x.id === filterId.value)
			.reduce((totalDocs: DataDocumento[], docs) => {
				if (docs?.documentos?.length) {
					totalDocs.push(...docs.documentos);
				}
				return totalDocs;
			}, []);
	} else {
		docsFilter = docs;
	}
	const result = docsFilter.filter((x) =>
		x?.titulo
			?.trim()
			.toLocaleLowerCase()
			.includes(val.trim().toLocaleLowerCase()),
	);
	if (orderId.value === 5) {
		resultTotal = result
			.filter((x) => x.masBuscados)
			.sort(
				(a: any, b: any) => a.secuenciaMasBuscada - b.secuenciaMasBuscada,
			);
	} else {
		resultTotal = result;
	}

	filterListSearch.value = resultTotal;
};

const getAllDocs = () => {
	return filteredData.value.reduce((totalDocs: DataDocumento[], docs) => {
		if (docs?.documentos?.length) {
			totalDocs.push(...docs.documentos);
		}
		return totalDocs;
	}, []);
};
const handleModal = (value: boolean) => {
	showPdfView.value = value;
};

const handleAction = (item: DataDocumento, section: string) => {
	if (item.interno) {
		handleModal(true);
		detailDoc.value = {
			name: `${item.titulo}`,
			url: item.documento ?? '',
			type: `${item.type}`,
		};
	} else {
		const link = document.createElement('a');
		link.href = item.documento ?? '';
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	eventClick(item.titulo ?? '', 'Click/preview-Documentos', section);
};

const downloadDoc = (item: DataDocumento) => {
	const link = document.createElement('a');
	link.href = item.documentoDescarga;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

const eventClick = (title: string, event: string, section?: string) => {
	const layerData = section
		? {
				event,
				section,
				url: `/documentos`,
				title,
			}
		: {
				event,
				url: `/documentos`,
				title,
			};
	// console.log('see', layerData);
	// if (window.dataLayer) {
	// 	window.dataLayer.push(layerData);
	// }
	// console.log('window.dataLayer', window.dataLayer);
};

const onActionInputSearch = () => {
	if (searchVal.value.trim().length >= 1) {
		searchForce.value = true;
		searchActive.value = true;
		filterbyNameSearch(searchVal.value);
	} else {
		searchActive.value = false;
		setFilterDefault();
	}
};

const showUploadModal = ref(false);

</script>

<template>
	<BaseLayout :rightAside="false" bgWhite>
		<div class="section-container px-3 xl:px-0">
			<BaseBreadcrumbs :items="breadcrumbsItem" />
			<BaseTitle text="DOCUMENTOS" />
			<div v-if="loading" class="w-full h-[240px] flex justify-center">
				<BaseStatusLoading />
			</div>
			<!-- <ScheduleStatusError
				v-else-if="error || documentsError"
				class="w-full h-[240px] md:h-[280px]"
				:text="
					documentsError?.titulo ??
					'Lo sentimos, no pudimos cargar tus documentos.'
				"
				:description="documentsError?.descripcion"
				:icono="documentsError?.icono"
			/>
			<ScheduleStatusNoData
				v-else-if="!documentsData.length"
				class="w-full !h-[240px] md:!h-[280px]"
				text="Estamos trabajando en el detalle de este contenido"
			/> -->

			<div v-else class="lg:mb-10 mb-4">
				<template v-if="isAdmin">
					<div>
						<BaseSearchInput
							:value="searchVal"
							placeholder="Ingrese su búsqueda aquí"
							:customClass="`w-full lg:w-[636px] mb-4 xl:mb-6 mt-8`"
							customClassInput="h-[40px] text-xs md:text-base placeholder:text-xs md:h-auto"
							@change="changeInputSearch"
							@on-action="onActionInputSearch"
							@no-focus="() => eventClick(searchVal, 'Search-Documentos')"
						/>
					</div>
				</template>

				<div class="flex flex-wrap gap-x-5 min-[1367px]:gap-[52px]">
					<BaseSearchInput
						v-if="!isAdmin"
						:value="searchVal"
						placeholder="Ingrese su búsqueda aquí"
						:customClass="`w-full lg:w-[636px] mb-4 mt-6`"
						customClassInput="h-[40px] text-xs md:text-base placeholder:text-xs md:h-auto"
						@change="changeInputSearch"
						@on-action="onActionInputSearch"
						@no-focus="() => eventClick(searchVal, 'Search-Documentos')"
					/>

					<div class="flex-wrap items-center gap-x-1 gap-y-4 lg:gap-[23px] flex mb-4 min-[1366px]:mb-0">
						<div class="flex flex-wrap items-center gap-2 w-max">
							<span class="hidden md:block font-nunito text-sm font-extrabold">Filtrar:</span>
							<BaseVeeSelectV2
								id="filter"
								:value="filterId"
								icon="iconFilter"
								class="w-[154px] md:w-[149px]"
								label=""
								:options="filterMock"
								responsivePlaceholder="Filtrar"
								@change="handleChangeSelect"
							/>
						</div>

						<div class="flex flex-wrap items-center gap-2 w-max">
							<span class="hidden md:block font-nunito text-sm font-extrabold">Ordenar:</span>
							<BaseVeeSelectV2
								id="order"
								:value="orderId"
								icon="iconUpDown"
								class="w-[154px] md:w-[149px]"
								:options="orderMock"
								responsivePlaceholder="Ordenar"
								@change="handleChangeSelect"
							/>
						</div>

						<BaseButton
							v-if="isAdmin"
							styles="!bg-secondary hover:!bg-[#021033] text-white min-h-[36px] px-4 py-3.5 text-sm !w-max"
							@click="showUploadModal = true"
						>
							<div class="flex gap-2 items-center">
								<nuxt-icon name="icon-upload" filled class="text-[18px]" />
								<span>Subir documento</span>
							</div>
						</BaseButton>
					</div>
				</div>
			</div>

			<div
				v-if="searchVal.trim().length >= 3 || searchActive"
				class="font-nunito text-black mb-4 text-xs md:text-sm"
			>
				{{ filterListSearch.length }} resultados con: <b>{{ searchVal }}</b>
			</div>

			<div v-if="!searchActive">
				<div v-for="doc in filterListWithCategories" :key="doc.id">
					<BaseSubtitle :text="doc.nombre || ''" />
					<CardTableDoc
						:data="doc.documentos || []"
						:on-action="(item) => handleAction(item, doc.nombre)"
						:on-download="
							(data) => {
								downloadDoc(data);
								eventClick(
									data.titulo ?? 'Título del documento',
									'Click/download-Documentos',
									doc.nombre,
								);
							}
						"
					/>
				</div>
			</div>
			<CardTableDoc
				v-if="searchActive && filterListSearch.length"
				:data="filterListSearch"
				:on-action="(item) => handleAction(item, '')"
				:on-download="
					(doc) => {
						downloadDoc(doc);
						eventClick(
							doc.titulo ?? 'Título del documento',
							'Click/download-Documentos',
						);
					}
				"
				classCard="border-transparent"
			/>
		</div>
		<ModalPdfView
			v-if="showPdfView"
			:name-doc="detailDoc.name"
			:url-doc="detailDoc.url"
			:type-doc="detailDoc.type"
			:on-close="() => handleModal(false)"
		/>
	</BaseLayout>
	<ModalUploadDocument
		:show="showUploadModal"
		:categories="categories"
		@close="showUploadModal = false"
		@upload="reloadDocuments"
	/>
</template>
