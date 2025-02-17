<script lang="ts" setup>
import CardEvent from './CardEvent.vue';
import type { ErrorResponse } from '~/types/services.types';
import type {
	EventCategory,
	EventData,
	UbicacionEvento,
} from '~/types/events.types';
import { TagStyle } from '~/types/helper.types';
import BaseBtnTag from '~/components/base/BaseBtnTag.vue';
import { useEventFilterStore } from '~/stores/filterEventCategories';

const filterStore = useEventFilterStore();
const { $api } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const isFromSuperapp = Boolean(route?.query?._session === 'app');
const hasToken = Boolean(route?.query?._tk);

definePageMeta({
	middleware: 'auth',
});

useHead({
	title: 'Eventos',
});

// const profileStore = useProfileStore();
// const config = useRuntimeConfig();

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Eventos', current: false, url: '/eventos' },
	{ name: '', current: true, url: '' },
];
const slug: string = Array.isArray(route.params.slug.length)
	? route.params.slug.length[0]
	: route.params.slug;

const servicesError: Ref<ErrorResponse | null> = ref(null);
const eventsData = ref<EventData[] | null>(null);
const eventData = ref<EventData | null>(null);
const viewModal = ref(false);
const currentLocation = ref<UbicacionEvento>();
const categories = ref<EventCategory[] | null>(null);
const serviceErrorCategory: Ref<any> = ref(null);
// const pending = ref<boolean>(true);
const pendingCategory = ref<boolean>(true);

const { data, error, pending } = await $api.eventos.getEventos(
	{
		lazy: true,
	},
);

const eventClick = (url?: string, title?: string, nameEvent?: string) => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: nameEvent ?? 'Click/Boton-Eventos',
	// 		page_url: `${window.location.href}`,
	// 		...(url && { url }),
	// 		...(title && { title }),
	// 	});
	// }
};

watch(data, (response) => {
	if (response?.data?.length) {
		const detail = response.data.find((x) => String(x.id) === slug);
		eventsData.value = response?.data.slice(0, 3);
		eventData.value = detail ?? null;
		breadcrumbsItem.splice(2, 1, {
			...breadcrumbsItem[2],
			name: detail?.categoriaEvento ?? '',
		});
		detail && generateMeta(detail);

		categories.value = Array.from(
			new Set(response.data?.map((event) => event.categoriaEvento))
		).map((categoriaEvento) => ({ nombre: categoriaEvento }));
	} else if (response?.error) {
		servicesError.value = response.error;
	}
});

const onCategoryClick = (categoryName: string) => {
  filterStore.setCategory(categoryName);
  router.push({ path: '/eventos' });
};

const shared = (url: string, nameEvent: string, title: string) => {
	const link = url + window.location.href;
	generateLink(link);
	eventClick(link, title, nameEvent);
};

