import { Component } from '@angular/core';
import { NavParams, Events } from 'ionic-angular';

import { Nav, Toast, Alert, Loading } from "../../class/helper";
import { Request } from "../../class/request";

import { Global } from '../../app/app.global';


@Component({
  selector: 'page-my-panda',
  templateUrl: 'my-panda.html',
  providers:[ Request, Nav, Toast, Alert, Loading ],
})

export class MyPandaPage {
	txtPrice:number;
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

	saleBtnClick(){
		if (!this.panda) return;
		this.txtPrice = null;
		this.displayPriceContainer('inputContainer', true);
	}

	unsaleBtnClick(){
		if (!this.panda) return;

		this.alert.confirm({
			title: '操作提示',
			msg: '确定撤销出售吗？',
			btns: [
				{
					text: '取消',
					role: 'cancel',
				},
				{
					text: '确定',
					handler: this.unsalePanda.bind(this),
				}
			]
		});
	}

	certainPriceClick(){
		let price = this.txtPrice;
		if(price>=1 && price<=10000){
			this.displayPriceContainer('inputContainer', false);
			this.displayPriceContainer('confirmContainer', true);
		}
		else{
			this.toast.pop('出售的价格区间为1至10000个竹子，请合理定价');
		}

	}

	confirmPriceClick(){
		let price = this.txtPrice;
		if(price>=1 && price<=10000){
			this.confirPriceClose();
			let body =  {
				"orderId": this.panda.orderId,
				"price": price,
			};
			this.loading.show();
			this.request.post({
		    	url: Global.domain +'/panda/publish', 
		    	data: body,
		    })
			.success(dic => {
				this.loading.hide();
				if(dic.code==0){
					this.events.publish('updateMyPandaList');
					this.toast.block('发布成功').dismiss(()=> {
						this.nav.view.pop();
					});
				}else{
					this.toast.block(dic.msg, 'warn');
				}
			})
			.error(() =>{
				this.loading.hide();
			});
		}
	}

	unsalePanda(){
		let body = {
			"orderId": this.panda.orderId,
		};
		this.loading.show();
		this.request.post({
			url: Global.domain +'/panda/cancel', 
			data: body,
		})
		.success(dic => {
			this.loading.hide();
			if(dic.code==0){
				this.events.publish('updateMyPandaList');
				this.toast.block('撤销成功').dismiss(()=> {
					this.nav.view.pop();
				});
			}else{
				this.toast.block(dic.msg, 'warn');
			}
		})
		.error(() =>{
			this.loading.hide();
		});
	}

	certainPriceClose(){
		this.displayPriceContainer('inputContainer', false);
	}

	confirPriceClose(){
		this.displayPriceContainer('confirmContainer', false);
	}

	displayPriceContainer(id, flag){
		let el = document.getElementById(id);
		if(flag){
			el.classList.add('active');
		}
		else{
			el.classList.remove('active');
		}
	}

}
