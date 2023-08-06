import { NgModule } from '@angular/core';
import { InicioMainComponent } from './components/inicio-main/inicio-main.component';
import { InicioRoutingModule } from './inicio-routing.module';
import {DialogModule} from 'primeng-lts/dialog';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    InicioMainComponent
  ],
  providers: [

  ],
  imports: [
    InicioRoutingModule,
    SharedModule,
    DialogModule
  ]
})
export class InicioModule { }
