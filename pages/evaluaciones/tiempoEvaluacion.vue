<script lang="ts" setup>

const props = withDefaults(
  defineProps<{
	init: boolean;
  onExpired?: () => void;
}>(),
{
  init: true
}
);

const littleTime = ref(true);

const initTime = () => {
  var timeEvaluation = 10;
  
  var countDownDate = new Date(new Date().getTime() + (timeEvaluation * 60 * 1000)).getTime();//new Date("Jan 5, 2030 15:37:25").getTime();
  const elememtTime = document.getElementById("time-test");
  const elememtHour = document.getElementById("hour");
  const elememtMin = document.getElementById("min");
  const elememtSeg = document.getElementById("seg");
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
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
    clearInterval(x);
    elememtHour.innerHTML = '00';
    elememtMin.innerHTML = '00';
    elememtSeg.innerHTML = '00';
    props.onExpired && props.onExpired();
    // elememtTime.innerHTML = "EXPIRED";
  }
  }
}, 1000);
}

const formatTime = (time: number) => time < 10 ? `0${time}` : `${time}`;

onMounted(() => {
  props.init && initTime();
});
</script>

<template>
  <div class="w-fit text-center">
    <div id="time-test"></div>
    <span class="text-[10px] font-semibold">Tiempo restante</span>
    <div class="flex gap-[5px] items-baseline" >
       <div class="time-ev">
        <div><span id="hour" :class="littleTime ? 'text-error' : 'text-green_70'">00</span></div>
        <p>Hora</p>
       </div>
       <div>:</div>
       <div class="time-ev">
        <div><span id="min" :class="littleTime ? 'text-error' : 'text-green_70'">00</span></div>
        <p>Min</p>
       </div>
       <div>:</div>
       <div class="time-ev">
        <div><span id="seg" :class="littleTime ? 'text-error' : 'text-green_70'">00</span></div>
        <p>Seg</p>
       </div>
    </div>
  </div>
</template>

<style scoped>
.time-ev div{
  @apply bg-white text-base font-semibold flex items-center justify-center border-[0.5px] border-blue_light rounded-[3px] w-[27px] h-[24px];
}

.time-ev p {
    @apply text-blue_light text-[10px] font-semibold leading-[15px];
}
</style>