import { defineStore } from 'pinia';
import type { Curso } from '~/types/cursos.types';

export const useCursosAlumnoStore = defineStore('cursos', {
    state: () => ({
        cursosColegio: [] as Curso[],
        pending: false,
        error: null as any,
    }),
    getters: {
        listaCursos: (state) => state.cursosColegio,
    },
    actions: {
        async fetchCursosColegio(force = false) {
            if (this.cursosColegio.length > 0 && !force) {
                return;
            }

            const tokenStore = useTokenStore();
            const alumnoId = tokenStore.getDataToken?.Id_Alumno;
            if (!alumnoId) {
                console.warn("ID de Alumno no encontrado para cargar cursos.");
                return;
            }

            const { $api } = useNuxtApp();
            this.pending = true;
            this.error = null;
            try {
                const { data: responseData, error: apiError } = await $api.cursos.getCursosColegio(parseInt(alumnoId), 0, '');
                if (apiError.value) throw apiError.value;
                console.log('responseData.value?.data:', responseData.value?.data);
                this.cursosColegio = responseData.value?.data || [];
            } catch (err) {
                console.error("Error al cargar los cursos desde el store:", err);
                this.cursosColegio = [];
                this.error = err;
            } finally {
                this.pending = false;
            }
        }
    }
});