<script lang="ts" setup>
import type { DataDocumento } from '~/types/documento.types';

const props = defineProps<{
	data: DataDocumento[];
	classCard?: string;
	onAction?: (item: DataDocumento) => void;
	onDownload?: (item: DataDocumento) => void;
}>();

const activeResponsive = ref(false);

onMounted(() => {
	validResponsive();
	window.addEventListener('resize', () => {
		validResponsive();
	});
});

const validResponsive = () => {
	if (window.innerWidth < 1024) {
		activeResponsive.value = true;
	} else {
		activeResponsive.value = false;
	}
};

function handleButtonClick(item: DataDocumento) {
	if (
		!activeResponsive.value &&
		item.type?.toLowerCase() === 'application/pdf'
	) {
		props.onAction && props.onAction(item);
	}
}

function handleDownload(item: DataDocumento) {
	props.onDownload && props.onDownload(item);
}

const formatDate = (inputDate: string | null): string => {
	if (!inputDate) {
		return '';
	}

	const dateObject = new Date(inputDate);
	const day = dateObject.getDate();
	const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(
		dateObject,
	);
	const year = dateObject.getFullYear();

	return `${day}/${month.charAt(0).toUpperCase() + month.slice(1)}/${year}`;
};
</script>

<template>
	<div
		class="w-full pt-6 border border-disable border-x-0 border-b-0 mb-[40px]"
		:class="classCard"
	>
		<div class="flex flex-wrap">
			<div class="w-full">
				<div class="hidden xl:flex">
					<span
						class="w-full pl-4 font-nunito text-sm font-extrabold mb-2 block leading-[18px] max-w-[588px]"
						>Nombre</span
					>
					<span
						class="flex-1 font-nunito text-sm font-extrabold block leading-[18px] mb-2 mr-[270px] min-[1330px]:mr-[328px] text-end"
						><p class="relative left-[20px]">Fecha de modificación</p></span
					>
				</div>
				<div
					v-for="(item, index) in data"
					:key="index"
					class="relative flex flex-wrap even:bg-extra_gray p-4"
				>
					<div
						class="w-full flex xl:flex-wrap items-center min-h-auto mr-[65px] md:mr-[60px] lg:mr-[240px] xl:mr-0 xl:max-w-[607px] max-w-none"
					>
						<nuxt-icon name="fileList" filled class="text-[30px] mr-[13px]" />
						<div class="w-full xl:w-[559px] xl:mr-0">
							<BaseTextLineTableDoc
								:title="item.titulo ?? ''"
								:description="item.descripcion ?? ''"
							/>
						</div>
					</div>
					<div
						class="flex flex-wrap gap-[24px] xl:gap-[40px] items-center pl-0 flex-1 justify-end"
					>
						<div
							class="ml-[42px] w-[152px] text-left xl:text-center lg:w-full xl:ml-0 min-[1330px]:w-[200px] min-[1280px]:w-auto text-sm font-nunito text-neutron80"
						>
							{{ item.dateCreated ? formatDate(item.dateCreated) : '' }}
						</div>
						<div
							class="flex gap-2 justify-end w-auto xl:w-[232px] absolute top-[33px] right-[16px] md:top-4 xl:static"
						>
							<BaseButton
								v-if="
									!activeResponsive &&
									item?.type?.toLowerCase() === 'application/pdf'
								"
								styles="bg-primary hover:bg-[#1E6657] sticky btn-preview min-h-[36px] top-[22px] !w-full !max-w-[56px] py-3.5 px-4 text-sm"
								@click="handleButtonClick(item)"
							>
								<div
									class="dtooltip font-nunito font-normal rounded text-center absolute text-[12px] w-max left-[-20px] top-auto bottom-[50px] z-10 bg-black text-white py-2 px-[16px]"
								>
									Vista previa
								</div>
								<div class="flex gap-[9px] items-center text-white">
									<nuxt-icon
										v-if="!activeResponsive"
										name="iconEye"
										class="text-[18px]"
									/>
								</div>
							</BaseButton>
							<BaseButton
								styles="bg-primary hover:bg-[#1E6657] text-white min-h-[36px] top-[22px] !w-full !max-w-[56px] lg:!max-w-[136px] py-3.5 px-4 text-sm"
								@click="handleDownload(item)"
							>
								<div class="flex gap-[9px] items-center">
									<div>
										<nuxt-icon name="upnDowload" class="text-[18px]" />
									</div>
									<span v-if="!activeResponsive" class="hidden lg:flex gap-0.5">
										<p>Descargar</p>
									</span>
								</div>
							</BaseButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.dtooltip {
	visibility: hidden;
}

.dtooltip::after {
	content: '';
	display: block;
	position: absolute;
	width: 0;
	height: 0;
	background-color: transparent;
	bottom: -5px;
	border: 3.93px solid transparent;
	border-bottom: 0;
	border-top: 6px solid #000000;
	text-align: center;
	transform: translateX(-60%);
	left: 78%;
}

@media (min-width: 768px) {
	.dtooltip::after {
		left: 10%;
	}
}

@media (min-width: 1024px) {
	.dtooltip::after {
		left: 10%;
	}
}

@media (min-width: 1024px) {
	.dtooltip {
		&::after {
			left: 50%;
		}
	}
}

.btn-preview:hover .dtooltip {
	visibility: visible;
}
</style>
