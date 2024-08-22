<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		numberOfDigits: number;
		disabled: boolean;
		hasError: boolean;
		hasSuccess: boolean;
	}>(),
	{
		disabled: false,
		hasError: false,
		hasSuccess: false,
	},
);

enum EventKeys {
	Tab = 'Tab',
	ArrowRight = 'ArrowRight',
	ArrowLeft = 'ArrowLeft',
	Backspace = 'Backspace',
}

const otpCodeDigits = reactive<any>([]);
const otpContentRef = ref(null);
const updateEventEmit = defineEmits(['update:otp']);

const isAllOtpFieldsCompleted = () => {
	for (const elem of otpCodeDigits) {
		if (elem == null || elem === undefined) return false;
	}
	return true;
};

const clearInputs = () => {
	const { numberOfDigits } = props;
	for (let i = 0; i < numberOfDigits; i++) {
		otpCodeDigits[i] = null;
	}
};

const handleKeyDown = (event: any, index: number) => {
	if (
		event.key !== EventKeys.Tab &&
		event.key !== EventKeys.ArrowRight &&
		event.key !== EventKeys.ArrowLeft
	) {
		event.preventDefault();
	}

	if (event.key === EventKeys.Backspace) {
		otpCodeDigits[index] = null;
		if (index !== 0) {
			otpContentRef?.value?.children[index - 1].focus();
		}
		return;
	}
	const otpRegExp = /^[0-9]$/;
	if (otpRegExp.test(event.key)) {
		otpCodeDigits[index] = event.key;
		if (index !== props.numberOfDigits - 1) {
			otpContentRef?.value?.children[index + 1].focus();
		}
		if (isAllOtpFieldsCompleted()) {
			updateEventEmit('update:otp', otpCodeDigits.join(''));
		}
	}
};

onMounted(() => {
	clearInputs();
});

defineExpose({
	clearInputs,
});
</script>
<template>
	<div ref="otpContentRef">
		<input
			v-for="(el, ind) in otpCodeDigits"
			:key="el + ind"
			v-model="otpCodeDigits[ind]"
			inputmode="numeric"
			:disabled="disabled"
			type="text"
			class="otp-input"
			:class="{ error: hasError, success: hasSuccess }"
			autocomplete="one-time-code"
			pattern="\d{6}"
			maxlength="1"
			@keydown="handleKeyDown($event, ind)"
		/>
	</div>
</template>
<style lang="postcss">
.otp-input {
	@apply lg:max-w-[48px] lg:max-h-[48px] max-w-[34px] max-h-[34px] text-center mr-2 px-2 py-4 transition-all duration-300 text-[20px] lg:text-[24px] outline-0 rounded-[4px] border-black border-[1.5px] border-solid font-telegraf font-semibold disabled:bg-[#F6F6F6] disabled:border-[#5E757C];
}

.otp-input.success {
	@apply border-[#28A745];
}

.otp-input.error {
	@apply border-[#DC3545];
}

.otp-input:focus,
.otp-input:active {
	@apply border-primary;
}
</style>
