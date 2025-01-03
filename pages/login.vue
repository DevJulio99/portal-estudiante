<script setup lang="ts">
import type { ResponseLogin } from "~/types/login.types";

const userLogin = ref({
  email: "",
  password: "",
});
const tokenStore = useTokenStore();
const router = useRouter();
const { $api } = useNuxtApp();
const dataLog = ref<ResponseLogin | null>();
const errorLog = ref<boolean>(false);
const errorMsg = ref<string>("");
const pendingLogin = ref<boolean>(false);

const callLogin = async () =>
  await $api.login.login(userLogin.value.email, userLogin.value.password, {
    lazy: true,
  });

async function handleFormSubmit() {
  errorLog.value = false;
  const isvalid = Object.values(userLogin.value).every(
    (x) => x.trim().length > 0
  );

  if (!isvalid) setError("Complete todos los campos");
  if (isvalid) {
    const { data, error, pending } = await callLogin();
    // console.log('data.value', data.value)
    if (error.value) setError();
    console.log("error", error.value);
    setTimeout(() => {
      data.value && (dataLog.value = data.value);
      pendingLogin.value = pending.value;
    }, 0);
  }

  const unWatch = watch(dataLog, (response) => {
    if (response) {
      tokenStore.setToken(response.accessToken, response.refreshToken);
      localStorage.setItem("access", JSON.stringify(response));
      router.push("/inicio");
    }
    if (!response) {
      unWatch();
    }
  });
}

function changeEl(ev: any) {
  userLogin.value = {
    ...userLogin.value,
    [ev.target.name]: ev.target.value,
  };
}

function setError(msg = "Correo o contraseña incorrecta") {
  errorLog.value = true;
  errorMsg.value = msg;
  dataLog.value = null;
  (document.getElementById('popuperr') as HTMLDivElement).classList.add('show');
  setTimeout(() => {
   (document.getElementById('popuperr') as HTMLDivElement).classList.remove('show');
  }, 5000);
}

</script>

<template>
  <div class="bg-gray_40 h-screen flex justify-center items-center">
    <div
      class="bg-[#287f6b] p-6 rounded-lg w-full max-w-[600px] flex flex-wrap justify-center shadow-2xl"
    >
      <span
        class="w-full block text-center mb-4 uppercase font-grotesk text-xl font-bold text-white"
        >login</span
      >

      <div class="w-full max-w-[400px] flex flex-wrap justify-center gap-4">
        <input
          class="w-full border-none rounded-md h-10 outline-none px-2"
          type="text"
          name="email"
          placeholder="Correo"
          @input="changeEl"
        />
        <input
          class="w-full border-none rounded-md h-10 outline-none px-2"
          type="password"
          name="password"
          placeholder="Contraseña"
          @input="changeEl"
        />
        <button
          class="bg-green_40 text-black py-3.5 px-4 text-base rounded-md font-nunito shadow-2xl font-semibold"
          @click="handleFormSubmit"
        >
          {{pendingLogin ? 'Ingresando...' : 'Ingresar'}}
        </button>
      </div>
    </div>
  </div>
  <div class="w-full text-center font-nunito popup-error bg-error fixed text-white block p-4 z-[1000] bottom-[-100px] left-[50%] opacity-0" id="popuperr">
    <p>{{ errorMsg }}</p>
  </div>
</template>

<style>
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