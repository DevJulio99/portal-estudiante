<script lang="ts" setup>
import { ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { vOnClickOutside } from '@vueuse/components';
import { Menu } from '~/types/helper.types';
import MenuNavItem from './MenuNavItem.vue';

const menuStore = useMenuStore();
const isMediumScreen = useMediaQuery('(min-width: 768px)');
const openedSubmenu = ref<null | number>(null);

const handleSubmenu = (id: number, title: string) => {
	if (openedSubmenu.value !== id) {
		// if (window.dataLayer) {
		// 	window.dataLayer.push({
		// 		event: 'Click-OpenMenuNavMobile',
		// 		section: 'Menú nav',
		// 		title,
		// 	});
		// }
		openedSubmenu.value = id;
	} else openedSubmenu.value = null;
};

// close submenus if menu dropdown is not visible
watch(
	() => menuStore.menuNav,
	(state) => {
		if (!state) openedSubmenu.value = null;
	},
);

const eventClick = (url: string, title: string, status?: boolean) => {
	const dataUrl = status ? url : `${window.location.host}${url}`;
	menuStore.closeMenuNav();
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-MenuNav',
	// 		section: 'Menú nav',
	// 		url: dataUrl,
	// 		title,
	// 	});
	// }
};
</script>

<template>
	<nav
		v-on-click-outside.bubble="menuStore.closeMenuNav"
		class="main-nav"
		:class="{ block: menuStore.menuNav, hidden: !menuStore.menuNav }"
	>
		<ul v-if="!menuStore.mainMenuData.pending" class="w-full">
			<template v-for="item in menuStore.validMenu" :key="item.id">
				<!-- Link sin submenu -->
				<li
					v-if="!item.submenu.length"
					class="pl-4 pr-2"
					:class="{ 'md:hover:bg-[#85c1e9]': item.etiqueta !== Menu.RADIO }"
				>
					<NuxtLink
						v-if="item.etiqueta !== Menu.RADIO"
						class="flex items-center mb-4 py-1"
						:to="item.url ?? useGetRoute(item.etiqueta)"
						@click="
							eventClick(
								item.url ?? useGetRoute(item.etiqueta),
								item.nombre,
								item.abrir_nueva_pagina,
							)
						"
					>
						<nuxt-img
							:src="item.icono ?? ''"
							alt=""
							class="pr-1 w-[25px] h-[25px]"
						/>
						<span class="text-styles cursos-pointer mt-[3px]">
							{{ item.nombre }}
						</span>
					</NuxtLink>
					<a
						v-else-if="item.url"
						:href="item.url"
						target="_blank"
						class="inline-block mb-5 py-[6px] md:mb-0"
						@click="eventClick(item.url, item.nombre)"
					>
						<nuxt-img :src="item.icono ?? ''" alt="" class="w-[95px]" />
					</a>
				</li>
				<!-- Opción con submenu -->
				<li
					v-else
					class="relative flex flex-col md:flex-row items-center mb-4 md:py-1 md:pl-4 md:pr-2 md:hover:bg-[#85c1e9] group"
					:class="{
						'submenu-style': openedSubmenu === item.id && !isMediumScreen,
					}"
				>
					<!-- mobile -->
					<button
						v-if="!isMediumScreen"
						class="w-full flex items-center text-left pl-4 pr-2 py-1"
						:class="{ 'bg-[#85c1e9]': openedSubmenu === item.id }"
						@click="handleSubmenu(item.id, item.nombre)"
					>
						<MenuNavItem
							:name="item.nombre"
							:icon="item.icono"
							:isOpen="openedSubmenu === item.id"
							:lg="false"
						/>
					</button>
					<!-- desktop -->
					<MenuNavItem
						v-else
						:name="item.nombre"
						:icon="item.icono"
						:isOpen="false"
						:lg="false"
					/>
					<!-- desktop y mobile -->
					<MenuSubNav
						:id="item.id"
						:openedSubmenu="openedSubmenu"
						:submenu="item.submenu"
						:isMobile="!isMediumScreen"
						:closeMenu="menuStore.closeMenuNav"
					/>
				</li>
			</template>
		</ul>
	</nav>
</template>

<style lang="postcss" scoped>
.main-nav {
	@apply absolute w-full md:relative md:block md:border-r-[1px] md:border-[#D9D9D9] md:w-[156px] bg-white shadow-bgBox md:shadow-none md:bg-[#FAFAFA] md:min-h-[calc(100vh_-_64px)] top-[64px] pt-5 z-20;
}

.text-styles {
	@apply leading-[1] font-nunito font-extrabold capitalize text-[14px];
}

.submenu-style:not(:last-child) {
	@apply shadow-bgBox;
}
</style>
