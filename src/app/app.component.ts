import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { Global } from '../app/app.global';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
  ) {
      platform.ready().then(() => {
      //   // #Okay, so the platform is ready and our plugins are available.
      //   // #Here you can do any higher level native things you might need.

        statusBar.styleDefault();
        splashScreen.hide();
      });
      // Global.setLoginStateByCookie(); 
      Global.initLoginToken();
      Global.clearSessionid(); 
      this.bindEvents();   
  }

  bindEvents() {
    // document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    //当插件无法从服务器加载更新时发送。错误详细信息附加到事件。用于外壳更新
    document.addEventListener('chcp_updateLoadFailed', this.onUpdateLoadError.bind(this), false);
    //当新版本成功加载并准备安装时发送
    document.addEventListener('chcp_updateIsReadyToInstall', this.onReadyToInstall.bind(this), false);
    //在即将安装更新时发送。
    document.addEventListener('chcp_beforeInstall', this.onBeforeInstall.bind(this), false);
    //成功安装更新
    document.addEventListener('chcp_updateInstalled', this.onInstalle.bind(this), false);
    //安装更新失败时
    document.addEventListener('chcp_updateInstallFailed', this.installError.bind(this), false);
    //当用户手机存储卡不够用时
    document.addEventListener('chcp_assetsInstallationError', this.onInstallationError.bind(this), false);
  }


  // deviceready Event Handler
  onDeviceReady() {
    // window.chcp.getVersionInfo((error,data)=>{
    //   if(error){
    //     this.toast.show(error)
    //   }
    //   console.log(data.currentWebVersion);
    //   let currentWebVersion = data.currentWebVersion;
    //   let release;
    //   this.request.get(this.url)
    //   .success((dic)=>{
    //     if(dic.release!=currentWebVersion){
    //     this.onShowUpdate();
    //     window.chcp.fetchUpdate(this.fetchUpdateCallback.bind(this));
    //     }
    //   });
    // });
    console.log('onDeviceReady============');
   
  }
  installError(){
    console.log('安装更新失败============')
  }
  installationCallback(error) {
    if (error) {
      // //console.log('Failed to install the update with error code: ' + error.code);
      // //console.log(error.description);
      //     let alert = this.alertCtrl.create({
      //     title: '更新不成功',
      //     message: '安装更新包过程中发生错误，请重启app再次尝试升级',
      //     buttons: [
      //       {
      //         text: '明白了',
      //         role: 'cancel',
      //         handler: () => {}
      //       }
      //     ]
      //   });
      //   alert.present();
      console.log(error.description);
     
    } else {
      console.log('Update installed!');
    }
  }

  fetchUpdateCallback(error) {
      // this.toast.show('发生错误，错误代码: ' + error.code);
      // if(error.code===-3 || error.code===-4){
      //       this.hiddenUpdate();
      //       var dialogMessage = '下载失败，去App store下载最新版';
      //       window.chcp.requestApplicationUpdate(dialogMessage);
      // }
      // // console.log(error.description);
      // //error.code=2没有更新，error.code=-17下载正在进行
      // if(error){
      //     //loading.dismiss();
      //     //console.log('没有检测到任何文件更新')
      //     //console.log(error.description);
         
      //     this.hiddenUpdate();
         
      // }
      //   console.log('文件加载中');
     
     console.log(error.description);
  }
  //外壳更新
  onUpdateLoadError(eventData) {
    // var error = eventData.detail.error;
    // if (error && error.code == window.chcp.error.APPLICATION_BUILD_VERSION_TOO_LOW) {
    //     //console.log('Native side update required');
    //     var dialogMessage = '发现新版本，即刻下载安装.';
    //     window.chcp.requestApplicationUpdate(dialogMessage);
    // }
    console.log(eventData.detail.error);
  }
  userWentToStoreCallback() {}
  userDeclinedRedirectCallback() {}
  //当新版本成功加载并准备安装时发送
  onReadyToInstall(){
    console.log('正在安装更新');
    // this.updateText = '正在安装更新'
    // window.chcp.installUpdate(this.installationCallback.bind(this));
  }
  //安装即将开始
  onBeforeInstall(){
    // this.updateText = '即将开始升级'
    console.log('即将开始升级');
  }
  //安装更新成功
  onInstalle(){
    console.log('升级完成')
    // this.updateText = '升级完成'
    // this.hiddenUpdate();
  }
  //存储卡不够用时提醒用户
  onInstallationError(){
    console.log('存储空间不够升级')
    // let alert = this.alertCtrl.create({
    //   title: '存储错误',
    //   message: '您的手机存储不足，无法下载更新包',
    //   buttons: [
    //     {
    //       text: '明白了',
    //       role: 'cancel',
    //       handler: () => {}
    //     }
    //   ]
    // });
    // alert.present();
  }

}
