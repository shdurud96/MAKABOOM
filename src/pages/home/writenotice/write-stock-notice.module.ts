import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WriteStockNoticePage } from './write-stock-notice';

@NgModule({
  declarations: [
    WriteStockNoticePage,
  ],
  imports: [
    IonicPageModule.forChild(WriteStockNoticePage),
  ],
})
export class WriteStockNoticePageModule {}
