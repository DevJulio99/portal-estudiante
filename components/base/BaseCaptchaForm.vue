<script setup lang="ts">
const props = withDefaults(
  defineProps<{
  onValidCaptcha?: () => void;
}>(),
{
 onValidCaptcha: () => {}
}
)
const captchaStore = useCaptcha();
const msgPopupStore = useMsgPopUpStore();

function setError(msg = "") {
  msgPopupStore.setErrorBottom(true, msg);
}

watch(
  () => captchaStore.error,
  (err) => {
    if (err) {
      setError("CAPTCHA no válido.");
    }
  }
);

watch(
  () => captchaStore.captchaValido,
  (valid) => {
    if (valid) {
      props.onValidCaptcha();
    }
  }
);

watch(() => captchaStore.captchaModel, async(value, oldVal) => {
  const trimedNew = value.replaceAll(/\s+/g, '').toLocaleLowerCase();
  const trimedOld = oldVal.replaceAll(/\s+/g, '').toLocaleLowerCase();

  if (value.replaceAll(/\s+/g, '').length < 4) {
    captchaStore.captchaValido = false;
    return;
  }
  if(trimedNew === trimedOld) return;
  if(captchaStore.data) await captchaStore.validarCaptcha(
        captchaStore.data.captchaId,
        captchaStore.captchaModel
  ) 
})
</script>

<template>
  <div class="flex flex-wrap justify-center mt-10">
    <div class="w-full flex flex-wrap justify-center">
      <BaseStatusLoading class="w-full" v-if="captchaStore.loading" />
      <div
        v-else-if="captchaStore.data"
        class="flex flex-wrap justify-center gap-3"
      >
        <img :src="captchaStore.data.captchaImage" alt="CAPTCHA" />
        <button
          aria-label="Recargar CAPTCHA"
          @click="captchaStore.refrescarCaptcha"
        >
          <nuxt-icon
            name="icon-refresh"
            class="text-[24px] no-margin filter-green"
          />
        </button>
      </div>
    </div>
    <form
      class="fmr-captcha w-full flex flex-wrap justify-center"
    >
      <input
        v-model="captchaStore.captchaModel"
        @input="
          captchaStore.captchaModel = captchaStore.captchaModel.toUpperCase()
        "
        placeholder="Ingrese el CAPTCHA"
        id="captchaCode"
        type="text"
        maxlength="4"
      />
    </form>
  </div>
</template>

<style scoped>
.filter-green {
  filter: brightness(0) saturate(100%) invert(40%) sepia(64%) saturate(347%)
    hue-rotate(116deg) brightness(94%) contrast(103%);
}

.fmr-captcha input[type="text"],
.fmr-captcha input[type="password"] {
  display: block;
  outline: none;
  padding: 8px;
  width: 100%;
  border: solid 2px #ccc;
  border-radius: 4px;
  margin-bottom: 16px;
}

.fmr-captcha input[type="text"]:hover,
.fmr-captcha input[type="password"]:hover {
  border: solid 2px #287f6b;
}

.fmr-captcha input[type="text"]:focus,
.fmr-captcha input[type="password"]:focus {
  border: solid 2px #1e6657;
}
</style>
