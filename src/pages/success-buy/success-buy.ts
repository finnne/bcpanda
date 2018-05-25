import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Nav } from "../../class/helper";


@Component({
  selector: 'page-success-buy',
  templateUrl: 'success-buy.html',
  providers:[ Nav ], 
})



export class SuccessBuyPage {

	constructor(
		private nav: Nav,
		private navParams: NavParams,
	){}

	panda: Object;

	ngOnInit() {
		this.panda = this.navParams.data;
	}

	enterMineBtnClick(){
		this.nav.tab.select(1);
		this.nav.root.popToRoot();
	}

	backHomeBtnClick() {
		this.nav.tab.select(0);
		this.nav.root.popToRoot();
	}
}
