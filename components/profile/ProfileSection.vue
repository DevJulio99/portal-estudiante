<script setup lang="ts">
import departamento from '~/utils/data/ubigeo/departamentos.json';
import provincias from '~/utils/data/ubigeo/provincias.json';
import distritos from '~/utils/data/ubigeo/distritos.json';
import type {
	ProfileData,
	TermsConditionsProfile,
} from '~/types/profile.types';
import  dataTerminos  from '~/utils/data/dataTerminosCondiciones.json';
const props = defineProps<{
	data: ProfileData;
}>();
const { $api } = useNuxtApp();
const provVal = ref('');
const distVal = ref('');
const listTermsConditions = ref<TermsConditionsProfile[]>([]);
const pendingTerms = ref<boolean>(true);

// const { data: dataTermsConditions, pending: pendingTerms } =
// 	await $api.termsConditions.getTermsCondition({
// 		lazy: true,
// 	});

// watch(dataTermsConditions, (response) => {
// 	if (response?.flag) {
// 		listTermsConditions.value = response.data;
// 	}
// });

const depVal =
	departamento.find(
		(item) =>
			item.departamento_nombre?.toLowerCase() ===
			props.data?.departamento?.toLowerCase(),
	)?.id_departamento ?? '';
if (depVal) {
	const provinciaList =
		provincias[depVal as unknown as keyof typeof provincias];
	provVal.value =
		provinciaList.find(
			(item: any) =>
				item.name.toLowerCase() === props.data?.ciudad?.toLowerCase(),
		)?.id ?? '';
}
if (provVal.value) {
	const distritoList = distritos[provVal.value as keyof typeof distritos];
	distVal.value =
		distritoList.find(
			(item: any) =>
				item.name.toLowerCase() === props.data?.distrito?.toLowerCase(),
		)?.id ?? '';
}

onMounted(() => {
	listTermsConditions.value = dataTerminos;
	pendingTerms.value = false;
})


</script>

<template>
	<div>
		<ProfileInfoAcademic :data="data" />
		<ProfileInfoPersonal :data="data" />
		<ProfileInfoDataContact
			:data="data"
			:termsConditions="listTermsConditions"
		/>
		<ProfileInfoEmergencyContact
			:data="data"
			:termsConditions="listTermsConditions"
			:distVal="distVal"
		/>
		<ProfileInfoLaboral
			:data="data"
			:termsConditions="listTermsConditions"
			:distVal="distVal"
		/>
		<ProfileInfoTerminos
			v-if="!pendingTerms"
			:data="data"
			:distVal="distVal"
			:termsConditions="listTermsConditions"
		/>
		<!-- <div class="px-6 mb-10 md:mb-[3.75rem]">
			<BaseSubtitle text="Términos y condiciones" />
			<hr class="bg-primary text-primary h-[1px] border-0 mb-4" />
			<div class="pb-10 flex items-center">
				<BaseToggle
					class="mr-2"
					:value="value"
					:disabled="true"
					@change="getVal"
				/>
				<span class="leading-[1.2]">
					Compartir mi información personal con fines analíticos
				</span>
			</div>
		</div> -->
	</div>
</template>
