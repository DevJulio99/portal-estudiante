import { defineStore } from 'pinia';
import type { ResponseCatpcha } from '~/types/captcha.types';

interface captchaState {
    loading: boolean;
    data: ResponseCatpcha | null;
    captchaValido: boolean;
    error: boolean;
}

export const useCaptcha = defineStore('useCaptcha', {
    state: (): captchaState => ({
        loading: true,
        data: null,
        captchaValido: false,
        error: false
    }),
    actions: {
        setData(data: ResponseCatpcha){
           this.data = {...data, captchaImage: `data:image/png;base64,${data.captchaImage}`};
        },
        async generarCaptcha(){
            this.loading = true;
            this.captchaValido = false;
            const response = await useNuxtApp().$api.captcha.generateCaptcha();

            if(response.data.value?.success){
                this.setData(response.data.value.data);
                this.loading = false;
            }
        },
        async validarCaptcha(captchaId: string, captchaCode: string){
            const { $api } = useNuxtApp();
            const formData = new FormData()
            formData.append('captchaId', captchaId)
            formData.append('captchaCode', captchaCode)
            const response = await $api.captcha.validCaptcha(formData);
           
            if(response.data.value?.success){
                this.captchaValido = true;
            }else {
                this.captchaValido = false;
                this.error = true;
                setTimeout(() => {
                    this.error = false;
                }, 0);
            }
        },
        async refrescarCaptcha(){
            this.data = null;
            this.error = false;
            this.generarCaptcha();
        }
    },
});
