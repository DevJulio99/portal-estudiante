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
const textBnt = ref("Validar CAPTCHA");

const validCaptcha = async () => {
  if (!captchaStore.captchaValido) {
    if (captchaStore.captchaModel.replaceAll(/\s+/g, "").length < 4) return;
    textBnt.value = "Validando...";
    captchaStore.data &&
      (await captchaStore.validarCaptcha(
        captchaStore.data.captchaId,
        captchaStore.captchaModel
      ));
    textBnt.value = "Validar CAPTCHA";
  }
};

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
      @submit.prevent="validCaptcha"
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

      <button
        class="bg-primary rounded text-white p-3 w-full max-w-[155px]"
        type="submit"
        :disabled="captchaStore.loading"
      >
        {{ textBnt }}
      </button>
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
