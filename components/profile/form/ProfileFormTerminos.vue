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
	handleEdit: (val: boolean) => void;
}>();

const { $api } = useNuxtApp();
const profileStore = useProfileStore();
const pendingState = ref<boolean>(false);
const errorState = ref<boolean>(false);

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

const onSubmit = async () => {
	const zipCode =
		props.distVal.length === 5 ? `0${props.distVal}` : props.distVal;

	const body = {
		...props.data,
		autorizaDatosPersonales: autorizaDatosPersonales.value.value || false,
		autorizaAlumni: autorizaAlumni.value.value || false,
		autorizaAdicionales: autorizaAdicionales.value.value || false,
		infoJefeTelefono: props.data.infoJefeTelefono || 0,
		celular: props.data.celular || 0,
		telefono: props.data.telefono || 0,
		phoneHome: props.data.telefono || 0,
		zipCode: profileStore.profileData.data?.zipCode || zipCode,
	};
	pendingState.value = true;
	// try {
	// 	const { data, error } = await $api.updateProfile.updateProfile(body);
	// 	if (data.value?.flag) {
	// 		profileStore.setProfileData({
	// 			...profileStore.profileData,
	// 			data: body ?? null,
	// 		});
	// 		props.handleEdit(false);
	// 	} else errorState.value = true;
	// 	if (error.value) errorState.value = true;
	// } catch (err) {
	// 	errorState.value = true;
	// } finally {
	// 	pendingState.value = false;
	// }
};
</script>
<template>
	<div
		v-if="pendingState"
		class="py-20 flex flex-col items-center justify-center"
	>
		<BaseStatusLoading />
		Guardando...
	</div>
	<div v-else>
		<!--<div v-if="errorState" class="h-[280px] flex items-center justify-center">
			<BaseStatusError text="Lo sentimos, no pudimos editar tu perfil" />
		</div>-->
		<div class="w-full mt-4">
			<div class="bg-[#F6F6F6] py-3 px-4 rounded-md my-2">
				<p class="mb-2 text-sm" v-html="autorizaDatosPersonales.message"></p>
				<div class="flex flex-row items-center gap-5 pt-1 mb-1">
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaDatosPersonales.value == true }"
							@click="
								() => {
									autorizaDatosPersonales.value =
										autorizaDatosPersonales.value == null ||
										autorizaDatosPersonales.value == false
											? true
											: null;
								}
							"
						></div>
						<span class="text-sm">Autorizo</span>
					</div>
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaDatosPersonales.value == false }"
							@click="
								() => {
									autorizaDatosPersonales.value =
										autorizaDatosPersonales.value == null ||
										autorizaDatosPersonales.value == true
											? false
											: null;
								}
							"
						></div>
						<span class="text-sm">No Autorizo</span>
					</div>
				</div>
			</div>
			<div class="bg-[#F6F6F6] py-3 px-4 rounded-md my-2">
				<p class="mb-2 text-sm" v-html="autorizaAlumni.message"></p>
				<div class="flex flex-row items-center gap-5 pt-1 mb-1">
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaAlumni.value == true }"
							@click="
								() => {
									autorizaAlumni.value =
										autorizaAlumni.value == null ||
										autorizaAlumni.value == false
											? true
											: null;
								}
							"
						></div>
						<span class="text-sm">Autorizo</span>
					</div>
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaAlumni.value == false }"
							@click="
								() => {
									autorizaAlumni.value =
										autorizaAlumni.value == null || autorizaAlumni.value == true
											? false
											: null;
								}
							"
						></div>
						<span class="text-sm">No Autorizo</span>
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
							@click="
								() => {
									autorizaAdicionales.value =
										autorizaAdicionales.value == null ||
										autorizaAdicionales.value == false
											? true
											: null;
								}
							"
						></div>
						<span class="text-sm">Autorizo</span>
					</div>
					<div class="flex items-center gap-2">
						<div
							class="custom-radio"
							:class="{ selected: autorizaAdicionales.value == false }"
							@click="
								() => {
									autorizaAdicionales.value =
										autorizaAdicionales.value == null ||
										autorizaAdicionales.value == true
											? false
											: null;
								}
							"
						></div>
						<span class="text-sm">No Autorizo</span>
					</div>
				</div>
			</div>
		</div>
		<div class="md:flex md:gap-x-6 py-6">
			<BaseButton
				iconName="save"
				styles="py-4 mb-2"
				type="button"
				:disabled="
					autorizaDatosPersonales.value == null ||
					autorizaAlumni.value == null ||
					autorizaAdicionales.value == null
				"
				@click="onSubmit"
			>
				<span>Guardar</span>
			</BaseButton>
			<BaseButton
				:color="BtnColor.black"
				styles="py-4"
				:disabled="false"
				@click="handleEdit(false)"
			>
				<span>Cancelar</span>
			</BaseButton>
		</div>
	</div>
</template>
<style lang="postcss" scoped>
.custom-radio {
	width: 20px;
	height: 20px;
	background-color: #fff;
	border: 2px solid #ccc;
	border-radius: 50%;
	cursor: pointer;
	position: relative;
}

.custom-radio.selected {
	border-color: #fdba30;
}

.custom-radio.selected::before {
	content: '';
	width: 10px;
	height: 10px;
	background-color: #fdba30;
	border-radius: 50%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
