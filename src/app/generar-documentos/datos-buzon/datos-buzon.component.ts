import { Component, OnInit, OnDestroy } from '@angular/core';
import { BuzonService } from '../../shared/buzon.service';
import { Buzon } from '../../../model/buzon.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-datos-buzon',
  templateUrl: './datos-buzon.component.html',
  styleUrls: ['./datos-buzon.component.css']
})
export class DatosBuzonComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  buzon: Buzon;

  constructor(private buzonService:BuzonService) { }
  
  ngOnInit() {
    this.buzon = new Buzon(0,"",null,true);
    this.subscription = this.buzonService.buzonActualChanged.subscribe(
      (buzon: Buzon) => {
        this.buzon = buzon;
        console.log(this.buzon);
      }
    )
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
