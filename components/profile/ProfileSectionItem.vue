<script lang="ts" setup>
withDefaults(
	defineProps<{
		data: string;
		subtitle: string;
		copy?: (text: string, name: string, title: string) => void;
		msgCopy?: { text: string | null; id: string | null } | null;
		capitalize?: boolean;
	}>(),
	{
		capitalize: false,
		copy: () => {},
		msgCopy: null,
	},
);
</script>

<template>
	<div>
		<h3 class="text-xs text-[#333333] leading-[1]">
			{{ subtitle }}
		</h3>
		<p
			v-if="data"
			class="font-bold inline-block text-sm md:text-base !leading-[1.2]"
			:class="{ capitalize: capitalize }"
		>
			{{ capitalize ? data.toLowerCase() : data }}
		</p>
		<span v-else class="font-bold inline-block text-sm md:text-base">-</span>
		<div v-if="msgCopy" class="inline-block relative">
			<button
				class="ml-2"
				aria-label="Boton copiar"
				title="Copiar"
				@click="copy(data ?? '', data, subtitle)"
			>
				<nuxt-icon name="copyIcon" class="inline-block align-middle" />
			</button>
			<div v-if="msgCopy.id === data" class="copy-msg">
				<nuxt-icon name="IconCheckSim" class="mr-1" />
				{{ msgCopy.text }}
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.copy-msg {
	@apply bg-[#404040] opacity-90 min-w-max flex items-center text-white text-xs ml-1 p-2 rounded absolute left-full top-0;
}
</style>
