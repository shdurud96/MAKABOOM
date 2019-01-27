import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { GlobalVars } from '../../../providers/global';
import { AngularFireAuth} from 'angularfire2/auth'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


interface userRepairLog {
  // model: string,
  // serialNum: string,
  // title: string,
  // writer: string,
  // description: string;
  // timestamp: Date;
  // id;
  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  id : string;
  thumbnail: string;

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
  
  private param: AngularFirestoreCollection<userRepairLog>;
  repairlogList: any = [];
  repairlogArray: any = [];
  repairlogs: any = [];

  itemList: any = [];
  itemArray: any = [];
  loadedItemList: any = [];
  items: any = [];
  projectArray : any=[]
 
  idList = new Set();
  uniqueIdList: any = []

  id: string;
  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/makaboom-4e68b.appspot.com/o/ongoingback3.JPG?alt=media&token=144c8363-e39a-480c-a18e-e3cde442c5c8";

  constructor( public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams, public afs: AngularFirestore, public afAuth:AngularFireAuth, public global : GlobalVars) {


    this.id = this.afAuth.auth.currentUser.uid

    this.usersRepairCollection=afs.collection('User').doc(this.afAuth.auth.currentUser.uid).collection<userRepairLog>('DoneProject')
    //this.usersRepairCollection = afs.collection('users').doc(this.id).collection<userRepairLog>('Repair_Log')
    this.repairlogs = this.usersRepairCollection.valueChanges()
      .subscribe((docs)=>{
        // this.repairlogList=docs;
        // for(var i of docs){
        //   console.log(this.repairlogLisy)
        // }
        this.repairlogList = docs;
        this.repairlogList.forEach(function (value){
          console.log(value.ProjectName, value.Date, value.Partner, value.DevEn)
        })

        
        // for(var doc of docs){
        //   this.idList.add(doc.id);
        // }
        // let list = Array.from(this.idList)
        // //console.log(list);
        
       
        // for(var id of list){
        //   this.afs.collection('User').doc(this.afAuth.auth.currentUser.uid).valueChanges()
        //     .subscribe((doc)=>{
        //       this.itemList.push(doc);
        //     })
        // }

      })


  
  }





  openDetail(item){
    // this.navCtrl.push('RepairitemdetailPage',{
    //   model: item.model,
    //   id: item.id,
    //   serialNum: item.serialNum,
    //   repairman: item.repairman,
    //   isToggled: item.isToggled,
    //   startDate: item.startDate,
    //   finDate: item.finDate
    // })
    console.log(item.ProjectName) //프로젝트 이름으로 조회해서 navParam 내보내기
    this.navCtrl.push('RepairitemdetailPage', {
      ProjectName : item.ProjectName, 
      DevEn : item.DevEn, 
      Partner : item.Partner, 
      id : item.id, 
      Date : item.Date, 
      isToggled : item.isToggled, 
      thumbnail : item.thumbnail
    })

 //   this.param= this.afs.collection('User').doc(this.afAuth.auth.currentUser.uid).collection<userRepairLog>('On_Project')
    
    //this.itemsCollection = this.afs.collection('RepairItem').doc(`${this.id}`).collection<RepairItemLog>('repair', ref => ref.orderBy('timestamp', 'desc'))
  
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
    // this.usersRepairCollection=afs.collection('User').doc(this.afAuth.auth.currentUser.uid).collection<userRepairLog>('DoneProject')
      var docRef = this.afs.collection('User').doc(this.afAuth.auth.currentUser.uid)
      console.log(docRef)

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
      //Engineer: this.
      })
      


  }


  
  ionViewWillEnter() {
    this.global.changeMessage(false);
  }

}
