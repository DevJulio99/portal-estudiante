export const ListarEstado = async(idPostulante: number) => {
	const { $api } = useNuxtApp();
    const estadoCompetenciaStore = useEstadoCompetenciaStore();
	const competenciaStore = useCompetenciaStore();

	const idCompetencia = competenciaStore.competenciaSeleccionada?.id_compentencia;
	if (!idCompetencia) {
		console.error("ListarEstado: No se encontró id de competencia seleccionada.");
		return;
	}

	try {
		const { data: listaEstados, error } = await $api.estado.getListarEstado(idPostulante, idCompetencia, {lazy: true,});
		if (error.value) {
			throw error.value;
		}
		if (listaEstados.value?.data?.length) {
			estadoCompetenciaStore.setLista(listaEstados.value.data);
		}
	} catch (error) {
		console.error("Error al listar los estados de competencia:", error);
	}
}

export const RegistrarEstado = async(idPostulante: number, idCompetencia: number) => {
	const { $api } = useNuxtApp();

	if (!idPostulante || !idCompetencia) {
		console.error("RegistrarEstado: idPostulante o idCompetencia no son válidos.");
		return;
	}

	const request = {
		idCompetencia,
		idPostulante,
		estado: "i"
	};

	try {
		const { error } = await $api.cambiarEstado.registrarEstado(request, {lazy: true});
		if (error.value) {
			throw error.value;
		}
		await ListarEstado(idPostulante);
	} catch (error) {
		console.error("Error al registrar el estado de la competencia:", error);
	}
}

export const FinalizarCompetencia = async(pasosFinales = true) => {
	const { $api } = useNuxtApp();
	const postulanteStore = usePostulanteStore();
	const competenciaStore = useCompetenciaStore();

	const idCompetencia = competenciaStore.competenciaSeleccionada?.id_compentencia;
	const idPostulante = postulanteStore.data?.idPostulante;

	if (!idCompetencia || !idPostulante) {
		console.error("FinalizarCompetencia: No se encontró id de competencia o de postulante.");
		return;
	}

	const request = {
		idCompetencia,
		idPostulante,
		estado: "f"
	};

	try {
		const { error } = await $api.cambiarEstado.actualizarEstado(request, {lazy: true,});
		if (error.value) {
			throw error.value;
		}
		if(pasosFinales){
			competenciaStore.llegoAlFinal = true;
			competenciaStore.finalizoCompetencia = true;
		}
	} catch (error) {
		console.error("Error al finalizar la competencia:", error);
	}
}