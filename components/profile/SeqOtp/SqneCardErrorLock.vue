<script setup lang="ts">
defineProps<{
	imagen: string;
	titulo: string;
	descripcion: string;
	closePopup: () => void;
}>();
</script>
<template>
	<div class="text-center py-3 px-4">
		<!-- manRounded -->
		<div class="flex justify-center mb-2">
			<nuxt-icon :name="imagen" class="text-[70px]" filled />
		</div>
		<p class="mb-3">{{ titulo }}</p>
		<p class="text-[#1938A6] text-[14px] mb-3">
			{{ descripcion }}
		</p>
		<div class="flex justify-center mt-3">
			<button
				class="rounded-md gap-1 text-sm font-extrabold bg-primary py-2 px-4"
				@click="closePopup"
			>
				Entendido
			</button>
		</div>
	</div>
</template>
