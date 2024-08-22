<script lang="ts" setup>
export interface Props {
	size?: string;
	iconName?: string;
	iconSize?: string;
	styles?: string;
}

withDefaults(defineProps<Props>(), {
	size: '10px',
	iconName: 'moreIcon',
	iconSize: '8px',
	styles: '',
});
</script>

<template>
	<nuxt-icon
		:name="iconName"
		filled
		:class="['icon-style', styles]"
		:style="{ width: size, height: size, fontSize: iconSize }"
	/>
</template>
<style lang="postcss" scoped>
.icon-style {
	@apply bg-primary rounded-full border-[0.5px] border-white flex items-center justify-center;
}
</style>
