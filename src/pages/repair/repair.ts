import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalVars } from '../../providers/global';


@IonicPage()
@Component({
  selector: 'page-repair',
  templateUrl: 'repair.html'
})

export class RepairPage {
  viewType: string = "Menu";
  repair_card: any[] = [];
  items: any[] = [];
  backgroundImage="https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";

  constructor(public navCtrl: NavController, public DB: AngularFirestore, public navParams: NavParams,
    public loadingCtrl: LoadingController, public global : GlobalVars, 
    public alertCtrl: AlertController, public afs : AngularFirestore) {

    this.afs.collection('repair_notice').valueChanges()
      .subscribe((notice)=>{
        this.items = notice;
      })
  }


  ionViewWillEnter(){
    this.global.changeMessage(true);
  }
  openLog() {
    this.navCtrl.push('MaintenanceLogPage');
  }

  openOnMaintenance() {
    this.navCtrl.push('OnMaintenancePage')
  }

  manage() {
    let confirm = this.alertCtrl.create({
      title: '알림',
      message: '공지를 추가하시겠습니까?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.openNextPage()
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  openNextPage() {
    this.navCtrl.push('WriteRepairNoticePage')
  }

  openNoticeDetailPage(item) {
    console.log(item);
    this.navCtrl.push('RepairNoticePage', {
      notice: item
    });
  }
  
  openHomePage(){
    this.navCtrl.push('HomePage');
  }

}
