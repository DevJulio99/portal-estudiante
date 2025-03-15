<script setup>
import { ref } from "vue";

const cloudName = "djp7gmsgk";
const apiKey = "713424869258163";
const apiSecret = "-ea4-sCuDptgulpDd93l1ZecGgM";
const folderName = "Curso";
const timestamp = Math.floor(Date.now() / 1000);

const fileInput = ref(null);
const isUploading = ref(false);
const isUploaded = ref(false);
const pagoStore = usePagoStore();

const generateSignature = async () => {
  const stringToSign = `folder=${folderName}&timestamp=${timestamp}${apiSecret}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

const handleFileChange = async () => {
  if (!fileInput.value.files[0]) return;

  isUploading.value = true;
  const signature = await generateSignature();
  const formData = new FormData();
  formData.append("file", fileInput.value.files[0]);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folderName);

  try {
    if(pagoStore.idPago <= 0) return
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Imagen subida con éxito:", data.secure_url);
      isUploaded.value = true;
      pagoStore.registrarImagenPago(data.secure_url);
      setTimeout(() => (isUploaded.value = false), 2000);
    } else {
      console.error("Error al subir la imagen:", data);
    }
  } catch (error) {
    console.error("Error en la subida:", error);
  } finally {
    isUploading.value = false;
  }
};
</script>

<template>
  <div class="relative">
    <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />

    <BaseButton
      class="p-2 bg-primary rounded-lg hover:bg-[#1E6657] !w-10 relative flex items-center justify-center"
      @click="fileInput.click()"
    >
      <template v-if="isUploading">
        <BaseStatusLoading />
      </template>
      <template v-else>
        <nuxt-icon name="icon-upload" filled class="text-[18px] text-white" />
      </template>

      <span
        v-if="isUploaded"
        class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-lg px-2 py-1"
      >
        ¡Listo!
      </span>
    </BaseButton>
  </div>
</template>
