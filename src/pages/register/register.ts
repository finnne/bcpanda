import { Component } from '@angular/core';
import { NavParams, Events } from 'ionic-angular';
import { Nav, Toast, Loading } from "../../class/helper";
import { Request } from "../../class/request";

import { Common } from '../../class/common';
import { Global } from '../../app/app.global';

import { AgreementPage } from '../agreement/agreement';

declare var JSEncrypt: any;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers:[ Nav, Toast, Loading, Request ],
})



export class RegisterPage {

	constructor(
		private navParams: NavParams,
		private events: Events,
		private request: Request,
		private nav: Nav,
		private toast: Toast,
		private loading: Loading,
	){}

	txtTel: string;
	txtSmsCode: string;
	txtImageCode: string;
	txtPwd: string;

	imageCodeSwitch: string;
	pwdSwitch = false;
	agreeState = true;
	

	ngOnInit() {
		this.getImageCodeSwitch();
	}

	// 返回登录页面
	backToLogin(){
		this.nav.view.pop();
	}

	navToAgreement(){
		this.nav.view.push(AgreementPage);
	}

	// 图片验证码提交事件
	imageCodeBtnClick(){
	    if(Common.Verify.isEmpty(this.txtImageCode)){
			this.toast.pop('请输入图片验证码');
			return;
		}
		let that = this;
		let callbackFoo = function(dic){
			if(dic.code==0){
				that.popImageCodeLayer(false);
				that.toast.pop('短信验证码已发送');
				Common.btnCountdown('smsBtn');
			}
			else if(dic.code == 2202){
				that.toast.pop('图片验证码错误');
				that.refreshImageCode();
				that.txtImageCode = '';
			}else{
				that.toast.show(dic.msg);
				that.refreshImageCode();
				that.txtImageCode = '';
			}
		}
		this.sendSmsCode(this.txtTel, this.txtImageCode, callbackFoo);
	}

	// 短信验证码按钮事件
	smsBtnClick(){
		if(Common.Verify.isEmpty(this.txtTel)){
			this.toast.pop('手机号码不能为空');
			return;
		}
		if(!Common.Verify.mobile(this.txtTel)){
			this.toast.pop('手机号码格式有误');
			return;
		}

		this.request.get(Global.domain +'/app/security/validatePhone/'+this.txtTel,)
		.success(dic => {    	
			if(dic.code==0){
				if(this.imageCodeSwitch=='1'){
					this.popImageCodeLayer(true);
				}else{
					let that = this;
					let callbackFoo = function(dic){
						if(dic.code==0){
							that.toast.pop('短信验证码已发送');
							Common.btnCountdown('smsBtn');
						}else{
							that.toast.show(dic.msg);
						}
					}
					this.sendSmsCode(this.txtTel, '-1', callbackFoo);
				}
			}
			else{
				this.toast.show(dic.msg);
			}
		});

		
	}

	// 注册按钮事件
	registerClick() {
		if(!this.checkForm()) return;
		this.loading.show();
		let that = this;	
		let getPublicKey = this.promisePublicKey();
		getPublicKey.then(function(publicKey){	
			let encrypt = new JSEncrypt();
			encrypt.setPublicKey(publicKey);
			let ecPwd = encrypt.encrypt(that.txtPwd);
		    let params = {
		        "userName": that.txtTel,
		        "password" : ecPwd,
		        "authCode" : that.txtSmsCode,
		        "appChannel" : Global.Channel,
		        "appType" : Global.appType,
		    };
		    that.request.post({
		    	url: Global.domain +'/app/security/register', 
		    	data: params
		    })
			.success(dic => {
				that.loading.hide();  	
				if(dic.code==0){
					that.autoLogin();
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

	// 注册后自动登录
	autoLogin(){
		let that = this;	
		let pp = this.promisePublicKey();
		pp.then(function(publicKey){
			let encrypt = new JSEncrypt();
			encrypt.setPublicKey(publicKey);
			let ecPwd = encrypt.encrypt(that.txtPwd);	
			let params = {
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
			that.request.post({
				url: Global.domain +'/app/security/pandaLogin', 
				data: params
			})
			.success(dic => {	
				if(dic.code==0){
					Global.setLoginToken(dic.result);
					let tabNum = that.navParams.get('tabNum');
					if(tabNum) that.nav.tab.select(tabNum);
					that.events.publish('updateMinePage');
					that.toast.block('注册成功').dismiss(()=> {
						let back = that.navParams.get('back');
						if(back && back.view=='root'){
							that.nav.root.popTo(back.index);
						}
						else{
							that.nav.root.popToRoot();
						}
					});
				}else{
					that.backToLogin();
				}
			});
		}).catch(function(err){
			that.backToLogin();
		});		
	}

	// 表单验证
	checkForm(){
		if(Common.Verify.isEmpty(this.txtTel)){
			this.toast.pop('手机号码不能为空');
			return false;
		}
		if(!Common.Verify.mobile(this.txtTel)){
			this.toast.pop('手机号码格式有误');
			return false;
		}
		if(Common.Verify.isEmpty(this.txtSmsCode)){
			this.toast.pop('请输入短信验证码');
			return false;
		}
		if(!Common.Verify.password(this.txtPwd)){
			this.toast.pop('密码格式有误');
			return false;
		}
		if(!this.agreeState){
			this.toast.pop('请先同意《用户服务协议》');
			return false;
		}
		return true;
	}

	// 获取图片验证码开关配置
	getImageCodeSwitch(){
		this.request.get(Global.domain +'/app/common/getAllParams')
		.success(
			dic => {
				if(dic.code==0){
					this.imageCodeSwitch = dic.result['register_imagecode_switch'];
				}else{
					this.toast.show(dic.msg);
				}
			}
		);
	}

	// 发送短信验证码
	sendSmsCode(telNum, imgCode, callback){
		let api = Global.domain +'/app/common/sendAuthCode/new/'+ telNum +'/1/'+ imgCode;
		this.request.get(api)
		.success(dic => {			
			callback(dic);
		});
	}

	// 图片验证码层弹出
	popImageCodeLayer(flag){
		if(flag){
			this.refreshImageCode();
			document.getElementById('imageCodeLayer').style.display = 'block';
			document.getElementById('txtImageCode').focus();
		}
		else{
			document.getElementById('imageCodeLayer').style.display = 'none';
		}
	}

	// 图片验证码刷新
	refreshImageCode(){
		var r = new Date().getTime();
		var imgPath = Global.domain +'/app/common/getSendAuthCodeImageCode?r='+r ;
		document.getElementById('imgImageCode').setAttribute('src',imgPath);
	}

	// 获取秘钥promise
	promisePublicKey(){
		let that = this;
		return new Promise(function(resolve,reject){
			that.request.get(Global.domain +'/app/security/getPublicKey/')
			.success(dic => {    	
				if(dic.code==0){
					resolve(dic.result);
				}
				else{
					reject(dic.msg);
				}
			})
			.error(err=>{
				reject();
			});
		});
	};

}
