import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationManagePage } from './location-manage';

@NgModule({
  declarations: [
    LocationManagePage,
  ],
  imports: [
    IonicPageModule.forChild(LocationManagePage),
  ],
})
export class LocationManagePageModule {}
