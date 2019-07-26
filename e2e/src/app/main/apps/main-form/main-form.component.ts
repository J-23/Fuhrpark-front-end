import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainFormComponent {

  object: any;
  form: FormGroup;
  dialogTitle: string;

  constructor(public matDialogRef: MatDialogRef<MainFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder) {

    this.dialogTitle = _data.dialogTitle;
    
    if (_data.object) {
      this.object = _data.object;
    }
    else {
      this.object = {};
    }

    this.form = this.createForm();
  }

  createForm(): FormGroup {

    if (this.object) {
      return this._formBuilder.group({
        id      : [this.object.id],
        name    : [this.object.name, Validators.required]
      });
    }
    
    return this._formBuilder.group({
      id      : [],
      name    : [null, Validators.required]
    });
  }
}
