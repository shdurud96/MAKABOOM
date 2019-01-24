import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth'
import { timestamp } from 'rxjs/operator/timestamp';


@Injectable()
export class FireService {

  id_temp: string;
  constructor(public afs: AngularFirestore, public toast: ToastController, public afAuth: AngularFireAuth) {
    //this.id_temp=this.afAuth.auth.currentUser.uid;

  }


  finAdd(RepairItem) {
    this.afs.collection('RepairItem').doc(`${RepairItem.id}`).update({
      finDate: RepairItem.finDate,
      isToggled: RepairItem.isToggled

    })

  }
  
  LogAdd(RepairLog) {
    // console.log(RepairLog.id)
    // this.afs.collection('RepairItem').doc(`${RepairLog.id}`).collection('repair').add({
    //   title: RepairLog.title,
    //   writer: RepairLog.writer,
    //   description: RepairLog.description,
    //   timestamp: new Date(),
    //   image : RepairLog.image
    // })

    console.log("Add Project's timeline")
   console.log(RepairLog.title, RepairLog.writer, RepairLog.description, RepairLog.image)
    this.afs.collection('User').doc(this.afAuth.auth.currentUser.uid).collection('On_Project').doc(RepairLog.ProjectName).collection('timeline').add({
      title : RepairLog.title, 
      writer : RepairLog.writer, 
      description: RepairLog.description,
      timestamp: new Date(),
      image : RepairLog.image

    })

    let toast = this.toast.create({
      message: "succesfully added",
      duration: 2000,
      position: "bottom"
    });
    toast.present();
  }


  //repair log 남기기
  Add_User_Log(RepairLog) {

    this.id_temp = this.afAuth.auth.currentUser.uid
    var timestamp_temp = new Date()

    //console.log('testing', this.id_temp, model_temp, serialNum_temp, timestamp)
    this.afs.collection('users').doc(this.id_temp).collection('Repair_Log').add({
      timestamp: timestamp_temp,
      title: RepairLog.title,
      writer: RepairLog.writer,
      description: RepairLog.description,
      model: RepairLog.model,
      serialNum: RepairLog.serialNum,
      id: RepairLog.id

    })



  }

  RepairAdd(RepairItem) {
    this.afs.collection('RepairItem').doc(`${RepairItem.id}`).set({
      id: RepairItem.id,
      model: RepairItem.model,
      repairman: RepairItem.repairman,
      serialNum: RepairItem.serialNum,
      startDate: new Date(),
      thumbnail: RepairItem.thumbnail,
      isToggled: false
    }).then(() => {

      let toast = this.toast.create({
        message: "succesfully added",
        duration: 2000,
        position: "bottom"
      });
      toast.present();

    })
  }

  ProjectAdd(RepairItem) {

    this.afs.collection('User').doc(this.afAuth.auth.currentUser.uid).collection('On_Project').doc(RepairItem.ProjectName).set({
    // this.afs.collection('Projects').doc(RepairItem.id).set({
      id: RepairItem.id,
      Date: RepairItem.Date, 
      DevelopEnvironment: RepairItem.DevEn, 
      Partner : RepairItem.Partner, 
      ProjectName : RepairItem.ProjectName, 
      thumbnail:RepairItem.thumbnail,
      isToggled: false
    }).then(() => {

      let toast = this.toast.create({
        message: "succesfully added",
        duration: 2000,
        position: "bottom"
      });
      toast.present();

    })
  }

  itemAdd(item) {

    const doc_id = this.afs.createId();

    this.afs.collection('item').doc(doc_id).set({
      model: item.model,
      quantity: item.quantity,
      location1: item.location1,
      location2: item.location2,
      id: doc_id
    })

    this.afs.collection("log").add({
      model: item.model,
      type: "add",
      quantity: item.quantity,
      location1: item.location1,
      location2: item.location2,
      timestamp: new Date()
    })

    let toast = this.toast.create({
      message: "succesfully added",
      duration: 2000,
      position: "bottom"
    });
    toast.present();
  }

  modifyItems(new_item) {
    this.afs.collection('item').doc(new_item.id).update({
      model: new_item.model,
      location1: new_item.location1,
      location2: new_item.location2,
      quantity: new_item.quantity
    })

  }

  getItems() {
    return this.afs.collection('item').valueChanges();
  }

  getLogs() {
    return this.afs.collection('repair_log').valueChanges();
  }

}
