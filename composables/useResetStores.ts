/**
 * Composable para resetear todos los stores de la aplicación a su estado inicial.
 * Es útil para procesos como el cierre de sesión.
 */
export const useResetStores = () => {
  useProfileStore().$reset();
  usePagoStore().$reset();
  useExamenStore().$reset();
  usePostulanteStore().$reset();
  useCompetenciaStore().$reset();
  useResultadoCompetenciaStore().$reset();
  // Añade aquí cualquier otro store que necesite ser reseteado
};