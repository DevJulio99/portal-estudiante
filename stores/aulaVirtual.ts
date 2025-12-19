import { defineStore } from 'pinia';

interface Resource {
  id?: number;
  type: string;
  title: string;
  material: boolean;
  dates?: {
    opens: string;
    closes: string;
  };
}

export const useAulaVirtualStore = defineStore('aulaVirtual', {
    state: () => ({
        selectedResource: null as Resource | null,
    }),
    actions: {
        setSelectedResource(resource: Resource) {
            this.selectedResource = resource;
        }
    }
});