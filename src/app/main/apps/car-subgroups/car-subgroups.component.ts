import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { CarSubgroup } from 'app/main/models/car-subgroup.model';
import { CarSubgroupsService } from './car-subgroups.service';

@Component({
  selector: 'app-car-subgroups',
  templateUrl: './car-subgroups.component.html',
  styleUrls: ['./car-subgroups.component.scss']
})
export class CarSubgroupsComponent implements OnInit {

  carSubgroups: CarSubgroup[] = [];

  displayedColumns = ['registerNumber', 'model', 'typ', 'manufacturer', 'user'];
  
  constructor(private carSubgroupsService: CarSubgroupsService) { }

  ngOnInit() {
    this.carSubgroupsService.onCarSubgroupsChanged
      .subscribe(carSubgroups => {
        this.carSubgroups = [];
        for (var i = 0; i < carSubgroups.length; i++) {
          this.carSubgroups.push(new CarSubgroup(carSubgroups[i]));
        }
      });
  }

  edit(carSubgroup: CarSubgroup) {
    this.carSubgroupsService.onCarSubgroupEditChanged.next(carSubgroup);
    
    document.getElementById('blank').scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}
