import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonViewComponent } from './button-view/button-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ButtonViewComponent],
  exports: [ButtonViewComponent]
})
export class TableManagementModule { }
