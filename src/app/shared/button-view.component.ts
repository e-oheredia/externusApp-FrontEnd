import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'button-view',
  template: `
    <button (click)="onClick()" [ngClass]="class">{{ renderValue }}</button>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;
  class: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() event: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.event.emit(this.rowData);
  }
}
