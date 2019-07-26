import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Car } from 'app/main/models/car.model';
import { MatSnackBar } from '@angular/material';
import { CarService } from './car.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class CarFormComponent implements OnInit, OnDestroy {

  car: Car;
  pageType: string;
  carGeneralForm: FormGroup;
  carSpecForm: FormGroup;
  carBusinessForm: FormGroup;

  private _unsubscribeAll: Subject<any>;

  constructor(private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private carService: CarService,
        private translateService: TranslateService,
        private router: Router) { 
    
    this._unsubscribeAll = new Subject();

    this.carGeneralForm = this._formBuilder.group({
      id: [null],
      registrationNumber: [null, Validators.required],
      model: [null],
      color: [null],
      chassisNumber: [null],
      decommissioned: [false],
      typ: [null, Validators.required],
      manufacturer: [null, Validators.required]
    });

    this.carSpecForm = this._formBuilder.group({
      performance: [null],
      engineDisplacement: [null],
      maxSpeed: [null],
      totalWeight: [null],
      engineCode: [null],
      engineOil: [null, Validators.required],
      fuel: [null, Validators.required],
      gearOil: [null, Validators.required],
      productionDate: [null],
      registrationDate: [null],
      catalyst: [true],
      hybridDrive: [true]
    });

    this.carBusinessForm = this._formBuilder.group({
      location: [null],
      user: [null],
      createDate: [{value: null, disabled: true}, [Validators.required]],
      updateDate: [{value: null, disabled: true}]
    });

  }

  ngOnInit() {
    
    this.carService.onCarChanged.subscribe(car=> {
      if (car != null) {
        this.car = car;
        this.pageType = 'edit';

        this.setCarGeneralForm();
        this.setCarSpecForm();
        this.setCarBusinessForm();
      }
      else {
        this.pageType = 'new';
      }
    })
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setCarGeneralForm() {
    this.carGeneralForm.patchValue({
      id: this.car.id,
      registrationNumber: this.car.registrationNumber,
      model: this.car.model,
      color: this.car.color,
      chassisNumber: this.car.chassisNumber,
      decommissioned: this.car.decommissioned,
      typ: this.car.typ,
      manufacturer: this.car.manufacturer
    });

    this.carService.setCarGeneralForm(this.carGeneralForm);
  }
  
  setCarSpecForm() {
    this.carSpecForm.patchValue({
      performance: this.car.carSpec.performance,
      engineDisplacement: this.car.carSpec.engineDisplacement,
      maxSpeed: this.car.carSpec.maxSpeed,
      totalWeight: this.car.carSpec.totalWeight,
      engineCode: this.car.carSpec.engineCode,
      engineOil: this.car.carSpec.engineOil,
      fuel: this.car.carSpec.fuel,
      gearOil: this.car.carSpec.gearOil,
      productionDate: this.car.carSpec.productionDate,
      registrationDate: this.car.carSpec.registrationDate,
      catalyst: this.car.carSpec.catalyst,
      hybridDrive: this.car.carSpec.hybridDrive
    });

    this.carService.setCarSpecForm(this.carSpecForm);
  }

  setCarBusinessForm() {
    this.carBusinessForm.patchValue({
      location: this.car.carBusiness.location,
      user: this.car.carBusiness.user,
      createDate: this.car.carBusiness.createDate,
      updateDate: this.car.carBusiness.updateDate
    });

    this.carService.setCarBusinessForm(this.carBusinessForm);
  }

  updateCar() {
    if (this.carGeneralForm.valid && this.carSpecForm.valid && this.carBusinessForm.valid) {
      const carGeneral = this.carGeneralForm.getRawValue();
      const carSpec = this.carSpecForm.getRawValue();
      const carBusiness = this.carBusinessForm.getRawValue();

      var car = {
        Id: carGeneral.id,
        RegistrationNumber: carGeneral.registrationNumber,
        Model: carGeneral.model,
        Color: carGeneral.color,
        ChassisNumber: carGeneral.chassisNumber,
        Decommissioned: carGeneral.decommissioned,
        TypId: carGeneral.typ.id,
        ManufacturerId: carGeneral.manufacturer.id,
        CarSpec: {
          Performance: carSpec.performance,
          EngineDisplacement: carSpec.engineDisplacement,
          MaxSpeed: carSpec.maxSpeed,
          TotalWeight: carSpec.totalWeight,
          EngineCode: carSpec.engineCode,
          ProductionDate: carSpec.productionDate,
          RegistrationDate: carSpec.registrationDate,
          Catalyst: carSpec.catalyst,
          HybridDrive: carSpec.hybridDrive,
          FuelId: carSpec.fuel.id,
          EngineOilId: carSpec.engineOil.id,
          GearOilId: carSpec.gearOil.id
        },
        CarBusiness: {
          Location: carBusiness.location,
          UserId: carBusiness.user ? carBusiness.user.id : null
        }
      };

      this.carService.updateCar(car)
        .then(() => {
          this.translateService.get('PAGES.APPS.CARS.EDITSUCCESS').subscribe(message => {
            this.createSnackBar(message);
          });

          this.router.navigate(['/apps/cars/list']);
        })
        .catch(res => {
          if (res && res.status && res.status == 403) {
            this.translateService.get('PAGES.APPS.CARS.'+ res.error).subscribe(message => {
              this.createSnackBar(message);
            });
          }
        });

    }
  }

  addCar() {

    if (this.carGeneralForm.valid && this.carSpecForm.valid && this.carBusinessForm.valid) {
      const carGeneral = this.carGeneralForm.getRawValue();
      const carSpec = this.carSpecForm.getRawValue();
      const carBusiness = this.carBusinessForm.getRawValue();

      var car = {
        RegistrationNumber: carGeneral.registrationNumber,
        Model: carGeneral.model,
        Color: carGeneral.color,
        ChassisNumber: carGeneral.chassisNumber,
        Decommissioned: carGeneral.decommissioned,
        TypId: carGeneral.typ.id,
        ManufacturerId: carGeneral.manufacturer.id,
        CarSpec: {
          Performance: carSpec.performance,
          EngineDisplacement: carSpec.engineDisplacement,
          MaxSpeed: carSpec.maxSpeed,
          TotalWeight: carSpec.totalWeight,
          EngineCode: carSpec.engineCode,
          ProductionDate: carSpec.productionDate,
          RegistrationDate: carSpec.registrationDate,
          Catalyst: carSpec.catalyst,
          HybridDrive: carSpec.hybridDrive,
          FuelId: carSpec.fuel.id,
          EngineOilId: carSpec.engineOil.id,
          GearOilId: carSpec.gearOil.id
        },
        CarBusiness: {
          Location: carBusiness.location,
          UserId: carBusiness.user ? carBusiness.user.id : null
        }
      };

      this.carService.addCar(car)
        .then(() => {
          this.translateService.get('PAGES.APPS.CARS.ADDSUCCESS').subscribe(message => {
            this.createSnackBar(message);
          });

          this.router.navigate(['/apps/cars/list']);
        })
        .catch();

    }
  }
  
  createSnackBar(message: string) {
    this._matSnackBar.open(message, 'OK', {
      verticalPosition: 'top',
      duration: 2000
    });
  }
}
