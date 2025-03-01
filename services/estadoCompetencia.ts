export const getEstados = async (idPostulante: number, idCompetencia: number) => {
    const { $api } = useNuxtApp();
    const estadoCompetenciaStore = useEstadoCompetenciaStore();

	try{
		const listaEstados = await $api.estado.getListarEstado(idPostulante, {lazy: true,})
	   
	if(listaEstados.error.value){
	 const bodyError = listaEstados.error.value.data;
	 throw new Error(bodyError ? "nodata" : "other");
	}

	listaEstados.data.value?.data.length && estadoCompetenciaStore.setLista(listaEstados.data.value.data);
	}catch(e: any){
	   if(e.message == 'nodata'){
		const request = {
            idCompetencia,
            idPostulante,
            estado: "i"
        };

		await $api.cambiarEstado.registrarEstado(request, {lazy: true});
        console.log('se registro nuevo estado');
	   }
	}
};

export const ListarEstado = async(idPostulante: number) => {
	const { $api } = useNuxtApp();
    const estadoCompetenciaStore = useEstadoCompetenciaStore();

	const listaEstados = await $api.estado.getListarEstado(idPostulante, {lazy: true,})
	listaEstados.data.value?.data.length && estadoCompetenciaStore.setLista(listaEstados.data.value.data);
}

export const RegistrarEstado = async(idPostulante: number, idCompetencia: number) => {
	const { $api } = useNuxtApp();
	const request = {
		idCompetencia,
		idPostulante,
		estado: "i"
	};

	await $api.cambiarEstado.registrarEstado(request, {lazy: true});
	await ListarEstado(idPostulante);
	console.log('se registro nuevo estado');
}

export const FinalizarCompetencia = async(pasosFinales = true) => {
	const { $api } = useNuxtApp();
	const postulanteStore = usePostulanteStore();
	const competenciaStore = useCompetenciaStore();

	const request = {
		idCompetencia: competenciaStore.competenciaSeleccionada?.id_compentencia ?? 0,
		idPostulante: postulanteStore.data?.idPostulante ?? 0,
		estado: "f"
	};

	await $api.cambiarEstado.actualizarEstado(request, {lazy: true,})
	if(pasosFinales){
		competenciaStore.llegoAlFinal = true;
		competenciaStore.finalizoCompetencia = true;
	}
}