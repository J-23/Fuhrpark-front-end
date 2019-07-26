import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CarFieldSearch } from 'app/main/enums/car-field-search.enum';
import { ComparingType } from 'app/main/enums/comparing-type.enum';
import { ManufacturersService } from '../../manufacturers/manufacturers.service';
import { Manufacturer } from 'app/main/models/manufacturer.model';
import { TypsService } from '../../typs/typs.service';
import { Typ } from 'app/main/models/typ.model';
import { FuelsService } from '../../fuels/fuels.service';
import { EngineOilsService } from '../../engine-oils/engine-oils.service';
import { GearOilsService } from '../../gear-oils/gear-oils.service';
import { UsersService } from '../../users/users.service';
import { Fuel } from 'app/main/models/fuel.model';
import { EngineOil } from 'app/main/models/engine-oil.model';
import { GearOil } from 'app/main/models/gear-oil.model';
import { User } from 'app/main/models/user.model';
import { SearchAttribute } from 'app/main/models/search-attribute.model';
import { CarsService } from '../cars.service';
import { MatDatepickerInputEvent, MatSelectChange } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-car-sidebar',
  templateUrl: './car-sidebar.component.html',
  styleUrls: ['./car-sidebar.component.scss']
})
export class CarSidebarComponent implements OnInit {

  searchForm: FormGroup;
  
  manufacturers: Manufacturer[] = [];
  typs: Typ[] = [];
  fuels: Fuel[] = [];
  engineOils: EngineOil[] = [];
  gearOils: GearOil[] = [];
  users: User[] = [];

  searchParameters: SearchAttribute[] = [];

  constructor(private _formBuilder: FormBuilder,
    private manufacturersService: ManufacturersService,
    private typsService: TypsService,
    private fuelsService: FuelsService,
    private engineOilsService: EngineOilsService,
    private gearOilsService: GearOilsService,
    private usersService: UsersService,
    private carsService: CarsService) {
      this.carsService.onSearchAttributesChanged.next([]);
    }

  ngOnInit() {
    this.manufacturersService.getManufacturers()
      .then(manufacturers => {
        this.manufacturers = manufacturers;
      })
      .catch();
    
    this.typsService.getTyps()
      .then(typs => {
        this.typs = typs;
      })
      .catch();
    
    this.fuelsService.getFuels()
      .then(fuels => {
        this.fuels = fuels;
      })
      .catch();  

    this.engineOilsService.getEngineOils()
      .then(engineOils => {
        this.engineOils = engineOils;
      })
      .catch();
      
    this.gearOilsService.getGearOils()
      .then(gearOils => {
        this.gearOils = gearOils;
      })
      .catch();

    this.usersService.getUsers()
      .then(users => {
        this.users = users;
      })
      .catch();

    this.searchForm = this.cretaeForm();
  }

  cretaeForm(): FormGroup {

    return this._formBuilder.group({
      registrationNumber: [null],
      model: [null],
      color: [null],
      chassisNumber: [null],
      decommissioned: [null],
      typId: [null],
      manufacturerId: [null],
      minPerformance: [null],
      maxPerformance: [null],
      minEngineDisplacement: [null],
      maxEngineDisplacement: [null],
      minSpeed: [null],
      maxSpeed: [null],
      minWeight: [null],
      maxWeight: [null],
      engineCode: [null],
      minProductionDate: [null],
      maxProductionDate: [null],
      minRegistrationDate: [null],
      maxRegistrationDate: [null],
      catalyst: [null],
      hybridDrive: [null],
      fuelId: [null],
      engineOilId: [null],
      gearOilId: [null],
      location: [null],
      minCreateDate: [null],
      maxCreateDate: [null],
      minUpdateDate: [null],
      maxUpdateDate: [null],
      userId: [null]
    });
  }

  timer: any;

  AddSearchAttribute(controlName: string, fieldName: CarFieldSearch, comparingType: ComparingType) {
    
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { 

      this.searchParameters = this.searchParameters.filter(param => {
        return !(param.carField == fieldName && param.comparingType == comparingType);
      });

      if (this.searchForm.controls[controlName].value && this.searchForm.controls[controlName].value !== "null") {
        this.searchParameters.push({
          data: this.searchForm.controls[controlName].value,
          carField: fieldName,
          comparingType: comparingType
        });
      }

      this.carsService.onSearchAttributesChanged.next(this.searchParameters);
    }, 200);
  }

  AddSearchAttributeByDate(fieldName: CarFieldSearch, comparingType: ComparingType, event: MatDatepickerInputEvent<Date>) {
    
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { 

      this.searchParameters = this.searchParameters.filter(param => {
        return !(param.carField == fieldName && param.comparingType == comparingType);
      });

      if (event && event.value) {

        var data;

        if (comparingType == ComparingType.Min) {
          data = moment(event.value).format('YYYY-MM-DD 00:00:00').toString();
        }
        else if (comparingType == ComparingType.Max) {
          data = moment(event.value).format('YYYY-MM-DD 23:59:59').toString();
        }

        this.searchParameters.push({
          data: data,
          carField: fieldName,
          comparingType: comparingType
        });
      }

      this.carsService.onSearchAttributesChanged.next(this.searchParameters);
    }, 200);
  }

  AddSearchAttributeInSelect(fieldName: CarFieldSearch, comparingType: ComparingType, event: MatSelectChange) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { 

      this.searchParameters = this.searchParameters.filter(param => {
        return !(param.carField == fieldName && param.comparingType == comparingType);
      });

      if (event && event.value) {
        this.searchParameters.push({
          data: event.value.id,
          carField: fieldName,
          comparingType: comparingType
        });
      }

      this.carsService.onSearchAttributesChanged.next(this.searchParameters);
    }, 200);
  }
}
