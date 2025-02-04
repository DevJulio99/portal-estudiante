import { useProfileStore } from "~/stores/profile";
import type { RegistrarPostulante } from "~/types/postulante.types";

export const buscarPostulante = async () => {
  const { $api } = useNuxtApp();
  const profileStore = useProfileStore();
  const postulanteStore = usePostulanteStore();
  setTimeout(async () => {
    const postulanteService = await $api.postulante.getPostulante(
      profileStore.profileData?.data?.documenIdentida ?? "",
      { lazy: true }
    );
    //console.log("postulanteService", postulanteService);
    if (postulanteService.error.value) {
      const bodyError = postulanteService.error.value.data;
      throw new Error(bodyError ? "nodata" : "other");
    }

    postulanteService.data.value?.data.length &&
      postulanteStore.setPostulante(postulanteService.data.value?.data[0]);
  }, 0);
};

export const getPostulante = async () => {
  console.log("getPostulante");
  const { $api } = useNuxtApp();
  const profileStore = useProfileStore();

  try {
    await buscarPostulante();
  } catch (e: any) {
    if (e.message == "nodata") {
      const request = {
        dni: profileStore.profileData.data?.documenIdentida ?? "",
        nombre: profileStore.profileData.data?.fullName ?? "",
        apellido: "",
        correo: profileStore.profileData.data?.correoPersonal ?? "",
        estado: true,
      } as RegistrarPostulante;

      const registrarPostulante = await $api.postulante.registrarPostulante(
        request,
        { lazy: true }
      );

      if (!registrarPostulante.error.value) {
        buscarPostulante();
      }
    }
  }
};
