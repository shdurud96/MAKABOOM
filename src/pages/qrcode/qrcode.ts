import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
/**
 * Generated class for the QrcodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {
  qrData =null;
  createdCode = null;
  scannedCode=null;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private barcodeScanner : BarcodeScanner,
    ) {

  }

  createCode(){
    this.createdCode=this.qrData;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad QrcodePage');
  }
  scanCode(){
    
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;

      this.navCtrl.push('LocationManagePage',{
        location_origin : this.scannedCode
      })

    }, (err)=>{
      console.log('Error : ', err)
    });
    
    //testing qr code
    // this.scannedCode=1
    // this.navCtrl.push('LocationManagePage',{
    //   location_origin : this.scannedCode
    // })

  }
  

}
