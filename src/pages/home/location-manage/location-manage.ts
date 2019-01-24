
import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { GlobalVars } from '../../../providers/global';
import { AngularFireAuth } from 'angularfire2/auth'

class Item {
  location1: any;
  location2: any;
  model: string;
  quantity: number;
  id :string;
  public add_num : number;
  public remove_num : number;
}

@IonicPage()
@Component({
  selector: 'page-location-manage',
  templateUrl: 'location-manage.html',
})


export class LocationManagePage {
  private itemsCollection: AngularFirestoreCollection<Item>;
  itemList: any = [];
  itemArray: any = [];
  loadedItemList: any = [];
  addArray : any =[];
  removeArray : any =[];
  public count_temp : number =0;
  public pre_quan : any =[];
  public modify : boolean = false;
  public input_mod : boolean;

  temp : number =0;
  public setArray : any=[];


  itemList1: any = [];
  itemList2: any = [];
  itemArray2: any = [];


  items: any = [];
  location: string;
  itemgetList: any = [];
  payload: string;
  seperate: any[];

  location1: string;
  location2: string;

  location_origin: string;
  backgroundImage="https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";

  constructor(public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private afs: AngularFirestore,
    public navParams: NavParams,
    public global: GlobalVars, 
    public afAuth : AngularFireAuth
  ) {

    this.location_origin = null; //초기화
    this.payload = null;

    this.location1 = null;
    this.location2 = null;
    this.payload = this.navParams.get('payload')
    this.location_origin = this.navParams.get("location_origin")
    
    console.log(this.location_origin, "from QR Page")
    // alert(this.location_origin);
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent', // icon style //
      content: '',
      duration: 1000
    });
    loadingPopup.present();

    this.itemsCollection = afs.collection<Item>('item', ref=>ref.orderBy("model"));
    this.items = this.itemsCollection.valueChanges();

    this.items.subscribe((item) => {
      this.itemArray = item;
      this.itemList = this.itemArray;
      this.loadedItemList = this.itemArray;
      loadingPopup.dismiss();
    })

   
    
    
    setTimeout(() => {
      this.count_temp = 0;
      for (var i = 0; i < this.itemArray.length; i++) {
        this.itemArray[i].add_num = 0;
        this.itemArray[i].remove_num = 0;
        this.setArray[i] = this.itemArray[i]
        this.afs.collection('item').doc(this.itemArray[i].id).ref.get()
          .then((Model) => {
            this.pre_quan[this.count_temp++] = Model.get('quantity')
          })
      }
    }, 50);

    if (this.location_origin != null) {
      this.afs.collection('location_map').doc(`${this.location_origin}`).valueChanges()
        .subscribe((location_info: any) => {
          this.location1 = location_info.location1;
          this.location2 = location_info.location2;
          // alert(this.location1);
          // alert(this.location2);
          this.goTo2();
        })
    }
    else if (this.payload != null) {
      this.afs.collection('location_map').doc(`${this.payload}`).valueChanges()
        .subscribe((location_info: any) => {
          this.location1 = location_info.location1;
          this.location2 = location_info.location2;
          console.log(this.location1);
          console.log(this.location2);
          this.goTo2()
        })
    }
  }


  remove(item) {
    this.modify=true;
    event.stopPropagation();
    item.quantity--;
  
  }
  add(item) {
    this.modify=true;
    event.stopPropagation();
    item.quantity++;
  }
  input(item){
    event.stopPropagation();
    //console.log("input", item.mode,  item.quantity)
    this.modify=true;
    this.input_mod = true;
  }

  ionViewWillEnter() {
    // console.log('ionViewEnteredStockMangePage')
    this.global.changeMessage(false);
  }


  goTo1() {

    if (this.location2 == null) {
      this.itemsCollection = this.afs.collection<Item>('item', ref => ref.where('location1', '==', this.location1).orderBy("model"))
    } //location2 옵션 변경시 바뀌게 하는 조건
    else {
      this.itemsCollection = this.afs.collection<Item>('item', ref => ref.where('location1', '==', this.location1).where('location2', '==', this.location2).orderBy("model"))
    }

    this.items = this.itemsCollection.valueChanges();
    this.items.subscribe((item) => {
      console.log(this.items)
      this.itemArray = item;
      this.itemList = this.itemArray;
      this.loadedItemList = this.itemArray;
    })
  }
  
  goTo2() {
    if (this.location1 == null) {
      this.itemsCollection = this.afs.collection<Item>('item', ref => ref.where('location2', '==', this.location2).orderBy("model"))
    } //location2 옵션 변경시 바뀌게 하는 조건
    else {
      this.itemsCollection = this.afs.collection<Item>('item', ref => ref.where('location1', '==', this.location1).where('location2', '==', this.location2).orderBy("model"))
    }

    this.items = this.itemsCollection.valueChanges();
    this.items.subscribe((item) => {
      console.log(this.items)
      this.itemArray = item;
      this.itemList = this.itemArray;
      this.loadedItemList = this.itemArray;

    })
  }

  set(){
    let confirm = this.alertCtrl.create({
      title: '현재 상태를 저장하시겠습니까?',
      message: '현재 상태를 저장하려면 Yes를 클릭하세요',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            //저장 함수 실행
            this.fire_update();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            //page reload함수 
            this.reload();

          }
        }
      ]
    });
    confirm.present();
  }
  
  reload(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component)
  }
  left(){
    for(var i=0; i<this.itemArray.length; i++){
      //console.log(this.itemArray[i].model, this.itemArray[i].quantity, this.pre_quan[i])
    }
  }
  fire_update() {
    this.left();
    for (var i = 0; i < this.itemArray.length; i++) {
      if (this.pre_quan[i] < this.itemArray[i].quantity) {
        this.itemArray[i].add_num = this.itemArray[i].quantity - this.pre_quan[i];
        console.log("added", this.itemArray[i].model, this.itemArray[i].add_num);

        //log add
        this.afs.collection('log').add({
          changed_quantity: this.itemArray[i].add_num,
          location1: this.itemArray[i].location1,
          location2: this.itemArray[i].location2,
          model: this.itemArray[i].model,
          quantity: this.itemArray[i].quantity,
          timestamp: new Date(),
          type: "import"
        })
        //item update
        this.afs.collection('item').doc(this.itemArray[i].id).update({
          quantity: this.itemArray[i].quantity
        })
        //user stock_log
        var timestamp_temp = new Date()
    
        this.afs.collection('users').doc(this.afAuth.auth.currentUser.uid).collection('Stock_Log').add({
          timestamp: timestamp_temp,
          changed_quantity: this.itemArray[i].add_num,
          location1: this.itemArray[i].location1,
          location2: this.itemArray[i].location2,
          model: this.itemArray[i].model,
          quantity: this.itemArray[i].quantity,
          type: "import"
        })
        this.pre_quan[i] = this.itemArray[i].quantity
      }
      else if (this.pre_quan[i] > this.itemArray[i].quantity) {
        this.itemArray[i].remove_num = this.pre_quan[i] - this.itemArray[i].remove_num;
        console.log("removed", this.itemArray[i].model, this.itemArray[i].remove_num)

        //log add
        this.afs.collection('log').add({
          changed_quantity: this.itemArray[i].remove_num,
          location1: this.itemArray[i].location1,
          location2: this.itemArray[i].location2,
          model: this.itemArray[i].model,
          quantity: this.itemArray[i].quantity,
          timestamp: new Date(),
          type: "export"
        })
        //item update
        this.afs.collection('item').doc(this.itemArray[i].id).update({
          quantity: this.itemArray[i].quantity
        })
        //user stock_log
        var timestamp_temp = new Date()
        this.afs.collection('users').doc(this.afAuth.auth.currentUser.uid).collection('Stock_Log').add({
          timestamp: timestamp_temp,
          changed_quantity: this.itemArray[i].remove_num,
          location1: this.itemArray[i].location1,
          location2: this.itemArray[i].location2,
          model: this.itemArray[i].model,
          quantity: this.itemArray[i].quantity,
          type: "export"
        })


        this.pre_quan[i] = this.itemArray[i].quantity
      }
    }
  }
  openDetail(item) {
    this.navCtrl.push('ItemDetailPage', {
      id: item.id,
      model : item.model,
      location1: item.location1,
      location2: item.location2, 
      quantity: item.quantity
    })
  }


}


