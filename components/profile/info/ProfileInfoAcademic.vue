<script setup lang="ts">
import type { ProfileData } from '~/types/profile.types';
defineProps<{
	data: ProfileData;
}>();

const msgCopy = ref<{ text: null | string; id: string | null }>({
	text: null,
	id: null,
});

let timeOut: string | number | NodeJS.Timeout | undefined;
const copy = (text: string, name: string, title: string) => {
	clearTimeout(timeOut);
	try {
		navigator.clipboard.writeText(text);
		msgCopy.value.text = `copiado`;
		msgCopy.value.id = name;
	} catch {
		msgCopy.value.text = 'No se pudo copiar';
		msgCopy.value.id = name;
	} finally {
		// if (window.dataLayer) {
		// 	window.dataLayer.push({
		// 		event: 'Click/Copy-MiPerfil',
		// 		title,
		// 	});
		// }
		timeOut = setTimeout(() => {
			msgCopy.value.text = null;
			msgCopy.value.id = null;
		}, 2000);
	}
};
</script>

<template>
	<section class="px-6 mb-10 md:mb-[3.75rem]">
		<BaseSubtitle text="Información Académica" />
		<hr class="bg-primary text-primary h-[1px] border-0 mb-4" />
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
			<ProfileSectionItem :data="data.desProducto" subtitle="Carrera" />
			<ProfileSectionItem
				:data="data.codAlumno"
				subtitle="Código"
				:msgCopy="msgCopy"
				:copy="copy"
			/>
			<ProfileSectionItem :data="data.desCampus" subtitle="Campus" />
			<ProfileSectionItem
				:data="data.cicloIngreso"
				subtitle="Ciclo de Ingreso"
			/>
			<ProfileSectionItem
				:data="data.usuarioEmail"
				subtitle="Correo UPN"
				:msgCopy="msgCopy"
				:copy="copy"
			/>
		</div>
	</section>
</template>
