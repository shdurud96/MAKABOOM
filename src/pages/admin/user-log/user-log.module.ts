import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserLogPage } from './user-log';

@NgModule({
  declarations: [
    UserLogPage,
  ],
  imports: [
    IonicPageModule.forChild(UserLogPage),
  ],
})
export class UserLogPageModule {}
