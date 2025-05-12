import { defineStore } from 'pinia';
export const useImageLoaderStore = defineStore('useImageLoader', {
    state: () => ({
        enabledButton: true,
        simulateClick: false,
    }),
    actions: {
       handleSimulateClick() {
        this.simulateClick = true;
        setTimeout(() => {
            this.simulateClick = false;
        }, 0);
       }
    },
});
