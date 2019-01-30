import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { GlobalVars } from '../../../providers/global';
import { AngularFireAuth} from 'angularfire2/auth'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


interface userRepairLog {
  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  id : string;
  thumbnail: string;

}

interface User {
  email : string;
  name : string;
  phone_num : number;
  student_num : number;
  thumbnail : string;
  uid: string;

}

interface RepairItem {
  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  id : string;
  thumbnail: string;
}


@IonicPage()
@Component({
  selector: 'page-on-maintenance',
  templateUrl: 'on-maintenance.html',
})
export class OnMaintenancePage {


  viewType: string = "Item";

  private usersRepairCollection: AngularFirestoreCollection<userRepairLog>;
  private itemsCollection: AngularFirestoreCollection<RepairItem>;
  private UserCol : AngularFirestoreCollection<User>;
  private param: AngularFirestoreCollection<userRepairLog>;
  repairlogList: any = [];
  repairlogArray: any = [];
  repairlogs: any = [];
  users : any=[];
  itemList: any = [];
  itemArray: any = [];
  loadedItemList: any = [];
  items: any = [];
  projectArray : any=[]
  userList : any=[];
  user_name : string = "";
  idList = new Set();
  uniqueIdList: any = []

  id: string;
  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/makaboom-4e68b.appspot.com/o/ongoingback3.JPG?alt=media&token=144c8363-e39a-480c-a18e-e3cde442c5c8";

  constructor( public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams, public afs: AngularFirestore, public afAuth:AngularFireAuth, public global : GlobalVars) {
    console.log("real show")
//    console.log(this.afs.collection('User').doc(this.afAuth.auth.currentUser.uid).valueChanges());
    this.id = this.afAuth.auth.currentUser.uid
   // console.log(this.id)
    // this.UserCol=afs.collection<User>('User')
    // this.users=this.UserCol.valueChanges()
    // .subscribe((docs)=>{
    //   this.userList=docs;
    //   console.log("dd")
    // })

    // this.userList.forEach(function (value){
    //   console.log(value.uid)
    //  })

    this.usersRepairCollection=afs.collection('User').doc(this.afAuth.auth.currentUser.uid).collection<userRepairLog>('DoneProject')
    this.repairlogs = this.usersRepairCollection.valueChanges()
      .subscribe((docs)=>{
        this.repairlogList = docs;
        this.repairlogList.forEach(function (value){
         // console.log(value.ProjectName, value.Date, value.Partner, value.DevEn)
        })


      })
  }

  openDetail(item){
  
    console.log(item.ProjectName) //프로젝트 이름으로 조회해서 navParam 내보내기
    this.navCtrl.push('RepairitemdetailPage', {
      ProjectName : item.ProjectName, 
      DevEn : item.DevEn, 
      Partner : item.Partner, 
      id : item.id, 
      Date : item.Date, 
      isToggled : item.isToggled, 
      thumbnail : item.thumbnail,
      Owner : item.Owner
    })


  }

  show(item){
    event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: 'Do you really want to show someone else?',
      message: 'Click Yes to share',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.real_show(item)
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

  real_show(item){
   
      /*  Share 하는 페이지에 보낼 정보
      */
      this.afs.collection('Share').doc(item.ProjectName).set({
      ProjectName : item.ProjectName, 
      DevEn : item.DevEn, 
      Partner : item.Partner, 
      id : item.id, 
      Date : item.Date, 
      isToggled : item.isToggled, 
      thumbnail : item.thumbnail, 
      uid : this.afAuth.auth.currentUser.uid,
      Owner : item.Owner

      //user_name : this.user_name
      })
  }


  
  ionViewWillEnter() {
    this.global.changeMessage(false);
  }

}
