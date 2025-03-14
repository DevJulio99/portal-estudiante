<script setup lang="ts">
import { BtnColor } from '~/types/helper.types';

withDefaults(
	defineProps<{
		color?: BtnColor;
		iconName?: string;
		styles?: string;
		disabled?: boolean;
		disabledStyle?: boolean;
		type?: any;
		url?: string;
		internal?: boolean;
	}>(),
	{
		color: BtnColor.default,
		iconName: '',
		styles: '',
		disabled: false,
		disabledStyle: false,
		type: 'button',
		url: '',
		internal: false,
	},
);
</script>

<template>
	<button
		v-if="!url"
		:type="type"
		class="btn"
		:class="[
			styles,
			{
				'flex items-center': Boolean(iconName),
				'bg-primary opacity-50 cursor-not-allowed':
					color === BtnColor.default && (disabled || disabledStyle),
				'bg-primary text-black':
					color === BtnColor.default && (!disabled || !disabledStyle),
				'bg-extra_gray disabled:text-black':
					color === BtnColor.black && (disabled || disabledStyle),
				'bg-black text-white':
					color === BtnColor.black && (!disabled || !disabledStyle),
				'bg-blue_light text-white':
					color === BtnColor.blueLight && (!disabled || !disabledStyle),
				'bg-blue_light text-white opacity-50 cursor-not-allowed':
				    color === BtnColor.blueLight && (disabled || disabledStyle),
				'bg-secondary text-white':
					color === BtnColor.secondary && (!disabled || !disabledStyle),
				'bg-secondary text-white opacity-50 cursor-not-allowed':
				    color === BtnColor.secondary && (disabled || disabledStyle),
			},
		]"
		:disabled="disabled"
	>
		<nuxt-icon v-if="iconName" :name="iconName" class="mr-1 md:text-[24px]" />
		<slot></slot>
	</button>
	<nuxt-link
		v-else-if="url && internal"
		class="btn"
		:to="url"
		:class="[
			styles,
			{
				'flex items-center': Boolean(iconName),
				'bg-green_20':
					color === BtnColor.default && (disabled || disabledStyle),
				'bg-green_40 text-black':
					color === BtnColor.default && (!disabled || !disabledStyle),
				'bg-extra_gray disabled:text-black':
					color === BtnColor.black && (disabled || disabledStyle),
				'bg-black text-white':
					color === BtnColor.black && (!disabled || !disabledStyle),
			},
		]"
		:disabled="disabled"
	>
		<nuxt-icon v-if="iconName" :name="iconName" class="mr-1 md:text-[24px]" />
		<slot></slot>
	</nuxt-link>
	<a
		v-else
		:href="url"
		target="_blank"
		rel="noopener noreferrer"
		class="btn"
		:class="[
			styles,
			{
				'flex items-center': Boolean(iconName),
				'bg-green_20':
					color === BtnColor.default && (disabled || disabledStyle),
				'bg-green_40 text-black':
					color === BtnColor.default && (!disabled || !disabledStyle),
				'bg-extra_gray disabled:text-black':
					color === BtnColor.black && (disabled || disabledStyle),
				'bg-black text-white':
					color === BtnColor.black && (!disabled || !disabledStyle),
			},
		]"
	>
		<slot></slot>
	</a>
</template>

<style lang="postcss" scoped>
.btn {
	@apply w-full md:w-[106px] h-[24px] md:h-[36px] text-xs md:text-sm rounded font-bold flex items-center justify-center;
}
</style>
