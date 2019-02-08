import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';

import { AngularFireStorageModule } from 'angularfire2/storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { NFC, Ndef} from '@ionic-native/nfc';
import { FireService } from '../providers/FireService';
import { AuthorizationPage } from './authorization/authorization';
// import { LoginSelectPage } from './app.component'
import { GlobalVars } from '../providers/global';
import { FillPage } from '../pages/home/change-log/change-log';
import { IonicPageModule } from 'ionic-angular/module';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AuthService } from '../providers/auth.service';
import { Camera } from '@ionic-native/camera'

 




export const config = { 
  apiKey: "AIzaSyBVkzsmscZgOLezOi_4ZUN8UU9QKI6tGrM",
  authDomain: "makaboom-4e68b.firebaseapp.com",
  databaseURL: "https://makaboom-4e68b.firebaseio.com",
  projectId: "makaboom-4e68b",
  storageBucket: "makaboom-4e68b.appspot.com",
  messagingSenderId: "187696780306"
};



@NgModule({
  declarations: [
    MyApp,
    AuthorizationPage,
    // LoginSelectPage,
    FillPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    IonicPageModule, 
 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthorizationPage,
    // LoginSelectPage,
    FillPage
  ],  
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    NFC,
    Ndef,
    FireService,
    GlobalVars, 
    BarcodeScanner, 
    AuthService,
    Camera,
  ]
})
export class AppModule {} 
