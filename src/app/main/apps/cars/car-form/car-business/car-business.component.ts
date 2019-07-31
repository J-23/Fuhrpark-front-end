import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { User } from 'app/main/models/user.model';
import { UsersService } from 'app/main/apps/users/users.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSnackBar, MatDialog } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CarService } from '../car.service';
import { MainFormComponent } from 'app/main/apps/main-form/main-form.component';
import { TranslateService } from '@ngx-translate/core';

export const DD_MM_YYYY_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY'
  }
};

@Component({
  selector: 'app-car-business',
  templateUrl: './car-business.component.html',
  styleUrls: ['./car-business.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: DD_MM_YYYY_FORMAT
    }
  ]
})
export class CarBusinessComponent implements OnInit {

  carBusinessForm: FormGroup;
  
  users: User[] = [];
  
  dialogRef: any;

  constructor(private usersService: UsersService,
    private carService: CarService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) { 
  }

  ngOnInit() {
    
    this.getUsers();

    this.carService.carBusinessForm.subscribe(form => {
      this.carBusinessForm = form;
    });
  }

  getUsers() {
    
    this.usersService.getUsers()
      .then(users => {
        this.users = users;
      })
      .catch();
  }

  userCompare(user1: User, user2: User) {
    return user1 && user2 && user1.id == user2.id;
  }

  addNewUser() {
    this.dialogRef = this._matDialog.open(MainFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.USERS.ADD'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((userForm: FormGroup) => {
        if (userForm && userForm.valid) {

          var user = {
            name: userForm.controls['name'].value
          };

          this.usersService.addUser(user)
            .then(() => {
              
              this.getUsers();
              
              this.translateService.get('PAGES.APPS.USERS.ADDSUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
              
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.createSnackBar(res.error);
              }
            });
        }
      });
  }

  createSnackBar(message: string) {
    this._matSnackBar.open(message, 'OK', {
      verticalPosition: 'top',
      duration: 2000
    });
  }
}
