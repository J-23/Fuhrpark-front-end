import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { User } from 'app/main/models/user.model';
import { promise } from 'protractor';

@Injectable()
export class UsersService implements Resolve<any> {

  users: User[] = [];
  onUsersChanged: BehaviorSubject<User[]>;

  private baseURL: string;

  constructor(private _httpClient: HttpClient,
    private appConfig: AppConfig) { 
    this.onUsersChanged = new BehaviorSubject([]);

    this.baseURL = this.appConfig['config']['URL'];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getUsers()])
        .then(() => {
          resolve();
        },
        reject
        );
      });
  }

  getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/api/user/list')
          .subscribe((response: any[]) => {

            this.users = response.map(res => new User(res));
            this.onUsersChanged.next(this.users);
            
            resolve(this.users);
          }, reject);
        });
  }

  addUser(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user/add', user)
        .subscribe(response => {
          this.getUsers();
          resolve(response);
        }, reject);
    });
  }

  updateUser(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + '/api/user/update', user)
        .subscribe(response => {
          this.getUsers();
          resolve(response);
        }, reject);
    });
  }

  deleteUser(userId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(this.baseURL + `/api/user/remove/${userId}`, null)
        .subscribe(response => {
          this.getUsers();
          resolve(response);
        }, reject);
    });
  }
}
