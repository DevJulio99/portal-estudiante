<script lang="ts" setup>
defineProps<{
	count: number;
	isActive: boolean;
	clickToggle?: () => void;
}>();
</script>
<template>
	<button
		aria-label="Notificaciones"
		class="btn-notifications"
		:class="{
			'border-primary bg-white': !isActive,
			'border-black bg-black': isActive,
		}"
		@click.stop="clickToggle"
	>
		<nuxt-icon
			name="bellIcon"
			class="text-[19px]"
			:class="{
				'text-black': !isActive,
				'text-white': isActive,
			}"
		/>
		<span v-if="Boolean(count)" class="notification-count"> {{ count }}</span>
	</button>
</template>
<style lang="postcss" scoped>
.btn-notifications {
	@apply relative flex items-center h-[40px] w-[40px] px-[10px] border-[1px] rounded-full ml-auto;
}

.notification-count {
	@apply absolute text-xs h-[17px] w-[17px] bg-[#DC3545] font-grotesk rounded-full flex items-center justify-center text-white top-[-5px] right-[-2px];
}
</style>
