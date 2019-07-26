import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { CarSubgroupsService } from '../car-subgroups.service';
import { Car } from 'app/main/models/car.model';
import { CarsService } from '../../cars/cars.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-subgroup',
  templateUrl: './new-subgroup.component.html',
  styleUrls: ['./new-subgroup.component.scss']
})
export class NewSubgroupComponent implements OnInit {
  
  carGroupFrom: FormGroup;

  selectedCars: any[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  isEdit: boolean = false;
  cars: Car[] = [];

  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('carInput') carInput: ElementRef<HTMLInputElement>;
  
  constructor(private _formBuilder: FormBuilder,
    private carSubgroupsService: CarSubgroupsService,
    private carsService: CarsService,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) {
      this.carSubgroupsService.onCarSubgroupEditChanged.next(null);
  }

  ngOnInit() {
    this.carGroupFrom = this.createForm();
  
    this.carSubgroupsService.onCarSubgroupEditChanged
      .subscribe(carSubgroup => {
        if (carSubgroup) {
  
          this.isEdit = true;
  
          this.carGroupFrom.patchValue({
            name: carSubgroup.name,
            id: carSubgroup.id
          });
  
          this.selectedCars = carSubgroup.cars;
  
          this.carsService.getCars([])
            .then(cars => {
              this.selectedCars.forEach(selectedCar => {
                var carId = this.cars.findIndex(car => {
                  return car.id == selectedCar.id;
                });
              
                cars.splice(carId, 1);

                this.cars = cars;
              });
            })
            .catch();
        }
        else {
          this.getCars();
        }
      });
  }
  
  getCars() {
    this.carsService.onCarsChanged
      .subscribe(cars => {
        this.cars = cars;
      });
  }

  getSubgroups() {
    this.carSubgroupsService.getCarSubgroups().then().catch();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [null],
      name: [null]
    });
  }
  
  remove(car): void {
    const index = this.selectedCars.indexOf(car);
  
    if (index >= 0) {
      this.selectedCars.splice(index, 1);
      this.cars.push(car);
    }
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
      
    this.selectedCars.push(event.option.value);
  
    var carId = this.cars.findIndex(car => {
      return car.id == event.option.value.id;
    });
  
    this.cars.splice(carId, 1);
  }

  addCarSubgroup() {

      var carSubgroup = this.carGroupFrom.getRawValue();
      carSubgroup.carIds = this.selectedCars.map(car => car.id);

      this.carSubgroupsService.addSubgroup(carSubgroup)
        .then(() => {
          this.translateService.get('PAGES.APPS.CARSUBGROUPS.ADDSUCCESS')
            .subscribe(message => {
              this.createSnackBar(message);
            });

          this.selectedCars = [];
          this.getCars();
          this.getSubgroups();
          this.carGroupFrom = this.createForm();
        })
        .catch(res => {
          if (res && res.status && res.status == 403) {
            this.translateService.get('PAGES.APPS.CARSUBGROUPS.'+ res.error).subscribe(message => {
              this.createSnackBar(message);
            });
          }
        });
  }

  updateCarSubgroup() {
    
    var carSubgroup = this.carGroupFrom.getRawValue();
    carSubgroup.carIds = this.selectedCars.map(car => car.id);

    this.carSubgroupsService.updateSubgroup(carSubgroup)
      .then(() => {
        
        this.translateService.get('PAGES.APPS.CARSUBGROUPS.EDITSUCCESS')
          .subscribe(message => {
            this.createSnackBar(message);
          });

        this.selectedCars = [];
        this.getCars();
        this.getSubgroups();
        
        this.isEdit = false;
        this.carGroupFrom = this.createForm();
      })
      .catch(res => {
        if (res && res.status && res.status == 403) {
          this.translateService.get('PAGES.APPS.CARSUBGROUPS.'+ res.error).subscribe(message => {
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
