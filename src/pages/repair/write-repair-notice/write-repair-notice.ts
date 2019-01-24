import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { GlobalVars } from '../../../providers/global';

@IonicPage()
@Component({
  selector: 'page-write-repair-notice',
  templateUrl: 'write-repair-notice.html',
})
export class WriteRepairNoticePage {

  title : string;
  writer : string;
  content : string;
  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";

  constructor(public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl : AlertController, public global: GlobalVars) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WritenoticePage');
  }

  ionViewWillEnter() {
    this.global.changeMessage(false);
  }
  
  confirm() {

    if (this.title == null || this.writer == null || this.content == null) {
      let alert = this.alertCtrl.create({
        title: '빈 내용을 입력하세요',
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      this.afs.collection('repair_notice').add({
        title: this.title,
        writer: this.writer,
        content: this.content,
        timestamp: new Date()
      })
      this.navCtrl.pop();
    }
  }
}
