import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';

@NgModule({
  imports: [
    CommonModule
  ],

  declarations: [
    jqxChartComponent
  ],
  exports: [jqxChartComponent]

})
export class SharedModule { }
