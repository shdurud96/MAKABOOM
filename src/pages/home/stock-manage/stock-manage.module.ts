import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockManagePage } from './stock-manage';

@NgModule({
  declarations: [
    StockManagePage,
  ],
  imports: [
    IonicPageModule.forChild(StockManagePage),
  ],
})
export class StockManagePageModule {}
