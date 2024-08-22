<script setup lang="ts">
import type {
	ProfileData,
	TermsConditionsProfile,
} from '~/types/profile.types';
import { BtnColor } from '~/types/helper.types';

const props = defineProps<{
	data: ProfileData;
	distVal: string;
	termsConditions: TermsConditionsProfile[];
}>();

const profileStore = useProfileStore();
const editField = ref(false);

const getDescripcion = (filter: string) => {
	const descripcionTexto = props.termsConditions.reduce(function (
		texto,
		autorizacion,
	) {
		if (autorizacion.tipo === filter) {
			texto = autorizacion.descripcion;
		}
		return texto;
	}, '');
	return descripcionTexto;
};

const autorizaDatosPersonales = ref({
	message: getDescripcion('autorizaDatosPersonales'),
	value: profileStore.profileData.data?.autorizaDatosPersonales,
});
const autorizaAlumni = ref({
	message: getDescripcion('autorizaAlumni'),
	value: profileStore.profileData.data?.autorizaAlumni,
});
const autorizaAdicionales = ref({
	message: getDescripcion('autorizaAdicionales'),
	value: profileStore.profileData.data?.autorizaAdicionales,
});

const handleEdit = (val: boolean) => {
	// if (window.dataLayer && !editField.value) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Editar-MiPerfil',
	// 		section: 'Información de términos y condiciones',
	// 		title: 'Editar',
	// 	});
	// }
	autorizaDatosPersonales.value.value =
		profileStore.profileData.data?.autorizaDatosPersonales;
	autorizaAlumni.value.value = profileStore.profileData.data?.autorizaAlumni;
	autorizaAdicionales.value.value =
		profileStore.profileData.data?.autorizaAdicionales;
	editField.value = val;
};
</script>
<template>
	<section class="px-6 mb-10 md:pb-10">
		<div class="flex items-center justify-between">
			<BaseSubtitle text="Tratamiento de datos personales" />
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
		<div v-if="!editField" class="w-full mt-4">
			<div class="bg-[#F6F6F6] py-3 px-4 rounded-md my-2">
				<p class="mb-2 text-sm" v-html="autorizaDatosPersonales.message"></p>
				<div class="flex flex-row items-center gap-5 pt-1 mb-1">
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaDatosPersonales.value == true }"
						></div>
						<span class="text-sm text-[#5E757C]">Autorizo</span>
					</div>
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaDatosPersonales.value == false }"
						></div>
						<span class="text-sm text-[#5E757C]">No Autorizo</span>
					</div>
				</div>
			</div>
			<div class="bg-[#F6F6F6] py-3 px-4 rounded-md my-2">
				<p class="mb-2 text-sm" v-html="autorizaAlumni.message"></p>
				<div class="flex flex-row items-center gap-5 pt-1 mb-1">
					<div class="flex items-center gap-2">
						<div
							class="custom-radio disabled"
							:class="{ selected: autorizaAlumni.value == true }"
						></div>
						<span class="text-sm text-[#5E757C]">Autorizo</span>
					</div>
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaAlumni.value == false }"
						></div>
						<span class="text-sm text-[#5E757C]">No Autorizo</span>
					</div>
				</div>
			</div>
			<div class="bg-[#F6F6F6] py-3 px-4 rounded-md my-2">
				<p class="mb-2 text-sm" v-html="autorizaAdicionales.message"></p>
				<div class="flex flex-row items-center gap-5 pt-1 mb-1">
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaAdicionales.value == true }"
						></div>
						<span class="text-sm text-[#5E757C]">Autorizo</span>
					</div>
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaAdicionales.value == false }"
						></div>
						<span class="text-sm text-[#5E757C]">No Autorizo</span>
					</div>
				</div>
			</div>
		</div>
		<ProfileFormTerminos
			v-else
			:data="data"
			:distVal="distVal"
			:handleEdit="handleEdit"
			:termsConditions="termsConditions"
		/>
	</section>
</template>
<style lang="postcss" scoped>
.custom-radio {
	width: 20px;
	height: 20px;
	background-color: #fff;
	border: 2px solid #ccc;
	border-radius: 50%;
	cursor: default;
	position: relative;
}

.custom-radio.disabled {
	width: 20px;
	height: 20px;
	background-color: #fff;
	border: 2px solid #c2d1d9;
	border-radius: 50%;
	cursor: default;
	position: relative;
}

.custom-radio.selected {
	border-color: #c2d1d9;
}

.custom-radio.selected::before {
	content: '';
	width: 10px;
	height: 10px;
	background-color: #c2d1d9;
	border-radius: 50%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
