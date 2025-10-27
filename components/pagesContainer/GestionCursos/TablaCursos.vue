<script setup lang="ts">
import type { Course } from '~/types/gestionCursos.types';
import ModalCurso from './ModalCurso.vue';
import AccionesCurso from './AccionesCurso.vue';
import BaseTable from '~/components/base/BaseTable.vue';

const servicesError: Ref<any> = ref(null);
const listaCursos = ref<Course[]>([]);
const popupDetalleData = ref<Course | null>(null);
const popupDetalleVisible = ref(false);
const tipoModal = ref<'edit' | 'info' | 'register' | 'delete'>('info');
const currentPage = ref(1);
const valorFilter = ref('');
const cursoStore = useCursoStore();

const columns = [
  { key: 'codigoCurso', label: 'CÓDIGO' },
  { key: 'descripcion', label: 'NOMBRE CURSO' },
  { key: 'creditos', label: 'CRÉDITOS' },
  { key: 'modalidad', label: 'MODALIDAD' },
  { key: 'nivel', label: 'NIVEL' },
  { key: 'acciones', label: 'ACCIONES', isAction: true }
];

watch(() => cursoStore.lista, (response) => {
  console.log('curso data', response);
  if(!response.length){
    popupDetalleVisible.value = false;
  }
  listaCursos.value = response;
});

const paginationData = computed(() => ({
  total: cursoStore.total,
  currentPage: cursoStore.paginado.pagina,
  itemsPerPage: cursoStore.paginado.itemsPorPagina
}));

const handlePage = (number: number) => {
  currentPage.value = number;
  if(cursoStore.paginado.pagina !== number){
    cursoStore.setPagina(number);
    if(cursoStore.activeFilter){
      cursoStore.FiltrarCurso(valorFilter.value);
    }

    if(cursoStore.activeList){
      cursoStore.getCursos();
    }
  }
};

const onFilter = (value: string) => {
	valorFilter.value = value;
	cursoStore.setPagina(1);
	cursoStore.FiltrarCurso(value);
}

const limpiarFiltro = () => {
	valorFilter.value = '';
	cursoStore.activeFilter = false;
	cursoStore.setPagina(1);
	currentPage.value = 1;
	cursoStore.getCursos();
}

const masInformacion = (datos: Course) => {
	tipoModal.value = 'info';
	popupDetalleData.value = datos;
	popupDetalleVisible.value = true;
};

const hidePopup = () => {
	cursoStore.setErrorForm([]);
    popupDetalleData.value = null;
	popupDetalleVisible.value = false;
	const body: HTMLElement | null = document.querySelector('body');
	body?.classList.remove('overflow-hidden');
};

const registrar = () => {
    tipoModal.value = 'register';
    popupDetalleVisible.value = true;
}

const actualizar = (datos: Course) => {
    tipoModal.value = 'edit';
	popupDetalleData.value = datos;
    popupDetalleVisible.value = true;
}

const eliminar = (datos: Course) => {
    tipoModal.value = 'delete';
	popupDetalleData.value = datos;
    popupDetalleVisible.value = true;
}
</script>

<template>
  <div
    v-if="cursoStore.pending"
    class="w-full h-[200px] md:h-[350px] flex justify-center"
  >
    <BaseStatusLoading />
  </div>
  
  <BaseTable
    v-else
    :columns="columns"
    :data="listaCursos"
    :loading="cursoStore.pendingTable"
    :pagination-data="paginationData"
    :show-pagination="listaCursos.length > 0"
    row-key="id"
    no-data-text="No se encontraron datos"
    @info="masInformacion"
    @edit="actualizar"
    @delete="eliminar"
    @page-change="handlePage"
  >
    <template #actions>
      <AccionesCurso 
        :onRegister="registrar" 
        :on-filter="onFilter" 
        :clear-filter="limpiarFiltro"
      />
    </template>
  </BaseTable>

  <ModalCurso
    v-if="popupDetalleVisible"
    :type="tipoModal"
    :data="popupDetalleData"
    :onClose="hidePopup"
  />
</template>
