<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		totalItems: number;
		currentPage?: number;
		itemsPerPage?: number;
	}>(),
	{
		currentPage: 1,
		itemsPerPage: 5,
	},
);

const currentPageRef = toRef(props, 'currentPage');
const emit = defineEmits(['change']);
const handleClick = (number: number) => {
	emit('change', number);
};

const totalPages = computed(() => {
	return Math.ceil(props.totalItems / props.itemsPerPage);
});

const next = () => {
	if (currentPageRef.value < totalPages.value) {
		handleClick(currentPageRef.value + 1);
	}
};
const prev = () => {
	if (currentPageRef.value > 1) {
		handleClick(currentPageRef.value - 1);
	}
};
const goTo = (val: number) => {
	if (val > 0 && val <= totalPages.value) {
		handleClick(val);
	}
};

const showPage = (val: number) => {
	if (totalPages.value <= 5) return true;
	if (val <= 4) return true;
	if (val === currentPageRef.value) return true;
	if (val === currentPageRef.value + 1 && val !== 3) return true;
	if (
		val === currentPageRef.value - 1 &&
		(val === 1 || currentPageRef.value === totalPages.value)
	)
		return true;
};
</script>

<template>
	<nav>
		<ul class="pagination-container">
			<!-- PREV PAGE CONTROLS -->
			<!-- Go to first page -->
			<!-- <li v-if="totalPages > 5" class="btn-container mr-3">
				<button
					class="btn-pag"
					:disabled="currentPageRef === 1"
					aria-label="Ir a la primera página"
					@click.prevent="goTo(1)"
				>
					<nuxt-icon name="IconLeftDouble"></nuxt-icon>
				</button>
			</li> -->
			<!-- Prev Page -->
			<li class="btn-container mr-2">
				<button
					class="btn-pag"
					:disabled="currentPageRef === 1"
					aria-label="Ir a la siguiente página"
					@click.prevent="prev"
				>
					<nuxt-icon name="left" filled></nuxt-icon>
				</button>
			</li>
			<!-- PREV PAGE CONTROLS -->
			<!-- PAGE NUMBERS -->
			<!-- dots -->
			<li v-if="currentPage >= totalPages - 1 && totalPages > 5" class="page">
				<button
					class="w-[40px]"
					aria-label="Ir a la página 1"
					@click.prevent="goTo(1)"
				>
					1
				</button>
			</li>
			<li
				v-if="currentPage >= totalPages - 2 && totalPages > 5"
				class="flex gap-[2px] justify-center"
				aria-hidden="true"
			>
				<template v-for="(_, i) in new Array(3)" :key="`d1${i}`">
					<div class="w-[2px] h-[2px] bg-black"></div>
				</template>
			</li>
			<!-- numbers -->
			<template v-for="(item, i) in new Array(totalPages - 1)" :key="`p${i}`">
				<li
					v-if="showPage(i + 1)"
					class="page relative"
					:class="{
						'active-page': currentPageRef === i + 1,
					}"
				>
					<button
						class="w-[40px]"
						:aria-label="`Ir a la página ${i + 1}`"
						@click.prevent="goTo(i + 1)"
					>
						{{ i + 1 }}
					</button>
				</li>
			</template>
			<!-- dots -->
			<li
				v-if="totalPages > 5 && currentPageRef <= totalPages - 3"
				class="flex gap-[2px] justify-center"
				aria-hidden="true"
			>
				<template v-for="(_, i) in new Array(3)" :key="`d2${i}`">
					<div class="w-[2px] h-[2px] bg-black"></div>
				</template>
			</li>
			<!-- last page number -->
			<li
				class="page"
				:class="{
					'active-page': currentPageRef === totalPages,
				}"
			>
				<button
					class="w-[40px]"
					:aria-label="`Ir a la página ${totalPages}`"
					@click.prevent="goTo(totalPages)"
				>
					{{ totalPages }}
				</button>
			</li>
			<!-- PAGE NUMBERS -->

			<!-- NEXT PAGE CONTROLS -->
			<!-- Next Page -->
			<li class="btn-container ml-2">
				<button
					class="btn-pag"
					:disabled="currentPageRef === totalPages"
					aria-label="Ir a la siguiente página"
					@click.prevent="next"
				>
					<nuxt-icon name="right" filled></nuxt-icon>
				</button>
			</li>
			<!-- Go to last Page -->
			<!-- <li v-if="totalPages > 5" class="btn-container ml-3">
				<button
					class="btn-pag"
					:disabled="currentPageRef === totalPages"
					aria-label="Ir a la última página"
					@click.prevent="goTo(totalPages)"
				>
					<nuxt-icon name="IconRightDouble"></nuxt-icon>
				</button>
			</li> -->
			<!-- NEXT PAGE CONTROLS -->
		</ul>
	</nav>
</template>

<style lang="postcss" scoped>
.pagination-container {
	@apply flex items-center justify-center;
}
.active-page {
	@apply bg-primary text-black font-bold w-[40px] h-[40px];
}
.page {
	@apply flex items-center justify-center;
}

.btn-container {
	@apply flex items-center;
}
</style>
