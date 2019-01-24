import { Component } from "@angular/core";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { AngularFirestore } from "angularfire2/firestore";
import { IonicPage } from "ionic-angular/navigation/ionic-page";
import { ViewController } from "ionic-angular";

@IonicPage()
@Component({
    selector: 'page-gallery',
    templateUrl: 'gallery.html'
})
export class GalleryPage {

    item_id;
    images;

    constructor(public viewCtrl: ViewController, public navParams: NavParams, public afs: AngularFirestore,
        ) {
        this.item_id = this.navParams.get('id')
        this.afs.collection('item').doc(this.item_id).collection('images').valueChanges()
            .subscribe((imgs) => {
                this.images = imgs;
            })
    }

    deleteImage(img) {
        console.log(img.id);
        this.afs.collection('item').doc(this.item_id).collection('images').doc(img.id).delete()
            .then(() => {
                    this.viewCtrl.dismiss();
            });
    }
}