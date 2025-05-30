<script setup lang="ts">
import type { ResponseLogin } from "~/types/login.types";

const userLogin = ref({
  email: "",
  password: "",
});
const tokenStore = useTokenStore();
const captchaStore = useCaptcha();
const msgPopupStore = useMsgPopUpStore();
const router = useRouter();
const { $api } = useNuxtApp();
const dataLog = ref<ResponseLogin | null>();
const pendingLogin = ref<boolean>(false);
const textLogin = ref<string>('Iniciar sesión');

watch(() => captchaStore.error, (err) => {
   if(err){
    setError("CAPTCHA no válido.");
   }
})

const callLogin = async (captchaId: string, captchaCode: string) =>
  await $api.login.login(userLogin.value.email, userLogin.value.password, captchaId, captchaCode, {
    lazy: true,
  });

async function handleFormSubmit() {
  const isvalid = Object.values(userLogin.value).every(
    (x) => x.trim().length > 0
  );
  const captchaId = captchaStore.data?.captchaId;

  if (!isvalid) setError("Complete todos los campos");
  if(!captchaId) setError("CAPTCHA no válido.");
  if (isvalid && captchaId) {
    textLogin.value = 'Ingresando...';
    const { data, error, pending } = await callLogin(captchaId, captchaStore.captchaModel);
    // console.log('data.value', data.value)
    if (error.value){
      const dataErr = error.value.data as any;
      if(dataErr.code == 'PS-EVAL-4000'){
        setError();
        refreshCaptcha();
      }
      if(dataErr.code == 'PS-EVAL-4001'){
        setError("CAPTCHA no válido.");
      }
      
      textLogin.value = 'Iniciar sesión';
    }
    console.log("error", error.value);
    setTimeout(() => {
      if(error.value){
        unWatch();
      }
      data.value && (dataLog.value = data.value);
      pendingLogin.value = pending.value;
    }, 0);
  }

  const unWatch = watch(dataLog, async(response) => {
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
  dataLog.value = null;
  msgPopupStore.setErrorBottom(true, msg);
}

const validCaptcha = async() => {
  if(captchaStore.captchaModel.replaceAll(/\s+/g, '').length < 4) return
  captchaStore.data && await captchaStore.validarCaptcha(captchaStore.data.captchaId, captchaStore.captchaModel);
}

const refreshCaptcha = () => {
  captchaStore.refrescarCaptcha();
}

onMounted(() => {
  captchaStore.generarCaptcha();
})

</script>

<!-- <template>
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
</template> -->

<template>
  <div>
    <div class="main-container">
      <div class="left-container">
        <div class="form-container">
          <div class="logo-container">
            <img src="/assets/icons/codesti.svg" alt="" width="400">
          </div>
          <div class="title-container">
            <h2>Bienvenidos</h2>
          </div>
          <!-- <div class="login-social-container">
            <button class="btn-google">Iniciar sesión con Google</button>
          </div>
          <div class="separator-container">
            <div class="line"></div>
            <span>o inicia sesión con tu correo</span>
            <div class="line"></div>
          </div> -->
          <div class="inputs-container">
            <label for="email">USUARIO</label>
            <input type="text" name="email" @input="changeEl" @keypress.enter="handleFormSubmit">

            <label for="password">CONTRASEÑA</label>
            <input type="password" name="password" @input="changeEl" @keypress.enter="handleFormSubmit">

            <!-- <div class="options-container">
              <div>
                <input type="checkbox">Mantenerme conectado
              </div>
              <div class="right">
                <a href="#">Olvidé mi contraseña</a>
              </div>
            </div> -->

            <BaseCaptchaForm />

            <div class="buttons-container">
              <button class="btn-login" @click="handleFormSubmit" :disabled="!captchaStore.captchaValido">{{ textLogin }}</button>
            </div>
          </div>
          <!-- <div class="register-container">
            <span>¿No tienes una cuenta?</span>
            <a href="#">Regístrate</a>
          </div> -->

        </div>
      </div>

      <div class="right-container"></div>
    </div>
  </div>
</template>

<style scoped>
  .filter-green {
    filter: brightness(0) saturate(100%) invert(40%) sepia(64%) saturate(347%) hue-rotate(116deg) brightness(94%) contrast(103%);
  }

  .main-container {
    display: flex;
    flex-wrap: wrap;
  }

  .left-container, .right-container {
    width: 50%;
    height: 100vh;
  }

  .right-container {
    background-color: #73B4FE;
    background-image: url(../assets/images/ilustracion.png);
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .form-container {
    width: 100%;
    max-width: 400px;
    margin: 3.5rem auto;
    font-size: 16px;
  }

  .logo-container {
    text-align: center;
  }

  .logo-container img {
    width: 100px;
    display: block;
    margin: 0 auto;
  }

  .title-container h2 {
    font-size: 56px;
    text-align: center;
    padding: 8px;
  }

  .login-social-container {}

  .btn-google {
    background-color: white;
    background-image: url(../assets/icons/google-icon-small.png);
    background-repeat: no-repeat;
    background-position: 16px center;
    border-radius: 4px;
    border: solid 1px;
    border-color: #ccc;
    width: 100%;
    padding: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    font-weight: bolder;
    cursor: pointer;
  }

  .separator-container {
    text-align: center;
  }

  .separator-container span {
    color: #ccc;
    font-weight: bolder;
    display: inline-block;
    vertical-align: middle;
    padding: 0 10px;
  }

  .line {
    height: 2px;
    background-color: #ccc;
    width: 50px;
    display: inline-block;
    vertical-align: middle;
  }

  .inputs-container label {
    display: block;
    padding: 8px 0;
    font-weight: bolder;
  }

  .inputs-container input[type=text],
  .inputs-container input[type=password] {
    display: block;
    outline: none;
    padding: 8px;
    width: 100%;
    border: solid 2px #ccc;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .inputs-container input[type=text]:hover,
  .inputs-container input[type=password]:hover {
    border: solid 2px #287F6B;
  }

  .inputs-container input[type=text]:focus,
  .inputs-container input[type=password]:focus {
    border: solid 2px #1E6657;
  }

  .options-container {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
  }

  .options-container div {
    display: flex;
    align-items: center;
  }

  .options-container div.right {
    text-align: right;
  }

  .options-container div input[type="checkbox"] {
    margin-right: 8px;
  }

  .buttons-container {
    margin-top: 40px; 
    text-align: center;
  }

  .buttons-container button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-login {
    border: 0;
    background-color: #287F6B;
    border-radius: 4px;
    color: white;
    padding: 8px;
    width: 100%;
    cursor: pointer;
  }

  .btn-login:hover {
    background-color: #1E6657;
  }

  .register-container {
    padding: 16px 0;
    text-align: center;
  }

  .register-container span {
    margin-right: 8px;
  }
  
  a {
    color: black;
    font-weight: bolder;
  }

  a:hover {
    color: #4548AD;
  }

  @media screen and (max-width: 768px) {
    .main-container {
      flex-direction: column;
      padding: 12px;
    }
    .left-container, .right-container {
      width: 100%;
    }
    .title-container h2 {
      padding: 12px;
      font-size: 32px;
    }
    .form-container {
      max-width: 100%;
      padding: 10px;
    }
    .btn-google {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }
    .right-container {
      display: none;
    }
  }
</style>