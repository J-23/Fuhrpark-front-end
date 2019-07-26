import { Injectable } from '@angular/core';
import { shareReplay, filter, tap, map, last } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppUser } from '../models/app-user.model';
import { AppConfig } from 'app/app.config';

export const ANONYMOUS_USER: AppUser = {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    phoneNumber: undefined
  }

@Injectable()
export class AuthenticationService {

    private userSubject = new BehaviorSubject<AppUser>(undefined);
    user$: Observable<AppUser> = this.userSubject.asObservable().pipe(filter(user => !!user));
    isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user.firstName));

    userEmail = new BehaviorSubject<string>(undefined);

    private baseURL: string;

    constructor(private _httpClient: HttpClient,
        private appConfig: AppConfig) { 
            
        this.baseURL = this.appConfig['config']['URL'];

        this.getUser();
    }

    login(email: string, password: string) : Promise<any> {
        
        var body = {
            Email: email,
            Password: password
        };

        return new Promise((resolve, reject) => {
            return this._httpClient.post(this.baseURL + '/api/account/login', body)
                .subscribe((response: any) => { 
                    
                    localStorage.setItem('access_token', response.access_token);
                    localStorage.setItem('refresh_token', response.refresh_token);
                    localStorage.setItem('expires_date', response.expires_date);

                    this.getUser().then(user => {
                        resolve(user);
                    })
                    .catch(() => reject);

                }, reject);
        });
    }

    register(firstName: string, lastName: string, email: string, phoneNumber: string,
        password: string, passwordConfirm: string): Promise<any> {
        
        var body = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Mobile: phoneNumber,
            Password: password,
            PasswordConfirm: passwordConfirm
        };

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + '/api/account/register', body)
                .subscribe((response: any) => {
                    localStorage.setItem('access_token', response.access_token);
                    localStorage.setItem('refresh_token', response.refresh_token);
                    localStorage.setItem('expires_date', response.expires_date);

                    this.getUser().then(user => {
                        resolve(user);
                    })
                    .catch(() => reject);
                }, reject);
        });
    }

    forgotPassword(email: string): Promise<any> {
        var body = {
            Email: email
        };

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + "/api/account/forgot-password", body)
                .subscribe((response: any)=> {
                    resolve();
                }, reject);
        })
    }

    resetPassword(email: string, password: string, passwordConfirm: string, code: string): Promise<any> {
        var body = {
            Email: email,
            Password: password,
            PasswordConfirm: passwordConfirm,
            Code: code
        };

        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseURL + "/api/account/reset-password", body)
                .subscribe(() => {
                    
                    this.userEmail.next(undefined);
                    resolve()
                }, reject);
        })
    }

    getUser(): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(this.baseURL + '/api/account/user-info')
                .subscribe(response => {
                    if (response) {
                        var user: AppUser = {
                            firstName: response['firstName'],
                            lastName: response['lastName'],
                            email: response['email'],
                            phoneNumber: response['mobile']
                        };

                        this.userSubject.next(user);
                        resolve(user);
                    }
                    else {
                        this.userSubject.next(ANONYMOUS_USER);
                    }
                }, err => {
                    this.userSubject.next(ANONYMOUS_USER);
                    reject
                })
        });
        
    }

    logout() {

        this.userSubject.next(undefined);
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expires_date');
    }
}