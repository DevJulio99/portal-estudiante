<script setup lang="ts">
import type { ResponseLogin } from "~/types/login.types";
import { getProfile } from '~/services/profile';
import { Roles } from '~/types/roles.types';

const userLogin = ref({
  email: "",
  password: "",
});
const tokenStore = useTokenStore();
const captchaStore = useCaptcha();
const router = useRouter();
const { $api } = useNuxtApp();
const pendingLogin = ref<boolean>(false);
const textLogin = ref<string>('Iniciar sesión');
const errorMessage = ref<string>('');
const showError = ref<boolean>(false);

watch(() => tokenStore.pending, (newValue) => {
  if (newValue && (showError.value || !pendingLogin.value)) {
    nextTick(() => {
      tokenStore.setPending(false);
    });
  }
});

watch(() => captchaStore.error, (err) => {
   if(err){
    setError("CAPTCHA no válido.");
   }
})

async function handleFormSubmit(event: Event) {
  event.preventDefault();
  event.stopPropagation();
  
  tokenStore.setPending(false);
  
  const isvalid = Object.values(userLogin.value).every(
    (x) => x.trim().length > 0
  );
  const captchaId = captchaStore.data?.captchaId;

  if (!isvalid) {
    setError("Complete todos los campos");
    return false;
  }
  
  if(!captchaId) {
    setError("CAPTCHA no válido.");
    return false;
  }
  
  textLogin.value = 'Ingresando...';
  pendingLogin.value = true;
  
  try {
    const loginData = await $api.login.loginDirect(
      userLogin.value.email, 
      userLogin.value.password, 
      captchaId, 
      captchaStore.captchaModel
    );
    
    await handleLoginSuccess(loginData);
    return false;
    
  } catch (error: any) {
    pendingLogin.value = false;
    textLogin.value = 'Iniciar sesión';
    tokenStore.setPending(false);
    handleLoginError(error);
    return false;
  }
}

function handleLoginError(error: any) {
  const errorResponse = error.data || error.response?.data || error;
  const errorCode = errorResponse?.code || errorResponse?.data?.code;
  const status = error.status || error.statusCode;
  
  let errorMsg = "Error al iniciar sesión. Inténtalo nuevamente.";
  
  switch (errorCode) {
    case 'PS-EVAL-4000':
      errorMsg = "Correo o contraseña incorrecta";
      refreshCaptcha();
      break;
    case 'PS-EVAL-4001':
      errorMsg = "CAPTCHA no válido.";
      break;
    case 'PS-EVAL-4003':
      errorMsg = "Usuario o contraseña incorrectos. Inténtalo nuevamente.";
      break;
    default:
      if (status === 401) {
        errorMsg = "Usuario o contraseña incorrectos. Inténtalo nuevamente.";
      } else {
        errorMsg = errorResponse?.message || errorResponse?.Message || errorMsg;
      }
  }
  
  setError(errorMsg);
}

async function handleLoginSuccess(loginData: ResponseLogin) {
  pendingLogin.value = false;
  textLogin.value = 'Iniciar sesión';
  tokenStore.setPending(true);
  
  try {
    tokenStore.setToken(loginData.accessToken, loginData.refreshToken);
    localStorage.setItem("access", JSON.stringify(loginData));
    await getProfile(tokenStore.getDataToken.Dni_Usuario);
    
    const userRole = tokenStore.getDataToken?.Role?.toLowerCase();
    const redirectPath = userRole === Roles.Admin ? "/alumnos" : "/inicio";
    await router.push(redirectPath);
  } catch (err) {
    tokenStore.setPending(false);
    setError("Error al procesar el inicio de sesión. Inténtalo nuevamente.");
  }
}

function changeEl(ev: any) {
  userLogin.value = {
    ...userLogin.value,
    [ev.target.name]: ev.target.value,
  };
  // Ocultar el error cuando el usuario empieza a escribir
  if (showError.value) {
    showError.value = false;
    errorMessage.value = '';
  }
}

function setError(msg = "Correo o contraseña incorrecta") {
  tokenStore.setPending(false);
  errorMessage.value = msg;
  showError.value = true;
  
  setTimeout(() => {
    showError.value = false;
  }, 5000);
}

const validCaptcha = async() => {
  if(captchaStore.captchaModel.replaceAll(/\s+/g, '').length < 4) return
  captchaStore.data && await captchaStore.validarCaptcha(captchaStore.data.captchaId, captchaStore.captchaModel);
}

const refreshCaptcha = () => {
  captchaStore.refrescarCaptcha();
}

onMounted(() => {
  tokenStore.setPending(false);
  tokenStore.setIsLoggingOut(false);
  captchaStore.generarCaptcha();
})

</script>

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
          <form @submit.prevent="handleFormSubmit">
            <div class="inputs-container">
              <label for="email">USUARIO</label>
              <input 
                id="email" 
                type="text" 
                name="email" 
                @input="changeEl"
                autocomplete="username"
              >

              <label for="password">CONTRASEÑA</label>
              <input 
                id="password" 
                type="password" 
                name="password" 
                @input="changeEl"
                autocomplete="current-password"
              >

              <!-- Mensaje de error visible ANTES del CAPTCHA para mayor visibilidad -->
              <Transition name="error-fade">
                <div v-if="showError && errorMessage" class="error-message-container" key="error-msg">
                  <p class="error-message">{{ errorMessage }}</p>
                </div>
              </Transition>

              <BaseCaptchaForm />

              <div class="buttons-container">
                <button 
                  class="btn-login" 
                  type="submit"
                  :disabled="!captchaStore.captchaValido || pendingLogin"
                >
                  {{ textLogin }}
                </button>
              </div>
            </div>
          </form>

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

  .buttons-container {
    margin-top: 40px; 
    text-align: center;
  }

  .buttons-container button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message-container {
    margin-top: 16px;
    margin-bottom: 16px;
    padding: 16px;
    background-color: #fee;
    border: 2px solid #f00;
    border-radius: 4px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(204, 51, 51, 0.3);
    animation: shake 0.5s;
  }

  .error-message {
    color: #c33;
    font-weight: bold;
    font-size: 15px;
    margin: 0;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  .error-fade-enter-active,
  .error-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .error-fade-enter-from,
  .error-fade-leave-to {
    opacity: 0;
  }

  .btn-login {
    border: 0;
    background-color: #287F6B;
    border-radius: 4px;
    color: white;
    padding: 8px;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn-login:hover:not(:disabled) {
    background-color: #1E6657;
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
    .right-container {
      display: none;
    }
  }
</style>
