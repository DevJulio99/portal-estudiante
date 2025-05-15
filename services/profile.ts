import { useProfileStore } from '~/stores/profile';


export const getProfile = async (codAlum: string) => {
    const { $api } = useNuxtApp();
    const profileStore = useProfileStore();

    console.log('codAlum', codAlum)
    console.log('profileStore.profileData.data', profileStore.profileData.data)
	if (profileStore.profileData.data) return;
	const responseProfile = await $api.profile.getProfile(codAlum);
	
    if(!responseProfile.error.value && responseProfile.data.value?.data?.[0]){
		profileStore.setProfileData({
			data: responseProfile.data.value?.data[0] ?? null,
			pending: false,
			error: null,
		});
	}

	if(!responseProfile.error.value && !responseProfile.data.value?.data?.[0]){
		profileStore.setProfileData({
			data: profileStore.profileData.data,
			pending: false,
			error: {
				icono: '',
				titulo: '',
				descripcion: '',
				default: false,
			},
		});
	}
	// const unWatch = watch(data, (response) => {
    //     console.log('response profile', response);
	// 	if (response?.data.length) {
	// 		profileStore.setProfileData({
	// 			data: response.data[0] ?? null,
	// 			pending,
	// 			error: null,
	// 		});
	// 	} else {
	// 		profileStore.setProfileData({
	// 			data: profileStore.profileData.data,
	// 			pending,
	// 			error: {
	// 				icono: '',
	// 				titulo: '',
	// 				descripcion: '',
	// 				default: false,
	// 			},
	// 		});
	// 	}
	// 	console.log('unWatch profile')
	// 	unWatch();
	// });
};