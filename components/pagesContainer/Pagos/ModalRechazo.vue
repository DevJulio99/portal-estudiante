<script setup lang="ts">
import type { PagosPendientesData } from '~/types/pagos.types';

interface Props {
	pago: PagosPendientesData;
}

interface Emits {
	(e: 'rechazar', observaciones: string): void;
	(e: 'cerrar'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const observaciones = ref('');

const rechazar = () => {
	if (observaciones.value.trim()) {
		emit('rechazar', observaciones.value);
		observaciones.value = '';
		emit('cerrar');
	}
};

const cerrar = () => {
	observaciones.value = '';
	emit('cerrar');
};
</script>

<template>
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="cerrar">
		<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
			<h3 class="text-lg font-bold mb-4">Rechazar Pago</h3>
			<p class="mb-2 text-sm">
				<strong>Documento:</strong> {{ pago.documentoPago || '-' }}
			</p>
			<p class="mb-4 text-sm">
				<strong>Monto:</strong> S/ {{ pago.totalAPagar.toFixed(2) }}
			</p>
			
			<label class="block mb-2 font-semibold text-sm">
				Observaciones (requerido):
			</label>
			<textarea
				v-model="observaciones"
				class="w-full border rounded p-2 min-h-[100px] text-sm"
				placeholder="Ingrese el motivo del rechazo..."
			/>
			
			<div class="flex gap-2 mt-4 justify-end">
				<button
					@click="cerrar"
					class="px-4 py-2 border bg-gray-300 rounded hover:bg-gray-400 text-sm font-semibold"
				>
					Cancelar
				</button>
				<button
					@click="rechazar"
					:disabled="!observaciones.trim()"
					class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold"
				>
					Rechazar
				</button>
			</div>
		</div>
	</div>
</template>

