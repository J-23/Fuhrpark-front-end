import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Fuel } from 'app/main/models/fuel.model';
import { EngineOil } from 'app/main/models/engine-oil.model';
import { GearOil } from 'app/main/models/gear-oil.model';
import { MainFormComponent } from 'app/main/apps/main-form/main-form.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FuelsService } from 'app/main/apps/fuels/fuels.service';
import { EngineOilsService } from 'app/main/apps/engine-oils/engine-oils.service';
import { GearOilsService } from 'app/main/apps/gear-oils/gear-oils.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-car-spec',
  templateUrl: './car-spec.component.html',
  styleUrls: ['./car-spec.component.scss']
})
export class CarSpecComponent implements OnInit {

  @Input() carSpecForm: FormGroup;
  
  fuels: Fuel[] = [];
  engineOils: EngineOil[] = [];
  gearOils: GearOil[] = [];

  dialogRef: any;

  constructor(private _matDialog: MatDialog,
    private fuelsService: FuelsService,
    private engineOilsService: EngineOilsService,
    private gearOilsService: GearOilsService,
    private translateService: TranslateService,
    private _matSnackBar: MatSnackBar) { }

  ngOnInit() {
    
    this.getFuels();
    this.getEngineOils();
    this.getGearOils();
  }

  getFuels() {
    this.fuelsService.getFuels()
      .then(fuels => {
        this.fuels = fuels;
      })
      .catch();
  }

  getEngineOils() {
    this.engineOilsService.getEngineOils()
      .then(engineOils => {
        this.engineOils = engineOils;
      })
      .catch();
  }

  getGearOils() {
    this.gearOilsService.getGearOils()
      .then(gearOils => {
        this.gearOils = gearOils;
      })
      .catch();
  }

  addNewFuel() {
    this.dialogRef = this._matDialog.open(MainFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.FUELS.ADD'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((fuelForm: FormGroup) => {
        if (fuelForm && fuelForm.valid) {
          
          var fuel = {
            name: fuelForm.controls['name'].value
          };

          this.fuelsService.addFuel(fuel)
            .then(() => {
              this.getFuels();
              
              this.translateService.get('PAGES.APPS.FUELS.ADDSUCCESS').subscribe(message => {
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

  addNewEngineOil() {
    this.dialogRef = this._matDialog.open(MainFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.ENGINEOILS.ADD'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((engineOilForm: FormGroup) => {
        if (engineOilForm && engineOilForm.valid) {
          
          var engineOil = {
            name: engineOilForm.controls['name'].value
          };

          this.engineOilsService.addEngineOil(engineOil)
            .then(() => {
              this.getEngineOils();
              
              this.translateService.get('PAGES.APPS.ENGINEOILS.ADDSUCCESS').subscribe(message => {
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

  addNewGearOil() {
    this.dialogRef = this._matDialog.open(MainFormComponent, {
      panelClass: 'form-dialog',
      data: {
        dialogTitle: 'PAGES.APPS.GEAROILS.ADD'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((gearOilForm: FormGroup) => {
        
        if (gearOilForm && gearOilForm.valid) {

          var gearOil = {
            name: gearOilForm.controls['name'].value
          };

          this.gearOilsService.addGearOil(gearOil)
            .then(() => {
              this.getGearOils();
              
              this.translateService.get('PAGES.APPS.GEAROILS.ADDSUCCESS').subscribe(message => {
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

  fuelCompare(fuel1: Fuel, fuel2: Fuel) {
    return fuel1 && fuel2 && fuel1.id == fuel2.id;
  }

  engineOilCompare(engineOil1: EngineOil, engineOil2: EngineOil) {
    return engineOil1 && engineOil2 && engineOil1.id == engineOil2.id;
  }

  gearOilCompare(gearOil1: GearOil, gearOil2: GearOil) {
    return gearOil1 && gearOil2 && gearOil1.id == gearOil2.id;
  }
}
