import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepairNoticePage } from './repair-notice';

@NgModule({
  declarations: [
    RepairNoticePage,
  ],
  imports: [
    IonicPageModule.forChild(RepairNoticePage),
  ],
})
export class RepairNoticePageModule {}
