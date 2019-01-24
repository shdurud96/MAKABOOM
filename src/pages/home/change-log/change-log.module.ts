import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeLogPage } from './change-log';

@NgModule({
  declarations: [
    ChangeLogPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeLogPage),
  ],
})
export class ChangeLogPageModule {}
