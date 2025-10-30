<script setup lang="ts">
import type { ResponseMatricula } from '~/types/matricula.types';
import type { Alumno } from '~/types/alumno.types';
import ModalMatricula from './ModalMatricula.vue';
import AccionesMatricula from './AccionesMatricula.vue';
import BaseTable from '~/components/base/BaseTable.vue';

const listaMatriculas = ref<ResponseMatricula[]>([]);
const popupDetalleData = ref<ResponseMatricula | null>(null);
const popupDetalleVisible = ref(false);
const tipoModal = ref<'edit' | 'info' | 'register' | 'delete'>('info');
const currentPage = ref(1);
const valorFilter = ref('');
const matriculaStore = useMatriculaStore();
const alumnoStore = useAlumnoStore();

const columns = [
  { key: 'alumno', label: 'ALUMNO' },
  { key: 'descripcionGrado', label: 'GRADO' },
  { key: 'fechaMatricula', label: 'PERIODO' },
  { key: 'estadoMatricula', label: 'ESTADO' },
  { key: 'acciones', label: 'ACCIONES', isAction: true }
];

watch(() => matriculaStore.lista, (response) => {
  if(!response.length){
	popupDetalleVisible.value = false;
  }
  listaMatriculas.value = response;
});

const tableData = computed(() => {
  return listaMatriculas.value.map(matricula => ({
    ...matricula,
    alumno: `${matricula.nombreAlumno} ${matricula.apellidoPaterno}`,
    fechaMatricula: useDateFormat(matricula.fechaMatricula, 'DD/MM/YYYY').value
  }));
});

const paginationData = computed(() => ({
  total: matriculaStore.total || 0,
  currentPage: currentPage.value,
  itemsPerPage: 10
}));

const handlePage = (number: number) => {
  currentPage.value = number;
//   if(matriculaStore.paginado.pagina !== number){
// 	matriculaStore.setPagina(number);
//     if(matriculaStore.activeFilter && matriculaStore.FiltrarMatricula){
// 	    matriculaStore.FiltrarMatricula(valorFilter.value);
//     }

//     if(matriculaStore.activeList){
// 	    matriculaStore.getMatriculas();
//     }
//   }
};

const onFilter = (value: string) => {
	valorFilter.value = value;
	alumnoStore.setPagina(1);
	alumnoStore.FiltrarAlumno(value);
}

const limpiarFiltro = () => {
	valorFilter.value = '';
	matriculaStore.activeFilter = false;
	//matriculaStore.setPagina(1);
	currentPage.value = 1;
	matriculaStore.getMatriculas();
	alumnoStore.lista = [];
}

const hidePopup = () => {
    popupDetalleData.value = null;
	popupDetalleVisible.value = false;
};

const registrar = () => {
    // tipoModal.value = 'register';
    // popupDetalleVisible.value = true;
}

const actualizar = (datos: ResponseMatricula) => {
    tipoModal.value = 'edit';
	popupDetalleData.value = datos;
    popupDetalleVisible.value = true;
}

const seleccionarAlumnoParaMatricula = (alumno: Alumno) => {
    tipoModal.value = 'register';
    // Creamos un objeto parcial de ResponseMatricula para pre-llenar el formulario
    popupDetalleData.value = {
        idAlumno: alumno.id_alumno,
    } as Partial<ResponseMatricula> as ResponseMatricula;
    popupDetalleVisible.value = true;
    //valorFilter.value = ''; // Limpiamos el filtro para ocultar las tarjetas
    //alumnoStore.lista = []; // Limpiamos la lista de alumnos
}
</script>

<template>
  <div v-if="matriculaStore.pending" class="w-full h-[200px] md:h-[350px] flex justify-center">
    <BaseStatusLoading />
  </div>
  
  <div v-else class="w-full">
    <AccionesMatricula :onRegister="registrar" :on-filter="onFilter" :clear-filter="limpiarFiltro"/>

    <div v-if="valorFilter && alumnoStore.lista.length > 0" class="mb-6 mt-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="alumno in alumnoStore.lista"
          :key="alumno.id_alumno"
          class="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
          @click="() => seleccionarAlumnoParaMatricula(alumno)"
        >
          <h3 class="font-bold text-primary">{{ alumno.nombre }} {{ alumno.apellidoPaterno }} {{ alumno.apellidoMaterno }}</h3>
          <p class="text-sm text-gray-600">{{ alumno.correo }}</p>
          <p class="text-sm text-gray-600">DNI: {{ alumno.dni }}</p>
        </div>
      </div>
    </div>
    
    <div v-else-if="valorFilter && !alumnoStore.lista.length && !alumnoStore.pendingTable" class="mb-6 mt-4">
      <div class="w-full py-10 text-xl font-bold text-center">
        No se encontraron alumnos para matricular.
      </div>
    </div>
    
    <BaseTable
      :columns="columns"
      :data="tableData"
      :loading="matriculaStore.pendingTable"
      :pagination-data="paginationData"
      :show-pagination="false"
      :show-info-action="false"
      :show-delete-action="false"
      row-key="idMatricula"
      no-data-text="No se encontraron datos"
      @edit="actualizar"
      @page-change="handlePage"
    >      
      <template #cell-estadoMatricula="{ value }">
        <span 
          :class="value?.toLowerCase() === 'activa' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'" 
          class="px-2 py-1 rounded-full text-xs font-medium"
        >
          {{ value }}
        </span>
      </template>
    </BaseTable>
  </div>

  <ModalMatricula
    v-if="popupDetalleVisible"
    :type="tipoModal"
    :data="popupDetalleData"
    :onClose="hidePopup"
  />
</template>
