import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { FormGroup } from '@angular/forms';
import { Car } from 'app/main/models/car.model';

@Injectable()
export class CarService implements Resolve<any> {

  lastChanges: BehaviorSubject<string> = new BehaviorSubject(null);

  carGeneralForm: BehaviorSubject<FormGroup> = new BehaviorSubject(null);

  carSpecForm: BehaviorSubject<FormGroup> = new BehaviorSubject(null);

  carBusinessForm: BehaviorSubject<FormGroup> = new BehaviorSubject(null);

  routeParams: any;
  private car: Car;
  
  onCarChanged: BehaviorSubject<Car> = new BehaviorSubject(null);

  baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) {

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

    removeCar(carRemoveSettings): Promise<any> {
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.baseURL + '/api/car/delete', carRemoveSettings)
          .subscribe(response => {
            resolve(response);
          }, reject);
      });
    }
}
