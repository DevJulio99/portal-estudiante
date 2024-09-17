<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
    checkedOption: string;
    onResponse: (option: string) => void;
  }>(), {
    checkedOption: `option`
  }
  );

  const showQuestions = ref(true);

const opciones = [
    {
      title: 'Alternativa 1',
      description : `Había una vez tres cerditos que vivían al aire libre cerca del bosque. 
      A menudo se sentían inquietos porque por allí solía pasar un lobo 
      malvado y peligroso que amenazaba con comérselos.`,
      active: true
    },
    {
      title: 'Alternativa 2',
      description : `El cerdito mediano era un poco más decidido que el pequeño, pero 
      tampoco tenía muchas ganas de trabajar.`,
      active: false
    },
    {
      title: 'Alternativa 3',
      description : `El cerdito más pequeño, que era muy vago, decidió que su casa sería de paja. Durante unas horas se dedicó a apilar cañitas secas y en un santiamén, construyó su nuevo hogar. Satisfecho, se fue a jugar.`,
      active: false
    },
    {
      title: 'Alternativa 4',
      description : `Pensó que una casa de madera sería suficiente para estar seguro, así que se internó en el bosque y acarreó todos los troncos que pudo para construir las paredes y el techo. `,
      active: false
    }
  ];

  const onSelect = (id: string) => {
    const element = document.getElementById(id);
    if(element){
      element.click();
      props.onResponse(id);
    }
  }

  onBeforeUpdate(() => {
    console.log('update')
  })

</script>
<template>

    <div class="relative w-fit">
      <div class="absolute left-[-42px] top-[15px]">
          <div class="btn-show relative flex justify-center items-center w-[28px] h-[31px] bg-[#3A5475] rounded-md cursor-pointer" @click="() => showQuestions = !showQuestions">
            <div class="w-max tooltp absolute text-[8px] top-[-34px] py-2 px-3 bg-[#3A5475] rounded-md text-white">
               {{ showQuestions ? 'Ocultar preguntas' : 'Ver preguntas' }}
            </div>
            <nuxt-icon
			           filled
			           :class="`text-2xl cursor-pointer`"
			           name="upn-icon-nav-arrow-white-left" 
		        />
          </div>
      </div>

      <div :class="`flex flex-wrap gap-[11px] max-h-[469px] transition-all overflow-hidden ${showQuestions ? 'w-[577px]' : 'w-0 h-0'}`">
        <span class="w-full block text-sm font-semibold mb-[15px]">Pregunta N° 1: La idea principal del texto es...</span>
        <!-- <p>option {{ checkedOption }}</p> -->
        <div v-for="(opcion, index) in opciones" class="flex w-full cursor-pointer px-[11px] pt-[10px] pb-[7px] border 
          border-[#B3B3B3] rounded-[10px] gap-2 items-center transition-colors" 
          @click="() => onSelect(`option${index + 1}`)"
          :class="`option${index + 1}` === checkedOption ? 'bg-cyan_5' : ''">
            <input type="radio" name="optionsEV" :id="`option${index + 1}`" :value="`option${index + 1}`" :checked="checkedOption === `option${index + 1}`">
            <div>
              <span class="block font-semibold mb-2.5 text-xs font-normal">{{ opcion.title }}</span>
              <p class="text-xs font-normal">{{ opcion.description }}</p>
            </div>
        </div>
    </div>
    </div>

</template>

<style scoped>
.tooltp {
 visibility: hidden;
}

.tooltp::after {
	content: '';
	display: block;
	position: absolute;
	width: 0;
	height: 0;
	background-color: transparent;
	bottom: -5px;
	border: 6.93px solid transparent;
	border-bottom: 0;
	border-top: 6px solid #3A5475;
	text-align: center;
	transform: translateX(-60%);
	left: 50%;
}

.btn-show:hover .tooltp {
  visibility: visible;
}
</style>