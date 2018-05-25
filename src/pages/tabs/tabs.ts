import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { Global } from '../../app/app.global';

import { TabHomePage } from '../tab-home/tab-home';
import { TabMinePage } from '../tab-mine/tab-mine';
import { LoginPage } from '../login/login';

@Component({
	selector: 'page-tabs',
	templateUrl: 'tabs.html',
})
export class TabsPage {
	tab1Root = TabHomePage;
	tab2Root = TabMinePage;

	constructor(
		public appCtrl: App,
	){}

	ionViewDidLoad(){
        let tabBtn = document.querySelectorAll('ion-tabs .tab-button');
        let that = this;  
        this.createTabClickLayer(tabBtn[1], function(ev) {
        	let oEvent = ev || event; 
        	oEvent.stopPropagation(); 
            if(Global.loginState){
            	that.appCtrl.getRootNav()._children[0].select(1);
            }
            else{
                let params = {
                    tabNum: 1,
                }
            	that.appCtrl.getRootNav().push(LoginPage, params);
            }
        });
    }

    createTabClickLayer(tab, func){
    	if(document.querySelector('b.tab-tab_click_layer')) return;
    	let b = document.createElement('b');
    	b.setAttribute('class', 'tab_click_layer');
    	b.onclick = func;
    	tab.appendChild(b);
    }

    // ionViewWillEnter(){
    //     console.log('触发ionViewWillEnter');
    // }

    // ionViewDidEnter(){
    //     console.log('触发ionViewDidEnter');
    // }

    // ionViewWillLeave(){
    //     console.log('触发ionViewWillLeave');
    // }

    // ionViewDidLeave(){
    //     console.log('触发ionViewDidLeave');
    // }

    // ionViewWillUnload(){
    //     console.log('触发ionViewWillUnload');
    // }
}
