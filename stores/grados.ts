import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import type { Grado } from '~/types/grado.types';

interface gradosStoreStatus {
    listaGrados: Grado[];
    pending: boolean;
    error: {
        status: boolean;
        message: string;
    };
}

export const useGradoStore = defineStore('gradoStore', {
    state: (): gradosStoreStatus => ({
        listaGrados: [],
        pending: true,
        error: {
            status: false,
            message: '',
        },
    }),
    actions: {
        setListaGrados(data: Grado[]) {
            this.listaGrados = data;
        },
        resetGrados() {
            this.listaGrados = [];
            this.pending = true;
            this.error = {
                status: false,
                message: ''
            };
        },
        async getGrados() {
            const { $api } = useNuxtApp();
            this.pending = true;

            try {
                const response = await $api.grados.getGrados();
                
                if (!response.error.value && response.data.value?.data.length) {
                    this.setListaGrados(response.data.value.data);
                } else {
                    this.error = {
                        status: true,
                        message: 'Error al cargar los grados.',
                    };
                }
            } catch (error) {
                this.error = {
                    status: true,
                    message: 'Error al contactar con el servidor.',
                };
            } finally {
                this.pending = false;
            }
        },
    },
});
