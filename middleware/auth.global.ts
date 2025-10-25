import dataMenuUser from "~/utils/data/dataMenuUser.json";
import dataMenuAdmin from "~/utils/data/dataMenuAdmin.json";
import { Roles } from "~/types/roles.types";
import { getProfile } from "~/services/profile";

export default defineNuxtRouteMiddleware(async (to) => {
    const tokenStore = useTokenStore();
    const profileStore = useProfileStore();

    // console.log('refreshToken',tokenStore.refreshToken)

    const isAuth = tokenStore.accessToken.trim().length && tokenStore.refreshToken.trim().length;
    const isEvaluaciones = to.fullPath.includes('evaluaciones');
    const detalleEvaluacion = to.fullPath.split('/');

    // Si el usuario no está autenticado Y la ruta no es /login, redirigimos a /login.
    // Añadimos una comprobación para no hacer nada si se está cerrando la sesión.
    if(!isAuth && to.name !== 'login' && !tokenStore.isLoggingOut){
        return navigateTo("/login", { replace: true });
    }
    
    // --- INICIO: Lógica que solo se ejecuta si el usuario está autenticado ---
    if (isAuth) {
        const examenStore = useExamenStore();
        const postulanteStore = usePostulanteStore();
        const competenciaStore = useCompetenciaStore();
        const resultadoCompetenciaStore = useResultadoCompetenciaStore();
        // Usamos optional chaining (?.) para evitar errores si getDataToken o Role no existen.
        const isAdmin = tokenStore.getDataToken?.Role?.toLowerCase() === Roles.Admin;
        const isTotalPagos = to.fullPath.includes('total-pagos');
        const rutasUsuario = getUrls(dataMenuUser);
        const rutasAdmin = getUrls(dataMenuAdmin);
        const rutasCompartidas = ["/documentos"];
        const isResultadoCompetencia = to.fullPath.includes('resultado-competencias/detalle');

        if(isTotalPagos && !isAdmin){
            return navigateTo("/inicio", { replace: true });
        }

        if(isAdmin && rutasUsuario.includes(to.fullPath) && !rutasCompartidas.includes(to.fullPath)){
            return navigateTo("/admin", { replace: true });
        }

        if(!isAdmin && rutasAdmin.includes(to.fullPath) && !rutasCompartidas.includes(to.fullPath)){
            return navigateTo("/inicio", { replace: true });
        }

        if(isResultadoCompetencia && (!postulanteStore.data || !resultadoCompetenciaStore.competenciaSeleccionada)){
            return navigateTo("/resultado-competencias", { replace: true });
        }

        if(isEvaluaciones && detalleEvaluacion.length === 3){
            const detalleId = detalleEvaluacion[2].trim().length > 0;
            if (!detalleId) return;
            if(!competenciaStore.competenciaSeleccionada){
                return navigateTo("/evaluaciones", { replace: true });
            }
        }

        if(!isEvaluaciones){
            examenStore.resetExamen();
            postulanteStore.setHabilitado(0);
            competenciaStore.resetCompetencia();
        }
        
        if (!to.fullPath.includes('resultado-competencias/detalle')) {
            resultadoCompetenciaStore.resetCompetencia();
        }
    }
    // --- FIN: Lógica de usuario autenticado ---

});