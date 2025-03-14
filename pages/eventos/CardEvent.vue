<script lang="ts" setup>
import { useMediaQuery, useDateFormat } from '@vueuse/core';
import { TagStyle } from '~/types/helper.types';

const props = withDefaults(
	defineProps<{
		id: number;
		title: string;
		dateStart: string;
		dateEnd: string;
		time: string;
		description: string;
		imgDesktop: string;
		imgMobile: string;
		alt: string;
		url: string;
		tag: string;
		tagUrl: string;
		typeEvent: string;
		style?: TagStyle;
		secondary?: boolean;
		classArticle?: string;
		onCategory?: (name: string) => void;
		isFromSuperapp?: boolean;
		hasToken?: boolean;
	}>(),
	{
		style: TagStyle.default,
		secondary: false,
		isFromSuperapp: false,
		hasToken: false,
		classArticle: '',
	},
);

// const profileStore = useProfileStore();
// const config = useRuntimeConfig();
// const { user } = useUserStoreAuth();
const router = useRouter();
const querys = `${props.isFromSuperapp ? '?_session=app' : ''}${props.hasToken ? `&_tk=${123}` : ''}`;

const eventClick = (url: string, title: string, tag: string) => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Card-Eventos',
	// 		page_url: `${window.location.href}`,
	// 		tag,
	// 		url,
	// 		title,
	// 	});
	// }
	// router.replace(`/eventos/${props.id}${querys}`);
};

// const identifierEvent = () => {
// 	const objectIdentifier = {
// 		codCampus: profileStore.profileData.data?.codCampus,
// 		codNivel: profileStore.profileData.data?.codNivel,
// 		facultad: profileStore.profileData.data?.facultad,
// 		codProductoActual: profileStore.profileData.data?.codProductoActual,
// 		status: profileStore.profileData.data?.status,
// 		id: props.id,
// 	};

// 	const crypto = CryptoJS.AES.encrypt(
// 		JSON.stringify(objectIdentifier),
// 		config.public.keyCrypto,
// 	).toString();
// 	return crypto.replace(/[/]/g, 'U0002FSla');
// };

const isLargeScreen = useMediaQuery('(min-width: 1024px)');
</script>
<template>
	<article
		class="cursor-pointer bg-white w-full rounded-[20px] px-5 pt-5 pb-6 relative flex flex-wrap gap-4 overflow-hidden justify-between h-full lg:grid-cols-[200px_1fr]"
		:class="`${classArticle}`"
	>
		<NuxtLink
			:to="`/eventos/${id}${querys}`"
			@click="eventClick(`eventos/${id}`, title, tag)"
		>
			<div class="w-full rounded-lg overflow-hidden aspect-[16/10]">
				<img
					:src="isLargeScreen ? imgDesktop : imgMobile"
					:alt="alt"
					class="w-full object-cover"
				/>
			</div>
		</NuxtLink>

		<div class="w-full flex flex-col items-start lg:pr-2 text-truncate-title">
			<div class="flex gap-2">
				<BaseBtnTag
					:title="tag"
					:color="style"
					class="mb-2"
					:onclick="() => onCategory && onCategory(tag)"
				/>
				<nuxt-icon
					v-if="typeEvent === 'virtual'"
					filled
					name="upn-icon-computer-black"
					class="text-xs inline-block rounded-full h-[20px] bg-[#DDE7F8] text-neutral py-1 px-2"
				/>
				<nuxt-icon
					v-if="typeEvent !== 'virtual'"
					filled
					name="upn-icon-map-black"
					class="text-xs inline-block rounded-full h-[20px] bg-[#9ce0d1] text-neutral py-1 px-2"
				/>
			</div>

			<NuxtLink
				:to="`/eventos/${id}${querys}`"
				@click="eventClick(`eventos/${id}`, title, tag)"
			>
				<h2
					class="mb-3 h-[36px] group-hover:underline text-sm leading-[1.2] font-nunito font-extrabold transition-all duration-300 text-truncate-title"
				>
					{{ title }}
				</h2>
			</NuxtLink>

			<div v-if="dateStart" class="flex flex-wrap mt-2 gap-2 leading-4">
				<div
					class="flex-1 justify-start flex gap-1 place-content-center items-center whitespace-nowrap leading-none"
				>
					<div>
						<nuxt-icon name="upn-icon-calendar2" class="text-base" filled />
					</div>

					<div
						class="text-xs text-gray_80 font-nunito font-extrabold uppercase whitespace-nowrap leading-none"
					>
						<time
							v-if="dateStart && (!dateEnd || dateStart === dateEnd)"
							:datetime="dateStart"
						>
							{{
								useDateFormat(dateStart, 'DD MMM', { locales: 'es-ES' }).value
							}}
						</time>
						<template v-else-if="dateStart && dateEnd && dateStart !== dateEnd">
							<time :datetime="dateStart">
								{{
									useDateFormat(dateStart, 'DD MMM', { locales: 'es-ES' }).value
								}}
							</time>
							<span> - </span>
							<time :datetime="dateEnd">
								{{
									useDateFormat(dateEnd, 'DD MMM', { locales: 'es-ES' }).value
								}}
							</time>
						</template>
					</div>
				</div>
				<div
					v-if="time"
					class="flex-1 justify-start flex gap-1 place-content-center items-center whitespace-nowrap leading-none"
				>
					<div>
						<nuxt-icon name="upn-icon-time" class="text-base" filled />
					</div>

					<div>
						<time
							:datetime="time"
							class="text-xs text-gray_80 font-nunito font-extrabold uppercase"
						>
							{{
								useDateFormat(dateStart + time, 'hh:mm A', { locales: 'es-ES' })
									.value
							}}
						</time>
					</div>
				</div>
			</div>
		</div>
	</article>
</template>

<style scoped>
.text-truncate {
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1;
	display: -webkit-box;
	-webkit-box-orient: vertical;
}

.text-truncate-title {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.default {
	-webkit-line-clamp: 5;
}

.secondary {
	-webkit-line-clamp: 3;
}
</style>
