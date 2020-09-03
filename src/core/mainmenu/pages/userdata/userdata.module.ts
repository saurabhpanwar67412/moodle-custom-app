import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserdataPage } from './userdata';

@NgModule({
  declarations: [
    UserdataPage,
  ],
  imports: [
    IonicPageModule.forChild(UserdataPage),
    TranslateModule.forChild()
  ],
})
export class CoreMainMenuPageModule {}
