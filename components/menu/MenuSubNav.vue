<script lang="ts" setup>
interface Props {
	url: string | null;
	nombre: string;
	etiqueta: string;
	abrir_nueva_pagina: boolean;
}

const props = defineProps<{
	id: number;
	openedSubmenu: number | null;
	isMobile: boolean;
	submenu: Props[];
	closeMenu: () => void;
}>();

const subMenu = props.submenu.filter(
	(item) => useGetRoute(item.etiqueta) || item.url,
);

const eventClick = (url: string, title: string, status?: boolean) => {
	const dataUrl = status ? url : `${window.location.host}${url}`;
	props.closeMenu();
};
</script>
<template>
	<ul
		v-if="subMenu.length"
		class="submenu-nav"
		:class="{
			block: id === openedSubmenu && isMobile,
			hidden: id !== openedSubmenu || !isMobile,
		}"
	>
		<template v-for="it in submenu" :key="it.nombre">
			<li v-if="it.url || useGetRoute(it.etiqueta)" class="cursos-default">
				<NuxtLink
					class="submenu-item"
					:to="it.url || useGetRoute(it.etiqueta)"
					:target="it.abrir_nueva_pagina ? '_black' : '_self'"
					@click="
						eventClick(
							it.url || useGetRoute(it.etiqueta),
							it.nombre,
							it.abrir_nueva_pagina,
						)
					"
				>
					{{ it.nombre }}
				</NuxtLink>
			</li>
		</template>
	</ul>
</template>

<style lang="postcss" scoped>
.submenu-nav {
	@apply w-full md:group-hover:block md:absolute md:left-full md:-top-2 py-2 md:w-[160px] bg-white md:shadow-[0px_4px_30px_0px_rgba(0,_0,_0,_0.25)];
}

.submenu-item {
	@apply leading-[1] font-telegraf font-bold capitalize text-[14px] block px-5 py-[10px] hover:bg-black hover:text-white cursor-pointer;
}
</style>
