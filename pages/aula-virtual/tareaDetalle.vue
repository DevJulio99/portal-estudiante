<script setup lang="ts">
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const aulaVirtualStore = useAulaVirtualStore();
const tokenStore = useTokenStore();
const msgPopupStore = useMsgPopUpStore();

const title = computed(() => (route.query.title as string) || 'Detalle de Tarea');

const breadcrumbsItem = computed(() => [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Aula Virtual', current: false, url: '/aula-virtual' },
	{ name: title.value, current: true, url: '' },
]);

const tareaFile = ref<any>(null);
const pending = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);

const cloudName = "djp7gmsgk";
const apiKey = "713424869258163";
const apiSecret = "-ea4-sCuDptgulpDd93l1ZecGgM";
const folderName = "Tareas";

const loadTarea = async () => {
    const idContenido = aulaVirtualStore.selectedResource?.id;
    const idAlumno = tokenStore.getDataToken?.Id_Alumno;

    if (!idContenido || !idAlumno) {
         console.warn("Faltan datos para cargar la tarea.");
         return;
    }

    try {
        pending.value = true;
        const { data } = await $api.material.GetMateriales({ 
            idContenido: idContenido, 
            idAlumno: parseInt(idAlumno) 
        });

        if (data.value && data.value.data && data.value.data.length > 0) {
            tareaFile.value = data.value.data[0];
        } else {
            tareaFile.value = null;
        }
    } catch (error) {
        console.error("Error al cargar la tarea:", error);
    } finally {
        pending.value = false;
    }
};

onMounted(() => {
    loadTarea();
});

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0];
    }
};

const triggerFileInput = () => {
    fileInput.value?.click();
};

const uploadFile = async () => {
    if (!selectedFile.value) return;
    
    const idContenido = aulaVirtualStore.selectedResource?.id;
    const idAlumno = tokenStore.getDataToken?.Id_Alumno;

    if (!idContenido || !idAlumno) {
        msgPopupStore.showError("No se pudo identificar el recurso o el alumno. Por favor, vuelva a ingresar al detalle de la tarea.");
        return;
    }

    isUploading.value = true;
    const timestamp = Math.floor(Date.now() / 1000);

    const generateSignature = async () => {
        const stringToSign = `folder=${folderName}&timestamp=${timestamp}${apiSecret}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(stringToSign);
        const hashBuffer = await crypto.subtle.digest("SHA-1", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    };

    try {
        const signature = await generateSignature();
        const formData = new FormData();
        formData.append("file", selectedFile.value);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folderName);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            const extension = selectedFile.value.name.split('.').pop() || '';
            const pesoMb = Number((selectedFile.value.size / (1024 * 1024)).toFixed(2));

            const payload = {
                idContenido: idContenido,
                nombre: selectedFile.value.name,
                url: data.secure_url,
                extension: extension,
                pesoMb: pesoMb,
                idAlumno: parseInt(idAlumno)
            };

            const { error } = await $api.material.RegistrarMaterial(payload);

            if (error.value) throw new Error("Error al registrar la tarea en el sistema.");

            msgPopupStore.showSuccess("Tarea entregada correctamente.");
            selectedFile.value = null;
            await loadTarea();
        } else {
            console.error("Error al subir el archivo:", data);
            msgPopupStore.showError("Error al subir el archivo.");
        }
    } catch (error) {
        console.error("Error en la subida:", error);
        msgPopupStore.showError("Ocurrió un error al subir el archivo.");
    } finally {
        isUploading.value = false;
    }
};

const downloadFile = (url: string) => {
    window.open(url, '_blank');
};
</script>

<template>
    <BaseLayout :rightAside="false" class="relative" bgWhite>
        <BaseBreadcrumbs :items="breadcrumbsItem"/>
        <div class="flex justify-between items-center mb-4">
            <BaseTitle :text="title" />
            <button @click="router.back()" class="text-sm text-primary hover:underline font-semibold flex items-center gap-1">
                <nuxt-icon name="arrow-go-back" />
                <span>Volver</span>
            </button>
        </div>
        
        <div class="mt-6 bg-white p-6 rounded-lg shadow border border-gray-100">
            <div v-if="pending" class="flex justify-center py-10">
                <BaseStatusLoading text="Cargando información de la tarea..." />
            </div>

            <div v-else>
                <div v-if="tareaFile" class="flex flex-col items-center justify-center py-8">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <nuxt-icon name="circle-check" class="text-4xl text-green-500" />
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Tarea Entregada</h3>
                    <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                        <nuxt-icon :name="tareaFile.extension === 'pdf' ? 'icon-pdf-outline' : 'icon-document-twotone'" class="text-3xl text-red-500" />
                        <div class="text-left">
                            <p class="font-semibold text-gray-800">{{ tareaFile.nombre }}</p>
                            <button @click="downloadFile(tareaFile.url)" class="text-sm text-primary hover:underline">Descargar archivo</button>
                        </div>
                    </div>
                </div>

                <div v-else class="flex flex-col items-center justify-center py-8">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <nuxt-icon name="icon-upload-file" class="text-4xl text-primary" />
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Entregar Tarea</h3>
                    <p class="text-gray-500 mb-6 text-center max-w-md">No has entregado esta tarea aún. Sube tu archivo en formato PDF o Word para completar la entrega.</p>
                    
                    <input 
                        type="file" 
                        ref="fileInput" 
                        accept=".pdf,.doc,.docx" 
                        class="hidden" 
                        @change="handleFileChange" 
                    />

                    <div v-if="!selectedFile" class="flex gap-4">
                        <button @click="triggerFileInput" class="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors flex items-center gap-2">
                            <nuxt-icon name="icon-upload-file" />
                            Seleccionar Archivo
                        </button>
                    </div>

                    <div v-else class="w-full max-w-md">
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                            <div class="flex items-center gap-3">
                                <nuxt-icon name="icon-document-twotone" class="text-2xl text-gray-500" />
                                <span class="font-medium text-gray-700 truncate">{{ selectedFile.name }}</span>
                            </div>
                            <button @click="selectedFile = null" class="text-red-500 hover:text-red-700">
                                <span class="text-xl font-bold">&times;</span>
                            </button>
                        </div>
                        <button @click="uploadFile" :disabled="isUploading" class="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isUploading ? 'Subiendo...' : 'Enviar Tarea' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>