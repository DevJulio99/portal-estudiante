<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
});
</script>
<template>

<BaseLayout :rightAside="false" class="relative" bgWhite>
    <BaseTitle text="Registro de Alumnos" />
</BaseLayout>
</template>