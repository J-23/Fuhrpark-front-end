import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { Fuel } from 'app/main/models/fuel.model';

@Injectable()
export class FuelsService implements Resolve<any>{

  fuels: Fuel[];
  onFuelsChanged: BehaviorSubject<any>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onFuelsChanged = new BehaviorSubject({});
    this.baseURL = this.appConfig['config']['URL'];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getFuels()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getFuels(): Promise<Fuel[]> {
    return new Promise((resolve, reject) => {

      this._httpClient.get(this.baseURL + '/api/fuel/list')
        .subscribe((response: any[]) => {

          this.fuels = response.map(res => new Fuel(res));
          this.onFuelsChanged.next(this.fuels);
            
          resolve(this.fuels);
        }, reject);
      });
  }

  addFuel(fuel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/fuel/add', fuel)
        .subscribe(response => {
          this.getFuels();
          resolve(response);
        }, reject);
    });
  }

  updateFuel(fuel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/fuel/update', fuel)
        .subscribe(response => {
          this.getFuels();
          resolve(response);
        }, reject);
    });
  }

  deleteFuel(fuelId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + `/api/fuel/remove/${fuelId}`, null)
        .subscribe(response => {
          this.getFuels();
          resolve(response);
        }, reject);
    });
  }
}
