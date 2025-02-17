import { defineStore } from 'pinia';

export const useEventFilterStore = defineStore('filterStore', {
  state: () => ({
    selectedCategory: null as string | null,  // Aquí almacenamos la categoría seleccionada
  }),
  actions: {
    setCategory(category: string | null) {
      this.selectedCategory = category;  // Método para actualizar la categoría seleccionada
    },
    clearCategory() {
      this.selectedCategory = null;  // Método para limpiar la categoría seleccionada
    },
  },
});
