<template>
	<div class="flex items-center justify-center">
		<img class="w-[45px] filter-color-primary" src="../../../assets/images/spinner.gif" />
	</div>
</template>
<style lang="postcss" scoped>
.rotate-loading {
	animation: rotate 900ms infinite linear;
}
.rotate-loading svg {
	@apply !mb-0;
}
.filter-color-primary {
	filter: brightness(0) saturate(100%) invert(43%) sepia(12%) saturate(1888%) hue-rotate(116deg) brightness(94%) contrast(95%);
}
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
