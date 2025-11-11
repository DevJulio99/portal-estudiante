<script setup lang="ts">
import type { PagosPendientesData } from '~/types/pagos.types';

interface Props {
	pago: PagosPendientesData;
}

interface Emits {
	(e: 'confirmar'): void;
	(e: 'cerrar'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const confirmar = () => {
	emit('confirmar');
	emit('cerrar');
};

const cerrar = () => {
	emit('cerrar');
};
</script>

<template>
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="cerrar">
		<div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
			<h3 class="text-lg font-bold mb-4">Confirmar Aprobación de Pago</h3>
			<p class="mb-2 text-sm">
				<strong>Documento:</strong> {{ pago.documentoPago || '-' }}
			</p>
			<p class="mb-2 text-sm">
				<strong>Monto:</strong> S/ {{ pago.totalAPagar.toFixed(2) }}
			</p>
			<p class="mb-4 text-sm text-gray-600">
				¿Está seguro de que desea aprobar este pago?
			</p>
			
			<div class="flex gap-2 mt-4 justify-end">
				<button
					@click="cerrar"
					class="px-4 py-2 border bg-gray-300 rounded hover:bg-gray-400 text-sm font-semibold"
				>
					Cancelar
				</button>
				<button
					@click="confirmar"
					class="px-4 py-2 bg-[#287F6B] text-white rounded hover:bg-[#1E6657] text-sm font-semibold"
				>
					Confirmar
				</button>
			</div>
		</div>
	</div>
</template>

