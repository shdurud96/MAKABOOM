import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

interface RepairItemLog{
  title: string,
  writer: string,
  description: string;
  timestamp: Date;
}



@IonicPage()
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html'
})
export class TimelinePage {

  private itemsCollection: AngularFirestoreCollection<RepairItemLog>; 



  //timeline: AngularFirestoreDocument<any[]>;
  feedView: string = "activity";


  itemList : any=[]; 
  itemArray : any = [];
  loadedItemList:  any=[]; 
  items : any = [];
  id : string;


  constructor( public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public afs: AngularFirestore,
    public alertCtrl: AlertController,
    public navParams: NavParams
  ) {

    this.id = this.navParams.get('id');

    console.log(this.id);
    console.log();


    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent', // icon style //
      content: '',
    });
    loadingPopup.present();

    this.itemsCollection = afs.collection('RepairItem').doc(`${this.id}`).collection<RepairItemLog>('repair', ref=>ref.orderBy('timestamp','desc'))
    this.items= this.itemsCollection.valueChanges()


   this.items.subscribe((RepairItemLog)=>{
        this.itemArray = RepairItemLog;
        this.itemList = this.itemArray;
        this.loadedItemList = this.itemArray;
        loadingPopup.dismiss();
      });



    console.log(this.loadedItemList)

    }


    
}
