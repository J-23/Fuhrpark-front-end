import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { CarsService } from './cars.service';
import { Car } from 'app/main/models/car.model';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { ConfirmFormComponent } from '../confirm-form/confirm-form.component';
import { TranslateService } from '@ngx-translate/core';
import { CarRemoveFormComponent } from './car-remove-form/car-remove-form.component';
import { CarService } from './car-form/car.service';
import { FormGroup } from '@angular/forms';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CarsComponent implements OnInit {

  dataSource: FilesDataSource | null;
  displayedColumns = ['registrationNumber', 'typ', 'manufacturer', 'chassisNumber',  'decommissioned', 'buttons'];

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  hoverCar: Car = null;
  private _unsubscribeAll: Subject<any>;

  confirmDialogRef: MatDialogRef<ConfirmFormComponent>;
  carRemoveDialogRef: MatDialogRef<CarRemoveFormComponent>;

  constructor(private carsService: CarsService,
    private carService: CarService,
    private _matDialog: MatDialog,
    private router: Router,
    private translateService: TranslateService,
    private _matSnackBar: MatSnackBar) { 
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    
    this.dataSource = new FilesDataSource(this.carsService, this.paginator, this.sort);
  }

  editCar(carId) {
    this.router.navigate([`/apps/cars/detail/${carId}`]);
  }

  deleteCar(carId) {

    var carRemoveSettings = {
      CarId: carId,
      IsCheck: true
    };

    this.carService.removeCar(carRemoveSettings)
      .then(res => {
        this.carRemoveDialogRef = this._matDialog.open(CarRemoveFormComponent, {
          data: {
            carId: carId,
            removeData: res
          }
        });

        this.carRemoveDialogRef.afterClosed()
          .subscribe((removeForm: FormGroup) => {

            if (removeForm) {
              carRemoveSettings = removeForm.getRawValue();

              this.carService.removeCar(carRemoveSettings)
                .then(() => {
                  this.translateService.get('PAGES.APPS.CARS.REMOVESUCCESS').subscribe(message => {
                    this.createSnackBar(message);
                  });
                  
                  this.carsService.getCars([]);
                  this.dataSource = new FilesDataSource(this.carsService, this.paginator, this.sort);
                })
                .catch(res => {
                  if (res && res.status && res.status == 403) {
                    this.translateService.get('PAGES.APPS.CARS.'+ res.error).subscribe(message => {
                      this.createSnackBar(message);
                    });
                  }
                });
            }
          });
      })
      .catch(res => {
        if (res && res.status && res.status == 403) {
          this.translateService.get('PAGES.APPS.CARS.'+ res.error).subscribe(message => {
            this.createSnackBar(message);
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

  onHovering(car) {
    this.hoverCar = car;
  }

  onUnovering(car) {
    this.hoverCar = null;
  }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    constructor(private carsService: CarsService,
      private _matPaginator: MatPaginator,
      private _matSort: MatSort) {
      super();
      this.filteredData = this.carsService.cars;
    }

    connect(): Observable<any[]> {
      const displayDataChanges = [
        this.carsService.onCarsChanged,
        this._matPaginator.page,
        this._filterChange,
        this._matSort.sortChange
      ];

      return merge(...displayDataChanges)
      .pipe(map(() => {
        let data = this.carsService.cars.slice();
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
          case 'registrationNumber':
            [propertyA, propertyB] = [a.registrationNumber, b.registrationNumber];
            break;
          case 'model':
            [propertyA, propertyB] = [a.model, b.model];
            break;
          case 'color':
            [propertyA, propertyB] = [a.color, b.color];
            break;
          case 'chassisNumber':
            [propertyA, propertyB] = [a.chassisNumber, b.chassisNumber];
            break;
          case 'typ':
            [propertyA, propertyB] = [a.typ.name, b.typ.name];
            break;
          case 'manufacturer':
            [propertyA, propertyB] = [a.manufacturer.name, b.manufacturer.name];
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
