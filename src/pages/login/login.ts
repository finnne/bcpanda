import { Component } from '@angular/core';
import { Events, NavParams } from 'ionic-angular';
import { Nav, Toast, Loading } from "../../class/helper";
import { Request } from "../../class/request";

import { Common } from '../../class/common';
import { Global } from '../../app/app.global';

import { RegisterPage } from '../register/register';

declare var JSEncrypt: any;


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[ Nav, Toast, Loading, Request ],
})



export class LoginPage {

	txtTel: string;
	txtPwd: string;
	pwdSwitch = false;

	constructor(
		private navParams: NavParams,
		private events: Events,
		private request: Request,
		private nav: Nav,
		private toast: Toast,
		private loading: Loading,
	){

	}

	ngOnInit(){
		this.logout();
	}

	registerLinkClick(){
		let params = this.navParams.data;
		this.nav.root.push(RegisterPage, params);
	}
	
	loginClick() {
		if(!this.checkForm()) return;
		let that = this;
		that.loading.show();
		let getPublicKey=new Promise(function(resolve,reject){		
			// that.request.get('assets/json/a.json')
			that.request.get(Global.domain +'/app/security/getPublicKey/')
			.success(dic => {  	
				if(dic.code==0){
					resolve(dic.result);
				}else{
					reject(dic.msg);
				}
			})
			.error(err => {
				reject();
			});
		});
		
		getPublicKey.then(function(publicKey){

			let encrypt = new JSEncrypt();
			encrypt.setPublicKey(publicKey);
			let ecPwd = encrypt.encrypt(that.txtPwd);
		    let data = {
		        "userName": that.txtTel,
		        "password" : ecPwd,
		        "appType" : Global.appType,
				"deviceName": Global.Channel,
				"deviceModel": Global.Channel,
				"deviceId": Global.Channel,
				"osName": Global.Channel,
				"osVersion": Global.Channel,
				"appVersion": Global.Channel,
		    };
		    
		    // that.request.get('assets/json/a.json')
		    that.request.post({
		    	url: Global.domain +'/app/security/pandaLogin', 
		    	data: data,
		    })
			.success(dic => {
				that.loading.hide();
				if(dic.code==0){				
					Global.setLoginToken(dic.result);
					that.events.publish('updateMinePage');				
					let tabNum = that.navParams.get('tabNum');
					let back = that.navParams.get('back');
					if(tabNum) that.nav.tab.select(tabNum);
					if(back && back.view=='root'){
						that.nav.root.popTo(back.index);
					}
					else{
						that.nav.root.popToRoot();
					}
				}else{
					that.toast.show(dic.msg);
				}
			})
			.error(() =>{
				that.loading.hide();
			});

		}).catch(function(ErrMsg){
			that.loading.hide();
		    if(ErrMsg)
		    	that.toast.show(ErrMsg);
		});
	}

	checkForm(){
		if(Common.Verify.isEmpty(this.txtTel)){
			this.toast.pop('手机号码不能为空');
			return false;
		}
		if(!Common.Verify.mobile(this.txtTel)){
			this.toast.pop('手机号码格式有误');
			return false;
		}
		if(!Common.Verify.password(this.txtPwd)){
			this.toast.pop('密码格式有误');
			return false;
		}
		return true;
	}

	logout(){
		this.request.get(Global.domain +'/app/security/logout')
		.success(dic => {
		})
		.error(() => {
		})
		.logout(()=>{
		});
	}

	// getToken() {
	// 	this.request.get(Global.domain +'/panda/getPandaToken')
	// 	.success(dic => {
	// 		if(dic.code==0){
	// 			console.log(dic.result)
	// 		}else{
	// 			this.toast.show(dic.msg);
	// 		}
	// 	})
	// }

}
