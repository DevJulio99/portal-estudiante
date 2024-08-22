<script setup lang="ts">
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
		options: any;
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
		options: [],
	},
);
const emit = defineEmits(['change']);
const openSelect = ref(false);
const valueSelect = ref();
const activeResponsive = ref();

onMounted(() => {
	validResponsive();
	window.addEventListener('resize', () => {
		validResponsive();
	});
});

const validResponsive = () => {
	if (window.innerWidth <= 768) {
		activeResponsive.value = true;
	} else {
		activeResponsive.value = false;
	}
};

const open = () => {
	openSelect.value = true;
};

const close = () => {
	openSelect.value = false;
};

const selectOp = (value: any, id: string) => {
	close();
	valueSelect.value = value;
	emit('change', value, id);
};

const currentValue = () => {
	const optionDefault = props.options.find(
		(x: any) => `${x.id}` === `${props.value}`,
	);
	optionDefault && (valueSelect.value = optionDefault);
	return optionDefault;
};
</script>

<template>
	<div class="flex flex-col relative">
		<div
			class="relative border-[1px] rounded flex items-center"
			:class="openSelect ? 'border-primary' : ''"
		>
			<div
				:class="`${customStyle} flex items-center w-full py-1.5 px-3 md:p-3 rounded`"
				@click="open"
			>
				<span class="text-xs md:text-sm font-telegraf text-neutral">{{
					currentValue()?.name.trim().length
						? currentValue()?.name ?? placeholder ?? 'Seleccione'
						: responsivePlaceholder.trim().length && activeResponsive
						? responsivePlaceholder
						: placeholder ?? 'Seleccione'
				}}</span>
				<nuxt-icon
					:name="icon"
					filled
					:class="`absolute text-[24px] right-[12px] ${iconStyle}`"
				/>
			</div>
			<div
				v-if="openSelect"
				class="fixed top-0 left-0 z-20 w-full h-full bg-transparent"
				@click="close"
			></div>
			<div
				v-if="openSelect"
				class="py-2 absolute w-full bg-white z-30 top-[50px] shadow-[0_10px_32px_-4px_#0000001A]"
			>
				<div
					v-for="op in options"
					:key="op"
					class="p-3 text-sm cursor-pointer text-neutral hover:bg-cyan_40 hover:text-black"
					:class="valueSelect?.id === op.id ? 'bg-cyan_40' : ''"
					@click="() => selectOp(op, id)"
				>
					{{ op.name }}
				</div>
			</div>
		</div>
	</div>
</template>
