import { defineStore } from 'pinia';
import {
	type MainMenuData,
	type HeaderMenuData,
	type FooterMenuData,
} from '~/types/menu.types';
import dataMenuMock from "~/utils/data/dataMenuMock.json";

export const useMenuStore = defineStore('menuStore', {
	state: () => {
		return {
			menuNav: false,
			menuProfile: false,
			menuInfo: false,
			mainMenuData: {
				data: dataMenuMock,
				pending: false,
				error: null,
			} as MainMenuData,
			headerMenuData: {
				data: null,
				pending: false,
				error: null,
			} as HeaderMenuData,
			footerMenuData: {
				data: null,
				pending: false,
				error: null,
			} as FooterMenuData,
		};
	},
	getters: {
		validMenu(): any {
			const valid = this.mainMenuData.data?.filter((item: any) => {
				if (!item.submenu.length) return item.url || useGetRoute(item.etiqueta);
				return item.submenu.filter(
					(it: any) => useGetRoute(it.etiqueta) || it.url,
				).length;
			});

			return valid;
		},
	},
	actions: {
		setMainMenu(payload: MainMenuData) {
			this.mainMenuData = payload;
		},
		setHeaderMenu(payload: HeaderMenuData) {
			this.headerMenuData = payload;
		},
		setFooterMenu(payload: FooterMenuData) {
			this.footerMenuData = payload;
		},
		closeMenuNav() {
			this.menuNav = false;
		},
		toggleMenuNav() {
			this.menuNav = !this.menuNav;
			if (this.menuProfile || this.menuInfo) {
				this.menuProfile = false;
				this.menuInfo = false;
			}
		},
		closeMenuProfile() {
			this.menuProfile = false;
		},
		toggleMenuProfile() {
			this.menuProfile = !this.menuProfile;
			if (this.menuNav || this.menuInfo) {
				this.menuNav = false;
				this.menuInfo = false;
			}
		},
		closeMenuInfo() {
			this.menuInfo = false;
		},
		toggleMenuInfo() {
			this.menuInfo = !this.menuInfo;
			if (this.menuNav || this.menuProfile) {
				this.menuNav = false;
				this.menuProfile = false;
			}
		},
		resetMainMenuData(){
			this.mainMenuData.data = dataMenuMock;
		}
	},
});
