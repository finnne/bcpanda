import { Component } from '@angular/core';
import { Toast, } from "../../class/helper";
import { PagerData } from '../../class/entity';
import { Request } from "../../class/request";

import { Global } from '../../app/app.global';
import { Common } from '../../class/common';


@Component({
  selector: 'page-my-order-list',
  templateUrl: 'my-order-list.html',
  providers:[ Toast, Request ],
})
export class MyOrderListPage {

	pagerData = new PagerData();
	infinite:any;
	orderList = [];
	
	constructor(
		private toast: Toast,
		private request: Request,
	) {}

	ngOnInit() {
		this.loadPage();
	}

	loadPage(callback?){
		if(Global.loginState){
			// this.request.get('assets/json/order.json')
			this.request.get(Global.domain +'/panda/order')
			.success(dic =>{
				if(dic.code==0){
					let data = dic.result;
					if(data==null){
						data = [];
					}
					for(let order of data){
						order.operateTime = Common.formatDate(new Date(order.operateTime), 'yyyy-MM-dd mm:ss');
					}
					this.pagerData.set(data, 10);
					this.orderList = this.pagerData.next();
					if(callback) callback();
				}
				else{
					this.toast.show(dic.msg);
				}
				if(callback) callback();
			})
			.error(err=> {
				if(callback) callback();
			});
		}
	}

	doRefresh(refresher) {
		setTimeout(() => {
			this.loadPage(() =>{
				refresher.complete();
				if(this.infinite) 
					this.infinite.enable(true);
			});
		}, 1000);
	}

	doInfinite(infiniteScroll) {
		if(!this.infinite){
			this.infinite = infiniteScroll;
		}
		setTimeout(() => {
			if(this.pagerData.isEnd){	
				this.infinite.enable(false);		
				this.infinite.complete();
				return;
			} 
			let nextData = this.pagerData.next();
			if(nextData.length>0){
				this.orderList = this.orderList.concat(nextData);
				this.infinite.complete();
			}
			else{
				this.infinite.enable(false);
				this.infinite.complete();
			}
		}, 1000);
	}

}
