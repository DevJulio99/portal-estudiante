<script lang="ts" setup>
import type { ErrorResponse } from '~/types/services.types';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import ConsolidadoPdf from '~/components/consolidadoPdf/index.vue';
import { logoBase64 } from '~/utils/logoPortal';

useHead({
	title: 'Consolidados de Matrícula',
});

definePageMeta({
  middleware: "auth",
});

// const { $api } = useNuxtApp();

// const { handleRoute } = useBreadcrumb();

// const breadcrumb = [
// 	{ label: 'Inicio', goTo: () => handleRoute('/inicio', 'Inicio') },
// 	{ label: 'Consolidados de matrícula', goTo: () => {} },
// ];

const breadcrumbsItem = [
	{ name: 'Inicio', current: false, url: '/inicio' },
	{ name: 'Consolidados de matrícula', current: true, url: '' },
];

// const user = useUserStoreAuth();
// const nameConsolidado = user.codAlum;
const urlDoc = ref('');
const docUploaded = ref(false);
const documentsError: Ref<ErrorResponse | null> = ref(null);
const loading = ref(true);


// watch(CursosData, (response) => {
// 	if (response?.success) {
// 		//getDoc(response.data?.[0]?.url);
//     console.log('response?.data consolidado pdf', response?.data)
//     setTimeout(() => {
//       generatePDF()
//     }, 0);
// 	} else if (response?.error) {
// 		documentsError.value = response.error;
// 	} else {
// 		documentsError.value = {
// 			icono: '',
// 			descripcion: '',
// 			titulo: response?.message ?? '',
// 		};
// 	}
// });

// const generatePDF = async () => { //Generar pdf consolidado
// 	const content = document.getElementById('pdf-student');
// 	if (!content) {
// 		console.error('Elemento #pdf-content no encontrado.');
// 		return;
// 	}

// 	await nextTick();

// 	const pdfOptions = {
// 		margin: 8,
// 		filename: 'consolidado-matricula.pdf',
// 		image: { type: 'jpeg', quality: 0.98 },
// 		html2canvas: {
// 			scale: 2,
// 			dpi: 192,
// 			letterRendering: true,
// 		},
// 		jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
// 		pagebreak: { mode: 'avoid-all' },
// 	};

// 	await html2pdf()
//     .from(content)
//     .set(pdfOptions)
//     .toPdf()
//     .get('pdf')
//     .then((pdf: any) => {
//       const totalPages = pdf.internal.getNumberOfPages();
//       const logoWidth = 36.62;
//       const logoHeight = 6.35;
//       const logoX = 13;
//       const logoY = 10;

//       for (let i = 1; i <= totalPages; i++) {
//         pdf.setPage(i);
//         pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
//       }
//     })
//     .save();
// };

const generatePDF = async () => {
  const content = document.getElementById('pdf-student');
  if (!content) {
    console.error('Elemento #pdf-student no encontrado.');
    documentsError.value = {
      icono: '',
      descripcion: 'No se encontró el contenido para generar el PDF.',
      titulo: 'Error al generar el PDF',
    };
    return;
  }

  await nextTick();

  const pdfOptions = {
    margin: 2,
    filename: 'Consolidado de matrícula.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      dpi: 192,
      letterRendering: true,
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
        const logoWidth = 31.13;
        const logoHeight = 5.40;
        const logoX = 6.5;
        const logoY = 10;

        const textX = logoX + logoWidth + 5;
        const textY = logoY + 4;

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('INSTITUCIÓN EDUCATIVA', textX, textY);
          pdf.text('"CODESTI"', textX, textY + 6);
        }

        return pdf.output('blob');
      });

    const pdfUrl = URL.createObjectURL(pdfBlob);
    urlDoc.value = pdfUrl;
    docUploaded.value = true;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    documentsError.value = {
      icono: '',
      descripcion: 'No se pudo generar el PDF consolidado.',
      titulo: 'Error al generar el PDF',
    };
  }
};

// function getDoc(url: string | null) {
// 	console.log('url', url)
// 	if (url) {
// 		urlDoc.value = url;
// 		docUploaded.value = true;
// 	} else {
// 		docUploaded.value = true;
// 	}
// }

//onMounted(() => {
	// getDoc(dataConsolidado[0]?.url);
	// loading.value = false;
//})

const loadPdf = () => {
  setTimeout(() => {
    generatePDF();
  }, 0);
}
</script>

<template>
	<BaseLayout :rightAside="false" bgWhite>
		<div class="section-container px-3 xl:px-0">
			<BaseBreadcrumbs :items="breadcrumbsItem" />
			<BaseTitle text="CONSOLIDADOS DE MATRÍCULA" />

			<!-- <div v-if="pendingServices" class="w-full h-[240px] flex justify-center">
				<BaseStatusLoading />
			</div> -->
			<!-- <ScheduleStatusError
				v-else-if="error || documentsError"
				class="w-full !h-[50vh] md:pt-[28px]"
				:text="
					documentsError?.titulo ??
					'Lo sentimos, no pudimos cargar tus Consolidados de matrícula.'
				"
				:description="documentsError?.descripcion"
				:icono="documentsError?.icono"
			/> -->

			<iframe
				v-if="urlDoc && urlDoc.trim().length"
				:src="urlDoc"
				frameborder="0"
				width="100%"
				height="693px"
			></iframe>

			<!-- <ScheduleStatusNoData
				v-else-if="!urlDoc.trim().length && docUploaded"
				class="w-full !h-[240px] md:!h-[280px]"
				text="Estamos trabajando en el detalle de este contenido"
			/> -->
		</div>
		<!-- <BaseButton class="xl:ml-0 ml-3 mt-2 max-w-[150px] md:!w-[150px]" @click="generatePDF">Generar consolidado</BaseButton> -->
		<div class="layout-container">
			 <div id="pdf-student">
				<ConsolidadoPdf :onLoad="loadPdf"/>
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
</style>