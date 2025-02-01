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