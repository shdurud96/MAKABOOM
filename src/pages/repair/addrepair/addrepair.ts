import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore'
import { FireService } from '../../../providers/FireService';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { CameraOptions, Camera } from '@ionic-native/camera';


class RepairItem{
  
  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  id : string;
  thumbnail: string;
}


@IonicPage()
@Component({
  selector: 'page-addrepair',
  templateUrl: 'addrepair.html',
})
export class AddrepairPage {

  RepairItem = new RepairItem()
  ProjectName
  DevEn
  Partner
  Date
  thumbnail;

  uploadPercent
  snapshot
  downloadURL

  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/makaboom-4e68b.appspot.com/o/ongoingback3.JPG?alt=media&token=144c8363-e39a-480c-a18e-e3cde442c5c8";


  constructor(public afs:AngularFirestore, public navCtrl: NavController, public navParams: NavParams,
  public fireService : FireService, public storage : AngularFireStorage, public camera : Camera) {

    this.thumbnail=""
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddrepairPage');
  }
  
  
  



  
  uploadFileDesktop(event) {
    const file = event.target.files[0];
    const filePath = `repair_item/${this.ProjectName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();
    this.snapshot = task.snapshotChanges()
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL())
    )
      .subscribe()

    task.downloadURL()
      .subscribe((url) => {
        this.thumbnail = url;
        })
  }

  isActive(snapshot){
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes 
  }

  async uploadFileMobile() {
    try {
      const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      const result = await this.camera.getPicture(options);

      const image = `data:image/jpeg;base64,${result}`;

      const task = this.storage.ref(`repair_item/${this.ProjectName}`).putString(image, 'data_url');
      this.uploadPercent = task.percentageChanges();

      task.downloadURL().subscribe((url)=>{
        this.thumbnail = url;
      })

    }
    catch (e){
      console.error(e);
    }
  }

  update(){

    if(this.DevEn && this.ProjectName){
    this.RepairItem.id = this.afs.createId();
    this.RepairItem.Date = this.Date;
    this.RepairItem.DevEn = this.DevEn;
    this.RepairItem.Partner = this.Partner;
    this.RepairItem.ProjectName = this.ProjectName;
    this.RepairItem.thumbnail = this.thumbnail;
    
    console.log(this.Date, this.RepairItem.id)
    this.fireService.ProjectAdd(this.RepairItem)
    this.navCtrl.pop()
    }
    else{
      if(this.DevEn){
      alert("Please enter Project Name")
      }else{
        alert("Please enter Develop Environment")
      }
    }

  }

}
