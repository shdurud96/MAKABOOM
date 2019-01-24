import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NfcPage } from './nfc'
import { IonicModule } from 'ionic-angular/module';


@NgModule({
  declarations: [
    NfcPage,
  ],
  imports: [
    IonicPageModule.forChild(NfcPage),
  ],
})
export class NfcPageModule {}
