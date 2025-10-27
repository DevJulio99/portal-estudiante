<script setup lang="ts">
import type { Alumno } from '~/types/alumno.types';
import ModalAlumno from './ModalAlumno.vue';
import AccionesAlumno from './AccionesAlumno.vue';
import BaseTable from '~/components/base/BaseTable.vue';

const servicesError: Ref<any> = ref(null);
const listaAlumnos = ref<Alumno[]>([]);
const popupDetalleData = ref<Alumno | null>(null);
const popupDetalleVisible = ref(false);
const tipoModal = ref<'edit' | 'info' | 'register' | 'delete'>('info');
const currentPage = ref(1);
const valorFilter = ref('');
const alumnoStore = useAlumnoStore();

const columns = [
  { key: 'nombre', label: 'NOMBRES' },
  { key: 'apellidos', label: 'APELLIDOS' },
  { key: 'telefono', label: 'TELEFONO' },
  { key: 'correo', label: 'EMAIL' },
  { key: 'genero', label: 'GÉNERO' },
  { key: 'acciones', label: 'ACCIONES', isAction: true }
];

watch(() => alumnoStore.lista, (response) => {
  console.log('alumno data', response);
  if(!response.length){
    popupDetalleVisible.value = false;
  }
  listaAlumnos.value = response;
});

const paginationData = computed(() => ({
  total: alumnoStore.total,
  currentPage: alumnoStore.paginado.pagina,
  itemsPerPage: alumnoStore.paginado.itemsPorPagina
}));

const tableData = computed(() => {
  return listaAlumnos.value.map(alumno => ({
    ...alumno,
    apellidos: `${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`
  }));
});

const handlePage = (number: number) => {
  currentPage.value = number;
  if(alumnoStore.paginado.pagina !== number){
    alumnoStore.setPagina(number);
    if(alumnoStore.activeFilter){
      alumnoStore.FiltrarAlumno(valorFilter.value);
    }

    if(alumnoStore.activeList){
      alumnoStore.getAlumnos();
    }
  }
};

const onFilter = (value: string) => {
	valorFilter.value = value;
	alumnoStore.setPagina(1);
	alumnoStore.FiltrarAlumno(value);
}

const limpiarFiltro = () => {
	valorFilter.value = '';
	alumnoStore.activeFilter = false;
	alumnoStore.setPagina(1);
	currentPage.value = 1;
	alumnoStore.getAlumnos();
}

const masInformacion = (datos: Alumno) => {
	tipoModal.value = 'info';
	popupDetalleData.value = datos;
	popupDetalleVisible.value = true;
};

const hidePopup = () => {
	alumnoStore.setErrorForm([]);
    popupDetalleData.value = null;
	popupDetalleVisible.value = false;
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.remove('overflow-hidden');
};

const registrar = () => {
    tipoModal.value = 'register';
    popupDetalleVisible.value = true;
}

const actualizar = (datos: Alumno) => {
    tipoModal.value = 'edit';
	popupDetalleData.value = datos;
    popupDetalleVisible.value = true;
}

const eliminar = (datos: Alumno) => {
    tipoModal.value = 'delete';
	popupDetalleData.value = datos;
    popupDetalleVisible.value = true;
}
</script>

<template>
  <div
    v-if="alumnoStore.pending"
    class="w-full h-[200px] md:h-[350px] flex justify-center"
  >
    <BaseStatusLoading />
  </div>
  
  <BaseTable
    v-else
    :columns="columns"
    :data="tableData"
    :loading="alumnoStore.pendingTable"
    :pagination-data="paginationData"
    :show-pagination="listaAlumnos.length > 0"
    row-key="id"
    no-data-text="No se encontraron datos"
    @info="masInformacion"
    @edit="actualizar"
    @delete="eliminar"
    @page-change="handlePage"
  >
    <template #actions>
      <AccionesAlumno 
        :onRegister="registrar" 
        :on-filter="onFilter" 
        :clear-filter="limpiarFiltro"
      />
    </template>
  </BaseTable>

  <ModalAlumno
    v-if="popupDetalleVisible"
    :type="tipoModal"
    :data="popupDetalleData"
    :onClose="hidePopup"
  />
</template>
