import { Component, OnInit } from '@angular/core';
import { CarGroupsService } from './car-groups.service';
import { CarGroup } from 'app/main/models/car-group.model';

@Component({
  selector: 'app-car-groups',
  templateUrl: './car-groups.component.html',
  styleUrls: ['./car-groups.component.scss']
})
export class CarGroupsComponent implements OnInit {

  carGroups: CarGroup[] = [];

  displayedColumns = ['name', 'cars'];

  constructor(private carGroupsService: CarGroupsService) { 

  }

  ngOnInit() {
    this.carGroupsService.onCarGroupsChanged
      .subscribe(carGroups => {
        this.carGroups = [];
        for (var i = 0; i < carGroups.length; i++) {
          this.carGroups.push(new CarGroup(carGroups[i]));
        }
      });
  }

  editCarGroup(carGroup: CarGroup){
    this.carGroupsService.onCarGroupEditChanged.next(carGroup);

    document.getElementById('blank').scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}
