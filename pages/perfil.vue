<script setup lang="ts">
// import { useMediaQuery } from '@vueuse/core';
import { useProfileStore } from '~/stores/profile';


useHead({
	title: 'Mi Perfil',
});

const profileStore = useProfileStore();
// const userName = user?.name || profileStore.profileData.data?.fullName;
const userName = profileStore.profileData.data?.fullName;
// const isMediumScreen = useMediaQuery('(min-width: 768px)');

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Mi Perfil', current: true, url: '/perfil' },
];

const validImg = ref(true);
const imageLoadError = () => {
	validImg.value = false;
};
</script>

<template>
	<div class="container-gray min-h-[calc(100vh-64px)]">
		<div class="px-6 md:px-0">
			<BaseBreadcrumbs :items="breadcrumbsItem" />
			<h1 class="my-4 font-grotesk font-bold text-2xl uppercase">Mi Perfil</h1>
		</div>
		<!-- <div v-if="profileStore.profileData.error" class="pt-20 md:pt-40">
			<BaseStatusError
				v-if="profileStore.profileData.error?.default"
				text="Lo sentimos, no pudimos cargar tu perfil."
				description="Inténtalo de nuevo más tarde"
			/>
			<BaseStatusError
				v-else
				:icono="profileStore.profileData.error?.icono"
				:text="
					profileStore.profileData.error?.titulo ||
					'Lo sentimos, no pudimos cargar tu perfil.'
				"
				:description="profileStore.profileData.error?.descripcion || ''"
			/>
		</div> -->
		<div class="bg-white">
			<header class="profile-header">
				<div class="profile-header-image">
					<img
						:src="
							profileStore.profileData.data?.fotoUrlLow && validImg
								? profileStore.profileData.data?.fotoUrlLow
								: '/images/profileManDefxl.png'
						"
						class="w-full h-full rounded-full object-cover"
						@error="imageLoadError"
					/>
					<!-- <button class="absolute bottom-0 right-0">
						<BaseIconBgCircle
							:size="isMediumScreen ? '40px' : '25px'"
							:iconSize="isMediumScreen ? '24px' : '16px'"
							iconName="editIcon"
						/>
					</button> -->
				</div>
				<h2 v-if="userName" class="profile-header-subtitle">
					{{ userName.toLowerCase() }}
				</h2>
			</header>
			<template v-if="profileStore.profileData?.data">
				<ProfileSection :data="profileStore.profileData?.data" />
			</template>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.profile-header {
	@apply p-6 md:pb-10 bg-[url(~/assets/images/pattern-mobile.png)] md:bg-[url(~/assets/images/pattern-desktop.png)] bg-repeat-x;
}
.profile-header-image {
	@apply relative w-[100px] h-[100px] md:w-[160px] md:h-[160px] mx-auto mb-2 bg-neutral rounded-full;
}

.profile-header-subtitle {
	@apply md:text-xl text-center font-bold capitalize;
}
</style>
