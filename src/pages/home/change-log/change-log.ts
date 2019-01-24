import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FireService } from '../../../../src/providers/FireService'
import { Observable, BehaviorSubject } from 'rxjs'
import { map, combineLatest, switchMap } from 'rxjs/operators'
import { ItemDetailPage } from '../stock-manage/item-detail/item-detail';
import { LoginPage } from '../../auth/login/login';
import { timestamp } from 'rxjs/operators/timestamp';
import { HomePage } from '../home';
import { GlobalVars } from '../../../providers/global';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';

 /**
 * Generated class for the ChangeLogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class Log{
  location1: any;
  location2: any;
  model: string;
  quantity : number;
  type : string;
  timestamp : string;
}

@IonicPage()
@Component({
  selector: 'page-change-log',
  templateUrl: 'change-log.html',
})
export class ChangeLogPage {  
  //startDate = new Date().setTime(1999)
  startDate : Date
  finDate : Date
  midDate : Date
  tempDate : Date

  public itemsCollection: AngularFirestoreCollection<Log>; 
  items : any = [];
  itemList : any=[]; 
  itemArray : any = [];
  loadedItemList:  any=[]; 
  
  items_2 : any = [];
  itemTemp : any = [];
  changed_type : string;
  backgroundImage="https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afs: AngularFirestore,
    public fireService : FireService, private modalCtrl : ModalController,
    public global : GlobalVars) {
      
    
    this.itemsCollection = this.afs.collection<Log>('log', ref=>ref.orderBy("timestamp", "desc"));
    this.items= this.itemsCollection.valueChanges();
    this.items.subscribe((item)=>{
          this.itemArray = item;
          this.itemList = this.itemArray;
          this.loadedItemList = this.itemArray;
    })
    
    }
    
    // this.changed_type=this.navParams.get('changed_type')
    // this.startDate = this.navParams.get('startDate')
    // this.finDate = this.navParams.get('finDate')


  getType(get){
    //console.log("input")
    
    if(this.changed_type=="import"){
        
      this.itemsCollection = this.afs.collection<Log>('log', ref => ref.where('type', '==', 'import').orderBy("timestamp", "desc"));
      this.items= this.itemsCollection.valueChanges();
      this.items.subscribe((item)=>{
            this.itemArray = item;
            this.itemList = this.itemArray;
            this.loadedItemList = this.itemArray;
            //loadingPopup.dismiss();
      })
      }
      if(this.changed_type=="export"){
          this.itemsCollection = this.afs.collection<Log>('log', ref => ref.where('type', '==', 'export').orderBy("timestamp", "desc"));
          this.items= this.itemsCollection.valueChanges();
          this.items.subscribe((item)=>{
                this.itemArray = item;
                this.itemList = this.itemArray;
                this.loadedItemList = this.itemArray;
                //loadingPopup.dismiss();
          })
        }

        if(this.changed_type=="location_changed"){
          this.itemsCollection = this.afs.collection<Log>('log', ref => ref.where('type', '==', 'location_changed').orderBy("timestamp", "desc"));
          this.items= this.itemsCollection.valueChanges();
          this.items.subscribe((item)=>{
                this.itemArray = item;
                this.itemList = this.itemArray;
                this.loadedItemList = this.itemArray;
                //loadingPopup.dismiss();
          })
        }

  }  
ionViewWillEnter() {
  this.global.changeMessage(false);
}

  openDetail(item){
    this.navCtrl.push('ItemDetailPage',{
      serialNum : item.serialNum,
      model : item.model,
      location1 : item.location1,
      location2 : item.location2,
      quantity : item.quantity,
      id : item.id
    })
  }
  
  search(get_value){
    setTimeout(() => {
       //console.log(this.itemArray);
    this.startDate=new Date (this.startDate);
    this.finDate=new Date (this.finDate);
    this.midDate=this.startDate;

    this.finDate.setHours(23);
    this.finDate.setMinutes(59);
    this.finDate.setSeconds(59);

    
    console.log(this.changed_type);
    console.log(this.startDate)
    console.log(this.finDate);
    console.log(this.midDate);
    console.log(this.tempDate)


   if(this.changed_type){
    if(this.changed_type=="import"){
    this.itemsCollection = this.afs.collection<Log>('log', ref => ref.where('type', '==', 'import')
                                                    .where('timestamp', '<=', this.finDate)
                                                    .where('timestamp', '>=', this.startDate)
                                                    .orderBy("timestamp", "desc"));
    this.items= this.itemsCollection.valueChanges();
    this.items.subscribe((item)=>{
          console.log(this.items)
          this.itemArray = item;
          this.loadedItemList = this.itemArray;
    })
    }
    if(this.changed_type=="export"){
        this.itemsCollection = this.afs.collection<Log>('log', ref => ref.where('type', '==', 'export').where('timestamp', '<=', this.finDate).where('timestamp', '>=', this.startDate).orderBy("timestamp", "desc"));
        this.items= this.itemsCollection.valueChanges();
        this.items.subscribe((item)=>{
              this.itemArray = item;
              this.itemList = this.itemArray;
              this.loadedItemList = this.itemArray;
              //loadingPopup.dismiss();
        })
      }

      if(this.changed_type=="location_changed"){
        this.itemsCollection = this.afs.collection<Log>('log', ref => ref.where('type', '==', 'location_changed').where('timestamp', '<=', this.finDate).where('timestamp', '>=', this.startDate).orderBy("timestamp", "desc"));
        this.items= this.itemsCollection.valueChanges();
        this.items.subscribe((item)=>{
              this.itemArray = item;
              this.itemList = this.itemArray;
              this.loadedItemList = this.itemArray;
              //loadingPopup.dismiss();
        })
      }
      
  }
  else{
    console.log("no type")
    this.itemsCollection = this.afs.collection<Log>('log', ref=>ref.where('timestamp', '<=', this.finDate).where('timestamp', '>=', this.startDate).orderBy("timestamp", "desc"));
    this.items= this.itemsCollection.valueChanges();
    this.items.subscribe((item)=>{
          this.itemArray = item;
          this.itemList = this.itemArray;
          this.loadedItemList = this.itemArray;
    })
  }
      
    }, 50);

   
  }

}

@Component({
  templateUrl: 'fill.html',
  selector: 'page-fill'
})
export class FillPage{

}
