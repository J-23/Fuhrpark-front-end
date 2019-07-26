import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { ManufacturersService } from './manufacturers.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MainFormComponent } from '../main-form/main-form.component';
import { FormGroup } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmFormComponent } from '../confirm-form/confirm-form.component';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ManufacturersComponent implements OnInit {

  dataSource: FilesDataSource | null;
  displayedColumns = ['name', 'createDate', 'updateDate', 'buttons'];

  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
  
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  private _unsubscribeAll: Subject<any>;

  constructor(private manufacturersService: ManufacturersService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private translateService: TranslateService) { 
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.manufacturersService, this.paginator, this.sort);

  }

  addNewManufacturer() {

    this.dialogRef = this._matDialog.open(MainFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.MANUFACTURERS.ADDMANUFACTURER'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((manufacturerForm: FormGroup) => {
        if (manufacturerForm && manufacturerForm.valid) {

          var manufacturer = {
            name: manufacturerForm.controls['name'].value
          };

          this.manufacturersService.addManufacturer(manufacturer)
            .then(() => {
              this.dataSource = new FilesDataSource(this.manufacturersService, this.paginator, this.sort);
              
              this.translateService.get('PAGES.APPS.MANUFACTURERS.ADDSUCCESS').subscribe(message => {
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

  editManufacturer(manufacturer) {
    this.dialogRef = this._matDialog.open(MainFormComponent, {
      panelClass: 'form-dialog',
      data: {
        action: 'new',
        dialogTitle: 'PAGES.APPS.MANUFACTURERS.EDITMANUFATURER',
        object: manufacturer
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((manufacturerForm: FormGroup) => {
        
        if (manufacturerForm && manufacturerForm.valid && manufacturerForm.controls['id'].value) {

          var manufacturer = {
            id: manufacturerForm.controls['id'].value,
            name: manufacturerForm.controls['name'].value
          };

          this.manufacturersService.updateManufacturer(manufacturer)
            .then(() => {
              this.dataSource = new FilesDataSource(this.manufacturersService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.MANUFACTURERS.EDITSUCCESS').subscribe(message => {
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

  deleteManufacturer(manufacturerId) {
    
    this.translateService.get('PAGES.APPS.MANUFACTURERS.REMOVEQUESTION').subscribe(message => {
      this.confirmDialogRef = this._matDialog.open(ConfirmFormComponent, {
        disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = message;

      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.manufacturersService.deleteManufacturer(manufacturerId)
            .then(() => {
              this.dataSource = new FilesDataSource(this.manufacturersService, this.paginator, this.sort);

              this.translateService.get('PAGES.APPS.MANUFACTURERS.REMOVESUCCESS').subscribe(message => {
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

    constructor(private manufacturersService: ManufacturersService,
      private _matPaginator: MatPaginator,
      private _matSort: MatSort) {
      super();
      this.filteredData = this.manufacturersService.manufacturers;
    }

    connect(): Observable<any[]> {
      const displayDataChanges = [
        this.manufacturersService.onManufacturersChanged,
        this._matPaginator.page,
        this._filterChange,
        this._matSort.sortChange
      ];

      return merge(...displayDataChanges)
      .pipe(map(() => {
        let data = this.manufacturersService.manufacturers.slice();
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
