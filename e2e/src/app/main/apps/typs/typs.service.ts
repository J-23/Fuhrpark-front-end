import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Typ } from 'app/main/models/typ.model';
import { AppConfig } from 'app/app.config';

@Injectable()
export class TypsService implements Resolve<any> {

  typs: Typ[];
  onTypsChanged: BehaviorSubject<any>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onTypsChanged = new BehaviorSubject({});
    this.baseURL = this.appConfig['config']['URL'];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getTyps()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getTyps(): Promise<Typ[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/typ/list')
          .subscribe((response: any[]) => {

            this.typs = response.map(res => new Typ(res));
            this.onTypsChanged.next(this.typs);
            
            resolve(this.typs);
          }, reject);
        });
  }

  addTyp(typ): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/typ/add', typ)
        .subscribe(response => {
          this.getTyps();
          resolve(response);
        }, reject);
    });
  }

  updateTyp(typ): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/typ/update', typ)
        .subscribe(response => {
          this.getTyps();
          resolve(response);
        }, reject);
    });
  }

  deleteTyp(typId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + `/api/typ/remove/${typId}`, null)
        .subscribe(response => {
          this.getTyps();
          resolve(response);
        }, reject);
    });
  }
}
