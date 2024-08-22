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
const hasJob = ref(props.data?.situacionLaboral === 'YES');
const isEmployed = ref(props.data?.tipoDeEmpleo === 'Dependiente');
const showPopoverCompany = ref<boolean>(false);
const pendingStateCompany = ref<boolean>(false);
const pendingStateCompanyRuc = ref<boolean>(false);
const companyDataList = ref();
const showPopupTerminos = ref<boolean>(false);
const currentData = ref(props.data);
const seccionData = ref();

const formValidationSchema = yup.object({
	situacionLaboral: yup.string().required('Campo obligatorio'),
	tipoDeEmpleo: yup
		.string()
		.test('is-required', 'Campo obligatorio', function (value) {
			return Boolean(value) || this.parent.situacionLaboral !== 'YES';
		}),
	modalidadEmpleo: yup
		.string()
		.test('is-required', 'Campo obligatorio', function (value) {
			return Boolean(value) || this.parent.tipoDeEmpleo !== 'Dependiente';
		}),
	empresa: yup.string().optional(),
	ruc: yup
		.string()
		.optional()
		.matches(/^[0-9]+$/, {
			message: 'solo se permiten caracteres numéricos',
			excludeEmptyString: true,
		})
		.test(
			'empty-check',
			'Mínimo 11 caracteres',
			(telefono: any) => telefono?.length === 0 || telefono?.length >= 11,
		)
		.max(11, 'Máximo 11 caracteres'),
	direccionEmpresa: yup.string().optional().max(60, 'Máximo 60 caracteres'),
	cargo: yup.string().optional().max(40, 'Máximo 40 caracteres'),
	enlaceLinkedin: yup.string().url('Debe ser un url válido').optional(),
	infoJefeNombre: yup.string().optional().max(60, 'Máximo 60 caracteres'),
	infoJefeCargo: yup.string().optional().max(60, 'Máximo 60 caracteres'),
	infoJefeCorreo: yup
		.string()
		.optional()
		.max(60, 'Máximo 60 caracteres')
		.matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/, {
			message: 'Ingresa un correo válido',
			excludeEmptyString: true,
		}),
	infoJefeTelefono: yup
		.string()
		.optional()
		.test(
			'empty-check',
			'Mínimo 9 caracteres',
			(telefono: any) => telefono?.length === 0 || telefono?.length >= 9,
		)
		.matches(/^[0-9]+$/, {
			message: 'solo se permiten caracteres numéricos',
			excludeEmptyString: true,
		})
		.max(9, 'Máximo 9 caracteres'),
});

const {
	handleSubmit,
	setValues,
	values: formValues,
	errors,
} = useForm({
	validationSchema: formValidationSchema,
});

const sendPostSave = async () => {
	const values = seccionData.value;
	const isWorking = values.situacionLaboral === 'YES';
	const isNotFreelance = values.tipoDeEmpleo === 'Dependiente';
	const zipCode =
		props.distVal.length === 5 ? `0${props.distVal}` : props.distVal;
	const body: ProfileData = {
		...props.data,
		situacionLaboral: values.situacionLaboral,
		tipoDeEmpleo: isWorking ? values.tipoDeEmpleo : '',
		modalidadEmpleo: isWorking && isNotFreelance ? values.modalidadEmpleo : '',
		empresa: isWorking && isNotFreelance ? values.empresa : '',
		ruc: isWorking && isNotFreelance ? values.ruc : '',
		direccionEmpresa:
			isWorking && isNotFreelance ? values.direccionEmpresa : '',
		cargo: isWorking && isNotFreelance ? values.cargo : '',
		enlaceLinkedin: values.enlaceLinkedin,
		infoJefeNombre: isWorking && isNotFreelance ? values.infoJefeNombre : '',
		infoJefeCargo: isWorking && isNotFreelance ? values.infoJefeCargo : '',
		infoJefeCorreo: isWorking && isNotFreelance ? values.infoJefeCorreo : '',
		infoJefeTelefono:
			isWorking && isNotFreelance ? values.infoJefeTelefono || 0 : 0,
		celular: props.data.celular || 0,
		telefono: props.data.telefono || 0,
		phoneHome: props.data.telefono || 0,
		contactoDeEmergenciaCelular: props.data.contactoDeEmergenciaCelular || 0,
		zipCode: profileStore.profileData.data?.zipCode || zipCode,
	};
	pendingState.value = true;
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/Editar-MiPerfil',
	// 		section: 'Información laboral',
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

const handleChangeSelect = (val: string, id?: string) => {
	if (id === 'situacionLaboral') hasJob.value = val === 'YES';
	if (id === 'tipoDeEmpleo') isEmployed.value = val === 'Dependiente';
};

const handleGetCompanyByRuc = async () => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Search/Editar-MiPerfil',
	// 		section: 'Información laboral',
	// 		title: 'Ruc',
	// 	});
	// }
	pendingStateCompanyRuc.value = true;
	// const { data } = await $api.searchCompany.getCompanyByRuc(formValues.ruc, {
	// 	lazy: true,
	// });
	// const unwatch = watch(
	// 	data,
	// 	(response) => {
	// 		if (response?.flag) {
	// 			const result = response.data[0] || {};
	// 			setValues({
	// 				empresa: result.businessName || '',
	// 				direccionEmpresa: result.address || '',
	// 			});
	// 		}
	// 		pendingStateCompanyRuc.value = false;
	// 	},
	// 	{ immediate: true },
	// );
	// unwatch();
};

