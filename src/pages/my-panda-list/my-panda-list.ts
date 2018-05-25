import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { Nav, Toast, Loading } from "../../class/helper";
import { PagerData } from '../../class/entity';
import { Request } from "../../class/request";

import { Global } from '../../app/app.global';
import { Common } from '../../class/common';

import { MyPandaPage } from '../my-panda/my-panda';
import { ReceivePage } from '../receive/receive';

@Component({
	selector: 'page-my-panda-list',
	templateUrl: 'my-panda-list.html',
	providers:[ Nav, Toast, Loading, Request ],
})

export class MyPandaListPage {
	pagerData = new PagerData();
	infinite:any;
	adoptStatus: boolean = true;
	pandaList = [];
	loadFlag = false;

	constructor(
		private events: Events,
		private nav: Nav,
		private toast: Toast,
		private loading: Loading,
		private request: Request,
	) {}



	ngOnInit() {
		this.listenEvents();
		this.loadPage();
	}

	listenEvents(){
		this.events.subscribe('updateMyPandaList', () => {
			this.loadPage();
		});
	}

	loadPage(callback?){
		this.loading.show();
		// this.request.get('assets/json/account.json')
		this.request.get(Global.domain +'/panda/myPandas')
		.success(dic =>{
			this.loading.hide();
			this.loadFlag = true;
			if(dic.code==0){
				this.adoptStatus = dic.result.adoptStatus;
				let data = dic.result.particulars;
				if(data==null){
					data = [];
				}
				for(let panda of data){
					panda.degree = Common.getDegreeTextByNum(panda.degree);
				}
				this.pagerData.set(data, 10);
				this.pandaList = this.pagerData.next();
				if(callback) callback();
			}
			else{
				this.toast.show(dic.msg);
			}
			if(callback) callback();
		})
		.error(err=> {
			this.loading.hide();
			if(callback) callback();
		});
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
				this.pandaList = this.pandaList.concat(nextData);
				this.infinite.complete();
			}
			else{
				this.infinite.enable(false);
				this.infinite.complete();
			}
		}, 1000);
	}

	showPandaDetail(id){
		let panda;
		for(let p of this.pandaList){
			if(p.pandaId==id){
				panda = p;
			}
		}
		if(!panda) return;
		this.nav.root.push(MyPandaPage, panda);
	}

	receiveBtnClick(){
		this.loading.show();
		// this.request.get('assets/json/adopt.json')
		this.request.get(Global.domain +'/panda/adopt')
		.success(dic =>{
			this.loading.hide();
			if(dic.code==0){
				let panda = dic.result;
				panda.degree = Common.getDegreeTextByNum(panda.degree);
				this.events.publish('updateMinePage');
				this.nav.root.push(ReceivePage, panda);
			}
			else{
				this.toast.show(dic.msg);
			}
		})
		.error(err =>{
			this.loading.hide();
		});
	}

}
