<script lang="ts" setup>
import type { ErrorResponse } from '~/types/services.types';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import ConsolidadoPdf from '~/components/consolidadoPdf/index.vue';
import { logoBase64 } from '~/utils/logoPortal';

useHead({ title: 'Consolidados de Matrícula' });

definePageMeta({ middleware: 'auth' });

const breadcrumbsItem = [
  { name: 'Inicio', current: false, url: '/inicio' },
  { name: 'Consolidados de matrícula', current: true, url: '' },
];

const urlDoc = ref('');
const docUploaded = ref(false);
const documentsError: Ref<ErrorResponse | null> = ref(null);
const isMobile = useMediaQuery('(max-width: 1024px)');
const isLoading = ref(true);

// onMounted(() => {
//   isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// });

const generatePDF = async () => {
  const content = document.getElementById('pdf-student');
  if (!content) {
    documentsError.value = {
      icono: '',
      descripcion: 'No se encontró el contenido para generar el PDF.',
      titulo: 'Error al generar el PDF',
    };
    return;
  }

  isLoading.value = true;
  documentsError.value = null;

  await nextTick();

  const pdfOptions = {
    margin: 2,
    filename: 'Consolidado de matrícula.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: isMobile.value ? 1.5 : 2,
      dpi: 192,
      letterRendering: true,
      useCORS: true,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'avoid-all' },
  };

  try {
    const pdfBlob = await html2pdf()
      .from(content)
      .set(pdfOptions)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const logoWidth = isMobile.value ? 25 : 31.13;
        const logoHeight = isMobile.value ? 4.33 : 5.4;
        const logoX = isMobile.value ? 5 : 6.5;
        const logoY = 10;
        const textX = logoX + logoWidth + 5;
        const textY = logoY + 4;

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
          pdf.setFontSize(isMobile.value ? 10 : 12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('INSTITUCIÓN EDUCATIVA', textX, textY);
          pdf.text('"JORGE BASADRE"', textX, textY + 6);
        }

        return pdf.output('blob');
      });

    if (isMobile.value) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } else {
      urlDoc.value = URL.createObjectURL(pdfBlob);
    }
    
    docUploaded.value = true;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    documentsError.value = {
      icono: '',
      descripcion: 'No se pudo generar el PDF consolidado.',
      titulo: 'Error al generar el PDF',
    };
  } finally {
    isLoading.value = false;
  }
};

const loadPdf = () => {
  setTimeout(() => {
    generatePDF();
  }, 0);
};
</script>

<template>
  <BaseLayout :rightAside="false" bgWhite>
    <div class="section-container px-3 xl:px-0">
      <BaseBreadcrumbs :items="breadcrumbsItem" />
      <BaseTitle text="CONSOLIDADOS DE MATRÍCULA" />

      <div v-if="isLoading" class="max-h-[300px] flex flex-col items-center justify-center">
        <BaseStatusLoading />
      </div>

      <div v-if="urlDoc && !isMobile" class="pdf-container">
        <embed
          :src="urlDoc"
          type="application/pdf"
          width="100%"
          height="600px"
          class="pdf-viewer"
        />
      </div>

      <div v-else-if="isMobile && docUploaded" class="mobile-message">
        <div class="message-content">
          <p>El consolidado se ha generado correctamente</p>
          <BaseButton
            @click="generatePDF"
            styles="mx-auto mt-4 bg-primary text-white !text-sm hover:bg-[#1E6657] min-h-[36px] !w-full !max-w-[150px] py-3.5 px-4">
            Ver documento
          </BaseButton>
        </div>
      </div>

      <ScheduleStatusError
        v-else-if="documentsError"
        class="w-full !h-[50vh] md:pt-[28px]"
        :text="documentsError.titulo"
        :description="documentsError.descripcion"
        :icono="documentsError.icono"
      />
    </div>

    <div class="layout-container">
      <div id="pdf-student">
        <ConsolidadoPdf :onLoad="loadPdf" />
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

.mobile-message {
  padding: 2rem;
  text-align: center;
}

.message-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .pdf-viewer {
    height: 500px;
  }
  
  .message-content {
    padding: 1.5rem;
  }
}
</style>