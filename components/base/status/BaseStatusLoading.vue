<template>
	<div class="flex items-center justify-center">
		<img class="w-[45px]" src="../../../assets/images/spinner.gif" />
	</div>
</template>
<style lang="postcss" scoped>
.rotate-loading {
	animation: rotate 900ms infinite linear;
}
.rotate-loading svg {
	@apply !mb-0;
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
