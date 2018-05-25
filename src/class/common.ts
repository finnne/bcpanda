
export class Common {

	public static btnCountdown (btnId): void {
		let el = document.getElementById(btnId);
		let t = Number(el.getAttribute('data-time'));
		let text = el.getAttribute('data-text');
		el.setAttribute('disabled', 'true');
		el.innerHTML = t+'秒后重发';
		let timer = setInterval(function(){
			t--;
			if(t<=0){
				if(timer){
					clearInterval(timer);
					timer = null;
				}
				el.setAttribute('disabled', 'false');
				el.innerHTML = text;
			}else{
				el.innerHTML = t+'秒后重发';
			}
		},1000);
	}

	public static getDegreeTextByNum (n): string {
		let text;
		switch(n){
			case 0:
				text = '普通';
				break;
			case 1:
				text = '稀有';
				break;
			case 2:
				text = '罕见';
				break;
			case 3:
				text = '卓越';
				break;
			case 4:
				text = '史诗';
				break;
			case 5:
				text = '传奇';
				break;
			default:
				text = null;
				break;
		}
		return text;
	}

	public static splitString (str,len?): Array<string>{
		let strArr = [];
	    let arr1 = str.split('/n/');
	    if(!len) return arr1;
    	for(let s of arr1){
    		let sLen = s.length;
    		if(sLen > len){
				let charLeft = len*2;
				let arrChar = [];
				let charCode;
				let b;
				for (let j = 0; j < sLen; j++)   
			    {	
					charCode = s.charCodeAt(j);  
					b = (charCode >= 0 && charCode <= 128) ? 1 : 2;	
		
					if(charLeft==0 || charLeft<b){
						strArr.push(arrChar.join(''));
						charLeft = len*2;
						arrChar = [];
					}
					arrChar.push(s[j]);
					charLeft = charLeft - b;
					if(j==sLen-1){
						strArr.push(arrChar.join(''));
					}
			    }
			}else{
				strArr.push(s);
			}   		
    	}
    	return strArr;
	}

	public static clone (obj): any {
		let copy;
		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];
			for (let i = 0, len = obj.length; i < len; i++) {
				copy[i] = this.clone(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};
			for (let attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	//取URL参数值
	public static getQueryString (key):string {
		var strType = null ;
		var arrUrl = window.location.href.split('?');
		if(arrUrl.length>1){
			var arrQueryString = arrUrl[1].split('&');
			for( let i in arrQueryString){
				var arrCondition = arrQueryString[i].split('=');
				if(arrCondition[0]==key && arrCondition.length==2){
					strType = arrCondition[1];
					break;
				}
			}
		}
		return strType;
	}

	//格式化时间（参数示例：yyyy-MM-dd hh:mm:ss）
	public static formatDate (date, fs) : string{
	    var time = {
	        'y' : date.getFullYear(),
	        'M' : date.getMonth() + 1,
	        'd' : date.getDate(),
	        'h' : date.getHours(),
	        'm' : date.getMinutes(),
	        's' : date.getSeconds()
	    };
	    
	    for(var k in time){
	        var mt = fs.match((new RegExp("(" + k + "+)")));
	        if (!mt) continue;
	        if(mt[1].length == 1){
	            fs = fs.replace(mt[1], time[k]);
	        }else{
	            var temp = "00" + time[k];
	            fs = fs.replace(mt[1], temp.substr(temp.length - mt[1].length));
	        }    
	    }
	    return fs;
	}

	public static Cookie = {
		set: (key, value)=>{
			let expire = null;
			let exdate=new Date();
			let strExpire = "";
			if(expire){
				strExpire = ";expires="+exdate.toUTCString();
			}
			exdate.setDate(exdate.getDate() + expire);
			document.cookie= key +"="+ encodeURI(value) + strExpire +";path=/";
		},

		get: (key)=>{
		    let arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
		    if(arr=document.cookie.match(reg))
		        return (arr[2]);
		    else
		        return null;
		},

		del: (key)=>{
		    let exp = new Date();
		    let cval= Common.Cookie.get(key);
		    exp.setTime(exp.getTime() - 1);
		    if(cval!=null)
		        document.cookie= key + "="+cval+";expires="+exp.toUTCString();
		},
	}

	public static Verify = {
	    isEmpty: (str)=> {
			return (!str || str.length==0) ? true : false;
		},

		mobile: (str)=> {
			return (str && /^1[0-9]{10}$/.test(str)) ? true : false;
		},

		password: (str)=> {
			let exp =new RegExp("^([A-Za-z0-9_\~\`\!\@\#\$\%\^\&\*\(\)\+\=\{\}\\[\\]\|\:\;\'\"\<\>\,\.\?\/]|[-]|[\\\\]|[ ]){6,20}$");
			return (str && exp.test(str)) ? true : false;
		}
	}

}



