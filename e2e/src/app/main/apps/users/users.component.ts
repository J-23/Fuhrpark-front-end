import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { UsersService } from './users.service';
import { MainFormComponent } from '../main-form/main-form.component';
import { FormGroup } from '@angular/forms';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmFormComponent } from '../confirm-form/confirm-form.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  
  dataSource: FilesDataSource | null;
  displayedColumns = ['name', 'createDate', 'updateDate', 'buttons'];

  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
  
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  private _unsubscribeAll: Subject<any>;

  constructor(private usersService: UsersService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.usersService, this.paginator, this.sort);
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
              this.dataSource = new FilesDataSource(this.usersService, this.paginator, this.sort);
              
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

  editUser(user) {
    this.dialogRef = this._matDialog.open(MainFormComponent, {
      panelClass: 'form-dialog',
      data: {
        action: 'new',
        dialogTitle: 'PAGES.APPS.USERS.EDIT',
        object: user
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((userForm: FormGroup) => {
        
        if (userForm && userForm.valid && userForm.controls['id'].value) {
          var user = {
            name: userForm.controls['name'].value,
            id: userForm.controls['id'].value
          };

          this.usersService.updateUser(user)
            .then(() => {
              this.dataSource = new FilesDataSource(this.usersService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.USERS.EDITSUCCESS').subscribe(message => {
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

  deleteUser(userId) {
    
    this.translateService.get('PAGES.APPS.USERS.REMOVEQUESTION').subscribe(message => {
      this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
        disableClose: false
      });
    
      this.confirmDialogRef.componentInstance.confirmMessage = message;

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.usersService.deleteUser(userId)
            .then(() => {
              this.dataSource = new FilesDataSource(this.usersService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.USERS.REMOVESUCCESS').subscribe(message => {
                this.createSnackBar(message);
              });
            })
            .catch(res => {
              if (res && res.status && res.status == 403) {
                this.createSnackBar(res.error);
              }
            });
        }
        this.confirmDialogRef = null;
      });
    });
  }

  createSnackBar(message: string) {
    this._matSnackBar.open(message, 'OK', {
      verticalPosition: 'top',
      duration: 2000
    });
  }
}

export class FilesDataSource extends DataSource<any> {

  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  constructor(private usersService: UsersService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort) {
    super();
    this.filteredData = this.usersService.users;
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.usersService.onUsersChanged,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange
    ];

    return merge(...displayDataChanges)
    .pipe(map(() => {
      let data = this.usersService.users.slice();
      data = this.filterData(data);
      this.filteredData = [...data];
      data = this.sortData(data);

      const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
      return data.splice(startIndex, this._matPaginator.pageSize);
    }
    ));
  }

  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filterData(data): any {
    return data;
  }

  sortData(data): any[] {
    if (!this._matSort.active || this._matSort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch ( this._matSort.active ) {
        case 'name':
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'createDate':
          [propertyA, propertyB] = [a.createDate, b.createDate];
          break;
        case 'updateDate':
          [propertyA, propertyB] = [a.updateDate, b.updateDate];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect(): void {
  }
}