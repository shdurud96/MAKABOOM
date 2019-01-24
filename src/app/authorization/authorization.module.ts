import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthorizationPage } from './authorization';

@NgModule({
  declarations: [
    AuthorizationPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthorizationPage),
  ],
})
export class AuthorizationPageModule {}
