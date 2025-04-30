<script lang="ts" setup>

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
}>(),
{
  init: true,
  stop: false,
  onfinish: () => {},
  onExpired: () => {},
  customClass: ''
}
);

const littleTime = ref(true);
const wasStopped = ref(false);
const intervalTime = ref();
const stopTime = ref({
  countDownData: 0,
  now: 0
});

const storeCompetencia = useCompetenciaStore();

watch(() => storeCompetencia.tiempo, (tiempo)  => {
  if(tiempo > 0 ){
    initTime(tiempo);
  }
});

const initTime = (countDownDate_?: number, now_?: number) => {
  var timeEvaluation = 5;

  var countDownDate = countDownDate_ ?? new Date(new Date().getTime() + (timeEvaluation * 60 * 1000)).getTime();//new Date("Jan 5, 2030 15:37:25").getTime();

  const elememtTime = document.getElementById("time-test");
  const elememtHour = document.getElementById("hour");
  const elememtMin = document.getElementById("min");
  const elememtSeg = document.getElementById("seg");
  // console.log('countDownDate', countDownDate);
  // var currentDate = new Date();
  // now_ && currentDate.setTime(now_);
// Update the count down every 1 second
intervalTime.value = setInterval(function() {
  var current =  new Date();
  // Get today's date and time
  var now =  current.getTime();
  // console.log('now interval', now);
  // console.log('current interval', current);

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if(elememtHour && elememtMin && elememtSeg){
     // Output the result in an element with id="time-test"
  // elememtTime.innerHTML = days + "d " + hours + "h "
  // + minutes + "m " + (seconds < 10 ? `0${seconds}` : seconds) + "s ";
  elememtHour.innerHTML = formatTime(hours);
  elememtMin.innerHTML = formatTime(minutes);
  elememtSeg.innerHTML = formatTime(seconds);

  if(minutes > 20) {
    littleTime.value = false;
  }

  if(minutes <= 20) {
    littleTime.value = true;
  }

  // If the count down is over, write some text
  if (distance < 0) {
    clearInterval(intervalTime.value);
    elememtHour.innerHTML = '00';
    elememtMin.innerHTML = '00';
    elememtSeg.innerHTML = '00';
    props.onExpired && props.onExpired();
    // elememtTime.innerHTML = "EXPIRED";
  }

  if(props.stop){
    clearInterval(intervalTime.value);
    // console.log('distance', distance);
    // console.log('countDownDate', countDownDate);
    // console.log('now', now);
    stopTime.value = {
      countDownData: countDownDate,
      now
    };
    props.onfinish({
      hour: elememtHour.innerText,
      min: elememtMin.innerText,
      seg: elememtSeg.innerText
    })
  }
  }
}, 1000);
}

const formatTime = (time: number) => time < 10 ? `0${time}` : `${time}`;

onMounted(() => {
  setTimeout(() => {
    props.init && initTime(storeCompetencia.tiempo);
  }, 0);
});

onBeforeUpdate(() => {
  if(wasStopped.value){
    console.log('se detuvo va a volver a empezar');
    wasStopped.value = false;
    initTime(stopTime.value.countDownData, stopTime.value.now);
  }
  if(props.stop){
    wasStopped.value = true;
  }
})

onBeforeUnmount(() => {
  clearInterval(intervalTime.value);
})
</script>

<template>
  <div class="w-fit text-center" :class="customClass">
    <div id="time-test"></div>
    <div class="flex gap-[5px] text-gray_80 items-center">
      <div class="time-ev">
        <p>Hora</p>
        <div>
          <span id="hour"
            >{{ timeDefect?.hour ?? '00' }}</span
          >
        </div>
      </div>
      <div class="relative top-[6px]">:</div>
      <div class="time-ev">
        <p>Min</p>
        <div>
          <span id="min"
            >{{ timeDefect?.min ?? '00' }}</span
          >
        </div>
      </div>
      <div class="relative top-[6px]">:</div>
      <div class="time-ev">
        <p>Seg</p>
        <div>
          <span id="seg"
            >{{ timeDefect?.seg ?? '00' }}</span
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
