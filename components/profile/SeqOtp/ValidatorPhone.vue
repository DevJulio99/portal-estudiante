<script setup lang="ts">
const { $api } = useNuxtApp();

const props = defineProps<{
	strNumber: string;
	countdown: string;
	codStudent: string;
	closePopup: () => void;
}>();

const otpInputRef = ref<any>(null);
const showOTPValidator = ref<boolean>(false);
const otpValidateResSuccess = ref<boolean>(false);
const otpValidateResError = ref<boolean>(false);
const otpNumberAttempts = ref<number>(0);
const isDisabledOtpInput = ref<boolean>(false);

const showCardLock = ref({
	show: false,
	imagen: 'manRounded',
	titulo: 'Excediste el limite de intentos del SMS.',
	descripcion: '',
});

const emit = defineEmits(['otpValidated']);

const formatTime = (timeLock: string) => {
	const partesTiempo = timeLock.split(':');
	const horas = parseInt(partesTiempo[0]);
	const minutos = parseInt(partesTiempo[1]);
	/* const segundos = parseInt(partesTiempo[2]); */
	return `${horas} horas y ${minutos} minutos`;
};

const refreshOptions = () => {
	showCardLock.value.show = false;
	showOTPValidator.value = false;
	otpValidateResSuccess.value = false;
	otpValidateResError.value = false;
};

const handleResendOTP = async () => {
	refreshOptions();
};

const handleTimeOver = () => {
	otpInputRef.value.clearInputs();
	isDisabledOtpInput.value = true;
};

const handleCheckOtpSent = async (strOtp: string) => {
	otpValidateResError.value = false;
	otpValidateResSuccess.value = false;
};

const hideNumber = (str: string) => {
	const hiddenPart = '*'.repeat(str.length - 2);
	let strConcat = '';
	for (let i = 0; i < hiddenPart.length; i++) {
		strConcat += hiddenPart[i];
		if ((i + 1) % 3 === 0) strConcat += ' ';
	}
	return strConcat + str.slice(-2);
};
</script>
<template>
	<div class="modal-container fixed w-full h-full z-[55] top-0 left-0">
		<div class="absolute top-0 bg-black opacity-60 w-full h-full"></div>
		<div
			class="modal-container-static w-full h-full flex justify-center items-center p-3 lg:p-0"
		>
			<div class="content-validator-md">
				<div
					class="absolute top-[10px] right-[9px] z-10 h-[20px] cursor-pointer"
				>
					<NuxtIcon
						class="close-schedule-popup text-[15px]"
						name="navClose"
						@click="closePopup"
					/>
				</div>
				<div
					v-if="!showCardLock.show && !showOTPValidator"
					class="flex justify-center items-center h-[175px]"
				>
					<BaseStatusLoading />
				</div>
				<ProfileSeqOtpSqneCardErrorLock
					v-if="showCardLock.show"
					:imagen="showCardLock.imagen"
					:titulo="showCardLock.titulo"
					:descripcion="showCardLock.descripcion"
					:closePopup="
						() => {
							if (otpNumberAttempts == 2) {
								handleResendOTP();
							} else {
								closePopup();
							}
						}
					"
				/>
				<div v-if="showOTPValidator" class="py-4 text-center">
					<h1
						class="text-center mt-4 lg:text-3xl text-[1.5em] mb-3 font-bold font-grotesk"
					>
						Por favor revisa tu celular
					</h1>
					<p>
						Hemos enviado un código de acceso que tiene 6 digitos al número
						{{ hideNumber(strNumber) }}
					</p>
					<div class="flex flex-wrap flex-col justify-center mt-4 items-center">
						<div class="flex relative mb-3 items-center">
							<ProfileSeqOtpSqneOtp
								ref="otpInputRef"
								:numberOfDigits="6"
								:disabled="isDisabledOtpInput"
								:hasSuccess="otpValidateResSuccess"
								:hasError="otpValidateResError"
								@update:otp="handleCheckOtpSent($event)"
							/>
						</div>
					</div>
					<div v-if="otpValidateResError" class="mb-2">
						<p class="text-[#DC3545] text-[14px] my-2">
							Código erróneo. Inténtalo de nuevo
						</p>
					</div>
					<div v-else-if="otpValidateResSuccess">
						<p class="text-[#28A745] text-[14px] my-2">¡Código correcto!</p>
					</div>
					<ProfileSeqOtpSqneCountdown
						v-if="!otpValidateResSuccess"
						:duration="parseInt(countdown)"
						@time-over="handleTimeOver"
						@resend-otp="handleResendOTP"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="postcss">
.content-validator-md {
	@apply w-full relative bg-white z-10 rounded-lg overflow-hidden max-w-[425px] px-3 lg:px-5 py-4;
}
</style>
