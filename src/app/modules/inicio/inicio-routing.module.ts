import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioMainComponent } from './components/inicio-main/inicio-main.component';

const routes: Routes = [
  { path: '', component: InicioMainComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
