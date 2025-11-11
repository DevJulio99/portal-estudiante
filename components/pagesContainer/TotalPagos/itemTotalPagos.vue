<script setup lang="ts">
import BaseTable from '~/components/base/BaseTable.vue';
import type { PagosPendientesData } from '~/types/pagos.types';
import { useMsgPopUpStore } from '~/stores/msgPopup';

useHead({
  title: "Gestión de Pagos",
});

const tokenStore = useTokenStore();
const { $api } = useNuxtApp();
const msgPopupStore = useMsgPopUpStore();
const servicesError: Ref<any> = ref(null);
const listaPagosPendientes = ref<PagosPendientesData[]>([]);
const popupDetalleData = ref();
const popupDetalleVisible = ref(false);
const modalRechazoVisible = ref(false);
const modalConfirmarAprobacionVisible = ref(false);
const modalComprobanteVisible = ref(false);
const pagoSeleccionado = ref<PagosPendientesData | null>(null);
const comprobanteSeleccionado = ref<string | null>(null);
const isMediumScreen = useMediaQuery("(min-width: 768px)");
const pagoStore = usePagoStore();

// Tabs
const activeTab = ref<'todos' | 'en-revision'>('todos');
const listaPagosEnRevision = ref<PagosPendientesData[]>([]);
const loadingRevision = ref(false);

const columns = [
	{ key: 'documentoPago', label: 'N° DOCUMENTO' },
	{ key: 'nombreAlumno', label: 'ALUMNO' },
	{ key: 'fechaVencimiento', label: 'F. VENCIMIENTO' },
	{ key: 'periodo', label: 'PERIODO' },
	{ key: 'saldo', label: 'SALDO' },
	{ key: 'mora', label: 'MORA' },
	{ key: 'totalAPagar', label: 'TOTAL A PAGAR' },
	{ key: 'estado', label: 'ESTADO' },
	{ key: 'detalle', label: 'DETALLE', isAction: true }
];

const columnsRevision = [
	{ key: 'documentoPago', label: 'N° DOCUMENTO' },
	{ key: 'nombreAlumno', label: 'ALUMNO' },
	{ key: 'fechaVencimiento', label: 'F. VENCIMIENTO' },
	{ key: 'totalAPagar', label: 'TOTAL A PAGAR' },
	{ key: 'fechaSubidaComprobante', label: 'F. SUBIDA' },
	{ key: 'acciones', label: 'ACCIONES', isAction: true }
];

const paginationData = computed(() => ({
	total: pagoStore.total,
	currentPage: pagoStore.paginado.pagina,
	itemsPerPage: pagoStore.paginado.itemsPorPagina
}));

const showPopup = (datos: object) => {
	popupDetalleData.value = datos;
	popupDetalleVisible.value = true;
};

const hidePopup = () => {
	popupDetalleVisible.value = false;
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.remove('overflow-hidden');
};

const dateIsExpired = (strFechaDoc: string) => {
	const partesFecha = strFechaDoc.split('/');
	const dia = parseInt(partesFecha[0], 10);
	const mes = parseInt(partesFecha[1], 10) - 1;
	const anio = parseInt(partesFecha[2], 10);
	const fechaDocumento = new Date(anio, mes, dia);
	const fechaActual = new Date();
	return fechaDocumento < fechaActual;
};

const handlePage = (number: number) => {
	if(pagoStore.paginado.pagina !== number){
		pagoStore.paginado.pagina = number;
	    pagoStore.listarPagos();
	}
};

// Cargar pagos en revisión
const cargarPagosEnRevision = async () => {
	loadingRevision.value = true;
	try {
		// La función SQL obtiene automáticamente el codigo_sede del contexto del tenant
		const { data, error } = await $api.pagos.getPagosEnRevision();
		
		if (data.value?.data?.length) {
			listaPagosEnRevision.value = data.value.data;
		} else {
			listaPagosEnRevision.value = [];
		}
		
		if (error.value) {
			msgPopupStore.showError((error.value.data as any)?.message || 'Error al cargar pagos en revisión');
		}
	} catch (err) {
		console.error('Error al cargar pagos en revisión:', err);
		msgPopupStore.showError('Error al cargar pagos en revisión');
	} finally {
		loadingRevision.value = false;
	}
};

