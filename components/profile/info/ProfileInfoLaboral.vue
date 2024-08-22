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
	// 		section: 'Información laboral',
	// 		title: 'Editar',
	// 	});
	// }
	editField.value = val;
};

const getValue = (str: string) => {
	switch (str) {
		case 'YES':
			return 'Trabajo';
		default:
			return 'Sin trabajo';
	}
};
</script>

<template>
	<section class="px-6 mb-10 md:mb-[3.5rem]">
		<div class="flex items-center justify-between">
			<BaseSubtitle text="Información laboral" />
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
		<div v-if="!editField">
			<div
				class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6"
			>
				<ProfileSectionItem
					:data="getValue(data.situacionLaboral)"
					subtitle="Situación laboral"
				/>
				<ProfileSectionItem
					:data="data.tipoDeEmpleo"
					subtitle="Tipo de trabajo"
				/>
				<ProfileSectionItem
					:data="data.modalidadEmpleo"
					subtitle="Modalidad de empleo"
				/>
				<ProfileSectionItem :data="data.empresa" subtitle="Empresa" />
				<ProfileSectionItem :data="data.ruc" subtitle="RUC" />
				<ProfileSectionItem
					:data="data.direccionEmpresa"
					subtitle="Dirección"
				/>
				<ProfileSectionItem :data="data.cargo" subtitle="Cargo en la empresa" />
				<ProfileSectionItem
					:data="data.enlaceLinkedin"
					subtitle="Enlace LinkedIn personal"
				/>
			</div>
			<h3
				class="mt-10 md:mt-[2.75rem] font-grotesk font-bold uppercase underline underline-offset-[8px] mb-4 md:mb-6"
			>
				Información de Jefe Directo
			</h3>
			<div
				class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6"
			>
				<ProfileSectionItem
					:data="data.infoJefeNombre"
					subtitle="Nombre completo"
				/>
				<ProfileSectionItem :data="data.infoJefeCargo" subtitle="Cargo" />
				<ProfileSectionItem :data="data.infoJefeCorreo" subtitle="Correo" />
				<ProfileSectionItem
					:data="
						Number(data.infoJefeTelefono) !== 0
							? `${data.infoJefeTelefono}`
							: ''
					"
					subtitle="Teléfono celular"
				/>
			</div>
		</div>
		<ProfileFormLaboral
			v-else
			:data="data"
			:distVal="distVal"
			:handleEdit="handleEdit"
			:termsConditions="termsConditions"
		/>
	</section>
</template>
