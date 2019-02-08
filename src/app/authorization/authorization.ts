import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';

/**
 * Generated class for the AuthorizationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
interface List{
  email : string;
  request : string[];
}


@Component({
  selector: 'page-authorization',
  templateUrl: 'authorization.html',
})
export class AuthorizationPage {

  // lists : Array<any>;
  users : Array<any>;
  requests : Array<any>;

  constructor(public afs : AngularFirestore, public navCtrl: NavController, public navParams: NavParams) {
    // this.afs.collection('request').valueChanges()
    //   .subscribe((requests)=>{
        
    //     // this.requests = requests;
    //     requests.forEach(element => {
    //       let i=0;
    //       console.log(element.uid);
    //       // let ref = this.afs.collection('users').doc(element.uid)
    //       // console.log(ref);
    //       this.afs.collection('users').doc(element.uid).valueChanges()
    //         .subscribe((user:any)=>{
    //           console.log(user.email);
    //         })
    //     });

    //     console.log(this.lists);
      
      // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthorizationPage');
  }

}
