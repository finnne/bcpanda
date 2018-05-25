export class PagerData {
	data: Array<any>;
	size: number;
	prevIndex: number;
	count: number;
	isEnd: boolean;

	constructor(){
		this.init();
	}

	init (){
		this.data = [];
		this.size = 10;
		this.prevIndex = 0;
		this.count = 0;
		this.isEnd = false;
	}

	set (arr, size?){
		this.data = arr;
		this.size = size || 10;
		this.count = arr.length;
		this.prevIndex = 0;
		this.isEnd = false;
	}

	next (){
		if(this.prevIndex >= this.count){
			this.isEnd = true;
			return [];
		}
		let startIndex = this.prevIndex;
  		let endIndex = startIndex + this.size;
  		this.prevIndex = endIndex > this.count ? this.count : endIndex;
  		return this.data.slice(startIndex, endIndex);
	}

	clean (){
		this.init();
	}
}