import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http';
import { ToastController, Events } from 'ionic-angular';

// import { Common } from '../class/common';
import { Global } from '../app/app.global';



@Injectable()
// export class Request {
// 	constructor(
// 		private http: HttpClient,
// 		private toastCtrl: ToastController,
// 		private events: Events,
// 	){
// 		if(this.events){}
// 	}

// 	get(params){
// 		let callback = new Callback();
// 		let p = {
// 			url: (typeof(params)=='string') ? params : params.url,
// 			data: params.data,
// 			timeout: params.timeout || 15,
// 			header: {
// 				...{
// 					'token': Global.loginToken,
// 					'Accept': 'application/json; charset=UTF-8',
// 				}, 
// 				...params.header,
// 			},
// 		}
// 		const headers = new HttpHeaders(p.header);
// 		this.http.get(
// 			p.url,
// 			{headers},
// 		)
// 		.subscribe(
// 			dic => {
// 				if(Global.debug){
// 					console.log('get', p.url);
// 					console.log('result', Common.clone(dic));
// 				}

// 				callback.logoutHandleFunc(dic, this);
// 				if(callback.successFunc){
// 					callback.successFunc(dic);
// 				}	
// 			},
// 			err => {
// 				if(Global.debug){
// 					console.log('get', p.url);
// 					console.log('error', err);
// 				}
// 				if(callback.errorFunc) 
// 					callback.errorFunc(err);
// 				this.showError('网络异常，请稍后重试。。');
// 			},
// 			// () => {
// 			// 	console.log('get', 'complete');
// 			// 	if(callback.finalFunc) 
// 			// 		callback.finalFunc();
// 			// }
// 		);
// 		return callback;
// 	}

// 	post(params){
// 		let callback = new Callback();
// 		let p = {
// 			url: (typeof(params)=='string') ? params : params.url,
// 			data: params.data,
// 			timeout: params.timeout || 15,
// 			header: {
// 				...{
// 					'token': Global.loginToken,
// 					'Accept': 'application/json; charset=UTF-8',
// 					'Content-Type':'application/json; charset=UTF-8',
// 				}, 
// 				...params.header,
// 			},
// 		}
// 		const headers = new HttpHeaders(p.header);
// 		this.http.post(
// 			p.url,
// 			p.data,
// 			{headers},
// 		)
// 		.subscribe(
// 			dic => {
// 				if(Global.debug){
// 					console.log('post', p.url);
// 					console.log('data', p.data);
// 					console.log('result', Common.clone(dic));
// 				}

// 				callback.logoutHandleFunc(dic, this);
// 				if(callback.successFunc){
// 					callback.successFunc(dic);
// 				}	
// 			},
// 			err => {
// 				if(Global.debug){
// 					console.log('post', p.url);
// 					console.log('data', p.data);
// 					console.log('error', err);
// 				}

// 				if(callback.errorFunc) 
// 					callback.errorFunc(err);
// 				// this.showError(err.status +': '+ err.statusText);
// 				this.showError('网络异常，请稍后重试。。');
// 			},
// 			// () => {
// 			// 	if(callback.finalFunc) 
// 			// 		callback.finalFunc();
// 			// }
// 		);
// 		return callback;
// 	}

// 	showError(msg) {
// 		let toast = this.toastCtrl.create({
// 			message: msg,
// 			position: 'bottom',
// 			duration: 3000,
// 		});
// 		toast.present();
// 	}

// 	// showLoading(){
// 	// 	this.loading = this.loadingCtrl.create({
// 	// 		spinner: 'crescent',
// 	// 	});
// 	// 	this.loading.present();
// 	// }

// 	// hideLoading(){
// 	// 	if(!this.loading) return;
// 	// 	this.loading.dismiss();
// 	// }
// }	


export class Request {

	constructor(
		private http: HTTP,
		private toastCtrl: ToastController,
		private events: Events,
	){
		if(this.events){}
	}

	get(params){
		let callback = new Callback();
		let p = {
			url: (typeof(params)=='string') ? params : params.url,
			data: params.data,
			timeout: params.timeout || 15,
			header: {
				...{
					'token': Global.loginToken,
					'Accept': 'application/json; charset=UTF-8',
				}, 
				...params.header,
			},
		}
		for(let key in p.header){
			this.http.setHeader('*', key, p.header[key]);
		}
		this.http.setRequestTimeout(p.timeout);
		this.http.get(p.url, p.data, {})
		.then(res => {
			let data ; 
			try{
				data = JSON.parse(res.data);
			}catch(e){
				data = res.data;
			}
			// if(Global.debug){
			// 	console.log('get', p.url);
			// 	console.log('result', Common.clone(res.data));
			// }
			callback.logoutHandleFunc(data, this);
			if(callback.successFunc){
				callback.successFunc(data);
			}
		})
		.catch(err => {
			// if(Global.debug){
			// 	console.log('get', p.url);
			// 	console.log('error', err);
			// }
			if(callback.errorFunc) 
				callback.errorFunc(err);
			// this.showError('网络异常，请稍后重试。。');
			this.showError(err);
		});
		return callback;
	}

	post(params){
		let callback = new Callback();
		let p = {
			url: (typeof(params)=='string') ? params : params.url,
			data: params.data,
			timeout: params.timeout || 15,
			contentType: params.contentType || 'json',
			header: {
				...{
					'token': Global.loginToken,
					'Accept': 'application/json; charset=UTF-8',
				}, 
				...params.header,
			},
		}
		for(let key in p.header){
			this.http.setHeader('*', key, p.header[key]);
		}
		this.http.setDataSerializer(p.contentType);
		this.http.setRequestTimeout(p.timeout);
		this.http.post(p.url, p.data, {})
		.then(res => {
			let data ; 
			try{
				data = JSON.parse(res.data);
			}catch(e){
				data = res.data;
			}
			// if(Global.debug){
			// 	console.log('get', p.url);
			// 	console.log('result', Common.clone(res.data));
			// }
			callback.logoutHandleFunc(data, this);
			if(callback.successFunc){
				callback.successFunc(data);
			}
		})
		.catch(err => {
			// if(Global.debug){
			// 	console.log('get', p.url);
			// 	console.log('error', err);
			// }
			if(callback.errorFunc) 
				callback.errorFunc(err);
			// this.showError('网络异常，请稍后重试。。');
			this.showError(err);
		});
		return callback;
	}

	showError(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			position: 'bottom',
			// duration: 3000,
			showCloseButton:true,
		});
		toast.present();
	}
}

class Callback { 
	successFunc: Function;
	errorFunc: Function;
	finalFunc: Function;
	logoutHandleFunc = (dic, that)=> {
		if(dic.code==1002 || dic.code==1003){
			Global.setLoginToken(null);
			that.events.publish('serverLogoutHandle');
		}
	}

	// logoutHandleFunc = (dic, nav)=> {
	// 	if(dic.code==1002 || dic.code==1003){
	// 		Global.setLoginToken(null);
	// 		nav.getRootNav().push(LoginPage);
	// 	}
	// }

	// constructor(){
	// 	let timeoutState = 0;
	// 	let timeoutDelay = params.timeout || 30000;
	// 	let timer = setTimeout(() =>{
	// 		if(timeoutFlag===0){
	// 			timeoutFlag = 1;
	// 		}
	// 	}, timeoutDelay);
	// }

	success (func){
		this.successFunc = func;
		return this;
	}

	error (func){
		this.errorFunc = func;
		return this;
	}

	final (func){
		this.finalFunc = func;
		return this;
	}

	logout(func) {
		this.logoutHandleFunc = func;
		return this;
	}
}