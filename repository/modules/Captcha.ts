/* eslint-disable camelcase */
import { type FetchOptions } from 'ofetch';
import type { AsyncDataOptions } from '#app';
import FetchFactory from '../factory';
import type { DataResponse } from '~/types/responses.types';
import type { ResponseCatpcha, ValidarCaptcha } from '~/types/captcha.types';

class CaptchaModule extends FetchFactory<DataResponse<ResponseCatpcha>> {
    private RESOURCE = 'api/auth';

    /**
     * @param year Año académico para el que se obtendrá el calendario
     * @param asyncDataOptions Opciones para `useAsyncData`
     * @returns
     */
    async generateCaptcha(
        asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseCatpcha>>,
    ) {
        return await useAsyncData(() => {
            const fetchOptions: FetchOptions<'json'> = {
                headers: {}
            };
            return this.call(
                'GET',
                `${this.RESOURCE}/generar-captcha`,
                undefined, // body
                fetchOptions,
            );
        }, asyncDataOptions);
    }

    async validCaptcha(
        body: FormData,
        asyncDataOptions?: AsyncDataOptions<DataResponse<ResponseCatpcha>>,
    ) {
        return await useAsyncData(() => {
            const fetchOptions: FetchOptions<'json'> = {
                headers: {}
            };
            return this.call(
                'POST',
                `${this.RESOURCE}/validar-captcha`,
                body,
                fetchOptions,
            );
        }, asyncDataOptions);
    }
}

export default CaptchaModule;
