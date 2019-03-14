import { Component, OnInit } from '@angular/core';
import { TituloService } from 'src/app/shared/titulo.service';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.css']
})
export class TituloComponent implements OnInit {

  private titulo: string;

  constructor(private tituloService: TituloService) { 
    this.titulo = "";
  }

  ngOnInit() {
    this.tituloService.tituloChanged.subscribe(
      titulo => this.titulo = titulo
    );
  }

}
