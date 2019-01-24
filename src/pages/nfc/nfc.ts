import { Component} from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { NFC, Ndef} from '@ionic-native/nfc';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-nfc',
  templateUrl: 'nfc.html'
})
export class NfcPage {

  msg: any;
  msgLength: number;
  hexMsg: string;

  ndefListener: any = undefined;
  beginSession: any = undefined;

  modes: string = "read";


  id: string;
  techTypes: string[];
  type: string;
  maxSize: number;
  isWritable: string;
  tnf: number;
  msgType: string;
  msgId;
  uriIdentifierCode: string;
  payload: string;
  hexPayload: string;


  initialized: boolean = false;
  tagContentLoaded: boolean = false;

  constructor(public navCtrl: NavController, private nfc: NFC, private ndef: Ndef, private toast: ToastController, private platform: Platform) {


     this.platform.ready().then(() => {
       this.init();
     })
  }


  init() {
    console.log('starting init()');
    this.addListener();
    this.initialized = false;
    this.tagContentLoaded = false;
  }


  //Check if NFC is enabled
  checkEnabled() {
    return new Promise((resolve) => {
      this.nfc.enabled().then(success => {
        console.log('checkEnabled() success: ' + success);
        this.createToast("Check enable passed with: " + success, '');
        resolve(success);

      }, failure => {
        console.error('checkEnabled() failure: ' + failure);
        this.createToast('NFC is disabled', '');
        //reject(failure);

      }).catch(err => {
        console.error('checkEnabled() error: ' + err);
        this.createToast('There was a problem with the NFC-Plugin','');
        //reject(err);
      });
    });
  }


  addListener() {
    this.checkEnabled().then(success => {
      this.ndefListener = this.nfc.addNdefListener(() => {
        console.log('successfully attached ndef listener');
        this.initialized = true;


      }, (err) => {
        console.error('error adding ndef listener' + err);
      }).subscribe((event) => {
        console.log('received ndef message with tag.id: ' + event.tag);
        console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));
        console.log(event);


        this.msgLength = event.tag.ndefMessage.length
        this.msg = JSON.stringify(event);



        this.id = this.nfc.bytesToHexString(event.tag.id);
        this.techTypes = event.tag.techTypes;
        this.type = event.tag.type;
        this.maxSize = event.tag.maxSize;

        if(event.tag.isWriteable === true)
          this.isWritable = "true";
        else {
          this.isWritable = "false";
        }


        this.tnf = event.tag.ndefMessage[0].tnf
        this.msgType = this.nfc.bytesToHexString(event.tag.ndefMessage[0].type);
        this.msgId = event.tag.ndefMessage[0].id;

        this.uriIdentifierCode = this.nfc.bytesToHexString(event.tag.ndefMessage[0].payload).substring(0, 2);
        this.payload = this.nfc.bytesToString(event.tag.ndefMessage[0].payload);//.substring(1);

        this.hexPayload = this.nfc.bytesToHexString(event.tag.ndefMessage[0].payload);

        this.tagContentLoaded = true;
      });
    });


  }


  removeListener() {
    if (this.ndefListener !== undefined) {
      this.ndefListener.unsubscribe();
      this.ndefListener = undefined;
      console.log('removed listener');
    } else {
      console.log('listener was already removed or never initialized')
    }

    this.initialized = false;
  }



  shareMessage() {
    let message = this.ndef.textRecord('Hello world', '', []);
    this.nfc.share([message]).then(success => {
      console.log("succesfully shared message: " + success);
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }


  unshare() {
    this.nfc.unshare().then(success => {
      console.log('Sucessfully unshared Message: ' + success)
    }, failure => {
      console.error('unshare(): ' + failure);
    });
  }


  ionViewWillLeave() {
    this.removeListener();
    this.unshare();

  }


  createToast(message, position) {
    if (position==''){
      position = 'bottom';
    }

    let toast = this.toast.create({
      message: message,
      duration: 4000,
      position: position
    });
    toast.present();
  }
}
