<script lang="ts" setup>
const menuStore = useMenuStore();
interface Props {
	url: string | null;
	titulo: string;
	imagen: string;
	descripcion: string;
}

defineProps<{
	id: number;
	openedSubmenu: number | null;
	submenu: Props[];
}>();

const eventClick = (url: string, title: string) => {
	menuStore.closeMenuProfile();
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click-MenuHeaderMobile',
	// 		section: 'Ayuda',
	// 		url,
	// 		title,
	// 	});
	// }
};
</script>
<template>
	<ul
		class="submenu-nav"
		:class="{
			block: id === openedSubmenu,
			hidden: id !== openedSubmenu,
		}"
	>
		<template v-for="it in submenu" :key="it.titulo">
			<li v-if="it.url">
				<a
					class="submenu-item"
					:href="it.url"
					target="_blank"
					@click="eventClick(it.url, it.titulo)"
				>
					<nuxt-img
						:src="it.imagen ?? ''"
						alt=""
						class="w-[20px] mb-4 row-span-2"
					/>
					<span
						class="text-sm inline-block leading-[18px] font-extrabold capitalize font-telegraf"
					>
						{{ it.titulo }}
					</span>
					<span class="text-sm leading-[22px] font-normal font-telegraf">{{
						it.descripcion
					}}</span>
				</a>
			</li>
		</template>
	</ul>
</template>

<style lang="postcss" scoped>
.submenu-nav {
	@apply w-full lg:group-hover:block lg:absolute lg:left-full lg:-top-2 lg:w-[160px] bg-[#FAFAFA] lg:bg-white lg:shadow-[0px_4px_30px_0px_rgba(0,_0,_0,_0.25)] mb-4;
}

.submenu-item {
	@apply leading-[1] font-telegraf text-xs grid grid-cols-[20px_1fr] grid-rows-2 gap-x-2 items-center px-4 py-2;
}
</style>
