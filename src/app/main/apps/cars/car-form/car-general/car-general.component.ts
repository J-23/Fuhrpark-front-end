import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Typ } from 'app/main/models/typ.model';
import { Manufacturer } from 'app/main/models/manufacturer.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MainFormComponent } from 'app/main/apps/main-form/main-form.component';
import { CarService } from '../car.service';
import { TypsService } from 'app/main/apps/typs/typs.service';
import { ManufacturersService } from 'app/main/apps/manufacturers/manufacturers.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-car-general',
  templateUrl: './car-general.component.html',
  styleUrls: ['./car-general.component.scss']
})
export class CarGeneralComponent implements OnInit {

  @Input() carGeneralForm: FormGroup;

  typs: Typ[] = [];
  manufacturers: Manufacturer[] = [];

  dialogRef: any;
  constructor(private _matDialog: MatDialog,
    private carService: CarService,
    private typsService: TypsService,
    private manufacturersService: ManufacturersService,
    private translateService: TranslateService,
    private _matSnackBar: MatSnackBar) { }

  trueFalseOptions = [ 
    {
      data: true,
      text: "COMMONACTIONS.YES"
    },  
    {
      data: false,
      text: "COMMONACTIONS.NO"
    }
  ];
  
  ngOnInit() {

    this.getTyps();
    this.getManufacturers();
  }

  getTyps() {
    this.typsService.getTyps()
      .then(typs => {
        this.typs = typs;
      })
      .catch();
  }

  getManufacturers() {
    this.manufacturersService.getManufacturers()
      .then(manufacturers => {
        this.manufacturers = manufacturers;
      })
      .catch();
  }

  addNewManufaturer(){
    
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
              this.getManufacturers();
              
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

  addNewTyp() {
    this.dialogRef = this._matDialog.open(MainFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.TYPS.ADD'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((typForm: FormGroup) => {
        if (typForm && typForm.valid) {
          
          var typ = {
            name: typForm.controls['name'].value
          };

          this.typsService.addTyp(typ)
            .then(() => {

              this.getTyps();

              this.translateService.get('PAGES.APPS.TYPS.ADDSUCCESS').subscribe(message => {
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

  typCompare(typ1: Typ, typ2: Typ) {
    return typ1 && typ2 && typ1.id == typ2.id;
  }

  manufacturerCompare(manufacturer1: Manufacturer, manufacturer2: Manufacturer) {
    return manufacturer1 && manufacturer2 && manufacturer1.id == manufacturer2.id;
  }
}
