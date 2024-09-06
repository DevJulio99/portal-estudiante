<script setup lang="ts">
import type {
	ProfileData,
	TermsConditionsProfile,
} from '~/types/profile.types';
import { BtnColor } from '~/types/helper.types';

defineProps<{
	data: ProfileData;
	termsConditions: TermsConditionsProfile[];
	distVal: string;
}>();

const editField = ref(false);
const handleEdit = (val: boolean) => {
	// if (window.dataLayer && !editField.value) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Editar-MiPerfil',
	// 		section: 'Datos de emergencia',
	// 		title: 'Editar',
	// 	});
	// }
	editField.value = val;
};
</script>

<template>
	<section class="px-6 mb-10 md:mb-[3.75rem]">
		<div class="flex items-center justify-between">
			<BaseSubtitle text="Contacto de emergencia" />
			<!-- <BaseButton
				:disabled="editField"
				styles="!w-[76px] md:!w-[106px]"
				:iconName="!editField ? 'editIcon' : ''"
				:color="!editField ? BtnColor.default : BtnColor.black"
				@click="handleEdit(true)"
			>
				<span>{{ editField ? 'Editando...' : 'Editar' }}</span>
			</BaseButton> -->
		</div>
		<hr class="bg-primary text-primary h-[1px] border-0 mb-4" />
		<div
			v-if="!editField"
			class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6"
		>
			<ProfileSectionItem
				:data="data.contactoDeEmergenciaNombre"
				subtitle="Nombres"
			/>
			<ProfileSectionItem
				:data="data.contactoDeEmergenciaApellido"
				subtitle="Apellidos"
			/>
			<ProfileSectionItem
				:data="
					Number(data.contactoDeEmergenciaCelular) !== 0
						? `${data.contactoDeEmergenciaCelular}`
						: ''
				"
				subtitle="Teléfono"
			/>
		</div>
		<ProfileFormEmergencyContact
			v-else
			:data="data"
			:distVal="distVal"
			:handleEdit="handleEdit"
			:termsConditions="termsConditions"
		/>
	</section>
</template>
