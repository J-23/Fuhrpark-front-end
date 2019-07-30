import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { Car } from 'app/main/models/car.model';
import { SearchAttribute } from 'app/main/models/search-attribute.model';
import { promise } from 'protractor';

@Injectable()
export class CarsService implements Resolve<any> {

  cars: Car[] = [];
  searchAttributes: SearchAttribute[] = [];
  onCarsChanged: BehaviorSubject<any>;
  onSearchAttributesChanged: BehaviorSubject<SearchAttribute[]>;


  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onCarsChanged = new BehaviorSubject({});
    this.onSearchAttributesChanged = new BehaviorSubject([]);

    this.baseURL = this.appConfig['config']['URL'];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getCars([])])
        .then(() => {

          this.onSearchAttributesChanged.subscribe(searchAttributes => {
            this.searchAttributes = searchAttributes;
            this.getCars(this.searchAttributes);
          })
          resolve();
        }, reject);
        });
    }

    getCars(searchSettings: SearchAttribute[]): Promise<Car[]>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/car/list', searchSettings)
                .subscribe((response: any[]) => {
  
                    this.cars = response.map(res => new Car(res));
                    this.onCarsChanged.next(this.cars);
              
                    resolve(this.cars);
                }, reject);
        });
    }

    getCarRegistrationNumbers(): Promise<string[]> {
      
      return new Promise((resolve, reject) => {
        this._httpClient.get(this.baseURL + '/api/car/register-numbers')
          .subscribe((response: string[]) => {
            resolve(response);
          }, reject);
      });
    }
}
