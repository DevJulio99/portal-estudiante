<script lang="ts" setup>
defineProps<{
	title: string;
	description: string;
}>();

const activeTexLine = ref(false);

function textLine(text: string) {
	text.length > 19 && (activeTexLine.value = true);
	return text.length > 19;
}
</script>
<template>
	<p
		class="leading-[18px] mb-1 text-black font-extrabold text-sm font-telegraf text-reponsive"
		:class="textLine(title) ? 'text-line-two' : 'text-line-one'"
	>
		{{ title }}
	</p>
	<p
		class="leading-[22px] text-sm text-secondary font-telegraf text-reponsive"
		:class="
			!textLine(description) && !activeTexLine
				? 'text-line-two'
				: 'text-line-one'
		"
	>
		{{ description }}
	</p>
</template>

<style lang="postcss" scoped>
.text-line-two {
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 2;
	display: -webkit-box;
	-webkit-box-orient: vertical;
}

.text-line-one {
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1;
	display: -webkit-box;
	-webkit-box-orient: vertical;
}

@media (min-width: 768px) {
	.text-line-one,
	.text-line-two {
		-webkit-line-clamp: 1;
	}
}
</style>
