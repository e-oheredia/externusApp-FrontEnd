import { Component, OnInit, Input } from '@angular/core';
import { Menu } from '../../../../model/menu.model';

@Component({
  selector: '[app-tree-view]',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent {
  @Input() menus: Menu[];
}
