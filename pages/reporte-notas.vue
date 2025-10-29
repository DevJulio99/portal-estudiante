<script lang="ts" setup>
import type { ResponseNotasReporte } from '~/repository/modules/ReporteNotaModulo';
import type { ErrorResponse } from '~/types/services.types';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import ReporteNotasPdf from '~/components/reporteNotasPdf/index.vue';
import { logoBase64 } from '~/utils/logoPortal';

useHead({ title: 'Reporte Notas' });

const { $api } = useNuxtApp();
const tokenStore = useTokenStore();

const notasReporte = ref<ResponseNotasReporte[]>([]);

const { data, pending, error } = await $api.reporteNota.obtenernotasAlumno(
  parseInt(tokenStore.getDataToken.Id_Alumno),
);

if (data.value?.data) {
  notasReporte.value = data.value.data;
}

onMounted(() => {
  if (notasReporte.value.length > 0) {
    loadPdf();
  }
})

const breadcrumbsItem = [
  { name: 'Inicio', current: false, url: '/inicio' },
  { name: 'Reporte Notas', current: true, url: '' },
];

const urlDoc = ref('');
const docUploaded = ref(false);
const documentsError: Ref<ErrorResponse | null> = ref(null);
const isMobile = useMediaQuery('(max-width: 1024px)');
const isLoadingPdf = ref(true);
const dataReady = ref(false);

const generatePDF = async () => {
  const content = document.getElementById('pdf-reporte-notas');
  if (!content) {
    documentsError.value = {
      icono: '',
      descripcion: 'No se encontró el contenido para generar el PDF.',
      titulo: 'Error al generar el PDF',
    };
    return;
  }

  isLoadingPdf.value = true;
  documentsError.value = null;

  await nextTick();

  const pdfOptions = {
    margin: 10,
    filename: 'Reporte de Notas.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: isMobile.value ? 1.5 : 2,
      dpi: 192,
      letterRendering: true,
      useCORS: true,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  try {
    const pdfBlob = await html2pdf()
      .from(content)
      .set(pdfOptions)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const logoWidth = 31.13;
        const logoHeight = 5.4;
        const logoX = 10;
        const logoY = 5;

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
        }

        return pdf.output('blob');
      });

    if (isMobile.value) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = 'Reporte de Notas.pdf';
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } else {
      // Para escritorio, establecemos la URL para el visor y ocultamos la barra de herramientas
      urlDoc.value = URL.createObjectURL(pdfBlob) + '#toolbar=0';
    }
    
    docUploaded.value = true;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    documentsError.value = {
      icono: '',
      descripcion: 'No se pudo generar el PDF del reporte de notas.',
      titulo: 'Error al generar el PDF',
    };
  } finally {
    isLoadingPdf.value = false;
  }
};

const loadPdf = async () => {
  try {
    dataReady.value = true;
    await nextTick();
    const content = document.getElementById('pdf-reporte-notas');
    if (!content) {
      return;
    }
    setTimeout(() => {
      generatePDF();
    }, 200);
  } catch (error) {
    documentsError.value = {
      icono: '',
      descripcion: 'Error al preparar los datos para el PDF.',
      titulo: 'Error de preparación',
    };
    isLoadingPdf.value = false;
  }
};

const handleDownload = () => {
  if (urlDoc.value) {
    const link = document.createElement('a');
    link.href = urlDoc.value;
    link.download = 'Reporte de Notas.pdf';
    document.body.appendChild(link); // Necesario para que el clic funcione en algunos navegadores
    link.click();
    document.body.removeChild(link); // Limpiar el elemento temporal
  }
};
</script>

<template>
  <BaseLayout :rightAside="false" bgWhite>
    <div class="section-container px-3 xl:px-0">
      <BaseBreadcrumbs :items="breadcrumbsItem" />
      <div class="flex justify-between items-center mb-4">
        <BaseTitle text="Reporte de Notas" />
        <BaseButton v-if="!pending && !error && notasReporte.length > 0 && urlDoc" style="padding: 0 10px;" @click="handleDownload">
          Descargar Reporte
        </BaseButton>
      </div>

      <div v-if="pending" class="max-h-[300px] flex flex-col items-center justify-center">
        <BaseStatusLoading />
      </div>

      <div v-else-if="error" class="w-full !h-[50vh] md:pt-[28px]">
        <ScheduleStatusError
          text="Error al cargar el reporte"
          description="Hubo un problema al obtener el reporte de notas. Por favor, inténtalo de nuevo más tarde."
        />
      </div>

      <div v-else-if="isLoadingPdf && dataReady" class="max-h-[300px] flex flex-col items-center justify-center">
        <BaseStatusLoading text="Generando PDF..." />
      </div>

      <div v-else-if="urlDoc && !isMobile" class="pdf-container">
        <embed :src="urlDoc" type="application/pdf" width="100%" height="600px" class="pdf-viewer" />
      </div>

      <ScheduleStatusError
        v-else-if="documentsError"
        class="w-full !h-[50vh] md:pt-[28px]"
        :text="documentsError.titulo"
        :description="documentsError.descripcion"
        :icono="documentsError.icono"
      />

      <div v-else class="w-full !h-[50vh] md:pt-[28px]">
        <ScheduleStatusNoData text="No hay notas para mostrar en el reporte." />
      </div>
    </div>

    <div v-if="dataReady" class="layout-container">
      <div id="pdf-reporte-notas">
        <ReporteNotasPdf :notas="notasReporte" :on-load="generatePDF" />
      </div>
    </div>
  </BaseLayout>
</template>

<style scoped>
.layout-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: -100vw;
  top: 0;
  z-index: -9999;
  background: rgba(95, 95, 95, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
}

.pdf-container {
  width: 100%;
  margin-top: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-viewer {
  width: 100%;
  min-height: 600px;
}
</style>