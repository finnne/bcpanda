import { Injectable } from '@angular/core';
import { Platform, ToastController, Events } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http';

import { Common } from '../class/common';
import { Global } from '../app/app.global';



@Injectable()
export class Request {
	constructor(
		private plt: Platform,
		private httpNative: HTTP,
		private httpClient: HttpClient,
		private toastCtrl: ToastController,
		private events: Events,
	){}

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
		let http;
		if(this.plt.is('cordova')){
			http = new HttpNative(this.httpNative);
		}
		else{
			http = new HttpWeb(this.httpClient);
		}
		if(Global.debug){
			console.log('GET', p.url);
		} 
		http.get(
			p, 
			res => {
				let data ; 
				try{
					data = JSON.parse(res);
				}catch(e){
					data = res;
				}
				if(Global.debug){
					console.log('result', Common.clone(data));
				}
				callback.logoutHandleFunc(data, this.events);
				if(callback.successFunc){
					callback.successFunc(data);
				}
			},
			err => {
				if(Global.debug){
					console.log('error', err);
				}
				if(callback.errorFunc){
					callback.errorFunc(err);
				}
				this.showError('网络异常，请稍后重试。。');
			}
		);
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
		let http;
		if(this.plt.is('cordova')){
			http = new HttpNative(this.httpNative);
		}
		else{
			http = new HttpWeb(this.httpClient);
		}
		if(Global.debug){
			console.log('GET', p.url);
		} 
		http.post(
			p, 
			res => {
				let data ; 
				try{
					data = JSON.parse(res);
				}catch(e){
					data = res;
				}
				if(Global.debug){
					console.log('result', Common.clone(data));
				}
				callback.logoutHandleFunc(data, this.events);
				if(callback.successFunc){
					callback.successFunc(data);
				}
			},
			err => {
				if(Global.debug){
					console.log('error', err);
				}
				if(callback.errorFunc){
					callback.errorFunc(err);
				}
				this.showError('网络异常，请稍后重试。。');
			}
		);
		return callback;
	}

	showError(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			position: 'bottom',
			duration: 3000,
			// showCloseButton:true,
		});
		toast.present();
	}
}



class HttpNative {

	constructor(
		private http: HTTP,
	){}

	get(p, successHandler, errorHandler){
		for(let key in p.header){
			this.http.setHeader('*', key, p.header[key]);
		}
		this.http.setRequestTimeout(p.timeout);
		this.http.get(p.url, p.data, {})
		.then(res => {
			successHandler(res.data);
		})
		.catch(err => {
			errorHandler(err.error);
		});
	}

	post(p, successHandler, errorHandler){
		for(let key in p.header){
			this.http.setHeader('*', key, p.header[key]);
		}
		this.http.setDataSerializer(p.contentType);
		this.http.setRequestTimeout(p.timeout);
		this.http.post(p.url, p.data, {})
		.then(res => {
			successHandler(res.data);
		})
		.catch(err => {
			errorHandler(err.error);
		});
	}

	
}


class HttpWeb {
	constructor(
		private http: HttpClient,
	){}

	get(p, successHandler, errorHandler){
		const headers = new HttpHeaders(p.header);
		this.http.get(
			p.url,
			{headers},
		)
		.subscribe(
			res => {	
				successHandler(res);
			},
			err => {
				errorHandler(err);
			},
		);
	}

	post(p, successHandler, errorHandler){
		const headers = new HttpHeaders(p.header);
		this.http.post(
			p.url,
			p.data,
			{headers},
		)
		.subscribe(
			res => {
				successHandler(res);	
			},
			err => {
				errorHandler(err);
			},
		);
	}
}	

class Callback {
	successFunc: Function;
	errorFunc: Function;
	finalFunc: Function;
	logoutHandleFunc: Function = (dic, e)=> {
		if(dic.code==1002 || dic.code==1003){
			Global.setLoginToken(null);
			e.publish('serverLogoutHandle');
		}
	}

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