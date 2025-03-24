<script setup lang="ts">
import type { Alumno } from '~/types/alumno.types';
import ModalAlumno from './ModalAlumno.vue';
import AccionesAlumno from './AccionesAlumno.vue';

const servicesError: Ref<any> = ref(null);
const listaAlumnos = ref<Alumno[]>([]);
const popupDetalleData = ref<Alumno | null>(null);
const popupDetalleVisible = ref(false);
const tipoModal = ref<'edit' | 'info' | 'register' | 'delete'>('info');
const currentPage = ref(1);
const valorFilter = ref('');
const alumnoStore = useAlumnoStore();

watch(() => alumnoStore.lista, (response) => {
  console.log('alumno data', response);
  if(!response.length){
	popupDetalleVisible.value = false;
  }
  listaAlumnos.value = response;
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
  <!-- <div
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
  </div> -->
  <div
		v-if="!alumnoStore.pending"
		class="w-full"
	>
    <AccionesAlumno :onRegister="registrar" :on-filter="onFilter" :clear-filter="limpiarFiltro"/>
		<div
			class="w-full"
		>
			<div class="box-table overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border border-b-disable border-x-0 border-t-0">
							<th class="min-w-[120px]">NOMBRES</th>
							<th class="min-w-[120px]">APELLIDOS</th>
							<th class="min-w-[120px]">TELEFONO</th>
							<th class="min-w-[120px]">EMAIL</th>
							<th class="min-w-[120px]">GÉNERO</th>
							<th class="min-w-[120px]">ACCIONES</th>
						</tr>
					</thead>
					<tbody class="relative">
						
						
						<tr v-if="alumnoStore.pendingTable || !alumnoStore.lista.length">
                             <td v-if="alumnoStore.pendingTable" colspan="6"><BaseStatusLoading class="w-full py-10" /></td>
							 <td v-else-if="!alumnoStore.lista.length" colspan="6"><div class="w-full py-10 text-xl font-bold">No se encontro datos</div></td>
						</tr>
						<tr v-for="(item, index) in listaAlumnos" :key="index">
							<td>{{ item.nombre }}</td>
                            <td>{{ item.apellidoPaterno }} {{ item.apellidoMaterno }}</td>
                            <td>{{ item.telefono }}</td>
                            <td>{{ item.correo }}</td>
                            <td>{{ item.genero }}</td>
                            <td class="flex justify-center items-center gap-2">
                                <button class="px-2 py-2 text-primary font-bold bg-transparent border border-[#287F6B] rounded hover:bg-[#287F6B]/10" @click="() => masInformacion(item)">Info</button>
                                <button class="px-2 py-2 text-white font-bold bg-primary hover:bg-[#1E6657] rounded" @click="() => actualizar(item)">Actualizar</button>
                                <button class="px-2 py-2 text-secondary font-bold bg-transparent border border-secondary hover:bg-secondary/10 rounded" @click="() => eliminar(item)">Eliminar</button>
                            </td>
							
						</tr>
					</tbody>
				</table>

				<BasePagination
				 class="my-3"
				 v-if="listaAlumnos.length"
                 :totalItems="alumnoStore.total"
                 :currentPage="alumnoStore.paginado.pagina"
                 :items-per-page="alumnoStore.paginado.itemsPorPagina"
                 @change="handlePage"
                 />
			</div>
		</div>
	</div>
  <ModalAlumno
		v-if="popupDetalleVisible"
        :type="tipoModal"
        :data="popupDetalleData"
		:onClose="hidePopup"
	/>
</template>
<style lang="postcss" scoped>
.box-table {
	font-family: arial, sans-serif;
	border-collapse: collapse;
	width: 100%;
}

tr:nth-child(odd),
tr:nth-child(odd) td {
	background-color: white;
}

tr:nth-child(even),
tr:nth-child(even) td {
	background-color: #f6f6f6;
}

th {
	font-family: 'grotesk';
	padding-top: 1rem;
	padding-bottom: 1rem;
	color: white;
	background-color: #031448;
	font-weight: 600;
	font-size: 16px;
}

th:last-child {
	color: #031448;
	background-color: #D1E8D3;
}

td {
	@apply lg:py-6 py-4 px-2 text-center font-nunito text-sm;
}

.box-table::-webkit-scrollbar {
	height: 8px;
}

.box-table::-webkit-scrollbar-thumb {
	background-color: rgb(151, 151, 151);
}

.box-table::-webkit-scrollbar-track {
	background-color: white;
}

@media (max-width: 600px) {
	th {
		font-size: 14px;
	}

	td {
		font-size: 12px;
	}
}
</style>