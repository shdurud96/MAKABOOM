import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AngularFireAuth } from 'angularfire2/auth';
import { GlobalVars } from '../../providers/global';
import { AuthService } from '../../providers/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  viewType: string = "Menu";
  stock_card: any[] = [];
  items: any;
  // show
  backgroundImage="https://firebasestorage.googleapis.com/v0/b/makaboom-4e68b.appspot.com/o/realback.JPG?alt=media&token=3f1ab8c6-4d9a-48e1-ae6f-99bd6d043dd6";
  
  constructor(public navCtrl: NavController, public DB: AngularFirestore, public navParams: NavParams,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public afs: AngularFirestore, public afAuth: AngularFireAuth, public auth: AuthService,
    public global: GlobalVars) {


    // this.global.changeMessage(true);
    this.global.currentMessage.subscribe(message => console.log(message))
    // this.global.changeMessage(true)



    this.afs.collection('Notice').valueChanges()
      .subscribe(notice => this.items = notice)

    console.log(this.items)
  }


  ionViewWillEnter() {
    this.global.changeMessage(true);
  }

  openLog() {
    this.navCtrl.push('OnMaintenancePage');
  }

  openAll(){
    this.navCtrl.push('AllPage')
  }

  openManage() {
    this.navCtrl.push('MaintenanceLogPage')
  }

  locationManage() {
    this.navCtrl.push('LocationManagePage')
  }

  manage() {
    let confirm = this.alertCtrl.create({
      title: 'Notice',
      message: 'Do you want to add a notice?',
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
    this.navCtrl.push('WriteStockNoticePage')
  }
  openNoticeDetailPage(item) {
    console.log(item);
    this.navCtrl.push('StockNoticeDetailPage', {
      notice: item
    });
  }
  openRepairPage(){
    this.navCtrl.push('RepairPage')
  }

}
