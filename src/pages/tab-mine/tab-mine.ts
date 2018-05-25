import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { Nav, Toast, Loading } from "../../class/helper";

import { Request } from "../../class/request";

import { Global } from '../../app/app.global';

import { MyPandaListPage } from '../my-panda-list/my-panda-list';
import { MyOrderListPage } from '../my-order-list/my-order-list';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-tab-mine',
  templateUrl: 'tab-mine.html',
  providers:[ Nav, Request, Toast, Loading ],
})
export class TabMinePage {
	defaultInfo = {
		"headUrl":"assets/imgs/head_default.png",
		"userName": "--",
		"phone": "--",
		"banbooScore": "--",
		"signstate": true,
		// "particulars": [],
	}
	userInfo: any;

	constructor(
		// private navCtrl: NavController,
		private events: Events,
		private request: Request,
		// private cookie: Cookie,
		private toast: Toast,
		private nav: Nav,
		private loading: Loading
	) {
		this.userInfo = this.defaultInfo;
	}

	

	

	ngOnInit() {
		this.listenEvents();
		this.loadPage();
	}

	listenEvents(){
		this.events.subscribe('updateMinePage', () => {
			this.loadPage();
		});
	}

	doRefresh(refresher) {
		setTimeout(() => {
			this.loadPage(() =>{
				refresher.complete();
			});
		}, 1000);
	}

	loadPage(callback?){
		if(Global.loginState){
			// this.request.get('assets/json/account.json')
			this.request.get(Global.domain +'/panda/account')
			.success(dic =>{
				if(dic.code==0){
					let data = dic.result;
					// if(data.particulars==null){
					// 	data.particulars = [];
					// }
					// for(let panda of data.particulars){
					// 	panda.degree = Common.getDegreeTextByNum(panda.degree);
					// 	panda.backColor = '#'+panda.backColor;
					// }
					this.userInfo = data;
				}
				else{
					// this.userInfo = this.defaultInfo;
					this.toast.show(dic.msg);
				}
				if(callback) callback();
			})
			.error(err=> {
				// this.userInfo = this.defaultInfo;
				if(callback) callback();
			});
		}
	}

	// showPandaDetail(id){
	// 	let panda;
	// 	for(let p of this.userInfo.particulars){
	// 		if(p.pandaId==id){
	// 			panda = p;
	// 		}
	// 	}
	// 	if(!panda) return;
	// 	this.nav.root.push(DetailPage, panda);
	// }

	myPandaBtnClick() {
		// let np = this.userInfo.particulars;
		this.nav.root.push(MyPandaListPage);
	}

	myOrderBtnClick() {
		// let np = this.userInfo.particulars;
		this.nav.root.push(MyOrderListPage);
	}

	signinClick(){
		if(this.userInfo.signstate) return;
		this.loading.show();
		// this.request.get('assets/json/signin.json')
		this.request.get(Global.domain +'/panda/addScore')
		.success(dic => {
			this.loading.hide();	
			if(dic.code==0){
				this.toast.block('今日签到成功/n/获得'+ dic.result.addBanboo +'个竹子');
				this.userInfo.banbooScore = dic.result.banbooScore;
				this.userInfo.signstate = dic.result.signstate;
			}
			else{
				this.toast.show(dic.msg);
			}
		})
		.error(() => {
			this.loading.hide();
		});
	}

	logoutClick(){
		this.loading.show();
		this.request.get(Global.domain +'/app/security/logout')
		.success(dic => {
			this.loading.hide();	
			if(dic.code==0){
				let params = {
                    tabNum: 1,
                }
				this.userInfo = this.defaultInfo;
				Global.setLoginToken(null);
				this.nav.root.push(LoginPage, params);
				this.nav.tab.select(0);
				this.events.publish('updateMinePage');
			}
			else{
				this.toast.show(dic.msg);
			}
		})
		.error(() => {
			this.loading.hide();
		});
	}

}
