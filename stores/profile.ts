import { defineStore } from 'pinia';
import type { ProfileDataStore } from '~/types/profile.types';
import profileStoreMock from "~/utils/data/profileStoreMock.json";

export const useProfileStore = defineStore('profileStore', {
	state: () => {
		return {
			profileData: {
				data: null,//profileStoreMock as any,
				pending: false,
				error: null,
			} as ProfileDataStore,
		};
	},
	actions: {
		setProfileData(payload: ProfileDataStore) {
			this.profileData = payload;
		},
		clearPorfileData(){
			this.profileData = {
				data: null,
				pending: false,
				error: null,
			} as ProfileDataStore
		}
	},
});
