<script setup lang="ts">
import type {
	ProfileData,
	TermsConditionsProfile,
} from '~/types/profile.types';
import { BtnColor } from '~/types/helper.types';

defineProps<{
	data: ProfileData;
	termsConditions: TermsConditionsProfile[];
}>();

const editField = ref(false);
const handleEdit = (val: boolean) => {
	// if (window.dataLayer && !editField.value) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Editar-MiPerfil',
	// 		section: 'Datos de contacto',
	// 		title: 'Editar',
	// 	});
	// }
	editField.value = val;
};
</script>

<template>
	<section class="px-6 mb-10 md:mb-[3.75rem]">
		<div class="flex items-center justify-between">
			<BaseSubtitle text="Datos de contacto" />
			<BaseButton
				:disabled="editField"
				styles="!w-[76px] md:!w-[106px]"
				:iconName="!editField ? 'editIcon' : ''"
				:color="!editField ? BtnColor.default : BtnColor.black"
				@click="handleEdit(true)"
			>
				<span>{{ editField ? 'Editando...' : 'Editar' }}</span>
			</BaseButton>
		</div>
		<hr class="bg-primary text-primary h-[1px] border-0 mb-4" />
		<div
			v-if="!editField"
			class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6"
		>
			<ProfileSectionItem
				:data="data.correoPersonal"
				subtitle="Correo personal"
			/>
			<ProfileSectionItem
				:data="Number(data.celular) !== 0 ? `${data.celular}` : ''"
				subtitle="Teléfono celular"
			/>
			<ProfileSectionItem
				:data="Number(data.telefono) !== 0 ? `${data.telefono}` : ''"
				subtitle="Teléfono fijo (Opcional)"
			/>
			<ProfileSectionItem :data="data.departamento" subtitle="Departamento" />
			<ProfileSectionItem :data="data.ciudad" subtitle="Provincia" />
			<ProfileSectionItem :data="data.distrito" subtitle="Distrito" />
			<ProfileSectionItem :data="data.direccion" subtitle="Dirección" />
			<ProfileSectionItem
				:data="data.urbanizacion"
				subtitle="Urbanización (Opcional)"
			/>
		</div>
		<ProfileFormDataContact
			v-else
			:data="data"
			:termsConditions="termsConditions"
			:handleEdit="handleEdit"
		/>
	</section>
</template>
