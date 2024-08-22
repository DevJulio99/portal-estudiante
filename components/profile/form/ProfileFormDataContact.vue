<script setup lang="ts">
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import type {
	ProfileData,
	TermsConditionsProfile,
} from '~/types/profile.types';
import { BtnColor } from '~/types/helper.types';
import departamento from '~/utils/data/ubigeo/departamentos.json';
import provincias from '~/utils/data/ubigeo/provincias.json';
import distritos from '~/utils/data/ubigeo/distritos.json';

const { $api } = useNuxtApp();
const profileStore = useProfileStore();

const props = defineProps<{
	data: ProfileData;
	termsConditions: TermsConditionsProfile[];
	handleEdit: (val: boolean) => void;
}>();

const depVal = ref('');
const provVal = ref('');
const distVal = ref('');
const provinciaList = ref<any>([]);
const distritoList = ref<any>([]);
const currentData = ref(props.data);
const pendingState = ref<boolean>(false);
const errorState = ref<boolean>(false);
const otpSmsActive = ref<boolean>(false);
const otpCountDown = ref<string>('1');
const showSeqOtpValidator = ref<boolean>(false);
const showPopupTerminos = ref<boolean>(false);
const verifiedNumberPhone = ref<boolean>(false);
const valuesFormContact = ref();

// const { data: dataStatusOtp } = await $api.statusOtpCelular.getStatusActive({
// 	lazy: true,
// });

// watch(dataStatusOtp, (response) => {
// 	if (response?.flag) {
// 		otpSmsActive.value = response.data[0].activo;
// 	}
// });

// const { data: dataSmsTime } = await $api.otpSmsTime.getTimeoutSMS({
// 	lazy: true,
// });

// watch(dataSmsTime, (response) => {
// 	if (response?.flag) {
// 		otpCountDown.value = response.data[0].minute;
// 	}
// });

depVal.value =
	departamento.find(
		(item) =>
			item.departamento_nombre.toLowerCase() ===
			props.data?.departamento.toLowerCase(),
	)?.id_departamento ?? '';
if (depVal.value) {
	provinciaList.value = provincias[depVal.value as keyof typeof provincias];
	provVal.value =
		provinciaList.value.find(
			(item: any) =>
				item.name.toLowerCase() === props.data?.ciudad.toLowerCase(),
		)?.id ?? '';
}
if (provVal.value) {
	distritoList.value = distritos[provVal.value as keyof typeof distritos];
	distVal.value =
		distritoList.value.find(
			(item: any) =>
				item.name.toLowerCase() === props.data?.distrito.toLowerCase(),
		)?.id ?? '';
}

const formValidationSchema = yup.object({
	correoPersonal: yup
		.string()
		.required('Campo obligatorio')
		.matches(
			/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/,
			'Ingresa un correo válido',
		),
	celular: yup
		.string()
		.required('Campo obligatorio')
		.matches(/^[0-9]+$/, 'Solo se permiten caracteres numéricos')
		.min(9, 'Mínimo 9 caracteres')
		.max(9, 'Máximo 9 caracteres'),
	telefono: yup
		.string()
		.test(
			'empty-check',
			'Mínimo 6 caracteres',
			(telefono: any) => telefono?.length === 0 || telefono?.length >= 6,
		)
		.matches(/^[0-9]+$/, {
			message: 'solo se permiten caracteres numéricos',
			excludeEmptyString: true,
		})
		.max(9, 'Máximo 9 caracteres'),
	departamento: yup.string().required('Campo obligatorio'),
	provincia: yup.string().required('Campo obligatorio'),
	distrito: yup.string().required('Campo obligatorio'),
	direccion: yup
		.string()
		.required('Campo obligatorio')
		.max(60, 'Máximo 60 caracteres'),
	urbanizacion: yup.string(),
});

const {
	handleSubmit,
	setValues,
	values: formValues,
	errors,
	meta,
} = useForm({
	validationSchema: formValidationSchema,
});

