<script lang="ts" setup>
import { useMediaQuery, useDateFormat } from '@vueuse/core';
import { TagStyle } from '~/types/helper.types';

withDefaults(
	defineProps<{
		id: string;
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
		style?: TagStyle;
		secondary?: boolean;
		onGoDetail?: (id: string, title: string, tag: string) => void;
	}>(),
	{
		style: TagStyle.default,
		secondary: false,
		onGoDetail: () => {},
	},
);

const isLargeScreen = useMediaQuery('(min-width: 1024px)');
</script>
<template>
	<article
		class="relative flex flex-wrap lg:flex-nowrap lg:grid gap-2 lg:gap-4 overflow-hidden justify-between h-full"
		:class="{
			'lg:grid-cols-[200px_1fr]': !secondary,
			'lg:grid-cols-[200px_1fr] ': secondary,
		}"
	>
		<div class="w-full rounded-lg overflow-hidden aspect-[16/10]">
			<img
				:src="isLargeScreen ? imgDesktop : imgMobile"
				:alt="alt"
				class="relative block object-cover rounded-lg w-full cursor-pointer"
				@click="onGoDetail(id, title, tag)"
			/>
		</div>

		<div
			class="w-full flex flex-col items-start py-2 lg:pr-2 text-truncate-title"
		>
			<div class="flex gap-1">
				<BaseBtnTag :url="``" :title="tag" :color="style" class="mb-2" />
				<!-- <img
					src="icons\upn-icon-computer.svg"
					class="inline-block rounded-full h-[20px] bg-celestial_white text-neutral py-1 px-2"
				/> -->
				<nuxt-icon
					name="upn-icon-computer"
					class="text-xs inline-block rounded-full h-[20px] bg-celestial_white text-neutral py-1 px-2"
				/>
			</div>

			<h2
				class="mb-2 leading-4 group-hover:underline cursor-pointer font-nunito font-extrabold transition-all duration-300 text-truncate-title"
				:class="{
					'default lg:leading-5 ': !secondary,
					'secondary text-xs leading-[1.2]': secondary,
				}"
				@click="onGoDetail(id, title, tag)"
			>
				{{ title }}
			</h2>

			<div v-if="dateStart" class="flex flex-wrap mt-auto gap-x-2">
				<div
					class="flex-1 justify-start flex gap-1 place-content-center items-center"
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
					class="flex-1 justify-start flex gap-1 place-content-center items-center leading-none"
				>
					<div>
						<nuxt-icon name="upn-icon-time" class="text-base" filled />
					</div>

					<div>
						<time
							:datetime="time"
							class="text-xs text-gray_80 font-nunito font-extrabold uppercase whitespace-nowrap"
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
	-webkit-box-orient: vertical;
}

.default {
	-webkit-line-clamp: 5;
}

.secondary {
	-webkit-line-clamp: 2;
}
</style>
