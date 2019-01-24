import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalVars } from '../../../providers/global';

@IonicPage()
@Component({
  selector: 'page-stock-notice-detail',
  templateUrl: 'stock-notice-detail.html',
})
export class StockNoticeDetailPage {

  // notice:any;
  notice: any;
  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/makaboom-4e68b.appspot.com/o/ongoingback2.JPG?alt=media&token=837992e3-f1e1-47ae-b6bb-67d10395acab";

  constructor(public navCtrl: NavController, public afs: AngularFirestore, public navParams: NavParams,
  public global : GlobalVars) {
    this.notice = this.navParams.get('notice');
    console.log(this.notice);
  }


  ionViewWillEnter() {
    // console.log('ionViewEnteredStockMangePage')
    this.global.changeMessage(false);
  }

}