const handleGetCompanyByName = async () => {
	const { empresa } = formValues;
	if (empresa && empresa.length >= 4) {
		showPopoverCompany.value = true;
		pendingStateCompany.value = true;
		// if (window.dataLayer) {
		// 	window.dataLayer.push({
		// 		event: 'Search/Editar-MiPerfil',
		// 		section: 'Información laboral',
		// 		title: 'Empresa',
		// 	});
		// }
		// const { data, error } = await $api.searchCompany.getCompanyByName(
		// 	formValues.empresa,
		// 	{ lazy: true },
		// );
		// const unwatch = watch(
		// 	data,
		// 	(response) => {
		// 		companyDataList.value = [];
		// 		if (response?.flag) {
		// 			companyDataList.value = response.data;
		// 		}
		// 		if (response?.error || error.value) {
		// 			showPopoverCompany.value = false;
		// 		}
		// 		pendingStateCompany.value = false;
		// 	},
		// 	{ immediate: true },
		// );
		// unwatch();
	}
};

const handleSelectCompany = (itemCompany: {
	businessName: string;
	ruc: string;
	address: string;
}) => {
	setValues({
		empresa: itemCompany?.businessName,
		ruc: itemCompany?.ruc,
		direccionEmpresa: itemCompany?.address,
	});
	showPopoverCompany.value = false;
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Select/Editar-MiPerfil',
	// 		section: 'Información laboral',
	// 		title: 'Seleccionar empresa',
	// 	});
	// }
};
const target = ref(null);
onClickOutside(target, () => (showPopoverCompany.value = false));
</script>

