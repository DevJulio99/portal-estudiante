<script setup lang="ts">
import * as yup from 'yup';
import { useForm } from 'vee-validate';
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
const showPopupTerminos = ref<boolean>(false);
const currentData = ref(props.data);
const seccionData = ref();

const formValidationSchema = yup.object().shape({
	contactoDeEmergenciaApellido: yup
		.string()
		.test('is-required', 'Campo obligatorio', function (value) {
			return (
				Boolean(value) ||
				(!this.parent.contactoDeEmergenciaNombre &&
					!this.parent.contactoDeEmergenciaCelular)
			);
		})
		.max(60, 'Máximo 60 caracteres'),
	contactoDeEmergenciaNombre: yup
		.string()
		.test('is-required', 'Campo obligatorio', function (value) {
			return (
				Boolean(value) ||
				(!this.parent.contactoDeEmergenciaApellido &&
					!this.parent.contactoDeEmergenciaCelular)
			);
		})
		.max(60, 'Máximo 60 caracteres'),
	contactoDeEmergenciaCelular: yup
		.string()
		.test('is-required', 'Campo obligatorio', function (value) {
			return (
				Boolean(value) ||
				(!this.parent.contactoDeEmergenciaNombre &&
					!this.parent.contactoDeEmergenciaApellido)
			);
		})
		.matches(/^\+?\d+$/, {
			message: (str: any) =>
				str.value.includes('+')
					? 'Ingresa un número válido'
					: 'Solo se permiten caracteres numéricos',
			excludeEmptyString: true,
		})
		.test(
			'empty-check',
			'Mínimo 9 caracteres',
			(telefono: any) => telefono?.length === 0 || telefono?.length >= 9,
		)
		.max(9, 'Máximo 9 caracteres'),
});

const { handleSubmit, errors, meta } = useForm({
	validationSchema: formValidationSchema,
});

const sendPostSave = async () => {
	const values = seccionData.value;
	const zipCode =
		props.distVal.length === 5 ? `0${props.distVal}` : props.distVal;
	const body = {
		...currentData.value,
		contactoDeEmergenciaApellido: values.contactoDeEmergenciaApellido,
		contactoDeEmergenciaNombre: values.contactoDeEmergenciaNombre,
		contactoDeEmergenciaCelular: values.contactoDeEmergenciaCelular || 0,
		infoJefeTelefono: currentData.value.infoJefeTelefono || 0,
		celular: currentData.value.celular || 0,
		telefono: currentData.value.telefono || 0,
		phoneHome: currentData.value.telefono || 0,
		zipCode: profileStore.profileData.data?.zipCode || zipCode,
	};

	pendingState.value = true;
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Editar-MiPerfil',
	// 		section: 'Datos de emergencia',
	// 		title: 'Guardar',
	// 	});
	// }
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

const onSubmit = handleSubmit((values: any) => {
	seccionData.value = values;
	if (
		currentData.value.autorizaDatosPersonales == null ||
		currentData.value.autorizaAlumni == null ||
		currentData.value.autorizaAdicionales == null
	) {
		showPopupTerminos.value = true;
	} else {
		sendPostSave();
	}
});
</script>

<template>
	<div
		v-if="pendingState"
		class="py-20 flex flex-col items-center justify-center"
	>
		<BaseStatusLoading />
		Guardando...
	</div>
	<form v-else @submit="onSubmit">
		<!-- <div v-if="errorState" class="h-[280px] flex items-center justify-center">
			<BaseStatusError text="Lo sentimos, no pudimos editar tu perfil" />
		</div> -->
		<fieldset
			class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 mb-5"
		>
			<BaseVeeInput
				id="contactoDeEmergenciaNombre"
				name="contactoDeEmergenciaNombre"
				:value="data?.contactoDeEmergenciaNombre ?? ''"
				:maxLength="60"
				:validateOnInput="true"
				label="Nombres"
			/>
			<BaseVeeInput
				id="contactoDeEmergenciaApellido"
				name="contactoDeEmergenciaApellido"
				:value="data?.contactoDeEmergenciaApellido ?? ''"
				:maxLength="60"
				:validateOnInput="true"
				label="Apellidos"
			/>
			<BaseVeeInput
				id="contactoDeEmergenciaCelular"
				name="contactoDeEmergenciaCelular"
				:value="
					data?.contactoDeEmergenciaCelular !== '0' &&
					data?.contactoDeEmergenciaCelular
						? `${data?.contactoDeEmergenciaCelular}`
						: ''
				"
				:maxLength="9"
				:validateOnInput="true"
				label="Teléfono"
			/>
		</fieldset>
		<!-- <div class="flex items-center">
			<input
				id="terms"
				type="checkbox"
				class="mr-2 w-[20px] h-[20px] bg-primary"
			/>
			<label for="terms">Acepto las condiciones de Protección de datos.</label>
		</div> -->
		<div class="md:flex md:gap-x-6 py-6">
			<BaseButton
				iconName="save"
				styles="py-4 mb-2"
				type="submit"
				:disabled="Boolean(Object.keys(errors).length) || !meta.touched"
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
	</form>
	<ProfileFormTerminosPopup
		v-if="showPopupTerminos"
		:data="currentData"
		:termsConditions="termsConditions"
		:handleClose="
			() => {
				showPopupTerminos = false;
			}
		"
		@handle-save="
			(autoriza_datos_personales, autoriza_alumni, autoriza_adicional) => {
				currentData.autorizaDatosPersonales = autoriza_datos_personales;
				currentData.autorizaAlumni = autoriza_alumni;
				currentData.autorizaAdicionales = autoriza_adicional;
				showPopupTerminos = false;
				sendPostSave();
			}
		"
	/>
</template>
