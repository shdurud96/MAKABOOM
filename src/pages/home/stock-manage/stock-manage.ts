import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
// import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
// import 'rxjs/add/operator/map'; // you might need to import this, or not depends on your setup

import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FireService } from '../../../../src/providers/FireService'
import { GlobalVars } from '../../../providers/global';
import { AngularFireAuth } from 'angularfire2/auth'
class Item {
  location1: any;
  location2: any;
  model: string;
  quantity: number;
  id: string;
  public add_num: number;
  public remove_num: number;
}
@IonicPage()
@Component({
  selector: 'page-stock-manage',
  templateUrl: 'stock-manage.html',
})
export class StockManagePage {
  item = new Item()
  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";
  new_item;

  public itemsCollection: AngularFirestoreCollection<Item>;
  itemList: any = [];
  public itemArray: any = [];
  loadedItemList: any = [];
  items: any = [];

  public setArray: any = [];

  addArray: any = [];
  removeArray: any = [];
  public count_temp: number = 0;
  public pre_quan: any = [];

  public modify: boolean = false;

  temp: number = 0;

  public input_mod : boolean = false;


  constructor(public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private afs: AngularFirestore,
    public navParams: NavParams,
    public fireService: FireService,
    public global: GlobalVars,
    public afAuth: AngularFireAuth
  ) {
  
    this.itemsCollection = afs.collection<Item>('item');
    this.items = this.itemsCollection.valueChanges();
    //this.items=this.afs.collection<Item>('item').ref.orderBy("model");

    this.items.subscribe((item) => {

      this.itemArray = item;
      this.itemList = this.itemArray;
      this.loadedItemList = this.itemArray;
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


  }
  remove(item) {
    this.modify = true;
    event.stopPropagation();
    item.quantity--;
  }

  add(item) {
    this.modify = true;
    event.stopPropagation();
    item.quantity++;
  }

  input(item){
    event.stopPropagation();
    //console.log("input", item.mode,  item.quantity)
    this.modify=true;
    this.input_mod = true;
  }

  ionViewWillUnload() {
    if (this.modify == true) {
      this.set();
    }
  }

  ionViewWillEnter() {
    this.global.changeMessage(false);
  }

  set() {
    let confirm = this.alertCtrl.create({
      title: '현재 상태를 저장하시겠습니까?',
      message: '현재 상태를 저장하려면 Yes를 클릭하세요',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.fire_update();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  initializeItems() {
    this.itemList = this.loadedItemList;

  }

  left(){
    for(var i=0; i<this.itemArray.length; i++){
      //console.log(this.itemArray[i].model, this.itemArray[i].quantity, this.pre_quan[i])
    }
  }
  fire_update() {
    this.left();
    // if(this.input_mod==true){
    //   console.log("input mod ", this.item)
    // }
    //console.log("update")
    for (var i =0; i < this.itemArray.length; i++) {
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


  fire_reset() {
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
    this.itemList = this.itemList.filter((v) => {
      if (v.model && q) {
        if (v.model.toLowerCase().indexOf(q.toLowerCase()) > -1) {

          return true;
        }
        return false;
      }
    });

    // console.log(q, this.itemList.length);
  }




  manage() {
    let confirm = this.alertCtrl.create({
      title: '새로운 아이템을 추가하겠습니까?',
      message: '새로운 아이템을 추가하려면 Yes를 클릭하세요',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.openNextPage()
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

  openNextPage() {
    this.navCtrl.push('ManagePage')
  }

  openDetail(item) {
    this.navCtrl.push('ItemDetailPage', {
      serialNum: item.serialNum,
      model: item.model,
      location1: item.location1,
      location2: item.location2,
      quantity: item.quantity,
      id: item.id
    })
  }

}
