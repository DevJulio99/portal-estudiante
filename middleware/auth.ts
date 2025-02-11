export default defineNuxtRouteMiddleware(async (to) => {
    const tokenStore = useTokenStore();
    const examenStore = useExamenStore();
    const postulanteStore = usePostulanteStore();
    const competenciaStore = useCompetenciaStore();

    // console.log('accessToken',tokenStore.accessToken)
    // console.log('refreshToken',tokenStore.refreshToken)

    const isAuth = tokenStore.accessToken.trim().length && tokenStore.refreshToken.trim().length;
    const isEvaluaciones = to.fullPath.includes('evaluaciones');
    const detalleEvaluacion = to.fullPath.split('/');

    if(!isAuth){
        return navigateTo("/login", { replace: true });
    }

    if(!isEvaluaciones){
      //console.log('limpiar data de evaluaciones');
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
      //console.log('competenciaStore.competenciaActual auth', competenciaStore.competenciaSeleccionada);
    }
});