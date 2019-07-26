import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { CarSubgroup } from 'app/main/models/car-subgroup.model';

@Injectable({
  providedIn: 'root'
})
export class CarSubgroupsService implements Resolve<any> {
  
  carSubgroups: CarSubgroup[] = [];

  onCarSubgroupsChanged: BehaviorSubject<any>;
  onCarSubgroupEditChanged: BehaviorSubject<CarSubgroup>;

  private baseURL: string;
  
  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
      this.onCarSubgroupsChanged = new BehaviorSubject({});
      this.onCarSubgroupEditChanged = new BehaviorSubject(null);

      this.baseURL = this.appConfig['config']['URL'];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([this.getCarSubgroups()])
        .then(() => {
          resolve();
        }, reject );
      });
  }

  getCarSubgroups(): Promise<CarSubgroup[]>{
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/car-subgroup/list')
          .subscribe((response: any[]) => {

              this.carSubgroups = response.map(res => new CarSubgroup(res));
              this.onCarSubgroupsChanged.next(this.carSubgroups);
        
              resolve(this.carSubgroups);
          }, reject);
        });
  }

  addSubgroup(carSubgroup): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/car-subgroup/add', carSubgroup)
        .subscribe(response => {
          resolve(response);
        }, reject);
    });
  }

  updateSubgroup(carSubgroup): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/car-subgroup/update', carSubgroup)
        .subscribe(response => {
          resolve(response);
        }, reject);
    });
  }
}