// Aprobar o rechazar pago
const procesarPago = async (pago: PagosPendientesData, estado: 'Aprobado' | 'Rechazado', observaciones?: string) => {
	try {
		// Obtener ID del usuario del token
		const tokenData = tokenStore.getDataToken;
		const idUsuario = parseInt(tokenData?.Id || '0');
		if (idUsuario === 0) {
			msgPopupStore.showError('No se pudo obtener el ID del usuario. Por favor, contacte al administrador.');
			return;
		}

		const request = {
			idPago: pago.idPago,
			idUsuarioAprobador: idUsuario,
			estado: estado,
			observaciones: observaciones || null
		};
		
		const { data, error } = await $api.aprobarPago.aprobarPago(request);
		
		if (data.value?.success) {
			msgPopupStore.showSuccess(data.value.message || 'Pago procesado correctamente');
			// Recargar lista según el tab activo
			if (activeTab.value === 'en-revision') {
				await cargarPagosEnRevision();
			} else {
				pagoStore.listarPagos();
			}
		} else if (error.value) {
			msgPopupStore.showError((error.value.data as any)?.message || 'Error al procesar el pago');
		}
	} catch (err) {
		console.error('Error al procesar pago:', err);
		msgPopupStore.showError('Error al procesar el pago');
	}
};

const mostrarModalConfirmarAprobacion = (pago: PagosPendientesData) => {
	pagoSeleccionado.value = pago;
	modalConfirmarAprobacionVisible.value = true;
};

const confirmarAprobacion = () => {
	if (pagoSeleccionado.value) {
		procesarPago(pagoSeleccionado.value, 'Aprobado');
		modalConfirmarAprobacionVisible.value = false;
		pagoSeleccionado.value = null;
	}
};

const mostrarModalRechazo = (pago: PagosPendientesData) => {
	pagoSeleccionado.value = pago;
	modalRechazoVisible.value = true;
};

const rechazarPago = (observaciones: string) => {
	if (pagoSeleccionado.value) {
		procesarPago(pagoSeleccionado.value, 'Rechazado', observaciones);
		modalRechazoVisible.value = false;
		pagoSeleccionado.value = null;
	}
};

const verComprobante = (imagen: string | null) => {
	if (imagen) {
		comprobanteSeleccionado.value = imagen;
		modalComprobanteVisible.value = true;
	}
};

const cerrarModalComprobante = () => {
	modalComprobanteVisible.value = false;
	comprobanteSeleccionado.value = null;
};

// Watch para cargar pagos en revisión cuando se cambia de tab
watch(activeTab, (newTab) => {
	if (newTab === 'en-revision' && listaPagosEnRevision.value.length === 0) {
		cargarPagosEnRevision();
	}
});
</script>

