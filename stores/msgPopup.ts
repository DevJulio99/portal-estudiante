
import { defineStore } from 'pinia';

interface MsgPopUpState {
	show: boolean;
	message: string;
	type: 'success' | 'error' | 'warning';
	showBottom: boolean;
	messageBottom: string;
}

export const useMsgPopUpStore = defineStore('msgPopup', {
	state: (): MsgPopUpState => ({
		show: false,
		message: '',
		type: 'success',
		showBottom: false,
		messageBottom: '',
    }),
	actions: {
		_show(message: string, type: 'success' | 'error' | 'warning') {
			this.message = message;
			this.type = type;
			this.show = true;
		},

		showSuccess(message: string) {
			this._show(message, 'success');
		},

		showError(message: string) {
			this._show(message, 'error');
		},

		showWarning(message: string) {
			this._show(message, 'warning');
		},

		setErrorBottom(status: boolean, message: string) {
			this.showBottom = status;
			this.messageBottom = message;
		},
	},
});
