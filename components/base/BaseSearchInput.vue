<script setup lang="ts">
export interface Props {
	value: string;
	placeholder?: string;
	customClass?: string;
	customClassInput?: string;
	id?: string;
}
const target = ref(null);

withDefaults(defineProps<Props>(), {
	placeholder: '',
	customClass: '',
	customClassInput: '',
	id: 'buscador',
});

const emit = defineEmits(['change', 'onAction', 'noFocus']);
// const emit = defineEmits(['change', 'noFocus']);
const handleChange = (e: Event) => {
	emit('change', (e.target as HTMLTextAreaElement).value?.toLowerCase() ?? '');
};

const handleAction = () => {
	emit('onAction', '');
};

const handleBlur = () => {
	emit('noFocus');
};
</script>

<template>
	<div class="searchInput" :class="customClass">
		<input
			:id="id"
			ref="target"
			type="text"
			:placeholder="placeholder"
			class="w-full"
			:class="customClassInput"
			:value="value"
			@input="handleChange"
			@blur="handleBlur"
		/>
		<div @click="handleAction">
			<nuxt-icon
				name="iconSearch"
				class="text-[23px] absolute top-[50%] translate-y-[-50%] right-[12px]"
			/>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.searchInput {
	@apply relative before:absolute before:w-[calc(100%_-_16px)] before:h-[8px] before:left-[8px] before:top-[-8px] before:bg-primary;
}

.searchInput input {
	@apply border-[2px] border-[#000] pt-[14px] pb-[12px] pl-[16px] pr-[40px] placeholder:text-sm placeholder:text-neutral;
}
</style>
