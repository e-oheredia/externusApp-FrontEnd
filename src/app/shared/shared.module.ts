import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';
import { ButtonViewComponent } from '../table-management/button-view/button-view.component';

@NgModule({
  imports: [
    CommonModule
  ],

  declarations: [
    jqxChartComponent
  ],
  exports: [
    jqxChartComponent
  ]

})
export class SharedModule { }
