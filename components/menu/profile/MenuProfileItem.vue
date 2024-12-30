<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { useMenuStore } from '~/stores/menu';
import { useProfileStore } from '~/stores/profile';

const menuStore = useMenuStore();
const profileStore = useProfileStore();
const authInfo = useUserStoreAuth();
const isLargeScreen = useMediaQuery('(min-width: 1024px)');

const validImg = ref(true);
const imageLoadError = () => {
	validImg.value = false;
};

const eventClick = () => {
	menuStore.closeMenuProfile();
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-MenuHeader',
	// 		url: `${window.location.host}/perfil`,
	// 		title: 'Ver mi perfil',
	// 	});
	// }
};
</script>

<template>
	<li
		class="group pl-4 pr-2 md:hover:bg-black border-b-[1px] border-b-[#C2D1D9] lg:border-none mb-4 lg:mb-0"
	>
		<NuxtLink
			class="grid grid-cols-[40px_1fr] grid-rows-2 lg:flex gap-x-2 md:gap-x-1 items-center mb-4 lg:mb-0 py-1 lg:py-2.5"
			to="/perfil"
			@click="eventClick"
		>
			<img
				v-if="!isLargeScreen && profileStore.profileData.data?.fotoUrl"
				:src="profileStore.profileData.data?.fotoUrl"
				class="h-[40px] w-[40px] md:mr-1 row-span-2 rounded-full"
				alt="Foto de perfil"
			/>
			<img
				v-else-if="
					!isLargeScreen &&
					!profileStore.profileData.pending &&
					profileStore.profileData.data?.fotoUrlLow &&
					validImg
				"
				:src="profileStore.profileData.data?.fotoUrlLow"
				class="h-[40px] w-[40px] md:mr-1 row-span-2 rounded-full"
				alt="Foto de perfil"
				@error="imageLoadError"
			/>
			<nuxt-icon
				v-else
				name="profileIcon"
				class="text-[20px] md:group-hover:text-white"
			/>
			<span
				v-if="!isLargeScreen && !profileStore.profileData.pending"
				class="text-sm font-extrabold cursos-pointer leading-[18px] inline-block self-end capitalize font-nunito text-black"
			>
				{{
					authInfo.user.name?.toLowerCase() ||
					profileStore.profileData.data?.fullName.toLowerCase()
				}}
			</span>
			<span
				class="text-sm font-nunito leading-[18px] underline lg:no-underline lg:text-black lg:font-extrabold text-blue_light md:group-hover:text-white"
			>
				Ver mi perfil
			</span>
		</NuxtLink>
	</li>
</template>

