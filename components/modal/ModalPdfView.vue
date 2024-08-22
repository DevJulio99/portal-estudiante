<script setup lang="ts">
const props = defineProps<{
	nameDoc?: string;
	urlDoc?: string;
	typeDoc?: string;
	onClose?: () => void;
}>();

function outsideModal() {
	props.onClose && props.onClose();
}

function isValidPdf(type: string | undefined) {
	return type?.toLowerCase() === 'application/pdf';
}

function isValidUrl(url: string, type: string | undefined) {
	return isValidPdf(type) && isValidUrlFormat(url);
}

function isValidUrlFormat(url: string) {
	try {
		// eslint-disable-next-line no-new
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
}
</script>

<template>
	<div
		class="top-0 left-0 z-[99] px-6 fixed flex justify-center items-center w-full h-full"
	>
		<div
			class="fixed w-full h-full bg-black_transparent"
			@click="outsideModal"
		></div>
		<div
			v-if="!isValidUrl(props?.urlDoc ?? '', props?.typeDoc ?? '')"
			class="w-full relative rounded-lg max-w-[620px] h-full max-h-[303px] flex items-center z-10 bg-white py-10 px-6 md:py-0 md:px-0"
		>
			<span class="absolute top-4 right-4" @click="outsideModal">
				<nuxt-icon
					name="closeIcon"
					class="cursor-pointer text-[24px]"
					alt="icon-close"
				/>
			</span>
			<!-- <ScheduleStatusError
				class="w-full"
				text="Lo sentimos, no pudimos encontrar este documento"
				description="Inténtalo de nuevo más tarde"
				styleIcon="text-[24px] md:text-[60px]"
			/> -->
		</div>
		<div
			v-else
			class="z-10 rounded-lg w-full max-w-[1245px] min-h-[70%] lg:min-h-[613px] overflow-hidden"
		>
			<div class="py-4 px-8 bg-white flex justify-between">
				<span class="text-sm md:text-base font-telegraf">
					{{ nameDoc ?? 'Documento' }}
				</span>
				<span @click="outsideModal">
					<nuxt-icon
						name="closeIcon"
						class="cursor-pointer text-[24px]"
						alt="icon-close"
					/>
				</span>
			</div>
			<div class="bg-black h-[300px] md:h-[400px] lg:h-[557px]">
				<iframe
					:src="urlDoc"
					width="100%"
					height="100%"
					frameborder="0"
				></iframe>
			</div>
		</div>
	</div>
</template>
