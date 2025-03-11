import dataMenuUser from "~/utils/data/dataMenuUser.json";
import dataMenuAdmin from "~/utils/data/dataMenuAdmin.json";

export default defineNuxtRouteMiddleware(async (to) => {
    const tokenStore = useTokenStore();
    const examenStore = useExamenStore();
    const postulanteStore = usePostulanteStore();
    const competenciaStore = useCompetenciaStore();
    const resultadoCompetenciaStore = useResultadoCompetenciaStore();

    // console.log('refreshToken',tokenStore.refreshToken)

    const isAuth = tokenStore.accessToken.trim().length && tokenStore.refreshToken.trim().length;
    const isEvaluaciones = to.fullPath.includes('evaluaciones');
    const detalleEvaluacion = to.fullPath.split('/');
    const isResultadoCompetencia = to.fullPath.includes('resultado-competencias/detalle');
    const isAdmin = tokenStore.getDataToken.Role == "admin";
    const isTotalPagos = to.fullPath.includes('total-pagos');
    const rutasUsuario = getUrls(dataMenuUser);
    const rutasAdmin = getUrls(dataMenuAdmin);
    const rutasCompartidas = ["/documentos"];

    if(!isAuth){
        return navigateTo("/login", { replace: true });
    }

    if(isTotalPagos && !isAdmin){
      return navigateTo("/inicio", { replace: true });
    }

    if(isAdmin && rutasUsuario.includes(to.fullPath) && !rutasCompartidas.includes(to.fullPath)){
      return navigateTo("/admin", { replace: true });
    }

    if(!isAdmin && rutasAdmin.includes(to.fullPath) && !rutasCompartidas.includes(to.fullPath)){
      return navigateTo("/inicio", { replace: true });
    }

    if(!isEvaluaciones){
      examenStore.resetExamen();
      postulanteStore.setHabilitado(0);
      competenciaStore.resetCompetencia();
    }

    if(isEvaluaciones && detalleEvaluacion.length === 3){
      const detalleId = detalleEvaluacion[2].trim().length > 0;
      if (!detalleId) return
      if(!competenciaStore.competenciaSeleccionada){
        return navigateTo("/evaluaciones", { replace: true });
      }
    }

    console.log('postulanteStore.data', postulanteStore.data);
    console.log('resultadoCompetenciaStore.competenciaSeleccionada', resultadoCompetenciaStore.competenciaSeleccionada);

    if(isResultadoCompetencia && (!postulanteStore.data || !resultadoCompetenciaStore.competenciaSeleccionada)){
      return navigateTo("/resultado-competencias", { replace: true });
    }

    if(!isResultadoCompetencia){
      resultadoCompetenciaStore.resetCompetencia();
      postulanteStore.setHabilitado(0);
    }

});