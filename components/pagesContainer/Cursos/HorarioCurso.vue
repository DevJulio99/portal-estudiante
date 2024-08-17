<script setup lang="ts">
import type { HorarioData } from '~/types/cursos.types';
import type { ErrorResponse } from '~/types/services.types';
import { conditionedString } from '~/utils/emptyData';

defineProps<{
	dataHorario: HorarioData[];
	loading: boolean;
	error: Error | null;
	errorResponse?: ErrorResponse;
	modalidad?: string | null;
	message?: string;
}>();

const convertirHora24 = (hora12: string) => {
	const matchResult = hora12.match(/(\d{1,2}):(\d{2}) (AM|PM)/);

	if (!matchResult) {
		return ' - ';
	}

	const [hora, minutos, periodo] = matchResult.slice(1);

	let hora24;

	if (periodo === 'AM') {
		hora24 = hora === '12' ? '00' : hora;
	} else {
		hora24 = hora === '12' ? '12' : String(Number(hora) + 12);
	}

	return `${hora24}:${minutos}`;
};
</script>

<template aria-label="HorarioCurso">
	<div class="flex flex-wrap gap-4">
		<div class="w-full">
			<span class="block text-xs text-secondary">Horario</span>
			<div v-if="error" class="text-xs text-black font-telegraf">
				{{ errorResponse?.titulo ?? message }}
			</div>
			<div v-else-if="errorResponse" class="text-xs text-black font-telegraf">
				<span v-if="modalidad == 'Remoto'"
					>No encontramos información del horario. Para ver el contenido del
					curso, ingresa en cualquier momento al
					<a
						href="https://upn.blackboard.com"
						target="_blank"
						class="text-blue_link underline decoration-blue_link"
						>aula virtual (Blackboard)</a
					></span
				>
				<span v-else>No encontramos información del horario</span>
			</div>
			<span v-else class="text-xs text-black flex flex-wrap gap-2">
				<div
					v-for="(data, index) of dataHorario"
					:key="index"
					class="w-full flex flex-wrap items-center font-telegraf"
				>
					<div
						v-for="(el, i) of data.detalleHorario"
						:key="i"
						class="w-full flex flex-wrap items-center font-telegraf"
					>
						<p class="text-sm font-extrabold mr-[5px] capitalize">
							{{
								conditionedString(data.horario.diaNombre.toLocaleLowerCase())
							}}
						</p>
						|
						<p class="text-base ml-[5px] mr-[5px] font-extrabold">
							{{ convertirHora24(el.horaInicio) }}
						</p>
						-
						<p class="text-xs font-extrabold ml-[5px] mr-[5px]">
							{{ convertirHora24(el.horaFin) }}
						</p>
						| Salón:
						<p
							v-if="modalidad != 'Remoto'"
							class="text-sm font-extrabold ml-[5px] mr-[5px]"
						>
							{{ conditionedString(el.codAula) }}
						</p>
						<p v-else>
							<a
								href="https://upn.blackboard.com/auth-saml/saml/login?apId=_111_1&redirectUrl=https%3A%2F%2Fupn.blackboard.com%2Fultra"
								class="text-blue_link underline decoration-blue_link"
								target="_blank"
							>
								&nbsp;Aula Virtual (Blackboard)
							</a>
						</p>
						<span v-if="modalidad != 'Remoto'"> | Campus:</span>
						<p v-if="modalidad != 'Remoto'" class="text-sm ml-[5px] mr-[5px]">
							{{ conditionedString(el.descripCampus) }}
						</p>
					</div>
				</div>
				<div class="w-[124px] md:w-[187px]">
					<span class="block text-xs text-secondary">Inicia</span>
					<span class="block text-sm text-black font-extrabold">{{
						conditionedString(dataHorario?.[0]?.detalleHorario[0]?.fechaInicio ?? '')
					}}</span>
				</div>

				<div class="w-[124px] md:w-[187px]">
					<span class="block text-xs text-secondary">Finaliza</span>
					<span class="block text-sm text-black font-extrabold">{{
						conditionedString(dataHorario?.[0]?.detalleHorario?.[0]?.fechaFin ?? '')
					}}</span>
				</div>
			</span>
		</div>
	</div>
</template>
