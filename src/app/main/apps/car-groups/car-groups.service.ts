import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { CarGroup } from 'app/main/models/car-group.model';

@Injectable({
  providedIn: 'root'
})
export class CarGroupsService implements Resolve<any> {
  
  carGroups = [];

  onCarGroupsChanged: BehaviorSubject<any>;
  onCarGroupEditChanged: BehaviorSubject<CarGroup>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
      this.onCarGroupsChanged = new BehaviorSubject({});
      this.onCarGroupEditChanged = new BehaviorSubject(null);

      this.baseURL = this.appConfig['config']['URL'];
    }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([this.getCarGroups()])
        .then(() => {
          resolve();
        }, reject );
      });
  }

  getCarGroups(): Promise<CarGroup[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/car-group/list')
          .subscribe((response: any[]) => {

              this.carGroups = response.map(res => new CarGroup(res));
              this.onCarGroupsChanged.next(this.carGroups);
        
              resolve(this.carGroups);
          }, reject);
        });
  }

  addGroup(carGroup): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/car-group/add', carGroup)
        .subscribe(response => {
          resolve(response);
        }, reject);
    });
  }

  updateGroup(carGroup): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/car-group/update', carGroup)
        .subscribe(response => {
          resolve(response);
        }, reject);
    });
  }
}
