import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http';
import { HotCodePush } from '@ionic-native/hot-code-push';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { TabHomePage } from '../pages/tab-home/tab-home';
import { TabMinePage } from '../pages/tab-mine/tab-mine';
import { LoginPage } from '../pages/login/login';
import { AgreementPage } from '../pages/agreement/agreement';
import { DetailPage } from '../pages/detail/detail';
import { ExplainPage } from '../pages/explain/explain';
import { MyOrderListPage } from '../pages/my-order-list/my-order-list';
import { MyPandaPage } from '../pages/my-panda/my-panda';
import { MyPandaListPage } from '../pages/my-panda-list/my-panda-list';
import { ReceivePage } from '../pages/receive/receive';
import { RegisterPage } from '../pages/register/register';
import { SuccessBuyPage } from '../pages/success-buy/success-buy';


@NgModule({
  declarations: [
    MyApp,
    TabHomePage,
    TabMinePage,
    TabsPage,
    LoginPage,
    AgreementPage,
    DetailPage,
    ExplainPage,
    MyOrderListPage,
    MyPandaPage,
    MyPandaListPage,
    ReceivePage,
    RegisterPage,
    SuccessBuyPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '返回',
      mode: 'ios',
      iconMode:'ios'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabHomePage,
    TabMinePage,
    TabsPage,
    LoginPage,
    AgreementPage,
    DetailPage,
    ExplainPage,
    MyOrderListPage,
    MyPandaPage,
    MyPandaListPage,
    ReceivePage,
    RegisterPage,
    SuccessBuyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    HotCodePush,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

