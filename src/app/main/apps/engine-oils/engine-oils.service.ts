import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EngineOil } from 'app/main/models/engine-oil.model';
import { AppConfig } from 'app/app.config';

@Injectable()
export class EngineOilsService implements Resolve<any>{

  engineOils: any[];
  onEngineOilsChanged: BehaviorSubject<any>;

  private baseURL: string;
  
  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onEngineOilsChanged = new BehaviorSubject({});
    this.baseURL = this.appConfig['config']['URL'];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getEngineOils()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getEngineOils(): Promise<EngineOil[]> {
    return new Promise((resolve, reject) => {

      this._httpClient.get(this.baseURL + '/api/engine-oil/list')
        .subscribe((response: any[]) => {

          this.engineOils = response.map(res => new EngineOil(res));
          this.onEngineOilsChanged.next(this.engineOils);
            
          resolve(this.engineOils);
        }, reject);
      });
  }

  addEngineOil(engineOil): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/engine-oil/add', engineOil)
        .subscribe(response => {
          this.getEngineOils();
          resolve(response);
        }, reject);
    });
  }

  updateEngineOil(engineOil): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/engine-oil/update', engineOil)
        .subscribe(response => {
          this.getEngineOils();
          resolve(response);
        }, reject);
    });
  }

  deleteEngineOil(engineOilId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + `/api/engine-oil/remove/${engineOilId}`, null)
        .subscribe(response => {
          this.getEngineOils();
          resolve(response);
        }, reject);
    });
  }
}
