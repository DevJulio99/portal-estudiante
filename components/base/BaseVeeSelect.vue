<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
withDefaults(
	defineProps<{
		id: string;
		disabled?: boolean;
		label?: string;
		costumStyle?: string;
		validateOnInput?: boolean;
		value: string;
		secondary?: boolean;
	}>(),
	{
		disabled: false,
		costumStyle: '',
		label: '',
		validateOnInput: false,
		value: '',
		secondary: false,
	},
);
const isLargeScreen = useMediaQuery('(min-width: 1024px)');

const emit = defineEmits(['change']);
const handleChange = (e: any, id: string) => {
	emit('change', e.target.value, id);
};
</script>

<template>
	<div
		class="flex"
		:class="{
			'flex-col': !secondary || !isLargeScreen,
			'items-center grid grid-cols-[240px_1fr] py-1':
				secondary && isLargeScreen,
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
		<VeeField v-slot="{ field, errorMessage, meta }" :value="value" :name="id">
			<div class="relative dropIcon" :class="{ disabled: disabled }">
				<select
					v-bind="field"
					:id="id"
					:name="id"
					:disabled="disabled"
					class="text-neutral border-[1px] rounded p-3 w-full focus-visible:outline-0 focus:outline-0 focus-visible:border-primary focus:border-primary h-[48px] appearance-none"
					:class="{
						'border-error': errorMessage && (!secondary || meta.touched),
						'bg-extra_gray border-disable': disabled,
						'bg-white': !disabled,
						'mb-1': !secondary || !isLargeScreen,
					}"
					@change="(e) => handleChange(e, id)"
				>
					<slot></slot>
				</select>
			</div>
			<div
				v-if="errorMessage && (!secondary || meta.touched)"
				class="flex items-center"
				:class="{ 'ml-[240px] w-full': secondary && isLargeScreen }"
			>
				<nuxt-icon name="errorIcon" class="text-error mr-1" />
				<span class="text-error text-xs pt-[2px]">
					{{ errorMessage }}
				</span>
			</div>
		</VeeField>
	</div>
</template>

<style lang="postcss" scoped>
.dropIcon::after {
	position: absolute;
	top: 10px;
	right: 10px;
	width: 12px;
	height: 12px;
	content: url("data:image/svg+xml,%3csvg viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.351472 0.334735C0.820101 -0.111578 1.5799 -0.111578 2.04853 0.334735L6 4.09804L9.95147 0.334735C10.4201 -0.111578 11.1799 -0.111578 11.6485 0.334735C12.1172 0.781049 12.1172 1.50467 11.6485 1.95098L6.84853 6.52241C6.3799 6.96872 5.6201 6.96872 5.15147 6.52241L0.351472 1.95098C-0.117157 1.50467 -0.117157 0.781049 0.351472 0.334735Z' fill='%23FDBA30' /%3e%3c/svg%3e");
}
.dropIcon.disabled::after {
	content: url("data:image/svg+xml,%3csvg viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.351472 0.334735C0.820101 -0.111578 1.5799 -0.111578 2.04853 0.334735L6 4.09804L9.95147 0.334735C10.4201 -0.111578 11.1799 -0.111578 11.6485 0.334735C12.1172 0.781049 12.1172 1.50467 11.6485 1.95098L6.84853 6.52241C6.3799 6.96872 5.6201 6.96872 5.15147 6.52241L0.351472 1.95098C-0.117157 1.50467 -0.117157 0.781049 0.351472 0.334735Z' fill='%23C2D1D9' /%3e%3c/svg%3e");
}
</style>