<template>
	<div
		v-if="pendingState"
		class="py-20 flex flex-col items-center justify-center"
	>
		<BaseStatusLoading />
		Guardando...
	</div>
	<form v-else @submit="onSubmit" @keypress.enter="(e) => e.preventDefault()">
		<div v-if="errorState" class="h-[280px] flex items-center justify-center">
			<BaseStatusError text="Lo sentimos, no pudimos editar tu perfil" />
		</div>
		<fieldset
			v-else
			class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 mb-5"
		>
			<BaseVeeSelect
				id="situacionLaboral"
				:value="data?.situacionLaboral ?? ''"
				label="Situación Laboral"
				@change="handleChangeSelect"
			>
				<option value="" disabled>Elige una opción</option>
				<option value="NO">Sin trabajo</option>
				<option value="YES">Trabajo</option>
			</BaseVeeSelect>
			<BaseVeeSelect
				id="tipoDeEmpleo"
				:class="{ hidden: !hasJob }"
				:value="data?.tipoDeEmpleo ?? ''"
				label="Tipo de empleo"
				@change="handleChangeSelect"
			>
				<option value="" disabled>Elige una opción</option>
				<option value="Dependiente">Dependiente</option>
				<option value="Independiente">Independiente</option>
			</BaseVeeSelect>
			<BaseVeeSelect
				id="modalidadEmpleo"
				:class="{ hidden: !hasJob || !isEmployed }"
				:value="data?.modalidadEmpleo ?? ''"
				label="Modalidad de empleo"
				@change="handleChangeSelect"
			>
				<option value="" disabled>Elige una opción</option>
				<option value="Práctica Pre-Profesional">
					Práctica Pre-Profesional
				</option>
				<option value="Empleo Tiempo Completo">Empleo Tiempo Completo</option>
				<option value="Empleo Tiempo Parcial">Empleo Tiempo Parcial</option>
				<option value="Otra modalidad">Otra modalidad</option>
			</BaseVeeSelect>
			<div class="relative" :class="{ hidden: !hasJob || !isEmployed }">
				<BaseVeeInput
					id="empresa"
					:class="{ hidden: !hasJob || !isEmployed }"
					name="empresa"
					:value="data?.empresa ?? ''"
					:validateOnInput="true"
					costumStyle="pr-[40px]"
					label="Empresa"
					@keypress.enter="handleGetCompanyByName"
				/>
				<nuxt-icon
					name="iconSearch-v2"
					class="hidden absolute right-[10px] top-[calc(50%-5px)] text-[24px] text-primary cursor-pointer"
					@click="handleGetCompanyByName"
				/>
				<ProfileDropdownCompany
					v-if="showPopoverCompany"
					ref="target"
					:loading="pendingStateCompany"
					:data="companyDataList || []"
					@select="handleSelectCompany"
				/>
			</div>
			<div class="relative" :class="{ hidden: !hasJob || !isEmployed }">
				<BaseVeeInput
					id="ruc"
					name="ruc"
					:value="data?.ruc ?? ''"
					:maxLength="11"
					:validateOnInput="true"
					costumStyle="pr-[40px]"
					label="RUC"
				/>
				<nuxt-icon
					v-if="!pendingStateCompanyRuc"
					name="iconSearch-v2"
					class="absolute right-[10px] top-[calc(50%-5px)] text-[24px] text-primary cursor-pointer"
					@click="handleGetCompanyByRuc"
				/>
				<img
					v-else
					class="absolute right-[3px] top-[calc(28%)] w-[42px]"
					src="../../../assets/images/spinner.gif"
				/>
			</div>
			<BaseVeeInput
				id="direccionEmpresa"
				:class="{ hidden: !hasJob || !isEmployed }"
				name="direccionEmpresa"
				:value="data?.direccionEmpresa ?? ''"
				:maxLength="60"
				:validateOnInput="true"
				label="Dirección"
			/>
			<BaseVeeInput
				id="cargo"
				:class="{ hidden: !hasJob || !isEmployed }"
				name="cargo"
				:value="data?.cargo ?? ''"
				:maxLength="40"
				:validateOnInput="true"
				label="Cargo en la empresa"
			/>
			<div class="relative">
				<BaseVeeInput
					id="enlaceLinkedin"
					name="enlaceLinkedin"
					:value="data?.enlaceLinkedin ?? ''"
					:maxLength="80"
					:validateOnInput="true"
					costumStyle="pr-[40px]"
					label="Enlace LinkedIn personal"
				/>
				<nuxt-icon
					name="linkedIn"
					class="absolute right-[10px] top-[30px] text-[24px]"
				/>
			</div>
		</fieldset>
		<h3
			v-if="hasJob && isEmployed && !errorState"
			class="mt-10 md:mt-[2.75rem] font-grotesk font-bold uppercase underline underline-offset-[8px] mb-4 md:mb-6"
		>
			Información de Jefe Directo
		</h3>
		<fieldset
			v-if="!errorState"
			class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 mb-5"
		>
			<BaseVeeInput
				id="infoJefeNombre"
				:class="{ hidden: !hasJob || !isEmployed }"
				name="infoJefeNombre"
				:value="data?.infoJefeNombre ?? ''"
				:maxLength="60"
				:validateOnInput="true"
				label="Nombre completo"
			/>
			<BaseVeeInput
				id="infoJefeCargo"
				:class="{ hidden: !hasJob || !isEmployed }"
				name="infoJefeCargo"
				:value="data?.infoJefeCargo ?? ''"
				:maxLength="60"
				:validateOnInput="true"
				label="Cargo"
			/>
			<BaseVeeInput
				id="infoJefeCorreo"
				:class="{ hidden: !hasJob || !isEmployed }"
				name="infoJefeCorreo"
				:value="data?.infoJefeCorreo ?? ''"
				:validateOnInput="true"
				label="Correo"
			/>
			<BaseVeeInput
				id="infoJefeTelefono"
				:class="{ hidden: !hasJob || !isEmployed }"
				name="infoJefeTelefono"
				:value="
					data.infoJefeTelefono !== '0' && data.infoJefeTelefono
						? `${data?.infoJefeTelefono}`
						: ''
				"
				:maxLength="9"
				:validateOnInput="true"
				label="Teléfono celular"
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
				:disabled="Boolean(Object.keys(errors).length)"
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
