<script setup lang="ts">
import { ref } from 'vue';

const router = useRouter();

useHead({
  title: "Material Complementario",
});

const files = ref([
    { name: 'Lectura Complementaria - Semana 1.pdf', url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf', icon: 'file-pdf', color: 'text-red-500' },
    { name: 'Ejercicios Prácticos - Unidad 1.pdf', url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf', icon: 'file-pdf', color: 'text-red-500' },
    { name: 'Glosario de Términos.pdf', url: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf', icon: 'file-word', color: 'text-blue-500' },
]);

const downloadingFile = ref<string | null>(null);

const downloadFile = async (file: { name: string, url: string }) => {
    if (downloadingFile.value) return;
    downloadingFile.value = file.name;

    try {
        const response = await fetch(file.url);
        const blob = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = file.name;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error al descargar el archivo:", error);
        alert("No se pudo descargar el archivo. Revisa la consola para más detalles.");
    } finally {
        downloadingFile.value = null;
    }
};

const goBack = () => {
  router.back();
}
</script>

<template>
    <BaseLayout :rightAside="false" class="relative" bgWhite>
        <div class="flex justify-between items-center mb-6">
            <BaseTitle text="Material complementario" />
            <button @click="goBack" class="text-sm text-primary hover:underline font-semibold flex items-center gap-1">
                <nuxt-icon name="arrow-go-back" />
                <span>Volver al Curso</span>
            </button>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="flex justify-between items-center mb-4 pb-4 border-b">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary rounded-md flex justify-center items-center text-white">
                        <nuxt-icon name="icon-folder-outline" class="text-lg" />
                    </div>
                    <h3 class="text-lg font-bold text-gray-800">Materiales de la Sesión 1</h3>
                </div>
                <button class="bg-primary text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors">
                    <nuxt-icon name="upn-icon-download-box" class="text-xl" />
                    <span>Descargar Carpeta</span>
                </button>
            </div>
            <ul class="space-y-1 ml-5">
                <li v-for="(file, index) in files" :key="index" class="flex items-center">
                    <div class="relative top-[-9px] w-4 h-6 flex-shrink-0 border-l-2 border-b-2 border-gray-300 rounded-bl-lg"></div>
                    <button
                        @click="downloadFile(file)"
                        :disabled="!!downloadingFile"
                        class="flex-grow flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors text-left disabled:cursor-not-allowed"
                    >
                        <nuxt-icon :name="file.icon" :class="file.color" class="text-2xl flex-shrink-0" />
                        <span class="text-gray-800 font-medium">
                            {{ file.name }}
                            <span v-if="downloadingFile === file.name" class="text-sm text-primary ml-2">(Descargando...)</span>
                        </span>
                    </button>
                </li>
            </ul>
            </div>
    </BaseLayout>
</template>