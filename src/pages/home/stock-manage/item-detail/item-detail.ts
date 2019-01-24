import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore'
import { AngularFireStorage } from 'angularfire2/storage';
import { GlobalVars } from '../../../../providers/global';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth'
import { Camera, CameraOptions } from '@ionic-native/camera'
import firebase from 'firebase';




@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})


export class ItemDetailPage {
  showToolbar: boolean = false;
  transition: boolean = false;

  model: string;
  location1: any;
  location2: any;
  quantity: number;
  id: string;

  id_temp: string;

  public pre_model: any;
  public pre_location1: any;
  public pre_location2: any;
  public pre_quantity: number;
  public pre_id: any;
  public changed_quantity: any;

  backgroundImage = "https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%85.png?alt=media&token=b4bb27d8-9ce6-44b5-b979-a5d24c2401b2";
  cardImage = "https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%802_%ED%88%AC%EB%AA%852.png?alt=media&token=78826653-cbd4-442d-9607-0b03983167b5"

  downloadURL
  uploadPercent
  percent
  imgGallery = [];

  constructor(private camera: Camera, public navCtrl: NavController, public navParams: NavParams,
    public ref: ChangeDetectorRef, public afs: AngularFirestore, public alertCtrl: AlertController,
    public toast: ToastController, public global: GlobalVars, public storage: AngularFireStorage,
    public modalCtrl: ModalController, public afAuth: AngularFireAuth) {

    this.global.changeMessage(false);

    this.model = this.navParams.get('model');
    this.location1 = this.navParams.get('location1');
    this.location2 = this.navParams.get('location2');
    this.quantity = this.navParams.get('quantity');
    this.id = this.navParams.get('id');

    this.pre_quantity = this.quantity
    this.pre_id = this.id
    this.pre_location1 = this.location1
    this.pre_location2 = this.location2
    this.pre_model = this.model


    console.log(this.id);
    this.afs.collection('item').doc(this.id).collection('images').valueChanges()
      .subscribe((images) => {
        this.imgGallery = images;
      })


  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemDetailPage');
  }

  onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 100;
    if (scrollTop < 0) {
      this.transition = false;
      //this.headerImgSize = `${ Math.abs(scrollTop)/2 + 100}%`;
    } else {
      this.transition = true;
      // this.headerImgSize = '100%'
    }
    this.ref.detectChanges();
  }

  modify() {

  }

  confirm() {
    this.afs.collection('item').doc(this.id).update({
      model: this.model,
      location1: this.location1,
      location2: this.location2,
      quantity: this.quantity,
      timestamp: new Date()
    })

    this.changed_quantity = this.quantity - this.pre_quantity

    console.log(this.changed_quantity)
    if ((this.pre_location1 != this.location1) || (this.pre_location2 != this.location2)) {
      const doc_id = this.afs.createId();
      this.afs.collection("log").add({
        model: this.model,
        type: "location_changed",
        quantity: this.quantity,
        location1: this.location1,
        location2: this.location2,
        timestamp: new Date(),
        changed_quantity: this.changed_quantity,

      })
      this.id_temp = this.afAuth.auth.currentUser.uid
      this.afs.collection('users').doc(this.id_temp).collection('Stock_Log').add({
        model: this.model,
        type: "location_changed",
        quantity: this.quantity,
        location1: this.location1,
        location2: this.location2,
        timestamp: new Date(),
        changed_quantity: this.changed_quantity,
      })
    }

    if (this.changed_quantity > 0) {
      this.afs.collection("log").add({
        model: this.model,
        type: "import",
        quantity: this.quantity,
        location1: this.location1,
        location2: this.location2,
        timestamp: new Date(),
        changed_quantity: this.changed_quantity,

      })
      this.id_temp = this.afAuth.auth.currentUser.uid
      this.afs.collection('users').doc(this.id_temp).collection('Stock_Log').add({
        model: this.model,
        type: "import",
        quantity: this.quantity,
        location1: this.location1,
        location2: this.location2,
        timestamp: new Date(),
        changed_quantity: this.changed_quantity,
      })
    }

    if (this.changed_quantity < 0) {
      this.afs.collection("log").add({
        model: this.model,
        type: "export",
        quantity: this.quantity,
        location1: this.location1,
        location2: this.location2,
        timestamp: new Date(),
        changed_quantity: this.changed_quantity,

      })
      this.id_temp = this.afAuth.auth.currentUser.uid
      this.afs.collection('users').doc(this.id_temp).collection('Stock_Log').add({
        model: this.model,
        type: "export",
        quantity: this.quantity,
        location1: this.location1,
        location2: this.location2,
        timestamp: new Date(),
        changed_quantity: this.changed_quantity,
      })
    }
    this.navCtrl.push('StockManagePage', {
      model: this.model,
      location1: this.location1,
      location2: this.location2,
      quantity: this.quantity,
      id: this.id,
      status: true
    })
  }


  delete() {

    let confirm = this.alertCtrl.create({
      title: '정말로 아이템을 삭제하시겠습니까?',
      message: '아이템을 삭제하시려면 Yes를 클릭하세요',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.afs.collection('item').doc(this.id).delete().then(() => {

              let toast = this.toast.create({
                message: "성공적으로 삭제하였습니다.",
                duration: 2000,
                position: "bottom"
              });
              toast.present();
              this.navCtrl.pop();
            }).catch(function (error) {
              console.error("삭제에 실패하였습니다. ", error);
            });
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

  uploadFileDesktop(event) {
    const file = event.target.files[0];
    const filePath = `item_images/${this.model}/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges()
      .subscribe((percent)=>{
        this.percent = percent 
        if(percent >= 100){
          let toast = this.toast.create({
            message: "Succesfully uploaded!",
            duration: 1000,
            position: "bottom"
          });
          toast.present();
        }
      });
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL())
    )
      .subscribe()

    task.downloadURL()
      .subscribe((url) => {

        const doc_id = this.afs.createId();
        this.afs.collection('item').doc(this.id).collection('images').doc(doc_id).set({
          image_url: url,
          id: doc_id
        })
      })
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

      const task = this.storage.ref(`item_images/${this.model}`).putString(image, 'data_url');
      this.uploadPercent = task.percentageChanges();

      task.downloadURL().subscribe((url)=>{
        const doc_id = this.afs.createId();
          this.afs.collection('item').doc(this.id).collection('images').doc(doc_id).set({
            image_url: url,
            id: doc_id
          })
      })
    }
    catch (e) {
      console.error(e);
    }
  }

  openFullImage() {
    let modal = this.modalCtrl.create('GalleryPage', {
      id: this.id
    });
    modal.present();
  }

}
