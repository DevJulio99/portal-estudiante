<script lang="ts" setup>
export interface Props {
	bgWhite?: boolean;
	bgGray?: boolean;
	rightAside?: boolean;
	customBg?: string;
	stylesMain?: string;
	pageHome?: boolean;
	public?: boolean;
	isFromSuperapp?: boolean;
}

withDefaults(defineProps<Props>(), {
	bgWhite: false,
	bgGray: true,
	rightAside: true,
	customBg: '',
	stylesMain: '',
	pageHome: false,
	public: false,
	isFromSuperapp: false,
});
</script>
<template>
	<div
		:class="[
			public || isFromSuperapp
				? 'min-h-[calc(100vh)]'
				: 'min-h-[calc(100vh_-_64px)]',
			customBg,
			{
				'bg-[#F5F5F5]': bgGray && !customBg,
				'bg-white': bgWhite && !customBg,
			},
		]"
		class="flex justify-center"
	>
		<div
			:class="[
				{
					'section-layout': rightAside,
					'flex flex-col w-full max-w-[1380px]': !rightAside,
				},
			]"
		>
			<main
			class="h-full"
				:class="
					pageHome ? `pt-0 px-0 lg:px-0 ` : `py-6 px-3 lg:px-7 ` + stylesMain
				"
			>
				<slot></slot>
			</main>
			<div
				v-if="rightAside"
				class="py-6 px-6 lg:w-[321px] bg-[#E8E8E8] row-span-2"
			>
				<slot name="secondary"></slot>
			</div>
			<!-- <MenuFooter v-if="!isFromSuperapp" /> -->
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.section-layout {
	@apply lg:grid lg:grid-rows-[1fr] lg:grid-cols-[1fr_321px] w-full max-w-[1380px];
}
.footer {
	@apply w-full flex flex-col col-span-2 md:flex-row gap-4 items-center justify-between bg-black text-white px-10 py-5 mt-auto;
}
</style>
