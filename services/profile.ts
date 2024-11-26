import { useProfileStore } from '~/stores/profile';


export const getProfile = async (codAlum: number) => {
    const { $api } = useNuxtApp();
    const profileStore = useProfileStore();
    console.log('codAlum', codAlum)
    console.log('profileStore.profileData.data', profileStore.profileData.data)
	if (profileStore.profileData.data) return;
	const { data, pending, error } = await $api.profile.getProfile(codAlum, {
		lazy: true,
	});
    console.log('data', data)
	// profileStore.setProfileData({
	// 	data: null,
	// 	pending,
	// 	error: {
	// 		icono: '',
	// 		titulo: '',
	// 		descripcion: '',
	// 		default: Boolean(error) ?? false,
	// 	},
	// });
	watch(data, (response) => {
        console.log('response profile', response);
		if (response?.data.length) {
			profileStore.setProfileData({
				data: response.data[0] ?? null,
				pending,
				error: null,
			});
		} else {
			profileStore.setProfileData({
				data: profileStore.profileData.data,
				pending,
				error: {
					icono: '',
					titulo: '',
					descripcion: '',
					default: false,
				},
			});
		}
	});
};