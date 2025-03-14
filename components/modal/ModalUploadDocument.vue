<script setup>
import { useFileUploader } from "@/composables/useFileUploader";

const { $api } = useNuxtApp();

const props = defineProps({
    show: Boolean,
    categories: Array
});

const isModalVisible = computed(() => props.show);
const emit = defineEmits(['close', 'upload']);
const { uploadFile } = useFileUploader();
const errorMessage = ref('');
const isLoading = ref(false);
const successMessage = ref('');

const formData = ref({
    categoria: '',
    titulo: '',
    descripcion: '',
    interno: true,
    archivo: null
});

const maxLength = {
    titulo: 100,
    descripcion: 150
};

watch(
    () => ({ titulo: formData.value.titulo, descripcion: formData.value.descripcion }),
    (newValues) => {
        for (const key in newValues) {
            if (newValues[key].length > maxLength[key]) {
                formData.value[key] = newValues[key].substring(0, maxLength[key]);
            }
        }
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.type !== "application/pdf") {
            errorMessage.value = 'Solo se permiten archivos PDF';
            formData.value.archivo = null;
            return;
        }

        errorMessage.value = '';
        formData.value.archivo = file;
    }
}

async function handleUpload() {
    if (!formData.value.archivo) {
        errorMessage.value = 'Por favor, seleccione un archivo antes de proceder.';
        return;
    }

    isLoading.value = true;

    try {
        const response = await uploadFile(formData.value.archivo);

        if (response.success && response.url) {
            const payload = {
                idCategoriaDocumento: formData.value.categoria,
                titulo: formData.value.titulo,
                descripcion: formData.value.descripcion,
                documento: response.url,
                interno: formData.value.interno,
                documentoDescarga: response.url.replace("/upload/", "/upload/fl_attachment/")
            };

            const { data, error } = await $api.agregarDocumento.agregarDocumento(payload);
            
            if(error.value) {
                console.error('Error al guardar el documento en la base de datos', error.value);
                return;
            }

            successMessage.value = "Documento agregado correctamente";
            setTimeout(() => {
                successMessage.value = "";
            }, 4000);

            resetForm();
            emit('upload', payload);
            emit('close');
        } else {
            errorMessage.value = 'Error al subir el archivo.';
        }
    } catch (error) {
        console.error('Error en la subida:', error);
        errorMessage.value = 'Hubo un problema al subir el archivo.';
    } finally {
        isLoading.value = false;
    }
}

function resetForm() {
    formData.value = {
        categoria: '',
        titulo: '',
        descripcion: '',
        interno: true,
        archivo: null
    };
    errorMessage.value = '';
}

watch(isModalVisible, (newValue) => {
    if (newValue) {
        document.body.classList.add("no-scroll");
    } else {
        document.body.classList.remove("no-scroll");
    }
});

onUnmounted(() => {
    document.body.classList.remove("no-scroll");
});
</script>

<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-background" @click="$emit('close')"></div>
        <div class="modal-container">
            <h2 class="text-lg font-bold mb-4">Subir Documento</h2>
            <form @submit.prevent="handleUpload">
                <label class="block mb-1">Categoría</label>
                <select v-model="formData.categoria" class="input" required>
                    <option value="" disabled selected>Seleccione una categoría</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.nombre }}
                    </option>
                </select>

                <label class="block mt-4 mb-1">Título del documento</label>
                <input v-model="formData.titulo" type="text" class="input" required />
                <p class="text-sm text-gray_80">
                    {{ formData.titulo.length }}/{{ maxLength.titulo }} caracteres
                </p>

                <label class="block mt-4 mb-1">Descripción</label>
                <textarea v-model="formData.descripcion" class="input" required></textarea>
                <p class="text-sm text-gray_80">
                    {{ formData.descripcion.length }}/{{ maxLength.descripcion }} caracteres
                </p>

                <div class="flex items-center mt-4">
                    <input v-model="formData.interno" type="checkbox" class="mr-2" />
                    <label>Interno</label>
                </div>

                <div class="file-upload mt-4">
                    <label class="file-label">
                        Seleccionar archivo
                        <input type="file" accept="application/pdf" @change="handleFileUpload" />
                    </label>
                    <span class="file-name">{{ formData.archivo ? formData.archivo.name : 'No hay archivo seleccionado' }}</span>
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                </div>

                <div class="mt-6 flex justify-end gap-2">
                    <BaseButton :disabled="isLoading" type="submit" styles="btn-primary">
                        <template v-if="isLoading">
                            <BaseStatusLoading />
                        </template>
                        <template v-else>
                            Subir
                        </template>
                    </BaseButton>
                    <BaseButton @click="resetForm(); $emit('close')" styles="btn-cancel">Cancelar</BaseButton>
                </div>
            </form>
        </div>
    </div>
    <div v-if="successMessage" class="toast-message">
        {{ successMessage }}
    </div>
</template>


<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
}

.modal-background {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
}

.modal-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 450px;
    max-height: 97vh;
    overflow-y: auto;
    position: relative;
}

.file-upload {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.file-label {
    display: inline-block;
    background: transparent;
    color: #287F6B;
    padding: 6.5px 12px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    border: 1px solid #287F6B;
    transition: background 0.3s, color 0.3s;
}

.file-label:hover {
    background: rgba(40, 127, 107, 0.1);
}

.file-label input {
    display: none;
}

.file-name {
    font-size: 12px;
    color: #555;
    text-align: center;
    word-wrap: break-word;
    max-width: 100%;
}

@media (max-width: 480px) {
    .modal-container {
        max-width: 95%;
        padding: 15px;
    }

    .mt-6.flex {
        flex-direction: column;
        gap: 4px;
    }

    .mt-6.flex button {
        width: 100%;
    }

    .file-upload {
        align-items: center;
    }

    .file-name {
        font-size: 12px;
        text-align: center;
    }
}

.input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.btn-cancel {
    background: #031448;
    color: white;
    transition: background 0.3s;
}

.btn-cancel:hover {
    background: #021033;
}

.btn-primary {
    background: #287F6B;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-primary:hover {
    background: #1E6657;
}

input[type="checkbox"] {
    accent-color: #287F6B;
}

.error-message {
    color: red;
    font-size: 14px;
    margin-top: 4px;
}

.toast-message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #28a745;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    animation: fadeOut 3s ease-in-out forwards;
}

@keyframes fadeOut {
    0% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
}
</style>
