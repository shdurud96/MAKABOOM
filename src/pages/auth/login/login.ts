import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../providers/auth.service';
import { AngularFireAuth } from 'angularfire2/auth'
import { NavParams } from 'ionic-angular/navigation/nav-params';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: any;
  public backgroundImage = "https://firebasestorage.googleapis.com/v0/b/makaboom-4e68b.appspot.com/o/background2.jpg?alt=media&token=f3e16213-65db-4b0c-8d5b-d6a20e0df740"
  // public imgLogo: any = "./assets/medium_150.70391061453px_1202562_easyicon.net.png";

  constructor(public afAuth : AngularFireAuth, public navCtrl: NavController, public auth: AuthService, public fb: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  login() {

      // if (this.afAuth.auth.currentUser) {
      //   alert('Already Logged In')
      // }
      // else {

        if (!this.loginForm.valid) {
          //this.presentAlert('Username password can not be blank')
          console.log("error");
        } else {
          let loadingPopup = this.loadingCtrl.create({
            spinner: 'crescent',
            content: ''
          });
          loadingPopup.present();



          this.auth.loginUser(this.loginForm.value.email, this.loginForm.value.password)
            .then(authData => {
              console.log("Auth pass");
              loadingPopup.dismiss();
              //this.navCtrl.setRoot('HomePage');
              // this.navCtrl.push('Myapp' ,{
              //     login : true
              // })

              console.log(this.afAuth.auth.currentUser.uid)
              if(this.afAuth.auth.currentUser.uid){
                alert("Sucessfully Logged in")
                this.navCtrl.setRoot('HomePage')
                
              }else{
                alert("User not found in Database")
                  this.auth.logout().then(()=>{
                    this.navCtrl.setRoot('MainPage');
                  })
              }


              // this.auth.userCheck.subscribe((user)=>{
              //   if(user==null){
              //     alert("User not found in Database")
              //     this.auth.logout().then(()=>{
              //       this.navCtrl.setRoot('MainPage');
              //     })
              //   }
              // })

            }, error => {
              var errorMessage: string = error.message;
              loadingPopup.dismiss().then(() => {
                this.presentAlert(errorMessage)
              });
            });
        }
      //}
  }

  // forgot(){
  //   this.navCtrl.push('ForgotPage');
  // }
  serviceRequest() {
    let alert = this.alertCtrl.create({
      subTitle: 'Please contact MAKABOOM 000-000-0000',
      buttons: ['OK']
    });
    alert.present();
  }

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }

}