<template>
  <!-- Tabs para filtrar -->
  <div class="flex gap-4 mb-4 border-b">
    <button
      @click="activeTab = 'todos'"
      :class="{
        'border-b-2 border-blue-600 text-blue-600': activeTab === 'todos',
        'text-gray-600': activeTab !== 'todos'
      }"
      class="px-4 py-2 font-semibold transition-colors"
    >
      Todos los Pagos
    </button>
    <button
      @click="activeTab = 'en-revision'"
      :class="{
        'border-b-2 border-blue-600 text-blue-600': activeTab === 'en-revision',
        'text-gray-600': activeTab !== 'en-revision'
      }"
      class="px-4 py-2 font-semibold transition-colors relative"
    >
      Pagos en Revisión
      <span 
        v-if="listaPagosEnRevision.length > 0"
        class="ml-2 bg-yellow-500 text-white rounded-full px-2 py-0.5 text-xs"
      >
        {{ listaPagosEnRevision.length }}
      </span>
    </button>
  </div>

  <!-- Tabla de pagos en revisión -->
  <div v-if="activeTab === 'en-revision'">
    <div v-if="loadingRevision" class="w-full h-[200px] flex justify-center">
      <BaseStatusLoading />
    </div>
    
    <div v-else-if="listaPagosEnRevision.length === 0" class="text-center py-10">
      <p class="text-gray-500">No hay pagos pendientes de revisión</p>
    </div>
    
    <BaseTable
      v-else
      :columns="columnsRevision"
      :data="listaPagosEnRevision"
      :loading="false"
      :show-pagination="false"
      :show-info-action="false"
      :show-edit-action="false"
      :show-delete-action="false"
      row-key="idPago"
    >
      <template #cell-documentoPago="{ item }">
        {{ item.documentoPago || '-' }}
      </template>

      <template #cell-nombreAlumno="{ item }">
        {{ item.nombreAlumno || '-' }}
      </template>

      <template #cell-fechaVencimiento="{ item }">
        {{ useDateFormat(item.fechaVencimiento, 'DD/MM/YYYY', { locales: 'es-ES' }) }}
      </template>

      <template #cell-totalAPagar="{ item }">
        <strong>S/ {{ item.totalAPagar.toFixed(2) }}</strong>
      </template>

      <template #cell-fechaSubidaComprobante="{ item }">
        <span v-if="item.fechaSubidaComprobante" class="text-sm">
          {{ useDateFormat(item.fechaSubidaComprobante, 'DD/MM/YYYY HH:mm', { locales: 'es-ES' }) }}
        </span>
        <span v-else class="text-gray-400 text-sm">-</span>
      </template>

      <template #custom-actions="{ item }">
        <div class="flex gap-[9px] items-center justify-center">
          <button
            v-if="item.imagen"
            class="btn-action"
            @click="verComprobante(item.imagen)"
            title="Ver comprobante"
          >
            <nuxt-icon name="iconEye" class="action-icon" />
          </button>
          <button
            class="btn-action btn-edit"
            @click="mostrarModalConfirmarAprobacion(item)"
            title="Aprobar pago"
          >
            <nuxt-icon name="circle-check" class="action-icon" />
          </button>
          <button
            class="btn-action btn-delete"
            @click="mostrarModalRechazo(item)"
            title="Rechazar pago"
          >
            <nuxt-icon name="circle-x-mark" class="action-icon" />
          </button>
        </div>
      </template>
    </BaseTable>
  </div>

  <!-- Tabla de todos los pagos -->
  <div v-else>
    <div
      v-if="pagoStore.pending"
      class="w-full h-[200px] md:h-[350px] flex justify-center"
    >
      <BaseStatusLoading />
    </div>
  <!-- <div
    v-else-if="errorPagos"
    class="flex items-center justify-center h-[240px] md:h-[380px]"
  >
    <BaseStatusError
      :text="'Lo sentimos, no pudimos cargar tus Obligaciones por pagar'"
      :description="'Inténtalo de nuevo más tarde'"
      :icono="null"
    />
  </div> -->
  <div
    v-else-if="servicesError"
    class="flex items-center justify-center h-[240px] md:h-[380px]"
  >
    <BaseStatusNoData
      :text="
        servicesError?.titulo ??
        'Estamos trabajando en el detalle de este contenido'
      "
      :description="servicesError?.descripcion"
      :icono="servicesError?.icono"
    />
  </div>
  <div v-if="!pagoStore.pending && !pagoStore.lista.length" class="w-full py-10 text-xl font-bold text-center">No se encontro datos</div>
  
  <BaseTable
		v-if="!pagoStore.pending"
		:columns="columns"
		:data="pagoStore.lista"
		:loading="false"
		:show-pagination="pagoStore.lista.length > 0"
		:pagination-data="paginationData"
		:show-info-action="false"
		:show-edit-action="false"
		:show-delete-action="false"
		row-key="idPago"
		@page-change="handlePage"
	>
		<template #cell-documentoPago="{ item }">
			{{ item.documentoPago != '' ? item.documentoPago : '-' }}
		</template>

		<template #cell-nombreAlumno="{ item }">
			{{ item.nombreAlumno || '-' }}
		</template>

		<template #cell-fechaVencimiento="{ item }">
			<span
				:class="{
					'text-red-600 font-semibold': dateIsExpired(item.fechaVencimiento),
				}"
			>
				{{ useDateFormat(item.fechaVencimiento, 'DD/MM/YYYY', { locales: 'es-ES' }) }}
			</span>
		</template>

		<template #cell-periodo="{ item }">
			{{ item.ciclo }}
		</template>

		<template #cell-saldo="{ item }">
			S/ {{ (item.totalAPagar - item.mora).toFixed(2) }}
		</template>

		<template #cell-mora="{ item }">
			S/ {{ item.mora.toFixed(2) }}
		</template>

		<template #cell-totalAPagar="{ item }">
			<strong>S/ {{ item.totalAPagar.toFixed(2) }}</strong>
		</template>

		<template #cell-estado="{ item }">
			<div class="flex justify-center">
				{{ item.estado || 'Pendiente' }}
			</div>
		</template>

		<template #custom-actions="{ item }">
			<div class="flex gap-[9px] items-center justify-center">
				<nuxt-icon
					name="iconEye"
					filled
					class="text-[21px] cursor-pointer"
					@click="
						showPopup({
							...item,
							isExpired: dateIsExpired(item.fechaVencimiento),
						})
					"
				/>
			</div>
		</template>
	</BaseTable>
  </div>

  <!-- Modal de comprobante -->
  <div
    v-if="modalComprobanteVisible && comprobanteSeleccionado"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="cerrarModalComprobante"
  >
    <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Comprobante de Pago</h3>
        <button
          @click="cerrarModalComprobante"
          class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>
      <div class="flex justify-center">
        <img
          :src="comprobanteSeleccionado"
          alt="Comprobante de pago"
          class="max-w-full h-auto rounded border border-gray-300"
        />
      </div>
    </div>
  </div>

  <!-- Modal de confirmación de aprobación -->
  <PagesContainerPagosModalConfirmarAprobacion
    v-if="modalConfirmarAprobacionVisible && pagoSeleccionado"
    :pago="pagoSeleccionado"
    @confirmar="confirmarAprobacion"
    @cerrar="() => { modalConfirmarAprobacionVisible = false; pagoSeleccionado = null; }"
  />

  <!-- Modal de rechazo -->
  <PagesContainerPagosModalRechazo
    v-if="modalRechazoVisible && pagoSeleccionado"
    :pago="pagoSeleccionado"
    @rechazar="rechazarPago"
    @cerrar="() => { modalRechazoVisible = false; pagoSeleccionado = null; }"
  />

  <PagesContainerPagosPopupPaymentDetail
    v-if="popupDetalleVisible"
    :data="popupDetalleData"
    :closePopup="hidePopup"
  />
</template>

<style scoped>
.btn-action {
  background: #F4F4F4;
  border: 1px solid #D1D1D1;
  border-radius: 4px;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  position: relative;
}

.btn-action:hover {
  background: #E0E0E0;
  transform: scale(1.05);
}

.btn-edit {
  background: #F4F4F4;
  border-color: #D1D1D1;
}

.btn-edit:hover {
  background: #E0E0E0;
}

.btn-delete {
  background: #F4F4F4;
  border-color: #D1D1D1;
}

.btn-delete:hover {
  background: #E0E0E0;
}

.action-icon {
  height: 16px;
  transition: color 0.2s ease;
  display: block;
  margin: 0;
  flex-shrink: 0;
  line-height: 1;
}

.btn-action .action-icon {
  color: #031448;
}

.btn-edit .action-icon {
  color: #287f6b;
}

.btn-delete .action-icon {
  color: #dc3545;
}

@media (max-width: 600px) {
  .btn-action {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
    padding: 0;
  }
  
  .action-icon {
    width: 14px;
    height: 14px;
  }
}

.btn-action:focus {
  outline: 2px solid #287F6B;
  outline-offset: 2px;
}
</style>