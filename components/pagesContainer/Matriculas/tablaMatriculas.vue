<script setup lang="ts">
import type { ResponseMatricula } from '~/types/matricula.types';
import type { Alumno } from '~/types/alumno.types';
import ModalMatricula from './ModalMatricula.vue';
import AccionesMatricula from './AccionesMatricula.vue';

const listaMatriculas = ref<ResponseMatricula[]>([]);
const popupDetalleData = ref<ResponseMatricula | null>(null);
const popupDetalleVisible = ref(false);
const tipoModal = ref<'edit' | 'info' | 'register' | 'delete'>('info');
const currentPage = ref(1);
const valorFilter = ref('');
const matriculaStore = useMatriculaStore();
const alumnoStore = useAlumnoStore();

watch(() => matriculaStore.lista, (response) => {
  if(!response.length){
	popupDetalleVisible.value = false;
  }
  listaMatriculas.value = response;
});

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
  <div v-if="!matriculaStore.pending" class="w-full">
    <AccionesMatricula :onRegister="registrar" :on-filter="onFilter" :clear-filter="limpiarFiltro"/>
    <div v-if="valorFilter && alumnoStore.lista.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
     <div v-else-if="valorFilter && !alumnoStore.lista.length && !alumnoStore.pendingTable" class="w-full py-10 text-xl font-bold text-center">
        No se encontraron alumnos para matricular.
    </div>
		<div class="w-full">
			<div class="box-table overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border border-b-disable border-x-0 border-t-0">
							<th class="min-w-[120px]">ALUMNO</th>
							<th class="min-w-[120px]">GRADO</th>
							<th class="min-w-[120px]">PERIODO</th>
							<th class="min-w-[120px]">ESTADO</th>
							<th class="min-w-[120px]">ACCIONES</th>
						</tr>
					</thead>
					<tbody class="relative">
						<tr v-if="matriculaStore.pendingTable || !matriculaStore.lista.length">
                             <td v-if="matriculaStore.pendingTable" colspan="5"><BaseStatusLoading class="w-full py-10" /></td>
							 <td v-else-if="!matriculaStore.lista.length" colspan="5"><div class="w-full py-10 text-xl font-bold">No se encontraron datos</div></td>
						</tr>
						<tr v-for="(item, index) in listaMatriculas" :key="index">
							<td>{{ item.nombreAlumno }} {{ item.apellidoPaterno }}</td>
                            <td>{{ item.descripcionGrado }}</td>
                            <td>{{ useDateFormat(item.fechaMatricula, 'DD/MM/YYYY').value }}</td>
                            <td>
                                <span :class="item.activo ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                                    {{ item.activo ? 'Activa' : 'Inactiva' }}
                                </span>
                            </td>
                            <td class="flex justify-center items-center gap-2">
                                <button class="px-2 py-2 text-white font-bold bg-primary hover:bg-[#1E6657] rounded" @click="() => actualizar(item)">Actualizar</button>
                            </td>
						</tr>
					</tbody>
				</table>

				<!-- <BasePagination
				 class="my-3"
				 v-if="listaMatriculas.length"
                 :totalItems="matriculaStore.total"
                 :currentPage="matriculaStore.paginado.pagina"
                 :items-per-page="matriculaStore.paginado.itemsPorPagina"
                 @change="handlePage"
                 /> -->
			</div>
		</div>
	</div>
  <ModalMatricula
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
tr:nth-child(odd) { background-color: white; }
tr:nth-child(even) { background-color: #f6f6f6; }
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
td { @apply lg:py-6 py-4 px-2 text-center font-nunito text-sm; }
</style>