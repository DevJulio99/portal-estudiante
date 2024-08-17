<script setup lang="ts">
const props = defineProps<{
	id: string;
	name: string;
	nota: string;
	onChangeNota?: (value: number) => void;
}>();

const notaVal = ref(props.nota ?? 0);

function keyChange(event: any) {
	let valid = true;
	if (['e', 'E', '+', '-', '.'].includes(event.key)) {
		event.preventDefault();
		valid = false;
	}
	if (valid) {
		setTimeout(() => {
			const firstNumber = event.target.value.split('')[0];
			const secondNumber = event.target.value.split('')[1];

			if (parseInt(firstNumber) >= 2 && parseInt(secondNumber) > 0) {
				notaVal.value = '';
				notaVal.value = firstNumber;
				props.onChangeNota && props.onChangeNota(parseInt(firstNumber));
			}
			if (parseInt(firstNumber) > 2 && parseInt(secondNumber) === 0) {
				notaVal.value = '';
				notaVal.value = firstNumber;
				props.onChangeNota && props.onChangeNota(parseInt(firstNumber));
			} else {
				defaultValidationNota(event.target.value, firstNumber, secondNumber);
			}
		}, 0);
	}
}

function defaultValidationNota(
	val: string,
	firstNumber: string,
	secondNumber: string,
) {
	if (val.trim().length > 2) {
		notaVal.value = '';
		notaVal.value = firstNumber + secondNumber;
		props.onChangeNota &&
			props.onChangeNota(parseInt(firstNumber + secondNumber));
	} else {
		props.onChangeNota && props.onChangeNota(parseInt(val));
	}
}
</script>

<template aria-label="InputNota">
	<div
		class="border border-disable py-0 md:pb-2.5 md:pt-1 px-2 bg-white w-full max-w-[60px] max-h-[23px] md:max-w-[100px] md:max-h-[33px]"
	>
		<input
			:id="id"
			max="20"
			min="0"
			:value="notaVal"
			class="text-end w-[50px] md:w-full md:h-[23px] outline-none"
			type="number"
			:name="name"
			@keypress="keyChange($event)"
			@keydown="keyChange($event)"
			@change="keyChange($event)"
		/>
	</div>
</template>

<style lang="postcss" scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
	opacity: 1;
	margin-left: 10px;
	-webkit-appearance: auto;

	@media (min-width: 768px) {
		margin-left: 20px;
	}
}
</style>
