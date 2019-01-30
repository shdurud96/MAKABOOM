import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FireService } from '../../../providers/FireService'
import { RepairitemdetailPageModule } from './repairitemdetail.module';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import {AngularFireAuth} from 'angularfire2/auth'
import firebase from 'firebase';

class RepairItem {
  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  id : string;
  thumbnail: string;
  Owner : string;
}

interface RepairItemLog {
  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  id : string;
  thumbnail: string;
  Owner : string;
}

@IonicPage()
@Component({
  selector: 'page-repairitemdetail',
  templateUrl: 'repairitemdetail.html',
})


export class RepairitemdetailPage {

  private itemsCollection: AngularFirestoreCollection<RepairItemLog>;

  id_temp : string ;
  RepairItem = new RepairItem();

  itemList: any = [];
  itemArray: any = [];
  items: any = [];

  showToolbar: boolean = false;
  transition: boolean = false;

  id: string;
  serialNum: string;
  model: string;
  repairman: string;

  startDate: Date;
  finDate: Date
  isToggled: boolean;
  
  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  thumbnail: string;
  Owner : string;

  close: boolean;

  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/makaboom-4e68b.appspot.com/o/detail2.JPG?alt=media&token=bd5f5628-0fc3-40af-8826-b76fe5c08b2e";

  item_length: number;
  lastVisible: any;
  db = firebase.firestore();
  length_cnt: number = 0;


  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController,
    public ref: ChangeDetectorRef,  public fireService : FireService, public afs: AngularFirestore, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,public afAuth : AngularFireAuth) {

    
      this.ProjectName=this.navParams.get('ProjectName')
      this.DevEn=this.navParams.get('DevEn')
      this.Partner=this.navParams.get('Partner')
      this.Date=this.navParams.get('Date')
      this.id=this.navParams.get('id')
      this.isToggled=this.navParams.get('isToggled')
      this.thumbnail=this.navParams.get('thumbnail')
      this.Owner=this.navParams.get('Owner')


      /*
      this.id = this.navParams.get('id');
      this.serialNum = this.navParams.get('serialNum');
      this.model = this.navParams.get('model');
      this.repairman = this.navParams.get('repairman');
      this.isToggled = this.navParams.get('isToggled');
      this.finDate = this.navParams.get('finDate');
      this.startDate = this.navParams.get('startDate')*/

      this.loadItems();
      this.afs.collection('RepairItem').doc(`${this.id}`).collection('repair').valueChanges().subscribe((snap)=>{
        this.item_length = snap.length;
        console.log(this.item_length);
      })

      // this.itemsCollection = afs.collection('RepairItem').doc(`${this.id}`).collection<RepairItemLog>('repair', ref=>ref.orderBy('timestamp','desc').limit(2))
    //   this.items= this.itemsCollection.valueChanges()
  
  
    //  this.items.subscribe((RepairItemLog)=>{
    //       this.itemArray = RepairItemLog;
    //       this.itemList = this.itemArray;
    //       this.loadedItemList = this.itemArray;
    //     });
  
       this.close = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailPage');
  }

  loadItems(infiniteScroll?) {

    if (this.lastVisible == null) {
      this.db.collection('User').doc(this.afAuth.auth.currentUser.uid).collection('On_Project').doc(this.ProjectName).collection('timeline')
     // this.db.collection('RepairItem').doc(`${this.id}`).collection('repair')
        .orderBy('timestamp','desc')
        .limit(3)
        .get()
        .then((querySnapshot) => {
          this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          this.length_cnt = this.length_cnt + querySnapshot.docs.length;
          console.log(this.length_cnt)
          querySnapshot.forEach((doc) => {
            this.itemList.push(doc.data())
          })
        })
    }
    else {
      this.db.collection('User').doc(this.afAuth.auth.currentUser.uid).collection('On_Project').doc(this.ProjectName).collection('timeline')
     // this.db.collection('RepairItem').doc(`${this.id}`).collection('repair')
        .orderBy('timestamp','desc')
        .startAfter(this.lastVisible)
        .limit(2)
        .get()
        .then((querySnapshot) => {

          this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          this.length_cnt = this.length_cnt + querySnapshot.docs.length;
          console.log(this.length_cnt)
          querySnapshot.forEach((doc) => {
            this.itemList.push(doc.data())
          })

          if (infiniteScroll) {
            infiniteScroll.complete();
          }
        })
    }
  }

  loadMore(infiniteScroll) {

    if (this.length_cnt < this.item_length)
      this.loadItems(infiniteScroll);

    console.log(this.item_length)
    if (this.length_cnt >= this.item_length)
      infiniteScroll.enable(false);
  }

  addlog(){
    this.navCtrl.push('AddlogPage',{
      id : this.id,
      Date : this.Date, 
      ProjectName : this.ProjectName
    })
  }

  timeline() {
    this.navCtrl.push('TimelinePage', {
      id: this.id
    })
  }

  // repairfin() {

  //   this.isToggled !== true;
  //   console.log(this.isToggled)
  //   this.RepairItem.isToggled = this.isToggled
  //   this.RepairItem.finDate = new Date()
  //   this.finDate = this.RepairItem.finDate;
  //   this.RepairItem.id = this.id
  //   this.fireService.finAdd(this.RepairItem)
  //   console.log(this.finDate)
  // }



  delete() {

    let confirm = this.alertCtrl.create({
      title: '정말로 아이템을 삭제하시겠습니까?',
      message: '아이템을 삭제하시려면 Yes를 클릭하세요',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.afs.collection('RepairItem').doc(this.id).delete().then(() => {

              let toast = this.toast.create({
                message: "성공적으로 삭제하였습니다.",
                duration: 2000,
                position: "bottom"
              });

              toast.present();
              this.navCtrl.pop();
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


  more() {

    this.itemsCollection = this.afs.collection('RepairItem').doc(`${this.id}`).collection<RepairItemLog>('repair', ref => ref.orderBy('timestamp', 'desc'))
    this.items = this.itemsCollection.valueChanges()


    this.items.subscribe((RepairItemLog) => {
      this.itemArray = RepairItemLog;
      this.itemList = this.itemArray;
    });

    this.close = false;

  }

}
