import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent, MatSnackBar } from '@angular/material';
import { CarGroupsService } from '../car-groups.service';
import { CarSubgroup } from 'app/main/models/car-subgroup.model';
import { CarSubgroupsService } from '../../car-subgroups/car-subgroups.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {

  carGroupFrom: FormGroup;

  selectedSubgroups: any[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  isEdit: boolean = false;
  subgroups: CarSubgroup[] = [];

  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('carInput') carInput: ElementRef<HTMLInputElement>;
  
  constructor(private _formBuilder: FormBuilder,
    private carGroupsService: CarGroupsService,
    private carSubgroupsService: CarSubgroupsService,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) { 
      this.carGroupsService.onCarGroupEditChanged.next(null);
    }

  ngOnInit() {
    this.carGroupFrom = this.createForm();

    this.carGroupsService.onCarGroupEditChanged
      .subscribe(carGroup => {
        if (carGroup) {
          this.isEdit = true;

          this.carGroupFrom.patchValue({
            id: carGroup.id,
            name: carGroup.name,
            subgroups: carGroup.carSubgroups
          });

          this.selectedSubgroups = carGroup.carSubgroups;

          this.carSubgroupsService.getCarSubgroups()
            .then(carSubgroups => {
              this.selectedSubgroups.forEach(selectedSubgroup => {
                var subGroupId = this.subgroups.findIndex(subgroup => {
                  return subgroup.id == selectedSubgroup.id;
                });
            
                carSubgroups.splice(subGroupId, 1);
                this.subgroups = carSubgroups;
              });
            })
            .catch();
        }
        else {
          this.getCarSubgroups();
        }
      });
  }

  getCarSubgroups() {
    this.carSubgroupsService.onCarSubgroupsChanged
      .subscribe(subgroups => {
        this.subgroups = subgroups
      });
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [null],
      name: [null],
    });
  }

  remove(subgroup): void {
    const index = this.selectedSubgroups.indexOf(subgroup);

    if (index >= 0) {
      this.selectedSubgroups.splice(index, 1);
      this.subgroups.push(subgroup);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    
    this.selectedSubgroups.push(event.option.value);

    var subGroupId = this.subgroups.findIndex(car => {
      return car.id == event.option.value.id;
    });

    this.subgroups.splice(subGroupId, 1);
  }

  getGroups() {
    this.carGroupsService.getCarGroups().then().catch();
  }

  addCarGroup() {

    var carGroup = this.carGroupFrom.getRawValue();
    carGroup.carSubgroupIds = this.selectedSubgroups.map(subgroup => subgroup.id);

    this.carGroupsService.addGroup(carGroup)
      .then(() => {
        this.translateService.get('PAGES.APPS.CARGROUPS.ADDSUCCESS')
          .subscribe(message => {
            this.createSnackBar(message);
          });

        this.selectedSubgroups = [];
        this.getCarSubgroups();
        this.getGroups();
        this.carGroupFrom = this.createForm();
      })
      .catch(res => {
        if (res && res.status && res.status == 403) {
          this.translateService.get('PAGES.APPS.CARGROUPS.'+ res.error).subscribe(message => {
            this.createSnackBar(message);
          });
        }
      });
}

updateCarGroup() {
  
  var carGroup = this.carGroupFrom.getRawValue();
  carGroup.carSubgroupIds = this.selectedSubgroups.map(car => car.id);

  this.carGroupsService.updateGroup(carGroup)
    .then(() => {
      
      this.translateService.get('PAGES.APPS.CARGROUPS.EDITSUCCESS')
        .subscribe(message => {
          this.createSnackBar(message);
        });

      this.selectedSubgroups = [];
      this.getCarSubgroups();
      this.getGroups();
      
      this.isEdit = false;
      this.carGroupFrom = this.createForm();
    })
    .catch(res => {
      if (res && res.status && res.status == 403) {
        this.translateService.get('PAGES.APPS.CARGROUPS.'+ res.error).subscribe(message => {
          this.createSnackBar(message);
        });
      }
    });
}

createSnackBar(message: string) {
  this._matSnackBar.open(message, 'OK', {
    verticalPosition: 'top',
    duration: 2000
  });
}
}
