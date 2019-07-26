import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Car } from 'app/main/models/car.model';
import { Typ } from 'app/main/models/typ.model';

@Injectable()
export class CarService implements Resolve<any> {

  carGeneralForm: BehaviorSubject<FormGroup> = new BehaviorSubject(null);

  carSpecForm: BehaviorSubject<FormGroup> = new BehaviorSubject(null);

  carBusinessForm: BehaviorSubject<FormGroup> = new BehaviorSubject(null);

  routeParams: any;
  private car: Car = {
    id: 1,
    registrationNumber: 'Registration Number',
    model: 'Car Model',
    typ: {
      id: 1,
      name: 'Car Typ',
      createDate: new Date()
    },
    manufacturer: {
      id: 1,
      name: 'Car Manufacturer',
      createDate: new Date()
    },
    color: 'red',
    chassisNumber: 'chassis number',
    decommissioned: false,
    carSpec: {
      fuel: {
        id: 1,
        name: 'Car Fuel',
        createDate: new Date()
      },
      engineCode: 'engine code',
      gearOil: {
        id: 1,
        name: 'Car Gear Oil',
        createDate: new Date()
      },
      engineOil: {
        id: 1,
        name: 'Car Engine Oil',
        createDate: new Date()
      },
      catalyst: true,
      hybridDrive: true
    },
    carBusiness: {
      location: 'location',
      createDate: new Date()
    }
  };
  
  onCarChanged: BehaviorSubject<Car> = new BehaviorSubject(null);

  baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig,
    private _formBuilder: FormBuilder) {

    this.baseURL = this.appConfig['config']['URL'];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;

    return new Promise((resolve, reject) => {
      Promise.all([
        this.getCar()
        ]).then(() => {
          resolve();
        }, reject);
      });
    }

    getCar(): Promise<any> {

      return new Promise((resolve, reject) => {
        if (this.routeParams.id === 'new') {
          this.onCarChanged.next(null);
          resolve(false);
        }
        else {
          this._httpClient.get(this.baseURL + `/api/car/detail/${this.routeParams.id}`)
            .subscribe(response => {
  
              this.car = new Car(response);
              this.onCarChanged.next(this.car);
              resolve(this.car);
            }, reject);
        }
      });
    }

    addCar(car): Promise<any> {
      return new Promise((resolve, reject) => {
        
        this._httpClient.post(this.baseURL + '/api/car/add', car)
            .subscribe(response => {
              
              resolve(response);
            }, reject);
        });
    }

    updateCar(car): Promise<any> {
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.baseURL + '/api/car/update', car)
          .subscribe(response => {
            resolve(response);
          }, reject);
      })
    }

    setCarGeneralForm(carGeneralForm: FormGroup) {
      this.carGeneralForm.next(carGeneralForm);
    }

    setCarSpecForm(carSpecForm: FormGroup) {
      this.carSpecForm.next(carSpecForm);
    }

    setCarBusinessForm(carBusinessForm: FormGroup) {
      this.carBusinessForm.next(carBusinessForm);
    }

    removeCar(carRemoveSettings): Promise<any> {
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.baseURL + '/api/car/delete', carRemoveSettings)
          .subscribe(response => {
            resolve(response);
          }, reject);
      });
    }
}
