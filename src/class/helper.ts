import { Injectable } from '@angular/core';
import { App, NavController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { Common } from '../class/common';

@Injectable()
export class Nav {
	constructor(
		private appCtrl: App,
		private navCtrl: NavController,
	){}

	root = this.appCtrl.getRootNav();
	tab = this.appCtrl.getRootNav()._children[0];
	view = this.navCtrl;
}

@Injectable()
export class Toast {
	constructor(
		private toastCtrl: ToastController,
	){}

	show(msg, position?, duration?) {
		let callback = new PopCallback();
		let toast = this.toastCtrl.create({
			message: msg,
			position: position || 'top',
			duration: duration || 3000,
			// dismissOnPageChange: true,
		});
		toast.onDidDismiss(() => {
			if(callback.dismissFunc) 
				callback.dismissFunc();
		});
		toast.present();
		return callback;
	}

	pop(msg, duration?) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: duration || 3000,
			position: 'middle',
			cssClass: 'toast_show',
		});
		setTimeout(() => {
			toast.present();
		}, 500);
	}

	block(msg, type?, duration?) {
		let callback = new PopCallback();
		let strMsg = Common.splitString(msg, 8).join('\r\n');
		let toast = this.toastCtrl.create({
			message: strMsg,
			duration: duration || 3000,
			position: 'middle',
			cssClass: 'toast_block'+ (type ? ' '+type : ''),
		});
		toast.onDidDismiss(() => {
			if(callback.dismissFunc) 
				callback.dismissFunc();
		});
		//设置延迟错开loading图标时间
		setTimeout(() => {
			toast.present();
		}, 500);
		return callback;
	}

}	


@Injectable()
export class Alert {
	constructor(
		private alertCtrl: AlertController,
	){}

	show(param) {
		let strMsg = Common.splitString(param.msg, 16).join('\r\n');
		let alert = this.alertCtrl.create({
			title: param.title,
			subTitle: strMsg,
			buttons: [param.btn]
		});
		alert.present();
	}

	confirm(param) {
		let strMsg = Common.splitString(param.msg, 16).join('\r\n');
		let alert = this.alertCtrl.create({
			title: param.title,
			message: strMsg,
			buttons: param.btns,
		});
		alert.present();
	}

	prompt(param) {
		let alert = this.alertCtrl.create({
			title: param.title,
			inputs: param.inputs,
			buttons: param.btns,
		});
		alert.present();
	}


}


@Injectable()
export class Loading {
	constructor(
		public loadingCtrl: LoadingController,
	){}

	loading = null;

	show(){
		this.loading = this.loadingCtrl.create({
			spinner: 'crescent',
		});
		this.loading.present();
	}

	hide(){
		if(!this.loading) return;
		this.loading.dismiss();
	}
}


class PopCallback { 
	dismissFunc: Function;
	dismiss (func){
		this.dismissFunc = func;
		return this;
	}
}