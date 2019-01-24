import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NFC } from '@ionic-native/nfc';
import { AngularFireAuth } from 'angularfire2/auth';
import { GlobalVars } from '../../providers/global';
import { AuthService } from '../../providers/auth.service';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  public backgroundImage: any = "https://firebasestorage.googleapis.com/v0/b/makaboom-4e68b.appspot.com/o/background2.jpg?alt=media&token=f3e16213-65db-4b0c-8d5b-d6a20e0df740";

  payload: string;
  login: boolean;

  

  constructor(public afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, private nfc: NFC,
    public auth: AuthService, public global : GlobalVars) {

      this.afAuth.authState.subscribe((user)=>{
        if(user){
          this.login = true;
        }
        else{
          this.login = false;
        }
      })

    // this.nfc.addMimeTypeListener('palm/nfc', () => {
    //   console.log('nfc attached')
    // }, (err) => {
    //   console.log('error attaching ndef listener', err);
    // }).subscribe((event) => {

    //   this.payload = this.nfc.bytesToString(event.tag.ndefMessage[0].payload);

    //   this.afAuth.authState.subscribe((user)=>{
    //     if(user==null){
    //       alert("로그인이 필요합니다.");
    //     }
    //     else{
    //       // alert("로그인 되었습니다")
    //       this.navCtrl.push('LocationManagePage', {
    //         payload: this.payload
    //       })
    //     }
    //   })
    // });
  }
  ionViewWillEnter(){
    this.global.changeMessage(true);
  }

  openLoginPage() {
    this.navCtrl.push('LoginPage');
  }

  logout() {
    this.afAuth.auth.signOut()
  }
}

