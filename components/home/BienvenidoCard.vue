<script setup lang="ts">
import type { BienvenidoData } from '~/types/bienvenido.types';
import profileStoreMock from "~/utils/data/profileStoreMock.json";

const props = defineProps<{
	fullname: string;
	error: object | null;
	message: BienvenidoData[];
}>();
const gender = ref<string | null>(null);
const noDataB = !props.message?.length;
const profileStore = profileStoreMock;
gender.value = profileStore.profileData.data?.sexo ?? null;

const formatContent = (html: string) => {
	html = html.replace(/<p>(.*?)<\/p>/g, '$1\n');
	html = html.replace(/\s+$/, '');

	return html;
};
</script>
<template>
	<div v-if="!(error || noDataB)" class="flex items-center gap-3 mb-6">
		<img
			v-if="message[0]?.mostrar_imagen_bienvenida"
			:src="message[0]?.imagen_bienvenida"
			class="max-w-[80px] min-w-[60px]"
		/>
		<div>
			<div class="text-sm lg:text-[16px] mb-1">
				{{ gender ? (gender == 'M' ? 'Bienvenido' : 'Bienvenida') : 'Hola' }},
				&nbsp;<nuxt-link
					to="/perfil"
					class="text-[#0b78ae] text-sm lg:text-[16px] font-bold capitalize hover:text-[#065074] underline underline-1"
				>
					{{ fullname }}
				</nuxt-link>
			</div>
			<h1
				class="text-sm lg:text-[16px]"
				v-html="formatContent(message[0]?.contenido_bienvenida)"
			></h1>
		</div>
	</div>
</template>

<style scoped>
.underline-1 {
	text-decoration-thickness: 1px;
}
</style>
