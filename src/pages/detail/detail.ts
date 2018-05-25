import { Component } from '@angular/core';
import { NavParams, Events } from 'ionic-angular';
import { Nav, Toast, Alert, Loading } from "../../class/helper";
import { Request } from "../../class/request";

import { Global } from '../../app/app.global';

import { SuccessBuyPage } from '../success-buy/success-buy';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
  providers:[ Nav, Toast, Alert, Loading, Request ],
})



export class DetailPage {
	constructor(
		private navParams: NavParams,
		private events: Events,
		private request: Request,
		private nav: Nav,
		private toast: Toast,
		private alert: Alert,
		private loading: Loading,
	){}

	panda: any;

	ngOnInit() {
		this.panda = this.navParams.data;
	}

	buyBtnClick(){
		if(!Global.loginState){
			let param = {
				back: {
					view: 'root',
					index: this.nav.root.length() - 1,
				}
			}
			this.nav.root.push(LoginPage, param);
			return;
		}
		let buyPanda = ()=>{
			if (!this.panda){
				this.toast.show('熊猫不存在');
				return;
			} 
			let body = {
				"orderId": this.panda.orderId,
			};
			this.loading.show();
			this.request.post({
				url: Global.domain +'/panda/buy',
				data: body,
			})
			.success(dic => {		
				this.loading.hide();
				if(dic.code==0){
					this.events.publish('updateMinePage');
					this.nav.root.push(SuccessBuyPage, this.panda);
				}else{
					this.toast.block(dic.msg, 'warn');
				}
			})
			.error(() =>{
				this.loading.hide();
			});
		};

		this.alert.confirm({
			title: '是否确认购买？',
			msg: '购买本只熊猫需要花费/n/'+ this.panda.price +'竹子',
			btns: [
				{
					text: '取消',
					role: 'cancel',
				},
				{
					text: '确定',
					handler: buyPanda.bind(this),
				}
			]
		});
	}
}
