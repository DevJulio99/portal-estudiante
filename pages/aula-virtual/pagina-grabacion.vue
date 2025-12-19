<script setup lang="ts">
import { ref, onMounted } from 'vue';

const { $api } = useNuxtApp();
const aulaVirtualStore = useAulaVirtualStore();
const tokenStore = useTokenStore();
const router = useRouter();

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Aula Virtual', current: false, url: '/aula-virtual' },
	{ name: 'Grabación de sesión', current: true, url: '' },
];

const videoUrl = ref<string | null>(null);
const pending = ref(false);

const loadGrabacion = async () => {
    const idContenido = aulaVirtualStore.selectedResource?.id;
    const idAlumno = tokenStore.getDataToken?.Id_Alumno;

    if (!idContenido || !idAlumno) {
        console.warn("Faltan datos (idContenido o idAlumno) para cargar los materiales.");
        return;
    }

    try {
        pending.value = true;
        const { data } = await $api.material.GetMateriales({ 
            idContenido: idContenido, 
            idAlumno: parseInt(idAlumno) 
        });

        if (data.value) {
            const videoData = data.value.data.find((item: any) => item.extension === 'video');
            if (videoData) {
                const url = videoData.url;
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                const match = url.match(regExp);

                videoUrl.value = (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
            }
        }
    } catch (error) {
        console.error("Error al cargar la grabación:", error);
    } finally {
        pending.value = false;
    }
};

onMounted(() => {
    loadGrabacion();
});

</script>

<template>
    <BaseLayout :rightAside="false" class="relative" bgWhite>
        <BaseBreadcrumbs :items="breadcrumbsItem"/>
        <div class="flex justify-between items-center mb-4">
            <BaseTitle text="Grabación de sesión" />
            <button @click="router.back()" class="text-sm text-primary hover:underline font-semibold flex items-center gap-1">
                <nuxt-icon name="arrow-go-back" />
                <span>Volver</span>
            </button>
        </div>
        
        <div class="mt-6 bg-white p-6 rounded-lg shadow border border-gray-100 flex justify-center">
            <div v-if="pending" class="flex justify-center w-full py-10">
                <BaseStatusLoading text="Cargando grabación..." />
            </div>
            <iframe 
                v-else-if="videoUrl"
                width="800" 
                height="450" 
                :src="videoUrl" 
                title="Grabación de sesión" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
                class="w-full max-w-4xl aspect-video rounded-lg"
            ></iframe>
            <div v-else class="text-center text-gray-500 py-10 w-full">
                No se encontró la grabación de la sesión.
            </div>
        </div>
    </BaseLayout>
</template>