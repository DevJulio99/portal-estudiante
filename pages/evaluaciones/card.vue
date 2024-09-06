<script lang="ts" setup>
interface CardEvaluacion  {
    title: string;
    description: string;
    nameButton: string;
    img: string;
    alt: string;
    status: number;
    textStatus: string;
    link: string;
    nameLink?: string;
}
const props = defineProps<{
	data: CardEvaluacion;
}>();

const router = useRouter();

const status = () => props.data.status ? 'bg-green_70' : 'bg-yellow';
const goDetail = (name: string) => {
  router.replace(`/evaluaciones/${name}`);
}
</script>

<template>
  <div
    class="relative shadow-[0_4px_4px_#00000040] border border-gray_50 py-[15px] pr-[13px] pl-[10px] w-full h-auto lg:max-w-[341px] rounded-[6px] bg-white"
    :class="data.status ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'"
    >
    <div class="relative w-full mb-[12px]">
      <div
        class="w-full py-[5px] text-xs text-white font-telegraf rounded-[16px] absolute top-[-6px] left-[-5px] text-center lg:max-w-[201px]"
        :class="status()"
        >
        {{data.textStatus}}
      </div>
      <div class="w-full h-[157px] rounded-[6px] overflow-hidden">
        <img :src="data.img" :alt="data.alt">
      </div>
    </div>
    <span class="text-base font-bold text-blue_link pb-[9px] mb-[7px] block border border-gray_50 border-x-0 border-t-0">{{ data.title }}</span>
    <span class="text-xs mb-[90px] block">
      <p>{{ data.description }}</p>
      <a v-if="data.link.trim().length" class="underline text-url font-telegraf" :href="data.link" target="_blank">{{ data.nameLink }}</a>
    </span>
    <div class="w-full absolute bottom-[15px] left-0 pr-[13px] pl-[10px]">
      <BaseButton
       v-if="data.status"
			styles="!w-full !bg-blue_light text-white rounded-[6px]"
      @click="() => goDetail(data.title)"
		>
			{{data.nameButton}}
		</BaseButton>
    </div>
  </div>
</template>
