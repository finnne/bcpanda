import { Common } from "../class/common";

export class Global {
    public static debug = false;

    public static appType = 16;
    
    public static Channel = 'BCPanda';

    public static domain = 'http://appweb01.lend51.com/JieWebApp';
    // public static domain = 'http://jenkins.lend51.com:8072/JieWebApp';
    // public static domain = '/JieWebApp';
    
    // 登录状态
    public static loginState: number;

    // 登录状态
    public static loginToken: string;

    // 更新登录状态
    public static getLoginTokenCookie(): string {
        return Common.Cookie.get('loginToken');
    }

    // 更新登录状态
    public static setLoginTokenCookie(tk): void {
        if(tk){
            Common.Cookie.set('loginToken',tk);
        }
        else{
            Common.Cookie.del('loginToken');
        }
        
    }

    public static clearSessionid(): void {
        Common.Cookie.del('JSESSIONID');
    }

    public static initLoginToken(): void {
        let tk = Common.getQueryString('a');
        // if(!tk){
        //     tk = this.getLoginTokenCookie();
        // }
        if(tk){
            this.loginState = 1;
            this.loginToken = tk;
            // this.setLoginTokenCookie(tk);
        }
        else{
            this.loginState = 0;
            this.loginToken = '';
        }
    }

    // 设置token
    public static setLoginToken(tk): void {
        if(tk){
            this.loginState = 1;
            this.loginToken = tk;
            // this.setLoginTokenCookie(tk);
        }
        else{
            this.loginToken = '';
            this.loginState = 0;
            // this.setLoginTokenCookie(null);
        }
    }

    // public static setLoginTokenByQueryString(): void {
    //     let token = Common.getQueryString('a');
    //     if(token){
    //         this.loginToken = token;
    //         this.loginState = 1;
    //     }
    //     else{
    //         this.loginToken = '';
    //         this.loginState = 0;
    //     }
    // }

    // // 更新登录状态
    // public static setLoginStateByCookie(): void {
    //     let cookie = new Cookie();
    //     let state = Number(cookie.get('loginState'));
    //     this.loginState = state ? state : 0;
    // }

    // // 更新登录状态
    // public static updateLoginState(state): void {
    //     let cookie = new Cookie();
    //     this.loginState = state;
    //     cookie.set('loginState',state);
    // }

}