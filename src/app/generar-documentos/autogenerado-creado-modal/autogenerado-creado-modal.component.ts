import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-autogenerado-creado-modal',
  templateUrl: './autogenerado-creado-modal.component.html',
  styleUrls: ['./autogenerado-creado-modal.component.css']
})
export class AutogeneradoCreadoModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) {}

  autogenerado: string;

  ngOnInit() {
  }

  aceptar(){
    this.bsModalRef.hide();
  }

}
