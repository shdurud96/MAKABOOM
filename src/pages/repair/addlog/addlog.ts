import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore'
import { FireService } from '../../../providers/FireService';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from 'angularfire2/storage';
import { CameraOptions, Camera } from '@ionic-native/camera';


class RepairLog{ 
  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  id : string;
  thumbnail: string;
  title : string;
  writer : string;
  description : string;
  image
}

@IonicPage()
@Component({
  selector: 'page-addlog',
  templateUrl: 'addlog.html',
})
export class AddlogPage {

  RepairLog = new RepairLog();
  title : string
  writer : string
  description : string
  id : string
  model : string
  serialNum : string
  backgroundImage ="https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";

  uploadPercent
  snapshot
  downloadURL
  image =""

  ProjectName : string;
  DevEn: string;
  Partner: string;
  Date: Date;
  thumbnail: string;
  
 

  constructor(public afs:AngularFirestore, public navCtrl: NavController, public navParams: NavParams,
  public fireService : FireService, private viewCtrl: ViewController, public storage : AngularFireStorage, public camera : Camera) {

    this.id = this.navParams.get('id');
    this.ProjectName =this.navParams.get('ProjectName')
    this.Date= this.navParams.get('Date')
    console.log(this.id);
    console.log(this.ProjectName);
    console.log(this.Date)
    
    
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddrepairPage');
  }

  cancel(){
    this.viewCtrl.dismiss()
  }

  uploadFileDesktop(event) {
    const file = event.target.files[0];
    const filePath = `repair_log/${this.serialNum}`;
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
        this.image = url;
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

      const task = this.storage.ref(`repair_log/${this.serialNum}`).putString(image, 'data_url');
      this.uploadPercent = task.percentageChanges();

      task.downloadURL().subscribe((url)=>{
        this.image = url;
      })

    }
    catch (e){
      console.error(e);
    }
  }

  save(){
  
    //id ProjectName Date
    this.RepairLog.id=this.id;
    this.RepairLog.ProjectName=this.ProjectName;
    this.RepairLog.Date=this.Date;
    this.RepairLog.title=this.title;
    this.RepairLog.writer=this.writer;
    this.RepairLog.description=this.description
    this.RepairLog.image=this.image
    

    // this.RepairLog.title = this.title;
    // this.RepairLog.writer = this.writer;
    // this.RepairLog.description = this.description;
    // this.RepairLog.id = this.id;
    // this.RepairLog.model=this.model;
    // this.RepairLog.serialNum=this.serialNum;
    // this.RepairLog.image = this.image;
    
    this.fireService.LogAdd(this.RepairLog)
    this.navCtrl.pop()
  //  this.fireService.Add_User_Log(this.RepairLog);
  
    
  }


}
