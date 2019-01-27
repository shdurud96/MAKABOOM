import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ToastController, AlertController, PopoverController, ModalController, ViewController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalVars } from '../providers/global';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import { AuthService } from '../providers/auth.service';
import { User } from '../form/user';
import {AngularFireAuth} from 'angularfire2/auth'


@Component({
  selector: 'ion-app',
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = 'MainPage';
  pages: Array<{ title: string, component: any }>;
  authUser: any;
  testCheckboxOpen: boolean;
  testCheckboxResult;
  requests: any;
  show: boolean;
  loggedIn;

  qrData = null;
  createdCode = null;
  scannedCode = null;

  private masterEmail: string = "admin@palmcloud.co.kr";
  public masterSwitch: boolean = false;



  constructor(public platform: Platform, public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthService, public toast: ToastController, public alertCtrl: AlertController,
    public afs: AngularFirestore, public popoverCtrl: PopoverController, public modalCtrl: ModalController,
    public global: GlobalVars, private barcodeScanner: BarcodeScanner, public afAuth: AngularFireAuth
  ) {
    this.auth.user.subscribe((user) => {
    
    if(user){
      console.log("loggedin true")
      this.loggedIn=true;
    }else{
      console.log("loggedin false")
      this.loggedIn=true;  //coding시 편의를 위해 true로 설정
    }
    })

  
    

    this.global.currentMessage.subscribe(message => this.show = message)
    

    // this.auth.user.subscribe((auth) => {
    //   console.log(auth.email)
    //   if (auth.email === this.masterEmail) {
    //     this.masterSwitch = true;
    //   }
    // })
    //   this.afs.collection('users').doc(auth.uid).valueChanges()
    //     .subscribe((user: any)=>{
    //       console.log(user)
    //       this.user_thumbnail = user.thumbnail;
    //     })
    // })



    this.initializeApp();
    this.pages = [
      { title : 'OnGoing Project', component: 'MaintenanceLogPage'},
      { title : 'Done Project', component: 'OnMaintenancePage'}, 
      { title : 'Inspiring Others', component:'AllPage'},
     // { title : 'Notice', component: 'WriteStockNoticePage'}, 
     // { title: '재고관리', component: 'HomePage' },
      //{ title: '정비관리', component: "RepairPage" },
      // { title: 'QR-Code', component: "QrcodePage" },
      { title: 'My profile', component: "ProfilePage" }
      // {title:'app1', component:"Category1Page"},
      // {title:'NFC', component:"NfcPage"},
      // {title:'Timeline',component:'TimelinePage'}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (this.loggedIn) {
      if(page.component === "ProfilePage"){
        this.nav.push(page.component)
      }
      else{
      this.nav.setRoot(page.component);
      }
    }
    else {
      this.showAlert();
    }
  }

  DologIn() {
    this.nav.push('LoginPage');
    // let modal = this.modalCtrl.create(LoginSelectPage);
    // modal.present();
  }

  logout() {
    this.auth.logout().then(() => {
      let toast = this.toast.create({
        message: "Please Log in again", //시간초과로 로그아웃 풀림 다시 로그인해 주세요 
         duration: 2000,
        position: "bottom"
      });
      toast.present();
      this.nav.setRoot('MainPage');
    });

  }


  openStock() {
    if (this.loggedIn) {
      this.nav.setRoot('HomePage');
    }
    else {
      this.showAlert();
    }
  }

  openRepair() {
    if (this.loggedIn) {
      this.nav.setRoot('RepairPage');
    }
    else {
      console.log(this.loggedIn, "loggedIn?")
      this.showAlert();
    }
  }
  openMain() {
    this.nav.setRoot('HomePage');
  }
  openAdmin() {
    if (this.loggedIn) {
      this.nav.push('AdminPage');
    }
    else {
      
      console.log(this.loggedIn, "loggedIn?")
      this.showAlert();
    }
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Access Denied',
      subTitle: 'You must log in to make it avilable!',
      buttons: ['OK']
    });
    alert.present();
  }
  
  qrPage() {

    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;

      this.nav.push('LocationManagePage', {
        location_origin: this.scannedCode
      })

    }, (err) => {
      console.log('Error : ', err)
    });

    //testing qr code
    // this.scannedCode=1
    // this.navCtrl.push('LocationManagePage',{
    //   location_origin : this.scannedCode
    // })

  }
  openProfile() {
    if (this.loggedIn) {
      this.nav.push('ProfilePage');
    }
    else {
      this.showAlert();
    }
  }

}


// @Component({
//   selector: 'page-login-select',
//   templateUrl: 'login-select.html'
// })
// export class LoginSelectPage{

//   public backgroundImage : any = "https://firebasestorage.googleapis.com/v0/b/prototype-d68e4.appspot.com/o/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%80.jpg?alt=media&token=9e7f9e83-b6e6-4ea3-abd5-dfb2b8d7e5a4";

//   constructor(public authData : AuthData, public navCtrl : NavController, public viewCtrl:ViewController){
//   }

//   dismiss(){   //자기 자신을 끄게 해야 한다. ViewController를 이용하여
//     this.viewCtrl.dismiss();
//   }


//   googleLogin() {
//     // this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
//     this.authData.googleLogin().then(()=>{
//       this.navCtrl.setRoot('MainPage');
//     });
//   }

//   loginWithEmail() {
//     this.navCtrl.push('LoginPage');
//   }


// }
