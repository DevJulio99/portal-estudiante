<script setup lang="ts">
import InputNota from './inputNota.vue';

interface Notas {
	codTipoPrueba: string;
	nota: string;
	desTipoPrueba: string;
	numPrueba: string;
	pesoPonderado: string;
}

const props = defineProps<{
	idTable: string;
	item: Notas[];
	curso: string;
	modalidad: string;
}>();

const simulateNote = ref(false);
const average = ref<number>(0);

const itemsNota = props.item.filter((x) => x.codTipoPrueba !== 'PF');
const notaSusti = props.item.find((x) => x.codTipoPrueba === 'RE');

// itemsNota[0].pesoPonderado = '10%';
// itemsNota[1].pesoPonderado = '10%';
// itemsNota[2].pesoPonderado = '20%';
// itemsNota[3].pesoPonderado = '20%';
// itemsNota[4].pesoPonderado = '40%';
// itemsNota[4].nota = '12';

average.value = Number(
	props.item.find((x) => x.codTipoPrueba === 'PF')?.nota ?? '0',
);

const averageStyle = ref({
	styles: '',
	content: '-',
});

const calculationAverage = props.item ? props.item.map((x) => x.nota) : '-';
let sumanotas = 0;
const notas = [];
if (calculationAverage.length) {
	for (const nota of calculationAverage) {
		notas.push(nota);
		sumanotas = sumanotas + Number(nota);
	}
}

// function getAverage() {
// 	return parseInt(`${sumanotas / notas.length}`);
// }

function simulateAverage() {
	handleSimulate();
}

function handleSimulate() {
	resetSimulateNote();
	handleNotaSusti();
	simulateNote.value = !simulateNote.value;

}

function backSimulate() {
	handleSimulate();
	setAverage(props.modalidad !== 'Finalizado' ? 0 : average.value);
}

function changeInput(e: any) {
	e.stopPropagation();
	const inputs = document.getElementsByTagName('input');

	const notas = [];
	let sumaNotas = 0;
	let promedio = 0;

	for (const inpt of inputs) {
		if (inpt.name.startsWith(`t-${props.idTable}nota`)) {
			notas.push(inpt.value);
			sumaNotas = sumaNotas + Number(inpt.value);
		}
	}
	promedio = parseInt(`${sumaNotas / notas.length}`);
	average.value = promedio;
	// if(promedio !== average.value){
	//     average.value = promedio;
	// }
}

function handleNotaSusti() {
	const indexRe = itemsNota.findIndex((x) => x.codTipoPrueba === 'RE');
	if (indexRe >= 0) {
		itemsNota.splice(indexRe, 1);
	} else {
		notaSusti && itemsNota.splice(itemsNota.length, 0, notaSusti);
	}
}

function changeInp() {
	const inputs = document.getElementsByTagName('input');

	const notas = [];

	for (const inpt of inputs) {
		if (inpt.name.startsWith(`t-${props.idTable}nota`)) {
			const code = inpt.name.split('-').pop();
			const percentage =
				itemsNota.find((x) => x.codTipoPrueba === code)?.pesoPonderado ?? '0%';
			const percentageNumber = parseFloat(`0.${percentage.replace(/%/g, '')}`);
			notas.push(Number(inpt.value) * percentageNumber);
		}
	}

	const suma = notas.reduce((accumulator, currentValue) => {
		return accumulator + currentValue;
	}, 0);
	average.value = Math.round(suma);
	setAverage(Math.round(suma));
}

function setAverage(average: number) {
	removerClass();
	const docAverage = document.getElementById(`averageBox${props.idTable}`);
	if (docAverage) {
		docAverage.innerHTML = `${average}`;
		if ((!simulateNote && props.modalidad !== 'Finalizado') || !average) {
			removerClass();
			docAverage.classList.add('bg-disable');
			// docAverage.innerHTML = `-`;
			// averageStyle.value.styles = 'border-gray_80 text-gray_80';
			// averageStyle.value.content = '-';
		} else {
			conditionAverageBox(average, docAverage);
		}
	}
}

function conditionAverageBox(average: number, docAverage: HTMLElement) {
	if (average < 12) {
		removerClass();
		docAverage.classList.add('bg-error');
		// averageStyle.value.styles = 'border-error-dark text-error-dark';
	} else {
		removerClass();
		docAverage.classList.add('bg-[#00A5E4]');
		// averageStyle.value.styles = 'border-[#1F7634] text-[#1F7634]';
	}
}

function removerClass() {
	document
		.getElementById(`averageBox${props.idTable}`)
		?.classList.remove('bg-disable');
	document
		.getElementById(`averageBox${props.idTable}`)
		?.classList.remove('bg-error');
	document
		.getElementById(`averageBox${props.idTable}`)
		?.classList.remove('bg-[#00A5E4]');
}

function resetSimulateNote() {
	let numberInput = 0;
	for (const nota of calculationAverage) {
		const input = document.getElementById(`t-${props.idTable}nt${numberInput}`);
		input && ((input as HTMLInputElement).value = nota);
		numberInput++;
	}

	average.value = Number(
		props.item.find((x) => x.codTipoPrueba === 'PF')?.nota ?? '0',
	);
	setAverage(average.value);
}

