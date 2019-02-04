import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { GlobalVars } from '../../../providers/global';
import { AngularFireAuth} from 'angularfire2/auth'


interface RepairItem {
  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  id : string;
  thumbnail: string;
  Owner : string;
  Description : string;
}

@IonicPage()
@Component({
  selector: 'page-maintenance-log',
  templateUrl: 'maintenance-log.html',
})

export class MaintenanceLogPage {

  private itemsCollection: AngularFirestoreCollection<RepairItem>;

  itemList: any = [];
  itemArray: any = [];
  loadedItemList: any = [];
  items: any = [];
  backgroundImage ="https://firebasestorage.googleapis.com/v0/b/makaboom-4e68b.appspot.com/o/realback.JPG?alt=media&token=3f1ab8c6-4d9a-48e1-ae6f-99bd6d043dd6";
  cardImage = "https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%852.png?alt=media&token=78826653-cbd4-442d-9607-0b03983167b5"

  constructor(public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public afs: AngularFirestore,
    public alertCtrl: AlertController,
    public global: GlobalVars,
    public toast: ToastController,
    public afAuth : AngularFireAuth
  ) {

    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent', // icon style //
      content: '',
    });
    loadingPopup.present();

    this.itemsCollection = afs.collection('User').doc(this.afAuth.auth.currentUser.uid).collection<RepairItem>('On_Project');
    this.items = this.itemsCollection.valueChanges();
    this.items.subscribe((RepairItem) => {
      this.itemArray = RepairItem;
      this.itemList = this.itemArray;
      this.loadedItemList = this.itemArray;
      loadingPopup.dismiss();
    });

  }

  ionViewWillEnter() {
    //console.log('ionViewEnteredRepairPage')
    this.global.changeMessage(false);
  }

  initializeItems() {
    this.itemList = this.loadedItemList;
  }

  complete(item){
    console.log("completed")
    event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to complete the project?',
      message: 'Click Yes to complete',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.real_completed(item)
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

  
  
  delete(item){
    event.stopPropagation();
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to delete the project?',
      message: 'Click Yes to delete',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.real_deleted(item)
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
  real_deleted(item){
    console.log(item.model)
    this.afs.collection('User').doc(this.afAuth.auth.currentUser.uid).collection('On_Project').doc(item.ProjectName).delete().then(()=> {
    //  this.afs.collection('RepairItem').doc(item.id).delete().then(() => {
      console.log(this.afAuth.auth.currentUser.uid)
      let toast = this.toast.create({
        message: "Deleted sucessfully.",
        duration: 2000,
        position: "bottom"
      });
      toast.present();
      this.navCtrl.pop();
    }).catch(function (error) {
      console.error("Filed to delete. ", error);
    });
  }
  real_completed(item){
    this.afs.collection('User').doc(this.afAuth.auth.currentUser.uid).collection('DoneProject').doc(item.ProjectName).set({
      ProjectName : item.ProjectName, 
      DevEn : item.DevEn, 
      Partner : item.Partner, 
      id : item.id, 
      Date : item.Date, 
      isToggled : item.isToggled, 
      thumbnail : item.thumbnail, 
      Owner : item.Owner, 
      Description : item.Description
    })
    
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

   // console.log(this.itemList)
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }
    
    this.itemList = this.itemList.filter((v) => {
      if (v.ProjectName && q) {
        if (v.ProjectName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    //console.log(q, this.itemList.length);
  }



  manage() {
    let confirm = this.alertCtrl.create({
      title: 'Do you want to add a new project?',
      message: 'Click Yes to add a new project',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.openAdd()
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


  openAdd() {
    this.navCtrl.push('AddrepairPage')
  }

  openDetail(item) {
    this.navCtrl.push('RepairitemdetailPage', {
      ProjectName : item.ProjectName, 
      DevEn : item.DevEn, 
      Partner : item.Partner, 
      id : item.id, 
      Date : item.Date, 
      isToggled : item.isToggled, 
      thumbnail : item.thumbnail,
      Owner : item.Owner, 
      Description : item.Description
    })
  }
}