const sendPostSave = async () => {
	const values = valuesFormContact.value;
	const zipCode =
		values.distrito.length === 5 ? `0${values.distrito}` : values.distrito;
	const body = {
		...currentData.value,
		correoPersonal: values.correoPersonal,
		celular: values.celular || 0,
		telefono: values.telefono || 0,
		phoneHome: values.telefono || 0,
		direccion: values.direccion,
		urbanizacion: values.urbanizacion,
		zipCode,
		departamento:
			departamento.find((item) => item.id_departamento === values.departamento)
				?.departamento_nombre ?? '',
		provincia:
			provinciaList.value?.find((item: any) => item.id === values.provincia)
				?.name ?? '',
		ciudad:
			provinciaList.value?.find((item: any) => item.id === values.provincia)
				?.name ?? '',
		distrito:
			distritoList.value?.find((item: any) => item.id === values.distrito)
				?.name ?? '',
		infoJefeTelefono: props.data.infoJefeTelefono || 0,
		contactoDeEmergenciaCelular: props.data.contactoDeEmergenciaCelular || 0,
	};
	pendingState.value = true;
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Editar-MiPerfil',
	// 		section: 'Datos de contacto',
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
	// 	verifiedNumberPhone.value = false;
	// }
};

const onSubmit = handleSubmit((values: any) => {
	valuesFormContact.value = values;
	let changedData = false;
	const datCelular = String(formValues.celular).trim() || 0;
	const datTelefono = String(formValues.telefono).trim() || 0;
	if (
		formValues.correoPersonal != currentData.value?.correoPersonal ||
		datCelular != currentData.value?.celular ||
		datTelefono != currentData.value?.telefono
	) {
		changedData = true;
	}

	const _departamento =
		departamento.find(
			(item) => item.id_departamento === formValues.departamento,
		)?.departamento_nombre ?? '';
	const _ciudad =
		provinciaList.value?.find((item: any) => item.id === formValues.provincia)
			?.name ?? '';
	const _distrito =
		distritoList.value?.find((item: any) => item.id === formValues.distrito)
			?.name ?? '';

	if (
		_departamento !== currentData.value?.departamento ||
		_ciudad !== currentData.value?.ciudad ||
		_distrito !== currentData.value?.distrito ||
		String(formValues.urbanizacion).trim() !== currentData.value?.urbanizacion
	) {
		changedData = true;
	}
	if (changedData) {
		if (otpSmsActive.value) {
			showSeqOtpValidator.value = true;
		} else {
			showPopupTerminos.value = true;
		}
	} else if (
		currentData.value.autorizaDatosPersonales == null ||
		currentData.value.autorizaAlumni == null ||
		currentData.value.autorizaAdicionales == null
	) {
		showPopupTerminos.value = true;
	} else {
		sendPostSave();
	}
});

const handleChangeSelect = (val: string, id?: string) => {
	if (id === 'departamento') {
		depVal.value = val;
		provinciaList.value =
			provincias[depVal.value as unknown as keyof typeof provincias];
		distritoList.value = [];
		setValues({ provincia: '', distrito: '' });
		provVal.value = '';
		distVal.value = '';
	}

	if (id === 'provincia') {
		provVal.value = val;
		distritoList.value =
			distritos[provVal.value as unknown as keyof typeof distritos];
		setValues({
			distrito: '',
		});
		distVal.value = '';
	}
};

/* const handleChangePhone = () => {
	const { celular } = formValues;
	const currentPhone = currentData.value?.celular || '';
	if (currentPhone !== celular) {
		showBtnVerifyPhone.value = (celular || '').length === 9;
		verifiedNumberPhone.value = false;
		return;
	}
	verifiedNumberPhone.value = true;
}; */