onMounted(() => {
	setAverage(props.modalidad !== 'Finalizado' ? 0 : average.value);
});
</script>

<template aria-label="TableNotas">
	<div class="w-full overflow-auto">
		<table class="border border-x-0 border-b-disable border-t-0">
			<tr class="border border-b-disable border-x-0 border-t-0">
				<th class="font-grotesk uppercase">Tipo</th>
				<th class="font-grotesk uppercase">Evaluación</th>
				<th class="font-grotesk uppercase">Peso</th>
				<th class="font-grotesk uppercase">Nota</th>
			</tr>
			<tr v-for="(data, index) in itemsNota" :key="index">
				<td class="font-extrabold text-xs md:text-sm font-telegraf">
					{{ data.codTipoPrueba }}
				</td>
				<td class="text-xs md:text-sm font-telegraf">
					{{ data.desTipoPrueba }}
				</td>
				<td class="text-xs md:text-sm font-telegraf">
					{{ data.pesoPonderado }}
				</td>
				<td
					class="font-extrabold text-sm md:text-base font-telegraf flex justify-center"
				>
					<p v-if="!simulateNote">{{ data.nota }}</p>
					<InputNota
						v-if="simulateNote && data.codTipoPrueba !== 'RE'"
						:id="`t-${idTable}nt${index}`"
						:name="`t-${idTable}nota${index}-${data.codTipoPrueba}`"
						:nota="data.nota"
						:on-change-nota="changeInp"
					/>
					<!-- <div
						v-if="simulateNote && data.codTipoPrueba !== 'RE'"
						class="border border-disable py-0 md:pb-2.5 md:pt-1 px-2 bg-white w-full max-w-[60px] max-h-[23px] md:max-w-[100px] md:max-h-[33px]"
					>
						<input
							:id="`nt${index}`"
							v-model="data.nota"
							max="20"
							min="1"
							class="text-end w-[50px] md:w-full md:h-[23px] outline-none"
							type="number"
							:name="`nota${index}`"
							@keypress="keyChange($event)"
							@keydown="keyChange($event)"
							@change="changeInput($event)"
						/>
					</div> -->
				</td>
			</tr>
		</table>
	</div>

	<div class="w-full flex flex-wrap py-2 px-4 md:py-4 gap-2 mb-4 lg:flex-row-reverse lg:justify-start">
		<div class="flex gap-4 md:gap-[42px] items-center justify-end flex-auto lg:flex-[0.5]">
			<span class="text-black text-sm md:text-base font-extrabold">
				Promedio final</span
			>
			<div
				:id="`averageBox${idTable}`"
				class="w-full max-w-[60px] h-[31px] md:max-w-[100px] md:h-[33px] py-2 font-extrabold flex items-center justify-center"
			></div>

			<!-- <div
				:id="`averageBox${idTable}`"
				class="flex items-center justify-center border-[3px] w-[48px] h-[48px] font-bold text-xl font-grotesk rounded-full"
				:class="averageStyle.styles"
			></div> -->
		</div>

		<button
			v-if="!simulateNote"
			class="w-full cursor-pointer rounded bg-yellow py-[6px] justify-center items-center px-4 flex gap-[11px] lg:w-max"
			@click="simulateAverage"
		>
			<nuxt-icon name="calculator-icon" filled />
			<span class="text-black text-xs md:text-sm font-extrabold"
				>Simular Promedio</span
			>
		</button>

		<div
			v-if="simulateNote"
			class="flex gap-1 md:gap-4 w-full justify-center md:w-auto items-center lg:px-4"
		>
			<button
				class="bg-black rounded text-white font-extrabold p-2 text-xs md:text-sm md:py-[6px] md:px-4"
				@click="backSimulate"
			>
				Atrás
			</button>
			<button
				class="flex gap-2 items-center bg-black rounded text-white font-extrabold p-2 text-xs md:text-sm md:py-[6px] md:px-4 md:flex-row-reverse"
				@click="resetSimulateNote"
			>
				Restablecer notas
				<nuxt-icon name="arrow-go-back" filled />
			</button>
		</div>
	</div>
	<div v-if="simulateNote" class="absolute flex gap-1 items-center mt-2">
		<nuxt-icon name="upn-icon-alert" filled />
		<span class="text-sm leading-[18px]"
			>La nota calculada es solo una referencia del promedio final.</span
		>
	</div>
</template>

<style lang="postcss" scoped>
table {
	font-family: arial, sans-serif;
	border-collapse: collapse;
	width: 100%;
}

td,
th {
	text-align: left;
	text-align: center;
	padding: 8px;
	border: none;
}

th {
	font-weight: 600;
	font-size: 14px;
}

tr:nth-child(even) {
	background-color: #f6f6f6;
}

@media (min-width: 768px) {
	td,
	th {
		padding: 16px 8px;
	}

	th {
		font-size: 16px;
	}
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
	opacity: 1;
	margin-left: 10px;

	@media (min-width: 768px) {
		margin-left: 20px;
	}
}
</style>
