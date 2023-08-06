import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CategoriasMainComponent} from './components/categorias-main/categorias-main.component';

const routes: Routes = [
  { path: '', component: CategoriasMainComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
