<script lang="ts" setup>
defineProps<{
	text: string;
}>();
</script>
<template>
	<h2
		class="font-grotesk font-bold uppercase bg-black text-white inline-block py-1 px-2 text-sm mb-1 md:text-xl"
	>
		{{ text }}
	</h2>
</template>
