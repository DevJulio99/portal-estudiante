<script lang="ts" setup>
import { ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { vOnClickOutside } from '@vueuse/components';
import { useMenuStore } from '~/stores/menu';

const { $msal } = useNuxtApp();
const menuStore = useMenuStore();
const tokenStore = useTokenStore();
const router = useRouter();
const isLargeScreen = useMediaQuery('(min-width: 1024px)');
const openedSubmenu = ref<null | number>(null);
const needHelp = ref();
const profileStore = useProfileStore();
const postulanteStore = usePostulanteStore();
const alumnoStore = useAlumnoStore();

const handleSubmenu = (id: number, title: string) => {
	if (openedSubmenu.value !== id) {
		// if (window.dataLayer) {
		// 	window.dataLayer.push({
		// 		event: 'Click-MenuHeaderMobile',
		// 		section: 'Ayuda',
		// 		title,
		// 	});
		// }
		openedSubmenu.value = id;
	} else openedSubmenu.value = null;
};

const validImg = ref(true);
const imageLoadError = () => {
	validImg.value = false;
};

async function signOut() {
	profileStore.clearPorfileData();
	postulanteStore.limpiarPostulante();
	tokenStore.clearTokens();
	const userDev = JSON.parse(localStorage.getItem('userDev')!);
	menuStore.closeMenuProfile();
	menuStore.resetMainMenuData();
	alumnoStore.resetAlumnos();
	router.push('/login');
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-MenuHeader',
	// 		section: 'Desplegable perfil',
	// 		title: 'Cerrar sesión',
	// 	});
	// }
	if (userDev) {
		//useLogoutDev();
	} else {
		// await $msal().signOut($msal().getAccounts()[0].homeAccountId);
	}
}

// close submenu if menu dropdown is not visible
watch(
	() => menuStore.menuProfile,
	(state) => {
		if (!state) openedSubmenu.value = null;
	},
);

watch(
	() => menuStore.headerMenuData,
	(menu) => {
		if (!menu.error) {
			needHelp.value = menu.data?.filter((x) => x.submenu.length);
		}
	},
);

const eventClick = (url: string, title: string) => {
	menuStore.closeMenuNav();
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-MenuHeaderMobile',
	// 		section: 'Enlaces',
	// 		url,
	// 		title,
	// 	});
	// }
};

onMounted(() => {
	if(tokenStore.getDataToken.Role == 'admin'){
       profileStore.profileData.data = {
		...profileStore.profileData.data as any,
		fullName: tokenStore.getDataToken.Name,
		usuarioEmail : tokenStore.getDataToken.Email,
		documenIdentida: tokenStore.getDataToken.Dni_Usuario,
	   }
	}
})
</script>

<template>
	<nav
		v-on-click-outside.bubble="menuStore.closeMenuProfile"
		class="main-nav !z-[35]"
		:class="{ block: menuStore.menuProfile, hidden: !menuStore.menuProfile }"
	>
		<div v-if="isLargeScreen" class="py-[10px] flex flex-col items-center">
			<img
				v-if="profileStore.profileData.data?.fotoUrl"
				:src="profileStore.profileData.data?.fotoUrl"
				class="h-[60px] w-[60px] md:mr-1 row-span-2 rounded-full object-cover"
				alt="Foto de perfil"
			/>
			<img
				v-else-if="
					!profileStore.profileData.pending &&
					profileStore.profileData.data?.fotoUrlLow &&
					validImg
				"
				:src="profileStore.profileData.data?.fotoUrlLow"
				class="h-[60px] w-[60px] md:mr-1 row-span-2 rounded-full object-cover"
				alt="Foto de perfil"
				@error="imageLoadError"
			/>
			<p class="capitalize text-sm font-bold mt-2">
				{{ profileStore.profileData.data?.fullName.toLowerCase() }}
			</p>
			<p>({{ profileStore.profileData.data?.codAlumno }})</p>
		</div>
		<ul class="w-full">
			<MenuProfileItem />
			<template v-if="!isLargeScreen && !menuStore.headerMenuData?.pending">
				<!-- <template v-for="item in menuStore.headerMenuData?.data" :key="item.id">
					<li v-if="!item.submenu.length" class="pl-4 pr-2 md:hover:bg-primary">
						<a
							class="flex items-center mb-4 py-2"
							:href="item.url ?? ''"
							target="_blank"
							@click="eventClick(item.url ?? '', item.titulo)"
						>
							<img :src="item.imagen" alt="" class="pr-1 w-[20px] h-[20px]" />
							<span class="text-styles cursos-pointer">
								{{ item.titulo }}
							</span>
						</a>
					</li>
					<li
						v-else
						class="submenu-item group"
						:class="{ 'submenu-style': openedSubmenu === item.id }"
					>
						<button
							v-if="!isLargeScreen"
							class="w-full flex items-center text-left pl-4 pr-2 py-1"
							:class="{ 'bg-primary': openedSubmenu === item.id }"
							@click="handleSubmenu(item.id, item.titulo)"
						>
							<MenuNavItem
								:name="item.titulo"
								:icon="item.imagen"
								:isOpen="openedSubmenu === item.id"
								lg
							/>
						</button>
						<MenuNavItem
							v-else
							:name="item.titulo"
							:icon="item.imagen"
							:isOpen="false"
							lg
						/>
						<MenuProfileSubNav
							:id="item.id"
							:openedSubmenu="openedSubmenu"
							:submenu="item.submenu"
						/>
					</li>
				</template> -->

				<template v-for="item in needHelp" :key="item.id">
					<MenuProfileSubNav
						v-if="item.submenu.length"
						:id="item.id"
						:openedSubmenu="item.id"
						:submenu="item.submenu"
					/>
				</template>
			</template>
			<li class="mb-4 lg:mb-2 border-t-[1px] border-t-[#C2D1D9] lg:border-none">
				<button
					class="group w-full flex items-center gap-x-1 text-left pl-4 pr-2 py-2 mt-2 lg:mt-0 lg:py-2.5 md:hover:bg-error"
					@click="signOut"
				>
					<nuxt-icon
						name="upn-icon-logout-box"
						class="text-[20px] text-error md:group-hover:text-white"
					/>
					<span
						class="text-styles cursos-pointer text-error md:group-hover:text-white"
					>
						Cerrar sesión
					</span>
				</button>
			</li>
		</ul>
	</nav>
</template>

<style lang="postcss" scoped>
.main-nav {
	@apply fixed top-[64px] left-0 md:left-[initial] md:right-[24px] w-full md:w-[284px] bg-[#FAFAFA] lg:bg-white shadow-bgBox pt-5 md:pt-2 z-10;
}

.text-styles {
	@apply leading-[18px] font-nunito font-extrabold text-[14px];
}
.submenu-item {
	@apply relative flex flex-col lg:flex-row items-center mb-4 lg:py-1 lg:pl-4 lg:pr-2 md:hover:bg-primary;
}

.submenu-style:not(:last-child) {
	@apply shadow-bgBox;
}
</style>
