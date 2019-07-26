import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { Manufacturer } from 'app/main/models/manufacturer.model';

@Injectable()
export class ManufacturersService implements Resolve<any> {

  manufacturers: Manufacturer[];
  onManufacturersChanged: BehaviorSubject<any>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onManufacturersChanged = new BehaviorSubject({});
    this.baseURL = this.appConfig['config']['URL'];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getManufacturers()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getManufacturers(): Promise<Manufacturer[]> {

    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/manufacturer/list')
          .subscribe((response: any[]) => {

            this.manufacturers = response.map(res => new Manufacturer(res));
            this.onManufacturersChanged.next(this.manufacturers);
            
            resolve(this.manufacturers);
          }, reject);
        });
  }

  addManufacturer(manufacturer): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/manufacturer/add', manufacturer)
        .subscribe(response => {
          this.getManufacturers();
          resolve(response);
        }, reject);
    });
  }

  updateManufacturer(manufacturer): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/manufacturer/update', manufacturer)
        .subscribe(response => {
          this.getManufacturers();
          resolve(response);
        }, reject);
    });
  }

  deleteManufacturer(manufacturerId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + `/api/manufacturer/remove/${manufacturerId}`, null)
        .subscribe(response => {
          this.getManufacturers();
          resolve(response);
        }, reject);
    });
  }
}
