<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { BtnColor } from '~/types/helper.types';

const props = withDefaults(
	defineProps<{
		value: string;
		id: string;
		name: string;
		disabled?: boolean;
		label?: string;
		costumStyle?: string;
		validateOnInput?: boolean;
		verify?: boolean;
		maxLength?: number;
		type?: string;
		secondary?: boolean;
		placeholder?: string;
		customErrorMsg?: string;
	}>(),
	{
		value: '',
		id: '',
		name: '',
		disabled: false,
		costumStyle: '',
		label: '',
		type: 'text',
		validateOnInput: false,
		verify: false,
		maxLength: 500,
		secondary: false,
		placeholder: '',
		customErrorMsg: '',
	},
);

const emit = defineEmits(['change']);
const { resetField } = useField<string>(props.id);
const isLargeScreen = useMediaQuery('(min-width: 1024px)');
const valInput = toRef(props.value);
const customError = ref<null | string>('');
const handleChange = (e: Event) => {
	emit('change', e);
	valInput.value = (e.target as HTMLTextAreaElement).value ?? '';
	const isNotNumber = isNaN(Number(valInput.value));
	if (props.type === 'number' && isNotNumber) {
		customError.value = 'Solo se permiten caracteres numéricos';
		resetField({
			value: '',
			touched: true,
		});
	} else {
		customError.value = null;
	}
};
const handleBlur = () => {
	customError.value = '';
};
const getCount = (val: string) => {
	if (props.maxLength > 20) {
		if (props.maxLength - val.length <= 10)
			return `${val.length}/${props.maxLength}`;
		else return null;
	} else if (val.length >= 10) return `${val.length}/${props.maxLength}`;
	else return null;
};
</script>

<template>
	<div
		class="flex relative"
		:class="{
			'flex-row items-center grid grid-cols-[240px_1fr] py-1':
				secondary && isLargeScreen,
			'flex-col': !secondary || !isLargeScreen,
		}"
	>
		<label
			v-if="label"
			class="leading-[1]"
			:class="{
				'text-sm font-bold text-black': secondary && isLargeScreen,
				'text-xs text-[#333333] mb-1': !secondary || !isLargeScreen,
			}"
			:for="id"
		>
			{{ label }}
		</label>
		<VeeField
			v-slot="{ field, errorMessage, meta }"
			:value="value"
			:name="name"
			:validateOnInput="validateOnInput"
		>
			<input
				v-bind="field"
				:id="id"
				:maxLength="maxLength"
				:placeholder="placeholder"
				:disabled="disabled"
				autocomplete="on"
				:inputmode="type === 'number' ? 'numeric' : undefined"
				class="text-neutral border-[1px] rounded p-3 focus-visible:outline-0 focus:outline-0 focus-visible:border-primary focus:border-primary h-[48px]"
				:class="[
					costumStyle,
					{
						'border-error':
							(Boolean(errorMessage) && (!secondary || meta.touched)) ||
							customError ||
							customErrorMsg,
						'mb-1': !secondary || !isLargeScreen,
						'bg-extra_gray border-disable': disabled,
					},
				]"
				@input="handleChange"
				@blur="handleBlur"
			/>
			<span
				v-if="getCount(valInput) && !secondary"
				class="text-sm absolute bottom-[-16px] right-[4px]"
			>
				{{ getCount(valInput) }}
			</span>
			<div
				v-if="
					(Boolean(errorMessage) && (!secondary || meta.touched)) ||
					customError ||
					customErrorMsg
				"
				class="flex items-center"
				:class="{ 'ml-[240px] col-span-2': secondary && isLargeScreen }"
			>
				<nuxt-icon name="errorIcon" class="text-error mr-1" />
				<span class="text-error text-xs pt-[2px]">
					{{ customError || customErrorMsg || errorMessage }}
				</span>
			</div>
		</VeeField>
		<BaseButton
			v-if="verify"
			:color="BtnColor.black"
			styles="absolute top-[22px] right-[6px] !w-[106px]"
		>
			Verificar
		</BaseButton>
	</div>
</template>

<style lang="postcss" scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
	/* -webkit-text-fill-color: #31b0dd; */
	-webkit-box-shadow: 0 0 0px 40rem #ffff inset;
}
</style>
