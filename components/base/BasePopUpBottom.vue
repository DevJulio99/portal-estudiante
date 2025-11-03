<script lang="ts" setup>
const msgPopupStore = useMsgPopUpStore();
const timeoutId = ref<any>(null);

watch(() => msgPopupStore.showBottom, (isShown) => {
  if (isShown) {
    clearTimeout(timeoutId.value);
    const popupEl = document.getElementById('popuperr');
    if (popupEl) {
      popupEl.classList.add('show');
      timeoutId.value = setTimeout(() => {
        popupEl.classList.remove('show');
        msgPopupStore.setErrorBottom(false, ''); // Resetea el estado en el store
      }, 5000);
    }
  }
});
</script>

<template>
  <div
    class="w-full text-center font-nunito popup-error bg-error fixed text-white block p-4 z-[1000] bottom-[-100px] left-[50%] opacity-0"
    id="popuperr"
  >
    <p>{{ msgPopupStore.messageBottom }}</p>
  </div>
</template>

<style scoped>
.popup-error {
    transform: translateX(-50%);
    transition: opacity 0.5s ease, bottom 0.5s ease;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .popup-error.show {
    bottom: 0px;
    opacity: 1;
  }
</style>