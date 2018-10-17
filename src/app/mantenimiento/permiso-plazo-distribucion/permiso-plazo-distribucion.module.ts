import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermisoPlazoDistribucionComponent } from './permiso-plazo-distribucion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,       
    NgSelectModule
  ],
  declarations: [PermisoPlazoDistribucionComponent]
})
export class PermisoPlazoDistribucionModule { }
