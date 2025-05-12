<script setup lang="ts">
const props = withDefaults(
  defineProps<{
  onClose?: () => void;
}>(),
{
  onClose: () => {}
}
)

const captchaStore = useCaptcha();
const pagoStore = usePagoStore();
const fileInput = ref<any>(null);
const formDataFile = ref<FormData | null>();
const file = ref();
const enabledUpload = ref(false);
const textUpload = ref('Subir');

const cloudName = "djp7gmsgk";
const apiKey = "713424869258163";
const apiSecret = "-ea4-sCuDptgulpDd93l1ZecGgM";
const folderName = "Curso";
const timestamp = Math.floor(Date.now() / 1000);

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

  file.value = fileInput.value.files[0];
  const signature = await generateSignature();
  formDataFile.value = new FormData();
  formDataFile.value.append("file", fileInput.value.files[0]);
  formDataFile.value.append("api_key", apiKey);
  formDataFile.value.append("timestamp", timestamp.toString());
  formDataFile.value.append("signature", signature);
  formDataFile.value.append("folder", folderName);
};

const callSaveFile = async() => {
  try {
    if(pagoStore.idPago <= 0) return
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formDataFile.value,
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Imagen subida con éxito:", data.secure_url);
      pagoStore.registrarImagenPago(data.secure_url);
    } else {
      console.error("Error al subir la imagen:", data);
    }
  } catch (error) {
    console.error("Error en la subida:", error);
  }
}

watch(() => pagoStore.imagenRegistrada, (registrata) => {
  if(registrata){
    props.onClose();
  }
});

onMounted(() => {
    captchaStore.generarCaptcha();
})
</script>

<template>
  <div
    class="z-50 fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black_transparent"
  >
    <div class="absolute w-full h-full bg-blue" @click="onClose"></div>
    <div class="relative z-10 bg-white rounded-lg w-full max-w-[500px] px-10 py-10">
      <nuxt-icon name="CloseCircle" class="absolute top-2 right-5 text-3xl cursor-pointer" filled @click="onClose"/>
      <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="handleFileChange" />
      <div class="flex flex-wrap gap-2 items-center">
        <button
        class="bg-primary rounded text-white p-3 w-full max-w-[200px]"
        type="submit"
        @click="fileInput.click()"
      >
        Seleccionar Archivo
      </button>
      <span class="font-telegraf">{{ file?.name }}</span>
      </div>
      <BaseCaptchaForm :on-valid-captcha="() => {
        enabledUpload = true;
      }"/>

      <div class="flex justify-center items-center mt-5">
        <button
        class="bg-primary rounded text-white p-3"
        type="submit"
        :class="{'opacity-50 cursor-not-allowed': !enabledUpload || !file || !captchaStore.captchaValido}"
        :disabled="!enabledUpload || !file || !captchaStore.captchaValido"
        @click="() => {
          textUpload = 'Subiendo...';
          callSaveFile();
        }"
      >
        {{textUpload}}
      </button>
      </div>
    </div>
  </div>
</template>
