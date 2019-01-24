import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockNoticeDetailPage } from './stock-notice-detail';

@NgModule({
  declarations: [
    StockNoticeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(StockNoticeDetailPage),
  ],
})
export class StockNoticeDetailPageModule {}
