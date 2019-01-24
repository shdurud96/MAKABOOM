import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { GlobalVars } from '../../../providers/global';
import {AngularFireAuth} from 'angularfire2/auth'
/**
 * Generated class for the WritenoticePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
interface User{
  name : string;
  uid : string;
}

@IonicPage()
@Component({
  selector: 'page-write-stock-notice',
  templateUrl: 'write-stock-notice.html',
})
export class WriteStockNoticePage {

  title: string;
  writer: string;
  content: string;

  user : any = [];
  userList : any=[]; 
  userArray : any = [];
  loadedUserList:  any=[]; 
  private itemsCollection: AngularFirestoreCollection<User>;

  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";

  constructor(public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams,
    public global: GlobalVars, public alertCtrl: AlertController, public afAuth : AngularFireAuth) {
      
      
      // this.afs.collection<User>('users', ref=>ref.where("uid", "==", this.afAuth.auth.currentUser.uid)).valueChanges()
      // .subscribe((user : any)=>{
      //   this.userArray = user;
      //   this.userList = this.userArray;
      //   this.loadedUserList = this.userArray;
      // })
  
  
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WritestocknoticePage');
    this.global.changeMessage(false);
  }

  confirm() {
    console.log(this.afAuth.auth.currentUser.uid)
    //this.itemsCollection = this.afs.collection<Log>('log', ref => ref.where('type', '==', 'import'));
  
    if (this.title == null||this.content == null||this.writer==null) {
      let alert = this.alertCtrl.create({
        title: '빈 내용을 입력하세요',
        buttons: ['OK']
      });
      alert.present();
    }
    else {
  
      this.afs.collection('Notice').add({
        title: this.title,
        writer: this.writer,
        content: this.content,
        timestamp: new Date() 
      })
      this.navCtrl.pop();
    }
    
  }

}
