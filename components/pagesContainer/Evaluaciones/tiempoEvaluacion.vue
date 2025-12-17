<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';

export interface timeEvaluation {
  hour: string;
  min: string;
  seg: string;
}

const props = withDefaults(
  defineProps<{
	init?: boolean;
  onExpired: () => void;
  stop?: boolean;
  onfinish?: (time: timeEvaluation) => void;
  timeDefect?: timeEvaluation;
  customClass?: string;
  initialTimeMs?: number | null;
}>(),
{
  init: true,
  stop: false,
  onfinish: () => {},
  onExpired: () => {},
  customClass: ''
  }
);

// Variable reactiva para el tiempo restante, expuesta a través de v-model.
const remainingTime = defineModel<number>({ default: 0 }); // Tiempo restante en milisegundos
const hours = computed(() => Math.floor((remainingTime.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
const minutes = computed(() => Math.floor((remainingTime.value % (1000 * 60 * 60)) / (1000 * 60)));
const seconds = computed(() => Math.floor((remainingTime.value % (1000 * 60)) / 1000));
const littleTime = computed(() => minutes.value <= 20 && hours.value === 0);

// Formatea el tiempo para que siempre tenga dos dígitos
const formattedHours = computed(() => formatTime(hours.value));
const formattedMinutes = computed(() => formatTime(minutes.value));
const formattedSeconds = computed(() => formatTime(seconds.value));

// Variable para controlar el intervalo
let intervalId: ReturnType<typeof setInterval> | undefined = undefined;

const storeCompetencia = useCompetenciaStore();

const parseTimeToMilliseconds = (timeString: string): number => {
  if (!timeString || !/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    return 0;
  }
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
};

const initializeCountdown = () => {
  // Si se proporciona un tiempo restante inicial, usarlo.
  if (props.initialTimeMs != null && props.initialTimeMs > 0) {
    startTimer(props.initialTimeMs / 1000);
    return;
  }

  const competencia = storeCompetencia.competenciaSeleccionada;  
  if (!competencia || !competencia.horaInicio || !competencia.tiempoLimite) {
    return;
  }

  const { horaInicio, tiempoLimite } = competencia;
  
  const startTime = new Date();
  const [startHours, startMinutes, startSeconds] = horaInicio.split(':').map(Number);
  startTime.setHours(startHours, startMinutes, startSeconds, 0);

  // 2. Calcular la duración en milisegundos
  const durationMs = parseTimeToMilliseconds(tiempoLimite);

  const endTime = new Date(startTime.getTime() + durationMs);
  const now = new Date();
  
  const remainingMs = endTime.getTime() - now.getTime();
  console.log('remainingMs:', remainingMs);
  if (remainingMs > 0) {
    startTimer(remainingMs / 1000); // Convertir a segundos
  } else {
    // Si el tiempo ya expiró al cargar, llamamos a onExpired directamente.
    remainingTime.value = 0;
    props.onExpired();
  }
};

// Función para formatear el tiempo (añade un 0 delante si es menor que 10)
const formatTime = (time: number) => time < 10 ? `0${time}` : `${time}`;

// Función para iniciar el temporizador
const startTimer = (durationInSeconds: number) => {
console.log('startTimer:', durationInSeconds);
  remainingTime.value = durationInSeconds * 1000; // Convertir a milisegundos

  // Limpiar el intervalo anterior si existe
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Establecer el intervalo para actualizar el tiempo restante cada segundo
  intervalId = setInterval(() => {
    remainingTime.value -= 1000;

    // Si el tiempo se agota
    if (remainingTime.value <= 0) {
      clearInterval(intervalId);
      remainingTime.value = 0;
      props.onExpired();
    }
  }, 1000);
};

// Detener el temporizador cuando la prop 'stop' cambie a true
watch(() => props.stop, (isStopped) => {
  if (isStopped) {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;

      // Llama a la función onfinish con el tiempo restante
      props.onfinish({
        hour: formattedHours.value,
        min: formattedMinutes.value,
        seg: formattedSeconds.value
      });
    }
  } else {
    // Si se reanuda el temporizador, volver a iniciarlo con el tiempo restante
    startTimer(remainingTime.value / 1000);
  }
});

// Observar cambios en la competencia seleccionada para iniciar el temporizador
watch(() => storeCompetencia.competenciaSeleccionada, (competencia) => {
  if (competencia) {
    initializeCountdown();
  }
}, { immediate: true });

// Iniciar el temporizador cuando el componente se monta
onMounted(() => {
  initializeCountdown();
});

// Limpiar el intervalo cuando el componente se desmonta
onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="w-fit text-center" :class="customClass">
    <div id="time-test"></div>
    <div class="flex gap-[5px] text-gray_80 items-center">
      <div class="time-ev">
        <p>Hora</p><div><span>{{ formattedHours }}</span></div>
      </div>
      <div class="relative top-[6px]">:</div>
      <div class="time-ev">
        <p>Min</p><div><span>{{ formattedMinutes }}</span></div>
      </div>
      <div class="relative top-[6px]">:</div>
      <div class="time-ev">
        <p>Seg</p><div>
          <span
            >{{ formattedSeconds }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-ev div {
  @apply bg-white font-robotoCondensed text-2xl font-bold flex items-center justify-center shadow-xl rounded-[3px] py-1 px-2;
}

.time-ev p {
  @apply text-blue_light text-[8px] font-semibold leading-[15px];
}
</style>
