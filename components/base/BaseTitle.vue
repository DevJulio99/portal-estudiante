<script lang="ts" setup>
defineProps<{
	text: string;
}>();
</script>
<template>
	<h1 class="my-4 font-robotoCondensed font-bold text-2xl uppercase">{{ text }}</h1>
</template>
