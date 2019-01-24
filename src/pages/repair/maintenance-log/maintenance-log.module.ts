import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaintenanceLogPage } from './maintenance-log';

@NgModule({
  declarations: [
    MaintenanceLogPage,
  ],
  imports: [
    IonicPageModule.forChild(MaintenanceLogPage),
  ],
})
export class MaintenanceLogPageModule {}
