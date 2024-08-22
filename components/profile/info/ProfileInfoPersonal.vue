<script setup lang="ts">
import type { ProfileData } from '~/types/profile.types';

defineProps<{
	data: ProfileData;
}>();
</script>

<template>
	<section class="px-6 mb-10 md:mb-[3.75rem]">
		<BaseSubtitle text="Información Personal" />
		<hr class="bg-primary text-primary h-[1px] border-0 mb-4" />
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
			<ProfileSectionItem
				:data="data.fullName"
				subtitle="Nombre completo"
				capitalize
			/>
			<ProfileSectionItem
				:data="
					useDateFormat(data.fechaNacimiento, 'DD/MM/YYYY', {
						locales: 'es-ES',
					}).value
				"
				subtitle="Fecha de nacimiento"
			/>
			<ProfileSectionItem
				:data="data.documenIdentida"
				subtitle="Documento de identidad (DNI/CE)"
			/>
		</div>
	</section>
</template>