const generateLink = (url: string) => {
	const link = document.createElement('a');
	link.href = url;
	link.target = '_blank';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
onMounted(async () => {
	document.querySelector("[property='og:title']")?.remove();
	document.querySelector("[property='og:description']")?.remove();
	document.querySelector("[property='og:image']")?.remove();
	document.querySelector("[property='og:image:width']")?.remove();
	document.querySelector("[property='og:image:height']")?.remove();
	document.querySelector("[property='og:image:type']")?.remove();
	// initDetailEvent();
	// await callEvents();
	pendingCategory.value = false;
});

const generateMeta = (data: EventData) => {
	const metaTitle = document.createElement('meta');
	const metaDescription = document.createElement('meta');
	const meta = document.createElement('meta');
	const metawidth = document.createElement('meta');
	const metaheight = document.createElement('meta');
	const metaType = document.createElement('meta');

	metaTitle.setAttribute('property', 'og:title');
	metaDescription.setAttribute('property', 'og:description');
	meta.setAttribute('property', 'og:image');
	metawidth.setAttribute('property', 'og:image:width');
	metaheight.setAttribute('property', 'og:image:height');
	metaType.setAttribute('property', 'og:image:type');

	metaTitle.content = data.titulo;
	metaDescription.content = 'descripcion';
	meta.content = data.imagenDesktop;
	metawidth.content = '980';
	metaheight.content = '528';
	metaType.content = 'image/jpeg';

	document.getElementsByTagName('head')[0].appendChild(metaTitle);
	document.getElementsByTagName('head')[0].appendChild(metaDescription);
	document.getElementsByTagName('head')[0].appendChild(meta);
	document.getElementsByTagName('head')[0].appendChild(metawidth);
	document.getElementsByTagName('head')[0].appendChild(metaheight);
	document.getElementsByTagName('head')[0].appendChild(metaType);
};

const handleClose = () => {
	viewModal.value = false;
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.remove('overflow-hidden');
};
const handleOpen = () => {
	viewModal.value = true;
};

const onSelectCategory = (name: string) => {
	localStorage.setItem('cat_prev_select', name);
	eventClick(undefined, name, 'Click/Select-category');
};

const seeLocation = (location: UbicacionEvento) => {
	if (isLargeScreen.value) {
		handleOpen();
		currentLocation.value = location;
	} else {
		generateLink(location.urlMobile);
	}
	eventClick(undefined, location.nombre, 'Click/Ver-ubicacion');
};

const isLargeScreen = useMediaQuery('(min-width: 1200px)');
</script>

<template>
	<BaseLayout
		stylesMain="!px-0"
		:rightAside="isLargeScreen ? true : false"
		bgWhite
	>
		<div class="px-6">
			<BaseBreadcrumbs
				v-if="eventData && !isFromSuperapp"
				:items="breadcrumbsItem"
				class="mb-[19px]"
			/>
			<div v-if="pending" class="w-full h-[240px] flex justify-center">
				<BaseStatusLoading />
			</div>
			<!-- <ScheduleStatusError
				v-else-if="error || servicesError || !eventData"
				class="w-full h-[240px] md:h-[280px]"
				:text="
					servicesError?.titulo || 'Lo sentimos, no pudimos cargar tus Eventos'
				"
				:description="
					servicesError?.descripcion || 'Inténtalo de nuevo más tarde'
				"
				:icono="servicesError?.icono"
			/> -->
		</div>
		<div v-if="eventData">
			<div
				class="px-6 py-5 bg-extra_gray lg:flex flex-row-reverse justify-between lg:px-10 lg:gap-4"
			>
				<div class="lg:pt-4 lg:flex-1">
					<BaseBtnTag
						:title="eventData.categoriaEvento"
						:color="TagStyle.violet"
						class="mb-2"
					/>

					<div
						class="text-xl leading-[24px] text-black font-extrabold mb-4 lg:text-2xl"
					>
						{{ eventData?.titulo }}
					</div>

					<div>
						<div v-if="eventData?.fechaInicioEvento" class="flex mb-2">
							<div class="flex gap-1 items-center lg:px-4 lg:py-2 lg:bg-white">
								<div>
									<nuxt-icon
										name="upn-icon-calendar2"
										class="text-base"
										filled
									/>
								</div>
								<time
									:datetime="eventData?.fechaInicioEvento"
									class="text-sm text-black font-nunito capitalize"
								>
									<span
										v-if="
											eventData.fechaInicioEvento !==
												eventData.fechaFinEvento && eventData.fechaFinEvento
										"
									>
										Del
									</span>
									{{
										useDateFormat(
											eventData?.fechaInicioEvento,
											'dddd DD [de] MMMM, YYYY',
											{
												locales: 'es-ES',
											},
										).value
									}}
									<template
										v-if="
											eventData.fechaInicioEvento !==
												eventData.fechaFinEvento && eventData.fechaFinEvento
										"
									>
										<span class="lowercase">al</span>
										{{
											useDateFormat(
												eventData?.fechaFinEvento,
												'dddd DD [de] MMMM, YYYY',
												{
													locales: 'es-ES',
												},
											).value
										}}
									</template>
								</time>
							</div>
						</div>
						<div
							v-if="
								eventData?.fechaInicioEvento && eventData.horaInicioEvento
							"
							class="flex gap-1 items-center mb-2 lg:w-fit lg:px-4 lg:py-2 lg:bg-white"
						>
							<div>
								<nuxt-icon name="upn-icon-time" class="text-base" filled />
							</div>
							<time
								:datetime="eventData.horaInicioEvento"
								class="text-sm text-black font-nunito"
							>
								{{
									useDateFormat(
										eventData?.fechaInicioEvento +
											eventData.horaInicioEvento,
										'hh:mm A',
										{
											locales: 'es-ES',
										},
									).value
								}}
							</time>
						</div>
						<span
							class="flex gap-1 items-center text-sm text-black font-nunito lg:w-fit lg:px-4 lg:py-2 lg:bg-white capitalize"
						>
							<div v-if="eventData.tipoDeEvento === 'virtual'">
								<nuxt-icon
									name="upn-icon-map-light-blue"
									class="text-base"
									filled
								/>
							</div>
							<div v-if="eventData.tipoDeEvento === 'presencial'">
								<nuxt-icon
									name="upn-icon-map-pin2-yellow"
									class="text-base"
									filled
								/>
							</div>
							{{ eventData.tipoDeEvento }}
						</span>
					</div>
				</div>

				<div class="mt-5 lg:w-[66.2%] lg:m-0">
					<img
						:src="
							isLargeScreen ? eventData.imagenDesktop : eventData.imagenMobile
						"
						class="w-full sm:h-[344px] lg:max-w-[558px] aspect-[16/10] object-cover"
						:class="{ 'h-[200px]': isLargeScreen }"
						alt="img-evento"
					/>
				</div>
			</div>

			<div class="bg-white px-6 py-5 lg:px-10">
				<div
					class="border border-x-0 border-t-0 border-b-disable mb-10 lg:flex gap-4 lg:pt-5"
				>
					<div class="mb-10 lg:w-[66.2%]">
						<div
							class="font-bold text-black font-robotoCondensed text-xl leading-6 mb-4"
						>
							ACERCA DEL EVENTO
						</div>
						<div
							class="text-sm font-nunito mb-4 lg:w-[93%]"
							v-html="eventData.descripcion"
						></div>
						<BaseButton
							v-if="eventData.url && eventData.nombreBoton.trim().length"
							:url="eventData?.url"
							styles="!w-auto !inline-block !min-w-auto !min-h-[38px] !h-auto !font-extrabold font-nunito !text-sm !px-4 !py-2.5"
							@click="eventClick(eventData?.url, eventData?.titulo)"
						>
							{{ eventData.nombreBoton }}
						</BaseButton>
					</div>
					<div class="mb-10 lg:flex-1">
						<div
							class="font-bold text-black font-robotoCondensed text-xl leading-6 mb-4"
						>
							MÁS DETALLES
						</div>
						<div class="font-nunito font-extrabold text-sm text-black mb-1">
							Vacantes
						</div>
						<div class="flex gap-[3px] items-center font-nunito text-sm mb-4">
							<nuxt-icon name="upn-icon-team-yellow" class="text-base" filled />
							{{ eventData.capacidad }}
						</div>
						<div v-if="eventData.ubicacion.length" class="mb-4">
							<div class="font-nunito font-extrabold text-sm text-black mb-1">
								Ubicación
							</div>
							<div class="flex flex-wrap flex-col gap-1">
								<span
									v-for="(ubicacion, index) in eventData.ubicacion"
									:key="index"
									class="font-nunito flex gap-1 text-sm"
								>
									<nuxt-icon
										name="upn-icon-map-pin2-yellow"
										class="text-base"
										filled
									/>
									<p>{{ ubicacion.nombre }}</p>
									<p v-if="isLargeScreen">
										<template
											v-if="
												ubicacion.url &&
												ubicacion.url.trim() &&
												ubicacion.url.trim().length > 0
											"
										>
											<span
												class="text-blue_light underline cursor-pointer"
												@click="() => seeLocation(ubicacion)"
											>
												(Ver ubicación)
											</span>
										</template>
									</p>
									<p v-else>
										<template
											v-if="
												ubicacion.urlMobile &&
												ubicacion.url.trim() &&
												ubicacion.urlMobile.trim().length > 0
											"
										>
											<span
												class="text-blue_light underline cursor-pointer"
												@click="() => seeLocation(ubicacion)"
											>
												(Ver ubicación)
											</span>
										</template>
									</p>
								</span>
							</div>
						</div>
						<div class="font-nunito font-extrabold text-sm text-black mb-2">
							Comparte con tus amigos
						</div>
						<div class="flex gap-4">
							<nuxt-icon
								name="upn-icon-facebook-circle"
								class="text-2xl cursor-pointer"
								filled
								@click="
									() =>
										shared(
											`https://www.facebook.com/sharer/sharer.php?u=`,
											'Click/Compartir-Facebook',
											eventData?.titulo ?? '',
										)
								"
							/>
							<nuxt-icon
								name="upn-icon-twitter-circle"
								class="text-2xl cursor-pointer"
								filled
								@click="
									() =>
										shared(
											`http://twitter.com/share?text=${eventData?.titulo}&url=`,
											'Click/Compartir-Twitter',
											eventData?.titulo ?? '',
										)
								"
							/>
							<nuxt-icon
								name="upn-icon-linkedin-circle"
								class="text-2xl cursor-pointer"
								filled
								@click="
									() =>
										shared(
											`https://www.linkedin.com/sharing/share-offsite/?url=`,
											'Click/Compartir-Linkedin',
											eventData?.titulo ?? '',
										)
								"
							/>
							<nuxt-icon
								name="upn-icon-whatsapp"
								class="text-2xl cursor-pointer"
								filled
								@click="
									() =>
										shared(
											`https://api.whatsapp.com/send?text=${eventData?.titulo} `,
											'Click/Compartir-Whatsapp',
											eventData?.titulo ?? '',
										)
								"
							/>
						</div>
					</div>
				</div>
				<BaseSubtitle text="PUBLICACIONES RELACIONADAS" class="mb-4" />
				<div class="overflow-auto">
					<div class="flex gap-4 w-fit">
						<CardEvent
							v-for="(item, i) in eventsData"
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
							alt=""
							classArticle="!px-0 w-[272px] lg:w-[260px] lg:!px-4"
							secondary
							:isFromSuperapp="isFromSuperapp"
							:hasToken="hasToken"
						/>
					</div>
				</div>
			</div>
		</div>
		<BaseModal
			v-if="viewModal"
			width="w-[964px]"
			:handleClose="handleClose"
			:show-close="false"
			:style="`p-8`"
		>
			<div class="!mb-4 flex justify-between">
				<BaseTitle
					:text="currentLocation?.nombre ?? ''"
					class="!m-0 text-[32px] capitalize"
				/>
				<nuxt-icon
					name="upn-icon-close-yellow"
					class="cursor-pointer text-[24px]"
					filled
					@click="handleClose"
				/>
			</div>

			<div class="w-full h-[1px] bg-celestial_white mb-4"></div>
			<iframe
				width="100%"
				height="450px"
				:src="currentLocation?.url"
				frameborder="0"
			></iframe>
			<BaseButton
				styles="mt-4 !w-[120px] !h-[46px] py-3.5 px-4 text-sm"
				@click="handleClose"
			>
				Cerrar mapa
			</BaseButton>
		</BaseModal>
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
					@click="() => onCategoryClick(category.nombre)"
				>
					<NuxtLink :to="`/eventos`">
						{{ category.nombre }}
					</NuxtLink>
				</div>
			</div>
		</template>
	</BaseLayout>
</template>
