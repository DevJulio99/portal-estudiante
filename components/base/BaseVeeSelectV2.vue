<script setup lang="ts">
import { useMediaQuery, onClickOutside } from '@vueuse/core';

interface Option {
	id: string | number;
	name: string;
}

const props = withDefaults(
	defineProps<{
		id: string;
		disabled?: boolean;
		label?: string;
		customStyle?: string;
		validateOnInput?: boolean;
		value: string | number;
		placeholder?: string | null;
		responsivePlaceholder?: string;
		icon: string;
		iconStyle?: string;
		options: Option[];
		error?: string;
		borderDefault: string;
	}>(),
	{
		disabled: false,
		customStyle: '',
		label: '',
		validateOnInput: false,
		value: '',
		icon: 'iconFilter',
		iconStyle: '',
		placeholder: null,
		responsivePlaceholder: '',
		error: '',
		options: () => [],
		borderDefault: ''
	},
);
const emit = defineEmits(['change']);

const target = ref(null);
const openSelect = ref(false);

const isMobile = useMediaQuery('(max-width: 768px)');

const open = () => {
	if (props.disabled) return;
	openSelect.value = !openSelect.value; // Alternar el estado
};

const close = () => {
	openSelect.value = false;
};

onClickOutside(target, close);

const selectOp = (value: Option) => {
	close();
	emit('change', value, props.id);
};

const selectedOption = computed(() => {
	return props.options.find((option) => `${option.id}` === `${props.value}`);
});

const displayText = computed(() => {
	if (selectedOption.value?.name) {
		return selectedOption.value.name;
	}
	if (isMobile.value && props.responsivePlaceholder) {
		return props.responsivePlaceholder;
	}
	return props.placeholder ?? 'Seleccione';
});
</script>

<template>
	<div ref="target" class="flex flex-col relative">
		<span v-if="label" class="font-bold">{{ label }}</span>
		<div class="relative border-[1px] rounded flex items-center h-[46px]" :class="[openSelect ? 'border-turquoise' : borderDefault, disabled ? 'bg-extra_gray cursor-not-allowed' : 'cursor-pointer']">
			<button type="button" :aria-expanded="openSelect" aria-haspopup="listbox" :class="`${customStyle} flex items-center w-full py-1.5 px-3 md:p-3 rounded`" @click="open" :disabled="disabled">
				<span class="text-xs md:text-sm font-nunito text-neutral">{{ displayText }}</span>
				<nuxt-icon
					:name="icon"
					filled
					:class="`absolute text-[24px] h-[24px] right-[12px] ${iconStyle} ${openSelect ? 'rotate-180' : ''}`"
				/>
			</button>
			<div
				v-if="openSelect"
				class="py-2 absolute max-h-[200px] overflow-auto w-full bg-white z-30 top-[50px] shadow-[0_10px_32px_-4px_#0000001A]"
				role="listbox">
				<ul tabindex="-1" role="listbox">
					<li v-for="op in options" :key="op.id" role="option" :aria-selected="selectedOption?.id === op.id" class="p-3 text-sm cursor-pointer text-neutral hover:bg-cyan_40 hover:text-black" :class="selectedOption?.id === op.id ? 'bg-cyan_40' : ''" @click="() => selectOp(op)">
						{{ op.name }}
					</li>
				</ul>
			</div>
		</div>
		<span v-if="error" class="text-error">{{ error }}</span>
	</div>
</template>

<style scoped>
.text-error { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
</style>
