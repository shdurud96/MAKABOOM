import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { GlobalVars } from '../../../providers/global';
import { AngularFireAuth} from 'angularfire2/auth'


interface userRepairLog {
  model: string,
  serialNum: string,
  title: string,
  writer: string,
  description: string;
  timestamp: Date;
  id;
}

interface RepairItem {
  model: string;
  serialNum: string;
  repairman: string;
  id: string;
  isToggled: boolean;
  startDate: Date;
  finDate: Date;
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

  repairlogList: any = [];
  repairlogArray: any = [];
  repairlogs: any = [];

  itemList: any = [];
  itemArray: any = [];
  loadedItemList: any = [];
  items: any = [];


  idList = new Set();
  uniqueIdList: any = []

  id: string;
  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";

  constructor(public navCtrl: NavController, public navParams: NavParams, public afs: AngularFirestore, public afAuth:AngularFireAuth, public global : GlobalVars) {


    this.id = this.afAuth.auth.currentUser.uid


    this.usersRepairCollection = afs.collection('users').doc(this.id).collection<userRepairLog>('Repair_Log')
    this.repairlogs = this.usersRepairCollection.valueChanges()
      .subscribe((docs)=>{
        this.repairlogList = docs;
        for(var doc of docs){
          this.idList.add(doc.id);
        }
        let list = Array.from(this.idList)
        console.log(list);
        for(var id of list){
          this.afs.collection('RepairItem').doc(id).valueChanges()
            .subscribe((doc)=>{
              this.itemList.push(doc);
            })
        }
      })

    console.log(this.idList);


  
  }





  openDetail(item){
    this.navCtrl.push('RepairitemdetailPage',{
      model: item.model,
      id: item.id,
      serialNum: item.serialNum,
      repairman: item.repairman,
      isToggled: item.isToggled,
      startDate: item.startDate,
      finDate: item.finDate
    })
  }
  ionViewWillEnter() {
    this.global.changeMessage(false);
  }

}
