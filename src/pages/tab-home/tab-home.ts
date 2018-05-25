import { Component } from '@angular/core';
import { Platform, Events} from 'ionic-angular';

import { Nav, Toast, Loading } from "../../class/helper";
import { Request } from "../../class/request";

import { Common } from '../../class/common';
import { PagerData } from '../../class/entity';
import { Global } from '../../app/app.global';

import { DetailPage } from '../detail/detail';
import { ReceivePage } from '../receive/receive';
import { LoginPage } from '../login/login';
import { ExplainPage } from '../explain/explain';


@Component({
	selector: 'page-tab-home',
	templateUrl: 'tab-home.html',
	providers:[ Nav, Toast, Loading, Request ], 
})
export class TabHomePage {
	constructor(
		private platform: Platform,
		private events: Events,
      	private nav: Nav,
      	private toast: Toast,
		private loading: Loading,
      	private request: Request,
	){}
	
	pagerData = new PagerData();
	pandaList = [];
	infinite:any;

	ngOnInit() {
		this.platform.ready().then(() => {
			this.listenEvents();
			this.loadPage();
		});	
	}

	listenEvents(){
		this.events.subscribe('serverLogoutHandle', () => {
			let param = {
				back: {
					view: 'root',
					index: this.nav.root.length() - 1,
				}
			}
			this.nav.root.push(LoginPage, param);
		});
	}

	loadPage(callback?){
		// this.request.get('assets/json/home.json')
		this.request.get(Global.domain +'/panda/list')
		.success(dic =>{
			if(dic.code==0){
				let pandas = dic.result.particulars;
				if(pandas==null){
					pandas = [];
				}
				for(let panda of pandas){
					panda.degree = Common.getDegreeTextByNum(panda.degree);
				}
				this.pagerData.set(pandas, 4);
				this.pandaList = this.pagerData.next();
			}
			else{
				this.toast.show(dic.msg);
			}
			if(callback) callback();
		})
		.error(err =>{
			if(callback) callback();
		});
	}

	showPandaDetail(id){
		let panda;
		for(let p of this.pandaList){
			if(p.pandaId==id){
				panda = p;
			}
		}
		if(!panda) return;
		this.nav.root.push(DetailPage, panda);
	}

	receiveBtnClick(){
		if(Global.loginState){
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
		else{
			this.nav.root.push(LoginPage);
		}
	}

	navToExplain(){
		this.nav.root.push(ExplainPage);
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

}

