<script setup lang="ts">
import jsonDefMenuHeader from '~/utils/data/menuHeader.json';

const menuStore = useMenuStore();
const helpInfo = menuStore.headerMenuData?.data?.find(
	(item: any) => item.submenu.length,
);
const menuInfo = menuStore.headerMenuData?.data
	? menuStore.headerMenuData?.data?.filter((item: any) => !item.submenu.length)
	: jsonDefMenuHeader.filter((item) => !item.submenu.length);

const isMediumScreen = true;//useMediaQuery('(min-width: 768px)');

const eventClickOpen = (title: string) => {
	menuStore.toggleMenuInfo();
};

</script>

<template>
	<div class="flex w-full pl-40 pr-0">
		<!-- <ul v-if="menuInfo?.length" class="w-[55%] flex items-center">
			<li v-for="item in menuInfo" :key="item.id" class="links-section">
				<a
					:href="item.url ?? ''"
					target="_blank"
					class="flex items-center capitalize gap-1"
				>
					<nuxt-img
						:preload="!isMediumScreen"
						:src="item.imagen ?? ''"
						class="w-[22px] h-[22px]"
					/>
					<span class="font-bold mr-1 mt-1">{{
						item.titulo.toLowerCase()
					}}</span>
				</a>
			</li>
		</ul> -->
		<button
			v-if="Boolean(helpInfo)"
			class="btn-help"
			:aria-label="helpInfo?.titulo ?? 'Más ayuda'"
			@click.stop="eventClickOpen(helpInfo?.titulo ?? '')"
		>
			<nuxt-img
				:preload="!isMediumScreen"
				:src="helpInfo?.imagen ?? ''"
				class="w-[20px] h-auto"
			/>
			<span class="font-bold">{{ helpInfo?.titulo }}</span>
		</button>
		<div
			class="flex items-center"
			:class="{
				'before:block before:w-[1px] before:h-[5px] before:bg-black before:mx-4':
					helpInfo,
				'w-full': !helpInfo,
			}"
		>
			<!-- <button aria-label="Notificaciones" class="btn-notifications">
				<nuxt-icon name="bellIcon" class="text-[20px]" />
			</button> -->
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.links-section:not(:last-child) {
	@apply flex items-center after:inline-block after:w-[1px] after:h-[5px] after:bg-black after:mx-4;
}

.btn-help {
	@apply flex items-center h-[40px] bg-primary px-[10px] ml-auto rounded-md gap-1;
}

.btn-notifications {
	@apply flex items-center h-[40px] w-[40px] px-[10px] border-[1px] border-primary rounded-full ml-auto;
}
</style>
