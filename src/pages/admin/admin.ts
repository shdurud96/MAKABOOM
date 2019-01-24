import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { FireService } from '../../providers/FireService';
import { ViewController } from 'ionic-angular/navigation/view-controller';
// import { PaginationService } from './pagination.service';
import firebase from 'firebase'
import { GlobalVars } from '../../providers/global';
// interface User {
//   email: string
//   employee_number: string
//   name: string
//   phone: string
//   uid: string
//   role: Roles
//   thumbnail: string
// }


@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  userinfo: string;
  id: string;

  users = [];
  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";

  db = firebase.firestore();
  lastVisible;
  user_length: number;
  length_cnt: number = 0;

  loadedItemList;


  constructor(public afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams,
    public fireService: FireService, public loadingCtrl: LoadingController, private alertCtrl: AlertController,
    public afAuth: AngularFireAuth, public viewCtrl: ViewController, public toast: ToastController, public global : GlobalVars
  ) {

    this.afs.collection('users').valueChanges().subscribe((users)=>{
      this.users = users;
      console.log(this.users);
    })

  }

  ionViewWillEnter(){
    this.global.changeMessage(false);
  }


  delete(user) {

    event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: '정말로 회원 정보를 삭제하시겠습니까?',
      message: '아이템을 삭제하시려면 Yes를 클릭하세요',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            this.afs.collection('users').doc(user.uid).delete().then(() => {


              let toast = this.toast.create({
                message: "성공적으로 삭제하였습니다.",
                duration: 2000,
                position: "bottom"
              });
              toast.present();

            }).catch(function (error) {
              console.error("삭제에 실패하였습니다. ", error);
            });
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

  profile(item) {
    console.log(item.uid);
    this.navCtrl.push('UserLogPage', {
      uid: item.uid,
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  updateRole(user, role) {
    this.afs.collection('users').doc(user.uid).update({
      role: role
    })
  }
  
getItems(searchbar) {
  // Reset items back to all of the items
  this.initializeItems();

  //console.log(this.itemList)
  // set q to the value of the searchbar
  var q = searchbar.srcElement.value;
  // if the value is an empty string don't filter the items
  if (!q) {
    return;
  }
  this.users = this.users.filter((v) => {
    if(v.name && q) { 
      if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    }
  });
}

initializeItems(){
  this.users = this.loadedItemList;
}



}
