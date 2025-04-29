<script setup lang="ts">
// import { useMediaQuery } from '@vueuse/core';

const menuStore = useMenuStore();

const profileStore = useProfileStore();

const notificationStore = {
  notificationData: {
    data: {
        data: []
    },
    pending: false,
    error: null,
  },
  getItemsVistos: () => 0
};
const route = useRoute();
const showCardNotifications = ref<boolean>(false);
const validImg = ref(true);
const isLargeScreen = true;//useMediaQuery("(min-width: 1024px)");
const viewAccessDenied =
  route.name?.toString()?.includes("access-denied") ?? false;

const redirectHome = () => {
  return navigateTo("/inicio", { replace: true });
};

const eventClick = () => {
	menuStore.toggleMenuProfile();
};
</script>

<template>
  <header
    class="header"
    :class="{
      'shadow-bgBox': !menuStore.menuNav && !menuStore.menuProfile,
      'border-b-[1px] border-b-[#C2D1D9] md:border-none':
        menuStore.menuNav || menuStore.menuProfile,
    }"
  >
    <button
      v-if="!menuStore.headerMenuData.pending"
      :aria-label="
        menuStore.menuNav ? 'Cerrar menu navegación' : 'Abrir menu navegación'
      "
      class="h-[24px] w-[24px] mr-2 md:hidden"
      @click="() => {
        menuStore.toggleMenuNav();
      }"
    >
      <nuxt-icon
        v-if="!menuStore.menuNav"
        name="burgerMenu"
        class="text-[24px]"
      />
      <nuxt-icon v-else name="closeIcon" class="text-[24px]" />
    </button>
    <nuxt-icon
      name="codesti"
      filled
      class="custom-style absolute left-14 md:left-2 cursor-pointer w-[140px]"
      @click="redirectHome"
    />
    <MenuInfoDesktop
      v-if="
        isLargeScreen && !menuStore.headerMenuData.pending && !viewAccessDenied
      "
    />
    <div :class="`flex items-center py-3 ml-auto`">
      <!-- <div v-if="!viewAccessDenied" class="me-5 lg:me-2">
        <MenuInfoMenuBtnNotification
          :count="notificationStore.getItemsVistos() || 0"
          :isActive="showCardNotifications"
        />
      </div> -->
      <div v-if="!viewAccessDenied" class="flex items-center cursor-pointer" :class="{
						'lg:shadow-[_0_0_0_1px_#A1D7FF] lg:bg-cyan_10 lg:rounded':
							menuStore.menuProfile,
					}"
        @click.stop="eventClick">
        <div class="text-right text-sm mr-1 hidden lg:block w-[220px]">
          <p class="font-bold capitalize truncate">
            {{ profileStore.profileData.data?.fullName?.toLowerCase() }}
          </p>

        </div>
        <button
          v-if="!menuStore.menuProfile || isLargeScreen"
          :aria-label="menuStore.menuProfile ? 'Cerrar menú' : 'Abrir menú'"
          class="flex items-center relative"
        >
          <img
            :src="
              profileStore.profileData.data?.fotoUrlLow && validImg
                ? profileStore.profileData.data?.fotoUrlLow
                : '/images/userProfile.png'
            "
            class="h-auto max-w-[40px] lg:mr-1 rounded-full"
            loading="lazy"

          />
          <nuxt-icon
            name="NavArrowDown"
            filled
            class="hidden lg:block custom-style"
            :class="{ 'rotate-180': menuStore.menuProfile }"
          />
          <BaseIconBgCircle styles="absolute bottom-0 right-0 lg:!hidden" />
        </button>
        <button v-else aria-label="Cerrar menu">
          <nuxt-icon name="closeIcon" filled class="text-[24px]" />
        </button>
      </div>
    </div>
  </header>
  <!-- <MenuNotificationList
    v-if="showCardNotifications"
    :notifications="notificationStore.notificationData.data?.data || []"
    :closeNotifications="handleNotifications"
    @save-notification="addNotification"
  /> -->
</template>

<style>
.custom-style.nuxt-icon svg {
	width: initial;
	height: initial;
	margin-bottom: 0;
}
</style>

<style lang="postcss" scoped>
.header {
	@apply fixed md:shadow-bgBox bg-white h-[64px] w-full flex px-6 md:pl-2 md:pr-6 z-40 md:col-span-2 justify-between items-center;
}
</style>