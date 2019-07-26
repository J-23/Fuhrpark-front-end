import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { GearOil } from 'app/main/models/gear-oil.model';

@Injectable()
export class GearOilsService implements Resolve<any> {

  gearOils: GearOil[];
  onGearOilsChanged: BehaviorSubject<any>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onGearOilsChanged = new BehaviorSubject({});
    this.baseURL = this.appConfig['config']['URL'];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getGearOils()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getGearOils(): Promise<GearOil[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/gear-oil/list')
          .subscribe((response: any[]) => {

            this.gearOils = response.map(res => new GearOil(res));
            this.onGearOilsChanged.next(this.gearOils);
            
            resolve(this.gearOils);
          }, reject);
        });
  }

  addGearOil(gearOil): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/gear-oil/add', gearOil)
        .subscribe(response => {
          this.getGearOils();
          resolve(response);
        }, reject);
    });
  }

  updateGearOil(gearOil): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/gear-oil/update', gearOil)
        .subscribe(response => {
          this.getGearOils();
          resolve(response);
        }, reject);
    });
  }

  deleteGearOil(gearOilId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + `/api/gear-oil/remove/${gearOilId}`, null)
        .subscribe(response => {
          this.getGearOils();
          resolve(response);
        }, reject);
    });
  }
}
