<script lang="ts" setup>
import type {
	ProfileData,
	TermsConditionsProfile,
} from '~/types/profile.types';
import { BtnColor } from '~/types/helper.types';
const props = defineProps<{
	data: ProfileData;
	termsConditions: TermsConditionsProfile[];
	handleClose: () => void;
}>();

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

const emit = defineEmits(['handleSave']);

const autorizaDatosPersonales = ref({
	message: getDescripcion('autorizaDatosPersonales'),
	value: props.data?.autorizaDatosPersonales,
});
const autorizaAlumni = ref({
	message: getDescripcion('autorizaAlumni'),
	value: props.data?.autorizaAlumni,
});
const autorizaAdicionales = ref({
	message: getDescripcion('autorizaAdicionales'),
	value: props.data?.autorizaAdicionales,
});
</script>
<template>
	<div class="modal-container fixed w-full h-full z-[55] top-0 left-0">
		<div class="absolute top-0 bg-black opacity-30 w-full h-full"></div>
		<div
			class="modal-container-static w-full h-full flex justify-center items-center p-3 lg:p-0"
		>
			<div
				class="content-popup-md z-10 rounded-lg overflow-hidden p-4 lg:p-6 shadow-md max-w-[750px]"
			>
				<button
					class="absolute top-[16px] right-[16px] z-10 h-[20px] cursor-pointer"
					@click="handleClose"
				>
					<NuxtIcon
						class="close-schedule-popup text-[17px]"
						name="navClose"
						aria-label="Cerrar"
					/>
				</button>
				<BaseSubtitle text="Tratamiento de datos personales" class="mb-6" />
				<p class="text-sm">
					<b>Puedes cambiar tu elección</b> más adelante en la sección
					"Tratamiento de datos personales" de tu perfil.
				</p>
				<div class="w-full mt-4">
					<div class="bg-[#F6F6F6] py-3 px-4 rounded-md my-2">
						<p
							class="mb-2 text-sm"
							v-html="autorizaDatosPersonales.message"
						></p>
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
												autorizaAlumni.value == null ||
												autorizaAlumni.value == true
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
				<div class="flex justify-between mt-6 gap-5">
					<BaseButton
						:color="BtnColor.black"
						styles="py-4"
						:disabled="false"
						@click="handleClose"
					>
						<span>Cancelar</span>
					</BaseButton>
					<BaseButton
						iconName="save"
						styles="py-4 mb-2"
						type="button"
						:disabled="
							autorizaDatosPersonales.value == null ||
							autorizaAlumni.value == null ||
							autorizaAdicionales.value == null
						"
						@click="
							() => {
								emit(
									'handleSave',
									autorizaDatosPersonales.value,
									autorizaAlumni.value,
									autorizaAdicionales.value,
								);
							}
						"
					>
						<span>Guardar</span>
					</BaseButton>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="postcss" scoped>
.content-popup-md {
	@apply w-full relative bg-white;
}

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
