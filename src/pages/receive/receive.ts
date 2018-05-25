import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Nav } from "../../class/helper";

@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html',
  providers:[ Nav ], 
})



export class ReceivePage {

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
}