const handleotpValidated = () => {
	verifiedNumberPhone.value = true;
	setTimeout(() => {
		showSeqOtpValidator.value = false;
		showPopupTerminos.value = true;
	}, 1500);
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Type/validar-celular-success',
	// 		section: 'Perfil/Datos-de-contacto',
	// 		page_url: `${window.location.href}`,
	// 	});
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
	<form v-else @submit="onSubmit">
		<!-- <div v-if="errorState" class="h-[280px] flex items-center justify-center">
			<BaseStatusError text="Lo sentimos, no pudimos editar tu perfil" />
		</div> -->
		<fieldset
			
			class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 mb-5"
		>
			<BaseVeeInput
				id="correoPersonal"
				name="correoPersonal"
				:value="currentData?.correoPersonal || ''"
				:maxLength="100"
				:validateOnInput="true"
				label="Correo personal"
			/>
			<div class="relative">
				<BaseVeeInput
					id="celular"
					name="celular"
					:value="
						currentData?.celular !== '0' && currentData?.celular
							? `${currentData?.celular}`
							: ''
					"
					:maxLength="9"
					:validateOnInput="true"
					label="Teléfono celular"
				/>
				<!--
				<button
					v-if="showBtnVerifyPhone && !verifiedNumberPhone"
					class="absolute right-[7px] top-[22px] text-white bg-black px-4 py-2 rounded-md text-sm"
					type="button"
					@click="initSeqOtpValidator"
				>
					Verificar
				</button>
				<div
					v-if="verifiedNumberPhone"
					class="absolute right-[10px] top-[30px]"
				>
					<NuxtIcon class="text-[#28A745] text-[20px]" name="IconCheckGreen" />
				</div> -->
			</div>
			<BaseVeeInput
				id="telefono"
				name="telefono"
				:value="
					currentData?.telefono !== '0' && currentData?.telefono
						? `${currentData?.telefono}`
						: ''
				"
				:maxLength="9"
				:validateOnInput="true"
				label="Teléfono fijo (Opcional)"
			/>
			<BaseVeeSelect
				id="departamento"
				:value="depVal"
				label="Departamento"
				@change="handleChangeSelect"
			>
				<option value="" disabled>Elige una opción</option>
				<option
					v-for="it in departamento"
					:key="it?.id_departamento"
					class="capitalize"
					:value="it?.id_departamento"
				>
					{{ it?.departamento_nombre.toLowerCase() }}
				</option>
			</BaseVeeSelect>
			<BaseVeeSelect
				id="provincia"
				:value="provVal"
				label="Provincia"
				:disabled="!Boolean(depVal)"
				@change="handleChangeSelect"
			>
				<option value="">Elige una opción</option>
				<option
					v-for="it in provinciaList"
					:key="it?.id"
					class="capitalize"
					:value="it?.id"
				>
					{{ it?.name.toLowerCase() }}
				</option>
			</BaseVeeSelect>
			<BaseVeeSelect
				id="distrito"
				:value="distVal"
				:disabled="!Boolean(depVal) || !Boolean(provVal)"
				label="Distrito"
				@change="handleChangeSelect"
			>
				<option value="">Elige una opción</option>
				<option
					v-for="it in distritoList"
					:key="it?.id"
					class="capitalize"
					:value="it?.id"
				>
					{{ it?.name.toLowerCase() }}
				</option>
			</BaseVeeSelect>
			<BaseVeeInput
				id="direccion"
				name="direccion"
				:value="currentData?.direccion || ''"
				:maxLength="60"
				:validateOnInput="true"
				label="Dirección"
			/>
			<BaseVeeInput
				id="urbanizacion"
				name="urbanizacion"
				:value="currentData?.urbanizacion || ''"
				:maxLength="80"
				:validateOnInput="true"
				label="Urbanización (Opcional)"
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
	<ProfileSeqOtpValidatorPhone
		v-if="showSeqOtpValidator"
		:strNumber="formValues.celular"
		:countdown="otpCountDown"
		:codStudent="profileStore.profileData.data?.codAlumno || ''"
		:closePopup="
			() => {
				showSeqOtpValidator = false;
			}
		"
		@otp-validated="handleotpValidated"
	/>
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
