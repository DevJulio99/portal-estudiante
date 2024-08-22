<script setup lang="ts">
const props = defineProps<{
	duration: number;
}>();

const intervalTimer = ref();
const timeLeft = ref<number>(props.duration * 60);
const showLinkResendOTP = ref<boolean>(false);
const emit = defineEmits(['timeOver', 'resendOtp']);

const onTimeOver = () => {
	emit('timeOver');
	showLinkResendOTP.value = true;
};

const startTimer = () => {
	intervalTimer.value = setInterval(() => {
		if (timeLeft.value > 0) {
			timeLeft.value--;
		} else {
			clearInterval(intervalTimer.value);
			onTimeOver();
		}
	}, 1000);
};

const formatTime = (time: number) => {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;
};

const reenviarCodigoOtp = () => {
	// if (window.dataLayer) {
	// 	window.dataLayer.push({
	// 		event: 'Click/validar-celular-reenviar-otp',
	// 		section: 'Perfil/Datos-de-contacto',
	// 		page_url: `${window.location.href}`,
	// 		title: 'Reenviar código',
	// 	});
	// }
	emit('resendOtp');
};

onMounted(() => {
	startTimer();
});
</script>
<template>
	<div class="text-center mt-2">
		<p v-if="!showLinkResendOTP" class="text-[#1938A6] text-[14px]">
			Reenviar código en {{ formatTime(timeLeft) }} segundos
		</p>
		<a
			v-else
			class="underline text-[#1938A6] text-[14px] cursor-pointer"
			@click="reenviarCodigoOtp"
			>Reenviar código</a
		>
	</div>
</template>
