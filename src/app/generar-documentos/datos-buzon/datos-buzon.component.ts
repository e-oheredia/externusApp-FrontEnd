import { Component, OnInit, OnDestroy } from '@angular/core';
import { BuzonService } from '../../shared/buzon.service';
import { Buzon } from '../../../model/buzon.model';
import { Subscription } from 'rxjs';
import { Area } from '../../../model/area.model';
import { Sede } from '../../../model/sede.model';
import { TipoSede } from '../../../model/tiposede.model';
import { Distrito } from '../../../model/distrito.model';
import { Provincia } from '../../../model/provincia.model';
import { Departamento } from '../../../model/departamento.model';
import { Pais } from '../../../model/pais.model';

@Component({
  selector: 'app-datos-buzon',
  templateUrl: './datos-buzon.component.html',
  styleUrls: ['./datos-buzon.component.css']
})

export class DatosBuzonComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  buzon: Buzon = new Buzon(0,"",new Area(0, "", "", new Sede(0,"","", new TipoSede(0,""), new Distrito()), null),true,null);

  constructor(private buzonService:BuzonService) { }
  
  ngOnInit() {
    this.buzon = this.buzonService.getBuzonActual() || this.buzon;
    this.subscription = this.buzonService.buzonActualChanged.subscribe(
      (buzon: Buzon) => {
        this.buzon = buzon;
      }
    )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
