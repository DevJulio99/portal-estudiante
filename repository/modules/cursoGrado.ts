import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/services.types';
import type { RequestCursoGrado, ResponseCursoGrado } from '~/types/cursoGrado.types';

class CursoGradoModule extends FetchFactory<DataResponse<any>> {
    private RESOURCE = '/api/v1/matricula';

    async obtenerCursosPorGrado(
        body: RequestCursoGrado,
        asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseCursoGrado[]>>,
    ) {
        return await useAsyncData(() => {
            return this.call(
                'POST',
                `${this.RESOURCE}/cursos-por-grado`,
                body,
            );
        }, asyncDataOptions);
    }
}

export default CursoGradoModule;