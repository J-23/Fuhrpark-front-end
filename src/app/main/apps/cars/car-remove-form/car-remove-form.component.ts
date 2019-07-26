import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-car-remove-form',
  templateUrl: './car-remove-form.component.html',
  styleUrls: ['./car-remove-form.component.scss']
})
export class CarRemoveFormComponent {

  removeForm: FormGroup;
  removeData: any;
  carId: number;

  constructor(public matDialogRef: MatDialogRef<CarRemoveFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) {

    this.removeData = _data.removeData;
    this.carId = _data.carId;

    this.removeForm = this.createForm();
  }

  createForm(): FormGroup {

    return this._formBuilder.group({
      carId: [this.carId],
      isCheck : [false],
      manufacturerIsDelete : [false],
      typIsDelete: [false],
      fuelIsDelete: [false],
      engineOilIsDelete : [false],
      gearOilIsDelete: [false],
      userIsDelete: [false],
    });
  }
}